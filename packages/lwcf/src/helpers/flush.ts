export async function flush() {
  const promise = new Promise(resolve =>
    process.stdout.once("drain", () => resolve())
  );
  process.stdout.write("");
  return promise;
}
