<template>
    <div
        :key="item.guid"
        class="flex items-center justify-between p-1 cursor-pointer hover:bg-primary-light group"
        @click="handleChange(item.guid)"
    >
        <div class="flex items-center">
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
            <div class="overflow-ellipsis group-hover:text-primary">
                {{ item.attributes.name }}
            </div>
        </div>
        <div>
            <a-dropdown :trigger="['click']" @click.stop="() => {}">
                <div class="pl-5">
                    <AtlanIcon
                        icon="KebabMenu"
                        class="w-4 h-4 my-auto"
                    ></AtlanIcon>
                </div>
                <template #overlay>
                    <a-menu>
                        <!-- RENAME FOLDER PERMISSIONS -->
                        <a-menu-item key="share" @click="toggleShareQueryModal"
                            >Share collection</a-menu-item
                        >
                        <a-menu-item key="edit">Edit collection</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <ShareCollectionModal
            v-model:showShareModal="showShareQueryModal"
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

    export default defineComponent({
        components: {
            AtlanIcon,
            ShareCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/shareCollectionModal.vue'
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
                showShareQueryModal.value = !showShareQueryModal.value
            }

            return {
                item,
                index,
                handleChange,
                showShareQueryModal,
                toggleShareQueryModal,
            }
        },
    })
</script>
<style lang="less" scoped></style>
<style lang="less" module></style>
