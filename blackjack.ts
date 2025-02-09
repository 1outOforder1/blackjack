import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Card {
    suit: string;
    value: string;

    constructor(suit: string, value: string){
        this.suit = suit;
        this.value = value;
    }

    // get point value of card
    getPoints(): number {

        // value of ace is 11
        if (this.value ==='Ace') {
            return 11; // ace will be worth 11
        }

        // face cards worth 10
        if (this.value === "Jack" || this.value === "Queen" || this.value === "King") {
            return 10; // convert value to string
        }

        // for numeric cards
        return parseInt(this.value);
    }
}

// this sets up the deck, shuffling, and dealing
class Deck {

    cards: Card[] = []; // property of Deck that stores Card objects

    constructor() {
        const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]; // all the suits
        const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"]; // all possible values

        for (let suit of suits) { // loop goees through each suit
            for (let value of values) { // loop goes through each value
                this.cards.push(new Card(suit, value)); // for each combo, create a card and push it onto deck
            }
        }
    }

    // this uses the fisher-yates shuffle, found someone doing this online
    shuffleDeck() {

        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // swap cards around
        }
    }

    dealCard(): Card | undefined { 
        return this.cards.pop(); // removes and returns top card (or undefined if empty)
    }  
}

class Player {
    
    hand: Card[] = []; // stores player's cards

    constructor() {}

    // adds a card to the player's hand
    addCard(card: Card) {
        this.hand.push(card);
    }

    // calculates the player's current score
    getScore(): number {
        let score = 0;
        let aceCount = 0;

        // loop through each card in hand
        for (let card of this.hand) {
            score += card.getPoints(); // add card value to the score
            if (card.value === "Ace") {
                aceCount++; // track the aces
            }
        }

        // in case the score is over 21, this will make the aces be worth 1 instead of 11
        while (score > 21 && aceCount> 0) {
            score -= 10; // subtract 10 from the score 
            aceCount--;  // take an ace away from the count since we already subtracted
        }

        return score;
    }
}

// takes functionality of Player but with playTurn method for dealer
class Dealer extends Player {

    playTurn(deck: Deck) {
        while (this.getScore() < 17) { // dealer hits until score is 17+
            let card = deck.dealCard(); // get a new card from the deck
            
            if (card) {
                this.addCard(card); // adds card to dealer's hand
            }
        }
    }
}

class Game {

    deck: Deck; // the deck of cards
    player: Player; // the human player
    dealer: Dealer; // the AI dealer

    constructor() {
        this.deck = new Deck(); // creates and shuffle the deck
        this.deck.shuffleDeck();
        this.player = new Player(); // create the player
        this.dealer = new Dealer(); // create the dealer
    }


    // funciton that starts the game
    startGame() {
        // each player will start with two cards int heir hand
        this.player.addCard(this.deck.dealCard()!);
        this.player.addCard(this.deck.dealCard()!);
        this.dealer.addCard(this.deck.dealCard()!);
        this.dealer.addCard(this.deck.dealCard()!);

        // shows the dealer’s first card (second card is hidden)
        console.log("Dealer's card: ", this.dealer.hand[0]);
        console.log("The dealer's second card is hidden.");
        
        // display the player's hand and score
        console.log("")
        console.log("Your hand: ", this.player.hand);
        console.log("Your score: ", this.player.getScore());

        this.playerTurn();
    }

    // players turn
    playerTurn() {
        if (this.player.getScore() > 21) { // if player's score goes over 21, they immediately lose
            console.log("You busted. Dealer wins (womp womp).");
            return; // end turn early
        }
        
        // ask player to hit or stay
        rl.question("(h)it or (s)tay? ", (choice) => {

            choice = choice.toLowerCase() // in case the player types in capital letter

            if (choice=== "h") {
                let card = this.deck.dealCard(); // draw a new card from the deck

                if (card) {
                    this.player.addCard(card); // add card to hand
                    console.log("You got:", card); // show player new card  
                    console.log("Your new score:", this.player.getScore()); // update score
                }
                this.playerTurn(); // prompt again for next move

            } else if (choice === "s") {
                console.log("You decided to stay.");
                this.dealerTurn(); // move to dealers turn if player decides to stay

            } else {
                // in case the player enters in something other than 'h' or 's'
                console.log("Invalid choice. Please enter 'h' for hit or 's' for stay.");
                this.playerTurn(); // 
            }
        });
    }

    dealerTurn() {

        // Dealer's turn begins
        console.log("")
        console.log("Dealer's turn...");
        this.dealer.playTurn(this.deck); // dealer plays according to AI rules set in dealer class

        // show dealer’s final hand and score
        console.log("Dealer's hand:", this.dealer.hand);
        console.log("Dealer's score:", this.dealer.getScore());

        this.pickWinner(); 

    }

    pickWinner() {

        // Determine the winner based on final scores
        if (this.dealer.getScore() > 21) {
            console.log("Dealer busts. You win!"); // Dealer went over 21

        } else if (this.dealer.getScore() > this.player.getScore()) {
            console.log("Dealer wins!"); // dealer has a higher score

        } else if (this.dealer.getScore() < this.player.getScore()) {
            console.log("You win!"); // player has a higher score

        } else {
            console.log("It's a tie."); // both have the same score

        }

        rl.close();

    }   
    
}

const game = new Game();

game.startGame();


