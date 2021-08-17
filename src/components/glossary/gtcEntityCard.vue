<template>
  <div class="flex flex-row py-4 pl-9 rounded border-b" @click="$emit('gtcCardClicked', entity)">
    <div class="mr-4"><img v-if="entity.typeName === 'AtlasGlossary'" :src="GlossarySvg" />
    <img v-else-if="entity.typeName === 'AtlasGlossaryCategory'" :src="CategorySvg" :width="25" />
    <img v-else-if="entity.typeName === 'AtlasGlossaryTerm'" :src="TermSvg" /></div>
    
    <div class="flex flex-col ml-1">
      <span class="text-base leading-5 text-gray-700 cursor-pointer" @click="redirectToProfile">
        {{  entity.displayText }}  
          <component
            :is="statusObject?.icon"
            v-if="statusObject && projection.includes('status')"
            class="inline-flex self-center w-auto h-4 mb-1"
          />    
      </span>

      <div v-if="projection.includes('description')" class="text-sm leading-5 text-gray-500">
        {{ entity?.attributes?.shortDescription }}
      </div>
      <div v-if="projection.includes('owners')" class="text-xs leading-4 text-gray">
        {{ entity?.attributes?.ownerUsers?.split(',') }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { useRouter } from 'vue-router'

import TermSvg from "~/assets/images/gtc/term/term.png";
import CategorySvg from "~/assets/images/gtc/category/category.png";
import GlossarySvg from "~/assets/images/gtc/glossary/glossary.png";

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'

import { List as StatusList } from '~/constant/status'

export default defineComponent({
  props: {
    entity: {
      type: Object as PropType<Glossary | Category | Term>,
      required: true,
      default: () => {}
    },
    projection: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => ['description']
    }
  },
  emits: ['gtcCardClicked'],
  setup(props) {
    const router = useRouter();
    const statusObject = computed(() => StatusList.find((status) => status.id === props.entity?.attributes?.assetStatus))

    const redirectToProfile = () => {
            if (props.entity.typeName === 'AtlasGlossary') router.push(`/glossary/${props.entity.guid}`)
            else if(props.entity.typeName === 'AtlasGlossaryCategory') router.push(`/glossary/category/${props.entity.guid}`)
            else if(props.entity.typeName === 'AtlasGlossaryTerm') router.push(`/glossary/term/${props.entity.guid}`)
    }
    return {
      TermSvg,
      GlossarySvg,
      CategorySvg,
      statusObject,
      redirectToProfile
    };
  },
});
</script>