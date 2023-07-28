const cardFolderPath = "../../resources/tarotIMG/";
const cardImageFormat = ".jpg";
const cardBackImageName = "cardBack";
const CardBackPath = cardFolderPath + cardBackImageName + cardImageFormat;

const bodyPreloadClassName = "preload";
const unclickableClassName = "unclickable";
const unavailableClassName = "unavailable";
const selectedClassName = "th-selected";

const CardRotateState = { ROTATE: "rotate", UNROTATE: "unrotate" };
const CardFindState = { FINDED: "finded", UNFINDED: "unfinded" };
const CardsImgFlyState = { FLY: "card-fly", UNFLY: "card-unfly" };
const DifficultyState = { EASY: 5, NORMAL: 10, HARD: 15 };

var currentDifficult = 10;

var tablesCount = 1;
var cardsPerTableMultiplier = 1;
var cardsPerTableCount = cardsPerTableMultiplier * 2;
var pairsCount = (tablesCount * cardsPerTableCount) / 2;

const halfRotateDuration = 250;
const halfRotateDurationWithDelay = halfRotateDuration * 8;

var element1;
var element2;

var canClick = true;

var totalScore = 0;
var totalMoves = 0;
var roundsLeft = 10;
var winCount = 0;

var hour = 0;
var minute = 0;
var second = 0;
var hrString = "00";
var minString = "00";
var secString = "00";
var time = true;
var stopWatchStarted = false;

var won = false;

const scorePerRound = 100;

const seeCardsCost = 150;

var isSimplified = false;

// Managment

function Initialize()
{
    if (document.body.classList.contains(bodyPreloadClassName) == false)
        document.body.classList.add(bodyPreloadClassName);

    CreateTables(tablesCount);
    AddCardsToEachTable(cardsPerTableCount);

    setTimeout(function ()
    {
        document.body.classList.remove(bodyPreloadClassName);
    }, halfRotateDurationWithDelay);

    CardsRotateOnInitialization(halfRotateDuration, CardRotateState.UNROTATE);
    CardsRotateOnInitialization(halfRotateDurationWithDelay, CardRotateState.ROTATE);

    Update();

    if(stopWatchStarted == false) StopWatch();
}

function Update()
{
    CheckMatch();
    CheckSeeAllCardsButton();
    RefreshAllCounters();
}

function OnMouseClick(e)
{
    if (canClick == false) return;

    CardToggle(e);
    CheckCardPair(e);
    Update();
}

// Cards

function CardToggle(e)
{
    if (e.classList.contains(CardRotateState.ROTATE)) // to unrotate (to card back)
    {
        CardRotate(e, CardBackPath, CardRotateState.ROTATE, CardRotateState.UNROTATE);
    }
    else // to rotate (to card front)
    {
        let cardImagePath = e.querySelector(".card-input").value;
        CardRotate(e, cardImagePath, CardRotateState.UNROTATE, CardRotateState.ROTATE);
    }
}

function CardToggle2(e, state)
{
    if (state == CardRotateState.ROTATE) // to unrotate (to card back)
    {
        CardRotate(e, CardBackPath, CardRotateState.ROTATE, CardRotateState.UNROTATE);
    }
    else // to rotate (to card front)
    {
        let cardImagePath = e.querySelector(".card-input").value;
        CardRotate(e, cardImagePath, CardRotateState.UNROTATE, CardRotateState.ROTATE);
    }
}

function CardRotate(e, cardImagePath, classContains, classToAdd)
{
    if (e.classList.contains(classContains))
    {
        setTimeout(function ()
        {  
            let img = e.querySelector(".card-img");
            img.src = cardImagePath;
        }, halfRotateDuration);

        e.classList.add(classToAdd);
        e.classList.remove(classContains);
    }
}

function SeeCardsButton()
{
    if (totalScore < seeCardsCost) return;

    totalScore -= seeCardsCost;

    Update();

    let seeButton = document.getElementsByClassName("see-div")[0];
    seeButton.classList.toggle(unclickableClassName);

    setTimeout(function ()
    {
        RotateAllCards(CardFindState.UNFINDED);
    }, halfRotateDuration);

    setTimeout(function ()
    {
        UnrotateAllCards(CardFindState.UNFINDED);
        seeButton.classList.toggle(unclickableClassName);
    }, halfRotateDurationWithDelay);
}

function RotateAllCards(className)
{
    let cards = document.getElementsByClassName(className);

    for (let i = 0; i < cards.length; i++)
    {
        let cardImagePath = cards[i].querySelector(".card-input").value;
        cards[i].classList.add(unclickableClassName);
        CardRotate(cards[i], cardImagePath, CardRotateState.UNROTATE, CardRotateState.ROTATE);
    }
}

function UnrotateAllCards(className)
{
    let cards = document.getElementsByClassName(className);

    for (let i = 0; i < cards.length; i++)
    {
        cards[i].classList.remove(CardFindState.FINDED);

        if (cards[i].classList.contains(CardFindState.UNFINDED) == false)
            cards[i].classList.add(CardFindState.UNFINDED);
        
        cards[i].classList.remove(unclickableClassName);
        CardRotate(cards[i], CardBackPath, CardRotateState.ROTATE, CardRotateState.UNROTATE);
    }
}

function CardsRotateOnInitialization(duration, rotateState)
{
    setTimeout(function ()
    {
        let cards = document.getElementsByClassName("card");

        for (let i = 0; i < cards.length; i++)
        {
            CardToggle(cards[i]);
        }
    }, duration);
}

function CardsImgFlyOrUnfly(flyState)
{
    let forAdd = CardsImgFlyState.FLY;
    let forRemove = CardsImgFlyState.UNFLY;

    if (flyState == CardsImgFlyState.FLY)
    {
        forAdd = CardsImgFlyState.UNFLY;
        forRemove = CardsImgFlyState.FLY;
    }

    let cardsImg = document.getElementsByClassName("card-img");
        
    for (let i = 0; i < cardsImg.length; i++)
    {
        cardsImg[i].classList.add(forAdd);
        cardsImg[i].classList.remove(forRemove);
    }
}

// Checks

function CheckCardPair(e)
{
    if (element1 == null)
    {
        element1 = e;
        element1.classList.add(unclickableClassName);

        totalMoves++;
        RefreshAllCounters();

        return;
    }

    canClick = false;

    element2 = e;
    element2.classList.add(unclickableClassName);

    if (element1 == null || element2 == null) return;

    if (element1.querySelector(".card-input").value == element2.querySelector(".card-input").value)
    {
        element1.classList.add(CardFindState.FINDED);
        element2.classList.add(CardFindState.FINDED);

        element1.classList.remove(CardFindState.UNFINDED);
        element2.classList.remove(CardFindState.UNFINDED);

        if (isSimplified == true)
        {
            e1image = element1.querySelector(".card-img");
            e2image = element2.querySelector(".card-img");

            setTimeout(function ()
            {     
                e1image.classList.add(CardsImgFlyState.UNFLY);
                e2image.classList.add(CardsImgFlyState.UNFLY);

                element1 = null;
                element2 = null;
                
                canClick = true;
            }, halfRotateDuration);
        }
        else
        {
            element1 = null;
            element2 = null;
                
            canClick = true;
        }
    }
    else
    {
        setTimeout(function ()
        {  
            element1 = null;
            element2 = null;

            if (isSimplified == true)
                UnrotateAllCards(CardFindState.UNFINDED);
            else
                UnrotateAllCards("card");

            canClick = true;
        }, halfRotateDurationWithDelay / 2);
    }
}

function WinCounting()
{     
    if (currentDifficult == DifficultyState.EASY)
    {
        switch (winCount)
        {
            case 1: tablesCount++;
                break;
            case 3: cardsPerTableMultiplier++;
                break;
            case 5: won = true;
                break;
        }
    }
    else if (currentDifficult == DifficultyState.NORMAL)
    {
        switch (winCount)
        {
            case 1: tablesCount++;
                break;
            case 3: cardsPerTableMultiplier++;
                break;
            case 5: tablesCount++;
                break;
            case 7: cardsPerTableMultiplier++;
                break;
            case 1: won = true;
                break;
        }
    }
    else
    {
        switch (winCount)
        {
            case 1: tablesCount++;
                break;
            case 3: cardsPerTableMultiplier++;
                break;
            case 5: cardsPerTableMultiplier++;
                break;
            case 7: tablesCount++;
                break;
            case 9: cardsPerTableMultiplier++;
                break;
            case 12: cardsPerTableMultiplier++;
                break;
            case 15: won = true;
                break;
        }
    }

    cardsPerTableCount = cardsPerTableMultiplier * 2;
    pairsCount = (tablesCount * cardsPerTableCount) / 2;
}

function CheckMatch()
{
    let cards = document.getElementsByClassName(CardFindState.FINDED);

    if ((cards.length / 2) == pairsCount)
    {
        totalScore += 100;
        roundsLeft--;

        document.body.classList.add("preload");

        let duration = halfRotateDurationWithDelay;
        if (isSimplified == true) duration = halfRotateDurationWithDelay / 2;

        setTimeout(function ()
        {     
            UnrotateAllCards("card");

            if(isSimplified == false)
                CardsImgFlyOrUnfly(CardsImgFlyState.UNFLY);
        }, duration / 2);

        setTimeout(function ()
        {
            if(isSimplified == false)
                CardsImgFlyOrUnfly(CardsImgFlyState.FLY);
        }, duration / 2);

        setTimeout(function ()
        {
            winCount++;
            
            WinCounting();

            RefreshAllCounters();

            if (won == true) OnWon();
            else Initialize();
        }, duration);
    }
}

function CheckSeeAllCardsButton()
{
    let seeButton = document.getElementsByClassName("see-div")[0];

    if (totalScore < seeCardsCost)
    {
        if (seeButton.classList.contains(unavailableClassName) == false)
            seeButton.classList.add(unavailableClassName);
    }
    else
    {
        seeButton.classList.remove(unavailableClassName);
    }
}

// Refreshing

function RefreshCounter(className, text, count)
{
    let counter = document.getElementsByClassName(className)[0];
    counter.innerHTML = text + ": " + count;
}

function RefreshAllCounters()
{
    RefreshCounter("th-score", "Scores", totalScore);
    RefreshCounter("th-moves", "Moves", totalMoves);
    RefreshCounter("th-rounds", "Rounds left", roundsLeft);
}

// Creation

function CreateTables(tablesCount)
{
    let mainDiv = document.getElementsByClassName("main-div")[0];
    mainDiv.innerHTML = '';

    for (let i = 0; i < tablesCount; i++)
    {
        let table = document.createElement("div");
        table.className = "table";

        mainDiv.appendChild(table);
    }

    let textDiv = document.createElement("div");
    textDiv.className = "text-div";

    let table = document.createElement("table");
    table.className = "text-table text";
    
    let tr = document.createElement("tr");
    tr.className = "text-tr";

    let thDot = document.createElement("th");
    thDot.className = "th-dot";
    thDot.innerHTML = "●";

    let thScore = document.createElement("th");
    thScore.className = "text-th th-score";
    thScore.innerHTML = "Total scores: 0";

    let thTime = document.createElement("th");
    thTime.className = "text-th th-time";

    let spanHr = document.createElement("span");
    spanHr.className = "span-time";
    spanHr.id = "hr";
    spanHr.innerHTML = hrString;

    let spanMin = document.createElement("span");
    spanMin.className = "span-time";
    spanMin.id = "min";
    spanMin.innerHTML = minString;

    let spanSec = document.createElement("span");
    spanSec.className = "span-time";
    spanSec.id = "sec";
    spanSec.innerHTML = secString;

    thTime.appendChild(spanHr);
    thTime.innerHTML += ":";
    thTime.appendChild(spanMin);
    thTime.innerHTML += ":";
    thTime.appendChild(spanSec);

    let thMoves = document.createElement("th");
    thMoves.className = "text-th th-moves";
    thMoves.innerHTML = "Total moves: 0";

    let thRounds = document.createElement("th");
    thRounds.className = "text-th th-rounds";
    thRounds.innerHTML = "Rounds left: 0";

    let thDot2 = document.createElement("th");
    thDot2.className = "th-dot";
    thDot2.innerHTML = "●";

    tr.appendChild(thDot);
    tr.appendChild(thScore);
    tr.appendChild(thTime);
    tr.appendChild(thMoves);
    tr.appendChild(thRounds);
    tr.appendChild(thDot2);

    table.appendChild(tr);

    textDiv.appendChild(table);

    mainDiv.appendChild(textDiv);

    let seeDiv = document.createElement("div");
    seeDiv.className = "text-div see-div";
    seeDiv.setAttribute("onclick", "SeeCardsButton()");

    let table2 = document.createElement("table");
    table2.className = "text-table text";
    
    let tr2 = document.createElement("tr");
    tr2.className = "text-tr see-tr";

    let thDot3 = document.createElement("th");
    thDot3.className = "th-dot";
    thDot3.innerHTML = "●";

    let thSee = document.createElement("th");
    thSee.className = "text-th see-th th-see";
    thSee.innerHTML = "See cards</br>-" + seeCardsCost + " Scores";

    let thDot4 = document.createElement("th");
    thDot4.className = "th-dot";
    thDot4.innerHTML = "●";

    tr2.appendChild(thDot3);
    tr2.appendChild(thSee);
    tr2.appendChild(thDot4);

    table2.appendChild(tr2);

    seeDiv.appendChild(table2);

    mainDiv.appendChild(seeDiv);
}

function AddCardsToEachTable(cardsPerTable)
{
    let tables = document.getElementsByClassName("table");
    
    let ints = RepeatArray(GenerateRandomIntsArray(21, pairsCount), 2);
    let chooser = RandomElementFromArrayNoRepeats(ints);

    for (let i = 0; i < tables.length; i++)
    {
        tables[i].innerHTML = '';

        for (let j = 0; j < cardsPerTable; j++)
        {
            let card = document.createElement("div");
            card.className = "card";
            card.classList.add(CardRotateState.UNROTATE);
            card.classList.add(CardFindState.UNFINDED);

            let input = document.createElement("input");
            input.className = "card-input";
            input.type = "hidden";
            input.value = cardFolderPath + chooser() + cardImageFormat;

            let img = document.createElement("img");
            img.className = "card-img";
            img.classList.add(CardsImgFlyState.FLY);

            if (card.classList.contains(CardRotateState.ROTATE) == true)
                img.src = input.value;
            else
                img.src = cardFolderPath + cardBackImageName + cardImageFormat;

            card.appendChild(input);
            card.appendChild(img);

            card.setAttribute("onclick", "OnMouseClick(this)");

            tables[i].appendChild(card)
        }
    }
}

// Generating

function RepeatArray(array, repeats)
{
    let newArray = [];

    for (let i = 0; i < repeats; i++)
    {
        let chooser = RandomElementFromArrayNoRepeats(array);

        for (let j = 0; j < array.length; j++)
        {
            newArray.push(chooser());
        }
    }

    return newArray;
}

function GenerateRandomIntsArray(maxIntIncluded, arrayLength)
{
    let nums = [];

    for (let i = 0; i < maxIntIncluded + 1; i++)
    {
        nums.push(i);
    }

    let array = [];
    let chooser = RandomElementFromArrayNoRepeats(nums);

    for (let i = 0; i < arrayLength; i++)
    {
        array.push(chooser());
    }

    return array;
}

function RandomElementFromArrayNoRepeats(array)
{
    let copy = array.slice(0);
    
    return function ()
    {
        if (copy.length < 1)
        {
            copy = array.slice(0);
        }

        let index = Math.floor(Math.random() * copy.length);
        let item = copy[index];

        copy.splice(index, 1);

        return item;
    };
}

// Won screen

function OnWon()
{
    winCount = 0;
    won = false;
    time = false;

    document.body.classList.remove(bodyPreloadClassName);

    let mainDiv = document.getElementsByClassName("main-div")[0];
    mainDiv.innerHTML = '';

    let wonDiv = document.createElement("div");
    wonDiv.className = "won-div";

    let wonTextDiv = document.createElement("div");
    wonTextDiv.className = "won-text-div";

    wonDiv.appendChild(wonTextDiv);

    let table = document.createElement("table");
    table.className = "text-table text won-table";
    
    let tr = document.createElement("tr");
    tr.className = "text-tr tr-won";

    let thDot = document.createElement("th");
    thDot.className = "th-dot";
    thDot.innerHTML = "●";

    let thDif = document.createElement("th");
    thDif.className = "text-th th-won";
    thDif.innerHTML = "Difficult";

    let thScore = document.createElement("th");
    thScore.className = "text-th th-won";
    thScore.innerHTML = "Scores"

    let thTime = document.createElement("th");
    thTime.className = "text-th th-won";
    thTime.innerHTML = "Time"

    let thMoves = document.createElement("th");
    thMoves.className = "text-th th-won";
    thMoves.innerHTML = "Moves";

    let thDot2 = document.createElement("th");
    thDot2.className = "th-dot";
    thDot2.innerHTML = "●";

    tr.appendChild(thDot);
    tr.appendChild(thDif);
    tr.appendChild(thScore);
    tr.appendChild(thTime);
    tr.appendChild(thMoves);
    tr.appendChild(thDot2);

    table.appendChild(tr);

    wonDiv.appendChild(table);

    let table2 = document.createElement("table");
    table2.className = "text-table text won-table";
    
    let tr2 = document.createElement("tr");
    tr2.className = "text-tr tr-won";

    let thDot3 = document.createElement("th");
    thDot3.className = "th-dot";
    thDot3.innerHTML = "●";

    let thDif2 = document.createElement("th");
    thDif2.className = "text-th th-won th-dif";

    switch (currentDifficult)
    {
        case DifficultyState.EASY: thDif2.innerHTML = "Easy";
            break;
        case DifficultyState.NORMAL: thDif2.innerHTML = "Normal";
            break;
        case DifficultyState.HARD: thDif2.innerHTML = "Hard";
            break;
    }

    let thScore2 = document.createElement("th");
    thScore2.className = "text-th th-won th-score";
    thScore2.innerHTML = totalScore;

    let thTime2 = document.createElement("th");
    thTime2.className = "text-th th-won th-time";

    let spanHr = document.createElement("span");
    spanHr.className = "span-time";
    spanHr.id = "hr";
    spanHr.innerHTML = hrString;

    let spanMin = document.createElement("span");
    spanMin.className = "span-time";
    spanMin.id = "min";
    spanMin.innerHTML = minString;

    let spanSec = document.createElement("span");
    spanSec.className = "span-time";
    spanSec.id = "sec";
    spanSec.innerHTML = secString;

    thTime2.appendChild(spanHr);
    thTime2.innerHTML += ":";
    thTime2.appendChild(spanMin);
    thTime2.innerHTML += ":";
    thTime2.appendChild(spanSec);

    let thMoves2 = document.createElement("th");
    thMoves2.className = "text-th th-won th-moves";
    thMoves2.innerHTML = totalMoves;

    let thDot4 = document.createElement("th");
    thDot4.className = "th-dot";
    thDot4.innerHTML = "●";

    tr2.appendChild(thDot3);
    tr2.appendChild(thDif2);
    tr2.appendChild(thScore2);
    tr2.appendChild(thTime2);
    tr2.appendChild(thMoves2);
    tr2.appendChild(thDot4);

    table2.appendChild(tr2);

    wonDiv.appendChild(table2);

    if (isSimplified == true)
    {
        let wonSimpleLabel = document.createElement("label");
        wonSimpleLabel.className = "start-dif start-light-lagel text";
        wonSimpleLabel.innerHTML = "● Light Mode On ●";

        wonDiv.appendChild(wonSimpleLabel);
    }

    let wonLabel = document.createElement("label");
    wonLabel.className = "won-label text";
    wonLabel.innerHTML = "● Back to start ●";
    wonLabel.setAttribute("onclick", "OnStart()");

    wonDiv.appendChild(wonLabel);

    mainDiv.appendChild(wonDiv);

    ActivateWonText();
}

function ActivateWonText()
{
    let text = 'You won!';
    let wonDiv = document.getElementsByClassName("won-text-div")[0];

    for (let i in [...text])
    {
        let letter = document.createElement('span');
        letter.className = "won-text text";

        letter.textContent = [...text][i];

        if (letter.textContent.match(/\s/))
        {
            letter.style.margin = 'auto 10px';
        }

        letter.style.animationDelay = i / 10 + 's';

        wonDiv.appendChild(letter);
    }
}

// Start screen

function OnStart()
{
    tablesCount = 1;
    cardsPerTableMultiplier = 1;
    cardsPerTableCount = cardsPerTableMultiplier * 2;
    pairsCount = (tablesCount * cardsPerTableCount) / 2;

    element1 = null;
    element2 = null;

    totalScore = 0;
    totalMoves = 0;

    second = 0;
    minute = 0;
    hour = 0;
    hrString = "00";
    minString = "00";
    secString = "00";
    time = true;
    stopWatchStarted = false;

    let curDif = localStorage.getItem("difficult");

    if (curDif == null) currentDifficult = 10;
    else currentDifficult = JSON.parse(curDif);

    let isLightChecked = localStorage.getItem("lightIsChecked");

    if (isLightChecked == null) isSimplified = false;
    else isSimplified = JSON.parse(isLightChecked);

    let mainDiv = document.getElementsByClassName("main-div")[0];
    mainDiv.innerHTML = '';

    let startDiv = document.createElement("div");
    startDiv.className = "start-div";

    let startLabel = document.createElement("label");
    startLabel.className = "start-label text";
    startLabel.innerHTML = "● START ●";
    startLabel.setAttribute("onclick", "Initialize()");

    startDiv.appendChild(startLabel);

    let startDifLabel = document.createElement("label");
    startDifLabel.className = "start-dif text";
    startDifLabel.innerHTML = "● Change difficult ●";

    startDiv.appendChild(startDifLabel);

    let table = document.createElement("table");
    table.className = "text-table text start-table";
    
    let tr = document.createElement("tr");
    tr.className = "text-tr tr-start";

    let thDot = document.createElement("th");
    thDot.className = "th-dot";
    thDot.innerHTML = "●";

    let thEasy = document.createElement("th");
    thEasy.className = "text-th th-start";
    thEasy.innerHTML = "Easy";
    thEasy.setAttribute("onclick", "ChangeDifficult(this, DifficultyState.EASY)");

    let thNormal = document.createElement("th");
    thNormal.className = "text-th th-start";
    thNormal.innerHTML = "Normal";
    thNormal.setAttribute("onclick", "ChangeDifficult(this, DifficultyState.NORMAL)");

    let thHard = document.createElement("th");
    thHard.className = "text-th th-start";
    thHard.innerHTML = "Hard";
    thHard.setAttribute("onclick", "ChangeDifficult(this, DifficultyState.HARD)");

    let thDot2 = document.createElement("th");
    thDot2.className = "th-dot";
    thDot2.innerHTML = "●";

    if (currentDifficult == DifficultyState.EASY) ChangeDifficult(thEasy, DifficultyState.EASY);
    else if (currentDifficult == DifficultyState.NORMAL) ChangeDifficult(thNormal, DifficultyState.NORMAL);
    else if (currentDifficult == DifficultyState.HARD) ChangeDifficult(thHard, DifficultyState.HARD);

    tr.appendChild(thDot);
    tr.appendChild(thEasy);
    tr.appendChild(thNormal);
    tr.appendChild(thHard);
    tr.appendChild(thDot2);

    table.appendChild(tr);

    startDiv.appendChild(table);

    let startSimpleLabel = document.createElement("label");
    startSimpleLabel.className = "start-dif start-light-lagel text";
    startSimpleLabel.innerHTML = "●";

    let lightModeCheck = document.createElement("input");
    lightModeCheck.className = "light-check";
    lightModeCheck.type = "checkbox";
    lightModeCheck.setAttribute("onclick", "GetLightModeStatus(this)");
    
    if (isSimplified == true) lightModeCheck.setAttribute("checked", true);

    startSimpleLabel.appendChild(lightModeCheck);
    startSimpleLabel.innerHTML += " Light mode ●";

    startDiv.appendChild(startSimpleLabel);

    mainDiv.appendChild(startDiv);
}

function ChangeDifficult(e, difficult)
{
    let thStart = document.getElementsByClassName("th-start");

    for (let i = 0; i < thStart.length; i++)
    {
        thStart[i].classList.remove(selectedClassName);
    }

    e.classList.add(selectedClassName);

    currentDifficult = difficult;
    roundsLeft = currentDifficult;

    localStorage.setItem("difficult", currentDifficult);
}

function GetLightModeStatus(isChecked)
{
    let check = isChecked.checked;

    if (check == true) isSimplified = true;
    else isSimplified = false;

    localStorage.setItem("lightIsChecked", isSimplified);
}

// Time

function StopWatch()
{
    if (time)
    {
        stopWatchStarted = true;

        second++;
 
        if (second == 60)
        {
            minute++;
            second = 0;
        }

        if (minute == 60)
        {
            hour++;
            minute = 0;
            second = 0;
        }

        hrString = hour;
        minString = minute;
        secString = second;

        if (hour < 10) hrString = "0" + hrString;
        if (minute < 10) minString = "0" + minString;
        if (second < 10) secString = "0" + secString;

        document.getElementById("hr").innerHTML = hrString;
        document.getElementById("min").innerHTML = minString;
        document.getElementById("sec").innerHTML = secString;

        setTimeout(StopWatch, 1000);
    }
}