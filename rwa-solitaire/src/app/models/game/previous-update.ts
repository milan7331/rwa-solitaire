import { Card } from "./card";
import { Update } from "@ngrx/entity";

export interface PreviousUpdate {
    moveNumber: number,
    cardUpdate: Update<Card>
}
