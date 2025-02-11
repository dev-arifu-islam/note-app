import { defineStore } from 'pinia'
import { BaseNote } from '~/types/notes/base'
import { NOTE_TYPES, NoteType, createNote, getNoteConfig } from '~/types/notes/registry'
import type { DefaultNote, ImageNote, CheckboxNote } from '~/types/notes/implementations'

export type Note = DefaultNote | ImageNote | CheckboxNote
export { NOTE_TYPES, type NoteType }

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

    getNoteConfig: () => (type: NoteType) => {
      return getNoteConfig(type)
    }
  },

  actions: {
    addNote(type: NoteType = NOTE_TYPES.DEFAULT) {
      const note = createNote(type) as Note
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
    }
  },

  persist: true
})
