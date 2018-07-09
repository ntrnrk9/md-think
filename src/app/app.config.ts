import { environment } from '../environments/environment';

export class AppConfig {
    public static siteTitle = 'CJAMS';
    public static baseUrl = environment.apiHost;
    public static authTokenUrl = 'Users/login?include=["user"]';
    public static roleProfileUrl = 'Authorizes/getroleprofile';
    public static logoutUrl = 'Users/logout';
}
