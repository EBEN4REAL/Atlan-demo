<template>
  <div class="my-8">
    <h2 class="text-xl leading-7">Coninue Setting up GLossary</h2>
    <a-tabs default-active-key="1" @change="callback" class="border-0">
      <a-tab-pane key="1" tab="Add Owners">
        Add Owners
        <br />
        {{ missingOwners }}
      </a-tab-pane>
      <a-tab-pane key="2" tab="Add Descriptions">
        Add Descriptions
        <br />
        {{ missingDescription }}
      </a-tab-pane>
      <a-tab-pane key="3" tab="Link Assets">
        Link Assets
        <br />
        {{ missingLinkedAssets }}
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, Component } from "vue";

import { Components } from "~/api/atlas/client";

interface PropsType {
  terms: Components.Schemas.AtlasGlossaryTerm[];
  categories: Components.Schemas.AtlasGlossaryCategory[];
}

export default defineComponent({
  props: ["terms", "categories"],
  setup(props: PropsType) {
    const categories = computed(() => props.categories ?? []);
    const terms = computed(() => props.terms ?? []);

    const missingDescription = computed(() => {
      const entities = [...terms.value, ...categories.value];
      return entities.filter((entity) => !entity.shortDescription);
    });

    const missingLinkedAssets = computed(() => {
      return terms.value.filter((term) => !term.assignedEntities?.length);
    });

    const missingOwners = computed(() => {
      return [...terms.value, ...categories.value].filter(
        (entity) => !entity?.owners?.length
      );
    });

    return {
      categories,
      terms,
      missingDescription,
      missingLinkedAssets,
      missingOwners,
    };
  },
});
</script>