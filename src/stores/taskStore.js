import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const TASKS_STORAGE_KEY = 'task-manager.tasks'

const defaultTasks = [
  {
    id: 1,
    title: 'Design Dashboard UI',
    description: 'Create a modern and responsive dashboard layout with Tailwind CSS',
    priority: 'high',
    completed: false,
    createdAt: new Date('2026-03-20'),
    dueDate: new Date('2026-03-25')
  },
  {
    id: 2,
    title: 'Implement Authentication',
    description: 'Set up user authentication with JWT tokens',
    priority: 'medium',
    completed: false,
    createdAt: new Date('2026-03-21'),
    dueDate: new Date('2026-03-28')
  },
  {
    id: 3,
    title: 'Write Documentation',
    description: 'Document all API endpoints and component usage',
    priority: 'low',
    completed: true,
    createdAt: new Date('2026-03-19'),
    dueDate: new Date('2026-03-22')
  }
]

function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) return defaultTasks

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultTasks

    return parsed.map(task => ({
      ...task,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    }))
  } catch {
    return defaultTasks
  }
}

function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Ignore storage write errors.
  }
}

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref(loadTasksFromStorage())

  // Getters
  const allTasks = computed(() => tasks.value)

  const activeTasks = computed(() =>
    tasks.value.filter(task => !task.completed)
  )

  const completedTasks = computed(() =>
    tasks.value.filter(task => task.completed)
  )

  const tasksByPriority = computed(() => (priority) =>
    tasks.value.filter(task => task.priority === priority)
  )

  const getTaskById = computed(() => (id) =>
    tasks.value.find(task => task.id === parseInt(id))
  )

  const taskStats = computed(() => ({
    total: tasks.value.length,
    active: activeTasks.value.length,
    completed: completedTasks.value.length,
    high: tasksByPriority.value('high').length,
    medium: tasksByPriority.value('medium').length,
    low: tasksByPriority.value('low').length
  }))

  // Actions
  function addTask(taskData) {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || 'medium',
      completed: false,
      createdAt: new Date(),
      dueDate: taskData.dueDate || null
    }
    tasks.value.unshift(newTask)
    saveTasksToStorage(tasks.value)
    return newTask
  }

  function updateTask(id, updates) {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
      saveTasksToStorage(tasks.value)
      return tasks.value[index]
    }
    return null
  }

  function toggleTaskComplete(id) {
    const task = tasks.value.find(task => task.id === id)
    if (task) {
      task.completed = !task.completed
      saveTasksToStorage(tasks.value)
      return task
    }
    return null
  }

  function deleteTask(id) {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      const deletedTask = tasks.value.splice(index, 1)[0]
      saveTasksToStorage(tasks.value)
      return deletedTask
    }
    return null
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter(task => !task.completed)
    saveTasksToStorage(tasks.value)
  }

  return {
    tasks,
    allTasks,
    activeTasks,
    completedTasks,
    tasksByPriority,
    getTaskById,
    taskStats,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    clearCompleted
  }
})
