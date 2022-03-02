<template>
    <div class="w-full h-full p-6 bg-white" style="min-height: 430px">
        <div class="mb-12">
            <p class="mb-1 font-bold text-gray-500 required">Name</p>
            <a-input
                @blur="onNameBlur"
                :ref="
                    (el) => {
                        nameRef = el
                    }
                "
                v-model:value="infoTabeState.name"
                class="input"
                placeholder="Enter a name for your report"
            />
        </div>
        <div class="flex mb-12">
            <div class="mr-4 item-1">
                <p class="mb-1 font-bold text-gray-500 required">
                    Refresh frequency
                </p>
                <Frequency
                    v-model="infoTabeState.frequency"
                    placeholder="None"
                    @change="handleChangeFrequency"
                ></Frequency>
            </div>
            <div class="mr-4 item-2">
                <p class="mb-1 font-bold text-gray-500 required">Run Time</p>
                <a-time-picker
                    class="w-full"
                    format="HH:mm"
                    :showNow="false"
                    placeholder=""
                    valueFormat="HH:mm"
                    :minuteStep="15"
                    v-model:value="infoTabeState.time"
                />
            </div>
            <div class="item-3">
                <p class="mb-1 font-bold text-gray-500 required">Timezone</p>
                <Timezone
                    v-model="infoTabeState.timezone"
                    placeholder=""
                    @change="buildCron"
                ></Timezone>
            </div>
        </div>
        <div class="flex items-center justify-between mb-5 text-sm">
            <div class="w-full">
                <p class="mb-1 font-bold text-gray-500">Share Results</p>
                <p class="pb-2 text-gray-400 border-b border-gray-200">
                    Data will be sent as an attachment email
                </p>
            </div>
            <!-- <div>
                <AtlanIcon icon="Mail" />
            </div> -->
        </div>
        <div class="text-sm text-gray-700">
            <div class="flex items-center">
                <a-button
                    shape="circle"
                    size="small"
                    class="mr-2 text-center shadow"
                    :class="{
                        editPermission:
                            'hover:bg-primary-light hover:border-primary',
                    }"
                    @click="() => (isUserEdit = true)"
                >
                    <span><AtlanIcon icon="Add" class="h-3.5"></AtlanIcon></span
                ></a-button>
                <a-popover
                    v-model:visible="isUserEdit"
                    :overlay-class-name="$style.ownerPopover"
                    :trigger="['click']"
                    placement="right"
                    :destroy-tooltip-on-hide="true"
                    @visibleChange="handleVisibleChange"
                >
                    <template #content>
                        <div class="">
                            <OwnerFacets
                                ref="ownerInputRef"
                                v-model="localValue"
                                :show-none="false"
                            ></OwnerFacets>
                        </div>
                    </template>
                </a-popover>
                <template
                    v-for="username in localValue?.ownerUsers"
                    :key="username"
                >
                    <PopOverUser :item="username">
                        <UserPill
                            :username="username"
                            :allow-delete="true"
                            :enable-hover="true"
                            @delete="handleDeleteUser"
                            @click="handleClickUser(username)"
                        ></UserPill>
                    </PopOverUser>
                </template>

                <template v-for="name in localValue?.ownerGroups" :key="name">
                    <PopOverGroup :item="name">
                        <GroupPill
                            :name="name"
                            :allow-delete="true"
                            :enable-hover="true"
                            @delete="handleDeleteGroup"
                            @click="handleClickGroup(name)"
                        ></GroupPill>
                    </PopOverGroup>
                </template>
                <p class="mt-0.5" v-if="totalUsersCount === 0">Add users</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, nextTick, computed } from 'vue'
    import Frequency from '~/components/common/select/frequency.vue'
    import Timezone from '~/components/common/select/timezone.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'

    export default defineComponent({
        name: 'Schedule Query Body',
        components: {
            Frequency,
            Timezone,
            OwnerFacets,
            PopOverUser,
            UserPill,
            GroupPill,
        },
        props: {},
        setup(props) {
            const nameRef = ref()
            const isUserEdit = ref(false)
            const localValue = ref({ ownerUsers: [], ownerGroups: [] })
            const totalUsersCount = computed(
                () =>
                    localValue.value.ownerUsers?.length ??
                    0 + localValue.value.ownerGroups?.length ??
                    0
            )
            const infoTabeState = ref({
                name: '',
                frequency: 'daily',
                time: '00:00',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })

            const rules = ref({
                name: {
                    text: 'Enter a name!',
                    show: false,
                },
                connection: {
                    text: 'Connection is required!',
                    show: false,
                },
                assets: { text: 'Select atleast 1 asset!', show: false },
                metadata: {
                    text: 'Select atleast 1 permission!',
                    show: false,
                },
            })

            const onNameBlur = () => {
                if (!infoTabeState.value.name) rules.value.name.show = true
                else rules.value.name.show = false
            }

            onMounted(async () => {
                await nextTick()
                nameRef.value?.focus()
            })

            const handleVisibleChange = () => {}
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({
                    allowed: ['about', 'assets', 'groups', 'Integrations'],
                })
            }
            const handleClickGroup = (groupAlias: string) => {
                setGroupUniqueAttribute(groupAlias, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            const handleDeleteUser = (username) => {
                localValue.value.ownerUsers =
                    localValue.value?.ownerUsers.filter(
                        (item) => item !== username
                    )
            }
            const handleDeleteGroup = (name) => {
                localValue.value.ownerGroups =
                    localValue.value?.ownerGroups.filter(
                        (item) => item !== name
                    )
            }

            return {
                totalUsersCount,
                isUserEdit,
                infoTabeState,
                onNameBlur,
                nameRef,
                rules,
                handleVisibleChange,
                handleClickGroup,
                handleClickUser,
                localValue,
                handleDeleteUser,
                handleDeleteGroup,
            }
        },
    })
</script>
<style lang="less" scoped>
    .required:after {
        content: ' *';
        color: red;
    }
    .input::placeholder {
        @apply text-gray-400 !important;
    }
    .item-1 {
        flex: 0.35;
    }
    .item-2 {
        flex: 0.25;
    }
    .item-3 {
        flex: 0.4;
    }
</style>
<style module lang="less">
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
