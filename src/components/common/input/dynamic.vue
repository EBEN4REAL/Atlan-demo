<template>
    <div>
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
            @change="handleChange"
            :disabled-date="disabledDate"
            format="MM-DD-YYYY"
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
            @change="handleChange"
            :options="options"
        ></a-checkbox-group>
        <a-radio-group
            v-if="dataType === 'radioButton'"
            :value="modelValue"
            @change="handleChange"
            :options="options"
        ></a-radio-group>
        <!-- End of Coninuted types -->
        <a-select
            v-if="dataType === 'asyncSelect'"
            style="width: 100%"
            :value="modelValue"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :options="asyncData"
            :loading="loading"
            :disabled="letAsyncSelectDisabled"
            :placeholder="placeholder"
            v-bind="{ ...(multiple ? { mode: 'multiple' } : {}) }"
            @change="handleChange"
        />
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
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import { defineComponent, PropType, ref } from 'vue'
    import UserSelector from '@common/selector/users/index.vue'
    import useAsyncSelector from './useAsyncSelector'

    export default defineComponent({
        components: {
            UserSelector,
        },
        props: {
            modelValue: {
                required: false,
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
            dataType: {
                type: String,
                required: false,
                default(): string {
                    return ''
                },
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
            requestConfig: {
                type: Object,
                require: false,
                default: () => null,
            },
            responseConfig: {
                type: Object,
                require: false,
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
        emits: ['update:modelValue', 'change', 'blur'],
        setup(props) {
            const {
                loadData,
                asyncData,
                loadingData: loading,
                letAsyncSelectDisabled,
            } = useAsyncSelector(
                props.requestConfig,
                props.responseConfig,
                props.valueObject
            )

            // if (props.dataType === 'asyncSelect') {
            //     watch(letAsyncSelectDisabled.value, (v) => {
            //         if (!v) loadData()
            //     })
            // }

            return { loadData, asyncData, loading, letAsyncSelectDisabled }
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
            handleChange(e, timeStamp) {
                let val = e
                if (e?.target) {
                    val = e.target.value
                }
                if (this.dataType === 'number') {
                    this.$emit('update:modelValue', parseInt(val))
                } else if (this.dataType === 'checkbox') {
                    console.log(e)
                    this.$emit('update:modelValue', Array.from(e))
                } else if (
                    this.dataType === 'date' ||
                    this.dataType === 'time'
                ) {
                    this.$emit('update:modelValue', timeStamp)
                } else {
                    this.$emit('update:modelValue', val)
                }
                this.$emit('change', val)
            },
            handleToggleCustom() {
                this.isCustom = !this.isCustom
            },
        },
    })
</script>
