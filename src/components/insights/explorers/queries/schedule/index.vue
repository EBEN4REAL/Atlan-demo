<template>
    <div class="w-full h-full bg-white">
        <Header />
        <Info />
        <div
            class="flex items-center justify-end p-6 text-sm border-t border-gray-200 rounded-b-lg bg-primary-light"
            style="height: 80px"
        >
            <p
                class="mr-6 text-sm text-gray-700 cursor-pointer"
                @click="closeModal"
            >
                Cancel
            </p>
            <AtlanButton color="primary" @click="reload" class="h-8 px-5 py-0">
                <div class="flex items-center">
                    <span class="mr-1 text-sm">Next</span>
                    <AtlanIcon icon="ChevronRight" />
                </div>
            </AtlanButton>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Header from './header.vue'
    import Info from './info.vue'
    import AtlanButton from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Schedule Query',
        components: { Header, Info, AtlanButton },
        props: {
            scheduleQueryModal: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            const { scheduleQueryModal } = useVModels(props)
            const closeModal = () => {
                scheduleQueryModal.value = false
            }

            return {
                closeModal,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
