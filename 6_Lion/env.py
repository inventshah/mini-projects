class Env:
	def __init__(self, parent=None):
		self.parent = parent
		self.items = {}

	def get(self, name):
		if self.contains(name):
			return self.items[name]
		elif self.parent is not None:
			return self.parent.get(name)
		else:
			return None

	def set(self, name, value):
		self.items[name] = value

	def contains(self, name):
		return name in self.items