# Stargate utils

```
npm install @valgeny/lotr-sdk
```


# Building


## Prerequisites
1. Create a npm account
1. Log in on your local machine
```
npm adduser
```

## Publish a new version

1. Install (required only if dependencies were modified)

    ```
    npm i,
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
