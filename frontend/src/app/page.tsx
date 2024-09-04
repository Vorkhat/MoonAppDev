'use client';

import {useEffect} from "react";
import {retrieveLaunchParams} from "@telegram-apps/sdk-react";

export default function Default() {
    useEffect(() => {
        const lp = retrieveLaunchParams();
        fetch('/api/init', { method: 'POST', body: lp.initDataRaw })
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
