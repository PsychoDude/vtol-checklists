export const checklists = [
	{
		aircraft: 'F-45A',
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup',
				file: 'f45-startup.md',
				related: [
					'f45-takeoff-runway.md',
					'f45-takeoff-CATOBAR.md',
					'f45-short-takeoff.md',
					'f45-vcap.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (RWY)',
				file: 'f45-takeoff-runway.md',
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (RWY)',
				file: 'f45-landing-runway.md',
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (CARRIER)',
				file: 'f45-takeoff-CATOBAR.md',
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (CARRIER)',
				file: 'f45-landing-CATOBAR-preface.md',
				related: ['f45-landing-CATOBAR.md'],
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Landing Carrier - CASE I',
				file: 'f45-landing-CATOBAR.md',
				related: ['f45-landing-CATOBAR-preface.md'],
				hidden: true,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'V/STOL',
				file: 'f45-svtol.md',
				related: ['f45-short-takeoff.md', 'f45-vtol-landing.md'],
				hidden: false,
				showGlobal: false,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Short Takeoff',
				file: 'f45-short-takeoff.md',
				related: ['f45-vtol-landing.md'],
				hidden: true,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Vertical Landing',
				file: 'f45-vtol-landing.md',
				hidden: true,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'VCAP',
				file: 'f45-vcap.md',
				related: ['f45-svtol.md'],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
		],
	},
]

export const globalCarrierChecklists = [
	{
		type: 'global',
		name: 'Flight Deck Overview',
		file: 'flightdeck-overview.md',
		hidden: true,
	},
	{
		type: 'global',
		name: 'Wave Off',
		file: 'wave-off.md',
		showEmergencies: true,
	},
	{
		type: 'global',
		name: 'LSO Guidance',
		file: 'lso-guidance.md',
		related: ['wave-off.md'],
	},
	{
		type: 'global',
		name: 'Carrier Lights (Meatball) Img',
		file: 'meatball.md',
	},
	{ type: 'global', name: 'Case 1 Diagram', file: 'case-1.md' },
]

export const emergencyChecklists = [
	{
		aircraft: 'F-45A',
		checklists: [
			{
				type: 'emergency',
				name: 'Engine Failure',
				file: 'f45-emerg-enginefailure.md',
			},
			{
				type: 'emergency',
				name: 'Missile Impact',
				file: 'f45-emerg-missileimpact.md',
			},
			{
				type: 'emergency',
				name: 'Flight Control Failure',
				file: 'f45-emerg-flightcontrol.md',
			},
		],
	},
]

export const globalPages = [
	{
		type: 'page',
		for: 'carrier',
		name: 'Carrier Operations',
		file: 'carrier-ops.md',
	},
]
