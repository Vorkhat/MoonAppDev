import './styles.scss';
import React, { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({subsets: ['latin']})

export default function AwardComponent({ children }: PropsWithChildren) {
    return (
        <div className="award-item-background">
            <p className={`award-item ${inter.className}`}>{children}</p>
        </div>
    );
}