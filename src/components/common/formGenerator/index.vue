<template>
    <span class="grid grid-cols-2">
        <div
            v-for="f in dummy2"
            :key="f.id"
            :class="
                f.type === 'group' || f.type === 'toggle' ? 'col-span-full' : ''
            "
        >
            <template v-if="f.type === 'group'">
                <div class="grid grid-cols-2 p-2 m-2 bg-blue-100 col-span-full">
                    <div class="m-3 font-bold col-span-full">{{ f.title }}</div>
                    <div
                        v-for="c in f.children"
                        :key="c.id"
                        class="p-1 px-4 my-2 ml-5 rounded -yellow-700"
                    >
                        {{ c.label }}
                        <DynamicInput
                            v-model="configObject[f.id]"
                            :data-type="f.type"
                            :placeholder="f.placeholder"
                            :default-value="f.default"
                            :prefix="f.prefix"
                            :suffix="f.suffix"
                        ></DynamicInput>
                    </div>
                </div>
            </template>
            <div v-else-if="f.type === 'button'" class="m-2">
                <a-button @click="generateSring">{{ f.label }}</a-button>
            </div>
            <div v-else-if="f.type === 'toggle'" class="m-2">
                <div class="my-2">{{ f.label }}</div>
                <RadioButton
                    v-model="demoCred.authDemo"
                    :list="f.options"
                ></RadioButton>
            </div>
            <div
                v-else-if="f.conditional"
                class="p-2 m-2 rounded"
                :class="
                    getIdValue(f.conditional.refID) === f.conditional.refValue
                        ? ''
                        : 'bg-red-100 hidden'
                "
            >
                {{ f.label }}
                <DynamicInput
                    v-model="configObject[f.id]"
                    :data-type="f.type"
                    :placeholder="f.placeholder"
                    :default-value="f.default"
                    :prefix="f.prefix"
                    :suffix="f.suffix"
                ></DynamicInput>
            </div>
            <div v-else class="p-2 m-2 rounded">
                {{ f.label }}
                <DynamicInput
                    v-model="configObject[f.id]"
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
    import { defineComponent, reactive, ref, watch } from 'vue'
    import { dummy, dummy2, dummy3 } from './dummy'

    export default {
        name: 'FormBuilder',
        components: { RadioButton, DynamicInput },

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

            const getChildren = (schema) => {
                let children = []
                schema.children.forEach((s) => {
                    if (otherTypes.includes(s.type)) {
                        children = [
                            ...children,
                            ...s.children.map((a) => ({ ...a, parent: s.id })),
                        ]
                    } else {
                        children.push(s.map({ ...s }))
                    }
                })
                return children
            }

            dummy2.forEach((f) => {
                if (!otherTypes.includes(f.type)) {
                    flattenedSchema.value.push(f)
                } else {
                    const res = getChildren(f)
                    console.log({ res })
                    flattenedSchema.value.push(...res)
                }
            })

            const generateSring = () => {
                const s =
                    'xx-jdbc:redshift://{{port}}:asdasd{{port}}/{{database}}-xx'
                const templatePartsf = s.split('{{')
                let finalString = ''
                // ? ->
                templatePartsf.forEach((p, i) => {
                    if (i === 0) {
                        finalString += p
                    } else {
                        const pp = p.split('}}')
                        console.log(pp)
                        finalString += configObject.value[pp[0]] + pp[1]
                    }
                })
                console.log({ finalString })
            }

            const getIdValue = (p) => demoCred.value[p]
            return {
                dummy,
                dummy2,
                dummy3,
                demoCred,
                getIdValue,
                configObject,
                generateSring,
                flattenedSchema,
            }
        },
    }
</script>

<style lang="scss" scoped></style>
