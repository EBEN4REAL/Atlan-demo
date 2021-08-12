<template>
  <div class="flex flex-row py-4 pl-6 rounded border-b" @click="$emit('gtcCardClicked', entity)">
    <div><img v-if="entity.typeName === 'AtlasGlossary'" :src="GlossarySvg" />
    <img v-else-if="entity.typeName === 'AtlasGlossaryCategory'" :src="CategorySvg" :width="25" />
    <img v-else-if="entity.typeName === 'AtlasGlossaryTerm'" :src="TermSvg" /></div>
    
    <div class="flex flex-col ml-4">
      <h3 class="text-sm leading-5 text-gray-500">
        <a-button class="m-0 p-0" type="link" @click="redirectToProfile">{{  entity.displayText }}</a-button>
      </h3>
      <div class="text-xs leading-4 text-gray">
        {{ entity?.attributes?.shortDescription }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRouter } from 'vue-router'

import TermSvg from "~/assets/images/gtc/term/term.png";
import CategorySvg from "~/assets/images/gtc/category/category.png";
import GlossarySvg from "~/assets/images/gtc/glossary/glossary.png";

export default defineComponent({
  props: ["entity"],
  emits: ['gtcCardClicked'],
  setup(props) {
    const entity = computed(() => props.entity);

    const router = useRouter();

    const redirectToProfile = () => {
            if (entity.value.typeName === 'AtlasGlossary') router.push(`/glossary/${entity.value.guid}`)
            else if(entity.value.typeName === 'AtlasGlossaryCategory') router.push(`/glossary/category/${entity.value.guid}`)
            else if(entity.value.typeName === 'AtlasGlossaryTerm') router.push(`/glossary/term/${entity.value.guid}`)
    }
    return {
      entity,
      TermSvg,
      GlossarySvg,
      CategorySvg,
      redirectToProfile
    };
  },
});
</script>