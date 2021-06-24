import { computed, Ref } from 'vue';
import { BotsType } from '~/types/atlas/bots';

export default function useBotModel(item: BotsType) {

    const host = computed(() => {
        let temp =
            item?.attributes?.config?.attributes?.credential?.attributes?.host
                ?.attributes;
        if (temp) {
            temp.rules = [];
            if (temp.rules) {
                temp.rules?.forEach((i) => {
                    if (i.attributes) {
                        delete i.attributes.min;
                        delete i.attributes.max;
                        temp.rules.push(i.attributes);
                    }
                });
            }
        }
        return temp;
    });


    const port = computed(() => {
        return item?.attributes?.config?.attributes?.credential?.attributes?.port
            ?.attributes;
    });

    const database = computed(() => {
        return item?.attributes?.config?.attributes?.credential?.attributes?.database
            ?.attributes;
    });

    const extraAttributes = computed(() => {
        let attr: any[] = [];
        item?.attributes?.config?.attributes?.credential?.attributes?.extra.forEach(
            (e: { attributes: any }) => {
                attr.push(e.attributes);
            }
        );

        console.log("extra", attr);
        return attr;
    });

    const authTypes = computed(() => {
        let temp: any[] = [];
        item?.attributes?.config?.attributes?.credential?.attributes?.auth.forEach(
            (e) => {
                console.log(e);
                return temp.push(e.attributes)
            }
        );
        return temp;
    });

    const authAttributes = (selectedAuthType: any) => {
        let attr: any[] = [];
        if (authTypes) {
            const found = authTypes.value.find((i) => {
                return i.id === selectedAuthType;
            });
            if (found) {
                found.config?.forEach((e: { attributes: any }) => {
                    attr.push(e.attributes);
                });
            }
        }
        return attr;
    };


    const enumAttributes = (authAttr: any) => {
        let attr: any[] = [];
        if (authAttr) {
            authAttr?.enumConfig.forEach((element) => {
                attr.push({
                    value: element.attributes.id,
                    label: element.attributes.label,
                });
            });
        }
        return attr;
    };

    return {
        host,
        port,
        database,
        extraAttributes,
        authAttributes,
        authTypes,
        enumAttributes
    }
}