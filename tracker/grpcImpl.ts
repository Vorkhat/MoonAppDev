import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/src/constants';
import { Empty } from '@proto/google/protobuf/empty';
import { GetChannelsResponse, SubscribeChannelRequest, SubscribedChannel, TrackerServer } from '@proto/tracker';
import { client } from '@/index';
import { Api } from 'telegram';

export const TrackerServerImpl: TrackerServer = {
    getChannels: async function (
        call: ServerUnaryCall<Empty, GetChannelsResponse>, callback: sendUnaryData<GetChannelsResponse>) {
        const dialogs = await client.getDialogs();

        callback(null, {
            channels: dialogs.filter(b => b.isChannel).map(channel => ({
                name: channel.title ?? channel.name ?? '<unamed>',
                channelId: Number((channel.inputEntity as Api.InputPeerChannel).channelId),
            })),
        });
    },
    subscribeChannel: async function (
        call: ServerUnaryCall<SubscribeChannelRequest, SubscribedChannel>,
        callback: sendUnaryData<SubscribedChannel>,
    ) {
        if (call.request.username) {
            const resolvedPeer = await client.invoke(new Api.contacts.ResolveUsername({
                username: call.request.username,
            }));

            if (!('channelId' in resolvedPeer.peer)) {
                callback({
                    code: Status.INVALID_ARGUMENT,
                    details: 'Peer is not a channel',
                });
                return;
            }

            await client.invoke(new Api.channels.JoinChannel({
                channel: resolvedPeer.peer,
            }));

            const entity = await client.getEntity(resolvedPeer.peer) as Api.Channel;

            callback(null, {
                channelId: Number(resolvedPeer.peer.channelId),
                name: entity.title ?? entity.username ?? '<unamed>',
            });
            return;
        }

        if (!call.request.joinHash) {
            callback({
                code: Status.INVALID_ARGUMENT,
                details: 'joinHash is required if username is not provided',
            });
            return;
        }

        const chatInvite = await client.invoke(new Api.messages.CheckChatInvite({
            hash: call.request.joinHash,
        }));

        if (chatInvite.className === Api.ChatInviteAlready.className) {
            callback({
                code: Status.INVALID_ARGUMENT,
                details: 'Channel is already joined',
            });
            return;
        }

        const response = await client.invoke(new Api.messages.ImportChatInvite({
            hash: call.request.joinHash,
        }));

        if (response.className !== Api.Updates.className) {
            callback({
                code: Status.INVALID_ARGUMENT,
                details: `Failed to join channel. Response is not an update: ${response.className}`,
            });
            return;
        }

        const channel = (response as Api.Updates).chats[0] as Api.Channel;

        callback(null, {
            channelId: Number(channel.id),
            name: channel.title ?? '<unamed>',
        });
    },
};