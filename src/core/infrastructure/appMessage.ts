import * as UECA from "ueca-react";
import { User, Chart, ZipCodeInfo } from "@api";
import { AnyRoute } from "@components";
import { AppRoute, UserContext } from "@core";

// Application Messages: "message-type": { in: <parameter-type>, out: <parameter-type> }
// Properties "in" and "out" describe value type of input and output parameters. Both properties are optional.

type ApiMessage = {
    "Api.Authorize": { in: { user: string, password: string }, out: UserContext };
    "Api.GetUsers": { out: User[] };
    "Api.CreateUser": { in: User, out: User };
    "Api.GetUser": { in: { id: string }, out: User };
    "Api.UpdateUser": { in: User, out: User };
    "Api.DeleteUser": { in: { id: string } };

    "Api.GetCharts": { out: Chart[] };
    "Api.CreateChart": { in: Chart, out: Chart };
    "Api.GetChart": { in: { id: string }, out: Chart };
    "Api.UpdateChart": { in: Chart, out: Chart };
    "Api.DeleteChart": { in: { id: string } };
}

type DialogMessage = {
    "Dialog.Information": { in: { title?: string, message: string } };
    "Dialog.Warning": { in: { title?: string, message: string, details?: string } };
    "Dialog.Error": { in: { title?: string, message: string, details?: string } };
    "Dialog.Exception": { in: { title?: string, error: Error } };
    "Dialog.Confirmation": { in: { title?: string, message: string }, out: boolean };
    "Dialog.ActionConfirmation": { in: { title?: string, message: string, action: string }, out: boolean };
    "Alert.Information": { in: { message: React.ReactNode } };
    "Alert.Success": { in: { message: React.ReactNode } };
    "Alert.Error": { in: { message: React.ReactNode } };
    "Alert.Warning": { in: { message: React.ReactNode } };
}

type ScreenMessages = UECA.EmptyObject;

type MiscMessages = {
    "App.UnhandledException": { in: Error };

    "BusyDisplay.Set": { in: boolean };
    "BusyDisplay.Clear": NoParamsNoReturn;
    "BusyDisplay.SetVisibility": { in: boolean };

    "App.Theme.GetMode": { out: "light" | "dark" };
    "App.Theme.SetMode": { in: "light" | "dark" };

    "App.BrowsingHistory.GetActivePath": { out: string };
    "App.BrowsingHistory.Open": { in: { path: AnyRoute | string, newTab?: boolean } };
    "App.BrowsingHistory.Replace": { in: { path: AnyRoute | string } };
    "App.BrowsingHistory.OnNavigate": { in: string, out: boolean }

    "App.Router.GetRoute": { out: AppRoute };
    "App.Router.GoToRoute": { in: AppRoute; out: boolean };
    "App.Router.SetRoute": { in: AppRoute; out: boolean };
    "App.Router.SetRouteParams": { in: { params: Record<string, unknown>, patch: boolean } };
    "App.Router.BeforeRouteChange": { in: AppRoute, out: boolean };
    "App.Router.AfterRouteChange": { in: AppRoute };
    "App.Router.OpenNewTab": { in: AppRoute };

    "App.Security.IsAuthorized": { out: boolean };
    "App.Security.AuthorizeNative": { in: { user?: string, password?: string } };
    "App.Security.Unauthorize": NoParamsNoReturn;
    "App.Security.GetSecurityInfo": { out: { user: string; securityRules: string[] } };

    "App.GetInfo": { out: { appName: string, appVersion: string } };

    "App.SelectFiles": { in: { fileMask?: string; multiselect?: boolean }, out: File[] };

    "App.GetSideBarState": { out: { collapsed: boolean } };
    "App.SetSideBarState": { in: { collapsed: boolean } };
    "App.ToggleSideBarState": { out: { collapsed: boolean } };
    "App.SideBarStateChanged": { in: { collapsed: boolean } };

    // Add public messages directly in here or declare a separate message type
}

type TutorialDataServiceMessage = {
    "Tutorial.MakeJoke": { out: string };
    "Tutorial.GetZipCodeDetails": { in: { zipCode: string }; out: ZipCodeInfo };
}

type AppMessage =
    ApiMessage &
    DialogMessage &
    ScreenMessages &
    MiscMessages &
    TutorialDataServiceMessage;

type NoParamsNoReturn = UECA.EmptyObject;

export { AppMessage, ApiMessage, TutorialDataServiceMessage }
