
import { AuthenticationContext, adalFetch, withAdalLogin, AdalConfig } from "react-adal";
export const runWithAdal=(authContext, app) => {
    //it must run in iframe to for refreshToken (parsing hash and get token)
    authContext.handleWindowCallback();
  
    //prevent iframe double app !!!
    if (window === window.parent) {
      if (!authContext.isCallback(window.location.hash)) {
        if (
          !authContext.getCachedToken(authContext.config.clientId) ||
          (!authContext.getCachedUser())
        ) {
          authContext.login();
        } else {
          app();
        }
      }
    }
  }


 export const adalConfig: AdalConfig = {
     tenant: localStorage.getItem("TenantId")!,
     clientId: localStorage.getItem("ClientId")!,
     endpoints: {
         api: localStorage.getItem("TokenEndpoint")!,
     },
     postLogoutRedirectUri: window.location.origin,
     cacheLocation: 'localStorage'
 };


export const authContext = new AuthenticationContext(adalConfig);
export const getToken = () => authContext.getCachedToken(adalConfig.clientId);
export const adalApiFetch = (fetch: any, url: any, options: any) =>
    adalFetch(authContext, adalConfig!.endpoints!.api, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig!.endpoints!.api);