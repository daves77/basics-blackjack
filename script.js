//GLOBALS
let deck = []
let dealer = { name: 'dealer', cards: [], value: 0, status: null, bust: false }
let players = [
    { name: 'player1', cards: [], value: 0, status: null, bust: false },
    { name: 'player2', cards: [], value: 0, status: null, bust: false },
]

let playerTurn = null

const MODE_DEALER_TURN = 'DEALER_TURN'
const MODE_PLAYERS_TURN = 'PLAYERS_TURN'
const MODE_START_GAME = 'START_GAME'
const MODE_SETUP_PLAYERS = 'SETUP_PLAYERS'
const MODE_PLAYERS_BET = 'SETUP_PLAYERS_BET'

let mode = MODE_START_GAME

let currentPlayer = null
let currentPlayerIndex = 0
//GLOBALS END

const createDeck = () => {
    // function that creates deck of 52 cards of each suit and card
    // returns a list of cards
    var deck = []
    var cards = [
        'A',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
    ]
    var suits = ['♠️', '♥', '♣️', '♦️']

    suits.forEach(suit => {
        cards.forEach(card => {
            if (card === 'J' || card === 'Q' || card === 'K') {
                var value = 10
            } else if (card === 'A') {
                var value = [1, 11]
            } else {
                var value = Number(card)
            }
            deck.push({ card: card, suit: suit, value: value })
        })
    })

    return deck
}

const shuffleDeck = deck => {
    let counter = deck.length
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter)
        counter -= 1

        let tempVar = deck[counter]
        deck[counter] = deck[index]
        deck[index] = tempVar
    }
    return deck
}

const dealCards = () => {
    const cardsDealtAtStart = 2
    let counter = 0

    // add dealer as one of the players in the game
    // dealer added to end of the array as he will be the last to play
    players.push(dealer)

    for (let i = 0; i < cardsDealtAtStart; i++) {
        players.forEach(player => {
            var card = deck[counter]

            //remove card from deck
            var cardIndex = deck.indexOf(card)
            if (cardIndex > -1) {
                deck.splice(cardIndex, 1)
            }

            //add card to player hand
            player.cards.push(card)
            player.value = calculateCardsValue(player.cards)
            counter += 1
        })
    }
}

const calculateCardsValue = cards => {
    // arrange cards in hand such that "A" is set to the back
    cards.forEach(card => {
        if (card.card === 'A') {
            cards.push(cards.splice(cards.indexOf(card), 1)[0])
        }
    })


    const totalValue = cards.reduce((value, card) => {
        if (card.card === "A"){
            if ((value + 11)> 21){
                value += 1
            } else {
                value += 11
            }
        } else {
            value += card.value
        }
        return value
    }, 0 )

    return totalValue
}

const checkIfBlackjack = () => {
    // this function is only called during the first round and
    // all players are checked to see if their cards have a value of 21
    // if so, they're assigned the win property
    // if the dealer gets 21, the game endsÎ
    dealer = players.filter(player => player.name === 'dealer')[0]
    var playersExcludingDealer = players.filter(
        player => player.name !== 'dealer'
    )
    playersExcludingDealer.forEach(player => {
        if (player.value === 21) {
            player.status = 'win'
        }
    })

    if (dealer.value === 21) {
        dealer.status = 'win'
        return generateEndGameView()
    }
}

const hit = player => {
    //give card to player from top of deck
    var card = deck[0]

    //remove card from deck
    var cardIndex = deck.indexOf(card)
    if (cardIndex > -1) {
        deck.splice(cardIndex, 1)
    }
    player.cards.push(card)
    player.value = calculateCardsValue(player.cards)

    if (player.value > 21) {
        player.bust = true
    }

    return player.value
}

const moveToNextPlayer = () => {
    //move on to next player
    currentPlayerIndex += 1
    currentPlayer = players[currentPlayerIndex]
    return currentPlayer
}

const dealerTurn = () => {
    while (dealer.value < 17) {
        hit(dealer)
    }
    if (dealer.value > 21) {
        dealer.status = 'lose'
        dealer.bust = true
    }
}

const dealerHandHTML = () => {
    return (dealerHand = dealer.cards
        .map(card => card.card + card.suit)
        .reduce((string, card, index) => {
            // hides the dealer's second card until the end of the game
            if (mode !== MODE_DEALER_TURN) {
                card = index === 1 ? '?' : card
            }
            string += '<div class="card">' + card + '</div>'
            return string
        }, ''))
}

const playerHandHTML = player => {
    return (playerHand = player.cards
        .map(card => card.card + card.suit)
        .reduce((string, card) => {
            string += '<div class="card">' + card + '</div>'
            return string
        }, ''))
}

const generatePlayingView = (player, input) => {
    const dealerHand = dealerHandHTML()

    const playerHand = playerHandHTML(player)

    const playerMove = input ? `${player.name} has chosen to ${input}` : ''
    //TO DO add instructions
    return (
        "<div class='output-container'>" +
        `<h1>${player.name} turn </h1>` +
        playerMove +
        '<br>' +
        'Dealer Hand ' +
        '<div class="hand">' +
        dealerHand +
        '</div>' +
        '<br>' +
        `${player.name} hand` +
        '<div class="hand">' +
        playerHand +
        '</div>' +
        `Current Value :${player.value}` +
        '<br>' +
        '<p>You can choose to either <strong>"stand" or "hit" </strong>! Enter your selection at the input form above & click submit!</p>' +
        '</div>'
    )
}

const generateActionSummaryView = (player, input) => {
    // this view is shown the player once they have decided
    // to stand or have gone bust. it summarises the cards they have

    const nextPlayer = moveToNextPlayer()

    const playerHand = playerHandHTML(player)

    return (
        '<div class="output-container">' +
        `${player.name} has decided to ${input}` +
        '<br>' +
        `${player.name} hand` +
        '<div class="hand">' +
        playerHand +
        '</div>' +
        '<br>' +
        `moving to ${nextPlayer.name}` +
        '<br>' +
        'Click on "submit" to start playing' +
        '</div>'
    )
}

const generateEndGameView = () => {
    const dealerHand = dealerHandHTML(false)

    //remove dealer from players and create html version of player's hands
    players = players.splice(0, players.length - 1)

    // checks if player wins or loses
    players
        // filters out players that have already won e.g through blackjack
        .filter(player => player.status !== 'win')
        .map(player => {
            // first check if dealer is bust
            if (dealer.bust) {
                if (!player.bust) {
                    player.status = 'win'
                } else {
                    player.status = 'push'
                }
            } else {
                if (!player.bust) {
                    if (player.value > dealer.value) {
                        player.status = 'win'
                    } else if (player.value < dealer.value) {
                        player.status = 'lose'
                    } else {
                        player.status = 'push'
                    }
                }
            }
        })
    const playersHands = players.reduce((string, player) => {
        const playerHand = playerHandHTML(player)

        string +=
            `${player.name} Hand` +
            '<div class="hand">' +
            playerHand +
            `${player.status}` +
            '</div>'
        return string
    }, '')

    //filter players that havent won yet

    return (
        '<div class="output-container">' +
        '<br>' +
        'dealer hand' +
        '<div class="hand">' +
        dealerHand +
        '</div>' +
        '<br>' +
        '<div>' +
        playersHands +
        '</div>' +
        '</div>'
    )
}

const main = input => {
    if (mode === MODE_START_GAME) {
        deck = shuffleDeck(createDeck())
        dealCards()
        // check if blackjack, if dealer blackjack game ends,
        checkIfBlackjack()

        currentPlayer = players[currentPlayerIndex]

        mode = MODE_PLAYERS_TURN
        return generatePlayingView(currentPlayer)
    } else if (mode === MODE_PLAYERS_TURN) {
        if (input === 'hit') {
            // check if player can hit
            const playerHandValue = hit(currentPlayer)

            if (playerHandValue > 21 || playerHandValue === 21) {
                return generateActionSummaryView(currentPlayer, input)
            }
        } else if (input === 'stand') {
            return generateActionSummaryView(currentPlayer, input)
        }

        //checks if all players have played their hand and moves on to the dealer's
        //hand
        // if last player, play the dealer's hand and generate a win lose report
        if (currentPlayerIndex === players.length - 1) {
            //show dealer hand first & change mode to dealer turn
            mode = MODE_DEALER_TURN
            return '<div>all players have played click submit to see a summary of the game</div>'
        }
        return generatePlayingView(currentPlayer, input)
    } else if (mode === MODE_DEALER_TURN) {
        dealerTurn()
        return generateEndGameView()
    }
}

// TODO:
// 3. error handling, e.g. if player type commands they're not supposed to
// 4. betting 
// 5. splitting
// 8. standing after last player causes an error
// 9. improve on instructions for each view
// 10. error doesnt redirect player when player gets black jack
