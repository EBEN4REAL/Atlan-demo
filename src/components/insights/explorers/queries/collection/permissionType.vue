<template>
    <a-menu style="width: 217px" :selectedKeys="[selectedType]">
        <a-menu-item
            key="view"
            class="hover:bg-gray-100"
            :class="
                selectedType === 'view'
                    ? 'bg-primary-light hover:bg-primary-light'
                    : 'bg-white'
            "
            @click="handleChange('view', item)"
        >
            <div class="flex items-center justify-between">
                <div>
                    <div>
                        <span class="text-sm text-gray-700">Can view</span>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500"
                            >Can view and run all <br />the queries, but not
                            edit</span
                        >
                    </div>
                </div>
                <AtlanIcon
                    v-if="selectedType === 'view'"
                    icon="Check"
                    class="text-primary"
                />
            </div>
        </a-menu-item>
        <a-menu-item
            key="edit"
            class="hover:bg-gray-100"
            :class="[
                selectedType === 'edit'
                    ? 'bg-primary-light hover:bg-primary-light'
                    : 'bg-white',
            ]"
            @click="handleChange('edit', item)"
        >
            <div class="flex items-center justify-between">
                <div>
                    <div>
                        <span class="text-sm text-gray-700">Can edit</span>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500"
                            >Can view, run and edit all <br />
                            queries</span
                        >
                    </div>
                </div>
                <AtlanIcon
                    v-if="selectedType === 'edit'"
                    icon="Check"
                    class="text-primary"
                />
            </div>
        </a-menu-item>
        <a-menu-item
            key="remove"
            class="bg-white hover:bg-gray-100"
            v-if="showRemove"
            @click="handleChange('remove', item)"
        >
            <div class="flex items-center justify-between">
                <div>
                    <span class="text-sm" style="color: #d21919">Remove</span>
                </div>
            </div>
        </a-menu-item>
    </a-menu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'CreateCollectionModal',
        components: {
            AtlanIcon,
        },
        props: {
            showRemove: {
                type: Boolean,
                default: false,
                required: false,
            },
            handleChange: {
                type: Function,
                required: true,
            },
            selectedType: {
                type: String,
                required: true,
            },
            item: {
                type: Object,
                required: false,
                default: null,
            },
        },
        setup(props, { emit }) {
            return {}
        },
    })
</script>
<style lang="less" scoped></style>

<style lang="less"></style>

<style lang="less" module></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
