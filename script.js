//GLOBALS
let deck = [];
// dealer will always be at index 0 for players.

let dealer = { name: "dealer", cards: [], value: 0, win: false };
const players = [
    { name: "player1", cards: [], value: 0, win: false },
    { name: "player2", cards: [], value: 0, win: false },
];
let playerTurn = null;
let mode = "START_GAME";

let currentPlayer = null;
let currentPlayerIndex = 0;

const createDeck = () => {
    // function that creates deck of 52 cards of each suit and card
    // returns a list of cards
    var deck = [];
    var cards = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];
    var suits = ["♠️", "❤", "♣️", "♦️"];

    suits.forEach((suit) => {
        cards.forEach((card) => {
            if (card === "J" || card === "Q" || card === "K") {
                var value = 10;
            } else if (card === "A") {
                var value = [1, 11];
            } else {
                var value = Number(card);
            }
            deck.push({ card: card, suit: suit, value: value });
        });
    });

    return deck;
};

const shuffleDeck = (deck) => {
    let counter = deck.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter -= 1;

        let tempVar = deck[counter];
        deck[counter] = deck[index];
        deck[index] = tempVar;
    }
    return deck;
};

const dealCards = () => {
    const cardsDealtAtStart = 2;
    let counter = 0;

    // add dealer as one of the players in the game
    // dealer added to end of the array as he will be the last to play
    players.push(dealer);

    for (let i = 0; i < cardsDealtAtStart; i++) {
        players.forEach((player) => {
            var card = deck[counter];

            //remove card from deck
            var cardIndex = deck.indexOf(card);
            if (cardIndex > -1) {
                deck.splice(cardIndex, 1);
            }

            //add card to player hand
            player.cards.push(card);
            player.value = calculateCardsValue(player.cards);
            counter += 1;
        });
    }
};

const calculateCardsValue = (cards) => {
    var totalValue = 0;
    cards.forEach((card) => {
        var value = card.value;
        //handle ace logic
        //TODO: when to give 1 or 11 for aces
        if (card.card === "A") {
            value = 11;
        }
        totalValue += value;
    });
    return totalValue;
};

const checkIfBlackjack = () => {
    // this function is only called during the first round and
    // all players are checked to see if their cards have a value of 21
    // if so, they're assigned the win property
    // if the dealer gets 21, the game endsÎ
    dealer = players.filter((player) => player.name === "dealer")[0];
    var playersExcludingDealer = players.filter(
        (player) => player.name !== "dealer"
    );
    playersExcludingDealer.forEach((player) => {
        if (player.value === 21) {
            player.win = true;
        }
    });

    if (dealer.value === 21) {
        dealer.win = true;
        // end game
    }
};

const endGameAndGenerateSummary = () => {

    //play dealer's hand 

    //indicate if player has won or lost

    return '<div> game end</div>'
};

const hit = (player) => {
    //give card to player from top of deck
    var card = deck[0];


    //remove card from deck
    var cardIndex = deck.indexOf(card);
    if (cardIndex > -1) {
        deck.splice(cardIndex, 1);
    }
    player.cards.push(card);
    player.value = calculateCardsValue(player.cards);
};

const stand = () => {
    //move on to next player
    currentPlayerIndex += 1;
    currentPlayer = players[currentPlayerIndex];

    // if no players left, move to dealer's turn
};

const generatePlayingView = (player) => {
    console.log(player);
    const dealerHand = dealer.cards
        .map((card) => card.card + card.suit)
        .toString();

    const playerHand = player.cards
        .map((card) => card.card + card.suit)
        .toString();
    return (
        "<div style='border: 1px solid'>" +
        "Dealer Hand " +
        dealerHand +
        "<br>" +
        `${player.name} Hand ` +
        playerHand +
        "<br>" +
        "</div>"
    );
};

const main = (input) => {
    if (mode === "START_GAME") {
        deck = shuffleDeck(createDeck());
        dealCards();
        // check if blackjack, if dealer blackjack game ends,
        checkIfBlackjack();
        console.log("created");

        currentPlayer = players[currentPlayerIndex];

        mode = "PLAYERS_TURN";
        return generatePlayingView(currentPlayer);
    } else if (mode === "PLAYERS_TURN") {
        console.log(currentPlayer);
        if (input === "hit") {
            hit(currentPlayer);
        } else if (input === "stand") {
            stand();
        }

        //checks if all players have played their hand and moves on to the dealer's 
        //hand
        // if last player, play the dealer's hand and generate a win lose report
        if (currentPlayerIndex === players.length -1){
            return endGameAndGenerateSummary()
        } 
        return generatePlayingView(currentPlayer);

        // let playersLeft = players.length - 1;
        // if (currentPlayerIndex !== playersLeft) {
        //     return generatePlayingView(currentPlayer);
        // }
    } 

};
