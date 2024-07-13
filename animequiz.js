import useGetTopAnimes from 'useGetTopAnimes.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Declare variables used throughout the game
    let playerIndex = 0;
    let animeList = [];
    let correctAnime = null;
    let correctChoiceIndex = null;
    let characterIndex = Math.floor(Math.random() * 5);
    let correctCharacter = null;
    let displayedChoices = [];
    let wrongChoices = [];
    let wrongChoiceDone = false;
    let charactersAlreadySeen = [];
    let isGameOver = false;
    let score = 0;
    let doneShuffling = false; 
    let timeRemaining = 15; // Initial time in seconds
    let timer; // Timer variable

    const rng = (max) => Math.floor(Math.random() * max);

    const gameElement = document.getElementById("game");
    const loadingElement = document.getElementById("loading");
    const gamePlayElement = document.getElementById("gamePlay");
    const gameOverElement = document.getElementById("gameOver");
    const characterImageElement = document.getElementById("characterImage");
    const correctCharacterImageElement = document.getElementById("correctCharacterImage");
    const correctCharacterNameElement = document.getElementById("correctCharacterName");
    const correctAnimeTitleElement = document.getElementById("correctAnimeTitle");
    const scoreDisplayElement = document.getElementById("scoreDisplay");
    const timeRemainingElement = document.getElementById("timeRemaining");
    const buttonContainerElement = document.getElementById("buttonContainer");
    const correctIndicatorElement = document.getElementById("correctIndicator");
    const scoreElement = document.getElementById("score");
    const playAgainButton = document.getElementById("playAgainButton");

    const PAGES_TO_GET = 5; // Example: Fetching data from 5 pages

    const resetGame = () => {
        isGameOver = false;
        gameOverElement.style.display = "none";
        gamePlayElement.style.display = "block";
        playerIndex = 0;
        shuffleAnimeList();
        updateGame();
    };

    playAgainButton.addEventListener("click", resetGame);

    const onChoose = (chosenIndex) => {
        if (chosenIndex === correctChoiceIndex) {
            addTime(3);
            showCorrectIndicator();
            nextCharacter();
        } else {
            gameOver();
            correctIndicatorElement.textContent = `INCORRECT, the answer was: ${correctAnime.title}`;
        }
    };

    const showCorrectIndicator = () => {
        correctIndicatorElement.textContent = "CORRECT! + 3 seconds";
        setTimeout(() => {
            correctIndicatorElement.textContent = "";
        }, 2000);
    };


    const randomizeChoices = () => {
        wrongChoices = shuffleArray(pickRandomElements(animeList, 3));
        characterIndex = rng(5);
        wrongChoiceDone = false;
    };

    const fetchResults = async () => {
      try {
          const { results, isDone } = await useGetTopAnimes(PAGES_TO_GET);
          animeList = results;
          if (isDone) {
              if (loadingElement) {  // Check if loadingElement is not null
                  loadingElement.style.display = "none";
              }
              if (gamePlayElement) {  // Check if gamePlayElement is not null
                  gamePlayElement.style.display = "block";
              }
              shuffleAnimeList();
          }
      } catch (error) {
          console.error("Error fetching results:", error);
      }
    };
  
    
    const shuffleAnimeList = () => {
        animeList = shuffleArray([...animeList]);
        doneShuffling = true;
        randomizeChoices();
    };
    

    const updateGame = () => {
        correctAnime = animeList[playerIndex];
        correctCharacter = correctAnime.characters[characterIndex];
        displayedChoices = [...wrongChoices];
        correctChoiceIndex = rng(4);
        displayedChoices.splice(correctChoiceIndex, 0, correctAnime);

        characterImageElement.src = correctCharacter.image;
        scoreDisplayElement.textContent = `Your Score: ${playerIndex}`;
        buttonContainerElement.innerHTML = displayedChoices
            .map((item, idx) => `<button class="button" data-idx="${idx}">${item.title}</button>`)
            .join("");

        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', (e) => {
                const chosenIndex = parseInt(e.target.getAttribute('data-idx'));
                onChoose(chosenIndex);
            });
        });

        correctIndicatorElement.textContent = "";
    };

    const nextCharacter = () => {
        playerIndex++;
        updateGame();
    };

    const gameOver = () => {
        isGameOver = true;
        gamePlayElement.style.display = "none";
        gameOverElement.style.display = "block";
        correctCharacterImageElement.src = correctCharacter.image;
        correctCharacterNameElement.textContent = correctCharacter.name;
        correctAnimeTitleElement.textContent = correctAnime.title;
        scoreElement.textContent = playerIndex;
    };

    const addTime = (secondsToAdd) => {
      timeRemaining += secondsToAdd; // Add seconds to remaining time
      timeRemainingElement.textContent = `Time Remaining: ${timeRemaining}`;
  };

  const updateTimer = () => {
      timeRemainingElement.textContent = `Time Remaining: ${timeRemaining}`;
      timeRemaining--;

      if (timeRemaining < 0) {
          clearInterval(timer);
          timeRemainingElement.textContent = "Time's up!";
          gameOver(); // Call game over function when time runs out
      }
  };

  // Call updateTimer function every second
  timer = setInterval(updateTimer, 1000);

    const pickRandomElements = (array, count) => {
        let result = new Array(count),
            len = array.length,
            taken = new Array(len);
        if (count > len)
            throw new RangeError("pickRandomElements: more elements taken than available");
        while (count--) {
            let x = Math.floor(Math.random() * len);
            result[count] = array[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    };

    const shuffleArray = (array) => {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    await fetchResults(); // Call fetchResults to start the game

    // Initial setup after fetching data
    if (animeList.length > 0) {
        updateGame();
    }
});
