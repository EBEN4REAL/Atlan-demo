<template>
    <div class="flex">
        <a-textarea v-model:value="description"></a-textarea>
        <a-button type="primary" class="ml-4" @click="onSubmit">Add Description</a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import { Components } from '~/api/atlas/client'


interface PropsType {
    entity: Components.Schemas.AtlasGlossaryTerm | Components.Schemas.AtlasGlossaryCategory
}

export default defineComponent({
    props: ['entity'],
    setup(props: PropsType) {
      

        const entity = computed(() => {
           return props.entity
        })
        const description = ref('')
     
        const onSubmit = () => {

        }

        return {
          description,
          entity,
          onSubmit
        }
    }
})
</script>