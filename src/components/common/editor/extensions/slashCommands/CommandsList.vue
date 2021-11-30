<template>
    <div
        v-if="items.length"
        class="flex flex-col py-1 bg-white border rounded shadow-xl  border-gray-light"
    >
        <div class="items">
            <button
                v-for="(menuItem, index) in items"
                :key="menuItem.key"
                class="item"
                :class="{ 'is-selected': index === selectedIndex }"
                @click="selectItem(index)"
            >
                <AtlanIcon :icon="menuItem.icon" class="w-auto h-4 mb-1 mr-1" />
                {{ menuItem.title }}
            </button>
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
                selectedIndex: 0,
            }
        },

        watch: {
            items() {
                this.selectedIndex = 0
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
