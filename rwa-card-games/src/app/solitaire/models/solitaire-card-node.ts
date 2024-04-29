import { Card } from "../../core/models/card";
import { SolitaireDeck } from "./solitaire-deck";

export class CardNode {
    card: Card;
    prev: CardNode | null;
    next: CardNode | null;

    constructor(card: Card, prev: CardNode, next: CardNode) {
        this.card = card;
        this.prev = prev || null;
        this.next = next || null;
    }

    initializeCard(prev: CardNode, next: CardNode)
    {
        this.prev = prev;
        this.next = next;
    }

}