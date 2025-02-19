import React from 'react';
import { Components } from 'react-markdown';

export function getProjectUrl(subdomain: string): string {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
        return `http://${subdomain}.localhost:3000`;
    }

    return `https://${subdomain}.changelog.community`;
}