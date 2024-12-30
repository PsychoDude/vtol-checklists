export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.D8zWOqV6.js","app":"_app/immutable/entry/app.BLDN7fho.js","imports":["_app/immutable/entry/start.D8zWOqV6.js","_app/immutable/chunks/entry.qMgKNMR6.js","_app/immutable/chunks/scheduler.DiXKfncd.js","_app/immutable/entry/app.BLDN7fho.js","_app/immutable/chunks/scheduler.DiXKfncd.js","_app/immutable/chunks/index.BAnE-9JA.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/checklists/[file]",
				pattern: /^\/checklists\/([^/]+?)\/?$/,
				params: [{"name":"file","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/checklists/_file_/_server.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
