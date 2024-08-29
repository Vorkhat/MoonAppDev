'use client';

import { SDKProvider } from '@telegram-apps/sdk-react';
import {PropsWithChildren} from "react";
import {useDidMount} from "@/hooks/useDidMount";


export default function Root({ children }: PropsWithChildren) {

    const didMount = useDidMount();

    return didMount ? (
        <SDKProvider acceptCustomStyles debug>
                {children}
        </SDKProvider>
    ) : <div className="root__loading">undefined</div>;
}
