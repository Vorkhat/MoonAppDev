'use client';

import {useEffect} from "react";
import {initInitData} from "@telegram-apps/sdk-react";

export default function Default() {
    useEffect(() => {
        fetch('/api/init', { method: 'POST', body: JSON.stringify(initInitData()) })
            .then(res => {
                if (res.status < 400) {
                    window.location.href = '/home';
                    return;
                }

                console.error(`Failed to init: ${res.status} ${res.statusText}`);
            }).catch(console.error);
    }, []);

  return (
    <></>
  );
}
