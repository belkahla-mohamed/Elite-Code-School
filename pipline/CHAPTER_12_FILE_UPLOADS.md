# Chapter 12: File Uploads

> **Goal**: Add real image/file uploads using Supabase Storage or Cloudinary for avatars, gallery, and certifications.

---

## Tasks

### [ ] T12.1 — Choose & configure upload provider
- Option A: Supabase Storage (already configured)
- Option B: Cloudinary (more features: transformations, optimization)
- Create upload utility in `lib/upload.ts`
- Create signed upload URL API route

### [ ] T12.2 — Avatar upload
- Replace text avatar with image upload
- Crop/round avatar before display
- Admin can upload avatar for student
- Parent can upload avatar from parent portal

### [ ] T12.3 — Gallery image upload
- Replace emoji placeholder in gallery
- Upload multiple images at once
- Grid display with lightbox preview
- Delete images from gallery

### [ ] T12.4 — Certification image upload
- Upload certif image/PDF
- Display in portfolio as card
- Download original file

### [ ] T12.5 — Project cover image
- Add cover image to projects
- Display as card header in portfolio
- Thumbnail in project list

### [ ] T12.6 — Image optimization
- Use Next.js `Image` component for all uploaded images
- Add blur placeholder while loading
- Responsive image sizes
- WebP format conversion

---

**Progress**: `0 / 6 tasks completed`

**Next**: Chapter 13 — Parent Portal Enhancement
