import { App } from "octokit";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_APP_IDENTIFIER: string;
      GITHUB_PRIVATE_KEY: string;
      GITHUB_WEBHOOK_SECRET: string;
      GITHUB_INSTALLATION_ID: string;
    }
  }
}

const app = new App({
  appId: process.env.GITHUB_APP_IDENTIFIER,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
  webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET },
});
async function getOctokit() {
  return app.getInstallationOctokit(Number(process.env.GITHUB_INSTALLATION_ID));
}

interface GetFileRequest {
  owner: string;
  repo: string;
  path: string;
}
export async function getFile(req: GetFileRequest) {
  return new Promise((resolve) =>
    getOctokit()
      .then((octokit) =>
        octokit.rest.repos.getContent({
          mediaType: {
            format: "raw",
          },
          ...req,
        })
      )
      .then(resolve)
      .catch(resolve)
  );
}
