import { prisma } from '@/prisma';
import { useSession } from '@/components/session';
import { FormElement } from '@/utils/formElement';
import QuizForm from '@/components/pages/Quiz/QuizFormElement';
import { redirect } from 'next/navigation';

export default async function QuizStep({ params }: { params: { stepId: number } }) {
    const { userId } = await useSession();
    const step = await prisma.formStep.findUnique({
        where: {
            id: params.stepId,
            completions: {
                none: {
                    userId: userId,
                    currentStepId: {
                        not: params.stepId,
                    },
                    completedAt: {
                        not: null,
                    },
                },
            },
        },
    });

    const elements = step?.content as FormElement[] | undefined;

    if (!elements) {
        redirect('/quiz');
    }

    async function submit(data: FormData) {
        'use server';

        const completion = await prisma.formCompletion.findFirstOrThrow({
            where: {
                userId: userId,
                currentStepId: params.stepId,
                completedAt: {
                    equals: null,
                },
            },
            include: {
                form: {
                    include: {
                        steps: true,
                    },
                },
            },
        });

        await prisma.formCompletedStep.create({
            data: {
                completion: { connect: { id: completion.id } },
                step: { connect: { id: params.stepId } },
                data: Object.fromEntries([ ...data.entries() ].map(item => [ item[0], item[1] as string ])),
            },
        });

        const index = completion.form.steps.findIndex(b => b.id == step!.id);
        const nextStep = completion.form.steps.at(index + 1);

        await prisma.formCompletion.update({
            where: { id: completion.id },
            data: nextStep ? {
                currentStep: {
                    connect: { id: nextStep.id },
                },
            } : {
                completedAt: 'now()',
                user: completion.form.reward ?
                    {
                        update: {
                            points: {
                                increment: completion.form.reward,
                            },
                        },
                    } : undefined,
            },
        });

        redirect(nextStep ? `/quiz/step/${nextStep.id}` : '/quiz');
    }

    return (
        <>
            <form action={submit}>
                <QuizForm elements={elements}/>
            </form>
        </>
    );
}