import { Composer, Markup, Scenes } from 'telegraf';
import { BotContext } from '@/types.js';
import { formatNumber } from '@/utils/utils.js';

type State = { id: number, isVisible?: boolean };

export default new Scenes.WizardScene<BotContext>('isVisible',
    async ctx => {
        const { isVisible } = ctx.scene.state as State;
        await ctx.reply(`Form is ${isVisible ? 'visible' : 'unvisible'}`, Markup.inlineKeyboard([
            Markup.button.callback('Visible', 'visible'),
            Markup.button.callback('Unvisible', 'unvisible'),
        ]));
        return ctx.wizard.next();
    },

    new Composer<BotContext>()
        .action('visible', async ctx => {
            const { id } = ctx.scene.state as State;

            await ctx.db.form.update({
                where: { id },
                data: { isVisible: true },
            });

            await ctx.reply(`Form visible`);
        })
        .action('unvisible', async ctx => {
            const { id } = ctx.scene.state as State;

            await ctx.db.form.update({
                where: { id },
                data: { isVisible: false },
            });

            await ctx.reply(`Form unvisible`);
        }),
        ctx => ctx.scene.leave()
);

