export interface ReqConfig { url: string; method: string; params?: object; addFormValues?: string[]; body?: Object }

export interface ResConfig { rootPath: string; labelPath: string; valuePath: string; errorMessage?: string, errorLabelPath?: string }
