<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <div>
    <label data-testid="label" for="myRadio">A</label>
    <RadioGroup value="b">
      <Radio.Root value="a" id="myRadio" as="button" data-testid="a" />
      <Radio.Root value="b" data-testid="b" />
    </RadioGroup>
  </div>
</template>
