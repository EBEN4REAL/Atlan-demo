<template>
    <div
        v-if="
            missingOwners.length ||
            missingDescription.length ||
            missingLinkedAssets.length
        "
        class="my-8 px-8"
    >
        <h2 class="text-xl leading-7">Coninue Setting up GLossary</h2>
        <a-tabs default-active-key="2" class="border-0">
            <a-tab-pane v-if="missingOwners.length" key="1" tab="Add Owners">
                <a-table
                    :columns="ownersTableColumns"
                    :data-source="missingOwners"
                    :pagination="false"
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
            </a-tab-pane>

            <a-tab-pane
                v-if="missingDescription.length"
                key="2"
                tab="Add Descriptions"
            >
                <a-table
                    :columns="descriptionTableColumns"
                    :data-source="missingDescription"
                    :pagination="false"
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
                                (type) => $emit('updateDescription', type)
                            "
                        />
                    </template>
                </a-table>
            </a-tab-pane>

            <a-tab-pane
                v-if="missingLinkedAssets.length"
                key="3"
                tab="Link Assets"
            >
                Link Assets
                <br />
                {{ missingLinkedAssets }}
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch } from 'vue'

import Owners from '@/preview/asset/tabs/overview/details/owners.vue'

import GlossaryAddDescriptionCard from '@/glossary/glossaryAddDescriptionCard.vue'
import Owners from '@/preview/asset/tabs/overview/details/owners.vue'
import { Components } from '~/api/atlas/client'

import TermSvg from '~/assets/images/gtc/term/term.png'
import CategorySvg from '~/assets/images/gtc/category/category.png'
import GlossaryAddDescriptionCard from '~/components/glossary/continueSettingUp/glossaryAddDescriptionCard.vue'

interface PropsType {
    terms: Components.Schemas.AtlasGlossaryTerm[]
    categories: Components.Schemas.AtlasGlossaryCategory[]
}

export default defineComponent({
    components: { GlossaryAddDescriptionCard, Owners },
    props: ['terms', 'categories'],
    emits: ['updateDescription', 'fetchNextCategoryOrTermList'],
    setup(props: PropsType, context) {
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