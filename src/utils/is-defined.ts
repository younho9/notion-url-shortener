// Extracted from https://github.com/sindresorhus/ts-extras/blob/1157f37bcfaee8f0651bced3d98340b08b12573c/source/is-defined.ts

/**
Check whether a value is defined, meaning it is not `undefined`.

This can be useful as a type guard, as for example, `[1, undefined].filter(Boolean)` does not always type-guard correctly.

@example
```
import {isDefined} from 'ts-extras';

[1, undefined, 2].filter(isDefined);
//=> [1, 2]
```

@category Type guard
*/
export function isDefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}
