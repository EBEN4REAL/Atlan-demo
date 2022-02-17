<template>
    <div class="p-2 border rounded cursor-pointer hover:bg-gray-100">
        <div class="flex justify-between h-full">
            <div
                class="flex items-center flex-1"
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
        <slot name="subtitle" />
    </div>
</template>

<script setup lang="ts">
    import { PropType, ref, provide, toRefs, inject } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { getDomain } from '~/utils/url'
    import { Link } from '~/types/resources.interface'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CardActions from '@/common/widgets/resources/misc/cardActionMenu.vue'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
    })

    const defaultIcon = ref(false)

    const readOnly = inject('readOnly')

    const openLink = (url) => {
        if (url) window.open(url)
    }
</script>

<style scoped></style>
