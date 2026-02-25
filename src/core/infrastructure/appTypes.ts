import { AlertColor } from "@mui/material";

type UserContext = {
    user?: string;
    apiToken?: string;
}

type Intent = AlertColor;

type ZipCodeInfo = {
    postalCode: string;
    state: string;
    placeName: string;
    latitude: number;
    longitude: number;
};


export { UserContext, Intent, ZipCodeInfo }
