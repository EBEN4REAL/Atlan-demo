<template>
    <div
        :key="item.guid"
        :class="[
            'flex items-center justify-between px-4 cursor-pointer hover:bg-primary-light group relative overflow-x-hidden w-full',
        ]"
        style="height: 34px"
        @click="handleChange(item.guid)"
    >
        <div class="flex items-center overflow-x-hidden">
            <span class="w-5 h-5 -mt-1 mr-2.5 text-lg">{{
                item?.attributes?.icon ? item?.attributes?.icon : '🗃'
            }}</span>

            <div class="truncate group-hover:text-primary" style="width: 90%">
                <span class="text-sm text-gray-700 truncate mr-2.5">{{
                    item.attributes.name
                }}</span>
                <AtlanIcon
                    v-if="isCollectionPrivate(item, username)"
                    icon="PrivateCollection"
                    class="self-center w-4 h-4 -mt-1"
                ></AtlanIcon>
                <AtlanIcon
                    v-else
                    icon="PublicCollection"
                    class="self-center w-4 h-4 -mt-1"
                ></AtlanIcon>
            </div>
        </div>
        <div class="absolute opacity-100 group right-3 y-center">
            <a-dropdown :trigger="['click']" @click.stop="() => {}">
                <div class="pl-5" v-if="username === item?.createdBy">
                    <AtlanIcon
                        icon="KebabMenu"
                        class="w-4 h-4 my-auto"
                    ></AtlanIcon>
                </div>
                <template #overlay>
                    <a-menu>
                        <!-- RENAME FOLDER PERMISSIONS -->
                        <a-menu-item key="share" @click="toggleShareQueryModal"
                            >Invite</a-menu-item
                        >
                        <a-menu-item
                            key="edit"
                            @click="toggleShowCollectionModal"
                            >Edit collection</a-menu-item
                        >
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <!-- <ShareCollectionModal
            v-model:showShareModal="showShareQueryModal"
            :item="item"
        /> -->
        <CreateCollectionModal
            v-if="showCollectionModal"
            v-model:showCollectionModal="showCollectionModal"
            :is-create="false"
            :item="item"
        />
        <CreateCollectionModal
            v-if="showShareQueryModal"
            v-model:showCollectionModal="showShareQueryModal"
            :is-create="false"
            :is-share="true"
            :item="item"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        Ref,
        inject,
        toRaw,
        watch,
        ref,
        defineAsyncComponent,
    } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import whoami from '~/composables/user/whoami'
    import { isCollectionPrivate } from '~/components/insights/explorers/queries/composables/useQueryCollection'

    export default defineComponent({
        components: {
            AtlanIcon,
            ShareCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/shareCollectionModal.vue'
                    )
            ),
            CreateCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/createCollectionModal.vue'
                    )
            ),
        },
        props: {
            item: {
                type: Object,
                required: true,
            },

            handleChange: {
                type: Function,
                required: true,
            },
        },
        setup(props) {
            const { item, handleChange } = toRefs(props)

            const showShareQueryModal = ref(false)
            const toggleShareQueryModal = () => {
                console.log('collection item: ', item.value)
                showShareQueryModal.value = !showShareQueryModal.value
            }

            const showCollectionModal = ref(false)
            const toggleShowCollectionModal = () => {
                showCollectionModal.value = !showCollectionModal.value
            }

            const { username } = whoami()

            const isCollectionCreatedByCurrentUser = inject(
                'isCollectionCreatedByCurrentUser'
            )
            const hasCollectionReadPermission = inject(
                'hasCollectionReadPermission'
            )
            const hasCollectionWritePermission = inject(
                'hasCollectionWritePermission'
            )

            return {
                item,
                handleChange,
                showShareQueryModal,
                toggleShareQueryModal,
                showCollectionModal,
                toggleShowCollectionModal,
                username,
                isCollectionPrivate,

                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
            }
        },
    })
</script>
<style lang="less" scoped>
    .y-center {
        transform: translateY(-50%);
        top: 48%;
    }
</style>
<style lang="less" module></style>
