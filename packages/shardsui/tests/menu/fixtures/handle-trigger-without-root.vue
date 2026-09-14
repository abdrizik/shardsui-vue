<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { MenuHandle } from '@/components/menu/handle'

const { handle = Menu.createHandle() } = defineProps<{
  handle?: MenuHandle
}>()
</script>

<template>
  <Menu.Trigger :handle="handle" id="trigger-1">Trigger 1</Menu.Trigger>
</template>
