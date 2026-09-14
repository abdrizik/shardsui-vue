<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <RadioGroup value="1" disabled read-only required>
    <Radio.Root value="1" data-testid="item">
      <Radio.Indicator data-testid="indicator" />
    </Radio.Root>
  </RadioGroup>
</template>
