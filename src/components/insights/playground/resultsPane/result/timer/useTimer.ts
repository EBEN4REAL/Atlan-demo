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
        console.log('clock running: ', started)
        var currentTime = new Date(),
            timeElapsed = new Date(currentTime - timeBegan),
            hour = timeElapsed.getUTCHours(),
            min = timeElapsed.getUTCMinutes(),
            sec = timeElapsed.getUTCSeconds()

        if (document.getElementById(`${timerId}_timer`)) {
            document.getElementById(`${timerId}_timer`).innerHTML =
                (hour > 9 ? hour : '0' + hour) +
                ':' +
                (min > 9 ? min : '0' + min) +
                ':' +
                (sec > 9 ? sec : '0' + sec)
        }
    }

    return {
        start,
        reset,
    }
}
