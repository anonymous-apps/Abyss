import React from 'react';

// Interface for logo props
interface LogoProps {
    className?: string;
    size?: number;
}

// Function to get the path to a logo in the public directory
export function getLogoPath(name: string): string {
    return `/${name}`;
}

// OpenAI Logo Component
export function OpenAILogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('openai.svg')} alt="OpenAI Logo" className={className} width={size} height={size} />;
}

// Anthropic Logo Component
export function AnthropicLogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('anthropic.svg')} alt="Anthropic Logo" className={className} width={size} height={size} />;
}

// Gemini Logo Component
export function GeminiLogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('gemini.svg')} alt="Gemini Logo" className={className} width={size} height={size} />;
}

// Provider Logo Component
export function ProviderLogo({ provider, className, size = 24 }: LogoProps & { provider: string }) {
    switch (provider.toLowerCase()) {
        case 'openai':
            return <OpenAILogo className={className} size={size} />;
        case 'anthropic':
            return <AnthropicLogo className={className} size={size} />;
        case 'gemini':
            return <GeminiLogo className={className} size={size} />;
        default:
            return (
                <div className={className} style={{ width: size, height: size }}>
                    {/* Fallback for unknown providers */}
                </div>
            );
    }
}
