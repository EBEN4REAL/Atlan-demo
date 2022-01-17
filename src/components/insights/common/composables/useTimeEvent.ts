import {ref, watch, computed} from 'vue'

    let startTime = ref(0)
    let responseTime = ref(0)
    let renderTime = ref(0)


export function useTimeEvent() {
    
    
    const setStartTime = (time) => {
        startTime.value = time
    }
    const setResponseTime = (time) => {
        responseTime.value = time
    }
    const setRenderTime = (time) => {
        renderTime.value = time
    }

    let dataResponse = computed(()=>
        (responseTime.value-startTime.value)
   )

    let renderResponse = computed(()=>
        (renderTime.value-responseTime.value)
    )

    let totalRenderTime = computed(()=> (renderTime.value-startTime.value))

    return {
        setStartTime,
        setResponseTime,
        setRenderTime,
        dataResponse,
        renderResponse,
        startTime,
        responseTime,
        renderTime,
        totalRenderTime
    }
}
