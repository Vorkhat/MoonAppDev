import { PrismaClient, TaskType } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { Context, Scenes } from 'telegraf';
import { TrackerType } from 'tracker/trackerType';

export interface TaskBuilder {
    type?: TaskType;
    url?: string;
    reward?: number;
    tracker?: { type: TrackerType; } | { id: bigint };
}

export interface BotSceneSession extends Scenes.SceneSessionData, Scenes.WizardSessionData {
    task?: TaskBuilder;
}

export interface BotContext extends Context {
    db: Omit<PrismaClient, runtime.ITXClientDenyList>;

    scene: Scenes.SceneContextScene<BotContext, BotSceneSession>;
    wizard: Scenes.WizardContextWizard<BotContext>;
}