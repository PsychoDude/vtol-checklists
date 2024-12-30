export interface Checklist {
	type: string
	name: string
	file: string
	hidden: boolean
	showGlobal: boolean
	related?: string[]
}

export interface GlobalChecklist {
	type: string
	name: string
	file: string
	related?: string[]
	showGlobal?: boolean
}
