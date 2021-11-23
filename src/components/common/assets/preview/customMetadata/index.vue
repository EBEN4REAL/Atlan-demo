<template>
    <div class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-5">
        {{ data.label }}
    </div>
    <div class="px-5 py-2">
        <div v-for="(a, x) in data.attributes" :key="x">
            <div class="gap-6 gap-y-0 group" :class="a.error ? '' : 'mb-4'">
                <div class="mb-2 text-gray-700">
                    {{ a.options.displayName }}
                </div>

                <div class="flex items-center self-start flex-grow break-all">
                    <a
                        v-if="isLink(a.value, a.options.displayName)"
                        target="_blank"
                        :href="a.value"
                    >
                        {{ a.value || '-' }}</a
                    >
                    <span v-else>
                        {{
                            formatDisplayValue(
                                a.value?.toString() || '',
                                getDatatypeOfAttribute(a.typeName)
                            ) || '-'
                        }}</span
                    >
                </div>
            </div>
            <div v-if="a.error" class="pr-3 mb-4 text-warning">
                {{ a.error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {},
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const {} = useAssetInfo()

            return {}
        },
    })
</script>
