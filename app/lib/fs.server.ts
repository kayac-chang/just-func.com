import fs from "fs/promises";
import path from "path";

export const readFileUtf8 = (pathname: string) =>
  fs.readFile(pathname, "utf-8");

export const readFileInRepo = (pathname: string) =>
  readFileUtf8(path.resolve(process.cwd(), pathname));
