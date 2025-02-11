<template>
  <div v-if="!isLoading" class="container mx-auto px-4 py-8">
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
            @click="saveChanges"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
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

        <DynamicNoteType v-if="editedNote" :note="editedNote" mode="edit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from '~/stores/notes'
import registry from '~/types/notes/registry'
import { NOTE_TYPES, type NoteType } from '~/types/notes/registry'
import DynamicNoteType from '~/components/notes/DynamicNoteType.vue'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const editedNote = ref<any>(null)
const isLoading = ref(true)

// Get note types from registry
const noteTypes = computed(() => {
  const types = {}
  const configs = registry.getAllConfigs()
  configs.forEach(config => {
    types[config.id] = config.name
  })
  return types
})

// Load note data
onMounted(async () => {
  const noteId = route.params.id as string
  const note = notesStore.notes.find(n => n.id === noteId)
  
  if (!note) {
    router.push('/')
    return
  }

  editedNote.value = { ...note }
  isLoading.value = false
})

// Handle type change
const handleTypeChange = () => {
  const oldNote = { ...editedNote.value }
  const implementation = registry.getImplementation(editedNote.value.type)
  if (!implementation) return

  // Create new note with same ID and basic fields
  const newNote = implementation.create()
  editedNote.value = {
    ...newNote,
    id: oldNote.id,
    title: oldNote.title,
    description: oldNote.description,
    createdAt: oldNote.createdAt,
    type: oldNote.type
  }
}

// Save changes
const saveChanges = async () => {
  if (!editedNote.value) return

  const implementation = registry.getImplementation(editedNote.value.type)
  if (!implementation || !implementation.validate(editedNote.value)) {
    alert('Please fill in all required fields')
    return
  }

  // Save the entire note object
  notesStore.updateNote(editedNote.value)
  router.push('/')
}

// Cancel editing
const cancelEdit = () => {
  router.push('/')
}
</script>