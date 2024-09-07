import './styles.scss';
import React, { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({subsets: ['latin']})

export default function ContainerContent({ children }: PropsWithChildren) {
    return (
        <div className={`container-border ${inter.className}`}>
            <div className="container-background">
                {children}
            </div>
        </div>
    );
}