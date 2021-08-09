<template>
    <!-- <p class="ellipsis-text">{{ tooltipText }}</p>
    <a-tooltip overlayClassName="tooltip">
        <template #title>{{ tooltipText }}</template>
    </a-tooltip> 
    <p class="tooltip">{{ tooltipText }}</p>
    <a-typography-text
    :style="{ width: '100px' }"
    :ellipsis="{ tooltip: 'I am ellipsis now!' }"
    :content="tooltipText"
  />  -->

    <a-tooltip>
        <template #title>{{ tooltipText }}</template>
        <a-typography-paragraph :ellipsis="true">{{
            tooltipText
        }}</a-typography-paragraph>
    </a-tooltip>
    <!-- 
    <p class="ellipsis-text">{{ tooltipText }}</p>

    <p class="tooltip">{{ tooltipText }}</p> -->
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            tooltipText: {
                type: String,
                default: '',
            },
        },
    })
</script>

<style scoped>
    .ellipsis-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        pointer-events: none;
    }

    .ellipsis-text:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 48px;
        z-index: 1;
        pointer-events: initial;
    }

    .ellipsis-text:hover:after {
        cursor: pointer;
    }

    .tooltip {
        max-width: 40%;
        visibility: hidden;
        position: absolute;
        background-color: black;
        color: white;
        padding: 20px;
        -webkit-box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: 1;
    }

    .ellipsis-text:hover + .tooltip {
        visibility: visible;
        transition: opacity 0.5s ease;
        opacity: 0.8;
    }
</style>
