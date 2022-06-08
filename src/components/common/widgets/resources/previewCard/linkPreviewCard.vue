<template>
    <div
        class="flex flex-col flex-grow p-2 overflow-hidden border rounded cursor-pointer hover:bg-gray-100"
        :class="shouldHighlight ? 'animate-yellow' : ''"
    >
        <div class="flex justify-between flex-grow h-full overflow-hidden">
            <div
                class="flex items-center flex-1 overflow-hidden"
                style=""
                @click="openLink(link.attributes.link)"
            >
                <div class="flex items-center w-10 mr-1">
                    <div class="">
                        <AtlanIcon
                            v-if="defaultIcon || link.attributes.link === ''"
                            icon="Link"
                            class="w-auto h-7"
                        />

                        <img
                            v-else
                            :src="
                                getDomain(link.attributes.link) !== 'atlan.com'
                                    ? `https://www.google.com/s2/favicons?domain=${getDomain(
                                          link.attributes.link
                                      )}&sz=64`
                                    : '/ico.ico'
                            "
                            alt=""
                            class="w-8"
                            style=""
                            @error="defaultIcon = true"
                        />
                    </div>
                </div>
                <div class="flex flex-col w-full overflow-hidden">
                    <Tooltip
                        :tooltip-text="
                            link.attributes.name || link.attributes.link
                        "
                        classes="hover:text-primary font-bold cursor-pointer hover:underline"
                    />
                    <div
                        v-if="
                            link.attributes.__modifiedBy &&
                            link.attributes.__modificationTimestamp
                        "
                        class="text-xs text-gray-500"
                    >
                        Edited by {{ link.attributes.__modifiedBy }}
                        {{
                            useTimeAgo(
                                new Date(
                                    link.attributes.__modificationTimestamp
                                )
                            ).value
                        }}
                    </div>
                    <div v-else class="text-xs text-gray-500">
                        Added by {{ link.attributes.__createdBy }}
                        {{
                            useTimeAgo(new Date(link.attributes.__timestamp))
                                .value
                        }}
                    </div>
                </div>
            </div>
            <div v-if="!readOnly">
                <CardActions :actions="actions" v-bind="props">
                    <div>
                        <AtlanIcon
                            icon="KebabMenu"
                            class="h-4 m-0 cursor-pointer hover:text-primary"
                        />
                    </div>
                </CardActions>
            </div>
        </div>
        <slot name="subtitle" />
    </div>
</template>

<script setup lang="ts">
    import { PropType, ref, computed, toRefs, inject } from 'vue'
    import { useTimeAgo, whenever } from '@vueuse/core'
    import { getDomain } from '~/utils/url'
    import { Link } from '~/types/resources.interface'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CardActions from '@/common/widgets/resources/misc/cardActionMenu.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { resourceId } from '~/composables/integrations/slack/useAskAQuestion'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
        assetType: {
            type: String,
            required: false,
            default: '',
        },
        actions: {
            type: Array,
            required: false,
        },
    })

    const defaultIcon = ref(false)
    const readOnly = inject('readOnly')
    const { link } = toRefs(props)

    const openLink = (url) => {
        if (url) window.open(url)
        useAddEvent('discovery', 'resource', 'clicked', {
            resource_url_domain: url.split('/')[2],
            asset_type: props.assetType,
        })
    }

    const shouldHighlight = computed(() => resourceId.value === link.value.guid)

    whenever(
        shouldHighlight,
        () => {
            setTimeout(() => {
                resourceId.value = ''
            }, 3000)
        },
        { immediate: true }
    )
</script>

<style lang="less" scoped>
    .animate-yellow {
        animation: animateYellow 3s ease;
    }
    @keyframes animateYellow {
        0% {
            @apply bg-yellow-100;
        }
        20% {
            @apply bg-yellow-100;
        }
        100% {
            @apply bg-white;
        }
    }
</style>
