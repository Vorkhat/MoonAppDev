import { Language, PrismaClient } from '@prisma/client';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
import { BotContext } from '@/types';
import { formRewardEditor, localizationValueEditor, taskCreateScene } from '@/scenes';
import keyboardMenu, { GetterDel, renderMarkup } from '@/utils/keyboardMenu';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';
import { TrackerClient } from '@proto/tracker';
import { ChannelCredentials } from '@grpc/grpc-js';
import {
    FormElement,
    FormElementCaption,
    FormElementContent,
    FormElementTextInput,
    FormElementType,
} from 'frontend/src/utils/formElement';

if (!process.env.BOT_TOKEN) {
    throw new Error('Missing BOT_TOKEN environment variable');
}

if (!process.env.GATEWAY_ADDRESS) {
    throw new Error('Missing GATEWAY_ADDRESS environment variable');
}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

bot.settings(ctx => {
    return ctx.telegram.setMyCommands([
        { command: 'start', description: 'Start the bot' },
    ]);
});

const stage = new Scenes.Stage<BotContext>([ taskCreateScene, localizationValueEditor, formRewardEditor ], {
    ttl: 360,
});

const prisma = new PrismaClient();
const trackerService = new TrackerClient(process.env.GATEWAY_ADDRESS, ChannelCredentials.createInsecure());

bot.use(async (ctx, next) => {
    ctx.tracker = trackerService;
    return await next();
});

bot.use(async (ctx, next) => {
    return prisma.$transaction(async tx => {
        ctx.db = tx;
        return await next();
    });
});

bot.use(async (ctx, next) => {
    if (ctx.message) {
        const user = await ctx.db.user.findUnique({
            where: { id: ctx.message.from.id },
            select: { privileged: true },
        });

        if (!user || !user.privileged) {
            return;
        }
    }

    return await next();
});

bot.use(session());
bot.use(stage.middleware());

const tasksGetter: GetterDel = (ctx, offset) => ctx.db.task.findMany({
    take: 10,
    skip: offset > 0 ? offset : undefined,
}).then(async tasks => [
    tasks.map(t => ({
        name: `[${t.id}] ${t.type} - ${t.url.length > 30 ? t.url.substring(0, 30) + '...' : t.url}`,
        id: t.id.toString(),
    })), await ctx.db.task.count(),
]);

bot.use(keyboardMenu('task', tasksGetter));

const formsGetter: GetterDel = (ctx, offset) => ctx.db.form.findMany({
    take: 10,
    skip: offset > 0 ? offset : undefined,
    select: {
        id: true,
        title: {
            select: {
                values: {
                    select: {
                        language: true,
                        value: true,
                    },
                },
            },
        },
    },
}).then(async forms => [
    forms.map(form => ({
        name: form.title.values.find(b => b.language === Language.En)?.value ?? 'noname',
        id: form.id.toString(),
    })),
    await ctx.db.form.count(),
]);

bot.use(keyboardMenu('form', formsGetter));

const formStepsGetter: (formId: bigint | number) => GetterDel = (formId) =>
    (ctx) =>
        ctx.db.form.findUniqueOrThrow({
            where: { id: formId },
            include: {
                steps: true,
            },
        }).then(async form => [
            form.steps.map((step, i) => ({
                name: `Step ${i + 1}`,
                id: step.id.toString(),
            })), await ctx.db.formStep.count({ where: { formId } }),
        ]);

const formStepElementsGetter: GetterDel = async (ctx) => {
    const elements = ctx.session.selectedFormStep!.elements;
    return [
        elements.map(el => ({
            name: `${el.id} (${el.type})`,
            id: el.id,
        })), elements.length,
    ];
};

bot.command('start', async ctx => {
    return ctx.reply('hello', Markup.keyboard([
        Markup.button.text('Menu'),
    ]).resize(true));
});

bot.hears('Menu', async ctx => {
    return ctx.reply('menu', Markup.inlineKeyboard([
        Markup.button.callback('Tasks', 'taskView'),
        Markup.button.callback('Forms', 'formView'),
    ], { columns: 1 }));
});

bot.action('taskCreate', async ctx => {
    await answerCbRemoveKeyboard(ctx);

    return ctx.scene.enter(taskCreateScene.id);
});

bot.action(/task\/(\d+)/, async ctx => {
    const task = await ctx.db.task.findUnique({
        where: { id: parseInt(ctx.match[1]) },
    });

    await answerCbRemoveKeyboard(ctx);

    if (!task) {
        return ctx.reply('Invalid task');
    }

    return ctx.reply(`Task\nId: ${task.id}\nType: ${task.type}\nUrl: ${task.url}\nReward: ${task.reward}`,
        Markup.inlineKeyboard([
            Markup.button.callback('Delete', `taskDelete/${task.id}`),
            Markup.button.callback('Edit', `taskEdit/${task.id}`),
        ]));
});

bot.action(/taskDelete\/(\d+)/, async ctx => {
    await ctx.db.task.delete({ where: { id: parseInt(ctx.match[1]) } });

    return answerCbRemoveKeyboard(ctx);
});

bot.action(/form\/(\d+)/, async ctx => {
    const form = await ctx.db.form.findUnique({
        where: { id: parseInt(ctx.match[1]) },
        select: {
            id: true,
            reward: true,
            title: {
                select: {
                    id: true,
                    values: {
                        select: {
                            language: true,
                            value: true,
                        },
                    },
                },
            },
        },
    });

    await answerCbRemoveKeyboard(ctx);

    if (!form) {
        return ctx.reply('Invalid form');
    }

    return ctx.reply(
        `Form\nId: ${form.id}\nTitle: ${form.title.values.find(
            b => b.language === Language.En)?.value ?? 'noname'}\nReward: ${form.reward}`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('Create Step', `formStepCreate/${form.id}`),
            ],
            ...(await renderMarkup(ctx, 'formStep', formStepsGetter(form.id), 0,
                { addCreateButton: false })).inline_keyboard,
            [
                Markup.button.callback('Edit Title', `localizationItem/${form.title.id}`),
                Markup.button.callback('Edit Reward', `formRewardEditor/${form.id}`),
            ],
            [
                Markup.button.callback('Delete', `formDelete/${form.id}`),
                Markup.button.callback('Back', 'formView'),
            ],
        ]));
});

bot.action(/formStepCreate\/(\d+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const formId = parseInt(ctx.match[1]);

    const { id } = await ctx.db.formStep.create({
        data: {
            form: {
                connect: { id: formId },
            },
            order: await ctx.db.formStep.count({ where: { formId: formId } }),
        },
        select: {
            id: true,
        },
    });

    if (await ctx.db.formStep.count({ where: { formId: formId } }) === 1) {
        await ctx.db.form.update({
            where: { id: formId },
            data: {
                defaultStep: { connect: { id } },
            },
        });
    }

    return ctx.reply(`Created step with id ${id}`, Markup.inlineKeyboard([
        Markup.button.callback('View', `formStep/${id}`),
    ]));
});

bot.action(/formRewardEditor\/(\d+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const { id, reward } = await ctx.db.form.findUniqueOrThrow({
        where: { id: parseInt(ctx.match[1]) },
        select: { id: true, reward: true },
    });

    return ctx.scene.enter(formRewardEditor.id, { id, reward });
});

bot.action(/formDelete\/(\d+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    return ctx.db.form.delete({ where: { id: parseInt(ctx.match[1]) } });
});

bot.action(/localizationItem\/(\d+)\/?(.+)?$/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const item = await ctx.db.localizationItem.findUniqueOrThrow({
        where: { id: parseInt(ctx.match[1]) },
        include: {
            values: true,
        },
    });

    return ctx.reply(`Localization Item ${item.id}\n${item.values.map(b => `${b.language}: ${b.value}`)
                                                          .join('\n')}`,
        Markup.inlineKeyboard([
            ...item.values.map(
                b => Markup.button.callback(`Edit ${b.language}`, `localizationValueEditor/${b.id}/${b.language}`)),
            Markup.button.callback('Delete', `localizationItemDelete/${item.id}`),
        ]),
    );
});

bot.action(/localizationValueEditor\/(\d+)\/(\w+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const value = await ctx.db.localizationValue.findUniqueOrThrow({
        where: {
            id_language: {
                id: parseInt(ctx.match[1]),
                language: ctx.match[2] as Language,
            },
        },
    });

    return ctx.scene.enter(localizationValueEditor.id, { value });
});

bot.action(/formStep\/(\d+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const formStep = await ctx.db.formStep.findUniqueOrThrow({
        where: { id: parseInt(ctx.match[1]) },
    });

    ctx.session.selectedFormStep = {
        formStep: formStep,
        elements: (formStep.content as FormElement[] | undefined) ?? [],
    };

    return ctx.reply(`Form Step\nId: ${formStep.id}`, {
        reply_markup: {
            inline_keyboard: [
                ...(await renderMarkup(ctx, 'formStepElement', formStepElementsGetter, 0)).inline_keyboard,
                [
                    Markup.button.callback('Back', `form/${formStep.formId}`),
                ],
            ],
        },
    });
});

bot.action('formStepElementCreate', async ctx => {
    await answerCbRemoveKeyboard(ctx);

    return ctx.reply('Choose element type', Markup.inlineKeyboard(Object.values(FormElementType).map(
        value => Markup.button.callback(value, `formStepElementCreate/${value}`))));
});

const replyElementFields = async (ctx: BotContext, entries: [ string, number | undefined ][]) => {
    const markup = Markup.inlineKeyboard([
        ...entries.map(entry => Markup.button.callback(`Edit ${entry[0]}`, `localizationItem/${entry[1] ?? 0}`)),
        Markup.button.callback('Back', `formStep/${ctx.session.selectedFormStep!.formStep.id}`),
    ], { columns: 1 });

    const textEntries = await Promise.all(
        entries.map(async entry => `${entry[0]}: ${(entry[1] ? (await ctx.db.localizationValue.findUnique({
            where: {
                id_language: {
                    id: entry[1],
                    language: Language.En,
                },
            },
            select: { value: true },
        }))?.value : undefined) || 'unset'}`));

    return ctx.reply(textEntries.join('\n'), markup);
};

const formStepElementView = async (ctx: BotContext, element: FormElement) => {
    switch (element.type) {
        case FormElementType.Caption:
            const caption = element as FormElementCaption;

            return replyElementFields(ctx, [
                [ 'Text', caption.text ],
            ]);
        case FormElementType.TextInput:
            const textInput = element as FormElementTextInput;

            return replyElementFields(ctx, [
                [ 'Label', textInput.label ],
                [ 'Placeholder', textInput.placeholder ],
                [ 'Default Value', textInput.defaultValue ],
            ]);
    }
};

const createElementFields = async (ctx: BotContext, type: FormElementType): Promise<FormElementContent> => {

    const create = async () => Number((await ctx.db.localizationItem.create({
        data: {
            values: {
                createMany: {
                    data: [
                        {
                            language: Language.En,
                        },
                        {
                            language: Language.Ru,
                        },
                    ],
                },
            },
        },
    })).id);

    switch (type) {
        case FormElementType.Caption:
            return {
                text: await create(),
            };
        case FormElementType.TextInput:
            return {
                label: await create(),
                placeholder: await create(),
                defaultValue: await create(),
            };
    }
};

bot.action(/formStepElementCreate\/(\w+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const element = {
        type: ctx.match[1] as FormElementType,
        id: `step${ctx.session.selectedFormStep!.elements.length + 1}`,
        ...await createElementFields(ctx, ctx.match[1] as FormElementType),
    };

    ctx.session.selectedFormStep!.elements.push(element);

    await ctx.db.formStep.update({
        where: {
            id: ctx.session.selectedFormStep!.formStep.id,
        },
        data: {
            content: ctx.session.selectedFormStep!.elements,
        },
    });

    return formStepElementView(ctx, element);
});

bot.action(/formStepElement\/(.+)$/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const id = ctx.match[1];

    return formStepElementView(ctx, ctx.session.selectedFormStep!.elements.find(b => b.id === id)!);
});

bot.action('formCreate', async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const { id } = await ctx.db.form.create({
        data: {
            title: {
                create: {
                    values: {
                        createMany: {
                            data: [
                                {
                                    language: Language.En,
                                    value: 'New Form',
                                },
                                {
                                    language: Language.Ru,
                                    value: 'Новая Форма',
                                },
                            ],
                        },
                    },
                },
            },
        },
        select: { id: true },
    });

    return ctx.reply(`Created form with id ${id}`, Markup.inlineKeyboard([
        Markup.button.callback('View', `form/${id}`),
    ]));
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

await bot.launch();