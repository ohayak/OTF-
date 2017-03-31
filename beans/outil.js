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

/*
 * return true if d1 is more recent than d2
 * false else
 */
function compareStringDate(d1, d2) {
    var tokensdate1 = d1.split(' ');
    var tokensdate2 = d2.split(' ');
    var tokenshour1 = tokensdate1[4].split(':');
    var tokenshour2 = tokensdate2[4].split(':');
    tokensdate1[3] = parseInt(tokensdate1[3]);
    tokensdate2[3] = parseInt(tokensdate2[3]);
    tokensdate1[2] = parseInt(tokensdate1[2]);
    tokensdate2[2] = parseInt(tokensdate2[2]);
    for(n in tokenshour1)
	tokenshour1[n] = parseInt(tokenshour1[n]);
    for(n in tokenshour2)
	tokenshour2[n] = parseInt(tokenshour2[n]);
    if(tokensdate1[3] != tokensdate2[3])
	return tokensdate1[3] > tokensdate2[3];
    else if(tokensdate1[2] != tokensdate2[2])
	return tokensdate1[2] > tokensdate2[2];
    else if(tokenshour1[0] != tokenshour2[0])
	return tokenshour1[0] > tokenshour2[0];
    else if(tokenshour1[1] != tokenshour2[1])
	return tokenshour1[1] > tokenshour2[1];
    else if(tokenshour1[2] != tokenshour2[2])
	return tokenshour1[2] > tokenshour2[2];
    else
	return true;
}

exports.paramEscape = paramEscape;
exports.compareStringDate = compareStringDate;
