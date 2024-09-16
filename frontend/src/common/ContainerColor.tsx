import React, { PropsWithChildren } from 'react';

interface ContainerColorProps extends PropsWithChildren {
    classNameBorder?: string | string[];
    classNameBackground?: string | string[];
}

export default function ContainerColor({ children, classNameBorder = '', classNameBackground = ''}: ContainerColorProps) {

    const joinClasses = (classes: string | string[]): string => {
        return Array.isArray(classes) ? classes.join(' ') : classes;
    };

    return (
        <div className={joinClasses(classNameBorder)}>
            <div className={joinClasses(classNameBackground)}>
                {children}
            </div>
        </div>
    );
}