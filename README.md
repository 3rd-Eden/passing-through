# passing-through

The `passing-through` library is a component library that allows you to easily
transform child components through modifiers.

## Installation

The module is released in the public npm registry and can be installed by
running:

```bash
npm install --save passing-through
```

## API

The `passing-through` library exposes 2 components:

- [Pass](#pass)
- [Through](#through)

```jsx
import { Pass, Through } from 'passing-through';

const modifiers = {
  foo: [
    function(props, passedProps, child) {
      props.className = 'red';

      console.log(passedProps) // { foo: true }
      if (props.span) return <span>Changed</span>
    }
  ]
}

<Pass foo modify={ modifiers }>
  <Through span>
    <div>
  </Though>
</Pass>

// Renders <span className='red'>Changed</span>
```

### Pass

The pass module used to configure the modifiers that get applied to children of
the [Through](#through) component. The most important property of this component
is the `modify` prop which stores the modifers that get applied.

The `modify` prop is an `object` where the key is the name of a property is
should trigger on, and the value an array of functions that need to be executed.

### Through

This component will apply all the modifications that are provided to the
[Pass](#pass) component.

## License

[MIT](LICENSE)
