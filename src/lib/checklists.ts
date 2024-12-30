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
				hidden: true,
				showGlobal: true,
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
