import { AbsoluteFill } from 'remotion';
import React from 'react';

export const Background: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', // Dark premium gradient
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />
        </AbsoluteFill>
    );
};
