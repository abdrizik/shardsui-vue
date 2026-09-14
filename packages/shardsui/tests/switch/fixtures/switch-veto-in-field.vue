<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Switch } from '@/components/switch'

const checked = shallowRef(false)
</script>

<template>
  <Field.Root>
    <Switch.Root data-testid="switch" :checked="checked" @update:checked="() => {}">
      <Switch.Thumb />
    </Switch.Root>
  </Field.Root>
</template>
