<template>
    <div :style="listStyle">
        <div
            v-if="loadingStatus === 'loading' && !assetList.length"
            class="overflow-y-hidden assets-wrapper d-flex justify-content-center align-items-center h-100"
        >
            <!-- <div class="text-center">
          <div class="">
            <i class="far fa-circle-notch spin fast display-4 text-primary"></i>
          </div>
          <p class="px-3 mt-3 mb-0 font-size-h3">
            Fetching assets...
          </p>
        </div> -->
            <loader loading-text="Fetching assets..." text-large></loader>
        </div>
        <div
            v-else-if="loadingStatus === 'error' && !assetList.length"
            class="overflow-y-hidden assets-wrapper d-flex justify-content-center align-items-center"
        >
            <div class="px-8 text-center">
                <div class="">
                    <i
                        class="fal fa-exclamation-triangle display-4 text-danger"
                    ></i>
                </div>
                <p class="px-3 mt-3 mb-0 rounded font-size-h3">
                    Sorry! Error in fetching assets
                </p>
            </div>
        </div>
        <div
            v-else-if="loadingStatus === 'success' && assetList.length === 0"
            class="py-4 overflow-y-hidden d-flex flex-column align-items-center h-100"
        >
            <img alt="EmptyAssetList" class="empty-img" :src="EmptyAssetList" />
            <div class="mt-3 text-center">
                <slot name="emptyCopy">
                    <p class="mb-2 font-w700">
                        No assets found
                    </p>
                    <span class="text-muted"
                        >Try changing filters or search keyword</span
                    >
                </slot>
            </div>
        </div>
        <simplebar
            v-else
            ref="assetsListRef"
            :style="{ 'max-height': maxHeight }"
        >
            <AssetItemCard
                v-for="(asset, index) in assetList"
                :key="asset.guid"
                class="border-bottom asset-list-item-wrapper"
                :asset="asset"
                :is-asset-selected="asset === selectedAssetId"
                :qualified-name-character-count-to-display="
                    qualifiedNameCharacterCountToDisplay
                "
                :show-description="showDescription"
                @selectAsset="emitSelectAsset"
            >
                <div
                    v-if="showAssetActionsDropdown && asset.guid !== '-1'"
                    slot="unlinkButton"
                    class=""
                >
                    <span
                        v-if="
                            unLinkAssetStatus[asset.guid] === 'loading' &&
                                !askAgainBeforeUnLinking
                        "
                        class="mr-2"
                    >
                        <i
                            class="mr-1 far fa-circle-notch spin fast text-primary font-size-sm"
                        ></i
                        ><span class="text-muted font-size-sm"
                            >Unlinking...</span
                        >
                    </span>
                    <span
                        v-if="
                            unLinkAssetStatus[asset.guid] === 'error' &&
                                !askAgainBeforeUnLinking
                        "
                        class="ml-3 mr-2 font-size-sm text-danger"
                    >
                        Unable to unlink asset. Please try again.
                    </span>
                    <span
                        v-if="
                            unLinkAssetStatus[asset.guid] === 'success' &&
                                !askAgainBeforeUnLinking
                        "
                        class="mr-2"
                    >
                        <i
                            class="mr-1 far fa-check-circle text-success font-size-sm"
                        ></i
                        ><span class="text-muted font-size-sm"
                            >Asset unlinked</span
                        >
                    </span>
                </div>
            </AssetItemCard>
            <div
                v-if="loadingStatus === 'loading' && assetList.length"
                class="px-4 py-2 d-flex justify-content-center border-bottom"
            >
                <p class="mb-0 text-gray-500 font-w700">
                    <i class="mr-2 far fa-circle-notch spin fast"></i>Fetching
                    {{ limit ? limit - fetchedAssetCountInOneBatch : '' }} more
                    assets...
                </p>
            </div>
            <div
                v-else-if="
                    !listComplete &&
                        loadingStatus !== 'loading' &&
                        assetList.length % limit >= 0 &&
                        assetList.length
                "
                class="px-4 py-2 load-more-wrapper d-flex justify-content-center"
                @click="loadMore"
            >
                <p
                    class="mb-0 cursor-pointer load-text font-w700 text-primary hover-underline"
                >
                    Load More<i class="ml-2 far fa-arrow-alt-circle-down"></i>
                </p>
            </div>
        </simplebar>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, nextTick, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import AssetItemCard from '~/components/asset/assetItemCard.vue';
    import Loader from '~/components/loader.vue';
    // Media
    import EmptyAssetListIllustration from '~/assets/images/emptyAssetList.png';

    export default defineComponent({
        name: 'AssetList',
        components: {
            AssetItemCard,
            Loader,
        },
        props: {
            maxHeight: {
                type: String,
                default: '100%',
            },
            assetList: {
                type: Array,
                required: true,
            },
            loadingStatus: {
                type: String,
                validator(value) {
                    return (
                        ['loading', 'error', 'success', ''].indexOf(value) > -1
                    );
                },
            },
            selectedAssetId: {
                type: String,
                default: '',
            },
            // true when all assets are loaded
            listComplete: {
                type: Boolean,
                default: false,
            },
            // used to show loading status text " fetching {{ limit }} more assets "
            limit: {
                type: Number,
                required: false,
            },
            fetchedAssetCountInOneBatch: {
                type: Number,
                default: 0,
            },
            listStyle: {
                type: String,
                default: '',
            },
            onCardClick: {
                type: Boolean,
                default: false,
            },
            emptyIllus: {
                type: String,
                default: '',
            },
            showAssetActionsDropdown: {
                type: Boolean,
                default: false,
            },
            unLinkAssetStatus: {
                type: Object,
                default: () => {},
            },
            qualifiedNameCharacterCountToDisplay: {
                type: Number,
                default: 70,
            },
            showDescription: {
                type: Boolean,
                default: false,
            },
        },

        setup(props, context) {
            const router = useRouter();
            const assetsListRef = ref(null);
            const checkAssetsListScroll = ref(false);
            const isAssetsListEnd = ref(false);
            const loadingStatus = computed(() => props.loadingStatus);
            const assetList = computed(() => props.assetList);
            const selectedAssetId = computed(() => props.selectedAssetId);
            const showDescription = computed(() => props.showDescription);
            const showAssetActionsDropdown = computed(
                () => props.showAssetActionsDropdown
            );
            const {
                listStyle,
                maxHeight,
                qualifiedNameCharacterCountToDisplay,
                unLinkAssetStatus,
                limit,
                fetchedAssetCountInOneBatch,
                listComplete,
            } = props;

            const emitUnlinkAsset = (asset) => {
                context.emit('unlinkAsset', asset);
            };

            const assetActions = computed(() => [
                    {
                        title: `Unlink`,
                        icon: 'eraser',
                        iconType: 'far',
                        handleClick: emitUnlinkAsset,
                    },
                ]);
            const EmptyAssetList = computed(() => props.emptyIllus || EmptyAssetListIllustration);
            const isInfiniteScrollDisabled = computed(() => listComplete);

            const askAgainBeforeUnLinking = computed(() => null);

            const emitSelectAsset = (asset) => {
                context.emit('selectAsset', asset);
                if (props.onCardClick) {
                    console.log(asset);
                    //     if (asset.typeName === "AtlanSavedQuery") {
                    //       const { table } = asset.attributes;
                    //       const path = `/a/${table}/query/?queryId=${asset.guid}`;
                    //       router.push(path);
                    //       return;
                    //     }
                    //     router.push(`/a/${asset.guid}/overview`);
                    //   }
                }
            };

            const loadMore = () => {
                context.emit('loadmore');
            };

            const assetsListScroll = () => {
                const scrollElement = assetsListRef.value.assetsList.SimpleBar.getScrollElement();
                scrollElement.onscroll = () => {
                    if (
                        !props.listComplete &&
                        scrollElement.scrollHeight -
                            scrollElement.offsetHeight -
                            1000 <=
                            scrollElement.scrollTop &&
                        checkAssetsListScroll.value &&
                        loadingStatus.value !== 'loading'
                    ) {
                        if (props.assetList.length % props.limit >= 0) {
                            isAssetsListEnd.value = false;
                            loadMore();
                        } else {
                            checkAssetsListScroll.value = false;
                            isAssetsListEnd.value = true;
                        }
                    }
                };
            };

            watch(loadingStatus, () => {
                if (loadingStatus.value === 'success') {
                    nextTick(() => {
                        if (
                            loadingStatus.value === 'success' &&
                            assetsListRef.value
                        ) {
                            checkAssetsListScroll.value = true;
                            assetsListScroll();
                        }
                    });
                }
            });

            return {
                limit,
                listStyle,
                maxHeight,
                selectedAssetId,
                qualifiedNameCharacterCountToDisplay,
                assetList,
                showDescription,
                showAssetActionsDropdown,
                unLinkAssetStatus,
                fetchedAssetCountInOneBatch,
                listComplete,
                assetsListRef,
                loadingStatus,
                EmptyAssetList,
                isAssetsListEnd,
                checkAssetsListScroll,
                isInfiniteScrollDisabled,
                askAgainBeforeUnLinking,
                assetActions,
                assetsListScroll,
                emitUnlinkAsset,
                emitSelectAsset,
                loadMore,
            };
        },
    });
</script>

<style lang="scss" scoped></style>
