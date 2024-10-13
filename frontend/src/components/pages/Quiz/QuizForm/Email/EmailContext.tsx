'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface EmailContextType {
    emailExists: boolean;
    setEmailExists: (exists: boolean) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [emailExists, setEmailExists] = useState(false);

    return (
        <EmailContext.Provider value={{ emailExists, setEmailExists }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmailContext = () => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error('useEmailContext должен использоваться внутри EmailProvider');
    }
    return context;
};
