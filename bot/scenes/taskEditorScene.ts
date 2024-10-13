import { Composer, Markup, Scenes } from 'telegraf';
import { BotContext } from '@/types.js';
import { formatNumber } from '@/utils/utils.js';
import { TasksIcon } from '@/scenes/taskCreateScene.js';
import { TaskType } from '@prisma/client';

type State = { taskId: number }

export default new Scenes.WizardScene<BotContext>('taskEditorScene',
    async ctx => {

        const { taskId } = ctx.scene.state as State;

        await ctx.reply('Choose to command', Markup.inlineKeyboard([
            Markup.button.callback('Edit icon', `taskIcon`),
            Markup.button.callback('Edit type', `taskType`),
            Markup.button.callback('Edit url', `taskUrl`),
        ]));
        return ctx.wizard.next();
    },

    new Composer<BotContext>()
        .action('taskIcon', async ctx => {
            await ctx.reply(`Choose task icon`, Markup.inlineKeyboard(
                Object.keys(TasksIcon).map(b => Markup.button.callback(b.toLowerCase(), `taskIconType/${b}`)),
                { columns: 2 }));
            return ctx.wizard.next()
        })
        .action('taskType', async ctx => {
            await ctx.reply(`Choose task type`, Markup.inlineKeyboard(Object.values(TaskType).map(t => Markup.button.callback(t, `taskType/${t}`)),
                { columns: 2 }));
            return ctx.wizard.next()
        })
        .action('taskUrl', async ctx => {
            await ctx.reply('Send task url');
            return ctx.wizard.next()
        }),


    new Composer<BotContext>()
        .action(/taskIconType\/(\w+)/, async ctx => {
            const { taskId } = ctx.scene.state as State;

            const task = await ctx.db.task.findUnique({
                where: {
                    id: taskId,
                },
                select: {
                    data: true,
                },
            });

            if (task && typeof task.data === 'object' && task.data !== null) {
                await ctx.db.task.update({
                    where: {
                        id: taskId,
                    },
                    data: {
                        data: {
                            ...task.data,
                            iconType: ctx.match[1] as TasksIcon,
                        },
                    },
                });
            }
            else {
                console.error("Data is not an object or is null.");
            }

            await ctx.reply(`Complete change task icon`);
        })
        .action(/taskType\/(\w+)/, async ctx => {
            const { taskId } = ctx.scene.state as State;

            await ctx.db.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    type: ctx.match[1] as TaskType,
                },
            });

            await ctx.reply(`Complete change task icon`);
        })

        .on('text', async ctx => {
            const { taskId } = ctx.scene.state as State;

            if (ctx.message.text.toLowerCase() === 'menu') {
                await ctx.reply(`Done`);
                return ctx.scene.leave()
            } else if (!URL.canParse(ctx.message.text)) {
                return ctx.reply('Invalid url');
            }

            await ctx.db.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    url: ctx.message.text,
                },
            });

            await ctx.reply(`Complete change task url`);
        }),
);

