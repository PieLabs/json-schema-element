# json-schema

A custom element for rendering a json schema

> Note: it may not support all json schema features for now.

## prerequisites

A browser that fully supports Custom Elements v1

## dependencies

Runtime: None

Build: A build tool that can assemble es6, aka webpack or rollup.


## usage 

```html
<json-schema></json-schema>
<script>
document.addEventListener('DOMContentLoaded', () => {
   document.querySelector('json-schema').schema = {};
});
</script>
```

### css variables

```css
--json-schema-hr-color: red;
--json-schema-comment-color: blue;
--json-schema-button-label-color: purple;
--json-schema-button-bg: yellow;
--json-schema-button-bg-hover: orange;
--json-schema-font: Georgia, serif;
--json-schema-font-color: cyan;-->

```


## demo 

```shell
npm install 
cd demo 
../node_modules/.bin/webpack-dev-server --hot --inline
```

## test 

```
npm test 
```