import { UserModule } from "~/types/vitessg";

export const install: UserModule = ({ app }) => {
    const script = document.createElement('script');
    script.async = true;
    script.addEventListener("load", (event) => {
        window.announcekit = (window.announcekit || {
            queue: [], on(n, x) {
                window.announcekit.queue.push([n, x]);
            }, push(x) { window.announcekit.queue.push(x); }
        });
    });
    script.src = 'https://cdn.announcekit.app/widget-v2.js';
    document.getElementsByTagName('head')[0].appendChild(script);
};