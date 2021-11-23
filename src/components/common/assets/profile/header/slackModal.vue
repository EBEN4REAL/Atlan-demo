<template>
    <div
        class=""
        @click="
            () => {
                visible = true
                $emit('closeParent')
            }
        "
    >
        <slot />
    </div>
    <a-modal v-model:visible="visible" :closable="false">
        <div class="p-4">
            <a-select
                v-model:value="channel"
                class="w-full"
                :options="channels"
            />
        </div>
    </a-modal>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits, defineContext, ref } from 'vue'
    import intStore from '~/store/integrations/index'

    const emit = defineEmits(['closeParent'])

    const store = intStore()

    const visible = ref(false)
    const channel = ref('')
    const channels = ref([])
</script>

<style scoped></style>
