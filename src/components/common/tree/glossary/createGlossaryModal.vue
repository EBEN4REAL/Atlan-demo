<template>
  <a-modal
    :visible="visible"
    :title="`Add new ${eventContext.entity}`"
    @cancel="handleCloseModal"
    @ok="handleSubmit"
  >
    <a-input v-model:value="name" placeholder="Name" />
    <a-input v-model:value="description" placeholder="Description" />
    <p v-if="entity">{{eventContext.entity}} successfully created</p>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  ref,
  watch,
} from "vue";

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

    let body = ref<Record<string, any>>({});

    watch(eventContext, async () => {
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
    });

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

      body.value = {
        longDescription: "",
        name: name.value,
        shortDescription: description.value,
        ...body.value,
      };

      // use eventContext.parentGuid to fetch parent object

      // Create Glossary -> nothing just make one

      // Create Category
      // add glossaryGuid as anchor from parent Object anchor
      // if eventContext.parenttype === category:
      // add parentGuid as parentCategory
      // if eventContext.parenttype === glossary:
      // do nothing

      // Create Term
      // add glossaryGuid as anchor from parent Object anchor
      // if eventContext.parenttype === category:
      // add parentGuid as CategoryGuid
      // if eventContext.parenttype === glossary:
      // do nothing

      const { data, error, isLoading } = Glossary[service](body.value, body);

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