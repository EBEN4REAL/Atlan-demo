<template>
    <div
        class="text-center align-items-center d-flex justify-content-center"
        :style="{ height: height }"
    >
        <!-- <div class="h-100 d-flex justify-content-center align-items-center">
      </div> -->
        <div class="text-center">
            <div class="loader" :class="loaderClass">
                <svg
                    id="Layer_1"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="36px"
                    height="36px"
                    viewBox="0 0 36 36"
                >
                    <defs></defs>
                    <g>
                        <path
                            class="cls-1"
                            d="M18,36A18,18,0,0,1,18,0a2,2,0,0,1,0,4A14,14,0,1,0,32,18a2,2,0,0,1,4,0A18,18,0,0,1,18,36Z"
                        />
                        <circle class="cls-2" cx="29" cy="7" r="3" />
                    </g>
                </svg>
            </div>
            <p
                v-if="loadingText"
                class="px-3 mt-3 mb-0 rounded"
                :class="[textLarge ? 'font-size-h3' : '', loadingTextClass]"
                v-html="loadingText"
            ></p>
        </div>
        <!-- <div class="spinner" :class="isSmall ? 'small' : ''">
        <div class="double-bounce1" :class="loaderClass"></div>
        <div class="double-bounce2" :class="loaderClass"></div>
      </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'Loader',
        props: {
            loaderClass: {
                type: String,
                default: '',
            },
            height: {
                type: String,
                default: '200px',
            },
            loadingText: {
                type: String,
                default: `Loading<span class="loading-dots"
            ><span>.</span><span>.</span><span>.</span></span
          >`,
            },
            textLarge: {
                type: Boolean,
                default: false,
            },
            loadingTextClass: {
                type: String,
                default: '',
            },
        },
        setup(props, context) {},
    });
</script>

<style lang="less" scoped>
    .spinner {
        width: 40px;
        height: 40px;
        position: relative;
        &.small {
            width: 16px;
            height: 16px;
        }
    }

    .double-bounce1,
    .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: $primary;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: sk-bounce 2s infinite ease-in-out;
        animation: sk-bounce 2s infinite ease-in-out;
    }

    .double-bounce2 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
    }

    @-webkit-keyframes sk-bounce {
        0%,
        100% {
            -webkit-transform: scale(0);
        }
        50% {
            -webkit-transform: scale(1);
        }
    }

    @keyframes sk-bounce {
        0%,
        100% {
            transform: scale(0);
            -webkit-transform: scale(0);
        }
        50% {
            transform: scale(1);
            -webkit-transform: scale(1);
        }
    }
</style>
