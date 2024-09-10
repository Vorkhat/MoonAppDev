import { PrismaClient } from '@prisma/client';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
import { BotContext } from '@/types';
import { taskCreateScene } from '@/scenes';
import keyboardMenu, { GetterDel } from '@/utils/keyboardMenu';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';

if (!process.env.BOT_TOKEN) {
    throw new Error('Missing BOT_TOKEN environment variable');
}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

bot.settings(ctx => {
    return ctx.telegram.setMyCommands([
        { command: 'start', description: 'Start the bot' },
    ]);
});

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

bot.command('start', async ctx => {
    await ctx.reply('hello', Markup.inlineKeyboard([
        Markup.button.callback('Tasks', 'taskView'),
        Markup.button.callback('Forms', 'formView'),
    ], { columns: 1 }));
});

bot.action('taskCreate', ctx => ctx.scene.enter('task-create'));
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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

await bot.launch();