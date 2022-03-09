<template>
    <div class="relative h-full bg-white">
        <div class="flex items-center p-4 bg-white border-b border-gray-300">
            <AtlanBtn
                class="border-none btn-back"
                size="sm"
                padding="compact"
                data-test-id="cross"
                color="secondary"
                @click="handleClose"
            >
                <AtlanIcon icon="ArrowRight" class="text-base -rotate-180" />
            </AtlanBtn>
            <div>
                <span class="text-base font-bold text-gray-700"
                    >Configure permissions</span
                >
            </div>
            <!-- <AtlanBtn
                padding="compact"
                class="py-1 ml-auto h-fit"
                size="small"
                @click="handleSave"
            >
                Update
            </AtlanBtn> -->
        </div>

        <div class="pt-0 mt-6 container-content">
            <MetadataScopes
                v-model:actions="actionsLocal"
                class="mb-6"
                :type="type === 'glossaryPolicy' ? 'glossaryPolicy' : 'persona'"
            />
        </div>
        <div
            class="fixed flex items-center justify-end p-3 mt-auto border-t border-gray-300 gap-x-2 btn-wrapper-manage"
        >
            <span class="mr-auto text-gray-500"
                >{{ actionsLocal.length || 'No' }} items updated</span
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                color="secondary"
                data-test-id="cancel"
                class="btn-asset"
                @click="handleClose"
            >
                Cancel
            </AtlanBtn>
            <AtlanBtn
                size="sm"
                padding="compact"
                data-test-id="save"
                class="btn-asset"
                @click="handleSave"
            >
                Save
            </AtlanBtn>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, ref, watch, onMounted } from 'vue'
    import MetadataScopes from '~/components/governance/personas/policies/metadataScopes.vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'ManagePermission',
        components: {
            MetadataScopes,
            AtlanBtn,
        },
        props: {
            actions: {
                type: Array,
                required: true,
            },
            visibleDrawer: {
                type: Boolean,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
        emits: ['close', 'save'],
        setup(props, { emit }) {
            const { actions, visibleDrawer } = toRefs(props)
            const actionsLocal = ref(actions.value)
            const handleClose = () => {
                emit('close')
            }
            const handleSave = () => {
                actions.value = actionsLocal.value
                emit('save', actionsLocal.value)
                handleClose()
            }
            watch(visibleDrawer, () => {
                if (visibleDrawer.value) {
                    actionsLocal.value = actions.value
                }
            })
            onMounted(() => {
                window.addEventListener('keydown', (keyDown) => {
                    if (keyDown.keyCode === 27) {
                        handleClose()
                    }
                })
            })
            return {
                handleClose,
                handleSave,
                actionsLocal,
            }
        },
    })
</script>
<style lang="less">
    .btn-back {
        transform: rotate(180deg);
    }
    .container-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .ant-collapse-content-box {
            padding: 0.75em;
            padding-left: 0.75em !important;
            padding-top: 0.75em !important;
        }
    }
    .btn-wrapper-manage {
        width: -webkit-fill-available;
        bottom: 0;
        background: white;
    }
</style>
