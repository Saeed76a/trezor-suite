import { useState } from 'react';

import styled, { useTheme } from 'styled-components';
import { BankAccount } from 'invity-api';

import { Button, Select, Icon, Row } from '@trezor/components';
import { fontWeights, spacingsPx, typography } from '@trezor/theme';

import { QuestionTooltip, Translation } from 'src/components/suite';
import { formatIban } from 'src/utils/wallet/coinmarket/sellUtils';
import { CoinmarketTradeSellType } from 'src/types/coinmarket/coinmarket';
import { useCoinmarketFormContext } from 'src/hooks/wallet/coinmarket/form/useCoinmarketCommonForm';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: ${spacingsPx.xs};
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${spacingsPx.xl};
`;

const Label = styled.div`
    display: flex;
    align-items: center;
    font-weight: ${fontWeights.medium};
`;

const StyledQuestionTooltip = styled(QuestionTooltip)`
    padding-left: ${spacingsPx.xxxs};
`;

const CustomLabel = styled(Label)`
    padding: ${spacingsPx.sm} 0;
    color: ${({ theme }) => theme.textSubdued};
`;

const LabelText = styled.div``;

const SelectWrapper = styled.div`
    width: 100%;

    /* stylelint-disable selector-class-pattern */
    .react-select__single-value {
        width: 100%;
    }
`;

const Option = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 ${spacingsPx.xxs};
    width: 100%;
`;

const AccountInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 2;
`;

const AccountName = styled.div`
    display: flex;
    color: ${({ theme }) => theme.textSubdued};
`;

const AccountNumber = styled.div`
    display: flex;
    font-weight: ${fontWeights.medium};
`;

const AccountVerified = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    ${typography.label}
    color: ${({ theme }) => theme.textPrimaryDefault};
`;

const AccountNotVerified = styled(AccountVerified)`
    color: ${({ theme }) => theme.textSubdued};
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${spacingsPx.lg};
    border-top: 1px solid ${({ theme }) => theme.borderElevation1};
    margin: ${spacingsPx.lg} 0;
`;

const RowWrapper = styled.div`
    margin: ${spacingsPx.xxs} 0;
    display: flex;

    .react-select__value-container {
        padding-right: ${spacingsPx.lg};
    }
`;

const Left = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const IconWrapper = styled.div`
    flex: none;
    margin-right: ${spacingsPx.xxxs};
`;

export const CoinmarketOfferSellBankAccount = () => {
    const theme = useTheme();
    const { callInProgress, confirmTrade, addBankAccount, selectedQuote } =
        useCoinmarketFormContext<CoinmarketTradeSellType>();
    const [bankAccount, setBankAccount] = useState<BankAccount | undefined>(
        selectedQuote?.bankAccounts ? selectedQuote?.bankAccounts[0] : undefined,
    );

    if (!selectedQuote || !selectedQuote.bankAccounts) return null;

    const { bankAccounts } = selectedQuote;

    return (
        <Wrapper>
            <CardContent>
                <RowWrapper>
                    <Left>
                        <CustomLabel>
                            <LabelText>
                                <Translation id="TR_SELL_BANK_ACCOUNT" />
                            </LabelText>
                            <StyledQuestionTooltip tooltip="TR_SELL_BANK_ACCOUNT_TOOLTIP" />
                        </CustomLabel>
                    </Left>
                    <Row alignItems="center">
                        <Button
                            variant="tertiary"
                            icon="plus"
                            data-testid="add-output"
                            onClick={addBankAccount}
                        >
                            <Translation id="TR_SELL_ADD_BANK_ACCOUNT" />
                        </Button>
                    </Row>
                </RowWrapper>
                <RowWrapper>
                    <SelectWrapper>
                        <Select
                            onChange={(selected: BankAccount) => {
                                setBankAccount(selected);
                            }}
                            value={bankAccount}
                            isClearable={false}
                            options={bankAccounts}
                            minValueWidth="70px"
                            formatOptionLabel={(option: BankAccount) => (
                                <Option>
                                    <AccountInfo>
                                        <AccountName>{option.holder}</AccountName>
                                        <AccountNumber>
                                            {formatIban(option.bankAccount)}
                                        </AccountNumber>
                                    </AccountInfo>
                                    {option.verified ? (
                                        <AccountVerified>
                                            <IconWrapper>
                                                <Icon
                                                    color={theme.legacy.TYPE_GREEN}
                                                    size={15}
                                                    name="check"
                                                />
                                            </IconWrapper>
                                            <Translation id="TR_SELL_BANK_ACCOUNT_VERIFIED" />
                                        </AccountVerified>
                                    ) : (
                                        <AccountNotVerified>
                                            <Translation id="TR_SELL_BANK_ACCOUNT_NOT_VERIFIED" />
                                        </AccountNotVerified>
                                    )}
                                </Option>
                            )}
                            isDisabled={bankAccounts.length < 2}
                        />
                    </SelectWrapper>
                </RowWrapper>
            </CardContent>
            <ButtonWrapper>
                <Button
                    minWidth={200}
                    isLoading={callInProgress}
                    onClick={() => {
                        if (bankAccount) confirmTrade(bankAccount);
                    }}
                    isDisabled={callInProgress || !bankAccount}
                >
                    <Translation id="TR_SELL_GO_TO_TRANSACTION" />
                </Button>
            </ButtonWrapper>
        </Wrapper>
    );
};
