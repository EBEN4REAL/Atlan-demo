import { Ref, ref } from 'vue'

export function useFullScreen() {
    const fullScreenId = 'fullScreenId'
    const fullSreenState: Ref<boolean> = ref(false)

    const toggleFullScreenMode = (fullSreenState: Ref<boolean>) => {
        // Get the element that we want to take into fullscreen mode
        const element: any = document.getElementById(fullScreenId)

        console.log('full screen: ', fullSreenState.value)
        if (fullSreenState.value) {
            fullSreenState.value = !fullSreenState.value

            if (document?.exitFullscreen) {
                document?.exitFullscreen()
            } else if (document?.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document?.webkitCancelFullScreen) {
                document.webkitCancelFullScreen()
            } else if (document?.msExitFullscreen) {
                document.msExitFullscreen()
            }


        } else {
            fullSreenState.value = !fullSreenState.value
            // These function will not exist in the browsers that don't support fullscreen mode yet,
            // so we'll have to check to see if they're available before calling them.
            if (element?.requestFullscreen) {
                element.requestFullscreen();
            } else if (element?.msRequestFullscreen) { /* IE11 */
                element.msRequestFullscreen();
            } else if (element?.mozRequestFullScreen) {
                // This is how to go into fullscren mode in Firefox
                // Note the "moz" prefix, which is short for Mozilla.
                element?.mozRequestFullScreen()
            } else if (element.webkitRequestFullScreen) {
                // This is how to go into fullscreen mode in Chrome and Safari
                // Both of those browsers are based on the Webkit project, hence the same prefix.
                element.webkitRequestFullScreen()
            }

            // Hooray, now we're in fullscreen mode!
        }
    }
    const setFullScreenState = (
        state: boolean,
        fullSreenState: Ref<boolean>
    ) => {
        fullSreenState.value = state
    }

    return {
        fullSreenState,
        setFullScreenState,
        toggleFullScreenMode,
    }
}
