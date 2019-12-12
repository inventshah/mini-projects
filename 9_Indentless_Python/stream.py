# Sachin
# Get elements of an iterator one at a time, with access to the next element

class Stream:
	def __init__(self, iterator):
		self.iterator = iter(iterator)
		self.peak()

	def peak(self):
		try:
			self.next = next(self.iterator)
		except StopIteration:
			self.next = None

	def get(self):
		ret = self.next
		self.peak()
		return ret