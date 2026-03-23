<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="close"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
          tabindex="-1"
          class="w-full max-w-md rounded-2xl p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 shadow-2xl transition duration-200 ease-out"
        >
          <h3 id="confirm-title" class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
          <p id="confirm-message" class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ message }}</p>

          <div class="flex items-center justify-end gap-3">
            <button
              ref="cancelButtonRef"
              type="button"
              class="px-4 py-2 rounded-lg font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="close"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200"
              :class="danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'"
              @click="confirmAction"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Please Confirm'
  },
  message: {
    type: String,
    default: 'Are you sure you want to continue?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  danger: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialogRef = ref(null)
const cancelButtonRef = ref(null)

function onDialogKeydown(event) {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key !== 'Tab' || !dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      cancelButtonRef.value?.focus()
      window.addEventListener('keydown', onDialogKeydown)
    } else {
      window.removeEventListener('keydown', onDialogKeydown)
    }
  }
)

onUnmounted(() => {
  window.removeEventListener('keydown', onDialogKeydown)
})

function close() {
  emit('update:modelValue', false)
  emit('cancel')
}

function confirmAction() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>
