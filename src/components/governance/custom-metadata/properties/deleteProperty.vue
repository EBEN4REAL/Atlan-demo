<template>
    <a-popover v-model:visible="popover" trigger="click" placement="left">
        <template #content>
            <div class="p-4 space-y-5">
                <h1>
                    Are you sure you want to delete
                    <b>{{ name }}</b
                    >?
                </h1>
                <div class="flex justify-end space-x-3">
                    <AtlanButton2
                        label="Cancel"
                        color="secondary"
                        @click="popover = false"
                    />
                    <AtlanButton2
                        label="Confirm"
                        color="danger"
                        @click="handleConfirm"
                    />
                </div>
            </div>
        </template>
        <slot />
    </a-popover>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const popover = ref(false)
    const emit = defineEmits(['confirm'])
    const props = defineProps(['name'])

    const handleConfirm = () => {
        emit('confirm')
        popover.value = false
    }
</script>

<style scoped></style>
