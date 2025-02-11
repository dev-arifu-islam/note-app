// Base note interface that all note types must implement
export interface BaseNote {
  id: string
  title: string
  description: string
  type: number
  createdAt: string
}

// Interface for note type configuration
export interface NoteTypeConfig {
  id: number
  name: string
  icon?: string
  color: {
    bg: string
    text: string
  }
}

// Interface for note type implementation
export interface NoteTypeImplementation<T extends BaseNote = BaseNote> {
  create(): T
  validate(note: T): boolean
  getDefaultData(): Partial<T>
}

// Registry to store note type implementations
export class NoteTypeRegistry {
  private static instance: NoteTypeRegistry
  private types: Map<number, NoteTypeImplementation> = new Map()
  private configs: Map<number, NoteTypeConfig> = new Map()

  private constructor() {}

  static getInstance(): NoteTypeRegistry {
    if (!NoteTypeRegistry.instance) {
      NoteTypeRegistry.instance = new NoteTypeRegistry()
    }
    return NoteTypeRegistry.instance
  }

  register(config: NoteTypeConfig, implementation: NoteTypeImplementation) {
    this.types.set(config.id, implementation)
    this.configs.set(config.id, config)
  }

  getImplementation(type: number): NoteTypeImplementation | undefined {
    return this.types.get(type)
  }

  getConfig(type: number): NoteTypeConfig | undefined {
    return this.configs.get(type)
  }

  getAllConfigs(): NoteTypeConfig[] {
    return Array.from(this.configs.values())
  }

  createNote(type: number): BaseNote {
    const implementation = this.types.get(type)
    if (!implementation) {
      throw new Error(`No implementation found for note type ${type}`)
    }
    return implementation.create()
  }
}
