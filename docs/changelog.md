# 📋 Changelog

Semua perubahan penting pada project ini didokumentasikan di file ini.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [1.0.0] — 2026-06-17

### 🎉 Initial Release

#### Features
- **Authentication**
  - Login dengan email/password
  - Login dengan Google OAuth (authorization code flow)
  - Forgot password (kirim reset link via email)
  - Reset password (validasi token + set password baru)
  - Auto refresh token via Axios interceptor
  - Global auth middleware (redirect ke sign-in jika belum login)
  - Guest middleware (redirect ke home jika sudah login)

- **Contact CRUD**
  - Listing dengan pagination server-side
  - Search dengan debounce 300ms
  - Configurable items per page (10, 25, 50, 100)
  - Add contact modal
  - Edit contact modal
  - Delete contact dengan generic DeleteModal
  - Action dropdown per row (edit, delete)

- **Layout & Navigation**
  - Dashboard layout dengan collapsible sidebar
  - Auth layout dengan split-screen design
  - Responsive mobile sidebar (drawer overlay)
  - Sidebar navigation dengan group support
  - User profile popover (sidebar + mobile header)
  - Brand logo component

- **Design System**
  - Custom green color palette (primary: #009838)
  - Custom red + yellow palettes
  - Geist font from Google Fonts
  - NuxtUI v4 theming via app.config.ts
  - Tailwind CSS v4 with @theme static tokens

#### Architecture
- Service-based API layer (Axios + interceptors)
- Singleton service pattern
- Global error handler with toast notifications
- TypeScript strict mode
- Zod schema validation for forms
- Composable pattern for auth & navigation state

#### Tech Stack
- Nuxt 4.4.6
- NuxtUI 4.7.1
- Tailwind CSS 4.3.0
- Zod 4.4.3
- Axios 1.16.1
- TypeScript 6.0.3
- Bun 1.3.1

### 📝 Documentation
- Project overview & architecture
- Coding standards & naming conventions
- NuxtUI component usage guide
- Component & modal patterns
- Service layer documentation
- Page pattern templates
- This changelog

---

## Template untuk Entry Baru

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- Fitur baru yang ditambahkan

### Changed
- Perubahan pada fitur yang sudah ada

### Fixed
- Bug yang diperbaiki

### Removed
- Fitur yang dihapus

### Security
- Perubahan terkait keamanan
```
