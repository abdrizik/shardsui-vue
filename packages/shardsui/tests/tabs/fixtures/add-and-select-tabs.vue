<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tabs } from '@/components/tabs'

const { stringValues = false } = defineProps<{ stringValues?: boolean }>()

const useStrings = stringValues
const initial: Array<string | number> = useStrings ? ['Overview', 'Projects'] : [0, 1]
const added = useStrings ? 'Account' : 2

const tabValues = shallowRef<Array<string | number>>(initial)
const value = shallowRef<string | number>(initial[0]!)

function addAndSelect() {
  tabValues.value = [...tabValues.value, added]
  value.value = added
}
</script>

<template>
  <button type="button" @click="addAndSelect">Add and Select</button>
  <Tabs.Root :value="value" data-testid="root">
    <Tabs.List>
      <Tabs.Tab v-for="tabValue in tabValues" :key="tabValue" :value="tabValue">
        {{ tabValue }}
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel
      v-for="tabValue in tabValues"
      :key="tabValue"
      :value="tabValue"
      keep-mounted
      :data-testid="`panel-${tabValue}`"
    />
  </Tabs.Root>
</template>
