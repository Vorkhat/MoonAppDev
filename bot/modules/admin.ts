import { Composer, Markup, Scenes, session } from 'telegraf';
import { BotContext } from '@/types';
import { formRewardEditor, localizationValueEditor, taskCreateScene, topSnapshotCreateScene, rolesScene } from '@/scenes';
import { Language } from '@prisma/client';
import keyboardMenu, { GetterDel, renderMarkup } from '@/utils/keyboardMenu';
import { JsonObject } from '@prisma/client/runtime/library';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';
import {
    FormElement,
    FormElementCaption,
    FormElementContent,
    FormElementRadio,
    FormElementTextInput,
    FormElementType,
} from '@/utils/formElement';
import { prisma } from '@/index';
import { InlineKeyboardButton } from 'telegraf/src/core/types/typegram';

const bot = new Composer<BotContext>();

bot.settings(ctx => {
    return ctx.telegram.setMyCommands([
        { command: 'start', description: 'Start the bot' },
    ]);
});

const stage = new Scenes.Stage<BotContext>(
    [ taskCreateScene, localizationValueEditor, formRewardEditor, topSnapshotCreateScene, rolesScene ], {
        ttl: 360,
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
    select: {
        id: true,
        url: true,
        tracker: {
            select: {
                data: true,
            },
        },
    },
}).then(async tasks => [
    tasks.map(t => ({
        name: `[${t.id}] ${(t.tracker.data as JsonObject).type} - ${t.url.length > 30 ? t.url.substring(0, 30) + '...'
                                                                                      : t.url}`,
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

const topSnapshotsGetter: GetterDel = (ctx, offset) => ctx.db.topSnapshot.findMany({
    take: 10,
    skip: offset > 0 ? offset : undefined,
}).then(async s => [
    s.map(b => ({
        name: b.takenAt.toLocaleDateString(),
        id: b.id.toString(),
    })),
    await ctx.db.topSnapshot.count(),
]);

bot.use(keyboardMenu('top', topSnapshotsGetter));

bot.command('start', async ctx => {
    return ctx.reply('hello', Markup.keyboard([
        Markup.button.text('Menu'),
    ]).resize(true));
});

bot.hears('Menu', async ctx => {
    return ctx.reply('menu', Markup.inlineKeyboard([
        Markup.button.callback('Tasks', 'taskView'),
        Markup.button.callback('Forms', 'formView'),
        Markup.button.callback('Roles', 'rolesView'),
        Markup.button.callback('Top snapshots', 'topView'),
    ], { columns: 1 }));
});

bot.action('topCreate', async ctx => {
    await answerCbRemoveKeyboard(ctx);

    return ctx.scene.enter(topSnapshotCreateScene.id);
});

bot.action('rolesView', async ctx => {
    await answerCbRemoveKeyboard(ctx);

    return ctx.scene.enter(rolesScene.id);
});

bot.action(/top\/(\d+)/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const top = await ctx.db.topSnapshot.findUniqueOrThrow({
        where: { id: parseInt(ctx.match[1]) },
    });

    return ctx.reply(`Top snapshot\nId: ${top.id}\nDate: ${top.takenAt.toLocaleDateString()}`);
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

    const data = task.data as JsonObject;

    return ctx.reply(`Task\nId: ${task.id}\nType: ${task.type}\nUrl: ${task.url}\nReward: ${task.reward}`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('Delete', `taskDelete/${task.id}`),
                Markup.button.callback('Edit', `taskEdit/${task.id}`),
            ],
            data.description ? [
                Markup.button.callback('Edit Description', `localizationItem/${data.description}`),
            ] : [],
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

    console.log(ctx)
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

const replyElementFields = async (
    ctx: BotContext, entries: [ string, number | undefined ][],
    additionalButtons: InlineKeyboardButton.CallbackButton[] | undefined = undefined,
) => {
    const markup = Markup.inlineKeyboard([
        ...entries.map(entry => Markup.button.callback(`Edit ${entry[0]}`, `localizationItem/${entry[1] ?? 0}`)),
        ...additionalButtons || [],
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

    return ctx.reply(`Form Step Element Fields\n${textEntries.join('\n')}`, markup);
};

const formStepElementView = async (ctx: BotContext, element: FormElement) => {
    switch (element.type) {
        case FormElementType.Caption:
            const caption = element as FormElementCaption;

            return replyElementFields(ctx, [
                [ 'Text', caption.text ],
            ], [
                Markup.button.callback(caption.bold ? 'Unbold' : 'Bold', `formStepElementCaptionBold/${element.id}`),
            ]);
        case FormElementType.TextInput:
            const textInput = element as FormElementTextInput;

            return replyElementFields(ctx, [
                [ 'Label', textInput.label ],
                [ 'Placeholder', textInput.placeholder ],
                [ 'Default Value', textInput.defaultValue ],
            ]);

        case FormElementType.Radio:
            const radio = element as FormElementRadio;

            return replyElementFields(ctx,
                radio.options?.map(option => [ option.name, option.value ]) || [],
                [
                    Markup.button.callback('Add Option', `formStepElementRadioAddOption/${element.id}`),
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
        case FormElementType.Radio:
            return {
                options: [],
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

bot.action(/formStepElementRadioAddOption\/(.+)$/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const id = ctx.match[1];
    const element = ctx.session.selectedFormStep!.elements.find(b => b.id === id)!;

    const optionIndex = (element as FormElementRadio).options!.length + 1;

    (element as FormElementRadio).options!.push({
        name: `option${optionIndex}`,
        value: Number((await ctx.db.localizationItem.create({
            data: {
                values: {
                    createMany: {
                        data: [
                            {
                                language: Language.En,
                                value: `Option ${optionIndex}`,
                            },
                            {
                                language: Language.Ru,
                                value: `Опция ${optionIndex}`,
                            },
                        ],
                    },
                },
            },
            select: { id: true },
        })).id),
    });

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

bot.action(/formStepElementCaptionBold\/(.+)$/, async ctx => {
    await answerCbRemoveKeyboard(ctx);

    const id = ctx.match[1];
    const element = ctx.session.selectedFormStep!.elements.find(b => b.id === id)!;

    (element as FormElementCaption).bold = (element as FormElementCaption).bold ? undefined : true;

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

export default bot.middleware();