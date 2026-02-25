import * as UECA from "ueca-react";
import { Card as MUICard, CardContent, Typography, styled, CardProps } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";

type CardStruct = MuiBaseStruct<{
    props: {
        titleView: React.ReactNode;
        bodyView: React.ReactNode;
        subtitleView: React.ReactNode;
        clickable: boolean;
    };

    events: {
        onClick: () => void;
    };
}, CardProps>;

type CardParams = MuiBaseParams<CardStruct, CardProps>;
type CardModel = MuiBaseModel<CardStruct, CardProps>;

function useCard(params?: CardParams): CardModel {
    const struct: CardStruct = {
        props: {
            id: useCard.name,
            titleView: undefined,
            bodyView: undefined,
            subtitleView: undefined,
            clickable: false,
        },

        View: () => {
            const CardComponent = model.clickable ? StyledCard : MUICard;

            return (
                <CardComponent
                    id={model.htmlId()}
                    onClick={model.clickable ? model.onClick : undefined}
                    sx={{
                        minWidth: 275,
                        cursor: model.clickable ? "pointer" : "default",
                    }}
                    {...model.mui}
                >
                    <CardContent>
                        {model.titleView && (
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {model.titleView}
                            </Typography>
                        )}
                        {model.bodyView && (
                            <Typography variant="h5" component="div">
                                {model.bodyView}
                            </Typography>
                        )}
                        {model.subtitleView && (
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {model.subtitleView}
                            </Typography>
                        )}
                    </CardContent>
                </CardComponent>
            );
        }
    };

    const model = useMuiBase(struct, params);
    return model;
}

const Card = UECA.getFC(useCard);

const StyledCard = styled(MUICard)(({ theme }) => ({
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows[4],
    },
}));

export { CardModel, useCard, Card };
