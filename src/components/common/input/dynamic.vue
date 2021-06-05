<template>
  <div>
    <a-input
      :value="modelValue"
      @change="handleChange"
      :placeholder="placeholder"
      v-if="dataType === 'string'"
      :prefix="prefix"
      :suffix="suffix"
    >
    </a-input>
    <a-input-number
      :value="modelValue"
      @change="handleChange"
      :placeholder="placeholder"
      v-if="dataType === 'number'"
      :prefix="prefix"
      :suffix="suffix"
    >
    </a-input-number>
    <a-input-password
      :value="modelValue"
      @change="handleChange"
      :placeholder="placeholder"
      v-if="dataType === 'password'"
      :prefix="prefix"
      :suffix="suffix"
    >
    </a-input-password>
    <a-switch
      :checked="modelValue"
      v-if="dataType === 'boolean'"
      @change="handleChange"
    />

    <a-input-group compact v-if="dataType === 'enum'" class="w-full">
      <a-input
        style="width: 80%"
        :value="modelValue"
        @change="handleChange"
        :placeholder="placeholder"
        v-if="isCustom"
        :prefix="prefix"
        :suffix="suffix"
      >
      </a-input>
      <a-select
        style="width: 80%"
        show-search
        @change="handleChange"
        :value="modelValue"
        :placeholder="placeholder"
        v-if="dataType === 'enum' && !isCustom"
        :options="enumList"
      >
      </a-select>
      <a-button
        style="width: 10%"
        class="px-1"
        v-if="enumAllowCustom"
        @click="handleToggleCustom"
        ><fa icon="fal user-edit"></fa
      ></a-button>
    </a-input-group>
  </div>
</template>
          
  <script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      required: false,
    },
    dataType: {
      type: String,
      required: false,
      default(): string {
        return "";
      },
    },
    placeholder: {
      type: String,
      required: false,
      default(): string {
        return "";
      },
    },
    prefix: {
      type: String,
      required: false,
      default(): string {
        return "";
      },
    },
    suffix: {
      type: String,
      required: false,
      default(): string {
        return "";
      },
    },
    enumList: {
      type: Array,
      required: false,
      default(): any {
        return [];
      },
    },
    defaultValue: {
      required: false,
    },
    enumAllowCustom: {
      type: Boolean,
      required: false,
      default(): boolean {
        return false;
      },
    },
  },
  data() {
    return {
      isCustom: false,
    };
  },
  mounted() {
    if (this.defaultValue) {
      if (this.dataType === "number") {
        this.$emit("update:modelValue", parseInt(this.defaultValue));
      } else {
        this.$emit("update:modelValue", this.defaultValue);
      }
    }
  },
  emits: ["update:modelValue", "change", "blur"],
  methods: {
    handleChange(e) {
      let val = e;
      if (e.target) {
        val = e.target.value;
      }
      if (this.dataType === "number") {
        this.$emit("update:modelValue", parseInt(val));
      } else {
        this.$emit("update:modelValue", val);
      }
      this.$emit("change", val);
    },
    handleToggleCustom() {
      this.isCustom = !this.isCustom;
    },
  },
});
</script>
          
          <style lang="less" module>
</style>
          