<template>
    <div
        class="absolute flex flex-col justify-between"
        style="top: 15px; left: 15px"
    >
        <div class="flex items-start justify-end w-full">
            <slot name="left-header-item"></slot>
            <div class="flex items-center justify-end mr-4 graph-controls">
                <!-- Reload Lineage -->
                <button class="lineage-btn" @click="control('reload')">
                    <AtlanIcon icon="Reload" class="w-auto"></AtlanIcon>
                </button>
                <a-divider type="vertical" />

                <!-- Lineage Search -->
                <LineageSearch />
                <a-divider type="vertical" />

                <!-- Lineage Direction and Process -->
                <a-dropdown :trigger="['click']" placement="bottomRight">
                    <a-button
                        class="ant-dropdown-link"
                        @click="(e) => e.preventDefault()"
                    >
                        <AtlanIcon icon="Settings" class="w-auto"></AtlanIcon>
                    </a-button>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item-group title="Direction">
                                <a-menu-item>
                                    <a-radio-group
                                        :value="direction"
                                        @change="
                                            control(
                                                'direction',
                                                $event.target.value
                                            )
                                        "
                                    >
                                        <a-radio
                                            v-for="item in lineageDirections"
                                            :key="item.id"
                                            class="vertical-radio"
                                            :value="item.id"
                                        >
                                            {{ item.label }}
                                        </a-radio>
                                    </a-radio-group>
                                </a-menu-item>
                            </a-menu-item-group>
                            <a-menu-divider />
                            <a-menu-item-group title="">
                                <a-menu-item key="showProcess">
                                    <a-checkbox
                                        :checked="showProcess"
                                        @change="
                                            showProcess = $event.target.checked
                                        "
                                    >
                                        Show Process
                                    </a-checkbox>
                                </a-menu-item>
                            </a-menu-item-group>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-divider type="vertical" />
                <!-- Lineage Depth -->
                <a-select
                    :default-value="depth"
                    style="width: 110px"
                    @change="control('depth', $event)"
                >
                    <a-select-option
                        v-for="item in lineageDepths"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, watch, inject } from 'vue'
    // Components
    import LineageSearch from './lineageSearch.vue'

    export default defineComponent({
        name: 'LineageHeader',
        components: {
            LineageSearch,
        },
        emits: ['showProcess'],
        setup(_, { emit }) {
            const showProcess = ref(false)

            const depth = inject('depth')
            const direction = inject('direction')
            const control: Function = inject('control')

            watch(showProcess, (val) => {
                emit('showProcess', val)
            })

            return {
                depth,
                direction,
                control,
                showProcess,
                lineageDirections: [
                    { id: 'BOTH', label: 'Both Direction' },
                    { id: 'INPUT', label: 'Upstream' },
                    { id: 'OUTPUT', label: 'Downstream' },
                ],
                lineageDepths: [
                    { id: 1, label: 'Depth 1' },
                    { id: 2, label: 'Depth 2' },
                    { id: 3, label: 'Depth 3' },
                    { id: 21, label: 'Maximum' },
                ],
            }
        },
    })
</script>

<style lang="less" scoped>
    @primary: #428bca;
    @gray-600: #000000;

    // Custom
    .graph-controls {
        background-color: #fff;
        border-radius: 4px;
        padding: 0.5rem;
        z-index: 9;
    }

    .vertical-radio {
        display: block;
        height: 30px;
        line-height: 30px;
    }

    .lineage-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        width: 34px;
        outline: none;
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        transition: border-color 300ms ease-in;
        & i {
            margin: auto;
        }
        &:hover {
            border-color: @primary;
        }
        &:focus,
        &:active {
            border-color: @primary;
            box-shadow: 0 0 0 2px lighten(@primary, 30%);
        }
    }

    // Radio and Select
    .toggle,
    .toggler {
        display: inline-block;
        vertical-align: middle;
    }

    .toggler {
        color: @gray-600;
        transition: 0.2s;
        font-weight: bold;
    }

    .toggler--is-active {
        color: @primary;
    }

    .b {
        display: block;
    }

    .toggle {
        position: relative;
        width: 2rem;
        height: 1rem;
        border-radius: 100px;
        background-color: @primary;
        overflow: hidden;
        box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.05);
    }

    .check {
        position: absolute;
        display: block;
        cursor: pointer;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 6;
    }

    .check:checked ~ .switch {
        right: 2px;
        left: 57.5%;
        transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
        transition-property: left, right;
        transition-delay: 0.08s, 0s;
    }

    .switch {
        position: absolute;
        left: 2px;
        top: 2px;
        bottom: 2px;
        right: 57.5%;
        background-color: #fff;
        border-radius: 36px;
        z-index: 1;
        transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
        transition-property: left, right;
        transition-delay: 0s, 0.08s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
</style>

<style lang="less">
    @primary: #428bca;

    //  Ant design
    .ant-select-selection:hover {
        border-color: @primary !important;
    }

    .ant-select-focused .ant-select-selection,
    .ant-select-selection:focus,
    .ant-select-selection:active {
        border-color: @primary !important;
        box-shadow: 0 0 0 2px lighten(@primary, 30%) !important;
    }

    .ant-dropdown-menu-item:hover,
    .ant-dropdown-menu-submenu-title:hover {
        background-color: unset;
    }
</style>
