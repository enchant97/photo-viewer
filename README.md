# Photo Viewer

> This app is still in early development, **DO NOT** use; unless you are a developer

## Requirements
- 64-bit machine
### Linux

### Windows
- If not running Win11, you will need the [Microsoft Edge WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)
### MacOS

## Building
### Notes
- It is advised you build with a thumbnail feature, this will dramatically increase performance for the UI.
  - Available features are: "thumbnail_magick" or "thumbnail_native"
    - If "thumbnail_magick" was selected you will need imagemagick >=7
    - If "thumbnail_native" was selected ensure that you build in release mode (even for dev), otherwise performance will be very poor
  - I prefer to run "thumbnail_magick" for development, enabling faster builds and switching to "thumbnail_native" during release

### Setup
- Tauri cli will need to be installed. If you have npm you can just run `npm i` which will install it as a dev requirement.
- Install npm requirements
- [Tauri CLI commands](https://tauri.app/v1/api/cli)

### Run Dev
We can use the Tauri cli for launching a dev application.

```
npm run tauri dev -- --features "thumbnail_magick"
```

### Build Release
To build a release binary we can use the Tauri cli

```
npm run tauri build -- --features "thumbnail_native"
```

## License
This project is Copyright (c) 2022 Leo Spratt, licences shown below:

Code

    AGPL-3 or any later version. Full license found in `LICENSE.txt`
