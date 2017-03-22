'use strict';
/**
 * Created by flori on 20.03.2017.
 */

let processModes = {
    interactive : require('./interactive'),
    sis : require('./sis')
};

module.exports = (function Dispatcher(){

    let module = {};

    module.dispatch = (commander) => {

        let mode = commander.mode || 'interactive';

        let result = processModes[mode] && processModes[mode].action(commander).catch((err) => console.error(err));

    };

    return module;
})();