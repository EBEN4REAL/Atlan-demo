<template>
    <template v-if="name === 'certificateStatus'">
        <div class="flex flex-col">
            <span class="pb-1 mr-2 text-sm text-gray-500">
                Update Certificate</span
            >
            <StatusBadge :status-id="value" show-no-status show-label />
        </div>
    </template>
    <template v-else>
        <div class="flex flex-col w-full">
            <span class="pb-1 pr-2 text-gray-500">{{ attrLabel }}</span>
            <span class="text-ellipsis text-gray">
                <div
                    v-if="name === 'ownerUsers' && valueArray?.length"
                    class="flex items-center"
                >
                    <template v-for="el in valueArray.slice(0, 1)" :key="el"
                        ><span
                            class="border-gray-200 px-2 py-1 border rounded-full mr-1 flex items-center"
                            ><atlan-icon icon="User" class="mr-1 h-3" />{{
                                el
                            }}</span
                        ></template
                    >
                    <a-popover>
                        <template #content>
                            <div class="flex flex-col">
                                <template v-for="i in valueArray.slice(1)" :key="i">
                                    <span
                                        class="border-gray-200 px-2 py-1  flex items-center"
                                        ><atlan-icon
                                            icon="User"
                                            class="mr-1 h-3"
                                        />{{ i }}</span
                                    >
                                </template>
                            </div>
                        </template>

                        <span
                            v-if="valueArray?.length > 1"
                            class="text-primary flex items-center cursor-pointer"
                            >+ {{ valueArray?.length - 1 }} more</span
                        >
                    </a-popover>
                </div>
                <Truncate v-else :tooltip-text="value" />
            </span>
        </div>
    </template>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        props: {
            name: { type: String, required: true },
            value: { type: String, required: true },
            valueArray: { type: Array, required: true },
        },
        components: { StatusBadge, Truncate },
        setup(props) {
            const { name } = toRefs(props)
            const labelMap = {
                userDescription: 'Update description',
                certificateStatus: 'Update certificate',
                ownerUsers: 'Update Owners',
                ownerGroups: 'Update Groups',
            }

            const attrLabel = computed(() => labelMap[name.value] || 'ATTR')

            return { attrLabel }
        },
    })
</script>
