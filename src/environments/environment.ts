// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    apiHost: 'http://cjamsapi-1492929077.ap-southeast-1.elb.amazonaws.com/api',
    formBuilderHost: 'http://ec2-54-169-187-92.ap-southeast-1.compute.amazonaws.com:3001',
    reportHost: 'https://10.88.40.141',
    fakeHttpResponse: true
};
