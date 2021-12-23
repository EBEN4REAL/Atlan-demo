<template>
    <div class="">
        You haven't saved the changes made to
        <b>{{ title }}</b
        >, do you want to discard them?
    </div>
    <!-- <Modal :modal-visible="discardModal" :has-inputs="false">
        <template #leftHeader>
            <div class="text-xl font-semibold">Discard Changes</div>
        </template>
        <template #default>
            <div class="px-2 m-4">
                You haven't saved the changes made to
                <b>{{ title }}</b
                >, do you want to discard them?
            </div>
        </template>
        <template #actionButtons>
            <AtlanButton
                color="minimal"
                padding="compact"
                @click="confirmStatus = 'reject'"
            >
                Cancel
            </AtlanButton>
            <AtlanButton color="danger" @click="confirmStatus = 'accept'">
                Discard
            </AtlanButton>
        </template>
    </Modal> -->
</template>

<script setup lang="ts">
    // import Modal from '@/common/modal/modal.vue'
    import { watchOnce } from '@vueuse/core'
    import { Modal } from 'ant-design-vue'
    import { ref } from 'vue'

    const props = defineProps({
        title: {
            required: true,
            type: String,
        },
    })
    const discardModal = ref(false)
    const confirmStatus = ref()

    // const confirmDiscard = () => {
    //     discardModal.value = true
    //     return new Promise((resolve, reject) => {
    //         watchOnce(confirmStatus, (v) => {
    //             if (v === 'reject') reject(new Error('rejected'))
    //             else if (v === 'accept') resolve(true)
    //             discardModal.value = false
    //         })
    //     })
    // }
</script>

<style scoped></style>
