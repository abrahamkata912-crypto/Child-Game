let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playCorrectChime() {
    initAudio();
    const now = audioCtx.currentTime;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = 'triangle'; 
    gain.connect(audioCtx.destination);
    osc.connect(gain);
    
    osc.frequency.setValueAtTime(523.25, now); 
    osc.frequency.setValueAtTime(659.25, now + 0.1); 
    osc.frequency.setValueAtTime(783.99, now + 0.2); 
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
}

function playApplauseSound() {
    initAudio();
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200 + Math.random() * 300, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }, i * 65); 
    }
}

function playWrongSound() {
    initAudio();
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}

// 10 የልጆች አጫጭር ጥያቄዎች ማከማቻ
const questions = [
    {
        question: "የኖኅ መርከብ ውስጥ ያልገባው የትኛው ነው? 🚢",
        options: ["አንበሳ 🦁", "ዓሣ 🐟", "ዝሆን 🐘", "ወፍ 🐦"],
        answer: "ዓሣ 🐟"
    },
    {
        question: "በጣም ግዙፍና ረዥም አፍንጫ ያለው እንስሳ ማን ነው? 🌳",
        options: ["ድመት 🐱", "ዝሆን 🐘", "አንበሳ 🦁", "ጥንቸል 🐰"],
        answer: "ዝሆን 🐘"
    },
    {
        question: "ከነዚህ ውስጥ ቢጫ ቀለም ያለው የትኛው ነው? 💛",
        options: ["ሙዝ 🍌", "አፕል 🍎", "ሐብሐብ 🍉", "ወይን 🍇"],
        answer: "ሙዝ 🍌"
    },
    {
        question: "ታናሹ እረኛ ዳዊት በወንጭፍ የጣለው ማንን ነው? ⚔️",
        options: ["ጎልያድን  Goliath", "साኦልን", "ፈርኦንን", "ሰሎሞንን"],
        answer: "ጎልያድን  Goliath"
    },
    {
        question: "የሰማይ ወፎች ስንት እግር አላቸው? 🦅",
        options: ["4 እግር", "2 እግር", "6 እግር", "እግር የላቸውም"],
        answer: "2 እግር"
    },
    {
        question: "በጣም ፈጣን የሆነውና በጫካ ውስጥ የሚሮጠው እንስሳ ማን ነው? 🐆",
        options: ["ኤሊ 🐢", "ነብር 🐆", "ቀንድ አውጣ 🐌", "ድብ 🐻"],
        answer: "ነብር 🐆"
    },
    {
        question: "የቀስተ ደመና (Rainbow) ቀለማት ስንት ናቸው? 🌈",
        options: ["5 ቀለማት", "7 ቀለማት", "3 ቀለማት", "10 ቀለማት"],
        answer: "7 ቀለማት"
    },
    {
        question: "ዮናስን የዋጠው ትልቁ ፍጡር ምንድን ነው? 🌊",
        options: ["አዞ 🐊", "ትልቅ ዓሣ  whale", "እባብ 🐍", "ሻርክ 🦈"],
        answer: "ትልቅ ዓሣ  whale"
    },
    {
        question: "ማር (Honey) የሚሰጠን ታታሪ ነፍሳት ማን ናት? 🐝",
        options: ["ትንኝ 🦟", "ንብ 🐝", "ብልጭልጭ 🦋", "ጉንዳን 🐜"],
        answer: "ንብ 🐝"
    },
    {
        question: "በመጽሐፍ ቅዱስ ውስጥ በጣም ብርቱና ኃይለኛ የነበረው ሰው ማን ነው? 💪",
        options: ["ሳምሶን Samson", "ዮናስ", "አዳም", "ኖኅ"],
        answer: "ሳምሶን Samson"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 20; 
let timerInterval;

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const timerBox = document.querySelector(".timer-box");

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    restartButton.classList.add("hidden");
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => {
            initAudio(); 
            selectAnswer(button, option, currentQuestion.answer);
        });
        optionsContainer.appendChild(button);
    });

    startTimer();
}

function resetState() {
    clearInterval(timerInterval);
    timeLeft = 20;
    timerElement.innerText = timeLeft;
    timerBox.classList.remove("timer-low");
    nextButton.classList.add("hidden");
    resultMessage.classList.add("hidden");
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;

        if (timeLeft <= 5) {
            timerBox.classList.add("timer-low"); 
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    const correctAnswer = questions[currentQuestionIndex].answer;
    const allButtons = optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.disabled = true);

    resultMessage.innerText = `ሰዓት አልቋል! ⏰ ትክክለኛው መልስ፡ ${correctAnswer} ነው 👍`;
    resultMessage.style.color = "#ff9800";
    resultMessage.classList.remove("hidden");

    allButtons.forEach(btn => {
        if (btn.innerText === correctAnswer) {
            btn.classList.add("correct");
        }
    });

    playWrongSound();
    nextButton.classList.remove("hidden");
}

function selectAnswer(selectedButton, selectedOption, correctAnswer) {
    clearInterval(timerInterval);
    const allButtons = optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        selectedButton.classList.add("correct");
        resultMessage.innerText = "ጎበዝ! 👏 ትክክል ነህ 🎉";
        resultMessage.style.color = "#4caf50";
        
        score += 1; 
        scoreElement.innerText = score;
        
        playCorrectChime();
        setTimeout(playApplauseSound, 250); 
    } else {
        selectedButton.classList.add("wrong");
        resultMessage.innerText = `አይደለም ❌ ትክክለኛው፡ ${correctAnswer} ነው`;
        resultMessage.style.color = "#f44336";
        
        allButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });

        playWrongSound(); 
    }

    resultMessage.classList.remove("hidden");
    nextButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        questionElement.innerText = `🥇 ጨዋታው ተጠናቋል! ያገኘኸው የኮከብ ብዛት፦ ⭐ ${score} / ${questions.length} ⭐ ነው!`;
        resetState();
        restartButton.classList.remove("hidden");
    }
});

restartButton.addEventListener("click", startGame);

startGame();
