import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const Background: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Slow gradient rotation
    const gradientAngle = interpolate(frame, [0, fps * 150], [135, 225], {
        extrapolateRight: 'clamp',
    });

    // Subtle hue shift over time
    const hueShift = interpolate(frame, [0, fps * 60], [0, 30], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(${gradientAngle}deg, 
          hsl(${220 + hueShift}, 30%, 8%), 
          hsl(${240 + hueShift}, 25%, 12%), 
          hsl(${210 + hueShift}, 35%, 6%))`,
            }}
        >
            {/* Bokeh circles layer 1 */}
            {Array.from({ length: 15 }).map((_, i) => {
                const x = (i * 7 + 10) % 100;
                const baseY = (i * 13 + 5) % 100;
                const floatY = interpolate(
                    (frame + i * 50) % 300,
                    [0, 150, 300],
                    [baseY, baseY - 3, baseY]
                );
                const bokehOpacity = interpolate(
                    (frame + i * 40) % 200,
                    [0, 100, 200],
                    [0.02, 0.06, 0.02]
                );
                const size = 30 + (i % 5) * 20;

                return (
                    <div
                        key={`bokeh1-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${floatY}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(255, 200, 100, ${bokehOpacity}), transparent)`,
                            filter: 'blur(8px)',
                        }}
                    />
                );
            })}

            {/* Bokeh circles layer 2 - blue tones */}
            {Array.from({ length: 8 }).map((_, i) => {
                const x = (i * 12 + 25) % 100;
                const baseY = (i * 17 + 20) % 100;
                const floatY = interpolate(
                    (frame + i * 70) % 350,
                    [0, 175, 350],
                    [baseY, baseY - 4, baseY]
                );
                const bokehOpacity = interpolate(
                    (frame + i * 55) % 250,
                    [0, 125, 250],
                    [0.01, 0.04, 0.01]
                );
                const size = 50 + (i % 4) * 30;

                return (
                    <div
                        key={`bokeh2-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${floatY}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(100, 150, 255, ${bokehOpacity}), transparent)`,
                            filter: 'blur(12px)',
                        }}
                    />
                );
            })}

            {/* Subtle noise/grain overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.03,
                    backgroundImage:
                        'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Top & bottom gradient fades for cinematic feel */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '80px',
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '80px',
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                }}
            />
        </AbsoluteFill>
    );
};
