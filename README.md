# SuperAction-js

A hypertext extension to dispatch actions on events in the browser.

## Setup

Create a `SuperAction` instance with `eventNames` to dispatch `actions`.

The `SuperAction` below listens for `click` events. Event listeners are immediately `connected` to the `document`.

```js
import { SuperAction } from "superaction";

const superAction = new SuperAction({
    host: document,
    connected: true,
    eventNames: ["click"],
});
```

## Declarative Syntax

Add an attribute with the pattern `_event=action`.

```html
<button _click="decrement">-</button>
<span count>42</span>
<button _click="increment">+</button>
```
