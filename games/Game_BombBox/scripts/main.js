const RowsCount = 3;

const MaxInt = 250;
const RandomMaxInt = 10;

const TimerValue = 2 * 60.1 * 1000;
var timerCurrentValue = TimerValue;

var selectedElement;
var currentSum = 0;
var currentSumMin = 0;
var currentSumMax = 0;

var neededSum = 0;
var neededSumMin = 0;
var neededSumMax = 0;

var neededPathPointerPrecent = 1;
var currentPathPointerPrecent = 5;

const HackPinsCount = 5;

const ResourcesFolderPath = "./resources/";
const PinSoundName = "heavy_beep.wav";
var pinSound = new Audio(ResourcesFolderPath + PinSoundName);

const ClickSoundName = "heavy_click.wav";
var clickSound = new Audio(ResourcesFolderPath + ClickSoundName);

var isWon = false;
var isOver = false;

const WonSoundName = "heavy_double_beep.wav";
var wonSound = new Audio(ResourcesFolderPath + WonSoundName);

const OverSoundName = "long_beep.wav";
var overSound = new Audio(ResourcesFolderPath + OverSoundName);

const TimerTickSoundName = "beep.wav";
var timerTickSound = new Audio(ResourcesFolderPath + TimerTickSoundName);

const ExplosionSoundName = "explosionSound.wav";
var explosionSound1 = new Audio(ResourcesFolderPath + ExplosionSoundName);
var explosionSound2 = new Audio(ResourcesFolderPath + ExplosionSoundName);
var explosionSound3 = new Audio(ResourcesFolderPath + ExplosionSoundName);

const keySoundsPath = "./resources/keysounds/";
const keySoundsCount = 15;
var keySounds = [];

var timerInterval;

function Clamp(n, min, max)
{
    if (n < min) return min;
    if (n > max) return max;

    return n;
}

function GetRandomInt(max)
{
    return Math.floor(Math.random() * max);
}

function GetRandomIntPlusOne(max)
{
    return Math.floor(Math.random() * max) + 1;
}

function Initialize()
{
    SetupKeySounds();
    CreateRows();
    CreateCells();
    SetMinMaxToPaths();
    CreateHackPins();
    RandomizeNeededSum();
}

function GameStart()
{
    TimerTick();

    let gameStart = document.getElementsByClassName("game-start")[0];
    gameStart.classList.add("go-up");

    timerTickSound.play();
    setTimeout(function () { timerTickSound.play(); }, 200);
    setTimeout(function () { timerTickSound.play(); }, 400);
}

function SetupKeySounds()
{
    for (let i = 1; i <= keySoundsCount; i++)
    {
        keySounds.push(new Audio(keySoundsPath + i + ".wav"));
    }
}

function CreateRows()
{
    let grid = document.getElementsByClassName("grid")[0];

    for (let i = 0; i < RowsCount; i++)
    {
        let row = document.createElement("div");
        row.className = "row";

        grid.appendChild(row);
    }
}

function RandomizeCellValue(e)
{
    randomValue = GetRandomIntPlusOne(RandomMaxInt);
    if (GetRandomInt(100) > 50) randomValue *= -1;
    e.value = randomValue;
}

function CreateCells()
{
    let rows = document.getElementsByClassName("row");

    for (let i = 0; i < rows.length; i++)
    {
        for (let j = 0; j < RowsCount; j++)
        {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.setAttribute("onclick", "OnMouseClick(this)");

            GetRandomCellColorClass(cell);

            let cellX = document.createElement("input");
            cellX.className = "cell-x";
            cellX.type = "hidden";
            cellX.value = j;

            let cellY = document.createElement("input");
            cellY.className = "cell-y";
            cellY.type = "hidden";
            cellY.value = i;

            let cellValue = document.createElement("input");
            cellValue.className = "cell-value";
            cellValue.type = "hidden";
            RandomizeCellValue(cellValue);

            let cellLabel = document.createElement("label");
            cellLabel.className = "cell-label";
            cellLabel.innerHTML = cellValue.value;

            let cellDivsOfAction = [];

            for (let i = 0; i < 4; i++)
            {
                cellDivsOfAction.push(document.createElement("div"));
            }

            cellDivsOfAction[0].className = "cell-action action-top hidden";
            cellDivsOfAction[1].className = "cell-action action-right hidden";
            cellDivsOfAction[2].className = "cell-action action-bottom hidden";
            cellDivsOfAction[3].className = "cell-action action-left hidden";

            for (let i = 0; i < cellDivsOfAction.length; i++)
            {
                let actionSymbol = document.createElement("div");
                actionSymbol.className = "action-symbol";

                let actionLabel = document.createElement("label");
                actionLabel.className = "action-label glowing-red-text";
                actionLabel.innerHTML = "0";

                actionSymbol.appendChild(actionLabel);
                cellDivsOfAction[i].appendChild(actionSymbol);
                cell.appendChild(cellDivsOfAction[i]);
            }

            cell.appendChild(cellX);
            cell.appendChild(cellY);
            cell.appendChild(cellValue);
            cell.appendChild(cellLabel);

            rows[i].appendChild(cell);   
        }
    }
}

function SetMinMaxToPaths()
{
    let paths = document.getElementsByClassName("number-path");

    for (let i = 0; i < paths.length; i++)
    {
        paths[i].min = -MaxInt;
        paths[i].max = MaxInt;
    }

    SetNavPaths();
}

function SetNavPaths()
{
    let navPaths = document.getElementsByClassName("nav-path");

    for (let i = -(navPaths.length / 2), j = 0; j < navPaths.length; i++, j++)
    {
        let pathRange = MaxInt * 2;
        let navValue = i * 10 * pathRange / 100 + 10;

        navPaths[j].value = navValue;
    }
}

function CreateHackPins()
{
    let uiPins = document.getElementsByClassName("ui-pins")[0];

    for (let i = 0; i < HackPinsCount; i++)
    {
        let hackPinContainer = document.createElement("div");
        hackPinContainer.className = "hack-pin-container";

        let hackPinRadio = document.createElement("input");
        hackPinRadio.className = "hack-pin unchecked";
        hackPinRadio.type = "radio";
        hackPinRadio.tabIndex = "-1";

        hackPinContainer.appendChild(hackPinRadio);

        uiPins.appendChild(hackPinContainer);
    }
}

function GetRandomCellColorClass(e)
{
    let colorClasses = [];
    colorClasses.push("cell-plus", "cell-minus", "cell-mult", "cell-split");

    for (let i = 0; i < colorClasses.length; i++)
    {
        e.classList.remove(colorClasses[i]);
    }

    let cellColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    e.classList.add(cellColor);
}

function OnMouseClick(e)
{
    Merge(e);
}

function CalculateCurrentSum()
{
    let cellValues = document.getElementsByClassName("cell-value");

    let sum = 0;
    for (let i = 0; i < cellValues.length; i++)
    {
        sum += parseInt(cellValues[i].value);
    }

    currentSum = Clamp(sum, -MaxInt, MaxInt);

    let currentSumLabel = document.getElementsByClassName("current-sum-label")[0];
    currentSumLabel.innerHTML = "Current sum: " + currentSum;

    let currentPath = document.getElementsByClassName("current-path")[0];
    currentPath.value = currentSum;

    let pathRange = MaxInt * 2;
    let percentOfRange = currentPathPointerPrecent * pathRange / 100;

    currentSumMin = currentSum - percentOfRange;
    currentSumMax = currentSum + percentOfRange;
}

function RandomizeNeededSum()
{
    neededSum = GetRandomInt(MaxInt);

    if (GetRandomInt(100) > 50) neededSum *= -1;

    CalculateCurrentSum();

    let pathRange = MaxInt * 2;

    let percentOfRangeForCurrentPointer = currentPathPointerPrecent * pathRange / 100;
    if (neededSum > currentSumMin && neededSum < currentSumMax)
    {
        if (GetRandomInt(100) > 50) neededSum += percentOfRangeForCurrentPointer * 1.5;
        else neededSum -= percentOfRangeForCurrentPointer * 1.5;

        if (neededSum >= MaxInt) neededSum -= percentOfRangeForCurrentPointer * 2;
        if (neededSum <= -MaxInt) neededSum += percentOfRangeForCurrentPointer * 2;
    }

    let needPath = document.getElementsByClassName("need-path")[0];
    needPath.value = neededSum;

    let percentOfRange = neededPathPointerPrecent * pathRange / 100;

    neededSumMin = neededSum - percentOfRange;
    neededSumMax = neededSum + percentOfRange;
}

function CheckNeighborAction(e, e1)
{
    if (e1 != null)
    {
        e.classList.remove("hidden");

        if (e1.classList.contains("cell-plus")) e.getElementsByClassName("action-label")[0].innerHTML = "+";
        if (e1.classList.contains("cell-minus")) e.getElementsByClassName("action-label")[0].innerHTML = "−";
        if (e1.classList.contains("cell-mult")) e.getElementsByClassName("action-label")[0].innerHTML = "×";
        if (e1.classList.contains("cell-split")) e.getElementsByClassName("action-label")[0].innerHTML = "÷";
    }
}

function ActivateActionDivs(e, e1, e2, e3, e4)
{
    let actionDivTop = e.getElementsByClassName("action-top")[0];
    let actionDivRight = e.getElementsByClassName("action-right")[0];
    let actionDivBottom = e.getElementsByClassName("action-bottom")[0];
    let actionDivLeft = e.getElementsByClassName("action-left")[0];  
    
    CheckNeighborAction(actionDivTop, e1);
    CheckNeighborAction(actionDivRight, e2);
    CheckNeighborAction(actionDivBottom, e3);
    CheckNeighborAction(actionDivLeft, e4);
}

function DeactivateActionDivs(e)
{
    let actionDivs = e.getElementsByClassName("cell-action");
    
    for (let i = 0; i < actionDivs.length; i++)
    {
        actionDivs[i].classList.add("hidden");
    }
}

function Merge(e)
{
    keySounds[Math.floor(Math.random() * keySounds.length)].play();

    if (selectedElement == null)
    {
        selectedElement = e;

        selectedElement.classList.add("cell-selected");
        selectedElement.classList.add("glowing-red-box");

        let selectedElementX = parseInt(selectedElement.getElementsByClassName("cell-x")[0].value);
        let selectedElementY = parseInt(selectedElement.getElementsByClassName("cell-y")[0].value);

        let topNeightborN = null;
        let rightNeighborN = null;
        let bottomNeighborN = null;
        let leftNeighborN = null;

        if (selectedElementY - 1 >= 0) topNeightborN = selectedElementY - 1;
        if (selectedElementX + 1 < RowsCount) rightNeighborN = selectedElementX + 1;
        if (selectedElementY + 1 < RowsCount) bottomNeighborN = selectedElementY + 1;
        if (selectedElementX - 1 >= 0) leftNeighborN = selectedElementX - 1;

        let cells = document.getElementsByClassName("cell");

        let topNeightbor = null;
        let rightNeighbor = null;
        let bottomNeighbor = null;
        let leftNeighbor = null;

        for (let i = 0; i < cells.length; i++)
        {
            cells[i].classList.remove("cell-neighbor-selected");

            let cellX = parseInt(cells[i].getElementsByClassName("cell-x")[0].value);
            let cellY = parseInt(cells[i].getElementsByClassName("cell-y")[0].value);

            if ((cellX == selectedElementX && cellY == topNeightborN)
                || (cellX == selectedElementX && cellY == bottomNeighborN)
                || (cellX == rightNeighborN && cellY == selectedElementY)
                || (cellX == leftNeighborN && cellY == selectedElementY))
            {
                cells[i].classList.add("cell-neighbor");
                cells[i].classList.add("glowing-green-box");
            }

            if (cellX == selectedElementX && cellY == topNeightborN) topNeightbor = cells[i];
            if (cellX == selectedElementX && cellY == bottomNeighborN) bottomNeighbor = cells[i];
            if (cellX == rightNeighborN && cellY == selectedElementY) rightNeighbor = cells[i];
            if (cellX == leftNeighborN && cellY == selectedElementY) leftNeighbor = cells[i];
        }

        ActivateActionDivs(selectedElement, topNeightbor, rightNeighbor, bottomNeighbor, leftNeighbor);

        return;
    }

    if (e == selectedElement) return;

    if (e.classList.contains("cell-neighbor") == false) return;

    e.classList.add("cell-neighbor-selected");

    let selectedElementValue = selectedElement.getElementsByClassName("cell-value")[0];
    let eValue = e.getElementsByClassName("cell-value")[0];

    let SEValue = parseInt(selectedElementValue.value);
    let EVValue = parseInt(eValue.value);

    if (e.classList.contains("cell-plus"))
        eValue.value = Math.round((SEValue + EVValue) * 100) / 100;
    if (e.classList.contains("cell-minus"))
        eValue.value = Math.round((SEValue - EVValue) * 100) / 100;
    if (e.classList.contains("cell-mult"))
        eValue.value = Math.round((SEValue * EVValue) * 100) / 100;
    if (e.classList.contains("cell-split"))
    {
        if (parseInt(eValue.value) == 0) eValue.value = 0;
        else eValue.value = Math.round((SEValue / EVValue) * 100) / 100;
    }

    eValue.value = Clamp(parseInt(eValue.value), -MaxInt, MaxInt);

    let eLabel = e.getElementsByClassName("cell-label")[0];
    eLabel.innerHTML = eValue.value;

    RandomizeCellValue(selectedElementValue);

    let selectedElementLabel = selectedElement.getElementsByClassName("cell-label")[0];
    selectedElementLabel.innerHTML = selectedElementValue.value;

    DeactivateActionDivs(selectedElement);
    GetRandomCellColorClass(selectedElement);

    selectedElement.classList.remove("cell-selected");
    selectedElement.classList.remove("glowing-red-box");
    selectedElement = null;

    let cells = document.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++)
    {
        cells[i].classList.remove("cell-neighbor");
        cells[i].classList.remove("glowing-green-box");
    }

    CheckSum();
}

function CheckSum()
{
    if (isOver == true) return;

    CalculateCurrentSum();

    if (neededSumMin < currentSumMin || neededSumMax > currentSumMax) return;

    RandomizeNeededSum();

    SetRadioCheck();
}

function SetRadioCheck()
{
    let radio = document.getElementsByClassName("hack-pin unchecked")[0];

    if (radio != null)
    {
        radio.checked = "checked";
        radio.classList.remove("unchecked");

        pinSound.play();
        clickSound.play();
    }

    radio = document.getElementsByClassName("hack-pin unchecked")[0];

    if (radio == null) GameWon();
}

function GameWon()
{
    if (isOver == true) return;

    if (isWon == false)
    {
        clearInterval(timerInterval);

        let timerLabel = document.getElementsByClassName("timer-label")[0];
        timerLabel.classList.remove("glowing-red-text");
        timerLabel.classList.add("glowing-green-text");
        timerLabel.classList.add("timer-label-mini");
        timerLabel.innerHTML = "Bomb deactivated";

        wonSound.play();

        setTimeout(function ()
        {
            let gameStart = document.getElementsByClassName("game-start")[0];
            gameStart.classList.remove("go-up");

            let gameStartLabel = document.getElementsByClassName("game-start-label")[0];
            gameStartLabel.innerHTML = "Thank you for playing! Restart?";
            gameStartLabel.setAttribute("onclick", "location.reload()");
        }, 1000);

        isWon = true;
    }
}

function TimerTick()
{
    timerInterval = setInterval(function () {
        timerCurrentValue -= 10;

        if (timerCurrentValue <= 0)
        {
            timerCurrentValue = 0;
            clearInterval(timerInterval);

            GameOver();
            return;
        }

        if ((timerCurrentValue <= 5 * 1000 && timerCurrentValue % 500 == 0)
        || (timerCurrentValue <= 1.5 * 1000)) timerTickSound.play();

        let timerLabel = document.getElementsByClassName("timer-label")[0];

        let min = Math.floor(timerCurrentValue / (1000 * 60) % 60);
        let sec = Math.floor(timerCurrentValue / 1000 % 60);
        let mil = Math.floor(timerCurrentValue % 1000 / 10);

        let tMin = min;
        let tSec = sec;
        let tMil = mil;

        if (min < 10) tMin = "0" + min;
        if (sec < 10) tSec = "0" + sec;
        if (mil < 10) tMil = "0" + mil;

        timerLabel.innerHTML = tMin + ":" + tSec + ":" + tMil;
    }, 10)
}

function GameOver()
{
    if (isOver == false)
    {
        isOver = true;

        let timerLabel = document.getElementsByClassName("timer-label")[0];
        timerLabel.classList.remove("glowing-green-text");
        timerLabel.classList.add("glowing-red-text");
        timerLabel.innerHTML = "Bomb go boom";

        overSound.play();
        explosionSound1.play();

        let explosionDiv = document.getElementsByClassName("explosion-div")[0];
        explosionDiv.classList.remove("hidden");

        let restartLabel = document.getElementsByClassName("game-restart-label")[0];
        restartLabel.classList.add("unfade");

        setTimeout(function () {
            let explosionBottom = explosionDiv.getElementsByClassName("explosion-bottom")[0];
            explosionBottom.classList.remove("hidden");
        }, 1000);

        setInterval(function () {
            explosionSound1.play();
        }, 5000);

        setInterval(function () {
            explosionSound2.play();
        }, 1000);

        setInterval(function () {
            explosionSound3.play();
        }, 500);
    }
}