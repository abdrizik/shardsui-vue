<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
</script>

<template>
  <PreviewCard.Root open>
    <PreviewCard.Portal>
      <PreviewCard.Popup />
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>
