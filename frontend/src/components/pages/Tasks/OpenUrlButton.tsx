'use client'

import { ComponentProps, PropsWithChildren } from 'react';
import OpenInTelegramButton from '@/components/input/openInTelegramButton.tsx';
import OpenInExternalBrowserButton from '@/components/input/openInExternalBrowserButton.tsx';

export default function OpenUrlButton(props: PropsWithChildren<ComponentProps<'a'>>) {
    return (
        props.href && props.href.startsWith('https://t.me') ?
        <OpenInTelegramButton {...props}>
            {props.children}
        </OpenInTelegramButton> :
        <OpenInExternalBrowserButton {...props}>
            {props.children}
        </OpenInExternalBrowserButton>
    );
}