export default {
    data: {},
    start(id: string) {
        if (!id) return
        if (this.data[id]) delete this.data[id]
        this.data = { ...this.data, [id]: 0 }
        const start = performance.now()
        this.data[id] = start
    },
    end(id: string) {
        if (!this.data[id]) return
        const mSecToSec = (mSec) => {
            const minutes = Math.floor(mSec / 60000)
            const seconds = Number(((mSec % 60000) / 1000).toFixed(0))
            return seconds === 60
                ? `${minutes + 1}min:00sec`
                : `${minutes}min:${seconds}sec`
        }
        const start = this.data[id]
        const end = performance.now()
        const diff = end - start
        const result = `${id} took: ${mSecToSec(diff)}`
        // eslint-disable-next-line no-console
        console.log(result)
        delete this.data[id]
    },
    clear(id: string) {
        if (id && this.data[id]) {
            delete this.data[id]
            return
        }
        this.data = {}
    },
}

/**
 ** Implementation
 
    const sampleFxn = () => {
        // ...
        execTime.start('sampleFxn')
        // execTime.clear('sampleFxn') // to remove an execution ID ... if no id arg it clears all 

        setTimeout(() => {
            // ....
            execTime.end('sampleFxn') // console logs this -> 'sampleFxn took: 0min:5sec'
        }, 5000)
    }

    sampleFxn()
 */
