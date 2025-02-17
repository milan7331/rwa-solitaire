import { Injectable } from '@angular/core';
import { SolitaireBoard } from '../../models/solitaire/solitaire-board';
import { SolitaireHints } from '../../models/solitaire/solitaire-hints';
import { SolitaireMove } from '../../models/solitaire/solitaire-move';
import { Card, CardNumber } from '../../models/solitaire/card';

@Injectable({
  providedIn: 'root'
})
export class HintService {
  constructor() {}

  getHintsEmpty(): SolitaireHints { return { moves: [], cycleDeck: false, hintIndex: -1, hintVisible: false }; }

  getHints(board: SolitaireBoard): SolitaireHints {
    const result: SolitaireHints = { moves: [], cycleDeck: false, hintIndex: -1, hintVisible: false };

    const tabToTabMoves = this.#getTableauToTableauMoves(board.tableau);
    const tabtoFndMoves = this.#getTableauToFoundationMoves(board.tableau, board.foundation);
    const fndToTabMoves = this.#getFoundationToTableauMoves(board.tableau, board.foundation);
    result.moves.push(...tabToTabMoves, ...tabtoFndMoves, ...fndToTabMoves);

    if (result.moves.length < 1) {
      const deckMoves = this.#getDeckMoves(board);
      result.moves.push(...deckMoves);
    }

    if (result.moves.length < 1) {
      if (board.deckStock.length > 0) result.cycleDeck = true;
    }

    return result;
  }

  showHints(hints: SolitaireHints): SolitaireHints {
    let newHints = this.#makeCleanHintsCopy(hints);
    
    newHints.hintVisible = true;
    if (newHints.moves.length > 0) {
      newHints.hintIndex = (newHints.hintIndex + 1) % newHints.moves.length;
    }

    console.log(newHints);
    return newHints;
  }

  hideHints(hints: SolitaireHints): SolitaireHints {
    let newHints = this.#makeCleanHintsCopy(hints);

    newHints.hintVisible = false;
    newHints.hintIndex = -1;

    return newHints;
  }

  // check if a tableau move that uncovers new cards / moves cards from an empty field exists
  #getTableauToTableauMoves(tableau: Card[][]): SolitaireMove[] {
    const results: SolitaireMove[] = [];

    for (const tab of tableau) {      
      const maxIndex = this.#find_maxMovableCardIndex(tab);
      if (maxIndex < 0) continue;

      const maxMovableCard = tab[maxIndex];
      if (!maxMovableCard) continue;

      const restOfBoard: Card[][] = tableau.filter(otherTab => otherTab !== tab);
      const moveDestinations: Card[][] = this.#find_tableau_availableMoveDestinations(restOfBoard, maxMovableCard, maxIndex);

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
  #getTableauToFoundationMoves(tableau: Card[][], foundation: Card[][]): SolitaireMove[] {
    const results: SolitaireMove[] = [];

    const tabs: Card[][] = tableau.filter(tab => tab.length > 0);
    for (const tab of tabs) {
      const topCard = tab.at(-1);
      if (!topCard) continue;

      const secondCard = (tab.length > 1)? tab.at(-2)! : undefined;

      const dest = foundation[topCard.suit];
      if (!this.#check_canMoveCardToFoundation(topCard, dest)) continue;

      const move: SolitaireMove = {
        source: tab,
        dest: dest,
        sourceIndex: tab.length - 1
      };
      
      // clears tableau stack
      if (tab.length === 1) { 
        results.unshift(move);
        continue;
      }

      // uncovers hidden card
      if (secondCard !== undefined && tab.length > 1 && secondCard.faceShown === false && secondCard.movable === false) {
        results.unshift(move);
        continue;
      }

      results.push(move);
      }

    return results;
  }

  // check if a hidden card can be uncovered or a tableau stack freed in the next move, 
  // if a certain card from the foundation returns to the tableau in this move
  #getFoundationToTableauMoves(tableau: Card[][], foundation: Card[][]): SolitaireMove[] {
    const results: SolitaireMove[] = [];

    for (let f of foundation) {
      if (f.length < 2) continue;
      const foundationCard = f.at(-1);
      if (!foundationCard) continue;

      const tabs = tableau.filter(tab => tab.length > 0);
      for (const tab of tabs) {
        const nextTurn_topCardIndex = this.#find_maxMovableCardIndex(tab);
        if (nextTurn_topCardIndex < 0) continue;

        const nextTurn_topCard = tab.at(nextTurn_topCardIndex)!;
        if (!nextTurn_topCard) continue;

        const nextTurn_moveCondition = (foundationCard.number - nextTurn_topCard!.number === 1 && foundationCard.color !== nextTurn_topCard!.color);
        if (!nextTurn_moveCondition) continue;

        const restOfTableau = tableau.filter(t => t != tab);
        const thisTurn_dests = this.#find_tableau_availableMoveDestinations(restOfTableau, foundationCard, f.length - 1);
        if (thisTurn_dests.length < 1) continue;

        for (let dest of thisTurn_dests) {
          results.push({source: f, dest: dest, sourceIndex: f.length - 1} as SolitaireMove);
        }
      }
    }

    return results;
  }

  #getDeckMoves(board: SolitaireBoard): SolitaireMove[] {
    const { deckStock, deckWaste, foundation, tableau} = board;
    const results: SolitaireMove[] = [];

    if (deckWaste.length > 0) {
      const wasteCard = deckWaste.at(-1);
      if (!wasteCard) return results;

      // try tableau move first
      const tableauDests = this.#find_tableau_availableMoveDestinations(tableau, wasteCard, deckWaste.length - 1);
      for (const dest of tableauDests) {
        results.push({source: deckWaste, dest: dest, sourceIndex: deckWaste.length - 1} as SolitaireMove);
      }

      // then try foundation move
      const fDest = foundation[wasteCard.suit];
      if (this.#check_canMoveCardToFoundation(wasteCard, fDest)) {
        results.push({source: deckWaste, dest: fDest, sourceIndex: deckWaste.length -1} as SolitaireMove);
      }
    }
    return results;
  }

  #find_maxMovableCardIndex(stack: Card[]): number {
    if (stack.length <= 0) return -1;
  
    let maxIndex: number = stack.findIndex(card => {
      if (card.movable && card.faceShown) return true;
      return false;
    })
  
    return maxIndex;
  }

  // works only for tableau fields
  #find_tableau_availableMoveDestinations(restOfTableau: Card[][], card: Card, cardIndex: number): Card[][] {
    let result: Card[][] = [];
    if (!card) return result;

    if (card.number === CardNumber.King) {
      if (cardIndex > 0) result = restOfTableau.filter(tab => tab.length === 0);
    } else {
      for (const tab of restOfTableau) {
        if (tab.length < 1) continue;
        const topCard = tab.at(-1);
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

  #check_canMoveCardToFoundation(card: Card, foundation: Card[]): boolean {
    const stackTop = foundation.at(-1);

    // ace check
    if (foundation.length === 0 && card.number === CardNumber.Ace) return true;

    if (foundation.length === 0 || !stackTop) return false;

    // regular card drop
    if (foundation.length > 0 && card.number - stackTop.number === 1) return true;

    return false;
  }

  #makeCleanHintsCopy(hints: SolitaireHints): SolitaireHints {
    return {
      moves: hints.moves.map((move) => ({ ...move })),
      cycleDeck: hints.cycleDeck,
      hintIndex: hints.hintIndex,
      hintVisible: hints.hintVisible
    }
  }
}
