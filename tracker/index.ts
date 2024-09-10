import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { createInterface } from 'node:readline/promises';
import { Raw } from 'telegram/events';
import { handleJoinChannel } from '@/handlers';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { TrackerService } from '@proto/tracker';
import { TrackerServerImpl } from '@/grpcImpl';

export const client = new TelegramClient(new StringSession(process.env.TELEGRAM_SESSION),
    27274276, 'edb1766eed02133b0f7e1fe57b436484', {});

const rl = createInterface(process.stdin, process.stdout);

await client.start({
    phoneNumber: () => rl.question('Please enter your phone number: '),
    phoneCode: () => rl.question('Please enter the code you received: '),
    onError: console.error,
});

const self = await client.getEntity('me') as Api.User;
console.log(`connected as ${self.firstName}`);

client.addEventHandler(async event => {
    const update = event as Api.UpdateChannelParticipant;

    if (update.newParticipant?.className !== Api.ChannelParticipant.className) {
        return;
    }

    await handleJoinChannel(Number(update.channelId), Number(update.userId));
}, new Raw({
    types: [ Api.UpdateChannelParticipant ],
}));

const grpcServer = new Server();

grpcServer.addService(TrackerService, TrackerServerImpl);

grpcServer.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), (error) => {
    if (error) {
        console.error('gRPC server failed to start');
        console.error(error);
    }
    else {
        console.log('gRPC server started');
    }
});
