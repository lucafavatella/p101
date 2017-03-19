// JavaScript Document
'use strict';

function execute(instruction){
    if (!instruction){
        statoMacchina.running = false;
        return;
    }
    if (statoMacchina.blocked){
        statoMacchina.running = false;
        return;
    }
    if(!isAviable(instruction[1])){
        return;
    }
    console.log(instruction);
    if (instruction[2] == 'S' && instruction[1] != 'R'){
        if (statoMacchina.printPrPressed) {
            printProgram();
            return;
        }
		if (statoMacchina.resetM != true){
            instruction[0] = statoMacchina.reg_M;
		}
        printInstruction(instruction.join());
        if (!statoMacchina.running){
            statoMacchina.running = true;
            console.log('starting the machine');
            runProgram();
        }
        else{
            statoMacchina.running = false;
            console.log('stopping the machine');
        }
    }
	if (instruction[2] == 'S' && instruction[1] == 'R'){
		console.log('instruction RS');
		printInstruction(instruction.join());
		var APPO = statoMacchina.reg_D;
		statoMacchina.reg_D = statoMacchina.reg_R;
		statoMacchina.reg_R = APPO;
		var appo = statoMacchina.reg_d;
		statoMacchina.reg_d = statoMacchina.reg_r;
		statoMacchina.reg_r = appo;	
	}
    if (instruction[2] == 'print') {
        console.log('print command');
        if (instruction[1]=='' || instruction[1]==null){
            instruction[1]='M';
        }
        var dst = 'reg_' + instruction[1];
        value = statoMacchina[dst];

        if (instruction[1]!='R'){
            value = truncateDecimals(value, statoMacchina.numberOfDecimals);
            value= addzeros(value, statoMacchina.numberOfDecimals);
        }
        if (value == null || isNaN(value)){
            value = 0;
        }
        if (instruction[1] == '/') {
            stampa('');
        }
        else if(instruction[1]=='M'){
            stampa(value +'&nbsp;&nbsp;'+ '&#x25CA');
        }
        else{
            stampa(value + '&nbsp;&nbsp;' + instruction[1] + ' &#x25CA');
        }
    }

    if(instruction[1] == 'a' && instruction[2] == 'fromM' || instruction[1] == 'A/' && instruction[2] == 'fromM'){
        console.log('Constant as instruction');
        storeInRegister(instruction[0], 'M');
        printInstruction(instruction.join());
       
        if (statoMacchina.running == true){
             var number = Math.abs(parseFloat(instruction[0]));
             var length = (number + '').replace('.', '').length;
             console.log('skipping ',length,' instruction because of costant as instruction');
             statoMacchina.currentInstruction = statoMacchina.currentInstruction + length;
             return;
        }   
    }
    if (instruction[1] != 'a' && instruction[2] == 'fromM') {
        console.log('fromM command');
		 if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0] = statoMacchina.reg_M;
        }
        
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
        //constructing destination
        console.log("moving values from M to ", instruction[1]);
        //storing the value
        storeInRegister(statoMacchina.reg_M, instruction[1]);
    }
    if (instruction[2] == 'toA') {
        console.log('toA command');
		if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
        }
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
        var source = instruction[1];
        console.log('moving values from ' + source + ' to A');
        //need to make the conversion first
        if (source.search('/') != -1) {
            source = source[0].toLowerCase();
        }
        var src = 'reg_' + source;
        var value = statoMacchina[src];
        
		if (value == null){
			value = 0;
		}
        storeInRegister(value, 'A');
    }
    
    if (instruction[2] == 'sum') {
        console.log('sum');
		
		if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
        }
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
		if(instruction[1] != 'M'){
            if (instruction[1].search('/') != -1) {
                instruction[1] = instruction[1][0].toLowerCase();
            }
            console.log("moving values from ", instruction[1], " to M");
            var dst = 'reg_' + instruction[1];
            var value = statoMacchina[dst];
			if (value == null){
				value = 0;
			}
            statoMacchina.reg_M = value;
        }

        var float_M = new Big(statoMacchina.reg_M);
        var float_A = new Big(statoMacchina.reg_A);
        console.log(float_A + '+' + float_M);
        var R = parseFloat(float_A.plus(float_M));
        console.log(R);
        A = parseFloat(truncateDecimals(R, statoMacchina.numberOfDecimals)); //valore troncato
        //Controllo supero capacità in somma
        if(Math.max(int_num(float_A),int_num(float_M))+Math.max(dec_num(float_A),dec_num(float_M)) > 22
        || statoMacchina.numberOfDecimals > 22 - Math.max(int_num(float_A),int_num(float_M)) ){
            turnOnRedLight();
            statoMacchina.blocked=true;
            return
        }
        storeInRegister(R, 'R');
        storeInRegister(A, 'A');
        
    }
   
    if (instruction[2] == 'sub') {
        console.log('subtract');
		if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
        }
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }		
		if(instruction[1]!='M'){
            if (instruction[1].search('/') != -1) {
                instruction[1] = instruction[1][0].toLowerCase();
            }		
            console.log("moving values from ", instruction[1], " to M");
            var dst = 'reg_' + instruction[1];
            var value = statoMacchina[dst];
			if (value==null){
				value=0;
			}
            statoMacchina.reg_M = value;
		}
        var M = statoMacchina.reg_M;
        var A = statoMacchina.reg_A;
        var float_M = parseFloat(M)
        var float_A = parseFloat(A);

        var R = floatSub(A, M);

        A = parseFloat(truncateDecimals(R, statoMacchina.numberOfDecimals)); //valore troncato
        if(Math.max(int_num(float_A),int_num(float_M))+Math.max(dec_num(float_A),dec_num(float_M)) > 22
            || statoMacchina.numberOfDecimals > 22 - Math.max(int_num(float_A),int_num(float_M)) ){
            turnOnRedLight();
            statoMacchina.blocked=true;
            return
        }
        storeInRegister(R, 'R');
        storeInRegister(A, 'A');
        
    }
	if (instruction[2] == 'mult') {
        console.log('mult');
		if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
        }
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
		if(instruction[1]!='M'){
            if (instruction[1].search('/') != -1) {
                instruction[1] = instruction[1][0].toLowerCase();
            }
            console.log("moving values from ", instruction[1], " to M");
            var dst = 'reg_' + instruction[1];
            var value = statoMacchina[dst];
			if (value==null){
				value=0;
			}
            statoMacchina.reg_M = value;
		}

        var M = statoMacchina.reg_M;
		if (M == 'null'){
			M = 0;
		}
        var A = statoMacchina.reg_A;    
        var float_M = new Big(M);
        var float_A = new Big(A);
        var R = parseFloat(float_A.mul(float_M));
        A = parseFloat(truncateDecimals(R, statoMacchina.numberOfDecimals)); //valore troncato
        if(int_num(float_A)+int_num(float_M)+dec_num(float_A)+dec_num(float_M) - 1 > 22 ||
        statoMacchina.numberOfDecimals > 22 - (int_num(float_A)+int_num(float_M)-1)){
            turnOnRedLight();
            statoMacchina.blocked=true;
            return
        }
        storeInRegister(R, 'R');
        storeInRegister(A, 'A');
        
    }
	if (instruction[2] == 'div') {
        console.log('division');
		if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
        }
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
		if( instruction[1] != 'M'){		
            if (instruction[1].search('/') != -1) {
                instruction[1] = instruction[1][0].toLowerCase();
            }            
            console.log("moving values from ", instruction[1], " to M");
            var dst = 'reg_' + instruction[1];
            var value = statoMacchina[dst];
			if (value == null){
				value = 0;
			}
            statoMacchina.reg_M = value;
		}

        var M = statoMacchina.reg_M;
		if (M =='null' || M == 0){
            console.log("divisione per zero");
            statoMacchina.running = false;
            statoMacchina.blocked = true;
            turnOnRedLight();
            return;
        }
        var A = statoMacchina.reg_A;
        var float_M = new Big(M);
        var float_A = new Big(A);
        var quoziente = float_A.div(float_M);
        console.log(quoziente,' =',float_A,' / ',float_M);
        if (quoziente === Infinity || quoziente === -Infinity || isNaN(quoziente)) {
            console.log("divisione per zero");
            statoMacchina.running = false;
            statoMacchina.blocked = true;
            turnOnRedLight();
            return;
        }
        quoziente = parseFloat(truncateDecimals(quoziente, statoMacchina.numberOfDecimals)); //valore troncato
        var tmp = new Big(quoziente).mul(float_M);
        console.log(tmp);
        console.log(float_A);

        var R = floatSub(float_A, tmp);

        storeInRegister(R, 'R');
        storeInRegister(quoziente, 'A')
    }
	if (instruction[2] == 'sqrt') {
		if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
        }
        printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
	    if (instruction[1] != 'M') {
            if (instruction[1].search('/') != -1) {
                instruction[1] = instruction[1][0].toLowerCase();
            }            
            source = instruction[1];
            if (source.search('/') != -1) {
                source = source[0].toLowerCase();
            }
            console.log("moving values from ", source, " to M");
		    var src = 'reg_' + source;	    
		    var value = statoMacchina[src];
		    if (value == null){
			    value = 0;
		    }
            storeInRegister(value, 'M');
	    }

	    var M = statoMacchina.reg_M;	
	    var float_M = parseFloat(M);
        float_M = Math.abs(float_M);
	    var R = Math.sqrt(float_M);
	    var A = parseFloat(truncateDecimals(R, statoMacchina.numberOfDecimals)); //valore troncato
	    var M = 2*A;
	    statoMacchina.reg_R = null;
	    storeInRegister(A, 'A');
	    storeInRegister(M, 'M');
	}
    if (instruction[2] == 'exchange'){
        if (instruction[1] != '/' && instruction[1]!='R' && instruction[1]!='A' ){
			if (statoMacchina.reg_M != 0 && !statoMacchina.resetM) {
            instruction[0]=statoMacchina.reg_M;
            }
		}
		printInstruction(instruction.join());
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
	    if(instruction[1] == '/'){		
		    var A=statoMacchina.reg_A;
		    var dec_part=(A+"").split(".")[1];
            if(dec_part==null){
                dec_part=0;
            }
            else{
                dec_part='0.'+dec_part;
            }
		    storeInRegister(dec_part, 'M');
		    deselectRegisterBox();
            updateMachine();
            statoMacchina.resetM = true;
	        return;
	    }
	    if(instruction[1]=='R'){
            console.log("puttin R in A");
            var R = statoMacchina.reg_R;
		    storeInRegister(R, 'A');
		    deselectRegisterBox();
            updateMachine();
            statoMacchina.resetM = true;
            return;
	    }
	     
        if(instruction[1]=='A'){
            console.log("absolute value of A");
            var A = statoMacchina.reg_A;
            var abs_A = Math.abs(A);
            statoMacchina.reg_A = abs_A;
            deselectRegisterBox();
            updateMachine();
            statoMacchina.resetM = true;
            return;
        }
        
        console.log("destination selected: ", instruction[1]);
        var destination = instruction[1];
        var dst = 'reg_' + destination;
        var A = statoMacchina.reg_A;	
        var X = statoMacchina[dst];

	    if (X == null){
		    X = 0;
	    }
        storeInRegister(A,destination);
        storeInRegister(X, 'A');
    }

    if (instruction[2] == 'clear'){
        instruction[0] = null;
        if (instruction[1] == null || instruction[1] == ''){
            instruction[1] = 'M';
        }
        var destination = instruction[1];
        
        if (destination == 'M' || destination == null || destination == ''){
            instruction[1] = null;
        }
        else{
            var dst = "reg_" + destination;
            value = statoMacchina[dst];
            instruction[0] = value;
            statoMacchina[dst] = null;
        }
        printInstruction(instruction.join());
	}
	if (instruction[2] == 'V' || instruction[2] == 'W' || instruction[2] == 'Y' || instruction[2] == 'Z' ) {
        //try to find the letter V,W,Y,Z in the 3rd part of the instruction, we have a jump instruction
        console.log('founded a jump: ' + instruction[1] + instruction[2]);
        
        var label = instruction[2];
        if (instruction[1] == 'A' || instruction[1] == 'a' || instruction[1] == 'B' || instruction[1] == 'b'
            || instruction[1] == 'E' || instruction[1] == 'e' || instruction[1] == 'F' || instruction[1] == 'f'){
            return;
        }
        var jumpLabel = instruction[1];
        var dst = mapJumpLabel(jumpLabel);

        if (dst != dst.toLocaleLowerCase()){
            // no unconditional jump
            console.log('founded an unconditional jump');
            seek(dst, label);
            return;
        }
        else{
            console.log('founded conditional jump');
            if (statoMacchina.reg_A > 0){ //check the condition
                console.log('type 1 jump from ' + jumpLabel);
                seek(dst, label); //jump to destination
                return;
            }
            else{
                console.log('unsatisfied jump condition');
            }
        }
	}
    deselectRegisterBox(); //viene chiamato anche dopo in scegliMod per la 2 volta, lo disattiviamo qui
    updateMachine();
    statoMacchina.selectedRegister = null; //quando deseleziona in scegliMod deve conoscere il reg. selezionato
    
    // anche questo non serve farlo fare qui in modalità automatica dove i tasti non si toccano
    statoMacchina.resetM = true;
    statoMacchina.slashPressed = false;
    statoMacchina.signM='positive';
    //
};

function seek(dst, label) {
    //Aggiunto per evitare che segnali errore di salto mentre parliamo di riferimenti...
    if (statoMacchina.selectedRegister == 'A' || statoMacchina.selectedRegister == 'a' || statoMacchina.selectedRegister == 'B' || statoMacchina.selectedRegister == 'b'
        || statoMacchina.selectedRegister == 'E' || statoMacchina.selectedRegister == 'e' || statoMacchina.selectedRegister == 'F' || statoMacchina.selectedRegister == 'f'){
        return;
    }
	//var i = 0;
	console.log('searching for ' + dst + ' '+ label);
	for (var i = 0; i < statoMacchina.instructionCounter; i++) {
		var instruction = localStorage.getItem('instruction' + i);
		if (instruction) {
            instruction = instruction.split(',');
			if (instruction[2] == label && instruction[1] == dst ){
				console.log('label founded at ' + i);
                statoMacchina.currentInstruction = i;
                return;
			}
        }
	}
    console.log('label not founded');
    turnOnRedLight();
    statoMacchina.blocked = true;
    if(dst == dst.toLowerCase() && statoMacchina.currentInstruction == 0){
        alert('ERRORE!! Non puoi avviare un programma con una istruzione di salto condizionato.');
    }
    else{
        alert('ERRORE!! Riferimento non trovato.');
    }
}

function runProgram() {
    //var n = localStorage.getItem('n');
    console.log('entering in main loop')
    do {
        var i = statoMacchina.currentInstruction;
        console.log('executing instruction ' + i);
        var instruction = localStorage.getItem('instruction'+i);
        if (instruction) {
            instruction = instruction.split(',');
            execute(instruction);
            statoMacchina.currentInstruction++;
        }
        else{
            statoMacchina.running = false;
            break;
        }
    } while (statoMacchina.running); console.log('SONO FERMO A ISTRUZIONE =======>'+statoMacchina.currentInstruction);
}
