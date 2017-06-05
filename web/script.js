


  $("#toolbar select").on("change", function(){
      // select element starts of on draw so if condition wont be met until it goes through cycle of text then back to draw
      if($(this).val() === "draw"){
        $(this).closest("div").prev().remove();
      }else{
        $(this).closest("div").before("<div><input type='text' id='addTextBox' draggable='true' /></div>")
      }
  });


  $("#toolbar #refreshBtn").on("click", function(){
      var frameLayer = document.getElementById("draftLayer");
      // If the element with id draftLayer (the editable layer) has any children elements, then trap the user and 
      // inform them they have unsaved work and the work is at risk of being lost if they still wish to refresh anyway
      if(frameLayer.firstChild && confirm("Are you sure you wish to refresh, you have unsaved work. Click Ok to refresh anyway")){
        // remove the editable div and add it right back instead of looping through and removing all child elements
        frameLayer.parentNode.removeChild(frameLayer);
        $("#backSetting").after("<div id='draftLayer'>");
        $("#draftLayer").css({ 
                    width: $("#backSetting").width(),
                    height: $("#backSetting").height()
                  });
        addEditStateEvents();
      }
  });


  $("#toolbar").delegate("#addTextBox", "dragstart", function(event){
      // attach the element id as data to be transfered to know which element to append when dropped over editable div
      event.originalEvent.dataTransfer.setData("text", event.target.getAttribute("id"));
      event.originalEvent.dataTransfer.dropEffect = "move";
  });



  $("#overlay").on("click", exitLoginState);


  

  $("#loginBlock").delegate("span", "click", function(){
    // Either of two elements will come back from the selector as being spans in the loginBlock we only want 
    // the span to be the opposite of the one that currently has the active class or otherwise we are not going
    // to do anything because that means the span that was clicked is the one that corresponds to the already 
    // the current state
    if(!($(this).hasClass("active"))) {
      // switch the active class to the opposite span within the loginBlock
      $("#loginBlock .active").removeClass("active");
      $(this).addClass("active");

    }

  });


  	

  // Event listeners for the edit state, these will be added and removed depending whether in edit state
  function addEditStateEvents() {

    $("#draftLayer").on("mousemove", function(event){
        // Not enough to check if mouse is moving also need to check if left mouse button is down
        if(leftButtonDown && $("#toolbar select").val() === "draw"){

           $("<div class='dot'>")
             .appendTo(this)
             .css({
            top: (event.clientY-event.target.offsetTop) + "px", 
            left: (event.clientX-(event.target.offsetLeft - (parseInt(event.target.style.width)/2))) + "px",
            background: $("#toolbar [type=color]").val()
           });
        }
    });

    $("#draftLayer").on("drop", function(event){
        event.preventDefault();
        // The info the dragged object will transfer will be its id as a string use it to attain the obj reference
        var textValue = event.originalEvent.dataTransfer.getData("text");
        var inpObjRef = document.getElementById(textValue);
        // Append the element dropped over the target element to the target itself (dropzone)
        event.target.appendChild(inpObjRef);
        // Position the element where it was dropped and remove the draggable attribute
        inpObjRef.removeAttribute("id");
        inpObjRef.removeAttribute("draggable");
        $(inpObjRef).css({
            position: "absolute",
            top: (event.clientY-event.target.offsetTop) + "px",
            left: (event.clientX-(event.target.offsetLeft - (parseInt(event.target.style.width)/2))) + "px",
            color: $("#toolbar [type=color]").val(),
            width: $(this).width - 
                 (event.clientX-(event.target.offsetLeft - (parseInt(event.target.style.width)/2))) + "px",
            outline: "none",
            border: "none"
        });

        $("#toolbar div:nth-child(3)").append("<input type='text' id='addTextBox' draggable='true' />");
    });

    $("#draftLayer").on("dragover", function(event){
        return false;
    });

  }

  
  function exitLoginState(){
    $("#loginBlock").addClass("hide");
    $("#overlay").addClass("hide");

    $("#loginBlock .active").removeClass("active");
    $("#loginBlock span:first-child").addClass("active");
  }


  function resetState(){
      $("#nav .active").removeClass("active");
      $($("#nav span")[0]).addClass("active");
      $($("#nav span")[1]).addClass("active");

      $("#loginBlock").addClass("hide");
      $("#overlay").addClass("hide");

      $("#loginBlock").html(loginModel);

      $("#draftLayer").remove();

      $("#toolbar").addClass("hide");

      if($("#toolbar select").val() === "text"){
        $("#toolbar select").closest("div").prev().remove();
        $("#toolbar select").val("draw");
      }
  }


  function tailorCanvas(){
  	// Find the smaller dimension of the clients screen
  	smallerScreenDimen = window.innerHeight < window.innerWidth ? { height: window.innerHeight } : {width: window.innerWidth};
  	// Use the smaller dimension between the height and width attained above and make canvas width 
  	// the length of the smaller dimension and the height 60% of the same length
  	if(smallerScreenDimen.height){
  		if($("#draftLayer").length){
  			$("#draftLayer").width(smallerScreenDimen.height + "px");
  			$("#draftLayer").height( (smallerScreenDimen.height * 0.6) + "px");
  		}
  		
  		$("#backSetting").width(smallerScreenDimen.height + "px");
  		$("#backSetting").height( (smallerScreenDimen.height * 0.6) + "px");
  	} else {
  		if($("#draftLayer").length){
  			$("#draftLayer").width(smallerScreenDimen.width + "px");
  			$("#draftLayer").height( (smallerScreenDimen.width * 0.6) + "px");
  		}
  		
  		$("#backSetting").width(smallerScreenDimen.width + "px");
  		$("#backSetting").height( (smallerScreenDimen.width * 0.6) + "px");
  	}

  	if($("#draftLayer .dot").length){ scaleSketch(); }
  }


  // Scale the position of the child elements of the #draftLayer div as the draftLayer itself is scaled
  function scaleSketch(){
    var dotElems = $("#draftLayer .dot");
    var textElems = $("#draftLayer [type=text]");

    if(lastWidthDimen !== parseInt($("#draftLayer").width())){
      for (var i = 0; i < dotElems.length; i++) {
        dotElems[i].style.left = (parseInt(dotElems[i].style.left)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
        dotElems[i].style.top = (parseInt(dotElems[i].style.top)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
      }

      for (var i = 0; i < textElems.length; i++) {
        textElems[i].style.left = (parseInt(textElems[i].style.left)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
        textElems[i].style.top = (parseInt(textElems[i].style.top)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
      }

      // Record the lastWidth (of the canvas) every time the smaller dimension of the screen is figured 
      // out (calculated), we will use this for scaling when having to reposition child elements of editable 
      // div after scaling
      lastWidthDimen = parseInt($("#draftLayer").width());
    }
    
  }




  // Initialize the Canvas Dimensions
  tailorCanvas();
  // Record the lastWidth (of the canvas) in this case this will aslo be the starting width, we will use this for 
  // scaling when having to reposition child elements of editable div after scaling
  lastWidthDimen = smallerScreenDimen.height ? smallerScreenDimen.height : smallerScreenDimen.width;






  // Resize event handler will also be fired on any orientation changes that typically occur on mobile (touch 
  // screens) so no need to listen for orientation change events
  $(window).on("resize", function(){
  	clearTimeout(scaleClose); 
  	scaleClose = setTimeout(tailorCanvas, 500); 
  });

  

