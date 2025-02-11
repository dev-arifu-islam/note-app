<template>
  <BaseNoteType :note="note" :field-prefix="fieldPrefix">
    <template v-if="mode === 'preview'">
      <!-- Default note preview - just shows title and description -->
    </template>
  </BaseNoteType>
</template>

<script setup lang="ts">
import type { BaseNote } from '~/types/notes/base'
import BaseNoteType from '~/components/notes/BaseNoteType.vue'

defineProps<{
  note: BaseNote
  fieldPrefix?: string
  mode: 'preview' | 'edit'
}>()
</script>
