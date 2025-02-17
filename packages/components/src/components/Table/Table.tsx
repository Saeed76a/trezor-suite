import { createContext, ReactNode, useContext } from 'react';

import styled from 'styled-components';

import { mapElevationToBackgroundToken, TypographyStyle } from '@trezor/theme';

import { FrameProps, FramePropsKeys, withFrameProps } from '../../utils/frameProps';
import { makePropsTransient, TransientProps } from '../../utils/transientProps';
import { TableHeader } from './TableHeader';
import { TableCell } from './TableCell';
import { TableRow } from './TableRow';
import { TableBody } from './TableBody';
import { useScrollShadow } from '../../utils/useScrollShadow';
import { useElevation } from '../ElevationContext/ElevationContext';
import { TextPropsKeys, TextProps } from '../typography/utils';

export const allowedTableFrameProps = ['margin'] as const satisfies FramePropsKeys[];
type AllowedFrameProps = Pick<FrameProps, (typeof allowedTableFrameProps)[number]>;

export const allowedTableTextProps = ['typographyStyle'] as const satisfies TextPropsKeys[];
type AllowedTextProps = Pick<TextProps, (typeof allowedTableTextProps)[number]>;

interface TableContextProps {
    isRowHighlightedOnHover: boolean;
    hasBorders: boolean;
    typographyStyle: TypographyStyle;
}

const TableContext = createContext<TableContextProps>({
    isRowHighlightedOnHover: false,
    hasBorders: true,
    typographyStyle: 'body',
});

export const useTable = () => useContext(TableContext);

const Container = styled.table<TransientProps<AllowedFrameProps>>`
    width: 100%;
    border-collapse: collapse;
    position: relative;

    ${withFrameProps}
`;

const ScrollContainer = styled.div`
    overflow: auto hidden;
    -webkit-overflow-scrolling: touch;
`;

export type TableProps = AllowedFrameProps &
    AllowedTextProps & {
        children: ReactNode;
        colWidths?: {
            minWidth?: string;
            maxWidth?: string;
            width?: string;
        }[];
        hasBorders?: boolean;
        isRowHighlightedOnHover?: boolean;
    };

export const Table = ({
    children,
    margin,
    colWidths,
    isRowHighlightedOnHover = false,
    hasBorders = true,
    typographyStyle = 'body',
}: TableProps) => {
    const { scrollElementRef, onScroll, ShadowContainer, ShadowRight } = useScrollShadow();
    const { parentElevation } = useElevation();

    return (
        <TableContext.Provider value={{ isRowHighlightedOnHover, hasBorders, typographyStyle }}>
            <ShadowContainer>
                <ScrollContainer onScroll={onScroll} ref={scrollElementRef}>
                    <Container {...makePropsTransient({ margin })}>
                        {colWidths && (
                            <colgroup>
                                {colWidths.map((widths, index) => (
                                    <col key={index} style={widths} />
                                ))}
                            </colgroup>
                        )}
                        {children}
                    </Container>
                </ScrollContainer>
                <ShadowRight
                    backgroundColor={mapElevationToBackgroundToken({ $elevation: parentElevation })}
                    style={{
                        borderRadius: '16px',
                    }}
                />
            </ShadowContainer>
        </TableContext.Provider>
    );
};

Table.Row = TableRow;
Table.Cell = TableCell;
Table.Header = TableHeader;
Table.Body = TableBody;
