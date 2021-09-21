<template>
    <span class="grid grid-cols-2">
        <div
            v-for="(f, x) in flattenedSchema"
            :key="x"
            :class="f.isVisible ? '' : 'hidden'"
        >
            <template v-if="f.type === 'group'">
                <div class="grid grid-cols-2 p-2 m-2 bg-blue-100 col-span-full">
                    <div class="m-3 font-bold col-span-full">
                        {{ f.title }}
                    </div>
                    <div
                        v-for="c in f.children"
                        :key="c.id"
                        class="p-1 px-4 my-2 ml-5 rounded -yellow-700"
                    >
                        {{ c.label }}
                        <DynamicInput
                            v-model="flattenedSchema[x].value"
                            :data-type="f.type"
                            :placeholder="f.placeholder"
                            :default-value="f.default"
                            :prefix="f.prefix"
                            :suffix="f.suffix"
                        ></DynamicInput>
                    </div>
                </div>
            </template>
            <div v-else-if="f.type === 'toggle'" class="m-2">
                <div class="my-2">{{ f.label }}</div>
                <CustomRadioButton
                    v-model:data="flattenedSchema[x].value"
                    class="pb-4 border-b"
                    :list="f.options"
                >
                </CustomRadioButton>
            </div>
            <div v-else-if="f.type !== 'template'" class="p-2 m-2 rounded">
                {{ f.label }}
                <DynamicInput
                    v-model="flattenedSchema[x].value"
                    :data-type="f.type"
                    :placeholder="f.placeholder"
                    :default-value="f.default"
                    :prefix="f.prefix"
                    :suffix="f.suffix"
                ></DynamicInput>
            </div>
        </div>
    </span>
</template>

<script>
    import RadioButton from '@common/radio/button.vue'
    import DynamicInput from '@common/input/dynamic.vue'
    import { defineComponent, reactive, ref, watch, computed } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import { dummy, dummy2, dummy3 } from './dummy'

    export default {
        name: 'FormBuilder',
        components: { RadioButton, DynamicInput, CustomRadioButton },

        setup() {
            const configObject = ref({})

            const demoCred = ref({ auth: 'basic' })

            dummy2.forEach((f) => {
                if (f.type === 'group') {
                    f.children.forEach((c) => {
                        if (c.type === 'object') {
                            configObject.value[c.id] = {
                                ...(configObject.value[c.id] || {}),
                            }
                            c.children.forEach((nc) => {
                                if (nc.default == null) {
                                    configObject.value[c.id][nc.id] = null
                                } else {
                                    configObject.value[c.id][nc.id] = nc.default
                                }
                            })
                        } else {
                            configObject.value[c.id] =
                                c.default != null ? c.default : null
                        }
                    })
                } else if (f.default == null) {
                    configObject.value[`${f.id}`] = null
                } else {
                    configObject.value[`${f.id}`] = f.default
                }
            })

            const flattenedSchema = ref([])
            const otherTypes = ['object', 'array', 'group']

            const getValueFromSchemaData = (id) =>
                flattenedSchema.value.find((s) => s.id === id).value

            const getChildren = (schema) => {
                let children = []
                schema.children.forEach((s) => {
                    if (otherTypes.includes(s.type)) {
                        children = [
                            ...children,
                            ...s.children.map((a) => ({
                                ...a,
                                parent: s.id,
                                parentType: s.type,
                                ...(a.default ? { value: a.default } : {}),
                            })),
                        ]
                    } else {
                        children.push(
                            s.map({
                                ...s,
                                ...(s.default ? { value: s.default } : {}),
                            })
                        )
                    }
                })
                return children
            }

            dummy2.forEach((f) => {
                if (!otherTypes.includes(f.type)) {
                    flattenedSchema.value.push({
                        ...f,
                        ...(f.default ? { value: f.default } : {}),
                    })
                } else {
                    const res = getChildren(f)
                    console.log({ res })
                    flattenedSchema.value.push(...res)
                }
            })

            const generateSring = (s) => {
                if (!flattenedSchema.value.length) return s
                const templatePartsf = s.split('{{')
                let finalString = ''
                // ? ->
                templatePartsf.forEach((p, i) => {
                    if (i === 0) {
                        finalString += p
                    } else {
                        const pp = p.split('}}')
                        finalString += getValueFromSchemaData(pp[0]) + pp[1]
                    }
                })
                console.log({ finalString })
                return finalString
            }

            const finalConfigObject = computed(() => {
                const temp = {}
                flattenedSchema.value.forEach((s) => {
                    if (s.parent) {
                        if (s.parentType === 'object') {
                            temp[s.parent] = { ...(temp[s.parent] || {}) }
                            if (s.type === 'template') {
                                temp[s.parent][s.id] = generateSring(s.template)
                            } else {
                                temp[s.parent][s.id] = s.value
                            }
                        }
                    }
                    if (s.type === 'template') {
                        temp[s.id] = generateSring(s.template)
                    } else temp[s.id] = s.value
                })
                return temp
            })

            const handleConditional = () => {
                flattenedSchema.value.forEach((f, x) => {
                    if (f.conditional) {
                        const curVal = getValueFromSchemaData(
                            f.conditional.refID
                        )
                        const reqVal = f.conditional.refValue
                        flattenedSchema.value[x].isVisible = curVal === reqVal
                    }
                })
            }

            watch(
                flattenedSchema.value,
                () => {
                    console.log('handleConditional')
                    handleConditional()
                },
                { immediate: true }
            )
            const temp = ref()
            const getIdValue = (p) => demoCred.value[p]
            return {
                temp,
                dummy,
                dummy2,
                dummy3,
                demoCred,
                getIdValue,
                configObject,
                generateSring,
                flattenedSchema,
                finalConfigObject,
            }
        },
    }
</script>

<style lang="scss" scoped></style>
