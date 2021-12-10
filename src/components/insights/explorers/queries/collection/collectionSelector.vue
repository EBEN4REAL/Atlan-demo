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

    export default defineComponent({
        emits: ['change', 'update:data'],
        components: { AtlanIcon },
        setup(props, { emit }) {
            const selectedValue = ref()
            const queryCollections = inject(
                'queryCollections'
            ) as ComputedRef<any>
            console.log('connection selector', queryCollections.value)

            function handleChange(collectionId: string) {
                emit('update:data', collectionId)
            }
            return {
                handleChange,
                queryCollections,
                selectedValue,
            }
        },
    })
</script>
