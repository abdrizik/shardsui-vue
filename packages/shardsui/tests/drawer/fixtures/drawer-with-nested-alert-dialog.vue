<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root open :modal="false">
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup data-testid="parent-popup">
          <Drawer.Root open :modal="false">
            <Drawer.Portal>
              <Drawer.Viewport>
                <Drawer.Popup data-testid="child-popup">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>Open alert dialog</AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Popup data-testid="alert-dialog-popup">
                        Alert dialog
                        <AlertDialog.Close>Close alert dialog</AlertDialog.Close>
                      </AlertDialog.Popup>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
