/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('updater');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var genericModel = require('../otf_core/lib/otf_mongooseGeneric');
var util = require('../otf_core/lib/otf_util');
var outil = require('./outil');

/*
 * SET users datas into MongoDB.
 */

exports.updater = {
    one: function (req, cb) {
        var _controler = req.session.controler;
        var values = outil.paramEscape(_controler.params);
        // ici params est un objet simple à insérer
        var theId = values._id;
	logger.debug('id updater : ', theId);
        delete values._id;
        var model = GLOBAL.schemas[_controler.data_model];
        logger.debug('params updater : ', values);
        try {
            model.updateDocument({_id: theId}, values, function (err, numberAffected) {
                if (err) {
                    logger.info('----> error : ' + err);
                } else {
                    logger.debug('modification utilisateur : ', numberAffected);
                    return cb(null, {data: numberAffected, room: _controler.room});
                }
            });
        } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.debug('----> error catch : ' + errc);
            return cb(err);
        }
    },


    account: function (req, cb) {
        var _controler = req.session.controler;
        var values = outil.paramEscape(_controler.params);
        // ici params est un objet simple à insérer
        var theId = values._id;
	logger.debug('id updater : ', theId);
        delete values._id;
        var model = GLOBAL.schemas[_controler.data_model];
        logger.debug('params updater : ', values);

	values.password = util.cypherPassword(values.password);
	
        try {
            model.updateDocument({_id: theId}, values, function (err, numberAffected) {
                if (err) {
                    logger.info('----> error : ' + err);
                } else {
                    logger.debug('modification utilisateur : ', numberAffected);
                    return cb(null, {data: numberAffected, room: _controler.room});
                }
            });
        } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.debug('----> error catch : ' + errc);
            return cb(err);
        }
    },

    one_and_modif: function (req, cb) {
        var _controler = req.session.controler;
        var values = outil.paramEscape(_controler.params);
        // ici params est un objet simple à insérer
        var theId = values._id;
	logger.debug('id updater : ', theId);
        delete values._id;
        var model = GLOBAL.schemas[_controler.data_model];
        logger.debug('params updater : ', values);

	logger.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	logger.debug(_controler.params._id);
	logger.debug(_controler.params.nom_composant);
	logger.debug(_controler.params.quantite_composant);
	logger.debug(_controler.params.remarques_composant);
	logger.debug(_controler.params.statut_composant);
	logger.debug(_controler.params.id_categorie);
	logger.debug(_controler.params.id_sous_categorie);
	logger.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	logger.debug(values.nom_composant);
	logger.debug(values.quantite_composant);
	logger.debug(values.remarques_composant);
	logger.debug(values.statut_composant);
	logger.debug(values.id_categorie);
	logger.debug(values.id_sous_categorie);
	logger.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

	logger.debug(theId);
	
        try {
            model.updateAndModif({_id: theId}, values, function (err, numberAffected) {
                if (err) {
                    logger.info('----> error : ' + err);
                } else {
                    logger.debug('modification utilisateur : ', numberAffected);
                    return cb(null, {data: numberAffected, room: _controler.room});
                }
            });
        } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.debug('----> error catch : ' + errc);
            return cb(err);
        }
    },


    prets_rendus_incomplet: function (req, cb) {
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug(" Finder.populate call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            var _params = { query: outil.paramEscape(_controler.params), ref: _controler.data_ref};
            model.modification_pretes(_params, function (err, list) {
                logger.debug('Populate Result  :', list);
                logger.debug('req.session : ' , req.session );
                list.str = JSON.stringify(list);
                return cb(null, {result: list}); //, user:req.session.login_info.user, "state": state, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    newPret: function (req, cb) {
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug(" Finder.populate call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.lendObject(outil.paramEscape(_controler.params), function (err, list) {
                logger.debug('Populate Result  :', list);
                logger.debug('req.session : ' , req.session );
                list.str = JSON.stringify(list);
                return cb(null, {result: list}); //, user:req.session.login_info.user, "state": state, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    list: function (req, cb) {
        var _controler = req.session.controler;
        // ici params est un tableau d'objet à mettre à jour
        /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

    }
};
