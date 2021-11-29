<template>
    <div
        v-if="items.length"
        class="flex flex-col overflow-y-scroll bg-white border rounded-sm shadow-lg  overflow-ellipsis h-52 w-72"
    >
        <div
            v-for="(category, categoryIndex) in items"
            :key="category.categoryTitle"
        >
            <p
                v-if="category.content.length"
                class="p-2 m-0 ml-2 text-gray-500"
            >
                {{ category.categoryTitle }}
            </p>
            <div
                v-for="(item, index) in category.content"
                :key="item.title"
                class="w-64 item"
                :class="{
                    'is-selected':
                        index === selectedIndex &&
                        categoryIndex === selectedCategoryIndex,
                }"
                @click="selectItem(categoryIndex, index)"
            >
                <div class="flex">
                    <div
                        :class="{
                            'mr-2 border-2': true,
                            'p-2': category.categoryTitle !== 'Highlights',
                            'p-0 flex w-5 h-5':
                                category.categoryTitle === 'Highlights',
                        }"
                    >
                        <fa v-if="item.icon" :icon="item.icon" />
                        <span v-else-if="item.textIcon" class="text-xs">{{
                            item.textIcon
                        }}</span>
                        <span
                            v-else-if="category.categoryTitle === 'Highlights'"
                            class="w-full pl-1 text-xs"
                            :style="`background-color: ${item.color}`"
                            >A</span
                        >
                    </div>
                    <div class="flex flex-col justify-center">
                        <div>{{ item.title }}</div>
                        <div v-if="item.description" class="text-xs text-gray">
                            {{ item.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
