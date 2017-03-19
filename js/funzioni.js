// JavaScript Document
'use strict';

//Controllo se registro è disponibile:
function isAviable(letter) {
    if (letter == null) {
        return true
    }
    if (letter != letter.toUpperCase()) {
        var upperRegister = letter.toUpperCase();
        upperRegister = "reg_" + upperRegister;
        upperRegister = statoMacchina[upperRegister];
        if (upperRegister == null) {
            upperRegister = 0;
        }
        var upperLenght = upperRegister.toString();
        upperLenght = upperLenght.replace('.', '');
        upperLenght = upperLenght.replace('-', '');
        upperLenght = upperLenght.length;

        if (upperLenght > 11) {
            console.log("Il registro non è disponibile");
            turnOnRedLight();
            statoMacchina.blocked = true;
            return false
        }
        else {
            return true
        }
    }
    else
        return true
}
function storeInRegister(value, letter) {
    // controllare che nei splittati (quindi maiuscoli e minuscoli) le cifre massime son 11
    console.log('Memorizzo ', value, ' nel registro ', letter);
    if (letter.search('/') != -1) {
        var destination = letter[0].toLowerCase();
    }
    else {
        var destination = letter;
    }
    if (!isAviable(letter)) {
        return
    }
    if (value > 9999999999999999999999 || value < -9999999999999999999999 || value.toString().length > 22) {
        console.log("Errore, un registro può contenere al più 22 cifre");
        turnOnRedLight();
        statoMacchina.blocked = true;
        return
    }
    // direct storage to a splitted register
    var valueLenght = value.toString();
    valueLenght = valueLenght.replace('.', '');
    valueLenght = valueLenght.replace('-', '');
    valueLenght = valueLenght.length;

    if (value > 99999999999 || value < -99999999999 || valueLenght > 11) {
        var splitted = "reg_" + destination.toLowerCase();
        if (destination == destination.toLowerCase()) {
            console.log("overload, insert directly to a splitted register, digits: ", valueLenght);
            turnOnRedLight();
            statoMacchina.blocked = true;
            return
        }
        else if (destination != 'M' && destination != 'A' && destination != 'R' && statoMacchina[splitted] > 0) {
            console.log("overload, insert in a register with splitted used");
            turnOnRedLight();
            statoMacchina.blocked = true;
            return
        }
    }
    // we can store the value
    var dst = "reg_" + destination;
    statoMacchina[dst] = value;
}

function print() {
    var letter = statoMacchina.selectedRegister;
    var dst = "reg_" + letter;
    var value = statoMacchina[dst];
    console.log('Registro:' + letter);
    //create the istruction

    var instruction = [];
    if (statoMacchina.slashPressed && letter == 'M' || statoMacchina.slashPressed && letter == null) {
        instruction.push('');
        instruction.push('/');
        instruction.push('print');
    }
    else {
        instruction.push('');
        if (statoMacchina.selectedRegister == null) {
            instruction.push('');
        }
        else {
            instruction.push(statoMacchina.selectedRegister);
        }
        instruction.push('print');
    }
    scegliMod(instruction);

};

function start() {
    //start come istruzione
    var instruction = [];
    instruction.push(null);
    if (statoMacchina.selectedRegister == 'R') {
        instruction.push('R');
    }
    else {
        instruction.push(null);
    }
    instruction.push('S');
    scegliMod(instruction);
}

function somma() {
    var instruction = [];
    instruction.push(null);
    instruction.push(statoMacchina.selectedRegister);
    instruction.push('sum');

    scegliMod(instruction);
};

function sottrai() {
    var instruction = [];
    instruction.push(null);
    instruction.push(statoMacchina.selectedRegister);
    instruction.push('sub');
    scegliMod(instruction);
};

function moltiplica() {
    var instruction = [];
    instruction.push(null);
    instruction.push(statoMacchina.selectedRegister);
    instruction.push('mult');
    scegliMod(instruction);

    if (!statoMacchina.recordPrPressed && !statoMacchina.printPrPressed && !statoMacchina.blocked) {
        printResult();
    }
}

function dividi() {

    var instruction = [];
    instruction.push(null);
    instruction.push(statoMacchina.selectedRegister);
    instruction.push('div');
    scegliMod(instruction);

    if (!statoMacchina.recordPrPressed && !statoMacchina.printPrPressed && !statoMacchina.blocked) {
        printResult();
    }

};

function radice() {
    var instruction = [];
    instruction.push(null);
    instruction.push(statoMacchina.selectedRegister);
    instruction.push('sqrt');
    scegliMod(instruction);

    if (!statoMacchina.recordPrPressed && !statoMacchina.printPrPressed) {
        printResult();
    }
};

function fromM() {
    if (statoMacchina.selectedRegister !== 'R' && statoMacchina.selectedRegister !== 'A' && statoMacchina.selectedRegister !== 'a') {
        //create the istruction
        var instruction = [];
        instruction.push(null);
        instruction.push(statoMacchina.selectedRegister);
        instruction.push('fromM');
        scegliMod(instruction);
    }
    if (statoMacchina.selectedRegister == 'a') {
        //create the istruction
        var instruction = [];
        var value = statoMacchina.reg_M;
        console.log('valore di M: ', value)
        instruction.push(value);
        instruction.push('a');
        instruction.push('fromM');
        codificaCostanti(instruction);
        statoMacchina.slashPressed = false;
    }
};

function toA() {
    //tasto freccia su, muove il contenuto del registro selezionato in A
    console.log("selected registers: ", statoMacchina.selectedRegister);

    switch (statoMacchina.selectedRegister) {

        case 'A':
            deselectRegisterBox();
            return;
        default:
            var destination = statoMacchina.selectedRegister;
            //create the istruction
            var instruction = [];
            instruction.push(null);
            instruction.push(destination);
            instruction.push('toA');
    }
    scegliMod(instruction);
}

function exchange() {
    var instruction = [];
    if (statoMacchina.slashPressed && statoMacchina.selectedRegister == 'M' || statoMacchina.slashPressed && statoMacchina.selectedRegister == null) {
        instruction.push(null);
        instruction.push('/');
        instruction.push('exchange');
    }
    else {
        instruction.push(null);
        instruction.push(statoMacchina.selectedRegister);
        instruction.push('exchange');
    }
    scegliMod(instruction);

};

function scegliMod(instruction) {
    if (statoMacchina.recordPrPressed) {
        //record the instruction
        var n = statoMacchina.instructionCounter;
        if (statoMacchina.memoryToClear) {
            localStorage.clear();
            statoMacchina.instructionCounter = 0;
            statoMacchina.memoryToClear = false;
        }
        if (statoMacchina.partial) {
            statoMacchina.instructionCounter = 73;
        }
        localStorage.setItem("instruction" + n, instruction);
        statoMacchina.instructionCounter++;
        localStorage.setItem('n', statoMacchina.instructionCounter);
        printInstruction(instruction.join());
        statoMacchina.clearLastOnce = true;
    }
    else if (statoMacchina.printPrPressed && instruction[2] != 'S') {
        //print the instruction
        printInstruction(instruction.join());
    }
    else {
        //execute the instruction
        execute(instruction);
    }
    deselectRegisterBox();
    statoMacchina.selectedRegister = null;
    statoMacchina.resetM = true;
    statoMacchina.slashPressed = false;
    statoMacchina.signM = 'positive';
};

function input(num) {

    if (num === '-') {
        console.log("segno");
        return;
    }
    if (num === '.' && statoMacchina.virgolaPresente) {
        console.log("virgola già presente");
        return;

    }
    else if (num === '.' && !statoMacchina.virgolaPresente) {
        console.log("inserisco la virgola alla fine");
        M = M + '.';
    }

    var M = statoMacchina.reg_M; //recupero il valore del reg dallo stato della macchina

    //funzione che reinizializza M se è stato premuto un tasto diverso da un numero
    if (statoMacchina.resetM) {
        M = 0;
        statoMacchina.resetM = false;
        statoMacchina.virgolaPresente = false;
    }

    if (M == 0 && !statoMacchina.virgolaPresente && num != '.') {    //solo in questo caso scrive direttamente il numero
        if (statoMacchina.signM == 'positive') {
            M = num;
        }
        else {
            M = '-' + num;
        }
    }

    else {
        if (statoMacchina.signM == 'positive') {
            M = "" + M + num;
        }
        else if (statoMacchina.virgolaPresente == true) {
            M = "" + M + num;
        }
        else {
            M = "-" + Math.abs(M) + num;
        }
    }

    storeInRegister(M, 'M');  //memorizzo il valore sullo stato della macchina
    updateMachine();
    deselectRegisterBox();
};

function selectRegister(letter) {
    if (statoMacchina.selectedRegister != null) {
        //era già selezionato un registro lo deseleziono
        deselectRegisterBox();
    }
    statoMacchina.selectedRegister = letter;
    var register = '#register_' + letter;
    console.log('selected ', register);
    statoMacchina.selectedRegisterLabel = register;
    selectRegisterBox();
};

function slash() {
    statoMacchina.slashPressed = true;
    var SR = statoMacchina.selectedRegister;

    if (SR == 'B' || SR == 'C' || SR == 'D' || SR == 'E' || SR == 'F' || SR == 'A' || SR == 'R') {
        var reg = statoMacchina.selectedRegister;
        var register = '#register_' + reg.toLowerCase();
        deselectRegisterBox();
        statoMacchina.selectedRegister = reg.toLowerCase();
    }
    console.log('selected ', register);
    statoMacchina.selectedRegisterLabel = register;
    selectRegisterBox();
};

function inserisciVirgola() {
    var M = statoMacchina.reg_M;

    if (!statoMacchina.virgolaPresente) {
        statoMacchina.virgolaPresente = true;
    }
    else {
        return;
    }

    statoMacchina.reg_M = M;    //memorizzo il valore sullo stato della macchina
    updateMachine();
};

function cambiaSegno() {
    if (statoMacchina.signM == 'positive') {
        statoMacchina.signM = 'negative';
        statoMacchina.reg_M = '-' + statoMacchina.reg_M;
    }
    updateMachine();
}

function clear() {
    if (statoMacchina.recordPrPressed && statoMacchina.instructionCounter > 0 && statoMacchina.clearLastOnce) {
        console.log('clear ON RECORD');
        //delete the instruction
        if (statoMacchina.constantInstructionNumber) {
            var countStart = statoMacchina.instructionCounter - 1;
            var counterEnd = statoMacchina.instructionCounter - statoMacchina.constantInstructionNumber - 1;
            console.log('Clear constant as instruction: ' + statoMacchina.constantInstructionNumber + 'istruzioni da rimuovere!');

            for (var i = countStart; i >= counterEnd; i--) {
                localStorage.removeItem("instruction" + i);
            }
            statoMacchina.instructionCounter = counterEnd;
            localStorage.setItem('n', statoMacchina.instructionCounter);
            statoMacchina.constantInstructionNumber = null;
        }
        else {
            var n = statoMacchina.instructionCounter - 1;
            localStorage.removeItem("instruction" + n);
            statoMacchina.instructionCounter--;
            localStorage.setItem('n', statoMacchina.instructionCounter);
        }

        stampa('&nbsp<br>');
        deselectRegisterBox();
        statoMacchina.selectedRegister = null;
        statoMacchina.resetM = false;
        statoMacchina.signM = 'positive';
        statoMacchina.reg_M = 0;
        statoMacchina.clearLastOnce = false;
    }
    else {
        //clear button
        console.log("Clear Button pressed");
        statoMacchina.reg_M = 0;
        statoMacchina.virgolaPresente = false;
        deselectRegisterBox();
        statoMacchina.selectedRegister = null;
        statoMacchina.resetM = false;
        statoMacchina.signM = 'positive';

    }
};

function unlock() {
    if (statoMacchina.blocked) {
        statoMacchina.blocked = false;
        turnOffRedLight();
    }
};

function clearRegister() {
    var instruction = [];
    instruction.push(null);
    instruction.push(statoMacchina.selectedRegister);
    instruction.push('clear');

    // if (statoMacchina.recordPrPressed){
    //     //record the instruction
    //     localStorage.setItem("instruction" + statoMacchina.instructionCounter, instruction);
    //     statoMacchina.instructionCounter++;
    //     localStorage.setItem('n', statoMacchina.instructionCounter);
    // deselectRegisterBox();
    // }
    // else {
    //     //execute the instruction
    //     execute(instruction);
    // }
    scegliMod(instruction);
};

function resetFunction() {
    console.log('resetting');
    statoMacchina.reg_M = 0;
    statoMacchina.reg_A = 0;
    statoMacchina.reg_R = null;
    statoMacchina.reg_r = null; //Variabile di appoggio per funzione RS
    statoMacchina.reg_B = null;
    statoMacchina.reg_b = null;
    statoMacchina.reg_C = null;
    statoMacchina.reg_c = null;
    statoMacchina.reg_D = null;
    statoMacchina.reg_d = null;
    statoMacchina.reg_E = null;
    statoMacchina.reg_e = null;
    statoMacchina.reg_F = null;
    statoMacchina.reg_f = null;
    statoMacchina.signM = 'positive';
    statoMacchina.virgolaPresente = false;
    statoMacchina.slashPressed = false;
    statoMacchina.selectedRegister = null;
    statoMacchina.selectedLabel = null;
    statoMacchina.resetM = true;
    statoMacchina.redLight = false;
    statoMacchina.greenLight = false;
    statoMacchina.instructionCounter = 0;
    statoMacchina.currentInstruction = 0;
    statoMacchina.running = false;
    statoMacchina.blocked = false;
    statoMacchina.clearLastOnce = false;
    statoMacchina.memoryToClear = false;
    statoMacchina.partial = false;
    localStorage.clear();
    statoMacchina.constantInstructionNumber = null;
    updateMachine();

};
function inizializzaAssetti() {
    statoMacchina.recordPrPressed = false;
    statoMacchina.printPrPressed = false;
    statoMacchina.keybRlPressed = false;
    statoMacchina.numberOfDecimals = 2;
};

function codificaCostanti(instruction) {
    console.log('codifica della costante:');
    printInstruction(instruction.join());
    if (statoMacchina.recordPrPressed) {
        localStorage.setItem("instruction" + statoMacchina.instructionCounter, instruction);
        statoMacchina.instructionCounter++;
        localStorage.setItem('n', statoMacchina.instructionCounter);
    }
    var numero = parseFloat(instruction[0]);
    if (numero == '0' || numero == null) {
        console.log('nessun valore in M')
        return;
    }
    if (numero > 0) {
        var registro_base = 'R';
    }
    else {                           //tolgo segno meno
        registro_base = 'F';
        numero = Math.abs(numero);
    }
    var stringa = numero.toString();
    console.log('stringa senza segno: ' + stringa);
    var n_cifre = stringa.length;

    if (stringa.indexOf('.') !== -1) {   //controllo virgola e segno posizione
        var index = stringa.indexOf('.') - 1;
        stringa = stringa.replace('.', '');  //rimuovo la virgola
        n_cifre = stringa.length;
    }
    else {
        index = n_cifre - 1;
    }

    for (var i = n_cifre - 1; i >= 0; i--) {  //scorro la stringa
        var value = stringa[i];
        var istruzione = constantInstruction(value);
        var registro = registro_base;
        if (i == 0) {   //assegno D o E alla cifra più significativa
            if (registro == 'R' || registro == 'r') {
                registro = 'D';
            }
            else {
                registro = 'E';
            }
        }
        if (i == index) {     //aggiungo / dove è presente la virgola
            registro = registro.toLowerCase();
        }
        if (istruzione != 'none') {
            var instruction = [];
            instruction.push(null);
            instruction.push(registro);
            instruction.push(istruzione);
        }
        if (statoMacchina.recordPrPressed) {
            //record the instruction
            localStorage.setItem("instruction" + statoMacchina.instructionCounter, instruction);
            statoMacchina.instructionCounter++;
            localStorage.setItem('n', statoMacchina.instructionCounter);

            statoMacchina.clearLastOnce = true;
            statoMacchina.constantInstructionNumber = n_cifre;
        }
        if (statoMacchina.printPrPressed || statoMacchina.recordPrPressed) {
            console.log(instruction);
            printInstruction(instruction.join());
        }
    }

    deselectRegisterBox();
    updateMachine();
    statoMacchina.selectedRegister = null;
    statoMacchina.resetM = true;
    statoMacchina.slashPressed = false;
    statoMacchina.signM = 'positive';
};

function truncateDecimals(number, digits) {
    if (!number) {
        number = 0;
    }
    var parteIntera = int_num(number);
    var z = parteIntera + parseInt(digits);

    var x = new Big(number);
    var len = x.c.length
    if (len > z) {
        x.c.length = z
    }
    return x;
};

function addzeros(number, digits) {
    var decimal = 0;
    var numberString = number.toString();
    var numberArray = numberString.split('.');

    if (numberArray[1]) {
        decimal = numberArray[1].length;
    }
    if (decimal < digits) {
        var toappend = digits - decimal;
        if (numberArray[1]) {
            number = numberArray[0] + '.' + numberArray[1];
        }
        else {
            number = numberArray[0] + '.';
        }
        for (var i = 0; i < toappend; i++) {
            number = number + '0';
        }
        return number;
    }
    else {
        return number;
    }
}
function constantInstruction(value) {
    switch (value) {
        case "0":
            return "S";
        case "1":
            return "toA";
        case "2":
            return "fromM";
        case "3":
            return "exchange";
        case "4":
            return "sum";
        case "5":
            return "sub";
        case "6":
            return "mult";
        case "7":
            return "div";
        case "8":
            return "print";
        case "9":
            return "clear";
        default:
            return "none";
    }
};

function printProgram() {
    console.log('Stampa programma');
    stampa(''); //empty row

    for (var i = 0; i <= statoMacchina.instructionCounter; i++) {
        var instruction = localStorage.getItem('instruction' + i);

        if (instruction && instruction.search('store') == -1) {
            console.log('printprogram:' + instruction);
            printInstruction(instruction);
        }
    }
};
function printInstruction(instruction) {
    if (statoMacchina.running) {
        return;
    }
    instruction = instruction.split(',');
    var cleanInstruction = toSymbol(instruction[2]);

    stampa(instruction[0] + '&nbsp;&nbsp;' + instruction[1] + ' ' + cleanInstruction);
};

function toSymbol(instruction) {
    switch (instruction) {
        case "toA":
            return " &#x2193";
        case "fromM":
            return " &#x2191";
        case "exchange":
            return " &#x2195";
        case "sum":
            return " +";
        case "sub":
            return " -";
        case "difference":
            return " -";
        case "mult":
            return " X";
        case "div":
            return " &#x00F7";
        case "print":
            return " &#x25CA ";
        case "sqrt":
            return " &#x221A";
        case "clear":
            return " *";
        case "slash":
            return " /";
        default:
            return instruction;
    }
};

function mapJumpLabel(letter) {
    switch (letter) {
        case 'C':
            return 'B';
        case 'c':
            return 'b';
        case 'D':
            return 'E';
        case 'd':
            return 'e';
        case 'R':
            return 'F';
        case 'r':
            return 'f';
        case null:
            return 'A';
        case '/':
            return 'a';
        default:
            return 'A';
    }
}

function openFile(event) {
    if (statoMacchina.recordPrPressed) {
        alert('Attenzione!! Disattiva assetto registra programma!');
        return;
    }
    console.log("opened a file");
    //Restoring register D E F:
    statoMacchina.reg_D = null;
    statoMacchina.reg_d = null;
    statoMacchina.reg_E = null;
    statoMacchina.reg_e = null;
    if (!statoMacchina.printPrPressed) {
        statoMacchina.reg_F = null;
        statoMacchina.reg_f = null;
    }

    statoMacchina.instructionCounter = 0;
    // localStorage.clear();
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        inserisciCartolina();
        var testo = reader.result;
        var linee = testo.split('\n');
        var title = document.getElementById('files').value;
        if (title.search('\\\\') != -1) {
            title = title.split('\\');
            title = title[title.length - 1];
        }
        title = title.replace('.txt', '');
        document.getElementById("progName").value = title;
        if (linee.length > 120) {
            window.alert("Sono ammessi solo programmi con massimo 120 istruzioni");
            turnOnRedLight();
            statoMacchina.blocked = true;
            return
        }
        if (statoMacchina.printPrPressed) {
            console.log('Carico cartolina parziale');
            if (linee.length > 48) {
                window.alert("Una cartolina parziale può contenere al più 48 istruzioni");
                turnOnRedLight();
                statoMacchina.blocked = true;
                return
            }
            statoMacchina.instructionCounter = 72;
            for (var i = 0; i < linee.length; i++) {
                if (linee[i] != '\n' && linee[i] != '') {
                    var n = statoMacchina.instructionCounter;
                    localStorage.setItem("instruction" + n, linee[i]);
                    statoMacchina.instructionCounter++;
                    localStorage.setItem('n', n);
                }
            }
        }
        else {
            localStorage.clear();
            statoMacchina.instructionCounter = 0;
            for (var i = 0; i < linee.length; i++) {
                if (linee[i] != '\n' && linee[i] != '') {
                    var n = statoMacchina.instructionCounter;
                    localStorage.setItem("instruction" + n, linee[i]);
                    statoMacchina.instructionCounter++;
                    localStorage.setItem('n', n);
                }
            }
        }
        searchConst();
    };
    reader.readAsText(input.files[0]);
    $('#descrizione_programma').html('');
};

function printResult() {
    var value = statoMacchina.reg_A;
    if (value != Infinity && value != -Infinity && !isNaN(value)) {
        value = addzeros(value, statoMacchina.numberOfDecimals);
        stampa(value + '&nbsp;&nbsp;' + 'A' + ' &#x25CA');
    }
};

function verifyDEF() {
    if (statoMacchina.reg_D) {
        storeConst('D');
    }
    if (statoMacchina.reg_d) {
        storeConst('d');
    }
    if (statoMacchina.reg_E) {
        storeConst('E');
    }
    if (statoMacchina.reg_e) {
        storeConst('e');
    }
    if (statoMacchina.reg_F) {
        storeConst('F');
    }
    if (statoMacchina.reg_f) {
        storeConst('f');
    }
};

function storeConst(letter) {
    var dst = "reg_" + letter;
    var value = statoMacchina[dst];
    var instruction = [];

    instruction.push(value);
    instruction.push(letter);
    instruction.push('store');

    localStorage.setItem("instruction" + statoMacchina.instructionCounter, instruction);
    statoMacchina.instructionCounter++;
    localStorage.setItem('n', statoMacchina.instructionCounter);


};

function searchConst() {
    console.log('searching for store instruction ');
    for (var i = 0; i <= statoMacchina.instructionCounter; i++) {
        var instruction = localStorage.getItem('instruction' + i);
        if (instruction) {
            instruction = instruction.split(',');
            if (instruction[2] == 'store') {
                console.log('store instruction found');
                if (instruction[1] != 'B' && instruction[1] != 'C') {
                    var value = instruction[0];
                    var destination = instruction[1];
                    storeInRegister(value, destination);
                }
            }
        }
    }
    updateMachine();
};

function getWeelPosition() {
    var chooseId = window.matchMedia("screen and (min-width: 650px)");
    if (chooseId.matches) {
        var position = $('#spinnerBottom').val();
    }
    else {
        var position = $('#spinnerTop').val();
    }
    return position;
}

function saveTextAsFile() {
    if (!statoMacchina.recordPrPressed) {
        alert('Attenzione!! Attivare l\' assetto Registra Programma!');
        return
    }
    var textToWrite = saveProgram();
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var name = document.getElementById("progName").value;
    var fileNameToSaveAs = name + '.txt';
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function saveProgram() {
    var output = '';
    var n = statoMacchina.instructionCounter;
    for (var i = 0; i < n; i++) {
        if (!localStorage.getItem('instruction' + i)) {
            localStorage.setItem('instruction' + i, '');
        }
        var output = output + localStorage.getItem('instruction' + i) + '\n';

    }
    return output
};
$(window).load(function () {
    localStorage.clear();
    statoMacchina.instructionCounter = 0;
});

function openFromLibray(nome, file) {
    if (statoMacchina.recordPrPressed) {
        alert('Attenzione!! Disattiva assetto registra programma!');
        return;
    }
    console.log('open program from library');
    //Restoring register D E F:
    statoMacchina.reg_D = null;
    statoMacchina.reg_d = null;
    statoMacchina.reg_E = null;
    statoMacchina.reg_e = null;
    if (!statoMacchina.printPrPressed) {
        statoMacchina.reg_F = null;
        statoMacchina.reg_f = null;
    }
    statoMacchina.instructionCounter = 0;
    $('#modal').hide(300);
    inserisciCartolina();
    var file = file;
    var title = nome;
    var linee = file.split('\n');

    title = title.replace('.txt', '');
    document.getElementById("progName").value = title;
    if (linee.length > 120) {
        window.alert("Sono ammessi solo programmi con massimo 120 istruzioni");
        turnOnRedLight();
        statoMacchina.blocked = true;
        return
    }
    if (statoMacchina.printPrPressed) {
        console.log('Carico cartolina parziale');
        if (linee.length > 48) {
            window.alert("Una cartolina parziale può contenere al più 48 istruzioni");
            turnOnRedLight();
            statoMacchina.blocked = true;
            return
        }
        statoMacchina.instructionCounter = 73;
        for (var i = 0; i < linee.length; i++) {
            if (linee[i] != '\n' && linee[i] != '') {
                var n = statoMacchina.instructionCounter;
                localStorage.setItem("instruction" + n, linee[i]);
                statoMacchina.instructionCounter++;
                localStorage.setItem('n', n);
            }
        }
    }
    else {
        localStorage.clear();
        statoMacchina.instructionCounter = 0;
        for (var i = 0; i < linee.length; i++) {
            if (linee[i] != '\n' && linee[i] != '') {
                var n = statoMacchina.instructionCounter;
                localStorage.setItem("instruction" + n, linee[i]);
                statoMacchina.instructionCounter++;
                localStorage.setItem('n', n);
            }
        }
    }
    searchConst();
};

//Funzioni per ottenere numero di decimali e numero di interi di un float

function int_num(value) {
    var numberString = value.toString();
    numberString = numberString.replace('-', '');
    var numberArray = numberString.split('.');

    if (numberArray[0]) {
        return numberArray[0].length;
    }
    else {
        return 0;
    }
}

function dec_num(value) {

    var numberString = value.toString();
    numberString = numberString.replace('-', '');
    var numberArray = numberString.split('.');

    if (numberArray[1]) {
        return numberArray[1].length;
    }
    else {
        return 0;
    }
}
// Return A - M
function floatSub(A, M) {
    var float_M = new Big(M);
    var float_A = new Big(A);
    var differenza = float_A.sub(float_M);
    return parseFloat(differenza);
}

function setEndProgram() {
    var counterLast = statoMacchina.instructionCounter;
    var counterPrevious = counterLast - 1;
    var previousInstruction = localStorage.getItem('instruction' + counterPrevious);
    var lastInstruction = localStorage.getItem('instruction' + counterLast);

    if (lastInstruction[2] != 'S') {
        console.log('Added two start instruction!')
        addStartInstruction();
        addStartInstruction();
    }
    if (previousInstruction[2] != 'S') {
        console.log('Added start instruction!')
        addStartInstruction();
    }
}

function addStartInstruction() {

    var instruction = [];
    instruction.push(null);
    instruction.push(null);
    instruction.push('S');

    localStorage.setItem("instruction" + statoMacchina.instructionCounter, instruction);
    statoMacchina.instructionCounter++;
    localStorage.setItem('n', statoMacchina.instructionCounter);
}

function jumpInstruction(label) {
    console.log('pressed ' + label);
    if (statoMacchina.recordPrPressed) {
        if (statoMacchina.instructionCounter == 0) {
            localStorage.clear();
        }
        //create the istruction
        var instruction = [];
        var SR = statoMacchina.selectedRegister;
        if (SR == 'M' && !statoMacchina.slashPressed || SR == null && !statoMacchina.slashPressed) {
            instruction.push('');
            instruction.push('');
            instruction.push(label);
        }
        else if (SR == 'M' && statoMacchina.slashPressed || SR == null && statoMacchina.slashPressed) {
            instruction.push('');
            instruction.push('/');
            instruction.push(label);
            statoMacchina.slashPressed = false;
        }
        else {
            instruction.push('');
            instruction.push(SR);
            instruction.push(label);
        }
        //record the instruction
        localStorage.setItem("instruction" + statoMacchina.instructionCounter, instruction);
        statoMacchina.instructionCounter++;
        localStorage.setItem('n', statoMacchina.instructionCounter);
        deselectRegisterBox();
        statoMacchina.selectedRegister = null;
        printInstruction(instruction.join());
        statoMacchina.clearLastOnce = true;
    }
    else {
        if (statoMacchina.instructionCounter == 0) {
            if (statoMacchina.selectedRegister == null || statoMacchina.selectedRegister == 'C' || statoMacchina.selectedRegister == 'D' || statoMacchina.selectedRegister == 'R') {
                alert('ERRORE!! Nessun programma caricato in memoria.');
                turnOnRedLight();
                statoMacchina.blocked = true;
                return;
            }
            else if (statoMacchina.selectedRegister == 'c' || statoMacchina.selectedRegister == 'd' || statoMacchina.selectedRegister == 'r' || statoMacchina.selectedRegister == '/') {
                alert('ERRORE!! Non puoi avviare un programma con una istruzione di salto condizionato.');
                turnOnRedLight();
                statoMacchina.blocked = true;
                return;
            }
            else {
                stampa(statoMacchina.selectedRegister + label);
                deselectRegisterBox();
                statoMacchina.selectedRegister = null;
                return;
            }

        }
        //questo è sbagliato, deve chiamare execute e non runProgram
        var dst = mapJumpLabel(statoMacchina.selectedRegister);
        seek(dst, label);
        if (!statoMacchina.resetM) {
            if (statoMacchina.selectedRegister != null && !statoMacchina.printPrPressed) {
                stampa(statoMacchina.reg_M + '&nbsp;&nbsp;' + statoMacchina.selectedRegister + label);
            }
            else {
                if (!statoMacchina.printPrPressed) {
                    stampa(statoMacchina.reg_M + '&nbsp;&nbsp;' + label);
                }
            }
        }
        else {
            if (statoMacchina.selectedRegister != null && !statoMacchina.printPrPressed) {
                stampa(statoMacchina.selectedRegister + label);
            }
            else {
                if (!statoMacchina.printPrPressed) {
                    stampa(label);
                }
            }
        }
        if (statoMacchina.printPrPressed) {
            printProgram();
            statoMacchina.resetM = true;
            return;
        }
        statoMacchina.running = true;
        //non dovrebbe farlo qui
        deselectRegisterBox();
        statoMacchina.selectedRegister = null;
        statoMacchina.resetM = true;
        statoMacchina.slashPressed = false;
        statoMacchina.signM = 'positive';
        //fine controlli
        runProgram();
    }
    statoMacchina.selectedLabel = label;
}

