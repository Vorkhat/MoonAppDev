import { Markup, Scenes } from 'telegraf';
import { BotContext } from '@/types';

export default new Scenes.BaseScene<BotContext>('top-snapshot-create')
    .enter(async ctx => {
        return ctx.reply('Enter snapshot date in format YYYY-MM-DD');
    })
    .hears(/^\d{4}-\d{2}-\d{2}$/, async ctx => {
        await ctx.db.topSnapshot.create({
            data: {
                takenAt: new Date(ctx.message.text),
            },
        });

        return ctx.scene.leave();
    })
    .leave(async ctx => {
        return ctx.reply('Done', Markup.inlineKeyboard([
            Markup.button.callback('View', 'topView'),
        ]));
    });