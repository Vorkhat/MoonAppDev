import { PrismaClient, TaskType } from '@prisma/client';
import { Composer, Markup, Scenes, session, Telegraf } from 'telegraf';
import { BotContext } from '@/types';
import { tasksView } from '@/handlers';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { editTaskView } from '@/handlers/tasksView';
import { renderTrackersView } from '@/handlers/trackersView';
import { TrackerType } from 'tracker/trackerType';

if (!process.env.BOT_TOKEN) {
    throw new Error('Missing BOT_TOKEN environment variable');
}

const completeTaskCreation = async (ctx: BotContext) => {
    await ctx.reply('Done');

    if (!ctx.scene.session.task) {
        return;
    }

    await ctx.db.task.create({
        data: {
            type: ctx.scene.session.task.type!,
            url: ctx.scene.session.task.url!,
            reward: ctx.scene.session.task.reward!,
            tracker: 'id' in ctx.scene.session.task.tracker!
                     ? { connect: { id: ctx.scene.session.task.tracker.id } }
                     : { create: { data: { type: ctx.scene.session.task.tracker!.type } } },
        },
    });

    return await ctx.scene.leave();
};

const taskCreateScene = new Scenes.WizardScene<BotContext>(
    'task-create',
    async ctx => {
        await ctx.reply(
            `Welcome to the task creation wizard\nPlease enter the task type (${Object.keys(TaskType).join(
                ', ')})`);
        return ctx.wizard.next();
    },
    new Composer<BotContext>()
        .on('text', async ctx => {
            if (!(ctx.message.text in TaskType)) {
                return ctx.reply('Invalid task type');
            }

            ctx.scene.session.task = {
                type: TaskType[ctx.message.text as keyof typeof TaskType],
            };

            await ctx.reply('Please enter the task url');

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .on('text', async ctx => {
            if (!ctx.scene.session.task || !URL.canParse(ctx.message.text)) {
                return ctx.reply('Invalid url');
            }

            ctx.scene.session.task.url = ctx.message.text;

            await ctx.reply('Please enter reward');

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .on('text', async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid task');
            }
            try {
                ctx.scene.session.task.reward = parseFloat(ctx.message.text);
            } catch {
                return ctx.reply('Invalid reward');
            }

            await ctx.reply('select task tracker', await renderTrackersView(ctx, 0));

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .action('trackerCreate', async ctx => {
            return ctx.reply('Select tracker type',
                Markup.inlineKeyboard(
                    Object.entries(TrackerType).map(type => Markup.button.callback(type[1], `trackerType/${type[0]}`)),
                ),
            );
        })
        .action(/tracker\/(\d+)/, async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid tracker');
            }
            const trackerId = parseInt(ctx.match[0]);
            ctx.scene.session.task.tracker = await ctx.db.taskTracker.findUniqueOrThrow({ where: { id: trackerId } });

            return completeTaskCreation(ctx);
        })
        .action(/trackerType\/(.+)/, async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid tracker type');
            }

            const type = TrackerType[ctx.match[1] as keyof typeof TrackerType];

            ctx.scene.session.task.tracker = { type };

            return completeTaskCreation(ctx);
        }),
);

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

const stage = new Scenes.Stage<BotContext>([ taskCreateScene ], {
    ttl: 360,
});

const prisma = new PrismaClient();

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

bot.command('start', async ctx => {
    await ctx.reply('hello', Markup.keyboard([
        Markup.button.text('Tasks'),
        Markup.button.text('Forms'),
    ], { columns: 2 }).resize());
});

bot.hears('Tasks', async ctx => {
    const tasksCount = await ctx.db.task.count();
    const taskCompletionsCount = await ctx.db.taskCompletion.count();

    await ctx.reply(`Tasks: ${tasksCount}, completions: ${taskCompletionsCount}`, Markup.keyboard([
        Markup.button.text('Create Task'),
        Markup.button.text('View Tasks'),
        Markup.button.text('Edit Task'),
    ], { columns: 2 }).resize());
});

bot.hears('View Tasks', tasksView);
bot.hears('Create Task', ctx => ctx.scene.enter('task-create'));

bot.on('callback_query', async ctx => {
    if (!('data' in ctx.callbackQuery)) {
        return;
    }

    const query = ctx.callbackQuery as CallbackQuery.DataQuery;

    const match = /^(?<type>\w+)(\/(?<arg>.*))?$/g.exec(query.data);

    if (!match) {
        return;
    }

    const [ , type, , arg ] = match;

    if (type === 'tasksBack') {
        await editTaskView(ctx, Math.max(parseInt(arg) - 15, 0));
    }
    else if (type === 'tasksForward') {
        await editTaskView(ctx, parseInt(arg) + 15);
    }

    await ctx.answerCbQuery();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

await bot.launch();