import { Composition } from 'remotion';
import { TaxKaTension } from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="TaxKaTension"
                component={TaxKaTension}
                durationInFrames={2900}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
