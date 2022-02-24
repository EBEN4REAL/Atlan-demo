<template>
    <div v-if="isGTCByType(data?.value?.typeName)" class="mb-0 capitalize">
        <b>{{ glossaryLabel[data?.value?.typeName] }}</b> was deleted
    </div>
    <div v-else class="mb-0"><b>Asset</b> was deleted</div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'

    export default defineComponent({
        name: 'DeleteActivity',

        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup(props) {
            const { isGTCByType } = useAssetInfo()
            return {
                glossaryLabel,
                isGTCByType,
            }
        },
    })
</script>
