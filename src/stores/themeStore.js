import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // Initialize from localStorage or default to dark
  const isDark = ref(localStorage.getItem('theme') === 'dark' || localStorage.getItem('theme') === null)

  // Watch for changes and update localStorage and document class
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    if (newValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(theme) {
    isDark.value = theme === 'dark'
  }

  return {
    isDark,
    toggleTheme,
    setTheme
  }
})
