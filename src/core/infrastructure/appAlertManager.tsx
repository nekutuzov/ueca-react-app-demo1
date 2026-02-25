import * as UECA from "ueca-react";
import styled from "styled-components";
import { Col, AlertToast, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { Intent } from "@core";

// Alert Dialog component
type AppAlertManagerStruct = UIBaseStruct<{
    props: {
        contentView: React.ReactNode;
        _alerts: {
            message: React.ReactNode;
            intent: Intent,
            position: number;
            new: boolean;
        }[]
    };

    methods: {
        addAlert: (message: React.ReactNode, intent: Intent) => void;
        _alertView: () => UECA.ReactElement;
    },

    events: {
        onOpen: (source: AppAlertManagerModel) => UECA.MaybePromise;
        onClose: (source: AppAlertManagerModel) => UECA.MaybePromise;
    };
}>;

type AppAlertManagerParams = UIBaseParams<AppAlertManagerStruct>;
type AppAlertManagerModel = UIBaseModel<AppAlertManagerStruct>;

function useAppAlertManager(params?: AppAlertManagerParams): AppAlertManagerModel {
    const struct: AppAlertManagerStruct = {
        props: {
            id: useAppAlertManager.name,
            zIndex: 10000000,
            _alerts: []
        },

        messages: {
            "Alert.Success": async (p) => model.addAlert(p.message, "success"),
            "Alert.Information": async (p) => model.addAlert(p.message, "info"),
            "Alert.Warning": async (p) => model.addAlert(p.message, "warning"),
            "Alert.Error": async (p) => model.addAlert(p.message, "error")
        },

        methods: {
            addAlert: (message: React.ReactNode, intent) => {
                const lastAlert = model._alerts[model._alerts.length - 1];
                model._alerts.push({
                    message: message,
                    intent: intent,
                    position: lastAlert ? (lastAlert.position + 1) : 1,
                    new: true
                });
            },

            _alertView: () => {
                return <>
                    {
                        model._alerts.map((alert) => {
                            return <AlertToast
                                id={`alert${alert.position}`}
                                key={alert.position}
                                contentView={alert.message}
                                color={alert.intent}
                                open
                                transition={alert.new}
                                onOpen={() => { alert.new = false; }}
                                onClose={(m) => { model._alerts = model._alerts.filter(a => m.id != `alert${a.position}`); }}
                            />
                        })
                    }
                </>
            }
        },

        View: () => (
            <RightTopPanel id={model.htmlId()}
                zIndex={model.zIndex}
                verticalAlign={"bottom"}
            >
                <model._alertView />
            </RightTopPanel>
        )
    };

    const model = useUIBase(struct, params);
    return model;
}

const AlertToaster = UECA.getFC(useAppAlertManager);

const RightTopPanel = styled(Col)({
    position: "fixed",
    right: 48,
    top: 24,
});

export { AppAlertManagerParams, AppAlertManagerModel, useAppAlertManager, AlertToaster };
