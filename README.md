# json-schema

A custom element for rendering a json schema. It renders the schema so that it reads naturally to a developer.

> Note: it may not support all json schema features for now, so is not ready for the big time yet.

## prerequisites

A browser that fully supports Custom Elements v1

## dependencies

Runtime: None

Build: A build tool that can assemble es6, aka webpack or rollup.


## usage 

```html
<head>
  <!-- the default font is Roboto Mono -->
  <link href="//fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">
</head>

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
--json-schema-font-color: cyan;

```


## demo 

```shell
npm install 
cd demo 
../node_modules/.bin/webpack-dev-server --hot --inline
```

## test 

we use web-component-tester to test. It's a bit cumbersome, but jsdom doesn't support the custom element api yet.

```
npm test 
```