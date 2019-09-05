import { GITHUB } from "@/const/path";
import { system } from "@/const/system";

const ANNIE_AUTHOR = "ytdl-org";
const ANNIE_REPO = "youtube-dl";

export const getYoutubeAssets = async () => {
  const { assets } = await (await fetch(
    GITHUB.LASTEST_RELEASE(ANNIE_AUTHOR, ANNIE_REPO)
  )).json();
  const { platform } = system;
  if (platform === "Windows") {
    return assets.filter(({ name }) => /.exe$/.test(name))[0];
  } else {
    return assets.filter(({ name }) => name === "youtube-dl")[0];
  }
};
