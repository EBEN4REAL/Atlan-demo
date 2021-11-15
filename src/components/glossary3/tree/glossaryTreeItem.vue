<template>
<div
    v-if="entity.title === 'Load more'"
    class="flex flex-row w-full text-sm font-bold leading-5  text-primary"
    @click="entity.click()"
>
    <span v-if="entity.isLoading">
        <!-- <LoadingView
            size="small"
            class="w-1 h-1 mr-4"
        /> -->
    </span>
    <span v-else>{{ entity.title }}</span>
</div>
<div class="flex min-w-full" v-else>
    <div
        class="min-w-full"
        @click="
            () =>
                redirectToProfile(
                    entity.typeName,
                    entity.key
                )
        "
    >
        <div
            class="flex justify-between mr-2 group"
        >
            <div class="flex m-0">
                <span
                    v-if="
                        entity.type ===
                        'glossary'
                    "
                    class="p-0 my-auto mr-2"
                >
                    <AtlanIcon
                        icon="Glossary"
                        class="h-5"
                    />
                </span>
                <span
                    v-else
                    class="p-0 my-auto mr-1.5"
                >
                    <AtlanIcon
                        :icon="
                            getEntityStatusIcon(
                                entity.type,
                                entity.certificateStatus
                            )
                        "
                    />
                </span>
                <span
                    class="my-auto text-sm leading-5 text-gray-700 "
                    >{{ entity.title }}</span
                >
            </div>
            <ThreeDotMenu 
                :entity="entity"
                :visible="false"
                showLinks
                showGtcCrud
                treeMode
            />
        </div>
    </div>
</div>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        PropType,
        toRefs
    } from 'vue'
    import { useRouter } from 'vue-router'

    import { Glossary, Term, Category } from '~/types/glossary/glossary.interface'

    import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'
    import redirect from '@/glossary/utils/redirectToProfile'

    import ThreeDotMenu from '@/glossary/threeDotMenu.vue'

    export default defineComponent({
        name: 'GlossaryTreeItem',
        props: {
            entity: {
                type: Object as PropType<Glossary | Term | Category>,
                required: false,
                default: () => {},
            }
        },
        components: {
            ThreeDotMenu
        },
        setup(props, { emit }) {
            // data
            const { entity } = toRefs(props)
            const router = useRouter()
            const redirectToProfile = redirect(router)


            return {
                entity,
                getEntityStatusIcon,
                redirectToProfile
            }
        },
    })
</script>
<style lang="less" module>

</style>
