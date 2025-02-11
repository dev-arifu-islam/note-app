&lt;template>
  &lt;Teleport to="body">
    &lt;Transition name="fade">
      &lt;div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        &lt;div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          &lt;div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('update:modelValue', false)">&lt;/div>

          &lt;div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            &lt;div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              &lt;div class="sm:flex sm:items-start">
                &lt;div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  &lt;h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    {{ title }}
                  &lt;/h3>
                  &lt;div class="mt-2">
                    &lt;p class="text-sm text-gray-500">{{ message }}&lt;/p>
                  &lt;/div>
                &lt;/div>
              &lt;/div>
            &lt;/div>
            &lt;div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              &lt;button
                type="button"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                @click="confirm"
              >
                {{ confirmText }}
              &lt;/button>
              &lt;button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                @click="$emit('update:modelValue', false)"
              >
                Cancel
              &lt;/button>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/Transition>
  &lt;/Teleport>
&lt;/template>

&lt;script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
&lt;/script>

&lt;style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
&lt;/style>
