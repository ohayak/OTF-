/**
 * Created by epa on 18/11/14.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
//var genericModel = require('../ressources/models/mongooseGeneric');
var passport = require('passport');
var logs = GLOBAL.schemas["Logs"];

/*
 * SET users datas into MongoDB.
 */

exports.signupAccount = {
    //beans.params, beans.path, beans.data_model, beans.schema, beans.room
    signup: function (req, cb) {
        // CONTROLER
        var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('room   : ', _controler.room);
        logger.debug('model  : ' + _controler.data_model);
        logger.debug('params  : ', _controler.params);

        passport.authenticate(
            'local',
            function (err, account, info) {

                if (err) {
                    logger.debug("passport.authenticate  signupAccount ERROR [%s]",
                        err);
                    return next(err); // will generate a 500 error
                }
                ;
                if (!account) {
                    logger.debug("passport.authenticate  signupAccount Fail message %j", info);
                    req.session.controler.screen = 'login';
                    //
                    logs.createDocument({ date: new Date().toString(), event: "connect_fail", message: info.message, ip: req.connection.remoteAddress, session: req.sessionID, user_id: null }, function (err, result) {
                        if (err) {
                            logger.error(" signup create Logs failed " + err.message);
                            return cb(err);
                        } else
                            return cb(null, {title: 'OTF EXPRESS AUTHENTIFICATION ', state: 'not_connected', message: info.message});
                    });

                } else {
                    req.logIn(account, function (err) {
                        if (err) {
                            logger.debug("passport.authenticate req.LogIn ERROR   account : [%j]",
                                account);
                            return cb(err);
                        }
                        logger.debug("passport.authenticate req.LogIn OK   account : [%j,  session id : [%s]]",
                            account, req.sessionID);
                        //--
                        logs.createDocument({ date: new Date().toString(), event: "login", message: "", ip: req.connection.remoteAddress, session: req.sessionID, user_id: account._id }, function (err, result) {
                            if (err) {
                                logger.error(" signup create Logs failed " + err.message);
                                return cb(err);
                            } else {
                                return cb(null, {title: 'OTF EXPRESS ', state: 'connected', user: account.login, message: " votre n° de session  est : " + req.sessionID});
                            }

                        });

                    });
                }


            })(req);
    },
    logout: function (req, cb) {
        var _user = req.user;

        logs.createDocument({ date: new Date().toString(), event: "logout", message: "", ip: req.connection.remoteAddress, session: req.sessionID, user_id: _user._id }, function (err, result) {
            if (err) {
                logger.error(" signup create Logs failed " + err.message);
                req.logout();
                return cb(err);
            } else {
                req.logout();
                return cb(null, {title: 'OTF EXPRESS ', state: 'de_connected', user: _user, message: " Vous êtes maintenant Déconecté"});
            }

        });

    }
};