import { useEffect, useState } from 'react';

import { Meta, StoryFn } from '@storybook/react';
import styled from 'styled-components';

import { VirtualizedList as VirtualizedListComponent } from './VirtualizedList';

const meta: Meta = {
    title: 'VirtualizedList',
} as Meta;
export default meta;

const Container = styled.div`
    display: initial;
    width: 100%;
`;

const Item = styled.div`
    border-bottom: solid 1px silver;
    width: 100%;
`;

const heights = [20, 40, 60];

const getData = (end: number) =>
    Array.from({ length: end }, (_, i) => ({
        id: i,
        content: <Item>content {i}</Item>,
        height: heights[Math.floor(Math.random() * heights.length)],
    }));

export const VirtualizedList: StoryFn = () => {
    const [end, setEnd] = useState(100000);
    const [data, setData] = useState(getData(end));

    useEffect(() => {
        // simulate async data loading
        setTimeout(() => {
            setData(getData(end));
        }, 100);
    }, [end]);

    return (
        <Container>
            <VirtualizedListComponent
                items={data}
                onScrollEnd={() => {
                    setEnd(end + 1000);
                }}
                listHeight={400}
                listMinHeight={180}
                renderItem={(_item: any, index: number) => <Item>content {index}</Item>}
            />
        </Container>
    );
};
