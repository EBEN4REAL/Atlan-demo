<template>
    <div
        class="flex items-center justify-between mb-1 text-sm text-gray"
        style="line-height: 22px"
    >
        <a-tooltip color="#2A2F45" class="cursor-help">
            <template #title>
                <p class="font-bold">Connection Admin Permissions:</p>
                <p>1. View and edit all assets in the connection</p>
                <p>2. Edit connection preferences</p>
                <p>3. Edit persona based policies for the connection.</p>
            </template>
            <span>{{ componentProps.title }}</span>
            <AtlanIcon icon="Info" class="mb-0.5 ml-1 mr-auto" />
        </a-tooltip>
    </div>

    <Owners
        v-model:modelValue="selectedOwnersData"
        :edit-permission="true"
        :read-only="false"
        :destroy-tooltip-on-hide="false"
        :show-empty-owner="false"
        :custom-add-button="true"
        @change="handleOwnersChange"
    >
        <template #addButton>
            <a-button
                shape="circle"
                size="small"
                class="text-center shadow hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </template>
        <template #groups>
            <a-tooltip color="#2A2F45">
                <template #title>
                    All users with admin role will be added as connection admin
                </template>

                <div
                    v-if="allAdmins?.length"
                    class="flex items-center justify-between flex-none px-2 py-1 border border-gray-200 rounded-full cursor-pointer text-new-gray-800 hover:bg-primary hover:text-white"
                >
                    <AtlanIcon icon="Admin" class="h-4 mr-1" />

                    <span> All Admins </span>
                    <AtlanIcon
                        icon="Cross"
                        class="h-3 ml-3 rotate-45"
                        @click="toggleAllAdmin(false)"
                    />
                </div>
            </a-tooltip>
        </template>
    </Owners>

    <a-checkbox
        :checked="allAdmins.length"
        @change="toggleAllAdmin($event.target.checked)"
        class="mt-2"
    >
        Include all admins
    </a-checkbox>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
        computed,
        watch,
        defineAsyncComponent,
        ref,
        inject,
    } from 'vue'

    import whoami from '~/composables/user/whoami'
    import Owners from '~/components/common/input/owner/index.vue'
    import { useAuthStore } from '~/store/auth'

    export default defineComponent({
        name: 'ConnectionInput',
        components: { Owners },
        props: {
            property: {
                required: false,
                type: Object,
                default: () => ({}),
            },
            baseKey: {
                required: false,
                type: String,
                default: () => '',
            },
            isEdit: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { property, isEdit, baseKey } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)
            const fieldMappings = computed(() => property.value.ui?.mappings)
            const { username } = whoami()
            const authStore = useAuthStore()
            const getRoleId = authStore.getRoleId

            const selectedOwnersData = ref({
                ownerUsers: formState[
                    `${baseKey.value}.${fieldMappings.value.users}`
                ] || [username.value],
                ownerGroups:
                    formState[
                        `${baseKey.value}.${fieldMappings.value.groups}`
                    ] || [],
            })

            const allAdmins = ref(
                formState[
                    `${baseKey.value}.${fieldMappings.value.allAdmins}`
                ] || [getRoleId('$admin')]
            )

            const handleOwnersChange = () => {
                formState[`${baseKey.value}.${fieldMappings.value.users}`] =
                    selectedOwnersData.value?.ownerUsers
                formState[`${baseKey.value}.${fieldMappings.value.groups}`] =
                    selectedOwnersData.value?.ownerGroups
                formState[`${baseKey.value}.${fieldMappings.value.allAdmins}`] =
                    allAdmins.value

                emit('change', { ...selectedOwnersData, allAdmins })
            }

            const toggleAllAdmin = (set = true) => {
                allAdmins.value = set ? [getRoleId('$admin')] : []
                handleOwnersChange()
            }

            handleOwnersChange()

            return {
                selectedOwnersData,
                allAdmins,
                handleOwnersChange,
                toggleAllAdmin,
                componentProps,
            }
        },
    })
</script>
