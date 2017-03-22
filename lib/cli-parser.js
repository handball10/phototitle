'use strict';
/**
 * Created by flori on 19.03.2017.
 */

let
    commander = require('commander'),
    dispatcher = require('./modes/dispatcher')
;

function parse(args){

    console.log(args);

    commander
        .version('0.0.1')
        .option('-m, --mode', 'Mode: interactive or SiS mode')

        .parse(args)
    ;

    dispatcher.dispatch(commander);

}


module.exports = (() => {

    return {
        parse : parse
    }

})();
