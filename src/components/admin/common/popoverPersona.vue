<template>
    <div>
        <a-popover
            v-if="personas?.length"
            placement="bottom"
            :destroy-tooltip-on-hide="true"
        >
            <template #content>
                <div class="p-3 pb-4 content-popover-group-persona">
                    <div class="flex justify-between">Personas</div>
                    <div
                        class="flex flex-wrap max-w-xs gap-2 mt-3 overflow-auto max-h-32"
                    >
                        <router-link
                            v-for="persona in personas"
                            :key="persona.id"
                            :to="`/governance/personas/${persona.id}`"
                        >
                            <div
                                class="px-2 border border-gray-300 cursor-pointer rounded-xl"
                            >
                                {{ persona.name }}
                            </div>
                        </router-link>
                    </div>
                    <!-- <div
                        v-if="personasComputed.length < personas.length"
                        class="w-16 p-1 mt-3 ml-auto mr-auto text-xs text-center cursor-pointer w-fit text-primary"
                        @click="sliceCount = sliceCount + 3"
                    >
                        more
                    </div> -->
                </div>
            </template>
            <div class="text-left cursor-pointer text-primary">
                {{
                    personas?.length > 1
                        ? personas?.length + ' personas'
                        : personas?.length + ' persona' || '-'
                }}
            </div>
        </a-popover>
        <div v-else class="text-left cursor-pointer text-primary">-</div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, computed } from 'vue'

    export default defineComponent({
        name: 'PopoverPersonaUser',
        components: {},
        props: {
            personas: { type: Array, required: true },
        },
        emits: [],
        setup(props) {
            const { personas } = toRefs(props)
            const sliceCount = ref(3)
            const personasComputed = computed(() =>
                personas.value.slice(0, sliceCount.value)
            )
            return { personasComputed, sliceCount }
        },
    })
</script>
