<template>
  <header
    class="sticky top-0 z-30 mb-6 w-full rounded-2xl border border-gray-200/70 bg-white/90 px-4 py-3 backdrop-blur dark:border-gray-700/70 dark:bg-dark-card/90 md:mb-8 md:px-5 md:py-4"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h1 class="truncate text-xl font-bold leading-tight text-gray-900 dark:text-white md:text-2xl">Task Manager</h1>
        <p class="truncate text-xs text-gray-600 dark:text-gray-400 md:text-sm">{{ pageTitle }}</p>
      </div>

      <div class="flex items-center gap-2">
        <nav class="hidden items-center gap-2 md:flex" aria-label="Header navigation">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20 dark:hover:text-primary-light"
            :class="route.path === item.path ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' : ''"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <button
          type="button"
          @click="openInfoModal"
          class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors duration-200 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-light/50 dark:hover:text-primary-light"
          title="Info about the project"
          aria-label="Open website feature overview"
          aria-haspopup="dialog"
          :aria-expanded="showInfoModal ? 'true' : 'false'"
          aria-controls="features-modal"
        >
         <Info />
        </button>

        <button
          type="button"
          @click="toggleTheme"
          class="rounded-lg border border-gray-200 p-2.5 text-gray-600 transition-colors duration-200 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-light/50 dark:hover:text-primary-light"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <Sun v-if="isDark" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>

        

        

        <button
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="rounded-lg border border-gray-200 p-2.5 text-gray-700 md:hidden dark:border-gray-700 dark:text-gray-300"
          aria-label="Toggle navigation menu"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-main-nav"
        >
          <X v-if="isMobileMenuOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div
      class="overflow-hidden transition-all duration-300 md:hidden"
      :class="isMobileMenuOpen ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'"
    >
      <nav id="mobile-main-nav" class="space-y-2 border-t border-gray-200/80 pt-3 dark:border-gray-700/80" aria-label="Mobile navigation">
        <RouterLink
          v-for="item in navItems"
          :key="`mobile-${item.path}`"
          :to="item.path"
          class="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20 dark:hover:text-primary-light"
          :class="route.path === item.path ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' : ''"
          :aria-label="item.label"
          @click="isMobileMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

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
          v-if="showInfoModal"
          class="fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm p-4 sm:p-6"
          @click.self="closeInfoModal"
        >
          <div class="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center hide-scrollbar">
            <section
              id="features-modal"
              ref="modalRef"
              role="dialog"
              aria-modal="true"
              aria-labelledby="features-modal-title"
              aria-describedby="features-modal-description"
              tabindex="-1"
              class="w-full max-h-[88vh] hide-scrollbar overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-dark-card sm:p-6 md:p-7"
            >
              <div class="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <h2 id="features-modal-title" class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    Website Feature Overview
                  </h2>
                  <p id="features-modal-description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    A quick walkthrough of the core capabilities in this task management website.
                  </p>
                </div>
                <button
                  type="button"
                  @click="closeInfoModal"
                  class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors duration-200 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-light/50 dark:hover:text-primary-light"
                  aria-label="Close feature overview"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>

              <div class="space-y-3 sm:space-y-4 hide-scrollbar">
                <article
                  v-for="feature in featureSections"
                  :key="feature.id"
                  class="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700/80 dark:bg-dark-bg hide-scrollbar"
                >
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {{ feature.id }}. {{ feature.title }}
                  </h3>
                  <p class="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[15px]">
                    {{ feature.description }}
                  </p>
                </article>
              </div>

              
            </section>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Info, Menu, Moon, Sun, X } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/themeStore'

const route = useRoute()
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
const isMobileMenuOpen = ref(false)
const showInfoModal = ref(false)
const modalRef = ref(null)

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'New Task', path: '/tasks/new' }
]

const pageTitle = computed(() => {
  if (route.path === '/') return 'Overview and insights'
  if (route.path === '/tasks') return 'All your tasks in one place'
  if (route.path === '/tasks/new') return 'Create a new task'
  if (route.path.startsWith('/tasks/')) return 'Task details'
  return 'Plan your work effectively'
})

const featureSections = [
  {
    id: 1,
    title: 'Task Management (CRUD)',
    description: 'Create new tasks, read details, update existing tasks, and delete tasks with confirmation. The app also keeps local storage in sync.'
  },
  {
    id: 2,
    title: 'Routing',
    description: 'Navigation is handled with Vue Router for dashboard, task listing, new task creation, and task detail pages.'
  },
  {
    id: 3,
    title: 'State Management',
    points: '15',
    description: 'Pinia centralized store keep task and theme state so every component reads and updates consistent shared data across the entire website.'
  },
  {
    id: 4,
    title: 'UI and Responsiveness',
    points: '10',
    description: 'Whole layout is responsive across all devices with the help of tailwind break points'
  },
  {
    id: 5,
    title: 'Animations',
    description: 'Smooth transitions for pages and cards with the help of gsap and css'
  },
  {
    id: 6,
    title: 'Composition API Usage',
    description: 'Components use script setup, vue 3 composition APIs as instructed'
  },
  {
    id: 7,
    title: 'Component Architecture',
    description: 'The app is organized into reusable components such as header, sidebar, task cards and forms'
  },
  {
    id: 8,
    title: 'Performance Optimization',
    description: 'Using computed filtering, lazy loads and slots for performance optimization'
  },
  {
    id: 9,
    title: 'UX Enhancements',

    description: 'Helpful confirmations, clear labels, visual status indicators'
  },
  {
    id: 10,
    title: 'Keyboard Navigation & Accessability',
    description: 'Added keyboard navigation & accessability for the sake of ease usage'
  }
]

function onModalKeydown(event) {
  if (event.key === 'Escape') {
    closeInfoModal()
    return
  }

  if (event.key !== 'Tab' || !showInfoModal.value || !modalRef.value) return

  const focusable = modalRef.value.querySelectorAll(
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

function openInfoModal() {
  showInfoModal.value = true
  nextTick(() => {
    modalRef.value?.focus()
  })
  window.addEventListener('keydown', onModalKeydown)
}

function closeInfoModal() {
  showInfoModal.value = false
  window.removeEventListener('keydown', onModalKeydown)
}

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
    closeInfoModal()
  }
)
</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
  display: none; 
}
</style>


