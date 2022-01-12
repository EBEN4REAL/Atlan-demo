<template>
    <a-select
        :value="maskType"
        class="mb-6 w-80"
        data-test-id="datamasking-select"
        @update:value="$emit('update:maskType', $event)"
    >
        <a-select-option
            v-for="opt in maskingOptions"
            :key="opt.value"
            :value="opt.value"
            :class="opt.borderBottom ? 'border-b border-gray-300' : ''"
            :label="opt.label"
        >
            <a-tooltip
                v-if="opt.popover"
                overlay-class-name="tooltip_option"
                :overlay-style="{ maxWidth: '380px', width: 'auto' }"
                placement="right"
                color="white"
            >
                <template #title>
                    <div>
                        <div class="flex items-center p-3 gap-x-2 text-gray">
                            <div
                                class="border border-gray-300 rounded"
                                style="width: 150px"
                            >
                                <div
                                    class="p-3 text-xs font-bold text-gray-500 border-b"
                                >
                                    {{ opt.popover?.field }}
                                </div>
                                <div class="p-3 text-xs text-gray-700">
                                    {{ opt.popover.value }}
                                </div>
                            </div>
                            <AtlanIcon icon="ArrowRight" />
                            <div
                                class="rounded light-border"
                                style="width: 150px"
                            >
                                <div
                                    class="p-3 text-xs font-bold text-gray-500 border-b-light bg-primary-light"
                                >
                                    {{ opt.popover?.field }}
                                </div>
                                <div class="p-3 text-xs text-gray-700">
                                    {{ opt.popover.maskedValue }}
                                </div>
                            </div>
                        </div>
                        <p class="p-3 m-0 text-sm font-bold text-gray-500">
                            {{ opt.popover.helpText }}
                        </p>
                    </div>
                </template>
                <span class="block">{{ opt.label }}</span>
            </a-tooltip>
            <span v-else>{{ opt.label }}</span>
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import { maskPersona, maskPurpose } from '~/constant/policy'

    export default defineComponent({
        name: 'DataMaskingSelector',
        components: {},
        props: {
            maskType: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
        emits: ['update:maskType'],
        setup(props) {
            const v = ref(true)
            const { type } = toRefs(props)
            // FIXME: Take it out to a config file
            const maskingOptions =
                type.value === 'purpose' ? maskPurpose : maskPersona
            return {
                v,
                maskingOptions,
            }
        },
    })
</script>

<style lang="less" scoped>
    .light-border {
        border: 1px solid #bdcdf4;
    }
    .border-b-light {
        border-bottom: 1px solid #bdcdf4;
    }
</style>
