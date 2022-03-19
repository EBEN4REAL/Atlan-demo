<template>
    <div class="flex flex-col w-full h-full px-5 py-3 overflow-auto gap-y-3">
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Description</span>

            <div class="flex flex-col">
                <div class="flex mb-2">
                    {{
                        item?.metadata?.annotations[
                            'package.argoproj.io/description'
                        ]
                    }}
                </div>
            </div>
        </div>

        <div class="flex flex-col text-sm" v-if="useCases(item).length > 0">
            <span class="mb-1 text-gray-500">Use cases</span>
            <div class="flex flex-col">
                <span
                    v-for="i in useCases(item)"
                    :key="i"
                    class="flex items-center capitalize"
                >
                    <AtlanIcon icon="Approve" class="mr-1"></AtlanIcon>
                    {{ i }}</span
                >
            </div>
        </div>
        <div class="flex flex-col text-sm" v-if="supportLink(item)">
            <span class="mb-1 text-gray-500">Resources</span>
            <a :href="supportLink(item)" class="text-primary" target="_blank"
                >Documentation</a
            >
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Type</span>
            <div class="flex capitalize">
                {{ item?.metadata.labels['orchestration.atlan.com/type'] }}
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Package Version</span>
            <div class="flex">
                {{ item?.metadata.labels['package.argoproj.io/version'] }}
            </div>
        </div>

        <div
            class="flex flex-col text-sm"
            v-if="
                item?.metadata.annotations[
                    'orchestration.atlan.com/dependentPackage'
                ]
            "
        >
            <span class="mb-1 text-gray-500">Dependent Package</span>
            <div class="flex">
                {{
                    item?.metadata.annotations[
                        'orchestration.atlan.com/dependentPackage'
                    ]
                }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
            AtlanIcon,
        },
        props: {
            item: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const { useCases, supportLink } = useWorkflowInfo()

            return { item, useCases, supportLink }
        },
    })
</script>
