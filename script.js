import * as str from "./strings.js"
// Global Variables
let lives = document.querySelector(".lives");
let svgCont = document.querySelector("svg");
let changeWord = document.querySelector(".newWord");
let hangmanCont = document.querySelector(".hangmanCont");
let btnCont = document.querySelector(".btnCont");
let resetBtn = document.querySelector(".restart");
let decideText = document.querySelector(".deciderText")
let hangmanContWidth = hangmanCont.clientWidth;
let alphabetsArr = [];
let btnsArr = [];
let spansArr = [];
let livesArr = ["❤️", "❤️", "❤️", "❤️", "❤️", "❤️"];
const hangmanArr = [
    `<circle cx='102' cy='45' r='16' stroke='rgb(74, 115, 185)' fill='none' style='stroke-width: 2;'/>`,
    `<line x1='102' y1='105' x2='102' y2='60' style='stroke:rgb(74, 115, 172);stroke-width:3' />`,
    `<line x1="60" y1="95" x2="102" y2="72" style="stroke:rgb(74, 115, 172);stroke-width:3" />`,
    `<line x1="142" y1="95" x2="102" y2="72" style="stroke:rgb(74, 115, 172);stroke-width:3" />`,
    `<line x1="80" y1="135" x2="102" y2="105" style="stroke:rgb(74, 115, 172);stroke-width:3" />`,
    `<line x1="125" y1="135" x2="102" y2="105" style="stroke:rgb(74, 115, 172);stroke-width:3" />`
];

let selectedBtns = [];
let incrementer = [];
let bodyCounter = 0;
let clicked = 0;

function getRandomWord() {
    let word = "";
    let aboveThreeFilteredArr = str.arg[0].filter(word => word.length > 3);
    var randomNumber = Math.floor(Math.random() * aboveThreeFilteredArr.length);
    let storeWord = aboveThreeFilteredArr[randomNumber];
    word += storeWord;
    return word
}


function changeWidth() {
    btnCont.style.width = hangmanContWidth + 50 + "px";
}
changeWidth()




function createButtons() {
    let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let alphaArr = alphabets.split("");
    let count = 0;
    for (let i = 0; i < 26; i++) {
        var btn = document.createElement("button");
        btnCont.appendChild(btn);
        btn.classList.add("btn")
        btn.innerText = alphaArr[count++];
        alphabetsArr.push(alphaArr[i])
        btnsArr.push(btn);
    };
}
createButtons();






let randomWord;

function createSpans() {
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


resetBtn.addEventListener("click", () => {
    reset()
})



function reset() {
    decideText.classList.remove("boxShadow")
    btnsArr.forEach(item => {
        item.style.pointerEvents = "auto";
        item.style.userSelect = "auto";
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
    selectedBtns.forEach(item => {
        item.classList.remove("dim");
        item.style.pointerEvents = "auto";
        item.style.userSelect = 'auto';
    })

    decideText.innerText = ""
    createSpans()
}


function gameLoop() {
    btnsArr.forEach(item => {
        item.addEventListener("mousedown", () => {
            item.classList.add("box-shadow");
            selectedBtns.push(item);
        })

        item.addEventListener("mouseup", () => {
            item.classList.remove("box-shadow")

            if (randomWord.toLowerCase().includes(item.innerText.toLowerCase())) {
                for (let i = 0; i < randomWord.length; i++) {
                    if (randomWord[i] === item.innerText.toLowerCase()) {
                        incrementer.push(i)
                    }
                }
                clicked = incrementer.length;

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
    }

}

function allBtnDisNone() {
    btnsArr.forEach(item => {
        item.style.pointerEvents = "none";
        item.style.userSelect = "none";
    })
}

function text(decide) {
    decideText.innerText = "You " + decide + "!! The Answer was: " + randomWord;
    decideText.classList.add("boxShadow");
    svgCont.innerHTML += `
        <text x="91" y="47" fill="rgb(74, 115, 172)" style="font-family: sans-serif">x</text>   
        <text x="105" y="47" fill="rgb(74, 115, 172)" style="font-family: sans-serif">x</text>
        `
}