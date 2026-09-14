<script setup lang="ts">
import { useTemplateRef } from 'vue'
import DismissPortalLayer from './dismiss-portal-layer.vue'

const otherContainer = useTemplateRef<HTMLDivElement>('other')
</script>

<template>
  <DismissPortalLayer trigger-text="open 1">
    <DismissPortalLayer trigger-text="open 2" :container="otherContainer">
      <button>nested</button>
    </DismissPortalLayer>
  </DismissPortalLayer>
  <div ref="other"></div>
</template>
