// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

// export const environment = {
//   production: false,
//   apiHost: 'https://dh4dnuwtr86yp.cloudfront.net/api',
//   formBuilderHost: 'http://ec2-54-169-187-92.ap-southeast-1.compute.amazonaws.com:3001',
//   reportHost: 'https://10.88.40.141/',
//   fakeHttpResponse: false,
//   envName: 'dev'
// };

export const environment = {
    production: false,
    apiHost: 'https://dh4dnuwtr86yp.cloudfront.net/api',
    // formBuilderHost: 'http://ec2-52-221-238-235.ap-southeast-1.compute.amazonaws.com:3001',
    formBuilderHost: 'https://d31m5g4j9yczyt.cloudfront.net',
    reportHost: 'https://10.88.40.141/',
    fakeHttpResponse: false,
    envName: 'dev'
};
