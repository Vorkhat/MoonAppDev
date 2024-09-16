import { PromiseType } from '@prisma/client/extension';
import { JsonObject } from '@prisma/client/runtime/library';
import { connect } from 'amqplib';

if (!process.env.AMQP_URL) {
    throw new Error('Missing AMQP_URL environment variable');
}

const amqpSingleton = async () => {
    const client = await connect(process.env.AMQP_URL!);
    return await client.createChannel();
};

export enum MessageQueue {
    NewUser = 'newUser',
}

declare const globalThis: {
                              amqpGlobal: PromiseType<ReturnType<typeof amqpSingleton>>;
                          } & typeof global;

export async function mq() {
    const amqp = globalThis.amqpGlobal ?? await amqpSingleton();
    if (process.env.NODE_ENV !== 'production') globalThis.amqpGlobal = amqp;

    return amqp;
}

export async function publishMessage<T extends JsonObject>(queue: MessageQueue, message: T) {
    const channel = await mq();
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        contentType: 'application/json',
        contentEncoding: 'utf8',
    });
}

export async function consumeMessages<T extends JsonObject>(
    queue: MessageQueue, handler: (message: T) => Promise<void>) {
    const channel = await mq();
    await channel.assertQueue(queue);
    await channel.consume(queue, async (message) => {
        if (message) {
            await handler(JSON.parse(message.content.toString()) as T);
            channel.ack(message);
        }
    });
}