# SuperAction-js

A hypertext extension to upgrade your HTML with a declarative eventbus.

(It's also a proof-of-concept for [hyperevents-js](https://github.com/w-lfpup/hyperevents-js)).

[![tests](https://github.com/w-lfpup/superaction-js/actions/workflows/tests.yml/badge.svg)](https://github.com/w-lfpup/superaction-js/actions/workflows/tests.yml)

## Examples

Superaction is little different compared to most frontend libraries. HTML declares
what actions are sent to javascript-land similar to a classic eventbus.

Checkout how to build a simple click [counter](./examples/counter/) ([live example](https://w-lfpup.github.io/superaction-js/examples/counter/)).

And then look at more interesting example and [sketch](./examples/sketch/) on an offscreen canvas ([live example](https://w-lfpup.github.io/superaction-js/examples/sketch/)).

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

Create a `SuperAction` instance to dispatch action events.

The `SuperAction` instance below listens for `click` events. Event listeners are immediately `connected` to the `document`.

```js
import { SuperAction } from "superaction";

const _superAction = new SuperAction({
	host: document,
	eventNames: ["click"],
	connected: true,
});
```

Now the DOM can declarativey dispatch meaningful messages from HTML to Javascript-land because `SuperAction` effectively works like a classic eventbus!

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
	let { type, target, event, formData } = e.action;

	if ("increment" === action) {
		// increment something!
	}
});
```

Form data is available when action events originate from form elements.

## Event stacking

`Superaction-js` listens to any DOM event that bubbles. It also dispatches all actions found along the composed path of a DOM event.

Turns out that's [all UI Events](https://www.w3.org/TR/uievents/#events-uievents). Which is a lot of events!

Consider the following example:

```html
<body click:="A">
	<div click:="B">
		<button click:="C">hai :3</button>
	</div>
</body>
```

When a person clicks the button above, the order of action events is:

- Action "C"
- Action "B"
- Action "A"

## Propagation

Action events propagate similar to DOM events. Their declarative API reflects their DOM Event counterpart:

- `event:prevent-default`
- `event:stop-propagation`
- `event:stop-immediate-propagation`

Consider the following example:

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
			click:stop-propagation>
			^_^
		</button>
	</form>
</body>
```

So when a person clicks the buttons above, the order of actions is:

Click button C:

- Action "C" dispatched
- `preventDefault()` is called on the original `HTMLSubmitEvent`
- Action "B" dispatched
- Action propagation is stopped similar to `event.stopImmediatePropagation()`
- Action "A" does _not_ dispatch

Click button D:

- Action "D" dispatched
- Action event propagation stopped similar to `event.stopPropagation()`

## Why #action ?

The `#action` event name, specifically the `#`, is used to prevent cyclical event disptaches.

The browser restricts _dynamically_ adding attribtues to elements that start with `#`. And in this way, some of the infinite loop risks are mitigated.

## License

`SuperAction-js` is released under the BSD-3 Clause License.
