import styled from 'styled-components';

import { variables, Column } from '@trezor/components';
import * as deviceUtils from '@suite-common/suite-utils';
import { selectDevice, selectDeviceThunk, acquireDevice } from '@suite-common/wallet-core';
import { spacings } from '@trezor/theme';

import { useDispatch, useSelector } from 'src/hooks/suite';
import type { TrezorDevice, AcquiredDevice, ForegroundAppProps } from 'src/types/suite';
import { redirectAfterWalletSelectedThunk } from 'src/actions/wallet/addWalletThunk';

import { WalletInstance } from './WalletInstance';
import { AddWalletButton } from './AddWalletButton';
import { CardWithDevice } from '../CardWithDevice';
import { DeviceWarning } from './DeviceWarning';

const WalletsWrapper = styled.div<{ $enabled: boolean }>`
    opacity: ${({ $enabled }) => ($enabled ? 1 : 0.5)};
    pointer-events: ${({ $enabled }) => ($enabled ? 'unset' : 'none')};
    padding-bottom: ${({ $enabled }) => ($enabled ? '0px' : '24px')};

    @media (max-width: ${variables.SCREEN_SIZE.SM}) {
        margin-left: 0;
    }
`;

interface DeviceItemProps {
    device: TrezorDevice;
    instances: AcquiredDevice[];
    onCancel: ForegroundAppProps['onCancel'];
    isFullHeaderVisible?: boolean;
}

export const DeviceItem = ({
    device,
    instances,
    onCancel,
    isFullHeaderVisible,
}: DeviceItemProps) => {
    const selectedDevice = useSelector(selectDevice);
    const dispatch = useDispatch();
    const deviceStatus = deviceUtils.getStatus(device);
    const needsAttention = deviceUtils.deviceNeedsAttention(deviceStatus);
    const instancesWithState = instances.filter(i => i.state);

    const onSolveIssueClick = () => {
        const needsAcquire =
            device.type === 'unacquired' ||
            deviceStatus === 'used-in-other-window' ||
            deviceStatus === 'was-used-in-other-window';
        if (needsAcquire) {
            dispatch(acquireDevice(device));
        } else {
            dispatch(selectDeviceThunk({ device }));
            dispatch(redirectAfterWalletSelectedThunk());
            onCancel(false);
        }
    };

    return (
        <CardWithDevice
            deviceWarning={
                <DeviceWarning
                    needsAttention={needsAttention}
                    device={device}
                    onSolveIssueClick={onSolveIssueClick}
                />
            }
            isFindTrezorVisible
            onCancel={onCancel}
            device={device}
            isFullHeaderVisible={isFullHeaderVisible}
        >
            <WalletsWrapper $enabled>
                <Column gap={spacings.xs} margin={{ top: spacings.xxs }}>
                    {instancesWithState.length > 0 && (
                        <Column gap={spacings.xs}>
                            {instancesWithState.map((instance, index) => (
                                <WalletInstance
                                    key={`${instance.id}-${instance.instance}-${instance.state}`}
                                    instance={instance}
                                    enabled
                                    selected={deviceUtils.isSelectedInstance(
                                        selectedDevice,
                                        instance,
                                    )}
                                    index={index}
                                    onCancel={onCancel}
                                />
                            ))}
                        </Column>
                    )}
                    <AddWalletButton device={device} instances={instances} onCancel={onCancel} />
                </Column>
            </WalletsWrapper>
        </CardWithDevice>
    );
};
