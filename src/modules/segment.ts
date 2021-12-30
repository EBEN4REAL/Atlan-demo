//WARNING: We use our own CDN not the default one from Segment. Mindful when you change

import { UserModule } from '~/types/vitessg'

export const install: UserModule = ({ app }) => {
    const segmentKey = import.meta.env.VITE_SEGMENT_ANALYTICS_KEY
    if (segmentKey) {
        !(function () {
            console.log('segment install')
            var analytics = (window.analytics = window.analytics || [])
            if (!analytics.initialize)
                if (analytics.invoked)
                    window.console &&
                        console.error &&
                        console.error('Segment snippet included twice.')
                else {
                    analytics.invoked = !0
                    analytics.methods = [
                        'trackSubmit',
                        'trackClick',
                        'trackLink',
                        'trackForm',
                        'pageview',
                        'identify',
                        'reset',
                        'group',
                        'track',
                        'ready',
                        'alias',
                        'debug',
                        'page',
                        'once',
                        'off',
                        'on',
                        'addSourceMiddleware',
                        'addIntegrationMiddleware',
                        'setAnonymousId',
                        'addDestinationMiddleware',
                    ]
                    analytics.factory = function (e) {
                        return function () {
                            var t = Array.prototype.slice.call(arguments)
                            t.unshift(e)
                            analytics.push(t)
                            return analytics
                        }
                    }
                    for (var e = 0; e < analytics.methods.length; e++) {
                        var key = analytics.methods[e]
                        analytics[key] = analytics.factory(key)
                    }
                    analytics.load = function (key, e) {
                        var t = document.createElement('script')
                        t.type = 'text/javascript'
                        t.async = !0
                        t.src =
                            'https://cdn.atlan.com/analytics.js/v1/' +
                            key +
                            '/analytics.min.js'
                        var n = document.getElementsByTagName('script')[0]
                        n.parentNode.insertBefore(t, n)
                        analytics._loadOptions = e
                    }
                    analytics._writeKey = segmentKey
                    analytics.SNIPPET_VERSION = '4.15.3'
                    analytics.load(segmentKey)
                    app.config.globalProperties.$analytics = window.analytics
                    app.provide('$analytics', window.analytics)
                    //analytics.page();
                }
        })()
    }
}
