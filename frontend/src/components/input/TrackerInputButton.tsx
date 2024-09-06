'use client';

import React from 'react';

export function TrackerInputButton({ defaultValue, children }: { defaultValue?: string, children: React.ReactNode }) {
    return (
        <>
            <div>
                <label htmlFor="trackerId">Tracker</label>
                <input type="text" name="trackerId" defaultValue={defaultValue}
                       hidden={true}/>
                <button onClick={event => event.preventDefault()}>{children}</button>
            </div>
        </>
    );
}