<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root open>
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup data-testid="parent-popup">
          <Drawer.Root open>
            <Drawer.Portal>
              <Drawer.Viewport>
                <Drawer.Popup
                  data-testid="child-popup"
                  style="
                    height: 100px;
                    border-top: 2px solid transparent;
                    border-bottom: 2px solid transparent;
                  "
                >
                  <div style="height: 10px">Child drawer</div>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
