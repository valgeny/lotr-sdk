# LOTR SDK

SDK to access the LOTR Api v2

See also: 
- https://the-one-api.dev/
- https://the-one-api.dev/documentation

## Prerequisites
- NodeJs > 18 (Fetch module)

See also: 
- https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/
- https://dev.to/cloudx/nodejs-18-fetch-api-test-runner-module-and-more-2ckg

# Using it in your app
```
npm install @valgeny/lotr-sdk@latest
```


# Building and publishing a new version

## Prerequisites
1. Create a npm account
1. Log in on your local machine
```
npm adduser
```


1. Install (required only if dependencies were modified)

    ```
    npm install,
    ```
1. Compile module

    ```
    npm run compile,
    ```
1. Increment version
    ```
    npm version patch -m 'New release'
    ```
1. Publish (public)
    ```
    npm publish --access=public
    ```

1. Install latest version of the package
    ```
    npm install @valgeny/lotr-sdk@latest
    ```
