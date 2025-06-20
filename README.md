# SuperAction-js

A hypertext extension to dispatch actions on events in the browser.

## Install

```sh
npm install --save-dev https://github.com/w-lfpup/superaction-js
```

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
	let { action } = e;

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
import { SuperActionEvent } from "superaction";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: SuperActionEvent;
	}
}
```

## Examples

Here are some examples to demonstrate how easy it is to work with `SuperAction-js`:

- a simple [counter](https://w-lfpup.github.io/superaction-js/examples/counter/)
- a small [sketchpad](https://w-lfpup.github.io/superaction-js/examples/sketch/) using an offscreen canvas

## License

`SuperAction-js` is released under the BSD-3 Clause License.
