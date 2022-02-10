import { useRoute } from 'vue-router'
import { getLabelsForZendeskArticles } from '~/utils/helper/labelsForZendeskArticles'
import useUserData from '~/composables/user/useUserData'

export default function useHelpWidget() {


    const route = useRoute()
    const setZendeskArticleSuggestions = () => {
        // set help desk article suggestions relevant to page
        const labels = getLabelsForZendeskArticles(route?.path ?? '')
        window.zE('webWidget', 'helpCenter:setSuggestions', {
            labels,
        })
    }
    const prefillEmailField = () => {
        // prefill email field in zendesk form; the field is hidden
        const { email } = useUserData()
        window.zE('webWidget', 'prefill', {
            email: {
                value: email,
                readOnly: true, // optional
            },
        })
    }
    const toggleHelpWidget = () => {
        setZendeskArticleSuggestions()
        prefillEmailField()
        window.zE('webWidget', 'toggle')
    }
    const openHelpWidget = () => {
        setZendeskArticleSuggestions()
        prefillEmailField()
        window.zE('webWidget', 'open')
    }
    return {
        toggleHelpWidget,
    }
}
