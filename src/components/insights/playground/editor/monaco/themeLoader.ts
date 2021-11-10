import atlanLight from '~/components/insights/playground/editor/monaco/_themes/atlanLight.json'
import amy from '~/components/insights/playground/editor/monaco/_themes/amy.json'
import Blackboard from '~/components/insights/playground/editor/monaco/_themes/blackboard.json'
import Cobalt from '~/components/insights/playground/editor/monaco/_themes/cobalt.json'
import Dracula from '~/components/insights/playground/editor/monaco/_themes/dracula.json'
import Monokai from '~/components/insights/playground/editor/monaco/_themes/monokai.json'
import NightOwl from '~/components/insights/playground/editor/monaco/_themes/nightOwl.json'
import SolarizedDark from '~/components/insights/playground/editor/monaco/_themes/solarizedDark.json'
import SolarizedLight from '~/components/insights/playground/editor/monaco/_themes/solarizedLight.json'
import Tomorrow from '~/components/insights/playground/editor/monaco/_themes/tomorrow.json'
import TomorrowNightBright from '~/components/insights/playground/editor/monaco/_themes/tomorrowNightBright.json'
import XCode from '~/components/insights/playground/editor/monaco/_themes/xcode.json'

export const themes = [
    {
        theme: amy,
        name: 'Amy',
        label: 'Amy',
    },
    {
        theme: atlanLight,
        name: 'AtlanLight',
        label: 'Atlan Light',
    },
    {
        theme: Blackboard,
        name: 'Blackboard',
        label: 'Blackboard',
    },
    {
        theme: Cobalt,
        name: 'Cobalt',
        label: 'Cobalt',
    },
    {
        theme: Dracula,
        name: 'Dracula',
        label: 'Dracula',
    },
    {
        theme: Monokai,
        name: 'Monokai',
        label: 'Monokai',
    },
    {
        theme: NightOwl,
        name: 'NightOwl',
        label: 'Night Owl',
    },
    {
        theme: SolarizedDark,
        name: 'SolarizedDark',
        label: 'Solarized Dark',
    },
    {
        theme: SolarizedLight,
        name: 'SolarizedLight',
        label: 'Solarized Light',
    },
    {
        theme: Tomorrow,
        name: 'Tomorrow',
        label: 'Tomorrow',
    },
    {
        theme: TomorrowNightBright,
        name: 'TomorrowNightBright',
        label: 'Tomorrow Dark',
    },
    {
        theme: XCode,
        name: 'XCode',
        label: 'XCode',
    },
]

export const loadThemes = (monaco: any) => {
    themes.forEach((theme) => {
        monaco.editor.defineTheme(theme.name, theme.theme)
    })
}
