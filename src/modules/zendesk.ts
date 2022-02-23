import { UserModule } from "~/types/vitessg";

export const install: UserModule = ({ app }) => {
    var script = document.createElement('script');
    script.defer = 1;
    script.id = "ze-snippet";
    script.addEventListener("load", function (event) {
        window.zESettings = {
            webWidget: {
                zIndex: 1000,
                color: {
                    theme: '#3862D2',
                    launcher: '#CC3A83',
                    launcherText: '#E589B7',
                    button: '#3862D2',
                    articleLinks: '#3862D2',
                    header: '#3862D2',
                    resultLists: '#3862D2',
                },
                launcher: {
                    label: {
                        '*': 'Chat now',
                    },
                },
                // answerBot: {
                //     suppress: true,
                // },
                answerBot: {
                    title: {
                        '*': 'Chat with us!',
                    },

                    avatar: {
                        url: `/atlan-logo.png`,
                        name: {
                            '*': 'Atlan',
                        },
                    },
                },
                contactForm: {
                    ticketForms: [{ id: 1900000492633, title: false }],
                    title: {
                        '*': 'Report a bug or request a feature',
                    },
                },
            },
        }

        window.zE('webWidget:on', 'open', function () {
            // creates any CSS to be added to the Web Widget
            var style = document.createElement('style')
            style.innerHTML = `
                    #Embed{
                        font-family: Avenir;
                    }
                    .styles__Fields-sc-cb953b-1.gJkjOz > div:nth-child(2){
                        margin-top:0 !important;
                    }
                    [data-garden-id="forms.field"] [data-fieldid="email"]{
                        display:none !important;
                    }
                    [data-garden-id="forms.field"] [name="email"]{
                        display:none !important; 
                    }
                    .dmwHSF, .iuJCfr{
                        color: #3862D2 !important;
                    }
            `

            // appends the CSS in the web widget

            //TODO: Find a better way than setTimeout to append css in iframe
            setTimeout(() => {
                parent.document
                    .getElementById('webWidget')
                    .contentDocument.head.appendChild(style)
            }, 500)
        })
    });
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=5a56374b-0c6a-43d9-8abb-ed8724bae48e';
    document.getElementsByTagName('head')[0].appendChild(script);
};