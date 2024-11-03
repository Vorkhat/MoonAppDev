'use client'

import { postEvent } from '@telegram-apps/sdk-react';

export default function StoryPublish() {
    const openStory = () => {
        postEvent(
            'web_app_share_to_story' as any,
            {
                media_url: 'https://www.youtube.com/watch?v=glcIXLQ7SAI',
                text: 'Hello my friends'
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