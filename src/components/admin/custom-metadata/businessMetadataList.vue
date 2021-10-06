<template>
    <div
        v-for="item in finalList"
        :key="item.guid"
        class="p-3 rounded cursor-pointer"
        :class="{ 'bg-gray-200': selectedBm?.guid === item.guid }"
        @click="(e) => selectBm(item)"
    >
        <p
            class="m-0 text-sm font-bold"
            :class="
                selectedBm?.guid === item.guid ? 'text-primary' : 'text-gray'
            "
        >
            <!-- // TODO {{ isUpdateBmSameAsCurrentBm(item) ? updatedBm.displayName  : item.displayName }} -->
            {{
                isUpdateBmSameAsCurrentBm(item)
                    ? updatedBm.options && updatedBm.options.displayName
                    : item.options.displayName || item.name
            }}
            <sup
                v-if="
                    isUpdateBmSameAsCurrentBm(item) ||
                    (item && item.guid === 'new')
                "
            >
                *
            </sup>
        </p>
        <span class="text-xs text-gray"
            >{{
                isUpdateBmSameAsCurrentBm(item)
                    ? updatedBm.attributeDefs.length || 0
                    : item.attributeDefs.length || 0
            }}
            attribute(s)</span
        >
    </div>
</template>
<script lang="ts">
    import { computed, defineComponent } from 'vue'

    export default defineComponent({
        props: ['finalList', 'selectedBm', 'updatedBm'],
        setup(props, context) {
            /**
             *
             */
            const isUpdateBmSameAsCurrentBm = (item: { guid: string }) => {
                if (
                    item &&
                    props.updatedBm &&
                    props.updatedBm.guid &&
                    props.updatedBm.guid === item.guid
                ) {
                    return true
                }
                return false
            }

            // * Methods
            const selectBm = (item: object) => context.emit('selectBm', item)

            // * Computed
            const finalList = computed(() => props.finalList)
            const selectedBm = computed(() => props.selectedBm)
            const updatedBm = computed(() => props.updatedBm)
            return {
                finalList,
                selectedBm,
                updatedBm,
                isUpdateBmSameAsCurrentBm,
                selectBm,
            }
        },
    })
</script>
