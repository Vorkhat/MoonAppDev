import React, { PropsWithChildren } from 'react';
import { EmailProvider } from '@/components/pages/Quiz/QuizForm/Email/EmailContext.tsx';

export function QuizContainer({ children }: PropsWithChildren) {
    return <EmailProvider>{children}</EmailProvider>;
}