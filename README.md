# Salve Maria Education Assessment

As part of merging of extensions, functionalities of this widget has been moved to the following extension. 

https://github.com/ohosolutions/salve-maria-assessment

<details>
  <summary>Documentation</summary>

## Project setup

Install the project dependencies.

```bash
yarn global add zoho-extension-toolkit
yarn install
```

### Compiles and hot-reloads for development

This is start a server at `http://localhost:5000` which needs to be configured on the Widget settings with hosting set to external.

```bash
yarn serve
```

### Compiles and minifies for production

The `vue.config.js` files will push the build to `app/` folder to make it compatible with `zet`.

```bash
yarn build
zet pack
```
</details>
