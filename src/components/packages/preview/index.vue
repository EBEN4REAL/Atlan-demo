<template>
    <div class="flex flex-col h-full p-6 bg-white" v-if="selectedPackage">
        <div
            class="flex items-center"
            v-if="selectedPackage?.metadata?.annotations"
        >
            <div class="p-2 mr-2 bg-white border border-gray-200 rounded-full">
                <img
                    v-if="
                        selectedPackage?.metadata?.annotations[
                            'com.atlan.orchestration/icon'
                        ]
                    "
                    class="self-center h-auto"
                    style="width: 30px"
                    :src="
                        selectedPackage?.metadata?.annotations[
                            'com.atlan.orchestration/icon'
                        ]
                    "
                />
            </div>
            <div class="flex flex-col">
                <div class="text-base font-bold truncate overflow-ellipsis">
                    {{
                        selectedPackage?.metadata?.annotations[
                            'workflows.argoproj.io/name'
                        ]
                    }}
                </div>
                <div class="flex">
                    <div class="text-sm truncate overflow-ellipsis">
                        {{
                            selectedPackage?.metadata?.annotations[
                                'com.atlan.orchestration/packageName'
                            ]
                        }}
                    </div>
                    <div class="text-sm truncate overflow-ellipsis">
                        (v{{
                            selectedPackage?.metadata?.labels[
                                'org.argopm.package.version'
                            ]
                        }})
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-3 text-sm line-clamp-5">
            <span v-if="selectedPackage?.metadata?.annotations">
                {{
                    selectedPackage?.metadata?.annotations[
                        'workflows.argoproj.io/description'
                    ]
                }}</span
            >
        </div>
        <div class="flex-grow mt-3">
            <a-button
                >Readme <AtlanIcon icon="External" class="ml-2"></AtlanIcon
            ></a-button>
        </div>

        <a-button
            type="primary"
            @click.shift.exact="handleSetupSandbox"
            @click.exact="handleSetup"
            >Setup</a-button
        >
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
        emits: ['setup', 'sandbox'],
        setup(props, { emit }) {
            const { selectedPackage } = toRefs(props)

            const handleSetup = (item) => {
                emit('setup', selectedPackage.value)
            }
            const handleSetupSandbox = (item) => {
                emit('sandbox', selectedPackage.value)
            }

            return { selectedPackage, handleSetup, handleSetupSandbox }
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
