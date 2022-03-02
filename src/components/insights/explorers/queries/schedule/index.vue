<template>
    <div class="w-full h-full bg-white">
        <Header />
        <keep-alive>
            <Info v-if="activeTabIndex === 0" />
        </keep-alive>
        <keep-alive>
            <Variables v-if="activeTabIndex === 1" />
        </keep-alive>
        <keep-alive>
            <Success v-if="activeTabIndex === 2" />
        </keep-alive>
        <div
            class="flex items-center justify-between p-6 text-sm border-t border-gray-200 rounded-b-lg bg-primary-light"
            style="height: 80px"
        >
            <div>
                <AtlanButton
                    color="light"
                    @click="() => shiftIndex('back')"
                    v-if="activeTabIndex === 1"
                    class="flex justify-center h-8 px-5 py-0 text-gray-700 bg-white border border-gray-300 rounded"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="ChevronLeft" class="-mt-0.5" />
                        <span class="ml-1 text-sm">Back</span>
                    </div>
                </AtlanButton>
            </div>
            <div class="flex items-center">
                <AtlanButton
                    color="light"
                    @click="closeModal"
                    class="h-8 px-5 py-0 mr-2 text-sm text-gray-700"
                >
                    <div class="flex items-center">
                        <span class="ml-1 text-sm">Cancel</span>
                    </div>
                </AtlanButton>
                <AtlanButton
                    color="primary"
                    @click="() => shiftIndex('next')"
                    class="h-8 px-5 py-0"
                >
                    <div class="flex items-center">
                        <span class="mr-1 text-sm">{{
                            activeTabIndex === 2 ? 'Done' : 'Next'
                        }}</span>
                        <AtlanIcon
                            icon="ChevronRight"
                            v-if="activeTabIndex !== 2"
                        />
                    </div>
                </AtlanButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import Header from './header.vue'
    import Info from './info.vue'
    import Variables from './variables.vue'
    import Success from './success.vue'
    import AtlanButton from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Schedule Query',
        components: { Header, Info, AtlanButton, Variables, Success },
        props: {
            scheduleQueryModal: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            const { scheduleQueryModal } = useVModels(props)
            const activeTabIndex = ref(0)
            const closeModal = () => {
                scheduleQueryModal.value = false
                activeTabIndex.value = 0
            }

            const shiftIndex = (type: 'next' | 'back') => {
                if (activeTabIndex.value === 2) {
                    closeModal()
                    return
                }
                if (type === 'next') {
                    if (activeTabIndex.value < 2)
                        activeTabIndex.value = activeTabIndex.value + 1
                } else if (type === 'back') {
                    if (activeTabIndex.value > 0)
                        activeTabIndex.value = activeTabIndex.value - 1
                }
            }

            return {
                shiftIndex,
                activeTabIndex,
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
