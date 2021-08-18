<template>
    <div
        class="mx-5 overflow-y-scroll border rounded-sm"
        style="max-height: 310px"
    >
        <table class="w-full table-auto">
            <tbody>
                <tr
                    v-for="(asset, index) in lineageList"
                    :key="index"
                    class="border-b"
                    :class="{
                        'border-none': index === lineageList.length - 1,
                    }"
                >
                    <router-link :to="`/assets/${asset.guid}/lineage`">
                        <td
                            class="flex items-center justify-between p-1 px-3 cursor-pointer  hover:bg-primary-light hover:bg-opacity-20"
                        >
                            <div class="flex items-center w-full">
                                <component
                                    :is="asset.typeName"
                                    class="w-auto h-3 mr-2"
                                ></component>
                                <div class="w-10/12 truncate">
                                    {{ asset.displayText }}
                                </div>
                            </div>
                            <img
                                :src="imgSrc(asset.source)"
                                class="w-auto h-3"
                            />
                        </td>
                    </router-link>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent } from 'vue'
    // Constants
    import { SourceList } from '~/constant/source'

    export default defineComponent({
        name: 'LineagePreviewTabAssetList',
        props: {
            lineageList: {
                type: Array,
                required: true,
            },
        },
        setup() {
            /** METHODS */
            const imgSrc = (source: string) => {
                const item = SourceList.find(
                    (src) => src.id === source.toLowerCase()
                )
                return item?.image || ''
            }

            return {
                imgSrc,
                SourceList,
            }
        },
    })
</script>
