let rankArray = [2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K', 'A']
let suitArray = ['hearts', 'diamonds', 'spades', 'clubs']
let deck = []
let playerCardArray = []
let playerCardDivArray = []
let dealerCardArray = []
let dealerCardDivArray = []

let cardCount = 0
let dealCount = 0
let playerTotal = 0
let dealerTotal = 0
let totalChips = 0
let currentBet = 0
let cardIndex = 1000

let playerBlackJack
let dealerBlackJack
let playerLose
let dealerLose

let clickable = false
let playerTurn = true
let bettingPhase = true

const boardWidth = 275
const cardWidth = boardWidth/5
const cardHeight = (cardWidth/2) + cardWidth

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

function createDeck() {
  for (const suit of suitArray) {
    for (const rank of rankArray) {
      deck.push({
        rank: rank,
        suit: suit
      })
    }
  }
  console.log(deck)
}

function removeFromDeck(elem, array) {
  array.splice(array.indexOf(elem), 1)

}

function chooseRandomCard(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return randomIndex
}

function changeCardLabel(textData, colorData, cardLabelsArray) {
  cardLabelsArray.forEach(label => {
    label.innerHTML = textData;
    label.style.color = colorData;
  })
}

function loadCardRank(deckArray, cardDiv, cardArray) {
  let randomCard = deckArray[chooseRandomCard(deckArray)]
  const cardLabels = cardDiv.querySelectorAll('.cardLabel')
  
  switch(randomCard.suit) {
    case 'spades':
     changeCardLabel(`${randomCard.rank}&#9824`, 'black', cardLabels);
      break;
    case 'clubs':
      changeCardLabel(`${randomCard.rank}&#9827;`, 'black', cardLabels);
      break;
    case 'hearts':
      changeCardLabel(`${randomCard.rank}&#9829;`, 'red', cardLabels);
      break;
    case 'diamonds':
      changeCardLabel(`${randomCard.rank}&#9830;`, 'red', cardLabels);
      break;
  }
  cardArray.push(randomCard)
  removeFromDeck(randomCard, deckArray)
}


function createCard(deckArray, width, height, parent, cardArray, cardDivArray) {
  const card = document.createElement('div');
  card.classList.add('card');


  const frontOfCard = document.createElement('div')
  frontOfCard.classList.add('frontCard')
  frontOfCard.classList.add('hide')
  
  const topLabel = document.createElement('p')
  topLabel.classList.add('cardLabel')
  topLabel.classList.add('top')
  
  const centerLabel = document.createElement('p')
  centerLabel.classList.add('cardCenter')
  centerLabel.classList.add('center')
  centerLabel.classList.add('cardLabel')
  
  const bottomLabel = document.createElement('p')
  bottomLabel.classList.add('cardLabel')
  bottomLabel.classList.add('bottom')
  
  frontOfCard.appendChild(topLabel)
  frontOfCard.appendChild(centerLabel)
  frontOfCard.appendChild(bottomLabel)
  
  const backOfCard = document.createElement('div')
  backOfCard.classList.add('backCard')
  backOfCard.classList.add('show')
  
  card.appendChild(frontOfCard)
  card.appendChild(backOfCard)
  card.style.width = `${width}px`;
  card.style.height = `${height}px`;
  card.classList.add(cardCount)
  cardCount++

  cardIndex++
  const cardDiv = document.createElement('div')
  cardDiv.style.zIndex = cardIndex
  cardDiv.classList.add('cardDiv')
  cardDiv.style.opacity = 0
  cardDiv.appendChild(card)
  parent.appendChild(cardDiv)
  cardDivArray.push(card)

  loadCardRank(deckArray, card, cardArray)
  
  return cardDiv
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addCardFlip(card, front, back) {
  card.classList.remove('animate')
  void card.offsetWidth;
  void card.offsetHeight;
  
  if (front.classList.contains('hide')) {
    front.classList.add('rotated')
    //loadCardRank(array, card) random card on flip
    //console.log('add rotate !')
  }
  else { 
    front.classList.remove('rotated')
    //console.log('remove rotate !')
  }

  card.classList.add('animate')
  setTimeout(() => {
      showHide(front)
      showHide(back)
   }, 500)
}


function positionCardsLeft(cardDivArray, i) {
  let cardSpace
  if (i < 4 ){
    cardDivArray.forEach(elem => {
      //let position = getComputedStyle(elem.parentNode).left.replace('px', '')   
      let endPosition1 = (((boardWidth/2) - (cardWidth * Number(`1.${cardDivArray.length + 2}`))) + ((cardWidth) * cardDivArray.indexOf(elem)))
      slideIn(elem.parentNode, endPosition1 + 5, endPosition1, 'left', -1)
    })
  }
  else {
    cardSpace = boardWidth/ cardDivArray.length
    cardDivArray.forEach(elem => {
      elem.style.width = `${cardSpace}px`
      elem.style.height = `${(cardSpace/2) + cardSpace}px`
      let endPosition = ((cardSpace) * cardDivArray.indexOf(elem))
      slideIn(elem.parentNode, endPosition + 5, endPosition, 'left', -1)
      //elem.parentNode.style.left = `${((cardSpace) * cardDivArray.indexOf(elem))}px` 
      const labels = elem.querySelectorAll('.cardLabel') //querySelector('.frontCard')
      labels.forEach(label => label.style.fontSize = '1.5cqb')
    })
  }
}


function dealCards(numberOfCards, cardNumber, parent, cardArray, cardDivArray, flipBool) {
  numberOfCards += dealCount
  for (let i = cardNumber; i < numberOfCards; i++) {
    dealCount++
    const newCard = createCard(deck, cardWidth,cardHeight, parent, cardArray, cardDivArray)
    setTimeout(() => {
      fadeIn(newCard, .05, 20)
      positionCardsLeft(cardDivArray, i)
    }, 100)
    
    setTimeout(() => {
      if (flipBool) {
        addCardFlip(newCard, newCard.querySelector('.frontCard'), newCard.querySelector('.backCard'))
      }
    }, 100)
  }
}


function deal() {
  setTimeout(() => {
    dealCards(2, 0, player, playerCardArray, playerCardDivArray, true);
    dealCount = 0
    cardCount = 0
    dealCards(1, 0, dealer, dealerCardArray, dealerCardDivArray, false);
    dealCards(1, 1, dealer, dealerCardArray, dealerCardDivArray, true);
    returnTotal()
    returnBoolChecks()
  }, 1100)
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function convertFaceCard(elem, handValue) {
  if (typeof(elem.rank) === 'string' ) {
    switch(elem.rank) {
      case "K":
      case "Q":
      case "J":
        handValue += 10;
        break;
      case "A":
        if (handValue >= 12) {
          handValue += 1;
        }
        else {
          handValue += 11
        }
        break;
    }
  }
  else {
    handValue += elem.rank
  }
  //console.log(handValue)
  return handValue 
}


function countCardValues(array) {
  let handValue = 0
  array.forEach(item => {
    if (item.rank == 'A') {
      array.splice(array.indexOf(item), 1)
      array.push(item)
    }
  })
  array.forEach(elem => {
    handValue = convertFaceCard(elem, handValue)
  })
  return handValue
}



function returnTotal() {
  playerTotal = countCardValues(playerCardArray)
  dealerTotal = countCardValues(dealerCardArray)
  updateScoreDiv()
}


function updateScoreDiv() {
  playerScore.textContent = playerTotal
  if (playerTurn == false) {
    dealerScore.textContent = dealerTotal
  }
  else {
    let singleCard = convertFaceCard(dealerCardArray[1], 0)
    dealerScore.textContent = singleCard
  }
}


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
  playerBlackJack =  checkBlackJack(countCardValues(playerCardArray))
  dealerBlackJack =  checkBlackJack(countCardValues(dealerCardArray))

  playerLose = checkLose(countCardValues(playerCardArray))
  dealerLose = checkLose(countCardValues(dealerCardArray))
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
    notification('Blackjack!', parent, '#47F5A1', 2000)
  }
  else if (youLose) {
    notification(`Busted with ${total}`, parent, '#F55C47', 2000)
  }
  else {
    notification(`Total is ${total}`, parent, '#47F5A1', 1200)
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




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function slideIn(elem, startPosition, endPosition, direction, increment) {
  let position = startPosition
  let directionOption = direction.toString()
  let slideI = setInterval(() => {
    position += increment //1
    elem.style[directionOption] = `${position}px`
    if (position == endPosition) {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function newTurn() {
  reset()
  createDeck()
  playerTurn = false
  bettingPhase = true
  //hit.style.pointerEvents = 'none'
  //hold.style.pointerEvents = 'none'
  //betBtn.style.pointerEvents = 'all'
  //betSize.style.pointerEvents = 'all'
  betValue.innerHTML = "???"

  notification(`Make a bet!`, board, '#47F5A1', 2500)
  setTimeout(() => {
    flashingButton(betSize)
    flashingButton3(betBtn)
  }, 1000)
}


function startGame() {
  newTurn()
  totalChips = 1000
  currentBet = 0

  chipsTotal.innerHTML = 1000

  setTimeout(() => {
    showHide(userInterface)
    showHide(chipsDiv)
    showHide(playerScore)
    showHide(dealerScore)
    fadeInMultiple([chipsDiv, playerScore, dealerScore, userInterface,], .05, 20)
  }, 2000)

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
  deck = []
  playerCardArray = []
  playerCardDivArray = []
  dealerCardArray = []
  dealerCardDivArray = []
  cardCount = 0
  dealCount = 0
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
      notification(`You ran out of money! Restart!`, board, '#F55C47', 5000)
    }
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  dealCount = 2
  turnHoleCard()
  playerTurn = false;
  flashingButton4(hit)
  flashingButton4(hold)
  //hit.style.pointerEvents = 'none'
  //hold.style.pointerEvents = 'none'
  

  setTimeout(() => {
    let dealerMove = setInterval(() => {
      returnTotal()
      returnBoolChecks()
      if (checkDealer17(countCardValues(dealerCardArray)) == false) {
        if (dealerBlackJack == false && dealerLose == false) { 
          dealCards(1, dealCount, dealer, dealerCardArray, dealerCardDivArray, true);
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addChips(0, 20, 1); 
addChips(37, 20, 1); 
addChips(74, 20, 1);
addChips(108, 20, 1);

betBtn.addEventListener('click', (e) => {
  if (bettingPhase == true) {
    if (betSize.value <= totalChips) {
      betValue.innerHTML = betSize.value
      currentBet = Number(betSize.value)
      playerTurn = true
      clickable = true
      bettingPhase = false
      removeAllMessages()
      notification(`You bet ${currentBet}`, board, '#47F5A1', 1200)
      flashingButton(betSize)
      flashingButton3(betBtn)

      //betBtn.style.pointerEvents = 'none'
      //betSize.style.pointerEvents = 'none'
      
      
      deal()
      setTimeout(() => {
        //hit.style.pointerEvents = 'all'
        //hold.style.pointerEvents = 'all'
        flashingButton4(hit)
        flashingButton4(hold)
      },2000)
    }
    else {
      notification(`Not enough chips!`, board, '#F55C47', 2000)
    }
  }
  else {
    notification(`Betting is over. Wait for next turn!`, board, '#F55C47', 1200)
  }
})



hit.addEventListener('click', (e) => {
  if (clickable == true) {
    returnTotal()
    returnBoolChecks()
    if (playerBlackJack == false && playerLose == false) {
      dealCards(1, dealCount, player, playerCardArray, playerCardDivArray, true);
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
      notification(`Make a bet to start!`, board, '#F55C47', 1200)
    }
    else {
      notification(`Wait till next hand!`, board, '#F55C47', 1200)
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
      notification(`Make a bet to start!`, board, '#F55C47', 1200)
    }
    else {
      notification(`Wait till next hand!`, board, '#F55C47', 1200)
    }
  }
})



window.addEventListener('load', (e) => {
  startGameButton()
}) 


// heart = &#9829
// diamond = &#9830
// spade = &#9824
// club = &#9827 !!

