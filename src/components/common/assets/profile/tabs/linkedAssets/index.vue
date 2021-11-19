<template>
    <div class="p-6">
        <div class="p-4 bg-white rounded">
            <Assets :show-filters="false" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Assets from '@/assets/index.vue'

    export default defineComponent({
        name: 'LinkedAssetsTab',
        components: { Assets },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { isBiAsset, isGTC } = useAssetInfo()

            /*  const termsFilter = computed(() => ({
                terms: {
                    ownerUsers: selectedUser.value?.username
                        ? [selectedUser.value.username]
                        : [],
                    ownerGroups: selectedGroup.value?.name
                        ? [selectedGroup.value.name]
                        : [],
                },
            })) */

            return { isBiAsset, isGTC }
        },
    })
</script>
