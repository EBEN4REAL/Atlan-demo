export const debounce = (fn: any, delay: any) => {
    let timeout: any = null;
    return (...args: any) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export function createDebounce() {
    let timeout = null
    return function (fnc: () => void, delayMs: number) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fnc()
        }, delayMs || 500)
    }
}