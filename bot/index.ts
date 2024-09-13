import { Telegraf } from 'telegraf';
import { BotContext } from '@/types';
import { admin, commentTracker, joinChannelTracker } from '@/modules';
import { PrismaClient } from '@prisma/client';

if (!process.env.BOT_TOKEN) {
    throw new Error('Missing BOT_TOKEN environment variable');
}

export const prisma = new PrismaClient();

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
    ctx.db = prisma;
    return await next();
});

bot.use(joinChannelTracker);
bot.use(commentTracker);
bot.use(admin);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

await bot.launch({
    allowedUpdates: [ 'chat_member', 'message', 'callback_query' ],
});