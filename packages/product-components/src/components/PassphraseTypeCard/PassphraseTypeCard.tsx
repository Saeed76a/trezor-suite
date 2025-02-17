import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import styled, { css } from 'styled-components';

import { useKeyPress } from '@trezor/react-utils';
import { setCaretPosition } from '@trezor/dom-utils';
import { countBytesInString } from '@trezor/utils';
import { formInputsMaxLength } from '@suite-common/validators';
import { TooltipProps } from '@trezor/components';
import { DeviceModelInternal, Features } from '@trezor/connect';
import { borders, spacingsPx } from '@trezor/theme';

import { EnterOnTrezorButton } from './EnterOnTrezorButton';
import { PassphraseTypeCardHeading } from './PassphraseTypeCardHeading';
import { WalletType } from './types';
import { PassphraseTypeCardContent } from './PassphraseTypeCardContent';
import { DOT } from './consts';
import { useNonAsciiChars } from './useNonAsciiChars';
import { getSubmitLabel } from './getSubmitLabel';

type WrapperProps = {
    $type: WalletType;
    $singleColModal?: boolean;
};

const Item = styled.div``;

const Wrapper = styled.div<WrapperProps>`
    display: flex;
    flex: 1;
    gap: ${spacingsPx.xs};
    border-radius: ${borders.radii.xs};
    flex-direction: column;
    text-align: left;
    width: 100%;

    & + & {
        margin-top: ${spacingsPx.md};
    }

    ${({ $singleColModal }) =>
        !$singleColModal &&
        css`
            padding: ${spacingsPx.sm};
        `}

    ${({ $type }) =>
        $type === 'standard' &&
        css`
            cursor: pointer;
        `}
`;

const Spacer = styled.div`
    margin: ${spacingsPx.md} 0;
`;

export type PassphraseTypeCardProps = {
    title?: ReactNode;
    description?: ReactNode;
    submitLabel: ReactNode;
    type: WalletType;
    offerPassphraseOnDevice?: boolean;
    singleColModal?: boolean;
    deviceModel?: DeviceModelInternal;
    deviceBackup?: Features['backup_type'] | null;
    onSubmit: (value: string, passphraseOnDevice?: boolean) => void;
    learnMoreTooltipOnClick?: TooltipProps['addon'];
    learnMoreTooltipAppendTo?: TooltipProps['appendTo'];
};

export const PassphraseTypeCard = (props: PassphraseTypeCardProps) => {
    const [value, setValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hiddenWalletTouched, setHiddenWalletTouched] = useState(false);
    const enterPressed = useKeyPress('Enter');
    const { nonAsciiChars, showAsciiBanner } = useNonAsciiChars(value);

    const ref = useRef<HTMLInputElement>(null);
    const caretRef = useRef<number>(0);

    const isPassphraseTooLong = countBytesInString(value) > formInputsMaxLength.passphrase;

    const {
        onSubmit,
        type,
        learnMoreTooltipOnClick,
        learnMoreTooltipAppendTo,
        title,
        description,
        singleColModal,
        submitLabel: submitLabelProp,
        offerPassphraseOnDevice,
        deviceModel,
        deviceBackup,
    } = props;
    const submit = useCallback(
        (value2: string, passphraseOnDevice?: boolean) => {
            onSubmit(value2, passphraseOnDevice);
        },
        [onSubmit],
    );

    const isBip39 = deviceBackup === 'Bip39';

    const submitLabel = getSubmitLabel({ nonAsciiChars, label: submitLabelProp, showPassword });

    const canSubmit = (singleColModal || type === 'hidden') && !isPassphraseTooLong;

    // Trigger submit on pressing Enter in case of single col modal (creating/confirming passphrase wallet)
    // In case of two-col modal (selecting between standard and passphrase wallet)
    // only the passphrase wallet part handle the enter press.
    useEffect(() => {
        if (enterPressed && canSubmit) {
            submit(value);
        }
    }, [enterPressed, canSubmit, submit, value]);

    const displayValue = !showPassword ? value.replace(/./g, DOT) : value;

    useEffect(() => {
        if (caretRef.current && ref.current) {
            setCaretPosition(ref.current, caretRef.current);
        }
    }, [displayValue]);

    return (
        <Wrapper
            $type={type}
            $singleColModal={singleColModal}
            onClick={() => {
                if (type === 'standard') {
                    submit(value);
                } else if (ref && ref.current) {
                    ref.current.focus();
                    setHiddenWalletTouched(true);
                }
            }}
            data-testid={`@passphrase-type/${type}`}
        >
            {!singleColModal && (
                <Item>
                    <>
                        <PassphraseTypeCardHeading
                            type={type}
                            learnMoreTooltipOnClick={learnMoreTooltipOnClick}
                            learnMoreTooltipAppendTo={learnMoreTooltipAppendTo}
                            title={title}
                            description={description}
                        />
                        {type === 'hidden' && <Spacer />}
                    </>
                </Item>
            )}
            <Item>
                <PassphraseTypeCardContent
                    submitLabel={submitLabel}
                    submitVariant={nonAsciiChars && !isBip39 ? 'warning' : 'primary'}
                    value={value}
                    setValue={setValue}
                    showPassword={showPassword}
                    showAsciiBanner={showAsciiBanner}
                    asciiBannerVariant={isBip39 ? 'info' : 'warning'}
                    setShowPassword={setShowPassword}
                    hiddenWalletTouched={hiddenWalletTouched}
                    setHiddenWalletTouched={setHiddenWalletTouched}
                    type={type}
                    displayValue={displayValue}
                    isPassphraseTooLong={isPassphraseTooLong}
                    singleColModal={singleColModal}
                    submit={submit}
                    caretRef={caretRef}
                    innerRef={ref}
                />
            </Item>
            <Item>
                {/* Offer entering passphrase on a device */}
                <AnimatePresence initial={false}>
                    {offerPassphraseOnDevice && (
                        <EnterOnTrezorButton
                            submit={submit}
                            value={value}
                            deviceModel={deviceModel}
                        />
                    )}
                </AnimatePresence>
            </Item>
        </Wrapper>
    );
};
