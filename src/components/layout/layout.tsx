import * as UECA from "ueca-react";
import { Box, Divider, Stack, StackProps, ThemeProvider, useTheme } from "@mui/material";
import React from "react";

type Palette =
    "primary.main" | "primary.light" | "primary.dark" |
    "secondary.main" | "secondary.light" | "secondary.dark" |
    "error.main" | "error.light" | "error.dark" |
    "warning.main" | "warning.light" | "warning.dark" |
    "info.main" | "info.light" | "info.dark" |
    "success.main" | "success.light" | "success.dark" |
    "text.primary" | "text.secondary" | "text.disabled" |
    "background.paper" | "background.default" |
    "action.active" | "action.hover" | "action.selected" | "action.disabled" | "action.disabledBackground" | "action.focus" |
    (string & {});

type Spacing = keyof typeof spacingMap;

type PaddingSize = keyof typeof paddingSizeMap;

type Padding = {
    top?: PaddingSize;
    right?: PaddingSize;
    bottom?: PaddingSize;
    left?: PaddingSize;
} | {
    topBottom?: PaddingSize;
    leftRight?: PaddingSize;
} | PaddingSize;

type BlockHorizontalAlign = keyof typeof blockHorizontalAlignMap;

type BlockProps = {
    id?: string;
    key?: string | number;
    ref?: React.Ref<HTMLDivElement>;
    render?: boolean;
    children?: React.ReactNode;
    className?: string;
    sx?: StackProps["sx"];
    fill?: boolean;
    zIndex?: StackProps["zIndex"];
    width?: StackProps["width"];
    height?: StackProps["height"];
    padding?: Padding;
    backgroundColor?: Palette;
    overflow?: StackProps["overflow"];
    horizontalAlign?: BlockHorizontalAlign;
    role?: "editor" | "main-editor" | "context-editor";
    // Events
    onClick?: StackProps["onClick"];
    onMouseEnter?: StackProps["onMouseEnter"];
    onMouseLeave?: StackProps["onMouseLeave"];
};

type FlexProps = BlockProps & {
    reverseItems?: boolean;
    spacing?: Spacing;
    divider?: boolean;
};

type RowHorizontalAlign = keyof typeof rowHorizontalAlignMap;
type RowVerticalAlign = keyof typeof rowVerticalAlignMap;

type RowProps = Omit<FlexProps, "horizontalAlign"> & {
    horizontalAlign?: RowHorizontalAlign;
    verticalAlign?: RowVerticalAlign;
};

type ColHorizontalAlign = keyof typeof colHorizontalAlignMap;
type ColVerticalAlign = keyof typeof colVerticalAlignMap;

type ColProps = Omit<FlexProps, "horizontalAlign"> & {
    horizontalAlign?: ColHorizontalAlign;
    verticalAlign?: ColVerticalAlign;
};

// Block component
function Block(props: BlockProps): UECA.ReactElement {
    props = useThemeRole(props);
    if (props?.render === false) return null;
    return (
        <Box
            id={props?.id}
            key={props?.key}
            ref={props?.ref}
            className={props?.className}
            children={props?.children}
            textAlign={blockHorizontalAlignMap[props?.horizontalAlign ?? "left"]}
            width={props?.width}
            height={props?.height}
            zIndex={props?.zIndex}
            overflow={props?.overflow ?? "auto"}
            onClick={props?.onClick}
            onMouseEnter={props?.onMouseEnter}
            onMouseLeave={props?.onMouseLeave}
            sx={props?.sx}
        />
    );
}

// Row component
function Row(props: RowProps): UECA.ReactElement {
    props = useThemeRole(props);
    if (props?.render === false) return null;
    return (
        <Stack
            direction={props?.reverseItems ? "row-reverse" : "row"}
            id={props?.id}
            key={props?.key}
            ref={props?.ref}
            className={props?.className}
            children={props?.children}
            justifyContent={props?.reverseItems ? rowReverseHorizontalAlignMap[props?.horizontalAlign ?? "left"] : rowHorizontalAlignMap[props?.horizontalAlign ?? "left"]}
            alignItems={rowVerticalAlignMap[props?.verticalAlign]}
            spacing={spacingMap[props?.spacing ?? "default"]}
            divider={props?.divider ? <Divider orientation={"vertical"} flexItem /> : undefined}
            width={props?.width}
            height={props?.height}
            zIndex={props?.zIndex}
            overflow={props?.overflow ?? "hidden"}
            onClick={props?.onClick}
            onMouseEnter={props?.onMouseEnter}
            onMouseLeave={props?.onMouseLeave}
            sx={props?.sx}
        />
    );
};

// Col component
function Col(props: ColProps): UECA.ReactElement {
    props = useThemeRole(props);
    if (props?.render === false) return null;
    return (
        <Stack
            direction={props?.reverseItems ? "column-reverse" : "column"}
            id={props?.id}
            key={props?.key}
            ref={props?.ref}
            className={props?.className}
            children={props?.children}
            alignItems={colHorizontalAlignMap[props?.horizontalAlign]}
            justifyContent={props?.reverseItems ? colReverseVerticalAlignMap[props?.verticalAlign ?? "top"] : colVerticalAlignMap[props?.verticalAlign ?? "top"]}
            spacing={spacingMap[props?.spacing ?? "default"]}
            divider={props?.divider ? <Divider orientation={"horizontal"} flexItem /> : undefined}
            width={props?.width}
            height={props?.height}
            zIndex={props?.zIndex}
            overflow={props?.overflow ?? "hidden"}
            onClick={props?.onClick}
            onMouseEnter={props?.onMouseEnter}
            onMouseLeave={props?.onMouseLeave}
            sx={props?.sx}
        />
    );
};

// Themed component
function useThemeRole<T extends BlockProps | RowProps | ColProps>(props: T)
    : T {
    const theme = useTheme();

    if (props?.render === false) return props;

    const roleConfig = theme.role[props.role];

    const sx: BlockProps["sx"] = {
        flex: props.fill ? 1 : undefined,

        bgcolor: props.backgroundColor,
        fontSize: roleConfig?.fontSize.base,

        '& .MuiInputBase-root': { fontSize: 'var(--role-font-input)' },
        '& .MuiInputLabel-root': { fontSize: 'var(--role-font-label)' },
        '& .MuiFormControlLabel-root': { fontSize: 'var(--role-font-label)' },
        '& .MuiFormControlLabel-label': { fontSize: 'var(--role-font-label)' },
        '& .MuiMenuItem-root': { fontSize: 'var(--role-font-input)' },
        '& .MuiRadio-root': { fontSize: 'var(--role-font-input)' },
        '& .MuiSelect-select': { fontSize: 'var(--role-font-input)' },

        ...paddingMap(props.padding),
        ...props.sx
    };

    // Only wrap in ThemeProvider if role is defined and has config
    const children = roleConfig ? (
        <ThemeProvider
            theme={(outerTheme) => ({
                ...outerTheme,
                components: {
                    // ...outerTheme.components,
                    MuiTextField: {
                        defaultProps: { size: roleConfig?.componentSize },
                    },
                    MuiCheckbox: {
                        defaultProps: { size: roleConfig?.componentSize },
                    },
                    MuiSwitch: {
                        defaultProps: { size: roleConfig?.componentSize },
                    },
                    MuiSelect: {
                        defaultProps: { size: roleConfig?.componentSize },
                    },
                    MuiButton: {
                        defaultProps: { size: roleConfig?.componentSize },
                    }
                },
            })}
        >
            {props.children}
        </ThemeProvider>
    ) : props.children;

    return {
        ...props,
        children: children,
        sx: sx
    };
}


// Maps for spacing and alignment
const spacingMap = {
    none: 0,
    tiny: 0.5,
    default: 1,
    small: 2,
    medium: 3,
    large: 4,
    huge: 8,
    massive: 12,
} as const

const paddingSizeMap = {
    none: 0,
    tiny: 0.5,
    default: 1,
    small: 2,
    medium: 3,
    large: 4,
    huge: 8,
    massive: 12,
} as const;

const blockHorizontalAlignMap = {
    left: "left",
    right: "right",
    center: "center",
} as const;


const rowHorizontalAlignMap = {
    left: "flex-start",
    right: "flex-end",
    center: "center",
    spaceBetween: "space-between",
    spaceAround: "space-around",
    spaceEvenly: "space-evenly",
} as const;

const rowReverseHorizontalAlignMap = {
    ...rowHorizontalAlignMap,
    left: "flex-end",
    right: "flex-start",
} as const;

const rowVerticalAlignMap = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
} as const;

const colHorizontalAlignMap = {
    left: "flex-start",
    right: "flex-end",
    center: "center",
    stretch: "stretch",
} as const;

const colVerticalAlignMap = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
    spaceBetween: "space-between",
    spaceAround: "space-around",
    spaceEvenly: "space-evenly",
} as const;

const colReverseVerticalAlignMap = {
    ...colVerticalAlignMap,
    top: "flex-end",
    bottom: "flex-start",
} as const;

// Function to map padding prop to MUI Box props
function paddingMap(padding?: Padding): { p?: number; pt?: number; pr?: number; pb?: number; pl?: number; } {
    if (!padding) {
        return {};
    }

    if (typeof padding === "string") {
        return { p: paddingSizeMap[padding] };
    }

    const paddingValues: ReturnType<typeof paddingMap> = {}

    if ("topBottom" in padding && padding.topBottom) {
        paddingValues.pt = paddingSizeMap[padding.topBottom];
        paddingValues.pb = paddingSizeMap[padding.topBottom];
    }

    if ("leftRight" in padding && padding.leftRight) {
        paddingValues.pl = paddingSizeMap[padding.leftRight];
        paddingValues.pr = paddingSizeMap[padding.leftRight];
    }

    if ("left" in padding && padding.left) {
        paddingValues.pl = paddingSizeMap[padding.left];
    }
    if ("right" in padding && padding.right) {
        paddingValues.pr = paddingSizeMap[padding.right];
    }
    if ("top" in padding && padding.top) {
        paddingValues.pt = paddingSizeMap[padding.top];
    }
    if ("bottom" in padding && padding.bottom) {
        paddingValues.pb = paddingSizeMap[padding.bottom];
    }

    return paddingValues;
}

export { BlockProps, RowProps, ColProps, Block, Row, Col };
