<template>
    <div class="flex flex-col h-full p-6 bg-white" v-if="selectedPackage">
        <div
            class="flex mb-2 selectedPackages-center"
            v-if="selectedPackage.metadata.annotations"
        >
            <div
                class="relative p-2 mr-2 bg-white border border-gray-200 rounded-full"
            >
                <img
                    v-if="
                        selectedPackage.metadata?.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                    class="self-center w-6 h-6"
                    :src="
                        selectedPackage.metadata?.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                />
                <span
                    v-else-if="
                        selectedPackage.metadata?.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    "
                    class="self-center w-6 h-6"
                >
                    {{
                        selectedPackage.metadata?.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    }}</span
                >
                <span v-else class="self-center w-6 h-6">
                    {{ '\ud83d\udce6' }}</span
                >
                <div
                    v-if="
                        selectedPackage.metadata?.labels[
                            'orchestration.atlan.com/certified'
                        ] === 'true'
                    "
                    class="absolute -right-1 -top-2"
                >
                    <a-tooltip title="Certified" placement="left">
                        <AtlanIcon icon="Verified" class="ml-1"></AtlanIcon>
                    </a-tooltip>
                </div>
            </div>
            <div class="flex flex-col">
                <div class="text-base font-bold truncate overflow-ellipsis">
                    {{
                        selectedPackage.metadata.annotations[
                            'orchestration.atlan.com/name'
                        ]
                    }}
                </div>
                <div class="text-sm truncate overflow-ellipsis">
                    By
                    {{
                        selectedPackage.metadata.annotations[
                            'package.argoproj.io/author'
                        ]
                    }}
                </div>
            </div>
        </div>

        <div class="text-sm line-clamp-3">
            <span>
                {{
                    selectedPackage.metadata.annotations[
                        'package.argoproj.io/description'
                    ]
                }}</span
            >
        </div>
        <div class="mt-3 text-sm">
            <p class="text-gray-500">Type</p>
            <div class="tracking-wider capitalize">
                {{
                    selectedPackage.metadata.labels[
                        'orchestration.atlan.com/type'
                    ]
                }}
            </div>
        </div>
        <div class="mt-3 text-sm">
            <p class="text-gray-500">Category</p>
            <div class="tracking-wider capitalize">
                {{
                    selectedPackage.metadata.annotations[
                        'orchestration.atlan.com/categories'
                    ]
                }}
            </div>
        </div>
        <div class="mt-3 text-sm">
            <p class="text-gray-500">Package Name</p>
            <div class="">
                {{
                    selectedPackage.metadata.annotations[
                        'package.argoproj.io/name'
                    ]
                }}
                v{{
                    selectedPackage.metadata.labels[
                        'package.argoproj.io/version'
                    ]
                }}
            </div>
        </div>
        <div class="mt-3 text-sm">
            <p class="text-gray-500">Publisher</p>
            <div class="">
                {{
                    selectedPackage.metadata.annotations[
                        'package.argoproj.io/author'
                    ]
                }}
            </div>
        </div>
        <div class="mt-3 text-sm">
            <p class="text-gray-500">Links</p>
            <div class="flex flex-col">
                <a
                    href="https://ask.atlan.com"
                    class="text-primary"
                    target="_blank"
                    >Support</a
                >
                <a :href="marketplaceLink" class="text-primary" target="_blank"
                    >Documentation</a
                >
            </div>
        </div>
    </div>
    <EmptyView
        v-else
        empty-screen="EmptyDiscover"
        desc="
                           No packages selected
                        "
    ></EmptyView>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, Ref, computed } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import { useRoute } from 'vue-router'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            EmptyView,
        },
        props: {
            selectedPackage: {
                type: Object,
            },
        },
        setup(props, { emit }) {
            const { selectedPackage } = toRefs(props)

            const route = useRoute()
            const isItem = computed(() => !!route.params.id)

            const marketplaceLink = computed(
                () =>
                    `https://marketplace.atlan.com/-/web/detail/${selectedPackage.value.metadata.annotations['package.argoproj.io/name']}`
            )

            return {
                selectedPackage,
                marketplaceLink,
                isItem,
            }
        },
    })
</script>

<style lang="less">
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
    }
</style>
