'use client';

import {PropsWithChildren, useEffect} from 'react';
import {loadTheme} from "@/utils/changeTheme";


export default function Theme({ children }: PropsWithChildren) {

    useEffect(() => {
        loadTheme();
    }, []);

    return children
}

