import React, { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Box, VStack, Button, Text } from '@suite-native/atoms';
import { Translation } from '@suite-native/intl';

import { AddressMismatchBottomSheet } from './AddressMismatchBottomSheet';

export const UnverifiedAddressDeviceHint = () => {
    const [isBottomSheetOpened, setIsBottomSheetOpened] = useState(false);

    const handlePress = () => {
        setIsBottomSheetOpened(true);
    };

    const handleCloseBottomSheet = () => {
        setIsBottomSheetOpened(false);
    };

    return (
        <Animated.View entering={FadeIn}>
            <VStack spacing="sp16">
                <Text variant="hint" color="textSubdued" textAlign="center">
                    <Translation id="moduleReceive.receiveAddressCard.deviceHint.description" />
                </Text>
                <Box flexDirection="row" flexShrink={1} justifyContent="center">
                    <Button size="small" colorScheme="tertiaryElevation1" onPress={handlePress}>
                        <Translation id="moduleReceive.bottomSheets.addressMismatch.title" />
                    </Button>
                </Box>
            </VStack>
            <AddressMismatchBottomSheet
                isOpened={isBottomSheetOpened}
                onClose={handleCloseBottomSheet}
            />
        </Animated.View>
    );
};
