<template>
    <div v-if="error">Error in form config.</div>
    <a-form
        v-else
        ref="formRef"
        :model="valueObject"
        :rules="getRules(formModel)"
    >
        <!-- <a-button @click="validate">Validate</a-button> -->
        <span class="grid grid-cols-2 gap-x-8">
            <div
                v-for="(f, x) in formModel"
                :key="x"
                :class="!f.isVisible ? 'hidden' : `${getGridClass(f.type)}`"
            >
                <template v-if="f.type === 'group'">
                    <a-collapse default-active-key="1">
                        <a-collapse-panel key="1" :header="f.groupTitle">
                            <div class="m-3 font-bold col-span-full">
                                {{ f.groupTitle }}
                            </div>
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

                                <a-popover title="Help" v-if="c.helpText">
                                    <template #content>
                                        <div
                                            class="text-gray-500"
                                            v-html="c.helpText"
                                        ></div>
                                    </template>
                                    <fa
                                        icon="fal info-circle"
                                        class="ml-2 text-xs"
                                    ></fa>
                                </a-popover>
                                <a-form-item :name="c.id">
                                    <DynamicInput
                                        v-model="valueObject[c.id]"
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
                                        :limit-after="c.limitAfter"
                                        :limit-before="c.limitBefore"
                                        :allow-custom="c.allowCustom"
                                        v-bind="
                                            f.type === 'asyncSelect'
                                                ? {
                                                      valueObject,
                                                      allowCreate:
                                                          c?.allowCreate,
                                                      getFormConfig:
                                                          c?.getFormConfig,
                                                      createNewLabel:
                                                          c?.createNewLabel,
                                                  }
                                                : {}
                                        "
                                        @change="handleInputChange"
                                    ></DynamicInput>
                                </a-form-item>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </template>
                <div v-else-if="f.type === 'toggle'" class="mb-5">
                    <div class="my-2">{{ f.label }}</div>
                    <CustomRadioButton
                        v-model:data="valueObject[f.id]"
                        class="pb-4 border-b"
                        :list="f.options"
                        @change="handleInputChange"
                    ></CustomRadioButton>
                </div>
                <div v-else class="mb-5 rounded">
                    {{ f.label }}
                    <sup v-if="isRequiredField(f)" class="text-red-600">*</sup>
                    <a-popover v-if="f.helpText" title="Help">
                        <template #content>
                            <div
                                class="text-gray-500"
                                v-html="f.helpText"
                            ></div>
                        </template>
                        <fa icon="fal info-circle" class="ml-2 text-xs"></fa>
                    </a-popover>
                    <a-form-item :name="f.id">
                        <DynamicInput
                            v-model="valueObject[f.id]"
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
                            :limit-after="f.limitAfter"
                            :limit-before="f.limitBefore"
                            :allow-custom="f.allowCustom"
                            v-bind="
                                f.type === 'asyncSelect'
                                    ? {
                                          valueObject,
                                          allowCreate: f.allowCreate,
                                          getFormConfig: f.getFormConfig,
                                          createNewLabel: f.createNewLabel,
                                      }
                                    : {}
                            "
                            @change="handleInputChange"
                        ></DynamicInput>
                    </a-form-item>
                </div>
                <div v-if="f.type === 'submit'" class="col-span-full">
                    <a-button
                        :loading="submitStatus.loading"
                        @click="handleFormSubmit(f)"
                        >Submit</a-button
                    >
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
</template>

<script>
    import DynamicInput from '@common/input/dynamic.vue'
    import { defineComponent, ref, watch, computed } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import useFormGenerator from './useFormGenerator'

    export default defineComponent({
        name: 'FormBuilder',
        components: { DynamicInput, CustomRadioButton },
        props: {
            config: {
                required: true,
                type: Array,
                default: () => [],
            },
            error: {
                type: Boolean,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const formRef = ref()
            const configX = computed(() => props.config)
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
            } = useFormGenerator(configX, formRef, emit)

            watch(configX, () => {
                init()
            })

            return {
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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
