const GITHUB_V3_HOST = "https://api.github.com";

export const GITHUB = {
  LASTEST_RELEASE: (user, repo) =>
    `${GITHUB_V3_HOST}/repos/${user}/${repo}/releases/latest`
};
