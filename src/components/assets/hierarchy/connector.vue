<template>
    <a-select
        placeholder="Connector"
        v-model:value="localValue"
        :allowClear="true"
        :showSearch="true"
        size="large"
        notFoundContent="No connector found"
        :get-popup-container="(target) => target.parentNode"
        class="connector-select"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="ml-1" />
        </template>
        <template v-for="item in list" :key="item.id">
            <a-select-option :value="item.id" class="flex">
                <div class="flex items-center">
                    <AtlanIcon
                        icon="Glossary"
                        v-if="item.typeName == 'AtlasGlossary'"
                        class="mr-1"
                    ></AtlanIcon>
                    <img :src="item.image" class="w-auto h-4 mr-1" v-else />
                    <span class="">{{ item.label }}</span>
                    <span v-if="showCount" class="ml-1"
                        >({{ item.count }})</span
                    >
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        defineComponent,
        watch,
        ref,
        toRefs,
        computed,
        onMounted,
    } from 'vue'
    import useConnectionData from '~/composables/connection/useConnectionData'
    import { useConnection } from '~/composables/connection/useConnection'
    import { usePersonaStore } from '~/store/persona'
    import GlossaryIcon from '~/assets/images/home/Glossary.svg'
    import useGlossaryStore from '~/store/glossary'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            showCount: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            persona: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { showCount, persona } = toRefs(props)
            const personaStore = usePersonaStore()
            const { sourceList, sourceFilteredList } = useConnectionData()
            const { modelValue } = useVModels(props, emit)

            const glossaryStore = useGlossaryStore()

            watch(persona, () => {
                console.log('watch persona')
                if (!list.value.find((i) => i.id === localValue.value)) {
                    localValue.value = undefined
                }
            })

            const localValue = ref(modelValue.value)
            const applicableConnectionArray = computed(() => {
                const found = personaStore.list.find(
                    (item) => item.id === persona.value
                )
                return found?.metadataPolicies.map((i) => i.connectionId)
            })
            const list = computed(() => {
                let coreList = []

                if (persona.value) {
                    coreList = sourceFilteredList(
                        applicableConnectionArray.value
                    )
                } else {
                    coreList = sourceList
                }

                let temp = coreList

                // temp = temp.concat({
                //     id: '__glossary',
                //     label: 'Glossary',
                //     count: 0,
                //     typeName: 'AtlasGlossary',
                // })

                return temp
            })
            watch(localValue, () => {
                modelValue.value = localValue.value

                emit('change')
            })

            onMounted(() => {
                useConnection()
            })

            return {
                sourceList,
                localValue,
                list,
                sourceFilteredList,
                applicableConnectionArray,
                glossaryStore,
                persona,
            }
        },
    })
</script>

<style lang="less">
    .connector-select {
        .ant-select-selector {
            @apply border-0 rounded-none !important;
            border-top-width: 0px !important;
            border-right-width: 0px !important;
            border-bottom-width: 0px !important;
            border-left-width: 0px !important;
            border-color: rgba(
                243,
                243,
                243,
                var(--tw-border-opacity)
            ) !important;
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
        }
    }
</style>
