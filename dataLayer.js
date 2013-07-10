


var dataLayer = (function() {
	/** @private */
	var _private = {
		/* setting up global in the elements is not necessary, added for example purposes */
		"isReady": { "global": false },
		"layer": { "global": {} },
		"model": { "global": {} },
		"state": { "global": [] },
		"currentState": { "global": 0 },
		"subscriptions": { "global": {} },
		"privacy": { /* TBD */ },
		"set": function(targetLayer, targetID, targetValue, targetPrivacy, targetLayerID) {
			//creates a targetLayer object & targetLayer branches
			//sets values
			var c = targetID.split('.'),
				tModel = _private.model[targetLayerID];

			for (var i = 0; i < c.length; i++) {
				if (!targetLayer[c[i]]) {
					targetLayer[c[i]] = {};
					tModel[c[i]] = {};
				}
				if (i === c.length - 1) {
					targetLayer[c[i]] = {
						"value": targetValue,
						"privacy": targetPrivacy
					}
				}
				targetLayer = targetLayer[c[i]];
				tModel = tModel[c[i]];
			}

			return;
		},
		"publish": function(dataID, dataValue, privacyType, layerID) {
			//allows publishing dataLayer changes (a.k.a., set, setter, etc.)
			//dataID - Data of Interest (String, Required)
			//dataValue - Value associated with dataID (Various, Required)
			//privacyType - Used to check tools against whitelist (String, Optional, Defaults to all)
			//layerID - If multiple data layers exist on the page (String, Optional, Defaults to global)

			//If there is not a dataID or dataValue there is not anything to publish
			if (typeof(dataID) !== 'string' || typeof(dataValue) === 'undefined') {
				return false;
			}

			privacyType = privacyType || 'default';
			layerID = layerID || 'global';

			if (!_private.layer[layerID]) {
				_private.layer[layerID] = {};
				_private.model[layerID] = {};
				_private.isReady[layerID] = false;
				_private.state[layerID] = [];
				_privare.currentState[layerID] = 0;
			}

			_private.set(_private.layer[layerID], dataID, dataValue, privacyType, layerID)

			if ( !! _private.isReady[layerID]) {
				if (_private.subscriptions[layerID][dataID] && _private.subscriptions[layerID][dataID].length > 1) {
					for (var i = 0; i < _private.subscriptions[layerID][dataID].length; i++) {

						/* do privacy check here */

						/* do a chain check here */

						_private.subscriptions[layerID][dataID][i].toolMethod(dataValue);
					}
				}
			}
			return;
		},
		"subscribe": function(dataID, toolDomain, toolMethod, previousPubs, layerID, chain) {
			//Allows various analytics tools to listen for old & future dataLayer changes
			//dataID - Data of Interest (String)
			//toolDomain - Tool domain for privacy purposes (String)
			//toolMethod - Tool Callback which receives Data (function)
			//previousPubs - Optional to receive any data previously published (bool, false if omitted)
			//layerID - If multiple data layers exist on the page (String, Optional, Defaults to global)
			//chain - Prohibits toolMethod from firing unless all chained values exist
			//chain cont'd - (Array of dataIDs, Optional, false if omitted)

			//If there is not a dataID or toolMethod is ommited, we cannot publish, so escape.
			if (typeof(dataID) !== 'string' || typeof(toolMethod) === 'undefined') {
				return false;
			}

			toolDomain = toolDomain || 'default';
			previousPubs = previousPubs || false;
			layerID = layerID || 'global';
			chain = chain || false;

			/* check if previously subcribed */

			if (!_private.subscriptions[layerID]) {
				_private.subscriptions[layerID] = {};
			}
			if (!_private.subscriptions[layerID][dataID]) {
				_private.subscriptions[layerID][dataID] = [];
			}

			_private.subscriptions[layerID][dataID].push({
				"toolDomain": toolDomain,
				"toolMethod": toolMethod,
				"previousPubs": previousPubs,
				"chain": chain
			})

		},
		"unsubscribe": function(dataID, toolDomain, layerID) {
			//cannot unsubscribe unidentified subscriptions
			if (typeof(dataID) !== 'string' || typeof(toolDomain) === 'undefined') {
				return false;
			}
			layerID = layerID || 'global';

			var a = _private.subscriptions[layerID][dataID],
				i = a.indexOf(toolDomain);

			a.splice(i, 1);

			return;
		},
		"get": function(dataID, toolDomain, layerID) {
			//Simple getter function for one time value retrieval
			//dataID - Data of Interest (String)
			//toolDomain - Tool domain for privacy purposes (String)
			//layerID - If multiple data layers exist on the page (String, Optional, Defaults to global)


			//If there is not a dataID there is nothing to get
			if (typeof(dataID) !== 'string') {
				return false;
			}

			toolDomain = toolDomain || 'default',
			layerID = layerID || 'global';
			//instead of global, we might get all matches if multiple data layers

			var dataObj = (function(a, b) {
				var c = a.split('.');

				for (var i = 0; i < c.length; i++) {
					b = b[c[i]];
				}
				return b;
			}(dataID, _private.layer[layerID]))

			/* privacy check here before returning value */

			return dataObj.value;

		},
		"ready": function(layerID) {
			//Called after initial setup of layer to avoid partial layer objects in state array
			//layerID - If multiple data layers exist on the page (String, Optional, Defaults to global)
			layerID = layerID || 'global';
			if (!_private.isReady[layerID]) {
				//publish all
			}
			_private.isReady[layerID] = true;
			return true;
		}
	},
		_public = {
			/** 
			 * contains defined subscriptions by dataLayerID
			 * @member {Object} subscriptions 
			 */
			"subscriptions": _private.subscriptions, //keep public
			/** 
			 * contains model of dataLayer objects
			 * @member {Object} model 
			 */
			"model": _private.model, //keep public
			/**
			 * define, update, and publish data layer changes.
			 * @param {string} dataID - Data of Interest 
			 * @param {object} dataValue - Value associated with dataID 
			 * @param {string} [privacyType=default] - Used to check tools against whitelist 
			 * @param {layerID} [layerID=global] - If multiple data layers exist on the page 
			 * @returns {boolean} success indicator
			 * @function publish
	 		*/
			"publish": function(dataID, dataValue, privacyType, layerID) {
				return _private.publish(dataID, dataValue, privacyType, layerID);
			},
			/**
			 * Allows various analytics tools to listen for old & future dataLayer changes
			 * @param {string} dataID - Data of Interest 
			 * @param {string} toolDomain - Tool domain for privacy purposes
			 * @param {function} toolMethod - Tool Callback which receives Data 
			 * @param {boolean} [previousPubs=false] - Optional to receive any data previously published 
			 * @param {layerID} [layerID=global] - If multiple data layers exist on the page 
			 * @param {array} [chain] - Prohibits toolMethod from firing unless all chained values exist
			 * @returns {boolean} success indicator
			 * @function subscribe
	 		*/
			"subscribe": function(dataID, toolDomain, toolMethod, previousPubs, layerID) {
				return _private.subscribe(dataID, toolDomain, toolMethod, previousPubs, layerID);
			},
			/**
			 * Removes a subscription to a specific dataID
			 * @param {string} dataID - Data of Interest 
			 * @param {string} toolDomain - Tool domain for privacy purposes
			 * @param {layerID} [layerID=global] - If multiple data layers exist on the page 
			 * @returns {boolean} success indicator
			 * @function unsubscribe
	 		*/
			"unsubscribe": function(dataID, toolDomain, layerID) {
				/*
		         * TBD
			     * return _private.unsubscribe(dataID, toolDomain, layerID);
			     */
			},
			/**
			 * Simple getter function for one time value retrieval
			 * @param {string} dataID - Data of Interest 
			 * @param {string} toolDomain - Tool domain for privacy purposes
			 * @param {layerID} [layerID=global] - If multiple data layers exist on the page 
			 * @returns {object} returns matching value from specified dataLayer
			 * @function get
	 		*/
			"get": function(dataID, toolDomain, layerID) {
				return _private.get(dataID, toolDomain, layerID);
			},
			/**
			 * Called after initial setup of layer to avoid partial layer objects in state array
			 * @param {layerID} [layerID=all] - If multiple data layers exist on the page 
			 * @returns {boolean} success indicator
			 * @function ready
	 		*/
			"ready": function(layerID) {
				return _private.ready(layerID);
			}
		};
	return _public;
})();
