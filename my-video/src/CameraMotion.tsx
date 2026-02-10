import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const CameraMotion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Gentle camera drift (Zoom in slowly)
    const scale = interpolate(frame, [0, 3600], [1, 1.1], {
        extrapolateRight: "clamp",
    });

    // Beat logic
    // Intro beats: 0-10s (0-300 frames)
    // Intensity beats: 50-55s (1500-1650 frames)

    const beatFrequency = 15; // Every 0.5s approx

    const isIntroBeat = frame < 300 && frame % beatFrequency === 0;
    const isIntenseBeat = frame > 1500 && frame < 1650 && frame % 10 === 0; // Faster beats

    // We can't easily trigger spring on every frame condition in a functional way without state or pre-calculating keys.
    // Instead, let's essentially modulate the scale with a sine wave or noise during those periods.

    let beatPulse = 0;

    if (frame < 300) {
        // Intro: rhythmic pulse
        const beatPhase = (frame % beatFrequency) / beatFrequency;
        if (beatPhase < 0.2) {
            beatPulse = interpolate(beatPhase, [0, 0.2], [0, 0.02], { extrapolateRight: "clamp" });
        } else {
            beatPulse = interpolate(beatPhase, [0.2, 1], [0.02, 0], { extrapolateRight: "clamp" });
        }
    } else if (frame > 1500 && frame < 1650) {
        // Intense: stronger shake/pulse
        const beatPhase = (frame % 10) / 10;
        if (beatPhase < 0.5) {
            beatPulse = interpolate(beatPhase, [0, 0.5], [0, 0.05], { extrapolateRight: "clamp" });
        } else {
            beatPulse = interpolate(beatPhase, [0.5, 1], [0.05, 0], { extrapolateRight: "clamp" });
        }
    }

    const transform = `scale(${scale + beatPulse})`;

    return (
        <AbsoluteFill style={{ transform, transformOrigin: 'center center' }}>
            {children}
        </AbsoluteFill>
    );
};
