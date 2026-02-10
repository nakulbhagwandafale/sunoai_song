import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Mukta';
import lyricsData from '../public/lyrics.json';

const { fontFamily } = loadFont();

export const Lyrics: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTimeSeconds = frame / fps;

    // Find the current lyric line
    const currentLine = lyricsData.find((line) => {
        return currentTimeSeconds >= line.start && currentTimeSeconds < line.end;
    });

    // If no lyric is active (pause/instrumental), show nothing
    if (!currentLine) {
        return null;
    }

    // Calculate animation progress within this lyric's duration
    const lineStartFrame = currentLine.start * fps;
    const lineEndFrame = currentLine.end * fps;
    const lineDuration = lineEndFrame - lineStartFrame;

    // Fade in during first 10 frames
    const fadeInDuration = Math.min(10, lineDuration * 0.15);
    // Fade out during last 10 frames  
    const fadeOutStart = lineDuration - Math.min(10, lineDuration * 0.15);

    const localFrame = frame - lineStartFrame;

    // Opacity: fade in at start, fade out at end
    const opacity = interpolate(
        localFrame,
        [0, fadeInDuration, fadeOutStart, lineDuration],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Slide up animation
    const translateY = interpolate(
        localFrame,
        [0, fadeInDuration, fadeOutStart, lineDuration],
        [30, 0, 0, -30],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
        }
    );

    // Scale pop effect
    const scale = interpolate(
        localFrame,
        [0, fadeInDuration * 0.5, fadeInDuration],
        [0.9, 1.05, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Text glow intensity
    const glowIntensity = interpolate(
        localFrame,
        [0, fadeInDuration, fadeOutStart, lineDuration],
        [0, 15, 15, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Split multi-line lyrics
    const lines = currentLine.line.split('\n');

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily,
                textAlign: 'center',
                padding: '0 80px',
            }}
        >
            <div
                style={{
                    opacity,
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                {lines.map((line, index) => (
                    <h1
                        key={index}
                        style={{
                            fontSize: lines.length > 1 ? '60px' : '80px',
                            fontWeight: 700,
                            color: '#ffffff',
                            textShadow: `
                0 0 ${glowIntensity}px rgba(255, 200, 100, 0.8),
                0 0 ${glowIntensity * 2}px rgba(255, 150, 50, 0.5),
                0 4px 10px rgba(0, 0, 0, 0.6)
              `,
                            margin: 0,
                            letterSpacing: '2px',
                            lineHeight: 1.3,
                        }}
                    >
                        {line}
                    </h1>
                ))}
            </div>
        </AbsoluteFill>
    );
};
