<template>
    <ul class="list-unstyled">
        <li
            v-for="(path, index) in getParentsFiltered"
            :key="path.id"
            :class="$style.item"
            class="px-2 py-2 hover:bg-gray-100 hover:rounded"
        >
            <div
                :class="$style.itemDots"
                class=""
                :style="{ backgroundImage: `url(${dottedUrl})` }"
            />
            <div :class="$style.itemPicContainer">
                <div v-if="index === 0" :class="$style.itemPic" class="border">
                    <img :src="logo(selectedAsset)" :class="$style.itemType" />
                </div>
                <div v-else :class="$style.itemPic" class="border">
                    <component
                        :is="path.id"
                        :class="$style.itemType"
                    ></component>
                </div>
            </div>
            <div class="flex justify-between" :class="$style.ellipsis">
                <div class="flex flex-col max-w-full">
                    <p class="mb-0 text-sm text-blue-600 truncate lh-sm">
                        <a-tooltip placement="left">
                            <template #title>
                                {{ path.value }}
                            </template>
                            {{ path.value }}
                        </a-tooltip>
                    </p>
                    <div class="flex items-center justify-between mb-0">
                        <p class="mb-0 text-xs text-gray-500 line-height-1">
                            {{ path.label }}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import dottedUrl from '~/assets/images/dotted.png'

    export default defineComponent({
        name: 'RelationshipList',
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { getHierarchy, logo } = useAssetInfo()
            const getParentsFiltered = computed(() =>
                getHierarchy(selectedAsset.value)
            )
            return {
                logo,
                dottedUrl,
                getParentsFiltered,
            }
        },
    })
</script>

<style lang="less" module>
    .item {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        position: relative;
        min-height: 58px;

        .itemDots {
            position: absolute;
            top: calc(50% + 26px);
            transform: translateY(-50%);
            left: 24px;
            bottom: 0;
            width: 5px;
            height: 24px;
            background-repeat: no-repeat;
        }

        &:last-child {
            padding-bottom: 0;
            min-height: 30px;

            .itemDots {
                display: none;
            }

            &::before {
                display: none;
            }
        }
    }

    .itemPicContainer {
        align-self: flex-start;
        position: relative;
        margin-right: 10px;
        // margin-left: rem(15);
    }

    .itemSource {
        width: 22px;
        height: 22px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
    }

    .itemType {
        width: auto;
        height: 18px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .itemPic {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        line-height: 36px;
        flex-shrink: 0;
    }

    .itemIcon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
        color: #fff;
    }

    .ellipsis {
        width: calc(100% - 3rem);
    }
</style>
