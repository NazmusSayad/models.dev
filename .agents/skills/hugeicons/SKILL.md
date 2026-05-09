---
name: hugeicons
description: Use Hugeicons in React. Use this skill when importing and rendering Hugeicons.
---

Use `@hugeicons/react` to render icons and `@hugeicons/core-free-icons` to import them.

## Usage

```tsx
import { Settings02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
;<HugeiconsIcon icon={Settings02Icon} className="size-4" />
```

### Common Props

- `icon` Required. The icon to render, imported from `@hugeicons/core-free-icons`.

- `className` Optional. Additional CSS classes to apply to the icon only if needed.

- Also supports all props of the underlying `svg` element, such as `strokeWidth`, `fill`, etc.

## Example

```tsx
<HugeiconsIcon icon={Settings02Icon} className="size-[1em]" />
<HugeiconsIcon icon={CpuIcon} className="size-4" strokeWidth={1} />
```
