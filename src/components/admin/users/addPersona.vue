<template>
    <a-popover
        v-model:visible="showPersonaPopover"
        placement="bottom"
        :trigger="['click']"
        :destroy-tooltip-on-hide="true"
        :overlay-class-name="$style.personaPopover"
        :align="{ offset: [-40, -85] }"
    >
        <template #content>
            <div class="">
                <PersonaList
                    class="py-2 persona-list"
                    :selected-personas="selectedPersonas"
                />
            </div>
            <div class="flex justify-end mr-3">
                <a-button
                    type="text"
                    size="sm"
                    padding="compact"
                    :disabled="addPersonaLoading"
                    :is-loading="addPersonaLoading"
                    @click="handleCancel"
                >
                    Cancel
                </a-button>
                <AtlanButton
                    :is-loading="addPersonaLoading"
                    type="primary"
                    size="sm"
                    padding="compact"
                    :disabled="addPersonaLoading"
                    @click="addPersonas"
                >
                    <div class="flex items-center">
                        <div v-if="!addPersonaLoading">Add</div>
                        <div v-else>Adding</div>
                    </div>
                </AtlanButton>
            </div>
        </template>
        <div
            class="flex items-center px-1.5 py-1 cursor-pointer justify-between"
        >
            <span>
                <AtlanIcon class="mr-2" icon="Add" />
                Add to persona
            </span>
            <AtlanIcon icon="ChevronRight" class="ml-3" />
        </div>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import PersonaList from '@/common/popover/persona/personaList.vue'
    import { Users } from '~/services/service/users'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'AddPersonasUser',
        components: {
            AtlanButton,
            PersonaList,
        },
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
        emits: ['groupAdded'],
        setup(props, { emit }) {
            const { user } = toRefs(props)
            const showPersonaPopover = ref(false)
            const addPersonaLoading = ref(false)
            const selectedPersonas = ref([])
            watch(showPersonaPopover, () => {
                if (showPersonaPopover.value) {
                    const personaUser = JSON.parse(
                        JSON.stringify(user.value?.personas)
                    )
                    selectedPersonas.value = personaUser
                }
            })

            const addPersonas = async () => {
                showPersonaPopover.value = false
            }
            // eslint-disable-next-line no-return-assign
            const handleCancel = () => (showPersonaPopover.value = false)
            return {
                addPersonaLoading,
                addPersonas,
                handleCancel,
                showPersonaPopover,
                selectedPersonas,
            }
        },
    })
</script>

<style lang="less" module>
    .personaPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
