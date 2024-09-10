import { BotContext } from '@/types';

export default async function (ctx: BotContext) {
    await ctx.answerCbQuery();
    return ctx.editMessageReplyMarkup(undefined);
}