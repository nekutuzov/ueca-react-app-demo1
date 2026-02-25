import { useTheme } from "@mui/material";
import MarkdownPreview from "@uiw/react-markdown-preview";

const Markdown = (props: { source: string }) => {
    const theme = useTheme();
    const colorMode = theme.palette.mode;

    return <MarkdownPreview
        source={props.source}
        wrapperElement={{ "data-color-mode": colorMode }}
        style={{
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            '--color-canvas-default': theme.palette.background.paper,
            '--color-canvas-subtle': theme.palette.action.hover,
            '--color-fg-default': theme.palette.text.primary,
            '--color-fg-muted': theme.palette.text.secondary,
            '--color-border-default': theme.palette.divider,
            '--color-border-muted': theme.palette.divider,
        } as React.CSSProperties}
    />;
}

export { Markdown }
