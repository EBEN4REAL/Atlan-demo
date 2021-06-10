<template>
  <div class="">
    <div class="mb-2 d-flex">
      <a-select placeholder="All Types" class="mr-2"></a-select>
      <a-select placeholder="All Connectors"></a-select>
    </div>
    <table class="table w-full table-report">
      <tbody>
        <template v-for="item in list" :key="item.metadata.uid">
          <ItemView :item="item"></ItemView>
        </template>
      </tbody>
    </table>
    <!-- <div class="flex flex-col space-y-2"> -->

    <!-- </div> -->
  </div>
</template>
          
<script lang="ts">
import { defineComponent } from "vue";
import { Workflows } from "~/api/argo/workflow";
import ItemView from "./item.vue";
import { sse } from "~/utils/sse";

export default defineComponent({
  components: {
    ItemView,
  },
  props: {},
  data() {
    return {
      list: [],
      msgServer: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await Workflows.List({
          "listOptions.limit": 10,
          "listOptions.labelSelector": "bot-template-name=atlan-jdbc-crawler",
        });
        this.list = response.items;
        this.listenEvents();
        console.log(this.list);
      } catch (error) {
        console.log(error);
      }
    },
    listenEvents() {
      sse(
        `https://bots.atlan.com/api/auth/argo/tenants/default/workflow-events/?listOptions.resourceVersion=73307790&fields=result.object.metadata.name,result.object.metadata.namespace,result.object.metadata.resourceVersion,result.object.metadata.creationTimestamp,result.object.metadata.uid,result.object.status.finishedAt,result.object.status.phase,result.object.status.message,result.object.status.startedAt,result.object.status.estimatedDuration,result.object.status.progress,result.type,result.object.metadata.labels,result.object.spec.suspend`,
        {},
        "",
        { format: "json" }
      ) // or { format: 'plain' }
        .then((sse) => {
          // Store SSE object at a higher scope
          // this.msgServer = sse;
          // this.loading = false;

          // Catch any errors (ie. lost connections, etc.)
          sse.onError((e) => {
            console.error("lost connection; giving up!", e);
            sse.close();
          });

          // Listen for messages without a specified event
          sse.subscribe("", (message) => {
            console.log(message);
            // this.connected = true;
            // if (!this.timeId) {
            //   this.timeId = setInterval(() => {
            //     if (this.flush.length > 0) {
            //       this.messages = this.messages.concat(this.flush);
            //     }
            //   }, 3000);
            // }
            // this.flush.push(message);
            // if (this.flush.length > 10) {
            //   this.messages = this.messages.concat(this.flush);
            //   this.flush = [];
            // }
          });

          // // Listen for messages based on their event (in this case, "chat")
          // sse.subscribe("chat", (message, rawEvent) => {
          //   this.messages.push(message);
          // });

          // if (!this.isRunning) {
          //   // Unsubscribes from event-less messages after 7 seconds
          //   setTimeout(() => {
          //     sse.unsubscribe("");
          //     this.connected = false;
          //     clearInterval(this.timeId);
          //   }, 5000);
          // }

          // // Unsubscribes from chat messages after 7 seconds
          // setTimeout(() => {
          //   sse.unsubscribe("chat");

          //   console.log("Stopped listening to chat messages!");
          // }, 14000);
        })
        .catch((err) => {
          // When this error is caught, it means the initial connection to the
          // events server failed.  No automatic attempts to reconnect will be made.
          console.error("Failed to connect to server", err);

          // if (this.timeId) {
          //   clearInterval(this.timeId);
          // }

          // if (this.loading) {
          //   this.loading = false;
          // }
        });
    },
  },
});
</script>

<style lang="less" scoped>
.table-report {
  border-spacing: 0 10px;
  border-collapse: separate;
}
</style>