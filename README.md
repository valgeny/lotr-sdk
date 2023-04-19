# Stargate utils

```
npm install @valgeny/lotr-sdk
```


# Building

1. Create a new Branch with the `-build` suffix
    ```
    git checkout -b <YOUR_BRANCH_NAME>-build
    ```

1. Compile module

    ```
    npm run compile,
    ```

1. Commit & push

# Development work (local)

1. Update `package.json`
    ```yaml
    ...
    "@valgeny/lotr-sdk": "file:../lotr-sdk",
    ...
    ```

1. Install latest version of the package
    ```
    npm install @valgeny/lotr-sdk@latest
    ```
