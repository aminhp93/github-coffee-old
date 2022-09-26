## Copy text

```js
const copyToClipboard = (text) =>
  navigator?.clipboard?.writeText(text) ?? false;
```

- Usage

```js
copyToClipboard('Hello World!');
```

##
