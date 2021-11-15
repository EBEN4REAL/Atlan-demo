<template>
    <div>
        <p class="mb-1 text-sm text-gray-500">Classification Details</p>
        <div class="flex flex-col pl-3 border-l-2 border-gray-300">
            <div class="flex items-center text-gray-500 gap-x-1">
                <AtlanIcon icon="Shield" /> Classification
            </div>
            <span class="text-base font-bold overflow-ellipsis text-gray"
                >{{
                    classification?.displayName ||
                    classification?.typeName ||
                    classification?.name
                }}
            </span>
            <span class="text-sm text-gray-500 overflow-ellipsis"
                >{{ classification?.description }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'
    import { useClassificationStore } from '~/components/admin/classifications/_store'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<Record<string, any>>,
                default: () => {},
            },
            typeName: { type: String, default: () => '' },
        },
        components: {},
        setup(props) {
            const { data, typeName } = toRefs(props)
            const classificationsStore = useClassificationStore()

            const classification = computed(() =>
                typeName.value
                    ? classificationsStore.classifications.find(
                          (clsf) => clsf.name === typeName.value
                      )
                    : {
                          ...data.value,
                          typeName: data.value.name,
                      }
            )

            return { classification }
        },
    })
</script>
