import { Card } from "./card";

export interface KlondikeMove {
    source: Card[];
    dest: Card[];
    sourceIndex: number;
}