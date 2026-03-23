<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700/50 dark:bg-dark-card md:p-6"
    :class="[
      task.completed ? 'opacity-75' : '',
      justEdited ? 'scale-[0.985]' : ''
    ]"
  >
    <div
      class="absolute left-0 top-0 h-full w-1"
      :class="{
        'bg-red-500': task.priority === 'high',
        'bg-orange-500': task.priority === 'medium',
        'bg-green-500': task.priority === 'low'
      }"
    ></div>

    <!-- Task Header -->
    <div class="mb-3 flex items-start justify-between gap-3">
      <RouterLink
        :to="`/tasks/${task.id}`"
        class="block min-w-0 flex-1 pr-2"
      >
        <h3
          class="text-lg font-bold text-gray-900 transition-colors hover:text-primary dark:text-white dark:hover:text-primary-light md:text-xl"
          :class="{ 'line-through opacity-60': task.completed }"
        >
          {{ task.title }}
        </h3>
      </RouterLink>

      <!-- Checkbox -->
      <button
        type="button"
        @click="handleToggleComplete"
        class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 border-gray-300 transition-all duration-200 hover:border-primary dark:border-gray-600 dark:hover:border-primary-light"
        :class="task.completed ? 'border-primary bg-gradient-to-br from-primary to-primary-dark dark:border-primary-light' : ''"
        :aria-label="task.completed ? 'Mark task as active' : 'Mark task as completed'"
        :aria-pressed="task.completed ? 'true' : 'false'"
      >
        <Check v-if="task.completed" class="w-4 h-4 text-white" />
      </button>
    </div>

    <div class="mb-2 flex flex-wrap items-center gap-2">
      <span
        class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
        :class="{
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300': task.priority === 'high',
          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300': task.priority === 'medium',
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300': task.priority === 'low'
        }"
      >
        {{ task.priority }}
      </span>
      <span
        class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
        :class="task.completed
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'"
      >
        {{ task.completed ? 'Completed' : 'In Progress' }}
      </span>
    </div>

    <!-- Task Description -->
    <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400" :class="{ 'line-through opacity-50': task.completed }">
      {{ truncatedDescription }}
    </p>

    <!-- Task Meta -->
    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Calendar class="w-4 h-4" />
        <span>{{ formattedDate }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <RouterLink
          :to="`/tasks/${task.id}`"
          class="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="View Details"
          aria-label="View task details"
          @click.stop
        >
          <Eye class="w-4 h-4" />
        </RouterLink>

        <button
          type="button"
          @click.stop="showEditModal = true"
          class="rounded-lg p-2 text-blue-600 transition-colors duration-200 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20"
          title="Edit Task"
          aria-label="Edit task"
        >
          <Pencil class="w-4 h-4" />
        </button>

        <button
          type="button"
          @click.stop="handleDelete"
          class="rounded-lg p-2 text-red-500 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Delete Task"
          aria-label="Delete task"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <ConfirmBox
      v-model="showDeleteConfirm"
      title="Delete Task"
      message="This task will be permanently removed. Continue?"
      confirm-text="Delete"
      cancel-text="Cancel"
      :danger="true"
      @confirm="confirmDelete"
    />

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
          v-if="showEditModal"
          class="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          @click.self="showEditModal = false"
        >
          <div class="w-full max-w-3xl">
            <TaskForm
              :task="task"
              :is-edit="true"
              @success="handleEditSuccess"
              @cancel="showEditModal = false"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check, Calendar, Eye, Trash2, Pencil } from 'lucide-vue-next'
import { useTaskStore } from '@/stores/taskStore'
import TaskForm from '@/components/TaskForm.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['deleted'])

const taskStore = useTaskStore()
const showDeleteConfirm = ref(false)
const showEditModal = ref(false)
const justEdited = ref(false)

const truncatedDescription = computed(() => {
  if (!props.task.description) return ''
  return props.task.description.length > 120
    ? props.task.description.slice(0, 120) + '...'
    : props.task.description
})

const formattedDate = computed(() => {
  if (!props.task.dueDate) return 'No due date'
  const date = new Date(props.task.dueDate)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

function handleToggleComplete() {
  taskStore.toggleTaskComplete(props.task.id)
}

function handleDelete() {
  showDeleteConfirm.value = true
}

function confirmDelete() {
  taskStore.deleteTask(props.task.id)
  emit('deleted')
}

function handleEditSuccess() {
  showEditModal.value = false
  justEdited.value = true
  setTimeout(() => {
    justEdited.value = false
  }, 260)
}
</script>
