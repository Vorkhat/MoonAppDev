export enum FormElementType {
    Caption = 'caption',
    TextInput = 'textInput',
    Radio = 'radio',
}

export type FormElementCaption = {
    text?: number;
    bold?: true;
}

export type FormElementTextInput = {
    label?: number;
    placeholder?: number;
    defaultValue?: number;
}

export type FormElementRadio = {
    options?: { name: string; value: number }[];
    defaultValue?: number;
}

export type FormElementContent = FormElementCaption | FormElementTextInput | FormElementRadio;

export type FormElement = {
                              type: FormElementType;
                              id: string;
                          } & FormElementContent;