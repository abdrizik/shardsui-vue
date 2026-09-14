<script setup lang="ts">
import { Toast } from '@/components/toast'

const {
  timeout = 5000,
  successTimeout,
  errorTimeout
} = defineProps<{
  timeout?: number
  successTimeout?: number
  errorTimeout?: number
}>()

const manager = Toast.createManager()

let resolvePromise: ((v: string) => void) | null = null
let rejectPromise: ((e: Error) => void) | null = null

function startCustomLoading() {
  const p = new Promise<string>((res) => {
    resolvePromise = res
  })
  manager
    .promise(p, {
      loading: { title: 'loading title', description: 'loading description' },
      success: 'success',
      error: 'error'
    })
    .catch(() => {})
}

function startWithSuccessTimeout() {
  const p = new Promise<string>((res) => {
    resolvePromise = res
  })
  manager
    .promise(p, {
      loading: 'loading',
      success: { description: 'success', timeout: successTimeout ?? 2000 },
      error: 'error'
    })
    .catch(() => {})
}

function startWithErrorTimeout() {
  const p = new Promise<string>((_, rej) => {
    rejectPromise = rej
  })
  manager
    .promise(p, {
      loading: 'loading',
      success: 'success',
      error: { description: 'error', timeout: errorTimeout ?? 3000 }
    })
    .catch(() => {})
}

function startWithSuccessOptionsFn() {
  const p = new Promise<string>((res) => {
    resolvePromise = res
  })
  manager
    .promise(p, {
      loading: 'loading',
      success: (data) => ({ title: `saved ${data}`, description: 'done', timeout: 2000 }),
      error: 'error'
    })
    .catch(() => {})
}

function startWithZeroSuccessTimeout() {
  const p = new Promise<string>((res) => {
    resolvePromise = res
  })
  manager
    .promise(p, {
      loading: 'loading',
      success: { description: 'success', timeout: 0 },
      error: 'error'
    })
    .catch(() => {})
}

function doResolve() {
  resolvePromise?.('test success')
}

function doReject() {
  rejectPromise?.(new Error('test error'))
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="timeout">
    <button type="button" data-testid="start-custom-loading" @click="startCustomLoading">
      start custom loading
    </button>
    <button type="button" data-testid="start-success-timeout" @click="startWithSuccessTimeout">
      start success timeout
    </button>
    <button type="button" data-testid="start-error-timeout" @click="startWithErrorTimeout">
      start error timeout
    </button>
    <button type="button" data-testid="start-success-options-fn" @click="startWithSuccessOptionsFn">
      start success options fn
    </button>
    <button
      type="button"
      data-testid="start-zero-success-timeout"
      @click="startWithZeroSuccessTimeout"
    >
      start zero success timeout
    </button>
    <button type="button" data-testid="resolve" @click="doResolve">resolve</button>
    <button type="button" data-testid="reject" @click="doReject">reject</button>

    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title ?? '' }}</Toast.Title>
        <Toast.Description data-testid="description">{{
          toast.description ?? ''
        }}</Toast.Description>
        <Toast.Close aria-label="close-press" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
