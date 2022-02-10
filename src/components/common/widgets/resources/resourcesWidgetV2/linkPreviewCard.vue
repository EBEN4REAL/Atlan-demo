<template>
    <div
        class="flex justify-between p-2 border rounded cursor-pointer hover:bg-gray-100"
    >
        <div
            class="flex items-center flex-1"
            @click="openLink(link.attributes.link)"
        >
            <div class="mr-2 min-w-link-left-col">
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
                    class=""
                    style="max-width: 32px; max-height: 32px"
                    @error="defaultIcon = true"
                />
            </div>
            <div class="flex flex-col w-full">
                <a
                    :href="`${link.attributes.link}`"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Tooltip
                        :tooltip-text="
                            link.attributes.name || link.attributes.link
                        "
                        classes="hover:text-primary font-bold cursor-pointer hover:underline"
                    />
                </a>
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
                            new Date(link.attributes.__modificationTimestamp)
                        ).value
                    }}
                </div>
                <div v-else class="text-xs text-gray-500">
                    Added by {{ link.attributes.__createdBy }}
                    {{
                        useTimeAgo(new Date(link.attributes.__timestamp)).value
                    }}
                </div>
            </div>
        </div>
        <div v-if="!readOnly">
            <CardActions v-bind="props">
                <div>
                    <AtlanIcon
                        icon="KebabMenu"
                        class="h-4 m-0 cursor-pointer hover:text-primary"
                    />
                </div>
            </CardActions>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType, ref, provide, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { getDomain } from '~/utils/url'
    import { Link } from '~/types/resources.interface'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CardActions from '@/common/widgets/resources/resourcesWidgetV2/misc/cardActionMenu.vue'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
    })

    const defaultIcon = ref(false)

    const openLink = (url) => {
        if (url) window.open(url)
    }
</script>

<style scoped></style>
