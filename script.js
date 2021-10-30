import * as str from "./strings.js"
// html selected variables
let lives = document.querySelector(".lives");
let svgCont = document.querySelector("svg");
let changeWord = document.querySelector(".newWord");
let hangmanCont = document.querySelector(".hangmanCont");
let btnCont = document.querySelector(".btnCont");
let resetBtn = document.querySelector(".restart");
let decideText = document.querySelector(".deciderText");
let hint = document.querySelector(".hint");

//  Global Variables

let hangmanContWidth = hangmanCont.clientWidth;
let alphabetsArr = []; // Globally  Accessing alphabetsArr
let btnsArr = []; // all btns in this array
let spansArr = []; // all spans in this array for logical purposes 
let livesArr = ["❤️", "❤️", "❤️", "❤️", "❤️", "❤️"]; // livesArr this can be done more effieciently 
const hangmanArr = [ // hangman arr to contain all the body parts for animation purpose
    `<circle cx='102' cy='45' r='16' stroke='rgb(74, 115, 185)' fill='none' style='stroke-width: 2;'/>`,
    `<line x1='102' y1='105' x2='102' y2='60' style='stroke:rgb(74, 115, 172);stroke-width:3' />`,
    `<line x1="60" y1="95" x2="102" y2="72" style="stroke:rgb(74, 115, 172);stroke-width:3" />`,
    `<line x1="142" y1="95" x2="102" y2="72" style="stroke:rgb(74, 115, 172);stroke-width:3" />`,
    `<line x1="80" y1="135" x2="102" y2="105" style="stroke:rgb(74, 115, 172);stroke-width:3" />`,
    `<line x1="125" y1="135" x2="102" y2="105" style="stroke:rgb(74, 115, 172);stroke-width:3" />`
];
let incrementer = []; // incrementer is the list which having all the indexes that have letters inside it
let bodyCounter = 0; // body counter is for the animation when we click wrong button it's incremented by one and put inside in the hangman arr to get the hangman working
let clicked = 0; // clicked is the button tells us how many times we click the button right time and incremented it
let notAccessedItems = []; // it is the array of not accessed spans
let hintClicked = false; // hintClicked is the bollean to check if the hintBtn is clicked or not 

// Function and logic

function getRandomWord() { // Getting randomWord from the strings.js
    let word = "";
    let aboveThreeFilteredArr = str.arg[0].filter(word => word.length > 3);
    var randomNumber = Math.floor(Math.random() * aboveThreeFilteredArr.length);
    let storeWord = aboveThreeFilteredArr[randomNumber];
    word += storeWord;
    return word
}


function changeWidth() { // this is for the btnContainer Width
    btnCont.style.width = hangmanContWidth + 65 + "px";
}
changeWidth()





function createButtons() { // this function is for creating buttons in javascript
    let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let alphaArr = alphabets.split(""); // this array is for spliting the alphabets in the upper alphabets variable
    for (let i = 0; i < 26; i++) {
        var btn = document.createElement("button");
        btnCont.appendChild(btn);
        btn.classList.add("btn")
        btn.innerText = alphaArr[i];
        alphabetsArr.push(alphaArr[i])
        btnsArr.push(btn);
    };
}
createButtons();


hint.addEventListener("click", hintFunc);

let newSpanArr;

function gettingRandomNumber() { // getting random Number for hint button only if the span's innerText is "" => blank;
    let randomNumber = Math.floor(Math.random() * spansArr.length)

    while (notAccessedItems.includes(randomNumber)) {
        randomNumber = Math.floor(Math.random() * spansArr.length)
    }
    console.log(randomNumber)
    return randomNumber
}

function hintFunc() { // all the hint functionality goes here
    let randomNumber = gettingRandomNumber();
    let guessNum = randomWord[randomNumber]; // this is the randomGuess in innerText;
    spansArr[randomNumber].innerText = guessNum; // then we put inside of that particular spansArr index's innerText
    spansArr[randomNumber].style.borderBottom = "none";
    spansArr[0].style.textTransform = "capitalize";
    hint.style.display = "none"; // set hint to display none
    hintClicked = true;
    clicked += 1; // because
    if (clicked == randomWord.length) {
        console.log(true)
        decider()
    }
}


let randomWord;

function createSpans() { // createSpans according to the randomWord
    randomWord = getRandomWord();
    console.log(randomWord)

    // creating a length of spans and put them into the changeWord variable
    for (let i = 0; i < randomWord.length; i++) {
        let spans = document.createElement("span");
        spansArr.push(spans);
        spans.classList.add("spans")
        changeWord.appendChild(spans);

    }


}
createSpans()









function gameLoop() {
    btnsArr.forEach(item => {
        item.addEventListener("mousedown", () => {
            item.classList.add("box-shadow");
        })

        item.addEventListener("mouseup", () => {
            item.classList.remove("box-shadow")

            if (randomWord.toLowerCase().includes(item.innerText.toLowerCase())) {
                for (let i = 0; i < randomWord.length; i++) {
                    if (randomWord[i] === item.innerText.toLowerCase()) {
                        incrementer.push(i)
                        notAccessedItems.push(i)
                    }
                }
                clicked = incrementer.length;
                if (hintClicked == true) {
                    clicked += 1;
                }

                for (let inc = 0; inc < incrementer.length; inc++) {
                    spansArr[incrementer[inc]].style.borderBottom = "none";
                    spansArr[incrementer[inc]].style.textAlign = "center";
                    spansArr[0].style.textTransform = "capitalize";
                    spansArr[incrementer[inc]].innerText = randomWord[incrementer[inc]]
                }
            } else {
                livesArr.pop();
                lives.innerText = livesArr.join("");
                svgCont.innerHTML += hangmanArr[bodyCounter++];
            }

            item.classList.remove("box-shadow")
            item.style.pointerEvents = "none";
            item.classList.add("dim");

            // calling decideFunction

            decider()



        })
    })
}
gameLoop()

function decider() {
    if (clicked >= randomWord.length) {
        text("Won");
        allBtnDisNone()
    } else if (lives.innerText === "") {
        text("Lost")
        lives.innerText = "No Lifes!!";
        allBtnDisNone()
        spansArr.forEach(item => {
            item.style.marginRight = "none";
        })
        svgCont.innerHTML += `
        <text x="91" y="47" fill="rgb(74, 115, 172)" style="font-family: sans-serif">x</text>   
        <text x="105" y="47" fill="rgb(74, 115, 172)" style="font-family: sans-serif">x</text>
        `
    }

}

function allBtnDisNone() { // this is for the conciseness of the decider function
    btnsArr.forEach(item => {
        item.style.pointerEvents = "none";
        item.style.userSelect = "none";
    })
}

function text(decide) { // this is for the concisness 
    decideText.innerText = "You " + decide + "!! The Answer was: " + randomWord;
    decideText.classList.add("boxShadow");
}


// Reset btn

resetBtn.addEventListener("click", () => {
    reset()
})

function reset() { // all reset Part right 
    hint.style.display = "inline-block"
    decideText.classList.remove("boxShadow")
    btnsArr.forEach(item => {
        item.style.pointerEvents = "auto";
        item.style.userSelect = "auto";
        if (item.classList.contains("dim")) {
            item.classList.remove("dim");
            item.style.pointerEvents = "auto";
            item.style.userSelect = 'auto';
        }
    })

    bodyCounter = 0;
    livesArr = ["❤️", "❤️", "❤️", "❤️", "❤️", "❤️"];
    lives.innerText = "❤️❤️❤️❤️❤️❤️";
    incrementer = []
    svgCont.innerHTML = `
                    <line x1="0" y1="0" x2="0" y2="250" style="stroke:rgba(122, 17, 17, 0.822);stroke-width:15" />
                    <line x1="0" y1="0" x2="102" y2="0" style="stroke:rgba(122, 17, 17, 0.822);stroke-width:15" />
                    <line x1="4" y1="20" x2="32" y2="0" style="stroke:rgba(122, 17, 17, 0.822);stroke-width:9" />
                    <line x1="102" y1="0" x2="102" y2="30" style="stroke:rgba(122, 17, 17, 0.822);stroke-width:4" />
                    `;
    changeWord.innerHTML = "";
    spansArr = [];


    decideText.innerText = "";
    createSpans()
}