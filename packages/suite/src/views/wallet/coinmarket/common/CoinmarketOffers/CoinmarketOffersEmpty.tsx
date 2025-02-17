import { Card, Paragraph } from '@trezor/components';
import { spacings } from '@trezor/theme';

import { Translation } from 'src/components/suite';

export const CoinmarketOffersEmpty = () => (
    <Card margin={{ top: spacings.md }}>
        <Paragraph align="center" variant="tertiary">
            <Translation id="TR_COINMARKET_OFFERS_EMPTY" />
        </Paragraph>
    </Card>
);
