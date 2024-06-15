import { Response } from "src/types/util/response.type";

export interface notCheckListType extends Response {
    data: {
        name: "string",
        stdId: "number",
        room: "string",
        checked: boolean
    }
}