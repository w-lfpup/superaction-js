# SuperAction-js

A hypertext extension to dispatch meaningful actions from HTML.

[![builds](https://github.com/w-lfpup/superaction-js/actions/workflows/builds.yml/badge.svg)](https://github.com/w-lfpup/superaction-js/actions/workflows/builds.yml)

## Install

Install via npm.
,

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
	connected: true,
	eventNames: ["click"],
});
```

Now the DOM can declarativey dispatch meaningful messages from HTML to Javascript-land.

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
	let { kind, originElement, originEvent, formData } = e.action;

	if ("increment" === action) {
		// increment something!
	}
});
```

Form data is available when action events originate from form elements.

Learn more about action events [here](./action_events.md).

## License

`SuperAction-js` is released under the BSD-3 Clause License.
