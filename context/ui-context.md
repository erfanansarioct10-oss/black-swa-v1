# UI Context

> This document defines the visual design system, UX principles, layout standards, and UI implementation rules for the Black Swan International platform.
>
> Every AI agent MUST follow this document when creating or modifying any user interface.

---

# Design Philosophy

Black Swan International is an industrial B2B platform.

The UI should reflect:

- Professionalism
- Trust
- Simplicity
- Modern design
- Premium quality
- Clean layouts
- Excellent readability

The interface should never feel playful, cluttered, or overly decorative.

Less is more.

---

# Mobile-First Design

The entire application follows a **Mobile-First Design Philosophy**.

Every page and component must be designed for the smallest screen first.

Development order:

```text
Mobile (Default)

↓

Tablet (md)

↓

Laptop (lg)

↓

Desktop (xl)

↓

Large Desktop (2xl)
```

Rules:

- Mobile is always the default layout.
- Never design desktop first.
- Every screen must work correctly at 320px width.
- Every component must scale naturally to larger screens.
- Responsive behavior should be progressive, not overridden.

Correct Tailwind usage:

```tsx
className = "flex flex-col gap-4 lg:flex-row";
```

Avoid:

```tsx
className = "flex-row lg:flex-col";
```

---

# Responsive Design

Every page must support:

- Mobile
- Tablet
- Laptop
- Desktop
- Ultra-wide displays

Every implementation should be visually tested across breakpoints.

No horizontal scrolling is allowed.

---

# Layout Principles

Layouts should prioritize:

- White space
- Clear hierarchy
- Consistent spacing
- Readable typography
- Predictable navigation

Avoid clutter.

---

# Container Widths

Use responsive containers.

Preferred layout:

```text
Mobile

↓

Centered Container

↓

Maximum Content Width

↓

Responsive Padding
```

Avoid hardcoded widths whenever possible.

---

# Spacing System

Use Tailwind spacing consistently.

Prefer:

- 4
- 6
- 8
- 12
- 16
- 20
- 24

Maintain consistent vertical rhythm throughout the application.

---

# Typography

Typography should emphasize readability.

Hierarchy:

```text
Display

↓

Heading 1

↓

Heading 2

↓

Heading 3

↓

Body

↓

Small Text

↓

Caption
```

Never use inconsistent heading sizes.

---

# Color Philosophy

The interface should use a restrained professional palette.

Primary colors:

- Primary
- Secondary
- Accent

Semantic colors:

- Success
- Warning
- Error
- Info

Avoid excessive color usage.

Color should communicate meaning, not decoration.

---

# Border Radius

Prefer moderate rounded corners.

Avoid:

- Extremely rounded UI
- Sharp edges everywhere

Consistency is more important than preference.

---

# Shadows

Use subtle elevation.

Cards should have light shadows.

Dialogs may have slightly stronger elevation.

Avoid heavy shadows.

---

# Buttons

Buttons should have clear hierarchy.

Primary

- Main actions

Secondary

- Alternative actions

Ghost

- Low-emphasis actions

Destructive

- Dangerous operations

Avoid creating custom button styles.

Use the shared Button component.

---

# Forms

Forms should prioritize usability.

Requirements:

- Clear labels
- Helpful placeholders
- Validation messages
- Accessible controls
- Keyboard support

Validation errors should appear close to the field.

---

# Tables

Large datasets should use:

- Pagination
- Sorting
- Filtering
- Responsive overflow

Avoid squeezing large tables onto small screens.

Use responsive layouts where necessary.

---

# Cards

Cards should:

- Group related information
- Maintain consistent padding
- Use consistent spacing
- Avoid unnecessary nesting

---

# Dialogs

Dialogs should:

- Focus on a single task
- Be keyboard accessible
- Prevent accidental destructive actions

---

# Navigation

Navigation should be:

- Simple
- Predictable
- Consistent

Desktop:

- Sidebar
- Top Navigation

Mobile:

- Drawer Navigation
- Bottom actions where appropriate

---

# Icons

Use one icon library consistently.

Icons should:

- Support the text
- Not replace text
- Remain visually consistent

Avoid decorative icon usage.

---

# Loading States

Every asynchronous operation should provide feedback.

Examples:

- Skeletons
- Loading spinners
- Progress indicators

Never leave users wondering if something is happening.

---

# Empty States

Every empty page should explain:

- Why it is empty
- What the user should do next

Provide a clear call to action.

---

# Error States

Errors should:

- Be understandable
- Avoid technical jargon
- Explain recovery steps

Never expose internal errors.

---

# Animations

Animations should be subtle.

Purpose:

- Improve usability
- Provide feedback
- Guide attention

Avoid excessive animations.

Performance takes priority.

---

# Accessibility

Every interface must support:

- Keyboard navigation
- Screen readers
- Semantic HTML
- Focus visibility
- Sufficient color contrast

Accessibility is mandatory.

---

# SEO Considerations

Public pages should:

- Use semantic HTML
- Proper heading hierarchy
- Optimized images
- Metadata
- Structured layouts

Do not sacrifice SEO for visual effects.

---

# Reusable Components

Always reuse existing components before creating new ones.

Examples:

- Button
- Card
- Input
- Select
- Dialog
- Table
- Badge
- Alert
- Avatar
- Breadcrumb
- Pagination

Avoid duplicate UI components.

---

# shadcn/ui

The project uses **shadcn/ui** as the primary component library.

Rules:

- Reuse existing components whenever possible.
- Extend components instead of rewriting them.
- Follow shadcn conventions.
- Keep customizations minimal and consistent.

Do not introduce additional UI libraries without approval.

---

# AI Implementation Rules

Before building UI:

1. Search existing components.
2. Reuse shared layouts.
3. Reuse existing forms.
4. Follow the design system.
5. Verify mobile responsiveness.
6. Verify accessibility.

Never create inconsistent UI patterns.

---

# UI Completion Checklist

Before completing any UI task:

- [ ] Mobile-first implementation
- [ ] Responsive on all breakpoints
- [ ] Uses shared components
- [ ] Uses shadcn/ui correctly
- [ ] Accessible
- [ ] Touch-friendly
- [ ] Keyboard accessible
- [ ] No horizontal overflow
- [ ] Consistent spacing
- [ ] Consistent typography
- [ ] Proper loading states
- [ ] Proper empty states
- [ ] Proper error states

---

# Final Rule

The user interface should always appear as though it was designed by a single design system.

If a new component does not match the existing visual language, it should be redesigned rather than introduced.

Consistency is more important than creativity.
