import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser"
import * as UECA from "ueca-react";
import { apiBaseUrl, User, Chart } from "@api";
import mockUsers from "./users.json";
import mockCharts from "./charts.json";

const handlers = [
    http.post(`${apiBaseUrl}/authorize`, async ({ request }) => {
        const credentials = await request.json() as { user, password };
        if (!credentials.user || !credentials.password) {
            return HttpResponse.json({ errorText: "Invalid email or password" }, { status: 401 });
        }
        return HttpResponse.json({ user: credentials.user, apiToken: "MOCK TOKEN" });
    }),

    http.get(`${apiBaseUrl}/users`, async () => {
        return HttpResponse.json(UECA.clone(mockUsers));
    }),

    http.get(`${apiBaseUrl}/users/:id`, async ({ params }) => {
        const user = mockUsers.find(u => u.id === params["id"]);
        return HttpResponse.json(UECA.clone(user));
    }),

    http.post(`${apiBaseUrl}/users/update`, async ({ request }) => {
        const updatedUser = await request.json() as User;
        const index = mockUsers.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            const users: User[] = mockUsers as [];
            users[index] = updatedUser;
        }
        return HttpResponse.json(updatedUser);
    }),

    http.post(`${apiBaseUrl}/users/create`, async ({ request }) => {
        const newUser = await request.json() as User;
        const createdUser = { ...UECA.clone(newUser), id: String(Date.now()) };
        const users: User[] = mockUsers as [];
        users.push(createdUser);
        return HttpResponse.json(createdUser);
    }),

    http.post(`${apiBaseUrl}/users/delete/:id`, async ({ params }) => {
        const index = mockUsers.findIndex(u => u.id === params["id"]);
        if (index !== -1) {
            (mockUsers as []).splice(index, 1);
        }
        return HttpResponse.json({ success: true });
    }),

    // Chart endpoints
    http.get(`${apiBaseUrl}/charts`, async () => {
        return HttpResponse.json(UECA.clone(mockCharts));
    }),

    http.get(`${apiBaseUrl}/charts/:id`, async ({ params }) => {
        const chart = mockCharts.find(c => c.id === params["id"]);
        return HttpResponse.json(UECA.clone(chart));
    }),

    http.post(`${apiBaseUrl}/charts/update`, async ({ request }) => {
        const updatedChart = await request.json() as Chart;
        const index = mockCharts.findIndex(c => c.id === updatedChart.id);
        if (index !== -1) {
            const charts: Chart[] = mockCharts as [];
            charts[index] = updatedChart;
        }
        return HttpResponse.json(updatedChart);
    }),

    http.post(`${apiBaseUrl}/charts/create`, async ({ request }) => {
        const newChart = await request.json() as Chart;
        const createdChart = { ...UECA.clone(newChart), id: String(Date.now()) };
        const charts: Chart[] = mockCharts as [];
        charts.push(createdChart);
        return HttpResponse.json(createdChart);
    }),

    http.post(`${apiBaseUrl}/charts/delete/:id`, async ({ params }) => {
        const index = mockCharts.findIndex(c => c.id === params["id"]);
        if (index !== -1) {
            (mockCharts as []).splice(index, 1);
        }
        return HttpResponse.json({ success: true });
    }),
];


export function initMocks() {
    // Initialize MSW worker by delaying the setup to avoid issues in the main thread during app startup
    setTimeout(async () => {
        const worker = setupWorker(...handlers);
        await worker.start({
            serviceWorker: {
                url: "/ueca-react-app/mockServiceWorker.js",
            },
            onUnhandledRequest: "bypass",
        })
    }, 10);
}
