import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';
import lyricsData from '../public/lyrics.json';

const { fontFamily } = loadFont();

// Mood-based color configs
const moodColors: Record<string, { primary: string; glow: string; bg: string }> = {
    funny: { primary: '#FFD700', glow: 'rgba(255,215,0,0.6)', bg: 'rgba(255,215,0,0.05)' },
    happy: { primary: '#00FF88', glow: 'rgba(0,255,136,0.6)', bg: 'rgba(0,255,136,0.05)' },
    sad: { primary: '#6699FF', glow: 'rgba(102,153,255,0.6)', bg: 'rgba(102,153,255,0.05)' },
    angry: { primary: '#FF4444', glow: 'rgba(255,68,68,0.6)', bg: 'rgba(255,68,68,0.05)' },
    energetic: { primary: '#FF6B00', glow: 'rgba(255,107,0,0.7)', bg: 'rgba(255,107,0,0.08)' },
    sarcastic: { primary: '#FF66FF', glow: 'rgba(255,102,255,0.6)', bg: 'rgba(255,102,255,0.05)' },
    dreamy: { primary: '#BB88FF', glow: 'rgba(187,136,255,0.6)', bg: 'rgba(187,136,255,0.05)' },
    hopeful: { primary: '#88DDFF', glow: 'rgba(136,221,255,0.6)', bg: 'rgba(136,221,255,0.05)' },
    panic: { primary: '#FF2222', glow: 'rgba(255,34,34,0.8)', bg: 'rgba(255,34,34,0.1)' },
    calm: { primary: '#AADDAA', glow: 'rgba(170,221,170,0.5)', bg: 'rgba(170,221,170,0.05)' },
};

// Section label icons/emoji
const sectionLabels: Record<string, string> = {
    intro: '🎵 INTRO',
    verse1: '🎤 VERSE 1',
    verse2: '🎤 VERSE 2',
    chorus: '🔥 CHORUS',
    bridge: '💳 BRIDGE',
    outro: '✌️ OUTRO',
};

export const LyricsPanel: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTimeSeconds = frame / fps;

    // Find current lyric line
    const currentLineIndex = lyricsData.findIndex(
        (line) => currentTimeSeconds >= line.start && currentTimeSeconds < line.end
    );
    const currentLine = currentLineIndex >= 0 ? lyricsData[currentLineIndex] : null;

    // Find previous line for transition context
    const prevLine = currentLineIndex > 0 ? lyricsData[currentLineIndex - 1] : null;

    // Section change detection
    const isSectionChange = prevLine && currentLine && prevLine.section !== currentLine.section;

    if (!currentLine) {
        // Show a waiting animation during gaps
        const pulseScale = interpolate(
            Math.sin(frame * 0.08),
            [-1, 1],
            [0.95, 1.05]
        );
        return (
            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily,
                }}
            >
                <div
                    style={{
                        fontSize: '36px',
                        color: 'rgba(255,255,255,0.2)',
                        transform: `scale(${pulseScale})`,
                        letterSpacing: '8px',
                    }}
                >
                    ♪ ♪ ♪
                </div>
            </AbsoluteFill>
        );
    }

    const lineStartFrame = currentLine.start * fps;
    const lineEndFrame = currentLine.end * fps;
    const lineDuration = lineEndFrame - lineStartFrame;
    const localFrame = frame - lineStartFrame;

    const mood = currentLine.mood as string;
    const section = currentLine.section as string;
    const colors = moodColors[mood] || moodColors.funny;

    // Fade in duration (first 12 frames)
    const fadeInDuration = Math.min(12, lineDuration * 0.2);
    // Fade out (last 10 frames)
    const fadeOutStart = lineDuration - Math.min(10, lineDuration * 0.15);

    // Opacity
    const opacity = interpolate(
        localFrame,
        [0, fadeInDuration, fadeOutStart, lineDuration],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Different animations per section
    let translateY = 0;
    let translateX = 0;
    let scale = 1;
    let rotation = 0;

    if (section === 'intro') {
        // Typewriter-like pop-in
        scale = interpolate(
            localFrame,
            [0, 5, 10],
            [0.5, 1.15, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        rotation = interpolate(
            localFrame,
            [0, 5, 12],
            [-3, 2, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
        );
    } else if (section === 'chorus') {
        // Energetic bounce and shake
        const bouncePhase = Math.sin(localFrame * 0.4) * 0.5 + 0.5;
        scale = interpolate(
            localFrame,
            [0, fadeInDuration * 0.5, fadeInDuration],
            [0.8, 1.12, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        translateX = Math.sin(localFrame * 0.6) * 3;
        translateY = interpolate(
            localFrame,
            [0, fadeInDuration, fadeOutStart, lineDuration],
            [40, 0, 0, -20],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.bounce) }
        );
    } else if (section === 'bridge') {
        // Impact / slam effect
        scale = interpolate(
            localFrame,
            [0, 3, 8],
            [1.5, 0.95, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
        );
        translateY = interpolate(
            localFrame,
            [0, 3, 8],
            [-50, 5, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
    } else if (section === 'outro') {
        // Gentle float up
        translateY = interpolate(
            localFrame,
            [0, lineDuration],
            [15, -10],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        scale = interpolate(
            localFrame,
            [0, fadeInDuration],
            [0.95, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
    } else {
        // Default verse: slide up with subtle scale
        translateY = interpolate(
            localFrame,
            [0, fadeInDuration, fadeOutStart, lineDuration],
            [35, 0, 0, -25],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
        );
        scale = interpolate(
            localFrame,
            [0, fadeInDuration * 0.6, fadeInDuration],
            [0.92, 1.04, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
    }

    // Glow intensity
    const glowIntensity = interpolate(
        localFrame,
        [0, fadeInDuration, fadeOutStart, lineDuration],
        [0, 20, 20, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Font size based on section
    const getFontSize = () => {
        if (section === 'chorus') return '52px';
        if (section === 'bridge') return '50px';
        if (section === 'intro') return '46px';
        if (section === 'outro') return '42px';
        return '44px';
    };

    // Section label visibility
    const showSectionLabel = isSectionChange && localFrame < 25;
    const sectionLabelOpacity = showSectionLabel
        ? interpolate(localFrame, [0, 5, 20, 25], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
        : 0;

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily,
                textAlign: 'center',
                padding: '40px 50px',
                background: colors.bg,
            }}
        >
            {/* Section label */}
            {sectionLabelOpacity > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: colors.primary,
                        opacity: sectionLabelOpacity,
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                    }}
                >
                    {sectionLabels[section] || section.toUpperCase()}
                </div>
            )}

            {/* Decorative top line */}
            <div
                style={{
                    position: 'absolute',
                    top: '100px',
                    left: '15%',
                    width: '70%',
                    height: '1px',
                    background: `linear-gradient(to right, transparent, ${colors.glow}, transparent)`,
                    opacity: opacity * 0.5,
                }}
            />

            {/* Main lyric text */}
            <div
                style={{
                    opacity,
                    transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotate(${rotation}deg)`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxWidth: '90%',
                }}
            >
                <h1
                    style={{
                        fontSize: getFontSize(),
                        fontWeight: section === 'chorus' ? 900 : 700,
                        color: section === 'chorus' ? colors.primary : '#FFFFFF',
                        textShadow: `
              0 0 ${glowIntensity}px ${colors.glow},
              0 0 ${glowIntensity * 2}px ${colors.glow},
              0 4px 15px rgba(0, 0, 0, 0.7)
            `,
                        margin: 0,
                        letterSpacing: section === 'chorus' ? '3px' : '1.5px',
                        lineHeight: 1.4,
                        textTransform: section === 'chorus' ? 'uppercase' : 'none',
                    }}
                >
                    {currentLine.line}
                </h1>
            </div>

            {/* Decorative bottom line */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '100px',
                    left: '15%',
                    width: '70%',
                    height: '1px',
                    background: `linear-gradient(to right, transparent, ${colors.glow}, transparent)`,
                    opacity: opacity * 0.5,
                }}
            />

            {/* Progress indicator at bottom */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '50px',
                    left: '10%',
                    width: '80%',
                    height: '3px',
                    borderRadius: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${(localFrame / lineDuration) * 100}%`,
                        height: '100%',
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.glow})`,
                        borderRadius: '2px',
                        boxShadow: `0 0 8px ${colors.glow}`,
                        transition: 'width 0.05s linear',
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
