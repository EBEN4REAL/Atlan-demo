import { Ref, ref } from 'vue'

export function useConnector() {
    const selectedDefaultSchema: Ref<string | undefined> = ref()
    const selectedDataSourceName: Ref<string | undefined> = ref()

    const setSchemaAndSoruceName = (
        selectedDefaultSchema: Ref<string>,
        selectedDataSourceName: Ref<string>,
        schema: string,
        sourceName: string
    ) => {
        selectedDefaultSchema.value = schema
        selectedDataSourceName.value = sourceName
        console.log(
            selectedDefaultSchema.value,
            selectedDataSourceName.value,
            'selected Scehma And Soruce name'
        )
    }
    const getSchemaAndSourceName = (
        attributeValue: string
    ): { schema: string | undefined; sourceName: string | undefined } => {
        let schema: string | undefined = undefined,
            sourceName: string | undefined = undefined
        const values: string[] = attributeValue.split('/')
        sourceName = `${values[0]}/${values[1]}/${values[2]}`
        if (values.length > 4) {
            // it have schema

            schema = `${values[3]}.${values[4]}`
        }

        return {
            schema,
            sourceName,
        }
    }
    return {
        selectedDefaultSchema,
        selectedDataSourceName,
        setSchemaAndSoruceName,
        getSchemaAndSourceName,
    }
}
