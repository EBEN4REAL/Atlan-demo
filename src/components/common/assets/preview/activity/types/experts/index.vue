<template>
    <PillGroup :data="data">
        <template #header
            ><p>
                Say <span class="mr-2">👋</span>Hello, to the new

                <b>{{ data.value.length > 1 ? 'Experts' : 'Expert' }}</b>
            </p></template
        >
        <template #pill-content="user">
            <Pill :label="user.item"
                ><template #prefix>
                    <avatar
                        v-if="user.item"
                        class="-ml-2.5"
                        :image-url="
                            map.GET_AVATAR({
                                username: user.item,
                            })
                        "
                        :allow-upload="false"
                        :avatar-name="user.item"
                        avatar-size="small"
                        :avatar-shape="'circle'"
                    />
                </template>
            </Pill>
        </template>
    </PillGroup>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import PillGroup from '../activityPillGroup/index.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { map } from '~/services/service/avatar/key'

    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'ExpertActivity',

        components: {
            PillGroup,
            Pill,
            Avatar,
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup() {
            return {
                map,
            }
        },
    })
</script>
