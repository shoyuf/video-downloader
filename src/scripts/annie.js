import { GITHUB } from "@/const/path";
import { system } from "@/const/system";

const ANNIE_AUTHOR = "iawia002";
const ANNIE_REPO = "annie";

export const getAnnieAssets = async () => {
  const { assets, tag_name } = await (await fetch(
    GITHUB.LASTEST_RELEASE(ANNIE_AUTHOR, ANNIE_REPO)
  )).json();

  const { platform, arch } = system;
  const reg = new RegExp(platform + ".?" + arch, "i");
  const file = assets.filter(({ name }) => reg.test(name))[0];
  if (!file) {
    throw new Error("not found annie download link");
  }
  return Object.assign({}, file, {
    tag_name
  });
};
