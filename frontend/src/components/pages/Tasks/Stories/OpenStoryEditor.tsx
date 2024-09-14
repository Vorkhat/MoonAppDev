'use client';

import React, { useEffect } from 'react';

export default function OpenStoryEditor({ url }: { url: string }) {
    useEffect(() => {
        window.Telegram.WebApp.shareToStory(url);
    });

    return <></>;
}