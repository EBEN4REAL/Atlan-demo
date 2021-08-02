<template>
  <a-modal
    :visible="visible"
    :title="`Add new ${eventContext.entity}`"
    @cancel="handleCloseModal"
    @ok="handleSubmit"
  >
    <a-input class="m-1" v-model:value="name" placeholder="Name" />
    <a-input
      class="m-1"
      v-model:value="description"
      placeholder="Description"
    />
    <p v-if="showSuccessMessage">
      {{ eventContext.entity }} successfully created
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
      description.value = ""
    };

    let body = ref<Record<string, any>>({});

    watch([name, description], ([newName, newDescription]) => {
      body.value = {
        ...body.value,
        longDescription: "",
        name: newName,
        shortDescription: newDescription,
      };
    });

    watch(
      eventContext,
      async () => {
        if (props.eventContext.parentType === "glossary") {
          body.value = {
            ...body.value,
            anchor: {
              glossaryGuid: props.eventContext.parentGuid,
            },
          };
        }

        if (
          props.eventContext.parentType === "category" &&
          props.eventContext.entity === "category"
        ) {
          const response = await Glossary.GetCategory(
            eventContext.value.parentGuid
          );

          body.value = {
            ...body.value,
            anchor: response?.anchor,
            parentCategory: {
              categoryGuid: response?.guid,
            },
          };
        }
        if (
          props.eventContext.parentType === "category" &&
          props.eventContext.entity === "term"
        ) {
          const response = await Glossary.GetCategory(
            eventContext.value.parentGuid
          );

          body.value = {
            ...body.value,
            anchor: response?.anchor,
            categories: [
              {
                categoryGuid: response?.guid,
              },
            ],
          };
        }
      }
    );

    const handleSubmit = () => {
      const serviceMap: Record<
        string,
        "CreateGlossary" | "CreateGlossaryCategory" | "CreateGlossaryTerm"
      > = {
        glossary: "CreateGlossary",
        category: "CreateGlossaryCategory",
        term: "CreateGlossaryTerm",
      };
      const service = serviceMap[props.eventContext.entity];

      const { data, error, isLoading } = Glossary[service](body.value, body);

      watch([data, error, isLoading], ([newData, newError, newLoading]) => {
        entity.value = newData;
        error.value = newError;
        isLoading.value = newLoading;

        name.value = "";
        description.value = "";

        if (entity.value) {
          showSuccessMessage.value = true;
          emit("success");
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