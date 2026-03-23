<template>
  <div v-if="task" class="mx-auto max-w-4xl">
    <!-- Back Button -->
    <RouterLink
      to="/tasks"
      class="mb-6 inline-flex items-center gap-2 font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
    >
      <ArrowLeft class="w-5 h-5" />
      Back to Tasks
    </RouterLink>

    <!-- Task Header -->
    <div class="mb-8 rounded-2xl border border-gray-200/50 bg-white p-8 shadow-xl dark:border-gray-700/50 dark:bg-dark-card">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-4">
            <button
              @click="toggleComplete"
              type="button"
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 border-gray-300 transition-all duration-200 hover:border-primary dark:border-gray-600 dark:hover:border-primary-light"
              :class="task.completed ? 'border-primary bg-gradient-to-br from-primary to-primary-dark dark:border-primary-light' : ''"
              :aria-label="task.completed ? 'Mark task as active' : 'Mark task as completed'"
              :aria-pressed="task.completed ? 'true' : 'false'"
            >
              <Check v-if="task.completed" class="w-6 h-6 text-white" />
            </button>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl" :class="{ 'line-through opacity-60': task.completed }">
              {{ task.title }}
            </h1>
          </div>

          <!-- Priority Badge -->
          <div class="flex items-center gap-4 mb-4">
            <span
              class="rounded-full px-4 py-2 text-sm font-semibold uppercase"
              :class="{
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300': task.priority === 'high',
                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300': task.priority === 'medium',
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300': task.priority === 'low'
              }"
            >
              {{ task.priority }} priority
            </span>
            <span
              v-if="task.completed"
              class="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300"
            >
              <CheckCircle2 class="w-4 h-4" />
              Completed
            </span>
            <span
              v-else
              class="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <Clock class="w-4 h-4" />
              In Progress
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            @click="isEditing = !isEditing"
            type="button"
            class="rounded-xl p-3 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            :class="{ 'bg-primary/10 text-primary': isEditing }"
            :aria-label="isEditing ? 'Stop editing task' : 'Edit task'"
          >
            <Edit class="w-5 h-5" />
          </button>
          <button
            @click="handleDelete"
            type="button"
            class="rounded-xl p-3 text-red-500 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label="Delete task"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Form (Conditional) -->
    <div v-if="isEditing" class="mb-8">
      <TaskForm
        :task="task"
        :is-edit="true"
        @success="handleEditSuccess"
        @cancel="isEditing = false"
      />
    </div>

    <!-- Task Details (Read-only) -->
    <div v-else class="space-y-6">
      <!-- Description -->
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md dark:border-gray-700/50 dark:bg-dark-card">
        <div class="flex items-center gap-2 mb-4">
          <FileText class="w-5 h-5 text-primary dark:text-primary-light" />
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Description</h2>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {{ task.description }}
        </p>
      </div>

      <!-- Task Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Created Date -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md dark:border-gray-700/50 dark:bg-dark-card">
          <div class="flex items-center gap-2 mb-3">
            <Calendar class="w-5 h-5 text-primary dark:text-primary-light" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Created Date</h3>
          </div>
          <p class="text-gray-700 dark:text-gray-300 font-semibold">
            {{ formatDate(task.createdAt) }}
          </p>
        </div>

        <!-- Due Date -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md dark:border-gray-700/50 dark:bg-dark-card">
          <div class="flex items-center gap-2 mb-3">
            <Clock class="w-5 h-5 text-primary dark:text-primary-light" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Due Date</h3>
          </div>
          <p class="text-gray-700 dark:text-gray-300 font-semibold">
            {{ task.dueDate ? formatDate(task.dueDate) : 'No due date set' }}
          </p>
        </div>
      </div>

      <!-- Task Stats -->
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md dark:border-gray-700/50 dark:bg-dark-card">
        <div class="flex items-center gap-2 mb-4">
          <BarChart class="w-5 h-5 text-primary dark:text-primary-light" />
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Task Statistics</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ task.completed ? 'Done' : 'Active' }}</p>
          </div>
          <div class="text-center">
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Priority</p>
            <p class="text-lg font-bold capitalize text-gray-900 dark:text-white">{{ task.priority }}</p>
          </div>
          <div class="text-center">
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Days Old</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ daysOld }}</p>
          </div>
          <div class="text-center">
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Days Until Due</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ daysUntilDue }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-gray-200/50 bg-white p-12 text-center shadow-md dark:border-gray-700/50 dark:bg-dark-card">
    <AlertCircle class="w-16 h-16 text-red-400 dark:text-red-600 mb-4" />
    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Task Not Found
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      The task you're looking for doesn't exist or has been deleted.
    </p>
    <RouterLink
      to="/tasks"
      class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
             bg-gradient-to-r from-primary to-primary-dark text-white
             shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
             hover:-translate-y-0.5 transition-all duration-200"
    >
      <ArrowLeft class="w-5 h-5" />
      Back to Tasks
    </RouterLink>
  </div>

  <ConfirmBox
    v-model="showDeleteConfirm"
    title="Delete Task"
    message="This task will be permanently deleted. Are you sure?"
    confirm-text="Delete"
    cancel-text="Cancel"
    :danger="true"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import TaskForm from '@/components/TaskForm.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Edit,
  Trash2,
  BarChart,
  AlertCircle
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const { getTaskById } = storeToRefs(taskStore)

const isEditing = ref(false)
const showDeleteConfirm = ref(false)

const task = computed(() => getTaskById.value(route.params.id))

const daysOld = computed(() => {
  if (!task.value) return 0
  const created = new Date(task.value.createdAt)
  const now = new Date()
  return Math.floor((now - created) / (1000 * 60 * 60 * 24))
})

const daysUntilDue = computed(() => {
  if (!task.value?.dueDate) return 'N/A'
  const due = new Date(task.value.dueDate)
  const now = new Date()
  const days = Math.floor((due - now) / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : 'Overdue'
})

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function toggleComplete() {
  if (task.value) {
    taskStore.toggleTaskComplete(task.value.id)
  }
}

function handleEditSuccess() {
  isEditing.value = false
}

function handleDelete() {
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (!task.value) return
  taskStore.deleteTask(task.value.id)
  router.push('/tasks')
}
</script>
