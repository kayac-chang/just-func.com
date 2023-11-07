import fs from "fs/promises";

export const readFileUtf8 = (pathname: string) =>
  fs.readFile(pathname, "utf-8");
