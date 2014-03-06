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
$ export WORKON_HOME=~/Envs
$ mkdir -p $WORKON_HOME
$ source /usr/bin/virtualenvwrapper.sh
```

Now you can create a new virtual environment by

```sh
$ mkvirtualenv kitcube
```
add the following in your bashrc file

```sh
$ source /usr/bin/virtualenvwrapper.sh
```

Next time you can just run the following command to enter your virtualenv.

```sh
$ workon kitcube
```
