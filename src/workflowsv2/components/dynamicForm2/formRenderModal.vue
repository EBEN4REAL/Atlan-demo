<template>
    <div>
        <a-button type="primary" @click="showModal"
            >Open Modal with async logic</a-button
        >
        <a-modal
            title="Title"
            v-model:visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
        >
            <p>{{ modalText }}</p>
            <!-- <FormGenerator /> -->
        </a-modal>
    </div>
</template>
<script lang="ts">
    import { ref, defineComponent } from 'vue'
    import FormGenerator from './index.vue'

    export default defineComponent({
        name: 'FormRenderModal',
        components: { FormGenerator },
        setup() {
            const modalText = ref<string>('Content of the modal')
            const visible = ref<boolean>(false)
            const confirmLoading = ref<boolean>(false)

            const showModal = () => {
                visible.value = true
            }

            const handleOk = () => {
                modalText.value = 'The modal will be closed after two seconds'
                confirmLoading.value = true
                setTimeout(() => {
                    visible.value = false
                    confirmLoading.value = false
                }, 2000)
            }
            return {
                modalText,
                visible,
                confirmLoading,
                showModal,
                handleOk,
            }
        },
    })
</script>
