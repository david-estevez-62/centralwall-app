

	var wallAdditions,
			loginState;
	          



	// Set up fixtures to replicate the frontend applications dom
	function setUpHTMLFixture() {

	   setFixtures("<div id='toolbar'><input type='button' onclick='submitAdditions()'>" + 
	   						 "<div id='refreshBtn' onclick='startDraftFromScratch()'></div></div>" +

	               "<div id='draftLayer'></div>" +


	               "<div id='loginBlock' class='hide'><span class='active' onclick='loginType()'>login</span>" + 
	               "<span onclick='loginType()'>signup</span><form id='loginForm' onsubmit='postLoginForm(event)'></form></div>" +


	               "<div id='overlay' onclick='exitLoginState()' class='hide'></div><a href='#!'class='authLink' onclick='enterLoginModal()'></a>" +


	               "<div id='nav'><span class='active'>wall</span></div>"

	              )
	}


 



  describe("DOM manipulation and frontend tests", function() { 


		    describe("Toolbar input type btn click event", function() {
		      beforeEach(function() {
			        setUpHTMLFixture();

		          $("#draftLayer").append("<div>");
		          $("#toolbar [type=button]").trigger("click");
		      });
		      
		      it ("DraftLayer div should contain a div element and wallAdditions variable should exist", function() {
			        // The editable element (#draftLayer) has no children elements at the start but that is
			        // no longer the case after we just appended one to it. We did this because the 
			        // click handler first checks if the editable element (#draftLayer) contains any 
			        // child elements before running its specific code associated with the case when 
			        // child elements exist. We check to see if we get in the condition by changing 
			        // a global variable indicating the code ran, in the actual application the domtoimg api 
			        // would be run here
			        expect($("#draftLayer")).toContainElement("div");
			        expect(wallAdditions).toBeTruthy();
		      });
		    });



		    describe("Login or signup form switch click event", function() {
		      beforeEach(function() {
			        setUpHTMLFixture();

			        $($("#loginBlock span")[1]).trigger("click");
		      });
		      
		      it ("The active class should be switched from the default login span and added to the signin span", function() {
		          // The active class should be removed from the first span, in the node with
		          // #loginBlock, which is the one that starts by default having the active 
		          // class. And added to its sibling span which is the second span in #loginBlock
		          expect(($("#loginBlock span")[0]).className).toBe("");
		          expect(($("#loginBlock span")[1]).className).toBe("active");
		      });
		    });



		    describe("Link for login modal click event", function() {
		      beforeEach(function() {
			        setUpHTMLFixture();

			        $(".authLink").trigger("click");
		      });
		      
		      it ("Elements loginBlock and overlay should have their class of hide removed", function() {
		          // These two elements would have the hide class to start out by
		          // default however after clicking the link with class authLink we 
		          // should see that the class on both elements have been removed
		          expect(($("#loginBlock")[0]).className).toBe("");
		          expect(($("#overlay")[0]).className).toBe("");
		      });
		    });


		    describe("Exit Login form modal view", function() {
		      beforeEach(function() {
			        setUpHTMLFixture();
			        // Remove the class of hide from the loginBlock and the overlay div, to
			        // see if the exitLoginState function adds them right back
			        $("#loginBlock").removeClass("hide");
			      	$("#overlay").removeClass("hide");

			        $("#overlay").trigger("click");
		      });
		      
		      it ("Overlay div click event should add the hide class back to the loginBlock and itself", function() {
			        // Check to see if the hide class exists on the loginBlock and overlay as we
			        // expect, this function in the application is responsible for effectively 
			        // removing the login modal view
			        expect(($("#loginBlock")[0]).className).toBe("hide");
			        expect(($("#overlay")[0]).className).toBe("hide");
		      });
		    });



		    describe("Toolbar refresh btn click event", function() {
		      beforeEach(function() {
		        	setUpHTMLFixture();

		        	$("#draftLayer").append("<div>");
			        $("#toolbar #refreshBtn").trigger("click");
		      });
		      
		      it ("Toolbar refresh btn click event", function() {
		      		// The draftLayer should exist, even though we removed it in the event handler
		      		// we added it right back
	          	expect(($("#draftLayer")[0])).toBeTruthy();
	          	// The child element added in the precondition should not exist because we removed
	          	// the original draftLayer it was attached to and created a different draftLayer 
	          	// from scratch
	          	expect(($("#draftLayer")[0]).firstChild).toBeNull();
		      });
		    });


		    describe("Login Modal form submit", function() {
		      beforeEach(function() {
		        	setUpHTMLFixture();

		          $("#loginBlock #loginForm").trigger("submit");
		      });
		      
		      it ("loginState is the element having the current active class it should be the same element as the first span in #loginBlock that by default starts with the active class", function() { 
		          expect(loginState).toBe($("#loginBlock span")[0]);
		      });
		    });



		    describe("Reset to original guest (non-edit) state", function() {
		      beforeEach(function() {
			        setUpHTMLFixture();

			        $("#nav span").removeClass("active");
			        // Remove the class of hide from the loginBlock and the overlay div, the
			        // resetState function should add them right back
			        $("#loginBlock").removeClass("hide");
			      	$("#overlay").removeClass("hide");

			        resetState()
		      });
		      
		      it ("The resetState should remove the draftLayer div and hide the login modal if being displayed", function() {
							expect(($("#nav span")[0]).className).toBe("active");
							expect(($("#loginBlock")[0]).className).toBe("hide");
		          expect(($("#overlay")[0]).className).toBe("hide");
		          expect(($("#toolbar")[0]).className).toBe("hide");

		          expect(($("#draftLayer")[0])).toBeUndefined();
				  });
		    });



  });







    function submitAdditions(){
      if($("#draftLayer")[0].firstChild){
	        // Set a global variable to a fixed value that we will use to indicate if we made
	        // it in the condition. In the actual application the domtoimg api that creates 
	        // a dataUrl from a given element would run here
	        wallAdditions = true;
      }
    }
  


    function loginType(){
	    if(!($($("#loginBlock span")[1]).hasClass("active"))) {
		      $("#loginBlock .active").removeClass("active");
		      $($("#loginBlock span")[1]).addClass("active");
	    }
    }



    function enterLoginModal(){
		    $("#loginBlock").removeClass("hide");
		    $("#overlay").removeClass("hide");
    }



    function exitLoginState(){
	      $("#loginBlock").addClass("hide");
	      $("#overlay").addClass("hide");

	      $("#loginBlock .active").removeClass("active");
	      $("#loginBlock span:first-child").addClass("active");
    }



    function startDraftFromScratch() {
    	if($("#draftLayer")[0].firstChild){
	    		$("#draftLayer").remove();
	  			// It doesn't matter where we append the editable element (#draftLayer) because we 
	  			// just check if an element having the id draftLayer exists in the tests we run, and 
	  			// it won't be displayed. The id draftLayer should exist when we got to do our test
	  			// because even though we remove the element we add it right back after
	  			$("#overlay").append("<div id='draftLayer'></div>");
    	}
    }



    function postLoginForm(e) {
	    	e.preventDefault();

	    	loginState = $("#loginBlock").find(".active")[0];
    }



    function resetState(){
		  	$("#nav span").addClass("active");

	      $("#loginBlock").addClass("hide");
	      $("#overlay").addClass("hide");

	      $("#toolbar").addClass("hide");

	      $("#draftLayer").remove();
    }
