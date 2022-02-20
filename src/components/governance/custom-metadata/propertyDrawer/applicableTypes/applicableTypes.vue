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
            <a-tree-select
                :disabled="internal"
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
                class=""
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
    import { computed } from 'vue'
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
            const allSourceAndLeaf: any = []
            applicableEntityTypesOptions.forEach((cat) => {
                const sourceAndLeaf: any[] = cat.children.reduce((acc, cur) => {
                    if (cur.children) acc.push(...cur.children)
                    else acc.push(cur)
                    return acc
                }, [])
                allSourceAndLeaf.push(...sourceAndLeaf)
            })

            allSourceAndLeaf.forEach((_node) => {
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
</script>

<style scoped></style>
