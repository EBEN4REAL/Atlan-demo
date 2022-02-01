<template>
    <a-popover
        placement="bottom"
        :destroy-tooltip-on-hide="true"
        trigger="click"
    >
        <template #content>
            <div class="p-4 space-y-4 overflow-x-auto max-h-60 w-44">
                <h1 class="font-bold">Properties</h1>
                <template v-for="p in applicableList" :key="p.name">
                    <div class="flex flex-col">
                        <div class="flex gap-x-2">
                            <div class="flex items-center w-full gap-x-1">
                                <div class="flex-grow text-gray-700">
                                    <Truncate
                                        :tooltip-text="p.displayName"
                                        width="500px"
                                        placement="left"
                                    />
                                </div>
                                <a-tooltip>
                                    <template #title>
                                        <span>{{ p.options.description }}</span>
                                    </template>
                                    <div class="">
                                        <AtlanIcon
                                            v-if="p.options.description"
                                            class="h-3 text-gray-400 hover:text-gray-500"
                                            icon="Info"
                                        />
                                    </div>
                                </a-tooltip>
                            </div>
                            <span
                                class="flex items-center text-gray-500 capitalize gap-x-1"
                            >
                                <div class="flex">
                                    <AtlanIcon
                                        v-if="
                                            p.options.multiValueSelect ===
                                            'true'
                                        "
                                        icon="Array"
                                        class="h-3"
                                    />
                                    <AtlanIcon
                                        :icon="
                                            getDataTypeIcon(
                                                p?.options?.primitiveType
                                            )
                                        "
                                        class="h-3"
                                    />
                                </div>
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </template>
        <span class="underline cursor-pointer text-primary"
            >{{ applicableList.length }} properties</span
        >
    </a-popover>
</template>

<script setup lang="ts">
    import { getDataTypeIcon } from '~/utils/dataType'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'
    import Truncate from '@/common/ellipsis/index.vue'

    const props = defineProps({
        applicableList: {
            type: Array,
            required: true,
        },
    })
</script>

<style scoped></style>
