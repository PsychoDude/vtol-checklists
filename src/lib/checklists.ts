export const checklists = [
	{
		aircraft: 'F-45A',
		hidden: false,
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup',
				file: 'f45-startup.md',
				related: [
					'f45-takeoff-runway.md',
					'f45-takeoff-CATOBAR.md',
					'f45-takeoff-short.md',
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
				related: [
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
					'f45-vcap.md',
				],
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
				related: [
					'carrier-departure.md',
					'carrier-flightdeck-overview.md',
					'carrier-case-1.md',
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
					'f45-vcap.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'page',
				name: 'Landing (CARRIER)',
				file: 'f45-landing-CATOBAR-preface.md',
				related: [
					'f45-landing-CATOBAR.md',
					'carrier-marshal.md',
					'carrier-case-1-final.md',
					'carrier-case-1.md',
				],
				for: 'aircraft',
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Carrier Landing - CASE I',
				file: 'f45-landing-CATOBAR.md',
				hidden: true,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'page',
				name: 'V/STOL',
				file: 'f45-svtol.md',
				related: ['f45-takeoff-short.md', 'f45-landing-vtol.md'],
				for: 'aircraft',
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Short Takeoff',
				file: 'f45-takeoff-short.md',
				related: [
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
					'f45-vcap.md',
				],
				hidden: true,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Vertical Landing',
				file: 'f45-landing-vtol.md',
				hidden: true,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'VCAP',
				file: 'f45-vcap.md',
				related: [
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Weapons',
				file: 'f45-weapons.md',
				hidden: false,
				showGlobal: true,
				showEmergencies: true,
			},
		],
	},
	{
		aircraft: 'F/A-26B',
		hidden: false,
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup',
				file: 'f26-startup.md',
				related: ['f26-takeoff-runway.md', 'f26-takeoff-CATOBAR.md'],
				hidden: false,
				showGlobal: false,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (RWY)',
				file: 'f26-takeoff-runway.md',
				related: [
					'f26-landing-runway.md',
					'f26-landing-CATOBAR-preface.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (RWY)',
				file: 'f26-landing-runway.md',
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (CARRIER)',
				file: 'f26-takeoff-CATOBAR.md',
				related: [
					'carrier-departure.md',
					'carrier-flightdeck-overview.md',
					'carrier-case-1.md',
					'f26-landing-runway.md',
					'f26-landing-CATOBAR-preface.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'page',
				name: 'Landing (CARRIER)',
				file: 'f26-landing-CATOBAR-preface.md',
				related: [
					'f26-landing-CATOBAR.md',
					'carrier-marshal.md',
					'carrier-case-1-final.md',
					'carrier-case-1.md',
				],
				for: 'aircraft',
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Carrier Landing - CASE I',
				file: 'f26-landing-CATOBAR.md',
				hidden: true,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Weapons',
				file: 'f26-weapons.md',
				hidden: false,
				showGlobal: true,
				showEmergencies: true,
			},
		],
	},
	{
		aircraft: 'EF-24G',
		hidden: false,
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup',
				file: 'ef24-startup.md',
				related: [
					'ef24-wings.md',
					'ef24-takeoff-runway.md',
					'ef24-takeoff-CATOBAR.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (RWY)',
				file: 'ef24-takeoff-runway.md',
				related: [
					'ef24-wings.md',
					'ef24-landing-runway.md',
					'ef24-landing-CATOBAR-preface.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (RWY)',
				file: 'ef24-landing-runway.md',
				related: ['ef24-wings.md'],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (CARRIER)',
				file: 'ef24-takeoff-CATOBAR.md',
				related: [
					'carrier-departure.md',
					'carrier-flightdeck-overview.md',
					'ef24-wings.md',
					'carrier-case-1.md',
					'ef24-landing-runway.md',
					'ef24-landing-CATOBAR-preface.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'page',
				name: 'Landing (CARRIER)',
				file: 'ef24-landing-CATOBAR-preface.md',
				related: [
					'ef24-wings.md',
					'ef24-landing-CATOBAR.md',
					'carrier-marshal.md',
					'carrier-case-1-final.md',
					'carrier-case-1.md',
				],
				for: 'aircraft',
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Carrier Landing - CASE I',
				file: 'ef24-landing-CATOBAR.md',
				related: ['ef24-wings.md'],
				hidden: true,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Swept Wings',
				file: 'ef24-wings.md',
				related: [
					'ef24-takeoff-runway.md',
					'ef24-landing-runway.md',
					'ef24-takeoff-CATOBAR.md',
					'ef24-landing-CATOBAR.md',
				],
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
		],
	},
	{
		aircraft: 'AH-94',
		hidden: false,
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup (PIC)',
				file: 'ah94-startup-pic.md',
				related: ['ah94-startup-cpg.md'],
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Startup (CPG)',
				file: 'ah94-startup-cpg.md',
				related: ['ah94-startup-pic.md'],
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (VERTICAL)',
				file: 'ah94-takeoff-vert.md',
				related: ['ah94-landing-vert.md', 'ah94-landing-rollhov.md'],
				hidden: false,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (VERTICAL)',
				file: 'ah94-landing-vert.md',
				hidden: false,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (ROLL/HOV)',
				file: 'ah94-takeoff-rollhov.md',
				related: ['ah94-landing-vert.md', 'ah94-landing-rollhov.md'],
				hidden: false,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (ROLL/HOV)',
				file: 'ah94-landing-rollhov.md',
				hidden: false,
				showGlobal: true,
				showEmergencies: true,
			},
		],
	},
	{
		aircraft: 'T-55',
		hidden: false,
		checklists: [
			{
				type: 'aircraft',
				name: 'Startup',
				file: 't55-startup.md',
				related: ['t55-takeoff-runway.md', 't55-takeoff-CATOBAR.md'],
				hidden: false,
				showGlobal: false,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (RWY)',
				file: 't55-takeoff-runway.md',
				related: [
					't55-landing-runway.md',
					't55-landing-CATOBAR-preface.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Landing (RWY)',
				file: 't55-landing-runway.md',
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'aircraft',
				name: 'Takeoff (CARRIER)',
				file: 't55-takeoff-CATOBAR.md',
				related: [
					'carrier-departure.md',
					'carrier-flightdeck-overview.md',
					'carrier-case-1.md',
					't55-landing-runway.md',
					't55-landing-CATOBAR-preface.md',
				],
				hidden: false,
				showGlobal: false,
				showEmergencies: true,
			},
			{
				type: 'page',
				name: 'Landing (CARRIER)',
				file: 't55-landing-CATOBAR-preface.md',
				related: [
					't55-landing-CATOBAR.md',
					'carrier-marshal.md',
					'carrier-case-1-final.md',
					'carrier-case-1.md',
				],
				for: 'aircraft',
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Carrier Landing - CASE I',
				file: 't55-landing-CATOBAR.md',
				hidden: true,
				showGlobal: true,
				showEmergencies: true,
			},
			{
				type: 'page',
				name: 'Basic Ops',
				file: 't55-basic-page.md',
				related: ['t55-basic-resp.md', 't55-basic-ops.md'],
				hidden: false,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Reponsabilities',
				file: 't55-basic-resp.md',
				related: ['t55-basic-ops.md'],
				hidden: true,
				showGlobal: true,
				showEmergencies: false,
			},
			{
				type: 'aircraft',
				name: 'Controls',
				file: 't55-basic-ops.md',
				related: ['t55-basic-resp.md'],
				hidden: true,
				showGlobal: true,
				showEmergencies: false,
			},
		],
	},
	{
		aircraft: 'carrier',
		hidden: true,
		checklists: [
			{
				type: 'global',
				name: 'Flight Deck Overview',
				file: 'carrier-flightdeck-overview.md',
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'global',
				name: 'Departure',
				file: 'carrier-departure.md',
				related: ['carrier-case-1.md'],
				showGlobal: false,
				hidden: true,
			},
			{
				type: 'page',
				for: 'carrier',
				name: 'Carrier Operations',
				file: 'carrier-ops.md',
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'global',
				name: 'Wave Off',
				file: 'carrier-waveoff.md',
				related: ['carrier-case-1.md'],
				showGlobal: true,
				showEmergencies: true,
				hidden: false,
			},
			{
				type: 'global',
				name: 'LSO Guidance',
				file: 'carrier-lso-guidance.md',
				related: ['carrier-waveoff.md'],
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'page',
				name: 'Case 1 Ops',
				file: 'carrier-case-1.md',
				related: [
					'carrier-departure.md',
					'carrier-marshal.md',
					'carrier-case-1-final.md',
				],
				for: 'carrier-ops.md',
				showGlobal: true,
				hidden: true,
			},
			{
				type: 'global',
				name: 'Marshal Stack Pattern',
				file: 'carrier-marshal.md',
				related: ['carrier-case-1-final.md'],
				showGlobal: false,
				hidden: true,
			},
			{
				type: 'global',
				name: 'Final Approach',
				file: 'carrier-case-1-final.md',
				showGlobal: false,
				hidden: true,
			},
			{
				type: 'global',
				name: 'Carrier Lights (Meatball) Img',
				file: 'carrier-meatball.md',
				showGlobal: true,
				hidden: false,
			},
		],
	},
	{
		aircraft: 'global',
		hidden: true,
		checklists: [
			{
				type: 'page',
				name: 'Global',
				file: 'global.md',
				related: ['audio-cues.md', 'rwr.md'],
				for: 'global',
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'info',
				name: 'Audio Cues',
				file: 'audio-cues.md',
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'info',
				name: 'RWR',
				file: 'rwr.md',
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'important',
				name: 'Credits',
				file: 'credits.md',
				related: ['licenses.md'],
				showGlobal: true,
				hidden: false,
			},
			{
				type: 'important',
				name: 'Licenses',
				file: 'licenses.md',
				related: ['credits.md'],
				showGlobal: true,
				hidden: false,
			},
		],
	},
]

export const emergencyChecklists = [
	{
		aircraft: 'F-45A',
		checklists: [
			{
				type: 'emergency',
				name: 'Engine Failure',
				file: 'f45-emerg-enginefailure.md',
				hidden: false,
				related: [
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
				],
			},
			{
				type: 'emergency',
				name: 'Missile Impact',
				file: 'f45-emerg-missileimpact.md',
				hidden: false,
				related: [
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
				],
			},
			{
				type: 'emergency',
				name: 'Flight Controls Failure',
				file: 'f45-emerg-flightcontrol.md',
				hidden: false,
				related: [
					'f45-landing-runway.md',
					'f45-landing-CATOBAR-preface.md',
					'f45-landing-vtol.md',
				],
			},
		],
	},
	{
		aircraft: 'F/A-26B',
		checklists: [
			{
				type: 'emergency',
				name: 'Engine Failure',
				file: 'f26-emerg-enginefailure.md',
				related: [
					'f26-landing-runway.md',
					'f26-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Missile Impact',
				file: 'f26-emerg-missileimpact.md',
				related: [
					'f26-landing-runway.md',
					'f26-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Flight Controls Failure',
				file: 'f26-emerg-flightcontrol.md',
				related: [
					'f26-landing-runway.md',
					'f26-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
		],
	},
	{
		aircraft: 'EF-24G',
		checklists: [
			{
				type: 'emergency',
				name: 'Engine Failure',
				file: 'ef24-emerg-enginefailure.md',
				related: [
					'ef24-landing-runway.md',
					'ef24-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Missile Impact',
				file: 'ef24-emerg-missileimpact.md',
				related: [
					'ef24-landing-runway.md',
					'ef24-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Flight Controls Failure',
				file: 'ef24-emerg-flightcontrol.md',
				related: [
					'ef24-landing-runway.md',
					'ef24-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
		],
	},
	{
		aircraft: 'AH-94',
		checklists: [
			{
				type: 'emergency-page',
				name: 'Emergency Checklists',
				file: 'ah94-emerg.md',
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Single Engine Failure',
				file: 'ah94-emerg-singleengine.md',
				related: ['ah94-landing-vert.md', 'ah94-landing-rollhov.md'],
				hidden: true,
			},
			{
				type: 'emergency',
				name: 'Dual Engine Failure',
				file: 'ah94-emerg-dualengine.md',
				related: ['ah94-landing-vert.md', 'ah94-landing-rollhov.md'],
				hidden: true,
			},
			{
				type: 'emergency',
				name: 'Anti-Torque Failure',
				file: 'ah94-emerg-antitorque.md',
				related: ['ah94-landing-vert.md', 'ah94-landing-rollhov.md'],
				hidden: true,
			},
			{
				type: 'emergency',
				name: 'Auto-Rotation',
				file: 'ah94-emerg-autorotation.md',
				related: ['ah94-landing-vert.md', 'ah94-landing-rollhov.md'],
				hidden: true,
			},
		],
	},
	{
		aircraft: 'T-55',
		checklists: [
			{
				type: 'emergency',
				name: 'Engine Failure',
				file: 't55-emerg-enginefailure.md',
				related: [
					't55-landing-runway.md',
					't55-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Missile Impact',
				file: 't55-emerg-missileimpact.md',
				related: [
					't55-landing-runway.md',
					't55-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
			{
				type: 'emergency',
				name: 'Flight Controls Failure',
				file: 't55-emerg-flightcontrol.md',
				related: [
					't55-landing-runway.md',
					't55-landing-CATOBAR-preface.md',
				],
				hidden: false,
			},
		],
	},
]
