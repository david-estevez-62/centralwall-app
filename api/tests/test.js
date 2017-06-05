


// a) Post req to /bootstrapclient with invalid cookie this includes empty string. If posting a cookie with 
// an invalid pattern we expect to receive an object with a notformat property. The valid pattern is the 
// mongoId of a user that exists in the db concatenated with a dash then the time greater than the current time
(function(){
		// invalid cookie pattern
	    var data = { cookie: "gtrjerggwnf" };

		myapi.post(api.baseUrl + "bootstrapclient", data, function(results) { 
			assert(results.notformat, "a) Post req to /bootstrapclient with invalid cookie")
		});
}());



// b) Post req to /bootstrapclient with expired cookie. If posting an expired cookie we expect to receive an 
// object with an expired property, if it has an expired property the user exists in the database and
// we made it passed that check. The only occassion this test should fail is if there is no user in the 
// database (must have atleast one user in the db)
(function(){
		// Bring back one user that exists on the local instance of mongodb to create a cookie that passes as 
		// a user in the db however force the date portion of the cookie to be less than the current date 
		// which we check to be above
		myapi.get(api.baseUrl + "getexistinguser", function(resp){
			// expired cookie pattern
		    var data = { cookie: resp + "-10000" };

			myapi.post(api.baseUrl + "bootstrapclient", data, function(results) { 
				assert(results.expired, "b) Post req to /bootstrapclient with expired cookie")
			});

		});
}());



// c) Post req to /bootstrapclient with valid cookie. If posting a valid cookie we expect to receive an object 
// with a user property. The only occassion this test should fail is if there is no user in the 
// database (must have atleast one user in the db)
(function(){
		// Bring back one user that exists on the local instance of mongodb to create a valid cookie for 
		// testing. And create a cookie with the valid pattern we check for in backend which is a mongoId of 
		// a user in the system, concatenated with a dash and then time greater than the current time
		myapi.get(api.baseUrl + "getexistinguser", function(resp){
			// valid cookie pattern
			var data = { cookie: resp + "-" + (new Date().getTime() + 10000), dataUrl: dataUrl };

			myapi.post(api.baseUrl + "bootstrapclient", data, function(results) { 
				assert(results.user, "c) Post req to /bootstrapclient with valid cookie")
			});

		});
}());



// d) Post req to /staticpics with invalid cookie this includes empty string. If posting a cookie with an 
// invalid pattern we expect to receive an object with a notformat property. The valid pattern is the 
// mongoId of a user that exists in the db concatenated with a dash then the time greater than the current time
(function(){
		// invalid cookie pattern
	    var data = { cookie: "erthetrhj" };

		myapi.post(api.baseUrl + "staticpics", data, function(results) { 
			assert(results.notformat, "d) Post req to /staticpics with invalid cookie")
		});
}());




// e) Post req to /staticpics with expired cookie. If posting an expired cookie we expect to receive an 
// object with an expired property, if it has an expired property the user exists in the database and
// we made it passed that check. The only occassion this test should fail is if there is no user in 
// the database (must have atleast one user in the db)
(function(){
		// Bring back one user that exists on the local instance of mongodb to create a cookie that passes as 
		// a user in the db however force the date portion of the cookie to be less than the current date 
		// which we check to be above
		myapi.get(api.baseUrl + "getexistinguser", function(resp){
			// expired cookie pattern
			var data = { cookie: resp + "-10000" };

			myapi.post(api.baseUrl + "staticpics", data, function(results) { 
				assert(results.expired, "e) Post req to /staticpics with expired cookie")
			});

		})
}());




// f) Post req to /staticpics with valid cookie. If posting a valid cookie we expect to receive an object 
// with a user property. The only occassion this test should fail is if there is no user in the 
// database (must have atleast one user in the db)
(function(){
		// Bring back one user that exists on the local instance of mongodb to create a valid cookie for 
		// testing. And create a cookie with the valid pattern we check for in backend which is a mongoId of 
		// a user in the system, concatenated with a dash and then time greater than the current time
		myapi.get(api.baseUrl + "getexistinguser", function(resp){
			// valid cookie pattern
			var data = { cookie: resp + "-" + (new Date().getTime() + 10000), dataUrl: dataUrl };

			myapi.post(api.baseUrl + "staticpics", data, function(results) { 
				assert(results.user, "f) Post req to /staticpics with valid cookie")
			});

		})
}());




// g) Post req to /adjoinimg with invalid cookie this includes empty string. If posting a cookie with an 
// invalid pattern we expect to receive an object with a notformat property. The valid pattern is the 
// mongoId of a user that exists in the db concatenated with a dash then the time greater than the current time
(function(){
		// invalid cookie pattern
	    var data = { cookie: "ejwfkwefw" };

		myapi.post(api.baseUrl + "adjoinimg", data, function(results) { 
			assert(results.notformat, "g) Post req to /adjoinimg with invalid cookie")
		});
}());




// h) Post req to /adjoinimg with expired cookie. If posting an expired cookie we expect to receive an 
// object with an expired property, if it has an expired property the user exists in the database and
// we made it passed that check. The only occassion this test should fail is if there is no user is in 
// the database (must have atleast one user in the db)
(function(){
		// Bring back one user that exists on the local instance of mongodb to create a cookie that passes as 
		// a user in the db however force the date portion of the cookie to be less than the current date 
		// which we check to be above
		myapi.get(api.baseUrl + "getexistinguser", function(resp){
			// expired cookie pattern
			var data = { cookie: resp + "-10000" };

			myapi.post(api.baseUrl + "adjoinimg", data, function(results) { 
				assert(results.expired, "h) Post req to /adjoinimg with expired cookie")
			});
		});
}());




// i) Post req to /adjoinimg with valid cookie. If posting a valid cookie and that cookie is associated with a
// user that has been verified (verified their email) an img will be created in the public/img/uploads directory
// The only occassion this test should fail is if there is no user in the database (must have atleast one user 
// in the db) or if the user is not verified
(function(){
		// Bring back one user that exists on the local instance of mongodb to create a valid cookie for 
		// testing. And create a cookie with the valid pattern we check for in backend which is a mongoId of 
		// a user in the system, concatenated with a dash and then time greater than the current time
		myapi.get(api.baseUrl + "getexistinguser", function(resp){
			// valid cookie pattern
			var data = { cookie: resp + "-" + (new Date().getTime() + 10000), dataUrl: dataUrl };

			myapi.post(api.baseUrl + "adjoinimg", data, function(results) { 
				assert(results.user, "i) Post req to /adjoinimg with valid cookie")
			});
		});
}());








