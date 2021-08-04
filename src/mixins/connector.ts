import { defineComponent } from 'vue';
import { Components } from '~/api/atlas/client';
import { SourceList } from '~/constant/source';
import { AtlanTableAttributes } from '~/types/asset';

export default defineComponent({
    methods: {
        attributes(item: any) {
            return item?.attributes;
        },
        title(item: any): string {
            return this.attributes(item)?.name;
        },
        logo(item: any): string {
            const found = SourceList.find(
                (src) => src.id === this.attributes(item)?.integrationName
            );
            let logo = this.attributes(item)?.logo;
            if (found) {
                logo = found.image;
            }
            return logo;
        },
        integrationName(item: any) {
            return this.attributes(item).integrationName;
        },
        jdbcUrl(item: any) {
            return this.attributes(item).config?.attributes?.credentialTemplate
                .url;
        },
        jdbcDriver(item: any) {
            return this.attributes(item).config?.attributes?.credentialTemplate
                .driver;
        },
        supportLink(item: any) {
            return this.attributes(item).supportLink;
        },
        authTypes(item: any) {
            const temp: any[] = [];
            item?.attributes?.config?.attributes?.credential?.attributes?.auth.forEach(
                (e: { attributes: any }) => temp.push(e.attributes)
            );
            return temp;
        },
        host(item: any) {
            const temp =
                item?.attributes?.config?.attributes?.credential?.attributes
                    ?.host?.attributes;
            console.log(temp);
            if (temp) {
                temp.rules = [];
                if (temp.rules) {
                    temp.rules?.forEach(
                        (i: { attributes: { min: number; max: number } }) => {
                            if (i.attributes) {
                                if (i.attributes.min == -1) {
                                    delete i.attributes.min;
                                }
                                if (i.attributes.max == -1) {
                                    delete i.attributes.max;
                                }
                                temp.rules.push(i.attributes);
                            }
                        }
                    );
                }
            }

            console.log(temp);

            return temp;
        },
        port(item: any) {
            const temp: any[] = [];
            return item?.attributes?.config?.attributes?.credential?.attributes
                ?.port?.attributes;
        },
        extraAttributes(item: any) {
            const attr: any[] = [];
            item?.attributes?.config?.attributes?.credential?.attributes?.extra.forEach(
                (e: { attributes: any }) => {
                    attr.push(e.attributes);
                }
            );
            return attr;
        },
        authAttributes(item: any, authType: string) {
            const attr: any[] = [];
            if (authType) {
                const found = this.authTypes(item).find((item) => item.id === authType);
                if (found) {
                    found.config?.forEach((e: { attributes: any }) => {
                        attr.push(e.attributes);
                    });
                }
            }
            return attr;
        },
        enumAttributes(authAttr: any) {
            const attr: any[] = [];
            if (authAttr) {
                authAttr?.enumConfig.forEach((element) => {
                    attr.push({
                        value: element.attributes.id,
                        label: element.attributes.label,
                    });
                });
            }
            return attr;
        },
        // host(item: any) {
        // console.log("sadasd");
        // let temp = {
        //   rules: [],
        // };
        // console.log("bot", bot);
        // try {
        //   if (bot) {
        //     temp =
        //       bot.attributes.config.attributes.credential.attributes.host
        //         .attributes;
        //     if (temp) {
        //       let arr = [];
        //       temp.rules.forEach((i) => {
        //         if (i.attributes) {
        //           if (i.attributes.min == -1) {
        //             delete i.attributes.min;
        //           }
        //           if (i.attributes.max == -1) {
        //             delete i.attributes.max;
        //           }
        //           arr.push(i.attributes);
        //         }
        //       });
        //       temp.rules = arr;
        //     }
        //   }
        //   return temp;
        // } catch (e) {
        //   return this.defaultConfig.host;
        //   // }
        // },
        // getPort(bot) {
        //   let temp = {
        //     rules: [],
        //   };
        //   try {
        //     if (bot) {
        //       temp =
        //         bot.attributes.config.attributes.credential.attributes.port
        //           .attributes;

        //       if (temp) {
        //         let arr = [];
        //         temp.rules.forEach((i) => {
        //           if (i.attributes) {
        //             if (i.attributes.min == -1) {
        //               delete i.attributes.min;
        //             }
        //             if (i.attributes.max == -1) {
        //               delete i.attributes.max;
        //             }
        //             arr.push(i.attributes);
        //           }
        //         });
        //         temp.rules = arr;
        //       }
        //     }
        //     return temp;
        //   } catch (e) {
        //     return this.defaultConfig.port;
        //   }
        // },
    },
});
