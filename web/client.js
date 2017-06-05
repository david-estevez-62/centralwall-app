var smallerScreenDimen,
  leftButtonDown,
  lastWidthDimen,
  loginUserModel,
  scaleClose;   

   // make this the first file after external libraries so it boots the page and initial 
   // background images for the canvas wallpaper from the backend and determines if the user
   // should be logged in so the angular views will get applied accordlingly and quicker
	 var app = angular.module("startupModule", ["ngCookies"])
    					 .controller("initController", function($scope, $http, $cookies ){


                  var vm = this;




                  // request to ask for initial images to start with on the canvas and if logged in
                  $http({
                          method: "POST",
                          url: api.baseUrl + "bootstrapclient",
                          data: "cookie=" + ($cookies.get("session.id") || ""), // If no session cookie exists default to empty str
                          headers: {"Content-Type": "application/x-www-form-urlencoded"}
                      }).then(function(response) {
                          // Give access to secured user views if the cookie is not expired and is associated with a user in the 
                          // database, lastly we check for on client if said user's account is verified. This is to determine who 
                          // still has a not-yet expired, valid cookie and should be signed-in at the start. Could have had 
                          // other conditions here for invalid or expired cookies and empty those cookies out but it is not needed, 
                          // clients having one of these cookies just won't be given access and will get their invalid cookie 
                          // overwritten if they ever choose to log in
                          if (response.data.user && response.data.user.verified){
                              vm.usr = response.data.user;
                              $scope.usr = response.data.user;
                          }

                          // attach the images in the case of any response
                          vm.imgs = response.data.imgs;
                      });




                  // This function will only be executed if the user is logged in because the elements having this function attached 
                  // are only viewable for logged in users. It allows for switching between the original guest (non-edit) and user (edit) 
                  // state
    						 	this.selectState = function($event, state){

    						 		var modeEl = $event.currentTarget;

    						 		if(!modeEl.className){
                      state === "nonedit" ?  $($("#nav span")[2]).removeClass("active") : $($("#nav span")[1]).removeClass("active");
                      $(modeEl).addClass("active");


    						 			if(state === "nonedit"){
                        // Check to see if there are children elements attached to the editable div, if so trap the user and 
                        // inform them of their options. Click "ok" to keep the work alternatively "cancel" to continue anyway 
                        // and lose the work
    						 				if($("#draftLayer")[0].firstChild && confirm("You have unsaved work. Click the Ok button to keep your work.\n" + 
    													 "Or cancel to continue anyway and lose your unsaved work")){
    											$($("#nav span")[2]).addClass("active");
    											$(modeEl).removeClass("active");
    											return;
    										}

                        // force the background (canvas element) holding all the pictures to show when navigating back to the 
                        // guest (non-edit) state if previously hidden
                        if(this.bkgrdHidden){  
                            this.bkgrdHidden = false; 
                        }

                        // Remove event listeners that are only needed when in edit state. Will add them back when switching to 
                        // edit state
    										$("#draftLayer").remove();
                        $("#toolbar").addClass("hide");
    

    										$(document).off("mousedown");
    										$(document).off("mouseup");

    										// Request new pictures from backend when navigating to the original guest (non-edit) state
    										getNewCanvas()
    						 			}else{
    						 				$("#backSetting").after("<div id='draftLayer'>");
                        $("#toolbar").removeClass("hide");

    										// Set the dimensions of the newly created draftLayer div to be the same dimensions of the 
                        // #backSetting div that holds the static canvas so it is essentially an identical div stacked above
    										$("#draftLayer").css({ width: $("#backSetting").width(), height: $("#backSetting").height() });

    										
    										// Add the listeners needed for the edit state, including the mousemove and drag listeners on the edit div itself
    										addEditStateEvents();
    									 	$(document).on("mousedown", function(event){
    									 		if(event.which === 1){
    									 			leftButtonDown = true;
    									 		}else if(event.button === 0){
    									 			leftButtonDown = true;
    									 		}
    										});
    										$(document).on("mouseup", function(event){
    										  if(event.which === 1){
    									 			leftButtonDown = false;
    									 		}else if(event.button === 0){
    									 			leftButtonDown = false;
    									 		}
    										});
    						 			}
    						 			
    						 		}
    						 	}






                  $("#toolbar [type=button]").on("click", function(event){

                      // Conditional on whether the #draftLayer (editable) div contains any child elements and the user acknowledging 
                      // they are done, post the additions made to the canvas
                      if($("#draftLayer")[0].firstChild && confirm("Are you sure you are finished? If so we will upload your work and provide you with a blank slate")){

                        var node = document.getElementById("draftLayer");

                        
                        $("#draftLayer").css({
                              left: "0",
                              top: "0",
                              marginTop:"0",
                              transform: "translate(0,0)"
                            });

                        // Copy the dom node (#draftLayer) as a base64 url
                        domtoimage.toPng(node)
                          .then(function (dataUrl) {

                            // post the data url that was created by the domtoimage api
                            $.ajax({
                                method: "POST",
                                url: api.baseUrl + "adjoinimg",
                                data: { dataUrl: dataUrl, cookie: ($cookies.get("session.id") || "") }, // If no session cookie exists default to empty str
                                success: function(resp){
                                    // If the cookie that was part of the data posted is invalid, or expired, Or the cookie is associated 
                                    // with an account that is not verified their additions will not be added to the canvas. This client should
                                    // not have access to the secured views which include the button that is associated with running this 
                                    // function and some how had access to it. Remove contents of the user property of the angular model which will 
                                    // effectively hide the secured views
                                    if( (resp.notformat || resp.expired || (resp.user && !resp.user.verified)) ){
                                        vm.usr = "";
                                        $scope.usr = "";
                                    }

                                    // Dont need to specify an else case here because the only alternate possibility is that the user 
                                    // and their cookie was valid and in the backend in that situation we will have successfuly 
                                    // turned their work into an image to add to the rest of the canvas. In any case the view will 
                                    // be reset to the original un-editable canvas view so this shared functionality can be placed outside 
                                    // any condition

                                    // switch back to original guest (non-edit) state and request updated images since last requested
                                    resetState();
                                    getNewCanvas();

                                    // force the background (canvas element) holding all the pictures to show when navigating 
                                    // back to the guest (non-edit) state if previously hidden
                                    if(vm.bkgrdHidden){
                                        vm.bkgrdHidden = false; 
                                    }


                                }
                            })


                          })
                          .catch(function (error) {
                            // Give the user another chance to submit their unsaved work (do nothing here) which otherwise would not 
                            // be possible if the state was reset here, because resetting the state removes the editable div and therefore 
                            // any child elements that were added by the user (which represents the current unsaved work)
                          });
                      }

                  });






                  $(".authLink").on("click", function(event){
                      event.preventDefault();

                      // If a usr property on the angular $scope variable exists that means the client is signed in so clicking
                      // the element with the class of authLink will change out the html for the login div to a signout button
                      if($scope.usr) {
                        $("#loginBlock").html("<a href='#!'>signout</a>");
                      }

                      $("#loginBlock").removeClass("hide");
                      $("#overlay").removeClass("hide");

                  });






                  $("#loginBlock").delegate("#loginForm", "submit", function(event) {
                      event.preventDefault();

                      // Clear the img request interval temporarily to prevent further requests from occuring while
                      // submitting the form
                      clearInterval(getPrintInterval);

                      // Get the state that has the current active class, we will use this to determine whether
                      // Login or Signup is selected if its the first span the form will submit to the signin route
                      var state = $(this).closest("#loginBlock").find(".active");



                      var url = state[0] === $("#loginBlock span")[0] ? "signin" : "signup";



                      $http({
                            method: "POST",
                            url: api.baseUrl + url,
                            data: "username=" + $(this).find("[type=email]").val()+ "&password=" + $(this).find("[type=password]").val(),
                            headers: {"Content-Type": "application/x-www-form-urlencoded" }
                          }).then(function(results) {
                              var content = results.data;

                              // All cases an info property will exist when a user property doesn't hence that is the else if no user property exists.
                              // If the user property exists then the credentials have been verified and access to the edit state view can be
                              // given
                              if(content.user){
                                vm.usr = content.user;
                                $scope.usr = content.user;

                                // If there was a previously existing err info tip remove it because if in here they have been authorized
                                vm.info = ""

                                $cookies.put("session.id", content.user.id);
                              }else{

                                vm.info = content.info;

                              }


                              $("#loginForm [type=email]").val("");
                              $("#loginForm [type=password]").val("");

                              // Add the img request interval back that was removed at start of submit handler
                              getPrintInterval = window.setInterval(getNewCanvas, 15000);
                          });



                      exitLoginState();

                  });






                  // If it is a link and it is inside the loginBlock (div) we know the link is for the
                  // signout route so instead just handle it on the client at which point there will be no
                  // need to specify and handle the /signout route in the backend
                  $("#loginBlock").on("click", "a", function(event) {
                      event.preventDefault();

                      // Empty out the cookie that was previously valid effectively signing out the user
                      $cookies.put("session.id", "");

                      
                      $scope.$apply(function() { 
                            vm.usr = "";
                        $scope.usr = "";

                        if(vm.bkgrdHidden){
                            vm.bkgrdHidden = false; 
                        }

                      });


                      resetState();

                  });








                  function getNewCanvas() {

                      $http({
                          method: "POST",
                          url: api.baseUrl + "staticpics",
                          data: "cookie=" + ($cookies.get("session.id") || ""), // If no session cookie exists default to empty str 
                          headers: {"Content-Type": "application/x-www-form-urlencoded"}
                      }).then(function(resp) {

                            var respImgs = resp.data.imgs;
                            // Get the last image currently attached to the canvas element
                            var canvasLayer = $("#backSetting")[0];
                            var currLastImg = canvasLayer.children.length > 0 ? 
                                          parseInt(canvasLayer.children[canvasLayer.children.length - 1].getAttribute("src").substr(34)) : 0;




                            for(var i = 0, respImgsLen = respImgs.length, img; i < respImgsLen; i++){
                              // Start appending images when the filename is greater then the current last image
                              if(currLastImg < parseInt(respImgs[i].substr(34))){
                                vm.imgs.push(respImgs[i]);
                              }
                            }

                            // If the cookie is not valid, yet the client had access to the secured user views reset back to original state.
                            // This could happen if the user started off with a valid authenticated cookie so they originally
                            // have access to the user editable view and they either changed their cookie manually or their cookie 
                            // has since expired. Empty out the user property on the angular model to effectively remove the secured views
                            if( (resp.data.notformat || resp.data.expired || (resp.data.user && !resp.data.user.verified)) &&  $scope.usr ){
                                
    
                                    vm.usr = "";
                                    $scope.usr = "";

                                    resetState();
                                  

                            } else if( resp.data.user && resp.data.user.verified && !$scope.usr ) {
                                  vm.usr = resp.data.user;
                                  $scope.usr = resp.data.user;
                            }

                      });

                    }





                  // Copy loginBlock and store it in variable to have a reference, in case it is changed to 
                  // having the signout link and the link is clicked we need to change it back to the 
                  // loginBlock having the forms because we will need to be able to bring back the login 
                  // view when the user is no longer logged in
                  loginModel = $("#loginBlock").html();
                  

                  getPrintInterval = window.setInterval(getNewCanvas, 15000);


    					 });



                  



