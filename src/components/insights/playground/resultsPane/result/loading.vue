<template>
    <div
        class="flex items-center justify-center w-full h-full"
        v-if="isQueryRunning === 'loading'"
    >
        <div class="flex flex-col items-center justify-center">
            <!-- <Loader style="min-height: 60px !important"></Loader> -->
            <a-spin />
            <p class="mt-2 mb-0 text-base text-gray-700">Crunching Data</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, computed, inject } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import LoadingView from '@common/loaders/page.vue'
    import Loader from '@common/loaders/page.vue'

    export default defineComponent({
        components: { LoadingView, Loader },
        props: {},
        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            return {
                isQueryRunning,
            }
        },
    })
</script>
<style lang="less" scoped>
    .loader_65 {
        font-size: 10px;
        margin: 50px auto;
        text-indent: -9999em;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: #5277d7;
        background: -moz-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -webkit-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -o-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -ms-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: linear-gradient(
            to right,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        position: relative;
        -webkit-animation: load3 1.4s infinite linear;
        animation: load3 1.4s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
    }
    .loader_65:before {
        width: 50%;
        height: 50%;
        background: #5277d7;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
    }
    .loader_65:after {
        background: #ffff;
        width: 75%;
        height: 75%;
        border-radius: 50%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    @-webkit-keyframes load3 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load3 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
