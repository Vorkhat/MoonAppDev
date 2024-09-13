import { Composer } from 'telegraf';
import { BotContext } from '@/types';
import { prisma } from '@/index';
import { completeCuratedTask, completeTask, findPendingCuratedTask, updateBalance } from '@/db';
import { TrackerType } from '@/trackerType';

const bot = new Composer<BotContext>();

bot.on('chat_member', async ctx => {
    if (ctx.chat.type !== 'channel' || ctx.chatMember.new_chat_member.status !== 'member') {
        return;
    }

    return prisma.$transaction(async tx => {
        const task = await findPendingCuratedTask(tx,
            ctx.from.id,
            TrackerType.JoinChannel,
            {
                data: {
                    path: [ 'channelId' ],
                    equals: ctx.chat.id,
                },
            });

        if (!task) {
            return;
        }

        console.log(`User ${ctx.from.id} completed task ${task.id} by joining channel ${ctx.chat.id}`);

        const { taskId } = await completeCuratedTask(tx, task.id);
        await completeTask(tx, taskId, ctx.from.id);
        await updateBalance(tx, ctx.from.id, task.totalReward);
    }, { isolationLevel: 'Serializable' });
});

export default bot;