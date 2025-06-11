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

## Declare

Add an attribute with the pattern `_event=action`. The `#action` event will _always_ dispatch from
the element with the `_event` attribute.

```html
<button _click="decrement">-</button>
<button _click="increment">+</button>
```

## Listen

```js
addEventListener("#action", (e) => {
    let {action} = e;

    if ("decrement" === action) {
        // decrement something!
    }
    
    if ("increment" === action) {
        // increment something!
    }
});
```

## License

`Wctk` is released under the BSD-3 Clause License.
