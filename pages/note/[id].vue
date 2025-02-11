<template>
  <div v-if="note" class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Edit Note</h1>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Back
          </NuxtLink>
          <button
            @click="saveNote"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Note Type Selection -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
          <select
            id="type"
            v-model="editedNote.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleTypeChange"
          >
            <option v-for="(label, type) in noteTypes" :key="type" :value="Number(type)">
              {{ label }}
            </option>
          </select>
        </div>

        <!-- Common fields for all note types -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="title"
            v-model="editedNote.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="editedNote.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <!-- Image type specific fields -->
        <div v-if="editedNote.type === NOTE_TYPES.IMAGE">
          <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div class="mt-1 flex items-center gap-4">
            <img
              v-if="editedNote.imageUrl"
              :src="editedNote.imageUrl"
              alt="Note image"
              class="w-32 h-32 object-cover rounded-md"
            />
            <div>
              <label
                class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                />
              </label>
              <p v-if="editedNote.imageUrl" class="mt-2 text-sm text-gray-500">
                Click 'Upload Image' to change the current image
              </p>
            </div>
          </div>
        </div>

        <!-- Checkbox type specific fields -->
        <template v-if="editedNote.type === NOTE_TYPES.CHECKBOX">
          <div class="space-y-4">
            <div v-for="(item, index) in editedNote.items" :key="item.id" class="flex items-center gap-2">
              <input
                v-model="item.checked"
                type="checkbox"
                class="rounded"
              />
              <input
                v-model="item.text"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item text"
              />
              <button
                @click="removeCheckboxItem(index)"
                class="p-2 text-red-600 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              @click="addCheckboxItem"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Add Item
            </button>
          </div>
        </template>

        <!-- Link Note Fields -->
        <template v-if="editedNote.type === NOTE_TYPES.LINK">
          <div class="space-y-4">
            <div>
              <label for="url" class="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                id="url"
                v-model="editedNote.url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>
            <div>
              <label for="linkText" class="block text-sm font-medium text-gray-700 mb-1">Link Text (Optional)</label>
              <input
                id="linkText"
                v-model="editedNote.linkText"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom text to display for the link"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotesStore, NOTE_TYPES } from '~/stores/notes'
import registry from '~/types/notes/registry'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const note = ref(null)
const editedNote = ref(null)

// Get note types from registry
const noteTypes = computed(() => {
  const types = {}
  const configs = registry.getAllConfigs()
  configs.forEach(config => {
    types[config.id] = config.name
  })
  return types
})

onMounted(() => {
  const id = route.params.id
  note.value = notesStore.getNoteById(id)
  
  if (!note.value) {
    router.push('/')
    return
  }

  // Create a deep copy of the note for editing
  editedNote.value = JSON.parse(JSON.stringify(note.value))
})

const handleTypeChange = () => {
  // Reset type-specific fields when type changes
  if (editedNote.value.type === NOTE_TYPES.IMAGE) {
    editedNote.value.imageUrl = ''
  } else if (editedNote.value.type === NOTE_TYPES.CHECKBOX) {
    editedNote.value.items = []
  } else if (editedNote.value.type === NOTE_TYPES.LINK) {
    editedNote.value.url = ''
    editedNote.value.linkText = ''
  }
}

const saveNote = () => {
  if (note.value && editedNote.value) {
    notesStore.updateNote(note.value.id, editedNote.value)
    router.push('/')
  }
}

const handleImageUpload = async (event) => {
  const input = event.target
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  // In a real application, you would upload this to a server
  // For now, we'll create a local URL
  const reader = new FileReader()
  reader.onload = () => {
    if (editedNote.value && typeof reader.result === 'string') {
      editedNote.value.imageUrl = reader.result
    }
  }
  reader.readAsDataURL(file)
}

const addCheckboxItem = () => {
  if (editedNote.value?.type === NOTE_TYPES.CHECKBOX) {
    if (!editedNote.value.items) {
      editedNote.value.items = []
    }
    editedNote.value.items.push({
      id: crypto.randomUUID(),
      text: '',
      checked: false
    })
  }
}

const removeCheckboxItem = (index) => {
  if (editedNote.value?.type === NOTE_TYPES.CHECKBOX) {
    editedNote.value.items.splice(index, 1)
  }
}
</script>