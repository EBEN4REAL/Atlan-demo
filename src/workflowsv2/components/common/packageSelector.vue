<template>
    <BaseSelector
        v-model:value="packageName"
        :list="packageList"
        placeholder="Select package"
        not-found-content="No package found"
    />
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import BaseSelector from './baseSelector.vue'

    export default defineComponent({
        name: 'PackageSelector',
        components: { BaseSelector },
        props: {},
        emits: [],
        setup() {
            const packageName = ref(undefined)
            const packageList = [
                {
                    id: 'atlan-looker',
                    label: 'Looker Assets',
                    icon: 'https://www.pngrepo.com/png/354012/512/looker-icon.png',
                },
                {
                    id: 'atlan-athena',
                    label: 'Athena Assets',
                    icon: 'https://atlan-public.s3.eu-west-1.amazonaws.com/atlan/logos/aws-athena.png',
                },
                {
                    id: 'atlan-bigquery',
                    label: 'BigQuery Assets',
                    icon: 'https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg',
                },
            ]
            return { packageList, packageName }
        },
    })
</script>
