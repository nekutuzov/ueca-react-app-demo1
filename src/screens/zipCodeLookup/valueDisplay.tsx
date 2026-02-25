import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import { Row, Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

// ValueDisplay Component (displays label/value pairs)
type ValueDisplayStruct = UIBaseStruct<{
    props: {
        label: string;
        value: any;
        units?: string;
    };

    events: {
        onValueRender?: (value: any) => React.ReactNode;
    };

    methods: {
        _renderValue: () => React.ReactNode;
    };
}>;

type ValueDisplayParams = UIBaseParams<ValueDisplayStruct>;
type ValueDisplayModel = UIBaseModel<ValueDisplayStruct>;

function useValueDisplay(params?: ValueDisplayParams): ValueDisplayModel {
    const struct: ValueDisplayStruct = {
        props: {
            id: useValueDisplay.name,
            label: "",
            value: undefined,
            units: undefined,
        },

        methods: {
            _renderValue: () => {
                if (model.onValueRender) {
                    return model.onValueRender(model.value);
                }
                return model.value?.toString() || "";
            },
        },

        View: () => (
            <Row id={model.htmlId()} spacing="small" verticalAlign="center">
                <Col width={120}>
                    <Typography variant="body2" color="textSecondary">
                        {model.label}
                    </Typography>
                </Col>
                <Col>
                    <Typography variant="body2">
                        {model._renderValue()}
                        {model.units && ` ${model.units}`}
                    </Typography>
                </Col>
            </Row>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const ValueDisplay = UECA.getFC(useValueDisplay);

export { ValueDisplayModel, ValueDisplayParams, useValueDisplay, ValueDisplay };
