import { BaseNote, NoteTypeImplementation } from './base'

// Default Note
export interface DefaultNote extends BaseNote {
  type: 0
}

export class DefaultNoteImplementation implements NoteTypeImplementation<DefaultNote> {
  create(): DefaultNote {
    return {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 0,
      createdAt: new Date().toISOString()
    }
  }

  validate(note: DefaultNote): boolean {
    return note.title.trim().length > 0
  }

  getDefaultData(): Partial<DefaultNote> {
    return {}
  }
}

// Image Note
export interface ImageNote extends BaseNote {
  type: 1
  imageUrl: string
}

export class ImageNoteImplementation implements NoteTypeImplementation<ImageNote> {
  create(): ImageNote {
    return {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 1,
      imageUrl: '',
      createdAt: new Date().toISOString()
    }
  }

  validate(note: ImageNote): boolean {
    return note.title.trim().length > 0 && note.imageUrl.trim().length > 0
  }

  getDefaultData(): Partial<ImageNote> {
    return {
      imageUrl: ''
    }
  }
}

// Checkbox Note
export interface CheckboxNote extends BaseNote {
  type: 2
  items: Array<{
    id: string
    text: string
    checked: boolean
  }>
}

export class CheckboxNoteImplementation implements NoteTypeImplementation<CheckboxNote> {
  create(): CheckboxNote {
    return {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 2,
      items: [],
      createdAt: new Date().toISOString()
    }
  }

  validate(note: CheckboxNote): boolean {
    return note.title.trim().length > 0 && note.items.every(item => item.text.trim().length > 0)
  }

  getDefaultData(): Partial<CheckboxNote> {
    return {
      items: []
    }
  }
}

// Link Note
export interface LinkNote extends BaseNote {
  type: 3
  url: string
  linkText?: string
}

export class LinkNoteImplementation implements NoteTypeImplementation<LinkNote> {
  create(): LinkNote {
    return {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      type: 3,
      url: '',
      createdAt: new Date().toISOString()
    }
  }

  validate(note: LinkNote): boolean {
    return note.title.trim().length > 0 && 
           note.url.trim().length > 0 && 
           this.isValidUrl(note.url);
  }

  getDefaultData(): Partial<LinkNote> {
    return {
      url: '',
      linkText: ''
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
