```js
const copyToClipboard = (text) =>
  navigator?.clipboard?.writeText(text) ?? false;

// Usage
copyToClipboard('Hello World!');
```
