import got from "got";
import tar from "tar";

export async function hasExample(name: string): Promise<boolean> {
  const res = await got(
    `https://api.github.com/repos/ch99q/lwcf/contents/examples/${encodeURIComponent(
      name
    )}/package.json`
  ).catch(e => e);
  return res.statusCode === 200;
}

export async function downloadExample(
  root: string,
  name: string
): Promise<void> {
  return await new Promise(async () => {
    await got.stream("https://codeload.github.com/ch99q/lwcf/tar.gz/canary");
    await tar.extract({ cwd: root, strip: 3 }, [
      `next.js-canary/examples/${name}`
    ]);
  });
}
