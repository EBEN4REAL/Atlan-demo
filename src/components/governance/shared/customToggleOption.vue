<template>
    <div
        style="border-width: 1.5px !important"
        :class="{
            ' border-new-blue-400 bg-new-blue-100': selected,
            'hover:border-new-blue-100': !selected,
            'cursor-not-allowed opacity-70': disabled,
        }"
        class="p-3 text-sm border border-white rounded-lg cursor-pointer select-none"
        @click="!disabled && emit('click')"
    >
        <div class="flex items-center gap-x-2 gap-y-2">
            <AtlanIcon :icon="iconName" />
            <span class="text-new-gray-800">
                {{ heading }}
            </span>
            <div class="flex-grow" />
            <AtlanIcon v-if="selected" icon="Check" class="text-new-blue-400" />
        </div>
        <div
            v-if="subHeading"
            class="pr-5 text-new-gray-700"
            v-html="subHeading"
        ></div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        selected: { type: Boolean, required: true },
        disabled: { type: Boolean, default: false },
        heading: { type: String, required: true },
        iconName: { type: String, required: true },
        subHeading: { type: String, required: false, default: '' },
    })
    const emit = defineEmits(['click'])
</script>

<style scoped></style>
