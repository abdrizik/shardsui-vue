<script setup lang="ts">
import { Toast } from '@/components/toast'

const { timeout = 5000 } = defineProps<{ timeout?: number }>()

const manager = Toast.createManager()

let resolvePromise: ((v: string) => void) | null = null
let rejectPromise: ((e: Error) => void) | null = null

function startPromise(successMsg: string, errorMsg: string) {
  const p = new Promise<string>((res, rej) => {
    resolvePromise = res
    rejectPromise = rej
  })

  manager
    .promise(p, {
      loading: 'loading',
      success: successMsg,
      error: errorMsg
    })
    .catch(() => {})
}

function startPromiseWithFn() {
  const p = new Promise<string>((res) => {
    resolvePromise = res
  })
  manager
    .promise(p, {
      loading: 'loading',
      success: (data) => `${data}`,
      error: 'error'
    })
    .catch(() => {})
}

function startErrorWithFn() {
  const p = new Promise<string>((_, rej) => {
    rejectPromise = rej
  })
  manager
    .promise(p, {
      loading: 'loading',
      success: 'success',
      error: (err: unknown) => `${err instanceof Error ? err.message : String(err)}`
    })
    .catch(() => {})
}

function doResolve() {
  resolvePromise?.('test success')
}

function doReject() {
  rejectPromise?.(new Error('test error'))
}

function closeToast() {
  manager.close()
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="timeout">
    <button type="button" data-testid="start-promise" @click="startPromise('success', 'error')">
      start promise
    </button>
    <button type="button" data-testid="start-reject" @click="startPromise('success', 'error')">
      start reject
    </button>
    <button type="button" data-testid="start-fn-success" @click="startPromiseWithFn">
      start fn success
    </button>
    <button type="button" data-testid="start-fn-error" @click="startErrorWithFn">
      start fn error
    </button>
    <button type="button" data-testid="resolve" @click="doResolve">resolve</button>
    <button type="button" data-testid="reject" @click="doReject">reject</button>
    <button type="button" data-testid="close-all" @click="closeToast">close all</button>

    <Toast.Viewport>
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Description data-testid="description">{{
          toast.description ?? ''
        }}</Toast.Description>
        <Toast.Close aria-label="close-press" />
        <span data-testid="type">{{ toast.type ?? '' }}</span>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
