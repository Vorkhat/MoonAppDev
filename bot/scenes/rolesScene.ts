import { Composer, Markup, Scenes } from 'telegraf';
import { BotContext } from '@/types.js';
import { User } from '@prisma/client';

type State = { step: number };

export default new Scenes.WizardScene<BotContext>('rolesScene',
    async ctx => {
        await ctx.reply('Choose to command', Markup.inlineKeyboard([
            Markup.button.callback('View', 'view'),
            Markup.button.callback('Change', 'change'),
        ]));
        return ctx.wizard.next();
    },

    new Composer<BotContext>()
        .action('view', async ctx => {
            await ctx.reply(`Send user id`);
            ctx.wizard.selectStep(2);
        })
        .action('change', async ctx => {
            await ctx.reply(`Send user id and status (1 - admin, 0 - user)`);
            ctx.wizard.selectStep(3);
        }),

    new Composer<BotContext>()
        .on('text', async ctx => {
            const message = ctx.message.text;

            if (message == 'Menu') {
                await ctx.reply("Done")
                return ctx.scene.leave()
            }

            if (!isNaN(Number(message))) {
                const user = await ctx.db.user.findUnique({ where: { id: BigInt(ctx.message.text) } });

                if (!user) {
                    await ctx.reply('User not found');
                }
                else {
                    await ctx.reply(`User roles: ${user.privileged ? 'admin' : 'user'}`);
                }
                return ctx.scene.leave();
            } else {
                await ctx.reply('Invalid user id');
            }
        }),

    new Composer<BotContext>()
        .on('text', async ctx => {
            const message = ctx.message.text;

            const data = message.split(' ');

            if (message == 'Menu') {
                await ctx.reply("Done")
                return ctx.scene.leave()
            }

            if (data.every(data => !isNaN(Number(data)))) {
                const [userId, privileged] = message.split(' ').map(part => Number(part));
                const isPrivileged = privileged === 1;

                const user = await ctx.db.user.update(
                    {
                        where: { id: userId },
                        data: { privileged: isPrivileged },
                    }
                );

                if (!user) {
                    await ctx.reply('User not found');
                }
                else {
                    await ctx.reply(`User roles changed: ${privileged ? 'admin' : 'user'}`);
                }
                return ctx.scene.leave();
            } else {
                await ctx.reply('Invalid command');
            }
        }),
);

