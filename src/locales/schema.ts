const recursivelyBuildObject = (keys, value, currIndex = 0) => {
    const currentKey = keys[currIndex]
    if (currIndex === keys.length - 1) {
        return {
            [currentKey]: value.default,
        }
    }
    return {
        [currentKey]: recursivelyBuildObject(keys, value, currIndex + 1),
    }
}

const messages = { en: {} }

Object.entries(import.meta.globEager('./**/*.json')).forEach(([key, value]) => {
    const json = key.endsWith('.json')
    const onlyFilePaths = key.slice(2, json ? -5 : -4).split('/')
    const language = onlyFilePaths.pop()
    if (language) {
        messages[language] = {
            ...messages[language],
            ...recursivelyBuildObject(onlyFilePaths, value),
        }
    }
})
type MessageSchema = typeof messages.en

export { messages, MessageSchema }
