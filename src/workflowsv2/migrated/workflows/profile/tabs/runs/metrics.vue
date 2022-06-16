<template>
    <div class="flex flex-col w-full h-full">
        <iframe
            height="100%"
            ref="iframeContent"
            frameborder="0"
            src="https://beta.atlan.com/api/observe/d/crawler/crawler-observability?orgId=1&refresh=5s&var-package=atlan-snowflake&var-connection=default%2Fsnowflake%2F1642762684&var-workflow=atlan-snowflake-default-snowflake-1642762684&var-run=atlan-snowflake-default-snowflake-1642762684-m6mg4&var-database=ATLAN_SAMPLE_DATA&var-typename=column&from=1643196660560&to=1643801460560&viewPanel=16"
        ></iframe>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        watch,
        onBeforeUnmount,
    } from 'vue'

    export default defineComponent({
        // mixins: [WorkflowMixin],
        props: {
            selectedPod: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            selectedRun: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },

        setup(props, { emit }) {
            const { selectedRun, selectedPod } = toRefs(props)

            const iframeContent = ref(null)

            const iframeStyles = () => {
                const style =
                    '.layout__wrapper {background:' +
                    '#ffd800' +
                    ';} ' +
                    'body {color: #333;}'
                iframeContent?.value?.contentWindow.postMessage(style, '*')
            }

            return {
                selectedPod,
                selectedRun,
                iframeStyles,
                iframeContent,
            }
        },
    })
</script>
