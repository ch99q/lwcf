export function handle(err: any) {
  try {
    if (!err) err = new Error("no error?");
    if (err.message === "SIGINT") process.exit(1);

    const exitCode = err.exit !== undefined ? err.exit : 1;
    if (err.code !== "EEXIT") {
      console.log(err);
      process.exit(exitCode);
    } else process.exit(exitCode);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
