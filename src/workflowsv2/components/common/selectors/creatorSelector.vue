<template>
    <div
        class="box-border flex items-stretch h-8 overflow-hidden border border-gray-300 divide-x divide-gray-300 rounded"
    >
        <button
            class="tabbed-btn"
            :class="selected === 'me' ? 'fake-bold selected' : ''"
            @click="handleSelect('me', { ownerUsers: [username] })"
        >
            My workflows
        </button>
        <a-popover :trigger="['click']" placement="bottomLeft">
            <template #content>
                <div class="w-64 py-3">
                    <UserSelector
                        :modelValue="value"
                        :showNone="false"
                        :enableTabs="['users']"
                        hideDisabledTabs
                        multiple
                        @change="handleSelect('other', $event)"
                    />
                </div>
            </template>
            <button
                class="tabbed-btn"
                :class="
                    selected === 'other'
                        ? 'fake-bold selected'
                        : 'text-gray-500'
                "
            >
                <span>
                    Created by {{ getUserString }}
                    <AtlanIcon
                        v-if="selected === 'other' && value?.ownerUsers?.length"
                        class="h-3 ml-1 text-gray-500 hover:text-gray"
                        icon="Cancel"
                        @click="reset('other')"
                    />
                    <AtlanIcon v-else icon="CaretDown" class="ml-1" />
                </span>
            </button>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import whoami from '~/composables/user/whoami'
    import UserSelector from '@/common/facet/owners/index.vue'

    export default defineComponent({
        name: 'CreatorSelector',
        components: { UserSelector },
        props: {
            value: {
                type: Object,
                required: false,
                default: () => {
                    ownerUsers: []
                },
            },
        },
        emits: ['update:value'],
        setup(props, { emit }) {
            const { value } = toRefs(props)
            const { username } = whoami()
            const selected = ref(undefined)

            const getUserString = computed(() => {
                const userLength = value.value?.ownerUsers?.length
                if (selected.value === 'other') {
                    if (userLength)
                        return userLength > 1
                            ? `${userLength} people`
                            : value.value?.ownerUsers[0]
                    else return 'all users'
                }
                return ''
            })

            const reset = (sel) => {
                emit('update:value', { ownerUsers: [] })
                selected.value = undefined
            }
            const handleSelect = (sel, val) => {
                if (sel === 'me' && sel === selected.value) reset(sel)
                else {
                    emit('update:value', val)
                    selected.value = sel
                }
            }

            return {
                selected,
                handleSelect,
                username,
                reset,
                getUserString,
            }
        },
    })
</script>

<style lang="less" scoped>
    .tabbed-btn {
        @apply box-border;
        @apply transition-colors;
        @apply outline-none;
        @apply px-3;
        @apply bg-white text-gray;

        &:hover:not(:disabled) {
            background-color: #f8f8f8;
        }

        &.selected {
            @apply bg-primary-light;
            @apply text-primary;
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }
    }
</style>
