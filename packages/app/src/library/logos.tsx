import React from 'react';

// Interface for logo props
interface LogoProps {
    className?: string;
    size?: number;
    logo: string;
}

// Function to get the path to a logo in the public directory
export function getLogoPath(name: string): string {
    return `/${name}`;
}

// Abyss Logo Component
export function AbyssLogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('logo.png')} alt="Abyss Logo" className={className} width={size} height={size} />;
}

// OpenAI Logo Component
export function OpenAILogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('openai.svg')} alt="OpenAI Logo" className={`${className} invert`} width={size} height={size} />;
}

// Anthropic Logo Component
export function AnthropicLogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('anthropic.svg')} alt="Anthropic Logo" className={`${className} invert`} width={size} height={size} />;
}

// Gemini Logo Component
export function GeminiLogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('gemini.svg')} alt="Gemini Logo" className={className} width={size} height={size} />;
}

// Nodejs Logo Component
export function NodejsLogo({ className, size = 24 }: LogoProps) {
    return <img src={getLogoPath('nodejs.png')} alt="Node.js Logo" className={className} width={size} height={size} />;
}

// Logo Component
export function Logo({ className, size = 24, logo }: LogoProps) {
    switch (logo.toLowerCase()) {
        case 'openai':
            return <OpenAILogo className={className} size={size} logo={logo} />;
        case 'anthropic':
            return <AnthropicLogo className={className} size={size} logo={logo} />;
        case 'gemini':
            return <GeminiLogo className={className} size={size} logo={logo} />;
        case 'abyss':
            return <AbyssLogo className={className} size={size} logo={logo} />;
        case 'nodejs':
            return <NodejsLogo className={className} size={size} logo={logo} />;
        default:
            console.error(`Unknown logo: ${logo}`);
            return (
                <div className={className} style={{ width: size, height: size }}>
                    Unknown
                </div>
            );
    }
}
