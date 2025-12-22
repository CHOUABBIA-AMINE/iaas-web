# Internationalization (i18n) Guide

## Overview

The IAAS Platform frontend supports three languages:
- 🇬🇧 **English** (en) - Default
- 🇫🇷 **French** (fr)
- 🇸🇦 **Arabic** (ar) - With RTL (Right-to-Left) support

## Features

✅ **Automatic Language Detection** - Detects browser language on first visit
✅ **Language Persistence** - Saves selected language in localStorage
✅ **RTL Support** - Full Right-to-Left layout for Arabic
✅ **Dynamic Theme** - Theme direction changes automatically
✅ **Language Switcher** - Easy language selection from navbar

## Implementation

### Libraries Used

- `react-i18next` - React integration for i18next
- `i18next` - Core i18n framework
- `i18next-browser-languagedetector` - Automatic language detection
- `stylis-plugin-rtl` - RTL support for emotion/styled-components

### File Structure

```
src/
├── shared/
│   ├── i18n/
│   │   ├── config.ts           # i18n configuration
│   │   └── locales/
│   │       ├── en.json          # English translations
│   │       ├── fr.json          # French translations
│   │       └── ar.json          # Arabic translations
│   └── components/
│       └── LanguageSwitcher.tsx
```

## Usage in Components

### Basic Translation

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

### Translation with Interpolation

```typescript
const { t } = useTranslation();

// In JSON: "welcome": "Welcome, {{name}}!"
const greeting = t('common.welcome', { name: 'John' });
```

### Accessing Current Language

```typescript
const { i18n } = useTranslation();

const currentLanguage = i18n.language; // 'en', 'fr', or 'ar'
const isRTL = i18n.language === 'ar';
```

### Changing Language

```typescript
const { i18n } = useTranslation();

i18n.changeLanguage('fr'); // Switch to French
```

## Adding New Translations

### 1. Add to Translation Files

Add the same key to all three language files:

**en.json**:
```json
{
  "myModule": {
    "title": "My Module",
    "description": "This is my module"
  }
}
```

**fr.json**:
```json
{
  "myModule": {
    "title": "Mon Module",
    "description": "Ceci est mon module"
  }
}
```

**ar.json**:
```json
{
  "myModule": {
    "title": "وحدتي",
    "description": "هذه هي وحدتي"
  }
}
```

### 2. Use in Component

```typescript
const { t } = useTranslation();

return (
  <div>
    <h1>{t('myModule.title')}</h1>
    <p>{t('myModule.description')}</p>
  </div>
);
```

## Translation Categories

### Available Categories

- `app.*` - Application name and description
- `common.*` - Common UI elements (save, cancel, delete, etc.)
- `auth.*` - Authentication related
- `nav.*` - Navigation menu items
- `user.*` - User management
- `role.*` - Role management
- `footer.*` - Footer content
- `errors.*` - Error messages

## RTL Support

### How It Works

1. **Automatic Detection**: When Arabic is selected:
   ```typescript
   document.dir = 'rtl';
   ```

2. **Theme Direction**: Material-UI theme switches to RTL:
   ```typescript
   const theme = createTheme({ direction: 'rtl' });
   ```

3. **Emotion Cache**: CSS-in-JS adapts to RTL:
   ```typescript
   const cacheRtl = createCache({
     key: 'muirtl',
     stylisPlugins: [prefixer, rtlPlugin],
   });
   ```

### RTL-Aware Styling

Material-UI components automatically flip:
- Margins: `ml` becomes `mr` in RTL
- Padding: `pl` becomes `pr` in RTL
- Text alignment: `left` becomes `right` in RTL
- Icons: Directional icons flip automatically

## Language Switcher

The language switcher is integrated into the navbar:

```typescript
import LanguageSwitcher from '../LanguageSwitcher';

<LanguageSwitcher />
```

### Features:
- Shows current language flag
- Dropdown menu with all languages
- Checkmark on selected language
- Automatically updates document direction

## Best Practices

### 1. Always Use Translation Keys

❌ **Bad**:
```typescript
<Button>Save</Button>
```

✅ **Good**:
```typescript
<Button>{t('common.save')}</Button>
```

### 2. Keep Keys Organized

Group related translations:
```json
{
  "user": {
    "title": "Users",
    "create": "Create User",
    "edit": "Edit User",
    "delete": "Delete User"
  }
}
```

### 3. Use Interpolation for Dynamic Content

```json
{
  "greeting": "Hello, {{name}}!",
  "itemCount": "You have {{count}} items"
}
```

### 4. Provide Context in Key Names

❌ **Bad**: `button.ok`
✅ **Good**: `dialog.confirmButton`

## Testing Different Languages

### 1. Via UI
- Click the language icon in navbar
- Select desired language
- UI updates immediately

### 2. Via Browser Console
```javascript
// Switch to French
window.i18n.changeLanguage('fr');

// Switch to Arabic (enables RTL)
window.i18n.changeLanguage('ar');

// Switch back to English
window.i18n.changeLanguage('en');
```

### 3. Via localStorage
```javascript
// Set preferred language
localStorage.setItem('i18nextLng', 'fr');

// Reload page
window.location.reload();
```

## Common Issues

### Missing Translation

If a key is not found, the key itself is displayed:
```
my.missing.key
```

**Solution**: Add the key to all translation files.

### RTL Not Working

Check if:
1. Arabic language is selected
2. Document direction is set: `document.dir === 'rtl'`
3. Emotion cache is configured with RTL plugin

### Component Not Updating

Ensure you're using `useTranslation` hook:
```typescript
const { t, i18n } = useTranslation();
```

## Performance

- Translations are loaded synchronously (bundled with app)
- No network requests for translation files
- Minimal bundle size impact (~30KB for all languages)
- Fast language switching (instant)

## Future Enhancements

- [ ] Lazy load translation files
- [ ] Add more languages (German, Spanish, etc.)
- [ ] Translation management interface
- [ ] Export/import translations
- [ ] Professional translation service integration

## Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Material-UI RTL Guide](https://mui.com/material-ui/guides/right-to-left/)
