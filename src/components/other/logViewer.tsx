import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import { Block, Row, ButtonModel, useButton, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

// LogViewer Component
type LogViewerStruct = UIBaseStruct<{
    props: {
        title: string;
        description: string;
        items: string[];
        emptyMessage: string;
        maxItems: number;
    };

    children: {
        clearButton: ButtonModel;
    };

    methods: {
        addItem: (item: string) => string;
        clear: () => void;
    };
}>;

type LogViewerParams = UIBaseParams<LogViewerStruct>;
type LogViewerModel = UIBaseModel<LogViewerStruct>;

function useLogViewer(params?: LogViewerParams): LogViewerModel {
    const struct: LogViewerStruct = {
        props: {
            id: useLogViewer.name,
            title: "Log",
            description: "Recent entries:",
            items: [],
            emptyMessage: "No entries yet.",
            maxItems: 10,
        },

        children: {
            clearButton: useButton({
                contentView: "Clear",
                color: "warning",
                size: "small",
                variant: "outlined",
                onClick: () => model.clear(),
            }),
        },

        methods: {
            addItem: (item: string) => {
                const timestamp = new Date().toLocaleTimeString();
                model.items.push(`[${timestamp}] ${item}`);
                // Keep only the last maxItems
                if (model.items.length > model.maxItems) {
                    model.items.shift();
                }
                return timestamp;
            },

            clear: () => {
                model.items = [];
            },
        },

        View: () => (
            <Block id={model.htmlId()}>
                <Row verticalAlign="center" padding={{ bottom: "small" }}>
                    <Typography variant="h6" gutterBottom>
                        {model.title}
                    </Typography>
                    <model.clearButton.View />
                </Row>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {model.description}
                </Typography>
                <Block sx={{
                    bgcolor: "background.paper",
                    p: 2,
                    borderRadius: 1,
                    minHeight: 150,
                    fontFamily: "monospace",
                    fontSize: "0.875rem"
                }}>
                    {model.items.length > 0 ? (
                        model.items.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary" fontStyle="italic">
                            {model.emptyMessage}
                        </Typography>
                    )}
                </Block>
            </Block>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const LogViewer = UECA.getFC(useLogViewer);

export { LogViewerParams, LogViewerModel, useLogViewer, LogViewer };
