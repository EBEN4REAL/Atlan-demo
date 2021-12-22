<template>
    <a-popover placement="left">
        <template #content>
            <div class="flex p-4 w-96">
                <div class="mb-auto">
                    <AtlanIcon
                        icon="ShieldCheck"
                        :color="classification.options?.color"
                        class="h-6 mb-1 mr-1"
                        style="margin-top: 2px"
                    />
                </div>
                <div class="flex flex-col flex-1 text-gray-700">
                    <span class="text-lg font-bold">
                        {{
                            classification?.displayName ||
                            classification?.typeName
                        }}
                    </span>
                    <span v-if="classification.description" class="text-sm">
                        {{ classification.description }}
                    </span>
                    <div class="mt-3">
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
                    <div v-if="classification.createdBy" class="">
                        <span class="text-xs text-gray-500"> Created by </span>
                        <div class="flex flex-wrap gap-3">
                            <!-- <UserPill
                                    :enable-hover="false"
                                    :username="classification.createdBy"
                                ></UserPill> -->
                            <UserAvatar
                                :username="classification.createdBy"
                                :show-username="true"
                            />
                        </div>
                    </div>
                    <div class="flex gap-2 mt-3 text-xs text-gray-500">
                        <div v-if="classification.updateTime">
                            Last updated
                            <span class="font-bold text-gray-500">
                                {{
                                    useTimeAgo(classification.updateTime).value
                                }}
                            </span>
                            <span v-if="classification.updatedBy">
                                by
                                <span
                                    class="font-bold text-gray-500 capitalize"
                                    >{{ classification.updatedBy }}</span
                                >
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="classification?.propagate">
                    <span class="text-primary"> Propagated </span>
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

    export default defineComponent({
        name: 'ClassificationInfoPopover',
        components: {
            UserPill,
            UserAvatar,
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
