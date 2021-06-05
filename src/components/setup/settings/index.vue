<template>
  <a-form :model="job" layout="vertical">
    <a-form-item label="Metadata Coverage" name="scope">
      <a-radio-group v-model:value="job.scope">
        <a-radio-button value="all">All Assets</a-radio-button>
        <a-radio-button value="custom">Custom</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <div class="grid grid-cols-12" v-if="job.scope === 'custom'">
      <a-form-item label="Include" name="include" class="col-span-6">
        <ScopeSelector
          v-model:value="job.include"
          :credential="credential"
        ></ScopeSelector>
      </a-form-item>
      <a-form-item label="Exclude" name="exclude" class="col-span-6 ml-3">
        <ScopeSelector
          v-model:value="job.exclude"
          :credential="credential"
        ></ScopeSelector>
      </a-form-item>
    </div>

    <div class="flex space-x-4">
      <a-form-item label="Refresh Frequency" name="cron">
        <a-radio-group v-model:value="job.cron" @change="hangeCronChange">
          <template v-for="cron in Cron" :key="cron.id">
            <a-radio-button :value="cron.id">{{ cron.label }}</a-radio-button>
          </template>

          <!-- <a-radio-button value="daily">Daily</a-radio-button>
          <a-radio-button value="weekly">Weekly</a-radio-button>
          <a-radio-button value="advanced">Advanced</a-radio-button> -->
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Timezone" name="cronTimezone" class="flex-grow">
        <TimezoneSelector
          v-model="job.cronTimezone"
          @change="handleTimezoneChange"
        ></TimezoneSelector>
      </a-form-item>
    </div>

    <div class="flex" v-if="job.cron != 'none'">
      <a-form-item
        label="Start Time"
        name="cron"
        class="mr-3"
        v-if="job.cron == 'weekly' || job.cron == 'daily'"
      >
        <!-- <a-time-picker format="HH:mm" v-model:value="job.startTime" /> -->
        <TimePicker
          :hideDropDown="true"
          v-model="job.startTime"
          format="HH:mm"
          hour-label="Hour"
          hide-clear-button
          minute-label="Mins"
          ::minute-interval="15"
          close-on-complete
          @change="handleTimeChange"
        ></TimePicker>
      </a-form-item>

      <a-form-item
        label="Day of the Week"
        name="timezone"
        class="mr-3"
        v-if="job.cron == 'weekly'"
      >
        <DaySelector v-model="job.day" @change="handleDayChange"></DaySelector>
      </a-form-item>

      <a-form-item
        label="Cron String"
        name="cronString"
        class="mr-3"
        :hasFeedback="true"
        :validateStatus="isCronError ? 'error' : 'success'"
        v-if="job.cron == 'advanced'"
      >
        <a-input
          required
          :maxlength="9"
          v-model:value="job.cronString"
          @change="handleCronStringChange"
        ></a-input>
      </a-form-item>
      <div class="mb-3" v-if="job.isCron && !isCronError">
        <p class="mb-0">Next Schedule Runs</p>
        <div v-if="job.isCron">
          <p
            v-for="(val, index) in evaluatedCron"
            :key="index"
            class="mb-0 text-gray-500"
          >
            <i class="mr-1 fal fa-clock" /> {{ val }}
          </p>
        </div>
      </div>
      <div class="mb-3" v-if="isCronError">
        <p class="mb-0">Next Schedule Runs</p>
        <a-alert
          show-icon
          type="error"
          message="Please check your cron string"
        ></a-alert>
      </div>
    </div>

    <div class="px-3 pt-3 border border-gray-200 rounded bg-gray-50">
      <div class="">
        <p class="mb-2 text-sm font-normal text-gray-400">Advanced</p>
      </div>
      <div class="flex space-x-4">
        <a-form-item label="SQL Query" name="name" help="">
          <a-switch v-model:checked="job.allowQuery"></a-switch>
        </a-form-item>
        <a-form-item label="Data Preview(50 rows)" name="name" help="">
          <a-switch v-model:checked="job.allowPreview"></a-switch>
        </a-form-item>
      </div>
      <div class="flex space-x-5">
        <a-form-item name="name">
          <template #label>
            Credential
            <!-- <a-tooltip
              title="Default Credential will be used to query the source. The
      credential should have enough permissions to query the tables/views. You
      can create granular access control policies for user/group level access control."
              ><fa icon="fal info-circle" class="ml-1"></fa
            ></a-tooltip> -->
          </template>
          <a-radio-group v-model:value="job.credentialType">
            <a-radio-button value="default">Default Credential</a-radio-button>
            <a-radio-button value="user">User Credential</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="name" class="flex-grow">
          <template #label>
            Row Limit
            <a-tooltip
              title="Limit Clause is added to all queries before querying the source"
              ><fa icon="fal info-circle" class="ml-1"></fa
            ></a-tooltip>
          </template>
          <a-input-number
            :min="1000"
            v-model:value="job.rowLimit"
          ></a-input-number>
        </a-form-item>
      </div>
    </div>

    <!-- <a-form-item label="Activity zone" name="region">
      <a-select
        v-model:value="formState.region"
        placeholder="please select your zone"
      >
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item> -->
    <!-- <a-form-item label="Activity time" required name="date1">
      <a-date-picker
        v-model:value="formState.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="Instant delivery" name="delivery">
      <a-switch v-model:checked="formState.delivery" />
    </a-form-item> -->
    <!-- <a-form-item label="Activity type" name="type">
      <a-checkbox-group v-model:value="formState.type">
        <a-checkbox value="1" name="type">Online</a-checkbox>
        <a-checkbox value="2" name="type">Promotion</a-checkbox>
        <a-checkbox value="3" name="type">Offline</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="Resources" name="resource">
      <a-radio-group v-model:value="formState.resource">
        <a-radio value="1">Sponsor</a-radio>
        <a-radio value="2">Venue</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Activity form" name="desc">
      <a-textarea v-model:value="formState.desc" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item> -->
  </a-form>
</template>
  <script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent } from "vue";

import ScopeSelector from "@/common/tree/scope/index.vue";
import TimezoneSelector from "@/common/selector/timezone/index.vue";
import DaySelector from "@/common/selector/day/index.vue";
import TimePicker from "@/common/timepicker/index.vue";

import parser from "cron-parser";
import { Cron } from "~/constant/cron";
// interface FormState {

//   name: string;
//   region: string | undefined;
//   date1: Moment | undefined;
//   delivery: boolean;
//   type: string[];
//   resource: string;
//   desc: string;
// }
export default defineComponent({
  components: {
    ScopeSelector,
    TimezoneSelector,
    DaySelector,
    TimePicker,
  },
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
    credential: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return {
      Cron,
      marks: {
        1000: "1000rows",
        10000: "10000",
        37: "37°C",
      },
      evaluatedCron: [],
      isCronError: false,
      job: {
        allowPreview: true,
        allowQuery: true,
        credentialType: "default",
        rowLimit: 100000,
        arguments: { "include-filter": "{}" },
        cronString: "0 0 * * 1",
        cronTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isCron: false,
        isEvent: false,
        triggerNow: true,
        scope: "all",
        include: ["all"],
        exclude: undefined,
        cron: "none",
        startTime: "00:00",
      } as { [key: string]: any },
    };
  },
  methods: {
    handleScopeSelector(attr) {
      let databases: any[] = [];

      if (this.job[attr]) {
        if (this.job[attr] == ["all"]) {
          return JSON.stringify({
            "*": [],
          });
        } else {
          this.job[attr].forEach((item) => {
            if (!item.startsWith("AtlanSchema$")) {
              databases.push(item);
            } else {
              databases.push(item.split("$")[1]);
            }
          });
          let unique = [...new Set(databases)];
          let scopeMap: { [key: string]: any } = {};
          unique.forEach((db) => {
            let prefix = `AtlanSchema$${db}$`;
            let filtered = this.job.include.filter((item) =>
              item.startsWith(prefix)
            );
            scopeMap[db] = [];
            filtered.forEach((f) => {
              console.log(f);
              scopeMap[db].push(f.substring(prefix.length));
            });
          });
          return JSON.stringify(scopeMap);
        }
      }
      return "";
    },

    handleTimezoneChange() {
      this.updateCronEval();
    },

    handleCronStringChange(e) {
      try {
        const options = {
          tz: this.job.cronTimezone,
        };

        let cronTemp = e.target.value.split(" ").join("");
        cronTemp = cronTemp.split("").join(" ");
        this.job.cronString = cronTemp;
        parser.parseExpression(cronTemp, options);
        this.job.isCron = true;
        this.updateCronEval();
      } catch (err) {
        this.isCronError = true;
        console.log("Error: " + err.message);
      }
    },
    hangeCronChange() {
      const found = Cron.find((item) => item.id === this.job.cron);

      if (found) {
        if (found.id == "advanced") {
          this.job.isCron = true;
        } else if (found.id !== "none" && found.id !== "advanced") {
          this.job.isCron = true;
          this.job.cronString = found.cron;
        }
      }
      this.updateCronEval();
    },
    getJob() {
      this.job.arguments["include-filter"] = this.handleScopeSelector(
        "include"
      );
      this.job.arguments["exclude-filter"] = this.handleScopeSelector(
        "exclude"
      );
      return this.job;
    },
    // updateCronEval() {
    //   const options = {
    //     tz: this.job.cronTimezone,
    //   };
    //   try {
    //     this.evaluatedCron = [];
    //     const interval = parser.parseExpression(this.job.cronString, options);
    //     this.evaluatedCron.push(interval.next().toString());
    //     this.evaluatedCron.push(interval.next().toString());
    //   } catch (err) {
    //     this.evaluatedCron.push("N/A");
    //     this.evaluatedCron.push("N/A");

    //     console.log("Error: " + err.message);
    //   }
    // },
    handleTimeChange(time) {
      if (time.data.HH) {
        const options = {
          tz: this.job.cronTimezone,
        };
        const interval = parser.parseExpression(this.job.cronString, options);
        var fields = JSON.parse(JSON.stringify(interval.fields));
        if (time.data.HH) {
          fields.hour = [parseInt(time.data.HH)];
        }
        if (time.data.mm) {
          fields.minute = [parseInt(time.data.mm)];
        }

        const modifiedInterval = parser.fieldsToExpression(fields);
        this.job.cronString = modifiedInterval.stringify();
        this.updateCronEval();
      }
    },
    handleDayChange(day) {
      if (day) {
        const options = {
          tz: this.job.cronTimezone,
        };
        const interval = parser.parseExpression(this.job.cronString, options);
        var fields = JSON.parse(JSON.stringify(interval.fields));
        if (day) {
          fields.dayOfWeek = [parseInt(day)];
        }

        const modifiedInterval = parser.fieldsToExpression(fields);
        this.job.cronString = modifiedInterval.stringify();
        this.updateCronEval();
      }
    },
    updateCronEval() {
      console.log(this.job);
      this.isCronError = false;
      const options = {
        tz: this.job.cronTimezone,
      };

      console.log(this.job);
      try {
        this.evaluatedCron = [];
        const interval = parser.parseExpression(this.job.cronString, options);
        this.evaluatedCron.push(interval.next().toString());
        this.evaluatedCron.push(interval.next().toString());
      } catch (err) {
        this.evaluatedCron.push("N/A");
        this.evaluatedCron.push("N/A");

        console.log("Error: " + err.message);
      }
    },
  },
  //   setup() {
  //     const formRef = ref();
  //     const formState: UnwrapRef<FormState> = reactive({
  //       name: "",
  //       region: undefined,
  //       date1: undefined,
  //       delivery: false,
  //       type: [],
  //       resource: "",
  //       desc: "",
  //     });
  //     const rules = {
  //       name: [
  //         {
  //           required: true,
  //           message: "Please input Activity name",
  //           trigger: "blur",
  //         },
  //         { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  //       ],
  //       region: [
  //         {
  //           required: true,
  //           message: "Please select Activity zone",
  //           trigger: "change",
  //         },
  //       ],
  //       date1: [
  //         {
  //           required: true,
  //           message: "Please pick a date",
  //           trigger: "change",
  //           type: "object",
  //         },
  //       ],
  //       type: [
  //         {
  //           type: "array",
  //           required: true,
  //           message: "Please select at least one activity type",
  //           trigger: "change",
  //         },
  //       ],
  //       resource: [
  //         {
  //           required: true,
  //           message: "Please select activity resource",
  //           trigger: "change",
  //         },
  //       ],
  //       desc: [
  //         {
  //           required: true,
  //           message: "Please input activity form",
  //           trigger: "blur",
  //         },
  //       ],
  //     };
  //     const onSubmit = () => {
  //       formRef.value
  //         .validate()
  //         .then(() => {
  //           console.log("values", formState, toRaw(formState));
  //         })
  //         .catch((error: ValidateErrorEntity<FormState>) => {
  //           console.log("error", error);
  //         });
  //     };
  //     const resetForm = () => {
  //       formRef.value.resetFields();
  //     };
  //     return {
  //       formRef,
  //       labelCol: { span: 4 },
  //       wrapperCol: { span: 14 },
  //       other: "",
  //       formState,
  //       rules,
  //       onSubmit,
  //       resetForm,
  //     };
});
</script>