// Quiz spørgsmål (defineret én gang globalt)
if (typeof questions === 'undefined') {
    var questions = [
        {
            question: "Hvad bruges Moodle hovedsageligt til som studerende på Zealand?",
            options: [
                "At se videoindhold fra tidligere forelæsninger",
                "At få adgang til kursusmaterialer, opgaver og meddelelser",
                "At booke kantinepladser",
                "At finde studieboliger"
            ],
            correct: 1,
            feedback: "Moodle er dit primære værktøj til at holde styr på dine kurser, deadlines og kommunikation med undervisere."
        },
        {
            question: "Hvilken opgave kan du løse ved hjælp af Wiseflow?",
            options: [
                "Aflevere opgaver og eksaminer",
                "Bestille bøger fra biblioteket",
                "Se forelæsningsvideoer",
                "Finde din skema"
            ],
            correct: 0,
            feedback: "Wiseflow er platformen, hvor du indleverer dine opgaver og eksaminer. Husk at tjekke deadlines i god tid!"
        },
        {
            question: "Hvordan tjekker du dit skema for undervisning og forelæsninger?",
            options: [
                "Du modtager en mail hver uge med dit opdaterede skema",
                "Du skal logge ind på Zealand's skemasystem",
                "Dit skema hænger altid på skolens opslagstavle",
                "Du skal spørge din underviser efter hver time"
            ],
            correct: 1,
            feedback: "Du kan til enhver tid logge ind på skemasystemet for at se dine lektioner og ændringer i dit skema."
        },
        {
            question: "Hvornår afholdes den officielle fredagsbar på campus?",
            options: [
                "Hver dag efter kl. 16",
                "Den sidste fredag i måneden",
                "Hver fredag efter kl. 15",
                "Den første torsdag i måneden"
            ],
            correct: 2,
            feedback: "Fredagsbaren er det perfekte sted at mødes med dine medstuderende og afslutte ugen på en sjov måde!"
        },
        {
            question: "Hvilken mulighed tilbyder kantinen på Zealand?",
            options: [
                "Kun kolde retter",
                "Både varme og kolde retter samt salater",
                "Kun kaffe og snacks",
                "Ingen kantine på campus"
            ],
            correct: 1,
            feedback: "Kantinen tilbyder et bredt udvalg af mad, så du altid kan finde noget, der passer til din smag."
        },
        {
            question: "Skal du bruge en parkeringstilladelse for at parkere på Zealand's campus?",
            options: [
                "Ja, du skal hente den fra administrationen",
                "Nej, parkering er gratis for alle",
                "Ja, men den er digital og registreres via nummerplade",
                "Du må kun parkere i weekenden"
            ],
            correct: 2,
            feedback: "Husk at registrere din bil via systemet, så du undgår at få en bøde."
        },
        {
            question: "Kan du tage quizzer på Moodle for at teste din viden om kursusmaterialet?",
            options: [
                "Ja, visse undervisere bruger quizzer som en del af undervisningen",
                "Nej, quizzer findes kun i fysiske test",
                "Ja, men kun i eksamensperioden",
                "Nej, Moodle bruges kun til læsematerialer"
            ],
            correct: 0,
            feedback: "Moodle tilbyder quizfunktioner, som dine undervisere kan bruge til at hjælpe dig med at forstå kursusmaterialet."
        },
        {
            question: "Hvordan får du adgang til dit kursusmateriale på Moodle?",
            options: [
                "Du får det tilsendt via mail",
                "Du skal logge ind på Moodle og navigere til dit kursus",
                "Du downloader materialet fra skolens hjemmeside",
                "Materialet bliver lagt i klassens Facebook-gruppe"
            ],
            correct: 1,
            feedback: "Alt dit kursusmateriale bliver lagt op på Moodle, så du har adgang til det døgnet rundt."
        }
    ];
}

let currentQuestionIndex = 0;
let timeLeft = 30; // Starttid for nedtælling
let countdown;
let correctAnswersCount = 0; // Tæller for rigtige svar
let timeChange = 0; // Variabel til at holde styr på tidsændringen

// Funktion til at nulstille quizzen
function resetQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    timeLeft = 30;
    clearInterval(countdown); // Stop tidligere timer, hvis en er i gang
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('home-container').classList.add('active'); // Vis forsiden igen
}

// Start quizzen
function startQuiz() {
    resetQuiz(); // Nulstil quiz, før du starter en ny runde
    document.getElementById('home-container').classList.remove('active');
    document.getElementById('quiz-container').style.display = 'block'; // Vis quiz-container
    document.getElementById('progress-container').style.display = 'block'; // Vis progress bar
    document.getElementById('result').style.display = 'none'; // Skjul resultattavlen
    document.getElementById('home-btn').style.display = 'none'; // Skjul knappen til forsiden
    document.getElementById('next-btn').style.display = 'none'; // Skjul Næste knap ved start
    startTimer(); // Start timeren
    showQuestion(); // Vis det første spørgsmål
    timeChange = 0; // Reset timeChange til 0
}

// Start nedtælling
function startTimer() {
    const timerCircle = document.querySelector('.timer-circle circle');
    const radius = 45; // Radius af cirklen
    const circumference = 2 * Math.PI * radius; // Beregn cirkelens omkreds
    timerCircle.setAttribute('stroke-dasharray', circumference);
    timerCircle.setAttribute('stroke-dashoffset', circumference); // Start med fuld cirkel

    document.getElementById('time-text').textContent = timeLeft; // Vis initial tid i cirklen

    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('time-text').textContent = timeLeft; // Opdater teksten i cirklen

        const offset = circumference - (timeLeft / 30) * circumference; // Beregn ny offset baseret på den tilbageværende tid
        timerCircle.setAttribute('stroke-dashoffset', offset); // Opdater cirkelens offset

        if (timeLeft <= 0) {
            clearInterval(countdown);
            showCompletion(); // Gå til completion hvis tiden løber ud
        }
    }, 1000);
}

// Vis spørgsmål
function showQuestion() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const feedbackElement = document.getElementById('feedback');
    const progressBar = document.getElementById('progress-bar');

    const currentQuestion = questions[currentQuestionIndex];

    // Opdater spørgsmål og feedback
    questionElement.innerText = currentQuestion.question;
    feedbackElement.innerText = '';
    document.getElementById('next-btn').style.display = 'none'; // Skjul Næste knap indtil spørgsmålet er besvaret

    // Opdater progress bar
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progressPercentage + '%';

    // Fjern gamle knapper
    optionsContainer.innerHTML = '';

    // Tilføj nye knapper til hvert svar
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

// Tjek svar
function checkAnswer(selectedIndex, button) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = document.getElementById('options-container').children;
    const feedbackElement = document.getElementById('feedback');
    const timeChangeElement = document.getElementById('time-change'); // Hent det nye element til tidændringer

    // Vis feedback-sektionen
    feedbackElement.style.display = 'block'; // Sørg for feedback er synlig

    // Nulstil feedback
    feedbackElement.classList.remove('correct-feedback', 'incorrect-feedback');
    feedbackElement.innerText = ''; // Tøm feedback
    timeChangeElement.style.display = 'none'; // Skjul tidændringsbeskeden i starten

    // Kontrollér om svaret er korrekt
    if (selectedIndex === currentQuestion.correct) {
        button.classList.add('correct');
        feedbackElement.innerText = "Korrekt! " + currentQuestion.feedback;
        correctAnswersCount++; // Incrementer tælleren for rigtige svar
        timeLeft += 3; // Tilføj 3 sekunder ved korrekt svar
        timeChange += 3; // Opdater tidændring

        // Opdater tidændringsbesked
        timeChangeElement.innerText = `+${3} sekunder tilføjet!`; // Vis tid tilføjet
        timeChangeElement.style.color = '#4caf50'; // Grøn farve for tilføjet tid
        timeChangeElement.style.display = 'block'; // Vis beskeden

        // Tilføj grøn feedback baggrund
        feedbackElement.classList.add('correct-feedback'); // Tilføj korrekt farveknap

    } else {
        button.classList.add('incorrect');
        buttons[currentQuestion.correct].classList.add('correct');
        feedbackElement.innerText = "Forkert! " + currentQuestion.feedback;
        timeLeft -= 5; // Træk 5 sekunder ved forkert svar
        timeChange -= 5; // Opdater tidændring

        // Opdater tidændringsbesked
        timeChangeElement.innerText = `${5} sekunder trukket!`; // Vis tid trukket
        timeChangeElement.style.color = '#f44336'; // Rød farve for trukket tid
        timeChangeElement.style.display = 'block'; // Vis beskeden

        // Tilføj rød feedback baggrund
        feedbackElement.classList.add('incorrect-feedback'); // Tilføj forkertfarve knap
    }

    // Deaktiver knapper for at forhindre flere klik
    Array.from(buttons).forEach(btn => btn.disabled = true);

    // Stop timeren
    clearInterval(countdown);

    // Vis knappen "Næste"
    document.getElementById('next-btn').style.display = 'block';
}

// Gå til næste spørgsmål
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        document.getElementById('feedback').style.display = 'none'; // Skjul feedback
        document.getElementById('time-change').style.display = 'none';
        startTimer(); // Timeren fortsætter fra den tid, den var på.
    } else {
        showCompletion();
    }
}

// Vis resultattavle
function showCompletion() {
    clearInterval(countdown); // Stop timeren
    document.getElementById('question').innerText = "Quiz afsluttet! Tak for din deltagelse.";
    document.getElementById('options-container').innerHTML = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').style.display = 'none';

    // Vis resultattavle
    const resultElement = document.getElementById('result');
    resultElement.innerText = `Du havde ${correctAnswersCount} rigtige svar ud af ${questions.length}.`;
    resultElement.style.display = 'block'; // Vis resultattavlen
    document.getElementById('feedback').style.display = 'none'; // Skjul feedback

    // Vis knappen til at gå tilbage til forsiden
    document.getElementById('home-btn').style.display = 'block';
}

// Gå tilbage til forsiden
function goToHome() {
    resetQuiz();
}
