import { defineStore } from 'pinia'

// Note type definitions
export const NOTE_TYPES = {
  DEFAULT: 0,
  IMAGE: 1,
  CHECKBOX: 2
} as const

export type NoteType = typeof NOTE_TYPES[keyof typeof NOTE_TYPES]

// Note interfaces
interface BaseNote {
  id: string
  title: string
  description: string
  type: NoteType
  createdAt: string
}

interface DefaultNote extends BaseNote {
  type: typeof NOTE_TYPES.DEFAULT
}

interface ImageNote extends BaseNote {
  type: typeof NOTE_TYPES.IMAGE
  imageUrl: string
}

interface CheckboxNote extends BaseNote {
  type: typeof NOTE_TYPES.CHECKBOX
  items: Array<{
    id: string
    text: string
    checked: boolean
  }>
}

export type Note = DefaultNote | ImageNote | CheckboxNote

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[]
  }),

  getters: {
    getNoteById: (state) => (id: string) => {
      return state.notes.find((note) => note.id === id)
    },
    
    getNotesByType: (state) => (type: NoteType | null) => {
      if (type === null) return state.notes
      return state.notes.filter((note) => note.type === type)
    },
  },

  actions: {
    addNote(type: NoteType = NOTE_TYPES.DEFAULT) {
      const baseNote: BaseNote = {
        id: crypto.randomUUID(),
        title: 'New Note',
        description: 'Click to edit this note',
        type,
        createdAt: new Date().toISOString()
      }

      let note: Note
      switch (type) {
        case NOTE_TYPES.IMAGE:
          note = { ...baseNote, type, imageUrl: '' }
          break
        case NOTE_TYPES.CHECKBOX:
          note = { ...baseNote, type, items: [] }
          break
        default:
          note = { ...baseNote, type: NOTE_TYPES.DEFAULT }
      }

      this.notes.unshift(note)
      return note.id
    },

    updateNote(id: string, updates: Partial<Note>) {
      const index = this.notes.findIndex(note => note.id === id)
      if (index !== -1) {
        this.notes[index] = { ...this.notes[index], ...updates }
      }
    },

    deleteNote(id: string) {
      const index = this.notes.findIndex(note => note.id === id)
      if (index !== -1) {
        this.notes.splice(index, 1)
      }
    },

    getNote(id: string): Note | undefined {
      return this.notes.find(note => note.id === id)
    },

    addCheckboxItem(noteId: string, text: string) {
      const note = this.getNoteById(noteId)
      if (note?.type === NOTE_TYPES.CHECKBOX) {
        if (!note.items) {
          note.items = []
        }
        note.items.push({
          id: crypto.randomUUID(),
          text,
          checked: false,
        })
      }
    },

    toggleCheckboxItem(noteId: string, checkboxId: string) {
      const note = this.getNoteById(noteId)
      if (note?.type === NOTE_TYPES.CHECKBOX && note.items) {
        const checkbox = note.items.find((cb) => cb.id === checkboxId)
        if (checkbox) {
          checkbox.checked = !checkbox.checked
        }
      }
    },
  },

  persist: true
})
