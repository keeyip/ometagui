var Model = function Model () {
	_.extend(this, {
		data: {},
		validators: {},
		listeners: {
			tryUpdate: { byId: {}, list: [] },
			updated: { byId: {}, list: [] },

			tryRemove: { byId: {}, list: [] },
			removed: { byId: {}, list: [] },

			tryAdd: { byId: {}, list: [] },
			added: { byId: {}, list: [] }
		}
	})
}
Model.prototype = {
	addValidator: function(pathstr, validator) {
		var validatorsForPathstr = this.validators[pathstr] || (this.validators[pathstr] = {byId:{},list:[]});
		var id = validator.modelValidatorId || (validator.modelValidatorId = _.uniqueId('modelValidatorId_'))
		if (validatorsForPathstr.byId[id]) return
		validatorsForPathstr.byId[id] = validator
		validatorsForPathstr.list.push(validator)
	},
	emit: function(eventName, eventData, eventMeta) {
		var event = {
			data: eventData,
			meta: eventMeta || {},
			prevent: false,
			halt: false
		}
		_.any(this.listeners[eventName].list, _.bind(function(listener) {
			listener(event)
			return event.halt
		}, this))
		return event
	},
	on: function(eventName, callback) {
		var id = callback.modelListenerId || (callback.modelListenerId = _.uniqueId('modelListener_'));
		if (this.listeners[eventName].byId[id]) return;
		this.listeners[eventName].byId[id] = callback
		this.listeners[eventName].list.push(callback)
	},
	get: function(pathstr) {
		var path = _.isString(pathstr) ? pathstr.split('.') : pathstr
		return _.reduce(path, function(x, key) {
			if (_.isUndefined(x[key]))
				x[key] = {}
			return x[key]
		}, this.data)
	},
	set: function(pathstr, value, meta, validate) {
		if (validate) {
			if (!this.validate({pathstr:pathstr, value:value, meta:eventMeta})) return false
		}
		var path = _.isString(pathstr) ? pathstr.split('.') : pathstr
		var key = path.pop()
		var x = this.get(path)
		x[key] = value
		return true
	},
	validate: function(validatorData) {
		var pathstr = validatorData.pathstr
		var validatorsForPathstr = this.validators[pathstr]
		if (validatorsForPathstr && validatorsForPathstr.list.length > 0) {
			if (!_.every(validatorsForPathstr.list, function(validator) {
				return validator(validatorData)
			})) return false;
		}
		return true
	},
	update: function(pathstr, newValue, eventMeta) {
		if (!this.validate({action:'update',pathstr:pathstr, value:newValue, meta:eventMeta})) return false
		var path = pathstr.split('.')
		var oldValue = this.get(path)
		if (oldValue !== newValue || _.result(eventMeta, 'force')) {
			var eventData = {
				pathstr: pathstr,
				oldValue: oldValue,
				newValue: newValue
			}
			var tryUpdateEvent = this.emit('tryUpdate', eventData, eventMeta)
			if (!tryUpdateEvent.prevent) {
				this.set(path, newValue)
				this.emit('updated', eventData, eventMeta)
				return true
			}
			return false
		} else {
			return true
		}
	},
	add: function(pathstr, newValue, eventMeta) {
		if (!this.validate({action:'add',pathstr:pathstr, value:newValue, meta:eventMeta})) return false
		var path = pathstr.split('.')
		var list = this.get(path)
		var eventData = {
			pathstr: pathstr,
			newValue: newValue,
			oldLength: list.length,
			newLength: list.length + 1
		}
		var tryAddEvent = this.emit('tryAdd', eventData, eventMeta)
		if (!tryAddEvent.prevent) {
			list.push(newValue)
			this.emit('added', eventData, eventMeta)
			return true
		}
		return false
	},
	remove: function(pathstr, index, eventMeta) {
		if (!this.validate({action:'remove',pathstr:pathstr, index:index, meta:eventMeta})) return false
		var path = pathstr.split('.')
		var list = this.get(path)
		var oldValue = list[index]
		var eventData = {
			pathstr: pathstr,
			oldValue: oldValue,
			index: index,
			oldLength: list.length,
			newLength: list.length - 1
		}
		var tryRemoveEvent = this.emit('tryRemove', eventData, eventMeta)
		if (!tryRemoveEvent.prevent) {
			list.splice(index,1)
			this.emit('removed', eventData, eventMeta)
			return true
		}
		return false
	}
}

