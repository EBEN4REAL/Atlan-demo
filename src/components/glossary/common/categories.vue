<template>
    <div :class="$style.categories">
        <div class="flex flex-wrap items-center" >

            <a-popover
                v-model:visible="showAddClassificationsTree"
                placement="left"
                trigger=""
            >
            
                <div v-if="existingCategories.length < 1">
                    <div @click.stop="toggleClassificationsTree">
                        <div
                            class="flex items-center cursor-pointer  text-primary hover:text-primary hover:underline"
                        >
                            <!-- <span class="flex items-center text-xs">
                                <fa icon="fal plus" />
                            </span> -->
                            <span class="text-xs">Add to categories</span>
                        </div>
                    </div>
                </div>
                <PillGroup
                    v-else
                    :data="existingCategories"
                    label-key="guid"
                    @add="toggleClassificationsTree"
                >
                </PillGroup>
                <template #content :class="$style.popover">
                    <div class="flex flex-col overflow-y-auto max-h-56 w-56">
                        <a-tree-select
                            v-model:value="selectedCategories"
                            tree-data-simple-mode
                            tree-checkable
                            :tree-data="treeData"
                            placeholder="Search categories"
                            :treeCheckStrictly="true"
                            :dropdown-style="{ maxHeight: '350px', overflow: 'auto', maxWidth: '220px' }"
                        />
                        <div class="flex flex-row space-x-4 mt-4">
                            <a-button class="popover-button" :class="$style.popoverButton">Cancel</a-button>
                            <a-button class="popover-button" :class="$style.popoverButton" type="primary" >Update</a-button>
                        </div>
                    </div>
                </template>
            </a-popover>            
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, PropType, toRef, onMounted } from 'vue'

//components
import PillGroup from '~/components/UI/pill/pillGroup.vue'

//composables
import useGlossaryCategories from '~/components/glossary/composables/useGlossaryCategories'
import useGtcSearch from '~/components/glossary/composables/useGtcSearch'

//types
import { Category, RelatedEntity } from '~/types/glossary/glossary.interface'
import { TreeSelect } from 'ant-design-vue';


type TreeDataItem = Category & {
    children?: TreeDataItem[]
    id: string;
    pId: string;
    value: string;
    title: string;
    isLeaf?: boolean;
}

export default defineComponent({
    components: { PillGroup },
    props: {
        glossaryQualifiedName: {
            type: String,
            required: true,
            default: ''
        },
        termGuid: {
            type: String,
            required: true,
            default: ''
        },
        categories: {
            type: Object as PropType<RelatedEntity[]>,
            required: true,
            default: () => []
        },
        mode: {
            type: String as PropType<'edit' | 'create'>,
            required: true,
            default: 'create'
        }
    },
    setup(props, { emit }) {

        const existingCategories = toRef(props, 'categories');
        const selectedCategories = ref<{value: string; label?: string}[]>(existingCategories.value.map((category) => ({
            value: category.guid
        })))

        const showAddClassificationsTree = ref(false);
        const parentGlossaryQualifiedName = computed(() => props.glossaryQualifiedName);
        const treeData = ref<TreeDataItem[]>([])

        const toggleClassificationsTree = () => {
            if(!showAddClassificationsTree.value) {
                showAddClassificationsTree.value = true
            } else {
                showAddClassificationsTree.value = false
            }
        }

        const {
            categories,
            isLoading: searchLoading,
            fetchAssets: fetchCategories,
        } = useGtcSearch(parentGlossaryQualifiedName, ref(true), "AtlasGlossaryCategory")

        // onMounted(() => {
        //     fetchCategories(props.glossaryGuid, 50)
        // })
        const convertCategoriesToTree = (categories: Category[]) => {
            categories.forEach((category) => {
                // if(!category.attributes.parentCategory) 
                console.log(category.attributes?.childrenCategories?.length, category.attributes, 'wewww')
                treeData.value.push({
                    ...category,
                    id: category.guid ?? '',
                    pId: category.attributes?.parentCategory?.guid ?? 0,
                    value: category.guid ?? '',
                    title: category.displayText ?? '',
                    isLeaf: !category.attributes?.childrenCategories?.length ? true : false,
                })
            });
        }
        const onLoadData = (treeNode: any) => {
            return new Promise((resolve: (value?: unknown) => void) => {
                const { id } = treeNode.dataRef;
                setTimeout(() => {
                console.log(treeNode, treeNode.dataRef.children, !treeNode.dataRef.children)
                categories.value.forEach((category: Category) => {
                    if(category.attributes.parentCategory === id) {
                        console.log(id)
                        if(!treeNode.dataRef.children) treeNode.dataRef.children = []
                        treeData.value.push({
                            ...category,
                            id: category.guid ?? '',
                            pId: id,
                            value: category.guid ?? '',
                            title: category.displayText ?? '',
                            isLeaf: false,
                        })
                    }
                })
                resolve();
                }, 300);
            });
        };

        watch(categories, (newCategories) => {
            convertCategoriesToTree(newCategories as Category[])
        })

        return {
           existingCategories,
           showAddClassificationsTree,
           categories,
           treeData,
           toggleClassificationsTree,
           onLoadData,
           selectedCategories,
           TreeSelect
        }
    },
})
</script>
<style lang="less" module>
 .categories {
 }
 .popover {
     max-height: 348px;
     padding: 1rem;
 }
 .popoverButton {
    min-width: 104px !important;
 }
</style>
