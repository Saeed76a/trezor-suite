import { useMemo } from 'react';

import { messageSystemActions } from '@suite-common/message-system';
import { Message } from '@suite-common/suite-types';
import { Row, Banner as WarningComponent, Banner } from '@trezor/components';

import { goto } from 'src/actions/suite/routerActions';
import { useDispatch, useSelector } from 'src/hooks/suite';
import { getTorUrlIfAvailable } from 'src/utils/suite/tor';
import { selectLanguage, selectTorState } from 'src/reducers/suite/suiteReducer';

type MessageSystemBannerProps = {
    message: Message;
};

export const MessageSystemBanner = ({ message }: MessageSystemBannerProps) => {
    const { cta, variant, id, content, dismissible } = message;

    const { isTorEnabled } = useSelector(selectTorState);
    const language = useSelector(selectLanguage);
    const torOnionLinks = useSelector(state => state.suite.settings.torOnionLinks);
    const dispatch = useDispatch();

    const actionConfig = useMemo(() => {
        if (!cta) return undefined;

        const { action, label, link, anchor } = cta;

        let onClick: () => Window | Promise<void> | null;
        if (action === 'internal-link') {
            // @ts-expect-error: impossible to add all href options to the message system config json schema
            onClick = () => dispatch(goto(link, { anchor, preserveParams: true }));
        } else if (action === 'external-link') {
            onClick = () =>
                window.open(
                    isTorEnabled && torOnionLinks ? getTorUrlIfAvailable(link) : link,
                    '_blank',
                );
        }

        return {
            label: label[language] || label.en,
            onClick: onClick!,
            'data-testid': `@message-system/${id}/cta`,
        };
    }, [id, cta, dispatch, language, isTorEnabled, torOnionLinks]);

    const dismissalConfig = useMemo(() => {
        if (!dismissible) return undefined;

        return {
            onClick: () =>
                dispatch(messageSystemActions.dismissMessage({ id, category: 'banner' })),
            'data-testid': `@message-system/${id}/dismiss`,
        };
    }, [id, dismissible, dispatch]);

    return (
        <Banner
            icon
            variant={variant === 'critical' ? 'destructive' : variant}
            rightContent={
                <Row gap={8}>
                    {actionConfig && (
                        <Banner.Button
                            onClick={actionConfig.onClick}
                            data-testid={actionConfig['data-testid']}
                        >
                            {actionConfig.label}
                        </Banner.Button>
                    )}
                    {dismissalConfig && (
                        <WarningComponent.IconButton
                            icon="x"
                            onClick={dismissalConfig.onClick}
                            isSubtle
                            data-testid={dismissalConfig['data-testid']}
                        />
                    )}
                </Row>
            }
        >
            {content[language] || content.en}
        </Banner>
    );
};
