export interface Checklist {
	type: string
	name: string
	file: string
	for?: string
	related?: string[]
	showGlobal?: boolean
	showEmergencies?: boolean
	hidden?: boolean
}

export interface EmergencyChecklist {
	type: string
	name: string
	file: string
	related?: string[]
}

export interface EmergencyChecklists {
	aircraft: string
	checklists: EmergencyChecklist[]
}

export interface ChecklistItem {
	type: string
	name: string
	file: string
	for?: string
	related?: string[]
	hidden?: boolean
	showGlobal?: boolean
	showEmergencies?: boolean
}

export interface AircraftChecklists {
	aircraft: string
	hidden: boolean
	checklists: ChecklistItem[]
}
