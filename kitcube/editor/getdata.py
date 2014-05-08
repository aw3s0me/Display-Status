from threading import Timer
import thread, time, sys

def timeout():
    thread.interrupt_main()


def startTimeout():
	try:
		Timer(0.5, timeout).start()
		cache.get(stuff)
	except:
		print "Timer exception"