export const checklists = [
	{
		aircraft: 'F-45A',
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup',
				file: 'f45-startup.md',
				related: ['f45-takeoff-runway.md'],
				hidden: false,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (RWY)',
				file: 'f45-takeoff-runway.md',
				hidden: false,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'Landing (RWY)',
				file: 'f45-landing-runway.md',
				hidden: false,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (CARRIER)',
				file: 'f45-takeoff-CATOBAR.md',
				hidden: false,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'Landing (CARRIER)',
				file: 'f45-landing-CATOBAR-preface.md',
				related: ['f45-landing-CATOBAR.md'],
				hidden: false,
				showGlobal: true,
			},
			{
				type: 'aircraft',
				name: 'Landing Carrier - CASE I',
				file: 'f45-landing-CATOBAR.md',
				related: ['f45-landing-CATOBAR-preface.md'],
				hidden: true,
				showGlobal: true,
			},
			{
				type: 'aircraft',
				name: 'V/STOL',
				file: 'f45-svtol.md',
				related: ['f45-short-takeoff.md', 'f45-vtol-landing.md'],
				hidden: false,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'Short Takeoff',
				file: 'f45-short-takeoff.md',
				related: ['f45-svtol.md', 'f45-vtol-landing.md'],
				hidden: true,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'Vertical Landing',
				file: 'f45-vtol-landing.md',
				related: ['f45-svtol.md'],
				hidden: true,
				showGlobal: false,
			},
			{
				type: 'aircraft',
				name: 'VCAP',
				file: 'f45-vcap.md',
				related: ['f45-svtol.md'],
				hidden: false,
				showGlobal: false,
			},
		],
	},
]

export const globalChecklists = [
	{ type: 'global', name: 'Wave Off', file: 'wave-off.md' },
	{
		type: 'global',
		name: 'LSO Guidance',
		file: 'lso-guidance.md',
		related: ['wave-off.md'],
	},
]
