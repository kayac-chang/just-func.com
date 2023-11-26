import glob from "fast-glob";
import { map } from "ramda";
import { readFileUtf8 } from "~/lib/fs.server";
import { P, match } from "ts-pattern";
import githubGetContent from "~/services/github-get-contnet.server";
import { assert } from "@sindresorhus/is";

const getBlogListGithub = () =>
  githubGetContent(`/blogs`)
    .then((res) => {
      assert.array(res);
      return res;
    })
    .then(
      map((file) =>
        githubGetContent(file.path)
          .then((res) => {
            assert.string(res);
            return res;
          })
          .then((content) => ({ pathname: file.path, content }))
      )
    )
    .then((files) => Promise.all(files));

const getBlogListLocal = () =>
  glob("blogs/*")
    .then(
      map((pathname) =>
        readFileUtf8(pathname).then((content) => ({ pathname, content }))
      )
    )
    .then((files) => Promise.all(files));

const getBlogList = () =>
  match(process.env.NODE_ENV)
    .with(P.union("development", "test"), getBlogListLocal)
    .with("production", getBlogListGithub)
    .exhaustive();

export default getBlogList;
