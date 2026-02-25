import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import {
    Col, Row, Block, ButtonModel, useButton, TextFieldModel, useTextField,
    UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase
} from "@components";
import { ZipCodeDetailsModel, useZipCodeDetails } from "./zipCodeDetails";
import { ZipCodeInfo } from "@api";

// AutoEventsPanel Component (demonstrates automatic event handling)
type AutoEventsPanelStruct = UIBaseStruct<{
    props: {
        zipCode: string;
    };

    children: {
        zipCodeInput: TextFieldModel;
        applyButton: ButtonModel;
        detailsPanel: ZipCodeDetailsModel;
    };

    events: {
        onActivityLog?: (action: string) => void;
    };
}>;

type AutoEventsPanelParams = UIBaseParams<AutoEventsPanelStruct>;
type AutoEventsPanelModel = UIBaseModel<AutoEventsPanelStruct>;

function useAutoEventsPanel(params?: AutoEventsPanelParams): AutoEventsPanelModel {
    const struct: AutoEventsPanelStruct = {
        props: {
            id: useAutoEventsPanel.name,
            zipCode: "",
        },

        children: {
            zipCodeInput: useTextField({
                labelView: "US Zip Code",
                placeholder: "Enter 5-digit zip code",
                type: "text",
                size: "small",
                // Validation: only allow numbers
                onChangingValue: (newVal: unknown, oldVal: unknown) => {
                    const newValue = String(newVal || "");
                    if (newValue === "" || /^\d+$/.test(newValue)) {
                        return newValue;
                    }
                    return oldVal;
                },
            }),

            applyButton: useButton({
                contentView: "Apply",
                variant: "contained",
                color: "primary",
                onClick: () => {
                    // Setting zipCode property triggers automatic onChangeZipCode event
                    model.zipCode = model.zipCodeInput.value as string;
                    model.onActivityLog?.(`Applied zip code: ${model.zipCode}`);
                },
            }),

            detailsPanel: useZipCodeDetails({
                zipCode: () => model.zipCode,
                onDataFetched: (details: ZipCodeInfo) => {
                    model.onActivityLog?.(`Fetched details for ${details.postalCode}: ${details.placeName}, ${details.state}`);
                },
            }),
        },

        events: {
            // Automatic event - fires when zipCode property changes
            onChangeZipCode: (newZipCode: string, oldZipCode: string) => {
                model.onActivityLog?.(`Property 'zipCode' changed from '${oldZipCode}' to '${newZipCode}'`);
            },

            onPropChange: (propName: string) => {
                model.onActivityLog?.(`Property '${propName}' changed`);
            }
        },

        init: () => {
            // Sync the input value with the zipCode property
            model.zipCodeInput.value = model.zipCode;
        },

        View: () => (
            <Col id={model.htmlId()} spacing="large" fill>
                <Block>
                    <Typography variant="subtitle1" gutterBottom>
                        Zip Code Lookup Example
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        Enter a US zip code and click Apply. Watch how the automatic onChange event triggers the data fetch.
                    </Typography>
                    <Row spacing="medium" verticalAlign="center">
                        <Block width={200}>
                            <model.zipCodeInput.View />
                        </Block>
                        <model.applyButton.View />
                    </Row>
                </Block>
                <model.detailsPanel.View />
            </Col>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const AutoEventsPanel = UECA.getFC(useAutoEventsPanel);

export { AutoEventsPanelModel, AutoEventsPanelParams, useAutoEventsPanel, AutoEventsPanel };
