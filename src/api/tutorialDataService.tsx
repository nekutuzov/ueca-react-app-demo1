import * as UECA from "ueca-react";
import { ZipCodeInfo } from "@api";
import { TutorialDataServiceMessage } from "@core";

type TutorialDataServiceStruct = UECA.ComponentStruct<{}, TutorialDataServiceMessage>;

type TutorialDataServiceModel = UECA.ComponentModel<TutorialDataServiceStruct>;

function useTutorialDataService(): TutorialDataServiceModel {
    const struct: TutorialDataServiceStruct = {
        props: {
            id: useTutorialDataService.name,
        },

        messages: {
            "Tutorial.MakeJoke": async () => {
                try {
                    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
                    const data = await response.json();
                    return `${data.setup} ${data.punchline}`;
                } catch (error) {
                    console.error("Error fetching joke:", error);
                    return "What do you do when your Internet is flaky? Read the error in the console and try again. 😄";
                }
            },

            "Tutorial.GetZipCodeDetails": async ({ zipCode }) => {
                const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
                const data = await response.json();
                let result: ZipCodeInfo;
                if (data["places"].length > 0) {
                    result = {
                        postalCode: data["post code"],
                        state: data["places"][0]["state"],
                        placeName: data["places"][0]["place name"],
                        latitude: data["places"][0]["latitude"],
                        longitude: data["places"][0]["longitude"],
                    };
                }
                return result;
            },
        },
    }

    const model = UECA.useComponent(struct) as TutorialDataServiceModel;
    return model;
};

const TutorialDataService = UECA.getFC(useTutorialDataService);

export { TutorialDataServiceModel, useTutorialDataService, TutorialDataService };
