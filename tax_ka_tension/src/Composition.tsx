import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { Background } from './Background';
import { LyricsPanel } from './LyricsPanel';
import { ImagePanel } from './ImagePanel';
import { BeatEffects } from './BeatEffects';

export const TaxKaTension = () => {
    return (
        <AbsoluteFill>
            <Background />
            <BeatEffects>
                <AbsoluteFill
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    {/* Left Half - Lyrics */}
                    <div
                        style={{
                            width: '50%',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <LyricsPanel />
                    </div>

                    {/* Center Divider */}
                    <div
                        style={{
                            width: '3px',
                            height: '100%',
                            background:
                                'linear-gradient(to bottom, transparent, rgba(255, 200, 80, 0.6), rgba(255, 180, 50, 0.8), rgba(255, 200, 80, 0.6), transparent)',
                            boxShadow: '0 0 15px rgba(255, 200, 80, 0.3)',
                            zIndex: 10,
                        }}
                    />

                    {/* Right Half - Images */}
                    <div
                        style={{
                            width: '50%',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <ImagePanel />
                    </div>
                </AbsoluteFill>
            </BeatEffects>
            <Audio src={staticFile('Tax Ka Tension.mp3')} />
        </AbsoluteFill>
    );
};
