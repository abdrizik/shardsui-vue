<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <RadioGroup>
    <Radio.Root value="a" data-testid="a">
      <Radio.Indicator keep-mounted data-testid="indicator-a" />
    </Radio.Root>
    <Radio.Root value="b" data-testid="b">
      <Radio.Indicator keep-mounted data-testid="indicator-b" />
    </Radio.Root>
  </RadioGroup>
</template>
