import { ReactNode } from 'react';

import { Button, ButtonProps } from '@trezor/components';
import { Url } from '@trezor/urls';

import { Translation } from 'src/components/suite';

import { useExternalLink } from '../../hooks/suite';

interface LearnMoreButtonProps extends Omit<ButtonProps, 'children'> {
    url: Url;
    children?: ReactNode;
    textWrap?: boolean;
}

export const LearnMoreButton = ({
    children,
    className,
    size = 'tiny',
    url,
    textWrap,
    ...buttonProps
}: LearnMoreButtonProps) => (
    <Button
        href={useExternalLink(url)}
        textWrap={textWrap}
        variant="tertiary"
        size={size}
        icon="arrowUpRight"
        iconAlignment="right"
        className={className}
        {...buttonProps}
    >
        {children || <Translation id="TR_LEARN_MORE" />}
    </Button>
);
