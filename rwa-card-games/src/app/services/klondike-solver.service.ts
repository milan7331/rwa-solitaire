// import { Injectable } from '@angular/core';
// import { Card, CardColor, CardNumber, CardSuit } from '../models/card'
// import { KlondikeBoard, KlondikeDifficulty } from '../models/klondike-board';

// @Injectable({
//   providedIn: 'root'
// })
// export class KlondikeSolverService {

  
//   foundationDiamonds: Card[] = [];
//   foundationClubs: Card[] = [];
//   foundationHearts: Card[] = [];
//   foundationSpades: Card[] = [];
//   tableaus: Card[][] = [];

//   board: KlondikeBoard | null;
  
//   constructor() {
//     this.board = null;
//   }

//   public isSolvable(originalBoard: KlondikeBoard): boolean {
//     let finalResult: boolean = false;    
//     let moveMade = false;
//     let moveCounter = 0;

//     this.initializeBoardCopy(originalBoard);

//     do {
//       console.log("Move number: " + moveCounter + " Started." );
//       moveMade = false;

//       if (this.tryMoveKingToEmpty()) {
//           moveMade = true;
//           moveCounter++;
//           continue;
//       }
//       if (this.tryMoveWithinTableau()) {
//           moveMade = true;
//           moveCounter++;
//           continue;
//       }
//       if (this.tryMoveToFoundation()) {
//           moveMade = true;
//           moveCounter++;
//           continue;
//       }
//       if (this.tryCycleStock()) {
//           moveMade = true;
//           moveCounter++;
//           continue;
//       }
//   } while (moveMade && moveCounter < 300);
  
//   finalResult = this.isSolved(this.board!);
//   this.clearBoard();
//   return finalResult;
//   }

//   /**
//    * Initialize a shallow board copy
//    * 
//    * @param {KlondikeBoard} board - Original board that will be copied
//    * @returns {boolean} True - Shallow copy crated sucessfully. False - Original board not in initial state or initialized. 
//    */
//   private initializeBoardCopy(originalBoard: KlondikeBoard): boolean {
//     this.board = new KlondikeBoard();

//     // Check if original board is initialized or if a move had been played.
//     if (
//       originalBoard.tableau1.length !== 1 ||
//       originalBoard.tableau2.length !== 2 ||
//       originalBoard.tableau3.length !== 3 ||
//       originalBoard.tableau4.length !== 4 ||
//       originalBoard.tableau5.length !== 5 ||
//       originalBoard.tableau6.length !== 6 ||
//       originalBoard.tableau7.length !== 7 ||
//       originalBoard.foundationClubs.length !== 0 ||
//       originalBoard.foundationDiamonds.length !== 0 ||
//       originalBoard.foundationHearts.length !== 0 ||
//       originalBoard.foundationSpades.length !== 0
//     ) return false;

//     // Shallow copy all fields + difficulty
//     this.board.tableau1 = [...originalBoard.tableau1];
//     this.board.tableau2 = [...originalBoard.tableau2];
//     this.board.tableau3 = [...originalBoard.tableau3];
//     this.board.tableau4 = [...originalBoard.tableau4];
//     this.board.tableau5 = [...originalBoard.tableau5];
//     this.board.tableau6 = [...originalBoard.tableau6];
//     this.board.tableau7 = [...originalBoard.tableau7];
//     this.board.foundationClubs = [...originalBoard.foundationClubs];
//     this.board.foundationDiamonds = [...originalBoard.foundationDiamonds];
//     this.board.foundationHearts = [...originalBoard.foundationHearts];
//     this.board.foundationSpades = [...originalBoard.foundationSpades];
//     this.board.difficulty = (originalBoard.difficulty === KlondikeDifficulty.Hard)? KlondikeDifficulty.Hard : KlondikeDifficulty.Easy;
  
//     return true;
//   }

//   private tryMoveKingToEmpty(): boolean {
//     const tableaus: Card[][] = [this.board!.tableau1, this.board!.tableau2,
//                                 this.board!.tableau3, this.board!.tableau4,
//                                 this.board!.tableau5, this.board!.tableau6,
//                                 this.board!.tableau7];
//     let kingOrigin: Card[] = [];
//     let kingIndex: number = 0;
//     let emptyTableau: Card[] | null = this.findEmptyTableau(tableaus);
//     let king: Card | null = this.findKing(tableaus, kingOrigin, kingIndex);

//     if (emptyTableau === null || king === null) return false;

//     return this.moveCards(kingOrigin, emptyTableau, kingIndex);
//   }

//   private tryMoveWithinTableau(): boolean {
//     const tableaus: Card[][] = [this.board!.tableau1, this.board!.tableau2,
//                                 this.board!.tableau3, this.board!.tableau4,
//                                 this.board!.tableau5, this.board!.tableau6,
//                                 this.board!.tableau7];
    
//     for (const tableau of tableaus) {
//       const maxIndex = this.findMaxMovableCard(tableau);
//       if (!maxIndex) continue;

//       const maxCard = tableau[maxIndex];
//       const restOfBoard: Card[][] = tableaus.filter(t => t !== tableau);

//       const moveDest = this.findAvailableTableauMoveLocation(restOfBoard, maxCard);
//       if (moveDest) return this.moveCards(tableau, moveDest, maxIndex);
//     }

//     return false;
//   }

//   private tryMoveToFoundation(): boolean {
//     const tableaus: Card[][] = [this.board!.tableau1, this.board!.tableau2,
//                                 this.board!.tableau3, this.board!.tableau4,
//                                 this.board!.tableau5, this.board!.tableau6,
//                                 this.board!.tableau7];
    
//     for (const tableau of tableaus) {
//       if (tableau.length === 0) continue;

//       const topCard = tableau[tableau.length - 1];
//       const foundation = this.findFoundationDestination(topCard);

//       const canPlaceAce = foundation.length === 0 && topCard.number === CardNumber.Ace;
//       const canPlaceCard = foundation.length !== 0 && topCard.number - foundation[foundation.length - 1].number === 1;

//       if (canPlaceAce || canPlaceCard) {
//         return this.moveCards(tableau, foundation, tableau.length - 1);
//       }
//     }
    
//     return false;
//   }

//   private tryCycleStock(): boolean {
//     const tableaus: Card[][] = [this.board!.tableau1, this.board!.tableau2,
//                                 this.board!.tableau3, this.board!.tableau4,
//                                 this.board!.tableau5, this.board!.tableau6,
//                                 this.board!.tableau7];
//     const stock: Card[] = this.board!.deckStock;
//     const waste: Card[] = this.board!.deckWaste;
//     const numberOfCycles: number = 3;

//     if (waste.length !== 0) {
//       if (this.wasteTryMoveKingToEmpty(tableaus, waste)) return true;
//       if (this.wasteTryMoveToTableau(tableaus, waste)) return true;
//       if (this.wasteTryMoveToFoundation(waste)) return true;
//     }
//     for (let i = 0; i < numberOfCycles; i++) {
//       while(stock.length > 0) {
//         this.drawCards();
//         if (this.wasteTryMoveKingToEmpty(tableaus, waste)) return true;
//         if (this.wasteTryMoveToTableau(tableaus, waste)) return true;
//         if (this.wasteTryMoveToFoundation(waste)) return true;
//       }
//       this.drawCards();
//       this.drawCards();
//     }

//     return false;
//   }

//   private findEmptyTableau(tableaus: Card[][]): Card[] | null {
//     for (const tableau of tableaus) {
//       if (tableau.length === 0) return tableau;
//     }

//     return null;
//   }

//   private findAvailableTableauMoveLocation(tableaus: Card[][], card: Card): Card[] | null {
//     return tableaus.find(tableau => {
//       tableau.length > 0 &&
//       tableau[tableau.length - 1].number - card.number === 1 &&
//       tableau[tableau.length - 1].color !== card.color

//     }) ?? null;
//   }

//   private findKing(tableaus: Card[][], outKingOriginArray: Card[], outKingIndex: number): Card | null {
//     for (const tableau of tableaus) {
//       for (let i = 0; i < tableau.length; i++) {
//         if(tableau[i].number === CardNumber.King) {
//           outKingOriginArray = tableau;
//           outKingIndex = i;
//           return tableau[i];
//         }
//       }
//     }

//     return null;
//   }

//   private findMaxMovableCard(stack: Card[]): number | null {
//     if (stack.length <= 0) return null;
//     if (stack.length === 1) return 0;

//     let maxIndex: number = stack.length - 1;
//     for (let i = stack.length - 2; i >= 0; i--) {
//       if (stack[i].number - stack[i + 1].number === 1 && stack[i].color != stack[i + 1].color) {
//         maxIndex = i;
//       }
//     }

//     return maxIndex;
//   }

//   private findFoundationDestination(card: Card): Card[] {
//     const foundationDictionary: {[key in CardSuit]: Card[]} = {
//       [CardSuit.Clubs]: this.board!.foundationClubs,
//       [CardSuit.Diamonds]:this.board!.foundationDiamonds,
//       [CardSuit.Hearts]:this.board!.foundationHearts,
//       [CardSuit.Spades]:this.board!.foundationSpades
//     }
//     return foundationDictionary[card.suit];
//   }

//   private wasteTryMoveKingToEmpty(tableaus: Card[][], waste: Card[]): boolean { 
//     const topCard = waste[waste.length - 1];
//     if (topCard.number !== CardNumber.King) return false;

//     const dest = this.findEmptyTableau(tableaus);
//     if (dest === null) return false;

//     return this.moveCards(waste, dest, waste.length - 1);
//   }

//   private wasteTryMoveToTableau(tableaus: Card[][], waste: Card[]): boolean {
//     const topCard = waste[waste.length - 1];
    
//     const dest: Card[] | null = this.findAvailableTableauMoveLocation(tableaus, topCard);
//     if (dest === null) return false;
    
//     return this.moveCards(waste, dest, waste.length - 1); 
//   }

//   private wasteTryMoveToFoundation(waste: Card[]): boolean {
//     const topCard = waste[waste.length - 1];

//     const dest = this.findFoundationDestination(topCard);

//     const canPlaceAce = dest.length === 0 && topCard.number === CardNumber.Ace;
//     const canPlaceCard = dest.length !== 0 && topCard.number - dest[dest.length - 1].number === 1;

//     if (!canPlaceAce && !canPlaceCard) return false;
    
//     return this.moveCards(waste, dest, waste.length -1);
//   }

//   private drawCards(): void {
//     let stock = this.board!.deckStock;
//     let waste = this.board!.deckWaste;
//     const diff = this.board!.difficulty;

//     if (stock.length === 0 && waste.length !== 0) {
//       while (waste.length > 0) stock.push(waste.pop()!);
//     } else {
//       if (diff === KlondikeDifficulty.Hard) {
//         if (stock.length > 0) waste.push(stock.pop()!);
//         if (stock.length > 0) waste.push(stock.pop()!);
//         if (stock.length > 0) waste.push(stock.pop()!);
//       } else {
//         if (stock.length > 0) waste.push(stock.pop()!);
//       }
//     }
//   }

//   private moveCards(source: Card[], dest: Card[], sourceIndex: number): boolean {
//     if (sourceIndex >= 0 && source.length > sourceIndex) {
//       const cardsToMove = source.slice(sourceIndex);
//       dest.push(...cardsToMove);
//       source.length = sourceIndex;
//       return true;
//     }

//     return false;
//   }

//   private isSolved(board: KlondikeBoard): boolean {
//     const tableaus: Card[][] = [board.tableau1, board.tableau2, board.tableau3, board.tableau4, board.tableau5, board.tableau6, board.tableau7];
//     const foundations: Card[][] = [board.foundationClubs, board.foundationDiamonds, board.foundationHearts, board.foundationSpades];

//     if (board.deckWaste.length !== 0) return false;
//     if (board.deckStock.length !== 0) return false;

//     for (const tab of tableaus) {
//       if (tab.length !== 0) return false;
//     }

//     for (const f of foundations) {
//       if (f.length !== 13) return false;
//       if (f.reduce((acc, el) => acc + el.number, 0) !== 91) return false;
//       if (f.every(el => el.suit === f[0].suit) === false) return false;
//     }
  
//     return true;
//   }

//   /**
//    * Remove the test board after usage
//    * @returns void
//    */
//   private clearBoard(): void {
//     this.board = null;
//   }
// }
