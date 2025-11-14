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

Create a `SuperAction` instance with `eventNames` to dispatch `actions`.

The `SuperAction` below listens for `click` events. Event listeners are immediately `connected` to the `document`.

This enables the DOM to declaratively send meaningful messages to Javascript-land.

```js
import { SuperAction } from "superaction";

const _superAction = new SuperAction({
	target: document,
	connected: true,
	eventNames: ["click"],
});
```

## Declare

Add an attribute with the pattern `event:=action`. The `#action` event will _always_ dispatch from
the element with the `event:` attribute.

```html
<button click:="decrement">-</button>
<button click:="increment">+</button>
```

## Listen

Now either `button` will dispatch an `ActionEvent` when they are clicked.

```js
addEventListener("#action", (e) => {
	let { action, sourceEvent } = e.actionParams;

	if ("decrement" === action) {
		// decrement something!
	}

	if ("increment" === action) {
		// increment something!
	}
});
```

An `ActionEvent` has three properties:

```ts
interface ActionInterface {
	sourceEvent: Event;
	action: string;
	formData?: FormData;
}
```

Form data is optional and only available when an `action` originates from a form element.

## Action Event Lifecycles

### Event stacking

`Superaction-js` listens to any DOM event that bubbles.

Turns out that's [all UI Events](https://www.w3.org/TR/uievents/#events-uievents). Which is a lot of events!

```html
<body click:="A">
	<div click:="B">
		<button click:="C">hai :3</button>
	</div>
</body>
```

So when a person clicks button above, the order of action events is:

- Action "C"
- Action "B"
- Action "A"

### Event Propagation

Action event propagation has a declarative API similar to DOM events:

```html
<body
	click:="A"
	click:stop-immediate-propagation>
	<form
		click:="B"
		click:prevent-default>
		<button
			type=submit
			click:="C">
			UwU
		</button>
		<button
			type=submit
			click:="D"
			click:stop-propagation
			>
			^_^
		</button>
	</form>
</body>
```

So when a person clicks the buttons above, the order of action events is:

Click button C:

- Action "C" dispatched
- `preventDefault()` is called on the original `HTMLSubmitEvent`
- Action "B" dispatched
- Action event propagation is stopped similar to `event.stopImmediatePropagation()`
- Action "A" does _not_ dispatch

Click button D:

- Action "D" dispatched
- Action event propagation stopped similar to `event.stopPropagation()`

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

## License

`SuperAction-js` is released under the BSD-3 Clause License.
