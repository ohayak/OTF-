function htmlEscape(text) {
   return text.replace(/&/g, '&amp;').
     replace(/</g, '&lt;').  // it's not neccessary to escape >
     replace(/"/g, '&quot;').
     replace(/'/g, '&#039;');
}

function paramEscape(param) {
    for(id in param) {
	param[id] = htmlEscape(param[id]);
    }
    return param;
}

exports.paramEscape = paramEscape;
