<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
import { Dialog } from '@/components/dialog'
</script>

<template>
  <AlertDialog.Root open>
    <AlertDialog.Portal>
      <AlertDialog.Popup data-testid="parent-dialog" />
      <Dialog.Root open>
        <Dialog.Portal>
          <Dialog.Popup data-testid="nested-dialog">
            <Dialog.Root>
              <Dialog.Portal>
                <Dialog.Popup />
              </Dialog.Portal>
            </Dialog.Root>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
