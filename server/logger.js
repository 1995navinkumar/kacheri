export function createLogger({ moduleName }) {
  return {
    log: (message) =>
      console.log(JSON.stringify({ moduleName, message, level: "info" })),
    warn: (message) => console.log({ moduleName, message, level: "warning" }),
    error: (err) =>
      console.error(
        JSON.stringify({ moduleName, error: err.stack, level: "fatal" })
      ),
  };
}

export default createLogger("default");
