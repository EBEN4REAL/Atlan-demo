<template>
    <div class="relative wrapper-manage-permition">
        <div class="flex p-4 pb-0">
            <AtlanBtn
                class="border-none btn-back"
                size="sm"
                padding="compact"
                data-test-id="cross"
                color="secondary"
                @click="handleClose"
            >
                <AtlanIcon icon="ArrowRight" class="-rotate-180" />
            </AtlanBtn>
            <div>
                <span class="text-lg font-bold text-gray-700"
                    >Manage permissions</span
                >
                <div class="text-gray-500">Data consultant policy</div>
            </div>
        </div>
        <a-divider />
        <div class="p-4 pt-0 container-content">
            <MetadataScopes
                v-model:actions="actionsLocal"
                class="mb-6"
                type="persona"
            />
        </div>
        <div
            class="fixed flex items-center justify-end p-3 mt-auto border-t border-solid gap-x-2 border-slate-300 btn-wrapper-manage"
        >
            <span class="mr-auto text-gray-500"
                >{{ actionsLocal.length || 'No' }} items updated</span
            >
            <AtlanBtn
                padding="compact"
                color="secondary"
                data-test-id="cancel"
                class="btn-asset"
                @click="handleClose"
            >
                Cancel
            </AtlanBtn>
            <AtlanBtn
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
    import { defineComponent, toRefs, ref, watch } from 'vue'
    import MetadataScopes from '~/components/governance/personas/policies/metadataScopes.vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'ManagePermition',
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
    .wrapper-manage-permition {
        height: 86vh;
    }
    .btn-wrapper-manage {
        width: -webkit-fill-available;
        bottom: 0;
        background: white;
    }
</style>
