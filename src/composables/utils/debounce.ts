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
