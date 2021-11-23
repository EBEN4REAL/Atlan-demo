<template>
    <div class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-5">
        <div class="flex items-center justify-between">
            <div class="font-semibold text-gray-500">{{ data.label }}</div>
            <div
                class="text-sm font-bold cursor-pointer text-primary"
                @click="() => (readOnly = !readOnly)"
            >
                {{ readOnly ? 'Edit' : 'Done' }}
            </div>
        </div>
        <div v-for="(a, x) in applicableList" :key="x">
            <div class="gap-6 gap-y-0 group" :class="a.error ? '' : 'mb-4'">
                <div class="mb-2 text-gray-700">
                    {{ a.displayName }}
                </div>

                <div class="flex items-center self-start flex-grow break-all">
                    <a
                        v-if="isLink(a.value, a.displayName)"
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
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'

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
            const { selectedAsset, data } = toRefs(props)

            const readOnly = ref(true)

            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getApplicableAttributes,
            } = useCustomMetadataHelpers()

            const applicableList = ref(
                getApplicableAttributes(
                    data.value,
                    selectedAsset.value.typeName
                )
            )

            const setAttributesList = () => {
                if (selectedAsset.value?.attributes) {
                    const bmAttributes = Object.keys(
                        selectedAsset.value.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    bmAttributes.forEach((ab) => {
                        if (data.value.id === ab.split('.')[0]) {
                            const attribute = ab.split('.')[1]
                            const value = selectedAsset.value.attributes[ab]
                            const attrIndex = applicableList.value.findIndex(
                                (a) => a.name === attribute
                            )
                            if (attrIndex > -1)
                                applicableList.value[attrIndex].value = value
                        }
                    })
                    console.log(applicableList.value)
                }
            }

            watch(
                () => selectedAsset.value.guid,
                () => {
                    applicableList.value = getApplicableAttributes(
                        data.value,
                        selectedAsset.value.typeName
                    )
                    setAttributesList()
                },
                {
                    immediate: true,
                }
            )

            setAttributesList()

            return {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                applicableList,
                readOnly,
            }
        },
    })
</script>
