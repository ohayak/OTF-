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
    this.document.find(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            var t2 = new Date().getMilliseconds();
            logger.info('Into mongooseGeneric.getDocuments TIME : ' + (t2 - t1) + ' ms');

	    var tabNomCategories = [];
	    for(var i = 0; i<result.length; i++){
		tabNomCategories.push(result[i].nom_categorie);
	    }
	    result.tabCategories = tabNomCategories;
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
	model.document.find({"_id": id_composant}, function(err,result){
	    if(err) _callback(err,null);
	    else{
		quantite_initiale = result[0].quantite_composant;
		tab_pretes = result[0].tab_pretes;
		tab_pretes.push(_values._id);
		var quantite_composant = parseInt(quantite_initiale) - parseInt(quantite_pretee);
		
		// mise à jour de la table des composants
		model.document.update({"_id": id_composant}, {$set: {"tab_pretes": tab_pretes, "quantite_composant": quantite_composant}}, function(){});
		_callback(null,result);
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
