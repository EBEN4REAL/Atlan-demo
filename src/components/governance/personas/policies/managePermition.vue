<template>
    <div class="">
        <div class="flex items-center p-4 pb-0">
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
            <span class="text-lg font-bold text-gray-700">Manage permissions</span>
        </div>
        <a-divider/>
        <div class="p-4">
            <MetadataScopes
                v-model:actions="actions"
                class="mb-6"
                type="purpose"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import MetadataScopes from '~/components/governance/personas/policies/metadataScopes.vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'ManagePermition',
        components: {
           MetadataScopes,
           AtlanBtn
        },
        props: {
            actions: {
                type: Array,
                required: true,
            },
        },
        emits: ['close'],
        setup(props, { emit }) {
            const handleClose = () => {
                emit('close')
            }
            return {
                handleClose
            }
        },
    })
</script>
<style lang="less">
    .btn-back{
        transform: rotate(180deg);
    }
</style>
