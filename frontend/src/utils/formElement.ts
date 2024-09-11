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

export type FormElementContent = FormElementCaption | FormElementTextInput;

export type FormElement = {
                              type: FormElementType;
                              id: string;
                          } & FormElementContent;