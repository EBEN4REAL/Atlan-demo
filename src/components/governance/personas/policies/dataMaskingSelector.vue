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

    const maskPersona = [
        {
            value: 'null',
            label: 'None',
            borderBottom: true,
        },
        // {
        //     value: 'MASK_DATE_SHOW_YEAR',
        //     label: 'Show only year',
        //     borderBottom: false,
        //     popover: {
        //         field: 'Date of birth',
        //         value: '24/4/1990',
        //         maskedValue: '01/01/1990',
        //         helpText:
        //             'Show only the year portion of a date string and default the month and day to 01/01',
        //     },
        // },

        {
            value: 'MASK_SHOW_FIRST_4',
            label: 'Show first 4',
            borderBottom: false,
            popover: {
                field: 'Credit card number',
                value: '4321 9876 1254 4444',
                maskedValue: '4312 xxxx xxxx xxxx',
                helpText: 'Shows only the first 4 characters',
            },
        },

        {
            value: 'MASK_SHOW_LAST_4',
            label: 'Show last 4',
            borderBottom: true,
            popover: {
                field: 'Phone number',
                value: '9112349678',
                maskedValue: 'xxxxxx4375',
                helpText: 'Shows only the last 4 characters',
            },
        },
        {
            value: 'MASK_HASH',
            label: 'Hash',
            borderBottom: false,
            popover: {
                field: 'Address',
                value: '123 Los Angeles Street',
                maskedValue: 'f43jknscakc12nk21ak',
                helpText:
                    'Replaces all characters with a hash of entire cell value',
            },
        },
        {
            value: 'MASK_NULL',
            label: 'Nullify',
            borderBottom: false,
            popover: {
                field: 'Age',
                value: '22 years',
                maskedValue: 'NULL',
                helpText: 'Replaces all characters with NULL value',
            },
        },
        {
            value: 'MASK_REDACT',
            label: 'Redact',
            borderBottom: false,
            popover: {
                field: 'Address',
                value: '123 Los Angeles Street',
                maskedValue: 'nnn xxx xxxxxxx xxxxxx',
                helpText:
                    'Masks all alphabetic characters with “x” and all numeric characters with “n”',
            },
        },
    ]
    const maskPurpose = [
        {
            value: 'null',
            label: 'None',
            borderBottom: true,
        },
        // {
        //     value: 'MASK_DATE_SHOW_YEAR',
        //     label: 'Show only year',
        //     borderBottom: false,
        //     popover: {
        //         field: 'Date of birth',
        //         value: '24/4/1990',
        //         maskedValue: '01/01/1990',
        //         helpText:
        //             'Show only the year portion of a date string and default the month and day to 01/01',
        //     },
        // },

        {
            value: 'heka:MASK_SHOW_FIRST_4',
            label: 'Show first 4',
            borderBottom: false,
            popover: {
                field: 'Credit card number',
                value: '4321 9876 1254 4444',
                maskedValue: '4312 xxxx xxxx xxxx',
                helpText: 'Shows only the first 4 characters',
            },
        },

        {
            value: 'heka:MASK_SHOW_LAST_4',
            label: 'Show last 4',
            borderBottom: true,
            popover: {
                field: 'Phone number',
                value: '9112349678',
                maskedValue: 'xxxxxx4375',
                helpText: 'Shows only the last 4 characters',
            },
        },
        {
            value: 'heka:MASK_HASH',
            label: 'Hash',
            borderBottom: false,
            popover: {
                field: 'Address',
                value: '123 Los Angeles Street',
                maskedValue: 'f43jknscakc12nk21ak',
                helpText:
                    'Replaces all characters with a hash of entire cell value',
            },
        },
        {
            value: 'heka:MASK_NULL',
            label: 'Nullify',
            borderBottom: false,
            popover: {
                field: 'Age',
                value: '22 years',
                maskedValue: 'NULL',
                helpText: 'Replaces all characters with NULL value',
            },
        },
        {
            value: 'heka:MASK_REDACT',
            label: 'Redact',
            borderBottom: false,
            popover: {
                field: 'Address',
                value: '123 Los Angeles Street',
                maskedValue: 'nnn xxx xxxxxxx xxxxxx',
                helpText:
                    'Masks all alphabetic characters with “x” and all numeric characters with “n”',
            },
        },
    ]
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
