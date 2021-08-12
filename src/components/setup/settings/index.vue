<template>
  <a-form :model="job" layout="vertical">
    <a-form-item label="Metadata Coverage" name="scope">
      <a-radio-group v-model:value="job.scope">
        <a-radio-button value="all">All Assets</a-radio-button>
        <a-radio-button value="custom">Custom</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <div v-if="job.scope === 'custom'" class="grid grid-cols-12">
      <a-form-item label="Include Metadata" name="include" class="col-span-6">
        <ScopeSelector
          v-model="job.include"
          :credential="credential"
        ></ScopeSelector>
      </a-form-item>
      <a-form-item
        label="Exclude Metadata"
        name="exclude"
        class="col-span-6 ml-3"
      >
        <ScopeSelector
          v-model="job.exclude"
          :credential="credential"
        ></ScopeSelector>
      </a-form-item>
    </div>

    <div class="flex space-x-4">
      <a-form-item label="Refresh Frequency" name="cron" class="mb-2">
        <a-radio-group v-model:value="job.cron" @change="hangeCronChange">
          <template v-for="cron in Cron" :key="cron.id">
            <a-radio-button :value="cron.id">{{ cron.label }}</a-radio-button>
          </template>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Timezone" name="cronTimezone" class="fle">
        <TimezoneSelector
          v-model="job.cronTimezone"
          @change="handleTimezoneChange"
        ></TimezoneSelector>
      </a-form-item>
    </div>

    <div v-if="job.cron != 'none'" class="flex">
      <a-form-item
        v-if="job.cron == 'weekly' || job.cron == 'daily'"
        label="Start Time"
        name="cron"
        class="mr-3"
      >
        <!-- <a-time-picker format="HH:mm" v-model:value="job.startTime" /> -->
        <TimePicker
          v-model="job.startTime"
          :hide-drop-down="true"
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
        v-if="job.cron == 'weekly'"
        label="Day of the Week"
        name="timezone"
        class="mr-3"
      >
        <DaySelector v-model="job.day" @change="handleDayChange"></DaySelector>
      </a-form-item>

      <a-form-item
        v-if="job.cron == 'advanced'"
        label="Cron String"
        name="cronString"
        class="mr-3"
        :has-feedback="true"
        :validate-status="isCronError ? 'error' : 'success'"
      >
        <a-input
          v-model:value="job.cronString"
          required
          @change="handleCronStringChange"
        ></a-input>
      </a-form-item>
      <div v-if="job.isCron && !isCronError" class="mb-3">
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
      <div v-if="isCronError" class="mb-3">
        <p class="mb-0">Next Schedule Runs</p>
        <a-alert
          show-icon
          type="error"
          message="Please check your cron string"
        ></a-alert>
      </div>
    </div>

    <div class="px-3 pt-3 border border-gray-200 rounded bg-gray-100">
      <div class="">
        <p class="mb-2 text-sm font-normal text-gray">Advanced</p>
      </div>
      <div class="flex space-x-4">
        <a-checkbox v-model:checked="job.allowQuery"
          >Allow SQL Query</a-checkbox
        >

        <a-checkbox v-model:checked="job.allowPreview"
          >Allow Data Preview</a-checkbox
        >
      </div>
      <div class="flex mt-3 space-x-5">
        <a-form-item name="name" class="">
          <template #label>
            Row Limit
            <a-tooltip
              title="Limit Clause is added to all queries before querying the source"
              ><fa icon="fal info-circle" class="ml-1"></fa
            ></a-tooltip>
          </template>
          <a-input-number
            v-model:value="job.rowLimit"
            :min="1000"
          ></a-input-number>
        </a-form-item>
        <a-form-item name="name">
          <template #label> Credential </template>
          <a-radio-group v-model:value="job.credentialType">
            <a-radio-button value="default">Default Credential</a-radio-button>
            <a-radio-button value="user">User Credential</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </div>
    </div>
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
        exclude: [],
        cron: "none",
        startTime: "00:00",
      } as { [key: string]: any },
    };
  },
  methods: {
    handleScopeSelector(attr) {
      const databases: any[] = [];
      if (this.job[attr]) {
        if (this.job[attr].includes("all")) {
          return JSON.stringify({});
        } 
          this.job[attr].forEach((item) => {
            if (!item.startsWith("AtlanSchema$")) {
              databases.push(item);
            } else {
              databases.push(item.split("$")[1]);
            }
          });
          const unique = [...new Set(databases)];
          const scopeMap: { [key: string]: any } = {};
          unique.forEach((db) => {
            const prefix = `AtlanSchema$${db}$`;
            const filtered = this.job.include.filter((item) =>
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
        // this.isCronError = false;
        const cronTemp = e.target.value.replace(/ /g, "");
        // // console.log(cronTemp);
        // cronTemp = cronTemp.split("").join(" ");
        // console.log(cronTemp);
        this.job.cronString = e.target.value;

        parser.parseExpression(cronTemp, options);
        this.job.isCron = true;
        this.updateCronEval();
      } catch (err) {
        this.isCronError = true;
        console.log(`Error: ${  err.message}`);
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
      this.job.arguments["include-filter"] =
        this.handleScopeSelector("include");
      this.job.arguments["exclude-filter"] =
        this.handleScopeSelector("exclude");

      console.log(this.job);
      return this.job;
    },
    updateCronEval() {
      const options = {
        tz: this.job.cronTimezone,
      };
      try {
        this.evaluatedCron = [];
        const interval = parser.parseExpression(this.job.cronString, options);
        this.evaluatedCron.push(interval.next().toString());
        this.evaluatedCron.push(interval.next().toString());
      } catch (err) {
        this.evaluatedCron.push("N/A");
        this.evaluatedCron.push("N/A");

        console.log(`Error: ${  err.message}`);
      }
    },
    handleTimeChange(time) {
      if (time.data.HH) {
        const options = {
          tz: this.job.cronTimezone,
        };
        const interval = parser.parseExpression(this.job.cronString, options);
        const fields = JSON.parse(JSON.stringify(interval.fields));
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
        const fields = JSON.parse(JSON.stringify(interval.fields));
        if (day) {
          fields.dayOfWeek = [parseInt(day)];
        }

        const modifiedInterval = parser.fieldsToExpression(fields);
        this.job.cronString = modifiedInterval.stringify();
        this.updateCronEval();
      }
    },
    // updateCronEval is declared twice. Check and remove
    // updateCronEval() {
    //   console.log(this.job);
    //   this.isCronError = false;
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
  },
});
</script>
