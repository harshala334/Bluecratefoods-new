# Project To-Dos

## Immediate Next Steps (Deferred to Tomorrow)

### 1. CDN Migration for Static Assets
- **Goal**: Reduce mobile app bundle size by moving large assets (sales banners, heavy images) to cloud storage.
- **Current State**: Large images like `logo.png` (~2MB) are bundled in the app.
- **Plan**:
    - [ ] Create `bluecrate-assets` bucket in GCS (via Terraform).
    - [ ] Configure it for public read access (CDN style).
    - [ ] Upload existing static assets from `mobile/user-app/assets`.
    - [ ] Update `mobile/user-app` code to use remote URLs (`CDN_URL + '/image.png'`).

### 2. User Uploads Migration (Dynamic Content)
- **Goal**: Persist user profile photos and recipe images, as Kubernetes pods are ephemeral.
- **Current State**: Uploads are saved to `public/uploads` on the `api-gateway` disk, which is lost on restart.
- **Plan**:
    - [ ] Create `bluecrate-uploads` bucket in GCS (via Terraform).
    - [ ] Update `api-gateway` to use `@google-cloud/storage`.
    - [ ] Implement `UploadService` to stream files directly to GCS and return public URL.
    - [ ] Remove `multer.diskStorage` usage.

### 3. Verification
- [ ] Verify `api-gateway` can write to GCS (Workload Identity or Key setup).
- [ ] Verify Mobile App can load images from new GCS URLs.
