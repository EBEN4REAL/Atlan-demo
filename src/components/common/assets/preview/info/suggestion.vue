<template>
    <div class="px-4 py-2 mx-4 bg-yellow-100 rounded-lg">
        <div
            class="flex items-center justify-between text-sm text-gray-500 text-muted"
        >
            <div class="flex text-gray-500">
                <AtlanIcon
                    icon="Trident"
                    class="pr-1 text-sm text-yellow-500"
                ></AtlanIcon>
                Suggestion
                <AtlanIcon
                    icon="CaretLeft"
                    class="pl-1 hover:text-primary-500"
                    @click="handleNext(-1)"
                    v-if="list.length > 1"
                ></AtlanIcon>
                <AtlanIcon
                    icon="CaretRight"
                    class="hover:text-primary-500"
                    @click="handleNext(1)"
                    v-if="list.length > 1"
                ></AtlanIcon>
            </div>

            <a-button
                shape="round"
                size="small"
                class="mt-1 text-yellow-500 border-yellow-500"
                @click="handleApply"
                v-if="editPermission"
            >
                Apply
            </a-button>
        </div>
        <div class="line-clamp-3">
            {{ list[currentIndex]?.key }}
        </div>
    </div>
</template>

<script lang="ts">
    import { emit } from 'process'
    import {
        defineComponent,
        defineAsyncComponent,
        inject,
        ref,
        toRefs,
    } from 'vue'
    export default defineComponent({
        components: {},
        props: {
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            editPermission: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['apply'],
        setup(props, { emit }) {
            const { list, editPermission } = toRefs(props)

            const currentIndex = ref(0)

            const handleNext = (step) => {
                if (step === 1) {
                    if (currentIndex.value === list.value.length - 1) {
                        currentIndex.value = 0
                    } else {
                        currentIndex.value += 1
                    }
                }
                if (step === -1) {
                    if (currentIndex.value === 0) {
                        currentIndex.value = list.value.length - 1
                    } else {
                        currentIndex.value -= 1
                    }
                }
            }

            const handleApply = () => {
                emit('apply', {
                    key: 'description',
                    value: list.value[currentIndex.value]?.key,
                })
            }

            return {
                list,
                handleNext,
                handleApply,
                editPermission,
                currentIndex,
            }
        },
    })
</script>

<style scoped>
    section {
        padding: 16px 24px;
        background: #f5f5f5;
    }
</style>
