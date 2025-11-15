# Action Events

## Lifecycles

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

So when a person clicks the button above, the order of action events is:

- Action "C"
- Action "B"
- Action "A"

### Propagation

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
