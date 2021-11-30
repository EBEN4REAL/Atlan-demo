<template>
    <!-- <div> -->
    <!-- <div v-if="error || errorCaptured">
        {{ errorCaptured }} -->

    <!-- <Suspense>
        <template #fallback>
          loading....
        </template>
        <template #default> -->
    <a-form ref="formRef" :model="valueObject" :rules="getRules">
        <span class="grid grid-cols-2 gap-x-8">
            <div
                v-for="(f, x) in formModel"
                :key="x"
                :class="!f.isVisible ? 'hidden' : `${getGridClass(f.type)}`"
            >
                <template v-if="f.type === 'group'">
                    <a-collapse default-active-key="1">
                        <a-collapse-panel key="1" :header="f.groupTitle">
                            <div
                                v-for="(c, i) in f.children"
                                :key="c.id"
                                :class="c.isVisible ? '' : 'hidden'"
                                class="p-1 px-4 mt-2"
                            >
                                {{ c.label }}
                                <sup
                                    v-if="isRequiredField(c)"
                                    class="text-red-600"
                                    >*</sup
                                >

                                <a-popover v-if="c.helpText">
                                    <template #content>
                                        <div
                                            class="p-3 text-gray-500"
                                            v-html="c.helpText"
                                        ></div>
                                    </template>
                                    <AtlanIcon
                                        icon="Info"
                                        class="inline-block mb-1"
                                    />
                                </a-popover>
                                <a-form-item :name="c.id">
                                    <DynamicInput
                                        v-model="valueObject[c.id]"
                                        :form-type="c.type"
                                        :data-type="c.type"
                                        :date-time-type="c.dateTimeType"
                                        :placeholder="c.placeholder"
                                        :default-value="c.default"
                                        :prefix="c.prefix"
                                        :suffix="c.suffix"
                                        :enum-list="c?.options"
                                        :multiple="c?.isMultivalued"
                                        :request-config="c?.requestConfig"
                                        :response-config="c?.responseConfig"
                                        :other-api-config="{
                                            req: c?.requestConfig_2,
                                            res: c?.responseConfig_2,
                                        }"
                                        :limit-after="c.limitAfter"
                                        :limit-before="c.limitBefore"
                                        :allow-custom="c.allowCustom"
                                        :value-object="valueObject"
                                        :accept="c.accept"
                                        v-bind="
                                            c.type === 'asyncSelect'
                                                ? {
                                                      allowCreate:
                                                          c?.allowCreate,
                                                      getFormConfig:
                                                          c?.getFormConfig,
                                                      createNewLabel:
                                                          c?.createNewLabel,
                                                      globalVariables:
                                                          c?.saveVariables,
                                                  }
                                                : {}
                                        "
                                        @change="handleInputChange"
                                        @getGlobal="setGlobal"
                                    />
                                </a-form-item>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </template>
                <div v-else-if="f.type === 'toggle'" class="mb-5">
                    <div class="my-2">{{ f.label }}</div>
                    <CustomRadioButton
                        v-model="valueObject[f.id]"
                        :form-type="f.type"
                        class="pb-4 border-b"
                        :list="f.options"
                        @change="handleInputChange"
                    ></CustomRadioButton>
                </div>
                <div v-else class="mb-5 rounded">
                    {{ f.label }}
                    <sup v-if="isRequiredField(f)" class="text-red-600">*</sup>
                    <a-checkbox
                        v-if="f.allowIncludeAll"
                        v-model:checked="f.includeAll"
                        @change="handleInputChange"
                    >
                        Include All
                    </a-checkbox>
                    <a-popover v-if="f.helpText">
                        <template #content>
                            <div
                                class="p-3 text-gray-500"
                                v-html="f.helpText"
                            ></div>
                        </template>
                        <AtlanIcon icon="Info" class="inline-block mb-1" />
                    </a-popover>
                    <a-form-item :name="f.id">
                        <DynamicInput
                            v-model="valueObject[f.id]"
                            :disabled="f.includeAll"
                            :data-type="f.type"
                            :date-time-type="f.dateTimeType"
                            :placeholder="f.placeholder"
                            :default-value="f.default"
                            :prefix="f.prefix"
                            :suffix="f.suffix"
                            :enum-list="f?.options"
                            :options="f?.options"
                            :multiple="f?.isMultivalued"
                            :request-config="f?.requestConfig"
                            :response-config="f?.responseConfig"
                            :other-api-config="{
                                req: f?.requestConfig_2,
                                res: f?.responseConfig_2,
                            }"
                            :accept="f.accept"
                            :limit-after="f.limitAfter"
                            :limit-before="f.limitBefore"
                            :allow-custom="f.allowCustom"
                            :value-object="valueObject"
                            v-bind="
                                f.type === 'asyncSelect'
                                    ? {
                                          allowCreate: f.allowCreate,
                                          getFormConfig: f.getFormConfig,
                                          createNewLabel: f.createNewLabel,
                                          globalVariables: f?.saveVariables,
                                      }
                                    : {}
                            "
                            @change="handleInputChange"
                            @getGlobal="setGlobal"
                        ></DynamicInput>
                    </a-form-item>
                </div>
                <div v-if="f.type === 'submit'" class="col-span-full">
                    <a-button
                        :loading="submitStatus.loading"
                        @click="handleFormSubmit(f)"
                    >
                        Submit
                    </a-button>
                    <p v-if="submitStatus.error" class="text-red-600">
                        {{ submitStatus.errorMessage }}
                    </p>
                    <p v-if="submitStatus.success" class="text-green-600">
                        {{ submitStatus.successMessage || 'success' }}
                    </p>
                </div>
            </div>
        </span>
    </a-form>
    <!-- </div> -->
    <!-- </template>
    </Suspense>
    </div> -->
</template>

<script>
    import {
        defineComponent,
        ref,
        watch,
        computed,
        toRefs,
        defineAsyncComponent,
        // onErrorCaptured,
        // Suspense,
    } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import DynamicInput from '~/components/common/input/dynamicInput.vue'
    import useFormGenerator from './useFormGenerator'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            DynamicInput,
            CustomRadioButton,
            // Suspense,
        },
        props: {
            config: {
                required: true,
                type: Array,
                default: () => [],
            },
            error: {
                type: Boolean,
            },
            defaultValues: {
                type: Object,
                required: false,
                default: () => {},
            },
            globalValues: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['change', 'vchange', 'captureError'],
        setup(props, { emit }) {
            const formRef = ref()
            const configX = computed(() => props.config)
            // const errorCaptured = ref(null)
            const { defaultValues } = toRefs(props)
            const {
                processedSchema: formModel,
                getGridClass,
                handleInputChange,
                submitStatus,
                getRules,
                validate,
                testModal: valueObject,
                isRequiredField,
                handleFormSubmit,
                init,
                setGlobal,
            } = useFormGenerator(
                configX,
                formRef,
                emit,
                defaultValues,
                props.globalValues
            )

            watch(configX, () => {
                init()
                formRef.value.resetFields()
            })
            // onErrorCaptured((e) => {
            //     console.log('>>>>', e)
            //     errorCaptured.value = e
            // })
            return {
                setGlobal,
                handleFormSubmit,
                init,
                handleInputChange,
                valueObject,
                submitStatus,
                getRules,
                formRef,
                formModel,
                validate,
                getGridClass,
                isRequiredField,
                // errorCaptured,
            }
        },
    })
</script>

<style lang="less">
    .link {
        @apply text-blue-500;
    }
</style>
