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
}

export interface EmergencyChecklists {
	aircraft: string
	checklists: EmergencyChecklist[]
}
