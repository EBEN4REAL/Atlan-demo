<template>
    <div
        v-if="items.length"
        class="flex flex-col overflow-y-scroll bg-white border rounded-sm shadow-lg  overflow-ellipsis h-52 w-72"
    >
        <a-menu>
            <a-menu-item
                v-for="menuItem in items"
                :key="menuItem.key"
                :class="{
                    'is-active bg-gray-200': isMenuActive(editor, menuItem),
                }"
                @click="() => menuItem.onClick(editor)"
            >
                <AtlanIcon :icon="menuItem.icon" class="w-auto h-4 mb-1 mr-1" />
                {{ menuItem.title }}
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'

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
        },

        data() {
            return {
                selectedCategoryIndex: 0,
                selectedIndex: 0,
            }
        },

        watch: {
            items() {
                this.selectedIndex = 0
                this.selectedCategoryIndex = 0
            },
        },

        methods: {
            onKeyDown({ event }) {
                if (event.key === 'ArrowUp') {
                    this.upHandler()
                    return true
                }

                if (event.key === 'ArrowDown') {
                    this.downHandler()
                    return true
                }

                if (event.key === 'Enter') {
                    this.enterHandler()
                    return true
                }

                return false
            },

            upHandler() {
                if (this.selectedIndex === 0) {
                    this.selectedCategoryIndex -= 1
                    if (this.selectedCategoryIndex === -1) {
                        this.selectedCategoryIndex = this.items.length - 1
                    }
                    this.selectedIndex =
                        this.items[this.selectedCategoryIndex].content.length -
                        1
                } else {
                    this.selectedIndex =
                        (this.selectedIndex +
                            this.items[this.selectedCategoryIndex].content
                                .length -
                            1) %
                        this.items[this.selectedCategoryIndex].content.length
                }
                const selected = document.getElementsByClassName('is-selected')

                if (selected[0]) {
                    selected[0]?.scrollIntoView(false, {
                        behaviour: 'smooth',
                        block: 'nearest',
                    })
                }
            },

            downHandler() {
                if (
                    this.selectedIndex ==
                    this.items[this.selectedCategoryIndex].content.length - 1
                ) {
                    this.selectedCategoryIndex += 1
                    this.selectedIndex = 0
                    if (this.selectedCategoryIndex === this.items.length) {
                        this.selectedCategoryIndex = 0
                    }
                } else {
                    this.selectedIndex =
                        (this.selectedIndex + 1) %
                        this.items[this.selectedCategoryIndex].content.length
                }
                const selected = document.getElementsByClassName('is-selected')
                if (selected[0]) {
                    selected[0]?.scrollIntoView(true, {
                        behaviour: 'smooth',
                        block: 'nearest',
                    })
                }
            },

            enterHandler() {
                this.selectItem(this.selectedCategoryIndex, this.selectedIndex)
            },

            selectItem(categoryIndex, index) {
                const item = this.items[categoryIndex].content[index]

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
        padding: 0.2rem 0.5rem;

        &.is-selected,
        &:hover {
            @apply bg-gray-100;
        }
    }
</style>
