# SuperAction-js

A hypertext extension to dispatch meaningful actions from the DOM.

## Install

Install via npm.

```sh
npm install --save-dev @w-lfpup/superaction
```

Or install directly from github.

```sh
npm install --save-dev https://github.com/w-lfpup/superaction-js
```

## Setup

Create a `SuperAction` instance dispatch action events.

The `SuperAction` instance below listens for `click` events. Event listeners are immediately `connected` to the `document`.

This enables the DOM to declaratively send meaningful messages to Javascript-land.

```js
import { SuperAction } from "superaction";

const _superAction = new SuperAction({
	host: document,
	connected: true,
	eventNames: ["click"],
});
```

## Declare

Add an attribute with the pattern `event:=action`. The `#action` event will dispatch from the `host` element

```html
<button click:="increment">+</button>
```

## Listen

Now the `button` will dispatch an `ActionEvent` from the `host` when clicked.

Add an event listener to connect action events from the UI to javascript-land.

```js
document.addEventListener("#action", (e) => {
	let { action, sourceEvent, formData } = e.actionParams;

	if ("increment" === action) {
		// increment something!
	}
});
```

Form data is available when action events originate from form elements.

Learn more about action events [here](./action_events.md).

## Typescript

I'm not trying to pollute your globals so if you want typed `#action` events, please add the following to your app somewhere thoughtful.

```ts
import type { ActionEventInterface } from "superaction";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
}
```

## Examples

Here are some examples to demonstrate how easy it is to work with `SuperAction-js`:

- a simple [counter](https://w-lfpup.github.io/superaction-js/examples/counter/)
- a small [sketchpad](https://w-lfpup.github.io/superaction-js/examples/sketch/) using an offscreen canvas

## Why do this?

`Superaction` is inspired by the [elm](https://elm-lang.org) project.

It turns HTML into a declarative and _explicit_ message generator and removes several layers of indirection between UI and app state.

`Superaction` is a straightforward way to work with vanilla web technologies and escape the JSX rabbithole.

## License

`SuperAction-js` is released under the BSD-3 Clause License.
