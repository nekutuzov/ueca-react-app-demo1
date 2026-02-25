import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import { Block, ButtonModel, UIBaseModel, UIBaseParams, UIBaseStruct, useButton, useUIBase } from "@components";

type JokerStruct = UIBaseStruct<
    {
        props: {
            jokeText: string;
        };

        children: {
            button: ButtonModel;
        };

        events: {
            onMessageBusInteraction: (action: string) => void; //For demonstration purposes, we use an event to log message bus interactions in the parent component.
        };
    }
>;

type JokerParams = UIBaseParams<JokerStruct>;
type JokerModel = UIBaseModel<JokerStruct>;

function useJoker(params?: JokerParams): JokerModel {
    const struct: JokerStruct = {
        props: {
            id: useJoker.name,
            jokeText: "",
        },

        children: {
            button: useButton({
                contentView: "Get a Joke",
                variant: "outlined",
                color: "secondary",
                onClick: async () => {
                    // Post a message to common Message Bus and retrieve an answer.
                    model.jokeText = "Please wait...";
                    model.onMessageBusInteraction?.("Requested a joke from message bus");
                    model.jokeText = await model.bus.unicast("Tutorial.MakeJoke", undefined);
                },
            }),
        },

        View: () => (
            <Block id={model.htmlId()} padding={{ top: "small" }}>
                <model.button.View />
                {model.jokeText && (
                    <Block sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                        <Typography variant="body2" color="success">
                            {model.jokeText}
                        </Typography>
                    </Block>
                )}
            </Block>
        ),
    };

    const model: JokerModel = useUIBase(struct, params);
    return model;
}

const Joker = UECA.getFC(useJoker);

export { JokerModel, useJoker, Joker };
