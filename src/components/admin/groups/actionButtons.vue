<template>
    <a-button-group>
        <MemberPopover
            :selected-group="group"
            @members-added="$emit('membersAdded')"
        >
            <template #label>
                <a-button
                    v-auth="map.ADD_USER_GROUP"
                    size="small"
                    type="secondary"
                    class="flex mr-3.5 items-center justify-center w-8 h-8 border-none cursor-pointer rounded"
                >
                    <AtlanIcon icon="AddUser" class="text-gray-500" />
                </a-button>
            </template>
        </MemberPopover>
        <!-- <a-tooltip placement="topLeft">
            <template #title>
                <span>Delete group</span>
            </template>
            <div
                v-auth="[map.UPDATE_GROUP]"
                size="small"
                type="secondary"
                class="
                    flex
                    mr-3.5
                    items-center
                    justify-center
                    w-8
                    h-8
                    border
                    rounded
                    customShadow
                    cursor-pointer
                "
                @click="$emit('deleteGroup')"
            >
                <AtlanIcon icon="Delete" class="text-gray-500"></AtlanIcon>
            </div>
        </a-tooltip> -->
        <a-dropdown
            v-if="!showPersonaList"
            v-auth="[map.UPDATE_GROUP]"
            :trigger="['click']"
            :visible="dropDownOpened"
            @visibleChange="handleVisibleChange"
        >
            <a-button
                class="flex items-center justify-center w-8 h-8 p-2 border-transparent rounded cursor-pointer hover:border-primary"
            >
                <AtlanIcon icon="KebabMenu" class="text-gray-500"></AtlanIcon>
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        key="1"
                        v-auth="map.UPDATE_PERSONA"
                        :disabled="
                            markAsDefaultLoading ||
                            deleteGroupLoading ||
                            addPersonaLoading
                        "
                    >
                        <div class="flex items-center w-full">
                            <template v-if="addPersonaLoading">
                                <AtlanIcon
                                    icon="CircleLoader"
                                    class="mr-2 animate-spin"
                                />
                            </template>
                            <div
                                class="flex items-center justify-between w-full"
                            >
                                <div
                                    class="flex items-center cursor-pointer"
                                    @click="showPersonaList = true"
                                >
                                    <AtlanIcon
                                        icon="Add"
                                        class="mr-2"
                                    ></AtlanIcon>
                                    Add to persona
                                </div>
                                <AtlanIcon icon="ChevronRight"></AtlanIcon>
                            </div>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        key="1"
                        v-auth="map.UPDATE_GROUP"
                        :disabled="markAsDefaultLoading || deleteGroupLoading"
                    >
                        <div class="flex items-center">
                            <template v-if="markAsDefaultLoading">
                                <AtlanIcon
                                    icon="CircleLoader"
                                    class="mr-2 animate-spin"
                                />
                            </template>
                            <a-checkbox
                                :class="{
                                    'hide-checkbox': markAsDefaultLoading,
                                }"
                                :checked="group.isDefault === 'true'"
                                :disabled="
                                    markAsDefaultLoading || deleteGroupLoading
                                "
                                @click="$emit('toggleDefault')"
                                >{{
                                    group.isDefault === 'true'
                                        ? 'Unmark'
                                        : 'Mark as'
                                }}
                                default
                            </a-checkbox>
                            <a-tooltip placement="topLeft">
                                <template #title>
                                    <span>
                                        New users are automatically added to
                                        default groups
                                    </span>
                                </template>

                                <AtlanIcon
                                    icon="Info"
                                    class="text-xs text-gray-500 mb-0.5"
                                />
                            </a-tooltip>
                        </div>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item
                        key="2"
                        :disabled="deleteGroupLoading || markAsDefaultLoading"
                        @click="$emit('deleteGroup')"
                    >
                        <div class="flex items-center text-red-600">
                            <div v-if="deleteGroupLoading">
                                <AtlanIcon
                                    icon="CircleLoader"
                                    class="mr-1 animate-spin"
                                />
                            </div>
                            <AtlanIcon icon="Trash" class="mb-1 mr-1 text-xs" />

                            Delete
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-popover v-else placement="bottom">
            <a-button
                class="flex items-center justify-center w-8 h-8 p-2 border-transparent rounded cursor-pointer hover:border-primary"
            >
                <AtlanIcon icon="KebabMenu" class="text-gray-500"></AtlanIcon>
            </a-button>
            <template #content>
                <div>
                    <PersonaList
                        class="p-2 bg-white persona-list"
                        :selected-personas="selectedPersonas"
                    />
                    <div class="flex justify-end w-full p-2">
                        <AtlanBtn
                            color="secondary"
                            padding="compact"
                            size="sm"
                            class="px-5 mr-3 border-none"
                            @click="$emit('closeDrawer')"
                        >
                            <span>Cancel</span></AtlanBtn
                        >
                        <AtlanBtn
                            class="px-5"
                            size="sm"
                            color="primary"
                            padding="compact"
                            :is-loading="addPersonaLoading"
                            :disabled="addPersonaLoading"
                            @click="handleAddPersonas"
                            ><span v-if="addPersonaLoading"> Adding </span>
                            <span v-else>Add</span>
                        </AtlanBtn>
                    </div>
                </div>
            </template>
        </a-popover>
    </a-button-group>
</template>

<script lang="ts">
    import { ref, defineComponent, watch, toRefs } from 'vue'
    import map from '~/constant/accessControl/map'
    import MemberPopover from '~/components/admin/groups/groupPreview/memberPopover.vue'
    import PersonaList from '@/common/popover/persona/personaList.vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'GroupsActionButton',
        components: {
            MemberPopover,
            PersonaList,
            AtlanBtn,
        },
        props: {
            group: {
                type: Object,
                default: () => {},
                required: true,
            },
            markAsDefaultLoading: {
                type: Boolean,
                default: false,
                required: true,
            },
            deleteGroupLoading: {
                type: Boolean,
                default: false,
                required: true,
            },
        },
        emits: ['deleteGroup', 'toggleDefault', 'membersAdded'],
        setup(props) {
            const { markAsDefaultLoading, deleteGroupLoading } = toRefs(props)
            const dropDownOpened = ref(false)
            const selectedPersonas = ref([])
            const addPersonaLoading = ref(false)
            const showPersonaList = ref(false)
            const handleVisibleChange = (flag) => {
                // need to handle dropdown manual so as to keep
                // open when deleting or toggle default is still happening
                if (flag) dropDownOpened.value = true
                if (!flag) {
                    if (
                        !markAsDefaultLoading.value &&
                        !deleteGroupLoading.value &&
                        !addPersonaLoading.value
                    ) {
                        dropDownOpened.value = false
                    }
                }
            }

            // automatically close dropdown after loading action is complete
            watch(
                [markAsDefaultLoading, deleteGroupLoading, addPersonaLoading],
                (
                    [newDefaultVal, newDeleteVal, newPersonaVal],
                    [oldDefaultVal, oldDeleteVal, oldPersonaVal]
                ) => {
                    if (
                        (oldDefaultVal === true &&
                            newDefaultVal === false &&
                            newPersonaVal === false) ||
                        (oldDeleteVal === true &&
                            newDeleteVal === false &&
                            oldPersonaVal === false)
                    ) {
                        dropDownOpened.value = false
                    }
                }
            )

            const handleAddPersonas = () => {
                console.log(selectedPersonas.value)
            }

            return {
                map,
                dropDownOpened,
                handleVisibleChange,
                selectedPersonas,
                addPersonaLoading,
                handleAddPersonas,
                showPersonaList,
            }
        },
    })
</script>

<style lang="less">
    .customShadow {
        box-shadow: 0px 1px 0px 0px hsla(0, 0%, 0%, 0.05);
    }
</style>
<style lang="less" scoped>
    .persona-list {
        width: 200px;
        height: 150px;
    }
</style>
