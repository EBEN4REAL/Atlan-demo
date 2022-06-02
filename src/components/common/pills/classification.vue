<template>
    <div
        class="flex items-center py-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer group"
        :data-test-id="displayName"
        :class="noHover ? '' : 'pl-2 pr-2 hover:text-white'"
        :style="`background-color: ${bgHover}!important;`"
        @mouseenter="
            () => {
                if (!noHover) {
                    mouseEnter = true
                }
            }
        "
        @mouseleave="
            () => {
                mouseEnter = false
            }
        "
    >
        <ClassificationIcon
            :icon="icon"
            :color="shieldColour"
            :mouse-enter="mouseEnter"
        />

        <div class="ml-1 truncate overflow-ellipsis">
            {{ displayName || name }}
        </div>
        <a-popconfirm
            :title="`Are you sure you want to remove ${displayName}?`"
            :visible="visible"
            ok-text="Remove"
            cancel-text="Cancel"
            :overlay-class-name="$style.classificationDeletePopover"
            
            @visible-change="handleVisibleChange"
            >
            <template #cancelButton>
                <AtlanBtn
                    :color="'minimal'"
                    size="sm"
                    padding="compact"
                    @click="() => visible = false"
                >
                    {{ $t('Cancel') }}
                    
                </AtlanBtn>
            </template>
            <template #okButton>
                <AtlanBtn
                    :color="'primary'"
                    size="sm"
                    padding="compact"
                    @click="handleRemove"
                >
                    {{ $t('Remove') }}
                </AtlanBtn>
            </template>
            <div
                v-if="allowDelete"
                class="flex"
                @click="
                    (e) => {
                        e.stopPropagation()
                        confirmDelete()
                    }
                "
            >
                <AtlanIcon
                    icon="Cross"
                    class="h-3 ml-2 text-gray-500 group-hover:text-white"
                ></AtlanIcon>
            </div>
        </a-popconfirm>
        
    </div>
</template>

<script lang="ts">
    import { toRefs, computed, unref, ref, defineComponent } from 'vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        components: { ClassificationIcon , AtlanBtn},
        props: {
            guid: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: '',
            },
            displayName: {
                type: String,
                default: '',
            },
            isPropagated: {
                type: Boolean,
                default() {
                    return false
                },
            },
            color: {
                type: String,
                required: false,
                default: 'Blue',
            },
            allowDelete: {
                type: Boolean,
                default() {
                    return false
                },
            },
            noHover: {
                type: Boolean,
                default() {
                    return false
                },
            },
            createdBy: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const {
                name,
                displayName,
                color,
                createdBy,
                isPropagated,
                noHover,
            } = toRefs(props)
            const originalColour = ref(unref(color).toLowerCase())

            const mouseEnter = ref(false)

            const visible = ref<boolean>(false);

            const handleVisibleChange = (bool: boolean) => {
                if (!bool) {
                    visible.value = false;
                }
            };

            const handleRemove = () => {
                visible.value = false
                emit('delete', name.value)
            }

            const confirmDelete = () => {
                visible.value = true
            }

            const bgColor = computed(() =>
                mouseEnter.value ? originalColour.value : 'white'
            )
            const shieldColour = computed(() =>
                mouseEnter.value ? 'white' : originalColour.value
            )
            const icon = computed(() => {
                if (isPropagated.value) {
                    return 'ClassificationPropagated'
                }
                return 'ClassificationShield'
            })

           

            const toggleColor = () => {
                bgColor.value =
                    bgColor.value === 'white' ? originalColour.value : 'white'
            }

            const bgHover = computed(() => {
                if (noHover.value) {
                    return 'transparent'
                }
                return getClassificationColorHex(bgColor.value)
            })

            return {
                name,
                displayName,
                handleRemove,
                color,
                bgHover,
                originalColour,
                shieldColour,
                bgColor,
                toggleColor,
                icon,
                mouseEnter,
                visible,
                handleVisibleChange,
                confirmDelete
            }
        },
    })
</script>

<style lang="less" module>
    .classificationDeletePopover {
        :global(.ant-popover-inner) {
            @apply px-3 py-3 !important;
        }
        :global(.ant-popover-buttons) {
            @apply flex justify-end;
        }
    }
</style>
