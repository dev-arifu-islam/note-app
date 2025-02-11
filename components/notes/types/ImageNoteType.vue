<template>
  <BaseNoteType :note="note" :field-prefix="fieldPrefix">
    <template v-if="mode === 'edit'">
      <div>
        <label :for="fieldId('image')" class="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <div class="mt-1 flex items-center gap-4">
          <img
            v-if="(note as ImageNote).imageUrl"
            :src="(note as ImageNote).imageUrl"
            alt="Note image"
            class="w-32 h-32 object-cover rounded-md"
          />
          <div>
            <label
              class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <span>Upload Image</span>
              <input
                :id="fieldId('image')"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </label>
            <p v-if="(note as ImageNote).imageUrl" class="mt-2 text-sm text-gray-500">
              Click 'Upload Image' to change the current image
            </p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <img
        v-if="(note as ImageNote).imageUrl"
        :src="(note as ImageNote).imageUrl"
        alt="Note image"
        class="w-full h-40 object-cover rounded-md mb-4"
      />
    </template>
  </BaseNoteType>
</template>

<script setup lang="ts">
import type { BaseNote } from '~/types/notes/base'
import type { ImageNote } from '~/types/notes/implementations'

const props = defineProps<{
  note: BaseNote
  fieldPrefix?: string
  mode: 'preview' | 'edit'
}>()

const fieldId = (field: string) => props.fieldPrefix ? `${props.fieldPrefix}-${field}` : field

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
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
    if (typeof reader.result === 'string') {
      (props.note as ImageNote).imageUrl = reader.result
    }
  }
  reader.readAsDataURL(file)
}
</script>
