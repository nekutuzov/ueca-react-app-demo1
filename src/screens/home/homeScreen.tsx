import * as UECA from "ueca-react";
import { Button, Col, Markdown, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct, useRouteScreenBase } from "@components";
import { ScreenLayoutModel, useScreenLayout } from "@screens";
import uecaAppDiagram from "./ueca_app_diagram.svg";
import homeExplanationMd from "./homeExplanation.md?raw";

type HomeScreenStruct = RouteScreenBaseStruct<{
    children: {
        screenLayout: ScreenLayoutModel;
    };
}>;

type HomeScreenParams = RouteScreenBaseParams<HomeScreenStruct>;
type HomeScreenModel = RouteScreenBaseModel<HomeScreenStruct>;

function useHomeScreen(params?: HomeScreenParams): HomeScreenModel {
    const struct: HomeScreenStruct = {
        props: {
            id: useHomeScreen.name,
        },

        children: {
            screenLayout: useScreenLayout({
                breadcrumbs: [
                    { route: { path: "/home" }, label: "Home" },
                ],
                toolsView: (
                    <Button
                        contentView="Explain"
                        onClick={() => {
                            model.screenLayout.drawerPanel.titleView = "Architecture Explanation";
                            model.screenLayout.drawerPanel.contentView = <Markdown source={homeExplanationMd} />;
                            model.screenLayout.drawerPanel.open = true;
                        }}
                    />
                ),
                contentView: () => (
                    <Col fill horizontalAlign={"center"} overflow={"auto"}>
                        <img src={uecaAppDiagram} alt="UECA App Diagram" style={{ width: "60%", height: "auto" }} />
                    </Col>
                ),                
            })
        },

        View: () => <model.screenLayout.View />
    }

    const model = useRouteScreenBase(struct, params);
    return model;
}

const HomeScreen = UECA.getFC(useHomeScreen);

export { HomeScreenParams, HomeScreenModel, useHomeScreen, HomeScreen };
