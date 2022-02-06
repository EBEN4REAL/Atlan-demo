<template>
    <div class="flex px-3 bg-white">
        {{ persona }}
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import usePersonaInfo from '~/composables/persona/usePersonaInfo'
    import { usePersonaStore } from '~/store/persona'

    export default defineComponent({
        name: 'ContextModal',
        props: {
            context: {
                type: Array,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { context } = toRefs(props)

            const personaStore = usePersonaStore()

            const contextType = computed(() => {
                if (context.value.length > 0) {
                    return context.value[0]
                }
                return ''
            })

            const contextValue = computed(() => {
                if (context.value.length > 1) {
                    return context.value[1]
                }
                return ''
            })

            const persona = computed(() => {
                return personaStore.list.find((i) => {
                    i.id === contextValue.value
                })
            })

            const { name } = usePersonaInfo()

            return {
                context,
                contextType,
                contextValue,
                persona,
                personaStore,
                name,
            }
        },
    })
</script>
