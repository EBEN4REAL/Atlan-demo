<template>
  <a-form :model="job" layout="vertical">
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
  </a-form>
</template>
  
<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent } from "vue";

import TimezoneSelector from "@/common/selector/timezone/index.vue";
import DaySelector from "@/common/selector/day/index.vue";
import TimePicker from "@/common/timepicker/index.vue";

import parser from "cron-parser";
import { Cron } from "~/constant/cron";

export default defineComponent({
  components: {
    TimezoneSelector,
    DaySelector,
    TimePicker,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      Cron,
      isCronError: false,
      evaluatedCron: [],
      job: {
        cronString: "0 0 * * 1",
        cronTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isCron: false,
        cron: "none",
        startTime: "00:00",
      } as { [key: string]: any },
    };
  },
  watch: {
    job() {
      this.$emit("update:modelValue", this.job);
      this.$emit("change", this.job);
    },
  },
  mounted() {
    if (this.modelValue) {
      this.job = {
        ...this.job,
        ...this.modelValue,
      };
    }
  },
  methods: {
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

        console.log("Error: " + err.message);
      }
    },
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
  },
});
</script>