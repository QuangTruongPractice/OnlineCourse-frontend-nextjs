'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export const ProgressProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="3px"
                color="#4f46e5"
                options={{ showSpinner: false, easing: 'ease', speed: 500 }}
                shallowRouting
            />
        </>
    );
};

