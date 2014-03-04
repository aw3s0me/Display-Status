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
