<template>
    <div class="flex items-center gap-x-1" style="line-height: 1rem">
        <a-cascader
            v-model:value="selectedValue"
            :options="tree"
            expand-trigger="hover"
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
                            class="flex items-center"
                            v-if="selectedValue[0] === 'persona'"
                        >
                            <div class="capitalize">
                                {{ getPersona(selectedValue[1])?.displayName }}
                            </div>
                            <AtlanIcon
                                icon="Lock"
                                class="mb-1 ml-1 h4"
                                v-if="!isAccessPersona(selectedValue[1])"
                            ></AtlanIcon>
                        </div>
                        <div
                            class="flex items-center"
                            v-if="selectedValue[0] === 'purpose'"
                        >
                            <div class="capitalize">
                                {{ getPurpose(selectedValue[1])?.displayName }}
                            </div>
                            <AtlanIcon
                                icon="Lock"
                                class="h-3 ml-1"
                                v-if="!isAccessPurpose(selectedValue[1])"
                            ></AtlanIcon>
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
    import { useAuthStore } from '~/store/auth'
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

            const authStore = useAuthStore()

            const personas = authStore.personas
            const purposes = authStore.purposes

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

                if (!personaStore.list || personaStore.list?.length == 0) {
                    persona.disabled = true
                }

                personaStore.list?.forEach((item) => {
                    persona.children.push({
                        value: item.id,
                        label: capitalizeFirstLetter(item.displayName),
                    })
                })

                persona.children = persona.children.sort(
                    (a, b) =>
                        personas?.findIndex((i) => i.id === b.value) -
                        personas?.findIndex((i) => i.id === a.value)
                )

                temp.push(persona)

                const purpose = {
                    value: 'purpose',
                    label: 'Purpose',
                    children: [],
                }

                if (!purposeStore.list || purposeStore.list?.length == 0) {
                    purpose.disabled = true
                }

                purposeStore.list?.forEach((item) => {
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

            const isAccessPurpose = (id) => {
                if (purposes?.find((i) => i.id === id)) {
                    return true
                }
                return false
            }
            const isAccessPersona = (id) => {
                if (personas.find((i) => i.id === id)) {
                    return true
                }

                return false
            }

            return {
                selectedValue,
                text,

                onChange,
                getPersona,
                tree,
                getPurpose,
                personas,
                purposes,
                isAccessPurpose,
                isAccessPersona,
            }
        },
    })
</script>
