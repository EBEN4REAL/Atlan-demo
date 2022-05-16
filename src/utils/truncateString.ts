
export const truncateString = (text: string, maxChars: number, suffix: any): string => {

    if(text.length > maxChars) {
        text =  `${text.substring(0, 12)}${suffix}`
    }

    return text  

}