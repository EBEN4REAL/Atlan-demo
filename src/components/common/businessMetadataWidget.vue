<template>
  <div class="border border-gray-200 rounded ">
    <div class="mx-2 my-2 border-b border-gray-300 -2">
      <div class="flex justify-between">
        <span>{{ originalBM.options.displayName }}</span>
        <a-popconfirm
          :title="`Are you sure remove ${originalBM.options.displayName}?`"
          placement="left"
          ok-text="Yes"
          cancel-text="No"
          @confirm="removeBm(bm.bm)"
          ><span
            ><fa
              icon="fal times"
              class="text-gray-400 cursor-pointer hover:text-red-600"
            /> </span
        ></a-popconfirm>
      </div>
    </div>
    <span v-if="bm.attributes.length">
      <div class="px-2 mb-2 " v-for="(a, x) in bm.attributes" :key="x">
        <div class="flex justify-between">
          <span class="text-gray-500 cursor-default whitespace-nowrap"
            >{{ a.options.displayName }}:</span
          >
          <a-popconfirm
            :title="`Are you sure delete ${a.options.displayName}?`"
            placement="left"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirmDeleteAttribute(a.name)"
            ><span class="cursor-pointer"
              ><fa
                icon="fal trash"
                class="text-xs text-gray-400 hover:text-red-600"/></span
          ></a-popconfirm>
        </div>
        <div
          @click="handleEditMode(a.name, getDatatypeOfAttribute(a.typeName))"
          v-if="!a.isEdit"
          class="cursor-text hover:bg-blue-50 font-sm"
        >
          {{ formatDisplayValue(a["value"], getDatatypeOfAttribute(a.typeName)) }}
        </div>
        <span v-else class="">
          <input
            v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
            class="px-2 mr-2 border w-100"
            style="width:90%"
            type="number"
            v-model="a.value"
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
            class="ml-2"
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
          <div v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<date>'" class="">
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
              <div class="" v-for="(i, n) in multiInputs[a.name]" :key="n">
                <a-date-picker
                  valueFormat="x"
                  :value="multiInputs[a.name][n]"
                  size="small"
                  :allowClear="true"
                  @change="
                    (timestamp, string) =>
                      handleMultiInputChange(x, true, a.name, timestamp, n)
                  "
                />
              </div>
            </div>
            <div class="flex justify-end">
              <a-tag
                class="bg-white cursor-pointer"
                @click="addMoreMultiElement(a.name)"
                style="background: #fff; border-style: none"
              >
                <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
              ><a-tag
                class="mr-0 bg-white cursor-pointer"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                    multiInputs[a.name] = ['', ''];
                  }
                "
                style="background: #fff; border-style: dashed"
              >
                Done
              </a-tag>
            </div>
          </div>
          <div
            v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<number>'"
            class=""
          >
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
              <div class="" v-for="(i, n) in multiInputs[a.name]" :key="n">
                <a-input-number
                  :key="n"
                  size="small"
                  :placeholder="`Value ${n + 1}`"
                  class="mb-1"
                  allowClear
                  :value="multiInputs[a.name][n]"
                  @change="
                    e =>
                      handleMultiInputChange(
                        x,
                        false,
                        a.name,
                        e.target.value,
                        timestamp,
                        n
                      )
                  "
                />
              </div>
            </div>
            <div class="flex justify-end">
              <a-tag
                class="bg-white cursor-pointer"
                @click="addMoreMultiElement(a.name)"
                style="background: #fff; border-style: none"
              >
                <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
              ><a-tag
                class="mr-0 bg-white cursor-pointer"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                    multiInputs[a.name] = ['', ''];
                  }
                "
                style="background: #fff; border-style: dashed"
              >
                Done
              </a-tag>
            </div>
          </div>
          <div
            v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<text>'"
            class="text-center "
          >
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
              <div class="" v-for="(i, n) in multiInputs[a.name]" :key="n">
                <a-input
                  :key="n"
                  size="small"
                  :placeholder="`Value ${n + 1}`"
                  class="mb-1"
                  allowClear
                  :value="multiInputs[a.name][n]"
                  @change="
                    e => handleMultiInputChange(x, false, a.name, e.target.value, n)
                  "
                />
              </div>
            </div>
            <div class="flex justify-end">
              <a-tag
                class="bg-white cursor-pointer"
                @click="addMoreMultiElement(a.name)"
                style="background: #fff; border-style: none"
              >
                <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
              ><a-tag
                class="mr-0 bg-white cursor-pointer"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                    multiInputs[a.name] = ['', ''];
                  }
                "
                style="background: #fff; border-style: dashed"
              >
                Done
              </a-tag>
            </div>
          </div>
          <div
            v-else-if="
              typeof getDatatypeOfAttribute(a.typeName) === 'object' &&
                getDatatypeOfAttribute(a.typeName).type === 'enum'
            "
          >
            <a-select
              style="width: 100%"
              size="small"
              :maxTagCount="1"
              :showArrow="true"
              class=""
              v-model:value="a.value"
              placeholder=""
              :mode="getDatatypeOfAttribute(a.typeName).isMultivalues ? 'tags' : ''"
              :options="
                getDatatypeOfAttribute(a.typeName).enum.elementDefs.map(item => ({
                  value: item.value,
                  title: item.value,
                }))
              "
              @change="
                () => {
                  updateAttribute();
                  if (!getDatatypeOfAttribute(a.typeName).isMultivalues) a.isEdit = false;
                }
              "
            />
            <div
              class="flex justify-end mt-2"
              v-if="getDatatypeOfAttribute(a.typeName).isMultivalues"
            >
              <a-tag
                class="mr-0 bg-white cursor-pointer"
                @click="
                  () => {
                    a.isEdit = false;
                  }
                "
                style="background: #fff; border-style: dashed"
              >
                Done
              </a-tag>
            </div>
          </div>
          <input
            v-else
            type="text"
            v-model="a.value"
            class="px-2 mr-2 border w-100"
            style="width:90%"
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
        </span></div
    ></span>
    <div v-else class="text-center">
      <p class="mt-2 text-xs text-gray-400">
        Please add an attribute
      </p>
    </div>
    <div class="text-center ">
      <a-popover class="" title="Choose Attribute" placement="left">
        <template #content>
          <div class="" v-if="availableAttributesToAdd.length">
            <div
              v-for="(a, x) in availableAttributesToAdd"
              :key="x"
              class="m-1 cursor-pointer hover:underline hover:bg-blue-50"
              @click="selectAddAttribute(a)"
            >
              {{ a.options.displayName }}
            </div>
          </div>
          <p v-else class="mt-2 text-xs text-gray-400">
            No attributes left.
          </p>
        </template>
        <span class="text-sm cursor-pointer hover:underline">+ add attribute</span>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed } from "vue";

// * Composables
import useEnums from "@/admin/enums/composables/useEnums";

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
    assetType: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const inputsRefMap = ref({});
    const multiInputs = ref({});
    const { enumListData: enumsList } = useEnums();

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
        if (!value.length) return `No value added`;
        if (typeof type !== "object" && type.toLowerCase().includes("date"))
          value = value.map(v => formatDate(Number.isInteger(v) ? v : parseInt(v)));
        return value.join(", ");
      }
      return value;
    };

    const addMoreMultiElement = (name: string) => {
      multiInputs.value[name].push("");
    };
    const confirmDeleteAttribute = name => {
      props.bm.attributes = props.bm.attributes.filter(a => a.name !== name);
      updateAttribute();
    };

    const handleMultiInputChange = (
      attributeIndex: number,
      isDate: boolean,
      name: string,
      value: string,
      localAttrIndex: number
    ) => {
      multiInputs.value[name][localAttrIndex] = value;
      if (isDate) {
        props.bm.attributes[attributeIndex].value = [
          ...multiInputs.value[name]
            .map(v => (v !== "" ? parseInt(v) : v))
            .filter(v => !Number.isNaN(v)),
        ];
      } else
        props.bm.attributes[attributeIndex].value = [
          ...multiInputs.value[name].filter(
            (v: number | string) => v !== "" && v !== null
          ),
        ];
    };

    const selectAddAttribute = (a: object) => {
      if (a.typeName.includes("array")) multiInputs.value[a.name] = ["", ""];
      props.bm.attributes.push({ ...a, isEdit: true });
    };

    const setInputFocus = name => {
      nextTick(() => inputsRefMap.value[name].select());
    };

    const removeBm = () => {
      props.bm.attributes = [];
      updateAttribute();
    };

    const updateAttribute = () => {
      emit("updateAttribute", JSON.parse(JSON.stringify({ ...props.bm, isNew: false })));
    };

    const handleEditMode = (name: string, type: string) => {
      const attribute = props.bm.attributes.find(a => a.name === name);
      attribute.isEdit = true;
      if (typeof type === "object") console.log("enum", type);
      else if (type.includes("array") && attribute?.value.length)
        if (type.includes("date"))
          multiInputs.value[name] = attribute.value.map((v: number) => v.toString());
        else multiInputs.value[name] = attribute.value;
      else if (!type.toLowerCase().includes("array") && type !== "date")
        setInputFocus(name);
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
          const reqIndex = enumsList.value.findIndex(enumitem =>
            typeName.includes(enumitem.name)
          );
          if (reqIndex > -1) {
            return {
              typeName,
              type: "enum",
              isMultivalues: typeName.includes("array"),
              enum: JSON.parse(JSON.stringify(enumsList.value[reqIndex])),
            };
          }
          return typeName;
        }
      }

      return typeName || "";
    };

    const availableAttributesToAdd = computed(() => {
      const appliedAttributes = props.bm.attributes.map(a => a.name);
      if (props.originalBM?.attributeDefs) {
        return props.originalBM.attributeDefs.filter(a => {
          if (
            appliedAttributes.includes(a.name) ||
            !JSON.parse(a.options.applicableEntityTypes).includes(props.assetType)
          )
            return false;
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
      addMoreMultiElement,
      handleMultiInputChange,
      formatDisplayValue,
      handleDateChange,
      enumsList,
      confirmDeleteAttribute,
      removeBm,
    };
  },
});
</script>

<style scoped>
.ant-calendar-picker {
  width: 110px;
}
:global(.ant-calendar-picker-icon) {
  @apply hidden;
}
</style>
