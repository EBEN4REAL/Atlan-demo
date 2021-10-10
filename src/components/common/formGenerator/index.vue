<template>
    <div v-if="error">Error in form config.</div>
    <a-form
        v-else
        :model="valueObject"
        ref="formRef"
        :rules="getRules(formModel)"
    >
        <a-button @click="validate">Validate</a-button>
        <!-- <pre>{{ formModel }}</pre> -->
        <span class="grid grid-cols-2 gap-x-8">
            <div
                v-for="(f, x) in formModel"
                :key="x"
                :class="!f.isVisible ? 'hidden' : `${getGridClass(f.type)}`"
            >
                <template v-if="f.type === 'group'">
                    <div
                        class="
                            grid grid-cols-2
                            p-2
                            mb-5
                            bg-gray-100
                            border
                            rounded
                        "
                    >
                        <div class="m-3 font-bold col-span-full">
                            {{ f.groupTitle }}
                        </div>
                        <div
                            v-for="(c, i) in f.children"
                            :key="c.id"
                            :class="c.isVisible ? '' : 'hidden'"
                            class="p-1 px-4 my-2 rounded"
                        >
                            {{ c.label }}
                            <sup v-if="isRequiredField(c)" class="text-red-600"
                                >*</sup
                            >

                            <a-popover title="Help" v-if="c.helpText">
                                <template #content>
                                    <p class="text-gray-500">
                                        {{ c.helpText }}
                                    </p>
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
                                    :request-config="f?.requestConfig"
                                    :response-config="f?.responseConfig"
                                    :limit-after="c.limitAfter"
                                    :limit-before="c.limitBefore"
                                    v-bind="
                                        c.type === 'asyncSelect'
                                            ? { valueObject }
                                            : {}
                                    "
                                ></DynamicInput>
                            </a-form-item>
                        </div>
                    </div>
                </template>
                <div v-else-if="f.type === 'toggle'" class="mb-5">
                    <div class="my-2">{{ f.label }}</div>
                    <CustomRadioButton
                        v-model:data="valueObject[f.id]"
                        class="pb-4 border-b"
                        :list="f.options"
                    ></CustomRadioButton>
                </div>
                <div v-else class="mb-5 rounded">
                    {{ f.label }}
                    <sup v-if="isRequiredField(f)" class="text-red-600">*</sup>
                    <a-popover title="Help" v-if="f.helpText">
                        <template #content>
                            <p class="text-gray-500">
                                {{ f.helpText }}
                            </p>
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
                            :multiple="f?.isMultivalued"
                            :request-config="f?.requestConfig"
                            :response-config="f?.responseConfig"
                            :limit-after="f.limitAfter"
                            :limit-before="f.limitBefore"
                            v-bind="
                                f.type === 'asyncSelect' ? { valueObject } : {}
                            "
                        ></DynamicInput>
                    </a-form-item>
                </div>
            </div>
        </span>
    </a-form>
</template>

<script>
    import DynamicInput from '@common/input/dynamic.vue'
    import {
        defineComponent,
        reactive,
        ref,
        watch,
        computed,
        toRefs,
    } from 'vue'
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
        setup(props) {
            const formRef = ref()
            const configX = computed(() => props.config)
            const {
                processedSchema: formModel,
                getGridClass,
                finalConfigObject,
                getRules,
                validate,
                testModal: valueObject,
                isRequiredField,
            } = useFormGenerator(configX, formRef)

            return {
                valueObject,
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
