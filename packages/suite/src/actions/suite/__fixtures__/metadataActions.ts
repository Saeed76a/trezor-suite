import { testMocks } from '@suite-common/test-utils';
import { deviceActions } from '@suite-common/wallet-core';

import { METADATA, METADATA_LABELING } from 'src/actions/suite/constants/';

import * as metadataLabelingActions from '../metadataLabelingActions';
import * as metadataProviderActions from '../metadataProviderActions';
import * as metadataActions from '../metadataActions';

const { getSuiteDevice, getWalletAccount } = testMocks;

type Fixture<T extends (...a: any) => any> = {
    description: string;
    params: Parameters<T>;
    initialState: any;
    result?: any;
};

const setDeviceMetadataKey: Fixture<(typeof metadataLabelingActions)['setDeviceMetadataKey']>[] = [
    {
        description: `Metadata not enabled`,
        params: [
            getSuiteDevice({ state: '1stTestnetAddress@device_a_id:0' }),
            METADATA_LABELING.ENCRYPTION_VERSION,
        ],
        initialState: {
            metadata: { enabled: false, providers: [] },
        },
    },
    {
        description: `Device without state`,
        params: [getSuiteDevice({ state: undefined }), METADATA_LABELING.ENCRYPTION_VERSION],
        initialState: {
            metadata: { enabled: true, providers: [] },
        },
    },
    {
        description: `Device not connected (remembered)`,
        params: [
            getSuiteDevice({
                state: '1stTestnetAddress@device_id:0',
                connected: false,
                metadata: {},
            }),
            METADATA_LABELING.ENCRYPTION_VERSION,
        ],
        initialState: {
            metadata: { enabled: true, providers: [] },
        },
    },
    {
        description: `Master key successfully generated`,
        params: [
            getSuiteDevice({
                state: '1stTestnetAddress@device_id:0',
                connected: true,
                metadata: {},
            }),
            METADATA_LABELING.ENCRYPTION_VERSION,
        ],
        initialState: {
            metadata: {
                enabled: true,
            },
            device: {
                state: { staticSessionId: '1stTestnetAddress@device_id:0' },
                connected: true,
                metadata: {},
            },
        },
        result: [
            {
                type: METADATA.SET_DEVICE_METADATA,
                payload: {
                    deviceState: '1stTestnetAddress@device_id:0',
                    metadata: {
                        1: {
                            fileName:
                                'cd1a5bac2ea44cce54f42ad387ba7fd871ebc5c5e81afeb1f9b6fa5cf9f8677a.mtdt',
                            aesKey: '730033a116eb643d4afb80113c698cf63ac0fd811334c68d2b18c60c4f461d76',
                            key: '20c8bf0701213cdcf4c2f56fd0096c1772322d42fb9c4d0ddf6bb122d713d2f3',
                        },
                    },
                },
            },
            {
                type: deviceActions.updateSelectedDevice.type,
                payload: {
                    metadata: {
                        1: {
                            aesKey: '730033a116eb643d4afb80113c698cf63ac0fd811334c68d2b18c60c4f461d76',
                            fileName:
                                'cd1a5bac2ea44cce54f42ad387ba7fd871ebc5c5e81afeb1f9b6fa5cf9f8677a.mtdt',
                            key: '20c8bf0701213cdcf4c2f56fd0096c1772322d42fb9c4d0ddf6bb122d713d2f3',
                        },
                    },
                    state: { staticSessionId: '1stTestnetAddress@device_id:0' },
                },
            },
        ],
    },
];

const setAccountMetadataKey: Fixture<(typeof metadataLabelingActions)['setAccountMetadataKey']>[] =
    [
        {
            description: `Account m/49'/0'/0'`,
            initialState: {
                device: {
                    state: { staticSessionId: '1stTestnetAddress@device_id:0' },
                    metadata: {
                        1: {
                            key: '20c8bf0701213cdcf4c2f56fd0096c1772322d42fb9c4d0ddf6bb122d713d2f3',
                        },
                    },
                },
            },
            params: [
                getWalletAccount({
                    metadata: {
                        key: 'xpub6CVKsQYXc9awxgV1tWbG4foDvdcnieK2JkbpPEBKB5WwAPKBZ1mstLbKVB4ov7QzxzjaxNK6EfmNY5Jsk2cG26EVcEkycGW4tchT2dyUhrx',
                    },
                    deviceState: '1stTestnetAddress@device_id:0',
                }),
            ],
            result: {
                metadata: {
                    1: {
                        fileName:
                            '828652b66f2e6f919fbb7fe4c9609d4891ed531c6fac4c28441e53ebe577ac85.mtdt',
                        aesKey: '9bc3736f0b45cd681854a724b5bba67b9da1e50bc9983fd2dd56e53e74b75480',
                    },
                },
            },
        },
    ];

const addDeviceMetadata: Fixture<(typeof metadataLabelingActions)['addDeviceMetadata']>[] = [
    {
        description: `Without device`,
        initialState: {
            metadata: { selectedProvider: { type: 'dropbox', key: 'A' }, providers: [] },
            device: { state: undefined },
        },
        params: [{ type: 'walletLabel', entityKey: '1stTestnetAddress@device_id:0' }],
        result: undefined,
    },
    {
        description: `Add walletLabel`,
        initialState: {
            metadata: { selectedProvider: { type: 'dropbox', key: 'A' }, providers: [] },
            device: {
                state: '1stTestnetAddress@device_id:0',
                metadata: {
                    1: {
                        aesKey: 'eb0f1f0238c7fa8018c6101f4e887b871ce07b99d01d5ea57089b82f93149557',
                        fileName:
                            '039fe833cba71d84b7bf4c99d44468ee48e311e741cbfcd6daf5263f584ef9f6',
                    },
                    key: 'CKValue',
                },
            },
        },
        params: [
            {
                type: 'walletLabel',
                entityKey: '1stTestnetAddress@device_id:0',
                value: 'Custom label',
            },
        ],
        result: {},
    },
];

const addAccountMetadata: Fixture<(typeof metadataLabelingActions)['addAccountMetadata']>[] = [
    {
        description: `Without provider`,
        initialState: {
            metadata: {
                providers: [],
            },
        },
        params: [
            {
                type: 'outputLabel',
                entityKey: 'account',
                txid: 'TXID',
                outputIndex: 0,
                value: 'Foo',
            },
        ],
        result: undefined,
    },
    {
        description: `Without account`,
        initialState: {
            metadata: {
                selectedProvider: { labels: 'clientId' },
                providers: [{ type: 'dropbox', data: {}, clientId: 'clientId' }],
            },
        },
        params: [
            {
                type: 'outputLabel',
                entityKey: 'account',
                txid: 'TXID',
                outputIndex: 0,
                value: 'Foo',
            },
        ],
        result: undefined,
    },
    {
        description: `add outputLabel`,
        initialState: {
            metadata: {
                selectedProvider: { labels: 'clientId' },
                providers: [
                    {
                        type: 'dropbox',
                        data: {
                            a: {
                                outputLabels: {},
                                addressLabels: {},
                                accountLabel: '',
                            },
                        },
                        clientId: 'clientId',
                    },
                ],
            },
            device: {
                metadata: {},
            },
            accounts: [
                {
                    key: 'account',
                    metadata: {
                        [METADATA_LABELING.ENCRYPTION_VERSION]: {
                            aesKey: '9bc3736f0b45cd681854a724b5bba67b9da1e50bc9983fd2dd56e53e74b75480',
                            fileName: 'a',
                        },
                    },
                },
            ],
        },
        params: [
            {
                type: 'outputLabel',
                entityKey: 'account',
                txid: 'TXID',
                outputIndex: 0,
                value: 'Foo',
            },
        ],
        result: [
            {
                type: '@metadata/set-data',
                payload: {
                    provider: {
                        type: 'dropbox',
                        data: { a: { outputLabels: {}, addressLabels: {}, accountLabel: '' } },
                        clientId: 'clientId',
                    },
                    data: {
                        a: {
                            outputLabels: { TXID: { '0': 'Foo' } },
                            addressLabels: {},
                            accountLabel: '',
                        },
                    },
                },
            },
        ],
    },
    {
        description: `remove outputLabel`,
        initialState: {
            metadata: {
                selectedProvider: { labels: 'clientId' },
                providers: [
                    {
                        type: 'dropbox',
                        data: {
                            'filename-123': {
                                outputLabels: {
                                    TXID: {
                                        0: 'Foo',
                                    },
                                },
                            },
                        },
                        clientId: 'clientId',
                    },
                ],
            },
            device: {
                metadata: {
                    key: 'B',
                },
            },
            accounts: [
                {
                    key: 'account',
                    metadata: {
                        1: {
                            aesKey: '9bc3736f0b45cd681854a724b5bba67b9da1e50bc9983fd2dd56e53e74b75480',
                            fileName: 'filename-123',
                        },
                    },
                },
            ],
        },
        params: [
            {
                type: 'outputLabel',
                entityKey: 'account',
                txid: 'TXID',
                outputIndex: 0,
                value: '', // empty string removes value
            },
        ],
        result: [
            {
                payload: {
                    data: { 'filename-123': { outputLabels: {} } },
                    provider: {
                        clientId: 'clientId',
                        data: { 'filename-123': { outputLabels: { TXID: { '0': 'Foo' } } } },
                        type: 'dropbox',
                    },
                },
                type: '@metadata/set-data',
            },
        ],
    },
];

const connectProvider: Fixture<(typeof metadataProviderActions)['connectProvider']>[] = [
    {
        description: 'Dropbox',
        initialState: {
            metadata: undefined,
        },
        params: [{ type: 'dropbox' }],
        result: [
            {
                type: '@metadata/add-provider',
                payload: {
                    type: 'dropbox',
                    tokens: { refreshToken: 'token' },
                    user: 'power-user',
                    isCloud: true,
                    clientId: 'meow',
                    data: {},
                },
            },
            {
                payload: {
                    clientId: 'wg0yz2pbgjyhoda',
                    dataType: 'labels',
                },
                type: '@metadata/set-selected-provider',
            },
        ],
    },
    // todo: google provider
    // todo: singleton (instance) behavior
];

const addMetadata: Fixture<(typeof metadataLabelingActions)['addMetadata']>[] = [
    {
        description: 'does not need update',
        initialState: {
            metadata: {
                enabled: true,
                selectedProvider: {
                    labels: 'clientId',
                },
                providers: [
                    {
                        clientId: 'clientId',
                        type: 'dropbox',
                        user: 'User Name',
                        tokens: { refreshToken: 'oauth-token' },
                    },
                ],
            },
            device: {
                state: 'mmcGdEpTPqgQNRHqf3gmB5uDsEoPo2d3tp@46CE52D1ED50A900687D6BA2:undefined',
                metadata: {},
            },
        },
        params: [
            {
                entityKey: 'account-key',
                defaultValue: "m/84'/0'/0'",
                type: 'accountLabel',
                value: undefined,
            },
        ],
        result: [],
    },
    {
        description: 'value from input === original value',
        initialState: {
            metadata: {
                enabled: true,
                selectedProvider: {
                    labels: 'clientId',
                },
                providers: [
                    {
                        clientId: 'clientId',
                        type: 'dropbox',
                        user: 'User Name',
                        tokens: { refreshToken: 'oauth-token' },
                    },
                ],
            },
            device: {
                state: 'mmcGdEpTPqgQNRHqf3gmB5uDsEoPo2d3tp@46CE52D1ED50A900687D6BA2:undefined',
                metadata: {},
            },
        },
        params: [
            {
                entityKey: 'account-key',
                defaultValue: "m/84'/0'/0'",
                type: 'accountLabel',
                value: 'my label', // see store setup in tests
            },
        ],
        result: [],
    },
];

export const enableMetadata: Fixture<(typeof metadataActions)['enableMetadata']>[] = [
    {
        description: 'enable metadata',
        initialState: {
            metadata: { enabled: true, providers: [] },
        },
        params: [],
        result: [
            {
                type: METADATA.ENABLE,
            },
        ],
    },
];

export const disableMetadata: Fixture<(typeof metadataActions)['disableMetadata']>[] = [
    {
        description: 'disable metadata',
        initialState: {
            metadata: { enabled: true, providers: [] },
            device: {
                state: undefined,
            },
        },
        params: [],
        result: [
            {
                type: METADATA.DISABLE,
            },
        ],
    },
];

const init: Fixture<(typeof metadataLabelingActions)['init']>[] = [
    {
        description: 'device without state',
        initialState: {
            device: { state: undefined },
        },
        params: [false],
        result: [],
    },
    {
        description: 'metadata already enabled',
        initialState: {
            device: {
                state: { staticSessionId: '1stTestnetAddress@device_id:0' },
                connected: true,
                metadata: {
                    1: {
                        fileName:
                            'cd1a5bac2ea44cce54f42ad387ba7fd871ebc5c5e81afeb1f9b6fa5cf9f8677a.mtdt',
                        aesKey: '730033a116eb643d4afb80113c698cf63ac0fd811334c68d2b18c60c4f461d76',
                        key: '20c8bf0701213cdcf4c2f56fd0096c1772322d42fb9c4d0ddf6bb122d713d2f3',
                    },
                },
            },
            metadata: {
                enabled: true,
                selectedProvider: {},
                providers: [],
            },
        },
        params: [false],
        result: [
            { type: '@metadata/set-initiating', payload: true },
            {
                type: '@modal/open-user-context',
                payload: { type: 'metadata-provider', decision: { promise: {} } },
            },
            {
                type: '@metadata/add-provider',
                payload: {
                    type: 'dropbox',
                    isCloud: true,
                    tokens: { refreshToken: 'token' },
                    user: 'power-user',
                    clientId: 'meow',
                    data: {},
                },
            },
            {
                type: '@metadata/set-selected-provider',
                payload: { dataType: 'labels', clientId: 'wg0yz2pbgjyhoda' },
            },

            { type: '@metadata/set-initiating', payload: false },
        ],
    },
    {
        description: 'metadata not enabled',
        initialState: {
            device: {
                state: { staticSessionId: '1stTestnetAddress@device_id:0' },
                connected: true,
                metadata: {},
            },
            metadata: {
                enabled: false,
                providers: [],
                selectedProvider: {},
            },
            suite: { online: true },
        },
        params: [false],
        result: [
            { type: '@metadata/set-initiating', payload: true },
            { type: '@metadata/enable' },
            {
                type: '@metadata/set-device-metadata',
                payload: {
                    deviceState: '1stTestnetAddress@device_id:0',
                    metadata: {
                        1: {
                            fileName:
                                'cd1a5bac2ea44cce54f42ad387ba7fd871ebc5c5e81afeb1f9b6fa5cf9f8677a.mtdt',
                            aesKey: '730033a116eb643d4afb80113c698cf63ac0fd811334c68d2b18c60c4f461d76',
                            key: '20c8bf0701213cdcf4c2f56fd0096c1772322d42fb9c4d0ddf6bb122d713d2f3',
                        },
                    },
                },
            },
            {
                type: deviceActions.updateSelectedDevice.type,
                payload: {
                    state: { staticSessionId: '1stTestnetAddress@device_id:0' },
                    connected: true,
                    metadata: {
                        1: {
                            fileName:
                                'cd1a5bac2ea44cce54f42ad387ba7fd871ebc5c5e81afeb1f9b6fa5cf9f8677a.mtdt',
                            aesKey: '730033a116eb643d4afb80113c698cf63ac0fd811334c68d2b18c60c4f461d76',
                            key: '20c8bf0701213cdcf4c2f56fd0096c1772322d42fb9c4d0ddf6bb122d713d2f3',
                        },
                    },
                },
            },
            {
                type: '@modal/open-user-context',
                payload: { type: 'metadata-provider', decision: { promise: {} } },
            },
            {
                type: '@metadata/add-provider',
                payload: {
                    type: 'dropbox',
                    isCloud: true,
                    tokens: { refreshToken: 'token' },
                    user: 'power-user',
                    clientId: 'meow',
                    data: {},
                },
            },
            {
                type: '@metadata/set-selected-provider',
                payload: { dataType: 'labels', clientId: 'wg0yz2pbgjyhoda' },
            },

            { type: '@metadata/set-initiating', payload: false },
        ],
    },
];

const disposeMetadata: Fixture<(typeof metadataActions)['disposeMetadata']>[] = [
    {
        description: '',
        initialState: {
            device: { state: '1stTestnetAddress@device_id:0', metadata: {} },
            metadata: {
                providers: [
                    {
                        type: 'dropbox',
                        data: {
                            'filename-123': {
                                outputLabels: {
                                    TXID: {
                                        0: 'Foo',
                                    },
                                },
                            },
                        },
                        clientId: 'clientId',
                    },
                ],
                selectedProvider: { labels: 'clientId' },
            },
        },
        params: [] as const,
        result: {
            metadata: {
                providers: [
                    {
                        type: 'dropbox',
                        data: {},
                        clientId: 'clientId',
                    },
                ],
                selectedProvider: {
                    labels: 'clientId',
                },
            },
        },
    },
];

const disposeMetadataKeys: Fixture<(typeof metadataActions)['disposeMetadataKeys']>[] = [
    {
        description: 'keys',
        initialState: {
            device: {
                state: '1stTestnetAddress@device_id:0',
                metadata: { 1: { fileName: 'foo', aesKey: 'bar' } },
            },
            accounts: [
                {
                    deviceState: '1stTestnetAddress@device_id:0',
                    key: 'account-key',
                    metadata: {
                        1: {
                            fileName: 'foo',
                            aesKey: 'bar',
                        },
                    },
                },
            ],
        },
        params: [] as const,
        result: {
            device: { selectedDevice: { state: '1stTestnetAddress@device_id:0', metadata: {} } },
            wallet: {
                accounts: [
                    {
                        deviceState: '1stTestnetAddress@device_id:0',
                        key: 'account-key',
                        metadata: {},
                    },
                ],
            },
        },
    },
];

export {
    setDeviceMetadataKey,
    setAccountMetadataKey,
    addDeviceMetadata,
    addAccountMetadata,
    connectProvider,
    addMetadata,
    init,
    disposeMetadata,
    disposeMetadataKeys,
};
