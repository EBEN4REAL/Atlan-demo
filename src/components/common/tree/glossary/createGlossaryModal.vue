<template>
  <a-modal
    :visible="visible"
    :title="`Add new ${eventContext.entity}`"
    @cancel="handleCloseModal"
    @ok="handleSubmit"
  >
    <a-input v-model:value="name" placeholder="Name" />
    <a-input v-model:value="description" placeholder="Description" />
    {{ entity }}
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, ref, watch } from "vue";

import { Components } from "~/api/atlas/client";

import { Glossary } from "~/api/atlas/glossary";

export default defineComponent({
  props: {
    eventContext: {
      type: Object,
      required: true,
      default: () => {},
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ["closeModal"],
  setup(props, { emit }) {
    const { visible, eventContext } = toRefs(props);

    const entity = ref<Components.Schemas.AtlasGlossary>();
    const error = ref<any>(null);
    const isLoading = ref<boolean>(false);

    const name = ref<string>("");
    const description = ref<string>("");

    const handleCloseModal = () => {
      emit("closeModal");
    };

    const handleSubmit = () => {
      const serviceMap: Record<string, 'CreateGlossary'> = {
        glossary: "CreateGlossary",
      };
      const service = serviceMap[props.eventContext.entity];

      const { data, error, isLoading } = Glossary[service]({
        longDescription: "",
        name: name.value,
        shortDescription: description.value,
      });

      watch([data, error, isLoading], ([newData, newError, newLoading]) => {
        entity.value = newData;
        error.value = newError;
        isLoading.value = newLoading;
      });
    };

    return {
      visible,
      eventContext,
      entity,
      error,
      isLoading,
      name,
      description,
      handleCloseModal,
      handleSubmit,
    };
  },
});
</script>