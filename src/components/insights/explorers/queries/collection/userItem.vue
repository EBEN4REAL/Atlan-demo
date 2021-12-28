<template>
    <div
        class="flex items-center justify-between h-7"
        style="margin-top: 3px; margin-bottom: 3px"
        v-for="(item, index) in dataArray"
        :key="item['user']"
    >
        <div class="flex items-center">
            <a-avatar
                v-if="item.type === 'ownerGroups'"
                shape="circle"
                :size="20"
                class="mr-2 text-primary bg-primary-light"
            >
                <template #icon>
                    <AtlanIcon icon="GroupStatic"></AtlanIcon>
                </template>
            </a-avatar>
            <Avatar
                v-else
                avatar-shape="circle"
                :image-url="imageUrl(item['user'])"
                :allow-upload="false"
                :avatar-name="item['user']"
                :avatar-size="20"
            />
            <div class="ml-2">
                <div class="text-gray-700">
                    <div class="mr-2 text-sm text-gray-700">
                        {{ item['user'] }}
                    </div>
                </div>
            </div>
        </div>
        <a-dropdown :trigger="['click']" placement="topRight">
            <div
                class="flex items-center justify-end text-gray-700 cursor-pointer"
                style="width: 104px"
            >
                <span class="mr-1.5 pl-1 text-sm text-gray-500">
                    {{
                        item['permission'] === 'view' ? 'Can view' : 'Can edit'
                    }}
                </span>
                <AtlanIcon icon="CaretDown" class="w-4 h-4 text-gray-700" />
            </div>

            <template #overlay>
                <PermissionType
                    :show-remove="true"
                    :handle-change="handleChange"
                    v-model:selectedType="item['permission']"
                    :item="item"
                />
                <!-- <a-menu style="width: 217px" :selectedKeys="item['permission']">
                    <a-menu-item
                        key="view"
                        class="rounded hover:bg-primary-light"
                        @click="handleChange(item, 'view')"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <div>
                                    <span class="text-sm text-gray-700"
                                        >Can view</span
                                    >
                                </div>
                                <div>
                                    <span class="text-xs text-gray-500"
                                        >Can view and run all <br />the queries,
                                        but not edit</span
                                    >
                                </div>
                            </div>
                            <AtlanIcon
                                v-if="item['permission'] === 'view'"
                                icon="Check"
                                class="text-primary"
                            />
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        key="edit"
                        class="rounded hover:bg-primary-light"
                        @click="handleChange(item, 'edit')"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <div>
                                    <span class="text-sm text-gray-700"
                                        >Can edit</span
                                    >
                                </div>
                                <div>
                                    <span class="text-xs text-gray-500"
                                        >Can view, run and edit all <br />
                                        queries</span
                                    >
                                </div>
                            </div>
                            <AtlanIcon
                                v-if="item['permission'] === 'edit'"
                                icon="Check"
                                class="text-primary"
                            />
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        key="remove"
                        class="rounded hover:bg-primary-light"
                        @click="handleChange(item, 'remove')"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-sm" style="color: #d21919"
                                    >Remove</span
                                >
                            </div>
                        </div>
                    </a-menu-item>
                </a-menu> -->
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed, PropType } from 'vue'
    import Avatar from '~/components/common/avatar/index.vue'
    import { useVModels } from '@vueuse/core'
    import PermissionType from './permissionType.vue'

    export default defineComponent({
        name: 'userItem',
        components: {
            Avatar,
            PermissionType,
        },
        props: {
            // user: {
            //     type: String,
            //     required: true,
            // },
            // permission: {
            //     type: String,
            //     required: true,
            // },
            userData: {
                type: Object,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { userData } = useVModels(props, emit)
            const localValue = ref(userData.value)

            let dataArray = computed(() => {
                // console.log('change list data0: ', localValue.value)
                let data = []
                localValue?.value?.edit?.ownerUsers?.forEach((el) => {
                    data.push({
                        user: el,
                        type: 'ownerUsers',
                        permission: 'edit',
                    })
                })
                localValue?.value?.edit?.ownerGroups?.forEach((el) => {
                    data.push({
                        user: el,
                        type: 'ownerGroups',
                        permission: 'edit',
                    })
                })
                localValue?.value?.view?.ownerUsers?.forEach((el) => {
                    data.push({
                        user: el,
                        type: 'ownerUsers',
                        permission: 'view',
                    })
                })
                localValue?.value?.view?.ownerGroups?.forEach((el) => {
                    data.push({
                        user: el,
                        type: 'ownerGroups',
                        permission: 'view',
                    })
                })

                // console.log('change list data: ', data)

                return data
            })

            let otherType = ref()

            const handleChange = (type, item) => {
                if (type !== 'remove' && item['permission'] !== type) {
                    // dataArray.value.forEach((el) => {
                    //     if (el['user'] === item['user']) {
                    //         el['permission'] = type
                    //     }
                    // })
                    // console.log('change permission: ', item['permission'])
                    console.log('change: ', localValue.value)

                    // localValue.value[item['permission']][item['type']]

                    // console.log('')

                    const index = localValue.value[item['permission']][
                        item['type']
                    ].indexOf(item['user'])

                    if (index > -1) {
                        localValue.value[item['permission']][
                            item['type']
                        ].splice(index, 1)

                        console.log('change udpate: ', localValue.value)

                        localValue.value[type][item['type']].push(item['user'])
                    }

                    userData.value = localValue.value
                } else if (type === 'remove') {
                    const index = localValue.value[item['permission']][
                        item['type']
                    ].indexOf(item['user'])
                    if (index > -1) {
                        localValue.value[item['permission']][
                            item['type']
                        ].splice(index, 1)
                    }
                    userData.value = localValue.value
                } else {
                }

                // console.log('change permission: ', localValue.value)
            }

            const imageUrl = (user: any) =>
                `${window.location.origin}/api/service/avatars/${user}`

            console.log('url: ', imageUrl)

            return { imageUrl, dataArray, handleChange }
        },
    })
</script>

<style lang="less" scoped></style>
<style lang="less" module></style>
