<script setup lang="ts">
import { shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'

const value = shallowRef('')
</script>

<template>
  <button type="button" data-testid="update" @click="value = 'ba'">update value</button>
  <Autocomplete.Root v-model:value="value" :items="['apple', 'banana']" mode="both">
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
