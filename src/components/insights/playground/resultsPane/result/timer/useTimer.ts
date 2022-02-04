import { ref, Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

export function useTimer(activeInlineTab: Ref<activeInlineTabInterface>) {
    let timerId = activeInlineTab.value.key

    let timeBegan = null,
        started = null

    function start() {
        if (timeBegan === null) {
            timeBegan = new Date()
        }

        started = setInterval(clockRunning, 10)
    }

    function reset() {
        clearInterval(started)
        timeBegan = null
        if (document.getElementById(`${timerId}_timer`)) {
            document.getElementById(`${timerId}_timer`).innerHTML = '00:00:00'
        }
    }

    function clockRunning() {
        var currentTime = new Date(),
            timeElapsed = new Date(currentTime - timeBegan),
            hour = timeElapsed.getUTCHours(),
            min = timeElapsed.getUTCMinutes(),
            sec = timeElapsed.getUTCSeconds()
        // console.log('timer: ', {
        //     hour: typeof hour,
        //     min: typeof min,
        //     sec: typeof sec,
        // })

        if (document.getElementById(`${timerId}_timer`)) {
            document.getElementById(`${timerId}_timer`).innerHTML =
                (hour ? hour + 'h ' : '') + (min ? min + 'm ' : '') + sec + 's'
        }
    }

    return {
        start,
        reset,
    }
}
