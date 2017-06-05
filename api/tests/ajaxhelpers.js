

var myapi = {

    get: function(url, callback){
        $.get(url, callback);
    },

    post: function(url, data, callback) {
    	$.post(url, data, callback);
    },

    angularPost: function(url, data, callback) {

    	$http({
    		method: "POST",
    		url: url,
    		data: data,
    		headers: {"Content-Type": "application/x-www-form-urlencoded"}
    	}).then(callback);
    }

};