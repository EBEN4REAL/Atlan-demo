<template>
    <a-dropdown trigger="click" placement="bottomRight">
        <template #overlay>
            <a-menu class="p-1 request-preview">
                <a-menu-item
                    v-for="stat in listStatus"
                    :key="stat.key"
                    :class="'hover:bg-primary-light'"
                    @click="selectedFilter = stat"
                >
                    <div
                        class="flex items-center rounded hover:bg-primary-light menu-status"
                    >
                        <AtlanIcon
                            :class="stat.class"
                            class="mr-1"
                            :icon="stat.icon"
                        />
                        <!-- <div
                                    class="mr-2 dot"
                                    :style="{
                                        background: stat.color,
                                    }"
                                /> -->
                        {{ stat.name }}
                        <AtlanIcon
                            v-if="selectedFilter.key === stat.key"
                            icon="Check"
                            class="ml-auto text-primary"
                        />
                    </div>
                </a-menu-item>
            </a-menu>
        </template>

        <div
            class="flex text-gray-700 text-xs items-center bg-white py-1.5 px-2 rounded border border-gray-300 cursor-pointer w-32"
        >
            <AtlanIcon
                :class="selectedFilter.class"
                class="mr-2"
                :icon="selectedFilter.icon"
            />
            {{ selectedFilter.name }}
            <AtlanIcon class="ml-auto" icon="ChevronDown" />
        </div>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, toRefs, ref, watch } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import { listStatus } from '@/governance/requests/requestType'

    export default defineComponent({
        name: 'RequestTab',
        components: { AtlanButton },
        props: {},
        setup(props, { emit }) {
            const selectedFilter = ref(listStatus[0])
            const filterStatus = ref({
                status: selectedFilter.value.key,
            })
            watch(selectedFilter, () => {
                if (selectedFilter.value.key === 'all') {
                    filterStatus.value = {}
                } else {
                    filterStatus.value = {
                        status: selectedFilter.value.key,
                    }
                }
                emit('change', filterStatus.value)
            })
            return {
                listStatus,
                selectedFilter,
            }
        },
    })
</script>

<style lang="less">
    .check-icon {
        transform: scale(1.2) !important;
    }
    .container-scroll-request {
        max-height: 655px;
        padding: 12px;
    }
    .menu-status {
        width: 150px;
    }
</style>
<style lang="less" scoped>
    .container-loading {
        height: 500px;
    }
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
    }
</style>
