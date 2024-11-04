import { Injectable } from '@angular/core';
import { Card, CardNumber } from '../../models/solitaire/card';
import { SolitaireHints, SolitaireMove } from '../../models/solitaire/solitaire-hints';
import { SolitaireBoard } from '../../models/solitaire/solitaire-board';
import { EntityState } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class SolitaireHelperService {
  constructor() { }

  // returns an array of possible moves
  getHints(board: SolitaireBoard, cards: Card[]): SolitaireHints {
    let nextMoves: SolitaireMove[] = [];
    let cycleDeck: boolean = false;

    // nextMoves.push(...(this.lookForMove_TableauKingToEmpty(board.tableau)));
    nextMoves.push(...(this.#lookForMove_TableauMove(board.tableau, cards)));
    nextMoves.push(...(this.#lookForMove_TableauToFoundation(board.tableau, board.foundation, cards)));
    nextMoves.push(...(this.#lookForMove_FoundationToTableau(board.tableau, board.foundation, cards)));
    
    if (nextMoves.length < 1) {
      nextMoves.push(...(this.#lookForMove_DeckMove(board.tableau, board.foundation, board.deckStock, board.deckWaste, cards)));
    }

    if (nextMoves.length < 1) {
      cycleDeck = this.#lookForMove_CycleDeck(board.deckStock);
    }

    return {
      moves: nextMoves,
      cycleDeck: cycleDeck,
      hintIndex: -1,
      hintVisible: false
    } as SolitaireHints;
  }

  // check if a tableau move that uncovers new cards / moves cards from an empty field exists
  #lookForMove_TableauMove(tableau: number[][], cards: Card[]): SolitaireMove[] {
    let results: SolitaireMove[] = [];

    let maxIndex: number = -1;
    let restOfBoard: number[][] = [];
    let moveDestinations: number[][] = [];

    for (const tab of tableau) {
      maxIndex = this.#cardStack_find_maxMovableCardIndex(tab, cards);
      if (maxIndex < 0) continue;
      let card = cards.find(card => card.id === tab[maxIndex]);
      if (!card) continue;

      restOfBoard = tableau.filter(tabEl => tabEl !== tab);
      moveDestinations = this.#tableau_find_availableMoveDestinations(restOfBoard, card, maxIndex, cards);

      for (const d of moveDestinations) {
        // moves that uncover new cards have priority
        if (maxIndex !== 0) {
          results.unshift({source: tab, dest: d, sourceIndex: maxIndex} as SolitaireMove);
        } else {
          results.push({source: tab, dest: d, sourceIndex: maxIndex} as SolitaireMove); 
        }
      }
    }

    return results;
  }

  // check if cards can be moved to the foundation
  // moves that uncover hidden cards or free an entire tableau have priority
  #lookForMove_TableauToFoundation(tableau: number[][], foundation: number[][], cards: Card[]): SolitaireMove[] {
    let results: SolitaireMove[] = [];

    let tabs: number[][] = tableau.filter(tab => tab.length > 0);
    for (const tab of tabs) {
      const topCard = cards[tab.at(-1)!];
      const secondCard = (tab.length > 1)? cards[tab.at(-2)!] : undefined;

      if (!topCard) continue;
      const dest = foundation[topCard.suit];
      if (!this.#card_can_moveToFoundation(topCard, dest, cards)) continue;

      const move: SolitaireMove = {
        source: tab,
        dest: dest,
        sourceIndex: tab.length - 1
      };
      
      // uncovers hidden card
      if (tab.length > 1 && secondCard?.faceShown === false && secondCard?.movable === false) {
        results.unshift(move);
        continue;
      }
      
      // clears tableau stack
      if (tab.length === 1) { 
        results.unshift(move);
        continue;
      }
      
      results.push(move);
      }

    return results;
  }


  // check if a hidden card can be uncovered or a tableau stack freed in the next move, 
  // if a certain card from the foundation returns to the tableau in this move
  #lookForMove_FoundationToTableau(tableau: number[][], foundation: number[][], cards: Card[]): SolitaireMove[] {
    let results: SolitaireMove[] = [];

    let foundationCard: Card | undefined;
    let restOfTableau: number[][];

    let thisTurn_dests: number[][] = [];

    let nextTurn_topCardIndex: number;
    let nextTurn_topCard: Card | undefined;
    let nextTurn_moveCondition: boolean = false;

    for (let f of foundation) {
      if (f.length < 2) continue;
      foundationCard = cards.find(card => card.id === f.at(-1)!);
      if (!foundationCard) continue;


      const tabs = tableau.filter(tab => tab.length > 0);
      for (const tab of tabs) {
        nextTurn_topCardIndex = this.#cardStack_find_maxMovableCardIndex(tab, cards);
        if (nextTurn_topCardIndex < 0) continue;
        nextTurn_topCard = cards[tab.at(nextTurn_topCardIndex)!];
        if (!nextTurn_topCard) continue;

        nextTurn_moveCondition = (foundationCard.number - nextTurn_topCard!.number === 1 && foundationCard.color !== nextTurn_topCard!.color);
        if (!nextTurn_moveCondition) continue;

        restOfTableau = tableau.filter(t => t != tab);
        thisTurn_dests = this.#tableau_find_availableMoveDestinations(restOfTableau, foundationCard, f.length - 1, cards);
        if (thisTurn_dests.length < 1) continue;

        for (let dest of thisTurn_dests) {
          results.push({source: f, dest: dest, sourceIndex: f.length - 1} as SolitaireMove);
        }
      }
    }

    return results;
  }

  // if theres no tableau / foundation move - return available deck moves 
  #lookForMove_DeckMove(tableau: number[][], foundation: number[][], stock: number[], waste: number[], cards: Card[]): SolitaireMove[] {
    let results: SolitaireMove[] = [];

    let wasteCard: Card | undefined;
    let tableauDests: number[][] = [];
    let fDest: number[];

    if (waste.length > 0) {
      wasteCard = cards[waste.at(-1)!];
      if (!wasteCard) return results;

      // try tableau move first
      tableauDests = this.#tableau_find_availableMoveDestinations(tableau, wasteCard, waste.length - 1, cards);
      for (const dest of tableauDests) {
        results.push({source: waste, dest: dest, sourceIndex: waste.length - 1} as SolitaireMove);
      }

      // then try foundation move
      fDest = foundation[wasteCard.suit];
      if (this.#card_can_moveToFoundation(wasteCard, fDest, cards)) {
        results.push({source: waste, dest: fDest, sourceIndex: waste.length -1} as SolitaireMove);
      }
    }

    return results;
  }

  // if no moves are available go for deck cycle if theres still cards available
  #lookForMove_CycleDeck(stock: number[]) { 
    return (stock.length > 0)
  }

  #cardStack_find_maxMovableCardIndex(cardStack: number[], cards: Card[]) : number {
    if (cardStack.length <= 0) return -1;

    let maxIndex: number = cardStack.findIndex(cardId => {
      let card = cards.find(card => card.id === cardId);
      return card?.movable === true && card?.faceShown === true;
    });

    return maxIndex;
  }

  #tableau_find_availableMoveDestinations(restOfTableau: number[][], card: Card, cardIndex: number, cards: Card[]): number[][] {
    let result: number[][] = [];
    if (!card) return result;

    if (card.number === CardNumber.King) {
      if (cardIndex > 0) result = restOfTableau.filter(tab => tab.length === 0);
    } else {
      for (const tab of restOfTableau) {
        if (tab.length < 1) continue;
        const topCard = cards.find(card => card.id === tab.at(-1)!);
        if (!topCard) continue;
        if (topCard.number - card.number !== 1) continue;
        if (topCard.color === card.color) continue;
        if (topCard.faceShown === false) continue;
        if (topCard.movable === false) continue;
        result.push(tab);
      }
    }

    return result;
  }

  #card_can_moveToFoundation(card: Card | undefined, fDest: number[], cards: Card[]): boolean {
    const stackTop = cards.find(card => card.id === fDest.at(-1)!);
    if (!card) return false;
    
    // can drop ace
    if (fDest.length === 0 && card.number === CardNumber.Ace) return true;

    if (fDest.length === 0 || !stackTop) return false;

    // can drop regular card
    if (fDest.length > 0 && card.number - stackTop.number === 1) return true;

    return false;
  }
}
