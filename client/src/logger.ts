export function createLogger({ moduleName }: { moduleName: string }) {
  return {
    log: (message: string) =>
      console.log(JSON.stringify({ moduleName, message, level: "info" })),
    warn: (message: string) =>
      console.log(JSON.stringify({ moduleName, message, level: "warning" })),
    error: (err: unknown) =>
      console.error(
        JSON.stringify({ moduleName, error: err?.stack, level: "fatal" })
      ),
  };
}

export default createLogger({ moduleName: "default" });
