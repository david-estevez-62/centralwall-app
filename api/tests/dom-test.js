

	var wallAdditions,
			loginState;
	          



	// Set up fixtures to mimic dom
	function setUpHTMLFixture() {

   setFixtures("<div id='toolbar'><input type='button' onclick='submitAdditions()'>" + 
   						 "<div id='refreshBtn' onclick='startDraftFromScratch()'></div></div>" +

               "<div id='draftLayer'></div>" +


               "<div id='loginBlock' class='hide'><span class='active' onclick='something1()'>login</span>" + 
               "<span onclick='something1()'>signup</span><form id='loginForm' onsubmit='postLoginForm(event)'></form></div>" +


               "<div id='overlay' onclick='exitLoginState()' class='hide'></div><a href='#!'class='authLink' onclick='enterLoginModal()'></a>" +


               "<div id='nav'><span class='active'>wall</span></div>"

              )
	}


 



  describe("FRONTEND TESTS", function() { 


		    describe("Toolbar input type btn click event", function() {
		      beforeEach(function() {
		        setUpHTMLFixture();
		          $("#draftLayer").append("<div>");
		          $("#toolbar [type=button]").trigger("click");
		      });
		      
		      it ("DraftLayer div should contain a div element and textField variable should exist", function() {
		        // #draftLayer should contain the div we appended. We did this because
		        // in the click handler the #draftLayer must contain atleast 1 child
		        // element to get within the condition and run the domtoimg api 
		        expect($("#draftLayer")).toContainElement("div");
		        expect(wallAdditions).toBeTruthy();
		      });
		    });



		    describe("Login or signup form switch click event", function() {
		      beforeEach(function() {
		        setUpHTMLFixture();
		          $($("#loginBlock span")[1]).trigger("click");
		      });
		      
		      it ("The active class should be removed from the login span and added to the signin span", function() {
		        // This tests tests the switch of the active class to the default login 
		        // span as the active element to the signin span
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
		          // These two elements would  have the hide class to start out by
		          // default however after clicking the link with class authLink we 
		          // should see that the class on both elements has been removed
		          expect(($("#loginBlock")[0]).className).toBe("");
		          expect(($("#overlay")[0]).className).toBe("");
		      });
		    });


		    describe("Exit Login form modal view", function() {
		      beforeEach(function() {
		        setUpHTMLFixture();
		        // Remove the class of hide from the loginBlock and the overlay div, the
		        // exitLoginState function should add them right back
		        $("#loginBlock").removeClass("hide");
		      	$("#overlay").removeClass("hide");

		        $("#overlay").trigger("click");
		      });
		      
		      it ("Overlay div click event should add the hide class back to the loginBlock and itself", function() {
		          // The exitLoginState function should add the hide class back to the 
		          // loginBlock and overlay, this effectively removes the login modal view
		          expect(($("#loginBlock")[0]).className).toBe("hide");
		          expect(($("#overlay")[0]).className).toBe("hide");
		      });
		    });



		    describe("Toolbar refresh btn click event", function() {
		      beforeEach(function() {
		        	setUpHTMLFixture();
		        	// The toolbar refresh btn only takes affect when there is something to 
		        	// refresh meaning additions made to the draftLayer so we append a child
		        	// element to the draftLayer
		          $("#toolbar #refreshBtn").trigger("click");
		      });
		      
		      it ("Toolbar refresh btn click event", function() {
		          expect(($("#draftLayer")[0])).not.toBeUndefined();
		      });
		    });


		    describe("Login Modal form submit", function() {
		      beforeEach(function() {
		        	setUpHTMLFixture();

		          $("#loginBlock #loginForm").trigger("submit");
		      });
		      
		      it ("weg reg...", function() {
		          expect(loginState).toBe($("#loginBlock span")[0]);
		      });
		    });



		    describe("Reset to original guest (non-edit) state", function() {
		      beforeEach(function() {
		        setUpHTMLFixture();

		        $("#nav span").removeClass("active");
		        // Remove the class of hide from the loginBlock and the overlay div, the
		        // exitLoginState function should add them right back
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
        // set a global variable to a fixed value to know we got in here. In the actual 
        // application the api that creates a dataUrl from a given element would run here
        wallAdditions = true;
      }
    }
  


    function something1(){
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
  			// Append back in overlay, it doesn't matter where we append the overlay div 
  			// back to because we are just going to access the element by id and it isn't 
  			// going to be displayed. Can't attached to body element because body does not 
  			// exist
  			$("#overlay").append("#draftLayer");
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
