<template>
    <div
        v-if="items.length"
        id="slash-command-menu"
        ref="menuRef"
        class="flex flex-col py-1 bg-white border rounded shadow-xl border-gray-light max-h-72 overflow-y-auto w-64"
    >
        <ul class="h-full">
            <li
                v-for="(menuItem, index) in items.filter(
                    (item) => !item.disabled(editor)
                )"
                ref="buttonRefs"
                :key="menuItem.key"
                class="item"
                :class="{ 'is-selected': index === selectedIndex }"
                @click="selectItem(index)"
            >
                <div class="flex content-center items-center">
                    <span>
                        <AtlanIcon
                            :icon="menuItem.icon"
                            class="h-5 mb-1 mr-1"
                        />
                    </span>
                    <span class="ml-2 text-gray-700">
                        <p class="font-bold">{{ menuItem.title }}</p>
                        <small class="text-gray-500">
                            {{ menuItem.helpText }}
                        </small>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { defineComponent, nextTick } from 'vue'
    import { Editor } from '@tiptap/vue-3'
    import scrollIntoView from 'smooth-scroll-into-view-if-needed'

    export default defineComponent({
        props: {
            items: {
                type: Array,
                required: true,
            },
            command: {
                type: Function,
                required: true,
            },
            editor: {
                type: Editor,
                required: true,
            },
        },

        data() {
            return {
                selectedIndex: 0,
                buttonRefs: [],
                menuRef: null,
            }
        },

        watch: {
            items() {
                this.selectedIndex = 0
            },
        },

        methods: {
            scrollSelectedOptionIntoView() {
                const selectedOption = this.$refs.buttonRefs.find((button) =>
                    button.classList.contains('is-selected')
                )
                scrollIntoView(selectedOption, {
                    behavior: 'smooth',
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    boundary: (parent) => parent.id !== this.$refs.menuRef.id,
                })
            },

            onKeyDown({ event }) {
                if (event.key === 'ArrowUp') {
                    this.upHandler()
                    nextTick(() => this.scrollSelectedOptionIntoView())
                    return true
                }

                if (event.key === 'ArrowDown') {
                    this.downHandler()
                    nextTick(() => this.scrollSelectedOptionIntoView())
                    return true
                }

                if (event.key === 'Enter') {
                    this.enterHandler()
                    return true
                }

                return false
            },

            upHandler() {
                this.selectedIndex =
                    (this.selectedIndex + this.items.length - 1) %
                    this.items.length
            },

            downHandler() {
                this.selectedIndex =
                    (this.selectedIndex + 1) % this.items.length
            },

            enterHandler() {
                this.selectItem(this.selectedIndex)
            },

            selectItem(index) {
                const item = this.items[index]

                if (item) {
                    this.command(item)
                }
            },
        },
    })
</script>

<style lang="less" scoped>
    .items {
        position: relative;
    }

    .item {
        display: block;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        padding: 5px 12px;

        &:hover {
            @apply bg-gray-100;
        }
        &.is-selected {
            @apply bg-gray-200 text-gray-700 !important;
        }
    }
</style>
