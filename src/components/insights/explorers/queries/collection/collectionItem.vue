<template>
    <div
        :key="item.guid"
        :class="[
            'flex items-center justify-between p-1 cursor-pointer hover:bg-primary-light group relative overflow-x-hidden',
        ]"
        @click="handleChange(item.guid)"
    >
        <div class="flex items-center overflow-x-hidden">
            <AtlanIcon
                v-if="index === 0"
                icon="Group"
                class="self-center w-4 h-4 pr-1"
            ></AtlanIcon>
            <AtlanIcon
                v-else
                icon="User"
                class="self-center w-4 h-4 pr-1"
            ></AtlanIcon>
            <div class="truncate group-hover:text-primary" style="width: 90%">
                <span class="truncate">{{ item.attributes.name }}</span>
            </div>
        </div>
        <div
            class="absolute opacity-0 group-hover:opacity-100 right-1 y-center"
        >
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
        <ShareCollectionModal
            v-model:showShareModal="showShareQueryModal"
            :item="item"
        />
        <CreateCollectionModal
            v-if="showCollectionModal"
            v-model:showCollectionModal="showCollectionModal"
            :is-create="false"
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
            index: {
                type: Number,
                required: true,
            },
            handleChange: {
                type: Function,
                required: true,
            },
        },
        setup(props) {
            const { item, handleChange, index } = toRefs(props)

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

            return {
                item,
                index,
                handleChange,
                showShareQueryModal,
                toggleShareQueryModal,
                showCollectionModal,
                toggleShowCollectionModal,
                username,
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
