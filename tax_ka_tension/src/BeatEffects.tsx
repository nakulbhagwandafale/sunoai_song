import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import lyricsData from '../public/lyrics.json';

interface BeatEffectsProps {
    children: React.ReactNode;
}

export const BeatEffects: React.FC<BeatEffectsProps> = ({ children }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTimeSeconds = frame / fps;

    // Find current section
    const currentLine = lyricsData.find(
        (line) => currentTimeSeconds >= line.start && currentTimeSeconds < line.end
    );
    const section = currentLine?.section || 'none';

    // Gentle camera drift (slow zoom)
    const baseScale = interpolate(frame, [0, 4500], [1, 1.03], {
        extrapolateRight: 'clamp',
    });

    // Beat pulse logic based on section
    let beatPulse = 0;
    const beatFrequency = section === 'chorus' ? 8 : section === 'bridge' ? 10 : 15;

    if (section === 'chorus') {
        // Strong, energetic pulse during chorus
        const beatPhase = (frame % beatFrequency) / beatFrequency;
        if (beatPhase < 0.2) {
            beatPulse = interpolate(beatPhase, [0, 0.2], [0, 0.015], {
                extrapolateRight: 'clamp',
            });
        } else {
            beatPulse = interpolate(beatPhase, [0.2, 1], [0.015, 0], {
                extrapolateRight: 'clamp',
            });
        }
    } else if (section === 'bridge') {
        // Punchy pulse for bridge hits
        const beatPhase = (frame % beatFrequency) / beatFrequency;
        if (beatPhase < 0.15) {
            beatPulse = interpolate(beatPhase, [0, 0.15], [0, 0.02], {
                extrapolateRight: 'clamp',
            });
        } else {
            beatPulse = interpolate(beatPhase, [0.15, 1], [0.02, 0], {
                extrapolateRight: 'clamp',
            });
        }
    } else if (section === 'verse1' || section === 'verse2') {
        // Subtle pulse for verses
        const beatPhase = (frame % beatFrequency) / beatFrequency;
        if (beatPhase < 0.2) {
            beatPulse = interpolate(beatPhase, [0, 0.2], [0, 0.005], {
                extrapolateRight: 'clamp',
            });
        } else {
            beatPulse = interpolate(beatPhase, [0.2, 1], [0.005, 0], {
                extrapolateRight: 'clamp',
            });
        }
    } else if (section === 'intro') {
        // Gentle rhythmic pulse for intro
        const beatPhase = (frame % 20) / 20;
        beatPulse = Math.sin(beatPhase * Math.PI * 2) * 0.003;
    }

    // Slight camera shake during chorus
    let shakeX = 0;
    let shakeY = 0;
    if (section === 'chorus') {
        shakeX = Math.sin(frame * 0.7) * 1.5;
        shakeY = Math.cos(frame * 0.5) * 1;
    } else if (section === 'bridge') {
        shakeX = Math.sin(frame * 0.9) * 2;
        shakeY = Math.cos(frame * 0.6) * 1.5;
    }

    const transform = `scale(${baseScale + beatPulse}) translate(${shakeX}px, ${shakeY}px)`;

    return (
        <AbsoluteFill style={{ transform, transformOrigin: 'center center' }}>
            {children}
        </AbsoluteFill>
    );
};
