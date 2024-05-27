const board = document.getElementById('board')
const dealer = document.getElementById('dealer')
const dealerPlaceHolder = dealer.querySelector('.cardPlaceHolder')
const player = document.getElementById('player')
const playerPlaceHolder = player.querySelector('.cardPlaceHolder')
const userInterface = document.getElementById('userInterface')
const hit = document.getElementById('hit')
const hold = document.getElementById('hold')
const chipStack = document.getElementById('chipStacks');
const chipsDiv = document.getElementById('chips');
const chipsTotal = document.getElementById('chipsTotal')
const betValue = document.getElementById('betValue')
const betSize = document.getElementById('betSize')
const betBtn = document.getElementById('betBtn')
const playerScore = document.getElementById('playerScore')
const dealerScore = document.getElementById('dealerScore')


const RANKS = [2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K', 'A']
const SUITS = ['hearts', 'diamonds', 'spades', 'clubs']
let DECK = []
let playerCards = []
let dealerCards = []
let currentBet = 0

let playerTotal = 0
let dealerTotal = 0

let clickable = false
let playerTurn = true
let bettingPhase = true

const boardWidth = 275
const cardWidth = boardWidth/5
const cardHeight = cardWidth * 1.5
let cardIndex = 1000;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createDeck() {
  let newDeck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push({
        rank: rank,
        suit: suit
      })
    }
  }
  return newDeck
}

function removeFromDeck(elem, array) {
  array.splice(array.indexOf(elem), 1)
}

function randomIndex(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return randomIndex
}

function changeCardLabel(textData, colorData, cardLabelsArray) {
  cardLabelsArray.forEach(label => {
    label.innerHTML = textData;
    label.style.color = colorData;
  })
}

function loadCardRank(cardData) {
  const cardLabels = cardData[0].querySelectorAll('.cardLabel')

  switch(cardData[1].suit) {
    case 'spades':
     changeCardLabel(`${cardData[1].rank}&#9824`, 'black', cardLabels);
      break;
    case 'clubs':
      changeCardLabel(`${cardData[1].rank}&#9827;`, 'black', cardLabels);
      break;
    case 'hearts':
      changeCardLabel(`${cardData[1].rank}&#9829;`, 'red', cardLabels);
      break;
    case 'diamonds':
      changeCardLabel(`${cardData[1].rank}&#9830;`, 'red', cardLabels);
      break;
  }
}

function getRandomCard() {
  let randomCard = DECK[randomIndex(DECK)]
  removeFromDeck(randomCard, DECK)
  return randomCard
}

function createCardLabel(className, frontDiv, labelFrame) {
  const labelDiv = document.createElement('div')
  const label = document.createElement('p')
  label.classList.add('cardLabel')
  labelDiv.classList.add('labelDiv')
  labelDiv.classList.add(className)
  labelDiv.appendChild(label)
  labelFrame.appendChild(labelDiv)
  frontDiv.appendChild(labelFrame)
}

function createCardFront() {
  const front = document.createElement('div')
  front.classList.add('frontCard')
  front.classList.add('hide')
  
  const labelFrame = document.createElement('div')
  labelFrame.classList.add('labelFrame')
  createCardLabel('top', front, labelFrame)
  createCardLabel('bottom', front, labelFrame)

  return front
}


function createCard(playerArray, parent, width, height ) {
  const card = document.createElement('div');
  card.classList.add('card');

  const frontOfCard = createCardFront()

  const backOfCard = document.createElement('div')
  backOfCard.classList.add('backCard')
  backOfCard.classList.add('show')
  
  card.appendChild(frontOfCard)
  card.appendChild(backOfCard)

  if (width != null) {
    card.style.width = `${width}px`;
    card.style.height = `${height}px`;
  }

  const cardDiv = document.createElement('div')
  cardIndex++
  cardDiv.style.zIndex = cardIndex
  cardDiv.classList.add('cardDiv')
  cardDiv.style.opacity = 0
  cardDiv.appendChild(card)
  parent.appendChild(cardDiv)

  const randomCard = getRandomCard(DECK)
  cardDiv.dataset.suit = randomCard.suit
  cardDiv.dataset.rank = randomCard.rank
  const cardData = [cardDiv, randomCard] 
  
  loadCardRank(cardData)
  playerArray.push(cardData)
  return cardData
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showHide(elem) {
  if (elem.classList.contains('show')) {
    elem.classList.remove('show')
    elem.classList.add('hide')
  }
  else {
    elem.classList.remove('hide')
    elem.classList.add('show')
  }
}


function addCardFlip(cardDiv) {
  const front = cardDiv.querySelector('.frontCard')
  const back = cardDiv.querySelector('.backCard')
  cardDiv.parentNode.style.pointerEvents = 'all'
  cardDiv.classList.contains('flip') ? cardDiv.classList.remove('flip') :  cardDiv.classList.add('flip')
  setTimeout(() => {
    showHide(front)
    showHide(back)
  }, 300) 
}

function positionCardLeft(playerArray, cardDiv, parent) {
  if (playerArray.length < 5){
    let endPosition1 = (((cardWidth) * playerArray.indexOf(cardDiv)))
    slideIn(cardDiv[0], endPosition1 + 5, endPosition1, 'left', -1)
  }
  else {
    let parentData = window.getComputedStyle(parent)
    let cardSize = Number(parentData.getPropertyValue("width").replace("px", "")) / playerArray.length;
    playerArray.forEach(elem => {
      elem[0].style.width = `${cardSize}px`
      elem[0].style.height = `${(cardSize/2) + cardSize}px`
      let endPosition = ((cardSize) * playerArray.indexOf(elem))
      slideIn(elem[0], endPosition, endPosition, 'left', -1)
      //elem.parentNode.style.left = `${((cardSize) * cardDivArray.indexOf(elem))}px` 
      const labels = elem[0].querySelectorAll('.cardLabel') //querySelector('.frontCard')
      labels.forEach(label => {label.style.fontSize = '10px'; label.parentNode.style.width = "10px"; label.parentNode.style.height = "10px"; })
    })
  }
}


function dealCards(playerArray, parent, numCards, flipBool) {
  for (let i = 0; i < numCards; i++) {
    const newCard = createCard(playerArray, parent)
    setTimeout(() => {
      fadeIn(newCard[0], .05, 20)
      positionCardLeft(playerArray, newCard, parent)
      setTimeout(() => {
        if (flipBool) {
          addCardFlip(newCard[0])
        }
      }, 400)
    }, 100 * i)
    
    
  }
}


function deal() {
  setTimeout(() => {
    dealCards(playerCards, player, 2, true);
    dealCards(dealerCards, dealer, 1, false);
    dealCards(dealerCards, dealer, 1, true);
    returnTotal()
    returnBoolChecks()
  }, 1100)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function returnTotal() {
  playerTotal = countCardValues(playerCards)
  dealerTotal = countCardValues(dealerCards)
  updateScoreDiv()
}

function countCardValues(array) {
  let handValue = 0
  let currentTotal = 0

  array.forEach(item => {
    if (item[1].rank == 'A') {
      array.splice(array.indexOf(item), 1)
      array.push(item)
    }
  })
  array.forEach(elem => {
    handValue += convertFaceCard(elem[1].rank, currentTotal)
    currentTotal = handValue
  })
  return handValue
}

function convertFaceCard(elem, total) {
  let cardValue 
  switch(elem) {
    case "K":
    case "Q":
    case "J":
      cardValue = 10;
      break;
    case "A":
      if (total >= 11) {
        cardValue = 1;
      }
      else {
        cardValue= 11
      }
      break;
    default:
      cardValue = Number(elem);
      break;
  }
  return cardValue 
}



function updateScoreDiv() {
  playerScore.textContent = playerTotal
  if (playerTurn == false) {
    dealerScore.textContent = dealerTotal
  }
  else {
    let singleCard = convertFaceCard(dealerCards[1][1].rank , 0)
    dealerScore.textContent = singleCard
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkBlackJack(num) {
  if (num == 21) {
    return true
  }
  else {
    return false
  }
}

function checkLose(num) {
  if (num > 21) {
    return true
  }
  else {
    return false
  }
}

function returnBoolChecks() {
  playerBlackJack =  checkBlackJack(countCardValues(playerCards))
  dealerBlackJack =  checkBlackJack(countCardValues(dealerCards))

  playerLose = checkLose(countCardValues(playerCards))
  dealerLose = checkLose(countCardValues(dealerCards))
}


function checkDealer17(num) {
  if (playerTotal > 21 || num > playerTotal) {
    return true
  }
  else if (num < 17) {
    return false
  }
  else {
    if (playerTotal <= 21 && playerTotal >= num && num != 21) {
      return false
    }
    else {
      return true
    }
  }
}


function createNotifications(parent, blackJack, youLose, total) {
  if (blackJack) {
    notification('Blackjack!', parent, '#47F5A1', 1000)
  }
  else if (youLose) {
    notification(`Busted with ${total}`, parent, '#F55C47', 800)
  }
  else {
    notification(`Total is ${total}`, parent, '#47F5A1', 800)
  }
}


function checkWinner() {
  if (checkLose(playerTotal) == false) {
    if (checkBlackJack(playerTotal)) {
      if (checkBlackJack(dealerTotal)) {
        winChips(true)
        turnNotification(`You Win! You both have blackjack!`, board, `New Turn`, `Quit`, '#47F5A1')
        
      }
      else {
        winChips(true)
        turnNotification(`You Win! You have blackjack!`, board, `New Turn`, `Quit`, '#47F5A1')
      }
    }
    else if (checkBlackJack(dealerTotal) && checkBlackJack(playerTotal) == false) {
      winChips(false)
      turnNotification(`You Lose! Dealer has blackjack!`, board, `New Turn`, `Quit`, '#F55C47')
    }
    else if (checkLose(dealerTotal)){
      winChips(true)
      turnNotification(`You Win! You have ${playerTotal}!`, board, `New Turn`, `Quit`, '#47F5A1')
    }
    else {
      if (playerTotal >= dealerTotal) {
        winChips(true)
        turnNotification(`You Win! You have ${playerTotal}!`, board, `New Turn`, `Quit`, '#F55C47')
      }
      else {
        winChips(false)
        turnNotification(`You Lose! Dealer has ${dealerTotal}!`, board, `New Turn`, `Quit`, '#F55C47')
      }
    }
  }
  else {
    if (checkLose(playerTotal)) {
      winChips(false)
      turnNotification(`You Busted!`, board, `New Turn`, `Quit`, '#F55C47')
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function newTurn() {
  reset()
  playerTurn = false
  bettingPhase = true
  betValue.innerHTML = "???"

  notification(`Make a bet!`, board, '#47F5A1', 800)
  setTimeout(() => {
    flashingButton3(betBtn)
  }, 1000)
}

function startGame() {
  newTurn()
  totalChips = 1000
  currentBet = 0
  chipsTotal.innerHTML = 1000
  DECK = createDeck()

  setTimeout(() => {
    showHide(userInterface)
    showHide(chipsDiv)
    showHide(playerScore)
    showHide(dealerScore)
    fadeInMultiple([chipsDiv, playerScore, dealerScore, userInterface,], .05, 20)
  }, 1000)
}


function startGameButton() {
  const startGameBtn = document.createElement('button')
  startGameBtn.classList.add('startGame')
  startGameBtn.innerHTML = 'Start New Game?'
  board.appendChild(startGameBtn)

  startGameBtn.addEventListener('click', (e) => {
    startGame()
    startGameBtn.remove()
  })

}

function reset() {
  DECK = createDeck()
  playerCards = []
  dealerCards = []
  playerTotal = 0
  dealerTotal = 0
  clickable = false
  currentBet = 0
  dealerScore.textContent = 0
  playerScore.textContent = 0
  cardIndex = 1000;
  betSize.value = '5'
  
  const cardTemp = document.querySelector('.cardDiv')
  if (cardTemp != undefined) {
    const position = getComputedStyle(cardTemp).bottom.replace('px', '')
    fadeOutMultiple(document.querySelectorAll('.cardDiv'), 200, position, position - 50, true)
  }

  document.querySelectorAll('.turnMessage').forEach(elem => {
    elem.remove()
  })

  document.querySelectorAll('.message').forEach(elem => {
    elem.remove()
  })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addChips(x, max, chipNumber) {
  const colors = ['red', 'black', 'orange']
  let randomY = 0

  for (let i = 0; i <= chipNumber; i++) {
    let randomColor = Math.floor(Math.random() * colors.length)
    randomY += 20
    if (randomY >= max) {
      randomY = 0
    }
    
    let newChip = document.createElement('div')
    newChip.classList.add('chip')
    newChip.style.backgroundColor = colors[randomColor]
    newChip.style.bottom = `${randomY}%`
    newChip.style.right = `${x}%`
    chipStack.appendChild(newChip);
    
  }
}


function winChips(bool) {
  if (bool == true ) {
    totalChips += currentBet
    chipsTotal.innerHTML = totalChips
  }
  else if (bool == false) {
    totalChips -= currentBet
    chipsTotal.innerHTML = totalChips
    if (totalChips <= 0) {
      notification(`You ran out of money! Restart!`, board, '#F55C47', 3000)
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function turnHoleCard() {
  const holeCard = dealer.querySelector('.cardDiv') 
  if (holeCard.querySelector('.frontCard').classList.contains('hide')) {
    setTimeout(() => {
      addCardFlip(holeCard, holeCard.querySelector('.frontCard'), holeCard.querySelector('.backCard'))
    }, 200)
  }
}


function dealerTurn() {
  clickable = false
  turnHoleCard()
  playerTurn = false;
  flashingButton4(hit)
  flashingButton4(hold)

  setTimeout(() => {
    let dealerMove = setInterval(() => {
      returnTotal()
      returnBoolChecks()
      if (checkDealer17(countCardValues(dealerCards)) == false) {
        if (dealerBlackJack == false && dealerLose == false) { 
          dealCards(dealerCards, dealer, 1, true);
          returnTotal()
          returnBoolChecks()
        }
      }
      else {     
        checkWinner()
        createNotifications(dealer, dealerBlackJack, dealerLose, dealerTotal)
        clearInterval(dealerMove)
      }
    }, 350)
    
  }, 700)
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addChips(0, 1, 1); 
addChips(37, 1, 1); 
addChips(74, 1, 1);
addChips(108, 1, 1);

betBtn.addEventListener('click', (e) => {
  if (bettingPhase == true) {
    if (betSize.value <= totalChips) {
      betValue.innerHTML = betSize.value
      currentBet = Number(betSize.value)
      playerTurn = true
      clickable = true
      bettingPhase = false
      removeAllMessages()
      notification(`You bet ${currentBet}`, board, '#47F5A1', 800)
      flashingButton(betSize)
      flashingButton3(betBtn)
      
      deal()
      setTimeout(() => {
        flashingButton4(hit)
        flashingButton4(hold)
      },1000)
    }
    else {
      notification(`Not enough chips!`, board, '#F55C47', 800)
    }
  }
  else {
    notification(`Betting is over. Wait for next turn!`, board, '#F55C47', 800)
  }
})



hit.addEventListener('click', (e) => {
  if (clickable == true) {
    returnTotal()
    returnBoolChecks()
    if (playerBlackJack == false && playerLose == false) {
      dealCards(playerCards, player, 1, true);
      returnTotal()
      returnBoolChecks()

      if (playerBlackJack || playerLose) {
        createNotifications(player, playerBlackJack, playerLose, playerTotal)
        dealerTurn()
      }
    }
    else {
      createNotifications(player, playerBlackJack, playerLose, playerTotal)
      dealerTurn()
    }
  }
  else {
    if (bettingPhase == true) {
      notification(`Make a bet to start!`, board, '#F55C47', 800)
    }
    else {
      notification(`Wait till next hand!`, board, '#F55C47', 800)
    }
  }
})



hold.addEventListener('click', (e) => {
  if (clickable == true) {
    returnTotal()
    returnBoolChecks()
    createNotifications(player, playerBlackJack, playerLose, playerTotal)
    dealerTurn()
  }  
  else {
    if (bettingPhase == true) {
      notification(`Make a bet to start!`, board, '#F55C47', 800)
    }
    else {
      notification(`Wait till next hand!`, board, '#F55C47', 800)
    }
  }
})



window.addEventListener('load', (e) => {
  startGameButton()
}) 




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function slideIn(elem, startPosition, endPosition, direction, increment) {
  let position = startPosition
  let directionOption = direction.toString()
  let slideI = setInterval(() => {
    position += increment //1
    elem.style[directionOption] = `${position}px`
    if (position <= endPosition) {
      clearInterval(slideI)
    }
  }, 20)
}



function fadeIn(elem, increment, interval) {
  let opacity = 0
  let fadeI = setInterval(() => {
    opacity += increment//.05
    elem.style.opacity = opacity
    if (elem.style.opacity >= 1) {
      clearInterval(fadeI)
    } 
  }, interval) //20
}


function fadeInMultiple(array, increment, interval) {
  let opacity = 0
  let fadeI = setInterval(() => {
    opacity += increment//.05
    for (const elem of array) {elem.style.opacity = opacity}
    if (opacity >= 1) {
      clearInterval(fadeI)
    } 
  }, interval) //20
}

function fadeOut(elem, speed, startPosition, endPosition, bool) {
  setTimeout(() => {
    let opacity = 1
    let bottom = startPosition
    
    let fadeO = setInterval(() => {
      opacity -= .05
      elem.style.opacity = opacity

      if (bottom >= endPosition) {
        bottom -= 1
        elem.style.bottom = `${bottom}px`
      }

      if (elem.style.opacity <= 0) {
        if (bool === true) {
          elem.remove()
        }
        clearInterval(fadeO)
      } 
    }, 20)
  }, speed)
}



function fadeOutMultiple(array, speed, startPosition, endPosition, bool) {
  setTimeout(() => {
    let opacity = 1
    let bottom = startPosition
    
    let fadeO = setInterval(() => {
      opacity -= .05

      for (const elem of array) {
      elem.style.opacity = opacity
      }

      if (bottom >= endPosition) {
        bottom -= 1
        for (const elem of array) {
          elem.style.bottom = `${bottom}px`
          }
      }

      if (opacity <= 0) {
        if (bool === true) {
          for (const elem of array) {
            elem.remove()
          }
        }
        clearInterval(fadeO)
      } 
    }, 20)
  }, speed)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function flashingButton(btn) {
  if (btn.classList.contains('flash')) {
    btn.classList.remove('flash')
  }
  else {
    btn.classList.add('flash')
  }
}

function flashingButton2(btn) {
  if (btn.classList.contains('flash2')) {
    btn.classList.remove('flash2')
  }
  else {
    btn.classList.add('flash1')
  }
}

function flashingButton3(btn) {
  if (btn.classList.contains('flash3')) {
    btn.classList.remove('flash3')
  }
  else {
    btn.classList.add('flash3')
  }
}

function flashingButton4(btn) {
  if (btn.classList.contains('flash4')) {
    btn.classList.remove('flash4')
  }
  else {
    btn.classList.add('flash4')
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function turnNotification(msgText, parent, acceptText, rejectText, colorData) {
  const messageDiv = document.createElement('div')
  messageDiv.classList.add('turnMessage')
  messageDiv.style.borderColor = colorData;
  messageDiv.style.opacity = 0
  const messageText = document.createElement('p')
  messageText.textContent = msgText
  messageText.classList.add('turnMessageText')
  messageDiv.appendChild(messageText)

  const btnDiv = document.createElement('div')
  btnDiv.setAttribute('class', 'btnDiv')

  if (totalChips > 0) {
    const acceptBtn = document.createElement('button')
    acceptBtn.classList.add('matchButton')
    acceptBtn.innerHTML = `${acceptText} &#10004;`
    acceptBtn.addEventListener('click', (e) => {
      fadeOut(messageDiv, 200, position, position - 20, true)
      newTurn()
    })
    btnDiv.appendChild(acceptBtn)
  }

  const closeBtn = document.createElement('button')
  closeBtn.classList.add('matchButton')
  closeBtn.innerHTML = `${rejectText} &#10006;`
  btnDiv.appendChild(closeBtn)
  
  messageDiv.appendChild(btnDiv)

  parent.appendChild(messageDiv)


  closeBtn.addEventListener('click', (e) => {
    fadeOut(messageDiv, 200, position, position - 20, true)
    reset()

    setTimeout(() => {
      userInterface.style.opacity = 0
      chipsDiv.style.opacity = 0;
      playerScore.style.opacity = 0;
      dealerScore.style.opacity = 0;
    
      showHide(userInterface)
      showHide(chipsDiv)
      showHide(playerScore)
      showHide(dealerScore)
      startGameButton()
    },200)
    
  })

  const position = getComputedStyle(messageDiv).bottom.replace('px', '')

  setTimeout(() => {
    fadeIn(messageDiv, .05, 20)
    slideIn(messageDiv, position - 20, position, 'bottom', 1)
  },1000)

}


function notification(msg, parent, colorData, speed) {
  document.querySelectorAll('.message').forEach((item) => {
    item.remove()
  })
  const messageDiv = document.createElement('div')
  messageDiv.classList.add('message')
  messageDiv.style.opacity = 0
  messageDiv.style.borderColor = colorData
  const messageText = document.createElement('p')
  messageText.textContent = msg
  messageText.classList.add('messageText')
  messageDiv.appendChild(messageText)
  parent.appendChild(messageDiv)

  fadeIn(messageDiv, .05, 20)
  slideIn(messageDiv, 0, 5, 'bottom', 1)
  fadeOut(messageDiv, speed, 5, -10, true)
}


function removeAllMessages() {
  document.querySelectorAll('.message').forEach(elem => {
    fadeOut(elem, 0, 20, 0, true)
  })
}
