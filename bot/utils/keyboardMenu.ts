import { BotContext } from '@/types';
import { Composer, Markup, Middleware } from 'telegraf';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';

export type GetterDel = (ctx: BotContext, offset: number) => Promise<[ { name: string, id: string }[], number ]>

export default function (type: string, getter: GetterDel): Middleware<BotContext> {
    return new Composer<BotContext>()
        .action(`${type}View`, async ctx => {
            await answerCbRemoveKeyboard(ctx);
            return ctx.reply(`${type}s`, {
                reply_markup: await renderMarkup(ctx, type, getter, 0),
            });
        })
        .action(new RegExp(String.raw`${type}Back\/(\d+)`, 'g'), async ctx => {
            const offset = parseInt(ctx.match[1]);

            await ctx.answerCbQuery();

            return ctx.editMessageReplyMarkup(await renderMarkup(ctx, type, getter, Math.max(offset - 10, 0)));
        })
        .action(new RegExp(String.raw`${type}Forward\/(\d+)`, 'g'), async ctx => {
            const offset = parseInt(ctx.match[1]);

            await ctx.answerCbQuery();

            return ctx.editMessageReplyMarkup(await renderMarkup(ctx, type, getter, offset + 10));
        })
        .middleware();
}

export async function renderMarkup(ctx: BotContext, type: string, getter: GetterDel, offset: number) {
    const [ items, total ] = await getter(ctx, offset);

    return Markup.inlineKeyboard([
        [ Markup.button.callback('Create', `${type}Create`) ],
        ...items.map(({ name, id }) => [
            Markup.button.callback(name, `${type}/${id}`),
        ]),
        [
            Markup.button.callback('<-', `${type}Back/${items.length + offset}`, offset <= 0),
            Markup.button.callback(`${Math.floor(offset / 10) + 1}/${Math.ceil(total / 10)}`,
                `${type}View`),
            Markup.button.callback('->', `${type}Forward/${items.length + offset}`, offset >= total - 10),
        ],
    ]).reply_markup;
}