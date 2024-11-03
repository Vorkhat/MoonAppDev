'use client'

import { postEvent } from '@telegram-apps/sdk-react';

export default function StoryPublish() {
    const openStory = () => {
        postEvent('web_app_share_to_story' as any, {
            media_url:'https://storage.yandexcloud.net/bhajan-bucket/test/enStory.png',
            text: `https://t.me/ton1moonBot/app?startapp=invitedBy1234567`,
            widget_link: {
                url: `https://t.me/ton1moonBot/app?startapp=invitedBy12345678`,
                name: 'Moon App',
            },
        })
    }

    return (
        <>
           <button onClick={openStory}>
               312
           </button>
        </>
    );
}