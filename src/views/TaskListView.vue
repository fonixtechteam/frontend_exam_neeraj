<template>
  <div class="min-h-[60vh]">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
      <div class="min-w-0">
        <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">All Tasks</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage and organize your tasks</p>
      </div>
      <RouterLink
        to="/tasks/new"
        class="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 md:inline-flex"
      >
        <PlusCircle class="w-5 h-5" />
        New Task
      </RouterLink>
    </div>

    <!-- Filters -->
    <section class="mb-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4" aria-label="Task filters">
      <!-- Status Filter -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="status in statusFilters"
          :key="status.value"
          @click="activeStatusFilter = status.value"
          type="button"
          class="flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all duration-200"
          :class="activeStatusFilter === status.value
            ? 'border-primary bg-primary text-white dark:border-primary-light dark:bg-primary'
            : 'border-gray-300 bg-white text-gray-700 hover:border-primary dark:border-gray-600 dark:bg-dark-card dark:text-gray-300 dark:hover:border-primary-light'"
        >
          {{ status.label }}
          <span
            class="rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="activeStatusFilter === status.value
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
          >
            {{ status.count }}
          </span>
        </button>
      </div>

      <!-- Priority Filter -->
      <div class="md:ml-auto flex items-center gap-2">
        <label for="priority-filter" class="sr-only">Filter by priority</label>
        <select
          id="priority-filter"
          v-model="activePriorityFilter"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card dark:text-gray-300 dark:hover:border-primary-light"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      <!-- Search -->
      <div class="relative w-full md:w-auto">
        <label for="task-search" class="sr-only">Search tasks</label>
        <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          id="task-search"
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card dark:text-white dark:placeholder-gray-500 md:min-w-[260px]"
        />
      </div>
    </section>

    <!-- Task Count -->
    <div class="mb-6" aria-live="polite">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing <span class="font-semibold text-primary dark:text-primary-light">{{ filteredTasks.length }}</span> task{{ filteredTasks.length !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Tasks Grid -->
    <TransitionGroup
      v-if="filteredTasks.length > 0"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-[0.98]"
      move-class="transition-transform duration-300"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <RouterLink
        to="/tasks/new"
        key="create-task-card"
        class="flex min-h-[210px] flex-col items-start justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/10 to-primary-dark/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl dark:from-primary/20 dark:to-primary-dark/20 md:min-h-[230px]"
      >
        <div class="rounded-xl bg-white p-3 text-primary shadow-md dark:bg-dark-card dark:text-primary-light">
          <PlusCircle class="w-7 h-7" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Create Task</h3>
        <p class="text-sm text-gray-700 dark:text-gray-300">Add a new task directly from your card board.</p>
      </RouterLink>

      <TaskCard
        v-for="task in filteredTasks"
        :key="`task-${task.id}`"
        :task="task"
      />
    </TransitionGroup>

    <!-- Empty State -->
    <div v-else class="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200/50 bg-white p-8 text-center shadow-md dark:border-gray-700/50 dark:bg-dark-card md:p-12">
      <component
        :is="emptyStateIcon"
        class="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600"
      />
      <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
        {{ emptyStateTitle }}
      </h3>
      <p class="mb-6 text-gray-600 dark:text-gray-400">
        {{ emptyStateMessage }}
      </p>
      <RouterLink
        v-if="searchQuery || activePriorityFilter !== 'all' || activeStatusFilter !== 'all'"
        @click="clearFilters"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
      >
        <X class="w-5 h-5" />
        Clear Filters
      </RouterLink>
      <RouterLink
        v-else
        to="/tasks/new"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
      >
        <PlusCircle class="w-5 h-5" />
        Create Your First Task
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import TaskCard from '@/components/TaskCard.vue'
import {
  PlusCircle,
  Search,
  Inbox,
  CheckCircle2,
  Filter,
  X
} from 'lucide-vue-next'

const taskStore = useTaskStore()
const { allTasks, activeTasks, completedTasks, taskStats } = storeToRefs(taskStore)

const activeStatusFilter = ref('all')
const activePriorityFilter = ref('all')
const searchQuery = ref('')

const statusFilters = computed(() => [
  { label: 'All', value: 'all', count: taskStats.value.total },
  { label: 'Active', value: 'active', count: taskStats.value.active },
  { label: 'Completed', value: 'completed', count: taskStats.value.completed }
])

const filteredTasks = computed(() => {
  let tasks = allTasks.value

  // Filter by status
  if (activeStatusFilter.value === 'active') {
    tasks = activeTasks.value
  } else if (activeStatusFilter.value === 'completed') {
    tasks = completedTasks.value
  }

  // Filter by priority
  if (activePriorityFilter.value !== 'all') {
    tasks = tasks.filter(task => task.priority === activePriorityFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    )
  }

  return tasks
})

const emptyStateIcon = computed(() => {
  if (searchQuery.value || activePriorityFilter.value !== 'all') {
    return Filter
  }
  return activeStatusFilter.value === 'completed' ? CheckCircle2 : Inbox
})

const emptyStateTitle = computed(() => {
  if (searchQuery.value) {
    return 'No tasks found'
  }
  if (activeStatusFilter.value === 'completed') {
    return 'No completed tasks'
  }
  if (activeStatusFilter.value === 'active') {
    return 'No active tasks'
  }
  return 'No tasks yet'
})

const emptyStateMessage = computed(() => {
  if (searchQuery.value) {
    return `No tasks match "${searchQuery.value}". Try a different search.`
  }
  if (activePriorityFilter.value !== 'all') {
    return `No ${activePriorityFilter.value} priority tasks found.`
  }
  if (activeStatusFilter.value === 'completed') {
    return 'Complete some tasks to see them here.'
  }
  if (activeStatusFilter.value === 'active') {
    return 'All tasks are completed!'
  }
  return 'Get started by creating your first task.'
})

function clearFilters() {
  activeStatusFilter.value = 'all'
  activePriorityFilter.value = 'all'
  searchQuery.value = ''
}
</script>
