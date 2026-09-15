import * as UECA from "ueca-react";
import { BaseModel, BaseParams, BaseStruct, useBase } from "@components";

type FileSelectorStruct = BaseStruct<{
    methods: {
        select: (fileMask: string, multiselect?: boolean) => Promise<File[]>;
    }
}>;

type FileSelectorModel = BaseModel<FileSelectorStruct>;

function useFileSelector(params?: BaseParams<FileSelectorStruct>): FileSelectorModel {
    const struct: FileSelectorStruct = {
        props: {
            id: useFileSelector.name,
        },

        methods: {
            select: async (fileMask, multiselect) => {
                const files = await _selectFiles(fileMask, multiselect);
                return files?.length ? files : undefined;
            },
        },

        View: () => <input id={model.htmlId()} type={"file"} hidden />
    }

    const model = useBase(struct, params);
    return model;


    // Private methods
    async function _selectFiles(fileMask: string, multiselect: boolean): Promise<File[]> {
        const input = document.getElementById(model.htmlId()) as HTMLInputElement;
        if (!input) {
            throw Error(`DOM element id="${model.htmlId()}" not found`);
        }

        input.accept = fileMask;
        input.multiple = multiselect;
        // Reset, so choosing the same file as last time still fires "change".
        input.value = "";

        return new Promise<File[]>((resolve) => {
            let settled = false;

            // Every outcome settles the promise exactly once and removes all three listeners. The
            // cancel path used to watch document.body.onfocus, which never fires when the page
            // regains focus, so dismissing the picker left the caller waiting for ever.
            const settle = (files?: File[]) => {
                if (settled) {
                    return;
                }
                settled = true;
                input.removeEventListener("change", onChange);
                input.removeEventListener("cancel", onCancel);
                window.removeEventListener("focus", onFocusFallback);
                resolve(files);
            };

            const onChange = () => {
                const files: File[] = [];
                if (input.files) {
                    for (let i = 0; i < input.files.length; i++) {
                        files.push(input.files[i]);
                    }
                }
                settle(files.length ? files : undefined);
            };

            const onCancel = () => settle(undefined);

            // For browsers without the native "cancel" event: when the window regains focus after the
            // picker closes, give "change" a moment to win, then treat an empty selection as a cancel.
            const onFocusFallback = () => {
                setTimeout(() => {
                    if (!input.files?.length) {
                        settle(undefined);
                    }
                }, 300);
            };

            input.addEventListener("change", onChange, { once: true });
            input.addEventListener("cancel", onCancel, { once: true });
            window.addEventListener("focus", onFocusFallback, { once: true });

            input.click();
        });
    }
}

const FileSelector = UECA.getFC(useFileSelector);

export { FileSelectorModel, useFileSelector, FileSelector }
