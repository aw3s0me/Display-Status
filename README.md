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



