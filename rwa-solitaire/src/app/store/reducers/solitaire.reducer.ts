import { createReducer, on } from "@ngrx/store";
import { SolitaireState } from "../../models/state/solitaire.state";
import { solitaireActions } from "../actions/solitaire.actions";
import { SolitaireBoard, SolitaireDifficulty } from "../../models/game/solitaire-board";
import { Card, CardNumber, CardSuit, CardColor } from "../../models/game/card";
import { createEntityAdapter, Dictionary, EntityAdapter, EntityState, Update } from "@ngrx/entity";


export const boardAdapter: EntityAdapter<SolitaireBoard> = createEntityAdapter<SolitaireBoard>({
    selectId: (board: SolitaireBoard) => board.moveNumber,
});
export const cardAdapter: EntityAdapter<Card> = createEntityAdapter<Card>({
    selectId: (card: Card) => card.id,
});

export const initialSolitaireState: SolitaireState = {
    boards: boardAdapter.getInitialState(),
    cards: cardAdapter.getInitialState()
}

export const solitaireReducer = createReducer(
    initialSolitaireState,
    on(solitaireActions.startNewGame, (state, {difficulty}) => {
        let newBoard: SolitaireBoard;
        let newCards: Card[] = generateDeck();

        [newBoard, newCards] = setUpInitialBoardAndCards(newCards, difficulty);

        return {
            ...state,
            boards: boardAdapter.setAll([newBoard], state.boards),
            cards: cardAdapter.setAll(newCards, state.cards)
        } as SolitaireState;
    }),
    on(solitaireActions.restartGame, (state) => {
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
            cards: cardAdapter.updateMany(updates, state.cards)
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
    on(solitaireActions.dropOnFoundation, (state, {source, dest, sourceIndex, suit}) => {
        


        return state;
    })

)

function generateCard(suit: CardSuit, number: CardNumber): Card {
    const id = (suit + 1) * number;
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
    let newCards: Card[] = makePureCardsCopy(cards);

    for (let i = 0; i < updateList.length; i++) {
        for (let j = 0; j < newCards.length; j++) {
            if (updateList[i] === newCards[j].id) {
                newCards[j].faceShown = unlock;
                newCards[j].movable = unlock;
                break;
            }
        }
    }

    return newCards;
}

function placeInitialCards(board: SolitaireBoard, cards: Card[]): [SolitaireBoard, Card[]] {
    if (board.deckStock.length !== 52) {
        console.log("Deck length error!!");
        return [board, cards];
    }

    let newBoard: SolitaireBoard = makePureBoardCopy(board);
    let newCards: Card[] = makePureCardsCopy(cards);
    let updateList: number[] = [];
    
    
    for (let i = 0; i < newBoard.tableau.length; i++) {
        for (let j = 0; j < i + 1; j++) {
            newBoard.tableau[i].push(newBoard.deckStock.pop()!);
        }
        updateList.push(newBoard.tableau[i].at(-1)!);
    }
    updateList = updateList.concat(newBoard.deckStock);
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
    const currentBordId = state.boards.ids.at(-1);
    if (currentBordId === undefined) {
        console.log("currentBoard-undefined!");
        return undefined;
    }

    return state.boards.entities[currentBordId];
}

function canDropOnFoundation(
    src: number[] | null,
    dest: number[] | null,
    srcIndex: number | null,
    suit: CardSuit | null,
    cardsES: EntityState<Card> | null
): boolean {
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
    if ( true) return true;

    // default
    return false;
}

function resetDeck(cards: Card[]): Card[] {
    return cards.map(card => ({
        ...card,
        faceShown: false,
        movable: false
    }))
}