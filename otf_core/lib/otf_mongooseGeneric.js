var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var paginate = require("mongoose-pages");
var logger = require('log4js').getLogger('otf_mongooseGeneric');
//logger.setLevel(GLOBAL.config["LOGS"].level);

//- var schema = new mongoose.Schema({ name: 'string', size: 'string' });
//- var Tank = mongoose.model('Tank', schema);
function mongooseGeneric(_schemaName, _schema, collection) {
    if (db.models[_schemaName])
        delete db.models[_schemaName];

    this.documentSchema = mongoose.Schema(_schema);
    paginate.anchor(this.documentSchema);
    //paginate.skip(this.documentSchema);
    //logger.debug(" schema_loader : Schema after Paginate",_schema);
    this.document = db.model(_schemaName, this.documentSchema, collection); // db global

};

mongooseGeneric.prototype.initDocument = function (_schema, _schemaName, _callback) {
    this.documentSchema = mongoose.Schema(_schema);
    this.document = db.model(_schemaName, this.documentSchema);
    _callback();
};

mongooseGeneric.prototype.getDocument = function (_condition, _callback) {

    this.document.findOne(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    });

};

mongooseGeneric.prototype.getDocuments = function (_condition, _callback) {
    var t1 = new Date().getMilliseconds();
    this.document.find(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            var t2 = new Date().getMilliseconds();
            logger.info('Into mongooseGeneric.getDocuments TIME : ' + (t2 - t1) + ' ms');
            _callback(null, result);
        }
    });
};

mongooseGeneric.prototype.getMultiDocuments = function (_condition, _callback) {
    var t1 = new Date().getMilliseconds();
    this.document.find(_condition).populate({path:"id_categorie"}).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
			var tabNomCategories = [];
			for(var i = 0; i<result.length; i++){
				var categorie = {};
				var tab_sous_categories = [];
				var ok = 1;
				logger.debug("--------------------------NOM CAT---------------------------------------------------");
				logger.debug(result[i].id_categorie.nom_categorie);
				logger.debug("-----------------------------------------------------------------------------");
				for (var k = 0; k<tabNomCategories.length; k++) {
					
					if(!(result[i].id_categorie._id < tabNomCategories[k]._id || result[i].id_categorie._id > tabNomCategories[k]._id)){
					    ok = 0;
					}
				}
				logger.debug("--------------------------OK--------------------------------------------------");
				logger.debug(ok);
				logger.debug("-----------------------------------------------------------------------------");
				if(ok==1){
					categorie._id = result[i].id_categorie._id;
					categorie.nom_categorie = result[i].id_categorie.nom_categorie;
					for(var j = 0; j<result.length; j++){
						if(!(result[i].id_categorie._id < result[j].id_categorie._id || result[i].id_categorie._id > result[j].id_categorie._id)){
							var sous_categorie = {}
							logger.debug("-----------------------------------+ souscat------------------------------------------");
							sous_categorie._id = result[j]._id;
							logger.debug("--------------------------ID--NOM------------------------------------------------");
							logger.debug(sous_categorie._id);
							logger.debug(result[j].nom_sous_categorie);
							logger.debug("-----------------------------------------------------------------------------");
							sous_categorie.nom_sous_categorie = result[j].nom_sous_categorie;
							sous_categorie.id_categorie = result[j].id_categorie;
							tab_sous_categories.push(sous_categorie);
						}
					}
					categorie.sous_categories = tab_sous_categories;
					logger.debug("--------------------------RESULT:---------------------------------------------------");
			logger.debug(result.tabCategories);
			logger.debug("-----------------------------------------------------------------------------");
					tabNomCategories.push(categorie);
				}
				
			}
			result.tabCategories = tabNomCategories;
			logger.debug("--------------------------RESULT:---------------------------------------------------");
			logger.debug(result.tabCategories);
			logger.debug("-----------------------------------------------------------------------------");
        	_callback(null, result);
        }
    });
};


mongooseGeneric.prototype.deleteDocument = function (_condition, _callback) {

    this.document.remove(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, _condition);
        }
    });

};

mongooseGeneric.prototype.deleteDocument = function (_condition, _callback) {

    this.document.remove(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, _condition);
        }
    });

};

mongooseGeneric.prototype.createDocument = function (_values, _callback) {

    if(!_values.hasOwnProperty("_id"))
      _values._id = new ObjectId();

    var m = new this.document(_values);
    m.save(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, _values);
        }
    });

};

mongooseGeneric.prototype.createDocumentComponent = function (_values, _callback) {

	var model = GLOBAL.schemas["Sous_categories"];
	model.document.find({_id:_values.id_sous_categorie}).populate({path:"id_categorie"}).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
        logger.debug("--------------------------VALUE--------------------------------------------------");
		logger.debug(_values);
		logger.debug("-----------------------------------------------------------------------------");

    		if(!_values.hasOwnProperty("_id")){
     			 _values._id = new ObjectId();
     			 _values.id_categorie = result[0].id_categorie._id;
      			_values.tab_pretes = [];
        		logger.debug("--------------------------VALUE--------------------------------------------------");
				logger.debug(_values);
				logger.debug("-----------------------------------------------------------------------------");
			}	
		var mod = GLOBAL.schemas["Composants"];
    	var m = new mod.document(_values);
    	m.save(function(){});
    	_callback(null, _values);
		}
    });

};

mongooseGeneric.prototype.updateDocuments = function (_conditions, _values, _callback) {

    this.document.update(_conditions, { $set: _values}, { multi: true }, function (err, numberAffected) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, numberAffected);
        }
    });
};

mongooseGeneric.prototype.updateDocument = function (_conditions, _values, _callback) {

    this.document.update(_conditions, { $set: _values}, function (err, numberAffected) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, numberAffected);
        }
    });
};

mongooseGeneric.prototype.popDocument = function (_condition, _callback) {

    this.document.findOne(_condition.query).populate(_condition.ref).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    });
};

mongooseGeneric.prototype.popDocuments = function (_condition, _callback) {

    this.document.find(_condition.query).populate(_condition.ref).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    });
};



// populate example
// populate({path: _condition.ref[0], populate: {path: _condition.ref[1], populate: {path: _condition.ref[2], populate: {path: _condition.ref[3]}}}})

// Infinite Joins
mongooseGeneric.prototype.popDocumentsInfinite = function (_condition, _callback) { // condition.ref = [[key1,..., keyn],...,[key1,...,keym]]

    // construction of populate paths
    var make_sum = 0;
    var tab_populates = [];
    var new_populate = {};
    var sum = 0;
    for(var i=0; i<_condition.ref.length; i++){
	if(_condition.ref[i][0] != "sum"){
	    new_populate = {path: _condition.ref[i][_condition.ref[i].length-1]}; // most profound path
	    for(var j=_condition.ref[i].length-2; j>=0; j--){ // scroll inner-tabs from end to begining
		new_populate = {path: _condition.ref[i][j], populate: new_populate}; 
	    }
	}
	else{
	    make_sum ++;
	    new_populate = {path: _condition.ref[i][1]}; // name of array to consider in schema
	}
	tab_populates.push(new_populate);
    }

    // call of all populate paths
    var query = this.document.find(_condition.query);
    for(var i=0; i<_condition.ref.length; i++){
	query.populate(tab_populates[i]);
    }

    query.exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
	    if(make_sum){
		for(var i=0; i<result.length; i++){
		    var start_path = "";
		    var end_path = "";
		    var name = "";
		    for(var j=0; j<_condition.ref.length; j++){
			if(_condition.ref[j][0] === "sum"){
			    start_path = _condition.ref[j][1];
			    end_path = _condition.ref[j][2];
			    name = _condition.ref[j][3];
			}
		    }
		    var tab_to_sum = [];
		    for(var k=0; k<result[i][start_path].length; k++){
			tab_to_sum.push(result[i][start_path][k][end_path]);
		    }
		    var sum = 0;
		    for(var k=0; k<tab_to_sum.length; k++){
			sum += tab_to_sum[k];
		    }
		    result[i][name] = sum;
		}
	    }
            _callback(null, result);
        }
    });
};










// quand on rend tous les composants empruntés
mongooseGeneric.prototype.suppression_pretes = function (_condition, _callback){
    
    // construction of populate paths
    var make_sum = 0;
    var tab_populates = [];
    var new_populate = {};
    var sum = 0;
    for(var i=0; i<_condition.ref.length; i++){
	if(_condition.ref[i][0] != "sum"){
	    new_populate = {path: _condition.ref[i][_condition.ref[i].length-1]}; // most profound path
	    for(var j=_condition.ref[i].length-2; j>=0; j--){ // scroll inner-tabs from end to begining
		new_populate = {path: _condition.ref[i][j], populate: new_populate}; 
	    }
	}
	else{
	    make_sum ++;
	    new_populate = {path: _condition.ref[i][1]}; // name of array to consider in schema
	}
	tab_populates.push(new_populate);
    }

    // call of all populate paths
    var doc = this.document;
    var query = doc.find(_condition.query);
    for(var i=0; i<_condition.ref.length; i++){
	query.populate(tab_populates[i]);
    }

    query.exec(function (err, result) {
	if(err){
	    _callback(err,null);
	}
	else{
	    if(make_sum){
		for(var i=0; i<result.length; i++){
		    var start_path = "";
		    var end_path = "";
		    var name = "";
		    for(var j=0; j<_condition.ref.length; j++){
			if(_condition.ref[j][0] === "sum"){
			    start_path = _condition.ref[j][1];
			    end_path = _condition.ref[j][2];
			    name = _condition.ref[j][3];
			}
		    }
		    var tab_to_sum = [];
		    for(var k=0; k<result[i][start_path].length; k++){
			tab_to_sum.push(result[i][start_path][k][end_path]);
		    }
		    var sum = 0;
		    for(var k=0; k<tab_to_sum.length; k++){
			sum += tab_to_sum[k];
		    }
		    result[i][name] = sum;
		}
	    }
	    var nbr_composants = result[0].id_composant.quantite_composant;
	    var nbr_rendus = result[0].quantite_pretee;
	    var new_nbr_composants = parseInt(nbr_composants) + parseInt(nbr_rendus);
	    var id_pret = result[0]._id;
	    var id_composant = result[0].id_composant._id;
	    var old_tab_ids = result[0].id_composant.tab_pretes;
	    var new_tab_ids = [];
	    for(var i=0; i<old_tab_ids.length; i++){
		if(old_tab_ids[i]._id < id_pret || old_tab_ids[i]._id > id_pret){
		    new_tab_ids.push(old_tab_ids[i]);
		}
	    }
	    var _values = {"tab_pretes": new_tab_ids, "quantite_composant" : new_nbr_composants};
	    doc.remove({_id: id_pret}, function() {});


	    //mise à jour des modifications
	    var date = new Date();
	    var id_avant = new ObjectId();
	    var id_apres = new ObjectId();
	    var id_modif = new ObjectId();
	    var id_prete_avant = new ObjectId();
	    var id_default = new ObjectId();

	    var modification = {"_id":id_modif, "type_modification":"Rendu total d'un composant prêté", "date_modification":date , "modification":0, "rendu_partiel":0, "rendu_total":1, "pret":0, "creation":0, "suppression":0, "id_composant":id_composant, "id_pret": id_default, "id_avant":id_avant, "id_apres":id_apres, "ids_suppressions":[], "id_prete_avant":id_prete_avant, "id_prete_apres":id_default};

	    var avant = {"_id":id_avant, "nom_composant": result[0].id_composant.nom_composant, "quantite_composant":result[0].id_composant.quantite_composant, "statut_composant": result[0].id_composant.statut_composant, "remarques_composant":result[0].id_composant.remarques_composant, "categorie":result[0].id_composant.id_categorie.nom_categorie, "sous_categorie":result[0].id_composant.id_sous_categorie.nom_sous_categorie};

	    var apres = {"_id":id_apres, "nom_composant": result[0].id_composant.nom_composant, "quantite_composant":new_nbr_composants, "statut_composant": result[0].id_composant.statut_composant, "remarques_composant":result[0].id_composant.remarques_composant, "categorie":result[0].id_composant.id_categorie.nom_categorie, "sous_categorie":result[0].id_composant.id_sous_categorie.nom_sous_categorie};

	    var prete_avant = {"_id": id_prete_avant, "quantite_pretee": result[0].quantite_pretee, "date_pret":result[0].date_pret, "nom_emprunteur":result[0].nom_emprunteur, "nom_composant":result[0].id_composant.nom_composant, "categorie": result[0].id_composant.id_categorie.nom_categorie, "sous_categorie":result[0].id_composant.id_sous_categorie.nom_sous_categorie};
	    
	    var modele_modif = GLOBAL.schemas["Modifications"];
	    var modele_avant = GLOBAL.schemas["Composants_avant_modification"];
	    var modele_apres = GLOBAL.schemas["Composants_apres_modification"];
	    var modele_prete_avant = GLOBAL.schemas["Pretes_avant_modification"];
	    var mo = new modele_modif.document(modification);
	    var av = new modele_avant.document(avant);
	    var ap = new modele_apres.document(apres);
	    var pr_av = new modele_prete_avant.document(prete_avant);
	    mo.save(function(){});
	    av.save(function(){});
	    ap.save(function(){});
	    pr_av.save(function(){});

	    var model = GLOBAL.schemas["Composants"];
	    model.document.update({_id: id_composant}, { $set: _values}, function() {});
	    _callback(null, result);
	}
    });
};


















// quand on rend une partie des composants empruntés
mongooseGeneric.prototype.modification_pretes = function (_condition, _callback){
    
    // construction of populate paths
    var make_sum = 0;
    var tab_populates = [];
    var new_populate = {};
    var sum = 0;
    for(var i=0; i<_condition.ref.length; i++){
	if(_condition.ref[i][0] != "sum"){
	    new_populate = {path: _condition.ref[i][_condition.ref[i].length-1]}; // most profound path
	    for(var j=_condition.ref[i].length-2; j>=0; j--){ // scroll inner-tabs from end to begining
		new_populate = {path: _condition.ref[i][j], populate: new_populate}; 
	    }
	}
	else{
	    make_sum ++;
	    new_populate = {path: _condition.ref[i][1]}; // name of array to consider in schema
	}
	tab_populates.push(new_populate);
    }

    // call of all populate paths
    var doc = this.document;
    var req = {"_id": _condition.query._id};
    var query = doc.find(req);
    for(var i=0; i<_condition.ref.length; i++){
	query.populate(tab_populates[i]);
    }

    query.exec(function (err, result) {
	if(err){
	    _callback(err,null);
	}
	else{
	    if(make_sum){
		for(var i=0; i<result.length; i++){
		    var start_path = "";
		    var end_path = "";
		    var name = "";
		    for(var j=0; j<_condition.ref.length; j++){
			if(_condition.ref[j][0] === "sum"){
			    start_path = _condition.ref[j][1];
			    end_path = _condition.ref[j][2];
			    name = _condition.ref[j][3];
			}
		    }
		    var tab_to_sum = [];
		    for(var k=0; k<result[i][start_path].length; k++){
			tab_to_sum.push(result[i][start_path][k][end_path]);
		    }
		    var sum = 0;
		    for(var k=0; k<tab_to_sum.length; k++){
			sum += tab_to_sum[k];
		    }
		    result[i][name] = sum;
		}
	    }
	    var quantite_pretee = _condition.query.quantite_pretee;
	    var quantite_rendue = _condition.query.quantite_rendue;
	    var quantite_initiale = result[0].id_composant.quantite_composant;
	    var new_quantite = parseInt(quantite_initiale) + parseInt(quantite_rendue);



	    //mise à jour des modifications
	    var date = new Date();
	    var id_avant = new ObjectId();
	    var id_apres = new ObjectId();
	    var id_modif = new ObjectId();
	    var id_prete_avant = new ObjectId();
	    var id_prete_apres = new ObjectId();
	    var id_default = new ObjectId();

	    var modification = {"_id":id_modif, "type_modification":"Rendu partiel d'un composant prêté", "date_modification":date , "modification":0, "rendu_partiel":1, "rendu_total":0, "pret":0, "creation":0, "suppression":0, "id_composant":result[0].id_composant._id, "id_pret":id_default, "id_avant":id_avant, "id_apres":id_apres, "ids_suppressions":[], "id_prete_avant":id_prete_avant, "id_prete_apres":id_prete_apres};

	    var avant = {"_id":id_avant, "nom_composant": result[0].id_composant.nom_composant, "quantite_composant":result[0].id_composant.quantite_composant, "statut_composant": result[0].id_composant.statut_composant, "remarques_composant":result[0].id_composant.remarques_composant, "categorie":result[0].id_composant.id_categorie.nom_categorie, "sous_categorie":result[0].id_composant.id_sous_categorie.nom_sous_categorie};

	    var apres = {"_id":id_apres, "nom_composant": result[0].id_composant.nom_composant, "quantite_composant":new_quantite, "statut_composant": result[0].id_composant.statut_composant, "remarques_composant":result[0].id_composant.remarques_composant, "categorie":result[0].id_composant.id_categorie.nom_categorie, "sous_categorie":result[0].id_composant.id_sous_categorie.nom_sous_categorie};

	    var prete_avant = {"_id": id_prete_avant, "quantite_pretee": result[0].quantite_pretee, "date_pret":result[0].date_pret, "nom_emprunteur":result[0].nom_emprunteur,  "nom_composant":result[0].id_composant.nom_composant, "categorie": result[0].id_composant.id_categorie.nom_categorie, "sous_categorie": result[0].id_composant.id_sous_categorie.nom_sous_categorie};

	    var prete_apres = {"_id": id_prete_apres, "quantite_pretee": quantite_pretee, "date_pret":result[0].date_pret, "nom_emprunteur":result[0].nom_emprunteur, "nom_composant":result[0].id_composant.nom_composant, "categorie": result[0].id_composant.id_categorie.nom_categorie, "sous_categorie": result[0].id_composant.id_sous_categorie.nom_sous_categorie};
	    
	    var modele_modif = GLOBAL.schemas["Modifications"];
	    var modele_avant = GLOBAL.schemas["Composants_avant_modification"];
	    var modele_apres = GLOBAL.schemas["Composants_apres_modification"];
	    var modele_prete_avant = GLOBAL.schemas["Pretes_avant_modification"];
	    var modele_prete_apres = GLOBAL.schemas["Pretes_apres_modification"];
	    var mo = new modele_modif.document(modification);
	    var av = new modele_avant.document(avant);
	    var ap = new modele_apres.document(apres);
	    var pr_av = new modele_prete_avant.document(prete_avant);
	    var pr_ap = new modele_prete_apres.document(prete_apres);
	    mo.save(function(){});
	    av.save(function(){});
	    ap.save(function(){});
	    pr_av.save(function(){});
	    pr_ap.save(function(){});
  
	    // nouvelle quantité pour le prêt
	    doc.update({"_id": result[0]._id}, { $set: {"quantite_pretee": quantite_pretee}}, { multi: true }, function (){});
	    var model = GLOBAL.schemas["Composants"];
	    
	    // nouvelle quantite pour le composant
	    model.document.update({"_id": result[0].id_composant._id}, {$set: {"quantite_composant" : new_quantite}}, function(){});
	    _callback(null, result);
	}
    });
};












mongooseGeneric.prototype.lendObject = function(_values, _callback){
	// création du prêt
	if(!_values.hasOwnProperty("_id"))
	    _values._id = new ObjectId();
	var m = new this.document(_values);
	m.save(function (){});

	// populate de la table des composants
	var model = GLOBAL.schemas["Composants"];
	var id_composant = _values.id_composant;
	var tab_pretes = [];
	var quantite_initiale;
	var quantite_pretee = _values.quantite_pretee;
    model.document.find({"_id": id_composant}).populate({path:"id_categorie"}).populate({path:"id_sous_categorie"}).exec(function(err,result){
	    if(err) _callback(err,null);
	    else{
		quantite_initiale = result[0].quantite_composant;
		tab_pretes = result[0].tab_pretes;
		tab_pretes.push(_values._id);
		var quantite_composant = parseInt(quantite_initiale) - parseInt(quantite_pretee);

		
		//mise à jour des modifications
		var date = new Date();
		var id_avant = new ObjectId();
		var id_apres = new ObjectId();
		var id_modif = new ObjectId();
		var id_prete_apres = new ObjectId();
		var id_default_prete_avant = new ObjectId();

		var modification = {"_id":id_modif, "type_modification":"Prêt d'un composant", "date_modification":date , "modification":0, "rendu_partiel":0, "rendu_total":0, "pret":1, "creation":0, "suppression":0, "id_composant":id_composant, "id_pret": _values._id, "id_avant":id_avant, "id_apres":id_apres, "ids_suppressions":[], "id_prete_avant":id_default_prete_avant, "id_prete_apres":id_prete_apres};

		var avant = {"_id":id_avant, "nom_composant": result[0].nom_composant, "quantite_composant":result[0].quantite_composant, "statut_composant": result[0].statut_composant, "remarques_composant":result[0].remarques_composant, "categorie":result[0].id_categorie.nom_categorie, "sous_categorie":result[0].id_sous_categorie.nom_sous_categorie};

		var apres = {"_id":id_apres, "nom_composant": result[0].nom_composant, "quantite_composant":result[0].quantite_composant - _values.quantite_pretee, "statut_composant": result[0].statut_composant, "remarques_composant":result[0].remarques_composant, "categorie":result[0].id_categorie.nom_categorie, "sous_categorie":result[0].id_sous_categorie.nom_sous_categorie};

		var prete_apres = {"_id": id_prete_apres, "quantite_pretee": _values.quantite_pretee, "date_pret":_values.date_pret, "nom_emprunteur":_values.nom_emprunteur, "nom_composant":result[0].nom_composant, "categorie": result[0].id_categorie.nom_categorie, "sous_categorie": result[0].id_sous_categorie.nom_sous_categorie};
		
		var modele_modif = GLOBAL.schemas["Modifications"];
		var modele_avant = GLOBAL.schemas["Composants_avant_modification"];
		var modele_apres = GLOBAL.schemas["Composants_apres_modification"];
		var modele_prete_apres = GLOBAL.schemas["Pretes_apres_modification"];
		var mo = new modele_modif.document(modification);
		var av = new modele_avant.document(avant);
		var ap = new modele_apres.document(apres);
		var pr_ap = new modele_prete_apres.document(prete_apres);
		mo.save(function(){});
		av.save(function(){});
		ap.save(function(){});
		pr_ap.save(function(){});

		
		// mise à jour de la table des composants
		model.document.update({"_id": id_composant}, {$set: {"tab_pretes": tab_pretes, "quantite_composant": quantite_composant}}, function(){});
		_callback(null,result);
	    }
	});
};









mongooseGeneric.prototype.deleteComposant = function (_condition, _callback) {

    var model = GLOBAL.schemas["Composants"];
    model.document.find(_condition).populate({path:"tab_pretes", populate: {path: "id_composant", populate: {path: "id_categorie"}}}).populate({path:"tab_pretes", populate: {path: "id_composant", populate: {path: "id_sous_categorie"}}}).populate({path: "id_categorie"}).populate({path:"id_sous_categorie"}).exec(function(err,result){
	if(err){
	    _callback(err,null);
	}
	else{
	    if(result[0].tab_pretes.length == 0){
		var tab_ids_pretes = []; 
		for(var i=0; i<result[0].tab_pretes.length; i++){
		    tab_ids_pretes.push(result[0].tab_pretes[i]._id);
		}
		var model_pretes = GLOBAL.schemas["Prets"];
		for(var i=0; i<tab_ids_pretes.length; i++){
		    model_pretes.document.remove({"_id": tab_ids_pretes[i]}, function(){});
		}


		//mise à jour des modifications
		var date = new Date();
		var id_default = new ObjectId();
		var id_modif = new ObjectId();
		var id_avant = new ObjectId();

		var avant = {"_id":id_avant, "nom_composant": result[0].nom_composant, "quantite_composant":result[0].quantite_composant, "statut_composant": result[0].statut_composant, "remarques_composant":result[0].remarques_composant, "categorie":result[0].id_categorie.nom_categorie, "sous_categorie":result[0].id_sous_categorie.nom_sous_categorie};

		var modification = {"_id":id_modif, "type_modification":"Suppression d'un composant et des composants prêtés associés", "date_modification":date , "modification":0, "rendu_partiel":0, "rendu_total":0, "pret":0, "creation":0, "suppression":1, "id_composant":id_default, "id_pret": id_default, "id_avant":id_avant, "id_apres":id_default, "ids_suppressions":[], "id_prete_avant":id_default, "id_prete_apres":id_default};
		
		var modele_modif = GLOBAL.schemas["Modifications"];
		var modele_avant = GLOBAL.schemas["Composants_avant_modification"];
		var mo = new modele_modif.document(modification);
		var av = new modele_avant.document(avant);
		mo.save(function(){});
		av.save(function(){});
		
		model.document.remove(_condition, function (){});

	    }
	    _callback(null, result);
	}
    });

};







mongooseGeneric.prototype.updateAndModif = function (_conditions, _values, _callback) {

    
    var model = GLOBAL.schemas["Composants"];
    model.document.find({"_id": _conditions._id}).populate({path:"id_categorie"}).populate({path:"id_sous_categorie", populate: {path: "id_categorie"}}).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
	    //mise à jour des modifications
	    var date = new Date();
	    var id_avant = new ObjectId();
	    var id_apres = new ObjectId();
	    var id_modif = new ObjectId();
	    var id_default = new ObjectId();
	    
	    var modification = {"_id":id_modif, "type_modification":"Modification des attributs d'un composant", "date_modification":date , "modification":1, "rendu_partiel":0, "rendu_total":0, "pret":0, "creation":0, "suppression":0, "id_composant":_conditions._id, "id_pret":id_default, "id_avant":id_avant, "id_apres":id_apres, "ids_suppressions":[], "id_prete_avant":id_default, "id_prete_apres":id_default};  
	    
	    var avant = {"_id":id_avant, "nom_composant": result[0].nom_composant, "quantite_composant":result[0].quantite_composant, "statut_composant": result[0].statut_composant, "remarques_composant":result[0].remarques_composant, "categorie":result[0].id_categorie.nom_categorie, "sous_categorie":result[0].id_sous_categorie.nom_sous_categorie};
	    
	    var apres = {"_id":id_apres, "nom_composant": _values.nom_composant, "quantite_composant":_values.quantite_composant, "statut_composant": _values.statut_composant, "remarques_composant":_values.remarques_composant, "categorie":_values.id_categorie.nom_categorie, "sous_categorie":_values.id_sous_categorie.nom_sous_categorie};
	    
	    var modele_modif = GLOBAL.schemas["Modifications"];	    
	    var modele_avant = GLOBAL.schemas["Composants_avant_modification"];	    
	    var modele_apres = GLOBAL.schemas["Composants_apres_modification"];	    
	    var mo = new modele_modif.document(modification);	    
	    var av = new modele_avant.document(avant);	    
	    var ap = new modele_apres.document(apres);	    
	    mo.save(function(){});	    
	    av.save(function(){});	    
	    ap.save(function(){});
	    

	    // MAJ des composants
	    model.document.update(_conditions, { $set: _values},function(){});
	    _callback(null, result);
        }
    });
};










mongooseGeneric.prototype.deleteModification = function (_condition, _callback) {

    var modele_modification = GLOBAL.schemas["Modifications"];
    var modele_composant_avant = GLOBAL.schemas["Composants_avant_modification"];
    var modele_composant_apres = GLOBAL.schemas["Composants_apres_modification"];
    var modele_pretes_avant = GLOBAL.schemas["Pretes_avant_modification"];
    var modele_pretes_apres = GLOBAL.schemas["Pretes_apres_modification"];

    modele_modification.document.find(_condition._id, function(err, result){
	if(err){
	    _callback(err, null);
	}
	else{
	    var avant = result[0].id_avant;
	    var apres = result[0].id_apres;
	    var prete_avant = result[0].id_prete_avant;
	    var prete_apres = result[0].id_prete_apres;
	    var tab_pretes = result[0].ids_suppressions;

	    modele_composant_avant.document.remove({_id: avant}, function(){});
	    modele_composant_apres.document.remove({_id: apres}, function(){});
	    modele_pretes_avant.document.remove({_id: prete_avant}, function(){});
	    modele_pretes_apres.document.remove({_id: prete_apres}, function(){});
	    modele_modification.document.remove({_id: _condition._id}, function(){});
	    for(var i=0; i<tab_pretes.length; i++){
		modele_pretes_avant.document.remove({_id: tab_pretes[i]}, function(){});
	    }
	    
	    _callback(null, result);
	}
    });
};




mongooseGeneric.prototype.deleteHistorique = function (_condition, _callback) {

    var model = GLOBAL.schemas["Modifications"];
    model.document.find({}).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
	    var modele_composant_avant = GLOBAL.schemas["Composants_avant_modification"];
	    var modele_composant_apres = GLOBAL.schemas["Composants_apres_modification"];
	    var modele_pretes_avant = GLOBAL.schemas["Pretes_avant_modification"];
	    var modele_pretes_apres = GLOBAL.schemas["Pretes_apres_modification"];
	    for(var i=0; i<result.length; i++){
		modele_composant_avant.document.remove({_id: result[i].id_avant},function(){});
		modele_composant_apres.document.remove({_id: result[i].id_apres},function(){});
		modele_pretes_avant.document.remove({_id: result[i].id_prete_avant},function(){});
		modele_pretes_apres.document.remove({_id: result[i].id_prete_apres},function(){});
		model.document.remove({_id: result[i]._id},function(){});
	    }
            _callback(null, result);
        }
    });
};



mongooseGeneric.prototype.getPaginateDocuments = function (_condition, _callback) {

    this.document.findPaginated(_condition.query, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    }, condition.docsPerPage, pageNumber);
};


exports.mongooseGeneric = mongooseGeneric;
