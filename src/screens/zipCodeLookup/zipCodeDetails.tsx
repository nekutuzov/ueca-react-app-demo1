import * as UECA from "ueca-react";
import { Typography, Paper } from "@mui/material";
import { Col, Block, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { ZipCodeInfo } from "@api";
import { ValueDisplayModel, useValueDisplay } from "./valueDisplay";

// ZipCodeDetails Component (displays zip code information)
type ZipCodeDetailsStruct = UIBaseStruct<{
    props: {
        zipCode: string;
        details: ZipCodeInfo;
    };

    children: {
        postalCodeDisplay: ValueDisplayModel;
        stateDisplay: ValueDisplayModel;
        placeDisplay: ValueDisplayModel;
        latitudeDisplay: ValueDisplayModel;
        longitudeDisplay: ValueDisplayModel;
    };

    events: {
        onDataFetched?: (details: ZipCodeInfo) => void;
    };
}>;

type ZipCodeDetailsParams = UIBaseParams<ZipCodeDetailsStruct>;
type ZipCodeDetailsModel = UIBaseModel<ZipCodeDetailsStruct>;

function useZipCodeDetails(params?: ZipCodeDetailsParams): ZipCodeDetailsModel {
    const struct: ZipCodeDetailsStruct = {
        props: {
            id: useZipCodeDetails.name,
            zipCode: "",
            details: undefined,
        },

        children: {
            postalCodeDisplay: useValueDisplay({
                label: "Postal Code:",
                value: () => model.details?.postalCode,
            }),

            stateDisplay: useValueDisplay({
                label: "State:",
                value: () => model.details?.state,
            }),

            placeDisplay: useValueDisplay({
                label: "Place:",
                value: () => model.details?.placeName,
            }),

            latitudeDisplay: useValueDisplay({
                label: "Latitude:",
                value: () => model.details?.latitude,
                units: "°",
            }),

            longitudeDisplay: useValueDisplay({
                label: "Longitude:",
                value: () => model.details?.longitude,
                units: "°",
            }),
        },

        events: {
            // Automatic event - fires when zipCode property changes
            onChangeZipCode: async (newZipCode: string) => {
                if (newZipCode && newZipCode.length >= 5) {
                    try {
                        model.details = await model.bus.unicast("Tutorial.GetZipCodeDetails", { zipCode: newZipCode });
                        model.onDataFetched?.(model.details);
                    } catch (error) {
                        model.details = undefined;
                        console.error("Error fetching zip code details:", error);
                    }
                } else {
                    model.details = undefined;
                }
            },
        },

        View: () => (
            <Paper id={model.htmlId()} sx={{ p: 3 }} elevation={2}>
                <Typography variant="h6" gutterBottom>
                    US Zip Code Details
                </Typography>
                <Block padding={{ top: "medium" }}>
                    <Col spacing="small">
                        <model.postalCodeDisplay.View />
                        <model.stateDisplay.View />
                        <model.placeDisplay.View />
                        <model.latitudeDisplay.View />
                        <model.longitudeDisplay.View />
                    </Col>
                </Block>
            </Paper>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const ZipCodeDetails = UECA.getFC(useZipCodeDetails);

export { ZipCodeDetailsModel, ZipCodeDetailsParams, useZipCodeDetails, ZipCodeDetails };
