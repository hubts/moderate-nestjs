import { tags } from "typia";

export namespace ValidationTag {
    export type Email = string & tags.Format<"email">;
    export type Password = string &
        tags.MinLength<8> &
        tags.MaxLength<32> &
        tags.Pattern<"^[a-zA-Z0-9]+$">;
    export type Nickname = string &
        tags.MinLength<2> &
        tags.MaxLength<10> &
        tags.Pattern<"^[a-zA-Z]+$">;
    export type UUID = string & tags.Format<"uuid">;
    export type PhoneNumber = string & tags.Pattern<"^010-[0-9]{4}-[0-9]{4}$">;
    export type Address = string & tags.Pattern<"^[a-zA-Z0-9가-힣]+$">;
    export type HexadecimalToken = string & tags.Pattern<"^[a-f0-9]+$">;
    export type Url = string & tags.Format<"uri">;
}
