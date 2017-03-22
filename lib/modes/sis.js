'use strict';
/**
 * Created by flori on 20.03.2017.
 */

let
    q = require('q'),
    cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs')
;

function loadPage(game){

    let deferred = q.defer();

    request('http://liveticker.sis-handball.org/game/show/'+game, (err, response, html) => {

        if(!err && response.statusCode === 200){

            deferred.resolve(cheerio.load(html));

        } else {
            deferred.reject(err);
        }

    });


    return deferred.promise;

}

function parseHeadlines(html){

    let headlines = html('#teams h3').map((index, item) => html(item).text());

    return {
        home : headlines[0],
        guest : headlines[1]
    }
}

function parseTeams(html){

    let
        homeTable = html('#home > tbody > tr'),
        guestTable = html('#guest > tbody > tr'),

        homeParsed = [],
        guestParsed = []
    ;

    function parseRow(tds, prefix){

        return {
            shortcut : (tds.first().text()).toLowerCase().replace(/o?([0-9]{1,2}|[a-e])/,prefix+'$1').replace(' ', ''),
            number : (tds.first().text()).charAt(0) === 'O' ? undefined : tds.first().text().trim(),
            name : (tds.last().text()).split(', ').reverse().join(' ')
        };
    }

    homeParsed  = homeTable.map((index, item)  => parseRow(html(item).find('td:first-child, td:nth-child(2)'), 'h'));
    guestParsed = guestTable.map((index, item) => parseRow(html(item).find('td:first-child, td:nth-child(2)'), 'g'));

    return {
        home : homeParsed,
        guest : guestParsed
    }

}

function prepareLines(teams, headlines){

    function mapper(line, team){
        return line.shortcut
            + "\t"
            + (line.number ? 'Nr.' + line.number + ' ' : '')
            + line.name + ' '
            + '(' + team + ')'
        ;
    }

    return {
        home : teams.home.map((index, line)  => mapper(line, headlines.home)),
        guest : teams.guest.map((index, line) => mapper(line, headlines.guest)),
    }


}

function createFilenames(teams){
    return {
        home  : teams.home.toLowerCase().replace(' ','').substring(0,3),
        guest : teams.guest.toLowerCase().replace(' ','').substring(0,3)
    }
}

function writeFiles(filenames, teams){

    let
        homeFileContent = '',
        guestFileContent = ''
    ;

    let homeContent = teams.home.map((line, item) => {homeFileContent += item + '\r\n'}),
        guestContent = teams.guest.map((line, item) => {guestFileContent += item + '\r\n'})
    ;

    console.log(homeContent);

    fs.writeFile('./' + filenames.home + '.txt', homeFileContent, (err) => console.log('Home written'));
    fs.writeFile('./' + filenames.guest + '.txt', guestFileContent, (err) => console.log('Guest written'));


}




module.exports = (() => {

    let module = {};

    module.action = (args) => {

        let deferred = q.defer();

        if(!args.game){
            deferred.reject('No game number argument');
            return deferred.promise;
        }

        let html,
            headlines = {},
            teams = {},
            parsedTeams = {}
        ;

        return loadPage(args.game)
            .then(($) => {
                html = $;
                return parseHeadlines($);
            })
            .then((teams) => {

                headlines.home  = teams.home;
                headlines.guest = teams.guest;

                return parseTeams(html);

            })
            .then((parsedTeams) => {

                teams.home  = parsedTeams.home;
                teams.guest = parsedTeams.guest;

                return prepareLines(teams, headlines);
            })
            .then((list) => {


                parsedTeams = list;

                return createFilenames(headlines);

            })
            .then((filenames) => {

                return writeFiles(filenames, parsedTeams);


            })
            .catch((err) => {
                console.log(err);
            })

        ;




    };




    return module;

})();