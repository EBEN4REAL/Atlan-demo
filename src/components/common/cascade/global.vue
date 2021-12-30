<template>
    <div class="flex items-center gap-x-1" style="line-height: 1rem">
        <a-cascader
            v-model:value="selectedValue"
            :options="tree"
            :showSearch="true"
            @change="onChange"
        >
            <a href="#" class="flex">
                <div
                    class="flex items-center text-sm font-semibold cursor-pointer hover:text-primary"
                    v-if="selectedValue.length > 0"
                >
                    <div class="" v-if="selectedValue.length === 1">
                        All Assets
                    </div>
                    <div
                        v-else-if="selectedValue.length == 2"
                        class="flex items-center"
                    >
                        <div v-if="selectedValue[0] === 'persona'">Persona</div>
                        <div v-if="selectedValue[0] === 'purpose'">Purpose</div>
                        <AtlanIcon icon="ChevronRight" class="mx-1" />

                        <div
                            class="capitalize"
                            v-if="selectedValue[0] === 'persona'"
                        >
                            {{ getPersona(selectedValue[1])?.displayName }}
                        </div>
                        <div
                            class="capitalize"
                            v-if="selectedValue[0] === 'purpose'"
                        >
                            {{ getPurpose(selectedValue[1])?.displayName }}
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="text-base font-semibold cursor-pointer text-primary"
                >
                    Change
                </div>
            </a>
        </a-cascader>
    </div>
</template>
<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, ref, computed } from 'vue'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'
    import { capitalizeFirstLetter } from '~/utils/string'
    interface Option {
        value: string
        label: string
        children?: Option[]
        code?: number
        [key: string]: any
    }

    export default defineComponent({
        props: {
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const personaStore = usePersonaStore()

            const purposeStore = usePurposeStore()

            const text = ref<string[]>([])

            const selectedValue = ref(modelValue.value)

            const tree = computed(() => {
                const temp = [
                    {
                        value: 'all',
                        label: 'All Assets',
                        children: [],
                    },
                ]

                const persona = {
                    value: 'persona',
                    label: 'Persona',
                    children: [],
                }
                personaStore.list.forEach((item) => {
                    persona.children.push({
                        value: item.id,
                        label: capitalizeFirstLetter(item.displayName),
                    })
                })
                temp.push(persona)

                const purpose = {
                    value: 'purpose',
                    label: 'Purpose',
                    children: [],
                }

                purposeStore.list.forEach((item) => {
                    purpose.children.push({
                        value: item.id,
                        label: capitalizeFirstLetter(item.displayName),
                    })
                })
                temp.push(purpose)
                return temp
            })

            const onChange = (value: string, selectedOptions: Option[]) => {
                modelValue.value = value
                emit('change')
            }

            const getPersona = (id) =>
                personaStore.list.find((item) => item.id === id)

            const getPurpose = (id) =>
                purposeStore.list.find((item) => item.id === id)

            return {
                selectedValue,
                text,

                onChange,
                getPersona,
                tree,
                getPurpose,
            }
        },
    })
</script>
