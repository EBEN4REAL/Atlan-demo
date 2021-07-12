<template>
  <div class="px-3 border border-gray-200 rounded">
    <div class="px-2 my-2 border-b border-gray-300">
      {{ bm.bm }}
    </div>
    <div class="flex justify-between px-2 mb-2" v-for="(a, x) in bm.attributes" :key="x">
      <span class="cursor-default">{{ a.options.displayName }}:</span>
      <span
        @click="handleEditMode(a.name, getDatatypeOfAttribute(a.typeName))"
        v-if="!a.isEdit"
        class="cursor-text hover:bg-blue-100"
        >{{ formatDisplayValue(a["value"], getDatatypeOfAttribute(a.typeName)) }}</span
      >
      <span v-else class="">
        <input
          v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
          type="number"
          v-model="a.value"
          class=""
          v-on:keyup.enter="() => inputsRefMap[a.name].blur()"
          v-on:blur="
            () => {
              updateAttribute();
              a.isEdit = false;
            }
          "
          :ref="
            el => {
              inputsRefMap[a.name] = el;
            }
          "
        />
        <select
          v-else-if="getDatatypeOfAttribute(a.typeName) === 'boolean'"
          class=""
          v-model="a.value"
          @change="
            () => {
              updateAttribute();
              a.isEdit = false;
            }
          "
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <span v-else-if="getDatatypeOfAttribute(a.typeName) === 'date'">
          <a-date-picker
            valueFormat="x"
            :value="(a.value || '').toString()"
            size="small"
            @change="(timestamp, string) => handleDateChange(timestamp, string, x)"
          />
        </span>
        <div
          v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<date>'"
          class="relative text-center"
        >
          <a-popover
            :getPopupContainer="trigger => trigger.parentNode"
            title="Add Multiple values"
            trigger="click"
            :visible="a.multiInputVisibility"
          >
            <template #content>
              <div class="">
                <a-date-picker
                  v-for="(i, n) in multiInputs"
                  :key="n"
                  valueFormat="x"
                  v-model:value="multiInputs[n]"
                  size="small"
                  @change="(timestamp, string) => handleMultiInputChange(x, true)"
                  @focus="multiFocus(n + 1)"
                />
                <div class="mt-2 text-center">
                  <span
                    class="cursor-pointer hover:underline"
                    @click="
                      () => {
                        updateAttribute();
                        a.isEdit = false;
                        a.multiInputVisibility = false;
                        multiInputs = ['', ''];
                      }
                    "
                    >Done</span
                  >
                </div>
              </div>
            </template>
            <span
              class="cursor-pointer hover:underline"
              @click="a.multiInputVisibility = true"
              >-add values-</span
            >
          </a-popover>
        </div>
        <div
          v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<number>'"
          class="relative text-center"
        >
          <a-popover
            :getPopupContainer="trigger => trigger.parentNode"
            title="Add Multiple values"
            trigger="click"
            :visible="a.multiInputVisibility"
          >
            <template #content>
              <div class="">
                <a-input-number
                  v-for="(i, n) in multiInputs"
                  :key="n"
                  size="small"
                  :placeholder="`Add value ${n + 1}`"
                  class="mb-1"
                  allowClear
                  @focus="multiFocus(n + 1)"
                  v-model:value="multiInputs[n]"
                  @change="handleMultiInputChange(x)"
                />
                <div class="mt-2 text-center">
                  <span
                    class="cursor-pointer hover:underline"
                    @click="
                      () => {
                        updateAttribute();
                        a.isEdit = false;
                        a.multiInputVisibility = false;
                        multiInputs = ['', ''];
                      }
                    "
                    >Done</span
                  >
                </div>
              </div>
            </template>
            <span
              class="cursor-pointer hover:underline"
              @click="a.multiInputVisibility = true"
              >-add values-</span
            >
          </a-popover>
        </div>
        <div
          v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<text>'"
          class="relative text-center"
        >
          <a-popover
            :getPopupContainer="trigger => trigger.parentNode"
            title="Add Multiple values"
            trigger="click"
            :visible="a.multiInputVisibility"
          >
            <template #content>
              <div class="">
                <a-input
                  v-for="(i, n) in multiInputs"
                  :key="n"
                  size="small"
                  :placeholder="`Add value ${n + 1}`"
                  class="mb-1"
                  allowClear
                  @focus="multiFocus(n + 1)"
                  v-model:value="multiInputs[n]"
                  @change="handleMultiInputChange(x)"
                />
                <div class="mt-2 text-center">
                  <span
                    class="cursor-pointer hover:underline"
                    @click="
                      () => {
                        updateAttribute();
                        a.isEdit = false;
                        a.multiInputVisibility = false;
                        multiInputs = ['', ''];
                      }
                    "
                    >Done</span
                  >
                </div>
              </div>
            </template>
            <span
              class="cursor-pointer hover:underline"
              @click="a.multiInputVisibility = true"
              >-add values-</span
            >
          </a-popover>
        </div>
        <a-tree-select
          v-else-if="
            typeof getDatatypeOfAttribute(a.typeName) === 'object' &&
              getDatatypeOfAttribute(a.typeName).type === 'enum'
          "
          v-model="a.value"
          :append-to-body="true"
          placeholder=""
          :multiple="getDatatypeOfAttribute(a.typeName).isMultivalues"
          :options="
            getDatatypeOfAttribute(a.typeName).enum.elementDefs.map(item => ({
              id: item.value,
              label: item.value,
            }))
          "
        >
        </a-tree-select>
        <input
          v-else
          type="text"
          v-model="a.value"
          class=""
          v-on:keyup.enter="() => inputsRefMap[a.name].blur()"
          v-on:blur="
            () => {
              updateAttribute();
              a.isEdit = false;
            }
          "
          :ref="
            el => {
              inputsRefMap[a.name] = el;
            }
          "
        />
      </span>
    </div>
    <div class="relative text-center">
      <a-popover
        class=""
        title="Choose Attribute"
        :getPopupContainer="trigger => trigger.parentNode"
      >
        <template #content>
          <div class="">
            <div
              v-for="(a, x) in availableAttributesToAdd"
              :key="x"
              class="m-1 cursor-pointer hover:underline hover:bg-blue-200"
              @click="selectAddAttribute(a)"
            >
              {{ a.options.displayName }}
            </div>
          </div>
        </template>
        <span class="relative cursor-pointer hover:underline">+ add</span>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed } from "vue";
import { formatDate } from "../../utils/date";
export default defineComponent({
  props: {
    bm: {
      type: Object,
      default: () => {},
    },
    originalBM: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const inputsRefMap = ref({});
    const multiInputs = ref(["", ""]);

    // ? methods
    const handleDateChange = (timestamp, string, x) => {
      props.bm.attributes[x].value = timestamp;
      // TODO mutating props directly in many places,
      props.bm.attributes[x].isEdit = false;
      updateAttribute();
    };

    const formatDisplayValue = (v: any, type: string) => {
      let value = JSON.parse(JSON.stringify(v));
      if (type === "boolean") {
        return JSON.parse(value.toString().toLowerCase()) ? "True" : "False";
      } else if (type === "date") {
        return formatDate(Number.isInteger(value) ? value : parseInt(value));
      } else if (Array.isArray(value)) {
        if (type.toLowerCase().includes("date"))
          value = value.map(v =>
            formatDate(Number.isInteger(value) ? value : parseInt(value))
          );
        return value.join(", ");
      }
      return value;
    };

    const multiFocus = (n: number) => {
      if (n === multiInputs.value.length) multiInputs.value.push("");
    };

    const handleMultiInputChange = (attributeIndex: number, isDate) => {
      if (isDate) {
        props.bm.attributes[attributeIndex].value = [
          ...multiInputs.value
            .map(v => (v !== "" ? parseInt(v) : v))
            .filter(v => v !== "" && v !== null),
        ];
      } else
        props.bm.attributes[attributeIndex].value = [
          ...multiInputs.value.filter(v => v !== "" && v !== null),
        ];
    };

    const selectAddAttribute = (a: object) => {
      props.bm.attributes.push({ ...a, isEdit: true });
    };

    const setInputFocus = name => {
      nextTick(() => inputsRefMap.value[name].select());
    };

    const updateAttribute = () => {
      emit("updateAttribute", JSON.parse(JSON.stringify(props.bm)));
    };

    const handleEditMode = (name: string, type: string) => {
      props.bm.attributes.find(a => a.name === name).isEdit = true;
      if (!type.toLowerCase().includes("array") && type !== "date") setInputFocus(name);
    };

    const getDatatypeOfAttribute = (typeName: string | string[]) => {
      if (typeName && typeof typeName !== "undefined") {
        if (
          typeName.includes("int") ||
          typeName.includes("double") ||
          typeName.includes("float") ||
          typeName.includes("byte") ||
          typeName.includes("short") ||
          typeName.includes("long")
        ) {
          if (typeName.includes("array")) {
            return `array<number>`;
          }
          return `number`;
        } else if (typeName.includes("date")) {
          if (typeName.includes("array")) {
            return `array<date>`;
          }
          return `date`;
        } else if (typeName.includes("boolean")) {
          return `boolean`;
        } else if (typeName.includes("string")) {
          if (typeName.includes("array")) {
            return `array<text>`;
          }
          return `text`;
        } else if (typeName) {
          const reqIndex = this.enumList.findIndex(enumitem =>
            typeName.includes(enumitem.name)
          );
          if (reqIndex > -1) {
            return {
              typeName,
              type: "enum",
              isMultivalues: typeName.includes("array"),
              enum: this.enumList[reqIndex],
            };
          }
          return typeName;
        }
      }

      return typeName || "";
    };

    const availableAttributesToAdd = computed(() => {
      // TODO also check for typeName
      const appliedAttributes = props.bm.attributes.map(a => a.name);
      if (props.originalBM?.attributeDefs) {
        return props.originalBM.attributeDefs.filter(a => {
          if (appliedAttributes.includes(a.name)) return false;
          return true;
        });
      }
      return [];
    });

    return {
      getDatatypeOfAttribute,
      handleEditMode,
      updateAttribute,
      availableAttributesToAdd,
      selectAddAttribute,
      inputsRefMap,
      multiInputs,
      multiFocus,
      handleMultiInputChange,
      formatDisplayValue,
      handleDateChange,
    };
  },
});
</script>

<style scoped></style>
