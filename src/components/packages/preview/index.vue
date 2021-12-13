<template>
    <div class="flex flex-col h-full p-6 bg-white" v-if="selectedPackage">
        <div
            class="flex mb-2 selectedPackages-center"
            v-if="selectedPackage.metadata.annotations"
        >
            <div class="p-2 mr-2 bg-white border border-gray-200 rounded-full">
                <img
                    v-if="
                        selectedPackage.metadata.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                    class="self-center w-6 h-6"
                    :src="
                        selectedPackage.metadata.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                />
                <span
                    v-else-if="
                        selectedPackage.metadata.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    "
                    class="self-center w-6 h-6"
                >
                    {{
                        selectedPackage.metadata.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    }}</span
                >
                <span v-else class="self-center w-6 h-6">
                    {{ '\ud83d\udce6' }}</span
                >
            </div>
            <div class="flex flex-col">
                <div class="text-sm font-bold truncate overflow-ellipsis">
                    {{
                        selectedPackage.metadata.annotations[
                            'orchestration.atlan.com/name'
                        ]
                    }}
                    <AtlanIcon icon="Verified"></AtlanIcon>
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
