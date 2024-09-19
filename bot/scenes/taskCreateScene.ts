import { BotContext } from '@/types';
import { Language, TaskType } from '@prisma/client';
import { TrackerType } from '@/trackerType';
import { Composer, Markup, Scenes } from 'telegraf';
import keyboardMenu, { GetterDel, renderMarkup } from '@/utils/keyboardMenu';
import { JsonObject } from '@prisma/client/runtime/library';
import answerCbRemoveKeyboard from '@/utils/answerCbRemoveKeyboard';
import { MessageQueue, publishMessage } from '@/mq.js';

export enum TasksIcon {
    FRIENDS = `friends.svg`,
    PARTNERS = `partners.svg`,
    REPOST = `repost.svg`,
    PHONE = `$phone.svg`,
    WEB = `$web.svg`,
    INSTAGRAM = `instagram.svg`,
    DOWNLAND = `download.svg`
}

const completeTaskCreation = async (ctx: BotContext) => {
    await ctx.reply('Done');

    if (!ctx.scene.session.task) {
        return;
    }

    const description = await ctx.db.localizationItem.create({
        data: {
            values: {
                createMany: {
                    data: [
                        {
                            language: Language.En,
                            value: `${ctx.scene.session.task.type} Task`,
                        },
                        {
                            language: Language.Ru,
                            value: `${ctx.scene.session.task.type} Задание`,
                        },
                    ],
                },
            },
        },
    });

    const { id } = await ctx.db.task.create({
        data: {
            type: ctx.scene.session.task.type!,
            url: ctx.scene.session.task.url!,
            reward: ctx.scene.session.task.reward!,
            data: {
                description: description.id as unknown as number,
                ...ctx.scene.session.task.data,
            },
            tracker: 'id' in ctx.scene.session.task.tracker!
                     ? { connect: { id: ctx.scene.session.task.tracker.id as number } }
                     : { create: { data: ctx.scene.session.task.tracker } },
        },
        select: {
            id: true,
        },
    });

    await publishMessage<{ taskId: number }>(MessageQueue.NewTask, { taskId: Number(id) });

    return await ctx.scene.leave();
};

const replyTrackerDetails = async (ctx: BotContext, type: TrackerType): Promise<boolean> => {
    const trackersGetter: GetterDel = async (ctx, offset) => [
        (await ctx.db.taskTracker.findMany({
            skip: offset > 0 ? offset : undefined,
            take: 10,
            where: {
                data: {
                    path: [ 'type' ],
                    equals: type,
                },
            },
        })).map(tracker => ({
            id: (tracker.data as JsonObject).metaId!.toString(),
            name: (tracker.data as JsonObject).metaName as string,
        })),
        await ctx.db.taskTracker.count({ where: { data: { path: [ 'type' ], equals: type } } }),
    ];

    switch (type) {
        case TrackerType.JoinChannel:
            await ctx.reply('available channels', {
                reply_markup: await renderMarkup(ctx, 'trackedChannel', trackersGetter, 0),
            });

            return true;

        case TrackerType.Comment:
            await ctx.reply('available channels with comments', {
                reply_markup: await renderMarkup(ctx, 'trackedChannelComments', trackersGetter, 0),
            });

            return true;

        case TrackerType.External:
        case TrackerType.PublishStory:
            return false;

        case TrackerType.Invite:
            await ctx.reply('choose trigger type', Markup.inlineKeyboard([
                Markup.button.callback('For Each', 'trackerRepeatable'),
                Markup.button.callback('Specific', 'trackerInviteSpecific'),
            ]));

            return true;
    }
};

export default new Scenes.WizardScene<BotContext>(
    'task-create',
    async ctx => {
        await ctx.reply(
            `Welcome to the task creation wizard\nPlease select the task type`,
            Markup.inlineKeyboard(Object.values(TaskType).map(t => Markup.button.callback(t, `taskType/${t}`)),
                { columns: 2 }));
        return ctx.wizard.next();
    },
    new Composer<BotContext>()
        .action(/taskType\/(\w+)/, async ctx => {
            await answerCbRemoveKeyboard(ctx);

            ctx.scene.session.task = {
                type: TaskType[ctx.match[1] as keyof typeof TaskType],
            };

            await ctx.reply('Please enter the task url');

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .on('text', async ctx => {
            if (!ctx.scene.session.task || !URL.canParse(ctx.message.text)) {
                return ctx.reply('Invalid url');
            }

            ctx.scene.session.task.url = ctx.message.text;

            await ctx.reply('Please select icon', Markup.inlineKeyboard(
                Object.keys(TasksIcon).map(b => Markup.button.callback(b.toLowerCase(), `taskIconType/${b}`)),
                { columns: 1 }));

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .action(/taskIconType\/(\w+)/, async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid task');
            }

            await answerCbRemoveKeyboard(ctx);

            ctx.scene.session.task.data = {
                iconType: ctx.match[1],
            };

            await ctx.reply('Please enter reward');

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .on('text', async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid task');
            }
            try {
                ctx.scene.session.task.reward = parseFloat(ctx.message.text);
            } catch {
                return ctx.reply('Invalid reward');
            }

            await ctx.reply('select task tracker', Markup.inlineKeyboard([
                Markup.button.callback('Select', 'trackerView'),
            ]));

            return ctx.wizard.next();
        }),
    new Composer<BotContext>()
        .use(keyboardMenu('tracker', (ctx, offset) => ctx.db.taskTracker.findMany({
            take: 10,
            skip: offset > 0 ? offset : undefined,
        }).then(async trackers => [
            trackers.map(tracker => ({
                name: Object.entries(tracker.data as JsonObject)
                            .filter(e => !e[0].startsWith('meta'))
                            .map(e => e.join(': ')).join(', '),
                id: tracker.id.toString(),
            })), await ctx.db.taskTracker.count(),
        ])))
        .action('trackerCreate', async ctx => {
            await answerCbRemoveKeyboard(ctx);

            return ctx.reply('Select tracker type',
                Markup.inlineKeyboard(
                    Object.entries(TrackerType).map(type => Markup.button.callback(type[1], `trackerType/${type[0]}`)),
                ),
            );
        })
        .action(/tracker\/(\d+)/, async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid tracker');
            }

            await answerCbRemoveKeyboard(ctx);

            const trackerId = parseInt(ctx.match[1]);
            ctx.scene.session.task.tracker = await ctx.db.taskTracker.findUniqueOrThrow({ where: { id: trackerId } });

            return completeTaskCreation(ctx);
        })
        .action(/trackerType\/(.+)/, async ctx => {
            if (!ctx.scene.session.task) {
                return ctx.reply('Invalid tracker type');
            }

            await answerCbRemoveKeyboard(ctx);

            const type = TrackerType[ctx.match[1] as keyof typeof TrackerType];

            ctx.scene.session.task.tracker = { type };

            if (!await replyTrackerDetails(ctx, type)) {
                return completeTaskCreation(ctx);
            }
        })
        .action(/trackedChannel(Comments)?Create/, async ctx => {
            await answerCbRemoveKeyboard(ctx);
            return ctx.reply('Send a valid username to a channel where I am an admin');
        })
        .action(/trackedChannel\/(\d+)/, async ctx => {
            if (!ctx.scene.session.task?.tracker || !('type' in ctx.scene.session.task.tracker)) {
                return ctx.reply('Invalid tracker type');
            }

            await answerCbRemoveKeyboard(ctx);

            ctx.scene.session.task.tracker.channelId = parseInt(ctx.match[1]);

            return completeTaskCreation(ctx);
        })
        .action(/trackedChannelComments\/(\d+)/, async ctx => {
            if (!ctx.scene.session.task?.tracker || !('type' in ctx.scene.session.task.tracker)) {
                return ctx.reply('Invalid tracker type');
            }

            await answerCbRemoveKeyboard(ctx);

            ctx.scene.session.task.tracker.chatId = parseInt(ctx.match[1]);

            return completeTaskCreation(ctx);
        })
        .hears(/^((?<username>@.+)|(?<id>[\-\d]+))$/, async ctx => {
            if (!ctx.match.groups) {
                return ctx.reply('Invalid input, try again');
            }

            if (!('type' in ctx.scene.session.task!.tracker!)) {
                return ctx.reply('Invalid tracker type');
            }

            if (ctx.scene.session.task!.tracker.type === TrackerType.Invite) {
                const useCount = ctx.match.groups['id'];
                if (!useCount) {
                    return ctx.reply('Invalid input, try again');
                }

                ctx.scene.session.task!.tracker.useCount = parseInt(useCount);

                return completeTaskCreation(ctx);
            }

            const checkChat = async (chatId: string | number, expectedStatus: 'member' | 'administrator') => {
                try {
                    const botMember = await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);

                    if (botMember.status !== expectedStatus) {
                        await ctx.reply(
                            `I am not an ${expectedStatus} in that chat, but instead ${botMember.status}, try again`);

                        return false;
                    }
                } catch (error) {
                    await ctx.reply(`Failed with ${error}, try again`);

                    return false;
                }

                return true;
            };

            const chatId = ctx.match.groups['username'] || ctx.match.groups['id'];

            if (ctx.scene.session.task!.tracker.type !== TrackerType.Comment && !await checkChat(chatId,
                'administrator')) {
                return;
            }

            const chat = await ctx.telegram.getChat(chatId);

            if (!('title' in chat) || chat.type !== 'channel' && chat.type !== 'supergroup') {
                return ctx.reply('Invalid chat type, try again');
            }

            if (ctx.scene.session.task!.tracker.type === TrackerType.JoinChannel) {
                ctx.scene.session.task!.tracker.channelId = chat.id;
            }
            else if (ctx.scene.session.task!.tracker.type === TrackerType.Comment) {
                if (!chat.linked_chat_id) {
                    return ctx.reply('For comments trigger chat must be linked with a discussion chat');
                }
                if (!await checkChat(chat.linked_chat_id, 'member')) {
                    return;
                }
                ctx.scene.session.task!.tracker.chatId = chat.linked_chat_id;
            }

            ctx.scene.session.task!.tracker.metaId = chat.id;
            ctx.scene.session.task!.tracker.metaName = chat.title;

            return completeTaskCreation(ctx);
        })
        .action('trackerRepeatable', async ctx => {
            await answerCbRemoveKeyboard(ctx);

            if (!('type' in ctx.scene.session.task!.tracker!)) {
                return ctx.reply('Invalid tracker type');
            }

            ctx.scene.session.task!.tracker!.repeatable = true;

            return completeTaskCreation(ctx);
        })
        .action('trackerInviteSpecific', async ctx => {
            await answerCbRemoveKeyboard(ctx);

            return ctx.reply('Respond with required count of invited users to complete the task');
        }),
);