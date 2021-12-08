<template>
    <div>
        <div class="pt-6 details-section">
            <span class="text-sm text-gray-500">Created by</span>
            <div v-if="persona.createdBy" class="flex items-center text-sm">
                <PopOverUser :item="persona.createdBy">
                    <UserPill
                        :username="persona.createdBy"
                        :allow-delete="false"
                        :enable-hover="true"
                    ></UserPill>
                </PopOverUser>
            </div>
            <span v-else class="text-sm font-semibold text-gray-500"
                >Unknown</span
            >

            <span class="text-sm text-gray-500">on</span>
            <a-tooltip
                :title="timeStamp(persona.createdAt, true)"
                placement="right"
                >{{ timeStamp(persona.createdAt) }}</a-tooltip
            >

            <a-switch
                class="ml-auto"
                data-test-id="toggle-switch"
                style="width: 40px !important"
                :class="enablePersonaCheck ? 'btn-checked' : 'btn-unchecked'"
                v-model:checked="enablePersonaCheck"
            />
            <span class="text-sm text-gray">Enable Persona</span>
        </div>
        <div class="flex items-center py-4 pt-2">
            <div
                class="relative flex items-center flex-1 p-4 mr-3 bg-white border border-gray-300 rounded cursor-pointer group hover:shadow"
                data-test-id="tab-policies"
                @click="setActiveTab('policies')"
            >
                <div class="p-3 mr-3 rounded text-primary bg-primary-light">
                    <AtlanIcon icon="Policy" class="h-6" />
                </div>
                <div class="w-full">
                    <div class="mb-1 font-bold text-gray-700">Policy</div>
                    <div class="flex text-gray-500">
                        <div
                            v-if="
                                persona.dataPolicies?.length === 0 &&
                                persona.metadataPolicies?.length === 0
                            "
                        >
                            No policies added
                        </div>
                        <div v-else class="flex items-center">
                            <div class="mr-3">
                                <b>{{ persona.metadataPolicies?.length }}</b>
                                Metadata policies
                            </div>
                            <div>
                                <b>{{ persona.dataPolicies?.length }}</b>
                                Data policies
                            </div>
                        </div>
                        <div
                            class="absolute right-0 opacity-0 vertical-center group-hover:opacity-100"
                        >
                            <AtlanIcon
                                icon="ArrowRight"
                                class="h-6 ml-auto group-hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="relative flex items-center flex-1 p-4 bg-white border border-gray-300 rounded cursor-pointer group hover:shadow"
                data-test-id="tab-users"
                @click="setActiveTab('users')"
            >
                <div class="p-3 mr-3 rounded text-primary bg-primary-light">
                    <AtlanIcon icon="GroupStatic" class="h-6" />
                </div>
                <div class="w-full group">
                    <div class="mb-1 text-sm font-bold">Users and Groups</div>
                    <div class="flex w-full text-gray-500">
                        <div
                            v-if="
                                persona.users?.length === 0 &&
                                persona.groups?.length === 0
                            "
                        >
                            No users added
                        </div>
                        <div v-else class="flex items-center">
                            <div class="mr-3">
                                <b>{{ persona.users?.length }}</b>
                                Users
                            </div>
                            <div>
                                <b>{{ persona.groups?.length }}</b>
                                Groups
                            </div>
                        </div>
                        <div
                            class="absolute right-0 opacity-0 vertical-center group-hover:opacity-100"
                        >
                            <AtlanIcon
                                icon="ArrowRight"
                                class="h-6 ml-auto group-hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        reactive,
        ref,
        toRefs,
    } from 'vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { enablePersona } from '../composables/useEditPersona'
    import { setActiveTab } from '../composables/usePersonaTabs'
    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'
    import { useUsers } from '~/composables/user/useUsers'
    import { formatDateTime } from '~/utils/date'
    import { useTimeAgo } from '@vueuse/core'

    export default defineComponent({
        name: 'PersonaMeta',
        components: { PopOverUser, UserPill },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup(props) {
            const { persona } = toRefs(props)
            // Params for obtaining that one user.
            const params = computed(() => ({
                limit: 1,
                offset: 0,
                filter: {
                    $and: [
                        { email_verified: true },
                        { id: persona.value.createdBy },
                    ],
                },
            }))

            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }

            const enablePersonaCheck = ref(true)
            const formatDate = (val) => {}
            return {
                formatDate,
                enablePersonaCheck,
                enablePersona,
                setActiveTab,
                timeStamp,
            }
        },
    })
</script>
<style lang="less" scoped>
    .details-section {
        @apply flex items-center gap-x-2 py-4;
        @apply text-gray-500;
        @apply cursor-pointer;
    }
    .user-group-pill {
        @apply rounded-full bg-primary-light text-primary text-sm px-2 py-1;
    }
    .data-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .btn-checked {
        background: #00a680;
    }
    .vertical-center {
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>
