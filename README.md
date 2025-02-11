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

This guide explains how to add new note types to the application.

### 1. Define the Note Type Interface

In `/types/notes/implementations.ts`, add your new note type interface:

```typescript
export interface YourNewNote extends BaseNote {
  type: number; // Use a unique number that hasn't been used by other types
  // Add your custom properties here
  customField1: string;
  customField2: number;
  // etc...
}
```

### 2. Create the Implementation Class

In the same file, add the implementation class:

```typescript
export class YourNewNoteImplementation implements NoteTypeImplementation<YourNewNote> {
  create(): YourNewNote {
    return {
      type: YOUR_TYPE_NUMBER,
      // Initialize your custom fields
      customField1: '',
      customField2: 0,
    };
  }

  validate(note: YourNewNote): boolean {
    // Add your validation logic
    return true;
  }

  getDefaultData(): Partial<YourNewNote> {
    // Return default data for your note type
    return {
      customField1: 'default',
      customField2: 0,
    };
  }
}
```

### 3. Create the Vue Component

Create a new file in `/components/notes/types/YourNewNoteType.vue`:

```vue
<template>
  <div class="your-new-note">
    <!-- Add your note type UI here -->
    <input v-model="note.customField1" />
    <input type="number" v-model="note.customField2" />
  </div>
</template>

<script setup lang="ts">
import type { YourNewNote } from '~/types/notes/implementations'

const props = defineProps<{
  note: YourNewNote
  readonly?: boolean
}>()

// Add your component logic here
</script>

<style scoped>
.your-new-note {
  /* Add your styles here */
}
</style>
```

### 4. Register the Note Type

Update `/components/notes/DynamicNoteType.vue` to include your new note type:

```vue
<script setup lang="ts">
import YourNewNoteType from './types/YourNewNoteType.vue'

// Add to components object
const components = {
  // ... existing components
  'note-type-YOUR_TYPE': YourNewNoteType
}
</script>
```

### 5. Add Preview Support (Optional)

If your note type needs a custom preview, create a preview component in the same directory:

```vue
<template>
  <div class="your-new-note-preview">
    <!-- Add your preview UI here -->
    <p>{{ note.customField1 }}</p>
  </div>
</template>

<script setup lang="ts">
import type { YourNewNote } from '~/types/notes/implementations'

defineProps<{
  note: YourNewNote
}>()
</script>
```

## Example Note Types

The app currently includes several note types you can reference:

1. Default Note (type: 0) - Basic text note
2. Image Note (type: 1) - Notes with image support
3. Checkbox Note (type: 2) - Todo-style notes with checkboxes
4. Link Note (type: 3) - Notes with URL support

## Best Practices

1. Always use a unique type number for each note type
2. Implement proper validation in the implementation class
3. Make sure your UI is responsive and accessible
4. Follow the existing component naming conventions
5. Add proper TypeScript types for all properties
6. Include error handling for required fields
7. Test your note type thoroughly before deployment

## Need Help?

If you need examples, look at the existing note type implementations in:
- `/types/notes/implementations.ts`
- `/components/notes/types/`

Each existing note type follows this pattern and can serve as a reference for your implementation.

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
