<template>
    <a-select
        placeholder="All connectors"
        v-model:value="localValue"
        :allowClear="true"
        :showSearch="true"
        size="large"
        notFoundContent="No connector found"
        :get-popup-container="(target) => target.parentNode"
        class="search-select"
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

<style lang="less">
    .search-select {
        .ant-select-selector {
            @apply border-0 rounded-lg !important;
            border-top-width: 0px !important;
            border-right-width: 0px !important;
            border-bottom-width: 1px !important;
            border-left-width: 0px !important;
            border-color: rgba(
                243,
                243,
                243,
                var(--tw-border-opacity)
            ) !important;
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
            height: 39px !important;
        }
    }
</style>
