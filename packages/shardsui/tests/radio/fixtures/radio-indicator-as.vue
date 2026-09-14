<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { as } = defineProps<{ as?: 'span' | 'div' }>()
</script>

<template>
  <RadioGroup value="a">
    <Radio.Root value="a">
      <Radio.Indicator :as="as" data-testid="indicator" />
    </Radio.Root>
  </RadioGroup>
</template>
