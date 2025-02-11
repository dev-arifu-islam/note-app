<template>
  <BaseNoteType :note="note" :field-prefix="fieldPrefix">
    <template v-if="mode === 'edit'">
      <div class="space-y-4">
        <div v-for="(item, index) in (note as CheckboxNote).items" :key="item.id" class="flex items-center gap-2">
          <input
            :id="fieldId(`checkbox-${index}`)"
            v-model="item.checked"
            type="checkbox"
            class="rounded"
          />
          <input
            :id="fieldId(`text-${index}`)"
            v-model="item.text"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item text"
          />
          <button
            @click="removeItem(index)"
            class="p-2 text-red-600 hover:text-red-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <button
          @click="addItem"
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Add Item
        </button>
      </div>
    </template>
    <template v-else>
      <div v-if="(note as CheckboxNote).items?.length" class="mb-4">
        <div
          v-for="item in (note as CheckboxNote).items.slice(0, 3)"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <input type="checkbox" :checked="item.checked" disabled class="rounded" />
          <span class="text-sm text-gray-600">{{ item.text }}</span>
        </div>
        <div v-if="(note as CheckboxNote).items.length > 3" class="text-sm text-gray-500 mt-1">
          +{{ (note as CheckboxNote).items.length - 3 }} more items
        </div>
      </div>
    </template>
  </BaseNoteType>
</template>

<script setup lang="ts">
import type { BaseNote } from '~/types/notes/base'
import type { CheckboxNote } from '~/types/notes/implementations'

const props = defineProps<{
  note: BaseNote
  fieldPrefix?: string
  mode: 'preview' | 'edit'
}>()

const fieldId = (field: string) => props.fieldPrefix ? `${props.fieldPrefix}-${field}` : field

const addItem = () => {
  const checkboxNote = props.note as CheckboxNote
  if (!checkboxNote.items) {
    checkboxNote.items = []
  }
  checkboxNote.items.push({
    id: crypto.randomUUID(),
    text: '',
    checked: false
  })
}

const removeItem = (index: number) => {
  const checkboxNote = props.note as CheckboxNote
  if (checkboxNote.items) {
    checkboxNote.items.splice(index, 1)
  }
}
</script>
