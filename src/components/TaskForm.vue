<template>
  <div ref="formRef" class="mx-auto max-w-2xl">
    <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-xl dark:border-gray-700/50 dark:bg-dark-card md:p-8">
      <h2 class="mb-6 border-b border-gray-200 pb-4 text-2xl font-bold text-gray-900 dark:border-gray-700 dark:text-white md:text-3xl">
        {{ isEdit ? 'Edit Task' : 'Create New Task' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div class="space-y-2">
          <label for="title" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Task Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg dark:text-white dark:placeholder-gray-500"
            placeholder="Enter task title..."
            required
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label for="description" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            class="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg dark:text-white dark:placeholder-gray-500"
            placeholder="Describe your task..."
            required
          ></textarea>
        </div>

        <!-- Priority & Due Date Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Priority -->
          <div class="space-y-2">
            <label for="priority" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</label>
            <select
              id="priority"
              v-model="formData.priority"
              class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <!-- Due Date -->
          <div class="space-y-2">
            <label for="dueDate" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              id="dueDate"
              v-model="formData.dueDate"
              type="date"
              class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg dark:text-white"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            class="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">{{ isEdit ? 'Update Task' : 'Create Task' }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          </button>

          <button
            type="button"
            @click="handleCancel"
            class="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import gsap from 'gsap'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['success', 'cancel'])

const router = useRouter()
const taskStore = useTaskStore()
const formRef = ref(null)
const isSubmitting = ref(false)

const formData = reactive({
  title: props.task?.title || '',
  description: props.task?.description || '',
  priority: props.task?.priority || 'medium',
  dueDate: props.task?.dueDate ? formatDateForInput(props.task.dueDate) : ''
})

function formatDateForInput(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

async function handleSubmit() {
  isSubmitting.value = true

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const taskData = {
    title: formData.title,
    description: formData.description,
    priority: formData.priority,
    dueDate: formData.dueDate ? new Date(formData.dueDate) : null
  }

  if (props.isEdit) {
    taskStore.updateTask(props.task.id, taskData)
  } else {
    taskStore.addTask(taskData)
  }

  // Animate success
  gsap.to(formRef.value, {
    scale: 0.95,
    opacity: 0.8,
    duration: 0.2,
    onComplete: () => {
      isSubmitting.value = false
      emit('success')
      if (!props.isEdit) {
        router.push('/tasks')
      }
    }
  })
}

function handleCancel() {
  gsap.to(formRef.value, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      emit('cancel')
      if (!props.isEdit) {
        router.push('/tasks')
      }
    }
  })
}

onMounted(() => {
  gsap.from(formRef.value, {
    opacity: 0,
    y: 30,
    duration: 0.5,
    ease: 'power2.out'
  })
})
</script>


