# Copo Gaming - Packaging & Deployment Guide

## Overview

This guide explains how to package Copo Gaming as EXE (Windows/Mac) and APK (Android) files.

## Prerequisites

### For EXE Packaging
- **Node.js** 18+ (already installed)
- **Electron** (installed via `pnpm add -D electron electron-builder`)
- **Windows**: Visual Studio Build Tools or similar
- **Mac**: Xcode Command Line Tools
- **Linux**: Build essentials

### For APK Packaging
- **Java Development Kit (JDK)** 11+
- **Android SDK** (via Android Studio or command line)
- **Gradle** (included with Android SDK)
- **Capacitor** (installed via `pnpm add -D @capacitor/core @capacitor/cli @capacitor/android`)

## Building EXE (Windows/Mac/Linux)

### Step 1: Build the Frontend & Backend

```bash
cd /home/ubuntu/copo-gaming
pnpm build
```

This creates:
- `dist/public/` - Frontend assets
- `dist/index.js` - Backend server

### Step 2: Create Electron App

The Electron main process is already configured in `electron-main.js`.

### Step 3: Build EXE

#### For Windows
```bash
pnpm electron-build-win
```

Output: `dist-electron/Copo-Gaming-1.0.0.exe` (installer)

#### For Mac
```bash
pnpm electron-build-mac
```

Output: `dist-electron/Copo-Gaming-1.0.0.dmg` (installer)

#### For Linux
```bash
pnpm electron-build-linux
```

Output: `dist-electron/Copo-Gaming-1.0.0.AppImage` (portable)

### Step 4: Distribute

The EXE files are ready to distribute. Users can:
1. Download the installer
2. Run it to install Copo Gaming
3. Launch from Start Menu (Windows) or Applications (Mac)

## Building APK (Android)

### Step 1: Initialize Capacitor

```bash
cd /home/ubuntu/copo-gaming
npx cap init
```

This creates the Capacitor configuration.

### Step 2: Add Android Platform

```bash
npx cap add android
```

This creates the `android/` directory with Android project files.

### Step 3: Build Frontend

```bash
pnpm build
```

### Step 4: Sync and Build APK

```bash
pnpm apk-build
```

This:
1. Syncs web assets to Android
2. Builds the APK using Gradle

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Sign APK (Optional but Recommended)

For distribution on Google Play Store, you need to sign the APK:

```bash
# Generate keystore (one-time)
keytool -genkey -v -keystore copo-gaming.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias copo

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore copo-gaming.keystore \
  android/app/build/outputs/apk/release/app-release.apk copo
```

### Step 6: Distribute

The APK can be:
1. Installed directly on Android devices via USB or file transfer
2. Uploaded to Google Play Store
3. Distributed via APK hosting services

## File Locations

After building:

```
copo-gaming/
├── dist/                          # Web build
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   └── index.js
├── dist-electron/                 # EXE builds
│   ├── Copo-Gaming-1.0.0.exe
│   ├── Copo-Gaming-1.0.0.dmg
│   └── Copo-Gaming-1.0.0.AppImage
├── android/                       # Android project
│   └── app/build/outputs/apk/
│       └── release/app-release.apk
└── electron-main.js               # Electron config
```

## Configuration Files

### electron-builder.yml
Configures EXE packaging:
- Target platforms (Windows, Mac, Linux)
- Installer options (NSIS for Windows)
- App metadata and icons

### capacitor.config.json
Configures APK packaging:
- App ID: `com.copo.gaming`
- App name: `Copo Gaming`
- Web directory: `dist`

## Troubleshooting

### EXE Build Issues

**Error: "electron-builder not found"**
```bash
pnpm add -D electron-builder
```

**Error: "Cannot find icon"**
- Create `assets/icon.png` (512x512)
- Update `electron-builder.yml` icon path

**Error: "Code signing failed" (Mac)**
- Requires valid Apple Developer certificate
- For development, use `--no-sign` flag

### APK Build Issues

**Error: "Android SDK not found"**
```bash
# Install Android SDK via Android Studio or:
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
```

**Error: "Gradle build failed"**
```bash
cd android
./gradlew clean build
```

**Error: "Java version mismatch"**
- Ensure JDK 11+ is installed
- Set `JAVA_HOME` environment variable

## Performance Optimization

### EXE
- Bundle size: ~1.2 MB (JavaScript)
- Startup time: ~2-3 seconds
- Memory usage: ~200-300 MB

### APK
- APK size: ~50-100 MB (includes Chromium)
- Startup time: ~3-5 seconds
- Memory usage: ~300-400 MB

## Distribution Channels

### Windows
- **Direct Download**: Host EXE on your website
- **Microsoft Store**: Submit to Windows Store
- **Installer Services**: Use NSIS or WiX

### Mac
- **Direct Download**: Host DMG on your website
- **App Store**: Submit to Mac App Store
- **Notarization**: Required for distribution

### Android
- **Direct Install**: Share APK file
- **Google Play Store**: Upload signed APK
- **F-Droid**: Open-source app store
- **APK Hosting**: Services like AppBrain, APKPure

## Continuous Integration

### GitHub Actions Example

```yaml
name: Build & Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm build

      - name: Build EXE (Windows)
        if: runner.os == 'Windows'
        run: pnpm electron-build-win

      - name: Build DMG (Mac)
        if: runner.os == 'macOS'
        run: pnpm electron-build-mac

      - name: Build AppImage (Linux)
        if: runner.os == 'Linux'
        run: pnpm electron-build-linux

      - name: Upload Release Assets
        uses: softprops/action-gh-release@v1
        with:
          files: dist-electron/**
```

## Next Steps

1. **Test Locally**: Run `pnpm electron-dev` to test Electron app
2. **Test on Android**: Use `pnpm apk-open` to open Android Studio
3. **Sign & Distribute**: Follow platform-specific signing requirements
4. **Monitor**: Track downloads and user feedback
5. **Update**: Publish new versions with bug fixes and features

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Development](https://developer.android.com/)
- [Windows Packaging](https://docs.microsoft.com/en-us/windows/win32/msi/windows-installer-portal)

## Support

For issues with packaging:
1. Check the troubleshooting section above
2. Review build logs for error messages
3. Consult platform-specific documentation
4. Open an issue on GitHub

---

**Last Updated:** June 10, 2026
**Version:** 1.0.0
