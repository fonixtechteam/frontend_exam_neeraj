<template>
  <div class="min-h-[60vh]">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back! Here's your task overview</p>
    </div>

    <!-- Charts -->
    <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8" aria-label="Task analytics charts">
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md dark:border-gray-700/50 dark:bg-dark-card" role="img" aria-label="Task completion doughnut chart showing active and completed tasks">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Task Completion</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Active vs completed tasks</p>
        </div>
        <div class="h-72">
          <Doughnut :data="completionChartData" :options="doughnutOptions" />
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md dark:border-gray-700/50 dark:bg-dark-card" role="img" aria-label="Priority distribution bar chart showing high medium and low priority tasks">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Priority Distribution</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Tasks by urgency level</p>
        </div>
        <div class="h-72">
          <Bar :data="priorityChartData" :options="barOptions" />
        </div>
      </div>
    </section>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        ref="statsRefs"
        class="flex items-center gap-4 rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700/50 dark:bg-dark-card"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" :class="stat.colorClass">
          <component :is="stat.icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="mb-5 text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RouterLink to="/tasks/new" class="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200/50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary dark:border-gray-700/50 dark:bg-dark-card dark:hover:border-primary-light">
          <PlusCircle class="w-8 h-8 text-primary dark:text-primary-light" />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Create Task</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Add a new task to your list</p>
          </div>
        </RouterLink>

        <RouterLink to="/tasks" class="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200/50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary dark:border-gray-700/50 dark:bg-dark-card dark:hover:border-primary-light">
          <ListTodo class="w-8 h-8 text-primary dark:text-primary-light" />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">View All Tasks</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage all your tasks</p>
          </div>
        </RouterLink>

        <button type="button" @click="clearCompleted" class="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200/50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700/50 dark:bg-dark-card dark:hover:border-primary-light" :disabled="!hasCompletedTasks" aria-label="Clear completed tasks">
          <CheckCircle2 class="w-8 h-8 text-primary dark:text-primary-light" />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Clear Completed</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Remove completed tasks</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
        <RouterLink to="/tasks" class="text-sm font-semibold text-primary dark:text-primary-light hover:underline">
          View All →
        </RouterLink>
      </div>

      <TransitionGroup
        v-if="recentTasks.length > 0"
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
        <TaskCard
          v-for="task in recentTasks"
          :key="`recent-${task.id}`"
          :task="task"
        />
      </TransitionGroup>

      <div v-else class="flex flex-col items-center justify-center rounded-2xl border border-gray-200/50 bg-white p-12 text-center shadow-md dark:border-gray-700/50 dark:bg-dark-card">
        <Inbox class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No tasks yet
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Get started by creating your first task
        </p>
        <RouterLink
          to="/tasks/new"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                 bg-gradient-to-r from-primary to-primary-dark text-white
                 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
                 hover:-translate-y-0.5 transition-all duration-200"
        >
          <PlusCircle class="w-5 h-5" />
          Create Your First Task
        </RouterLink>
      </div>
    </div>

    <ConfirmBox
      v-model="showClearConfirm"
      title="Clear Completed Tasks"
      message="This will permanently remove all completed tasks. Do you want to continue?"
      confirm-text="Clear Tasks"
      cancel-text="Keep Tasks"
      :danger="true"
      @confirm="handleClearCompleted"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import { useThemeStore } from '@/stores/themeStore'
import TaskCard from '@/components/TaskCard.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Inbox
} from 'lucide-vue-next'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const taskStore = useTaskStore()
const themeStore = useThemeStore()
const { taskStats, activeTasks, allTasks } = storeToRefs(taskStore)
const { isDark } = storeToRefs(themeStore)

const statsRefs = ref([])
const showClearConfirm = ref(false)

const stats = computed(() => [
  {
    label: 'Total Tasks',
    value: taskStats.value.total,
    icon: LayoutDashboard,
    colorClass: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    label: 'Active Tasks',
    value: taskStats.value.active,
    icon: ListTodo,
    colorClass: 'bg-gradient-to-br from-primary to-primary-dark'
  },
  {
    label: 'Completed',
    value: taskStats.value.completed,
    icon: CheckCircle2,
    colorClass: 'bg-gradient-to-br from-green-500 to-green-600'
  },
  {
    label: 'High Priority',
    value: taskStats.value.high,
    icon: AlertCircle,
    colorClass: 'bg-gradient-to-br from-red-500 to-red-600'
  }
])

const recentTasks = computed(() => activeTasks.value.slice(0, 6))

const hasCompletedTasks = computed(() => taskStats.value.completed > 0)

const chartTextColor = computed(() => (isDark.value ? '#D1D5DB' : '#4B5563'))
const chartGridColor = computed(() => (isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(17,24,39,0.08)'))

const completionChartData = computed(() => ({
  labels: ['Active', 'Completed'],
  datasets: [
    {
      data: [taskStats.value.active, taskStats.value.completed],
      backgroundColor: ['#A855F7', '#22C55E'],
      borderColor: isDark.value ? '#1A1625' : '#FFFFFF',
      borderWidth: 2,
      hoverOffset: 8
    }
  ]
}))

const priorityChartData = computed(() => ({
  labels: ['High', 'Medium', 'Low'],
  datasets: [
    {
      label: 'Tasks',
      data: [taskStats.value.high, taskStats.value.medium, taskStats.value.low],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
      borderRadius: 8,
      maxBarThickness: 42
    }
  ]
}))

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: chartTextColor.value,
        usePointStyle: true,
        boxWidth: 10
      }
    }
  }
}))

const barOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        color: chartGridColor.value,
        drawBorder: false
      },
      ticks: {
        color: chartTextColor.value
      }
    },
    y: {
      beginAtZero: true,
      precision: 0,
      grid: {
        color: chartGridColor.value,
        drawBorder: false
      },
      ticks: {
        stepSize: 1,
        color: chartTextColor.value
      }
    }
  }
}))

function clearCompleted() {
  showClearConfirm.value = true
}

function handleClearCompleted() {
  taskStore.clearCompleted()
}
</script>
