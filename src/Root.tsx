import { Composition } from "remotion";
import { Video } from "./Video";
import { CONFIG, FPS } from "./config";
import { H, W } from "./layout";
import { TOTAL } from "./timeline";
import { BrandPreview } from "./scenes/BrandPreview";
import { CoverScene } from "./scenes/CoverScene";
import { DemoDesk, DemoLogo, DemoPhoneScreen, DemoScreen } from "./demo/DemoAssets";

export const RemotionRoot: React.FC = () => (
  <>
    {/* The video described by video.config.json */}
    <Composition id="Video" component={Video} durationInFrames={Math.max(1, TOTAL)} fps={FPS} width={W} height={H} />

    {/* Poster / thumbnail (npm run cover) */}
    <Composition id="Cover" component={CoverScene} durationInFrames={1} fps={FPS} width={W} height={H} />

    {/* Brand kit preview (npm run brand:preview) */}
    <Composition id="BrandPreview" component={BrandPreview} durationInFrames={1} fps={FPS} width={W} height={H} />

    {/* Maintainer tools: generate the fictional demo images (npm run demo-assets) */}
    <Composition
      id="DemoScreen"
      component={DemoScreen}
      durationInFrames={1}
      fps={30}
      width={1280}
      height={900}
      defaultProps={{ state: "before" as const }}
    />
    <Composition
      id="DemoPhoneScreen"
      component={DemoPhoneScreen}
      durationInFrames={1}
      fps={30}
      width={780}
      height={1688}
      defaultProps={{ state: "before" as const }}
    />
    <Composition id="DemoDesk" component={DemoDesk} durationInFrames={1} fps={30} width={1600} height={1067} />
    <Composition id="DemoLogo" component={DemoLogo} durationInFrames={1} fps={30} width={520} height={160} />
  </>
);

// Title shown in Remotion Studio
export const TITLE = CONFIG.title;
