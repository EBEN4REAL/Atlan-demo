<template>
    <div class="p-6 bg-white rounded">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <div class="font-semibold">Details</div>
            </div>
            <slot name="actionBtn">
                <AtlanBtn
                    class="bg-transparent border-none text-primary"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click="$emit('editDetails')"
                >
                    <AtlanIcon icon="Edit" class="ml-2"></AtlanIcon>
                    Edit
                </AtlanBtn>
            </slot>
            <!-- <div class="hidden">
                <a-switch
                    v-model:checked="persona.enabled"
                    class="ml-auto"
                    data-test-id="toggle-switch"
                    style="width: 40px !important"
                    :class="persona.enabled ? 'btn-checked' : 'btn-unchecked'"
                    :loading="enableDisableLoading"
                    @change="handleEnableDisablePersona"
                />
                <span class="ml-2 text-sm text-gray">Enable Persona</span>
            </div> -->
        </div>
        <div class="flex flex-col gap-y-2">
            <div class="">
                <div class="mb-0 text-gray-500">Name</div>
                {{ item.displayName }}
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Description</div>
                <span v-if="item.description">{{ item.description }}</span>
                <span v-else class="text-gray-500"
                    >No description available</span
                >
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Created by</div>
                <div>
                    {{ item.createdBy }}
                </div>
            </div>
            <div class="">
                <div class="mb-0 text-gray-500">Created at</div>
                <a-tooltip
                    class="cursor-default"
                    :title="timeStamp(item.createdAt, true)"
                    placement="left"
                    >{{ timeStamp(item.createdAt) }}</a-tooltip
                >
            </div>
        </div>
        <!-- <div>
            <div class="mb-1 text-gray-500">Description</div>
            <div>
                <div data-test-id="header-description">
                    {{ persona.description || '-' }}
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
    interface IItem {
        createdAt?: string
        createdBy?: string
        description?: string
        name?: string
    }

    import { defineComponent, PropType } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import Avatar from '~/components/common/avatar/index.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { formatDateTime } from '~/utils/date'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'DetailsWidget',
        components: { Avatar, PopOverUser, AtlanBtn },
        props: {
            item: {
                type:
                    (Object as PropType<IPersona>) ||
                    (Object as PropType<IPurpose>) ||
                    (Object as IItem),
                required: true,
            },
        },
        emits: ['editDetails'],
        setup(props) {
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }

            return {
                imageUrl,
                timeStamp,
            }
        },
    })
</script>
<style lang="less"></style>
