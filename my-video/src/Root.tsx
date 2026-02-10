import {Composition, staticFile} from 'remotion';
import {MyComposition} from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={3600} // Adjust based on song length (assuming 30fps)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
