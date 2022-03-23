<template>
    <a-dropdown :trigger="['click']">
        <AtlanIcon
            icon="KebabMenuHorizontal"
            class="w-4 h-4 pl-2 my-auto text-gray-500 outline-none"
            style="min-width: 16px"
        />
        <template #overlay>
            <a-menu>
                <a-menu-item
                    class="rounded-lg"
                    v-for="(option, index) in dropdownOptions"
                    :key="index"
                    @click="() => handleMenuItemClick({ index, ...option })"
                >
                    <div
                        class="flex items-center h-8"
                        :class="option.class"
                        :data-test-id="option?.title?.toLowerCase()"
                    >
                        <div class="-mt-0.5">
                            <AtlanIcon
                                v-if="option.icon"
                                :icon="option.icon"
                                class="w-4 h-4 my-auto mr-1.5"
                            ></AtlanIcon>
                        </div>
                        <span class="text-sm">{{ option.title }}</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        inject,
        Ref,
        ref,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            dropdownOptions: {
                type: Object as PropType<Record<string, any>>,
                required: true,
            },
        },
        setup(props) {
            const { dropdownOptions } = toRefs(props)
            const handleMenuItemClick = (option: any) => {
                option.handleClick()
            }
            return { dropdownOptions, handleMenuItemClick }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
