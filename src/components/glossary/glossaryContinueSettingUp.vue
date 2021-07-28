<template>
    <div class="my-8">
        <h2 class="text-xl leading-7">Coninue Setting up GLossary</h2>
        <a-tabs default-active-key="2" class="border-0">
            <a-tab-pane key="1" tab="Add Owners">
                Add Owners
                <br />
                {{ missingOwners }}
            </a-tab-pane>
            <a-tab-pane key="2" tab="Add Descriptions">
                <a-table
                    :columns="descriptionTableColumns"
                    :data-source="missingDescription"
                    :pagination="false"
                    rowKey="guid"
                >
                    <template #name="{ record }">
                        <div class="flex align-middle">
                            <span class="mr-2">
                                <img
                                    v-if="record.type === 'term'"
                                    :src="TermSvg"
                                    width="20"
                                />
                            </span>
                            <span>{{ record.name }}</span>
                        </div>
                    </template>
                    <template #description="{ record }">
                       <glossaryAddDescriptionCard :entity="record" />
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="3" tab="Link Assets">
                Link Assets
                <br />
                {{ missingLinkedAssets }}
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

import { Components } from '~/api/atlas/client'

import TermSvg from '~/assets/images/gtc/term/term.png'
import glossaryAddDescriptionCard from '@/glossary/glossaryAddDescriptionCard.vue';

interface PropsType {
    terms: Components.Schemas.AtlasGlossaryTerm[]
    categories: Components.Schemas.AtlasGlossaryCategory[]
}

export default defineComponent({
    props: ['terms', 'categories'],
    components: {glossaryAddDescriptionCard},
    setup(props: PropsType) {
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
            return entities.filter((entity) => !entity.shortDescription).map((entity) => ({...entity, shortDescription: ''}))
        })

        const missingLinkedAssets = computed(() => {
            return terms.value.filter((term) => !term.assignedEntities?.length)
        })

        const missingOwners = computed(() => {
            return [...terms.value, ...categories.value].filter(
                (entity) => !entity?.owners?.length
            )
        })

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
        ];
        const descriptionChange = (value, entity) => {
          console.log(value.target.value, entity)
        }
        return {
            TermSvg,
            categories,
            terms,
            missingDescription,
            missingLinkedAssets,
            missingOwners,
            descriptionTableColumns,
            descriptionChange
        }
    },
})
</script>