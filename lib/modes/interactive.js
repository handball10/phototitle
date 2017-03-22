'use strict';
/**
 * Created by flori on 20.03.2017.
 */


let
    q = require('q'),
    readline = require('readline'),
    fs = require('fs')
;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let
    currentInputHandler,
    currentTeam,

    shortcuts = {
        home : 'h',
        guest : 'g'
    }
;


function parseInput(input){

    switch(input){
        case '-hn' : setTeam('home'); setInputHandler(handler.name); break;
        case '-gn' : setTeam('guest'); setInputHandler(handler.name); break;
        case '-hp' : setTeam('home'); setInputHandler(handler.person); break;
        case '-gp' : setTeam('guest'); setInputHandler(handler.person); break;
        case '--' : writeFiles(); break;
        case 'exit' : process.exit(0); break;
        default : inputHandler(input); break;
    }

}

function setInputHandler(handler){
    currentInputHandler = handler;
}

function setTeam(team){
    console.log('set team to ', team);
    currentTeam = team;
}

function inputHandler(input){
    currentInputHandler && currentInputHandler(input);
}

function writeFiles(){
    if(teams.home.name.length === 0 ||
        teams.guest.name.length === 0 ||
        teams.home.persons.length === 0 ||
        teams.guest.persons.length === 0
    ){
        return console.error('Missing input');
    }

    let
        homeString = '',
        guestString = ''
    ;

    function mapper(item, team){
        return item.shortcut
            + "\t"
            + (item.number ? 'Nr.' + item.number + ' ' : '')
            + item.name + ' '
            + '(' + team + ')\r\n'
        ;
    }

    teams.home.persons.forEach((item) => {
        homeString += mapper(item, teams.home.name);
    });

    teams.guest.persons.forEach((item) => {
        guestString += mapper(item, teams.guest.name);
    });

    let filenameHome  = teams.home.name.toLowerCase().replace(' ','').substring(0,3);
    let filenameGuest = teams.guest.name.toLowerCase().replace(' ','').substring(0,3);


    if(filenameHome === filenameGuest){
        filenameGuest += '_';
    }

    fs.writeFile('./' + filenameHome  + '.txt', homeString, (err) => console.log('Home written'));
    fs.writeFile('./' + filenameGuest + '.txt', guestString, (err) => console.log('Guest written'));
}


let teams = {

    home : {
        name : '',
        persons : []
    },

    guest : {
        name : '',
        persons : []
    }
};

const handler = {

    name : (name) => {
        teams[currentTeam].name = name;
    },

    person : (input) => {

        let splittedInput = input.split(/ (.+)/);

        teams[currentTeam].persons.push({
            name : splittedInput[1],
            number: /[a-e]/.test(splittedInput[0]) ? undefined : splittedInput[0],
            shortcut: splittedInput[0].replace(/o?([0-9]{1,2}|[a-e])/,shortcuts[currentTeam]+'$1')
        });
    }


};

module.exports = (() => {

    let module = {};

    module.action = (args) => {

        rl.on('line', parseInput);



        return q();

    };




    return module;

})();