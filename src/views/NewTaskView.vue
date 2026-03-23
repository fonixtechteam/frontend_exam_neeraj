<template>
  <div class="min-h-[60vh]">
    <!-- Task Form -->
    <TaskForm @success="handleSuccess" @cancel="handleCancel" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import TaskForm from '@/components/TaskForm.vue'

const router = useRouter()

function handleSuccess() {
  // Navigation is handled in TaskForm
}

function handleCancel() {
  router.push('/tasks')
}
</script>
