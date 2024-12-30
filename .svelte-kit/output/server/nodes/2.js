

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BVlSMjsQ.js","_app/immutable/chunks/scheduler.DiXKfncd.js","_app/immutable/chunks/index.BAnE-9JA.js"];
export const stylesheets = [];
export const fonts = [];
