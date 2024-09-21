
console.log(words[0]);
//set focus to input field
document.getElementById("typeWord").focus();
let validWord = 1;
let correctWord = "";
const params = new URLSearchParams(window.location.search);
const customWord = params.get('word');
const iv = params.get('iv');

async function getWord() {
  if (customWord) {
    
    const response = await fetch("/decodeWord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customWord: customWord,
        iv: iv,
      })
    });



    //const response = await fetch("/decodeWord?word=" + customWord + "&iv=" + iv)
    correctWord = await response.text();
    console.log(typeof String(correctWord));
    console.log(correctWord);
    

  } else {
    correctWord = words[Math.floor(Math.random() * words.length)];
  }

}
document.addEventListener("DOMContentLoaded", async (event) => {
  await getWord();
});


//Display facit on screen
//document.getElementById("facit").style.display = "block"
//document.getElementById("facit").innerHTML = correctWord;

let guessAmount = 0;
let won = false;
let inputBox = document.getElementById('typeWord');

//Add letters to their corresponding cell
inputBox.onkeyup = function (event) {
  let value = String(inputBox.value)

  const key = event.key;
  if (key === "Backspace" || key === "Delete") {
    console.log("DELETE");

    //$('#word' + (guessAmount + 1) + " .L" + (value.length+1)).removeClass('animate');
    if (!document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (value.length + 1))[0].classList.contains("animate")) {
      $('#word' + (guessAmount + 1) + " .L" + (value.length + 1)).addClass('animate');
    }
    else {
      $('#word' + (guessAmount + 1) + " .L" + (value.length + 1)).removeClass('animate');
    }
  }
  else if (key === "Enter") {
    return;

  } else {
    if (!document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (value.length))[0].classList.contains("animate")) {
      $('#word' + (guessAmount + 1) + " .L" + (value.length)).addClass('animate');
    }
    else {
      $('#word' + (guessAmount + 1) + " .L" + (value.length)).removeClass('animate');
    }
  }




  for (let index = 0; index < 5; index++) {
    let letter = document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (index + 1))[0];

    letter.innerHTML = value.charAt(index).toUpperCase();
    letter.style.color = "white";

  }
}


function guessFunc() {
  let guess = document.getElementById("typeWord").value;

  if (validWord == 1 && !words.includes(guess)) {
    for (let index = 0; index < 5; index++) {

      let letter = document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (index + 1))[0];
      let errorCode = "error"

      letter.innerHTML = errorCode.charAt(index).toUpperCase();
      letter.style.backgroundColor = "red";
      letter.style.color = "white";
      animateLetter(letter, guessAmount, index)
    }
    setTimeout(() => {
      for (let index = 0; index < 5; index++) {

        let letter = document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (index + 1))[0];
        letter.innerHTML = "";
        document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (index + 1))[0].style.backgroundColor = "black";
        letter.style.color = "white";

        animateLetter(letter, guessAmount, index)
      }
    }, 1400);
    //alert("Skriv venligst et gyldigt ord!")
    document.getElementById("typeWord").value = "";
    return;
  }

  for (let index = 0; index < 5; index++) {
    //change alphabet
    document.getElementsByClassName(guess.charAt(index))[0].style.color = "black";

    let letter = document.getElementById("word" + (guessAmount + 1)).getElementsByClassName("L" + (index + 1))[0];
    letter.style.color = "black";

    if (guess.charAt(index) == correctWord.charAt(index)) {
      letter.innerHTML = guess.charAt(index).toUpperCase();
      letter.style.backgroundColor = "lightgreen";
      document.getElementsByClassName(guess.charAt(index))[0].style.backgroundColor = "lightgreen";
    }
    else if (correctWord.includes(guess.charAt(index))) {
      letter.innerHTML = guess.charAt(index).toUpperCase();
      letter.style.backgroundColor = "rgb(248, 248, 127)";
      document.getElementsByClassName(guess.charAt(index))[0].style.backgroundColor = "rgb(248, 248, 127)";

    }
    else {
      letter.innerHTML = guess.charAt(index).toUpperCase();
      letter.style.backgroundColor = "gray";
      document.getElementsByClassName(guess.charAt(index))[0].style.backgroundColor = "gray";
    }
    animateLetter(letter, guessAmount, index)
  }
  if (correctWord == guess) {
    $('#youWinText1').addClass('win');
    $('#youWinText2').addClass('win');
    $('#typeWord').addClass('win');
    $('.allLetters').addClass('win');
    $('.midContainer').addClass('win');
    $('.styleBox1').addClass('win');
    $('.styleBox2').addClass('win');
    $('#playAgain').addClass('win');

    won = true;
  }
  if (guessAmount == 5 && won == false) {
    $('#youLooseText1').addClass('lost');
    $('#youLooseText2').addClass('lost');
    $('#typeWord').addClass('lost');
    $('.allLetters').addClass('lost');
    $('.midContainer').addClass('lost');
    $('.styleBox1').addClass('lost');
    $('.styleBox2').addClass('lost');
    $('#playAgain').addClass('lost');
    //alert("Du tabte!")
  }
  guessAmount++;
  console.log("guess count: " + guessAmount);
  document.getElementById("typeWord").value = "";
}

// Get the input field
let input = document.getElementById("typeWord");
// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("guessButton").click();
  }
});


function makeOwnWordleUI() {
  $('.styleBox1').addClass('minimize');
  $('.styleBox2').addClass('minimize');
  $('.midContainer').addClass('minimize');
  $('#doWordle').addClass('minimize');
  $('#makeWordle').addClass('minimize');
  setTimeout(() => {
    $('.midContainer2').addClass('maximize');
  }, 300);
  setTimeout(() => {

    $('.midContainer2').addClass('maximize2');
    $('.midContainer2').removeClass('minimize2');
  }, 400);
  $('.midContainer2').addClass('maximize');
}

function doWordleUI() {
  $('.styleBox1').removeClass('minimize');
  $('.styleBox2').removeClass('minimize');
  setTimeout(() => {
    $('.midContainer').addClass('minimize2');
  }, 300);
  setTimeout(() => {

    $('.midContainer').removeClass('minimize');
    $('.midContainer').removeClass('minimize2');
  }, 400);
  $('#doWordle').removeClass('minimize');
  $('#makeWordle').removeClass('minimize');
  $('.midContainer2').removeClass('maximize');
  $('.midContainer2').removeClass('maximize2');
}

async function makeWordle() {
  let ownWord = document.getElementById("typeOwnWordle").value.toLowerCase();
  console.log(ownWord);
  if (!$('.wordleRealWordYes').hasClass('notSelected')) {

    if (!words.includes(ownWord)) {
      alert("Skriv venligst et gyldigt ord!")
      return;
    }
    correctWord = ownWord;
    console.log(correctWord);
  }
  else if (ownWord.length !== 5) {
    alert("Skriv et ord på 5 bogstaver?")
    return;
  }
  if ($('.wordleRealWordYes').hasClass('notSelected')) {
    validWord = 0;
  }




  correctWord = ownWord;

  console.log(ownWord.length);
  //doWordleUI()
  //enable copy link button
  document.getElementById("copyLinkButton").disabled = false;


}
async function generateLink() {
  const word = correctWord;
  if (word) {
    // Construct the link with the custom word
    const response = await fetch("/getLink/" + correctWord)
    const link = await response.text();
    console.log(link);
    //const link = `http://localhost:3000/play?word=${encodeURIComponent(word)}`;
    navigator.clipboard.writeText(link);
    //document.getElementById('linkOutput').innerHTML = `<a href="${link}" target="_blank">Play Custom Wordle</a>`;
  } else {
    alert('Please enter a word!');
  }
}



function animateLetter(letter, guessAmount, index) {
  if (!letter.classList.contains("animate")) {
    $('#word' + (guessAmount + 1) + " .L" + (index + 1)).addClass('animate');
  }
  else {
    $('#word' + (guessAmount + 1) + " .L" + (index + 1)).removeClass('animate');
  }
}

//Check for real word or not
let yesBoxElement = document.getElementById("#realWordYesBox");
let noBoxElement = document.getElementById("#realWordNoBox");
$("#realWordNoBox").hover(function () {
  $('.wordleRealWordNo').addClass('selected');
  $('.wordleRealWordYes').addClass('notSelected');
});
$("#realWordYesBox").hover(function () {
  $('.wordleRealWordNo').removeClass('selected');
  $('.wordleRealWordYes').removeClass('notSelected');
});


let inputBoxMake = document.getElementById('typeOwnWordle');

inputBoxMake.onkeyup = function (event) {
  let value = String(inputBoxMake.value)

  const key = event.key;
  if (key === "Backspace" || key === "Delete") {
    console.log("DELETE");

    //$('#word' + (guessAmount + 1) + " .L" + (value.length+1)).removeClass('animate');
    if (!document.getElementsByClassName("ML" + (value.length + 1))[0].classList.contains("animate")) {
      $(".ML" + (value.length + 1)).addClass('animate');
    }
    else {
      $(".ML" + (value.length + 1)).removeClass('animate');
    }
  }
  else if (key === "Enter") {
    return;
  }
  else {
    if (!document.getElementsByClassName("ML" + (value.length))[0].classList.contains("animate")) {
      $(".ML" + (value.length)).addClass('animate');
    }
    else {
      $(".ML" + (value.length)).removeClass('animate');
    }

  }



  for (let index = 0; index < 5; index++) {
    let letter = document.getElementsByClassName("ML" + (index + 1))[0];

    letter.innerHTML = value.charAt(index).toUpperCase();
    letter.style.color = "white";
    console.log(inputBox.value.charAt(index));

  }
}

document.getElementById("playAgain").addEventListener("click", () => {
  location.reload();
});
