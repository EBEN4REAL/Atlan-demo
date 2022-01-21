import { ref, Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

export function useTimer(activeInlineTab: Ref<activeInlineTabInterface>) {
    let timerId = activeInlineTab.value.key

    let timeBegan = null,
        timeStopped = null,
        stoppedDuration = 0,
        started = null

    function start() {
        if (timeBegan === null) {
            timeBegan = new Date()
        }

        if (timeStopped !== null) {
            stoppedDuration += new Date() - timeStopped
        }
        console.log(stoppedDuration)

        started = setInterval(clockRunning, 10)
    }

    function stop() {
        timeStopped = new Date()
        clearInterval(started)
    }

    function reset() {
        clearInterval(started)
        stoppedDuration = 0
        timeBegan = null
        timeStopped = null
        document.getElementById(`${timerId}_timer`).innerHTML = '00:00:00"000'
    }

    function clockRunning() {
        var currentTime = new Date(),
            timeElapsed = new Date(currentTime - timeBegan - stoppedDuration),
            hour = timeElapsed.getUTCHours(),
            min = timeElapsed.getUTCMinutes(),
            sec = timeElapsed.getUTCSeconds(),
            ms = timeElapsed.getUTCMilliseconds()

            // console.log(document.getElementById(`${timerId}_timer`))
            // debugger

        document.getElementById(`${timerId}_timer`).innerHTML =
            (hour > 9 ? hour : '0' + hour) +
            ':' +
            (min > 9 ? min : '0' + min) +
            ':' +
            (sec > 9 ? sec : '0' + sec) +
            ':' +
            (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms)
    }

    return {
        start,
        reset
    }
}
