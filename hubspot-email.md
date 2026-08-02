# HubSpot Email Development Skill

Use this skill when creating or editing email templates for HubSpot.

## Core Requirements

### No Document Structure
- **NEVER** include `<!DOCTYPE>`, `<html>`, `<head>`, or `<body>` tags
- HubSpot adds these automatically
- Start directly with content (tables, divs, etc.)

### Inline Styles Only
- **NO** `<style>` blocks or CSS classes
- **NO** `@media` queries (email clients don't support them)
- **NO** external stylesheets
- All styles must be inline: `<div style="color:#000;">`

### Responsive Techniques (Without Media Queries)

#### Use `clamp()` for Fluid Typography
```html
<span style="font-size:clamp(18px, 6vw, 38px);">Text</span>
```
- Min size, preferred size (viewport-based), max size
- Scales smoothly without breakpoints

#### Use Percentage/Max-Width for Containers
```html
<table style="width:100%;max-width:600px;">
```
- Email clients respect max-width
- Automatically scales on mobile

#### Prevent Text Wrapping
```html
<td style="white-space:nowrap;">
```
- Use on cells where text must stay on one line
- Combine with smaller `clamp()` minimum to prevent overflow

### Dark Mode Handling

#### Allow Native Dark Mode
```html
<!-- Don't force colors - let email client adapt -->
<p style="font-size:16px;font-family:Arial;">Text</p>
```
- Omit `color` property to allow email client dark mode
- Light mode: client uses default dark text
- Dark mode: client inverts to light text

#### Force Light Mode
```html
<p style="color:#1A1917;">Text</p>
```
- Explicitly set color to prevent dark mode inversion
- Use when brand colors must be preserved

### Table Structure

#### Always Use
```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
```
- `role="presentation"` for accessibility
- Zero padding/spacing/border for control

#### Outlook Compatibility
```html
<!--[if mso]>
<table width="600"><tr><td>
<![endif]-->
<div style="max-width:600px;">
  Content
</div>
<!--[if mso]>
</td></tr></table>
<![endif]-->
```
- MSO conditionals wrap content for Outlook
- Use fixed widths in MSO, max-width outside

### Images

```html
<img src="url" alt="description" width="600"
     style="width:100%;max-width:600px;height:auto;display:block;border:0;">
```
- Always set `width` attribute AND style
- `display:block` prevents gaps
- `border:0` for older clients

### Typography Best Practices

```typescript
// Good - responsive, dark-mode friendly
const HEADING = 'font-size:clamp(18px, 6vw, 38px);font-weight:300;font-family:Arial,sans-serif;'

// Bad - fixed size, forced dark color
const HEADING = 'font-size:38px;color:#000;'
```

### Link Styling

```html
<a href="url" style="color:#79a52c;text-decoration:none;">Link</a>
```
- Always set color inline
- Specify text-decoration explicitly

### Spacing

```html
<!-- Use padding, not margin (more reliable) -->
<div style="padding:20px 0 0 0;">Content</div>

<!-- For vertical spacing between sections -->
<div style="padding-top:40px;">Next section</div>
```

### Remove ALL Container Padding on Mobile

```html
<!-- Bad - horizontal padding compresses content -->
<div style="padding:40px 32px 0;">Content</div>

<!-- Good - full width on mobile -->
<div style="padding:40px 0 0 0;">Content</div>
```
- Horizontal padding steals precious mobile width
- Section headings with `white-space:nowrap` need full width

## Common Patterns

### Email Wrapper
```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#e9e7e2;border-collapse:collapse;">
<tr><td align="center" style="padding:32px 0;">
  <!-- Content here -->
</td></tr>
</table>
```

### Content Container
```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
       style="width:100%;max-width:600px;background-color:#ffffff;border-collapse:collapse;margin:0 auto;">
<tr><td style="padding:0;">
  <!-- Sections here -->
</td></tr>
</table>
```

### Section with Responsive Heading
```html
<div style="padding:44px 0 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="white-space:nowrap;vertical-align:middle;padding:0;">
      <span style="font-size:clamp(18px, 6vw, 38px);font-weight:300;text-transform:uppercase;font-family:Arial,sans-serif;">
        HEADING
      </span>
    </td>
  </tr>
  </table>
</div>
```

### Preheader (Preview Text)
```html
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#e9e7e2;">
  Preview text here
</div>
```

## Testing Checklist

- [ ] No `<html>`, `<head>`, `<body>` tags
- [ ] No `<style>` blocks or CSS classes
- [ ] No `@media` queries
- [ ] All styles inline
- [ ] `clamp()` used for responsive text
- [ ] `width` AND `max-width` on containers
- [ ] `white-space:nowrap` where text shouldn't wrap
- [ ] No horizontal padding on containers
- [ ] MSO conditionals for Outlook if needed
- [ ] Images have width attribute + inline styles
- [ ] Links have explicit color
- [ ] Preheader text included

## File Location

Newsletter email template: `/lib/newsletter-email-template.ts`

## Example: Complete Newsletter Section

```html
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:44px 0 0 0;">
<![endif]-->
<div style="padding:44px 0 0 0;">
  <!-- Heading -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="width:1%;white-space:nowrap;vertical-align:middle;padding:0;">
      <span style="font-size:clamp(18px, 6vw, 38px);font-weight:300;text-transform:uppercase;font-family:'Quicksand',Helvetica,Arial,sans-serif;">
        FEATURED
      </span>
    </td>
    <td style="width:16px;"></td>
    <td style="width:1%;white-space:nowrap;vertical-align:middle;padding:0;">
      <span style="font-size:clamp(11px, 3vw, 19px);font-weight:500;text-transform:uppercase;font-family:'Quicksand',Helvetica,Arial,sans-serif;">
        PROFESSIONAL
      </span>
    </td>
    <td style="width:16px;"></td>
    <td style="vertical-align:middle;padding:0;">
      <div style="height:1px;background:#1A1917;font-size:0;line-height:0;">&nbsp;</div>
    </td>
  </tr>
  </table>

  <!-- Image -->
  <div style="padding-top:24px;">
    <img src="image.jpg" alt="Description" width="600"
         style="width:100%;max-width:600px;height:auto;display:block;border:0;">
  </div>

  <!-- Body -->
  <div style="padding-top:22px;">
    <p style="margin:0;font-size:clamp(14px, 2.5vw, 16px);line-height:1.58;font-family:'Quicksand',Helvetica,Arial,sans-serif;">
      Content here
    </p>
  </div>
</div>
<!--[if mso]>
</td></tr>
</table>
<![endif]-->
```

## Key Learnings

1. **Clamp is your friend** - provides responsive sizing without media queries
2. **Width matters** - every pixel of horizontal space on mobile
3. **No shortcuts** - email clients are unforgiving, follow the rules exactly
4. **Test everywhere** - Gmail, Outlook, Apple Mail, mobile apps all render differently
5. **Tables win** - even in 2026, tables are more reliable than divs for emails
