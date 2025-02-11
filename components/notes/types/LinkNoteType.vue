<template>
  <BaseNoteType :note="note" :field-prefix="fieldPrefix">
    <template v-if="mode === 'edit'">
      <div class="space-y-4">
        <div>
          <label :for="fieldId('url')" class="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input
            :id="fieldId('url')"
            v-model="(note as LinkNote).url"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
        </div>
        <div>
          <label :for="fieldId('linkText')" class="block text-sm font-medium text-gray-700 mb-1">Link Text (Optional)</label>
          <input
            :id="fieldId('linkText')"
            v-model="(note as LinkNote).linkText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Custom text to display for the link"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="(note as LinkNote).url" class="mb-4">
        <a 
          :href="(note as LinkNote).url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {{ (note as LinkNote).linkText || (note as LinkNote).url }}
        </a>
      </div>
    </template>
  </BaseNoteType>
</template>

<script setup lang="ts">
import type { BaseNote } from '~/types/notes/base'
import type { LinkNote } from '~/types/notes/implementations'

const props = defineProps<{
  note: BaseNote
  fieldPrefix?: string
  mode: 'preview' | 'edit'
}>()

const fieldId = (field: string) => props.fieldPrefix ? `${props.fieldPrefix}-${field}` : field
</script>
