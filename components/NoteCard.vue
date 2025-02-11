<template>
  <div class="group relative bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xl font-semibold">{{ note.title }}</h2>
      <span class="text-sm px-2 py-1 rounded" :class="getTypeClass(note.type)">
        {{ noteTypes[note.type] }}
      </span>
    </div>
    <p class="text-gray-600 mb-4 line-clamp-3">{{ note.description }}</p>

    <!-- Image preview for image type notes -->
    <img
      v-if="note.type === NOTE_TYPES.IMAGE && 'imageUrl' in note && note.imageUrl"
      :src="note.imageUrl"
      alt="Note image"
      class="w-full h-40 object-cover rounded-md mb-4"
    />

    <!-- Checkbox list for checkbox type notes -->
    <div v-if="note.type === NOTE_TYPES.CHECKBOX && 'items' in note && note.items?.length" class="mb-4">
      <div
        v-for="item in note.items.slice(0, 3)"
        :key="item.id"
        class="flex items-center gap-2"
      >
        <input type="checkbox" :checked="item.checked" disabled class="rounded" />
        <span class="text-sm text-gray-600">{{ item.text }}</span>
      </div>
      <div v-if="note.items.length > 3" class="text-sm text-gray-500 mt-1">
        +{{ note.items.length - 3 }} more items
      </div>
    </div>

    <div class="flex justify-end mt-4 gap-2">
      <button
        @click="$emit('edit', note)"
        class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
      >
        Edit
      </button>
      <button
        @click="$emit('delete', note)"
        class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NOTE_TYPES, type Note } from '~/stores/notes'

const props = defineProps<{
  note: Note
}>()

defineEmits<{
  (e: 'delete', note: Note): void
  (e: 'edit', note: Note): void
}>()

const noteTypes = {
  [NOTE_TYPES.DEFAULT]: 'Default',
  [NOTE_TYPES.IMAGE]: 'Image',
  [NOTE_TYPES.CHECKBOX]: 'Checkbox'
} as const

const getTypeClass = (type: number) => {
  const classes = {
    [NOTE_TYPES.DEFAULT]: 'bg-gray-100 text-gray-800',
    [NOTE_TYPES.IMAGE]: 'bg-purple-100 text-purple-800',
    [NOTE_TYPES.CHECKBOX]: 'bg-green-100 text-green-800'
  }
  return classes[type]
}
</script>
