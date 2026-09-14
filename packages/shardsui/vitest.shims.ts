// `@testing-library/vue` reads `process.env` at import time; browser mode has no `process`.
globalThis.process ??= { env: {} } as NodeJS.Process
