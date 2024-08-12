import { Card, CardNumber, CardSuit } from "./card";

export enum KlondikeDifficulty {
    Easy = 0,
    Hard = 1
}

export class KlondikeBoard {

    foundationClubs: Card[] = [];
    foundationDiamonds: Card[] = [];
    foundationHearts: Card[] = [];
    foundationSpades: Card[] = [];
  
    deckStock: Card[] = [];
    deckWaste: Card[] = [];
  
    tableau1: Card[] = [];
    tableau2: Card[] = [];
    tableau3: Card[] = [];
    tableau4: Card[] = [];
    tableau5: Card[] = [];
    tableau6: Card[] = [];
    tableau7: Card[] = [];

    difficulty: KlondikeDifficulty = 1;

    constructor() {
        this.clearBoard();
    }


    clearBoard(): void {
        this.foundationClubs = [];
        this.foundationDiamonds = [];
        this.foundationHearts = [];
        this.foundationSpades = [];

        this.deckStock = [];
        this.deckWaste = [];
    
        this.tableau1 = [];
        this.tableau2 = [];
        this.tableau3 = [];
        this.tableau4 = [];
        this.tableau5 = [];
        this.tableau6 = [];
        this.tableau7 = [];
    }

    generateDeck(): void {
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Ace));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Two));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Three));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Four));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Five));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Six));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Seven));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Eight));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Nine));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Ten));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Jack));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.Queen));
        this.deckStock.push(new Card(CardSuit.Clubs, CardNumber.King));

        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Ace));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Two));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Three));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Four));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Five));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Six));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Seven));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Eight));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Nine));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Ten));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Jack));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.Queen));
        this.deckStock.push(new Card(CardSuit.Diamonds, CardNumber.King));

        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Ace));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Two));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Three));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Four));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Five));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Six));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Seven));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Eight));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Nine));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Ten));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Jack));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.Queen));
        this.deckStock.push(new Card(CardSuit.Hearts, CardNumber.King));

        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Ace));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Two));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Three));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Four));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Five));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Six));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Seven));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Eight));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Nine));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Ten));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Jack));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.Queen));
        this.deckStock.push(new Card(CardSuit.Spades, CardNumber.King));
    }

    fisherYatesShuffle(): void {
        for (let i = this.deckStock.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deckStock[i], this.deckStock[j]] = [this.deckStock[j], this.deckStock[i]];
        }
    }

    placeInitialCards() : void {
        this.tableau1.push(this.deckStock.pop()!);
    
        this.tableau2.push(this.deckStock.pop()!);
        this.tableau2.push(this.deckStock.pop()!);
    
        this.tableau3.push(this.deckStock.pop()!);
        this.tableau3.push(this.deckStock.pop()!);
        this.tableau3.push(this.deckStock.pop()!);
        
        this.tableau4.push(this.deckStock.pop()!);
        this.tableau4.push(this.deckStock.pop()!);
        this.tableau4.push(this.deckStock.pop()!);
        this.tableau4.push(this.deckStock.pop()!);
    
        this.tableau5.push(this.deckStock.pop()!);
        this.tableau5.push(this.deckStock.pop()!);
        this.tableau5.push(this.deckStock.pop()!);
        this.tableau5.push(this.deckStock.pop()!);
        this.tableau5.push(this.deckStock.pop()!);
    
        this.tableau6.push(this.deckStock.pop()!);
        this.tableau6.push(this.deckStock.pop()!);
        this.tableau6.push(this.deckStock.pop()!);
        this.tableau6.push(this.deckStock.pop()!);
        this.tableau6.push(this.deckStock.pop()!);
        this.tableau6.push(this.deckStock.pop()!);
    
        this.tableau7.push(this.deckStock.pop()!);
        this.tableau7.push(this.deckStock.pop()!);
        this.tableau7.push(this.deckStock.pop()!);
        this.tableau7.push(this.deckStock.pop()!);
        this.tableau7.push(this.deckStock.pop()!);
        this.tableau7.push(this.deckStock.pop()!);
        this.tableau7.push(this.deckStock.pop()!);
    }

    setUpInitialCardOrientations() {
        this.tableau1.at(-1)!.flip();
        this.tableau2.at(-1)!.flip();
        this.tableau3.at(-1)!.flip();
        this.tableau4.at(-1)!.flip();
        this.tableau5.at(-1)!.flip();
        this.tableau6.at(-1)!.flip();
        this.tableau7.at(-1)!.flip();

        this.tableau1.at(-1)!.unlock();
        this.tableau2.at(-1)!.unlock();
        this.tableau3.at(-1)!.unlock();
        this.tableau4.at(-1)!.unlock();
        this.tableau5.at(-1)!.unlock();
        this.tableau6.at(-1)!.unlock();
        this.tableau7.at(-1)!.unlock();

        for (let i = 0; i < this.deckStock.length; i++) {
            this.deckStock[i].unlock();
            this.deckStock[i].flip();
        }
    }

    toggleDifficulty(): void {
        if (this.difficulty === KlondikeDifficulty.Easy) {
            this.difficulty = KlondikeDifficulty.Hard;
        } else {
            this.difficulty = KlondikeDifficulty.Easy;
        }
    }

    draw(): void {
        if(this.deckStock.length === 0 && this.deckWaste.length !== 0) {
            while (this.deckWaste.length > 0)
            {
                this.deckStock.push(this.deckWaste.pop()!);
            }
        } else {
            if (this.difficulty === KlondikeDifficulty.Hard) {
                if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
                if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
                if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
            } else {
                if (this.deckStock.length > 0) this.deckWaste.push(this.deckStock.pop()!);
            }
        }
    }

    test_isSolvable(): boolean {
        let tB: KlondikeBoard = new KlondikeBoard();
        this.test_copyBoardValues(tB);
        let moveMade = false;
        let cycleCounter = 0;

        do {
            moveMade = false;

            if (this.test_moveKingToEmpty(tB)) {
                moveMade = true;
                continue;
            }
            if (this.test_moveWithinTableau(tB)) {
                moveMade = true;
                continue;
            }
            if (this.test_moveToFoundation(tB)) {
                moveMade = true;
                continue;
            }
            if (this.test_cycleStock(tB, cycleCounter)) {
                moveMade = true;
                continue;
            }
        } while (moveMade && cycleCounter < 150);
        return this.test_isSolved(tB);
    }

    test_copyBoardValues(tB: KlondikeBoard): void {
        tB.foundationClubs = [...this.foundationClubs];
        tB.foundationDiamonds = [...this.foundationDiamonds];
        tB.foundationHearts = [...this.foundationHearts];
        tB.foundationSpades = [...this.foundationSpades];

        tB.deckStock = [...this.deckStock];
        tB.deckWaste = [...this.deckWaste];
    
        tB.tableau1 = [...this.tableau1];
        tB.tableau2 = [...this.tableau2];
        tB.tableau3 = [...this.tableau3];
        tB.tableau4 = [...this.tableau4];
        tB.tableau5 = [...this.tableau5];
        tB.tableau6 = [...this.tableau6];
        tB.tableau7 = [...this.tableau7];
    }

    test_moveToFoundation(tB: KlondikeBoard): boolean {
        const tab1L = tB.tableau1.length;
        const tab2L = tB.tableau2.length;
        const tab3L = tB.tableau3.length;
        const tab4L = tB.tableau4.length;
        const tab5L = tB.tableau5.length;
        const tab6L = tB.tableau6.length;
        const tab7L = tB.tableau7.length;

        let foundationDest: Card[] = [];

        if (tab1L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau1[tab1L - 1]);
            if (foundationDest.length === 0 && tB.tableau1[tab1L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau1.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau1[tab1L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau1.pop()!);
                return true;
            }
        }

        if (tab2L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau2[tab2L - 1]);
            if (foundationDest.length === 0 && tB.tableau2[tab2L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau2.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau2[tab2L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau2.pop()!);
                return true;
            }
        }

        if (tab3L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau3[tab3L - 1]);
            if (foundationDest.length === 0 && tB.tableau3[tab3L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau3.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau3[tab3L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau3.pop()!);
                return true;
            }
        }

        if (tab4L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau4[tab4L - 1]);
            if (foundationDest.length === 0 && tB.tableau4[tab4L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau4.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau4[tab4L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau4.pop()!);
                return true;
            }
        }

        if (tab5L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau5[tab5L - 1]);
            if (foundationDest.length === 0 && tB.tableau5[tab5L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau5.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau5[tab5L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau5.pop()!);
                return true;
            }
        }

        if (tab6L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau6[tab6L - 1]);
            if (foundationDest.length === 0 && tB.tableau6[tab6L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau6.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau6[tab6L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau6.pop()!);
                return true;
            }
        }

        if (tab7L != 0) {
            foundationDest = this.test_findFoundationDest(tB, tB.tableau7[tab7L - 1]);
            if (foundationDest.length === 0 && tB.tableau7[tab7L - 1].number === CardNumber.Ace) {
                foundationDest.push(tB.tableau7.pop()!);
                return true;
            }
            if (foundationDest.length != 0 && tB.tableau7[tab7L - 1].number - foundationDest[foundationDest.length - 1].number === 1) {
                foundationDest.push(tB.tableau7.pop()!);
                return true;
            }
        }
        return false;
    }

    test_findFoundationDest(tB: KlondikeBoard, card: Card): Card[] {
        let foundationDest: Card[] = [];
        switch (card.suit) {
            case CardSuit.Clubs:
                foundationDest = tB.foundationClubs;
                break;
            case CardSuit.Diamonds:
                foundationDest = tB.foundationDiamonds;
                break;
            case CardSuit.Hearts:
                foundationDest = tB.foundationHearts;
                break;
            case CardSuit.Spades:
                foundationDest = tB.foundationSpades;
                break;
        }
        return foundationDest;
    }

    test_moveKingToEmpty(tB: KlondikeBoard): boolean {
        let kingOrigin: Card[] | null = null;
        let kingCard: Card | null = null;
        let kingIndex: number | null = null;
        let emptyTableau: Card[] | null = null;

        this.test_findKing(tB, kingOrigin, kingCard, kingIndex);
        this.test_findEmptyTableau(tB, emptyTableau);

        if (kingOrigin === null || kingCard === null || kingIndex === null || emptyTableau === null) {
            return false;
        } else {
            this.test_moveCards(kingOrigin, emptyTableau, kingIndex);
            return true;
        }
    }

    test_findKing(tB: KlondikeBoard, kingOrigin: Card[] | null, kingCard: Card | null, kingIndex: number | null): void {

        for (let i = 0; i < tB.tableau1.length; i++) {
            if (tB.tableau1[i].number === CardNumber.King) {
                kingOrigin = tB.tableau1;
                kingCard = tB.tableau1[i];
                kingIndex = i;
                return;
            }
        }

        for (let i = 0; i < tB.tableau2.length; i++) {
            if (tB.tableau2[i].number === CardNumber.King) {
                kingOrigin = tB.tableau2;
                kingCard = tB.tableau2[i];
                kingIndex = i;
                return;
            }
        }

        for (let i = 0; i < tB.tableau3.length; i++) {
            if (tB.tableau3[i].number === CardNumber.King) {
                kingOrigin = tB.tableau3;
                kingCard = tB.tableau3[i];
                kingIndex = i;
                return;
            }
        }

        for (let i = 0; i < tB.tableau4.length; i++) {
            if (tB.tableau4[i].number === CardNumber.King) {
                kingOrigin = tB.tableau4;
                kingCard = tB.tableau4[i];
                kingIndex = i;
                return;
            }
        }

        for (let i = 0; i < tB.tableau5.length; i++) {
            if (tB.tableau5[i].number === CardNumber.King) {
                kingOrigin = tB.tableau5;
                kingCard = tB.tableau5[i];
                kingIndex = i;
                return;
            }
        }

        for (let i = 0; i < tB.tableau6.length; i++) {
            if (tB.tableau6[i].number === CardNumber.King) {
                kingOrigin = tB.tableau6;
                kingCard = tB.tableau6[i];
                kingIndex = i;
                return;
            }
        }

        for (let i = 0; i < tB.tableau7.length; i++) {
            if (tB.tableau7[i].number === CardNumber.King) {
                kingOrigin = tB.tableau7;
                kingCard = tB.tableau7[i];
                kingIndex = i;
                return;
            }
        }

        return;
    }

    test_findEmptyTableau(tB: KlondikeBoard, emptyTableau: Card[] | null): void {
        if (tB.tableau1.length > 0) {
            emptyTableau = tB.tableau1;
            return;
        }
        if (tB.tableau2.length > 0) {
            emptyTableau = tB.tableau2;
            return;
        }
        if (tB.tableau3.length > 0) {
            emptyTableau = tB.tableau3;
            return;
        }
        if (tB.tableau4.length > 0) {
            emptyTableau = tB.tableau4;
            return;
        }
        if (tB.tableau5.length > 0) {
            emptyTableau = tB.tableau5;
            return;
        }
        if (tB.tableau6.length > 0) {
            emptyTableau = tB.tableau6;
            return;
        }
        if (tB.tableau7.length > 0) {
            emptyTableau = tB.tableau7;
            return;
        }
    
        return;
    }

    test_moveCards(source: Card[], dest: Card[], sourceIndex: number): void {
        let temp: Card[] = source.slice(sourceIndex);
        let moveCount = temp.length;
        let originCount = source.length;
        for (let i = 0; i < temp.length; i++) {
            dest.push(temp[i]);
        }
        source.splice(originCount - moveCount, moveCount);
        return;
    }

    test_moveWithinTableau(tB: KlondikeBoard): boolean {
        return false;
    }


    test_cycleStock(tB: KlondikeBoard, counter: number): boolean {
        counter++;
        return false;
    }

    test_isSolved(tB: KlondikeBoard): boolean {
        return false;
    }


    
}