import { Markup, Scenes } from 'telegraf';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';
import { BotContext } from '@/types';

type State = { id: number, reward?: number, changed?: boolean };

export default new Scenes.BaseScene<BotContext>('form-reward-editor')
    .enter(async ctx => {
        const { reward } = ctx.scene.state as State;

        return ctx.reply(`Current Reward is ${reward || 'unset'}\nEnter the new value as text or click cancel`,
            Markup.inlineKeyboard([
                Markup.button.callback('Cancel', 'cancel'),
            ]));
    })
    .leave(async ctx => {
        const { id, reward, changed } = ctx.scene.state as State;

        if (!changed) {
            return;
        }

        await ctx.db.form.update({
            where: { id },
            data: { reward },
        });

        return ctx.reply(`Reward change saved`, Markup.inlineKeyboard([
            Markup.button.callback('Continue', `form/${id}`),
        ]));
    })
    .action('cancel', async ctx => {
        await answerCbRemoveKeyboard(ctx);

        return ctx.scene.leave();
    })
    .on('text', async ctx => {
        const value = parseFloat(ctx.message.text);

        if (!value || isNaN(value)) {
            return ctx.reply('Invalid value');
        }

        const state = ctx.scene.state as State;

        state.reward = value;
        state.changed = true;

        return ctx.scene.leave();
    });