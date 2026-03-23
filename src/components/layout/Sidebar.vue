<template>
  <aside
    class="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center border-r border-gray-200 bg-white py-6 shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-dark-card md:flex"
    aria-label="Sidebar navigation"
  >
    <!-- Logo -->
    <div class="mb-8 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg" aria-hidden="true">
      <CheckSquare class="w-7 h-7 text-white" />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 flex flex-col gap-2 w-full px-3" aria-label="Primary">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="group relative flex h-14 w-14 items-center justify-center rounded-xl text-gray-600 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/20 dark:hover:text-primary-light"
        active-class="bg-primary/10 text-primary shadow-md dark:bg-primary/20 dark:text-primary-light"
        :title="item.name"
        :aria-label="item.name"
      >
        <component :is="item.icon" class="w-6 h-6 transition-transform group-hover:scale-110" />
      </RouterLink>
    </nav>

    <!-- Theme Toggle -->
    <button
      type="button"
      @click="toggleTheme"
      class="group mt-4 flex h-14 w-14 items-center justify-center rounded-xl text-gray-600 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/20 dark:hover:text-primary-light"
      :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <Sun v-if="isDark" class="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-90" />
      <Moon v-else class="w-6 h-6 transition-transform group-hover:scale-110 group-hover:-rotate-12" />
    </button>
  </aside>
</template>

<script setup>
import { LayoutDashboard, ListTodo, PlusCircle, CheckSquare, Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'All Tasks', path: '/tasks', icon: ListTodo },
  { name: 'Add Task', path: '/tasks/new', icon: PlusCircle },
]
</script>
