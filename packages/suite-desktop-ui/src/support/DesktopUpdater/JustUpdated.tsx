import { useState, useCallback, useEffect } from 'react';

import { Column, Markdown, NewModal, Paragraph } from '@trezor/components';
import { spacings } from '@trezor/theme';

import { Translation } from 'src/components/suite';

import { Changelog } from './changelogComponents';

interface AvailableProps {
    onCancel: () => void;
}

export const JustUpdated = ({ onCancel }: AvailableProps) => {
    const [changelog, setChangelog] = useState<string | null>(null);

    const suiteCurrentVersion = process.env.VERSION || '';

    const getReleaseNotes = useCallback(async () => {
        const releaseNotesPath = process.env.ASSET_PREFIX + '/release-notes.md';
        const result = await (await fetch(releaseNotesPath)).text();
        setChangelog(result);
    }, []);

    useEffect(() => {
        getReleaseNotes();
    }, [getReleaseNotes]);

    return (
        <NewModal
            heading={
                <Paragraph typographyStyle="titleSmall" variant="primary">
                    <Translation
                        id="TR_VERSION_HAS_BEEN_RELEASED"
                        values={{ version: suiteCurrentVersion }}
                    />
                </Paragraph>
            }
            description={<Translation id="TR_UPDATE_MODAL_WHATS_NEW" />}
            onCancel={onCancel}
            bottomContent={
                <>
                    <NewModal.Button onClick={onCancel} variant="primary">
                        <Translation id="TR_GOT_IT" />
                    </NewModal.Button>
                </>
            }
        >
            <Column gap={spacings.xs} alignItems="start">
                <Changelog>
                    {changelog !== null ? (
                        <Markdown>{changelog}</Markdown>
                    ) : (
                        <Translation id="TR_COULD_NOT_RETRIEVE_CHANGELOG" />
                    )}
                </Changelog>
            </Column>
        </NewModal>
    );
};
