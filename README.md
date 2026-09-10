<div align="center">
  <div align="center">
   <img width="150" height="150" src="public/app-icon.png" alt="Logo" />
  </div>
	<h1 align="center">CompressO Auth Edition</h1>
	<p align="center">
		Compress any video/image into a tiny size — behind an account gate.
    </p>
    <i align="center">
		A community fork of <a href="https://github.com/codeforreal1/compressO">codeforreal1/compressO</a>, published under the same AGPL-3.0 license.
    </i>
    <br />
</div>

> [!IMPORTANT]
> **This is a fork, not the original app.** Upstream CompressO (by [Code For Real](https://github.com/codeforreal1)) is a fully offline app with no accounts. This edition adds an email sign-in gate and disables the upstream auto-updater. All changes are open-sourced here under **AGPL-3.0**, and the upstream copyright is retained. Please support the original project.

## What's different from upstream

- **Email + password sign-in / sign-up** (powered by [Supabase Auth](https://supabase.com/docs/guides/auth)) is required before the app can be used when auth is configured. Compression itself still runs 100% locally via bundled FFmpeg/pngquant/jpegoptim/gifski binaries — no media ever leaves your device. First sign-in requires internet; afterwards the session persists locally.
- **Upstream auto-updater disabled.** It pointed at upstream releases, which would silently overwrite this fork with the non-auth version. Point `plugins.updater.endpoints` in `src-tauri/tauri.conf.json` at your own update feed if you want auto-updates back.
- **Builds without Supabase credentials skip the login gate** and behave exactly like upstream (handy for local development).

## Configure your own auth backend (Supabase)

The app talks to a [Supabase](https://supabase.com) project that **you** create and own (free tier is enough):

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In **Authentication → Sign In / Providers → Email**, keep Email enabled. Turn **off "Confirm email"** if you don't want the email-verification step for new accounts.
3. In **Project Settings → API**, copy the **Project URL** and the **anon public key**.
4. Copy the env template and fill in the values:
   ```
   cp .env.example .env
   ```
   ```
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```
5. Build as usual — the credentials are baked into the frontend bundle at build time.

> The anon key is a *public* client key by design (Row Level Security protects the data), so bundling it is standard Supabase practice. For production use, review your Supabase auth rate limits and email quotas.

## Install

Download installers from the [releases](../../releases) page of this repository.

- `CompressO_amd64.deb` / `CompressO_amd64.AppImage` — Linux
- `CompressO_aarch64.dmg` / `CompressO_x64.dmg` — macOS (Apple Silicon / Intel)
- `CompressO_x64.msi` — Windows 64 bit

The original app is also available via Homebrew (macOS):
```
brew install --cask codeforreal1/tap/compresso
```

> [!NOTE]
> macOS builds are not notarized. If macOS reports the app as damaged, run `xattr -cr /Applications/CompressO.app` (see the FAQs below for details).

### Tech

This app is created using [Tauri](https://tauri.app/), a Rust🦀 framework for building a cross-platform desktop app. It uses [React](https://react.dev) powered by [Vite](https://vite.dev/) as a frontend layer. The compression is done entirely by 3rd part tools like [FFmpeg](https://ffmpeg.org/), [pngquant](https://pngquant.org/), [jpegoptim](https://github.com/tjko/jpegoptim), [gifski](https://gif.ski/), etc. using platform specific standalone binaries.

Upstream works completely offline; this fork additionally talks to your configured Supabase project for authentication only (never for your media files).

### Building

Make sure [Rust](https://rust-lang.org/) & [Node.js](https://nodejs.org/) toolchains are installed ([pnpm](https://pnpm.io) as package manager).

Local Development:
```
pnpm install
pnpm tauri:dev
```

Production Build:
```
pnpm tauri:build
```

### Screenshots
<details>
<summary>
  <strong> 
 	View app screenshots
  </strong>
</summary>
	<img src="https://github.com/user-attachments/assets/f89d3c18-20fd-4359-937b-d4f0c2a4a3f8" width="100%" alt="Compression Output" loading="lazy" />
	<img src="https://github.com/user-attachments/assets/49f95db6-5e9e-4abf-bc7f-54dd3f0ae534" width="100%" alt="Trim/Split feature" loading="lazy" />
	<img src="https://github.com/user-attachments/assets/68dcae45-5e9e-4abf-bc7f-54dd3f0ae534" width="100%" alt="Batch Compression" loading="lazy" />
</details>

### FAQs
<details>
<summary>
  <strong> 
  MacOS: "CompressO" is damaged and can't be opened. You should move it to trash. 
  </strong>
</summary>
<p>
  This error is shown by Apple for apps that are not signed/notarized with a paid Apple Developer account. The app is not damaged. Open your terminal and run:
</p>

```
xattr -cr /Applications/CompressO.app
```
</details>

<details>
<summary>
  <strong>Windows: Microsoft Defender SmartScreen prevented an unrecognized app from starting.</strong>
</summary>
<p>
  Click "More Info" and then "Run Anyway".
</p>
</details>

### License 🚨

This fork — like [upstream CompressO](https://github.com/codeforreal1/compressO) — is licensed under <a href="./LICENSE">AGPL 3.0</a>. If you distribute modified versions (including builds of this fork), you must do so under the same license and make the corresponding source available.

This project bundles and uses third-party software. For complete third-party notices, licenses, and attributions, please see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
