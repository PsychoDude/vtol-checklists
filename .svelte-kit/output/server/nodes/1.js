

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B7WdrAwW.js","_app/immutable/chunks/scheduler.DiXKfncd.js","_app/immutable/chunks/index.BAnE-9JA.js","_app/immutable/chunks/entry.qMgKNMR6.js"];
export const stylesheets = [];
export const fonts = [];
