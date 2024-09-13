import { FormStep, PrismaClient, TaskType } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { JsonObject } from '@prisma/client/runtime/library';
import { Context, Scenes } from 'telegraf';
import { TrackerType } from 'tracker/trackerType';
import { FormElement } from 'frontend/src/utils/formElement';
import { SceneSession } from 'telegraf/scenes';

export interface TaskBuilder {
    type?: TaskType;
    url?: string;
    reward?: number;
    tracker?: { type: TrackerType; } & JsonObject | { id: bigint };
}

export interface FormStepBuilder {
    formStep: FormStep;
    elements: FormElement[];
}

export interface BotSceneSession extends Scenes.WizardSessionData {
    task?: TaskBuilder;
    formStep?: FormStepBuilder;
}

export interface BotSession extends SceneSession<BotSceneSession> {
    selectedFormStep?: FormStepBuilder;
}

export interface BotContext extends Context {
    db: Omit<PrismaClient, runtime.ITXClientDenyList>;

    session: BotSession;

    scene: Scenes.SceneContextScene<BotContext, BotSceneSession>;
    wizard: Scenes.WizardContextWizard<BotContext>;
}