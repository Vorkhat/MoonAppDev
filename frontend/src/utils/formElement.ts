export enum FormElementType {
    Caption = 'caption',
    TextInput = 'textInput',
}

export type FormElementCaption = {
    text?: number;
}

export type FormElementTextInput = {
    label?: number;
    placeholder?: number;
    defaultValue?: number;
}

export type FormElement = {
                              type: FormElementType;
                              id: string;
                          } & (FormElementCaption | FormElementTextInput);