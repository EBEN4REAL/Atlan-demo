<template>
  <div class="p-6 bg-white border rounded shadow-sm">
    <p class="mb-0 text-xl tracking-wide text-gray-900">Delete Connection</p>
    <p class="text-gray-500">
      Permanently delete all data, assets, workflows, credentials for this
      connections
    </p>
    <a-button
      type="default"
      class="text-white bg-red-500 border-red-500"
      :loading="isReady"
      @click="handleDelete"
      >Delete this Connection</a-button
    >
  </div>
</template>
  
<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { Modal } from "ant-design-vue";
import { defineComponent, PropType, ref } from "vue";
import deleteConnection from "~/composables/connection/deleteConnection";
import { ConnectionType } from "~/types/atlas/connection";

export default defineComponent({
  components: {},
  mixins: [],
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    console.log(props.item.guid);

    const id = ref(props.item.guid);
    const { execute, res, isReady } = deleteConnection(id.value, {
      immediate: false,
    });

    const handleDelete = () => {
      id.value = props.item.guid;
      Modal.confirm({
        okType: "danger",
        maskClosable: true,
        title: "Are you sure you want to permanently delete the connection?",
        onOk() {
          execute();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    };

    return { res, execute, handleDelete, isReady };
  },
  mounted() {},
});
</script>