<template>
  <a-modal
    :visible="visible"
    :title="`Update ${eventContext.entity}`"
    @cancel="handleCloseModal"
    @ok="handleSubmit"
  >
    <a-input v-model:value="name" class="m-1" placeholder="Name" />
    <a-input
      v-model:value="description"
      class="m-1"
      placeholder="Description"
    />
    <p v-if="showSuccessMessage">
      {{ eventContext.entity }} successfully updated!
    </p>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from "vue";

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
  emits: ["closeModal", "success"],
  setup(props, { emit }) {
    const { visible, eventContext } = toRefs(props);

    const entity =
      ref<
        | Components.Schemas.AtlasGlossary
        | Components.Schemas.AtlasGlossaryCategory
        | Components.Schemas.AtlasGlossaryTerm
      >();
    const error = ref<any>(null);
    const isLoading = ref<boolean>(false);

    const name = ref<string>("");
    const description = ref<string>("");

    const showSuccessMessage = ref(false);

    const handleCloseModal = () => {
      emit("closeModal");
      name.value = "";
      description.value = "";
    };

    const body = ref<Record<string, any>>({});

    watch(eventContext, async (newContext) => {
      switch (newContext.parentType) {
        case "glossary":
          entity.value = await Glossary.GetGlossary(newContext.parentGuid);
          break;
        case "category":
          entity.value = await Glossary.GetCategory(newContext.parentGuid);
          break;
        case "term":
          entity.value = await Glossary.GetTerm(newContext.parentGuid);
          break;
      }
    });

    watch(entity, (newEntity) => {
      name.value = newEntity?.name ?? name.value;
      description.value = newEntity?.shortDescription ?? description.value;
    });

    watch(
      [eventContext, name, description],
      async ([newContext, newName, newDescription]) => {
        body.value = {
          longDescription: "",
          name: newName,
          shortDescription: newDescription,
        };
      }
    );

    const handleSubmit = () => {
      const serviceMap: Record<
        string,
        "UpdateGlossary" | "UpdateGlossaryCategory" | "UpdateGlossaryTerm"
      > = {
        glossary: "UpdateGlossary",
        category: "UpdateGlossaryCategory",
        term: "UpdateGlossaryTerm",
      };
      const service = serviceMap[props.eventContext.entity];
      const { data, error, isLoading } = Glossary[service](
        props.eventContext.parentGuid,
        body.value as Record<string, any>
      );

      watch([data, error, isLoading], ([newData, newError, newLoading]) => {
        entity.value = newData;
        error.value = newError;
        isLoading.value = newLoading;

        name.value = "";
        description.value = "";

        if (entity.value) {
          emit("success");
          showSuccessMessage.value = true;
          setTimeout(() => {
            showSuccessMessage.value = false;
            emit("closeModal");
          }, 2000);
        }
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
      showSuccessMessage,
      handleCloseModal,
      handleSubmit,
    };
  },
});
</script>