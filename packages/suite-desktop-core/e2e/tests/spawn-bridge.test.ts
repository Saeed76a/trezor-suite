import { TrezorUserEnvLink } from '@trezor/trezor-user-env-link';

import { test, expect } from '../support/fixtures';
import { launchSuite, LEGACY_BRIDGE_VERSION, waitForDataTestSelector } from '../support/common';
import { OnboardingActions } from '../support/pageActions/onboardingActions';

test.describe.serial('Bridge', () => {
    test.beforeEach(async () => {
        // We make sure that bridge from trezor-user-env is stopped.
        // So we properly test the electron app starting node-bridge module.
        await TrezorUserEnvLink.connect();
        await TrezorUserEnvLink.stopBridge();
    });

    test('App spawns bundled bridge and stops it after app quit', async ({ request }) => {
        const suite = await launchSuite();
        const title = await suite.window.title();
        expect(title).toContain('Trezor Suite');

        // We wait for `@welcome/title` or `@dashboard/graph` since
        // one or the other will be display depending on the state of the app
        // due to previously run tests. And both means the same for the porpoise of this test.
        // Bridge should be ready to check `/status` endpoint.
        await Promise.race([
            waitForDataTestSelector(suite.window, '@welcome/title'),
            waitForDataTestSelector(suite.window, '@dashboard/graph'),
        ]);

        // bridge is running
        const bridgeRes1 = await request.get('http://127.0.0.1:21325/status/');
        await expect(bridgeRes1).toBeOK();

        const response = await request.post('http://127.0.0.1:21325/', {
            headers: {
                Origin: 'https://wallet.trezor.io',
            },
        });

        const json = await response.json();
        const { version } = json;
        expect(version).toEqual(LEGACY_BRIDGE_VERSION);

        // bridge is running after renderer window is refreshed
        await suite.window.reload();
        await suite.window.title();
        // bridge is running
        const bridgeRes2 = await request.get('http://127.0.0.1:21325/status/');
        await expect(bridgeRes2).toBeOK();

        await suite.electronApp.close();

        // bridge is not running
        try {
            await request.get('http://127.0.0.1:21325/status/');
            throw new Error('should have thrown!');
        } catch {
            // ok
        }
    });

    test('App acquired device, EXTERNAL bridge is restarted, app reconnects', async () => {
        await TrezorUserEnvLink.startEmu({ wipe: true, version: '2-latest', model: 'T2T1' });
        await TrezorUserEnvLink.setupEmu({});
        await TrezorUserEnvLink.startBridge(LEGACY_BRIDGE_VERSION);

        const suite = await launchSuite();
        await suite.window.title();
        await waitForDataTestSelector(suite.window, '@welcome/title');
        const onboardingPage = new OnboardingActions(suite.window);
        await onboardingPage.completeOnboarding();

        await TrezorUserEnvLink.stopBridge();

        await waitForDataTestSelector(suite.window, '@connect-device-prompt');

        await TrezorUserEnvLink.startBridge(LEGACY_BRIDGE_VERSION);
        await waitForDataTestSelector(suite.window, '@dashboard/index');
    });
});
