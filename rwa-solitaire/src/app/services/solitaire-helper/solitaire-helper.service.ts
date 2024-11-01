import { Injectable } from '@angular/core';
import { Card, CardNumber } from '../../models/solitaire/card';
import { SolitaireMove } from '../../models/solitaire/solitaire-move';
import { SolitaireHints } from '../../models/solitaire/solitaire-hints';
import { SolitaireBoard } from '../../models/solitaire/solitaire-board';

@Injectable({
  providedIn: 'root'
})
export class SolitaireHelperService {

  constructor() { }


  // // returns an array of possible moves
  // public getHints(board: SolitaireBoard): SolitaireHints {
  //   let nextMoves: SolitaireMove[] = [];

  //   // nextMoves.push(...(this.lookForMove_TableauKingToEmpty(board.tableau)));
  //   nextMoves.push(...(this.lookForMove_TableauMove(board.tableau)));
  //   nextMoves.push(...(this.lookForMove_TableauToFoundation(board.tableau, board.foundation)));
  //   nextMoves.push(...(this.lookForMove_FoundationToTableau(board.tableau, board.foundation)));
    
  //   if (nextMoves.length < 1) {
  //     console.log("now using waste / deck cards.");
  //     return this.lookForMove_DeckMove(board.tableau, board.foundation, board.deckStock, board.deckWaste);
  //   }

  //   return ({moves: nextMoves, cycleDeck: false} as SolitaireHints);
  // }

  // public lookForGameEndCondition(board: SolitaireBoard): boolean {
  //   if (board.deckWaste.length > 0) return false;
  //   if (board.deckStock.length > 0) return false;
  //   for (let tab of board.tableau) {
  //     if (tab.length > 0) return false;
  //   }
  //   for (let f of board.foundation) {
  //     if (f.length != 13) return false;
  //   }

  //   return true;
  // }


  // // check if a king from the tableau can be moved to an empty field if hes not already on one
  // private lookForMove_TableauKingToEmpty(tableau: Card[][]): SolitaireMove[] {
  //   let results: SolitaireMove[] = [];

  //   let maxIndex: number  = -1;
  //   const emptyTab: Card[] | undefined = tableau.find(tab => tab.length === 0);

  //   if (!emptyTab) return results;

  //   for (const tab of tableau.filter(tab => tab.length > 0)) {
  //     maxIndex = this.cardStack_find_maxMovableCardIndex(tab);
  //     if (maxIndex > 0 && tab[maxIndex].number === CardNumber.King) {
  //       results.push({source: tab, dest: emptyTab, sourceIndex: maxIndex} as SolitaireMove);
  //     }
  //   }

  //   return results;
  // }

  // // check if a tableau move that uncovers new cards / moves cards from an empty field exists
  // private lookForMove_TableauMove(tableau: Card[][]): SolitaireMove[] {
  //   let results: SolitaireMove[] = [];

  //   let maxIndex: number = -1;
  //   let restOfBoard: Card[][] = [];
  //   let moveDestinations: Card[][] = [];

  //   for (const tab of tableau) {
  //     maxIndex = this.cardStack_find_maxMovableCardIndex(tab);
  //     if (maxIndex < 0) continue;

  //     restOfBoard = tableau.filter(tabEl => tabEl !== tab);
  //     moveDestinations = this.tableau_find_availableMoveDestinations(restOfBoard, tab.at(maxIndex)!, maxIndex);

  //     for (const d of moveDestinations) {
  //       // moves that uncover new cards have priority
  //       if (maxIndex !== 0) {
  //         results.unshift({source: tab, dest: d, sourceIndex: maxIndex} as SolitaireMove);
  //       } else {
  //         results.push({source: tab, dest: d, sourceIndex: maxIndex} as SolitaireMove); 
  //       }
  //     }
  //   }

  //   return results;
  // }

  // // check if cards can be moved to the foundation
  // // moves that uncover hidden cards or free an entire tableau have priority
  // private lookForMove_TableauToFoundation(tableau: Card[][], foundation: Card[][]): SolitaireMove[] {
  //   let results: SolitaireMove[] = [];

  //   let topCard: Card;
  //   let dest: Card[];

  //   let canMove: boolean = false;
  //   let clearsTableauStack: boolean = false;
  //   let uncoversHiddenCard: boolean = false;

  //   let tabs: Card[][] = tableau.filter(tab => tab.length > 0);
  //   for (const tab of tabs) {
  //     topCard = tab.at(-1)!;
  //     dest = foundation[topCard.suit];

  //     canMove = this.card_can_moveToFoundation(topCard, dest);
  //     if (!canMove) continue;
      
  //     uncoversHiddenCard = tab.length > 1 && tab.at(-2)!.faceShown === false && tab.at(-2)!.movable === false;
  //     clearsTableauStack = tab.length === 1;
      
  //     if (uncoversHiddenCard || clearsTableauStack) {
  //       results.unshift({source: tab, dest: dest, sourceIndex: tab.length - 1} as SolitaireMove);
  //     } else {
  //       results.push({source: tab, dest: dest, sourceIndex: tab.length - 1} as SolitaireMove);
  //     }
    
  //   }

  //   return results;
  // }


  // // check if a hidden card can be uncovered or a tableau stack freed in the next move, 
  // // if a certain card from the foundation returns to the tableau in this move
  // private lookForMove_FoundationToTableau(tableau: Card[][], foundation: Card[][]): SolitaireMove[] {
  //   let results: SolitaireMove[] = [];

  //   let foundationCard: Card;
  //   let restOfTableau: Card[][];

  //   let thisTurn_dests: Card[][] = [];

  //   let nextTurn_topCardIndex: number;
  //   let nextTurn_topCard: Card;
  //   let nextTurn_moveCondition: boolean = false;

  //   for (let f of foundation) {
  //     if (f.length < 1) continue;
  //     foundationCard = f.at(-1)!;

  //     const tabs = tableau.filter(tab => tab.length > 0);
  //     for (const tab of tabs) {
  //       nextTurn_topCardIndex = this.cardStack_find_maxMovableCardIndex(tab);
  //       if (nextTurn_topCardIndex < 0) continue;
  //       nextTurn_topCard = tab.at(nextTurn_topCardIndex)!;

  //       nextTurn_moveCondition = (foundationCard.number - nextTurn_topCard!.number === 1 && foundationCard.color !== nextTurn_topCard!.color);
  //       if (!nextTurn_moveCondition) continue;

  //       restOfTableau = tableau.filter(t => t != tab);
  //       thisTurn_dests = this.tableau_find_availableMoveDestinations(restOfTableau, foundationCard, f.length - 1);
  //       if (thisTurn_dests.length < 1) continue;

  //       for (let dest of thisTurn_dests) {
  //         results.push({source: f, dest: dest, sourceIndex: f.length - 1} as SolitaireMove);
  //       }
  //     }
  //   }

  //   return results;
  // }

  // // if theres no move - return cycle deck else return available moves
  // private lookForMove_DeckMove(tableau: Card[][], foundation: Card[][], stock: Card[], waste: Card[]): SolitaireHints {
  //   let results: SolitaireMove[] = [];
  //   let cycleDeck: boolean = false;

  //   let wasteCard: Card;
  //   let tableauDests: Card[][] = [];
  //   let fDest: Card[];

  //   if (waste.length > 0) {
  //     wasteCard = waste.at(-1)!;

  //     // try tableau move first
  //     tableauDests = this.tableau_find_availableMoveDestinations(tableau, wasteCard, waste.length - 1);
  //     for (const dest of tableauDests) {
  //       results.push({source: waste, dest: dest, sourceIndex: waste.length - 1} as SolitaireMove);
  //     }

  //     // then try foundation move
  //     fDest = foundation[wasteCard.suit];
  //     if (this.card_can_moveToFoundation(wasteCard, fDest)) {
  //       results.push({source: waste, dest: fDest, sourceIndex: waste.length -1} as SolitaireMove);
  //     }
  //   }
    
  //   // if no moves are available go for deck cycle if theres still cards available
  //   if (results.length < 1 && stock.length > 0) cycleDeck = true;

  //   return ({moves: results, cycleDeck: cycleDeck} as SolitaireHints);
  // }

  // private cardStack_find_maxMovableCardIndex(cardStack: Card[]) : number {
  //   if (cardStack.length <= 0) return -1;

  //   let maxIndex: number = cardStack.findIndex(card => card.movable === true && card.faceShown === true);

  //   return maxIndex;
  // }

  // private tableau_find_availableMoveDestinations(restOfTableau: Card[][], card: Card, cardIndex: number): Card[][] {
  //   let result: Card[][] = [];

  //   if (card.number === CardNumber.King)  {
  //     if (cardIndex > 0) result = restOfTableau.filter(tab => tab.length === 0);
  //   } else {
  //     for (const tab of restOfTableau) {
  //       if (tab.length < 1) continue;
  //       if (tab.at(-1)!.number - card.number !== 1) continue;
  //       if (tab.at(-1)!.color === card.color) continue;
  //       if (tab.at(-1)!.faceShown === false) continue;
  //       if (tab.at(-1)!.movable === false) continue;
  //       result.push(tab);
  //     }
  //   }

  //   return result;
  // }

  // private card_can_moveToFoundation(card: Card, fDest: Card[]): boolean {
  //   const canMoveAce = fDest.length === 0 && card.number === CardNumber.Ace;
  //   const canMoveRegular = fDest.length > 0 && card.number - fDest.at(-1)!.number === 1;

  //   if (canMoveAce  || canMoveRegular) return true;

  //   return false;
  // }
}
