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
                <span class="mb-1 text-sm font-bold">
                    {{
                        classification?.displayName || classification?.typeName
                    }}
                </span>

                <div class="flex gap-2 mt-1 mb-1">
                    <div
                        v-if="classification.updateTime"
                        class="text-xs text-gray-500"
                    >
                        Last updated

                        <strong class="font-bold text-black">
                            {{ useTimeAgo(classification.updateTime).value }}
                        </strong>
                    </div>

                    <div
                        v-if="classification.updatedBy"
                        class="text-xs text-gray-500"
                    >
                        By
                        <AtlanIcon icon="User" class="mr-1 text-xs" />
                        <span class="font-bold text-black capitalize">{{
                            classification.updatedBy
                        }}</span>
                    </div>
                </div>

                <span class="mt-1 mb-1 text-xs text-gray-500">Description</span>
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
                <div v-if="classification.createdBy" class="flex gap-x-10">
                    <div class="">
                        <span class="mt-4 mb-1 text-xs text-gray-500">
                            Created by
                        </span>
                        <div class="flex flex-wrap gap-3">
                            <UserPill
                                :enable-hover="false"
                                :username="classification.createdBy"
                            ></UserPill>
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
    import UserPill from '@/common/pills/user.vue'

    export default defineComponent({
        name: 'ClassificationInfoPopover',
        components: {
            UserPill,
        },
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
