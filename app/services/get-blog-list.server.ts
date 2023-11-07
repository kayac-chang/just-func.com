import glob from "fast-glob";
import { map } from "ramda";
import { readFileUtf8 } from "./fs.server";

export default () =>
  glob("blogs/**/*.mdx")
    .then(
      map((pathname) =>
        readFileUtf8(pathname).then((content) => ({ pathname, content }))
      )
    )
    .then((files) => Promise.all(files));
