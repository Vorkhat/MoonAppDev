import { ComponentProps, PropsWithChildren } from 'react';

export default function OpenInExternalBrowserButton(props: PropsWithChildren<ComponentProps<'a'>>) {
    return (
        <a {...props} onClick={event => {
            event.preventDefault();

            if (props.href) {
                window.Telegram.WebApp.openLink(props.href);
            }
            else {
                props.onClick?.(event);
            }
        }}>
            {props.children}
        </a>
    );
}