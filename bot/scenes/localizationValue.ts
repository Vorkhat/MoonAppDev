import { Markup, Scenes } from 'telegraf';
import { BotContext } from '@/types';
import { LocalizationValue } from '@prisma/client';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';

type StateType = { value: LocalizationValue, changed?: boolean };

export default new Scenes.BaseScene<BotContext>('localization-value-editor')
    .enter(async ctx => {
        const state = ctx.scene.state as StateType;

        return ctx.reply(
            `Current Value for ${state.value.language} is \`${state.value.value}\`\nEnter new value as text or click cancel`,
            Markup.inlineKeyboard([
                Markup.button.callback('Cancel', 'cancel'),
            ]));
    })
    .leave(async ctx => {
        const state = ctx.scene.state as StateType;

        if (!state.changed) {
            return ctx.reply('No changes made');
        }

        await ctx.db.localizationValue.update({
            where: {
                id_language: {
                    id: state.value.id,
                    language: state.value.language,
                },
            },
            data: { value: state.value.value },
        });

        return ctx.reply('Saved');
    })
    .action('cancel', async ctx => {
        await answerCbRemoveKeyboard(ctx);

        return ctx.scene.leave();
    })
    .on('text', async ctx => {
        const state = ctx.scene.state as StateType;

        state.value.value = ctx.message.text;
        state.changed = true;

        return ctx.scene.leave();
    });