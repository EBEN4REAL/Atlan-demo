import { UserModule } from "~/types/vitessg";

export const install: UserModule = ({ app }) => {
    window.onUsersnapCXLoad = function(api) {
        api.init();
      }
      var script = document.createElement('script');
      script.defer = 1;
      script.src = 'https://widget.usersnap.com/global/load/90e39b10-4aa3-4dee-bc5d-5e60e5600770?onload=onUsersnapCXLoad';
      document.getElementsByTagName('head')[0].appendChild(script);
};
