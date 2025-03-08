import React, { useEffect, useState } from 'react';

type Particle = {
    id: number;
    left: number;
    size: number;
    duration: number;
};

export const AbyssBackground: React.FC = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Spawn a new particle every 500ms
        const interval = setInterval(() => {
            const newParticle: Particle = {
                id: Date.now() + Math.random(),
                left: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 20000 + 10000,
            };

            setParticles(prev => [...prev, newParticle]);

            // Remove particle after its animation completes
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== newParticle.id));
            }, newParticle.duration);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="-z-50 fixed inset-0 overflow-hidden pointer-events-none bg-background-base">
            {/* Inline keyframes for the upward floating animation */}
            <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>

            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute bg-primary-base rounded-full"
                    style={{
                        left: `${p.left}%`,
                        bottom: 0,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `floatUp ${p.duration}ms linear forwards`,
                    }}
                />
            ))}
        </div>
    );
};
