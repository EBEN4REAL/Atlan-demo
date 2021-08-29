<template>
    <div class="px-4 py-3 bg-white hover:bg-primary-light hover:bg-opacity-10">
        <div class="flex items-center justify-between align-middle">
            <div class="flex items-start mr-1">
                <div class="mt-1">
                    <fa icon="fal file-alt" class="mr-2 text-2xl"></fa>
                </div>
                <div>
                    <div class="flex flex-col w-full">
                        <div class="flex items-center justify-between mb-0">
                            <router-link :to="`/`">
                                <a
                                    class="mb-0 font-semibold leading-none tracking-wide truncate cursor-pointer  text-primary hover:underline"
                                >
                                    {{ title(item) }}
                                </a>
                            </router-link>
                        </div>
                        <div class="flex items-center">
                            <div></div>
                        </div>
                    </div>
                    <div class="">
                        <p class="mb-0 text-xs text-gray-500">
                            {{
                                item.attributes.anchor?.uniqueAttributes
                                    ?.qualifiedName
                            }}
                        </p>
                        <p
                            v-if="
                                projection?.includes('description') &&
                                item.attributes.shortDescription
                            "
                            class="mb-0 text-xs text-gray-500"
                        >
                            {{ item.attributes.shortDescription }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    import { Components } from '~/api/atlas/client'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
                required: false,
                default(): Components.Schemas.AtlasEntityHeader {
                    return {}
                },
            },
            score: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        setup() {
            const { title } = useAssetInfo()
            return { title }
        },
    })
</script>
