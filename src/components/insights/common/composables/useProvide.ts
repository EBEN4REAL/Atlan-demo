import { provide, Ref, ComputedRef } from 'vue'

export interface provideDataInterface {
    [index: string]: Function | Ref<any> | Ref<string> | ComputedRef<any>
}
export function useProvide(provideData: provideDataInterface) {
    const keys = Object.keys(provideData)
    keys.forEach((key) => {
        provide(key, provideData[key])
    })
}
