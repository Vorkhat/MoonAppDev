import { NextRequest } from 'next/server';
import { useSession } from '@/components/session';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest, { params }: { params: { formId: number } }) {
    const { userId } = await useSession();
    const form = await prisma.form.findUnique({
        where: {
            id: params.formId,
            completions: {
                none: {
                    userId: userId,
                    completedAt: {
                        not: null,
                    },
                },
            },
        },
        select: {
            completions: {
                orderBy: {
                    startedAt: 'desc',
                },
                take: 1,
                select: {
                    currentStepId: true,
                },
            },
        },
    });

    if (!form) {
        redirect('/quiz');
    }

    const stepId = form.completions.at(0)?.currentStepId;

    if (stepId) {
        redirect(`/quiz/step/${stepId}`);
    }

    const { currentStepId } = await prisma.formCompletion.create({
        data: {
            form: {
                connect: { id: params.formId },
            },
            user: {
                connect: { id: userId },
            },
            currentStep: {
                connect: {
                    defaultStepFormId: params.formId,
                },
            },
        },
        select: {
            currentStepId: true,
        },
    });

    redirect(`/quiz/step/${currentStepId}`);
}