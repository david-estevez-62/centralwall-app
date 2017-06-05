

# canvas-app


### About:   A Collaborative Message board


### Installing the PreRequisites:
- Be sure NodeJs vsn 6.0 or greater is installed. The email module (Nodemailer) won't work otherwise
- Also Install Mongo
- In order to get started using Mongo with your application (after it has been downloaded) follow the following steps:
    1) mkdir -p /data/db   , to create the directory where mongo will be writing data
    ##### In order to run mongo without sudo, the permissions of the data folder created in step i. must be changed if you         would like to do this move on to step ii. (otherwise you can just launch mongo after creating the data directory with         "sudo mongod" and move on to the "How to get started" section)
    2) "cd /"   , navigate to the root directory of your machine (or the directory where you created the data directory if 
    other than the root directory)
    3) "open ."  , running this command opens spotlight after navigating to the folder where the data directory is (done in       step 2)
    4) right click on the "data" folder created in step 1 and select "get info" option (a pop up window should appear at this     point)
    5) At the bottom of the window that should have appeared (in step 4) change privileges for all users to "READ & WRITE"       then click the gear also at the bottom of that same window and select "Apply to enclosed items"
    6) Now mongo can be run using "mongod" instead of "sudo mongod"
    
### How to get started:
  1) clone the project from github (git clone https://github.com/ehruska/centralwall-app.git)
  2) cd centralwall-app (navigate to the newly cloned directory)
  3) cd api (navigate to the api directory where the backend application is located)
  4) In same terminal (1st terminal tab) run "npm install" (to install the needed packages for the project)
  5) (In same terminal) run "node server.js" (start and run the node server, backend application)
  6) 2nd terminal tab) start mongo (with "mongod" if you followed the instructions above otherwise "sudo mongod")
  7) 3rd terminal tab) navigate back a directory ("cd ..") and then into the "web" directory at the root level of the project ("cd web")
  8) Once done (still in 3rd terminal tab) run "python -m SimpleHTTPServer xxxx" (replace the xxxx with a port of your choosing)
  9) After starting up a local server for the frontend application in step 8, leave running, and navigate to http://localhost:xxxx (in a browser, remember to use the same port number that was chosen in step 8)
  
 (Note: line breaks in the code snippet below mean the code should be run in a new terminal tab. Also same as above. The       code snippet is the same as the "How to get started" section. However Step 9 is not included in the code snippet below because it is not code to be run in the terminal so if following the code snippet below remember after finishing those steps to navigate to http://localhost:xxxx in a browser to see the frontend application being displayed )
```
git clone https://github.com/ehruska/centralwall-app.git
cd centralwall-app
cd api
npm install
node server.js

sudo mongod

cd ..
cd web
python -m SimpleHTTPServer xxxx
```

### How to run the tests
To run the tests make sure the tabs running the node server ("node server.js") and the tab running mongo ("mongod")
remain running. After having created a user or two in the client application and confirming the email verification of said user. Open the test.html file in the tests folder within the api directory in a browser and the tests should be run. Note Test d) which tests the route /adjoinimg will create a new img every time the tests are run, you can see the imgs being created if you have open the public/img/uploads directory as you reload the page. To test the DOM changes and event listeners open the dom-test.html file in the tests folder within the api directory in a browser and the dom tests should be run


