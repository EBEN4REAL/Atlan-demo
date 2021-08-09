<template>
  <div>
    <a-input
      v-if="dataType === 'string'"
      :value="modelValue"
      :placeholder="placeholder"
      :prefix="prefix"
      :suffix="suffix"
      @change="handleChange"
    >
    </a-input>
    <a-input-number
      v-if="dataType === 'number'"
      :value="modelValue"
      :placeholder="placeholder"
      :prefix="prefix"
      :suffix="suffix"
      @change="handleChange"
    >
    </a-input-number>
    <a-input-password
      v-if="dataType === 'password'"
      :value="modelValue"
      :placeholder="placeholder"
      :prefix="prefix"
      :suffix="suffix"
      @change="handleChange"
    >
    </a-input-password>
    <a-switch
      v-if="dataType === 'boolean'"
      :checked="modelValue"
      @change="handleChange"
    />

    <a-input-group v-if="dataType === 'enum'" compact class="w-full">
      <a-input
        v-if="isCustom"
        style="width: 80%"
        :value="modelValue"
        :placeholder="placeholder"
        :prefix="prefix"
        :suffix="suffix"
        @change="handleChange"
      >
      </a-input>
      <a-select
        v-if="dataType === 'enum' && !isCustom"
        style="width: 80%"
        show-search
        :value="modelValue"
        :placeholder="placeholder"
        :options="enumList"
        @change="handleChange"
      >
      </a-select>
      <a-button
        v-if="enumAllowCustom"
        style="width: 10%"
        class="px-1"
        @click="handleToggleCustom"
        ><fa icon="fal user-edit"></fa
      ></a-button>
    </a-input-group>
    <UserSelector v-if="dataType === 'users'"></UserSelector>
  </div>
</template>
          
<script lang="ts">
import { defineComponent, PropType } from "vue";
import UserSelector from "@common/selector/users/index.vue";

export default defineComponent({
  components: {
    UserSelector,
  },
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
  emits: ["update:modelValue", "change", "blur"],
  data() {
    return {
      isCustom: false,
    };
  },
  mounted() {
    // if (this.defaultValue) {
    //   if (this.dataType === "number") {
    //     this.$emit("update:modelValue", parseInt(this.defaultValue));
    //   } else {
    //     this.$emit("update:modelValue", this.defaultValue);
    //   }
    // }
  },
  methods: {
    handleChange(e) {
      console.log("changed");
      console.log(this.modelValue);
      let val = e;
      if (e.target) {
        val = e.target.value;
      }
      console.log(val);
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