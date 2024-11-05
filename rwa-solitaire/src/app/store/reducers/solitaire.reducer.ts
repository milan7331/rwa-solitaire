import { createReducer, on } from "@ngrx/store";
import { solitaireActions } from "../actions/solitaire.actions";
import { SolitaireBoard, SolitaireDifficulty } from "../../models/solitaire/solitaire-board";
import { Card, CardNumber, CardSuit, CardColor } from "../../models/solitaire/card";
import { createEntityAdapter, EntityAdapter, EntityState, Update } from "@ngrx/entity";
import { PreviousUpdate } from "../../models/solitaire/previous-update";
import { SolitaireState } from "../../models/state/solitaire.state";

export const boardAdapter: EntityAdapter<SolitaireBoard> = createEntityAdapter<SolitaireBoard>({
    selectId: (board: SolitaireBoard) => board.moveNumber,
});
export const cardAdapter: EntityAdapter<Card> = createEntityAdapter<Card>({
    selectId: (card: Card) => card.id,
});

export const previousCardUpdateAdapter: EntityAdapter<PreviousUpdate> = createEntityAdapter<PreviousUpdate>({
    selectId: (update: PreviousUpdate) => update.moveNumber,
});

export const initialSolitaireState: SolitaireState = {
    boards: boardAdapter.getInitialState(),
    cards: cardAdapter.getInitialState(),
    previousCardUpdate: previousCardUpdateAdapter.getInitialState(),
    winCondition: false
}

export const solitaireReducer = createReducer(
    initialSolitaireState,
    on(solitaireActions.startNewGame, (state, {difficulty}) => {
        let newBoard: SolitaireBoard;
        let newCards: Card[] = generateDeck();
        let newWinCondition: boolean = false;

        [newBoard, newCards] = setUpInitialBoardAndCards(newCards, difficulty);

        return {
            ...state,
            boards: boardAdapter.setAll([newBoard], state.boards),
            cards: cardAdapter.setAll(newCards, state.cards),
            winCondition: newWinCondition
        } as SolitaireState;
    }),
    on(solitaireActions.restartGame, (state) => {
        if (state.boards.ids.length < 2) return state;

        const updateCardIds: number[] = [
            ...state.boards.entities[0]!.deckStock,
            ...state.boards.entities[0]!.tableau.map(tab => tab.at(-1)!).filter(cardId => !!cardId)
        ];

        const updates: Update<Card>[] = updateCardsForGameRestart(
            Object.values(state.cards.entities).filter((card): card is Card => !!card),
            updateCardIds
        );

        return {
            ...state,
            boards: boardAdapter.removeMany([0], state.boards),
            cards: cardAdapter.updateMany(updates, state.cards),
            previousCardUpdate: previousCardUpdateAdapter.removeAll(state.previousCardUpdate),
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
            const drawCount = (newBoard.difficulty === SolitaireDifficulty.Hard)? 3 : 1;
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
    on(solitaireActions.dropOnFoundation, (state, {suit, src, dest, srcIndex}) => {
        const currentBoard: SolitaireBoard | undefined = findCurrentBoard(state);
        if (currentBoard === undefined) return state;
        if (!canDropOnFoundation(state.cards, suit, src, dest, srcIndex)) return state;

        let newBoard: SolitaireBoard = makePureBoardCopy(currentBoard);
        newBoard.moveNumber += 1;

        let newSrc = findArrayInNewBoard(newBoard, currentBoard, src);
        let newDest = findArrayInNewBoard(newBoard, currentBoard, dest);
        if (newSrc === undefined || newDest === undefined) return state;

        if (!moveCards(newSrc, newDest, srcIndex)) return state;

        const updates = updateCardsAfterMove(state.cards, newSrc, newBoard);
  
        return {
            ...state,
            boards: boardAdapter.addOne(newBoard, state.boards),
            cards: (updates)? cardAdapter.updateOne(updates.cardUpdate, state.cards) : state.cards,
            previousCardUpdate: (updates)? previousCardUpdateAdapter.addOne(updates.previousUpdate, state.previousCardUpdate) : state.previousCardUpdate,
            winCondition: checkWinCondition(newBoard),
        } as SolitaireState;
    }),
    on(solitaireActions.dropOnTableau, (state, {src, dest, srcIndex}) => {
        const currentBoard: SolitaireBoard | undefined = findCurrentBoard(state);
        if (currentBoard === undefined) return state;
        if (!canDropOnTableau(state.cards, src, dest, srcIndex)) return state;

        let newBoard: SolitaireBoard = makePureBoardCopy(currentBoard);
        newBoard.moveNumber += 1;

        let newSrc = findArrayInNewBoard(newBoard, currentBoard, src);
        let newDest = findArrayInNewBoard(newBoard, currentBoard, dest);
        if (newSrc === undefined || newDest === undefined) return state;
        
        if (!moveCards(newSrc, newDest, srcIndex)) return state;

        const updates = updateCardsAfterMove(state.cards, newSrc, newBoard);

        return {
            ...state,
            boards: boardAdapter.addOne(newBoard, state.boards),
            cards: (updates)? cardAdapter.updateOne(updates.cardUpdate, state.cards) : state.cards,
            previousCardUpdate: (updates)? previousCardUpdateAdapter.addOne(updates.previousUpdate, state.previousCardUpdate) :state.previousCardUpdate,
            winCondition: checkWinCondition(newBoard)
        } as SolitaireState;
    }),
    on(solitaireActions.undo, (state) => {
        if (state.boards.ids.length < 2) return state;
        const currentBoard = findCurrentBoard(state);
        if (currentBoard === undefined) return state;

        const previousUpdate = state.previousCardUpdate.entities[currentBoard.moveNumber];
        const lastChange =  undoLastCardUpdate(state.previousCardUpdate, currentBoard);

        return {
            ...state,
            boards: boardAdapter.removeOne(currentBoard!.moveNumber, state.boards),
            cards: (lastChange)? cardAdapter.updateOne(lastChange, state.cards) : state.cards,
            previousCardUpdate: (lastChange)? previousCardUpdateAdapter.removeOne(currentBoard.moveNumber, state.previousCardUpdate) : state.previousCardUpdate,
            winCondition: false
        } as SolitaireState;
    })

);

function generateCard(suit: CardSuit, number: CardNumber): Card {
    const id = number + (suit * 13);
    const clr = (suit == CardSuit.Diamonds || suit == CardSuit.Hearts)? CardColor.Red : CardColor.Black;
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
    const pic: string = (suitString === undefined)? "placeholder_default": suitString + "_" + number;

    return {
        id: id,
        suit: suit,
        number: number,
        color: clr,
        faceShown: false,
        movable: false,
        picture: pic
    } as Card
}

function generateDeck(): Card[] {
    const suits = Object.values(CardSuit).filter(value => typeof value === 'number');
    const numbers = Object.values(CardNumber).filter(value => typeof value === 'number');

    const deck = suits.flatMap(suit => numbers.map(number => generateCard(suit as CardSuit, number as CardNumber)));

    return deck;
}

function generateEmptyBoard(cards: Card[], difficulty: SolitaireDifficulty): SolitaireBoard {
    return {
        moveNumber: 0,
        previousCardUpdate: undefined,
        foundation: Array.from({length: 4}, () => { return [] as number[] }),
        tableau: Array.from({length: 7}, () => { return [] as number[] }),
        deckStock: cards.map(card => card.id),
        deckWaste: [],
        difficulty: difficulty,
    } as SolitaireBoard;
}

function makePureBoardCopy(board: SolitaireBoard): SolitaireBoard {
    return {
        moveNumber: board.moveNumber,
        foundation: board.foundation.map(fStack => [...fStack]),
        tableau: board.tableau.map(tab => [...tab]),
        deckStock: [...board.deckStock],
        deckWaste: [...board.deckWaste],
        difficulty: board.difficulty
    } as SolitaireBoard;
}

function makePureCardsCopy(cards: Card[]): Card[] {
    return cards.map(card => ({ ...card }));
}

function fisherYatesDeckShuffle(cards: number[]): number[] {
    let newDeck: number[] = [...cards];
    
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
}

function updateCards(cards: Card[], updateList: number[], unlock: boolean): Card[] {
    const idsToUpdate = new Set(updateList);
    const newCards: Card[] = makePureCardsCopy(cards);

    return newCards.map(card => {
        if (idsToUpdate.has(card.id)) {
            return { ...card, faceShown: unlock, movable: unlock };
        }
        return card;
    });
}

function placeInitialCards(board: SolitaireBoard, cards: Card[]): [SolitaireBoard, Card[]] {
    if (board.deckStock.length !== 52) {
        console.log("Deck length error!!");
        return [board, cards];
    }

    let newBoard: SolitaireBoard = makePureBoardCopy(board);
    let newCards: Card[] = makePureCardsCopy(cards);

    let updateList: number[] = newBoard.tableau.map((stack, index) => {
        const cardsToAdd = newBoard.deckStock.splice(-index - 1, index + 1);
        stack.push(...cardsToAdd);
        return stack.at(-1)!;
    });

    updateList.push(...newBoard.deckStock);
    let updatedCards = updateCards(newCards, updateList, true);
    
    return [newBoard, updatedCards];
}

function setUpInitialBoardAndCards(cards: Card[], difficulty: SolitaireDifficulty): [SolitaireBoard, Card[]] {
    let newCards = makePureCardsCopy(cards);
    let newBoard = generateEmptyBoard(newCards, difficulty);

    newBoard.deckStock = fisherYatesDeckShuffle(newBoard.deckStock);

    [newBoard, newCards] = placeInitialCards(newBoard, newCards);

    return [newBoard, newCards];
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
        console.log("currentBoard-undefined!");
        return undefined;
    }

    return state.boards.entities[currentBoardId];
}

function findArrayInNewBoard(newBoard: SolitaireBoard, oldBoard: SolitaireBoard, oldArray: number[]): number[] | undefined {
    if (oldBoard.deckStock === oldArray) return newBoard.deckStock;
    if (oldBoard.deckWaste === oldArray) return newBoard.deckWaste;

    for (const tabIndex in oldBoard.tableau) {
        if (oldBoard.tableau[tabIndex] === oldArray) return newBoard.tableau[tabIndex];
    }

    for (const fndIndex in oldBoard.foundation) {
        if (oldBoard.foundation[fndIndex] === oldArray) return newBoard.foundation[fndIndex];
    }

    return undefined;
}

function updateCardsAfterMove(cardsES: EntityState<Card>, stack: number[], currentBoard: SolitaireBoard): { previousUpdate: PreviousUpdate, cardUpdate: Update<Card> } | undefined {
    if (!checkIfStackTopIsHidden(cardsES, stack)) return undefined;

    const topCard: Card | undefined = cardsES.entities[stack.at(-1)!];

    if (topCard === undefined) return undefined;
    if (topCard.faceShown === true) return undefined; 
    if (topCard.movable === true) return undefined;

    const cardUpdate: Update<Card> = {
        id: stack.at(-1)!,
        changes: {
            faceShown: true,
            movable: true
        }
    }

    const previousUpdate: PreviousUpdate = {
        moveNumber: currentBoard.moveNumber,
        cardUpdate: cardUpdate
    }

    return { previousUpdate, cardUpdate };
}

function undoLastCardUpdate(previousCardUpdateES: EntityState<PreviousUpdate>, currentBoard: SolitaireBoard): Update<Card> | undefined {
    const lastUpdate = previousCardUpdateES.entities[currentBoard.moveNumber];
    if (lastUpdate === undefined) return undefined;

    return {
        id: lastUpdate.cardUpdate.id,
        changes: {
            movable: !lastUpdate.cardUpdate.changes.movable,
            faceShown: !lastUpdate.cardUpdate.changes.faceShown
        }
    } as Update<Card>;
}

function checkIfStackTopIsHidden(cardsES: EntityState<Card>, stack: number[]): boolean {
    if (stack.length <= 0) return false;

    const topCard: Card | undefined = cardsES.entities[stack.at(-1)!];

    if (topCard !== undefined && topCard.faceShown === false && topCard.movable === false) return true;

    return false;
}

function canDropOnFoundation(cardsES: EntityState<Card> | null, suit: CardSuit | null, src: number[] | null, dest: number[] | null, srcIndex: number | null): boolean {
    // parameter check
    if (src === null || dest === null || srcIndex === null || suit === null || cardsES === null) return false; 
    if (srcIndex < 0 || src.length <= srcIndex) return false;

    // array check
    const cardsToMove: number[] = src.slice(srcIndex);
    if (cardsToMove.length !== 1) return false;

    // card check
    const cardId: number = cardsToMove[0];
    const cardToMove: Card | undefined = cardsES.entities[cardId];
    if (cardToMove === undefined) return false;
    if (cardToMove!.suit !== suit) return false;

    // ace check
    if (dest.length === 0 && cardToMove.number === CardNumber.Ace) return true;
    // regular card check
    const destTopCard: Card | undefined = cardsES.entities[dest.at(-1)!];
    if (destTopCard !== undefined && cardToMove.number - destTopCard.number === 1) return true;

    // default
    return false;
}

function canDropOnTableau(cardsES: EntityState<Card> | null, src: number[] | null, dest: number[] | null, srcIndex: number | null): boolean {
    // parameter check
    if (src === null || dest === null || srcIndex === null || cardsES === null) return false; 
    if (srcIndex < 0 || src.length <= srcIndex) return false;

    // cards check
    const cardsToMove: number[] = src.slice(srcIndex);
    if (cardsToMove.length <= 0) return false;

    // first card from the moved stack
    const firstCardMoved: Card | undefined = cardsES.entities[cardsToMove[0]];
    if (firstCardMoved === undefined) return false;

    // can drop king
    if (dest.length === 0 && firstCardMoved!.number === CardNumber.King) return true;

    // dest stack top
    const destStackTop: Card | undefined = (dest.length > 0)? cardsES.entities[dest.at(-1)!] : undefined;
    if (destStackTop === undefined) return false;

    // regular card drop test
    if (firstCardMoved!.color !== destStackTop!.color && destStackTop!.number - firstCardMoved!.number === 1) return true;

    return false;
}

function checkWinCondition(board: SolitaireBoard): boolean {
    if (board.deckWaste.length > 0) return false;
    if (board.deckStock.length > 0) return false;
    for (let tab of board.tableau) if (tab.length > 0) return false;
    for (let f of board.foundation) if (f.length !== 13) return false;

    return true;
}

function moveCards(src: number[], dest: number[], srcIndex: number): boolean {
    if (srcIndex < 0 || src.length <= srcIndex) return false;

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