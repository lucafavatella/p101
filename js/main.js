// JavaScript Document
'use strict';

console.log("creo ed inizializzo lo stato della macchina");
var statoMacchina = {};
resetFunction();
inizializzaAssetti();

$(".audioDemo").trigger('load');

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('file support present');
} else {
    alert('The File APIs are not fully supported by your browser.');
}


// On document.ready
$(function () {

    // CODICE INTERAZIONE CON IL SERVER M.MOLINARA
    $.ajax({
        type: "GET",
        url: "http://p101.unicas.it/p101/listaProgrammi.action",
        cache: false,
        success: function(data){

            var div = $('#modal');
            for(var i = 0; i < data.listaProgrammi.length; i++){
                sessionStorage.setItem(data.listaProgrammi[i].name + "-help", data.listaProgrammi[i].help);
                sessionStorage.setItem(data.listaProgrammi[i].name + "-code", data.listaProgrammi[i].code);

                div.append("<ol class=programma>"+ data.listaProgrammi[i].name + "</ol>");
            }
            div.append('<button id="closedial">Chiudi</button>')

            $('.programma').click(function(event) {
                event.preventDefault();
                var name=$(this).html();
                var html = "<strong>" + name + "</strong><br>"
                        + sessionStorage.getItem(name + "-help")  + "";
                openFromLibray(name,sessionStorage.getItem(name + "-code"));
                $('#descrizione_programma').html(html);
            });

            $('#closedial').click(function () {
                $('#modal').hide(300);
            });

            // INSERISCI PULSANTE DI USCITA SE ALL'INTERNO DI UNA APP PHONEGAP
            if (navigator.app){
                $("#menuPrincipale").append("<li><a id='exit'>Exit</a></li>");
                $('#exit').click(function () {
                    $('#modal3').show(300);
                });

                $('#exitCancel').click(function () {
                    $('#modal3').hide(300);
                });

                $('#exitButton').click(function () {
                    navigator.app.exitApp();
                });

            }


        }
    });
    // CODICE INTERAZIONE CON IL SERVER M.MOLINARA





    //Inserimento numeri
    $('.numero').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        var num = $(this).html();
        input(num);
    });

    //Inserimento virgola
    $('#virgola').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        inserisciVirgola();
    });

    //Cambio Segno
    $('#segno').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        cambiaSegno();
    });

    //Start button
    $("#start").click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        start();
    });

    //Tasto clear
    $('#clear').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        clear();
        updateMachine();

    });

    //Tasto reset
    $('.reset').click(function () {

        $(".audioDemo").trigger('play');
        resetStyle();
        resetFunction();
        updateMachine();
    });

    //Tasto elimina stampa
    $('#eliminaStampa').click(function () {

        $(".audioDemo").trigger('play');
        $("#stampa").empty();

    });

    //Seleziona registro
    $('.registro').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        var letter = $(this).html();
        selectRegister(letter);
    });

    //Tasto clearRegister *
    $('#clear_reg').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        clearRegister();
    });

    //Tasto +
    $('#sum').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        somma();
    });

    //Tasto -
    $('#subtract').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        sottrai();
    });
    //Tasto divisione
    $('#divide').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        dividi();
    });

    //Tasto moltiplicazione
    $('#multiply').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        moltiplica();
    });

    $('#sqrt').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        radice();
    });

    $('#print').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        print();
    });

    $('#fromM').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        fromM();
    });

    $('#toA').click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        toA();
    });

    $('#exchange').click(function () {     //tasto freccia su
        unlock();
        $(".audioDemo").trigger('play');
        exchange();
    });

    $("#record_pr").click(function () {
        $(".audioDemo").trigger('play');
        if (statoMacchina.recordPrPressed == false)
        {
            console.log("Record Program mode ON");
            if (statoMacchina.printPrPressed == true)
            {
                statoMacchina.partial = true;
            }
            if (window.localStorage.length != 0)
            {
                statoMacchina.memoryToClear = true;
            }
            modactive_ON('#record_pr');
            statoMacchina.recordPrPressed = true;
            verifyDEF();
            inserisciCartolina();
        }
        else
        {
            console.log("Record Program mode OFF");
            statoMacchina.recordPrPressed = false;
            statoMacchina.memoryToClear = false;
            statoMacchina.partial = false;
            modactive_OFF('#record_pr');
            estraiCartolina();
        }
    });

    $("#print_pr").click(function () {
        $(".audioDemo").trigger('play');
        if (statoMacchina.printPrPressed == false) {
            console.log("Print Program mode ON");
            modactive_ON('#print_pr');
            statoMacchina.printPrPressed = true;
        }
        else {
            console.log("Print Program mode OFF");
            statoMacchina.printPrPressed = false;
            modactive_OFF('#print_pr');
        }
    });

    $("#label_V").click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        console.log('pressed V');
        jumpInstruction('V');
    });

    $("#label_W").click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        console.log('pressed W');
        jumpInstruction('W');
    });

    $("#label_Y").click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        console.log('pressed Y');
        jumpInstruction('Y');
    });

    $("#label_Z").click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        console.log('pressed Z');
        jumpInstruction('Z');
    });

    $("#slash").click(function () {
        unlock();
        $(".audioDemo").trigger('play');
        slash();
    });

    $("#save").click(function () {
        saveTextAsFile();
    });

    $('#stepForward').click(function () {
        statoMacchina.running = true;
        var i = statoMacchina.currentInstruction;
        var instruction = localStorage.getItem('instruction' + i);
        console.log('stepping into instruction ', i + 1);
        if (instruction) {
            instruction = instruction.split(',');
            execute(instruction);
            statoMacchina.currentInstruction++;
        }
        statoMacchina.running = false;
    });

    //Tasto interlinea
    $('#interlinea').click(function () {
        stampa('&nbsp<br>');

    });

    $('#programmi').click(function () {
        $('#modal').show(300);
    });

    $('#about').click(function () {
        $('#modal2').show(300);
    });


    $('#closedial').click(function () {
        $('#modal').hide(300);
    });

    $('#closedial2').click(function () {
        $('#modal2').hide(300);
    });


    // AGGIUNGI TOOLTIP QUI
    Tipped.create('#fromM', 'Move value from M');
    Tipped.create('#toA', 'Move value to A');
    Tipped.create('#exchange', 'Exchange selected with A');
    Tipped.create('#print', 'Print register content');
    Tipped.create('.register', 'Select register');



    $('#spinnerBottom').on('change', function() {
        statoMacchina.numberOfDecimals = $(this).val();
    });
    $('#spinnerTop').on('change', function() {
        statoMacchina.numberOfDecimals = $(this).val();
    });
});