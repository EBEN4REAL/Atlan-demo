<template>
    <div
        class="flex items-center justify-between mb-1 text-sm text-gray cursor-help"
        style="line-height: 22px"
    >
        <a-tooltip color="#2A2F45">
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

    <div class="flex justify-between">
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
                <div class="ml-1 cursor-pointer">
                    <span class="text-sm text-primary"> Add</span>
                    <AtlanIcon
                        icon="Add"
                        class="ml-1 -mt-1 text-primary"
                    /></div
            ></template>
            <template #users>
                <div
                    v-if="allAdmins"
                    class="flex items-center justify-between flex-none px-2 py-1 ml-2 border border-gray-200 rounded-full cursor-pointer text-new-gray-800 hover:bg-primary hover:text-white"
                >
                    <span> All admins </span>
                    <AtlanIcon
                        icon="Cross"
                        class="h-3 ml-3 rotate-45"
                        @click="allAdmins = false"
                    />
                </div>
            </template>
        </Owners>
        <AtlanButton2
            v-if="!allAdmins"
            label="Include all admins"
            color="link"
            class="pb-1 ml-3"
            prefix-icon="UserLightActive"
            @click="toggleAllAdmin"
        />
    </div>
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
                ] || true
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

            const toggleAllAdmin = () => {
                allAdmins.value = !allAdmins.value
                handleOwnersChange()
            }

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
