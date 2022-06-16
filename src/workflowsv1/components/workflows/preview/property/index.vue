<template>
    <div class="flex flex-col w-full px-5 py-4 overflow-auto gap-y-4">
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Description</span>
            <div class="flex">
                {{
                    item?.metadata?.annotations[
                        'package.argoproj.io/description'
                    ]
                }}
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

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Type</span>
            <div class="flex capitalize">
                {{ item?.metadata.labels['orchestration.atlan.com/type'] }}
            </div>
        </div>

        <div class="flex flex-col text-sm" v-if="docsUrl(item)">
            <span class="mb-1 text-gray-500">Documentation</span>
            <a
                :href="docsUrl(item)"
                class="text-primary hover:underline"
                target="_blank"
                @click="docLinkClicked"
                >{{
                    item?.metadata?.annotations['orchestration.atlan.com/name']
                }}
                Docs</a
            >
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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
            const { useCases, docsUrl, packageName } = useWorkflowInfo()

            const docLinkClicked = () => {
                useAddEvent(
                    'marketplace',
                    'package_documentation_link',
                    'clicked',
                    {
                        packageId: packageName(item.value),
                        packageName:
                            item.value?.metadata?.annotations[
                                'orchestration.atlan.com/name'
                            ],
                        docLink: docsUrl(item.value),
                    }
                )
            }

            return { item, useCases, docsUrl, docLinkClicked }
        },
    })
</script>
