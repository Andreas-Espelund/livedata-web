import React from 'react';

interface HeadingProps {
    children: React.ReactNode;
}

export const Heading1: React.FC<HeadingProps> = ({children}) => (
    <h1 className="text-3xl font-bold">{children}</h1>
);

export const Heading2: React.FC<HeadingProps> = ({children}) => (
    <h2 className="text-2xl font-bold">{children}</h2>
);

export const Heading3: React.FC<HeadingProps> = ({children}) => (
    <h3 className="text-xl font-bold">{children}</h3>
);

export const Heading4: React.FC<HeadingProps> = ({children}) => (
    <h4 className="text-lg font-bold">{children}</h4>
);

export const Heading5: React.FC<HeadingProps> = ({children}) => (
    <h5 className="text-md font-bold">{children}</h5>
);
