<template>
    <div v-if="isGTCByType(data?.value?.typeName)" class="mb-0 capitalize">
        <b>{{ glossaryLabel[data?.value?.typeName] }}</b> was created
    </div>
    <div v-else class="mb-0"><b>Asset</b> was created</div>
    <MultipleAttributesActivity :data="data" :showLabel="false" />
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        defineAsyncComponent,
        onMounted,
        ref,
    } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'
    import MultipleAttributesActivity from '@/common/assets/preview/activity/types/multipleAttributes/index.vue'

    export default defineComponent({
        name: 'DescriptionActivity',
        components: {
            MultipleAttributesActivity,
        },
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
