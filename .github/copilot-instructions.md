# Charlotte Blog Theme - AI Coding Guidelines

## Architecture Overview

**Charlotte** is an Astro-based blog theme built on the Fuwari theme foundation. Key architectural patterns:

- **Framework**: Astro 5.x with Svelte components for interactive elements
- **Styling**: Tailwind CSS with custom CSS variables and Stylus extensions
- **Content**: Astro Content Collections with frontmatter schema validation
- **Internationalization**: Enum-based i18n system with TypeScript integration
- **Search**: Pagefind integration with custom exclusion rules
- **Build**: Custom remark/rehype plugins for enhanced markdown processing

## Core Configuration Patterns

### Site Configuration (`src/config.ts`)
Centralized configuration using typed interfaces. Key sections:
- `siteConfig`: Core site metadata, theme colors, banner settings
- `navBarConfig`: Navigation structure with LinkPreset enums
- `profileConfig`: Author profile with social links
- `licenseConfig`: Content licensing information

**Example**: Use `LinkPreset` enums for navigation links:
```typescript
links: [
  LinkPreset.Home,
  LinkPreset.Archive,
  {
    name: "Custom Link",
    url: "/custom/",
    external: true
  }
]
```

### Content Schema (`src/content/config.ts`)
Strictly typed content collections with Zod validation:
- `posts`: Blog posts with frontmatter validation
- `spec`: Static pages (about, projects)

**Frontmatter Structure**:
```yaml
title: "Post Title"
published: 2025-01-01
description: "Post description"
image: ./cover.jpg
tags: [tag1, tag2]
category: "Category Name"
draft: false
lang: "zh_CN"
```

## Component Organization

### File Structure Conventions
```
src/components/
├── widget/          # Sidebar widgets (TOC, Tags, Categories)
├── control/         # UI controls (Pagination, Buttons)
├── misc/            # Utility components (ImageWrapper, Markdown)
├── *.astro          # Page components
├── *.svelte         # Interactive components
```

### Component Patterns
- **Astro Components**: Server-rendered, use for layout and static content
- **Svelte Components**: Client-side interactivity (Search, LightDarkSwitch)
- **Props Interface**: Define component props with TypeScript interfaces
- **CSS Variables**: Use CSS custom properties for theming (`var(--primary)`)

## Internationalization (i18n)

### Key Management
- **Enum-based**: `I18nKey` enum in `src/i18n/i18nKey.ts`
- **Translation Function**: `i18n(key)` from `src/translation.ts`
- **Language Files**: `src/i18n/languages/{lang}.ts`

**Usage Pattern**:
```typescript
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

// In components
const homeText = i18n(I18nKey.home);
```

## Markdown Processing

### Custom Directives
Built-in admonitions via remark plugins:
```markdown
:::note
This is a note
:::

:::tip
This is a tip
:::

:::warning
This is a warning
:::
```

### GitHub Integration
GitHub card components:
```markdown
::github{https://github.com/user/repo}
```

## Development Workflow

### Essential Commands
```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Production build (includes pagefind indexing)
pnpm preview         # Preview production build

# Content Creation
pnpm new-post <filename>  # Create new post with frontmatter template

# Code Quality
pnpm format          # Format with Biome (tabs, double quotes)
pnpm lint            # Lint and auto-fix with Biome
pnpm check           # TypeScript type checking
```

### Build Process
- **Post-build**: `pagefind --site dist` automatically indexes content
- **Exclusions**: Configured in `pagefind.yml` (KaTeX, search panels, etc.)

## Styling Conventions

### CSS Architecture
- **Tailwind First**: Use utility classes for rapid development
- **CSS Variables**: Theme-aware properties (`var(--primary)`, `var(--card-bg)`)
- **Stylus Extensions**: Custom styles in `.styl` files
- **Component Scoping**: Use Tailwind's `class:list` directive in Astro

### Color System
- **Theme Colors**: HSL-based with hue rotation (`themeColor.hue`)
- **Dark Mode**: Class-based toggling (`darkMode: "class"`)
- **Transparency**: Navbar opacity controlled via CSS variables

## Content Management

### Post Creation
Use the `new-post` script for consistent frontmatter:
```bash
pnpm new-post "My New Post"
# Creates: src/content/posts/YYYY-MM-DD-My-New-Post.md
```

### Frontmatter CMS
- **VS Code Extension**: Frontmatter extension configured in `frontmatter.json`
- **Field Types**: String, datetime, image, list, choice
- **Preview**: Integrated with dev server

## TypeScript Patterns

### Import Aliases
```typescript
// Use path aliases for clean imports
import { siteConfig } from "@/config";
import type { SiteConfig } from "@/types/config";
import I18nKey from "@i18n/i18nKey";
```

### Type Definitions
- **Config Types**: Comprehensive interfaces in `src/types/config.ts`
- **Content Types**: Auto-generated from Zod schemas
- **Component Props**: Explicitly typed prop interfaces

## Plugin Ecosystem

### Remark/Rehype Plugins
Custom markdown processing pipeline:
- **remark-reading-time**: Calculate reading time
- **remark-excerpt**: Generate post excerpts
- **rehype-components**: Custom directive rendering
- **rehype-katex**: Mathematical notation support

### Expressive Code
Syntax highlighting configuration:
- **Theme**: GitHub Dark (configurable in `expressiveCodeConfig`)
- **Plugins**: Line numbers, collapsible sections, custom copy button
- **Language Badges**: Automatic language detection

## Performance Optimizations

### Build Optimizations
- **SWUP**: Page transitions with `astro-swup` integration
- **Preloading**: Configured for smooth navigation
- **Image Optimization**: Sharp-based processing
- **Search Indexing**: Pagefind with selective exclusions

### Runtime Performance
- **Lazy Loading**: Components loaded on demand
- **CSS Optimization**: Tailwind purging and minification
- **Font Loading**: Variable fonts with `fontsource`

## Deployment Considerations

### Platform Support
- **Recommended**: Vercel, Netlify (Cloudflare Pages has build limitations)
- **Static Output**: `dist/` directory with trailing slashes
- **Environment Variables**: Configure via platform settings

### Build Artifacts
- **Search Index**: Pagefind generates `/pagefind/` directory
- **Assets**: Optimized images, fonts, and CSS
- **Sitemap**: Auto-generated XML sitemap

## Common Patterns & Gotchas

### Navigation Links
Always use `LinkPreset` enums or properly typed `NavBarLink` objects:
```typescript
// Correct
links: [LinkPreset.Home, LinkPreset.Archive]

// Incorrect - will cause type errors
links: [{ name: "Home", url: "/" }]
```

### Component Props
Pass complex data structures properly in Astro:
```astro
---
// Correct: Access props in frontmatter
const { posts } = Astro.props;
---

<!-- Use in template -->
{posts.map(post => <PostCard {post} />)}
```

### CSS Variable Usage
Always use CSS custom properties for theme-aware styling:
```css
/* Correct */
.btn-primary {
  background: var(--primary);
  color: var(--card-bg);
}

/* Avoid hardcoded colors */
.btn-primary {
  background: hsl(200, 100%, 50%);
}
```

### Content Paths
Content files use relative paths for images:
```yaml
# In src/content/posts/2025-01-01-post/
image: ./cover.jpg  # Relative to post directory
```

Remember: This theme prioritizes developer experience with TypeScript strictness, consistent formatting, and a configuration-first approach. When adding features, maintain the existing patterns and always update types accordingly.

## Best Practices & Common Tasks

### Adding New Content Types
When creating new content collections beyond posts/spec:

1. **Define Schema** in `src/content/config.ts`:
```typescript
const projectsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		// ... other fields
	}),
});
```

2. **Update Collections Export**:
```typescript
export const collections = {
	posts: postsCollection,
	spec: specCollection,
	projects: projectsCollection, // Add new collection
};
```

3. **Create Page Route** in `src/pages/projects/[...slug].astro`

### Customizing Theme Colors
Modify `src/config.ts` themeColor settings:
```typescript
themeColor: {
	hue: 200, // Blue theme (0-360)
	fixed: false, // Allow user customization
},
```

### Adding New i18n Keys
1. **Add to Enum** in `src/i18n/i18nKey.ts`:
```typescript
enum I18nKey {
	// ... existing keys
	newFeature = "newFeature",
}
```

2. **Add Translations** in each language file (`src/i18n/languages/*.ts`):
```typescript
[I18nKey.newFeature]: "新功能", // zh_CN
[I18nKey.newFeature]: "New Feature", // en
```

### Creating Interactive Components
Use Svelte for client-side features:
```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count++}>
	Clicks: {count}
</button>
```

### Error Handling Patterns
Handle async operations gracefully:
```typescript
// In Astro components
try {
	const posts = await getCollection('posts');
} catch (error) {
	console.error('Failed to load posts:', error);
	// Fallback UI
}
```

### Performance Checklist
- [ ] Use `client:load` only for interactive components
- [ ] Optimize images with proper formats/sizes
- [ ] Minimize CSS custom properties usage in loops
- [ ] Test build output size with `pnpm build`

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] CSS variables used instead of hardcoded colors
- [ ] i18n keys used for user-facing text
- [ ] Component follows file structure conventions
- [ ] Frontmatter follows schema validation
- [ ] Build passes without errors