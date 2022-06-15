<template>
    <a-popover
        placement="right"
        :align="{
            offset: [10, 0], // the offset sourceNode by 10px in x and 20px in y,
        }"
    >
        <template #content>
            <div class="p-3" style="max-width: 240px">
                <span class="text-xs text-new-gray-600">
                    You don’t have permission to update this asset. Contact
                    owners
                </span>
                <div class="">
                    <template v-for="o in owners" :key="o">
                        <div class="">
                            {{ o }}
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <slot />
    </a-popover>
</template>

<script setup lang="ts">
    import { onMounted, PropType, ref, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    const props = defineProps({
        asset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
        // metadata: {
        //     type: Object,
        //     required: true,
        // },
        // openKeys: {
        //     type: Array,
        //     required: true,
        // },
    })

    const { ownerUsers } = useAssetInfo()

    const owners = ref()
    owners.value = ownerUsers(props.asset)
</script>

<style scoped></style>
