const { suiteVersion } = require('../suite/package.json');
const schemes = require('./uriSchemes.json');

const isCodesignBuild = process.env.IS_CODESIGN_BUILD === 'true';

// to be able to use patterns like ${author} and ${arch}
module.exports = {
    // distingush between dev and prod builds
    appId: `io.trezor.TrezorSuite${isCodesignBuild ? '' : '.dev'}`,
    extraMetadata: {
        version: suiteVersion,
        // distingush between dev and prod builds so different userDataDir is used
        name: `@trezor/suite-desktop${isCodesignBuild ? '' : '-dev'}`,
    },
    productName: 'Trezor Suite',
    copyright: 'Copyright © ${author}',
    asar: true,
    asarUnpack: ['**/*.node'],
    directories: {
        output: 'build-electron',
    },
    npmRebuild: false,
    files: [
        // defaults are https://www.electron.build/configuration#files
        'build/**/*',
        'dist/**/*.{js,wasm}',
        '!**/{tsconfig}*',
        '!**/*.{md,js.map}',
        'build/release-notes.md',
        '!**/node_modules/**/*.{js.flow,ts}',
        '!build/static/**/{favicon,icons,bin,browsers}',
        '!node_modules/@sentry/**/esm',
        '!node_modules/ajv/lib',
        '!node_modules/blake-hash/**/{build,src}',
        '!node_modules/usb/**/{libusb,libusb_config,src}',
    ],
    extraResources: [
        {
            from: 'build/static/images/desktop/512x512.png',
            to: 'images/desktop/512x512.png',
        },
        {
            from: 'build/static/images/favicons',
            to: 'images/favicons',
        },
        {
            from: 'build/static/bin/firmware',
            to: 'bin/firmware',
        },
        {
            from: 'build/static/bin/devkit',
            to: 'bin/devkit',
        },
    ],
    protocols: {
        name: 'Trezor Suite',
        schemes,
    },
    publish: {
        provider: 'generic',
        url: 'https://data.trezor.io/suite/releases/desktop/latest',
    },
    dmg: {
        sign: false,
        contents: [
            {
                x: 410,
                y: 150,
                type: 'link',
                path: '/Applications',
            },
            {
                x: 130,
                y: 150,
                type: 'file',
            },
        ],
        background: 'build/static/images/desktop/background.tiff',
    },
    nsis: {
        oneClick: false,
    },
    mac: {
        files: ['entitlements.mac.inherit.plist'],
        extraResources: [
            {
                from: 'build/static/bin/bridge/mac-${arch}',
                to: 'bin/bridge',
            },
            {
                from: 'build/static/bin/tor/mac-${arch}',
                to: 'bin/tor',
            },
            {
                from: 'build/static/bin/coinjoin/mac-${arch}',
                to: 'bin/coinjoin',
            },
        ],
        icon: 'build/static/images/desktop/512x512.icns',
        artifactName: 'Trezor-Suite-${version}-mac-${arch}.${ext}',
        hardenedRuntime: true,
        gatekeeperAssess: false,
        darkModeSupport: true,
        entitlements: 'entitlements.mac.inherit.plist',
        entitlementsInherit: 'entitlements.mac.inherit.plist',
        extendInfo: {
            // Delete those keys from Info.plist, Electron adds them by default but Trezor Suite does not need these permissions
            NSBluetoothAlwaysUsageDescription: undefined,
            NSBluetoothPeripheralUsageDescription: undefined,
            NSMicrophoneUsageDescription: undefined,
            // Replace default "This app needs access to the camera" message with our own
            NSCameraUsageDescription:
                'Allow Trezor Suite to access the camera to scan QR codes? Or enter the address manually.',
        },
        target: ['dmg', 'zip'],
    },
    win: {
        publisherName: ['SatoshiLabs, s.r.o.', 'Trezor Company s.r.o.'],
        extraResources: [
            {
                from: 'build/static/bin/bridge/win-${arch}',
                to: 'bin/bridge',
            },
            {
                from: 'build/static/bin/tor/win-${arch}',
                to: 'bin/tor',
            },
            {
                from: 'build/static/bin/coinjoin/win-${arch}',
                to: 'bin/coinjoin',
            },
        ],
        icon: 'build/static/images/desktop/512x512.png',
        artifactName: 'Trezor-Suite-${version}-win-${arch}.${ext}',
        target: ['nsis'],
        signDlls: true,
        sign: '../suite-desktop-core/scripts/sign-windows.ts',
    },
    linux: {
        extraResources: [
            {
                from: 'build/static/bin/bridge/linux-${arch}',
                to: 'bin/bridge',
            },
            {
                from: 'build/static/bin/tor/linux-${arch}',
                to: 'bin/tor',
            },
            {
                from: 'build/static/bin/udev',
                to: 'bin/udev',
            },
            {
                from: 'build/static/bin/coinjoin/linux-${arch}',
                to: 'bin/coinjoin',
            },
        ],
        icon: 'build/static/images/desktop/512x512.png',
        artifactName: 'Trezor-Suite-${version}-linux-${arch}.${ext}',
        executableName: 'trezor-suite',
        category: 'Utility',
        target: ['AppImage'],
    },
    afterSign: '../suite-desktop-core/scripts/notarize.ts',
};
