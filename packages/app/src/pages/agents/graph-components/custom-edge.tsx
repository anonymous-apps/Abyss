import { getBezierPath, useReactFlow, type EdgeProps } from '@xyflow/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
        }
    }, [edgePath]);

    const onEdgeClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEdges(edges => edges.filter(edge => edge.id !== id));
    };

    const isSignal = data?.isSignal;
    const targetColor = data?.targetColor! as string;

    return (
        <g>
            <path d={edgePath} fill="none" stroke="transparent" strokeWidth={30} onClick={onEdgeClick} style={{ cursor: 'pointer' }} />
            {isSignal ? (
                <>
                    {/* Base path */}
                    <path
                        ref={pathRef}
                        d={edgePath}
                        fill="none"
                        strokeWidth={10}
                        markerEnd={markerEnd}
                        style={{
                            ...style,
                            cursor: 'pointer',
                            opacity: 0.75,
                            stroke: targetColor + '70',
                        }}
                    />

                    {/* Animated pulse */}
                    <path
                        d={edgePath}
                        fill="none"
                        strokeWidth={4}
                        strokeDasharray={`${pathLength * 0.1}, ${pathLength}`}
                        strokeDashoffset="0"
                        markerEnd={markerEnd}
                        style={{
                            ...style,
                            cursor: 'pointer',
                            opacity: 0.75,

                            stroke: targetColor,
                            animation: `dashOffset ${3}s linear infinite`,
                        }}
                    />
                    <style>
                        {`
                        @keyframes dashOffset {
                            0% {
                                stroke-dashoffset: ${pathLength};
                            }
                            100% {
                                stroke-dashoffset: ${-pathLength};
                            }
                        }
                        `}
                    </style>
                </>
            ) : (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={'var(--color-background-700)'}
                    strokeWidth={3}
                    markerEnd={markerEnd}
                    style={{
                        ...style,
                        cursor: 'pointer',
                        opacity: 0.75,
                        stroke: 'var(--color-background-700)',
                    }}
                />
            )}
        </g>
    );
}
