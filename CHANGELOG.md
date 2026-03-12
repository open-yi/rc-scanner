# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-12

### Added

- Initial release of RC Scanner React component library
- Scanner component with camera access support
- Demo application with multiple usage examples
- TypeScript support throughout the project
- Vite configuration for both library and demo builds
- ESLint configuration for code quality

### Features

- **Scanner Component**
  - Camera access with `getUserMedia` API
  - Auto-start scanning mode
  - Manual scan trigger
  - Error handling with callbacks
  - Responsive design with customizable CSS classes

### Scripts

- `pnpm dev` - Start demo development server
- `pnpm build:lib` - Build component library for npm publishing
- `pnpm build:demo` - Build demo application
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

### Project Structure

```
.
├── src/                    # Component library source
│   ├── components/
│   │   └── Scanner.tsx    # Main Scanner component
│   └── index.ts           # Library entry point
├── demo/                   # Demo application
│   ├── src/
│   │   ├── App.tsx        # Demo app entry
│   │   ├── Demo.tsx       # Multiple usage examples
│   │   └── main.tsx       # Demo entry point
│   └── index.html
└── package.json
```

### Scripts

- `pnpm dev` - Start development server for demo
- `pnpm build:lib` - Build library (for npm package)
- `pnpm build:demo` - Build demo application

---

## [Unreleased]

### Planned Features

- Barcode detection (QR Code, Code128, etc.)
- Image upload support for scanning
- Configuration options for camera
- Theme customization
- Unit tests
- Storybook for documentation

### Improvements

- Better error handling
- Performance optimizations
- Accessibility improvements
