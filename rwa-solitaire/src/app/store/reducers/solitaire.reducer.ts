import { createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, Update } from "@ngrx/entity";

import { solitaireActions } from "../actions/solitaire.actions";
import { SolitaireBoard } from "../../models/solitaire/solitaire-board";
import { SolitaireDifficulty } from "../../models/solitaire/solitaire-difficulty";
import { Card, CardNumber, CardSuit, CardColor } from "../../models/solitaire/card";
import { SolitaireState } from "../../models/state/solitaire.state";

export const boardAdapter: EntityAdapter<SolitaireBoard> = createEntityAdapter<SolitaireBoard>({
    selectId: (board: SolitaireBoard) => board.moveNumber,
    sortComparer: (a, b) => a.moveNumber - b.moveNumber
});

export const initialSolitaireState: SolitaireState = {
    boards: boardAdapter.getInitialState(),
    winCondition: false,
    difficulty: SolitaireDifficulty.Hard,
};

export const solitaireReducer = createReducer(
    initialSolitaireState,
    on(solitaireActions.startNewGame, (state, {difficulty}) => {
        const newWinCondition: boolean = false;
        const newBoard = setUpInitialBoard();
        
        return {
            ...state,
            boards: boardAdapter.setAll([newBoard], state.boards),
            winCondition: newWinCondition,
            difficulty: difficulty,
        } as SolitaireState;
    }),
    on(solitaireActions.restartGame, (state) => {
        if (state.boards.ids.length < 2) return state;

        const startBoard = state.boards.entities[0];
        if (!startBoard) return state;

        return {
            ...state,
            boards: boardAdapter.setAll([startBoard], state.boards),
            winCondition: false
        } as SolitaireState;
    }),
    on(solitaireActions.drawCards, (state) => {
        const currentBoard: SolitaireBoard | undefined = findCurrentBoard(state);
        if (currentBoard === undefined)  return state;
        if (currentBoard.deckStock.length === 0 && currentBoard.deckWaste.length === 0) return state;

        let newBoard: SolitaireBoard = makePureBoardCopy(currentBoard);
        newBoard.moveNumber += 1;

        if (newBoard.deckStock.length > 0) {
            const drawCount = (state.difficulty === SolitaireDifficulty.Hard)? 3 : 1;
            const cardsToDraw = newBoard.deckStock.slice(-drawCount);
            newBoard.deckWaste.push(...cardsToDraw);
            newBoard.deckStock = newBoard.deckStock.slice(0, -cardsToDraw.length);

        } else if (newBoard.deckStock.length === 0 && newBoard.deckWaste.length > 0) {
            newBoard.deckStock = [...newBoard.deckWaste.reverse()];
            newBoard.deckWaste = [];
        }

        return {
            ...state,
            boards: boardAdapter.addOne(newBoard, state.boards)
        } as SolitaireState;
    }),
    on(solitaireActions.dropOnFoundation, (state, {src, dest, srcIndex}) => {
        const currentBoard: SolitaireBoard | undefined = findCurrentBoard(state);
        if (currentBoard === undefined) return state;
        if (!canDropOnFoundation(src, dest, srcIndex, currentBoard.foundation)) return state;

        let newBoard: SolitaireBoard = makePureBoardCopy(currentBoard);
        newBoard.moveNumber += 1;

        let newSrc = findArrayInNewBoard(newBoard, currentBoard, src);
        let newDest = findArrayInNewBoard(newBoard, currentBoard, dest);
        if (newSrc === null || newDest === null) return state;

        if (!moveCards(newSrc, newDest, srcIndex)) return state;
        const updatedBoard = updateCardsAfterMove(newSrc, newBoard);

        return {
            ...state,
            boards: boardAdapter.addOne(updatedBoard, state.boards),
            winCondition: checkWinCondition(updatedBoard),
        } as SolitaireState;
    }),
    on(solitaireActions.dropOnTableau, (state, {src, dest, srcIndex}) => {
        const currentBoard: SolitaireBoard | undefined = findCurrentBoard(state);
        if (currentBoard === undefined) return state;

        if (!canDropOnTableau(src, dest, srcIndex)) return state;

        const newBoard: SolitaireBoard = makePureBoardCopy(currentBoard);
        newBoard.moveNumber += 1;

        const newSrc = findArrayInNewBoard(newBoard, currentBoard, src);
        const newDest = findArrayInNewBoard(newBoard, currentBoard, dest);
        if (newSrc === null || newDest === null) return state;
        
        if (!moveCards(newSrc, newDest, srcIndex)) return state;
        const updatedBoard = updateCardsAfterMove(newSrc, newBoard);

        return {
            ...state,
            boards: boardAdapter.addOne(updatedBoard, state.boards),
            winCondition: checkWinCondition(updatedBoard)
        } as SolitaireState;
    }),
    on(solitaireActions.undo, (state) => {
        if (state.boards.ids.length < 2) return state;
        const currentBoard = findCurrentBoard(state);
        if (currentBoard === undefined) return state;

        return {
            ...state,
            boards: boardAdapter.removeOne(currentBoard!.moveNumber, state.boards),
            winCondition: false
        } as SolitaireState;
    })

);

function generateCard(suit: CardSuit, number: CardNumber): Card {
    const id = number + (suit * 13);
    const color = (suit == CardSuit.Diamonds || suit == CardSuit.Hearts)? CardColor.Red : CardColor.Black;
    const suitString: string | undefined = (() => {
        switch (suit) {
            case CardSuit.Clubs:
                return "clubs";
            case CardSuit.Diamonds:
                return "diamonds";
            case CardSuit.Hearts:
                return "hearts";
            case CardSuit.Spades:
                return "spades";
            default:
                return undefined;
        }
    })();
    const picture: string = (suitString === undefined)? "placeholder_default": suitString + "_" + number;

    return {
        id,
        suit,
        number,
        color,
        faceShown: false,
        movable: false,
        picture
    } as Card
}

function generateDeck(): Card[] {
    const suits = Object.values(CardSuit).filter(value => typeof value === 'number');
    const numbers = Object.values(CardNumber).filter(value => typeof value === 'number');

    const deck = suits.flatMap(suit => numbers.map(number => generateCard(suit as CardSuit, number as CardNumber)));

    return deck;
}

function generateEmptyBoard(): SolitaireBoard {
    return {
        moveNumber: 0,
        foundation: Array.from({length: 4}, () => { return [] as Card[] }),
        tableau: Array.from({length: 7}, () => { return [] as Card[] }),
        deckStock: generateDeck(),
        deckWaste: [],
    } as SolitaireBoard;
}

function makePureCardsCopy(cards: Card[]): Card[] {
    return cards.map(card => ({ ...card }));
}

function makePureBoardCopy(board: SolitaireBoard): SolitaireBoard {
    return {
        moveNumber: board.moveNumber,
        foundation: board.foundation.map(fStack => makePureCardsCopy(fStack)),
        tableau: board.tableau.map(tab => makePureCardsCopy(tab)),
        deckStock: makePureCardsCopy(board.deckStock),
        deckWaste: makePureCardsCopy(board.deckWaste),
    } as SolitaireBoard;
}

function fisherYatesDeckShuffle(cards: Card[]): Card[] {
    let newDeck: Card[] = makePureCardsCopy(cards);
    
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
}

// modifies and returns provided array, doesn't return a new insatance!
// unused??
function updateCards(cards: Card[], updateList: number[], unlock: boolean): Card[] {
    const idsToUpdate = new Set(updateList);

    cards.forEach(card => {
        if (idsToUpdate.has(card.id)) {
            card.faceShown = unlock;
            card.movable = unlock;
        }
    })

    return cards;
}

function placeInitialCards(board: SolitaireBoard): SolitaireBoard {
    if (board.deckStock.length !== 52) {
        console.error("Deck length error!");
        return board;
    }

    let newBoard: SolitaireBoard = makePureBoardCopy(board);

    // functional approach may be better??
    newBoard.tableau.forEach((tab, index) => {
        tab.push(...newBoard.deckStock.splice(-index - 1, index + 1));
        tab.at(-1)!.faceShown = true;
        tab.at(-1)!.movable = true;
    })
    newBoard.deckStock.forEach(card => {
        card.faceShown = true;
        card.movable = true;
    })
    
    return newBoard;
}

function setUpInitialBoard(): SolitaireBoard {
    let newBoard = generateEmptyBoard();

    newBoard.deckStock = fisherYatesDeckShuffle(newBoard.deckStock);

    newBoard = placeInitialCards(newBoard);

    return newBoard;
}

function updateCardsForGameRestart(cards: Card[], updateCardIds: number[]): Update<Card>[] {
    const resetCards: Card[] = resetDeck(cards);
    const updatedCards: Card[] = updateCards(resetCards, updateCardIds, true);

    return updatedCards.map((card) => ({
        id: card.id,
        changes: {
            faceShown: card.faceShown,
            movable: card.movable
        } as Partial<Card>
    } as Update<Card>));
}

function findCurrentBoard(state: SolitaireState): SolitaireBoard | undefined {
    const currentBoardId = state.boards.ids.at(-1);
    if (currentBoardId === undefined) {
        return undefined;
    }

    return state.boards.entities[currentBoardId];
}

function findArrayInNewBoard(newBoard: SolitaireBoard, oldBoard: SolitaireBoard, oldArray: Card[]): Card[] | null {
    if (oldBoard.deckStock === oldArray) return newBoard.deckStock;
    if (oldBoard.deckWaste === oldArray) return newBoard.deckWaste;

    for (const tabIndex in oldBoard.tableau) {
        if (oldBoard.tableau[tabIndex] === oldArray) return newBoard.tableau[tabIndex];
    }

    for (const fndIndex in oldBoard.foundation) {
        if (oldBoard.foundation[fndIndex] === oldArray) return newBoard.foundation[fndIndex];
    }

    return null;
}

function updateCardsAfterMove(stack: Card[], board: SolitaireBoard): SolitaireBoard {
    if (!checkIfStackTopIsHidden(stack)) return board;

    const topCard: Card | undefined = stack.at(-1)!;

    if (topCard === undefined) return board;
    if (topCard.faceShown || topCard.movable) return board; 

    const updatedBoard = makePureBoardCopy(board);
    const updatedArray = findArrayInNewBoard(updatedBoard, board, stack);
    if (updatedArray === null) return board;
    
    updatedArray.at(-1)!.faceShown = true;
    updatedArray.at(-1)!.movable = true;

    return updatedBoard;
}

// function undoLastCardUpdate(previousCardUpdateES: EntityState<PreviousUpdate>, currentBoard: SolitaireBoard): Update<Card> | undefined {
//     const lastUpdate = previousCardUpdateES.entities[currentBoard.moveNumber];
//     if (lastUpdate === undefined) return undefined;

//     return {
//         id: lastUpdate.cardUpdate.id,
//         changes: {
//             movable: !lastUpdate.cardUpdate.changes.movable,
//             faceShown: !lastUpdate.cardUpdate.changes.faceShown
//         }
//     } as Update<Card>;
// }

function checkIfStackTopIsHidden(stack: Card[]): boolean {
    if (stack.length <= 0) return false;

    const topCard: Card | undefined = stack.at(-1)!;

    if (topCard !== undefined && topCard.faceShown === false && topCard.movable === false) return true;

    return false;
}

function canDropOnFoundation(src: Card[], dest: Card[], srcIndex: number, foundation: Card[][]): boolean {
    // parameter check
    if (src.length <= 0 || srcIndex < 0 || src.length <= srcIndex) return false; 

    // array check
    const cardsToMove: Card[] = src.slice(srcIndex);
    if (cardsToMove.length !== 1) return false;

    // card check
    const cardToMove: Card = cardsToMove[0];
    if (!cardToMove) return false;

    // foundation suit check
    const fndIndex = foundation.findIndex(fnd => fnd === dest);
    if (fndIndex === -1) return false;
    if (fndIndex !== cardToMove.suit) return false;

    // ace check
    if (dest.length === 0 && cardToMove.number === CardNumber.Ace) return true;

    // regular card check
    const destTopCard: Card | undefined = dest.at(-1)!;
    if (destTopCard && cardToMove.number - destTopCard.number === 1) return true;

    // default
    return false;
}

function canDropOnTableau(src: Card[], dest: Card[], srcIndex: number): boolean {
    // parameter check
    if (src.length <= 0 || srcIndex < 0 || src.length <= srcIndex) return false;

    // cards check
    const cardsToMove: Card[] = src.slice(srcIndex);
    if (cardsToMove.length <= 0) return false;

    // first card from the moved stack
    const firstCardMoved: Card = cardsToMove[0];
    if (firstCardMoved === undefined) return false;

    // can drop king
    if (dest.length === 0 && firstCardMoved.number === CardNumber.King) return true;

    // dest stack top
    const destStackTop: Card | undefined = dest.at(-1)!;
    if (destStackTop === undefined) return false;

    // regular card drop test
    if (firstCardMoved.color !== destStackTop.color && destStackTop.number - firstCardMoved.number === 1) return true;

    return false;
}

function checkWinCondition(board: SolitaireBoard): boolean {
    if (board.deckWaste.length > 0) return false;
    if (board.deckStock.length > 0) return false;
    for (let tab of board.tableau) if (tab.length > 0) return false;
    for (let f of board.foundation) if (f.length !== 13) return false;

    return true;
}

// mutates the arrays!
function moveCards(src: Card[], dest: Card[], srcIndex: number): boolean {
    if (srcIndex < 0 || src.length <= srcIndex || src.length <= 0) return false;

    dest.push(...src.slice(srcIndex));
    src.length = srcIndex;

    return true;
}

function resetDeck(cards: Card[]): Card[] {
    return cards.map(card => ({
        ...card,
        faceShown: false,
        movable: false
    }))
}