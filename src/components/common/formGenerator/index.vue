<template>
    <span class="grid grid-cols-2 gap-x-8">
        <div
            v-for="(f, x) in preProcessedSchema"
            :key="x"
            :class="f.isVisible ? `${getGridClass(f.type)}` : 'hidden'"
        >
            <template v-if="f.type === 'group'">
                <div
                    class="grid grid-cols-2 p-2 mb-5 bg-gray-100 border rounded"
                >
                    <div class="m-3 font-bold col-span-full">
                        {{ f.groupTitle }}
                    </div>
                    <div
                        v-for="c in f.children"
                        :key="c.id"
                        :class="c.isVisible ? '' : 'hidden'"
                        class="p-1 px-4 my-2 rounded"
                    >
                        {{ c.label }}
                        <DynamicInput
                            v-model="c.value"
                            :data-type="c.type"
                            :placeholder="c.placeholder"
                            :default-value="c.default"
                            :prefix="c.prefix"
                            :suffix="c.suffix"
                        ></DynamicInput>
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
                {{ f.label }}
                <DynamicInput
                    v-model="f.value"
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
    import DynamicInput from '@common/input/dynamic.vue'
    import { defineComponent, reactive, ref, watch, computed } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import { dummy, dummy2, dummy3 } from './dummy'

    export default {
        name: 'FormBuilder',
        components: { DynamicInput, CustomRadioButton },

        setup() {
            const preProcessedSchema = ref([])
            const otherTypes = ['object', 'array']

            //* expands fields of type group <> flattens it
            const expandAllGroups = (config) => {
                let fields = []
                config.forEach((f) => {
                    if (f.type === 'group') {
                        fields = [...fields, ...f.children]
                    } else {
                        fields.push(f)
                    }
                })
                return fields
            }

            const getValueFromSchemaData = (id) =>
                expandAllGroups(preProcessedSchema.value).find(
                    (s) => s.id === id
                ).value

            // improve this to go deeper than 1 level
            //* expands fields of type object, array <> flattens it
            const getChildren = (schema) => {
                let children = []
                const parent = schema.id
                const parentType = schema.type

                schema.children.forEach((s) => {
                    // only 1 level nested check
                    if (s.type === 'group') {
                        children = [
                            ...children,
                            {
                                ...s,
                                isVisible: true,
                                children: [
                                    ...s.children.map((a) => ({
                                        ...a,
                                        parent,
                                        parentType,
                                        ...(a.default != null
                                            ? { value: a.default }
                                            : {}),
                                    })),
                                ],
                            },
                        ]
                    } else {
                        children.push(
                            s.map({
                                ...s,
                                ...(s.default != null
                                    ? { value: s.default }
                                    : {}),
                            })
                        )
                    }
                })
                return children
            }

            dummy2.forEach((f) => {
                if (!otherTypes.includes(f.type)) {
                    preProcessedSchema.value.push({
                        ...f,
                        ...(f.default != null ? { value: f.default } : {}),
                    })
                } else {
                    preProcessedSchema.value.push(...getChildren(f))
                }
            })

            const generateSring = (s) => {
                if (!preProcessedSchema.value.length) return s
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
                return finalString
            }

            const finalConfigObject = computed(() => {
                const temp = {}
                expandAllGroups(preProcessedSchema.value).forEach((s) => {
                    // ? handle for: if a group is present at root level
                    if (s.type === 'group') {
                        s.children.forEach((gc) => {
                            if (gc.type === 'template') {
                                temp[gc.id] = generateSring(gc.template)
                            } else temp[gc.id] = gc.value
                        })
                        // ? handle for: if parent key exist (i.e value needs to go inside parent)
                    } else if (s.parent) {
                        if (s.parentType === 'object') {
                            temp[s.parent] = { ...(temp[s.parent] || {}) }
                            if (s.type === 'template') {
                                temp[s.parent][s.id] = generateSring(s.template)
                            } else {
                                temp[s.parent][s.id] = s.value
                            }
                        }
                        // * handle for array
                    } else if (s.type === 'template') {
                        temp[s.id] = generateSring(s.template)
                    } else temp[s.id] = s.value
                })
                return temp
            })

            // fix for groups
            const handleConditional = () => {
                preProcessedSchema.value.forEach((f, x) => {
                    if (f.conditional) {
                        const curVal = getValueFromSchemaData(
                            f.conditional.refID
                        )
                        const reqVal = f.conditional.refValue
                        preProcessedSchema.value[x].isVisible =
                            curVal === reqVal
                    }
                })
            }

            const getGridClass = (type) => {
                const fullCol = ['group', 'toggle']
                if (fullCol.includes(type)) return 'col-span-full'
                return ''
            }

            watch(
                preProcessedSchema.value,
                () => {
                    handleConditional()
                },
                { immediate: true }
            )

            return {
                dummy,
                dummy2,
                dummy3,
                getGridClass,
                generateSring,
                preProcessedSchema,
                finalConfigObject,
            }
        },
    }
</script>

<style lang="scss" scoped></style>
