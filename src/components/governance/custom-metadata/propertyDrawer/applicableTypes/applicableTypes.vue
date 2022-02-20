<template>
    <CardWrapper
        title="Applicable asset types"
        icon="AssetsInactive"
        help-text="This property will only be available for selected asset types"
    >
        <a-form-item
            :name="['options', 'customApplicableEntityTypes']"
            class="mb-0"
        >
            <template v-if="internal">
                <div class="flex flex-wrap">
                    <a-tag
                        v-for="(type, x) in typeGroups"
                        :key="x"
                        class="flex items-center justify-center mb-1 bg-gray-200 border-0 rounded h-7"
                        >{{ type }}</a-tag
                    >
                </div>
            </template>
            <a-tree-select
                v-else
                :value="form.options.customApplicableEntityTypes"
                no-results-text="No asset type found"
                style="width: 100%"
                :tree-data="finalApplicableTypeNamesOptions"
                multiple
                :async="false"
                tree-checkable
                :placeholder="'Select asset types'"
                :max-tag-count="5"
                :get-popup-container="(target) => target.parentNode"
                :allow-clear="false"
                check-strictly
                :show-checked-strategy="CHECKEDSTRATEGY"
                show-arrow
                @change="handleApplicableEntityTypeChange"
            >
                <template #suffixIcon>
                    <AtlanIcon icon="CaretDown" class="text-gray-500" />
                </template>
            </a-tree-select>
        </a-form-item>
    </CardWrapper>
</template>

<script setup lang="ts">
    import { TreeSelect } from 'ant-design-vue'
    import { useVModels } from '@vueuse/core'
    import { computed, onMounted, ref, watch } from 'vue'
    import CardWrapper from '@/governance/custom-metadata/propertyDrawer/misc/wrapper.vue'
    import { applicableTypeList } from '~/composables/custommetadata/useApplicableTypes'

    const CHECKEDSTRATEGY = TreeSelect.SHOW_PARENT

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
    })
    const emit = defineEmits([''])

    const { form } = useVModels(props, emit)

    const applicableEntityTypesOptions = applicableTypeList()

    const finalApplicableTypeNamesOptions = computed(() => {
        const options = JSON.parse(JSON.stringify(applicableEntityTypesOptions))
        return options
    })

    const getAllLeafNodes = (node) => {
        const leaf: any = []

        const category = applicableEntityTypesOptions.find(
            (_category) => _category.value === node
        )

        // ? if selection is a category , extract all child leaf
        if (category) {
            category.children.forEach((c) => {
                // ? if child of category has child, then it is a source
                if (c.children) {
                    leaf.push(...c.children.map((leafNode) => leafNode.value))
                    // ? else it is a leaf
                } else leaf.push(c.value)
            })
            // ? if not a category its either a source or a leaf
        } else {
            // ? flatten all node at 2nd level
            const allLeafNodes: any = []
            applicableEntityTypesOptions.forEach((cat) => {
                const leafNodes: any[] = cat.children.reduce((acc, cur) => {
                    if (cur.children) acc.push(...cur.children)
                    else acc.push(cur)
                    return acc
                }, [])
                allLeafNodes.push(...leafNodes)
            })

            allLeafNodes.forEach((_node) => {
                if (_node.value === node || _node.source === node) {
                    leaf.push(_node.value)
                }
            })
        }

        return leaf
    }

    const handleApplicableEntityTypeChange = (data, l, e) => {
        /**
         * Just trying to flatten the the tree given any node, add all leaf node values
         */
        const flatValues: any = []
        data.forEach((item) => {
            flatValues.push(...getAllLeafNodes(item))
        })
        form.value.options.customApplicableEntityTypes = flatValues
    }

    // ? take all type names and group them into SQL, Tableau, SaaS ...
    const typeGroups = computed(() => {
        const applicableTypesGroups = ref<string[]>([])
        let customTypes = JSON.parse(
            JSON.stringify(form.value.options.customApplicableEntityTypes)
        )
        applicableEntityTypesOptions.forEach((cat) => {
            if (!customTypes.length) return
            const allLeafNodes = getAllLeafNodes(cat.value)
            const isAllLeafIncluded = allLeafNodes.every((n) =>
                customTypes.includes(n)
            )
            if (isAllLeafIncluded) {
                applicableTypesGroups.value.push(cat.title)
                customTypes = customTypes.filter(
                    (t) => !allLeafNodes.includes(t)
                )
            }
        })

        const allSources = applicableEntityTypesOptions.reduce((acc, cur) => {
            const sources = cur.children.filter((c) => c.isSource)
            acc.push(...sources)
            return acc
        }, [])

        allSources.forEach((source) => {
            if (!customTypes.length) return
            const allLeafNodes = getAllLeafNodes(source.value)
            const isAllLeafIncluded = allLeafNodes.every((n) =>
                customTypes.includes(n)
            )

            if (isAllLeafIncluded) {
                applicableTypesGroups.value.push(source.title)
                customTypes = customTypes.filter(
                    (t) => !allLeafNodes.includes(t)
                )
            }
        })

        const allLeafNodes: any = []
        applicableEntityTypesOptions.forEach((cat) => {
            const leafNodes: any[] = cat.children.reduce((acc, cur) => {
                if (cur.children) acc.push(...cur.children)
                else acc.push(cur)
                return acc
            }, [])
            allLeafNodes.push(...leafNodes)
        })

        applicableTypesGroups.value.push(
            ...customTypes.map(
                (leaf) => allLeafNodes.find((l) => l.value === leaf).title
            )
        )
        return applicableTypesGroups.value
    })
</script>

<style scoped></style>
