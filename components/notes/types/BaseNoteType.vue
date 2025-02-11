<template>
  <div>
    <div class="space-y-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseNote } from '~/types/notes/base'

const props = defineProps<{
  note: BaseNote
  fieldPrefix?: string
}>()

const fieldId = (field: string) => props.fieldPrefix ? `${props.fieldPrefix}-${field}` : field
</script>
