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

## Typescript

I'm not trying to pollute your globals so if you want typed `#action` events, please add the following to your app somewhere thoughtful.

```ts
declare global {
  interface GlobalEventHandlersEventMap {
    ["#action"]: SuperActionEvent;
  }
}
```

## Examples

Here are some examples to demonstrate how easy it is to work with `superaction-js`:
- a simple [counter](./examples/counter/)
- a small [sketchpad](./examples/sketch/) using an offscreen canvas

## License

`Wctk` is released under the BSD-3 Clause License.
