<template>
    <a-input
        v-if="dataType === 'text'"
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
        format="MM-DD-YYYY"
        @change="handleChange"
    ></component>
    <a-time-picker
        v-if="dataType === 'time'"
        :default-value="modelValue"
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
        style="width: 100%"
        :value="modelValue"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :options="asyncData"
        :loading="loading"
        :disabled="letAsyncSelectDisabled || disabled"
        :placeholder="placeholder"
        v-bind="{ ...(multiple ? { mode: 'multiple' } : {}) }"
        @change="handleChange"
        @dropdownVisibleChange="handleDropdownVisibleChange"
    >
        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <template v-if="allowCreate">
                <a-divider style="margin: 4px 0" />
                <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                    @click="handleCreateNew"
                >
                    {{ createNewLabel || 'Create More' }}
                </div>
            </template>
        </template>
    </a-select>
    <a-modal
        v-model:visible="createNewVisibility"
        title="Basic Modal"
        width="60%"
        :closable="false"
    >
        <div class="overflow-y-scroll" style="height: 65vh">
            <FormGenerator :config="newConfig" />
        </div>
        <template #footer>
            <a-button @click="handleClose">Close</a-button>
        </template>
    </a-modal>

    <!-- async tree select start -->
    <a-tree-select
        v-if="dataType === 'asyncTreeSelect'"
        v-model:value="value"
        :multiple="true"
        :tree-checkable="true"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="treeData"
        placeholder="Please select"
        :load-data="onLoadData"
        @change="handleSelect"
        @click="handleDropdownVisibleChange"
    />

    <!-- async tree select end -->

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
        <a-input
            v-if="isCustom"
            style="width: 80%"
            :value="modelValue"
            :placeholder="placeholder"
            :prefix="prefix"
            :suffix="suffix"
            @change="handleChange"
        ></a-input>
        <a-select
            v-if="dataType === 'enum' && !isCustom"
            style="width: 80%"
            show-search
            :value="modelValue"
            :options="enumList"
            :placeholder="placeholder"
            @change="handleChange"
        ></a-select>
        <a-button
            v-if="allowCustom"
            style="width: 10%"
            class="px-1"
            @click="handleToggleCustom"
        >
            <fa icon="fal user-edit"></fa>
        </a-button>
    </a-input-group>
    <UserSelector v-if="dataType === 'users'"></UserSelector>
    <div v-if="errorM || treeErrorM" class="text-red-600">
        {{ errorM || treeErrorM }}
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import {
        defineAsyncComponent,
        toRefs,
        defineComponent,
        PropType,
        ref,
        watch,
    } from 'vue'
    import UserSelector from '@common/selector/users/index.vue'
    import useAsyncSelector from './useAsyncSelector'
    import useAsyncTreeSelect from './useAsyncTreeSelect'

    export default defineComponent({
        components: {
            UserSelector,
            // formGenerator,
            FormGenerator: defineAsyncComponent(
                () => import('@/common/formGenerator/index.vue')
            ),
            // formModal,
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            id: {},
            modelValue: {
                type: [Boolean, String, Number],
                required: false,
                default: () => '',
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
                default(): string {
                    return ''
                },
            },
            createNewLabel: {
                type: String,
                required: false,
                default: '',
            },
            placeholder: {
                type: String,
                required: false,
                default(): string {
                    return ''
                },
            },
            prefix: {
                type: String,
                required: false,
                default(): string {
                    return ''
                },
            },
            suffix: {
                type: String,
                required: false,
                default(): string {
                    return ''
                },
            },
            enumList: {
                type: Array,
                required: false,
                default(): any {
                    return []
                },
            },
            options: {
                type: Array,
                required: false,
                default(): any {
                    return []
                },
            },
            defaultValue: {
                required: false,
            },
            allowCustom: {
                type: Boolean,
                required: false,
                default(): boolean {
                    return false
                },
            },
            allowCreate: {
                type: Boolean,
                required: false,
                default(): boolean {
                    return false
                },
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
                default(): string {
                    return ''
                },
            },
            limitBefore: {
                type: [String, Boolean],
                required: false,
                default(): string | boolean {
                    return false
                },
            },
            limitAfter: {
                type: [String, Boolean],
                required: false,
                default(): string | boolean {
                    return false
                },
            },
        },
        emits: ['update:modelValue', 'change', 'blur', 'getGlobal'],
        setup(props, { emit }) {
            const { valueObject } = toRefs(props)

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
                props.requestConfig,
                props.responseConfig,
                valueObject,
                props?.getFormConfig
            )

            const {
                onLoadData,
                treeData,
                init,
                errorM: treeErrorM,
            } = useAsyncTreeSelect(
                asyncData,
                props.otherApiConfig.req,
                props.otherApiConfig.res,
                valueObject
            )

            const handleDropdownVisibleChange = (open) => {
                if (open && shouldRefetch.value) loadData()
            }

            const handleClose = () => {
                createNewVisibility.value = false
                loadData()
            }

            const value = ref(null)

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
                        n.node?.props?.pid ||
                        n?.props?.value ||
                        n?.node?.props?.value ||
                        null
                    const schema =
                        n?.node?.props?.pid || n?.props?.pid
                            ? n?.node?.props?.value || n?.props?.value
                            : null

                    if (result[db] && schema)
                        result[db] = [...result[db], schema]
                    else if (schema) result[db] = [schema]
                    else result[db] = []
                })

                emit('update:modelValue', result)
                emit('change', result)
            }

            const handleChange = (e, timeStamp) => {
                let val = e
                if (e?.target) {
                    val = e.target.value
                }
                if (props.dataType === 'number') {
                    emit('update:modelValue', parseInt(val, 10))
                } else if (props.dataType === 'checkbox') {
                    emit('update:modelValue', Array.from(e))
                } else if (
                    props.dataType === 'date' ||
                    props.dataType === 'time'
                ) {
                    emit('update:modelValue', timeStamp)
                } else {
                    emit('update:modelValue', val)
                }
                emit('change', val)
                if (
                    props.dataType === 'asyncSelect' &&
                    props?.globalVariables
                ) {
                    const temp = {}
                    Object.entries(props.globalVariables).forEach(([k, p]) => {
                        const d = asyncData.value.find(
                            (o) => o.value === e
                        ).data
                        temp[k] = getStringFromPath(d, p)
                    })
                    emit('getGlobal', temp)
                }
            }

            return {
                handleChange,
                errorM,
                treeErrorM,
                treeData,
                handleSelect,
                value,
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
            }
        },
        data() {
            return {
                isCustom: false,
                dayjs,
            }
        },
        computed: {
            dateTimeTypeComponent() {
                switch (this.dateTimeType) {
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
            },
        },
        mounted() {
            // if (this.defaultValue) {
            //   if (this.dataType === "number") {
            //     this.$emit("update:modelValue", parseInt(this.defaultValue));
            //   } else {
            //     this.$emit("update:modelValue", this.defaultValue);
            //   }
            // }
        },
        methods: {
            disabledDate(current) {
                // console.log(this.limitAfter, this.limitBefore)

                const limitAfter =
                    typeof this.limitAfter === 'boolean'
                        ? this.limitAfter
                        : current < dayjs(this.limitAfter, 'MM-DD-YYYY')
                const limitBefore =
                    typeof this.limitBefore === 'boolean'
                        ? this.limitBefore
                        : current < dayjs(this.limitBefore, 'MM-DD-YYYY')
                return current && limitAfter && current && limitBefore
            },

            handleToggleCustom() {
                this.isCustom = !this.isCustom
            },
        },
    })
</script>

<style lang="less">
    .ant-modal {
        top: 50% !important;
        transform: translateY(-50%) !important;
        padding-bottom: 0px !important;
    }
</style>
