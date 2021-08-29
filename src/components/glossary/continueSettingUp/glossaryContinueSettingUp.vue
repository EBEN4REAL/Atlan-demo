<template>
    <div
        v-if="
            missingOwners.length ||
            missingDescription.length ||
            missingLinkedAssets.length
        "
        class="pt-6 pb-4 my-8"
        :class="$style.continueSettingUp"
    >
        <p class="mb-2 ml-8 text-xs leading-4 text-gray-700">
            This section is only visible to Data Stewards
        </p>
        <h2 class="ml-8 text-2xl leading-6">Coninue Setting up Glossary</h2>
        <div class="pt-4 my-3 bg-white">
            <a-tabs default-active-key="1" class="border-0">
                <a-tab-pane v-if="missingOwners.length" key="1" tab="Add Owners"
                    ><div class="overflow-auto" style="max-height: 270px">
                        <a-table
                            :columns="ownersTableColumns"
                            :data-source="missingOwners"
                            :pagination="false"
                            :showHeader="false"
                            row-key="guid"
                        >
                            <template #name="{ record }">
                                <div class="flex w-24 ml-2 align-middle">
                                    <span class="mr-2">
                                        <img
                                            v-if="record.type === 'term'"
                                            :src="TermSvg"
                                            height="16"
                                        />
                                        <img
                                            v-if="record.type === 'category'"
                                            :src="CategorySvg"
                                            height="16"
                                        />
                                    </span>
                                    <span
                                        class="
                                            text-sm
                                            leading-5
                                            text-gray-700 text-bold
                                        "
                                        >{{ record.name }}</span
                                    >
                                </div>
                            </template>
                            <template #description="{ record }">
                                <span v-if="record.shortDescription">{{
                                    record.shortDescription
                                }}</span>
                                <span v-else class="text-gray">- NA -</span>
                            </template>
                            <template #owners="{ record }">
                                <a-select
                                    mode="multiple"
                                    placeholder="Please select"
                                    style="width: 200px"
                                >
                                    <a-select-option
                                        v-for="i in 25"
                                        :key="(i + 9).toString(36) + i"
                                    >
                                        {{ (i + 9).toString(36) + i }}
                                    </a-select-option>
                                </a-select>
                                <!-- <Owners :item="record" :key="record.guid" /> -->
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <a-tab-pane
                    v-if="missingDescription.length"
                    key="2"
                    tab="Add Descriptions"
                    ><div class="overflow-auto" style="max-height: 270px">
                        <a-table
                            :columns="descriptionTableColumns"
                            :data-source="missingDescription"
                            :pagination="false"
                            :showHeader="false"
                            row-key="guid"
                        >
                            <template #name="{ record }">
                                <div class="flex align-middle">
                                    <span class="mr-2">
                                        <img
                                            v-if="record.type === 'term'"
                                            :src="TermSvg"
                                            width="20"
                                        />
                                        <img
                                            v-if="record.type === 'category'"
                                            :src="CategorySvg"
                                            width="20"
                                        />
                                    </span>
                                    <span>{{ record.name }}</span>
                                </div>
                            </template>
                            <template #description="{ record }">
                                <GlossaryAddDescriptionCard
                                    :entity="record"
                                    @updateDescription="
                                        (type) =>
                                            $emit('updateDescription', type)
                                    "
                                />
                            </template>
                        </a-table>
                    </div>
                </a-tab-pane>

                <a-tab-pane
                    v-if="missingLinkedAssets.length"
                    key="3"
                    tab="Link Assets"
                    ><div class="overflow-auto" style="max-height: 270px">
                        Link Assets
                        <br />
                        {{ missingLinkedAssets }}
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch } from 'vue'

// components
import Owners from '@/preview/asset/tabs/overview/details/owners.vue'
import GlossaryAddDescriptionCard from '@/glossary/glossaryAddDescriptionCard.vue'
import { Components } from '~/api/atlas/client'
// static
import TermSvg from '~/assets/images/gtc/term/term.png'
import CategorySvg from '~/assets/images/gtc/category/category.png'

interface PropsType {
    terms: Components.Schemas.AtlasGlossaryTerm[]
    categories: Components.Schemas.AtlasGlossaryCategory[]
}

export default defineComponent({
    components: { GlossaryAddDescriptionCard },
    props: ['terms', 'categories'],
    emits: ['updateDescription', 'fetchNextCategoryOrTermList'],
    setup(props: PropsType, context) {
        // data
        const descriptionTableColumns = [
            {
                title: 'Term/Category',
                dataIndex: 'name',
                key: 'name',
                slots: { customRender: 'name' },
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                slots: { customRender: 'description' },
            },
        ]

        const ownersTableColumns = [
            {
                title: 'Term/Category',
                dataIndex: 'name',
                key: 'name',
                slots: { customRender: 'name' },
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                slots: { customRender: 'description' },
            },
            {
                title: 'Assign Owner',
                dataIndex: 'owners',
                key: 'owners',
                slots: { customRender: 'owners' },
            },
        ]

        // computed
        const categories = computed(
            () =>
                props.categories?.map((category) => ({
                    ...category,
                    type: 'category',
                })) ?? []
        )
        const terms = computed(
            () => props.terms?.map((term) => ({ ...term, type: 'term' })) ?? []
        )
        const missingDescription = computed(() => {
            const entities = [...terms.value, ...categories.value]
            return entities
                .filter((entity) => !entity.shortDescription)
                .map((entity) => ({ ...entity, shortDescription: '' }))
                .slice(0, 5)
        })
        const missingLinkedAssets = computed(() =>
            terms.value
                .filter((term) => !term.assignedEntities?.length)
                .slice(0, 5)
        )

        const missingOwners = computed(() =>
            [...terms.value, ...categories.value]
                .filter((entity) => !entity?.additionalAttributes?.owners)
                .slice(0, 5)
        )

        // lifecycle methods and watchers
        watch(missingDescription, (newMissingDescription) => {
            if (
                !newMissingDescription.find((entity) => entity.type === 'term')
            ) {
                context.emit('fetchNextCategoryOrTermList', 'term')
            }
            if (
                !newMissingDescription.find(
                    (entity) => entity.type === 'category'
                )
            ) {
                context.emit('fetchNextCategoryOrTermList', 'category')
            }
        })
        return {
            TermSvg,
            CategorySvg,
            categories,
            terms,
            missingDescription,
            missingLinkedAssets,
            missingOwners,
            descriptionTableColumns,
            ownersTableColumns,
        }
    },
})
</script>
<style lang="less" module>
.continueSettingUp {
    background-color: #fff8f1;
}
</style>
