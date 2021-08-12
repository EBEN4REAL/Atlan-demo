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
          @confirm="removeBm(localState.bm)"
          ><span
            ><fa
              icon="fal times"
              class="text-gray cursor-pointer hover:text-red-600"
            /> </span
        ></a-popconfirm>
      </div>
    </div>
    <span v-if="localState?.attributes?.length">
      <div v-for="(a, x) in localState.attributes" :key="x" class="px-2 mb-2 ">
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
                class="text-xs text-gray hover:text-red-600"/></span
          ></a-popconfirm>
        </div>
        <div
          v-if="!a.isEdit"
          class="cursor-text hover:bg-blue-50 font-sm"
          @click="handleEditMode(a.name, getDatatypeOfAttribute(a.typeName))"
        >
          {{ formatDisplayValue(a["value"], getDatatypeOfAttribute(a.typeName)) }}
        </div>
        <span v-else class="">
          <input
            v-if="getDatatypeOfAttribute(a.typeName) === 'number'"
            :ref="
              el => {
                inputsRefMap[a.name] = el;
              }
            "
            v-model="a.value"
            class="px-2 mr-2 border w-100"
            style="width:70%"
            type="number"
            @keyup.enter="() => inputsRefMap[a.name].blur()"
            @blur="
              () => {
                updateAttribute();
                a.isEdit = false;
              }
            "
          />
          <select
            v-else-if="getDatatypeOfAttribute(a.typeName) === 'boolean'"
            v-model="a.value"
            class="border "
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
              value-format="x"
              :value="(a.value || '').toString()"
              size="small"
              @change="(timestamp, string) => handleDateChange(timestamp, string, x)"
            />
          </span>
          <div v-else-if="getDatatypeOfAttribute(a.typeName) === 'array<date>'" class="">
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
              <div v-for="(i, n) in multiInputs[a.name]" :key="n" class="">
                <a-date-picker
                  value-format="x"
                  :value="multiInputs[a.name][n]"
                  size="small"
                  :allow-clear="true"
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
                style="background: #fff; border-style: none"
                @click="addMoreMultiElement(a.name)"
              >
                <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
              ><a-tag
                class="mr-0 bg-white cursor-pointer"
                style="background: #fff; border-style: dashed"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                    multiInputs[a.name] = ['', ''];
                  }
                "
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
              <div v-for="(i, n) in multiInputs[a.name]" :key="n" class="">
                <a-input-number
                  :key="n"
                  size="small"
                  :placeholder="`Value ${n + 1}`"
                  class="mb-1"
                  allow-clear
                  style="width:100%"
                  :value="multiInputs[a.name][n]"
                  @change="v => handleMultiInputChange(x, false, a.name, v, n)"
                />
              </div>
            </div>
            <div class="flex justify-end">
              <a-tag
                class="bg-white cursor-pointer"
                style="background: #fff; border-style: none"
                @click="addMoreMultiElement(a.name)"
              >
                <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
              ><a-tag
                class="mr-0 bg-white cursor-pointer"
                style="background: #fff; border-style: dashed"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                    multiInputs[a.name] = ['', ''];
                  }
                "
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
              <div v-for="(i, n) in multiInputs[a.name]" :key="n" class="">
                <a-input
                  :key="n"
                  size="small"
                  :placeholder="`Value ${n + 1}`"
                  class="mb-1"
                  allow-clear
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
                style="background: #fff; border-style: none"
                @click="addMoreMultiElement(a.name)"
              >
                <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
              ><a-tag
                class="mr-0 bg-white cursor-pointer"
                style="background: #fff; border-style: dashed"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                    multiInputs[a.name] = ['', ''];
                  }
                "
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
              v-model:value="a.value"
              style="width: 100%"
              size="small"
              :max-tag-count="1"
              :show-arrow="true"
              class=""
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
                  if (!getDatatypeOfAttribute(a.typeName).isMultivalues) {
                    a.isEdit = false;
                    updateAttribute();
                  }
                }
              "
            />
            <div
              v-if="getDatatypeOfAttribute(a.typeName).isMultivalues"
              class="flex justify-end mt-2"
            >
              <a-tag
                class="mr-0 bg-white cursor-pointer"
                style="background: #fff; border-style: dashed"
                @click="
                  () => {
                    updateAttribute();
                    a.isEdit = false;
                  }
                "
              >
                Done
              </a-tag>
            </div>
          </div>
          <input
            v-else
            :ref="
              el => {
                inputsRefMap[a.name] = el;
              }
            "
            v-model="a.value"
            type="text"
            class="px-2 mr-2 border w-100"
            style="width:90%"
            @keyup.enter="() => inputsRefMap[a.name].blur()"
            @blur="
              () => {
                updateAttribute();
                a.isEdit = false;
              }
            "
          />
        </span></div
    ></span>
    <div v-else class="text-center">
      <p class="mt-2 text-xs text-gray">
        Please add an attribute
      </p>
    </div>
    <div class="text-center ">
      <a-popover class="" title="Choose Attribute" placement="left">
        <template #content>
          <div v-if="availableAttributesToAdd.length" class="">
            <div
              v-for="(a, x) in availableAttributesToAdd"
              :key="x"
              class="m-1 cursor-pointer hover:underline hover:bg-blue-50"
              @click="selectAddAttribute(a)"
            >
              {{ a.options.displayName }}
            </div>
          </div>
          <p v-else class="mt-2 text-xs text-gray">
            No attributes left.
          </p>
        </template>
        <span class="text-sm cursor-pointer hover:underline">+ add attribute</span>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed, onMounted, watch, Ref } from "vue";

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
    const localState = ref();
    const { enumListData: enumsList } = useEnums();

    // ? methods
    /** @param {Number} timestamp - integer value of the date selected in timestap
     * @desc handling date change separetely because of type conversion requirements string <> int
     */
    const handleDateChange = (timestamp: string, string: string, x: string | number) => {
      localState.value.attributes[x].value = timestamp;
      localState.value.attributes[x].isEdit = false;
      updateAttribute();
    };

    const formatDisplayValue = (v: any, type: string) => {
      let value = JSON.parse(JSON.stringify(v));
      if (type === "boolean") {
        return JSON.parse(value.toString().toLowerCase()) ? "True" : "False";
      } if (type === "date") {
        return formatDate(Number.isInteger(value) ? value : parseInt(value));
      } if (Array.isArray(value)) {
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
      localState.value.attributes = localState.value.attributes.filter(
        a => a.name !== name
      );
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
        localState.value.attributes[attributeIndex].value = [
          ...multiInputs.value[name]
            .map(v => (v !== "" ? parseInt(v) : v))
            .filter(v => !Number.isNaN(v) && v !== ""),
        ];
      } else
        localState.value.attributes[attributeIndex].value = [
          ...multiInputs.value[name].filter(
            (v: number | string) => v !== "" && v !== null
          ),
        ];
    };

    const selectAddAttribute = (a: object) => {
      if (a.typeName.includes("array")) multiInputs.value[a.name] = ["", ""];
      localState.value.attributes.push({ ...a, isEdit: true });
    };
    /**
     * @param {String} name - ref of the input element
     * @desc sets focus to input elements that on edit
     */
    const setInputFocus = (name: string) => {
      nextTick(() => inputsRefMap.value[name].select());
    };

    const removeBm = () => {
      localState.value.attributes = [];
      updateAttribute();
    };

    const updateAttribute = () => {
      emit("updateAttribute", JSON.parse(JSON.stringify({ ...localState.value })));
    };
    /**
     * @param {String} name - name of the attribute being edited
     * @param {String} type - type of the attribute being edited
     * @desc - handles edit mode, loads/maps default values of multi input elements as using different state
     */
    const handleEditMode = (name: string, type: string) => {
      const attribute = localState.value.attributes.find(a => a.name === name);
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
        } if (typeName.includes("date")) {
          if (typeName.includes("array")) {
            return `array<date>`;
          }
          return `date`;
        } if (typeName.includes("boolean")) {
          return `boolean`;
        } if (typeName.includes("string")) {
          if (typeName.includes("array")) {
            return `array<text>`;
          }
          return `text`;
        } if (typeName) {
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
      if (localState.value) {
        const appliedAttributes = localState.value.attributes.map(a => a.name);
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
      }
      return [];
    });

    onMounted(() => {
      localState.value = JSON.parse(JSON.stringify(props.bm));
    });

    watch(
      () => props.bm,
      () => {
        // FIXME why localState getting wrong data?
        if (props.bm.bm !== localState.value?.bm)
          localState.value = JSON.parse(JSON.stringify(props.bm));
      },
      {
        deep: true,
        immediate: true,
      }
    );

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
      localState,
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
