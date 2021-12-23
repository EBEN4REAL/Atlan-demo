<template>
    <a-button-group>
        <MemberPopover :selected-group='group' @members-added='$emit("membersAdded")'>
            <template #label>
                <a-button
                    v-auth="map.ADD_USER_GROUP"
                    size="small"
                    type="secondary"
                    class="flex mr-3.5 items-center justify-center w-8 h-8 border rounded customShadow cursor-pointer"
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
            v-auth="[map.UPDATE_GROUP]"
            :trigger="['click']"
            :visible="dropDownOpened"
            @visibleChange="handleVisibleChange"
        >
            <a-button
                class="flex items-center justify-center w-8 h-8 border rounded cursor-pointer customShadow p-2"
            >
                <AtlanIcon icon="KebabMenu" class="text-gray-500"></AtlanIcon>
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        key="1"
                        v-auth="map.UPDATE_GROUP"
                        :disabled="markAsDefaultLoading || deleteGroupLoading"
                    >
                        <div class="flex items-center">
                            <template v-if="markAsDefaultLoading">
                                <AtlanIcon
                                    icon="CircleLoader"
                                    class="animate-spin"
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
    </a-button-group>
</template>

<script lang="ts">
    import { ref, defineComponent, watch, toRefs } from 'vue'
    import map from '~/constant/accessControl/map'
    import MemberPopover from '~/components/admin/groups/groupPreview/memberPopover.vue'

    export default defineComponent({
        name: 'GroupsActionButton',
        components: {
            MemberPopover
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
        emits: ['addMembers', 'deleteGroup', 'toggleDefault', 'membersAdded'],
        setup(props) {
            const { markAsDefaultLoading, deleteGroupLoading } = toRefs(props)
            const dropDownOpened = ref(false)

            const handleVisibleChange = (flag) => {
                // need to handle dropdown manual so as to keep
                // open when deleting or toggle default is still happening
                if (flag) dropDownOpened.value = true
                if (!flag) {
                    if (
                        !markAsDefaultLoading.value &&
                        !deleteGroupLoading.value
                    )
                        dropDownOpened.value = false
                }
            }

            // automatically close dropdown after loading action is complete
            watch(
                [markAsDefaultLoading, deleteGroupLoading],
                (
                    [newDefaultVal, newDeleteVal],
                    [oldDefaultVal, oldDeleteVal]
                ) => {
                    if (
                        (oldDefaultVal === true && newDefaultVal === false) ||
                        (oldDeleteVal === true && newDeleteVal === false)
                    ) {
                        dropDownOpened.value = false
                    }
                }
            )

            return {
                map,
                dropDownOpened,
                handleVisibleChange,
            }
        },
    })
</script>

<style lang="less">
    .customShadow {
        box-shadow: 0px 1px 0px 0px hsla(0, 0%, 0%, 0.05);
    }
</style>
