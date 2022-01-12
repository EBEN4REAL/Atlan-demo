<template>
    <div v-auth="map.CREATE_GROUP" class="flex flex-col py-5">
        <div
            class="relative flex items-center justify-between px-4 pb-5 border-b"
        >
            <div class="text-lg font-bold">Create Group</div>
            <div class="top-0 p-1 rounded cursor-pointer right-2">
                <AtlanIcon
                    icon="Cross"
                    class="r"
                    @click="$emit('closeDrawer')"
                />
            </div>
        </div>
        <div class="flex flex-col px-4 py-3">
            <a-form
                class="form"
                layout="vertical"
                :model="group"
                :rules="validations"
            >
                <a-form-item label="Name" name="name">
                    <a-input
                        v-model:value="group.name"
                        class="w-full"
                        @input="setGroupAlias"
                    />
                </a-form-item>
                <a-form-item label="Alias" name="alias">
                    <a-input
                        v-model:value="group.alias"
                        @input="restrictGroupAlias"
                    />
                </a-form-item>
                <a-form-item label="Description" name="description">
                    <a-textarea v-model:value="group.description" :rows="2" />
                </a-form-item>
                <SlackInput
                    v-model="group.slack"
                    placeholder="Add Slack channel name or channel ID"
                />
                <div v-auth="map.LIST_USERS">
                    <div class="mb-2">
                        <span class="mr-2 font-bold">Users</span>
                    </div>
                    <UserSelector
                        :user-list-style="{
                            maxHeight: 'calc(100vh - 37.5rem)',
                        }"
                        @updateSelectedUsers="updateUserList"
                    />
                </div>
            </a-form>
        </div>
        <div
            class="absolute bottom-0 flex items-center justify-between w-full px-4 mt-1 mb-3 bg-white border-t"
        >
            <div class="flex items-center mt-3 gap-x-1">
                <a-checkbox v-model:checked="isDefault">
                    <span class="">Mark as default</span>
                    <a-tooltip
                        :title="'New users will be automatically added to default groups'"
                        placement="right"
                        ><span class="ml-1">
                            <AtlanIcon
                                icon="Info"
                                class="text-gray-500 pushtop mb-0.5"
                            ></AtlanIcon>
                        </span>
                    </a-tooltip>
                </a-checkbox>
            </div>
            <AtlanButton
                class="mt-3"
                size="sm"
                html-type="submit"
                :disabled="isSubmitDisabled"
                :is-loading="createGroupLoading"
                @click="handleSubmit"
            >
                Create Group
            </AtlanButton>
        </div>
    </div>
</template>
<script lang="ts">
    import { useRouter } from 'vue-router'
    import {
        defineComponent,
        ref,
        reactive,
        computed,
        UnwrapRef,
        watch,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { Groups } from '~/services/service/groups'
    import DefaultLayout from '@/admin/layout.vue'

    import UserList from '~/components/admin/groups/common/userList.vue'
    import whoami from '~/composables/user/whoami'
    import AtlanButton from '@/UI/button.vue'
    import map from '~/constant/accessControl/map'
    import NoAcces from '@/common/secured/access.vue'
    import SlackInput from '@/admin/common/slackInput.vue'
    import UserSelector from '@/admin/groups/addGroup/userSelector.vue'

    interface Group {
        name: String
        alias: String
        description: String
        slack: String
    }
    export default defineComponent({
        name: 'AddGroup',
        components: {
            UserList,
            DefaultLayout,
            NoAcces,
            AtlanButton,
            SlackInput,
            UserSelector,
        },
        emits: ['refresh', 'closeDrawer'],
        setup(props, { emit }) {
            const router = useRouter()
            const createGroupLoading = ref(false)
            const isDefault = ref(false)
            const listPermission = true
            const createPermission = true
            const group: UnwrapRef<Group> = reactive({
                name: '',
                description: '',
                alias: '',
                slack: '',
            })
            const validations = {
                name: [
                    {
                        required: true,
                        message: 'Group name is required',
                        trigger: 'blur',
                    },
                ],
            }
            const { username } = whoami()
            const userIds = ref([])
            const isSubmitDisabled = computed(() => {
                const { name, alias } = group
                return !!(name == '' || alias == '')
            })
            const setGroupAlias = () => {
                group.alias = getAliasFromName(group.name)
            }
            const getAliasFromName = (title) =>
                title
                    .trim()
                    .toLowerCase()
                    .replace(/[!:;@#$%^&*'"<>,/.\\(){}[\]|`~?+=-]+/g, '')
                    .replace(/[ ]+/g, '_')
            const restrictGroupAlias = () => {
                group.alias = getAliasFromName(group.alias)
            }
            const updateUserList = (list) => {
                userIds.value = list
            }
            const handleSubmit = () => {
                // deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.

                // check for #
                let slackLink = group.slack
                if (slackLink.startsWith('#'))
                    slackLink = slackLink.substring(1)

                const requestPayload = ref({
                    group: {
                        name: group.alias,
                        attributes: {
                            description: [group.description],
                            alias: [group.name],
                            isDefault: [`${isDefault.value}`],
                            channels:
                                slackLink.length > 0
                                    ? [`[{"slack": "${slackLink}"}]`]
                                    : [],
                        },
                    },
                    users: userIds.value,
                })
                const { data, isReady, error, isLoading } =
                    Groups.CreateGroup(requestPayload)
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        createGroupLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            message.success('Group added')
                            router.push(`/admin/groups`)
                            emit('refresh')
                            emit('closeDrawer')
                        } else if (error && error.value) {
                            message.error(
                                'Unable to create group, please try again.'
                            )
                            createGroupLoading.value = false
                        }
                    },
                    { immediate: true }
                )
            }
            const routeToGroups = () => {
                router.push(`/admin/groups`)
            }

            return {
                map,
                group,
                isSubmitDisabled,
                validations,
                createGroupLoading,
                handleSubmit,
                setGroupAlias,
                restrictGroupAlias,
                updateUserList,
                isDefault,
                routeToGroups,
                listPermission,
                createPermission,
            }
        },
    })
</script>

<style lang="less" scoped>
    .form:deep(.ant-form-item-label) {
        @apply font-bold;
    }
</style>
