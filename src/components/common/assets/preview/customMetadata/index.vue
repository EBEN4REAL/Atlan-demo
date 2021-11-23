<template>
    <div class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-5">
        <div class="flex items-center justify-between">
            <div class="font-semibold text-gray-500">{{ data.label }}</div>
            <div>
                <div
                    v-if="readOnly"
                    class="text-sm font-bold cursor-pointer text-primary"
                    @click="() => (readOnly = false)"
                >
                    Edit
                </div>
                <div v-else class="flex gap-x-2">
                    <div
                        class="text-sm font-medium text-gray-500 cursor-pointer"
                        @click="handleCancel"
                    >
                        Cancel
                    </div>
                    <div
                        class="text-sm font-bold cursor-pointer text-primary"
                        @click="handleUpdate"
                    >
                        Update
                    </div>
                </div>
            </div>
        </div>
        <div v-for="(a, x) in applicableList" :key="x">
            <div
                class="gap-6 gap-y-0 group"
                :class="
                    a.error ||
                    (getDatatypeOfAttribute(a.typeName) === 'text' && !readOnly)
                        ? ''
                        : 'mb-4'
                "
            >
                <div class="mb-2 text-gray-700">
                    {{ a.displayName }}
                </div>

                <div
                    v-if="readOnly"
                    class="flex items-center self-start flex-grow break-all"
                >
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
                <div v-else class="flex self-start flex-grow">
                    <a-input
                        v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
                        v-model:value="a.value"
                        :allow-clear="true"
                        class="flex-grow border shadow-none"
                        type="number"
                        placeholder="Type..."
                    />
                    <a-radio-group
                        v-else-if="
                            getDatatypeOfAttribute(a.typeName) === 'boolean'
                        "
                        :allow-clear="true"
                        :value="a.value"
                        class="flex-grow"
                    >
                        <a-radio class="" :value="true">True</a-radio>
                        <a-radio class="" :value="false">False</a-radio>
                    </a-radio-group>
                    <template
                        v-else-if="
                            getDatatypeOfAttribute(a.typeName) === 'date'
                        "
                    >
                        <a-date-picker
                            :allow-clear="true"
                            :value="(a.value || '').toString()"
                            class="flex-grow w-100"
                            value-format="x"
                        />
                    </template>
                    <a-textarea
                        v-else-if="
                            getDatatypeOfAttribute(a.typeName) === 'text'
                        "
                        v-model:value="a.value"
                        :allow-clear="true"
                        :auto-size="true"
                        :show-count="true"
                        :maxlength="parseInt(a.options.maxStrLength)"
                        placeholder="Type..."
                        type="text"
                        class="flex-grow shadow-none"
                    />
                    <div v-else class="flex-grow shadow-none border-1">
                        <a-select
                            v-model:value="a.value"
                            :allow-clear="true"
                            placeholder="Unassigned"
                            style="width: 100%"
                            :show-arrow="true"
                            :options="getEnumOptions(a.typeName)"
                            class=""
                        />
                    </div>
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
                getEnumOptions,
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

            const handleUpdate = () => {
                readOnly.value = true
            }
            const handleCancel = () => {
                readOnly.value = true
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
                handleUpdate,
                handleCancel,
                getEnumOptions,
            }
        },
    })
</script>
