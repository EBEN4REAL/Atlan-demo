<template>
    <a-menu>
      <a-menu-item v-if="showGlossary" key="Glossary">
        Add new glossary
      </a-menu-item>
      <a-menu-item v-if="showCategoryTerm" key="Category">
        Add new category
      </a-menu-item>
      <a-menu-item v-if="showCategoryTerm" key="Term">
        Add new term
      </a-menu-item>
      <a-menu-item v-if="!showGlossary" key="Update">
        Update {{ type }}
      </a-menu-item>
      <a-menu-item v-if="!showGlossary" key="Term">
       <span class="text-red-500"> Delete {{ type }}</span>
      </a-menu-item>

    </a-menu>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: ["type"],
    setup(props){
        const showGlossary = computed(() => props.type === 'root');
        const showCategoryTerm = computed(() => props.type === 'glossary' || props.type === 'category');

        return {
            showGlossary,
            showCategoryTerm
        }
    }
})
</script>