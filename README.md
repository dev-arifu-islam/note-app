# Notes App

A Vue 3 + TypeScript notes application that supports multiple note types and is easily extensible.

## Features

- Multiple note types (Default, Image, Checkbox)
- Extensible architecture for adding new note types
- Type-safe implementation with TypeScript
- Responsive design with Tailwind CSS
- State management with Pinia
- Persistent storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd notes-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

## Adding New Note Types

The application is designed to be easily extensible with new note types. Follow these steps to add a new note type:

### 1. Define the Note Interface

In `types/notes/implementations.ts`, add your new note interface:

```typescript
export interface LinkNote extends BaseNote {
  type: 3  // Use a unique number
  url: string
  // Add any additional properties
  favicon?: string
}
```

### 2. Create the Implementation

In the same file, create a class that implements `NoteTypeImplementation`:

```typescript
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
           this.isValidUrl(note.url)
  }

  getDefaultData(): Partial<LinkNote> {
    return {
      url: ''
    }
  }

  // Add any helper methods
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}
```

### 3. Register the Note Type

In `types/notes/registry.ts`:

1. Add the type to NOTE_TYPES:
```typescript
export const NOTE_TYPES = {
  DEFAULT: 0,
  IMAGE: 1,
  CHECKBOX: 2,
  LINK: 3  // Add your new type
} as const
```

2. Register the implementation:
```typescript
registry.register(
  {
    id: 3,
    name: 'Link',
    icon: 'link',  // Optional: icon name
    color: {
      bg: 'bg-blue-100',
      text: 'text-blue-800'
    }
  },
  new LinkNoteImplementation()
)
```

### 4. Update Type Union

In `stores/notes.ts`, update the Note type union:

```typescript
export type Note = DefaultNote | ImageNote | CheckboxNote | LinkNote  // Add your new type
```

### 5. Add UI Components

1. Update the note edit form in `pages/note/[id].vue`:

```vue
<!-- Link type specific fields -->
<div v-if="editedNote.type === NOTE_TYPES.LINK">
  <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
  <input
    v-model="editedNote.url"
    type="url"
    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="https://example.com"
  />
</div>
```

2. Update the note card display in `components/NoteCard.vue`:

```vue
<!-- Link preview -->
<div v-if="note.type === NOTE_TYPES.LINK && note.url">
  <a :href="note.url" target="_blank" class="text-blue-600 hover:underline">
    {{ note.url }}
  </a>
</div>
```

## Architecture

The application uses a registry pattern for managing note types:

- `types/notes/base.ts`: Contains base interfaces and the registry class
- `types/notes/implementations.ts`: Contains note type implementations
- `types/notes/registry.ts`: Manages note type registration and creation
- `stores/notes.ts`: Handles state management for notes

Each note type must implement:

- `create()`: Creates a new note of this type
- `validate(note)`: Validates note data
- `getDefaultData()`: Provides default values for type-specific fields

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
