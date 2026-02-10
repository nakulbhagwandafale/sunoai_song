import React from 'react';
import {
    AbsoluteFill,
    Img,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    staticFile,
} from 'remotion';
import lyricsData from '../public/lyrics.json';

// Image descriptions for fallback colored placeholders when images aren't available
const imageDescriptions = [
    '📱 Salary Notification',     // 0 - Intro
    '💸 Salary Gone',             // 1 - Verse 1 part 1
    '😰 Office Stress',           // 2 - Verse 1 part 2
    '🏛️ Tax Deduction',          // 3 - Verse 1 part 3
    '😤 Tax Frustration',         // 4 - Chorus
    '📺 Budget Speech',           // 5 - Verse 2 part 1
    '⛽ Rising Prices',           // 6 - Verse 2 part 2
    '🏃 Salary In & Out',         // 7 - Verse 2 part 3
    '💳 Bills & EMI',             // 8 - Bridge part 1
    '🏦 Empty Savings',           // 9 - Bridge part 2
    '📢 Tax Protest',             // 10 - Chorus repeat
    '✌️ Peace Out',               // 11 - Outro
];

const imageColors = [
    '#1a1a2e', '#2d1b69', '#4a1942', '#1b2838',
    '#6b2037', '#1a3a2e', '#3d1f00', '#2e1a3a',
    '#4a1a1a', '#1a2e3d', '#6b3720', '#1a2e1a',
];

// Check if an image file exists - we'll use a try/catch approach with Img
const IMAGE_COUNT = 12;

export const ImagePanel: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTimeSeconds = frame / fps;

    // Find current lyric line to get imageIndex
    const currentLine = lyricsData.find(
        (line) => currentTimeSeconds >= line.start && currentTimeSeconds < line.end
    );

    // Find previous line for crossfade
    const currentLineIndex = lyricsData.findIndex(
        (line) => currentTimeSeconds >= line.start && currentTimeSeconds < line.end
    );
    const prevLine = currentLineIndex > 0 ? lyricsData[currentLineIndex - 1] : null;

    const currentImageIndex = currentLine ? currentLine.imageIndex : 0;
    const prevImageIndex = prevLine ? prevLine.imageIndex : currentImageIndex;
    const isImageChanging = prevImageIndex !== currentImageIndex;

    // Calculate crossfade
    let crossfadeProgress = 1;
    if (isImageChanging && currentLine) {
        const lineStartFrame = currentLine.start * fps;
        const localFrame = frame - lineStartFrame;
        crossfadeProgress = interpolate(localFrame, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
    }

    // Ken Burns effect - slow zoom and pan
    const kenBurnsScale = interpolate(
        frame % (fps * 8),
        [0, fps * 8],
        [1, 1.15],
        { extrapolateRight: 'clamp' }
    );

    const kenBurnsX = interpolate(
        frame % (fps * 12),
        [0, fps * 12],
        [-2, 2],
        { extrapolateRight: 'clamp' }
    );

    const kenBurnsY = interpolate(
        frame % (fps * 10),
        [0, fps * 10],
        [-1, 1],
        { extrapolateRight: 'clamp' }
    );

    const renderImageOrPlaceholder = (index: number, opacity: number) => {
        const imagePath = staticFile(`images/scene_${String(index + 1).padStart(2, '0')}.webp`);

        return (
            <AbsoluteFill
                key={`img-${index}`}
                style={{
                    opacity,
                    overflow: 'hidden',
                }}
            >
                {/* Placeholder Background (always rendered behind) */}
                <AbsoluteFill
                    style={{
                        transform: `scale(${kenBurnsScale}) translate(${kenBurnsX}%, ${kenBurnsY}%)`,
                        background: `
              radial-gradient(ellipse at center, ${imageColors[index]}dd, ${imageColors[index]}),
              linear-gradient(135deg, ${imageColors[index]}, #000000)
            `,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* Decorative elements for placeholder */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: `
                radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(255,200,100,0.06) 0%, transparent 40%)
              `,
                        }}
                    />

                    {/* Main Emoji/Icon - HUGE now */}
                    <div
                        style={{
                            fontSize: '350px',
                            textAlign: 'center',
                            zIndex: 2,
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
                        }}
                    >
                        {imageDescriptions[index]?.split(' ')[0]}
                    </div>

                    {/* Caption Text - Larger and bolder */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '120px',
                            fontSize: '40px',
                            fontWeight: 800,
                            color: 'rgba(255,255,255,0.9)',
                            fontFamily: 'sans-serif',
                            letterSpacing: '6px',
                            textTransform: 'uppercase',
                            zIndex: 2,
                            textShadow: '0 4px 10px rgba(0,0,0,0.8)',
                        }}
                    >
                        {imageDescriptions[index]?.split(' ').slice(1).join(' ')}
                    </div>

                    {/* Animated particles */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const particleX = interpolate(
                            (frame + i * 40) % 200,
                            [0, 200],
                            [10 + i * 15, 20 + i * 12]
                        );
                        const particleY = interpolate(
                            (frame + i * 60) % 250,
                            [0, 250],
                            [110, -10]
                        );
                        const particleOpacity = interpolate(
                            (frame + i * 30) % 150,
                            [0, 75, 150],
                            [0, 0.6, 0]
                        );
                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: `${particleX}%`,
                                    top: `${particleY}%`,
                                    width: `${8 + (i % 3) * 4}px`,
                                    height: `${8 + (i % 3) * 4}px`,
                                    borderRadius: '50%',
                                    background: 'rgba(255, 200, 100, 0.6)',
                                    opacity: particleOpacity,
                                    boxShadow: '0 0 15px rgba(255, 200, 100, 0.4)',
                                }}
                            />
                        );
                    })}
                </AbsoluteFill>

                {/* Actual Image (Overlays placeholder if file exists) */}
                <Img
                    src={imagePath}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${kenBurnsScale}) translate(${kenBurnsX}%, ${kenBurnsY}%)`,
                    }}
                    // Hide if it fails to load (fallback to placeholder)
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />

                {/* Vignette overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
                        pointerEvents: 'none',
                        zIndex: 5,
                    }}
                />
            </AbsoluteFill>
        );
    };

    return (
        <AbsoluteFill>
            {/* Previous image (fading out) */}
            {isImageChanging && crossfadeProgress < 1 && (
                renderImageOrPlaceholder(prevImageIndex, 1 - crossfadeProgress)
            )}

            {/* Current image (fading in) */}
            {renderImageOrPlaceholder(currentImageIndex, isImageChanging ? crossfadeProgress : 1)}

            {/* Image caption overlay */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '20px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.25)',
                    fontFamily: 'sans-serif',
                    fontStyle: 'italic',
                }}
            >
                {imageDescriptions[currentImageIndex]}
            </div>
        </AbsoluteFill>
    );
};
