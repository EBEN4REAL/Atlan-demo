import { ref, Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

export function useTimer(
    activeInlineTab: Ref<activeInlineTabInterface>,
    explicitTimerKey?: string
) {
    let timerId = activeInlineTab.value.key
    if (explicitTimerKey) {
        timerId = explicitTimerKey
    }

    let timeBegan = null,
        started = null

    function start() {
        if (timeBegan === null) {
            timeBegan = new Date()
        }

        started = setInterval(clockRunning, 100)
    }

    function reset() {
        clearInterval(started)
        timeBegan = null
        if (document.getElementById(`${timerId}_timer`)) {
            document.getElementById(`${timerId}_timer`).innerHTML = '0s'
        }
    }

    function clockRunning() {
        var currentTime = new Date(),
            timeElapsed = new Date(currentTime - timeBegan),
            hour = timeElapsed.getUTCHours(),
            min = timeElapsed.getUTCMinutes(),
            sec = timeElapsed.getUTCSeconds(),
            ms = timeElapsed.getUTCMilliseconds()
        // console.log('timer: ', {
        //     hour: typeof hour,
        //     min: typeof min,
        //     sec: typeof sec,
        // })

        if (document.getElementById(`${timerId}_timer`)) {
            document.getElementById(`${timerId}_timer`).innerHTML =
                (hour ? hour + 'h ' : '') +
                (min ? min + 'm ' : '') +
                sec +
                '.' +
                `${ms}`[0] +
                's'
        }
    }

    return {
        start,
        reset,
    }
}
