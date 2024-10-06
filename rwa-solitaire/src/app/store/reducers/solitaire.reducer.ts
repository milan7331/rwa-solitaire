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
    // proveriti da li ne menja stanje već kreira sve novo
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
    // proveriti da li ne menja stanje već kreira sve novo
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
        if (currentBoard === undefined) return state;

        let newBoard: SolitaireBoard = makePureBoardCopy(currentBoard);

        if (newBoard.deckStock.length === 0 && newBoard.deckWaste.length !== 0) {
            newBoard.deckStock = newBoard.deckStock.concat(newBoard.deckWaste.reverse());
            newBoard.deckWaste = [];
            newBoard.moveNumber += 1;
        } else {
            if (newBoard.difficulty === SolitaireDifficulty.Hard) {
                if (newBoard.deckStock.length > 0) newBoard.moveNumber += 1;
                for (let i = 0; i < 3; i++) {
                    if (newBoard.deckStock.length > 0) {
                        newBoard.deckWaste.push(newBoard.deckStock.pop()!);
                    } else break;
                }
            } else {
                if (newBoard.deckStock.length > 0) {
                    newBoard.deckWaste.push(newBoard.deckStock.pop()!);
                    newBoard.moveNumber += 1;
                }
            }
        }

        return {
            ...state,
            boards: boardAdapter.addOne(newBoard, state.boards)
        } as SolitaireState;
    }),

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

function fisherYatesDeckShuffle(cards: number[]): number[] {
    let newDeck: number[] = [...cards];
    
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
}

function placeInitialCards(board: SolitaireBoard, cards: Card[]): [SolitaireBoard, Card[]] {
    let newBoard: SolitaireBoard = {...board};
    let newCards: Card[] = [...cards];
    let updateList: number[] = [];
    
    if (newBoard.deckStock.length !== 52) {
        console.log("Deck length error!!");
        return [newBoard, newCards];
    }
    
    for (let i = 0; i < newBoard.tableau.length; i++) {
        for (let j = 0; j < i + 1; j++) {
            newBoard.tableau[i].push(newBoard.deckStock.pop()!);
        }
        updateList.push(newBoard.tableau[i].at(-1)!);
    }
    updateList = updateList.concat(newBoard.deckStock);
    newCards = updateCards(newCards, updateList, true);
    
    return [newBoard, newCards];
}

function updateCards(cards: Card[], updateList: number[], unlock: boolean): Card[] {
    let newCards: Card[] = [...cards];

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

function setUpInitialBoardAndCards(cards: Card[], difficulty: SolitaireDifficulty): [SolitaireBoard, Card[]] {
    let newBoard = generateEmptyBoard(cards, difficulty);
    let newCards = [...cards];

    newBoard.deckStock = fisherYatesDeckShuffle(newBoard.deckStock);
    [newBoard, newCards] = placeInitialCards(newBoard, newCards);

    return [newBoard, newCards];
}

function findCurrentBoard(state: SolitaireState): SolitaireBoard | undefined {
    const currentBordId = state.boards.ids.at(-1);
    if (currentBordId === undefined) return undefined;

    return state.boards.entities[currentBordId];
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

function resetDeck(cards: Card[]): Card[] {
    return cards.map(card => {
        card.faceShown = false;
        card.movable = false;
        return card;
    })
}