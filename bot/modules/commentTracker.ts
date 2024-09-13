import { Composer } from 'telegraf';
import { message } from 'telegraf/filters';
import { BotContext } from '@/types';
import { prisma } from '@/index';
import { completeCuratedTask, completeTask, findPendingCuratedTask, updateBalance } from '@/db';
import { TrackerType } from '@/trackerType';

const bot = new Composer<BotContext>();

bot.on(message('reply_to_message'), async ctx => {
    // ignore non-discussion chats
    if (ctx.message.chat.type !== 'supergroup') {
        return;
    }

    // ignore any replies to a non-automatic forwarded message
    if (!('is_automatic_forward' in ctx.message.reply_to_message) || !ctx.message.reply_to_message.is_automatic_forward) {
        return;
    }

    // ignore any replies to a non-channel forwarded message
    if (!('forward_origin' in ctx.message.reply_to_message) || ctx.message.reply_to_message.forward_origin?.type !== 'channel') {
        return;
    }

    return prisma.$transaction(async tx => {
        const task = await findPendingCuratedTask(tx,
            ctx.from.id,
            TrackerType.Comment,
            {
                data: {
                    path: [ 'chatId' ],
                    equals: ctx.chat.id,
                },
            });

        if (!task) {
            return;
        }

        console.log(`User ${ctx.from.id} completed task ${task.id} by commenting on ${ctx.chat.id}`);

        const { taskId } = await completeCuratedTask(tx, task.id);
        await completeTask(tx, taskId, ctx.from.id);
        await updateBalance(tx, ctx.from.id, task.totalReward);
    }, { isolationLevel: 'Serializable' });
});

export default bot;