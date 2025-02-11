<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="addNote()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Note
        </button>
        <select
          v-model="selectedType"
          class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option :value="null">All Types</option>
          <option v-for="(value, type) in noteTypes" :key="type" :value="Number(type)">
            {{ value }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow relative group"
      >
        <NuxtLink :to="`/note/${note.id}`" class="block">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xl font-semibold">{{ note.title }}</h2>
            <span class="text-sm px-2 py-1 rounded" :class="getTypeClass(note.type)">
              {{ noteTypes[note.type] }}
            </span>
          </div>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ note.description }}</p>

          <DynamicNoteType :note="note" mode="preview" />
        </NuxtLink>

        <button
          @click="confirmDelete(note)"
          class="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Delete Note</h2>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="deleteNote"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotesStore } from '~/stores/notes'
import registry from '~/types/notes/registry'
import { NOTE_TYPES, type NoteType } from '~/types/notes/registry'
import DynamicNoteType from '~/components/notes/DynamicNoteType.vue'

const notesStore = useNotesStore()
const selectedType = ref<NoteType | null>(null)
const showDeleteModal = ref(false)
const noteToDelete = ref<string | null>(null)

// Get note types from registry
const noteTypes = computed(() => {
  const types: Record<number, string> = {}
  const configs = registry.getAllConfigs()
  configs.forEach(config => {
    types[config.id] = config.name
  })
  return types
})

const filteredNotes = computed(() => {
  return selectedType.value === null
    ? notesStore.notes
    : notesStore.notes.filter(note => note.type === selectedType.value)
})

const getTypeClass = (type: NoteType) => {
  const configs = registry.getAllConfigs()
  const config = configs.find(c => c.id === type)
  return config ? `${config.color.bg} ${config.color.text}` : 'bg-gray-100 text-gray-800'
}

const addNote = () => {
  const id = notesStore.addNote()
  navigateTo(`/note/${id}`)
}

const confirmDelete = (note: { id: string }) => {
  noteToDelete.value = note.id
  showDeleteModal.value = true
}

const deleteNote = () => {
  if (noteToDelete.value) {
    notesStore.deleteNote(noteToDelete.value)
    noteToDelete.value = null
    showDeleteModal.value = false
  }
}
</script>
