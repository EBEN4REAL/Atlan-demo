<template>
    <a-select
        :value="maskingOption"
        class="mb-6 w-80"
        @update:value="$emit('update:maskingOption', $event)"
    >
        <a-select-option
            v-for="opt in maskingOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
        >
            <a-tooltip
                v-if="opt.popover"
                overlayClassName="tooltip_option"
                :overlayStyle="{ maxWidth: '380px', width: 'auto' }"
                placement="right"
                color="white"
            >
                <template #title>
                    <div class="">
                        <div class="flex items-center p-3 gap-x-2 text-gray">
                            <a-card
                                size="small"
                                :title="opt.popover?.field"
                                style="width: 150px"
                            >
                                {{ opt.popover.value }}
                            </a-card>
                            <AtlanIcon icon="ArrowRight" />
                            <a-card
                                size="small"
                                :title="opt.popover?.field"
                                style="width: 150px"
                            >
                                {{ opt.popover.maskedValue }}
                            </a-card>
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
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        name: 'DataMaskingSelector',
        components: {},
        props: {
            maskingOption: {
                type: String,
                required: true,
            },
        },
        emits: ['update:maskingOption'],
        setup() {
            const v = ref(true)
            // FIXME: Take it out to a config file
            const maskingOptions = [
                {
                    value: 'MASK_NONE',
                    label: 'None',
                },
                {
                    value: 'MASK_DATE_SHOW_YEAR',
                    label: 'Show only year',
                    popover: {
                        field: 'Date of birth',
                        value: '24/4/1990',
                        maskedValue: '01/01/1990',
                        helpText:
                            'Show only the year portion of a date string and default the month and day to 01/01',
                    },
                },
                {
                    value: 'MASK_SHOW_LAST_4',
                    label: 'Show last 4',
                    popover: {
                        field: 'Phone number',
                        value: '9112349678',
                        maskedValue: 'xxxxxx4375',
                        helpText: 'Shows only the last 4 characters',
                    },
                },
                {
                    value: 'MASK_SHOW_FIRST_4',
                    label: 'Show first 4',
                    popover: {
                        field: 'Credit card number',
                        value: '4321 9876 1254 4444',
                        maskedValue: '4312 xxxx xxxx xxxx',
                        helpText: 'Shows only the first 4 characters',
                    },
                },
                {
                    value: 'MASK_HASH',
                    label: 'Hash',
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
                    popover: {
                        field: 'Address',
                        value: '123 Los Angeles Street',
                        maskedValue: 'nnn xxx xxxxxxx xxxxxx',
                        helpText:
                            'Masks all alphabetic characters with “x” and all numeric characters with “n”',
                    },
                },
            ]

            return {
                v,
                maskingOptions,
            }
        },
    })
</script>

<style lang="less" module>
    // FIXME: Styling is not working for some reason
</style>
<style lang="less" scoped></style>