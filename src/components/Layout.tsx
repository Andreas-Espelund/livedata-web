import React, {ReactNode} from 'react';

interface RowProps {
    children: ReactNode;
    centering?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    gap?: 'small' | 'medium' | 'large' | 'none'
    fullWidth?: boolean;
}

export const Row: React.FC<RowProps> = ({children, centering = 'start', gap = 'medium', fullWidth}) => {
    const centeringClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    };

    const gapClasses = {
        small: 'gap-2',
        medium: 'gap-4',
        large: 'gap-6',
        none: ''
    };

    const rowClasses = `flex w-full ${fullWidth ? 'w-full' : ''} ${centeringClasses[centering]} ${gapClasses[gap]}`;

    return <div className={rowClasses}>{children}</div>;
};

interface StackProps {
    children: ReactNode;
    centering?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    gap?: 'small' | 'medium' | 'large' | 'none';
}

export const Stack: React.FC<StackProps> = ({children, centering = 'start', gap = 'medium'}) => {
    const centeringClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    };

    const gapClasses = {
        small: 'space-y-2',
        medium: 'space-y-4',
        large: 'space-y-6',
        none: ''
    };

    const stackClasses = `flex flex-col ${centeringClasses[centering]} ${gapClasses[gap]}`;

    return <div className={stackClasses}>{children}</div>;
};

interface ContainerProps {
    children: ReactNode;
    padding?: 'small' | 'medium' | 'large' | 'none';
}

export const Container: React.FC<ContainerProps> = ({children, padding = 'medium'}) => {

    const paddingClasses = {
        small: 'p-2',
        medium: 'p-4',
        large: 'p-6',
        none: ''
    };

    const stackClasses = `w-full ${paddingClasses[padding]}`;

    return <div className={stackClasses}>{children}</div>;
};