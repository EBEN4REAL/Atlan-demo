<template>
<div
    class="flex px-4 py-3 text-sm leading-5 text-gray-500 bg-gray-100 cursor-pointer "
>
    <!-- Glossary context switcher -->
    <a-select
        v-model:value="currentGlossaryGuid"
        :open="glossaryContextOpen"
        :options="glossaryContextDropdown"
        :dropdownMatchSelectWidth="true"
        show-search
        dropdownClassName="pr-0.5 w-60"
        class="pr-0.5 w-60"
        @click="glossaryContextOpen = !glossaryContextOpen"
        @select="glossaryContextOpen = false"
        @blur="glossaryContextOpen = false"
    >
        <template #suffixIcon>
            <atlan-icon
                icon="ChevronDown"
                class="w-auto h-4 mb-2"
            />
        </template>
        <template #option="{ value, label, status }">
            <hr v-if="value === 'createNewGlossary'" />
            <span
                v-if="value !== 'createNewGlossary'"
                class="
                    py-0.5
                    flex flex-row
                    items-center
                    content-center
                    my-auto
                "
            >
                <AtlanIcon
                    v-if="value === 'all'"
                    class="mr-2"
                    icon="Home"
                />
                <AtlanIcon
                    v-else
                    class="mr-2"
                    :icon="getEntityStatusIcon('glossary', status)"
                />
                <span>{{ label }}</span>
            </span>
            <!-- <span v-else @click.stop="">
                <AddGtcModal
                    entityType="glossary"
                    @onAddGlossary="refetchGlossaryList"
                >
                    <template #header>
                        <div class="flex items-center mr-5">
                            <AtlanIcon
                                icon="Glossary"
                                class="h-4 m-0 mr-2"
                            />
                            <span
                                class="text-xs font-bold text-gray-700 "
                            >
                                New glossary
                            </span>
                        </div>
                    </template>
                    <template #trigger>
                        <div
                            class="
                                py-0.5
                                mt-2
                                flex flex-row
                                items-center
                                content-center
                                my-auto
                                text-sm
                                leading-5
                                text-gray-700
                                cursor-pointer
                                text-bold
                            "
                            @mousedown="(e) => e.preventDefault()"
                        >
                            <AtlanIcon icon="Add" class="mr-2" />
                            <span>{{ label }}</span>
                        </div>
                    </template>
                </AddGtcModal>
            </span> -->
            <hr v-if="value === 'all'" />
        </template>

    </a-select>
</div>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
        watch
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { useVModels } from '@vueuse/core'

    import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'
    import redirect from '@/glossary/utils/redirectToProfile'

    import { useGlossaryStore } from '~/store/glossary';

    export default defineComponent({
        props: {
            currentGlossaryGuid: {
                type: String,
                required: true,
            }
        },
        setup(props, { emit }) {
            // data
            const router = useRouter()
            const redirectToProfile = redirect(router)
            const glossaryStore = useGlossaryStore();

            const { currentGlossaryGuid } = useVModels(props, emit)
            
            const glossaryContextOpen = ref(
                router.currentRoute.value.query.cta === 'glossaryContext'
            )
            const glossaryContextDropdown = computed(() => {
                const list = glossaryStore.list.map((glossary) => ({
                    value: glossary.guid,
                    label: glossary.attributes.name,
                    status: glossary.attributes.certificateStatus,
                }))
                list.unshift({ label: 'Home', value: 'all', status: undefined })
                list.push({
                    label: 'Create New Glossary',
                    value: 'createNewGlossary',
                    status: undefined
                })
                return list
            });

            watch(currentGlossaryGuid, (newGuid, prevGuid) => {
                if(newGuid && newGuid !== prevGuid && prevGuid) {
                    if (newGuid === 'all') router.push(`/glossary`)
                    else { 
                        redirectToProfile('AtlasGlossary', newGuid)
                    }
                }
            });

            return {
                getEntityStatusIcon,
                redirectToProfile,
                currentGlossaryGuid,
                glossaryContextOpen,
                glossaryContextDropdown,
            }
        },
    })
</script>
<style lang="less" module>

</style>
