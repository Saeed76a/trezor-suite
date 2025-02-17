export const uiVariants = [
    'default',
    'primary',
    'secondary',
    'tertiary',
    'info',
    'warning',
    'destructive',
    'disabled',
] as const;
export type UIVariant = (typeof uiVariants)[number];

export const uiSizes = ['huge', 'large', 'medium', 'small', 'tiny'] as const;
export type UISize = (typeof uiSizes)[number];

export const uiHorizontalAlignments = ['left', 'center', 'right'] as const;
export type UIHorizontalAlignment = (typeof uiHorizontalAlignments)[number];

export const uiVerticalAlignments = ['top', 'center', 'bottom'] as const;
export type UIVerticalAlignment = (typeof uiVerticalAlignments)[number];
