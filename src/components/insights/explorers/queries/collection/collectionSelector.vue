<template>
    <!-- default-value="lucy"  -->
    <a-select
        style="width: 200px"
        @change="handleChange"
        v-model:value="selectedValue"
    >
        <!-- <a-select-opt-group> -->
        <!-- <template #label>
                <div class="">
                    <AtlanIcon :icon="'UserLight'" class=""></AtlanIcon>
                    Private
                </div>
            </template> -->
        <a-select-option
            v-for="collection in queryCollections"
            :key="collection?.guid"
            :value="collection?.guid"
        >
            {{ collection.attributes.name }}
        </a-select-option>
        <!-- </a-select-opt-group> -->
        <!-- <a-select-opt-group label="Public">
            <a-select-option value="Yiminghe"> yiminghe </a-select-option>
        </a-select-opt-group> -->
    </a-select>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        Ref,
        toRefs,
        PropType,
        ComputedRef,
        inject,
    } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import {
        SavedQuery,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        emits: ['update:data'],
        components: { AtlanIcon },
        setup(props, { emit }) {
            const selectedValue = ref()
            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            selectedValue.value = activeInlineTab.value.explorer.queries
                .collection
                ? activeInlineTab.value.explorer.queries.collection.guid
                : ''

            console.log('connection selector', queryCollections.value)

            function handleChange(collectionId: string) {
                const collection = queryCollections.value?.find(
                    (coll) => coll.guid === collectionId
                )
                const data = {
                    qname: collection?.attributes.qualifiedName,
                    guid: collectionId,
                }
                console.log('collection selected', data)
                emit('update:data', data)
            }
            return {
                handleChange,
                queryCollections,
                selectedValue,
            }
        },
    })
</script>
