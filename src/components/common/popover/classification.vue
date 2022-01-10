<template>
    <a-popover placement="left">
        <template #content>
            <div class="p-4 w-96">
                <div class="flex mb-2">
                    <ClassificationIcon
                        :color="classification.options?.color"
                        :class-names="'h-6 mb-1 mr-1'"
                    />
                    <span class="text-lg font-bold">
                        {{
                            classification?.displayName ||
                            classification?.typeName
                        }}
                    </span>
                    <div v-if="classification?.propagate" class="text-primary ml-auto">
                        <span> Propagated </span>
                    </div>
                </div>
                <div class="text-gray-700">
                    <p v-if="classification.description" class="text-sm">
                        {{ classification.description }}
                    </p>
                    <div v-if="classification.propagatedBy" class="mt-3">
                        <span class="mt-4 mb-1 text-xs text-gray-500">
                            Propagated by
                        </span>
                        <span class="text-primary">
                            {{ classification.propagatedBy }}
                        </span>
                    </div>
                    <div v-if="classification.createdBy" class="mt-3">
                        <p class="text-xs text-gray-500"> Created by </p>
                        <UserAvatar
                            :username="classification.createdBy"
                            :show-username="true"
                        />
                    </div>
                    <div v-if="classification.updateTime" class="mt-3 text-xs text-gray-500">
                        Last updated
                        <span class="font-bold text-gray-500">
                            {{ useTimeAgo(classification.updateTime).value }}
                        </span>
                        <span v-if="classification.updatedBy">
                            by
                            <span class="font-bold text-gray-500 capitalize">
                                {{ classification.updatedBy }}
                            </span>
                        </span>
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
    import UserAvatar from '@/common/avatar/user.vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    export default defineComponent({
        name: 'ClassificationInfoPopover',
        components: {
            UserPill,
            UserAvatar,
            ClassificationIcon
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
