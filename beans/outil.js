function htmlEscape(text) {
   return text.replace(/&/g, '&amp;').
     replace(/</g, '&lt;').  // it's not neccessary to escape >
     replace(/"/g, '&quot;').
     replace(/'/g, '&#039;');
}

function paramEscape(param) {
    for(id in param) {
	if(typeof param[id] == 'string')
	    param[id] = htmlEscape(param[id]);
    }
    return param;
}

function deleteDefault(array, name) {
    var narray = [];
    for(doc in array) {
	if(array[doc][name] != "Default"){
	    narray.push(array[doc]);
	}
    }
    return narray;
}

exports.htmlEscape = htmlEscape;
exports.paramEscape = paramEscape;
exports.deleteDefault = deleteDefault;
