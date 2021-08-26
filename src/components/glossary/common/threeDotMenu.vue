<template>
    <div>
        <a-dropdown :trigger="['click']">
            <a-button class="px-2.5" @click.prevent>
                <fa icon="fal ellipsis-v" class="h-4" />
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="redirectToProfile">
                        <template #icon>
                            <Fa
                                class="w-auto h-3 text-white"
                                icon="fal external-link-alt"
                        /></template>
                        Go to term profile</a-menu-item
                    >
                    <a-menu-item>
                        <template #icon>
                            <Fa
                                class="w-auto h-3 text-white  group-hover:text-primary"
                                icon="fal external-link-alt"
                        /></template>
                        Copy term profile link</a-menu-item
                    >
                    <a-menu-divider />

                    <!-- <a-menu-item>
                        <Status v-if="entity.guid" :selectedAsset="entity" />
                    </a-menu-item> -->
                    <a-sub-menu key="status">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center justify-between">
                                    <fa
                                        icon="fal trash-alt"
                                        class="w-auto h-3 mr-2"
                                    ></fa>
                                    <p class="p-0 m-0">Add status</p>
                                </div>
                                <AtlanIcon
                                    class="pt-1 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <a-menu-item class="m-0 bg-white">
                            <Status
                                v-if="entity.guid"
                                :selectedAsset="entity"
                            />
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu key="expert">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center justify-between">
                                    <fa
                                        icon="fal trash-alt"
                                        class="w-auto h-3 mr-2"
                                    ></fa>
                                    <p class="p-0 m-0">Add Owner</p>
                                </div>
                                <AtlanIcon
                                    class="pt-1 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <a-menu-item class="m-0 bg-white">
                            <Owners :selectedAsset="entity"
                        /></a-menu-item>
                    </a-sub-menu>
                    <a-menu-divider />
                    <a-menu-item>
                        <template #icon>
                            <fa
                                icon="fal trash-alt"
                                class="w-auto h-3 mr-2"
                            ></fa>
                        </template>
                        Archive</a-menu-item
                    >
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    // components
    // import Status from '@/discovery/preview/tabs/info/assetDetails/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    import Status from '@/glossary/common/status.vue'
    export default defineComponent({
        components: { Status, Owners },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            redirectToProfile: {
                type: Function,
                required: false,
                default: () => {},
            },
        },
        setup(props) {
            console.log(props.redirectToProfile)
            return {}
        },
    })
</script>
