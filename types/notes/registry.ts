import { NoteTypeRegistry, type NoteTypeConfig } from './base'
import {
  DefaultNoteImplementation,
  ImageNoteImplementation,
  CheckboxNoteImplementation,
  LinkNoteImplementation
} from './implementations'

// Initialize the registry
const registry = NoteTypeRegistry.getInstance()

// Register default note type
registry.register(
  {
    id: 0,
    name: 'Default',
    color: {
      bg: 'bg-gray-100',
      text: 'text-gray-800'
    }
  },
  new DefaultNoteImplementation()
)

// Register image note type
registry.register(
  {
    id: 1,
    name: 'Image',
    icon: 'image',
    color: {
      bg: 'bg-purple-100',
      text: 'text-purple-800'
    }
  },
  new ImageNoteImplementation()
)

// Register checkbox note type
registry.register(
  {
    id: 2,
    name: 'Checkbox',
    icon: 'check-square',
    color: {
      bg: 'bg-green-100',
      text: 'text-green-800'
    }
  },
  new CheckboxNoteImplementation()
)

// Register link note type
registry.register(
  {
    id: 3,
    name: 'Link',
    icon: 'link',
    color: {
      bg: 'bg-blue-100',
      text: 'text-blue-800'
    }
  },
  new LinkNoteImplementation()
)

// Export constants and types
export const NOTE_TYPES = {
  DEFAULT: 0,
  IMAGE: 1,
  CHECKBOX: 2,
  LINK: 3
} as const

export type NoteType = typeof NOTE_TYPES[keyof typeof NOTE_TYPES]

// Helper functions
export function createNote(type: NoteType) {
  return registry.createNote(type)
}

export function getNoteConfig(type: NoteType): NoteTypeConfig {
  const config = registry.getConfig(type)
  if (!config) {
    throw new Error(`Note type ${type} not found`)
  }
  return config
}

export function getAllNoteTypes(): NoteTypeConfig[] {
  return registry.getAllConfigs()
}

export default registry
