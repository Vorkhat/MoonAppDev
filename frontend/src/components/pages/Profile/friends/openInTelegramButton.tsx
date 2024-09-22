'use client';

import { ComponentProps, PropsWithChildren } from 'react';

export default function OpenInTelegramButton(props: PropsWithChildren<ComponentProps<'a'>>) {
    return (
        <a {...props} onClick={event => {
            event.preventDefault();

            if (props.href) {
                window.Telegram.WebApp.openTelegramLink(props.href);
            }
            else {
                props.onClick?.(event);
            }
        }}>
            {props.children}
        </a>
    );
}