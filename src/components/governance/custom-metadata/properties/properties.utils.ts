export const getAnalyticsProperties = (tempForm, cm_title) => {
    let dataType = tempForm?.typeName
    if (tempForm?.options.isEnum) {
        dataType = 'enum'
    } else if (tempForm?.options.customType) {
        dataType = tempForm?.options.customType
    }
    const properties = {
        cm_title,
        title: tempForm.displayName,
        description:
            tempForm.description || tempForm.options.description || "",
        data_type: dataType,
        multi_value: tempForm?.options.multiValueSelect,
        allow_filtering: tempForm?.options.allowFiltering,
        show_in_overview: tempForm?.options.showInOverview,
    }
    return properties
}