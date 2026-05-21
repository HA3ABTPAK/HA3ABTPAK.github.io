// ==================== 6.1: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================

// date_start - время когда все участники нажали "старт"
let date_start = undefined;

// start_triger - массив флагов, кто из участников уже нажал свою кнопку для старта
let start_triger = [];

// flag - true когда ВСЕ участники нажали старт (тренировка началась)
let flag = false;

// flag_full_stop - true когда тренировка полностью завершена (все закончили или таймер истёк)
let flag_full_stop = false;

// participantSteps - массив, сколько упражнений выполнил каждый участник
let participantSteps = [];

// participantNames - массив имён участников
let participantNames = ['Участник 1', 'Участник 2', 'Участник 3', 'Участник 4'];

// participantEmojis - массив эмодзи для каждого участника
let participantEmojis = ['😀', '😎', '🤩', '🚀'];

// exe - массив выбранных упражнений
let exe = []; 

// rounds - количество кругов
let rounds = 1;

// step - общее количество "шагов" = количество упражнений * количество кругов
let step = 0;

// step_percent - сколько процентов прогресса даёт один шаг
let step_percent = 0;

// participantCount - количество участников (по умолчанию 4)
let participantCount = 4;

// participantTimes - объект для хранения времени завершения каждого участника
let participantTimes = {};

// finishedParticipants - счётчик, сколько участников уже завершили тренировку
let finishedParticipants = 0;

// isComplexFinished - флаг, что комплекс завершён (чтобы не проигрывать звуки повторно)
let isComplexFinished = false;

// Переменные для таймера
let timerEnabled = false;           // Включён ли таймер
let timerInterval = null;           // ID интервала таймера
let timerDuration = 600;            // Длительность в секундах (по умолчанию 10 минут)
let remainingTime = timerDuration;  // Оставшееся время
let totalDurationInterval = null;   // ID интервала общего времени тренировки

// Переменные для звуков
let isMusicPlaying = false;         // (не используется в коде)
let isPlaceSoundPlaying = false;    // Проигрывается ли сейчас звук места (1, 2, 3 место)
let currentSoundIndex = 1;          // Какой звук из 1-15 сейчас играет

// ===== НАСТРОЙКИ АВТООБНОВЛЕНИЯ PWA =====
const UPDATE_CHECK_INTERVAL_MS = 60000; // Проверять обновления каждые 60 секунд
let pendingUpdate = false;              // Флаг: нужно ли обновление после тренировки

// Доступные эмодзи для выбора в настройках
const availableEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🦠', '💪', '👑', '🏆', '🚀', '🔥', '⭐', '❤️', '💥', '🎯', '🏋️', '⛹️', '🏃'];

// Готовые комплексы кроссфита
const crossfitComplexes = {
    'catching up': ['20 выпадов с гантелью М/Ж 20/10 кг', '15 прыжков на тумбу М/Ж Low/Low', 'подтягивания М/Ж 10/5', '15 махи гири М/Ж 24/12 кг', '20 выпадов с гантелью М/Ж 20/10 кг', '10 болгарский присед М/Ж 20/10 кг', '20 бросков мяча М/Ж 9/6 кг', '10 рывков гантели М/Ж 20/10 кг', 'бег М/Ж 20/10 калл'],
    'cindy': ['5 подтягиваний', '10 отжиманий', '15 приседаний'],
    'fran': ['21-15-9 подтягивания', '21-15-9 трастеры'],
    'helen': ['400м бег', '21 мах гирей', '12 подтягиваний'],
    'Бочамба': ['Жим от груди 60 кг/20 раз', 'Пресс 20 раз', 'Подтягивания 10 раз', 'Тяга блока стоя, руки прямые 80 фунт/20 раз', 'Прицепс 60 фунт/20 раз', 'Бицепс EZ 20 кг/20 раз'],
};

let currentComplexName = 'Пользовательский';
let complexWasSelected = false;

// ==================== 6.2: ИНИЦИАЛИЗАЦИЯ ЗВУКОВ ====================

// Howl - это объект из библиотеки Howler.js для работы со звуком
const sounds = {
    intro: new Howl({ src: ['sound/intro.mp3'], loop: true, volume: 1.0 }), // Фоновая музыка при запуске, играет по кругу
    click: new Howl({ src: ['sound/click.mp3'], volume: 2.0 }),
    sound1: new Howl({ src: ['sound/sound1.mp3'], volume: 1.0 }),
    sound2: new Howl({ src: ['sound/sound2.mp3'], volume: 1.0 }),
    sound3: new Howl({ src: ['sound/sound3.mp3'], volume: 1.0 }),
    sound4: new Howl({ src: ['sound/sound4.mp3'], volume: 1.0 }),
    sound5: new Howl({ src: ['sound/sound5.mp3'], volume: 1.0 }),
    sound6: new Howl({ src: ['sound/sound6.mp3'], volume: 1.0 }),
    sound7: new Howl({ src: ['sound/sound7.mp3'], volume: 1.0 }),
    sound8: new Howl({ src: ['sound/sound8.mp3'], volume: 1.0 }),
    sound9: new Howl({ src: ['sound/sound9.mp3'], volume: 1.0 }),
    sound10: new Howl({ src: ['sound/sound10.mp3'], volume: 1.0 }),
    sound11: new Howl({ src: ['sound/sound11.mp3'], volume: 1.0 }),
    sound12: new Howl({ src: ['sound/sound12.mp3'], volume: 1.0 }),
    sound13: new Howl({ src: ['sound/sound13.mp3'], volume: 1.0 }),
    sound14: new Howl({ src: ['sound/sound14.mp3'], volume: 1.0 }),
    sound15: new Howl({ src: ['sound/sound15.mp3'], volume: 1.0 }),
    end: new Howl({ src: ['sound/end.mp3'], volume: 1.0 }),      // Звук окончания тренировки
    place1: new Howl({ src: ['sound/place1.mp3'], volume: 1.0 }), // Звук за 1 место
    place2: new Howl({ src: ['sound/place2.mp3'], volume: 1.0 }), // Звук за 2 место
    place3: new Howl({ src: ['sound/place3.mp3'], volume: 1.0 }), // Звук за 3 место
    place: new Howl({ src: ['sound/place.mp3'], volume: 1.0 })    // Звук за остальные места
};

// ==================== 6.3: НАСТРОЙКА ЦЕПОЧКИ ЗВУКОВ ====================

// Эта функция настраивает автоматическое переключение между звуками 1-15
function setupSoundChain() {
    for (let i = 1; i <= 15; i++) {
        sounds[`sound${i}`].on('end', () => {
            if (!isComplexFinished && !isPlaceSoundPlaying) {
                currentSoundIndex = i === 15 ? 1 : i + 1;
                sounds[`sound${currentSoundIndex}`].play();
            }
        });
    }
}

// ==================== 6.4: УПРАВЛЕНИЕ ЗВУКАМИ ====================

function pauseMainSounds() {
    for (let i = 1; i <= 15; i++) {
        const soundKey = `sound${i}`;
        if (sounds[soundKey] && sounds[soundKey].playing()) {
            sounds[soundKey].pause();
        }
    }
}

function resumeMainSound() {
    if (isComplexFinished) return;
    
    if (currentSoundIndex >= 1 && currentSoundIndex <= 15) {
        const soundKey = `sound${currentSoundIndex}`;
        if (sounds[soundKey] && !sounds[soundKey].playing()) {
            sounds[soundKey].play();
        }
    }
}

function playPlaceSound(place) {
    if (isPlaceSoundPlaying || isComplexFinished) return;
    
    isPlaceSoundPlaying = true;
    pauseMainSounds();
    
    let placeSound;
    switch(place) {
        case 1:
            placeSound = sounds.place1;
            break;
        case 2:
            placeSound = sounds.place2;
            break;
        case 3:
            placeSound = sounds.place3;
            break;
        default:
            placeSound = sounds.place;
    }
    
    placeSound.play();
    
    placeSound.on('end', () => {
        isPlaceSoundPlaying = false;
        if (!isComplexFinished) {
            resumeMainSound();
        }
    });
}

// ==================== ФУНКЦИЯ ПРОВЕРКИ ОБНОВЛЕНИЙ ====================
/**
 * Проверяет, не вышла ли новая версия приложения
 * Если версия изменилась и тренировка не активна — перезагружает страницу
 * Если тренировка активна — устанавливает флаг отложенного обновления
 */
async function checkForUpdates() {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        console.log('Service Worker не активен, проверка обновлений пропущена');
        return;
    }

    try {
        const messageChannel = new MessageChannel();
        
        const versionPromise = new Promise((resolve) => {
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.version);
            };
        });

        navigator.serviceWorker.controller.postMessage(
            { type: 'CHECK_VERSION' },
            [messageChannel.port2]
        );

        const swVersion = await versionPromise;
        
        // Если у страницы ещё нет версии — сохраняем её и выходим
        if (!window.APP_VERSION) {
            window.APP_VERSION = swVersion;
            console.log(`Версия приложения сохранена: ${window.APP_VERSION}`);
            return;
        }
        
        // Сравниваем версии
        if (swVersion !== window.APP_VERSION) {
            console.log(`Найдена новая версия: ${swVersion} (текущая: ${window.APP_VERSION})`);
            
            // Проверяем, идёт ли тренировка
            const isWorkoutActive = flag === true && !flag_full_stop && !isComplexFinished;
            
            if (!isWorkoutActive) {
                console.log('Тренировка не активна, перезагрузка для обновления...');
                window.location.reload();
            } else {
                console.log('Тренировка активна, обновление отложено до её завершения');
                pendingUpdate = true;
            }
        }
    } catch (error) {
        console.error('Ошибка при проверке обновлений:', error);
    }
}

// ==================== 6.5: ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================

function init() {
    setupSoundChain();
    
    const now = new Date();
    document.getElementById('currentDate').textContent = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    
    for (const complex in crossfitComplexes) {
        const option = document.createElement('option');
        option.value = complex;
        option.textContent = complex.charAt(0).toUpperCase() + complex.slice(1);
        document.getElementById('complexSelect').appendChild(option);
    }
    
    document.getElementById('timerEnabled').addEventListener('change', function() {
        timerEnabled = this.checked;
        document.getElementById('timerSettings').style.display = timerEnabled ? 'block' : 'none';
        if (timerEnabled) {
            updateTimerInputs();
        }
    });
    
    document.getElementById('timerMinutes').addEventListener('change', updateTimerInputs);
    document.getElementById('timerSeconds').addEventListener('change', updateTimerInputs);
    document.getElementById('roundCount').addEventListener('change', updateRoundCount);
    document.getElementById('participantCount').addEventListener('change', updateParticipants);
    
    document.getElementById('applyNamesBtn').addEventListener('click', applyNames);
    document.getElementById('addExerciseBtn').addEventListener('click', addExercise);
    document.getElementById('clearExercisesBtn').addEventListener('click', clearExercises);
    document.getElementById('loadComplexBtn').addEventListener('click', loadComplex);
    document.getElementById('startWorkoutBtn').addEventListener('click', startWorkout);
    document.getElementById('menuBtn').addEventListener('click', showMenu);
    document.getElementById('endWorkoutBtn').addEventListener('click', endWorkoutEarly);
    document.getElementById('resetWorkoutBtn').addEventListener('click', resetWorkout);
    document.getElementById('backToSetupBtn').addEventListener('click', backToSetup);
    document.getElementById('closeMenuBtn').addEventListener('click', hideMenu);
    
    document.addEventListener('keydown', eventPressKey);
    
    updateParticipants();
    updateNameInputs();
    updateExerciseList();
    
    function unlockAndPlay() {
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume().then(() => {
                if (!sounds.intro.playing()) {
                    sounds.intro.play();
                }
            });
        } else if (!sounds.intro.playing()) {
            sounds.intro.play();
        }
    }
    
    unlockAndPlay();
    
    document.addEventListener('touchstart', unlockAndPlay, { once: true });
    document.addEventListener('click', unlockAndPlay, { once: true });
}

// ==================== 6.6: ФУНКЦИИ ТАЙМЕРА ====================

function updateTimerInputs() {
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    timerDuration = minutes * 60 + seconds;
    remainingTime = timerDuration;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplayWorkout').textContent = timeStr;
}

function startTimer() {
    if (!timerEnabled) return;
    stopTimer();
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        if (remainingTime <= 0) {
            endComplex();
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTotalDurationTimer() {
    const startTime = new Date();
    totalDurationInterval = setInterval(() => {
        const duration = Math.floor((new Date() - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        document.getElementById('totalTimeDisplay').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTotalDurationTimer() {
    if (totalDurationInterval) {
        clearInterval(totalDurationInterval);
        totalDurationInterval = null;
    }
}

// ==================== 6.7: ФУНКЦИИ УПРАВЛЕНИЯ УЧАСТНИКАМИ ====================

function updateParticipants() {
    participantCount = parseInt(document.getElementById('participantCount').value);
    const container = document.getElementById('participantsContainer');
    container.innerHTML = '';
    participantSteps = [];
    start_triger = [];
    participantTimes = {};
    
    for (let i = 0; i < participantCount; i++) {
        const participantId = String.fromCharCode(97 + i);
        const participant = document.createElement('div');
        participant.className = 'participant';
        participant.id = participantId;
        participant.dataset.participantIndex = i;
        participant.innerHTML = `
            <div class="participant__photo" data-participant-index="${i}">
                <div class="participant__emoji">${participantEmojis[i]}</div>
                <div class="participant__name">${participantNames[i]}</div>
            </div>
            <div class="participant__progress-container">
                <div class="progress__bar-container">
                    <div class="progress__bar" id="${participantId}_progress"></div>
                </div>
                <div class="progress__text">
                    <p class="progress__exercise">${exe.length > 0 ? exe[0] : 'Выберите упражнения'}</p>
                    <div class="participant__time" id="${participantId}_time"></div>
                </div>
            </div>
        `;
        container.appendChild(participant);
        participantSteps.push(0);
        start_triger.push(0);
    }
    
    document.querySelectorAll('.participant__photo').forEach(photo => {
        photo.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.participantIndex);
            handleParticipantClick(index);
        });
    });
    
    updateNameInputs();
}

function updateNameInputs() {
    const container = document.getElementById('nameInputsContainer');
    container.innerHTML = '';
    for (let i = 0; i < participantCount; i++) {
        const row = document.createElement('div');
        row.className = 'name-input';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'name-input__field';
        input.placeholder = `Имя ${i+1}`;
        input.value = participantNames[i] || '';
        input.dataset.index = i;
        
        const select = document.createElement('select');
        select.className = 'name-input__emoji';
        select.dataset.index = i;
        availableEmojis.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e;
            opt.textContent = e;
            if (e === participantEmojis[i]) opt.selected = true;
            select.appendChild(opt);
        });
        
        row.appendChild(input);
        row.appendChild(select);
        container.appendChild(row);
    }
}

function applyNames() {
    const inputs = document.querySelectorAll('.name-input__field');
    const selects = document.querySelectorAll('.name-input__emoji');
    for (let i = 0; i < participantCount; i++) {
        if (i < inputs.length) {
            participantNames[i] = inputs[i].value || `Участник ${i+1}`;
            participantEmojis[i] = selects[i].value;
        }
    }
    updateParticipants();
}

// ==================== 6.8: ФУНКЦИИ УПРАВЛЕНИЯ УПРАЖНЕНИЯМИ ====================

function updateRoundCount() {
    rounds = parseInt(document.getElementById('roundCount').value) || 1;
    updateStep();
}

function addExercise() {
    const ex = document.getElementById('exerciseSelect').value;
    if (ex && !exe.includes(ex)) {
        exe.push(ex);
        if (!complexWasSelected) {
            currentComplexName = 'Пользовательский';
        }
        updateExerciseList();
        updateStep();
    }
}

function loadComplex() {
    const complex = document.getElementById('complexSelect').value;
    if (!complex) return alert('Выберите комплекс!');
    
    currentComplexName = complex;
    complexWasSelected = true;
    exe = [...crossfitComplexes[complex]];
    updateExerciseList();
    updateStep();
    if (complex === 'cindy') document.getElementById('roundCount').value = 30;
    else if (complex === 'helen') document.getElementById('roundCount').value = 3;
    else document.getElementById('roundCount').value = 1;
    updateRoundCount();
}

function clearExercises() {
    exe = [];
    currentComplexName = 'Пользовательский';
    complexWasSelected = false;
    updateExerciseList();
    updateStep();
}

function removeExercise(index) {
    exe.splice(index, 1);
    updateExerciseList();
    updateStep();
}

function updateExerciseList() {
    const list = document.getElementById('exerciseList');
    list.innerHTML = '';
    exe.forEach((ex, i) => {
        const li = document.createElement('li');
        li.className = 'exercise-list__item';
        li.innerHTML = `<span>${i+1}. ${ex}</span><button class="exercise-list__remove" data-index="${i}">Удалить</button>`;
        list.appendChild(li);
    });
    
    document.querySelectorAll('.exercise-list__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            exe.splice(index, 1);
            if (!complexWasSelected) {
                currentComplexName = 'Пользовательский';
            }
            updateExerciseList();
            updateStep();
        });
    });
}

function updateStep() {
    step = exe.length * rounds;
    step_percent = step > 0 ? 100 / step : 0;
}

// ==================== 6.9: ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ ====================

function startWorkout() {
    if (exe.length === 0) return alert('Добавьте упражнения!');

    // Проверка ориентации экрана
    if (window.innerHeight > window.innerWidth) {
        alert("📱 Поверните телефон горизонтально для удобной тренировки!");
    }
    
    currentSoundIndex = 1;
    
    document.getElementById('setupMode').classList.add('hidden');
    document.getElementById('workoutMode').classList.remove('hidden');
    
    resetProgressBars();
    updateParticipants();
    
    if (timerEnabled) {
        document.getElementById('timerDisplayWorkout').style.display = 'block';
        updateTimerDisplay();
    } else {
        document.getElementById('timerDisplayWorkout').style.display = 'none';
    }
    
    document.getElementById('totalTimeDisplay').textContent = '00:00';

    // Отображаем название комплекса
    const complexNameElement = document.getElementById('complexNameDisplay');
    if (complexNameElement) {
        complexNameElement.textContent = currentComplexName;
    }
}

function showMenu() {
    document.getElementById('menuOverlay').classList.add('menu--visible');
}

function hideMenu() {
    document.getElementById('menuOverlay').classList.remove('menu--visible');
}

function backToSetup() {
    document.getElementById('menuOverlay').classList.remove('menu--visible');
    
    stopTimer();
    stopTotalDurationTimer();
    
    sounds.intro.stop();
    sounds.end.stop();
    sounds.place.stop();
    sounds.place1.stop();
    sounds.place2.stop();
    sounds.place3.stop();
    for (let i = 1; i <= 15; i++) {
        if (sounds[`sound${i}`]) {
            sounds[`sound${i}`].stop();
        }
    }
    
    flag = false;
    flag_full_stop = false;
    isComplexFinished = false;
    isPlaceSoundPlaying = false;
    currentSoundIndex = 1;
    start_triger = new Array(participantCount).fill(0);
    
    document.getElementById('workoutMode').classList.add('hidden');
    document.getElementById('setupMode').classList.remove('hidden');
    
    setTimeout(() => {
        if (!sounds.intro.playing()) {
            sounds.intro.play();
        }
    }, 200);
}

function resetWorkout() {
    document.getElementById('menuOverlay').classList.remove('menu--visible');
    
    sounds.end.stop();
    for (let i = 1; i <= 15; i++) {
        if (sounds[`sound${i}`]) {
            sounds[`sound${i}`].stop();
        }
    }
    
    resetProgressBars();
    
    currentSoundIndex = 1;
    isComplexFinished = false;
    flag_full_stop = false;
    sounds.sound1.play();
}

function endWorkoutEarly() {
    if (!isComplexFinished) {
        endComplex();
    }
    showMenu();
}

function resetProgressBars() {
    isComplexFinished = false;
    isPlaceSoundPlaying = false;
    participantSteps = new Array(participantCount).fill(0);
    flag = false;
    flag_full_stop = false;
    start_triger = new Array(participantCount).fill(0);
    participantTimes = {};
    finishedParticipants = 0;
    
    document.querySelectorAll('.progress__bar').forEach(b => {
        b.style.width = '0%';
        b.className = 'progress__bar';
    });
    
    const firstEx = exe.length > 0 ? exe[0] : 'Выберите упражнения';
    document.querySelectorAll('.progress__exercise').forEach((p, i) => {
        if (i < participantCount) p.textContent = firstEx;
    });
    
    document.querySelectorAll('.participant__time').forEach(t => t.textContent = '');
    
    stopTimer();
    stopTotalDurationTimer();
    document.getElementById('totalTimeDisplay').textContent = '00:00';
    
    if (timerEnabled) {
        remainingTime = timerDuration;
        updateTimerDisplay();
    }
    
    for (let i = 1; i <= 15; i++) sounds[`sound${i}`]?.stop();
    sounds.end?.stop();
    currentSoundIndex = 1;
}

// ==================== 6.10: ОБРАБОТКА НАЖАТИЙ КЛАВИШ ====================

function eventPressKey(event) {
    if (flag_full_stop || document.getElementById('workoutMode').classList.contains('hidden')) return;
    
    let pressedParticipantIndex = -1;
    for (let i = 0; i < participantCount; i++) {
        if (event.code === `Digit${i+1}`) {
            pressedParticipantIndex = i;
            break;
        }
    }
    
    if (pressedParticipantIndex === -1) return;
    
    if (!flag) {
        start_triger[pressedParticipantIndex] = 1;
        
        if (start_triger.every(v => v === 1)) {
            flag = true;
            date_start = new Date();
            sounds.intro.stop();
            sounds.sound1.play();
            startTimer();
            startTotalDurationTimer();
        }
        return;
    }
    
    handleParticipant(pressedParticipantIndex, `${String.fromCharCode(97 + pressedParticipantIndex)}_progress`);
    
    if (participantSteps.every(s => s === step)) {
        endComplex();
        flag_full_stop = true;
    }
}

function handleParticipantClick(index) {
    if (flag_full_stop || document.getElementById('workoutMode').classList.contains('hidden')) return;
    
    if (!flag) {
        start_triger[index] = 1;
        
        if (start_triger.every(v => v === 1)) {
            flag = true;
            date_start = new Date();
            sounds.intro.stop();
            sounds.sound1.play();
            startTimer();
            startTotalDurationTimer();
        }
        return;
    }
    
    handleParticipant(index, `${String.fromCharCode(97 + index)}_progress`);
    
    if (participantSteps.every(s => s === step)) {
        endComplex();
        flag_full_stop = true;
    }
}

// ==================== 6.11: ЛОГИКА ПРОГРЕССА УЧАСТНИКА ====================

function handleParticipant(index, progressId) {
    // ===== ЗВУК НАЖАТИЯ =====
    if (sounds.click && !flag_full_stop) {
        sounds.click.play();
    }
    
    if (index >= participantCount) return;
    let stepVar = participantSteps[index];
    if (stepVar >= step) return;
    
    stepVar++;
    participantSteps[index] = stepVar;
    
    const bar = document.getElementById(progressId);
    bar.style.width = (stepVar * step_percent) + '%';
    
    if (stepVar < step) {
        const exIndex = (stepVar - 1) % exe.length;
        const round = Math.floor((stepVar - 1) / exe.length) + 1;
        const textEls = document.querySelectorAll('.progress__exercise');
        if (textEls[index]) textEls[index].textContent = `${exe[exIndex]} (Круг ${round})`;
    }
    
    // Определяем цвет прогресс-бара
    const others = [...participantSteps];
    others.splice(index, 1);
    const max = others.length > 0 ? Math.max(...others) : 0;
    const min = others.length > 0 ? Math.min(...others) : 0;
    
    bar.className = 'progress__bar';
    
    if (stepVar > max) {
        bar.classList.add('progress__bar--leading');
    } else if (stepVar <= min) {
        bar.classList.add('progress__bar--falling-behind');
    } else {
        bar.classList.add('progress__bar--middle');
    }
    
    if (stepVar === step) {
        bar.classList.add('progress__bar--finished');
        
        finishedParticipants++;
        
        // Текст места вместо упражнения
        let placeDisplay = '';
        switch(finishedParticipants) {
            case 1: placeDisplay = '👑 - ПОБЕДИТЕЛЬ'; break;
            case 2: placeDisplay = '😎 - 2 МЕСТО'; break;
            case 3: placeDisplay = '🥺 - 3 МЕСТО'; break;
            default: placeDisplay = '🤬 - 4 МЕСТО';
        }
        document.querySelectorAll('.progress__exercise')[index].innerHTML = `<span class="progress__emoji">${placeDisplay}</span>`;
        
        // Время
        const duration = new Date() - date_start;
        const mins = Math.floor(duration / 60000);
        const secs = Math.floor((duration % 60000) / 1000);
        
        document.getElementById(`${String.fromCharCode(97 + index)}_time`).textContent = `Время: ${mins} мин ${secs} сек`;
        
        playPlaceSound(finishedParticipants);
    }
}

// ==================== 6.12: ЗАВЕРШЕНИЕ КОМПЛЕКСА ====================

function endComplex() {
    if (isComplexFinished) return;
    
    isComplexFinished = true;
    flag_full_stop = true;
    stopTimer();
    stopTotalDurationTimer();
    
    for (let i = 1; i <= 15; i++) {
        if (sounds[`sound${i}`]) {
            sounds[`sound${i}`].stop();
        }
    }
    
    sounds.end.play();
    
    // ===== ПРОВЕРКА: не нужно ли отложенное обновление =====
    if (pendingUpdate) {
        console.log('Тренировка завершена, выполняем отложенное обновление...');
        pendingUpdate = false;
        window.location.reload();
    }
}

// ==================== 6.13: ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ====================

// Делаем функцию checkForUpdates доступной глобально для вызова из HTML
window.checkForUpdates = checkForUpdates;

window.onload = init;
