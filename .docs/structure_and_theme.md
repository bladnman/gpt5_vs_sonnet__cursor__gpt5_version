Here’s your **combined and simplified “Always Rules” file** — merging your *Design Principles* with the *UI Styling and Theming Guidelines* into one clean reference for PRD use.

---

# **Always Rules — Structure, Naming, and Theming**

## 1. Core Philosophy

* **Mental Model First:** The file/folder structure must mirror the visual structure of the app. A developer should be able to find code for a UI element by navigating to the page/feature it appears on.
* **Separation of Concerns:** Break code into small, single-responsibility files (components, hooks, utils). Avoid monolithic files.
* **DRY but Clear:** Reuse code where possible, but never at the expense of clarity or the mental model.

---

## 2. Naming Conventions

* **Folders:**

  * `kebab-case` for route segments (e.g., `/app/show-details/`)
  * `snake_case` for all other directories (`features/`, `hooks/`, etc.)
* **Files:**

  * Components: `TitleCase.tsx` (`ShowCard.tsx`)
  * Pages: Next.js App Router format `page.tsx`
  * Hooks: `use_snake_case.ts` (`use_show_state.ts`)
  * Utilities/Services: `snake_case.ts`

---

## 3. Project Structure

### 3.1. Top-Level Directories

* **`/app`** — Main app routes (Next.js App Router).
* **`/components`** — *Only* for truly generic, reusable components used across unrelated pages.
* **`/lib` or `/utils`** — For truly global utility functions or services.

### 3.2. Page-Level

Each route has its own folder inside `/app`, containing:

```
/app
└── /some-page
    ├── features/   // Page-specific components
    ├── hooks/      // Page-specific hooks
    ├── utils/      // Page-specific utilities
    └── page.tsx    // Minimal main page component
```

### 3.3. Feature-Level

Inside `features/`, each component gets its own `snake_case` folder containing:

```
/app
└── /some-page
    └── /features
        └── /my_feature
            ├── hooks/
            ├── MyFeature.tsx
            └── ...
```

---

## 4. Styling & Theming

### 4.1. Centralized Theme

* All colors, fonts, spacing, breakpoints, and other design tokens are defined in a **single theme file**.
* Never hardcode values in components — always reference the theme.

### 4.2. Colors

* Use a consistent palette (primary, secondary, error, warning, info, success).
* No raw hex/RGB in components — reference theme variables.

### 4.3. Typography

* Font families, sizes, and weights are defined in the theme.
* Apply typography styles via theme references.

### 4.4. Component Styling

* Reference theme variables in all styles.
* Avoid inline styles except for dynamic behavior.
* Use predictable patterns for hover, active, disabled, and focus states.

### 4.5. Spacing & Sizing

* Use a predefined spacing scale (e.g., 4px or 8px units).
* No arbitrary pixel values — reference spacing constants.

### 4.6. Responsive Design

* Use a centralized breakpoint system in the theme.
* Avoid one-off media queries — use theme breakpoints.

### 4.7. Accessibility

* Ensure color contrast meets WCAG guidelines.
* Maintain semantic HTML and ARIA attributes.

### 4.8. Theming Consistency

* Regularly review the theme for consistency.
* Document any deviations from the theme.

---

## 5. Backend vs. Frontend Logic

* **Default to Frontend:** Use client components when possible (especially for real-time API SDKs).
* **Backend Only When Needed:** Move logic server-side for security, sensitive data, or heavy processing.

---

This single file can be attached to any PRD request with:

> “Follow the attached Always Rules for structure, naming, and theming.”

---

If you want, I can now **merge this directly into your TV/Movie Shows PRD prompt** so it’s ready to use in one shot. Would you like me to do that?
