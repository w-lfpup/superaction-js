# Action Events

## Lifecycles

### Event stacking

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

### Propagation

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

We can't _dynamically_ add attribtues to elements that start with `#`. And in this way, some of the infinite loop risk is mitigated.
