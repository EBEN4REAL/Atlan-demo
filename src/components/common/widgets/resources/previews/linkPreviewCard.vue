<template>
    <div class="flex p-2 border rounded">
        <div class="mr-2 min-w-link-left-col">
            <img
                :src="`https://www.google.com/s2/favicons?domain=${link(
                    item
                )}&sz=64`"
                :alt="title(item)"
                class="h-7"
            />
        </div>
        <div class="flex flex-col">
            <a
                class="flex cursor-pointer gap-x-2 hover:underline"
                :href="`//${link(item)}`"
                target="_blank"
                rel="noreferrer"
            >
                <span class="font-bold">{{ title(item) }}</span>
            </a>
            <span
                v-if="createdBy(item) === modifiedBy(item)"
                class="text-sm text-gray-500"
                >Added by {{ createdBy(item) }} {{ createdAt(item) }}
            </span>
            <span v-else class="text-sm text-gray-500"
                >Edited by {{ modifiedBy(item) }} {{ modifiedAt(item) }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const {
                createdBy,
                modifiedBy,
                createdAt,
                modifiedAt,
                title,
                link,
            } = useAssetInfo()
            return { createdBy, modifiedBy, createdAt, modifiedAt, title, link }
        },
    })
</script>
<style lang="less" scoped>
    .min-w-link-left-col {
        min-width: 2rem;
    }
</style>
