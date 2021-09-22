<template>
    <a-form ref="formRef">
        <a-button @click="validate">Validate</a-button>

        <span class="grid grid-cols-2 gap-x-8">
            <div
                v-for="(f, x) in formModel"
                :key="x"
                :class="!f.isVisible ? 'hidden' : `${getGridClass(f.type)}`"
            >
                <template v-if="f.type === 'group'">
                    <div
                        class="grid grid-cols-2 p-2 mb-5 bg-gray-100 border rounded "
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
                            {{ c.label + c.id }}
                            <a-form-item :name="c.id">
                                <DynamicInput
                                    v-model="c.value"
                                    :data-type="c.type"
                                    :placeholder="c.placeholder"
                                    :default-value="c.default"
                                    :prefix="c.prefix"
                                    :suffix="c.suffix"
                                    :enum-list="c?.options"
                                ></DynamicInput>
                            </a-form-item>
                        </div>
                    </div>
                </template>
                <div v-else-if="f.type === 'toggle'" class="mb-5">
                    <div class="my-2">{{ f.label }}</div>
                    <CustomRadioButton
                        v-model:data="f.value"
                        class="pb-4 border-b"
                        :list="f.options"
                    >
                    </CustomRadioButton>
                </div>
                <div v-else class="mb-5 rounded">
                    {{ f.label + f.id }}
                    <a-form-item :name="f.id">
                        <DynamicInput
                            v-model="f.value"
                            :data-type="f.type"
                            :placeholder="f.placeholder"
                            :default-value="f.default"
                            :prefix="f.prefix"
                            :suffix="f.suffix"
                            :enum-list="f?.options"
                        ></DynamicInput>
                    </a-form-item>
                </div>
            </div>
        </span>
    </a-form>
</template>

<script>
    import DynamicInput from '@common/input/dynamic.vue'
    import { defineComponent, reactive, ref, watch, computed } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import useFormGenerator from './useFormGenerator'
    import { dummy2 } from './dummy'

    export default defineComponent({
        name: 'FormBuilder',
        components: { DynamicInput, CustomRadioButton },

        setup() {
            const formRef = ref()

            const formSchema = ref({})
            const {
                preProcessedSchema: formModel,
                getGridClass,
                finalConfigObject,
                getRules,
                validate,
            } = useFormGenerator(dummy2, formRef)

            formSchema.value = JSON.parse(
                JSON.stringify(finalConfigObject.value)
            )

            return {
                formSchema,
                getRules,
                formRef,
                formModel,
                validate,
                getGridClass,
                finalConfigObject,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
