<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[140] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-gray-900 focus:shadow-lg"
  >
    Skip to main content
  </a>

  <!-- Starting Screen -->
  <StartingScreen v-if="showLoader" @finished="showLoader = false" />

  <!-- Main App -->
  <div
    class="min-h-screen bg-light-bg transition-colors duration-300 dark:bg-dark-bg"
    :class="{ 'dark': isDark }"
    :aria-busy="showLoader ? 'true' : 'false'"
  >
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="h-screen p-4 sm:p-5 md:ml-20 md:p-8 overflow-hidden flex flex-col items-center justify-between">
      <AppHeader />

      <main id="main-content" class="w-full h-full hide-scrollbar overflow-x-hidden overflow-y-auto pb-16 md:pb-5" tabindex="-1">
        <!-- Page Transition Wrapper -->
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in" appear>
            <div class="route-shell" :key="route.fullPath">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from './stores/themeStore'
import Sidebar from './components/layout/Sidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'
import StartingScreen from './components/StartingScreen.vue'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const showLoader = ref(true)
</script>

<style>
.route-shell {
  width: 100%;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; 
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: transform 0.38s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.38s ease;
  will-change: transform;
}

.page-enter-from {
  transform: translateY(24px);
  opacity: 0;
}

.page-enter-to,
.page-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.page-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-dark-bg;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-700 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-600;
}
</style>

