//GLOBALS
let deck = []
let dealer = { name: 'dealer', cards: [], value: 0, win: false, bust: false }
let players = [
    { name: 'player1', cards: [], value: 0, win: false, bust: false },
    { name: 'player2', cards: [], value: 0, win: false, bust: false },
]
let playerTurn = null
let mode = 'START_GAME'

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
    var totalValue = 0
    cards.forEach(card => {
        var value = card.value
        //handle ace logic
        //TODO: when to give 1 or 11 for aces
        if (card.card === 'A') {
            value = 11
        }
        totalValue += value
    })
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
            player.win = true
        }
    })

    if (dealer.value === 21) {
        dealer.win = true
        // end game
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
    //if player hand value > 21, they should not be able to take anymore
    //cards
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
        dealer.win = false
        dealer.bust = true
    }
}

const dealerHandHTML = () => {
    return (dealerHand = dealer.cards
        .map(card => card.card + card.suit)
        .reduce((string, card) => {
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
        '<br>' +
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
        'click on submit to start playing' +
        '</div>'
    )
}

const generateEndGameView = () => {
    const dealerHand = dealerHandHTML()

    //remove dealer from players and create html version of player's hands
    players = players.splice(0, players.length - 1)
    const playersHands = players.reduce((string, player) => {
        const playerHand = playerHandHTML(player)

        string +=
            `${player.name} Hand` + '<div class="hand">' + playerHand + `${player.win}` +'</div>'
        return string
    }, '')

    // player win or lose
    players.map(player => {
        // if player alr lost , ignore
        if (!player.bust) {
            if (!dealer.bust && dealer.value > player.value) {
                player.win = false
            }
        } else {
            // can be refactored
            players.win = true
        }
        
    })

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
    if (mode === 'START_GAME') {
        deck = shuffleDeck(createDeck())
        dealCards()
        // check if blackjack, if dealer blackjack game ends,
        checkIfBlackjack()

        currentPlayer = players[currentPlayerIndex]

        mode = 'PLAYERS_TURN'
        return generatePlayingView(currentPlayer)
    } else if (mode === 'PLAYERS_TURN') {
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
            mode = 'DEALERS_TURN'
            return '<div>all players have played click submit to see a summary of the game</div>'
        }
        return generatePlayingView(currentPlayer, input)
    } else if (mode === 'DEALERS_TURN') {
        dealerTurn()
        return generateEndGameView()
    }
}

// TODO:
// 1. players dont have to type anything if they go bust or hit 21 DONE
// 2. card ui
// 3. error handling, e.g. if player type commands they're not supposed to
// 4. betting
// 5. splitting
// 6. ace logic
// 7. hide dealer hand inital
// 8. standing after last player causes an error
