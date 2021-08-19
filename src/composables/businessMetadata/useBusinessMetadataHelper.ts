// * Composables
import useEnums from "@/admin/enums/composables/useEnums";

export default function useBusinessMetadataHelper() {
    const { enumListData: enumsList } = useEnums();
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
    return {
        getDatatypeOfAttribute
    }
}