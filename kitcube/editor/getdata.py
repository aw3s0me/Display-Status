from threading import Timer
import thread, time, sys
import requests

KATRIN_BASE = 'http://katrin.kit.edu/adei/services/getdata.php'
KITCUBE_BASE = 'http://kitcube.kit.edu/adei/services/getdata.php?db_server='
PARAMS_TO_SEND = {'db_server' : '', 'db_name' : '', 'db_group': '', 'db_mask': '', 'window': '-1'}

"""
def timeout():
    thread.interrupt_main()


def startTimeout():
	try:
		Timer(0.5, timeout).start()
		cache.get(stuff)
	except:
		print "Timer exception"
"""
#'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + this.get('server') + '&db_name=' + this.get('dbname') + '&db_group=' + this.get('dbgroup') + '&db_mask=' + this.get('mask') + '&window=-1';

def get_data(base, params_val):
	link = None
	if base === 'katrin':
		link = KATRIN_BASE
	if base === 'kitcube':
		link = KITCUBE_BASE
	else:
		return False

	params = 
    r = requests.get()