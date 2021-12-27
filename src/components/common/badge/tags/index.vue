<template>
    <div>
        <div v-if="!allowUpdate && !tags.length">-</div>
        <div v-else class="flex flex-wrap gap-1">
            <div v-for="(tag, index) in tags" :key="index">
                <a-tooltip v-if="tag.length > 20" :title="tag">
                    <a-tag
                        :key="tag"
                        :closable="allowUpdate"
                        :class="[
                            updatingTags ? 'text-gray pointer-events-none' : '',
                            customClasses
                        ]"
                        @close="handleClose(tag)"
                    >
                        <slot name="label" :tag="tag">{{ `${tag.slice(0, 20)}...` }}</slot>
                    </a-tag>
                </a-tooltip>
                <a-tag
                    v-else
                    :closable="allowUpdate"
                    :class="[
                        updatingTags ? 'text-gray pointer-events-none' : '',
                        customClasses
                    ]"
                    @close="handleClose(tag)"
                >
                    <slot name="label" :tag="tag">{{ tag }}</slot>
                </a-tag>
            </div>

            <a-input
                v-if="inputVisible"
                ref="inputRef"
                v-model:value="inputValue"
                :disabled="updatingTags"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                @blur="handleInputConfirm"
                @keyup.enter="$event.target.blur()"
            />
            <a-tag
                v-else-if="!updatingTags && allowUpdate"
                :class="customClasses"
                @click="showInput"
            >
                + Add
            </a-tag>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        reactive,
        toRefs,
        nextTick,
        watch,
        computed,
    } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            tags: {
                type: Array,
                default: () => [
                    'Unremovable',
                    'Tag 2',
                    'Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3',
                ],
            },
            updatingTags: {
                type: Boolean,
                default: false,
            },
            allowUpdate: {
                type: Boolean,
                default: false,
            },
            icon: {
                type: String,
                default: "",
            },
            customClasses: {
                type: String,
                required: false,
                default: () => "bg-gray-100"
            }
        },
        emits: ['updateTags'],
        setup(props, context) {
            const inputRef = ref()
            const defaultTags = computed(() => props.tags)
            const state = reactive({
                tags: defaultTags,
                inputVisible: false,
                inputValue: '',
            })
            const icon = ref(props.icon)
            const handleClose = (removedTag: string) => {
                const tags = state.tags.filter((tag) => tag !== removedTag)
                console.log(tags)
                state.tags = tags
                Object.assign(state, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                })
                context.emit('updateTags', removedTag, 'remove')
            }

            const showInput = () => {
                state.inputVisible = true
                nextTick(() => {
                    inputRef.value.focus()
                })
            }

            const handleInputConfirm = () => {
                if (state.inputValue) {
                    const { inputValue } = state
                    let { tags } = state
                    if (inputValue && tags.indexOf(inputValue) === -1) {
                        tags = [...tags, inputValue]
                    }
                    console.log(tags)
                    context.emit('updateTags', inputValue)
                    watch(
                        () => props.updatingTags,
                        (newValue) => {
                            if (!newValue)
                                Object.assign(state, {
                                    tags,
                                    inputVisible: false,
                                    inputValue: '',
                                })
                        }
                    )
                } else {
                    state.inputVisible = false
                    state.inputValue = ''
                }
            }
            return {
                ...toRefs(state),
                handleClose,
                showInput,
                handleInputConfirm,
                inputRef,
                icon
            }
        },
    })
</script>
