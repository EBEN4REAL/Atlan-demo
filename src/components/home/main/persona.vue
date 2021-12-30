<template>
    <div class="flex items-center justify-between mb-2">
        <div class="font-semibold">Discover Personas</div>
    </div>
    <vue-horizontal class="horizontal">
        <div
            class="flex items-center justify-center p-4 text-lg text-gray-700 bg-white border rounded-lg shadow cursor-pointer item hover:translate-z-1 hover:shadow-lg hover:bg-primary group"
            v-for="item in list"
            :key="item.id"
            @click="handleClick(item.id)"
        >
            <p class="text-sm text-gray-700 group-hover:text-white">
                {{ item.displayName }}
            </p>
        </div>
    </vue-horizontal>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import VueHorizontal from 'vue-horizontal'
    import { useRouter } from 'vue-router'
    import useAssetStore from '~/store/asset'
    import { usePersonaStore } from '~/store/persona'

    export default defineComponent({
        components: { VueHorizontal },
        setup() {
            const personaStore = usePersonaStore()
            const list = computed(() => personaStore.list)
            const assetStore = useAssetStore()

            const router = useRouter()

            const handleClick = (id) => {
                console.log(id)
                assetStore.setGlobalState(['persona', id])
                router.push('/assets')
            }

            return {
                list,
                handleClick,
            }
        },
    })
</script>

<!-- Content Design -->
<style scoped>
    .content {
        background-position: center !important;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
    }

    .aspect-ratio {
        padding-top: 60%;
    }

    .overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #00000010;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px;
    }

    .overlay > * {
        color: white;
    }
</style>

<!-- Parent CSS (Container) -->
<style scoped>
    .header {
        margin-bottom: 24px;
    }

    main {
        padding: 24px;
    }

    @media (min-width: 768px) {
        main {
            padding: 48px;
        }
    }
</style>

<!-- Responsive Breakpoints -->
<style scoped>
    .horizontal {
        --count: 1;
        --gap: 16px;
        --margin: 24px;
    }

    @media (min-width: 640px) {
        .horizontal {
            --count: 2;
        }
    }

    @media (min-width: 768px) {
        .horizontal {
            --count: 3;
            --margin: 0;
        }
    }

    @media (min-width: 1024px) {
        .horizontal {
            --count: 4;
        }
    }

    @media (min-width: 1280px) {
        .horizontal {
            --gap: 24px;
            --count: 4;
        }
    }
</style>

<!--
## Responsive Logic
The margin removes the padding from the parent container and add it into vue-horizontal.
If the gap is less than margin, this causes overflow to show and peeks into the next content for better UX.
You can replace this section entirely for basic responsive CSS logic if you don't want this "peeking" experience
for the mobile web.
Note that this responsive logic is hyper sensitive to your design choices, it's not a one size fit all solution.
var() has only 95% cross browser compatibility, you should convert it to fixed values.

There are 2 set of logic:
0-768 for peeking optimized for touch scrolling.
>768 for navigation via buttons for desktop/laptop users.
-->
<style scoped>
    @media (max-width: 767.98px) {
        .item {
            width: calc(
                (100% - (var(--margin) * 2) + var(--gap)) / var(--count)
            );
            padding: 0 calc(var(--gap) / 2);
        }

        .item:first-child {
            width: calc(
                (100% - (var(--margin) * 2) + var(--gap)) / var(--count) +
                    var(--margin) - (var(--gap) / 2)
            );
            padding-left: var(--margin);
        }

        .item:last-child {
            width: calc(
                (100% - (var(--margin) * 2) + var(--gap)) / var(--count) +
                    var(--margin) - (var(--gap) / 2)
            );
            padding-right: var(--margin);
        }

        .item:only-child {
            width: calc(
                (100% - (var(--margin) * 2) + var(--gap)) / var(--count) +
                    var(--margin) * 2 - var(--gap)
            );
        }

        .horizontal {
            margin: 0 calc(var(--margin) * -1);
        }

        .horizontal >>> .v-hl-container {
            scroll-padding: 0 calc(var(--margin) - (var(--gap) / 2));
        }

        .horizontal >>> .v-hl-btn {
            display: none;
        }
    }

    @media (min-width: 768px) {
        .item {
            width: calc(
                (100% - ((var(--count) - 1) * var(--gap))) / var(--count)
            );
            margin-right: var(--gap);
        }
    }
</style>
