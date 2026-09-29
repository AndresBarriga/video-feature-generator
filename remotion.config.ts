import { Config } from "@remotion/cli/config";

// Your screenshots, photos and logo live in ./assets (not ./public).
Config.setPublicDir("./assets");
// PNG frames + yuv420p = correct colors on LinkedIn, Instagram, YouTube.
// (JPEG frames give full-range video that looks washed out on social.)
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18);
Config.setOverwriteOutput(true);
