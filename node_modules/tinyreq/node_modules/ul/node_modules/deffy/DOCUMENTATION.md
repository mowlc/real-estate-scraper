## Documentation
You can see below the API reference of this module.

### `Deffy(input, def, options)`
Computes a final value by providing the input and default values.

#### Params
- **Anything** `input`: The input value.
- **Anything|Function** `def`: The default value or a function getting the input value as first argument.
- **Object|Boolean** `options`: The `empty` value or an object containing the following fields:

 - `empty` (Boolean): Handles the input value as empty field (`input || default`). Default is `false`.

#### Return
- **Anything** The computed value.

