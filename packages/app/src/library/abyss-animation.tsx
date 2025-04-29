import React, { useEffect, useRef, useState } from 'react';

export function AbyssAnimation({ starCount = 200, spawnRate = 10 }: { starCount?: number; spawnRate?: number }) {
    const FRICTION = 0.999;
    const ACCELERATION = 0.0002;
    const containerRef = useRef<HTMLDivElement>(null);
    const starsRef = useRef<
        Array<{
            x: number;
            y: number;
            size: number;
            opacity: number;
            dx: number;
            dy: number;
            fadeOut: boolean;
            speed: number;
            id: number;
        }>
    >([]);
    const [stars, setStars] = useState<typeof starsRef.current>([]);
    const nextIdRef = useRef(0);

    // Initialize stars array
    useEffect(() => {
        starsRef.current = [];
        setStars([]);
        nextIdRef.current = 0;

        // Initialize with 30 stars
        const initialStars = Array.from({ length: 30 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 1 + Math.random() * 1.5,
            opacity: 0.2 + Math.random() * 0.8,
            dx: 0,
            dy: 0,
            fadeOut: false,
            speed: 0,
            id: nextIdRef.current++,
        }));

        starsRef.current = initialStars;
        setStars(initialStars);
    }, []);

    // Gradual star spawning - exactly one per interval
    useEffect(() => {
        const spawnInterval = setInterval(() => {
            if (starsRef.current.length < starCount) {
                // Create only one new star per interval
                const newStar = {
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: 1 + Math.random() * 1.5,
                    opacity: 0.2 + Math.random() * 0.8,
                    dx: 0,
                    dy: 0,
                    fadeOut: false,
                    speed: 0,
                    id: nextIdRef.current++,
                };

                starsRef.current = [...starsRef.current, newStar];
                setStars(prev => [...prev, newStar]);
            } else {
                clearInterval(spawnInterval);
            }
        }, 1000 / spawnRate); // Adjust interval based on spawn rate

        return () => clearInterval(spawnInterval);
    }, [starCount, spawnRate]);

    // Animation loop using simple interval
    useEffect(() => {
        const animationInterval = setInterval(() => {
            const targetX = 50;
            const targetY = 50;

            // Update star positions
            const updatedStars = starsRef.current
                .filter(star => !star.fadeOut || star.opacity > 0)
                .map(star => {
                    // Handle fading out
                    if (star.fadeOut) {
                        star.opacity -= 0.05;
                        return star;
                    }

                    // Calculate direction and distance
                    const dx = (targetX - star.x) * ACCELERATION;
                    const dy = (targetY - star.y) * ACCELERATION;
                    const dx2 = targetX - star.x;
                    const dy2 = targetY - star.y;
                    const distance = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    // Update velocity with intensity based on distance
                    const intensity = Math.max(0.05, 5 / (distance + 10));
                    star.dx = star.dx + dx * intensity;
                    star.dy = star.dy + dy * intensity;

                    // Apply friction
                    star.dx *= FRICTION;
                    star.dy *= FRICTION;

                    // Update position
                    star.x += star.dx;
                    star.y += star.dy;

                    // Calculate speed
                    star.speed = Math.sqrt(star.dx * star.dx + star.dy * star.dy);

                    // Mark for fadeout if close to target
                    if (distance < 0.5) {
                        star.fadeOut = true;
                    }

                    // Update opacity
                    star.opacity = Math.max(0.1, distance / 20);

                    return star;
                });

            starsRef.current = updatedStars;
            setStars(updatedStars);
        }, 1000 / 60); // Fixed 60fps animation

        return () => clearInterval(animationInterval);
    }, []);

    return (
        <div className="w-full h-full relative" ref={containerRef}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {stars.map(s => (
                    <div
                        key={s.id}
                        className="absolute rounded-full"
                        style={{
                            position: 'absolute',
                            width: `${s.size}px`,
                            height: `${s.size}px`,
                            backgroundColor: 'white',
                            opacity: s.opacity,
                            borderRadius: '50%',
                            top: `${s.y}%`,
                            left: `${s.x}%`,
                            zIndex: 1,
                            transition: s.fadeOut ? 'opacity 0.5s' : 'none',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
