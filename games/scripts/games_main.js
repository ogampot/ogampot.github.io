function SwitchScreenshot(e, gameDivName) {
    let topScreenElementName = "screen-" + e.value;

    let currentGameElement = document.getElementsByClassName(gameDivName)[0];

    let screenElements = currentGameElement.getElementsByClassName("screen");
    for (let i = 0; i < screenElements.length; i++)
    {
        screenElements[i].classList.remove("top-screen");
    }

    let topScreen = currentGameElement.getElementsByClassName(topScreenElementName)[0];
    topScreen.classList.add("top-screen");

    let screenNavElements = currentGameElement.getElementsByClassName("screen-nav-radio");
    for (let i = 0; i < screenNavElements.length; i++)
    {
        screenNavElements[i].checked = "";
    }

    e.checked = "checked";
}