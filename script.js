//GLOBALS
var deck = [];
var players = [{name: "dealer", cards:[], value:0}, { name: "player1", cards: [], value:0 }];
var playerTurn = null;
var mode = null;

// function that creates deck of 52 cards of each suit and card
// returns a list of cards
var createDeck = function () {
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

    suits.forEach(function (suit) {
        cards.forEach(function (card) {
            deck.push(card + suit);
        });
    });

    return deck;
};

var shuffleDeck = function (deck) {
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

var dealCards = function () {
    var cardsDealtAtStart = 2;
    var counter = 0;

    for (let i = 0; i < cardsDealtAtStart; i++) {
        players.forEach(function (player) {
            var card = deck[counter]

            //remove card from deck
            var cardIndex = deck.indexOf(card)
            if (cardIndex > -1){
                deck.splice(cardIndex, 1)
            }

            //add card to player hand
            player.cards.push(card);
            counter += 1;
        });
    }
};

var hit = function(player) {
     console.log('hit')
}

var main = function (input) {
    if (mode === null) {
        console.log("starting game");
        deck = shuffleDeck(createDeck());
        dealCards();
        console.log(deck.length)
        return (
            'Dealer\'s Hand' +
            `${players[0].cards}` + 
            '<br>' +
            `${players[1].name}\'s' Hand` +
            `${players[1].cards}`  
        )
        // check if blackjack, if dealer blackjack game ends, 
    } else if (mode === "PLAYERS_TURN") {

    }
};
