<template>
  <component
    :is="getTypeComponent"
    v-if="note"
    :note="note"
    :field-prefix="fieldPrefix"
    :mode="mode"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { BaseNote } from '~/types/notes/base'
import registry from '~/types/notes/registry'

const props = defineProps<{
  note: BaseNote
  fieldPrefix?: string
  mode: 'preview' | 'edit'
}>()

const getTypeComponent = computed(() => {
  const config = registry.getConfig(props.note.type)
  if (!config) return null

  // Try to load the component dynamically based on the note type
  // This allows each note type to define its own preview and edit components
  try {
    return defineAsyncComponent(() => 
      import(`./types/${config.name}NoteType.vue`).catch(() => {
        console.warn(`No component found for note type: ${config.name}`)
        return import('./types/DefaultNoteType.vue')
      })
    )
  } catch (e) {
    console.warn(`Error loading component for note type: ${config.name}`, e)
    return null
  }
})
</script>
