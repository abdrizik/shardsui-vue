<script setup lang="ts">
import { shallowRef } from 'vue'
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()
const mounted = shallowRef(true)
</script>

<template>
  <div>
    <AlertDialog.Trigger :handle="handle" id="trigger">Trigger</AlertDialog.Trigger>

    <button v-if="!mounted" type="button" @click="mounted = true">Remount root</button>

    <AlertDialog.Root v-if="mounted" :handle="handle">
      <AlertDialog.Portal>
        <AlertDialog.Popup>
          Alert dialog content
          <button type="button" @click="mounted = false">Unmount root</button>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
