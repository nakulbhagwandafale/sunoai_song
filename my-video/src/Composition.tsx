import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { Background } from './Background';
import { Lyrics } from './Lyrics';
import { CameraMotion } from './CameraMotion';

export const MyComposition = () => {
    return (
        <AbsoluteFill>
            <Background />
            <CameraMotion>
                <Lyrics />
            </CameraMotion>
            <Audio src={staticFile("Maharashtrachi Rajdhani Mumbai.mp3")} />
        </AbsoluteFill>
    );
};
