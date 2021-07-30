<template>
    <div class="flex">
        <a-textarea v-model:value="description"></a-textarea>
        <a-button type="primary" class="ml-4" @click="onSubmit">Add Description</a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'

import { Components } from '~/api/atlas/client'

import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'


interface PropsType {
    entity: Components.Schemas.AtlasGlossaryTerm | Components.Schemas.AtlasGlossaryCategory
}

export default defineComponent({
    props: ['entity'],
    emits: ['updateDescription'],
    setup(props: PropsType, context) {
      

        const entity = computed(() => props.entity)
        const description = ref('')
     
        const { data, isLoading, error, updateEntity } = useUpdateGtcEntity(props.entity?.type)

        const onSubmit = () => {
            updateEntity(entity.value.guid, {
                ...entity.value,
                shortDescription: description.value,
                owners: ['nitya']
            })
        }

        watch(data, (newData) => {
            if(newData?.guid){
                context.emit('updateDescription', props.entity?.type)
            }
        })

        return {
          description,
          data, 
          entity,
          onSubmit
        }
    }
})
</script>