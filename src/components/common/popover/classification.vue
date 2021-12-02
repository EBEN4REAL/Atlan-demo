<template>
    <a-popover>
        <template #content>
            <div class="flex flex-col p-4 text-gray-700 w-96">
                <div class="flex justify-between mb-2 text-sm">
                    <span>
                        <AtlanIcon icon="ShieldCheck" class="mb-1 mr-1" />
                        <span class="text-gray-500">CLASSIFICATION</span>
                    </span>
                    <span v-if="classification?.propagate" class="text-primary">
                        Propagated
                    </span>
                </div>
                <span class="mb-3 text-sm font-bold">
                    {{
                        classification?.displayName || classification?.typeName
                    }}
                </span>

                <span class="mb-1 text-xs text-gray-500">Description</span>
                <span v-if="classification.description" class="mb-3 text-sm">
                    {{ classification.description }}
                </span>
                <span v-else class="mb-3 text-sm"
                    >This classification has no description added</span
                >

                <div class="">
                    <span
                        v-if="classification.propagatedBy"
                        class="mt-4 mb-1 text-xs text-gray-500"
                    >
                        Propagated by
                    </span>
                    <div class="flex flex-wrap gap-3">
                        <span
                            v-if="classification.propagate"
                            class="text-primary"
                            >{{ classification.propagatedBy }}</span
                        >
                    </div>
                </div>
                <div class="flex gap-x-10">
                    <div class="">
                        <span
                            v-if="classification.createdBy"
                            class="mt-4 mb-1 text-xs text-gray-500"
                        >
                            Created by
                        </span>
                        <div class="flex flex-wrap gap-3">
                            <span>
                                {{ classification.createdBy }}
                            </span>
                        </div>
                    </div>
                    <div class="">
                        <span
                            v-if="classification.updatedBy"
                            class="mt-4 mb-1 text-xs text-gray-500"
                        >
                            Updated by
                        </span>
                        <div class="flex flex-wrap gap-3">
                            <span>
                                {{ classification.updatedBy }}
                            </span>
                        </div>
                    </div>
                    <div class="">
                        <span
                            v-if="classification.updateTime"
                            class="mt-4 mb-1 text-xs text-gray-500"
                        >
                            Updated at
                        </span>
                        <div class="flex flex-wrap gap-3">
                            <span v-if="classification.updateTime">
                                {{
                                    useTimeAgo(classification.updateTime).value
                                }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationInfoPopover',
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup() {
            return { useTimeAgo }
        },
    })
</script>
