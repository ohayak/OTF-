/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('inserter');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var util = require('../otf_core/lib/otf_util');
//var genericModel = require(__dirname + '/../../../ressources/models/mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.inserter = {
    one: function (req, cb) {
        var _controler = req.session.controler;
        var model = GLOBAL.schemas[_controler.data_model];
        //@TODO not safety
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            model.createDocument(_controler.params, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
                return cb(null, {data: nb_inserted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }

    },


    account: function (req, cb) {
        var _controler = req.session.controler;
        var model = GLOBAL.schemas[_controler.data_model];
        //@TODO not safety
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
	_controler.params.password = util.cypherPassword(_controler.params.password);
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            model.createDocument(_controler.params, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
                return cb(null, {data: nb_inserted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }

    },

    oneComponent: function (req, cb) {
        var _controler = req.session.controler;
        var model = GLOBAL.schemas[_controler.data_model];
        //@TODO not safety
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            model.createDocumentComponent(_controler.params, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
                return cb(null, {data: nb_inserted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }

    },

    list: function (req, cb) {
        var _controler = req.session.controler;
        // ici params est un tableau d'objet à insérer
        /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

    },

    newConversation: function (req, cb){
	var _controler = req.session.controler;
        var model = GLOBAL.schemas["Conversations"];
        //@TODO not safety
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
	var id_conv, nb_inserted1;
        try {
            model.createDocument({ titre_conversation: _controler.params.titre_conversation, date_conversation: new Date().toString(), conversation_resolue: false, id_auteur: req.session.login_info.user._id }, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
		id_conv = nb_inserted._id;
		logger.debug('\n\n\n ID CONV :'+id_conv+'\n\n\n');
		nb_inserted1 = nb_inserted;
		model = GLOBAL.schemas["Commentaires"];
		try {
		    logger.debug('\n\n\n ID CONV :'+id_conv+'\n\n\n');
		    model.createDocument({ contenu_commentaire: _controler.params.contenu_commentaire, date_commentaire: new Date().toString(), id_auteur: req.session.login_info.user._id, id_conversation: id_conv }, function (err, nb_inserted) {
			logger.debug('nombre documents insérés :', nb_inserted);
			return cb(null, {data: {conversation: nb_inserted1, commentaires: nb_inserted}, room: _controler.room});
		    });
		} catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
		    return cb(err);
		}
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }
	
    },

    newCommentaire: function(req, cb) {
	var _controler = req.session.controler;
        var model = GLOBAL.schemas["Commentaires"];
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('params  : ', _controler.params);
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            model.createDocument({ contenu_commentaire: _controler.params.contenu_commentaire, date_commentaire: new Date().toString(), id_auteur: req.session.login_info.user._id, id_conversation: _controler.params.id_conversation }, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
                return cb(null, {data: nb_inserted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }
    },

    newCategorie : function(req, cb) {
	var _controler = req.session.controler;
        var model = GLOBAL.schemas["Categories"];
        //@TODO not safety
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            model.createDocument(_controler.params, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
		model = GLOBAL.schemas["Sous_categories"];
		model.createDocument({ nom_sous_categorie: "Default", id_categorie: nb_inserted._id }, function (err, nb_inserted2){
		    logger.debug('nombre documents insérés :', nb_inserted2);
		    return cb(null, {data: {categorie: nb_inserted, sous_categorie: nb_inserted2}, room: _controler.room});
		});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }
    }
};
