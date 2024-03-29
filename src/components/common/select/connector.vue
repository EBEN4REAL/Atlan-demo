<template>
    <a-select
        placeholder="Select a connector"
        v-model:value="localValue"
        :allowClear="true"
        :showSearch="true"
        notFoundContent="No connector found"
        :get-popup-container="(target) => target.parentNode"
        class="bg-white border-0 selector"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" />
        </template>
        <template v-for="item in list" :key="item.id">
            <a-select-option :value="item.id" class="flex">
                <div class="flex items-center">
                    <img :src="item.image" class="w-auto h-4 mr-1" />
                    {{ item.label }}
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
    import AtlanIcon from '@/common/icon/atlanIcon.vue'

    export default defineComponent({
        components: { AtlanIcon },
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
            const localValue = ref(modelValue.value)
            const applicableConnectionArray = computed(() => {
                const found = personaStore.list.find(
                    (item) => item.id === persona.value
                )
                return found?.metadataPolicies.map((i) => i.connectionId)
            })
            const list = computed(() => {
                if (persona.value) {
                    return sourceFilteredList(applicableConnectionArray.value)
                }
                return sourceList
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
            }
        },
    })
</script>

<style lang="less" scoped></style>
