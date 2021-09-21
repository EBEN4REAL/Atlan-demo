<template>
    <div>
        <!-- Process Nodes -->

        <!-- Non-Process Nodes -->
        <div
            v-if="type !== 'Process'"
            class="node"
            :class="{
                isBase,
                isHighlightedNode: guid === currHighlightedNode,
                isHighlightedNodePath:
                    Array.from(nodesToHighlight).includes(guid),
            }"
            :title="displayText"
        >
            <span class="node-type">
                <span class="node-type__item">{{ type }}</span>
            </span>
            <span v-if="isBase" class="node-isbase">
                <span class="node-isbase__item">BASE</span>
            </span>
            <img class="node-source" :src="getNodeSourceImage[source]" />
            <span class="node-text">{{ displayText }}</span>
        </div>

        <div
            v-else
            class="process"
            :class="{
                isHighlightedNode: guid === currHighlightedNode,
                isHighlightedNodePath:
                    Array.from(nodesToHighlight).includes(guid),
            }"
        >
            P
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { getNodeSourceImage } from './util.js'

    export default defineComponent({
        name: 'Node',
        props: {
            displayText: String,
            source: String,
            type: String,
            isBase: Boolean,
            guid: String,
        },
        setup() {
            return {
                getNodeSourceImage,
                nodesToHighlight: [],
                currHighlightedNode: '',
            }
        },
    })
</script>

<style>
    .process {
        border: 2px solid #919aab;
        border-radius: 100%;
        height: 32px;
        width: 32px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: white;
    }
    .node {
        padding: 3px 0 3px 6px;
        border: 2px solid #919aab;
        display: flex;
        align-items: center;
        background-color: white;
        font-size: 13px;
        height: 32px;
    }

    .node.isBase {
        background-color: #c2cdf1 !important;
        border: 2px solid #2351cc !important;
    }

    .node.isBase .node-type__item {
        border: 2px solid #2351cc !important;
    }

    .isHighlightedNode {
        border: 2px solid #2351cc;
        background-color: #c2cdf1;
    }

    .isHighlightedNodePath {
        border: 2px solid #2351cc;
    }

    .node.isHighlightedNode .node-type__item,
    .node.isHighlightedNodePath .node-type__item {
        border: 2px solid #2351cc;
    }

    .node-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-transform: lowercase;
    }

    .node-source {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.5rem;
    }

    .node-loadstate {
        position: relative;
    }
    .node-loadstate__item {
        border: 2px solid #919aab;
        top: -21px;
        left: 80%;
        font-size: 10px;
        position: fixed;
        z-index: 999;
        padding: 2px 5px;
        text-transform: uppercase;
        background-color: #f8f8fd;
        overflow: hidden;
    }

    .node-type {
        position: relative;
    }
    .node-type__item {
        border: 2px solid #919aab;
        top: -21px;
        left: 0px;
        font-size: 10px;
        position: fixed;
        z-index: 999;
        padding: 2px 5px;
        text-transform: uppercase;
        background-color: #f8f8fd;
        overflow: hidden;
    }

    .node-isbase {
        position: relative;
    }
    .node-isbase__item {
        border: 2px solid #2351cc;
        background-color: #2351cc;
        font-weight: 700;
        color: white;
        top: -21px;
        left: 45%;
        font-size: 10px;
        position: fixed;
        z-index: 999;
        padding: 2px 5px;
        text-transform: uppercase;
        overflow: hidden;
    }
</style>
