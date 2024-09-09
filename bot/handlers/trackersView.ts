import { BotContext } from '@/types';
import { JsonObject } from '@prisma/client/runtime/library';
import { Markup } from 'telegraf';

export async function renderTrackersView(ctx: BotContext, offset: number) {
    const trackers = await ctx.db.taskTracker.findMany({
        take: 10,
        skip: offset > 0 ? offset : undefined,
    });

    return Markup.inlineKeyboard([
        [ Markup.button.callback('Create', 'trackerCreate') ],
        ...trackers.map(tracker => [
            Markup.button.callback(
                Object.entries(tracker.data as JsonObject).map(e => e.join(': ')).join(', '), `tracker/${tracker.id}`),
        ]),
        [
            Markup.button.callback('<-', `trackersBack/${trackers.length}`),
            Markup.button.callback(`${Math.floor(offset / 10) + 1}/${Math.ceil(await ctx.db.taskTracker.count() / 10)}`,
                'trackersView'),
            Markup.button.callback('->', `trackersForward/${trackers.length}`),
        ],
    ]);
}