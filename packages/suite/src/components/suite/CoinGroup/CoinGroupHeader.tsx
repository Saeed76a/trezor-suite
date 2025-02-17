import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

import { Icon, variables } from '@trezor/components';

import { Translation } from 'src/components/suite';

const Wrapper = styled.div`
    align-self: flex-start;
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    @media (hover: hover) {
        display: none;
    }
`;

const SettingsWrapper = styled.div<{ $disabled: boolean }>`
    border-radius: 100%;
    margin: -10px -10px -10px auto;
    padding: 10px;
    transition: 0.3s ease;
    cursor: pointer;

    ${props =>
        props.$disabled &&
        css`
            visibility: hidden;
        `}
    &:hover {
        background-color: ${({ theme }) =>
            transparentize(
                theme.legacy.HOVER_TRANSPARENTIZE_FILTER,
                theme.legacy.HOVER_PRIMER_COLOR,
            )};
    }
`;

interface CoinGroupHeaderProps {
    isAtLeastOneActive: boolean;
    settingsMode: boolean;
    toggleSettingsMode?: () => void;
}

export const CoinGroupHeader = ({
    isAtLeastOneActive,
    settingsMode,
    toggleSettingsMode,
}: CoinGroupHeaderProps) => (
    <Wrapper>
        {settingsMode && <Translation id="TR_SELECT_COIN_FOR_SETTINGS" />}
        <SettingsWrapper onClick={toggleSettingsMode} $disabled={!isAtLeastOneActive}>
            <Icon name={settingsMode ? 'close' : 'settings'} />
        </SettingsWrapper>
    </Wrapper>
);
