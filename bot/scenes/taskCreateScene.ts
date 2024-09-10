import { BotContext } from '@/types';
import { TaskType } from '@prisma/client';
import { TrackerType } from 'tracker/trackerType';
import { Composer, Markup, Scenes } from 'telegraf';
import keyboardMenu from '@/utils/keyboardMenu';
import { JsonObject } from '@prisma/client/runtime/library';

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

export default new Scenes.WizardScene<BotContext>(
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

            await ctx.reply('select task tracker');

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .use(keyboardMenu('tracker', (ctx, offset) => ctx.db.taskTracker.findMany({
            take: 10,
            skip: offset > 0 ? offset : undefined,
        }).then(async trackers => [
            trackers.map(tracker => ({
                name: Object.entries(tracker.data as JsonObject).map(e => e.join(': ')).join(', '),
                id: tracker.id.toString(),
            })), await ctx.db.taskTracker.count(),
        ])))
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
            const trackerId = parseInt(ctx.match[1]);
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