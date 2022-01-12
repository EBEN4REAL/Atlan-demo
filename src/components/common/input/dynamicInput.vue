<template>
    <a-input
        v-if="dataType === 'text' && formType !== 'group'"
        :value="modelValue"
        :placeholder="placeholder"
        :default-value="prefix"
        :suffix="suffix"
        @change="handleChange"
    ></a-input>
    <a-input
        v-if="dataType === 'text' && formType === 'group'"
        :value="modelValue"
        :placeholder="placeholder"
        :prefix="prefix"
        :suffix="suffix"
        @change="handleChange"
    ></a-input>
    <!-- Continued types -->
    <a-textarea
        v-if="dataType === 'textArea'"
        :value="modelValue"
        :placeholder="placeholder"
        @change="handleChange"
    ></a-textarea>
    <component
        :is="dateTimeTypeComponent || 'a-date-picker'"
        v-if="dataType === 'date'"
        :default-value="modelValue"
        :placeholder="placeholder"
        :disabled-date="disabledDate"
        format="YYYY-MM-DD"
        value-format="x"
        @change="handleChange"
    ></component>
    <a-time-picker
        v-if="dataType === 'time'"
        :default-value="modelValue"
        value-format="x"
        :placeholder="placeholder"
        @change="handleChange"
    ></a-time-picker>
    <a-checkbox-group
        v-if="dataType === 'checkbox'"
        :checked="modelValue"
        :options="options"
        @change="handleChange"
    ></a-checkbox-group>
    <a-radio-group
        v-if="dataType === 'radioButton'"
        :value="modelValue"
        :options="options"
        @change="handleChange"
    ></a-radio-group>
    <!-- End of Coninuted types -->
    <a-select
        v-if="dataType === 'asyncSelect'"
        v-model:value="localValue"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :options="asyncData"
        :loading="loading"
        :disabled="letAsyncSelectDisabled || disabled"
        :placeholder="placeholder"
        v-bind="{
            ...(multiple && allowCustom
                ? { mode: 'tags' }
                : multiple
                ? { mode: 'multiple' }
                : {}),
        }"
        @change="handleChange"
        @dropdownVisibleChange="handleDropdownVisibleChange"
    >
        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <div v-if="allowCreate">
                <a-divider style="margin: 4px 0" />
                <div
                    style="padding: 4px 8px; cursor: copy"
                    @mousedown="(e) => e.preventDefault()"
                    @click="handleCreateNew"
                >
                    {{ createNewLabel || 'Create More' }}
                </div>
            </div>
        </template>
    </a-select>
    <a-modal
        v-model:visible="createNewVisibility"
        title="Create Credential"
        width="40%"
        :closable="false"
        :body-style="{ overflowY: 'scroll', height: '65vh' }"
    >
        <div class="p-4">
            <FormGenerator :config="newConfig" />
        </div>
        <template #footer>
            <a-button @click="handleClose">Close</a-button>
        </template>
    </a-modal>

    <!-- async tree select start -->
    <a-tree-select
        v-if="dataType === 'asyncTreeSelect'"
        v-model:value="valueTreeSelected"
        :multiple="true"
        :tree-checkable="true"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="treeData"
        placeholder="Please select"
        :load-data="onLoadData"
        :disabled="letAsyncSelectDisabled || disabled"
        tree-node-label-prop="key"
        @change="handleSelect"
        @click="
            () =>
                handleDropdownVisibleChange(
                    !letAsyncSelectDisabled && !disabled
                )
        "
    />

    <!-- async tree select end -->
    <div class="flex flex-col items-center">
        <div
            v-if="dataType === 'upload'"
            class="flex items-center mt-2 space-x-3"
        >
            <a-upload
                v-model:file-list="fileList"
                :accept="accept"
                :multiple="false"
                :remove="handleRemove"
                :before-upload="beforeUpload"
                :showUploadList="false"
            >
                <a-button :disabled="fileList.length > 0">
                    Select File
                </a-button>
            </a-upload>
            <a-button
                v-if="fileList?.length"
                type="primary"
                :disabled="fileList.length === 0"
                :loading="uploading"
                @click="handleUpload"
            >
                {{ uploading ? 'Uploading' : 'Start Upload' }}
            </a-button>
        </div>
        <span
            v-if="accept?.length && !fileList?.length"
            class="self-center mt-2 text-gray-500"
            >Format allowed: {{ accept?.toUpperCase() }}</span
        >
        <div v-if="fileList?.length" class="flex items-center mt-3 space-x-1">
            <atlan-icon icon="Link" />
            <span class="text-gray-500">{{ fileList[0]?.name }}</span>
            <span class="text-gray-500">|</span>
            <atlan-icon
                icon="Delete"
                class="text-red-500"
                @click="fileList = []"
            />
        </div>
        <span v-if="fileList?.length" class="mt-3"
            >Hit the “Start Upload” button to start upload.</span
        >
    </div>

    <a-input-number
        v-if="dataType === 'number'"
        :value="modelValue"
        :placeholder="placeholder"
        :prefix="prefix"
        :suffix="suffix"
        @change="handleChange"
    ></a-input-number>
    <a-input-password
        v-if="dataType === 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :prefix="prefix"
        :suffix="suffix"
        @change="handleChange"
    ></a-input-password>
    <a-switch
        v-if="dataType === 'boolean'"
        :checked="modelValue"
        @change="handleChange"
    />

    <a-input-group v-if="dataType === 'enum'" compact class="w-full">
        <a-select
            v-if="dataType === 'enum'"
            v-model:value="localValue"
            style="width: 80%"
            show-search
            v-bind="{
                ...(allowCustom
                    ? { mode: 'tags' }
                    : multiple
                    ? { mode: 'multiple' }
                    : {}),
            }"
            :options="enumList"
            :placeholder="placeholder"
            @change="handleChange"
        ></a-select>
    </a-input-group>
    <!-- <UserSelector v-if="dataType === 'users'"></UserSelector> -->
    <div v-if="errorM || treeErrorM || fileError" class="text-red-600">
        {{ errorM || treeErrorM || 'Some error occured.' }}
    </div>
    <div v-else-if="fileSuccess" class="text-green-600">
        {{ 'Successfully uploaded.' }}
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import {
        defineAsyncComponent,
        toRefs,
        defineComponent,
        ref,
        watch,
        onMounted,
        Ref,
        computed,
    } from 'vue'
    // import UserSelector from '@common/selector/users/index.vue'
    import { useVModels } from '@vueuse/core'
    import useAsyncSelector from './useAsyncSelector'
    import useAsyncTreeSelect from './useAsyncTreeSelect'
    import useFileUploader from './useFileUploader'
    import access from '~/constant/accessControl/map'

    export default defineComponent({
        components: {
            // UserSelector,
            FormGenerator: defineAsyncComponent(
                () => import('@/common/formGenerator/index.vue')
            ),
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            id: { type: String, required: false, default: '' },
            // eslint-disable-next-line vue/require-prop-types
            modelValue: { default: undefined },
            accept: {
                type: String,
                required: false,
                default: '',
            },
            globalVariables: {
                type: Object,
                required: false,
                default: () => {},
            },
            valueObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            multiple: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            dataType: {
                type: String,
                required: false,
                default: () => '',
            },
            createNewLabel: {
                type: String,
                required: false,
                default: '',
            },
            placeholder: {
                type: String,
                required: false,
                default: () => '',
            },
            prefix: {
                type: String,
                required: false,
                default: () => '',
            },
            suffix: {
                type: String,
                required: false,
                default: () => '',
            },
            enumList: {
                type: Array,
                required: false,
                default: () => [],
            },
            options: {
                type: Array,
                required: false,
                default: () => [],
            },
            defaultValue: {
                type: [Boolean, String, Number],
                required: false,
                default: () => '',
            },
            allowCustom: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            allowCreate: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            getFormConfig: {
                type: Object,
                required: false,
                default: () => null,
            },
            requestConfig: {
                type: Object,
                required: false,
                default: () => null,
            },
            responseConfig: {
                type: Object,
                required: false,
                default: () => null,
            },
            otherApiConfig: {
                type: Object,
                required: false,
                default: () => null,
            },
            dateTimeType: {
                type: String,
                required: false,
                default: () => '',
            },
            limitBefore: {
                type: [String, Boolean],
                required: false,
                default: () => false,
            },
            limitAfter: {
                type: [String, Boolean],
                required: false,
                default: () => false,
            },
            formType: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        emits: ['update:modelValue', 'change', 'blur', 'getGlobal'],
        setup(props, { emit }) {
            const {
                valueObject,
                dateTimeType,
                limitAfter,
                limitBefore,
                responseConfig,
                requestConfig,
                getFormConfig,
                multiple,
            } = toRefs(props)

            const { modelValue }: any = useVModels(props, emit)

            const valueTreeSelected: Ref<any> = ref()
            const localValue: Ref<any> = ref(modelValue || [])

            // prop requestConfig is initially defaults to null, then reflects actually value, find out why
            // watch(
            //     requestConfig,
            //     () => {
            //         console.log('requestConfig', requestConfig.value)
            //     },
            //     { deep: true }
            // )

            const {
                errorM,
                loadData,
                asyncData,
                newConfig,
                loadingData: loading,
                loadDataError: error,
                letAsyncSelectDisabled,
                shouldRefetch,
                handleCreateNew,
                createNewVisibility,
                getStringFromPath,
            } = useAsyncSelector(
                requestConfig,
                responseConfig,
                valueObject,
                getFormConfig
            )

            const {
                onLoadData,
                treeData,
                init,
                disabled,
                errorM: treeErrorM,
            } = useAsyncTreeSelect(
                asyncData,
                props.otherApiConfig?.req,
                props.otherApiConfig?.res,
                valueObject
            )

            const {
                handleUpload,
                beforeUpload,
                handleRemove,
                uploading,
                fileList,
                error: fileError,
                success: fileSuccess,
            } = useFileUploader(requestConfig, emit)

            const handleDropdownVisibleChange = (open) => {
                if (open && shouldRefetch.value) loadData()
            }

            const handleClose = () => {
                createNewVisibility.value = false
                loadData()
            }

            watch(
                [loading, error],
                () => {
                    if (!loading.value && !error.value) {
                        init()
                    }
                },
                { immediate: false }
            )

            const handleSelect = (v, n, e) => {
                const { allCheckedNodes } = e
                const result = {}
                allCheckedNodes.forEach((n) => {
                    // if pid dont exists it is db else it is schema
                    const db =
                        n?.props?.pid ||
                        n?.node?.props?.pid ||
                        n?.node?.props?.dataRef?.pid ||
                        n?.node?.props?.dataRef?.val ||
                        n?.props?.val ||
                        n?.node?.props?.val ||
                        null
                    const schema =
                        n?.node?.props?.pid ||
                        n?.props?.pid ||
                        n?.node?.props?.dataRef?.pid
                            ? n?.node?.props?.val ||
                              n?.props?.val ||
                              n?.node?.props?.dataRef?.val
                            : null

                    if (result[db] && schema)
                        result[db] = [...result[db], schema]
                    else if (schema) result[db] = [schema]
                    else result[db] = []
                })
                modelValue.value = result
                emit('change', result)
            }

            /**
             * @params vO valueObject, consist of db and schema in the form {"db" : ["schenma_1", "schenma_2"]}
             * @returns parsed value as need by antD component
             */
            const parseDBSchemaValue = (vO) => {
                if (!vO) return []
                const allValues: string[] = []
                Object.entries(vO).forEach(([d, s]) => {
                    if (s.length)
                        allValues.push(...s.map((schema) => `${d}/${schema}`))
                    else allValues.push(d)
                })
                return allValues
            }

            onMounted(() => {
                // localValue.value = props.multiple ? [] : ''
                if (props.dataType === 'asyncTreeSelect') {
                    valueTreeSelected.value = parseDBSchemaValue(
                        modelValue.value
                    )
                    // localValue.value = parseDBSchemaValue(modelValue)
                }
                // for async select, load on mount if possible
                else if (
                    props.dataType === 'asyncSelect' &&
                    shouldRefetch.value &&
                    !letAsyncSelectDisabled.value
                ) {
                    loadData()
                }
            })

            const handleChange = (e) => {
                if (props.dataType === 'enum') {
                    if (!props.multiple && props.allowCustom) {
                        localValue.value = e[e.length - 1]
                            ? [e[e.length - 1]]
                            : []
                        modelValue.value = e[e.length - 1]
                    } else {
                        localValue.value = e
                        modelValue.value = e
                    }
                    emit('change', e)
                } else if (
                    props.dataType === 'asyncSelect' &&
                    props?.globalVariables
                ) {
                    const temp = {}
                    Object.entries(props.globalVariables).forEach(([k, p]) => {
                        const d = asyncData.value.find(
                            (o) => o.value === e
                        )?.data
                        if (d) temp[k] = getStringFromPath(d, p)
                    })
                    if (!props.multiple && props.allowCustom) {
                        localValue.value = e[e.length - 1]
                            ? [e[e.length - 1]]
                            : []
                        modelValue.value = e[e.length - 1]
                    } else {
                        modelValue.value = e
                    }

                    emit('getGlobal', temp, true)
                    emit('change', e)
                } else {
                    let val = e
                    if (e?.target) {
                        val = e.target.value
                    }

                    if (props.dataType === 'number') {
                        modelValue.value = parseInt(val, 10)
                    } else if (props.dataType === 'checkbox') {
                        modelValue.value = Array.from(e)
                    } else if (
                        props.dataType === 'date' ||
                        props.dataType === 'time'
                    ) {
                        modelValue.value = e
                    } else {
                        modelValue.value = val
                    }
                    emit('change', val)
                }
            }

            const dateTimeTypeComponent = computed(() => {
                switch (dateTimeType.value) {
                    case 'date':
                        return 'a-date-picker'
                    case 'month':
                        return 'a-month-picker'
                    case 'range':
                        return 'a-range-picker'
                    case 'week':
                        return 'a-week-picker'
                    default:
                        return 'a-date-picker'
                }
            })

            const disabledDate = (current) => {
                const isLimitAfter =
                    typeof limitAfter === 'boolean'
                        ? limitAfter
                        : current < dayjs(limitAfter, 'MM-DD-YYYY')
                const isLimitBefore =
                    typeof limitBefore === 'boolean'
                        ? limitBefore
                        : current < dayjs(limitBefore, 'MM-DD-YYYY')
                return current && isLimitAfter && current && isLimitBefore
            }

            return {
                access,
                fileError,
                fileSuccess,
                uploading,
                fileList,
                handleUpload,
                handleRemove,
                handleChange,
                beforeUpload,
                errorM,
                treeErrorM,
                treeData,
                handleSelect,
                localValue,
                onLoadData,
                loadData,
                handleClose,
                createNewVisibility,
                newConfig,
                handleCreateNew,
                handleDropdownVisibleChange,
                asyncData,
                loading,
                letAsyncSelectDisabled,
                dateTimeTypeComponent,
                disabledDate,
                valueTreeSelected,
            }
        },
    })
</script>

<style lang="less" scoped>
    .ant-modal {
        top: 50% !important;
        transform: translateY(-50%) !important;
        padding-bottom: 0px !important;
    }
</style>
