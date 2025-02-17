import styled from 'styled-components';
import { transparentize } from 'polished';

import { Button, Icon, variables } from '@trezor/components';
import { selectAccountByKey } from '@suite-common/wallet-core';
import { WalletParams } from '@suite-common/wallet-types';

import { useDispatch } from 'src/hooks/suite';
import { goto } from 'src/actions/suite/routerActions';
import { useSelector } from 'src/hooks/suite/useSelector';
import { selectRouterParams } from 'src/reducers/suite/routerReducer';
import { onCancel as closeModal } from 'src/actions/suite/modalActions';
import { Modal, Translation } from 'src/components/suite';

const StyledModal = styled(Modal)`
    width: 435px;
`;

const IconWrapper = styled.div`
    width: 84px;
    height: 84px;
    margin: 12px auto 32px;
    border-radius: 50%;
    background: ${({ theme }) => transparentize(0.9, theme.legacy.BG_GREEN)};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Heading = styled.h3`
    margin-bottom: 22px;
    font-size: 32px;
    line-height: 32px;
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${({ theme }) => theme.legacy.TYPE_GREEN};
`;

const Text = styled.p`
    color: ${({ theme }) => theme.legacy.TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

interface CoinjoinSuccessModalProps {
    relatedAccountKey: string;
}

export const CoinjoinSuccessModal = ({ relatedAccountKey }: CoinjoinSuccessModalProps) => {
    const routerParams = useSelector(selectRouterParams);
    const relatedAccount = useSelector(state => selectAccountByKey(state, relatedAccountKey));

    const dispatch = useDispatch();

    if (!relatedAccount) {
        return null;
    }

    const { symbol, index, accountType } = relatedAccount;

    const close = () => dispatch(closeModal());
    const navigateToRelatedAccount = () => {
        dispatch(closeModal());
        dispatch(
            goto('wallet-index', {
                params: {
                    symbol,
                    accountIndex: index,
                    accountType,
                },
            }),
        );
    };

    const {
        symbol: symbolParam,
        accountIndex: indexParam,
        accountType: accountTypeParam,
    } = (routerParams as WalletParams) || {};

    const isOnAccountPage =
        symbolParam === symbol && indexParam === index && accountTypeParam === accountType;

    return (
        <StyledModal
            bottomBarComponents={
                <>
                    <Button isFullWidth variant="tertiary" onClick={close}>
                        <Translation id="TR_DISMISS" />
                    </Button>
                    {!isOnAccountPage && (
                        <Button isFullWidth onClick={navigateToRelatedAccount}>
                            <Translation id="TR_VIEW_ACCOUNT" />
                        </Button>
                    )}
                </>
            }
        >
            <IconWrapper>
                <Icon name="confetti" size={32} variant="primary" />
            </IconWrapper>

            <Heading>
                <Translation id="TR_COINJOIN_COMPLETED" />
            </Heading>
            <Text>
                <Translation id="TR_COINJOIN_COMPLETED_DESCRIPTION" />
            </Text>
        </StyledModal>
    );
};
