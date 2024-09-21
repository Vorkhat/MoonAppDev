import { Markup, Scenes } from 'telegraf';
import { BotContext } from '@/types';
import { snapshot } from 'node:test';
import { prisma } from '@/prisma.js';

export default new Scenes.BaseScene<BotContext>('top-snapshot-create')
    .enter(async ctx => {
        return ctx.reply('Enter snapshot date in format YYYY-MM-DD');
    })
    .hears(/^\d{4}-\d{2}-\d{2}$/, async ctx => {
        await ctx.db.topSnapshot.create({
                                            data: {
                                                takenAt: new Date(ctx.message.text),
                                                reward: 0,
                                            },
                                        });
        await ctx.reply('Send reward for top snapshot');
    })
    .on('text', async ctx => {

        if (!isNaN(Number(ctx.message.text))) {
            const topSnapshotId = await ctx.db.topSnapshot.findFirst({
                                                                         orderBy: {
                                                                             id: 'desc',
                                                                         },
                                                                         select: {
                                                                             id: true,
                                                                         },
                                                                     });
            await ctx.db.topSnapshot.update({
                                                where: { id: topSnapshotId?.id },
                                                data: {
                                                    reward: Number(ctx.message.text),
                                                },
                                            });
            return ctx.scene.leave();
        } else {
            await ctx.reply('Invalid reward');
        }
    })
    .leave(async ctx => {
        return ctx.reply('Done', Markup.inlineKeyboard([
                                                           Markup.button.callback('View', 'topView'),
                                                       ]));
    });