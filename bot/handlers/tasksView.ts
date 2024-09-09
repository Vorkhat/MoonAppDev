import { BotContext } from '@/types';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export default async function (ctx: BotContext) {
    await ctx.reply(...(await renderTaskView(ctx, 0)));
}

export async function editTaskView(ctx: BotContext, offset: number) {
    await ctx.editMessageText(...(await renderTaskView(ctx, offset)));
}

export async function renderTaskView(
    ctx: BotContext, offset: number): Promise<[ string, { reply_markup?: InlineKeyboardMarkup } ]> {
    const count = await ctx.db.task.count();
    const tasks = await ctx.db.task.findMany({
        take: 15,
        skip: offset > 0 ? offset : undefined,
    });

    return [
        tasks.map(t =>
            `[${t.id}] ${t.type} - ${t.url.length > 30 ? t.url.substring(0, 30) + '...' : t.url}`)
             .join('\n'),
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '<-', callback_data: `tasksBack/${tasks.length}` },
                        { text: `${Math.floor(offset / 15) + 1}/${Math.ceil(count / 15)}`, callback_data: 'tasksView' },
                        { text: '->', callback_data: `tasksForward/${tasks.length}` },
                    ],
                ],
            },
        },
    ];
}