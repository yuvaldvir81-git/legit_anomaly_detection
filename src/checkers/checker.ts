export interface Checker {
    name: String;
    payload: any;

    check(): boolean;
    getMessage(): String;
}