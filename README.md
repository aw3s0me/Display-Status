Kitcube-Status
===============

One page display to summarize the status of KIT CUBE

## Getting Started

```sh
$ sudo apt-get install git
$ git clone https://github.com/KIT-IPE/Kitcube-Status.git
$ cd Kitcube-Status
$ sudo apt-get install python-virtualenv
$ virtualenv ~/.virtualenv/kitcube
$ source ~/.virtualenv/kitcube/bin/activate
(kitcube)$ pip install -r requirements.txt
(kitcube)$ cd kitcube
(kitcube)$ python manage.py runserver
```

Now you should see a success page.

Before getting started, it's best to work on the develop branch.

```sh
$ git fetch origin
$ git checkout -b develop origin/develop
```

Now you're at develop branch. To double check this, you can:

```sh
$ git branch
```

You should see that you're currently at develop branch.

#### Virtualenvwrapper

Till now, if you want to work on your project, you will need to 

```sh
$ source ~/.virtualenv/kitcube/bin/activate
```

There's a tool that simplify this, called virtualenvwrapper

```sh
$ pip install virtualenvwrapper
```

Add the following in your bashrc file

```sh
$ source /usr/bin/virtualenvwrapper.sh
```

Relaunch your console, so that it will source properly. Now you can create a new virtual environment by

```sh
$ mkvirtualenv kitcube
```

Next time you can just run the following command to enter your virtualenv.

```sh
$ workon kitcube
```

## Bower

Package manager for control front-end packages

1) Install npm:

2) Install node js (do not forget about version of OpenSUSE.)

```sh
```

```sh
$sudo zypper ar http://download.opensuse.org/repositories/devel:/languages:/nodejs/openSUSE_13.1/ NodeJSBuildService 
$sudo zypper in nodejs nodejs-devel
```
3) Install bower

```sh
npm install -g bower
```
###Installing library with bower

1) Find library in terminal

```sh
bower search [<name>]
```
2)  open/create component.json file in main js folder 

```sh
#Basic structure of component.json
{
  "name": "Name of your project",
  "version": "Version of your project",
  "dependencies" : {
    "vendor_lib_name1" : version1,
    "vendor_lib_name2" : version2
  }
}

#Kitcube example for installation of jquery
{
  "name": "Kitcube status",
  "version": "0.0.1",
  "dependencies" : {
    "jquery" : null //null to install latest version (1.9 to install 1.9 version),
    "vendor_lib_name" :
  }
}

```
3) cd to folder where lies your component.json

```sh
bower install
```
5) No 5 step, sorry. 

###Configuration of bower

1) CAUTION. WILL BE HARD TO MERGE. If you wanna to configure bower (Installation path etc, just create .bowerrc file in one folder with)

```sh
touch .bowerrc
```
2) Put configuration like:

```sh
{
	"directory" : "scripts/vendor"
}
```
###Installation of the new version

1) Just do again bower install with null parameter in component.json

###Removing of library

1) In terminal

```sh
bower uninstall <package-name>
```

##Backbone-Require.js

###Why to use:
some sort of #include/import/require (if you like C, python style)
ability to load nested dependencies (jquery ui won't work without jquery)
ease of use for developer but then backed by an optimization tool that helps deployment

###Installation

1) Search repo by using bower search

```sh
bower search require.js
bower search backbone-amd
```
2) Put needed name into component.json, like:
```sh
requirejs: null,
backbone-amd: null //do not forget about amd version. To support asynchronous downloading it should be with -amd
```
3) bower install

4) structure of js folders should be like:

```sh
/* File Structure
├── imgs
├── css
│   └── style.css
├── templates
│   ├── projects
│   │   ├── list.html
│   │   └── edit.html
│   └── users
│       ├── list.html
│       └── edit.html
├── js
├──── build //files for configuration of building js files
├─────── dist  //folder for all minified files. 1 main file is called main.js (contatins all info)
├─────tests //test files
├─────scripts
│	├─ vendor //Vendor libraries. Here we put installed libraries with bower
│       ├──  jquery
│       │     ├── jquery.min.js
│       ├──  backbone
│       │     ├── backbone.min.js
│       ├──  underscore
│       │     ├── underscore.min.js
│       ├── dev // for our created libs
│	│    myParser
│	│     ├── myparser.js
│	│    myLib
│       ├── models
│   	│   ├── users.js
│      	│   └── projects.js
│       ├── collections
│       │    ├── users.js
│       │    └── projects.js
│   	├── views
│      	│   ├── projects
│       │   │     ├── list.js
│       │   │     └── edit.js
│   	│   └── users
│       │  	  ├── list.js
│       │         └── edit.js
│       ├── router.js //Router file. Do url routing
│       ├── app.js //Create application object here
│       ├── main.js  // Bootstrap. Just template for creating modules
│       ├── order.js //Require.js plugin
│       └── text.js  //Require.js plugin
└── index.html

```
5) main.js should contatin information about paths and dependencies order, like:

```sh
require.config({
  paths: {
  	"jquery": "vendor/jquery/jquery.min", //DO NOT SPECIFY EXTENSION 
    	"jqueryui": "vendor/jquery-ui/ui/jquery-ui", //Don't forget to comment your parts
    	//MVC part
    	"underscore": "vendor/underscore-amd/underscore",
    	"backbone": "vendor/backbone-amd/backbone"
  },
  shim: { //json object to set dependency order
  	backbone: {
      		deps: [
        		'underscore',
        		'jquery'
      		],
      	exports: 'Backbone'
  	},
  	jqueryui: { //if jqueryui dependent of jquery, download it firstly
		deps: [
        		'jquery'
      		]
	}
  }
```

6) app.js just to initialize router and do $(document).ready stuff

```sh
define([
  'jquery',
  'underscore',
  'backbone',
  router
], function($, _, Backbone, Router) {
	var initialize = function() {
		Router.initialize();
		$(document).ready(funnction($) {
		
		};
	}
	return {
		initialize: initialize
	};
});
```



