/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "078c85f22ffb5447ef68"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/Main.ts")(__webpack_require__.s = "./src/Main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/knockout/build/output/knockout-latest.debug.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Knockout JavaScript library v3.4.1
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function(){
var DEBUG=true;
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];
(function(factory) {
    // Support three module loading scenarios
    if (true) {
        // [1] AMD anonymous module
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object' && typeof module === 'object') {
        // [2] CommonJS/Node.js
        factory(module['exports'] || exports);  // module.exports is for Node.js
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports, amdRequire){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.4.1";

ko.exportSymbol('version', ko.version);
// For any options that may affect various areas of Knockout and aren't directly associated with data binding.
ko.options = {
    'deferUpdates': false,
    'useOnlyNativeEvents': false
};

//ko.exportSymbol('options', ko.options);   // 'options' isn't minified
ko.utils = (function () {
    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);
    var canUseSymbols = !DEBUG && typeof Symbol === 'function';

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    // For details on the pattern for changing node classes
    // see: https://github.com/knockout/knockout/issues/1597
    var cssClassNameRegex = /\S+/g;

    function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
        var addOrRemoveFn;
        if (classNames) {
            if (typeof node.classList === 'object') {
                addOrRemoveFn = node.classList[shouldHaveClass ? 'add' : 'remove'];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    addOrRemoveFn.call(node.classList, className);
                });
            } else if (typeof node.className['baseVal'] === 'string') {
                // SVG tag .classNames is an SVGAnimatedString instance
                toggleObjectClassPropertyString(node.className, 'baseVal', classNames, shouldHaveClass);
            } else {
                // node.className ought to be a string.
                toggleObjectClassPropertyString(node, 'className', classNames, shouldHaveClass);
            }
        }
    }

    function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
        // obj/prop is either a node/'className' or a SVGAnimatedString/'baseVal'.
        var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
        ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
            ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
        });
        obj[prop] = currentClassNames.join(" ");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i], i);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i], i))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index > 0) {
                array.splice(index, 1);
            }
            else if (index === 0) {
                array.shift();
            }
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i], i));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i], i))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        addOrRemoveItem: function(array, value, included) {
            var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
            if (existingEntryIndex < 0) {
                if (included)
                    array.push(value);
            } else {
                if (!included)
                    array.splice(existingEntryIndex, 1);
            }
        },

        canSetPrototype: canSetPrototype,

        extend: extend,

        setPrototypeOf: setPrototypeOf,

        setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

        objectForEach: objectForEach,

        objectMap: function(source, mapping) {
            if (!source)
                return source;
            var target = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = mapping(source[prop], prop, source);
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);
            var templateDocument = (nodesArray[0] && nodesArray[0].ownerDocument) || document;

            var container = templateDocument.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
            // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
            // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
            // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
            // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
            // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
            //
            // Rules:
            //   [A] Any leading nodes that have been removed should be ignored
            //       These most likely correspond to memoization nodes that were already removed during binding
            //       See https://github.com/knockout/knockout/pull/440
            //   [B] Any trailing nodes that have been remove should be ignored
            //       This prevents the code here from adding unrelated nodes to the array while processing rule [C]
            //       See https://github.com/knockout/knockout/pull/1903
            //   [C] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
            //       and include any nodes that have been inserted among the previous collection

            if (continuousNodeArray.length) {
                // The parent node can be a virtual element; so get the real parent node
                parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                // Rule [A]
                while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                    continuousNodeArray.splice(0, 1);

                // Rule [B]
                while (continuousNodeArray.length > 1 && continuousNodeArray[continuousNodeArray.length - 1].parentNode !== parentNode)
                    continuousNodeArray.length--;

                // Rule [C]
                if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                    // Replace with the actual new continuous node set
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                        continuousNodeArray.push(current);
                        current = current.nextSibling;
                    }
                    continuousNodeArray.push(last);
                }
            }
            return continuousNodeArray;
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (node === containedByNode)
                return true;
            if (node.nodeType === 11)
                return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
            if (containedByNode.contains)
                return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node && node != containedByNode) {
                node = node.parentNode;
            }
            return !!node;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
        },

        anyDomNodeIsAttachedToDocument: function(nodes) {
            return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        catchFunctionErrors: function (delegate) {
            return ko['onError'] ? function () {
                try {
                    return delegate.apply(this, arguments);
                } catch (e) {
                    ko['onError'] && ko['onError'](e);
                    throw e;
                }
            } : delegate;
        },

        setTimeout: function (handler, timeout) {
            return setTimeout(ko.utils.catchFunctionErrors(handler), timeout);
        },

        deferError: function (error) {
            setTimeout(function () {
                ko['onError'] && ko['onError'](error);
                throw error;
            }, 0);
        },

        registerEventHandler: function (element, eventType, handler) {
            var wrappedHandler = ko.utils.catchFunctionErrors(handler);

            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!ko.options['useOnlyNativeEvents'] && !mustUseAttachEvent && jQueryInstance) {
                jQueryInstance(element)['bind'](eventType, wrappedHandler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, wrappedHandler, false);
            else if (typeof element.attachEvent != "undefined") {
                var attachEventHandler = function (event) { wrappedHandler.call(element, event); },
                    attachEventName = "on" + eventType;
                element.attachEvent(attachEventName, attachEventHandler);

                // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                // so to avoid leaks, we have to remove them manually. See bug #856
                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    element.detachEvent(attachEventName, attachEventHandler);
                });
            } else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
            // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
            // IE doesn't change the checked state when you trigger the click event using "fireEvent".
            // In both cases, we'll use the click method instead.
            var useClickWorkaround = isClickOnCheckableElement(element, eventType);

            if (!ko.options['useOnlyNativeEvents'] && jQueryInstance && !useClickWorkaround) {
                jQueryInstance(element)['trigger'](eventType);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (useClickWorkaround && element.click) {
                element.click();
            } else if (typeof element.fireEvent != "undefined") {
                element.fireEvent("on" + eventType);
            } else {
                throw new Error("Browser doesn't support triggering events");
            }
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: toggleDomNodeCssClass,

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            // We need there to be exactly one child: a text node.
            // If there are no children, more than one, or if it's not a text node,
            // we'll clear everything and create a single text node.
            var innerTextNode = ko.virtualElements.firstChild(element);
            if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
            } else {
                innerTextNode.data = value;
            }

            ko.utils.forceRefresh(element);
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
            if (ieVersion) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        createSymbolOrString: function(identifier) {
            return canUseSymbols ? Symbol(identifier) : identifier;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (JSON && JSON.parse) // Use native parsing where available
                        return JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if (!JSON || !JSON.stringify)
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            objectForEach(params, function(key, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('utils.setTextContent', ko.utils.setTextContent);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this;
        if (arguments.length === 1) {
            return function () {
                return originalFunction.apply(object, arguments);
            };
        } else {
            var partialArgs = Array.prototype.slice.call(arguments, 1);
            return function () {
                var args = partialArgs.slice(0);
                args.push.apply(args, arguments);
                return originalFunction.apply(object, args);
            };
        }
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    function getAll(node, createIfNotFound) {
        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
        var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
        if (!hasExistingDataStore) {
            if (!createIfNotFound)
                return undefined;
            dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
            dataStore[dataStoreKey] = {};
        }
        return dataStore[dataStoreKey];
    }

    return {
        get: function (node, key) {
            var allDataForNode = getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = getAll(node, true);
            allDataForNode[key] = value;
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        },

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Erase the DOM data
        ko.utils.domData.clear(node);

        // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // Clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // Special support for jQuery here because it's so commonly used.
            // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
            // so notify it to tear down any resources associated with the node & descendants here.
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    };
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var none = [0, "", ""],
        table = [1, "<table>", "</table>"],
        tbody = [2, "<table><tbody>", "</tbody></table>"],
        tr = [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        select = [1, "<select multiple='multiple'>", "</select>"],
        lookup = {
            'thead': table,
            'tbody': table,
            'tfoot': table,
            'tr': tbody,
            'td': tr,
            'th': tr,
            'option': select,
            'optgroup': select
        },

        // This is needed for old IE if you're *not* using either jQuery or innerShiv. Doesn't affect other cases.
        mayRequireCreateElementHack = ko.utils.ieVersion <= 8;

    function getWrap(tags) {
        var m = tags.match(/^<([a-z]+)[ >]/);
        return (m && lookup[m[1]]) || none;
    }

    function simpleHtmlParse(html, documentContext) {
        documentContext || (documentContext = document);
        var windowContext = documentContext['parentWindow'] || documentContext['defaultView'] || window;

        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = documentContext.createElement("div"),
            wrap = getWrap(tags),
            depth = wrap[0];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof windowContext['innerShiv'] == "function") {
            // Note that innerShiv is deprecated in favour of html5shiv. We should consider adding
            // support for html5shiv (except if no explicit support is needed, e.g., if html5shiv
            // somehow shims the native APIs so it just works anyway)
            div.appendChild(windowContext['innerShiv'](markup));
        } else {
            if (mayRequireCreateElementHack) {
                // The document.createElement('my-element') trick to enable custom elements in IE6-8
                // only works if we assign innerHTML on an element associated with that document.
                documentContext.appendChild(div);
            }

            div.innerHTML = markup;

            if (mayRequireCreateElementHack) {
                div.parentNode.removeChild(div);
            }
        }

        // Move to the right depth
        while (depth--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html, documentContext) {
        // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html, documentContext) || []; // Ensure we always return an array and never null
        } else {
            // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
            var elems = jQueryInstance['clean']([html], documentContext);

            // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
            // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
            // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
            if (elems && elems[0]) {
                // Find the top-most parent element that's a direct child of a document fragment
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                    elem = elem.parentNode;
                // ... then detach it
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html, documentContext) {
        return jQueryInstance ?
            jQueryHtmlParse(html, documentContext) :   // As below, benefit from jQuery's optimisations where possible
            simpleHtmlParse(html, documentContext);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html, node.ownerDocument);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.tasks = (function () {
    var scheduler,
        taskQueue = [],
        taskQueueLength = 0,
        nextHandle = 1,
        nextIndexToProcess = 0;

    if (window['MutationObserver']) {
        // Chrome 27+, Firefox 14+, IE 11+, Opera 15+, Safari 6.1+
        // From https://github.com/petkaantonov/bluebird * Copyright (c) 2014 Petka Antonov * License: MIT
        scheduler = (function (callback) {
            var div = document.createElement("div");
            new MutationObserver(callback).observe(div, {attributes: true});
            return function () { div.classList.toggle("foo"); };
        })(scheduledProcess);
    } else if (document && "onreadystatechange" in document.createElement("script")) {
        // IE 6-10
        // From https://github.com/YuzuJS/setImmediate * Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola * License: MIT
        scheduler = function (callback) {
            var script = document.createElement("script");
            script.onreadystatechange = function () {
                script.onreadystatechange = null;
                document.documentElement.removeChild(script);
                script = null;
                callback();
            };
            document.documentElement.appendChild(script);
        };
    } else {
        scheduler = function (callback) {
            setTimeout(callback, 0);
        };
    }

    function processTasks() {
        if (taskQueueLength) {
            // Each mark represents the end of a logical group of tasks and the number of these groups is
            // limited to prevent unchecked recursion.
            var mark = taskQueueLength, countMarks = 0;

            // nextIndexToProcess keeps track of where we are in the queue; processTasks can be called recursively without issue
            for (var task; nextIndexToProcess < taskQueueLength; ) {
                if (task = taskQueue[nextIndexToProcess++]) {
                    if (nextIndexToProcess > mark) {
                        if (++countMarks >= 5000) {
                            nextIndexToProcess = taskQueueLength;   // skip all tasks remaining in the queue since any of them could be causing the recursion
                            ko.utils.deferError(Error("'Too much recursion' after processing " + countMarks + " task groups."));
                            break;
                        }
                        mark = taskQueueLength;
                    }
                    try {
                        task();
                    } catch (ex) {
                        ko.utils.deferError(ex);
                    }
                }
            }
        }
    }

    function scheduledProcess() {
        processTasks();

        // Reset the queue
        nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
    }

    function scheduleTaskProcessing() {
        ko.tasks['scheduler'](scheduledProcess);
    }

    var tasks = {
        'scheduler': scheduler,     // Allow overriding the scheduler

        schedule: function (func) {
            if (!taskQueueLength) {
                scheduleTaskProcessing();
            }

            taskQueue[taskQueueLength++] = func;
            return nextHandle++;
        },

        cancel: function (handle) {
            var index = handle - (nextHandle - taskQueueLength);
            if (index >= nextIndexToProcess && index < taskQueueLength) {
                taskQueue[index] = null;
            }
        },

        // For testing only: reset the queue and return the previous queue length
        'resetForTesting': function () {
            var length = taskQueueLength - nextIndexToProcess;
            nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
            return length;
        },

        runEarly: processTasks
    };

    return tasks;
})();

ko.exportSymbol('tasks', ko.tasks);
ko.exportSymbol('tasks.schedule', ko.tasks.schedule);
//ko.exportSymbol('tasks.cancel', ko.tasks.cancel);  "cancel" isn't minified
ko.exportSymbol('tasks.runEarly', ko.tasks.runEarly);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = ko.utils.setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'rateLimit': function(target, options) {
        var timeout, method, limitFunction;

        if (typeof options == 'number') {
            timeout = options;
        } else {
            timeout = options['timeout'];
            method = options['method'];
        }

        // rateLimit supersedes deferred updates
        target._deferUpdates = false;

        limitFunction = method == 'notifyWhenChangesStop' ?  debounce : throttle;
        target.limit(function(callback) {
            return limitFunction(callback, timeout);
        });
    },

    'deferred': function(target, options) {
        if (options !== true) {
            throw new Error('The \'deferred\' extender only accepts the value \'true\', because it is not supported to turn deferral off once enabled.')
        }

        if (!target._deferUpdates) {
            target._deferUpdates = true;
            target.limit(function (callback) {
                var handle;
                return function () {
                    ko.tasks.cancel(handle);
                    handle = ko.tasks.schedule(callback);
                    target['notifySubscribers'](undefined, 'dirty');
                };
            });
        }
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always" ?
            null :  // null equalityComparer means to always notify
            valuesArePrimitiveAndEqual;
    }
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
    var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
    return oldValueIsPrimitive ? (a === b) : false;
}

function throttle(callback, timeout) {
    var timeoutInstance;
    return function () {
        if (!timeoutInstance) {
            timeoutInstance = ko.utils.setTimeout(function () {
                timeoutInstance = undefined;
                callback();
            }, timeout);
        }
    };
}

function debounce(callback, timeout) {
    var timeoutInstance;
    return function () {
        clearTimeout(timeoutInstance);
        timeoutInstance = ko.utils.setTimeout(callback, timeout);
    };
}

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        ko.utils.objectForEach(requestedExtenders, function(key, value) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, value) || target;
            }
        });
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this._target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    this.isDisposed = false;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    ko.utils.setPrototypeOfOrExtend(this, ko_subscribable_fn);
    ko_subscribable_fn.init(this);
}

var defaultEvent = "change";

// Moved out of "limit" to avoid the extra closure
function limitNotifySubscribers(value, event) {
    if (!event || event === defaultEvent) {
        this._limitChange(value);
    } else if (event === 'beforeChange') {
        this._limitBeforeChange(value);
    } else {
        this._origNotifySubscribers(value, event);
    }
}

var ko_subscribable_fn = {
    init: function(instance) {
        instance._subscriptions = {};
        instance._versionNumber = 1;
    },

    subscribe: function (callback, callbackTarget, event) {
        var self = this;

        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(self, boundCallback, function () {
            ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
            if (self.afterSubscriptionRemove)
                self.afterSubscriptionRemove(event);
        });

        if (self.beforeSubscriptionAdd)
            self.beforeSubscriptionAdd(event);

        if (!self._subscriptions[event])
            self._subscriptions[event] = [];
        self._subscriptions[event].push(subscription);

        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (event === defaultEvent) {
            this.updateVersion();
        }
        if (this.hasSubscriptionsForEvent(event)) {
            try {
                ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (!subscription.isDisposed)
                        subscription.callback(valueToNotify);
                }
            } finally {
                ko.dependencyDetection.end(); // End suppressing dependency detection
            }
        }
    },

    getVersion: function () {
        return this._versionNumber;
    },

    hasChanged: function (versionToCheck) {
        return this.getVersion() !== versionToCheck;
    },

    updateVersion: function () {
        ++this._versionNumber;
    },

    limit: function(limitFunction) {
        var self = this, selfIsObservable = ko.isObservable(self),
            ignoreBeforeChange, previousValue, pendingValue, beforeChange = 'beforeChange';

        if (!self._origNotifySubscribers) {
            self._origNotifySubscribers = self["notifySubscribers"];
            self["notifySubscribers"] = limitNotifySubscribers;
        }

        var finish = limitFunction(function() {
            self._notificationIsPending = false;

            // If an observable provided a reference to itself, access it to get the latest value.
            // This allows computed observables to delay calculating their value until needed.
            if (selfIsObservable && pendingValue === self) {
                pendingValue = self();
            }
            ignoreBeforeChange = false;
            if (self.isDifferent(previousValue, pendingValue)) {
                self._origNotifySubscribers(previousValue = pendingValue);
            }
        });

        self._limitChange = function(value) {
            self._notificationIsPending = ignoreBeforeChange = true;
            pendingValue = value;
            finish();
        };
        self._limitBeforeChange = function(value) {
            if (!ignoreBeforeChange) {
                previousValue = value;
                self._origNotifySubscribers(value, beforeChange);
            }
        };
    },

    hasSubscriptionsForEvent: function(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount: function (event) {
        if (event) {
            return this._subscriptions[event] && this._subscriptions[event].length || 0;
        } else {
            var total = 0;
            ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
                if (eventName !== 'dirty')
                    total += subscriptions.length;
            });
            return total;
        }
    },

    isDifferent: function(oldValue, newValue) {
        return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
    },

    extend: applyExtenders
};

ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

// For browsers that support proto assignment, we overwrite the prototype of each
// observable instance. Since observables are functions, we need Function.prototype
// to still be in the prototype chain.
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
}

ko.subscribable['fn'] = ko_subscribable_fn;


ko.isSubscribable = function (instance) {
    return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.computedContext = ko.dependencyDetection = (function () {
    var outerFrames = [],
        currentFrame,
        lastId = 0;

    // Return a unique ID that can be assigned to an observable for dependency tracking.
    // Theoretically, you could eventually overflow the number storage size, resulting
    // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
    // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
    // take over 285 years to reach that number.
    // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
    function getId() {
        return ++lastId;
    }

    function begin(options) {
        outerFrames.push(currentFrame);
        currentFrame = options;
    }

    function end() {
        currentFrame = outerFrames.pop();
    }

    return {
        begin: begin,

        end: end,

        registerDependency: function (subscribable) {
            if (currentFrame) {
                if (!ko.isSubscribable(subscribable))
                    throw new Error("Only subscribable things can act as dependencies");
                currentFrame.callback.call(currentFrame.callbackTarget, subscribable, subscribable._id || (subscribable._id = getId()));
            }
        },

        ignore: function (callback, callbackTarget, callbackArgs) {
            try {
                begin();
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                end();
            }
        },

        getDependenciesCount: function () {
            if (currentFrame)
                return currentFrame.computed.getDependenciesCount();
        },

        isInitial: function() {
            if (currentFrame)
                return currentFrame.isInitial;
        }
    };
})();

ko.exportSymbol('computedContext', ko.computedContext);
ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);

ko.exportSymbol('ignoreDependencies', ko.ignoreDependencies = ko.dependencyDetection.ignore);
var observableLatestValue = ko.utils.createSymbolOrString('_latestValue');

ko.observable = function (initialValue) {
    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if (observable.isDifferent(observable[observableLatestValue], arguments[0])) {
                observable.valueWillMutate();
                observable[observableLatestValue] = arguments[0];
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return observable[observableLatestValue];
        }
    }

    observable[observableLatestValue] = initialValue;

    // Inherit from 'subscribable'
    if (!ko.utils.canSetPrototype) {
        // 'subscribable' won't be on the prototype chain unless we put it there directly
        ko.utils.extend(observable, ko.subscribable['fn']);
    }
    ko.subscribable['fn'].init(observable);

    // Inherit from 'observable'
    ko.utils.setPrototypeOfOrExtend(observable, observableFn);

    if (ko.options['deferUpdates']) {
        ko.extenders['deferred'](observable, true);
    }

    return observable;
}

// Define prototype for observables
var observableFn = {
    'equalityComparer': valuesArePrimitiveAndEqual,
    peek: function() { return this[observableLatestValue]; },
    valueHasMutated: function () { this['notifySubscribers'](this[observableLatestValue]); },
    valueWillMutate: function () { this['notifySubscribers'](this[observableLatestValue], 'beforeChange'); }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(observableFn, ko.subscribable['fn']);
}

var protoProperty = ko.observable.protoProperty = '__ko_proto__';
observableFn[protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == 'function') && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == 'function') && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}

ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
ko.exportSymbol('observable.fn', observableFn);
ko.exportProperty(observableFn, 'peek', observableFn.peek);
ko.exportProperty(observableFn, 'valueHasMutated', observableFn.valueHasMutated);
ko.exportProperty(observableFn, 'valueWillMutate', observableFn.valueWillMutate);
ko.observableArray = function (initialValues) {
    initialValues = initialValues || [];

    if (typeof initialValues != 'object' || !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
    return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observableArray constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
}

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        // The native sort and reverse methods return a reference to the array, but it makes more sense to return the observable array instead.
        return methodCallResult === underlyingArray ? this : methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.exportSymbol('observableArray', ko.observableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target, options) {
    // Use the provided options--each call to trackArrayChanges overwrites the previously set options
    target.compareArrayOptions = {};
    if (options && typeof options == "object") {
        ko.utils.extend(target.compareArrayOptions, options);
    }
    target.compareArrayOptions['sparse'] = true;

    // Only modify the target observable once
    if (target.cacheDiffForKnownOperation) {
        return;
    }
    var trackingChanges = false,
        cachedDiff = null,
        arrayChangeSubscription,
        pendingNotifications = 0,
        underlyingNotifySubscribersFunction,
        underlyingBeforeSubscriptionAddFunction = target.beforeSubscriptionAdd,
        underlyingAfterSubscriptionRemoveFunction = target.afterSubscriptionRemove;

    // Watch "subscribe" calls, and for array change events, ensure change tracking is enabled
    target.beforeSubscriptionAdd = function (event) {
        if (underlyingBeforeSubscriptionAddFunction)
            underlyingBeforeSubscriptionAddFunction.call(target, event);
        if (event === arrayChangeEventName) {
            trackChanges();
        }
    };
    // Watch "dispose" calls, and for array change events, ensure change tracking is disabled when all are disposed
    target.afterSubscriptionRemove = function (event) {
        if (underlyingAfterSubscriptionRemoveFunction)
            underlyingAfterSubscriptionRemoveFunction.call(target, event);
        if (event === arrayChangeEventName && !target.hasSubscriptionsForEvent(arrayChangeEventName)) {
            if (underlyingNotifySubscribersFunction) {
                target['notifySubscribers'] = underlyingNotifySubscribersFunction;
                underlyingNotifySubscribersFunction = undefined;
            }
            arrayChangeSubscription.dispose();
            trackingChanges = false;
        }
    };

    function trackChanges() {
        // Calling 'trackChanges' multiple times is the same as calling it once
        if (trackingChanges) {
            return;
        }

        trackingChanges = true;

        // Intercept "notifySubscribers" to track how many times it was called.
        underlyingNotifySubscribersFunction = target['notifySubscribers'];
        target['notifySubscribers'] = function(valueToNotify, event) {
            if (!event || event === defaultEvent) {
                ++pendingNotifications;
            }
            return underlyingNotifySubscribersFunction.apply(this, arguments);
        };

        // Each time the array changes value, capture a clone so that on the next
        // change it's possible to produce a diff
        var previousContents = [].concat(target.peek() || []);
        cachedDiff = null;
        arrayChangeSubscription = target.subscribe(function(currentContents) {
            // Make a copy of the current contents and ensure it's an array
            currentContents = [].concat(currentContents || []);

            // Compute the diff and issue notifications, but only if someone is listening
            if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                var changes = getChanges(previousContents, currentContents);
            }

            // Eliminate references to the old, removed items, so they can be GCed
            previousContents = currentContents;
            cachedDiff = null;
            pendingNotifications = 0;

            if (changes && changes.length) {
                target['notifySubscribers'](changes, arrayChangeEventName);
            }
        });
    }

    function getChanges(previousContents, currentContents) {
        // We try to re-use cached diffs.
        // The scenarios where pendingNotifications > 1 are when using rate-limiting or the Deferred Updates
        // plugin, which without this check would not be compatible with arrayChange notifications. Normally,
        // notifications are issued immediately so we wouldn't be queueing up more than one.
        if (!cachedDiff || pendingNotifications > 1) {
            cachedDiff = ko.utils.compareArrays(previousContents, currentContents, target.compareArrayOptions);
        }

        return cachedDiff;
    }

    target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
        // Only run if we're currently tracking changes for this observable array
        // and there aren't any pending deferred notifications.
        if (!trackingChanges || pendingNotifications) {
            return;
        }
        var diff = [],
            arrayLength = rawArray.length,
            argsLength = args.length,
            offset = 0;

        function pushDiff(status, value, index) {
            return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
        }
        switch (operationName) {
            case 'push':
                offset = arrayLength;
            case 'unshift':
                for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                }
                break;

            case 'pop':
                offset = arrayLength - 1;
            case 'shift':
                if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                }
                break;

            case 'splice':
                // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                    endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                    endAddIndex = startIndex + argsLength - 2,
                    endIndex = Math.max(endDeleteIndex, endAddIndex),
                    additions = [], deletions = [];
                for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex)
                        deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex)
                        additions.push(pushDiff('added', args[argsIndex], index));
                }
                ko.utils.findMovesInArrayComparison(deletions, additions);
                break;

            default:
                return;
        }
        cachedDiff = diff;
    };
};
var computedState = ko.utils.createSymbolOrString('_state');

ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    if (typeof evaluatorFunctionOrOptions === "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = evaluatorFunctionOrOptions;
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (evaluatorFunctionOrOptions) {
            options["read"] = evaluatorFunctionOrOptions;
        }
    }
    if (typeof options["read"] != "function")
        throw Error("Pass a function that returns the value of the ko.computed");

    var writeFunction = options["write"];
    var state = {
        latestValue: undefined,
        isStale: true,
        isBeingEvaluated: false,
        suppressDisposalUntilDisposeWhenReturnsFalse: false,
        isDisposed: false,
        pure: false,
        isSleeping: false,
        readFunction: options["read"],
        evaluatorFunctionTarget: evaluatorFunctionTarget || options["owner"],
        disposeWhenNodeIsRemoved: options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhen: options["disposeWhen"] || options.disposeWhen,
        domNodeDisposalCallback: null,
        dependencyTracking: {},
        dependenciesCount: 0,
        evaluationTimeoutInstance: null
    };

    function computedObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(state.evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            ko.dependencyDetection.registerDependency(computedObservable);
            if (state.isStale || (state.isSleeping && computedObservable.haveDependenciesChanged())) {
                computedObservable.evaluateImmediate();
            }
            return state.latestValue;
        }
    }

    computedObservable[computedState] = state;
    computedObservable.hasWriteFunction = typeof writeFunction === "function";

    // Inherit from 'subscribable'
    if (!ko.utils.canSetPrototype) {
        // 'subscribable' won't be on the prototype chain unless we put it there directly
        ko.utils.extend(computedObservable, ko.subscribable['fn']);
    }
    ko.subscribable['fn'].init(computedObservable);

    // Inherit from 'computed'
    ko.utils.setPrototypeOfOrExtend(computedObservable, computedFn);

    if (options['pure']) {
        state.pure = true;
        state.isSleeping = true;     // Starts off sleeping; will awake on the first subscription
        ko.utils.extend(computedObservable, pureComputedOverrides);
    } else if (options['deferEvaluation']) {
        ko.utils.extend(computedObservable, deferEvaluationOverrides);
    }

    if (ko.options['deferUpdates']) {
        ko.extenders['deferred'](computedObservable, true);
    }

    if (DEBUG) {
        // #1731 - Aid debugging by exposing the computed's options
        computedObservable["_options"] = options;
    }

    if (state.disposeWhenNodeIsRemoved) {
        // Since this computed is associated with a DOM node, and we don't want to dispose the computed
        // until the DOM node is *removed* from the document (as opposed to never having been in the document),
        // we'll prevent disposal until "disposeWhen" first returns false.
        state.suppressDisposalUntilDisposeWhenReturnsFalse = true;

        // disposeWhenNodeIsRemoved: true can be used to opt into the "only dispose after first false result"
        // behaviour even if there's no specific node to watch. In that case, clear the option so we don't try
        // to watch for a non-node's disposal. This technique is intended for KO's internal use only and shouldn't
        // be documented or used by application code, as it's likely to change in a future version of KO.
        if (!state.disposeWhenNodeIsRemoved.nodeType) {
            state.disposeWhenNodeIsRemoved = null;
        }
    }

    // Evaluate, unless sleeping or deferEvaluation is true
    if (!state.isSleeping && !options['deferEvaluation']) {
        computedObservable.evaluateImmediate();
    }

    // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
    // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
    if (state.disposeWhenNodeIsRemoved && computedObservable.isActive()) {
        ko.utils.domNodeDisposal.addDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback = function () {
            computedObservable.dispose();
        });
    }

    return computedObservable;
};

// Utility function that disposes a given dependencyTracking entry
function computedDisposeDependencyCallback(id, entryToDispose) {
    if (entryToDispose !== null && entryToDispose.dispose) {
        entryToDispose.dispose();
    }
}

// This function gets called each time a dependency is detected while evaluating a computed.
// It's factored out as a shared function to avoid creating unnecessary function instances during evaluation.
function computedBeginDependencyDetectionCallback(subscribable, id) {
    var computedObservable = this.computedObservable,
        state = computedObservable[computedState];
    if (!state.isDisposed) {
        if (this.disposalCount && this.disposalCandidates[id]) {
            // Don't want to dispose this subscription, as it's still being used
            computedObservable.addDependencyTracking(id, subscribable, this.disposalCandidates[id]);
            this.disposalCandidates[id] = null; // No need to actually delete the property - disposalCandidates is a transient object anyway
            --this.disposalCount;
        } else if (!state.dependencyTracking[id]) {
            // Brand new subscription - add it
            computedObservable.addDependencyTracking(id, subscribable, state.isSleeping ? { _target: subscribable } : computedObservable.subscribeToDependency(subscribable));
        }
    }
}

var computedFn = {
    "equalityComparer": valuesArePrimitiveAndEqual,
    getDependenciesCount: function () {
        return this[computedState].dependenciesCount;
    },
    addDependencyTracking: function (id, target, trackingObj) {
        if (this[computedState].pure && target === this) {
            throw Error("A 'pure' computed must not be called recursively");
        }

        this[computedState].dependencyTracking[id] = trackingObj;
        trackingObj._order = this[computedState].dependenciesCount++;
        trackingObj._version = target.getVersion();
    },
    haveDependenciesChanged: function () {
        var id, dependency, dependencyTracking = this[computedState].dependencyTracking;
        for (id in dependencyTracking) {
            if (dependencyTracking.hasOwnProperty(id)) {
                dependency = dependencyTracking[id];
                if (dependency._target.hasChanged(dependency._version)) {
                    return true;
                }
            }
        }
    },
    markDirty: function () {
        // Process "dirty" events if we can handle delayed notifications
        if (this._evalDelayed && !this[computedState].isBeingEvaluated) {
            this._evalDelayed();
        }
    },
    isActive: function () {
        return this[computedState].isStale || this[computedState].dependenciesCount > 0;
    },
    respondToChange: function () {
        // Ignore "change" events if we've already scheduled a delayed notification
        if (!this._notificationIsPending) {
            this.evaluatePossiblyAsync();
        }
    },
    subscribeToDependency: function (target) {
        if (target._deferUpdates && !this[computedState].disposeWhenNodeIsRemoved) {
            var dirtySub = target.subscribe(this.markDirty, this, 'dirty'),
                changeSub = target.subscribe(this.respondToChange, this);
            return {
                _target: target,
                dispose: function () {
                    dirtySub.dispose();
                    changeSub.dispose();
                }
            };
        } else {
            return target.subscribe(this.evaluatePossiblyAsync, this);
        }
    },
    evaluatePossiblyAsync: function () {
        var computedObservable = this,
            throttleEvaluationTimeout = computedObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(this[computedState].evaluationTimeoutInstance);
            this[computedState].evaluationTimeoutInstance = ko.utils.setTimeout(function () {
                computedObservable.evaluateImmediate(true /*notifyChange*/);
            }, throttleEvaluationTimeout);
        } else if (computedObservable._evalDelayed) {
            computedObservable._evalDelayed();
        } else {
            computedObservable.evaluateImmediate(true /*notifyChange*/);
        }
    },
    evaluateImmediate: function (notifyChange) {
        var computedObservable = this,
            state = computedObservable[computedState],
            disposeWhen = state.disposeWhen,
            changed = false;

        if (state.isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Do not evaluate (and possibly capture new dependencies) if disposed
        if (state.isDisposed) {
            return;
        }

        if (state.disposeWhenNodeIsRemoved && !ko.utils.domNodeIsAttachedToDocument(state.disposeWhenNodeIsRemoved) || disposeWhen && disposeWhen()) {
            // See comment above about suppressDisposalUntilDisposeWhenReturnsFalse
            if (!state.suppressDisposalUntilDisposeWhenReturnsFalse) {
                computedObservable.dispose();
                return;
            }
        } else {
            // It just did return false, so we can stop suppressing now
            state.suppressDisposalUntilDisposeWhenReturnsFalse = false;
        }

        state.isBeingEvaluated = true;
        try {
            changed = this.evaluateImmediate_CallReadWithDependencyDetection(notifyChange);
        } finally {
            state.isBeingEvaluated = false;
        }

        if (!state.dependenciesCount) {
            computedObservable.dispose();
        }

        return changed;
    },
    evaluateImmediate_CallReadWithDependencyDetection: function (notifyChange) {
        // This function is really just part of the evaluateImmediate logic. You would never call it from anywhere else.
        // Factoring it out into a separate function means it can be independent of the try/catch block in evaluateImmediate,
        // which contributes to saving about 40% off the CPU overhead of computed evaluation (on V8 at least).

        var computedObservable = this,
            state = computedObservable[computedState],
            changed = false;

        // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
        // Then, during evaluation, we cross off any that are in fact still being used.
        var isInitial = state.pure ? undefined : !state.dependenciesCount,   // If we're evaluating when there are no previous dependencies, it must be the first time
            dependencyDetectionContext = {
                computedObservable: computedObservable,
                disposalCandidates: state.dependencyTracking,
                disposalCount: state.dependenciesCount
            };

        ko.dependencyDetection.begin({
            callbackTarget: dependencyDetectionContext,
            callback: computedBeginDependencyDetectionCallback,
            computed: computedObservable,
            isInitial: isInitial
        });

        state.dependencyTracking = {};
        state.dependenciesCount = 0;

        var newValue = this.evaluateImmediate_CallReadThenEndDependencyDetection(state, dependencyDetectionContext);

        if (computedObservable.isDifferent(state.latestValue, newValue)) {
            if (!state.isSleeping) {
                computedObservable["notifySubscribers"](state.latestValue, "beforeChange");
            }

            state.latestValue = newValue;
            if (DEBUG) computedObservable._latestValue = newValue;

            if (state.isSleeping) {
                computedObservable.updateVersion();
            } else if (notifyChange) {
                computedObservable["notifySubscribers"](state.latestValue);
            }

            changed = true;
        }

        if (isInitial) {
            computedObservable["notifySubscribers"](state.latestValue, "awake");
        }

        return changed;
    },
    evaluateImmediate_CallReadThenEndDependencyDetection: function (state, dependencyDetectionContext) {
        // This function is really part of the evaluateImmediate_CallReadWithDependencyDetection logic.
        // You'd never call it from anywhere else. Factoring it out means that evaluateImmediate_CallReadWithDependencyDetection
        // can be independent of try/finally blocks, which contributes to saving about 40% off the CPU
        // overhead of computed evaluation (on V8 at least).

        try {
            var readFunction = state.readFunction;
            return state.evaluatorFunctionTarget ? readFunction.call(state.evaluatorFunctionTarget) : readFunction();
        } finally {
            ko.dependencyDetection.end();

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            if (dependencyDetectionContext.disposalCount && !state.isSleeping) {
                ko.utils.objectForEach(dependencyDetectionContext.disposalCandidates, computedDisposeDependencyCallback);
            }

            state.isStale = false;
        }
    },
    peek: function () {
        // Peek won't re-evaluate, except while the computed is sleeping or to get the initial value when "deferEvaluation" is set.
        var state = this[computedState];
        if ((state.isStale && !state.dependenciesCount) || (state.isSleeping && this.haveDependenciesChanged())) {
            this.evaluateImmediate();
        }
        return state.latestValue;
    },
    limit: function (limitFunction) {
        // Override the limit function with one that delays evaluation as well
        ko.subscribable['fn'].limit.call(this, limitFunction);
        this._evalDelayed = function () {
            this._limitBeforeChange(this[computedState].latestValue);

            this[computedState].isStale = true; // Mark as dirty

            // Pass the observable to the "limit" code, which will access it when
            // it's time to do the notification.
            this._limitChange(this);
        }
    },
    dispose: function () {
        var state = this[computedState];
        if (!state.isSleeping && state.dependencyTracking) {
            ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                if (dependency.dispose)
                    dependency.dispose();
            });
        }
        if (state.disposeWhenNodeIsRemoved && state.domNodeDisposalCallback) {
            ko.utils.domNodeDisposal.removeDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback);
        }
        state.dependencyTracking = null;
        state.dependenciesCount = 0;
        state.isDisposed = true;
        state.isStale = false;
        state.isSleeping = false;
        state.disposeWhenNodeIsRemoved = null;
    }
};

var pureComputedOverrides = {
    beforeSubscriptionAdd: function (event) {
        // If asleep, wake up the computed by subscribing to any dependencies.
        var computedObservable = this,
            state = computedObservable[computedState];
        if (!state.isDisposed && state.isSleeping && event == 'change') {
            state.isSleeping = false;
            if (state.isStale || computedObservable.haveDependenciesChanged()) {
                state.dependencyTracking = null;
                state.dependenciesCount = 0;
                state.isStale = true;
                if (computedObservable.evaluateImmediate()) {
                    computedObservable.updateVersion();
                }
            } else {
                // First put the dependencies in order
                var dependeciesOrder = [];
                ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                    dependeciesOrder[dependency._order] = id;
                });
                // Next, subscribe to each one
                ko.utils.arrayForEach(dependeciesOrder, function (id, order) {
                    var dependency = state.dependencyTracking[id],
                        subscription = computedObservable.subscribeToDependency(dependency._target);
                    subscription._order = order;
                    subscription._version = dependency._version;
                    state.dependencyTracking[id] = subscription;
                });
            }
            if (!state.isDisposed) {     // test since evaluating could trigger disposal
                computedObservable["notifySubscribers"](state.latestValue, "awake");
            }
        }
    },
    afterSubscriptionRemove: function (event) {
        var state = this[computedState];
        if (!state.isDisposed && event == 'change' && !this.hasSubscriptionsForEvent('change')) {
            ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                if (dependency.dispose) {
                    state.dependencyTracking[id] = {
                        _target: dependency._target,
                        _order: dependency._order,
                        _version: dependency._version
                    };
                    dependency.dispose();
                }
            });
            state.isSleeping = true;
            this["notifySubscribers"](undefined, "asleep");
        }
    },
    getVersion: function () {
        // Because a pure computed is not automatically updated while it is sleeping, we can't
        // simply return the version number. Instead, we check if any of the dependencies have
        // changed and conditionally re-evaluate the computed observable.
        var state = this[computedState];
        if (state.isSleeping && (state.isStale || this.haveDependenciesChanged())) {
            this.evaluateImmediate();
        }
        return ko.subscribable['fn'].getVersion.call(this);
    }
};

var deferEvaluationOverrides = {
    beforeSubscriptionAdd: function (event) {
        // This will force a computed with deferEvaluation to evaluate when the first subscription is registered.
        if (event == 'change' || event == 'beforeChange') {
            this.peek();
        }
    }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.computed constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(computedFn, ko.subscribable['fn']);
}

// Set the proto chain values for ko.hasPrototype
var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.computed[protoProp] = ko.observable;
computedFn[protoProp] = ko.computed;

ko.isComputed = function (instance) {
    return ko.hasPrototype(instance, ko.computed);
};

ko.isPureComputed = function (instance) {
    return ko.hasPrototype(instance, ko.computed)
        && instance[computedState] && instance[computedState].pure;
};

ko.exportSymbol('computed', ko.computed);
ko.exportSymbol('dependentObservable', ko.computed);    // export ko.dependentObservable for backwards compatibility (1.x)
ko.exportSymbol('isComputed', ko.isComputed);
ko.exportSymbol('isPureComputed', ko.isPureComputed);
ko.exportSymbol('computed.fn', computedFn);
ko.exportProperty(computedFn, 'peek', computedFn.peek);
ko.exportProperty(computedFn, 'dispose', computedFn.dispose);
ko.exportProperty(computedFn, 'isActive', computedFn.isActive);
ko.exportProperty(computedFn, 'getDependenciesCount', computedFn.getDependenciesCount);

ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
    if (typeof evaluatorFunctionOrOptions === 'function') {
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, {'pure':true});
    } else {
        evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
        evaluatorFunctionOrOptions['pure'] = true;
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
    }
}
ko.exportSymbol('pureComputed', ko.pureComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof RegExp)) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject) {
                visitorCallback(propertyName);
            }
        }
    };

    function objectLookup() {
        this.keys = [];
        this.values = [];
    };

    objectLookup.prototype = {
        constructor: objectLookup,
        save: function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            if (existingIndex >= 0)
                this.values[existingIndex] = value;
            else {
                this.keys.push(key);
                this.values.push(value);
            }
        },
        get: function(key) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
        }
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value, allowUnset) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    if (value === "" || value === null)       // A blank string or null value will select the caption
                        value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                        optionValue = ko.selectExtensions.readValue(element.options[i]);
                        // Include special check to handle selecting a caption with a blank string value
                        if (optionValue == value || (optionValue == "" && value === undefined)) {
                            selection = i;
                            break;
                        }
                    }
                    if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                        element.selectedIndex = selection;
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var javaScriptReservedWords = ["true", "false", "null", "undefined"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    // The following regular expressions will be used to split an object-literal string into tokens

        // These two match strings, either with double quotes or single quotes
    var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
        stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
        // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
        // as a regular expression (this is handled by the parsing loop below).
        stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
        // These characters have special meaning to the parser and must not appear in the middle of a
        // token, except as part of a string.
        specials = ',"\'{}()/:[\\]',
        // Match text (at least two characters) that does not contain any of the above special characters,
        // although some of the special characters are allowed to start it (all but the colon and comma).
        // The text can contain spaces, but leading or trailing spaces are skipped.
        everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
        // Match any non-space character not matched already. This will match colons and commas, since they're
        // not matched by "everyThingElse", but will also match any other single character that wasn't already
        // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
        oneNotSpace = '[^\\s]',

        // Create the actual regular expression by or-ing the above strings. The order is important.
        bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

        // Match end of previous token to determine whether a slash is a division or regex.
        divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
        keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

    function parseObjectLiteral(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = ko.utils.stringTrim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

        // Split into tokens
        var result = [], toks = str.match(bindingToken), key, values = [], depth = 0;

        if (toks) {
            // Append a comma so that we don't need a separate code block to deal with the last item
            toks.push(',');

            for (var i = 0, tok; tok = toks[i]; ++i) {
                var c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        result.push((key && values.length) ? {key: key, value: values.join('')} : {'unknown': key || values.join('')});
                        key = depth = 0;
                        values = [];
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!depth && !key && values.length === 1) {
                        key = values.pop();
                        continue;
                    }
                // A set of slashes is initially matched as a regular expression, but could be division
                } else if (c === 47 && i && tok.length > 1) {  // "/"
                    // Look at the end of the previous token to determine if the slash is actually division
                    var match = toks[i-1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                        // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                        str = str.substr(str.indexOf(tok) + 1);
                        toks = str.match(bindingToken);
                        toks.push(',');
                        i = -1;
                        // Continue with just the slash
                        tok = '/';
                    }
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key will be the first token; if it's a string, trim the quotes
                } else if (!key && !values.length && (c === 34 || c === 39)) { // '"', "'"
                    tok = tok.slice(1, -1);
                }
                values.push(tok);
            }
        }
        return result;
    }

    // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
    var twoWayBindings = {};

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
        bindingOptions = bindingOptions || {};

        function processKeyValue(key, val) {
            var writableVal;
            function callPreprocessHook(obj) {
                return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
            }
            if (!bindingParams) {
                if (!callPreprocessHook(ko['getBindingHandler'](key)))
                    return;

                if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    // For two-way bindings, provide a write method in case the value
                    // isn't a writable observable.
                    propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                }
            }
            // Values are wrapped in a function so that each value can be accessed independently
            if (makeValueAccessors) {
                val = 'function(){return ' + val + ' }';
            }
            resultStrings.push("'" + key + "':" + val);
        }

        var resultStrings = [],
            propertyAccessorResultStrings = [],
            makeValueAccessors = bindingOptions['valueAccessors'],
            bindingParams = bindingOptions['bindingParams'],
            keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

        ko.utils.arrayForEach(keyValueArray, function(keyValue) {
            processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
        });

        if (propertyAccessorResultStrings.length)
            processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

        return resultStrings.join(",");
    }

    return {
        bindingRewriteValidators: [],

        twoWayBindings: twoWayBindings,

        parseObjectLiteral: parseObjectLiteral,

        preProcessBindings: preProcessBindings,

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (keyValueArray[i]['key'] == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindings:         An object with a get method to retrieve bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
            if (!property || !ko.isObservable(property)) {
                var propWriters = allBindings.get('_ko_property_writers');
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        hasBindingValue: isStartComment,

        virtualNodeBindingValue: function(node) {
            var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: // Element
                    return node.getAttribute(defaultBindingAttributeName) != null
                        || ko.components['getComponentNameForNode'](node);
                case 8: // Comment node
                    return ko.virtualElements.hasBindingValue(node);
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
        },

        'getBindingAccessors': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node, options) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                throw ex;
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
        var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    // The following element types will not be recursed into during binding.
    var bindingDoesNotRecurseIntoElementTypes = {
        // Don't want bindings that operate on text nodes to mutate <script> and <textarea> contents,
        // because it's unexpected and a potential XSS issue.
        // Also bindings should not operate on <template> elements since this breaks in Internet Explorer
        // and because such elements' contents are always intended to be bound in a different context
        // from where they appear in the document.
        'script': true,
        'textarea': true,
        'template': true
    };

    // Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
    ko['getBindingHandler'] = function(bindingKey) {
        return ko.bindingHandlers[bindingKey];
    };

    // The ko.bindingContext constructor is only called directly to create the root context. For child
    // contexts, use bindingContext.createChildContext or bindingContext.extend.
    ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback, options) {

        // The binding context object includes static properties for the current, parent, and root view models.
        // If a view model is actually stored in an observable, the corresponding binding context object, and
        // any child contexts, must be updated when the view model is changed.
        function updateContext() {
            // Most of the time, the context will directly get a view model object, but if a function is given,
            // we call the function to retrieve the view model. If the function accesses any observables or returns
            // an observable, the dependency is tracked, and those observables can later cause the binding
            // context to be updated.
            var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

            if (parentContext) {
                // When a "parent" context is given, register a dependency on the parent context. Thus whenever the
                // parent context is updated, this context will also be updated.
                if (parentContext._subscribable)
                    parentContext._subscribable();

                // Copy $root and any custom properties from the parent context
                ko.utils.extend(self, parentContext);

                // Because the above copy overwrites our own properties, we need to reset them.
                self._subscribable = subscribable;
            } else {
                self['$parents'] = [];
                self['$root'] = dataItem;

                // Export 'ko' in the binding context so it will be available in bindings and templates
                // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                // See https://github.com/SteveSanderson/knockout/issues/490
                self['ko'] = ko;
            }
            self['$rawData'] = dataItemOrObservable;
            self['$data'] = dataItem;
            if (dataItemAlias)
                self[dataItemAlias] = dataItem;

            // The extendCallback function is provided when creating a child context or extending a context.
            // It handles the specific actions needed to finish setting up the binding context. Actions in this
            // function could also add dependencies to this binding context.
            if (extendCallback)
                extendCallback(self, parentContext, dataItem);

            return self['$data'];
        }
        function disposeWhen() {
            return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
        }

        var self = this,
            isFunc = typeof(dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor),
            nodes,
            subscribable;

        if (options && options['exportDependencies']) {
            // The "exportDependencies" option means that the calling code will track any dependencies and re-create
            // the binding context when they change.
            updateContext();
        } else {
            subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

            // At this point, the binding context has been initialized, and the "subscribable" computed observable is
            // subscribed to any observables that were accessed in the process. If there is nothing to track, the
            // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
            // the context object.
            if (subscribable.isActive()) {
                self._subscribable = subscribable;

                // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
                subscribable['equalityComparer'] = null;

                // We need to be able to dispose of this computed observable when it's no longer needed. This would be
                // easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
                // we cannot assume that those nodes have any relation to each other. So instead we track any node that
                // the context is attached to, and dispose the computed when all of those nodes have been cleaned.

                // Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
                nodes = [];
                subscribable._addNode = function(node) {
                    nodes.push(node);
                    ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
                        ko.utils.arrayRemoveItem(nodes, node);
                        if (!nodes.length) {
                            subscribable.dispose();
                            self._subscribable = subscribable = undefined;
                        }
                    });
                };
            }
        }
    }

    // Extend the binding context hierarchy with a new view model object. If the parent context is watching
    // any observables, the new child context will automatically get a dependency on the parent context.
    // But this does not mean that the $data value of the child context will also get updated. If the child
    // view model also depends on the parent view model, you must provide a function that returns the correct
    // view model on each update.
    ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback, options) {
        return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
            // Extend the context hierarchy by setting the appropriate pointers
            self['$parentContext'] = parentContext;
            self['$parent'] = parentContext['$data'];
            self['$parents'] = (parentContext['$parents'] || []).slice(0);
            self['$parents'].unshift(self['$parent']);
            if (extendCallback)
                extendCallback(self);
        }, options);
    };

    // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
    // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
    // when an observable view model is updated.
    ko.bindingContext.prototype['extend'] = function(properties) {
        // If the parent context references an observable view model, "_subscribable" will always be the
        // latest view model object. If not, "_subscribable" isn't set, and we can use the static "$data" value.
        return new ko.bindingContext(this._subscribable || this['$data'], this, null, function(self, parentContext) {
            // This "child" context doesn't directly track a parent observable view model,
            // so we need to manually set the $rawData value to match the parent.
            self['$rawData'] = parentContext['$rawData'];
            ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
        });
    };

    ko.bindingContext.prototype.createStaticChildContext = function (dataItemOrAccessor, dataItemAlias) {
        return this['createChildContext'](dataItemOrAccessor, dataItemAlias, null, { "exportDependencies": true });
    };

    // Returns the valueAccesor function for a binding value
    function makeValueAccessor(value) {
        return function() {
            return value;
        };
    }

    // Returns the value of a valueAccessor function
    function evaluateValueAccessor(valueAccessor) {
        return valueAccessor();
    }

    // Given a function that returns bindings, create and return a new object that contains
    // binding value-accessors functions. Each accessor function calls the original function
    // so that it always gets the latest value and all dependencies are captured. This is used
    // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
    function makeAccessorsFromFunction(callback) {
        return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
            return function() {
                return callback()[key];
            };
        });
    }

    // Given a bindings function or object, create and return a new object that contains
    // binding value-accessors functions. This is used by ko.applyBindingsToNode.
    function makeBindingAccessors(bindings, context, node) {
        if (typeof bindings === 'function') {
            return makeAccessorsFromFunction(bindings.bind(null, context, node));
        } else {
            return ko.utils.objectMap(bindings, makeValueAccessor);
        }
    }

    // This function is used if the binding provider doesn't include a getBindingAccessors function.
    // It must be called with 'this' set to the provider instance.
    function getBindingsAndMakeAccessors(node, context) {
        return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
    }

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild,
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
            provider = ko.bindingProvider['instance'],
            preprocessNode = provider['preprocessNode'];

        // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
        // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
        // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
        // trigger insertion of <template> contents at that point in the document.
        if (preprocessNode) {
            while (currentChild = nextInQueue) {
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                preprocessNode.call(provider, currentChild);
            }
            // Reset nextInQueue for the next loop
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        }

        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

        if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    var boundElementDomDataKey = ko.utils.domData.nextKey();


    function topologicalSortBindings(bindings) {
        // Depth-first sort
        var result = [],                // The list of key/handler pairs that we will return
            bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
            cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
        ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
            if (!bindingsConsidered[bindingKey]) {
                var binding = ko['getBindingHandler'](bindingKey);
                if (binding) {
                    // First add dependencies (if any) of the current binding
                    if (binding['after']) {
                        cyclicDependencyStack.push(bindingKey);
                        ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
                            if (bindings[bindingDependencyKey]) {
                                if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                    throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                } else {
                                    pushBinding(bindingDependencyKey);
                                }
                            }
                        });
                        cyclicDependencyStack.length--;
                    }
                    // Next add the current binding
                    result.push({ key: bindingKey, handler: binding });
                }
                bindingsConsidered[bindingKey] = true;
            }
        });

        return result;
    }

    function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
        // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
        var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
        if (!sourceBindings) {
            if (alreadyBound) {
                throw Error("You cannot apply bindings multiple times to the same element.");
            }
            ko.utils.domData.set(node, boundElementDomDataKey, true);
        }

        // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
        // we can easily recover it just by scanning up the node's ancestors in the DOM
        // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
        if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
            ko.storedBindingContextForNode(node, bindingContext);

        // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
        var bindings;
        if (sourceBindings && typeof sourceBindings !== 'function') {
            bindings = sourceBindings;
        } else {
            var provider = ko.bindingProvider['instance'],
                getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

            // Get the binding from the provider within a computed observable so that we can update the bindings whenever
            // the binding context is updated or if the binding provider accesses observables.
            var bindingsUpdater = ko.dependentObservable(
                function() {
                    bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                    // Register a dependency on the binding context to support observable view models.
                    if (bindings && bindingContext._subscribable)
                        bindingContext._subscribable();
                    return bindings;
                },
                null, { disposeWhenNodeIsRemoved: node }
            );

            if (!bindings || !bindingsUpdater.isActive())
                bindingsUpdater = null;
        }

        var bindingHandlerThatControlsDescendantBindings;
        if (bindings) {
            // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
            // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
            // the latest binding value and registers a dependency on the binding updater.
            var getValueAccessor = bindingsUpdater
                ? function(bindingKey) {
                    return function() {
                        return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                    };
                } : function(bindingKey) {
                    return bindings[bindingKey];
                };

            // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
            function allBindings() {
                return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
            }
            // The following is the 3.x allBindings API
            allBindings['get'] = function(key) {
                return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
            };
            allBindings['has'] = function(key) {
                return key in bindings;
            };

            // First put the bindings into the right order
            var orderedBindings = topologicalSortBindings(bindings);

            // Go through the sorted bindings, calling init and update for each
            ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
                // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                // so bindingKeyAndHandler.handler will always be nonnull.
                var handlerInitFn = bindingKeyAndHandler.handler["init"],
                    handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                    bindingKey = bindingKeyAndHandler.key;

                if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                }

                try {
                    // Run init, ignoring any dependencies
                    if (typeof handlerInitFn == "function") {
                        ko.dependencyDetection.ignore(function() {
                            var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

                            // If this binding handler claims to control descendant bindings, make a note of this
                            if (initResult && initResult['controlsDescendantBindings']) {
                                if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                    throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                            }
                        });
                    }

                    // Run update in its own computed wrapper
                    if (typeof handlerUpdateFn == "function") {
                        ko.dependentObservable(
                            function() {
                                handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                            },
                            null,
                            { disposeWhenNodeIsRemoved: node }
                        );
                    }
                } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                }
            });
        }

        return {
            'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2) {
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
            if (bindingContext._subscribable)
                bindingContext._subscribable._addNode(node);
        } else {
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
        }
    }

    function getBindingContext(viewModelOrBindingContext) {
        return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
            ? viewModelOrBindingContext
            : new ko.bindingContext(viewModelOrBindingContext);
    }

    ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
    };

    ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
        var context = getBindingContext(viewModelOrBindingContext);
        return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
    };

    ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
        // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
        if (!jQueryInstance && window['jQuery']) {
            jQueryInstance = window['jQuery'];
        }

        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
(function(undefined) {
    var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
        loadedDefinitionsCache = {};    // Tracks component loads that have already completed

    ko.components = {
        get: function(componentName, callback) {
            var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
            if (cachedDefinition) {
                // It's already loaded and cached. Reuse the same definition object.
                // Note that for API consistency, even cache hits complete asynchronously by default.
                // You can bypass this by putting synchronous:true on your component config.
                if (cachedDefinition.isSynchronousComponent) {
                    ko.dependencyDetection.ignore(function() { // See comment in loaderRegistryBehaviors.js for reasoning
                        callback(cachedDefinition.definition);
                    });
                } else {
                    ko.tasks.schedule(function() { callback(cachedDefinition.definition); });
                }
            } else {
                // Join the loading process that is already underway, or start a new one.
                loadComponentAndNotify(componentName, callback);
            }
        },

        clearCachedDefinition: function(componentName) {
            delete loadedDefinitionsCache[componentName];
        },

        _getFirstResultFromLoaders: getFirstResultFromLoaders
    };

    function getObjectOwnProperty(obj, propName) {
        return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
    }

    function loadComponentAndNotify(componentName, callback) {
        var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
            completedAsync;
        if (!subscribable) {
            // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
            subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
            subscribable.subscribe(callback);

            beginLoadingComponent(componentName, function(definition, config) {
                var isSynchronousComponent = !!(config && config['synchronous']);
                loadedDefinitionsCache[componentName] = { definition: definition, isSynchronousComponent: isSynchronousComponent };
                delete loadingSubscribablesCache[componentName];

                // For API consistency, all loads complete asynchronously. However we want to avoid
                // adding an extra task schedule if it's unnecessary (i.e., the completion is already
                // async).
                //
                // You can bypass the 'always asynchronous' feature by putting the synchronous:true
                // flag on your component configuration when you register it.
                if (completedAsync || isSynchronousComponent) {
                    // Note that notifySubscribers ignores any dependencies read within the callback.
                    // See comment in loaderRegistryBehaviors.js for reasoning
                    subscribable['notifySubscribers'](definition);
                } else {
                    ko.tasks.schedule(function() {
                        subscribable['notifySubscribers'](definition);
                    });
                }
            });
            completedAsync = true;
        } else {
            subscribable.subscribe(callback);
        }
    }

    function beginLoadingComponent(componentName, callback) {
        getFirstResultFromLoaders('getConfig', [componentName], function(config) {
            if (config) {
                // We have a config, so now load its definition
                getFirstResultFromLoaders('loadComponent', [componentName, config], function(definition) {
                    callback(definition, config);
                });
            } else {
                // The component has no config - it's unknown to all the loaders.
                // Note that this is not an error (e.g., a module loading error) - that would abort the
                // process and this callback would not run. For this callback to run, all loaders must
                // have confirmed they don't know about this component.
                callback(null, null);
            }
        });
    }

    function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
        // On the first call in the stack, start with the full set of loaders
        if (!candidateLoaders) {
            candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
        }

        // Try the next candidate
        var currentCandidateLoader = candidateLoaders.shift();
        if (currentCandidateLoader) {
            var methodInstance = currentCandidateLoader[methodName];
            if (methodInstance) {
                var wasAborted = false,
                    synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
                        if (wasAborted) {
                            callback(null);
                        } else if (result !== null) {
                            // This candidate returned a value. Use it.
                            callback(result);
                        } else {
                            // Try the next candidate
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    }));

                // Currently, loaders may not return anything synchronously. This leaves open the possibility
                // that we'll extend the API to support synchronous return values in the future. It won't be
                // a breaking change, because currently no loader is allowed to return anything except undefined.
                if (synchronousReturnValue !== undefined) {
                    wasAborted = true;

                    // Method to suppress exceptions will remain undocumented. This is only to keep
                    // KO's specs running tidily, since we can observe the loading got aborted without
                    // having exceptions cluttering up the console too.
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                        throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                }
            } else {
                // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
            }
        } else {
            // No candidates returned a value
            callback(null);
        }
    }

    // Reference the loaders via string name so it's possible for developers
    // to replace the whole array by assigning to ko.components.loaders
    ko.components['loaders'] = [];

    ko.exportSymbol('components', ko.components);
    ko.exportSymbol('components.get', ko.components.get);
    ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
})();
(function(undefined) {

    // The default loader is responsible for two things:
    // 1. Maintaining the default in-memory registry of component configuration objects
    //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
    // 2. Answering requests for components by fetching configuration objects
    //    from that default in-memory registry and resolving them into standard
    //    component definition objects (of the form { createViewModel: ..., template: ... })
    // Custom loaders may override either of these facilities, i.e.,
    // 1. To supply configuration objects from some other source (e.g., conventions)
    // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

    var defaultConfigRegistry = {};

    ko.components.register = function(componentName, config) {
        if (!config) {
            throw new Error('Invalid configuration for ' + componentName);
        }

        if (ko.components.isRegistered(componentName)) {
            throw new Error('Component ' + componentName + ' is already registered');
        }

        defaultConfigRegistry[componentName] = config;
    };

    ko.components.isRegistered = function(componentName) {
        return defaultConfigRegistry.hasOwnProperty(componentName);
    };

    ko.components.unregister = function(componentName) {
        delete defaultConfigRegistry[componentName];
        ko.components.clearCachedDefinition(componentName);
    };

    ko.components.defaultLoader = {
        'getConfig': function(componentName, callback) {
            var result = defaultConfigRegistry.hasOwnProperty(componentName)
                ? defaultConfigRegistry[componentName]
                : null;
            callback(result);
        },

        'loadComponent': function(componentName, config, callback) {
            var errorCallback = makeErrorCallback(componentName);
            possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
                resolveConfig(componentName, errorCallback, loadedConfig, callback);
            });
        },

        'loadTemplate': function(componentName, templateConfig, callback) {
            resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
        },

        'loadViewModel': function(componentName, viewModelConfig, callback) {
            resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
        }
    };

    var createViewModelKey = 'createViewModel';

    // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
    // into the standard component definition format:
    //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
    // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
    // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
    // so this is implemented manually below.
    function resolveConfig(componentName, errorCallback, config, callback) {
        var result = {},
            makeCallBackWhenZero = 2,
            tryIssueCallback = function() {
                if (--makeCallBackWhenZero === 0) {
                    callback(result);
                }
            },
            templateConfig = config['template'],
            viewModelConfig = config['viewModel'];

        if (templateConfig) {
            possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }

        if (viewModelConfig) {
            possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }
    }

    function resolveTemplate(errorCallback, templateConfig, callback) {
        if (typeof templateConfig === 'string') {
            // Markup - parse it
            callback(ko.utils.parseHtmlFragment(templateConfig));
        } else if (templateConfig instanceof Array) {
            // Assume already an array of DOM nodes - pass through unchanged
            callback(templateConfig);
        } else if (isDocumentFragment(templateConfig)) {
            // Document fragment - use its child nodes
            callback(ko.utils.makeArray(templateConfig.childNodes));
        } else if (templateConfig['element']) {
            var element = templateConfig['element'];
            if (isDomElement(element)) {
                // Element instance - copy its child nodes
                callback(cloneNodesFromTemplateSourceElement(element));
            } else if (typeof element === 'string') {
                // Element ID - find it, then copy its child nodes
                var elemInstance = document.getElementById(element);
                if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                } else {
                    errorCallback('Cannot find element with ID ' + element);
                }
            } else {
                errorCallback('Unknown element type: ' + element);
            }
        } else {
            errorCallback('Unknown template value: ' + templateConfig);
        }
    }

    function resolveViewModel(errorCallback, viewModelConfig, callback) {
        if (typeof viewModelConfig === 'function') {
            // Constructor - convert to standard factory function format
            // By design, this does *not* supply componentInfo to the constructor, as the intent is that
            // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
            // be used in factory functions, not viewmodel constructors.
            callback(function (params /*, componentInfo */) {
                return new viewModelConfig(params);
            });
        } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
            // Already a factory function - use it as-is
            callback(viewModelConfig[createViewModelKey]);
        } else if ('instance' in viewModelConfig) {
            // Fixed object instance - promote to createViewModel format for API consistency
            var fixedInstance = viewModelConfig['instance'];
            callback(function (params, componentInfo) {
                return fixedInstance;
            });
        } else if ('viewModel' in viewModelConfig) {
            // Resolved AMD module whose value is of the form { viewModel: ... }
            resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
        } else {
            errorCallback('Unknown viewModel value: ' + viewModelConfig);
        }
    }

    function cloneNodesFromTemplateSourceElement(elemInstance) {
        switch (ko.utils.tagNameLower(elemInstance)) {
            case 'script':
                return ko.utils.parseHtmlFragment(elemInstance.text);
            case 'textarea':
                return ko.utils.parseHtmlFragment(elemInstance.value);
            case 'template':
                // For browsers with proper <template> element support (i.e., where the .content property
                // gives a document fragment), use that document fragment.
                if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                }
        }

        // Regular elements such as <div>, and <template> elements on old browsers that don't really
        // understand <template> and just treat it as a regular container
        return ko.utils.cloneNodes(elemInstance.childNodes);
    }

    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }

    function isDocumentFragment(obj) {
        if (window['DocumentFragment']) {
            return obj instanceof DocumentFragment;
        } else {
            return obj && obj.nodeType === 11;
        }
    }

    function possiblyGetConfigFromAmd(errorCallback, config, callback) {
        if (typeof config['require'] === 'string') {
            // The config is the value of an AMD module
            if (amdRequire || window['require']) {
                (amdRequire || window['require'])([config['require']], callback);
            } else {
                errorCallback('Uses require, but no AMD loader is present');
            }
        } else {
            callback(config);
        }
    }

    function makeErrorCallback(componentName) {
        return function (message) {
            throw new Error('Component \'' + componentName + '\': ' + message);
        };
    }

    ko.exportSymbol('components.register', ko.components.register);
    ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
    ko.exportSymbol('components.unregister', ko.components.unregister);

    // Expose the default loader so that developers can directly ask it for configuration
    // or to resolve configuration
    ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

    // By default, the default loader is the only registered component loader
    ko.components['loaders'].push(ko.components.defaultLoader);

    // Privately expose the underlying config registry for use in old-IE shim
    ko.components._allRegisteredComponents = defaultConfigRegistry;
})();
(function (undefined) {
    // Overridable API for determining which component name applies to a given node. By overriding this,
    // you can for example map specific tagNames to components that are not preregistered.
    ko.components['getComponentNameForNode'] = function(node) {
        var tagNameLower = ko.utils.tagNameLower(node);
        if (ko.components.isRegistered(tagNameLower)) {
            // Try to determine that this node can be considered a *custom* element; see https://github.com/knockout/knockout/issues/1603
            if (tagNameLower.indexOf('-') != -1 || ('' + node) == "[object HTMLUnknownElement]" || (ko.utils.ieVersion <= 8 && node.tagName === tagNameLower)) {
                return tagNameLower;
            }
        }
    };

    ko.components.addBindingsForCustomElement = function(allBindings, node, bindingContext, valueAccessors) {
        // Determine if it's really a custom element matching a component
        if (node.nodeType === 1) {
            var componentName = ko.components['getComponentNameForNode'](node);
            if (componentName) {
                // It does represent a component, so add a component binding for it
                allBindings = allBindings || {};

                if (allBindings['component']) {
                    // Avoid silently overwriting some other 'component' binding that may already be on the element
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                }

                var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                allBindings['component'] = valueAccessors
                    ? function() { return componentBindingValue; }
                    : componentBindingValue;
            }
        }

        return allBindings;
    }

    var nativeBindingProviderInstance = new ko.bindingProvider();

    function getComponentParamsFromCustomElement(elem, bindingContext) {
        var paramsAttribute = elem.getAttribute('params');

        if (paramsAttribute) {
            var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                rawParamComputedValues = ko.utils.objectMap(params, function(paramValue, paramName) {
                    return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                result = ko.utils.objectMap(rawParamComputedValues, function(paramValueComputed, paramName) {
                    var paramValue = paramValueComputed.peek();
                    // Does the evaluation of the parameter value unwrap any observables?
                    if (!paramValueComputed.isActive()) {
                        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                        return paramValue;
                    } else {
                        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                        // level of observability, and any inner (resulting model value) level of observability.
                        // This means the component doesn't have to worry about multiple unwrapping. If the value is a
                        // writable observable, the computed will also be writable and pass the value on to the observable.
                        return ko.computed({
                            'read': function() {
                                return ko.utils.unwrapObservable(paramValueComputed());
                            },
                            'write': ko.isWriteableObservable(paramValue) && function(value) {
                                paramValueComputed()(value);
                            },
                            disposeWhenNodeIsRemoved: elem
                        });
                    }
                });

            // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
            // This is in case the developer wants to react to outer (binding) observability separately from inner
            // (model value) observability, or in case the model value observable has subobservables.
            if (!result.hasOwnProperty('$raw')) {
                result['$raw'] = rawParamComputedValues;
            }

            return result;
        } else {
            // For consistency, absence of a "params" attribute is treated the same as the presence of
            // any empty one. Otherwise component viewmodels need special code to check whether or not
            // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
            return { '$raw': {} };
        }
    }

    // --------------------------------------------------------------------------------
    // Compatibility code for older (pre-HTML5) IE browsers

    if (ko.utils.ieVersion < 9) {
        // Whenever you preregister a component, enable it as a custom element in the current document
        ko.components['register'] = (function(originalFunction) {
            return function(componentName) {
                document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                return originalFunction.apply(this, arguments);
            }
        })(ko.components['register']);

        // Whenever you create a document fragment, enable all preregistered component names as custom elements
        // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
        document.createDocumentFragment = (function(originalFunction) {
            return function() {
                var newDocFrag = originalFunction(),
                    allComponents = ko.components._allRegisteredComponents;
                for (var componentName in allComponents) {
                    if (allComponents.hasOwnProperty(componentName)) {
                        newDocFrag.createElement(componentName);
                    }
                }
                return newDocFrag;
            };
        })(document.createDocumentFragment);
    }
})();(function(undefined) {

    var componentLoadingOperationUniqueId = 0;

    ko.bindingHandlers['component'] = {
        'init': function(element, valueAccessor, ignored1, ignored2, bindingContext) {
            var currentViewModel,
                currentLoadingOperationId,
                disposeAssociatedComponentViewModel = function () {
                    var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                    if (typeof currentViewModelDispose === 'function') {
                        currentViewModelDispose.call(currentViewModel);
                    }
                    currentViewModel = null;
                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;
                },
                originalChildNodes = ko.utils.makeArray(ko.virtualElements.childNodes(element));

            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

            ko.computed(function () {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    componentName, componentParams;

                if (typeof value === 'string') {
                    componentName = value;
                } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                }

                if (!componentName) {
                    throw new Error('No component name specified');
                }

                var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                ko.components.get(componentName, function(componentDefinition) {
                    // If this is not the current load operation for this element, ignore it.
                    if (currentLoadingOperationId !== loadingOperationId) {
                        return;
                    }

                    // Clean up previous state
                    disposeAssociatedComponentViewModel();

                    // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                    if (!componentDefinition) {
                        throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);
                    var componentViewModel = createViewModel(componentDefinition, element, originalChildNodes, componentParams),
                        childBindingContext = bindingContext['createChildContext'](componentViewModel, /* dataItemAlias */ undefined, function(ctx) {
                            ctx['$component'] = componentViewModel;
                            ctx['$componentTemplateNodes'] = originalChildNodes;
                        });
                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                });
            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };

    ko.virtualElements.allowedBindings['component'] = true;

    function cloneTemplateIntoElement(componentName, componentDefinition, element) {
        var template = componentDefinition['template'];
        if (!template) {
            throw new Error('Component \'' + componentName + '\' has no template');
        }

        var clonedNodesArray = ko.utils.cloneNodes(template);
        ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    }

    function createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
        var componentViewModelFactory = componentDefinition['createViewModel'];
        return componentViewModelFactory
            ? componentViewModelFactory.call(componentDefinition, componentParams, { 'element': element, 'templateNodes': originalChildNodes })
            : componentParams; // Template-only component
    }

})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        ko.utils.objectForEach(value, function(attrName, attrValue) {
            attrValue = ko.utils.unwrapObservable(attrValue);

            // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
            // when someProp is a "no value"-like value (strictly null, false, or undefined)
            // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
            var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
            if (toRemove)
                element.removeAttribute(attrName);

            // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
            // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
            // but instead of figuring out the mode, we'll just set the attribute through the Javascript
            // property for IE <= 8.
            if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                attrName = attrHtmlToJavascriptMap[attrName];
                if (toRemove)
                    element.removeAttribute(attrName);
                else
                    element[attrName] = attrValue;
            } else if (!toRemove) {
                element.setAttribute(attrName, attrValue.toString());
            }

            // Treat "name" specially - although you can think of it as an attribute, it also needs
            // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
            // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
            // entirely, and there's no strong reason to allow for such casing in HTML.
            if (attrName === "name") {
                ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
            }
        });
    }
};
(function() {

ko.bindingHandlers['checked'] = {
    'after': ['value', 'attr'],
    'init': function (element, valueAccessor, allBindings) {
        var checkedValue = ko.pureComputed(function() {
            // Treat "value" like "checkedValue" when it is included with "checked" binding
            if (allBindings['has']('checkedValue')) {
                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
            } else if (allBindings['has']('value')) {
                return ko.utils.unwrapObservable(allBindings.get('value'));
            }

            return element.value;
        });

        function updateModel() {
            // This updates the model value from the view value.
            // It runs in response to DOM events (click) and changes in checkedValue.
            var isChecked = element.checked,
                elemValue = useCheckedValue ? checkedValue() : isChecked;

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial()) {
                return;
            }

            // We can ignore unchecked radio buttons, because some other radio
            // button will be getting checked, and that one can take care of updating state.
            if (isRadio && !isChecked) {
                return;
            }

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (valueIsArray) {
                var writableValue = rawValueIsNonArrayObservable ? modelValue.peek() : modelValue;
                if (oldElemValue !== elemValue) {
                    // When we're responding to the checkedValue changing, and the element is
                    // currently checked, replace the old elem value with the new elem value
                    // in the model array.
                    if (isChecked) {
                        ko.utils.addOrRemoveItem(writableValue, elemValue, true);
                        ko.utils.addOrRemoveItem(writableValue, oldElemValue, false);
                    }

                    oldElemValue = elemValue;
                } else {
                    // When we're responding to the user having checked/unchecked a checkbox,
                    // add/remove the element value to the model array.
                    ko.utils.addOrRemoveItem(writableValue, elemValue, isChecked);
                }
                if (rawValueIsNonArrayObservable && ko.isWriteableObservable(modelValue)) {
                    modelValue(writableValue);
                }
            } else {
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
            }
        };

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (valueIsArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
            } else if (isCheckbox) {
                // When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
                element.checked = modelValue;
            } else {
                // For radio buttons, being checked means that the radio button's value corresponds to the model value
                element.checked = (checkedValue() === modelValue);
            }
        };

        var isCheckbox = element.type == "checkbox",
            isRadio = element.type == "radio";

        // Only bind to check boxes and radio buttons
        if (!isCheckbox && !isRadio) {
            return;
        }

        var rawValue = valueAccessor(),
            valueIsArray = isCheckbox && (ko.utils.unwrapObservable(rawValue) instanceof Array),
            rawValueIsNonArrayObservable = !(valueIsArray && rawValue.push && rawValue.splice),
            oldElemValue = valueIsArray ? checkedValue() : undefined,
            useCheckedValue = isRadio || valueIsArray;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if (isRadio && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

        // Set up two computeds to update the binding:

        // The first responds to changes in the checkedValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "click", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });

        rawValue = undefined;
    }
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
    'update': function (element, valueAccessor) {
        element.value = ko.utils.unwrapObservable(valueAccessor());
    }
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value !== null && typeof value == "object") {
            ko.utils.objectForEach(value, function(className, shouldHaveClass) {
                shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            });
        } else {
            value = ko.utils.stringTrim(String(value || '')); // Make sure we don't try to store or set a non-string value
            ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
            element[classesWrittenByBindingKey] = value;
            ko.utils.toggleDomNodeCssClass(element, value, true);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    }
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var eventsToHandle = valueAccessor() || {};
        ko.utils.objectForEach(eventsToHandle, function(eventName) {
            if (typeof eventName == "string") {
                ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction)
                        return;

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = ko.utils.makeArray(arguments);
                        viewModel = bindingContext['$data'];
                        argsForHandler.unshift(viewModel);
                        handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }

                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }
                });
            }
        });
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindings) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch(e) {
                    // IE9 throws if you access activeElement during page load (see issue #703)
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

            //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
            element[hasfocusLastValue] = isFocused;
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = !!ko.utils.unwrapObservable(valueAccessor());

        if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            value ? element.focus() : element.blur();

            // In IE, the blur method doesn't always cause the element to lose focus (for example, if the window is not in focus).
            // Setting focus to the body element does seem to be reliable in IE, but should only be used if we know that the current
            // element was focused already.
            if (!value && element[hasfocusLastValue]) {
                element.ownerDocument.body.focus();
            }

            // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]);
        }
    }
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var didDisplayOnLastUpdate,
                savedNodes;
            ko.computed(function() {
                var rawValue = valueAccessor(),
                    dataValue = ko.utils.unwrapObservable(rawValue),
                    shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                    isFirstRender = !savedNodes,
                    needsRefresh = isFirstRender || isWith || (shouldDisplay !== didDisplayOnLastUpdate);

                if (needsRefresh) {
                    // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                    if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                        savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                    }

                    if (shouldDisplay) {
                        if (!isFirstRender) {
                            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                        }
                        ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, rawValue) : bindingContext, element);
                    } else {
                        ko.virtualElements.emptyNode(element);
                    }

                    didDisplayOnLastUpdate = shouldDisplay;
                }
            }, null, { disposeWhenNodeIsRemoved: element });
            return { 'controlsDescendantBindings': true };
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */, false /* isNot */,
    function(bindingContext, dataValue) {
        return bindingContext.createStaticChildContext(dataValue);
    }
);
var captionPlaceholder = {};
ko.bindingHandlers['options'] = {
    'init': function(element) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        // Remove all existing <option>s.
        while (element.length > 0) {
            element.remove(0);
        }

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindings) {
        function selectedOptions() {
            return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
        }

        var selectWasPreviouslyEmpty = element.length == 0,
            multiple = element.multiple,
            previousScrollTop = (!selectWasPreviouslyEmpty && multiple) ? element.scrollTop : null,
            unwrappedArray = ko.utils.unwrapObservable(valueAccessor()),
            valueAllowUnset = allBindings.get('valueAllowUnset') && allBindings['has']('value'),
            includeDestroyed = allBindings.get('optionsIncludeDestroyed'),
            arrayToDomNodeChildrenOptions = {},
            captionValue,
            filteredArray,
            previousSelectedValues = [];

        if (!valueAllowUnset) {
            if (multiple) {
                previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
            } else if (element.selectedIndex >= 0) {
                previousSelectedValues.push(ko.selectExtensions.readValue(element.options[element.selectedIndex]));
            }
        }

        if (unwrappedArray) {
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // If caption is included, add it to the array
            if (allBindings['has']('optionsCaption')) {
                captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                // If caption value is null or undefined, don't show a caption
                if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                }
            }
        } else {
            // If a falsy value is provided (e.g. null), we'll simply empty the select element
        }

        function applyToObject(object, predicate, defaultValue) {
            var predicateType = typeof predicate;
            if (predicateType == "function")    // Given a function; run it against the data value
                return predicate(object);
            else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                return object[predicate];
            else                                // Given no optionsText arg; use the data value itself
                return defaultValue;
        }

        // The following functions can run at two different times:
        // The first is when the whole array is being updated directly from this binding handler.
        // The second is when an observable value for a specific array entry is updated.
        // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
        var itemUpdate = false;
        function optionForArrayItem(arrayEntry, index, oldOptions) {
            if (oldOptions.length) {
                previousSelectedValues = !valueAllowUnset && oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
                itemUpdate = true;
            }
            var option = element.ownerDocument.createElement("option");
            if (arrayEntry === captionPlaceholder) {
                ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                ko.selectExtensions.writeValue(option, undefined);
            } else {
                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                ko.utils.setTextContent(option, optionText);
            }
            return [option];
        }

        // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
        // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
        arrayToDomNodeChildrenOptions['beforeRemove'] =
            function (option) {
                element.removeChild(option);
            };

        function setSelectionCallback(arrayEntry, newOptions) {
            if (itemUpdate && valueAllowUnset) {
                // The model value is authoritative, so make sure its value is the one selected
                // There is no need to use dependencyDetection.ignore since setDomNodeChildrenFromArrayMapping does so already.
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else if (previousSelectedValues.length) {
                // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
                // That's why we first added them without selection. Now it's time to set the selection.
                var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                // If this option was changed from being selected during a single-item update, notify the change
                if (itemUpdate && !isSelected) {
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                }
            }
        }

        var callback = setSelectionCallback;
        if (allBindings['has']('optionsAfterRender') && typeof allBindings.get('optionsAfterRender') == "function") {
            callback = function(arrayEntry, newOptions) {
                setSelectionCallback(arrayEntry, newOptions);
                ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
            }
        }

        ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

        ko.dependencyDetection.ignore(function () {
            if (valueAllowUnset) {
                // The model value is authoritative, so make sure its value is the one selected
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else {
                // Determine if the selection has changed as a result of updating the options list
                var selectionChanged;
                if (multiple) {
                    // For a multiple-select box, compare the new selection count to the previous one
                    // But if nothing was selected before, the selection can't have changed
                    selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                } else {
                    // For a single-select box, compare the current value to the previous value
                    // But if nothing was selected before or nothing is selected now, just look for a change in selection
                    selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                        ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                        : (previousSelectedValues.length || element.selectedIndex >= 0);
                }

                // Ensure consistency between model value and selected option.
                // If the dropdown was changed so that selection is no longer the same,
                // notify the value or selectedOptions binding.
                if (selectionChanged) {
                    ko.utils.triggerEvent(element, "change");
                }
            }
        });

        // Workaround for IE bug
        ko.utils.ensureSelectElementIsRenderedCorrectly(element);

        if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
            element.scrollTop = previousScrollTop;
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor()),
            previousScrollTop = element.scrollTop;

        if (newValue && typeof newValue.length == "number") {
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                if (node.selected != isSelected) {      // This check prevents flashing of the select element in IE
                    ko.utils.setOptionNodeSelectionState(node, isSelected);
                }
            });
        }

        element.scrollTop = previousScrollTop;
    }
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function(styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style[styleName] = styleValue;
        });
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(bindingContext['$data'], element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
(function () {

if (window && window.navigator) {
    var parseVersion = function (matches) {
        if (matches) {
            return parseFloat(matches[1]);
        }
    };

    // Detect various browser versions because some old versions don't fully support the 'input' event
    var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
        userAgent = window.navigator.userAgent,
        safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
        firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
}

// IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
// But it does fire the 'selectionchange' event on many of those, presumably because the
// cursor is moving and that counts as the selection changing. The 'selectionchange' event is
// fired at the document level only and doesn't directly indicate which element changed. We
// set up just one event handler for the document and use 'activeElement' to determine which
// element was changed.
if (ko.utils.ieVersion < 10) {
    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
        selectionChangeHandlerName = ko.utils.domData.nextKey();
    var selectionChangeHandler = function(event) {
        var target = this.activeElement,
            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
        if (handler) {
            handler(event);
        }
    };
    var registerForSelectionChangeEvent = function (element, handler) {
        var ownerDoc = element.ownerDocument;
        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
        }
        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
    };
}

ko.bindingHandlers['textInput'] = {
    'init': function (element, valueAccessor, allBindings) {

        var previousElementValue = element.value,
            timeoutHandle,
            elementValueBeforeEvent;

        var updateModel = function (event) {
            clearTimeout(timeoutHandle);
            elementValueBeforeEvent = timeoutHandle = undefined;

            var elementValue = element.value;
            if (previousElementValue !== elementValue) {
                // Provide a way for tests to know exactly which event was processed
                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                previousElementValue = elementValue;
                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
            }
        };

        var deferUpdateModel = function (event) {
            if (!timeoutHandle) {
                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                // event firing and the updateModel function running. This allows us to ignore model
                // updates that are from the previous state of the element, usually due to techniques
                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                elementValueBeforeEvent = element.value;
                var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;
                timeoutHandle = ko.utils.setTimeout(handler, 4);
            }
        };

        // IE9 will mess up the DOM if you handle events synchronously which results in DOM changes (such as other bindings);
        // so we'll make sure all updates are asynchronous
        var ieUpdateModel = ko.utils.ieVersion == 9 ? deferUpdateModel : updateModel;

        var updateView = function () {
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (modelValue === null || modelValue === undefined) {
                modelValue = '';
            }

            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                ko.utils.setTimeout(updateView, 4);
                return;
            }

            // Update the element only if the element and model are different. On some browsers, updating the value
            // will move the cursor to the end of the input, which would be bad while the user is typing.
            if (element.value !== modelValue) {
                previousElementValue = modelValue;  // Make sure we ignore events (propertychange) that result from updating the value
                element.value = modelValue;
            }
        };

        var onEvent = function (event, handler) {
            ko.utils.registerEventHandler(element, event, handler);
        };

        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
            // Provide a way for tests to specify exactly which events are bound
            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function(eventName) {
                if (eventName.slice(0,5) == 'after') {
                    onEvent(eventName.slice(5), deferUpdateModel);
                } else {
                    onEvent(eventName, updateModel);
                }
            });
        } else {
            if (ko.utils.ieVersion < 10) {
                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                // but that's an acceptable compromise for this binding. IE 9 does support 'input', but since it doesn't fire it
                // when using autocomplete, we'll use 'propertychange' for it also.
                onEvent('propertychange', function(event) {
                    if (event.propertyName === 'value') {
                        ieUpdateModel(event);
                    }
                });

                if (ko.utils.ieVersion == 8) {
                    // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                    // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                    // events too.
                    onEvent('keyup', updateModel);      // A single keystoke
                    onEvent('keydown', updateModel);    // The first character when a key is held down
                }
                if (ko.utils.ieVersion >= 8) {
                    // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                    // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                    // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                    // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                    // These are also needed in IE8 because of the bug described above.
                    registerForSelectionChangeEvent(element, ieUpdateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                    onEvent('dragend', deferUpdateModel);
                }
            } else {
                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                // through the user interface.
                onEvent('input', updateModel);

                if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                    // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                    // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                    onEvent('keydown', deferUpdateModel);
                    onEvent('paste', deferUpdateModel);
                    onEvent('cut', deferUpdateModel);
                } else if (operaVersion < 11) {
                    // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                    // We can try to catch some of those using 'keydown'.
                    onEvent('keydown', deferUpdateModel);
                } else if (firefoxVersion < 4.0) {
                    // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                    onEvent('DOMAutoComplete', updateModel);

                    // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                    onEvent('dragdrop', updateModel);       // <3.5
                    onEvent('drop', updateModel);           // 3.5
                }
            }
        }

        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
        onEvent('change', updateModel);

        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['textInput'] = true;

// textinput is an alias for textInput
ko.bindingHandlers['textinput'] = {
    // preprocess is the only way to set up a full alias
    'preprocess': function (value, name, addBinding) {
        addBinding('textInput', value);
    }
};

})();ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
        if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
            ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
            return;
        }

        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindings.get("valueUpdate");
        var propertyChangedFired = false;
        var elementValueBeforeEvent = null;

        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            elementValueBeforeEvent = null;
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() {
                    // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                    // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                    // at the earliest asynchronous opportunity. We store this temporary information so that
                    // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                    // we can overwrite that model value change with the value the user just typed. Otherwise,
                    // techniques like rateLimit can trigger model changes at critical moments that will
                    // override the user's inputs, causing keystrokes to be lost.
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    ko.utils.setTimeout(valueUpdateHandler, 0);
                };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });

        var updateFromModel = function () {
            var newValue = ko.utils.unwrapObservable(valueAccessor());
            var elementValue = ko.selectExtensions.readValue(element);

            if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                ko.utils.setTimeout(updateFromModel, 0);
                return;
            }

            var valueHasChanged = (newValue !== elementValue);

            if (valueHasChanged) {
                if (ko.utils.tagNameLower(element) === "select") {
                    var allowUnset = allBindings.get('valueAllowUnset');
                    var applyValueAction = function () {
                        ko.selectExtensions.writeValue(element, newValue, allowUnset);
                    };
                    applyValueAction();

                    if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                        // because you're not allowed to have a model value that disagrees with a visible UI selection.
                        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                    } else {
                        // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                        // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                        // to apply the value as well.
                        ko.utils.setTimeout(applyValueAction, 0);
                    }
                } else {
                    ko.selectExtensions.writeValue(element, newValue);
                }
            }
        };

        ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            // - templateDocument is the document object of the template
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options, templateDocument);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                var nodeToBind = domNode.nextSibling;
                if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                }
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    // template types
    var templateScript = 1,
        templateTextArea = 2,
        templateTemplate = 3,
        templateElement = 4;

    ko.templateSources.domElement = function(element) {
        this.domElement = element;

        if (element) {
            var tagNameLower = ko.utils.tagNameLower(element);
            this.templateType =
                tagNameLower === "script" ? templateScript :
                tagNameLower === "textarea" ? templateTextArea :
                    // For browsers with proper <template> element support, where the .content property gives a document fragment
                tagNameLower == "template" && element.content && element.content.nodeType === 11 ? templateTemplate :
                templateElement;
        }
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var elemContentsProperty = this.templateType === templateScript ? "text"
                                 : this.templateType === templateTextArea ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
        } else {
            ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
        }
    };

    var templatesDomDataKey = ko.utils.domData.nextKey();
    function getTemplateDomData(element) {
        return ko.utils.domData.get(element, templatesDomDataKey) || {};
    }
    function setTemplateDomData(element, data) {
        ko.utils.domData.set(element, templatesDomDataKey, data);
    }

    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        var element = this.domElement;
        if (arguments.length == 0) {
            var templateData = getTemplateDomData(element),
                containerData = templateData.containerData;
            return containerData || (
                this.templateType === templateTemplate ? element.content :
                this.templateType === templateElement ? element :
                undefined);
        } else {
            var valueToWrite = arguments[0];
            setTemplateDomData(element, {containerData: valueToWrite});
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = getTemplateDomData(this.domElement);
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            setTemplateDomData(this.domElement, {textData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            action(node, nextInQueue);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0],
                lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                parentNode = firstNode.parentNode,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            if (preprocessNode) {
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                        if (node === firstNode)
                            firstNode = newNodes[0] || nextNodeInRange;
                        if (node === lastNode)
                            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                });

                // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                // first node needs to be in the array).
                continuousNodeArray.length = 0;
                if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                    return;
                }
                if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                }
            }

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });

            // Make sure any changes done by applyBindings or unmemoize are reflected in the array
            ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = (firstTargetNode || template || {}).ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
        }

        return renderedNodesArray;
    }

    function resolveTemplateName(template, data, context) {
        // The template can be specified as:
        if (ko.isObservable(template)) {
            // 1. An observable, with string value
            return template();
        } else if (typeof template === 'function') {
            // 2. A function of (data, context) returning a string
            return template(data, context);
        } else {
            // 3. A string
            return template;
        }
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(dataOrBindingContext, null, null, null, { "exportDependencies": true });

                    var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                        renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
                context['$index'] = index;
            });

            var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);

            // release the "cache" variable, so that it can be collected by
            // the GC when its value isn't used from within the bindings anymore.
            arrayItemContext = null;
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

        }, null, { disposeWhenNodeIsRemoved: targetNode });
    };

    var templateComputedDomDataKey = ko.utils.domData.nextKey();
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if (typeof bindingValue == "string" || bindingValue['name']) {
                // It's a named template - clear the element
                ko.virtualElements.emptyNode(element);
            } else if ('nodes' in bindingValue) {
                // We've been given an array of DOM nodes. Save them as the template source.
                // There is no known use case for the node array being an observable array (if the output
                // varies, put that behavior *into* your template - that's what templates are for), and
                // the implementation would be a mess, so assert that it's not observable.
                var nodes = bindingValue['nodes'] || [];
                if (ko.isObservable(nodes)) {
                    throw new Error('The "nodes" option must be a plain, non-observable array.');
                }
                var container = ko.utils.moveCleanedNodesToContainerElement(nodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            } else {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                options = ko.utils.unwrapObservable(value),
                shouldDisplay = true,
                templateComputed = null,
                templateName;

            if (typeof options == "string") {
                templateName = value;
                options = {};
            } else {
                templateName = options['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = ('data' in options) ?
                    bindingContext.createStaticChildContext(options['data'], options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                    bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);
// Go through the items that have been added and deleted and try to find matches between them.
ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
    if (left.length && right.length) {
        var failedCompares, l, r, leftItem, rightItem;
        for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
            for (r = 0; rightItem = right[r]; ++r) {
                if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                    failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                    break;
                }
            }
            failedCompares += r;
        }
    }
};

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, options) {
        // For backward compatibility, if the third arg is actually a bool, interpret
        // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
        options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length < newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                --bigIndex;
                --smlIndex;
                if (!options['sparse']) {
                    editScript.push({
                        'status': "retained",
                        'value': bigArray[bigIndex] });
                }
            }
        }

        // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
        // smlIndexMax keeps the time complexity of this algorithm linear.
        ko.utils.findMovesInArrayComparison(notInBig, notInSml, !options['dontLimitMoves'] && smlIndexMax * 10);

        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.length = 0;
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = ko.utils.domData.nextKey(),
        deletedItemDummyValue = ko.utils.domData.nextKey();

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var newMappingResultIndex = 0;

        var nodesToDelete = [];
        var itemsToProcess = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;

        function itemMovedOrRetained(editScriptIndex, oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (newMappingResultIndex !== oldPosition)
                itemsForMoveCallbacks[editScriptIndex] = mapData;
            // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
            mapData.indexObservable(newMappingResultIndex++);
            ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
            newMappingResult.push(mapData);
            itemsToProcess.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                        ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                            callback(node, i, items[i].arrayEntry);
                        });
                    }
                }
            }
        }

        for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
            movedIndex = editScriptItem['moved'];
            switch (editScriptItem['status']) {
                case "deleted":
                    if (movedIndex === undefined) {
                        mapData = lastMappingResult[lastMappingResultIndex];

                        // Stop tracking changes to the mapping for these nodes
                        if (mapData.dependentObservable) {
                            mapData.dependentObservable.dispose();
                            mapData.dependentObservable = undefined;
                        }

                        // Queue these nodes for later removal
                        if (ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode).length) {
                            if (options['beforeRemove']) {
                                newMappingResult.push(mapData);
                                itemsToProcess.push(mapData);
                                if (mapData.arrayEntry === deletedItemDummyValue) {
                                    mapData = null;
                                } else {
                                    itemsForBeforeRemoveCallbacks[i] = mapData;
                                }
                            }
                            if (mapData) {
                                nodesToDelete.push.apply(nodesToDelete, mapData.mappedNodes);
                            }
                        }
                    }
                    lastMappingResultIndex++;
                    break;

                case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;

                case "added":
                    if (movedIndex !== undefined) {
                        itemMovedOrRetained(i, movedIndex);
                    } else {
                        mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                        if (!isFirstExecution)
                            itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
            }
        }

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                if (node !== nextNode)
                    ko.virtualElements.insertAfter(domNode, node, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
            }
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Replace the stored values of deleted items with a dummy value. This provides two benefits: it marks this item
        // as already "removed" so we won't call beforeRemove for it again, and it ensures that the item won't match up
        // with an actual item in the array and appear as "retained" or "moved".
        for (i = 0; i < itemsForBeforeRemoveCallbacks.length; ++i) {
            if (itemsForBeforeRemoveCallbacks[i]) {
                itemsForBeforeRemoveCallbacks[i].arrayEntry = deletedItemDummyValue;
            }
        }

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText, templateDocument);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if (!jQueryInstance || !(jQueryInstance['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options, templateDocument) {
            templateDocument = templateDocument || document;
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQueryInstance['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](templateDocument.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
        };

        if (jQueryTmplVersion > 0) {
            jQueryInstance['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQueryInstance['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
    ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
})();


/***/ }),

/***/ "./src/Ajax.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export httpGet */
/* harmony export (immutable) */ __webpack_exports__["a"] = httpPost;
function httpGet(url, successCallback, failureCallback) {
    var headers = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        headers[_i - 3] = arguments[_i];
    }
    var ajax = new Ajax();
    ajax.send(url, HttpVerb.GET, null, successCallback, failureCallback, headers);
}
function httpPost(url, data, successCallback, failureCallback) {
    var headers = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        headers[_i - 4] = arguments[_i];
    }
    var ajax = new Ajax();
    ajax.send(url, HttpVerb.POST, data, successCallback, failureCallback, headers);
}
var HttpVerb = /** @class */ (function () {
    function HttpVerb() {
    }
    HttpVerb.CONNECT = 'CONNECT';
    HttpVerb.DELETE = 'DELETE';
    HttpVerb.GET = 'GET';
    HttpVerb.HEAD = 'HEAD';
    HttpVerb.OPTIONS = 'OPTIONS';
    HttpVerb.POST = 'POST';
    HttpVerb.PUT = 'PUT';
    HttpVerb.TRACE = 'TRACE';
    return HttpVerb;
}());
var Ajax = /** @class */ (function () {
    function Ajax() {
    }
    Ajax.prototype.send = function (url, method, data, successCallback, failureCallback, headers) {
        var _this = this;
        var isComplete = false;
        var request = this.getRequestObject();
        var uniqueUrl = this.getCacheBusterUrl(url);
        request.open(method, url, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Accept', 'application/json');
        if (data !== null) {
            request.setRequestHeader('Content-type', 'application/json');
        }
        for (var i = 0; i < headers.length; ++i) {
            request.setRequestHeader(headers[i].name, headers[i].value);
        }
        request.onreadystatechange = function () {
            if (request.readyState == 4 && !isComplete) {
                isComplete = true;
                if (_this.isResponseSuccess(request.status)) {
                    successCallback.call(request, request);
                }
                else {
                    failureCallback.call(request, request);
                }
            }
        };
        if (data !== null) {
            request.send(JSON.stringify(data));
        }
        else {
            request.send();
        }
    };
    Ajax.prototype.getRequestObject = function () {
        var requestObject;
        if (XMLHttpRequest) {
            requestObject = new XMLHttpRequest();
        }
        else {
            try {
                requestObject = new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) {
                try {
                    requestObject = new ActiveXObject('Microsoft.XMLHTTP');
                }
                catch (e) { }
            }
        }
        return requestObject;
    };
    Ajax.prototype.getCacheBusterUrl = function (url) {
        if (url.indexOf('?') > -1) {
            url += '&' + new Date().getTime();
        }
        else {
            url += '?' + new Date().getTime();
        }
        return url;
    };
    Ajax.prototype.isResponseSuccess = function (responseCode) {
        var firstDigit = responseCode.toString().substring(0, 1);
        switch (firstDigit) {
            case '1':
            case '2':
            case '3':
                // Response code is in 100, 200 or 300 range :)
                return true;
            default:
                // Response code is is 400 or 500 range :(
                return false;
        }
    };
    return Ajax;
}());


/***/ }),

/***/ "./src/BaseViewModel.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Types__ = __webpack_require__("./src/Types.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Ajax__ = __webpack_require__("./src/Ajax.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout__ = __webpack_require__("./node_modules/knockout/build/output/knockout-latest.debug.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PubSub__ = __webpack_require__("./src/PubSub.ts");




__WEBPACK_IMPORTED_MODULE_2_knockout__["extenders"].propertyChanged = function (target, extenderContext) {
    if (target) {
        target.subscribe(function (newValue) {
            var domContainer;
            domContainer = document.getElementById(extenderContext.containerId);
            if (!domContainer) {
                throw new Error("ContainerId");
            }
            var viewModel = __WEBPACK_IMPORTED_MODULE_2_knockout__["dataFor"](domContainer);
            var properties = viewModel.configurator.properties;
            var propertyDefinition = __WEBPACK_IMPORTED_MODULE_2_knockout__["utils"].arrayFirst(properties, function (prop) { return prop.originalName == extenderContext.propertyName; });
            var changedContext = new __WEBPACK_IMPORTED_MODULE_0__Types__["c" /* PropertyChangedContext */](extenderContext.propertyName, newValue, viewModel, propertyDefinition);
            __WEBPACK_IMPORTED_MODULE_3__PubSub__["a" /* PubSub */].publish(__WEBPACK_IMPORTED_MODULE_0__Types__["a" /* Events */][__WEBPACK_IMPORTED_MODULE_0__Types__["a" /* Events */].PropertyChanged], changedContext);
        });
    }
};
var BaseViewModel = /** @class */ (function () {
    function BaseViewModel(configurator) {
        this.excludeProps = ["data", "submitText", "canSave", "configurator", "objectState"];
        this.configurator = configurator;
        this.submitText = __WEBPACK_IMPORTED_MODULE_2_knockout__["observable"]("Create")
            .extend({ propertyChanged: new __WEBPACK_IMPORTED_MODULE_0__Types__["d" /* PropertyChangedExtenderContext */](configurator.containerId, "submitText") });
    }
    BaseViewModel.prototype.successCallback = function (context) {
    };
    BaseViewModel.prototype.failureCallback = function (context) {
    };
    BaseViewModel.prototype.executeWebResult = function (context) {
    };
    BaseViewModel.prototype.create = function () {
        __WEBPACK_IMPORTED_MODULE_1__Ajax__["a" /* httpPost */]("/api/savemodel", { id: 1, name: "jhon" }, this.successCallback, this.failureCallback);
    };
    return BaseViewModel;
}());



/***/ }),

/***/ "./src/DefaultViewModel.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DefaultViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Types__ = __webpack_require__("./src/Types.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseViewModel__ = __webpack_require__("./src/BaseViewModel.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout__ = __webpack_require__("./node_modules/knockout/build/output/knockout-latest.debug.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_knockout__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var DefaultViewModel = /** @class */ (function (_super) {
    __extends(DefaultViewModel, _super);
    function DefaultViewModel(configurator, initCallback) {
        var _this = _super.call(this, configurator) || this;
        _this._initCallback = initCallback;
        _this.count = __WEBPACK_IMPORTED_MODULE_2_knockout__["observable"](0);
        _this.phone = __WEBPACK_IMPORTED_MODULE_2_knockout__["observable"]("").extend({
            propertyChanged: new __WEBPACK_IMPORTED_MODULE_0__Types__["d" /* PropertyChangedExtenderContext */](configurator.containerId, "phone")
        });
        return _this;
    }
    DefaultViewModel.prototype.counter = function () {
        var count = this.count();
        console.log("Count:", count);
        count = count + 1;
        this.submitText("Clicked-" + count);
        this.count(count);
    };
    return DefaultViewModel;
}(__WEBPACK_IMPORTED_MODULE_1__BaseViewModel__["a" /* BaseViewModel */]));



/***/ }),

/***/ "./src/Main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DefaultViewModel__ = __webpack_require__("./src/DefaultViewModel.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Types__ = __webpack_require__("./src/Types.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__PubSub__ = __webpack_require__("./src/PubSub.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_knockout__ = __webpack_require__("./node_modules/knockout/build/output/knockout-latest.debug.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_knockout__);




// dom element id
var containerId = "container";
var prop1 = {
    id: "1",
    inputType: __WEBPACK_IMPORTED_MODULE_1__Types__["b" /* InputType */].Text,
    label: "User Fullname",
    name: "Fullname",
    originalName: "fullname",
    type: "String"
};
var prop2 = {
    id: "2",
    inputType: __WEBPACK_IMPORTED_MODULE_1__Types__["b" /* InputType */].Text,
    label: "Phone Number",
    name: "Phone Number",
    originalName: "phone",
    type: "String"
};
var properties = [prop1, prop2];
var configurator = new __WEBPACK_IMPORTED_MODULE_1__Types__["e" /* ViewModelConfigurator */](containerId);
configurator.properties = [prop1, prop2];
var viewModel = new __WEBPACK_IMPORTED_MODULE_0__DefaultViewModel__["a" /* DefaultViewModel */](configurator, function (model) {
    console.log("init callback", model);
});
window.viewModel = viewModel;
for (var key in viewModel) {
    console.log("instance prop name:", key);
}
__WEBPACK_IMPORTED_MODULE_2__PubSub__["a" /* PubSub */].subscribe(__WEBPACK_IMPORTED_MODULE_1__Types__["a" /* Events */][__WEBPACK_IMPORTED_MODULE_1__Types__["a" /* Events */].PropertyChanged], function (topic, context) {
    console.log("PubSub PropertyChanged: ", context);
});
window.PubSub = __WEBPACK_IMPORTED_MODULE_2__PubSub__["a" /* PubSub */];
// apply bindings
__WEBPACK_IMPORTED_MODULE_3_knockout__["applyBindings"](viewModel, document.getElementById(containerId));


/***/ }),

/***/ "./src/PubSub.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PubSub; });
var PubSub;
(function (PubSub) {
    var topics = {};
    var subUid = -1;
    function publish(topic, context) {
        if (!topics[topic]) {
            return false;
        }
        setTimeout(function () {
            var subscribers = topics[topic], len = subscribers ? subscribers.length : 0;
            while (len--) {
                subscribers[len].func(topic, context);
            }
        }, 0);
        return true;
    }
    PubSub.publish = publish;
    function subscribe(topic, func) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    }
    PubSub.subscribe = subscribe;
    function unsubscribe(token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }
    PubSub.unsubscribe = unsubscribe;
})(PubSub || (PubSub = {}));


/***/ }),

/***/ "./src/Types.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ResultState */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Events; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return InputType; });
/* unused harmony export PropertyDefinition */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ViewModelConfigurator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return PropertyChangedContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return PropertyChangedExtenderContext; });
/* unused harmony export ModelValidationResult */
/* unused harmony export WebResult */
/* unused harmony export WebResultOfT */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ResultState;
(function (ResultState) {
    ResultState[ResultState["Unset"] = 0] = "Unset";
    ResultState[ResultState["Success"] = 1] = "Success";
    ResultState[ResultState["Warning"] = 2] = "Warning";
    ResultState[ResultState["Error"] = 3] = "Error";
    ResultState[ResultState["Invalid"] = 4] = "Invalid";
    ResultState[ResultState["Fail"] = 5] = "Fail";
})(ResultState || (ResultState = {}));
var Events;
(function (Events) {
    Events[Events["PropertyChanged"] = 0] = "PropertyChanged";
})(Events || (Events = {}));
var InputType;
(function (InputType) {
    InputType[InputType["CheckBox"] = 0] = "CheckBox";
    InputType[InputType["Hidden"] = 1] = "Hidden";
    InputType[InputType["Password"] = 2] = "Password";
    InputType[InputType["Radio"] = 3] = "Radio";
    InputType[InputType["Text"] = 4] = "Text";
    InputType[InputType["Enum"] = 5] = "Enum";
    InputType[InputType["Select"] = 6] = "Select";
    InputType[InputType["DateTime"] = 7] = "DateTime";
})(InputType || (InputType = {}));
var PropertyDefinition = /** @class */ (function () {
    function PropertyDefinition() {
    }
    return PropertyDefinition;
}());

var ViewModelConfigurator = /** @class */ (function () {
    function ViewModelConfigurator(containerId) {
        this.containerId = containerId;
    }
    return ViewModelConfigurator;
}());

var PropertyChangedContext = /** @class */ (function () {
    function PropertyChangedContext(name, newValue, viewModel, propertyDefinition) {
        this.name = name;
        this.newValue = newValue;
        this.viewModel = viewModel;
        this.propertyDefinition = propertyDefinition;
    }
    return PropertyChangedContext;
}());

var PropertyChangedExtenderContext = /** @class */ (function () {
    function PropertyChangedExtenderContext(containerId, propertyName) {
        this.containerId = containerId;
        this.propertyName = propertyName;
    }
    return PropertyChangedExtenderContext;
}());

var ModelValidationResult = /** @class */ (function () {
    function ModelValidationResult() {
        this.messages = [];
    }
    Object.defineProperty(ModelValidationResult.prototype, "allMessages", {
        get: function () {
            return this.messages.join(",");
        },
        enumerable: true,
        configurable: true
    });
    return ModelValidationResult;
}());

var WebResult = /** @class */ (function () {
    function WebResult() {
        this.duration = 2000;
        this.state = ResultState.Success;
        this.validations = [];
    }
    Object.defineProperty(WebResult.prototype, "isValid", {
        get: function () {
            if (this.state != ResultState.Success || this.validations.length > 0) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebResult.prototype, "resultState", {
        get: function () {
            return ResultState[this.state];
        },
        enumerable: true,
        configurable: true
    });
    return WebResult;
}());

var WebResultOfT = /** @class */ (function (_super) {
    __extends(WebResultOfT, _super);
    function WebResultOfT(instance) {
        var _this = _super.call(this) || this;
        _this.result = instance;
        return _this;
    }
    return WebResultOfT;
}(WebResult));



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDc4Yzg1ZjIyZmZiNTQ0N2VmNjgiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2tub2Nrb3V0L2J1aWxkL291dHB1dC9rbm9ja291dC1sYXRlc3QuZGVidWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FqYXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Jhc2VWaWV3TW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0RlZmF1bHRWaWV3TW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1B1YlN1Yi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQTtBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DLHNGQUFzRixxQkFBcUI7QUFDM0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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SztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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SSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsQ0FBQzs7O09BQUE7SUFDTCw0QkFBQztBQUFELENBQUM7O0FBRUQ7SUFBQTtRQUlJLGFBQVEsR0FBVSxJQUFJLENBQUM7UUFDdkIsVUFBSyxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDeEMsZ0JBQVcsR0FBMkIsRUFBRSxDQUFDO0lBVTdDLENBQUM7SUFURyxzQkFBSSw4QkFBTzthQUFYO1lBQ0ksRUFBRSxFQUFDLElBQUksQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0Qsc0JBQUksa0NBQVc7YUFBZjtZQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQyxDQUFDOzs7T0FBQTtJQUNMLGdCQUFDO0FBQUQsQ0FBQzs7QUFFRDtJQUFxQyxnQ0FBUztJQUUxQyxzQkFBWSxRQUFVO1FBQXRCLFlBQ0ksaUJBQU8sU0FFVjtRQURHLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDOztJQUMzQixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLENBTm9DLFNBQVMsR0FNN0MiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHQ7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIwNzhjODVmMjJmZmI1NDQ3ZWY2OFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyLCAvLyBUT0RPIHJlbW92ZSBpbiB3ZWJwYWNrIDRcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKFwiLi9zcmMvTWFpbi50c1wiKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL01haW4udHNcIik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDc4Yzg1ZjIyZmZiNTQ0N2VmNjgiLCIvKiFcbiAqIEtub2Nrb3V0IEphdmFTY3JpcHQgbGlicmFyeSB2My40LjFcbiAqIChjKSBUaGUgS25vY2tvdXQuanMgdGVhbSAtIGh0dHA6Ly9rbm9ja291dGpzLmNvbS9cbiAqIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4gKi9cblxuKGZ1bmN0aW9uKCl7XG52YXIgREVCVUc9dHJ1ZTtcbihmdW5jdGlvbih1bmRlZmluZWQpe1xuICAgIC8vICgwLCBldmFsKSgndGhpcycpIGlzIGEgcm9idXN0IHdheSBvZiBnZXR0aW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgLy8gRm9yIGRldGFpbHMsIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0MTE5OTg4L3JldHVybi10aGlzLTAtZXZhbHRoaXMvMTQxMjAwMjMjMTQxMjAwMjNcbiAgICB2YXIgd2luZG93ID0gdGhpcyB8fCAoMCwgZXZhbCkoJ3RoaXMnKSxcbiAgICAgICAgZG9jdW1lbnQgPSB3aW5kb3dbJ2RvY3VtZW50J10sXG4gICAgICAgIG5hdmlnYXRvciA9IHdpbmRvd1snbmF2aWdhdG9yJ10sXG4gICAgICAgIGpRdWVyeUluc3RhbmNlID0gd2luZG93W1wialF1ZXJ5XCJdLFxuICAgICAgICBKU09OID0gd2luZG93W1wiSlNPTlwiXTtcbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgLy8gU3VwcG9ydCB0aHJlZSBtb2R1bGUgbG9hZGluZyBzY2VuYXJpb3NcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICAgIC8vIFsxXSBBTUQgYW5vbnltb3VzIG1vZHVsZVxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJywgJ3JlcXVpcmUnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gWzJdIENvbW1vbkpTL05vZGUuanNcbiAgICAgICAgZmFjdG9yeShtb2R1bGVbJ2V4cG9ydHMnXSB8fCBleHBvcnRzKTsgIC8vIG1vZHVsZS5leHBvcnRzIGlzIGZvciBOb2RlLmpzXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gWzNdIE5vIG1vZHVsZSBsb2FkZXIgKHBsYWluIDxzY3JpcHQ+IHRhZykgLSBwdXQgZGlyZWN0bHkgaW4gZ2xvYmFsIG5hbWVzcGFjZVxuICAgICAgICBmYWN0b3J5KHdpbmRvd1sna28nXSA9IHt9KTtcbiAgICB9XG59KGZ1bmN0aW9uKGtvRXhwb3J0cywgYW1kUmVxdWlyZSl7XG4vLyBJbnRlcm5hbGx5LCBhbGwgS08gb2JqZWN0cyBhcmUgYXR0YWNoZWQgdG8ga29FeHBvcnRzIChldmVuIHRoZSBub24tZXhwb3J0ZWQgb25lcyB3aG9zZSBuYW1lcyB3aWxsIGJlIG1pbmlmaWVkIGJ5IHRoZSBjbG9zdXJlIGNvbXBpbGVyKS5cbi8vIEluIHRoZSBmdXR1cmUsIHRoZSBmb2xsb3dpbmcgXCJrb1wiIHZhcmlhYmxlIG1heSBiZSBtYWRlIGRpc3RpbmN0IGZyb20gXCJrb0V4cG9ydHNcIiBzbyB0aGF0IHByaXZhdGUgb2JqZWN0cyBhcmUgbm90IGV4dGVybmFsbHkgcmVhY2hhYmxlLlxudmFyIGtvID0gdHlwZW9mIGtvRXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyBrb0V4cG9ydHMgOiB7fTtcbi8vIEdvb2dsZSBDbG9zdXJlIENvbXBpbGVyIGhlbHBlcnMgKHVzZWQgb25seSB0byBtYWtlIHRoZSBtaW5pZmllZCBmaWxlIHNtYWxsZXIpXG5rby5leHBvcnRTeW1ib2wgPSBmdW5jdGlvbihrb1BhdGgsIG9iamVjdCkge1xuICAgIHZhciB0b2tlbnMgPSBrb1BhdGguc3BsaXQoXCIuXCIpO1xuXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgXCJrb1wiIG1heSBiZWNvbWUgZGlzdGluY3QgZnJvbSBcImtvRXhwb3J0c1wiIChzbyB0aGF0IG5vbi1leHBvcnRlZCBvYmplY3RzIGFyZSBub3QgcmVhY2hhYmxlKVxuICAgIC8vIEF0IHRoYXQgcG9pbnQsIFwidGFyZ2V0XCIgd291bGQgYmUgc2V0IHRvOiAodHlwZW9mIGtvRXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIiA/IGtvRXhwb3J0cyA6IGtvKVxuICAgIHZhciB0YXJnZXQgPSBrbztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKylcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0W3Rva2Vuc1tpXV07XG4gICAgdGFyZ2V0W3Rva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV1dID0gb2JqZWN0O1xufTtcbmtvLmV4cG9ydFByb3BlcnR5ID0gZnVuY3Rpb24ob3duZXIsIHB1YmxpY05hbWUsIG9iamVjdCkge1xuICAgIG93bmVyW3B1YmxpY05hbWVdID0gb2JqZWN0O1xufTtcbmtvLnZlcnNpb24gPSBcIjMuNC4xXCI7XG5cbmtvLmV4cG9ydFN5bWJvbCgndmVyc2lvbicsIGtvLnZlcnNpb24pO1xuLy8gRm9yIGFueSBvcHRpb25zIHRoYXQgbWF5IGFmZmVjdCB2YXJpb3VzIGFyZWFzIG9mIEtub2Nrb3V0IGFuZCBhcmVuJ3QgZGlyZWN0bHkgYXNzb2NpYXRlZCB3aXRoIGRhdGEgYmluZGluZy5cbmtvLm9wdGlvbnMgPSB7XG4gICAgJ2RlZmVyVXBkYXRlcyc6IGZhbHNlLFxuICAgICd1c2VPbmx5TmF0aXZlRXZlbnRzJzogZmFsc2Vcbn07XG5cbi8va28uZXhwb3J0U3ltYm9sKCdvcHRpb25zJywga28ub3B0aW9ucyk7ICAgLy8gJ29wdGlvbnMnIGlzbid0IG1pbmlmaWVkXG5rby51dGlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gb2JqZWN0Rm9yRWFjaChvYmosIGFjdGlvbikge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbihwcm9wLCBvYmpbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGZvcih2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBpZihzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pIHtcbiAgICAgICAgb2JqLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHZhciBjYW5TZXRQcm90b3R5cGUgPSAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgdmFyIGNhblVzZVN5bWJvbHMgPSAhREVCVUcgJiYgdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJztcblxuICAgIC8vIFJlcHJlc2VudCB0aGUga25vd24gZXZlbnQgdHlwZXMgaW4gYSBjb21wYWN0IHdheSwgdGhlbiBhdCBydW50aW1lIHRyYW5zZm9ybSBpdCBpbnRvIGEgaGFzaCB3aXRoIGV2ZW50IG5hbWUgYXMga2V5IChmb3IgZmFzdCBsb29rdXApXG4gICAgdmFyIGtub3duRXZlbnRzID0ge30sIGtub3duRXZlbnRUeXBlc0J5RXZlbnROYW1lID0ge307XG4gICAgdmFyIGtleUV2ZW50VHlwZU5hbWUgPSAobmF2aWdhdG9yICYmIC9GaXJlZm94XFwvMi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpID8gJ0tleWJvYXJkRXZlbnQnIDogJ1VJRXZlbnRzJztcbiAgICBrbm93bkV2ZW50c1trZXlFdmVudFR5cGVOYW1lXSA9IFsna2V5dXAnLCAna2V5ZG93bicsICdrZXlwcmVzcyddO1xuICAgIGtub3duRXZlbnRzWydNb3VzZUV2ZW50cyddID0gWydjbGljaycsICdkYmxjbGljaycsICdtb3VzZWRvd24nLCAnbW91c2V1cCcsICdtb3VzZW1vdmUnLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0JywgJ21vdXNlZW50ZXInLCAnbW91c2VsZWF2ZSddO1xuICAgIG9iamVjdEZvckVhY2goa25vd25FdmVudHMsIGZ1bmN0aW9uKGV2ZW50VHlwZSwga25vd25FdmVudHNGb3JUeXBlKSB7XG4gICAgICAgIGlmIChrbm93bkV2ZW50c0ZvclR5cGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGtub3duRXZlbnRzRm9yVHlwZS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAga25vd25FdmVudFR5cGVzQnlFdmVudE5hbWVba25vd25FdmVudHNGb3JUeXBlW2ldXSA9IGV2ZW50VHlwZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBldmVudHNUaGF0TXVzdEJlUmVnaXN0ZXJlZFVzaW5nQXR0YWNoRXZlbnQgPSB7ICdwcm9wZXJ0eWNoYW5nZSc6IHRydWUgfTsgLy8gV29ya2Fyb3VuZCBmb3IgYW4gSUU5IGlzc3VlIC0gaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy80MDZcblxuICAgIC8vIERldGVjdCBJRSB2ZXJzaW9ucyBmb3IgYnVnIHdvcmthcm91bmRzICh1c2VzIElFIGNvbmRpdGlvbmFscywgbm90IFVBIHN0cmluZywgZm9yIHJvYnVzdG5lc3MpXG4gICAgLy8gTm90ZSB0aGF0LCBzaW5jZSBJRSAxMCBkb2VzIG5vdCBzdXBwb3J0IGNvbmRpdGlvbmFsIGNvbW1lbnRzLCB0aGUgZm9sbG93aW5nIGxvZ2ljIG9ubHkgZGV0ZWN0cyBJRSA8IDEwLlxuICAgIC8vIEN1cnJlbnRseSB0aGlzIGlzIGJ5IGRlc2lnbiwgc2luY2UgSUUgMTArIGJlaGF2ZXMgY29ycmVjdGx5IHdoZW4gdHJlYXRlZCBhcyBhIHN0YW5kYXJkIGJyb3dzZXIuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBmdXR1cmUgbmVlZCB0byBkZXRlY3Qgc3BlY2lmaWMgdmVyc2lvbnMgb2YgSUUxMCssIHdlIHdpbGwgYW1lbmQgdGhpcy5cbiAgICB2YXIgaWVWZXJzaW9uID0gZG9jdW1lbnQgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IDMsIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBpRWxlbXMgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2knKTtcblxuICAgICAgICAvLyBLZWVwIGNvbnN0cnVjdGluZyBjb25kaXRpb25hbCBIVE1MIGJsb2NrcyB1bnRpbCB3ZSBoaXQgb25lIHRoYXQgcmVzb2x2ZXMgdG8gYW4gZW1wdHkgZnJhZ21lbnRcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9ICc8IS0tW2lmIGd0IElFICcgKyAoKyt2ZXJzaW9uKSArICddPjxpPjwvaT48IVtlbmRpZl0tLT4nLFxuICAgICAgICAgICAgaUVsZW1zWzBdXG4gICAgICAgICkge31cbiAgICAgICAgcmV0dXJuIHZlcnNpb24gPiA0ID8gdmVyc2lvbiA6IHVuZGVmaW5lZDtcbiAgICB9KCkpO1xuICAgIHZhciBpc0llNiA9IGllVmVyc2lvbiA9PT0gNixcbiAgICAgICAgaXNJZTcgPSBpZVZlcnNpb24gPT09IDc7XG5cbiAgICBmdW5jdGlvbiBpc0NsaWNrT25DaGVja2FibGVFbGVtZW50KGVsZW1lbnQsIGV2ZW50VHlwZSkge1xuICAgICAgICBpZiAoKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSAhPT0gXCJpbnB1dFwiKSB8fCAhZWxlbWVudC50eXBlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChldmVudFR5cGUudG9Mb3dlckNhc2UoKSAhPSBcImNsaWNrXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGlucHV0VHlwZSA9IGVsZW1lbnQudHlwZTtcbiAgICAgICAgcmV0dXJuIChpbnB1dFR5cGUgPT0gXCJjaGVja2JveFwiKSB8fCAoaW5wdXRUeXBlID09IFwicmFkaW9cIik7XG4gICAgfVxuXG4gICAgLy8gRm9yIGRldGFpbHMgb24gdGhlIHBhdHRlcm4gZm9yIGNoYW5naW5nIG5vZGUgY2xhc3Nlc1xuICAgIC8vIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy8xNTk3XG4gICAgdmFyIGNzc0NsYXNzTmFtZVJlZ2V4ID0gL1xcUysvZztcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZURvbU5vZGVDc3NDbGFzcyhub2RlLCBjbGFzc05hbWVzLCBzaG91bGRIYXZlQ2xhc3MpIHtcbiAgICAgICAgdmFyIGFkZE9yUmVtb3ZlRm47XG4gICAgICAgIGlmIChjbGFzc05hbWVzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUuY2xhc3NMaXN0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGFkZE9yUmVtb3ZlRm4gPSBub2RlLmNsYXNzTGlzdFtzaG91bGRIYXZlQ2xhc3MgPyAnYWRkJyA6ICdyZW1vdmUnXTtcbiAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goY2xhc3NOYW1lcy5tYXRjaChjc3NDbGFzc05hbWVSZWdleCksIGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBhZGRPclJlbW92ZUZuLmNhbGwobm9kZS5jbGFzc0xpc3QsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBub2RlLmNsYXNzTmFtZVsnYmFzZVZhbCddID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIFNWRyB0YWcgLmNsYXNzTmFtZXMgaXMgYW4gU1ZHQW5pbWF0ZWRTdHJpbmcgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICB0b2dnbGVPYmplY3RDbGFzc1Byb3BlcnR5U3RyaW5nKG5vZGUuY2xhc3NOYW1lLCAnYmFzZVZhbCcsIGNsYXNzTmFtZXMsIHNob3VsZEhhdmVDbGFzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vZGUuY2xhc3NOYW1lIG91Z2h0IHRvIGJlIGEgc3RyaW5nLlxuICAgICAgICAgICAgICAgIHRvZ2dsZU9iamVjdENsYXNzUHJvcGVydHlTdHJpbmcobm9kZSwgJ2NsYXNzTmFtZScsIGNsYXNzTmFtZXMsIHNob3VsZEhhdmVDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVPYmplY3RDbGFzc1Byb3BlcnR5U3RyaW5nKG9iaiwgcHJvcCwgY2xhc3NOYW1lcywgc2hvdWxkSGF2ZUNsYXNzKSB7XG4gICAgICAgIC8vIG9iai9wcm9wIGlzIGVpdGhlciBhIG5vZGUvJ2NsYXNzTmFtZScgb3IgYSBTVkdBbmltYXRlZFN0cmluZy8nYmFzZVZhbCcuXG4gICAgICAgIHZhciBjdXJyZW50Q2xhc3NOYW1lcyA9IG9ialtwcm9wXS5tYXRjaChjc3NDbGFzc05hbWVSZWdleCkgfHwgW107XG4gICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChjbGFzc05hbWVzLm1hdGNoKGNzc0NsYXNzTmFtZVJlZ2V4KSwgZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0oY3VycmVudENsYXNzTmFtZXMsIGNsYXNzTmFtZSwgc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9ialtwcm9wXSA9IGN1cnJlbnRDbGFzc05hbWVzLmpvaW4oXCIgXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0OiBbJ2F1dGhlbnRpY2l0eV90b2tlbicsIC9eX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW4oXy4qKT8kL10sXG5cbiAgICAgICAgYXJyYXlGb3JFYWNoOiBmdW5jdGlvbiAoYXJyYXksIGFjdGlvbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgYWN0aW9uKGFycmF5W2ldLCBpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUluZGV4T2Y6IGZ1bmN0aW9uIChhcnJheSwgaXRlbSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYXJyYXksIGl0ZW0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSBpdGVtKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUZpcnN0OiBmdW5jdGlvbiAoYXJyYXksIHByZWRpY2F0ZSwgcHJlZGljYXRlT3duZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChwcmVkaWNhdGVPd25lciwgYXJyYXlbaV0sIGkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlbaV07XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheVJlbW92ZUl0ZW06IGZ1bmN0aW9uIChhcnJheSwgaXRlbVRvUmVtb3ZlKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YoYXJyYXksIGl0ZW1Ub1JlbW92ZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUdldERpc3RpbmN0VmFsdWVzOiBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5hcnJheUluZGV4T2YocmVzdWx0LCBhcnJheVtpXSkgPCAwKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5TWFwOiBmdW5jdGlvbiAoYXJyYXksIG1hcHBpbmcpIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChtYXBwaW5nKGFycmF5W2ldLCBpKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5RmlsdGVyOiBmdW5jdGlvbiAoYXJyYXksIHByZWRpY2F0ZSkge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaV0sIGkpKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5UHVzaEFsbDogZnVuY3Rpb24gKGFycmF5LCB2YWx1ZXNUb1B1c2gpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZXNUb1B1c2ggaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoLmFwcGx5KGFycmF5LCB2YWx1ZXNUb1B1c2gpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdmFsdWVzVG9QdXNoLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaCh2YWx1ZXNUb1B1c2hbaV0pO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE9yUmVtb3ZlSXRlbTogZnVuY3Rpb24oYXJyYXksIHZhbHVlLCBpbmNsdWRlZCkge1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nRW50cnlJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihrby51dGlscy5wZWVrT2JzZXJ2YWJsZShhcnJheSksIHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0VudHJ5SW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluY2x1ZGVkKVxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbmNsdWRlZClcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGV4aXN0aW5nRW50cnlJbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FuU2V0UHJvdG90eXBlOiBjYW5TZXRQcm90b3R5cGUsXG5cbiAgICAgICAgZXh0ZW5kOiBleHRlbmQsXG5cbiAgICAgICAgc2V0UHJvdG90eXBlT2Y6IHNldFByb3RvdHlwZU9mLFxuXG4gICAgICAgIHNldFByb3RvdHlwZU9mT3JFeHRlbmQ6IGNhblNldFByb3RvdHlwZSA/IHNldFByb3RvdHlwZU9mIDogZXh0ZW5kLFxuXG4gICAgICAgIG9iamVjdEZvckVhY2g6IG9iamVjdEZvckVhY2gsXG5cbiAgICAgICAgb2JqZWN0TWFwOiBmdW5jdGlvbihzb3VyY2UsIG1hcHBpbmcpIHtcbiAgICAgICAgICAgIGlmICghc291cmNlKVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gbWFwcGluZyhzb3VyY2VbcHJvcF0sIHByb3AsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfSxcblxuICAgICAgICBlbXB0eURvbU5vZGU6IGZ1bmN0aW9uIChkb21Ob2RlKSB7XG4gICAgICAgICAgICB3aGlsZSAoZG9tTm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAga28ucmVtb3ZlTm9kZShkb21Ob2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdmVDbGVhbmVkTm9kZXNUb0NvbnRhaW5lckVsZW1lbnQ6IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICAgICAgICAvLyBFbnN1cmUgaXQncyBhIHJlYWwgYXJyYXksIGFzIHdlJ3JlIGFib3V0IHRvIHJlcGFyZW50IHRoZSBub2RlcyBhbmRcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IHdhbnQgdGhlIHVuZGVybHlpbmcgY29sbGVjdGlvbiB0byBjaGFuZ2Ugd2hpbGUgd2UncmUgZG9pbmcgdGhhdC5cbiAgICAgICAgICAgIHZhciBub2Rlc0FycmF5ID0ga28udXRpbHMubWFrZUFycmF5KG5vZGVzKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZURvY3VtZW50ID0gKG5vZGVzQXJyYXlbMF0gJiYgbm9kZXNBcnJheVswXS5vd25lckRvY3VtZW50KSB8fCBkb2N1bWVudDtcblxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRlbXBsYXRlRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5vZGVzQXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGtvLmNsZWFuTm9kZShub2Rlc0FycmF5W2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsb25lTm9kZXM6IGZ1bmN0aW9uIChub2Rlc0FycmF5LCBzaG91bGRDbGVhbk5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5vZGVzQXJyYXkubGVuZ3RoLCBuZXdOb2Rlc0FycmF5ID0gW107IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xvbmVkTm9kZSA9IG5vZGVzQXJyYXlbaV0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIG5ld05vZGVzQXJyYXkucHVzaChzaG91bGRDbGVhbk5vZGVzID8ga28uY2xlYW5Ob2RlKGNsb25lZE5vZGUpIDogY2xvbmVkTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3Tm9kZXNBcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREb21Ob2RlQ2hpbGRyZW46IGZ1bmN0aW9uIChkb21Ob2RlLCBjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBrby51dGlscy5lbXB0eURvbU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBpZiAoY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoY2hpbGROb2Rlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVwbGFjZURvbU5vZGVzOiBmdW5jdGlvbiAobm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5LCBuZXdOb2Rlc0FycmF5KSB7XG4gICAgICAgICAgICB2YXIgbm9kZXNUb1JlcGxhY2VBcnJheSA9IG5vZGVUb1JlcGxhY2VPck5vZGVBcnJheS5ub2RlVHlwZSA/IFtub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXldIDogbm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5O1xuICAgICAgICAgICAgaWYgKG5vZGVzVG9SZXBsYWNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRpb25Qb2ludCA9IG5vZGVzVG9SZXBsYWNlQXJyYXlbMF07XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGluc2VydGlvblBvaW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBuZXdOb2Rlc0FycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShuZXdOb2Rlc0FycmF5W2ldLCBpbnNlcnRpb25Qb2ludCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBub2Rlc1RvUmVwbGFjZUFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBrby5yZW1vdmVOb2RlKG5vZGVzVG9SZXBsYWNlQXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmaXhVcENvbnRpbnVvdXNOb2RlQXJyYXk6IGZ1bmN0aW9uKGNvbnRpbnVvdXNOb2RlQXJyYXksIHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIC8vIEJlZm9yZSBhY3Rpbmcgb24gYSBzZXQgb2Ygbm9kZXMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgb3V0cHV0dGVkIGJ5IGEgdGVtcGxhdGUgZnVuY3Rpb24sIHdlIGhhdmUgdG8gcmVjb25jaWxlXG4gICAgICAgICAgICAvLyB0aGVtIGFnYWluc3Qgd2hhdCBpcyBpbiB0aGUgRE9NIHJpZ2h0IG5vdy4gSXQgbWF5IGJlIHRoYXQgc29tZSBvZiB0aGUgbm9kZXMgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZCwgb3IgdGhhdFxuICAgICAgICAgICAgLy8gbmV3IG5vZGVzIG1pZ2h0IGhhdmUgYmVlbiBpbnNlcnRlZCBpbiB0aGUgbWlkZGxlLCBmb3IgZXhhbXBsZSBieSBhIGJpbmRpbmcuIEFsc28sIHRoZXJlIG1heSBwcmV2aW91c2x5IGhhdmUgYmVlblxuICAgICAgICAgICAgLy8gbGVhZGluZyBjb21tZW50IG5vZGVzIChjcmVhdGVkIGJ5IHJld3JpdHRlbiBzdHJpbmctYmFzZWQgdGVtcGxhdGVzKSB0aGF0IGhhdmUgc2luY2UgYmVlbiByZW1vdmVkIGR1cmluZyBiaW5kaW5nLlxuICAgICAgICAgICAgLy8gU28sIHRoaXMgZnVuY3Rpb24gdHJhbnNsYXRlcyB0aGUgb2xkIFwibWFwXCIgb3V0cHV0IGFycmF5IGludG8gaXRzIGJlc3QgZ3Vlc3Mgb2YgdGhlIHNldCBvZiBjdXJyZW50IERPTSBub2Rlcy5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBSdWxlczpcbiAgICAgICAgICAgIC8vICAgW0FdIEFueSBsZWFkaW5nIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgICAgIC8vICAgICAgIFRoZXNlIG1vc3QgbGlrZWx5IGNvcnJlc3BvbmQgdG8gbWVtb2l6YXRpb24gbm9kZXMgdGhhdCB3ZXJlIGFscmVhZHkgcmVtb3ZlZCBkdXJpbmcgYmluZGluZ1xuICAgICAgICAgICAgLy8gICAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9wdWxsLzQ0MFxuICAgICAgICAgICAgLy8gICBbQl0gQW55IHRyYWlsaW5nIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZSBzaG91bGQgYmUgaWdub3JlZFxuICAgICAgICAgICAgLy8gICAgICAgVGhpcyBwcmV2ZW50cyB0aGUgY29kZSBoZXJlIGZyb20gYWRkaW5nIHVucmVsYXRlZCBub2RlcyB0byB0aGUgYXJyYXkgd2hpbGUgcHJvY2Vzc2luZyBydWxlIFtDXVxuICAgICAgICAgICAgLy8gICAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9wdWxsLzE5MDNcbiAgICAgICAgICAgIC8vICAgW0NdIFdlIHdhbnQgdG8gb3V0cHV0IGEgY29udGludW91cyBzZXJpZXMgb2Ygbm9kZXMuIFNvLCBpZ25vcmUgYW55IG5vZGVzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZCxcbiAgICAgICAgICAgIC8vICAgICAgIGFuZCBpbmNsdWRlIGFueSBub2RlcyB0aGF0IGhhdmUgYmVlbiBpbnNlcnRlZCBhbW9uZyB0aGUgcHJldmlvdXMgY29sbGVjdGlvblxuXG4gICAgICAgICAgICBpZiAoY29udGludW91c05vZGVBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgcGFyZW50IG5vZGUgY2FuIGJlIGEgdmlydHVhbCBlbGVtZW50OyBzbyBnZXQgdGhlIHJlYWwgcGFyZW50IG5vZGVcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gKHBhcmVudE5vZGUubm9kZVR5cGUgPT09IDggJiYgcGFyZW50Tm9kZS5wYXJlbnROb2RlKSB8fCBwYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgLy8gUnVsZSBbQV1cbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGludW91c05vZGVBcnJheS5sZW5ndGggJiYgY29udGludW91c05vZGVBcnJheVswXS5wYXJlbnROb2RlICE9PSBwYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnNwbGljZSgwLCAxKTtcblxuICAgICAgICAgICAgICAgIC8vIFJ1bGUgW0JdXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID4gMSAmJiBjb250aW51b3VzTm9kZUFycmF5W2NvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoIC0gMV0ucGFyZW50Tm9kZSAhPT0gcGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5sZW5ndGgtLTtcblxuICAgICAgICAgICAgICAgIC8vIFJ1bGUgW0NdXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbMF0sIGxhc3QgPSBjb250aW51b3VzTm9kZUFycmF5W2NvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2Ugd2l0aCB0aGUgYWN0dWFsIG5ldyBjb250aW51b3VzIG5vZGUgc2V0XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChsYXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGludW91c05vZGVBcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRPcHRpb25Ob2RlU2VsZWN0aW9uU3RhdGU6IGZ1bmN0aW9uIChvcHRpb25Ob2RlLCBpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAvLyBJRTYgc29tZXRpbWVzIHRocm93cyBcInVua25vd24gZXJyb3JcIiBpZiB5b3UgdHJ5IHRvIHdyaXRlIHRvIC5zZWxlY3RlZCBkaXJlY3RseSwgd2hlcmVhcyBGaXJlZm94IHN0cnVnZ2xlcyB3aXRoIHNldEF0dHJpYnV0ZS4gUGljayBvbmUgYmFzZWQgb24gYnJvd3Nlci5cbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24gPCA3KVxuICAgICAgICAgICAgICAgIG9wdGlvbk5vZGUuc2V0QXR0cmlidXRlKFwic2VsZWN0ZWRcIiwgaXNTZWxlY3RlZCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3B0aW9uTm9kZS5zZWxlY3RlZCA9IGlzU2VsZWN0ZWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaW5nVHJpbTogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZyA9PT0gbnVsbCB8fCBzdHJpbmcgPT09IHVuZGVmaW5lZCA/ICcnIDpcbiAgICAgICAgICAgICAgICBzdHJpbmcudHJpbSA/XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZy50cmltKCkgOlxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcudG9TdHJpbmcoKS5yZXBsYWNlKC9eW1xcc1xceGEwXSt8W1xcc1xceGEwXSskL2csICcnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmdTdGFydHNXaXRoOiBmdW5jdGlvbiAoc3RyaW5nLCBzdGFydHNXaXRoKSB7XG4gICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChzdGFydHNXaXRoLmxlbmd0aCA+IHN0cmluZy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RhcnRzV2l0aC5sZW5ndGgpID09PSBzdGFydHNXaXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRvbU5vZGVJc0NvbnRhaW5lZEJ5OiBmdW5jdGlvbiAobm9kZSwgY29udGFpbmVkQnlOb2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gY29udGFpbmVkQnlOb2RlKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDExKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gRml4ZXMgaXNzdWUgIzExNjIgLSBjYW4ndCB1c2Ugbm9kZS5jb250YWlucyBmb3IgZG9jdW1lbnQgZnJhZ21lbnRzIG9uIElFOFxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lZEJ5Tm9kZS5jb250YWlucylcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVkQnlOb2RlLmNvbnRhaW5zKG5vZGUubm9kZVR5cGUgPT09IDMgPyBub2RlLnBhcmVudE5vZGUgOiBub2RlKTtcbiAgICAgICAgICAgIGlmIChjb250YWluZWRCeU5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb250YWluZWRCeU5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24obm9kZSkgJiAxNikgPT0gMTY7XG4gICAgICAgICAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9IGNvbnRhaW5lZEJ5Tm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gISFub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21Ob2RlSXNDb250YWluZWRCeShub2RlLCBub2RlLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhbnlEb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQ6IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gISFrby51dGlscy5hcnJheUZpcnN0KG5vZGVzLCBrby51dGlscy5kb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRhZ05hbWVMb3dlcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRm9yIEhUTUwgZWxlbWVudHMsIHRhZ05hbWUgd2lsbCBhbHdheXMgYmUgdXBwZXIgY2FzZTsgZm9yIFhIVE1MIGVsZW1lbnRzLCBpdCdsbCBiZSBsb3dlciBjYXNlLlxuICAgICAgICAgICAgLy8gUG9zc2libGUgZnV0dXJlIG9wdGltaXphdGlvbjogSWYgd2Uga25vdyBpdCdzIGFuIGVsZW1lbnQgZnJvbSBhbiBYSFRNTCBkb2N1bWVudCAobm90IEhUTUwpLFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBkbyB0aGUgLnRvTG93ZXJDYXNlKCkgYXMgaXQgd2lsbCBhbHdheXMgYmUgbG93ZXIgY2FzZSBhbnl3YXkuXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUgJiYgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2F0Y2hGdW5jdGlvbkVycm9yczogZnVuY3Rpb24gKGRlbGVnYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ga29bJ29uRXJyb3InXSA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvWydvbkVycm9yJ10gJiYga29bJ29uRXJyb3InXShlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IDogZGVsZWdhdGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0VGltZW91dDogZnVuY3Rpb24gKGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGtvLnV0aWxzLmNhdGNoRnVuY3Rpb25FcnJvcnMoaGFuZGxlciksIHRpbWVvdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlZmVyRXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAga29bJ29uRXJyb3InXSAmJiBrb1snb25FcnJvciddKGVycm9yKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnRUeXBlLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgd3JhcHBlZEhhbmRsZXIgPSBrby51dGlscy5jYXRjaEZ1bmN0aW9uRXJyb3JzKGhhbmRsZXIpO1xuXG4gICAgICAgICAgICB2YXIgbXVzdFVzZUF0dGFjaEV2ZW50ID0gaWVWZXJzaW9uICYmIGV2ZW50c1RoYXRNdXN0QmVSZWdpc3RlcmVkVXNpbmdBdHRhY2hFdmVudFtldmVudFR5cGVdO1xuICAgICAgICAgICAgaWYgKCFrby5vcHRpb25zWyd1c2VPbmx5TmF0aXZlRXZlbnRzJ10gJiYgIW11c3RVc2VBdHRhY2hFdmVudCAmJiBqUXVlcnlJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlKGVsZW1lbnQpWydiaW5kJ10oZXZlbnRUeXBlLCB3cmFwcGVkSGFuZGxlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFtdXN0VXNlQXR0YWNoRXZlbnQgJiYgdHlwZW9mIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgd3JhcHBlZEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50LmF0dGFjaEV2ZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0YWNoRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7IHdyYXBwZWRIYW5kbGVyLmNhbGwoZWxlbWVudCwgZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hFdmVudE5hbWUgPSBcIm9uXCIgKyBldmVudFR5cGU7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudChhdHRhY2hFdmVudE5hbWUsIGF0dGFjaEV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICAvLyBJRSBkb2VzIG5vdCBkaXNwb3NlIGF0dGFjaEV2ZW50IGhhbmRsZXJzIGF1dG9tYXRpY2FsbHkgKHVubGlrZSB3aXRoIGFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICAgICAgLy8gc28gdG8gYXZvaWQgbGVha3MsIHdlIGhhdmUgdG8gcmVtb3ZlIHRoZW0gbWFudWFsbHkuIFNlZSBidWcgIzg1NlxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoYXR0YWNoRXZlbnROYW1lLCBhdHRhY2hFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lciBvciBhdHRhY2hFdmVudFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmlnZ2VyRXZlbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudFR5cGUpIHtcbiAgICAgICAgICAgIGlmICghKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZWxlbWVudCBtdXN0IGJlIGEgRE9NIG5vZGUgd2hlbiBjYWxsaW5nIHRyaWdnZXJFdmVudFwiKTtcblxuICAgICAgICAgICAgLy8gRm9yIGNsaWNrIGV2ZW50cyBvbiBjaGVja2JveGVzIGFuZCByYWRpbyBidXR0b25zLCBqUXVlcnkgdG9nZ2xlcyB0aGUgZWxlbWVudCBjaGVja2VkIHN0YXRlICphZnRlciogdGhlXG4gICAgICAgICAgICAvLyBldmVudCBoYW5kbGVyIHJ1bnMgaW5zdGVhZCBvZiAqYmVmb3JlKi4gKFRoaXMgd2FzIGZpeGVkIGluIDEuOSBmb3IgY2hlY2tib3hlcyBidXQgbm90IGZvciByYWRpbyBidXR0b25zLilcbiAgICAgICAgICAgIC8vIElFIGRvZXNuJ3QgY2hhbmdlIHRoZSBjaGVja2VkIHN0YXRlIHdoZW4geW91IHRyaWdnZXIgdGhlIGNsaWNrIGV2ZW50IHVzaW5nIFwiZmlyZUV2ZW50XCIuXG4gICAgICAgICAgICAvLyBJbiBib3RoIGNhc2VzLCB3ZSdsbCB1c2UgdGhlIGNsaWNrIG1ldGhvZCBpbnN0ZWFkLlxuICAgICAgICAgICAgdmFyIHVzZUNsaWNrV29ya2Fyb3VuZCA9IGlzQ2xpY2tPbkNoZWNrYWJsZUVsZW1lbnQoZWxlbWVudCwgZXZlbnRUeXBlKTtcblxuICAgICAgICAgICAgaWYgKCFrby5vcHRpb25zWyd1c2VPbmx5TmF0aXZlRXZlbnRzJ10gJiYgalF1ZXJ5SW5zdGFuY2UgJiYgIXVzZUNsaWNrV29ya2Fyb3VuZCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlKGVsZW1lbnQpWyd0cmlnZ2VyJ10oZXZlbnRUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5kaXNwYXRjaEV2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRDYXRlZ29yeSA9IGtub3duRXZlbnRUeXBlc0J5RXZlbnROYW1lW2V2ZW50VHlwZV0gfHwgXCJIVE1MRXZlbnRzXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KGV2ZW50Q2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5pbml0RXZlbnQoZXZlbnRUeXBlLCB0cnVlLCB0cnVlLCB3aW5kb3csIDAsIDAsIDAsIDAsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3VwcGxpZWQgZWxlbWVudCBkb2Vzbid0IHN1cHBvcnQgZGlzcGF0Y2hFdmVudFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXNlQ2xpY2tXb3JrYXJvdW5kICYmIGVsZW1lbnQuY2xpY2spIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsaWNrKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50LmZpcmVFdmVudCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5maXJlRXZlbnQoXCJvblwiICsgZXZlbnRUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdHJpZ2dlcmluZyBldmVudHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW53cmFwT2JzZXJ2YWJsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28uaXNPYnNlcnZhYmxlKHZhbHVlKSA/IHZhbHVlKCkgOiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBwZWVrT2JzZXJ2YWJsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28uaXNPYnNlcnZhYmxlKHZhbHVlKSA/IHZhbHVlLnBlZWsoKSA6IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZURvbU5vZGVDc3NDbGFzczogdG9nZ2xlRG9tTm9kZUNzc0NsYXNzLFxuXG4gICAgICAgIHNldFRleHRDb250ZW50OiBmdW5jdGlvbihlbGVtZW50LCB0ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh0ZXh0Q29udGVudCk7XG4gICAgICAgICAgICBpZiAoKHZhbHVlID09PSBudWxsKSB8fCAodmFsdWUgPT09IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRoZXJlIHRvIGJlIGV4YWN0bHkgb25lIGNoaWxkOiBhIHRleHQgbm9kZS5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBjaGlsZHJlbiwgbW9yZSB0aGFuIG9uZSwgb3IgaWYgaXQncyBub3QgYSB0ZXh0IG5vZGUsXG4gICAgICAgICAgICAvLyB3ZSdsbCBjbGVhciBldmVyeXRoaW5nIGFuZCBjcmVhdGUgYSBzaW5nbGUgdGV4dCBub2RlLlxuICAgICAgICAgICAgdmFyIGlubmVyVGV4dE5vZGUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIGlmICghaW5uZXJUZXh0Tm9kZSB8fCBpbm5lclRleHROb2RlLm5vZGVUeXBlICE9IDMgfHwga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKGlubmVyVGV4dE5vZGUpKSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBbZWxlbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbm5lclRleHROb2RlLmRhdGEgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAga28udXRpbHMuZm9yY2VSZWZyZXNoKGVsZW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEVsZW1lbnROYW1lOiBmdW5jdGlvbihlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm5hbWUgPSBuYW1lO1xuXG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIElFIDYvNyBpc3N1ZVxuICAgICAgICAgICAgLy8gLSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzE5N1xuICAgICAgICAgICAgLy8gLSBodHRwOi8vd3d3Lm1hdHRzNDExLmNvbS9wb3N0L3NldHRpbmdfdGhlX25hbWVfYXR0cmlidXRlX2luX2llX2RvbS9cbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24gPD0gNykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubWVyZ2VBdHRyaWJ1dGVzKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCI8aW5wdXQgbmFtZT0nXCIgKyBlbGVtZW50Lm5hbWUgKyBcIicvPlwiKSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7fSAvLyBGb3IgSUU5IHdpdGggZG9jIG1vZGUgXCJJRTkgU3RhbmRhcmRzXCIgYW5kIGJyb3dzZXIgbW9kZSBcIklFOSBDb21wYXRpYmlsaXR5IFZpZXdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZvcmNlUmVmcmVzaDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgYW4gSUU5IHJlbmRlcmluZyBidWcgLSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzIwOVxuICAgICAgICAgICAgaWYgKGllVmVyc2lvbiA+PSA5KSB7XG4gICAgICAgICAgICAgICAgLy8gRm9yIHRleHQgbm9kZXMgYW5kIGNvbW1lbnQgbm9kZXMgKG1vc3QgbGlrZWx5IHZpcnR1YWwgZWxlbWVudHMpLCB3ZSB3aWxsIGhhdmUgdG8gcmVmcmVzaCB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW0gPSBub2RlLm5vZGVUeXBlID09IDEgPyBub2RlIDogbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtLnN0eWxlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnpvb20gPSBlbGVtLnN0eWxlLnpvb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5zdXJlU2VsZWN0RWxlbWVudElzUmVuZGVyZWRDb3JyZWN0bHk6IGZ1bmN0aW9uKHNlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIElFOSByZW5kZXJpbmcgYnVnIC0gaXQgZG9lc24ndCByZWxpYWJseSBkaXNwbGF5IGFsbCB0aGUgdGV4dCBpbiBkeW5hbWljYWxseS1hZGRlZCBzZWxlY3QgYm94ZXMgdW5sZXNzIHlvdSBmb3JjZSBpdCB0byByZS1yZW5kZXIgYnkgdXBkYXRpbmcgdGhlIHdpZHRoLlxuICAgICAgICAgICAgLy8gKFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzMxMiwgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81OTA4NDk0L3NlbGVjdC1vbmx5LXNob3dzLWZpcnN0LWNoYXItb2Ytc2VsZWN0ZWQtb3B0aW9uKVxuICAgICAgICAgICAgLy8gQWxzbyBmaXhlcyBJRTcgYW5kIElFOCBidWcgdGhhdCBjYXVzZXMgc2VsZWN0cyB0byBiZSB6ZXJvIHdpZHRoIGlmIGVuY2xvc2VkIGJ5ICdpZicgb3IgJ3dpdGgnLiAoU2VlIGlzc3VlICM4MzkpXG4gICAgICAgICAgICBpZiAoaWVWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsV2lkdGggPSBzZWxlY3RFbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICAgICAgICAgIHNlbGVjdEVsZW1lbnQuc3R5bGUud2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIHNlbGVjdEVsZW1lbnQuc3R5bGUud2lkdGggPSBvcmlnaW5hbFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICAgICAgICAgIG1pbiA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUobWluKTtcbiAgICAgICAgICAgIG1heCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUobWF4KTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBtaW47IGkgPD0gbWF4OyBpKyspXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIG1ha2VBcnJheTogZnVuY3Rpb24oYXJyYXlMaWtlT2JqZWN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5TGlrZU9iamVjdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheUxpa2VPYmplY3RbaV0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlU3ltYm9sT3JTdHJpbmc6IGZ1bmN0aW9uKGlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW5Vc2VTeW1ib2xzID8gU3ltYm9sKGlkZW50aWZpZXIpIDogaWRlbnRpZmllcjtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0llNiA6IGlzSWU2LFxuICAgICAgICBpc0llNyA6IGlzSWU3LFxuICAgICAgICBpZVZlcnNpb24gOiBpZVZlcnNpb24sXG5cbiAgICAgICAgZ2V0Rm9ybUZpZWxkczogZnVuY3Rpb24oZm9ybSwgZmllbGROYW1lKSB7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0ga28udXRpbHMubWFrZUFycmF5KGZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSkuY29uY2F0KGtvLnV0aWxzLm1ha2VBcnJheShmb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGV4dGFyZWFcIikpKTtcbiAgICAgICAgICAgIHZhciBpc01hdGNoaW5nRmllbGQgPSAodHlwZW9mIGZpZWxkTmFtZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZC5uYW1lID09PSBmaWVsZE5hbWUgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkTmFtZS50ZXN0KGZpZWxkLm5hbWUpIH07IC8vIFRyZWF0IGZpZWxkTmFtZSBhcyByZWdleCBvciBvYmplY3QgY29udGFpbmluZyBwcmVkaWNhdGVcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gZmllbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzTWF0Y2hpbmdGaWVsZChmaWVsZHNbaV0pKVxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlcztcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZUpzb246IGZ1bmN0aW9uIChqc29uU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGpzb25TdHJpbmcgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGpzb25TdHJpbmcgPSBrby51dGlscy5zdHJpbmdUcmltKGpzb25TdHJpbmcpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChKU09OICYmIEpTT04ucGFyc2UpIC8vIFVzZSBuYXRpdmUgcGFyc2luZyB3aGVyZSBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG5ldyBGdW5jdGlvbihcInJldHVybiBcIiArIGpzb25TdHJpbmcpKSgpOyAvLyBGYWxsYmFjayBvbiBsZXNzIHNhZmUgcGFyc2luZyBmb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmdpZnlKc29uOiBmdW5jdGlvbiAoZGF0YSwgcmVwbGFjZXIsIHNwYWNlKSB7ICAgLy8gcmVwbGFjZXIgYW5kIHNwYWNlIGFyZSBvcHRpb25hbFxuICAgICAgICAgICAgaWYgKCFKU09OIHx8ICFKU09OLnN0cmluZ2lmeSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBKU09OLnN0cmluZ2lmeSgpLiBTb21lIGJyb3dzZXJzIChlLmcuLCBJRSA8IDgpIGRvbid0IHN1cHBvcnQgaXQgbmF0aXZlbHksIGJ1dCB5b3UgY2FuIG92ZXJjb21lIHRoaXMgYnkgYWRkaW5nIGEgc2NyaXB0IHJlZmVyZW5jZSB0byBqc29uMi5qcywgZG93bmxvYWRhYmxlIGZyb20gaHR0cDovL3d3dy5qc29uLm9yZy9qc29uMi5qc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGEpLCByZXBsYWNlciwgc3BhY2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBvc3RKc29uOiBmdW5jdGlvbiAodXJsT3JGb3JtLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBvcHRpb25zWydwYXJhbXMnXSB8fCB7fTtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlRmllbGRzID0gb3B0aW9uc1snaW5jbHVkZUZpZWxkcyddIHx8IHRoaXMuZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3Q7XG4gICAgICAgICAgICB2YXIgdXJsID0gdXJsT3JGb3JtO1xuXG4gICAgICAgICAgICAvLyBJZiB3ZSB3ZXJlIGdpdmVuIGEgZm9ybSwgdXNlIGl0cyAnYWN0aW9uJyBVUkwgYW5kIHBpY2sgb3V0IGFueSByZXF1ZXN0ZWQgZmllbGQgdmFsdWVzXG4gICAgICAgICAgICBpZigodHlwZW9mIHVybE9yRm9ybSA9PSAnb2JqZWN0JykgJiYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcih1cmxPckZvcm0pID09PSBcImZvcm1cIikpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxGb3JtID0gdXJsT3JGb3JtO1xuICAgICAgICAgICAgICAgIHVybCA9IG9yaWdpbmFsRm9ybS5hY3Rpb247XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluY2x1ZGVGaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLmdldEZvcm1GaWVsZHMob3JpZ2luYWxGb3JtLCBpbmNsdWRlRmllbGRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGZpZWxkcy5sZW5ndGggLSAxOyBqID49IDA7IGotLSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tmaWVsZHNbal0ubmFtZV0gPSBmaWVsZHNbal0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhKTtcbiAgICAgICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGZvcm0uYWN0aW9uID0gdXJsO1xuICAgICAgICAgICAgZm9ybS5tZXRob2QgPSBcInBvc3RcIjtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gU2luY2UgJ2RhdGEnIHRoaXMgaXMgYSBtb2RlbCBvYmplY3QsIHdlIGluY2x1ZGUgYWxsIHByb3BlcnRpZXMgaW5jbHVkaW5nIHRob3NlIGluaGVyaXRlZCBmcm9tIGl0cyBwcm90b3R5cGVcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgaW5wdXQubmFtZSA9IGtleTtcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGtvLnV0aWxzLnN0cmluZ2lmeUpzb24oa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhW2tleV0pKTtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iamVjdEZvckVhY2gocGFyYW1zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIGlucHV0Lm5hbWUgPSBrZXk7XG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICAgICAgICAgIG9wdGlvbnNbJ3N1Ym1pdHRlciddID8gb3B0aW9uc1snc3VibWl0dGVyJ10oZm9ybSkgOiBmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGZvcm0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmb3JtKTsgfSwgMCk7XG4gICAgICAgIH1cbiAgICB9XG59KCkpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzJywga28udXRpbHMpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUZvckVhY2gnLCBrby51dGlscy5hcnJheUZvckVhY2gpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUZpcnN0Jywga28udXRpbHMuYXJyYXlGaXJzdCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5RmlsdGVyJywga28udXRpbHMuYXJyYXlGaWx0ZXIpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUdldERpc3RpbmN0VmFsdWVzJywga28udXRpbHMuYXJyYXlHZXREaXN0aW5jdFZhbHVlcyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5SW5kZXhPZicsIGtvLnV0aWxzLmFycmF5SW5kZXhPZik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5TWFwJywga28udXRpbHMuYXJyYXlNYXApO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheVB1c2hBbGwnLCBrby51dGlscy5hcnJheVB1c2hBbGwpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheVJlbW92ZUl0ZW0nLCBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0pO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5leHRlbmQnLCBrby51dGlscy5leHRlbmQpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5maWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdCcsIGtvLnV0aWxzLmZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZ2V0Rm9ybUZpZWxkcycsIGtvLnV0aWxzLmdldEZvcm1GaWVsZHMpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wZWVrT2JzZXJ2YWJsZScsIGtvLnV0aWxzLnBlZWtPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucG9zdEpzb24nLCBrby51dGlscy5wb3N0SnNvbik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnBhcnNlSnNvbicsIGtvLnV0aWxzLnBhcnNlSnNvbik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyJywga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5zdHJpbmdpZnlKc29uJywga28udXRpbHMuc3RyaW5naWZ5SnNvbik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnJhbmdlJywga28udXRpbHMucmFuZ2UpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MnLCBrby51dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy50cmlnZ2VyRXZlbnQnLCBrby51dGlscy50cmlnZ2VyRXZlbnQpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy51bndyYXBPYnNlcnZhYmxlJywga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLm9iamVjdEZvckVhY2gnLCBrby51dGlscy5vYmplY3RGb3JFYWNoKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYWRkT3JSZW1vdmVJdGVtJywga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuc2V0VGV4dENvbnRlbnQnLCBrby51dGlscy5zZXRUZXh0Q29udGVudCk7XG5rby5leHBvcnRTeW1ib2woJ3Vud3JhcCcsIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUpOyAvLyBDb252ZW5pZW50IHNob3J0aGFuZCwgYmVjYXVzZSB0aGlzIGlzIHVzZWQgc28gY29tbW9ubHlcblxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGVbJ2JpbmQnXSkge1xuICAgIC8vIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGlzIGEgc3RhbmRhcmQgcGFydCBvZiBFQ01BU2NyaXB0IDV0aCBFZGl0aW9uIChEZWNlbWJlciAyMDA5LCBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvcHVibGljYXRpb25zL2ZpbGVzL0VDTUEtU1QvRUNNQS0yNjIucGRmKVxuICAgIC8vIEluIGNhc2UgdGhlIGJyb3dzZXIgZG9lc24ndCBpbXBsZW1lbnQgaXQgbmF0aXZlbHksIHByb3ZpZGUgYSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uLiBUaGlzIGltcGxlbWVudGF0aW9uIGlzIGJhc2VkIG9uIHRoZSBvbmUgaW4gcHJvdG90eXBlLmpzXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlWydiaW5kJ10gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgIHZhciBvcmlnaW5hbEZ1bmN0aW9uID0gdGhpcztcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkob2JqZWN0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWFsQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gcGFydGlhbEFyZ3Muc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkob2JqZWN0LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5rby51dGlscy5kb21EYXRhID0gbmV3IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVuaXF1ZUlkID0gMDtcbiAgICB2YXIgZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZSA9IFwiX19rb19fXCIgKyAobmV3IERhdGUpLmdldFRpbWUoKTtcbiAgICB2YXIgZGF0YVN0b3JlID0ge307XG5cbiAgICBmdW5jdGlvbiBnZXRBbGwobm9kZSwgY3JlYXRlSWZOb3RGb3VuZCkge1xuICAgICAgICB2YXIgZGF0YVN0b3JlS2V5ID0gbm9kZVtkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lXTtcbiAgICAgICAgdmFyIGhhc0V4aXN0aW5nRGF0YVN0b3JlID0gZGF0YVN0b3JlS2V5ICYmIChkYXRhU3RvcmVLZXkgIT09IFwibnVsbFwiKSAmJiBkYXRhU3RvcmVbZGF0YVN0b3JlS2V5XTtcbiAgICAgICAgaWYgKCFoYXNFeGlzdGluZ0RhdGFTdG9yZSkge1xuICAgICAgICAgICAgaWYgKCFjcmVhdGVJZk5vdEZvdW5kKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkYXRhU3RvcmVLZXkgPSBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdID0gXCJrb1wiICsgdW5pcXVlSWQrKztcbiAgICAgICAgICAgIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKG5vZGUsIGtleSkge1xuICAgICAgICAgICAgdmFyIGFsbERhdGFGb3JOb2RlID0gZ2V0QWxsKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiBhbGxEYXRhRm9yTm9kZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogYWxsRGF0YUZvck5vZGVba2V5XTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobm9kZSwga2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgYWN0dWFsbHkgY3JlYXRlIGEgbmV3IGRvbURhdGEga2V5IGlmIHdlIGFyZSBhY3R1YWxseSBkZWxldGluZyBhIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKGdldEFsbChub2RlLCBmYWxzZSkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFsbERhdGFGb3JOb2RlID0gZ2V0QWxsKG5vZGUsIHRydWUpO1xuICAgICAgICAgICAgYWxsRGF0YUZvck5vZGVba2V5XSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBjbGVhcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBkYXRhU3RvcmVLZXkgPSBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgaWYgKGRhdGFTdG9yZUtleSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhU3RvcmVbZGF0YVN0b3JlS2V5XTtcbiAgICAgICAgICAgICAgICBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gRXhwb3NpbmcgXCJkaWQgY2xlYW5cIiBmbGFnIHB1cmVseSBzbyBzcGVjcyBjYW4gaW5mZXIgd2hldGhlciB0aGluZ3MgaGF2ZSBiZWVuIGNsZWFuZWQgdXAgYXMgaW50ZW5kZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0S2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHVuaXF1ZUlkKyspICsgZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbURhdGEnLCBrby51dGlscy5kb21EYXRhKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tRGF0YS5jbGVhcicsIGtvLnV0aWxzLmRvbURhdGEuY2xlYXIpOyAvLyBFeHBvcnRpbmcgb25seSBzbyBzcGVjcyBjYW4gY2xlYXIgdXAgYWZ0ZXIgdGhlbXNlbHZlcyBmdWxseVxuXG5rby51dGlscy5kb21Ob2RlRGlzcG9zYWwgPSBuZXcgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIHZhciBjbGVhbmFibGVOb2RlVHlwZXMgPSB7IDE6IHRydWUsIDg6IHRydWUsIDk6IHRydWUgfTsgICAgICAgLy8gRWxlbWVudCwgQ29tbWVudCwgRG9jdW1lbnRcbiAgICB2YXIgY2xlYW5hYmxlTm9kZVR5cGVzV2l0aERlc2NlbmRhbnRzID0geyAxOiB0cnVlLCA5OiB0cnVlIH07IC8vIEVsZW1lbnQsIERvY3VtZW50XG5cbiAgICBmdW5jdGlvbiBnZXREaXNwb3NlQ2FsbGJhY2tzQ29sbGVjdGlvbihub2RlLCBjcmVhdGVJZk5vdEZvdW5kKSB7XG4gICAgICAgIHZhciBhbGxEaXNwb3NlQ2FsbGJhY2tzID0ga28udXRpbHMuZG9tRGF0YS5nZXQobm9kZSwgZG9tRGF0YUtleSk7XG4gICAgICAgIGlmICgoYWxsRGlzcG9zZUNhbGxiYWNrcyA9PT0gdW5kZWZpbmVkKSAmJiBjcmVhdGVJZk5vdEZvdW5kKSB7XG4gICAgICAgICAgICBhbGxEaXNwb3NlQ2FsbGJhY2tzID0gW107XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBkb21EYXRhS2V5LCBhbGxEaXNwb3NlQ2FsbGJhY2tzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsRGlzcG9zZUNhbGxiYWNrcztcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVzdHJveUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSkge1xuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBkb21EYXRhS2V5LCB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFuU2luZ2xlTm9kZShub2RlKSB7XG4gICAgICAgIC8vIFJ1biBhbGwgdGhlIGRpc3Bvc2UgY2FsbGJhY2tzXG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBnZXREaXNwb3NlQ2FsbGJhY2tzQ29sbGVjdGlvbihub2RlLCBmYWxzZSk7XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTsgLy8gQ2xvbmUsIGFzIHRoZSBhcnJheSBtYXkgYmUgbW9kaWZpZWQgZHVyaW5nIGl0ZXJhdGlvbiAodHlwaWNhbGx5LCBjYWxsYmFja3Mgd2lsbCByZW1vdmUgdGhlbXNlbHZlcylcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrc1tpXShub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVyYXNlIHRoZSBET00gZGF0YVxuICAgICAgICBrby51dGlscy5kb21EYXRhLmNsZWFyKG5vZGUpO1xuXG4gICAgICAgIC8vIFBlcmZvcm0gY2xlYW51cCBuZWVkZWQgYnkgZXh0ZXJuYWwgbGlicmFyaWVzIChjdXJyZW50bHkgb25seSBqUXVlcnksIGJ1dCBjYW4gYmUgZXh0ZW5kZWQpXG4gICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbFtcImNsZWFuRXh0ZXJuYWxEYXRhXCJdKG5vZGUpO1xuXG4gICAgICAgIC8vIENsZWFyIGFueSBpbW1lZGlhdGUtY2hpbGQgY29tbWVudCBub2RlcywgYXMgdGhlc2Ugd291bGRuJ3QgaGF2ZSBiZWVuIGZvdW5kIGJ5XG4gICAgICAgIC8vIG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpIGluIGNsZWFuTm9kZSgpIChjb21tZW50IG5vZGVzIGFyZW4ndCBlbGVtZW50cylcbiAgICAgICAgaWYgKGNsZWFuYWJsZU5vZGVUeXBlc1dpdGhEZXNjZW5kYW50c1tub2RlLm5vZGVUeXBlXSlcbiAgICAgICAgICAgIGNsZWFuSW1tZWRpYXRlQ29tbWVudFR5cGVDaGlsZHJlbihub2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbkltbWVkaWF0ZUNvbW1lbnRUeXBlQ2hpbGRyZW4obm9kZVdpdGhDaGlsZHJlbikge1xuICAgICAgICB2YXIgY2hpbGQsIG5leHRDaGlsZCA9IG5vZGVXaXRoQ2hpbGRyZW4uZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGNoaWxkID0gbmV4dENoaWxkKSB7XG4gICAgICAgICAgICBuZXh0Q2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgICAgICBjbGVhblNpbmdsZU5vZGUoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWRkRGlzcG9zZUNhbGxiYWNrIDogZnVuY3Rpb24obm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIHRydWUpLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZURpc3Bvc2VDYWxsYmFjayA6IGZ1bmN0aW9uKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tzQ29sbGVjdGlvbiA9IGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFja3NDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlSZW1vdmVJdGVtKGNhbGxiYWNrc0NvbGxlY3Rpb24sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzQ29sbGVjdGlvbi5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYW5Ob2RlIDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgLy8gRmlyc3QgY2xlYW4gdGhpcyBub2RlLCB3aGVyZSBhcHBsaWNhYmxlXG4gICAgICAgICAgICBpZiAoY2xlYW5hYmxlTm9kZVR5cGVzW25vZGUubm9kZVR5cGVdKSB7XG4gICAgICAgICAgICAgICAgY2xlYW5TaW5nbGVOb2RlKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gLi4uIHRoZW4gaXRzIGRlc2NlbmRhbnRzLCB3aGVyZSBhcHBsaWNhYmxlXG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuYWJsZU5vZGVUeXBlc1dpdGhEZXNjZW5kYW50c1tub2RlLm5vZGVUeXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDbG9uZSB0aGUgZGVzY2VuZGFudHMgbGlzdCBpbiBjYXNlIGl0IGNoYW5nZXMgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY2VuZGFudHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKGRlc2NlbmRhbnRzLCBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZGVzY2VuZGFudHMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5TaW5nbGVOb2RlKGRlc2NlbmRhbnRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVOb2RlIDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAga28uY2xlYW5Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJjbGVhbkV4dGVybmFsRGF0YVwiIDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgc3VwcG9ydCBmb3IgalF1ZXJ5IGhlcmUgYmVjYXVzZSBpdCdzIHNvIGNvbW1vbmx5IHVzZWQuXG4gICAgICAgICAgICAvLyBNYW55IGpRdWVyeSBwbHVnaW5zIChpbmNsdWRpbmcganF1ZXJ5LnRtcGwpIHN0b3JlIGRhdGEgdXNpbmcgalF1ZXJ5J3MgZXF1aXZhbGVudCBvZiBkb21EYXRhXG4gICAgICAgICAgICAvLyBzbyBub3RpZnkgaXQgdG8gdGVhciBkb3duIGFueSByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBub2RlICYgZGVzY2VuZGFudHMgaGVyZS5cbiAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZSAmJiAodHlwZW9mIGpRdWVyeUluc3RhbmNlWydjbGVhbkRhdGEnXSA9PSBcImZ1bmN0aW9uXCIpKVxuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWydjbGVhbkRhdGEnXShbbm9kZV0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5rby5jbGVhbk5vZGUgPSBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuY2xlYW5Ob2RlOyAvLyBTaG9ydGhhbmQgbmFtZSBmb3IgY29udmVuaWVuY2VcbmtvLnJlbW92ZU5vZGUgPSBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlTm9kZTsgLy8gU2hvcnRoYW5kIG5hbWUgZm9yIGNvbnZlbmllbmNlXG5rby5leHBvcnRTeW1ib2woJ2NsZWFuTm9kZScsIGtvLmNsZWFuTm9kZSk7XG5rby5leHBvcnRTeW1ib2woJ3JlbW92ZU5vZGUnLCBrby5yZW1vdmVOb2RlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tTm9kZURpc3Bvc2FsJywga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjaycsIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2spO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrJywga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZURpc3Bvc2VDYWxsYmFjayk7XG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBub25lID0gWzAsIFwiXCIsIFwiXCJdLFxuICAgICAgICB0YWJsZSA9IFsxLCBcIjx0YWJsZT5cIiwgXCI8L3RhYmxlPlwiXSxcbiAgICAgICAgdGJvZHkgPSBbMiwgXCI8dGFibGU+PHRib2R5PlwiLCBcIjwvdGJvZHk+PC90YWJsZT5cIl0sXG4gICAgICAgIHRyID0gWzMsIFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsIFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCJdLFxuICAgICAgICBzZWxlY3QgPSBbMSwgXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsIFwiPC9zZWxlY3Q+XCJdLFxuICAgICAgICBsb29rdXAgPSB7XG4gICAgICAgICAgICAndGhlYWQnOiB0YWJsZSxcbiAgICAgICAgICAgICd0Ym9keSc6IHRhYmxlLFxuICAgICAgICAgICAgJ3Rmb290JzogdGFibGUsXG4gICAgICAgICAgICAndHInOiB0Ym9keSxcbiAgICAgICAgICAgICd0ZCc6IHRyLFxuICAgICAgICAgICAgJ3RoJzogdHIsXG4gICAgICAgICAgICAnb3B0aW9uJzogc2VsZWN0LFxuICAgICAgICAgICAgJ29wdGdyb3VwJzogc2VsZWN0XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgZm9yIG9sZCBJRSBpZiB5b3UncmUgKm5vdCogdXNpbmcgZWl0aGVyIGpRdWVyeSBvciBpbm5lclNoaXYuIERvZXNuJ3QgYWZmZWN0IG90aGVyIGNhc2VzLlxuICAgICAgICBtYXlSZXF1aXJlQ3JlYXRlRWxlbWVudEhhY2sgPSBrby51dGlscy5pZVZlcnNpb24gPD0gODtcblxuICAgIGZ1bmN0aW9uIGdldFdyYXAodGFncykge1xuICAgICAgICB2YXIgbSA9IHRhZ3MubWF0Y2goL148KFthLXpdKylbID5dLyk7XG4gICAgICAgIHJldHVybiAobSAmJiBsb29rdXBbbVsxXV0pIHx8IG5vbmU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2ltcGxlSHRtbFBhcnNlKGh0bWwsIGRvY3VtZW50Q29udGV4dCkge1xuICAgICAgICBkb2N1bWVudENvbnRleHQgfHwgKGRvY3VtZW50Q29udGV4dCA9IGRvY3VtZW50KTtcbiAgICAgICAgdmFyIHdpbmRvd0NvbnRleHQgPSBkb2N1bWVudENvbnRleHRbJ3BhcmVudFdpbmRvdyddIHx8IGRvY3VtZW50Q29udGV4dFsnZGVmYXVsdFZpZXcnXSB8fCB3aW5kb3c7XG5cbiAgICAgICAgLy8gQmFzZWQgb24galF1ZXJ5J3MgXCJjbGVhblwiIGZ1bmN0aW9uLCBidXQgb25seSBhY2NvdW50aW5nIGZvciB0YWJsZS1yZWxhdGVkIGVsZW1lbnRzLlxuICAgICAgICAvLyBJZiB5b3UgaGF2ZSByZWZlcmVuY2VkIGpRdWVyeSwgdGhpcyB3b24ndCBiZSB1c2VkIGFueXdheSAtIEtPIHdpbGwgdXNlIGpRdWVyeSdzIFwiY2xlYW5cIiBmdW5jdGlvbiBkaXJlY3RseVxuXG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGVyZSdzIHN0aWxsIGFuIGlzc3VlIGluIElFIDwgOSB3aGVyZWJ5IGl0IHdpbGwgZGlzY2FyZCBjb21tZW50IG5vZGVzIHRoYXQgYXJlIHRoZSBmaXJzdCBjaGlsZCBvZlxuICAgICAgICAvLyBhIGRlc2NlbmRhbnQgbm9kZS4gRm9yIGV4YW1wbGU6IFwiPGRpdj48IS0tIG15Y29tbWVudCAtLT5hYmM8L2Rpdj5cIiB3aWxsIGdldCBwYXJzZWQgYXMgXCI8ZGl2PmFiYzwvZGl2PlwiXG4gICAgICAgIC8vIFRoaXMgd29uJ3QgYWZmZWN0IGFueW9uZSB3aG8gaGFzIHJlZmVyZW5jZWQgalF1ZXJ5LCBhbmQgdGhlcmUncyBhbHdheXMgdGhlIHdvcmthcm91bmQgb2YgaW5zZXJ0aW5nIGEgZHVtbXkgbm9kZVxuICAgICAgICAvLyAocG9zc2libHkgYSB0ZXh0IG5vZGUpIGluIGZyb250IG9mIHRoZSBjb21tZW50LiBTbywgS08gZG9lcyBub3QgYXR0ZW1wdCB0byB3b3JrYXJvdW5kIHRoaXMgSUUgaXNzdWUgYXV0b21hdGljYWxseSBhdCBwcmVzZW50LlxuXG4gICAgICAgIC8vIFRyaW0gd2hpdGVzcGFjZSwgb3RoZXJ3aXNlIGluZGV4T2Ygd29uJ3Qgd29yayBhcyBleHBlY3RlZFxuICAgICAgICB2YXIgdGFncyA9IGtvLnV0aWxzLnN0cmluZ1RyaW0oaHRtbCkudG9Mb3dlckNhc2UoKSwgZGl2ID0gZG9jdW1lbnRDb250ZXh0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgICAgICB3cmFwID0gZ2V0V3JhcCh0YWdzKSxcbiAgICAgICAgICAgIGRlcHRoID0gd3JhcFswXTtcblxuICAgICAgICAvLyBHbyB0byBodG1sIGFuZCBiYWNrLCB0aGVuIHBlZWwgb2ZmIGV4dHJhIHdyYXBwZXJzXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBhbHdheXMgcHJlZml4IHdpdGggc29tZSBkdW1teSB0ZXh0LCBiZWNhdXNlIG90aGVyd2lzZSwgSUU8OSB3aWxsIHN0cmlwIG91dCBsZWFkaW5nIGNvbW1lbnQgbm9kZXMgaW4gZGVzY2VuZGFudHMuIFRvdGFsIG1hZG5lc3MuXG4gICAgICAgIHZhciBtYXJrdXAgPSBcImlnbm9yZWQ8ZGl2PlwiICsgd3JhcFsxXSArIGh0bWwgKyB3cmFwWzJdICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3dDb250ZXh0Wydpbm5lclNoaXYnXSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIC8vIE5vdGUgdGhhdCBpbm5lclNoaXYgaXMgZGVwcmVjYXRlZCBpbiBmYXZvdXIgb2YgaHRtbDVzaGl2LiBXZSBzaG91bGQgY29uc2lkZXIgYWRkaW5nXG4gICAgICAgICAgICAvLyBzdXBwb3J0IGZvciBodG1sNXNoaXYgKGV4Y2VwdCBpZiBubyBleHBsaWNpdCBzdXBwb3J0IGlzIG5lZWRlZCwgZS5nLiwgaWYgaHRtbDVzaGl2XG4gICAgICAgICAgICAvLyBzb21laG93IHNoaW1zIHRoZSBuYXRpdmUgQVBJcyBzbyBpdCBqdXN0IHdvcmtzIGFueXdheSlcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCh3aW5kb3dDb250ZXh0Wydpbm5lclNoaXYnXShtYXJrdXApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtYXlSZXF1aXJlQ3JlYXRlRWxlbWVudEhhY2spIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbXktZWxlbWVudCcpIHRyaWNrIHRvIGVuYWJsZSBjdXN0b20gZWxlbWVudHMgaW4gSUU2LThcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHdvcmtzIGlmIHdlIGFzc2lnbiBpbm5lckhUTUwgb24gYW4gZWxlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhhdCBkb2N1bWVudC5cbiAgICAgICAgICAgICAgICBkb2N1bWVudENvbnRleHQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IG1hcmt1cDtcblxuICAgICAgICAgICAgaWYgKG1heVJlcXVpcmVDcmVhdGVFbGVtZW50SGFjaykge1xuICAgICAgICAgICAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZlIHRvIHRoZSByaWdodCBkZXB0aFxuICAgICAgICB3aGlsZSAoZGVwdGgtLSlcbiAgICAgICAgICAgIGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XG5cbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm1ha2VBcnJheShkaXYubGFzdENoaWxkLmNoaWxkTm9kZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGpRdWVyeUh0bWxQYXJzZShodG1sLCBkb2N1bWVudENvbnRleHQpIHtcbiAgICAgICAgLy8galF1ZXJ5J3MgXCJwYXJzZUhUTUxcIiBmdW5jdGlvbiB3YXMgaW50cm9kdWNlZCBpbiBqUXVlcnkgMS44LjAgYW5kIGlzIGEgZG9jdW1lbnRlZCBwdWJsaWMgQVBJLlxuICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2VbJ3BhcnNlSFRNTCddKSB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5SW5zdGFuY2VbJ3BhcnNlSFRNTCddKGh0bWwsIGRvY3VtZW50Q29udGV4dCkgfHwgW107IC8vIEVuc3VyZSB3ZSBhbHdheXMgcmV0dXJuIGFuIGFycmF5IGFuZCBuZXZlciBudWxsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3IgalF1ZXJ5IDwgMS44LjAsIHdlIGZhbGwgYmFjayBvbiB0aGUgdW5kb2N1bWVudGVkIGludGVybmFsIFwiY2xlYW5cIiBmdW5jdGlvbi5cbiAgICAgICAgICAgIHZhciBlbGVtcyA9IGpRdWVyeUluc3RhbmNlWydjbGVhbiddKFtodG1sXSwgZG9jdW1lbnRDb250ZXh0KTtcblxuICAgICAgICAgICAgLy8gQXMgb2YgalF1ZXJ5IDEuNy4xLCBqUXVlcnkgcGFyc2VzIHRoZSBIVE1MIGJ5IGFwcGVuZGluZyBpdCB0byBzb21lIGR1bW15IHBhcmVudCBub2RlcyBoZWxkIGluIGFuIGluLW1lbW9yeSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgICAgICAgIC8vIFVuZm9ydHVuYXRlbHksIGl0IG5ldmVyIGNsZWFycyB0aGUgZHVtbXkgcGFyZW50IG5vZGVzIGZyb20gdGhlIGRvY3VtZW50IGZyYWdtZW50LCBzbyBpdCBsZWFrcyBtZW1vcnkgb3ZlciB0aW1lLlxuICAgICAgICAgICAgLy8gRml4IHRoaXMgYnkgZmluZGluZyB0aGUgdG9wLW1vc3QgZHVtbXkgcGFyZW50IGVsZW1lbnQsIGFuZCBkZXRhY2hpbmcgaXQgZnJvbSBpdHMgb3duZXIgZnJhZ21lbnQuXG4gICAgICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXNbMF0pIHtcbiAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZSB0b3AtbW9zdCBwYXJlbnQgZWxlbWVudCB0aGF0J3MgYSBkaXJlY3QgY2hpbGQgb2YgYSBkb2N1bWVudCBmcmFnbWVudFxuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gZWxlbXNbMF07XG4gICAgICAgICAgICAgICAgd2hpbGUgKGVsZW0ucGFyZW50Tm9kZSAmJiBlbGVtLnBhcmVudE5vZGUubm9kZVR5cGUgIT09IDExIC8qIGkuZS4sIERvY3VtZW50RnJhZ21lbnQgKi8pXG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgLy8gLi4uIHRoZW4gZGV0YWNoIGl0XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0ucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZWxlbXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudCA9IGZ1bmN0aW9uKGh0bWwsIGRvY3VtZW50Q29udGV4dCkge1xuICAgICAgICByZXR1cm4galF1ZXJ5SW5zdGFuY2UgP1xuICAgICAgICAgICAgalF1ZXJ5SHRtbFBhcnNlKGh0bWwsIGRvY3VtZW50Q29udGV4dCkgOiAgIC8vIEFzIGJlbG93LCBiZW5lZml0IGZyb20galF1ZXJ5J3Mgb3B0aW1pc2F0aW9ucyB3aGVyZSBwb3NzaWJsZVxuICAgICAgICAgICAgc2ltcGxlSHRtbFBhcnNlKGh0bWwsIGRvY3VtZW50Q29udGV4dCk7ICAvLyAuLi4gb3RoZXJ3aXNlLCB0aGlzIHNpbXBsZSBsb2dpYyB3aWxsIGRvIGluIG1vc3QgY29tbW9uIGNhc2VzLlxuICAgIH07XG5cbiAgICBrby51dGlscy5zZXRIdG1sID0gZnVuY3Rpb24obm9kZSwgaHRtbCkge1xuICAgICAgICBrby51dGlscy5lbXB0eURvbU5vZGUobm9kZSk7XG5cbiAgICAgICAgLy8gVGhlcmUncyBubyBsZWdpdGltYXRlIHJlYXNvbiB0byBkaXNwbGF5IGEgc3RyaW5naWZpZWQgb2JzZXJ2YWJsZSB3aXRob3V0IHVud3JhcHBpbmcgaXQsIHNvIHdlJ2xsIHVud3JhcCBpdFxuICAgICAgICBodG1sID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShodG1sKTtcblxuICAgICAgICBpZiAoKGh0bWwgIT09IG51bGwpICYmIChodG1sICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGh0bWwgIT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgLy8galF1ZXJ5IGNvbnRhaW5zIGEgbG90IG9mIHNvcGhpc3RpY2F0ZWQgY29kZSB0byBwYXJzZSBhcmJpdHJhcnkgSFRNTCBmcmFnbWVudHMsXG4gICAgICAgICAgICAvLyBmb3IgZXhhbXBsZSA8dHI+IGVsZW1lbnRzIHdoaWNoIGFyZSBub3Qgbm9ybWFsbHkgYWxsb3dlZCB0byBleGlzdCBvbiB0aGVpciBvd24uXG4gICAgICAgICAgICAvLyBJZiB5b3UndmUgcmVmZXJlbmNlZCBqUXVlcnkgd2UnbGwgdXNlIHRoYXQgcmF0aGVyIHRoYW4gZHVwbGljYXRpbmcgaXRzIGNvZGUuXG4gICAgICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnlJbnN0YW5jZShub2RlKVsnaHRtbCddKGh0bWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAuLi4gb3RoZXJ3aXNlLCB1c2UgS08ncyBvd24gcGFyc2luZyBsb2dpYy5cbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkTm9kZXMgPSBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudChodG1sLCBub2RlLm93bmVyRG9jdW1lbnQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyc2VkTm9kZXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQocGFyc2VkTm9kZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucGFyc2VIdG1sRnJhZ21lbnQnLCBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnNldEh0bWwnLCBrby51dGlscy5zZXRIdG1sKTtcblxua28ubWVtb2l6YXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW1vcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gcmFuZG9tTWF4OEhleENoYXJzKCkge1xuICAgICAgICByZXR1cm4gKCgoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMDAwMDApIHwgMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21JZCgpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbU1heDhIZXhDaGFycygpICsgcmFuZG9tTWF4OEhleENoYXJzKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpbmRNZW1vTm9kZXMocm9vdE5vZGUsIGFwcGVuZFRvQXJyYXkpIHtcbiAgICAgICAgaWYgKCFyb290Tm9kZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHJvb3ROb2RlLm5vZGVUeXBlID09IDgpIHtcbiAgICAgICAgICAgIHZhciBtZW1vSWQgPSBrby5tZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0KHJvb3ROb2RlLm5vZGVWYWx1ZSk7XG4gICAgICAgICAgICBpZiAobWVtb0lkICE9IG51bGwpXG4gICAgICAgICAgICAgICAgYXBwZW5kVG9BcnJheS5wdXNoKHsgZG9tTm9kZTogcm9vdE5vZGUsIG1lbW9JZDogbWVtb0lkIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJvb3ROb2RlLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjaGlsZE5vZGVzID0gcm9vdE5vZGUuY2hpbGROb2RlcywgaiA9IGNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGZpbmRNZW1vTm9kZXMoY2hpbGROb2Rlc1tpXSwgYXBwZW5kVG9BcnJheSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBtZW1vaXplOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBjYW4gb25seSBwYXNzIGEgZnVuY3Rpb24gdG8ga28ubWVtb2l6YXRpb24ubWVtb2l6ZSgpXCIpO1xuICAgICAgICAgICAgdmFyIG1lbW9JZCA9IGdlbmVyYXRlUmFuZG9tSWQoKTtcbiAgICAgICAgICAgIG1lbW9zW21lbW9JZF0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiBcIjwhLS1ba29fbWVtbzpcIiArIG1lbW9JZCArIFwiXS0tPlwiO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVubWVtb2l6ZTogZnVuY3Rpb24gKG1lbW9JZCwgY2FsbGJhY2tQYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IG1lbW9zW21lbW9JZF07XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGFueSBtZW1vIHdpdGggSUQgXCIgKyBtZW1vSWQgKyBcIi4gUGVyaGFwcyBpdCdzIGFscmVhZHkgYmVlbiB1bm1lbW9pemVkLlwiKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgY2FsbGJhY2tQYXJhbXMgfHwgW10pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGRlbGV0ZSBtZW1vc1ttZW1vSWRdOyB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzOiBmdW5jdGlvbiAoZG9tTm9kZSwgZXh0cmFDYWxsYmFja1BhcmFtc0FycmF5KSB7XG4gICAgICAgICAgICB2YXIgbWVtb3MgPSBbXTtcbiAgICAgICAgICAgIGZpbmRNZW1vTm9kZXMoZG9tTm9kZSwgbWVtb3MpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBtZW1vcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG1lbW9zW2ldLmRvbU5vZGU7XG4gICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkUGFyYW1zID0gW25vZGVdO1xuICAgICAgICAgICAgICAgIGlmIChleHRyYUNhbGxiYWNrUGFyYW1zQXJyYXkpXG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UHVzaEFsbChjb21iaW5lZFBhcmFtcywgZXh0cmFDYWxsYmFja1BhcmFtc0FycmF5KTtcbiAgICAgICAgICAgICAgICBrby5tZW1vaXphdGlvbi51bm1lbW9pemUobWVtb3NbaV0ubWVtb0lkLCBjb21iaW5lZFBhcmFtcyk7XG4gICAgICAgICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBcIlwiOyAvLyBOZXV0ZXIgdGhpcyBub2RlIHNvIHdlIGRvbid0IHRyeSB0byB1bm1lbW9pemUgaXQgYWdhaW5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7IC8vIElmIHBvc3NpYmxlLCBlcmFzZSBpdCB0b3RhbGx5IChub3QgYWx3YXlzIHBvc3NpYmxlIC0gc29tZW9uZSBlbHNlIG1pZ2h0IGp1c3QgaG9sZCBhIHJlZmVyZW5jZSB0byBpdCB0aGVuIGNhbGwgdW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzIGFnYWluKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlTWVtb1RleHQ6IGZ1bmN0aW9uIChtZW1vVGV4dCkge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gbWVtb1RleHQubWF0Y2goL15cXFtrb19tZW1vXFw6KC4qPylcXF0kLyk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbicsIGtvLm1lbW9pemF0aW9uKTtcbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24ubWVtb2l6ZScsIGtvLm1lbW9pemF0aW9uLm1lbW9pemUpO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi51bm1lbW9pemUnLCBrby5tZW1vaXphdGlvbi51bm1lbW9pemUpO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0Jywga28ubWVtb2l6YXRpb24ucGFyc2VNZW1vVGV4dCk7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cycsIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cyk7XG5rby50YXNrcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjaGVkdWxlcixcbiAgICAgICAgdGFza1F1ZXVlID0gW10sXG4gICAgICAgIHRhc2tRdWV1ZUxlbmd0aCA9IDAsXG4gICAgICAgIG5leHRIYW5kbGUgPSAxLFxuICAgICAgICBuZXh0SW5kZXhUb1Byb2Nlc3MgPSAwO1xuXG4gICAgaWYgKHdpbmRvd1snTXV0YXRpb25PYnNlcnZlciddKSB7XG4gICAgICAgIC8vIENocm9tZSAyNyssIEZpcmVmb3ggMTQrLCBJRSAxMSssIE9wZXJhIDE1KywgU2FmYXJpIDYuMStcbiAgICAgICAgLy8gRnJvbSBodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkICogQ29weXJpZ2h0IChjKSAyMDE0IFBldGthIEFudG9ub3YgKiBMaWNlbnNlOiBNSVRcbiAgICAgICAgc2NoZWR1bGVyID0gKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykub2JzZXJ2ZShkaXYsIHthdHRyaWJ1dGVzOiB0cnVlfSk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyBkaXYuY2xhc3NMaXN0LnRvZ2dsZShcImZvb1wiKTsgfTtcbiAgICAgICAgfSkoc2NoZWR1bGVkUHJvY2Vzcyk7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudCAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gSUUgNi0xMFxuICAgICAgICAvLyBGcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9ZdXp1SlMvc2V0SW1tZWRpYXRlICogQ29weXJpZ2h0IChjKSAyMDEyIEJhcm5lc2FuZG5vYmxlLmNvbSwgbGxjLCBEb25hdm9uIFdlc3QsIGFuZCBEb21lbmljIERlbmljb2xhICogTGljZW5zZTogTUlUXG4gICAgICAgIHNjaGVkdWxlciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzY2hlZHVsZXIgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NUYXNrcygpIHtcbiAgICAgICAgaWYgKHRhc2tRdWV1ZUxlbmd0aCkge1xuICAgICAgICAgICAgLy8gRWFjaCBtYXJrIHJlcHJlc2VudHMgdGhlIGVuZCBvZiBhIGxvZ2ljYWwgZ3JvdXAgb2YgdGFza3MgYW5kIHRoZSBudW1iZXIgb2YgdGhlc2UgZ3JvdXBzIGlzXG4gICAgICAgICAgICAvLyBsaW1pdGVkIHRvIHByZXZlbnQgdW5jaGVja2VkIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgIHZhciBtYXJrID0gdGFza1F1ZXVlTGVuZ3RoLCBjb3VudE1hcmtzID0gMDtcblxuICAgICAgICAgICAgLy8gbmV4dEluZGV4VG9Qcm9jZXNzIGtlZXBzIHRyYWNrIG9mIHdoZXJlIHdlIGFyZSBpbiB0aGUgcXVldWU7IHByb2Nlc3NUYXNrcyBjYW4gYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5IHdpdGhvdXQgaXNzdWVcbiAgICAgICAgICAgIGZvciAodmFyIHRhc2s7IG5leHRJbmRleFRvUHJvY2VzcyA8IHRhc2tRdWV1ZUxlbmd0aDsgKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2sgPSB0YXNrUXVldWVbbmV4dEluZGV4VG9Qcm9jZXNzKytdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXhUb1Byb2Nlc3MgPiBtYXJrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKytjb3VudE1hcmtzID49IDUwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXhUb1Byb2Nlc3MgPSB0YXNrUXVldWVMZW5ndGg7ICAgLy8gc2tpcCBhbGwgdGFza3MgcmVtYWluaW5nIGluIHRoZSBxdWV1ZSBzaW5jZSBhbnkgb2YgdGhlbSBjb3VsZCBiZSBjYXVzaW5nIHRoZSByZWN1cnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5kZWZlckVycm9yKEVycm9yKFwiJ1RvbyBtdWNoIHJlY3Vyc2lvbicgYWZ0ZXIgcHJvY2Vzc2luZyBcIiArIGNvdW50TWFya3MgKyBcIiB0YXNrIGdyb3Vwcy5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyayA9IHRhc2tRdWV1ZUxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZGVmZXJFcnJvcihleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZWRQcm9jZXNzKCkge1xuICAgICAgICBwcm9jZXNzVGFza3MoKTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgcXVldWVcbiAgICAgICAgbmV4dEluZGV4VG9Qcm9jZXNzID0gdGFza1F1ZXVlTGVuZ3RoID0gdGFza1F1ZXVlLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrUHJvY2Vzc2luZygpIHtcbiAgICAgICAga28udGFza3NbJ3NjaGVkdWxlciddKHNjaGVkdWxlZFByb2Nlc3MpO1xuICAgIH1cblxuICAgIHZhciB0YXNrcyA9IHtcbiAgICAgICAgJ3NjaGVkdWxlcic6IHNjaGVkdWxlciwgICAgIC8vIEFsbG93IG92ZXJyaWRpbmcgdGhlIHNjaGVkdWxlclxuXG4gICAgICAgIHNjaGVkdWxlOiBmdW5jdGlvbiAoZnVuYykge1xuICAgICAgICAgICAgaWYgKCF0YXNrUXVldWVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVRhc2tQcm9jZXNzaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhc2tRdWV1ZVt0YXNrUXVldWVMZW5ndGgrK10gPSBmdW5jO1xuICAgICAgICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGhhbmRsZSAtIChuZXh0SGFuZGxlIC0gdGFza1F1ZXVlTGVuZ3RoKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSBuZXh0SW5kZXhUb1Byb2Nlc3MgJiYgaW5kZXggPCB0YXNrUXVldWVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0YXNrUXVldWVbaW5kZXhdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBGb3IgdGVzdGluZyBvbmx5OiByZXNldCB0aGUgcXVldWUgYW5kIHJldHVybiB0aGUgcHJldmlvdXMgcXVldWUgbGVuZ3RoXG4gICAgICAgICdyZXNldEZvclRlc3RpbmcnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gdGFza1F1ZXVlTGVuZ3RoIC0gbmV4dEluZGV4VG9Qcm9jZXNzO1xuICAgICAgICAgICAgbmV4dEluZGV4VG9Qcm9jZXNzID0gdGFza1F1ZXVlTGVuZ3RoID0gdGFza1F1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gbGVuZ3RoO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJ1bkVhcmx5OiBwcm9jZXNzVGFza3NcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRhc2tzO1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd0YXNrcycsIGtvLnRhc2tzKTtcbmtvLmV4cG9ydFN5bWJvbCgndGFza3Muc2NoZWR1bGUnLCBrby50YXNrcy5zY2hlZHVsZSk7XG4vL2tvLmV4cG9ydFN5bWJvbCgndGFza3MuY2FuY2VsJywga28udGFza3MuY2FuY2VsKTsgIFwiY2FuY2VsXCIgaXNuJ3QgbWluaWZpZWRcbmtvLmV4cG9ydFN5bWJvbCgndGFza3MucnVuRWFybHknLCBrby50YXNrcy5ydW5FYXJseSk7XG5rby5leHRlbmRlcnMgPSB7XG4gICAgJ3Rocm90dGxlJzogZnVuY3Rpb24odGFyZ2V0LCB0aW1lb3V0KSB7XG4gICAgICAgIC8vIFRocm90dGxpbmcgbWVhbnMgdHdvIHRoaW5nczpcblxuICAgICAgICAvLyAoMSkgRm9yIGRlcGVuZGVudCBvYnNlcnZhYmxlcywgd2UgdGhyb3R0bGUgKmV2YWx1YXRpb25zKiBzbyB0aGF0LCBubyBtYXR0ZXIgaG93IGZhc3QgaXRzIGRlcGVuZGVuY2llc1xuICAgICAgICAvLyAgICAgbm90aWZ5IHVwZGF0ZXMsIHRoZSB0YXJnZXQgZG9lc24ndCByZS1ldmFsdWF0ZSAoYW5kIGhlbmNlIGRvZXNuJ3Qgbm90aWZ5KSBmYXN0ZXIgdGhhbiBhIGNlcnRhaW4gcmF0ZVxuICAgICAgICB0YXJnZXRbJ3Rocm90dGxlRXZhbHVhdGlvbiddID0gdGltZW91dDtcblxuICAgICAgICAvLyAoMikgRm9yIHdyaXRhYmxlIHRhcmdldHMgKG9ic2VydmFibGVzLCBvciB3cml0YWJsZSBkZXBlbmRlbnQgb2JzZXJ2YWJsZXMpLCB3ZSB0aHJvdHRsZSAqd3JpdGVzKlxuICAgICAgICAvLyAgICAgc28gdGhlIHRhcmdldCBjYW5ub3QgY2hhbmdlIHZhbHVlIHN5bmNocm9ub3VzbHkgb3IgZmFzdGVyIHRoYW4gYSBjZXJ0YWluIHJhdGVcbiAgICAgICAgdmFyIHdyaXRlVGltZW91dEluc3RhbmNlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIGtvLmRlcGVuZGVudE9ic2VydmFibGUoe1xuICAgICAgICAgICAgJ3JlYWQnOiB0YXJnZXQsXG4gICAgICAgICAgICAnd3JpdGUnOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh3cml0ZVRpbWVvdXRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgd3JpdGVUaW1lb3V0SW5zdGFuY2UgPSBrby51dGlscy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ3JhdGVMaW1pdCc6IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgbWV0aG9kLCBsaW1pdEZ1bmN0aW9uO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGltZW91dCA9IG9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gb3B0aW9uc1sndGltZW91dCddO1xuICAgICAgICAgICAgbWV0aG9kID0gb3B0aW9uc1snbWV0aG9kJ107XG4gICAgICAgIH1cblxuICAgICAgICAvLyByYXRlTGltaXQgc3VwZXJzZWRlcyBkZWZlcnJlZCB1cGRhdGVzXG4gICAgICAgIHRhcmdldC5fZGVmZXJVcGRhdGVzID0gZmFsc2U7XG5cbiAgICAgICAgbGltaXRGdW5jdGlvbiA9IG1ldGhvZCA9PSAnbm90aWZ5V2hlbkNoYW5nZXNTdG9wJyA/ICBkZWJvdW5jZSA6IHRocm90dGxlO1xuICAgICAgICB0YXJnZXQubGltaXQoZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiBsaW1pdEZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgICdkZWZlcnJlZCc6IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXFwnZGVmZXJyZWRcXCcgZXh0ZW5kZXIgb25seSBhY2NlcHRzIHRoZSB2YWx1ZSBcXCd0cnVlXFwnLCBiZWNhdXNlIGl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gdHVybiBkZWZlcnJhbCBvZmYgb25jZSBlbmFibGVkLicpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRhcmdldC5fZGVmZXJVcGRhdGVzKSB7XG4gICAgICAgICAgICB0YXJnZXQuX2RlZmVyVXBkYXRlcyA9IHRydWU7XG4gICAgICAgICAgICB0YXJnZXQubGltaXQoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBrby50YXNrcy5jYW5jZWwoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlID0ga28udGFza3Muc2NoZWR1bGUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbJ25vdGlmeVN1YnNjcmliZXJzJ10odW5kZWZpbmVkLCAnZGlydHknKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ25vdGlmeSc6IGZ1bmN0aW9uKHRhcmdldCwgbm90aWZ5V2hlbikge1xuICAgICAgICB0YXJnZXRbXCJlcXVhbGl0eUNvbXBhcmVyXCJdID0gbm90aWZ5V2hlbiA9PSBcImFsd2F5c1wiID9cbiAgICAgICAgICAgIG51bGwgOiAgLy8gbnVsbCBlcXVhbGl0eUNvbXBhcmVyIG1lYW5zIHRvIGFsd2F5cyBub3RpZnlcbiAgICAgICAgICAgIHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsO1xuICAgIH1cbn07XG5cbnZhciBwcmltaXRpdmVUeXBlcyA9IHsgJ3VuZGVmaW5lZCc6MSwgJ2Jvb2xlYW4nOjEsICdudW1iZXInOjEsICdzdHJpbmcnOjEgfTtcbmZ1bmN0aW9uIHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsKGEsIGIpIHtcbiAgICB2YXIgb2xkVmFsdWVJc1ByaW1pdGl2ZSA9IChhID09PSBudWxsKSB8fCAodHlwZW9mKGEpIGluIHByaW1pdGl2ZVR5cGVzKTtcbiAgICByZXR1cm4gb2xkVmFsdWVJc1ByaW1pdGl2ZSA/IChhID09PSBiKSA6IGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0aHJvdHRsZShjYWxsYmFjaywgdGltZW91dCkge1xuICAgIHZhciB0aW1lb3V0SW5zdGFuY2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aW1lb3V0SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJbnN0YW5jZSA9IGtvLnV0aWxzLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXRJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBkZWJvdW5jZShjYWxsYmFjaywgdGltZW91dCkge1xuICAgIHZhciB0aW1lb3V0SW5zdGFuY2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJbnN0YW5jZSk7XG4gICAgICAgIHRpbWVvdXRJbnN0YW5jZSA9IGtvLnV0aWxzLnNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGx5RXh0ZW5kZXJzKHJlcXVlc3RlZEV4dGVuZGVycykge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgIGlmIChyZXF1ZXN0ZWRFeHRlbmRlcnMpIHtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChyZXF1ZXN0ZWRFeHRlbmRlcnMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBleHRlbmRlckhhbmRsZXIgPSBrby5leHRlbmRlcnNba2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXh0ZW5kZXJIYW5kbGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBleHRlbmRlckhhbmRsZXIodGFyZ2V0LCB2YWx1ZSkgfHwgdGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxua28uZXhwb3J0U3ltYm9sKCdleHRlbmRlcnMnLCBrby5leHRlbmRlcnMpO1xuXG5rby5zdWJzY3JpcHRpb24gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYWxsYmFjaywgZGlzcG9zZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmRpc3Bvc2VDYWxsYmFjayA9IGRpc3Bvc2VDYWxsYmFjaztcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eSh0aGlzLCAnZGlzcG9zZScsIHRoaXMuZGlzcG9zZSk7XG59O1xua28uc3Vic2NyaXB0aW9uLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgdGhpcy5kaXNwb3NlQ2FsbGJhY2soKTtcbn07XG5cbmtvLnN1YnNjcmliYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZk9yRXh0ZW5kKHRoaXMsIGtvX3N1YnNjcmliYWJsZV9mbik7XG4gICAga29fc3Vic2NyaWJhYmxlX2ZuLmluaXQodGhpcyk7XG59XG5cbnZhciBkZWZhdWx0RXZlbnQgPSBcImNoYW5nZVwiO1xuXG4vLyBNb3ZlZCBvdXQgb2YgXCJsaW1pdFwiIHRvIGF2b2lkIHRoZSBleHRyYSBjbG9zdXJlXG5mdW5jdGlvbiBsaW1pdE5vdGlmeVN1YnNjcmliZXJzKHZhbHVlLCBldmVudCkge1xuICAgIGlmICghZXZlbnQgfHwgZXZlbnQgPT09IGRlZmF1bHRFdmVudCkge1xuICAgICAgICB0aGlzLl9saW1pdENoYW5nZSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChldmVudCA9PT0gJ2JlZm9yZUNoYW5nZScpIHtcbiAgICAgICAgdGhpcy5fbGltaXRCZWZvcmVDaGFuZ2UodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX29yaWdOb3RpZnlTdWJzY3JpYmVycyh2YWx1ZSwgZXZlbnQpO1xuICAgIH1cbn1cblxudmFyIGtvX3N1YnNjcmliYWJsZV9mbiA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZS5fc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgICAgICBpbnN0YW5jZS5fdmVyc2lvbk51bWJlciA9IDE7XG4gICAgfSxcblxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKGNhbGxiYWNrLCBjYWxsYmFja1RhcmdldCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgZGVmYXVsdEV2ZW50O1xuICAgICAgICB2YXIgYm91bmRDYWxsYmFjayA9IGNhbGxiYWNrVGFyZ2V0ID8gY2FsbGJhY2suYmluZChjYWxsYmFja1RhcmdldCkgOiBjYWxsYmFjaztcblxuICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IGtvLnN1YnNjcmlwdGlvbihzZWxmLCBib3VuZENhbGxiYWNrLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0oc2VsZi5fc3Vic2NyaXB0aW9uc1tldmVudF0sIHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICBpZiAoc2VsZi5hZnRlclN1YnNjcmlwdGlvblJlbW92ZSlcbiAgICAgICAgICAgICAgICBzZWxmLmFmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHNlbGYuYmVmb3JlU3Vic2NyaXB0aW9uQWRkKVxuICAgICAgICAgICAgc2VsZi5iZWZvcmVTdWJzY3JpcHRpb25BZGQoZXZlbnQpO1xuXG4gICAgICAgIGlmICghc2VsZi5fc3Vic2NyaXB0aW9uc1tldmVudF0pXG4gICAgICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XSA9IFtdO1xuICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XS5wdXNoKHN1YnNjcmlwdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9LFxuXG4gICAgXCJub3RpZnlTdWJzY3JpYmVyc1wiOiBmdW5jdGlvbiAodmFsdWVUb05vdGlmeSwgZXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCBkZWZhdWx0RXZlbnQ7XG4gICAgICAgIGlmIChldmVudCA9PT0gZGVmYXVsdEV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnNpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oYXNTdWJzY3JpcHRpb25zRm9yRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uYmVnaW4oKTsgLy8gQmVnaW4gc3VwcHJlc3NpbmcgZGVwZW5kZW5jeSBkZXRlY3Rpb24gKGJ5IHNldHRpbmcgdGhlIHRvcCBmcmFtZSB0byB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IHRoaXMuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLnNsaWNlKDApLCBpID0gMCwgc3Vic2NyaXB0aW9uOyBzdWJzY3JpcHRpb24gPSBhW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gY2FzZSBhIHN1YnNjcmlwdGlvbiB3YXMgZGlzcG9zZWQgZHVyaW5nIHRoZSBhcnJheUZvckVhY2ggY3ljbGUsIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBpc0Rpc3Bvc2VkIG9uIGVhY2ggc3Vic2NyaXB0aW9uIGJlZm9yZSBpbnZva2luZyBpdHMgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJzY3JpcHRpb24uaXNEaXNwb3NlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5jYWxsYmFjayh2YWx1ZVRvTm90aWZ5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7IC8vIEVuZCBzdXBwcmVzc2luZyBkZXBlbmRlbmN5IGRldGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFZlcnNpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnNpb25OdW1iZXI7XG4gICAgfSxcblxuICAgIGhhc0NoYW5nZWQ6IGZ1bmN0aW9uICh2ZXJzaW9uVG9DaGVjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWZXJzaW9uKCkgIT09IHZlcnNpb25Ub0NoZWNrO1xuICAgIH0sXG5cbiAgICB1cGRhdGVWZXJzaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICsrdGhpcy5fdmVyc2lvbk51bWJlcjtcbiAgICB9LFxuXG4gICAgbGltaXQ6IGZ1bmN0aW9uKGxpbWl0RnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLCBzZWxmSXNPYnNlcnZhYmxlID0ga28uaXNPYnNlcnZhYmxlKHNlbGYpLFxuICAgICAgICAgICAgaWdub3JlQmVmb3JlQ2hhbmdlLCBwcmV2aW91c1ZhbHVlLCBwZW5kaW5nVmFsdWUsIGJlZm9yZUNoYW5nZSA9ICdiZWZvcmVDaGFuZ2UnO1xuXG4gICAgICAgIGlmICghc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKSB7XG4gICAgICAgICAgICBzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnMgPSBzZWxmW1wibm90aWZ5U3Vic2NyaWJlcnNcIl07XG4gICAgICAgICAgICBzZWxmW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0gPSBsaW1pdE5vdGlmeVN1YnNjcmliZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbmlzaCA9IGxpbWl0RnVuY3Rpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLl9ub3RpZmljYXRpb25Jc1BlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gSWYgYW4gb2JzZXJ2YWJsZSBwcm92aWRlZCBhIHJlZmVyZW5jZSB0byBpdHNlbGYsIGFjY2VzcyBpdCB0byBnZXQgdGhlIGxhdGVzdCB2YWx1ZS5cbiAgICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIGNvbXB1dGVkIG9ic2VydmFibGVzIHRvIGRlbGF5IGNhbGN1bGF0aW5nIHRoZWlyIHZhbHVlIHVudGlsIG5lZWRlZC5cbiAgICAgICAgICAgIGlmIChzZWxmSXNPYnNlcnZhYmxlICYmIHBlbmRpbmdWYWx1ZSA9PT0gc2VsZikge1xuICAgICAgICAgICAgICAgIHBlbmRpbmdWYWx1ZSA9IHNlbGYoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlnbm9yZUJlZm9yZUNoYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHNlbGYuaXNEaWZmZXJlbnQocHJldmlvdXNWYWx1ZSwgcGVuZGluZ1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyhwcmV2aW91c1ZhbHVlID0gcGVuZGluZ1ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5fbGltaXRDaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgc2VsZi5fbm90aWZpY2F0aW9uSXNQZW5kaW5nID0gaWdub3JlQmVmb3JlQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIHBlbmRpbmdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgZmluaXNoKCk7XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuX2xpbWl0QmVmb3JlQ2hhbmdlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaWdub3JlQmVmb3JlQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyh2YWx1ZSwgYmVmb3JlQ2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaGFzU3Vic2NyaXB0aW9uc0ZvckV2ZW50OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaXB0aW9uc1tldmVudF0gJiYgdGhpcy5fc3Vic2NyaXB0aW9uc1tldmVudF0ubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBnZXRTdWJzY3JpcHRpb25zQ291bnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XSAmJiB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XS5sZW5ndGggfHwgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHRoaXMuX3N1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uKGV2ZW50TmFtZSwgc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUgIT09ICdkaXJ0eScpXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IHN1YnNjcmlwdGlvbnMubGVuZ3RoO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNEaWZmZXJlbnQ6IGZ1bmN0aW9uKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm4gIXRoaXNbJ2VxdWFsaXR5Q29tcGFyZXInXSB8fCAhdGhpc1snZXF1YWxpdHlDb21wYXJlciddKG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfSxcblxuICAgIGV4dGVuZDogYXBwbHlFeHRlbmRlcnNcbn07XG5cbmtvLmV4cG9ydFByb3BlcnR5KGtvX3N1YnNjcmliYWJsZV9mbiwgJ3N1YnNjcmliZScsIGtvX3N1YnNjcmliYWJsZV9mbi5zdWJzY3JpYmUpO1xua28uZXhwb3J0UHJvcGVydHkoa29fc3Vic2NyaWJhYmxlX2ZuLCAnZXh0ZW5kJywga29fc3Vic2NyaWJhYmxlX2ZuLmV4dGVuZCk7XG5rby5leHBvcnRQcm9wZXJ0eShrb19zdWJzY3JpYmFibGVfZm4sICdnZXRTdWJzY3JpcHRpb25zQ291bnQnLCBrb19zdWJzY3JpYmFibGVfZm4uZ2V0U3Vic2NyaXB0aW9uc0NvdW50KTtcblxuLy8gRm9yIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBwcm90byBhc3NpZ25tZW50LCB3ZSBvdmVyd3JpdGUgdGhlIHByb3RvdHlwZSBvZiBlYWNoXG4vLyBvYnNlcnZhYmxlIGluc3RhbmNlLiBTaW5jZSBvYnNlcnZhYmxlcyBhcmUgZnVuY3Rpb25zLCB3ZSBuZWVkIEZ1bmN0aW9uLnByb3RvdHlwZVxuLy8gdG8gc3RpbGwgYmUgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbmlmIChrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZihrb19zdWJzY3JpYmFibGVfZm4sIEZ1bmN0aW9uLnByb3RvdHlwZSk7XG59XG5cbmtvLnN1YnNjcmliYWJsZVsnZm4nXSA9IGtvX3N1YnNjcmliYWJsZV9mbjtcblxuXG5rby5pc1N1YnNjcmliYWJsZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZSAhPSBudWxsICYmIHR5cGVvZiBpbnN0YW5jZS5zdWJzY3JpYmUgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBpbnN0YW5jZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdID09IFwiZnVuY3Rpb25cIjtcbn07XG5cbmtvLmV4cG9ydFN5bWJvbCgnc3Vic2NyaWJhYmxlJywga28uc3Vic2NyaWJhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNTdWJzY3JpYmFibGUnLCBrby5pc1N1YnNjcmliYWJsZSk7XG5cbmtvLmNvbXB1dGVkQ29udGV4dCA9IGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdXRlckZyYW1lcyA9IFtdLFxuICAgICAgICBjdXJyZW50RnJhbWUsXG4gICAgICAgIGxhc3RJZCA9IDA7XG5cbiAgICAvLyBSZXR1cm4gYSB1bmlxdWUgSUQgdGhhdCBjYW4gYmUgYXNzaWduZWQgdG8gYW4gb2JzZXJ2YWJsZSBmb3IgZGVwZW5kZW5jeSB0cmFja2luZy5cbiAgICAvLyBUaGVvcmV0aWNhbGx5LCB5b3UgY291bGQgZXZlbnR1YWxseSBvdmVyZmxvdyB0aGUgbnVtYmVyIHN0b3JhZ2Ugc2l6ZSwgcmVzdWx0aW5nXG4gICAgLy8gaW4gZHVwbGljYXRlIElEcy4gQnV0IGluIEphdmFTY3JpcHQsIHRoZSBsYXJnZXN0IGV4YWN0IGludGVncmFsIHZhbHVlIGlzIDJeNTNcbiAgICAvLyBvciA5LDAwNywxOTksMjU0LDc0MCw5OTIuIElmIHlvdSBjcmVhdGVkIDEsMDAwLDAwMCBJRHMgcGVyIHNlY29uZCwgaXQgd291bGRcbiAgICAvLyB0YWtlIG92ZXIgMjg1IHllYXJzIHRvIHJlYWNoIHRoYXQgbnVtYmVyLlxuICAgIC8vIFJlZmVyZW5jZSBodHRwOi8vYmxvZy52amV1eC5jb20vMjAxMC9qYXZhc2NyaXB0L2phdmFzY3JpcHQtbWF4X2ludC1udW1iZXItbGltaXRzLmh0bWxcbiAgICBmdW5jdGlvbiBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuICsrbGFzdElkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJlZ2luKG9wdGlvbnMpIHtcbiAgICAgICAgb3V0ZXJGcmFtZXMucHVzaChjdXJyZW50RnJhbWUpO1xuICAgICAgICBjdXJyZW50RnJhbWUgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZCgpIHtcbiAgICAgICAgY3VycmVudEZyYW1lID0gb3V0ZXJGcmFtZXMucG9wKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmVnaW46IGJlZ2luLFxuXG4gICAgICAgIGVuZDogZW5kLFxuXG4gICAgICAgIHJlZ2lzdGVyRGVwZW5kZW5jeTogZnVuY3Rpb24gKHN1YnNjcmliYWJsZSkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICgha28uaXNTdWJzY3JpYmFibGUoc3Vic2NyaWJhYmxlKSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBzdWJzY3JpYmFibGUgdGhpbmdzIGNhbiBhY3QgYXMgZGVwZW5kZW5jaWVzXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZS5jYWxsYmFjay5jYWxsKGN1cnJlbnRGcmFtZS5jYWxsYmFja1RhcmdldCwgc3Vic2NyaWJhYmxlLCBzdWJzY3JpYmFibGUuX2lkIHx8IChzdWJzY3JpYmFibGUuX2lkID0gZ2V0SWQoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlnbm9yZTogZnVuY3Rpb24gKGNhbGxiYWNrLCBjYWxsYmFja1RhcmdldCwgY2FsbGJhY2tBcmdzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJlZ2luKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrVGFyZ2V0LCBjYWxsYmFja0FyZ3MgfHwgW10pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBlbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXREZXBlbmRlbmNpZXNDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudEZyYW1lLmNvbXB1dGVkLmdldERlcGVuZGVuY2llc0NvdW50KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNJbml0aWFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRGcmFtZS5pc0luaXRpYWw7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQnLCBrby5jb21wdXRlZENvbnRleHQpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnQnLCBrby5jb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnQpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQuaXNJbml0aWFsJywga28uY29tcHV0ZWRDb250ZXh0LmlzSW5pdGlhbCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnaWdub3JlRGVwZW5kZW5jaWVzJywga28uaWdub3JlRGVwZW5kZW5jaWVzID0ga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUpO1xudmFyIG9ic2VydmFibGVMYXRlc3RWYWx1ZSA9IGtvLnV0aWxzLmNyZWF0ZVN5bWJvbE9yU3RyaW5nKCdfbGF0ZXN0VmFsdWUnKTtcblxua28ub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChpbml0aWFsVmFsdWUpIHtcbiAgICBmdW5jdGlvbiBvYnNlcnZhYmxlKCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFdyaXRlXG5cbiAgICAgICAgICAgIC8vIElnbm9yZSB3cml0ZXMgaWYgdGhlIHZhbHVlIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAob2JzZXJ2YWJsZS5pc0RpZmZlcmVudChvYnNlcnZhYmxlW29ic2VydmFibGVMYXRlc3RWYWx1ZV0sIGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGVbb2JzZXJ2YWJsZUxhdGVzdFZhbHVlXSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIFBlcm1pdHMgY2hhaW5lZCBhc3NpZ25tZW50c1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVhZFxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5yZWdpc3RlckRlcGVuZGVuY3kob2JzZXJ2YWJsZSk7IC8vIFRoZSBjYWxsZXIgb25seSBuZWVkcyB0byBiZSBub3RpZmllZCBvZiBjaGFuZ2VzIGlmIHRoZXkgZGlkIGEgXCJyZWFkXCIgb3BlcmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVtvYnNlcnZhYmxlTGF0ZXN0VmFsdWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb2JzZXJ2YWJsZVtvYnNlcnZhYmxlTGF0ZXN0VmFsdWVdID0gaW5pdGlhbFZhbHVlO1xuXG4gICAgLy8gSW5oZXJpdCBmcm9tICdzdWJzY3JpYmFibGUnXG4gICAgaWYgKCFrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICAgICAgLy8gJ3N1YnNjcmliYWJsZScgd29uJ3QgYmUgb24gdGhlIHByb3RvdHlwZSBjaGFpbiB1bmxlc3Mgd2UgcHV0IGl0IHRoZXJlIGRpcmVjdGx5XG4gICAgICAgIGtvLnV0aWxzLmV4dGVuZChvYnNlcnZhYmxlLCBrby5zdWJzY3JpYmFibGVbJ2ZuJ10pO1xuICAgIH1cbiAgICBrby5zdWJzY3JpYmFibGVbJ2ZuJ10uaW5pdChvYnNlcnZhYmxlKTtcblxuICAgIC8vIEluaGVyaXQgZnJvbSAnb2JzZXJ2YWJsZSdcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZk9yRXh0ZW5kKG9ic2VydmFibGUsIG9ic2VydmFibGVGbik7XG5cbiAgICBpZiAoa28ub3B0aW9uc1snZGVmZXJVcGRhdGVzJ10pIHtcbiAgICAgICAga28uZXh0ZW5kZXJzWydkZWZlcnJlZCddKG9ic2VydmFibGUsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xufVxuXG4vLyBEZWZpbmUgcHJvdG90eXBlIGZvciBvYnNlcnZhYmxlc1xudmFyIG9ic2VydmFibGVGbiA9IHtcbiAgICAnZXF1YWxpdHlDb21wYXJlcic6IHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsLFxuICAgIHBlZWs6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpc1tvYnNlcnZhYmxlTGF0ZXN0VmFsdWVdOyB9LFxuICAgIHZhbHVlSGFzTXV0YXRlZDogZnVuY3Rpb24gKCkgeyB0aGlzWydub3RpZnlTdWJzY3JpYmVycyddKHRoaXNbb2JzZXJ2YWJsZUxhdGVzdFZhbHVlXSk7IH0sXG4gICAgdmFsdWVXaWxsTXV0YXRlOiBmdW5jdGlvbiAoKSB7IHRoaXNbJ25vdGlmeVN1YnNjcmliZXJzJ10odGhpc1tvYnNlcnZhYmxlTGF0ZXN0VmFsdWVdLCAnYmVmb3JlQ2hhbmdlJyk7IH1cbn07XG5cbi8vIE5vdGUgdGhhdCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHRoZVxuLy8gaW5oZXJpdGFuY2UgY2hhaW4gaXMgY3JlYXRlZCBtYW51YWxseSBpbiB0aGUga28ub2JzZXJ2YWJsZSBjb25zdHJ1Y3RvclxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKG9ic2VydmFibGVGbiwga28uc3Vic2NyaWJhYmxlWydmbiddKTtcbn1cblxudmFyIHByb3RvUHJvcGVydHkgPSBrby5vYnNlcnZhYmxlLnByb3RvUHJvcGVydHkgPSAnX19rb19wcm90b19fJztcbm9ic2VydmFibGVGbltwcm90b1Byb3BlcnR5XSA9IGtvLm9ic2VydmFibGU7XG5cbmtvLmhhc1Byb3RvdHlwZSA9IGZ1bmN0aW9uKGluc3RhbmNlLCBwcm90b3R5cGUpIHtcbiAgICBpZiAoKGluc3RhbmNlID09PSBudWxsKSB8fCAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkgfHwgKGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSB1bmRlZmluZWQpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSBwcm90b3R5cGUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBrby5oYXNQcm90b3R5cGUoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0sIHByb3RvdHlwZSk7IC8vIFdhbGsgdGhlIHByb3RvdHlwZSBjaGFpblxufTtcblxua28uaXNPYnNlcnZhYmxlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGtvLmhhc1Byb3RvdHlwZShpbnN0YW5jZSwga28ub2JzZXJ2YWJsZSk7XG59XG5rby5pc1dyaXRlYWJsZU9ic2VydmFibGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAvLyBPYnNlcnZhYmxlXG4gICAgaWYgKCh0eXBlb2YgaW5zdGFuY2UgPT0gJ2Z1bmN0aW9uJykgJiYgaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IGtvLm9ic2VydmFibGUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vIFdyaXRlYWJsZSBkZXBlbmRlbnQgb2JzZXJ2YWJsZVxuICAgIGlmICgodHlwZW9mIGluc3RhbmNlID09ICdmdW5jdGlvbicpICYmIChpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSA9PT0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSkgJiYgKGluc3RhbmNlLmhhc1dyaXRlRnVuY3Rpb24pKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBbnl0aGluZyBlbHNlXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5rby5leHBvcnRTeW1ib2woJ29ic2VydmFibGUnLCBrby5vYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNPYnNlcnZhYmxlJywga28uaXNPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNXcml0ZWFibGVPYnNlcnZhYmxlJywga28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNXcml0YWJsZU9ic2VydmFibGUnLCBrby5pc1dyaXRlYWJsZU9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdvYnNlcnZhYmxlLmZuJywgb2JzZXJ2YWJsZUZuKTtcbmtvLmV4cG9ydFByb3BlcnR5KG9ic2VydmFibGVGbiwgJ3BlZWsnLCBvYnNlcnZhYmxlRm4ucGVlayk7XG5rby5leHBvcnRQcm9wZXJ0eShvYnNlcnZhYmxlRm4sICd2YWx1ZUhhc011dGF0ZWQnLCBvYnNlcnZhYmxlRm4udmFsdWVIYXNNdXRhdGVkKTtcbmtvLmV4cG9ydFByb3BlcnR5KG9ic2VydmFibGVGbiwgJ3ZhbHVlV2lsbE11dGF0ZScsIG9ic2VydmFibGVGbi52YWx1ZVdpbGxNdXRhdGUpO1xua28ub2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKGluaXRpYWxWYWx1ZXMpIHtcbiAgICBpbml0aWFsVmFsdWVzID0gaW5pdGlhbFZhbHVlcyB8fCBbXTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFZhbHVlcyAhPSAnb2JqZWN0JyB8fCAhKCdsZW5ndGgnIGluIGluaXRpYWxWYWx1ZXMpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXJndW1lbnQgcGFzc2VkIHdoZW4gaW5pdGlhbGl6aW5nIGFuIG9ic2VydmFibGUgYXJyYXkgbXVzdCBiZSBhbiBhcnJheSwgb3IgbnVsbCwgb3IgdW5kZWZpbmVkLlwiKTtcblxuICAgIHZhciByZXN1bHQgPSBrby5vYnNlcnZhYmxlKGluaXRpYWxWYWx1ZXMpO1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQocmVzdWx0LCBrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ10pO1xuICAgIHJldHVybiByZXN1bHQuZXh0ZW5kKHsndHJhY2tBcnJheUNoYW5nZXMnOnRydWV9KTtcbn07XG5cbmtvLm9ic2VydmFibGVBcnJheVsnZm4nXSA9IHtcbiAgICAncmVtb3ZlJzogZnVuY3Rpb24gKHZhbHVlT3JQcmVkaWNhdGUpIHtcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICB2YXIgcmVtb3ZlZFZhbHVlcyA9IFtdO1xuICAgICAgICB2YXIgcHJlZGljYXRlID0gdHlwZW9mIHZhbHVlT3JQcmVkaWNhdGUgPT0gXCJmdW5jdGlvblwiICYmICFrby5pc09ic2VydmFibGUodmFsdWVPclByZWRpY2F0ZSkgPyB2YWx1ZU9yUHJlZGljYXRlIDogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZSA9PT0gdmFsdWVPclByZWRpY2F0ZTsgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bmRlcmx5aW5nQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHVuZGVybHlpbmdBcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbW92ZWRWYWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbW92ZWRWYWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdW5kZXJseWluZ0FycmF5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbW92ZWRWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW1vdmVkVmFsdWVzO1xuICAgIH0sXG5cbiAgICAncmVtb3ZlQWxsJzogZnVuY3Rpb24gKGFycmF5T2ZWYWx1ZXMpIHtcbiAgICAgICAgLy8gSWYgeW91IHBhc3NlZCB6ZXJvIGFyZ3MsIHdlIHJlbW92ZSBldmVyeXRoaW5nXG4gICAgICAgIGlmIChhcnJheU9mVmFsdWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgICAgIHZhciBhbGxWYWx1ZXMgPSB1bmRlcmx5aW5nQXJyYXkuc2xpY2UoMCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgdW5kZXJseWluZ0FycmF5LnNwbGljZSgwLCB1bmRlcmx5aW5nQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgICAgICByZXR1cm4gYWxsVmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgYW4gYXJnLCB3ZSBpbnRlcnByZXQgaXQgYXMgYW4gYXJyYXkgb2YgZW50cmllcyB0byByZW1vdmVcbiAgICAgICAgaWYgKCFhcnJheU9mVmFsdWVzKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdGhpc1sncmVtb3ZlJ10oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlJbmRleE9mKGFycmF5T2ZWYWx1ZXMsIHZhbHVlKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ2Rlc3Ryb3knOiBmdW5jdGlvbiAodmFsdWVPclByZWRpY2F0ZSkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcy5wZWVrKCk7XG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSB0eXBlb2YgdmFsdWVPclByZWRpY2F0ZSA9PSBcImZ1bmN0aW9uXCIgJiYgIWtvLmlzT2JzZXJ2YWJsZSh2YWx1ZU9yUHJlZGljYXRlKSA/IHZhbHVlT3JQcmVkaWNhdGUgOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlID09PSB2YWx1ZU9yUHJlZGljYXRlOyB9O1xuICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gdW5kZXJseWluZ0FycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB1bmRlcmx5aW5nQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKHZhbHVlKSlcbiAgICAgICAgICAgICAgICB1bmRlcmx5aW5nQXJyYXlbaV1bXCJfZGVzdHJveVwiXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICB9LFxuXG4gICAgJ2Rlc3Ryb3lBbGwnOiBmdW5jdGlvbiAoYXJyYXlPZlZhbHVlcykge1xuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIHplcm8gYXJncywgd2UgZGVzdHJveSBldmVyeXRoaW5nXG4gICAgICAgIGlmIChhcnJheU9mVmFsdWVzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpc1snZGVzdHJveSddKGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9KTtcblxuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIGFuIGFyZywgd2UgaW50ZXJwcmV0IGl0IGFzIGFuIGFycmF5IG9mIGVudHJpZXMgdG8gZGVzdHJveVxuICAgICAgICBpZiAoIWFycmF5T2ZWYWx1ZXMpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzWydkZXN0cm95J10oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlJbmRleE9mKGFycmF5T2ZWYWx1ZXMsIHZhbHVlKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ2luZGV4T2YnOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcygpO1xuICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlJbmRleE9mKHVuZGVybHlpbmdBcnJheSwgaXRlbSk7XG4gICAgfSxcblxuICAgICdyZXBsYWNlJzogZnVuY3Rpb24ob2xkSXRlbSwgbmV3SXRlbSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzWydpbmRleE9mJ10ob2xkSXRlbSk7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5wZWVrKClbaW5kZXhdID0gbmV3SXRlbTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBOb3RlIHRoYXQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBwcm90byBhc3NpZ25tZW50LCB0aGVcbi8vIGluaGVyaXRhbmNlIGNoYWluIGlzIGNyZWF0ZWQgbWFudWFsbHkgaW4gdGhlIGtvLm9ic2VydmFibGVBcnJheSBjb25zdHJ1Y3RvclxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGtvLm9ic2VydmFibGVBcnJheVsnZm4nXSwga28ub2JzZXJ2YWJsZVsnZm4nXSk7XG59XG5cbi8vIFBvcHVsYXRlIGtvLm9ic2VydmFibGVBcnJheS5mbiB3aXRoIHJlYWQvd3JpdGUgZnVuY3Rpb25zIGZyb20gbmF0aXZlIGFycmF5c1xuLy8gSW1wb3J0YW50OiBEbyBub3QgYWRkIGFueSBhZGRpdGlvbmFsIGZ1bmN0aW9ucyBoZXJlIHRoYXQgbWF5IHJlYXNvbmFibHkgYmUgdXNlZCB0byAqcmVhZCogZGF0YSBmcm9tIHRoZSBhcnJheVxuLy8gYmVjYXVzZSB3ZSdsbCBldmFsIHRoZW0gd2l0aG91dCBjYXVzaW5nIHN1YnNjcmlwdGlvbnMsIHNvIGtvLmNvbXB1dGVkIG91dHB1dCBjb3VsZCBlbmQgdXAgZ2V0dGluZyBzdGFsZVxua28udXRpbHMuYXJyYXlGb3JFYWNoKFtcInBvcFwiLCBcInB1c2hcIiwgXCJyZXZlcnNlXCIsIFwic2hpZnRcIiwgXCJzb3J0XCIsIFwic3BsaWNlXCIsIFwidW5zaGlmdFwiXSwgZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICBrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ11bbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFVzZSBcInBlZWtcIiB0byBhdm9pZCBjcmVhdGluZyBhIHN1YnNjcmlwdGlvbiBpbiBhbnkgY29tcHV0ZWQgdGhhdCB3ZSdyZSBleGVjdXRpbmcgaW4gdGhlIGNvbnRleHQgb2ZcbiAgICAgICAgLy8gKGZvciBjb25zaXN0ZW5jeSB3aXRoIG11dGF0aW5nIHJlZ3VsYXIgb2JzZXJ2YWJsZXMpXG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgdGhpcy5jYWNoZURpZmZGb3JLbm93bk9wZXJhdGlvbih1bmRlcmx5aW5nQXJyYXksIG1ldGhvZE5hbWUsIGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBtZXRob2RDYWxsUmVzdWx0ID0gdW5kZXJseWluZ0FycmF5W21ldGhvZE5hbWVdLmFwcGx5KHVuZGVybHlpbmdBcnJheSwgYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgLy8gVGhlIG5hdGl2ZSBzb3J0IGFuZCByZXZlcnNlIG1ldGhvZHMgcmV0dXJuIGEgcmVmZXJlbmNlIHRvIHRoZSBhcnJheSwgYnV0IGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gcmV0dXJuIHRoZSBvYnNlcnZhYmxlIGFycmF5IGluc3RlYWQuXG4gICAgICAgIHJldHVybiBtZXRob2RDYWxsUmVzdWx0ID09PSB1bmRlcmx5aW5nQXJyYXkgPyB0aGlzIDogbWV0aG9kQ2FsbFJlc3VsdDtcbiAgICB9O1xufSk7XG5cbi8vIFBvcHVsYXRlIGtvLm9ic2VydmFibGVBcnJheS5mbiB3aXRoIHJlYWQtb25seSBmdW5jdGlvbnMgZnJvbSBuYXRpdmUgYXJyYXlzXG5rby51dGlscy5hcnJheUZvckVhY2goW1wic2xpY2VcIl0sIGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAga28ub2JzZXJ2YWJsZUFycmF5WydmbiddW21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcygpO1xuICAgICAgICByZXR1cm4gdW5kZXJseWluZ0FycmF5W21ldGhvZE5hbWVdLmFwcGx5KHVuZGVybHlpbmdBcnJheSwgYXJndW1lbnRzKTtcbiAgICB9O1xufSk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnb2JzZXJ2YWJsZUFycmF5Jywga28ub2JzZXJ2YWJsZUFycmF5KTtcbnZhciBhcnJheUNoYW5nZUV2ZW50TmFtZSA9ICdhcnJheUNoYW5nZSc7XG5rby5leHRlbmRlcnNbJ3RyYWNrQXJyYXlDaGFuZ2VzJ10gPSBmdW5jdGlvbih0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAvLyBVc2UgdGhlIHByb3ZpZGVkIG9wdGlvbnMtLWVhY2ggY2FsbCB0byB0cmFja0FycmF5Q2hhbmdlcyBvdmVyd3JpdGVzIHRoZSBwcmV2aW91c2x5IHNldCBvcHRpb25zXG4gICAgdGFyZ2V0LmNvbXBhcmVBcnJheU9wdGlvbnMgPSB7fTtcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGtvLnV0aWxzLmV4dGVuZCh0YXJnZXQuY29tcGFyZUFycmF5T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfVxuICAgIHRhcmdldC5jb21wYXJlQXJyYXlPcHRpb25zWydzcGFyc2UnXSA9IHRydWU7XG5cbiAgICAvLyBPbmx5IG1vZGlmeSB0aGUgdGFyZ2V0IG9ic2VydmFibGUgb25jZVxuICAgIGlmICh0YXJnZXQuY2FjaGVEaWZmRm9yS25vd25PcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdHJhY2tpbmdDaGFuZ2VzID0gZmFsc2UsXG4gICAgICAgIGNhY2hlZERpZmYgPSBudWxsLFxuICAgICAgICBhcnJheUNoYW5nZVN1YnNjcmlwdGlvbixcbiAgICAgICAgcGVuZGluZ05vdGlmaWNhdGlvbnMgPSAwLFxuICAgICAgICB1bmRlcmx5aW5nTm90aWZ5U3Vic2NyaWJlcnNGdW5jdGlvbixcbiAgICAgICAgdW5kZXJseWluZ0JlZm9yZVN1YnNjcmlwdGlvbkFkZEZ1bmN0aW9uID0gdGFyZ2V0LmJlZm9yZVN1YnNjcmlwdGlvbkFkZCxcbiAgICAgICAgdW5kZXJseWluZ0FmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlRnVuY3Rpb24gPSB0YXJnZXQuYWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmU7XG5cbiAgICAvLyBXYXRjaCBcInN1YnNjcmliZVwiIGNhbGxzLCBhbmQgZm9yIGFycmF5IGNoYW5nZSBldmVudHMsIGVuc3VyZSBjaGFuZ2UgdHJhY2tpbmcgaXMgZW5hYmxlZFxuICAgIHRhcmdldC5iZWZvcmVTdWJzY3JpcHRpb25BZGQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKHVuZGVybHlpbmdCZWZvcmVTdWJzY3JpcHRpb25BZGRGdW5jdGlvbilcbiAgICAgICAgICAgIHVuZGVybHlpbmdCZWZvcmVTdWJzY3JpcHRpb25BZGRGdW5jdGlvbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQgPT09IGFycmF5Q2hhbmdlRXZlbnROYW1lKSB7XG4gICAgICAgICAgICB0cmFja0NoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gV2F0Y2ggXCJkaXNwb3NlXCIgY2FsbHMsIGFuZCBmb3IgYXJyYXkgY2hhbmdlIGV2ZW50cywgZW5zdXJlIGNoYW5nZSB0cmFja2luZyBpcyBkaXNhYmxlZCB3aGVuIGFsbCBhcmUgZGlzcG9zZWRcbiAgICB0YXJnZXQuYWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKHVuZGVybHlpbmdBZnRlclN1YnNjcmlwdGlvblJlbW92ZUZ1bmN0aW9uKVxuICAgICAgICAgICAgdW5kZXJseWluZ0FmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlRnVuY3Rpb24uY2FsbCh0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgaWYgKGV2ZW50ID09PSBhcnJheUNoYW5nZUV2ZW50TmFtZSAmJiAhdGFyZ2V0Lmhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudChhcnJheUNoYW5nZUV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgIGlmICh1bmRlcmx5aW5nTm90aWZ5U3Vic2NyaWJlcnNGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXSA9IHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uO1xuICAgICAgICAgICAgICAgIHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJyYXlDaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgICAgICAgICAgdHJhY2tpbmdDaGFuZ2VzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdHJhY2tDaGFuZ2VzKCkge1xuICAgICAgICAvLyBDYWxsaW5nICd0cmFja0NoYW5nZXMnIG11bHRpcGxlIHRpbWVzIGlzIHRoZSBzYW1lIGFzIGNhbGxpbmcgaXQgb25jZVxuICAgICAgICBpZiAodHJhY2tpbmdDaGFuZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cmFja2luZ0NoYW5nZXMgPSB0cnVlO1xuXG4gICAgICAgIC8vIEludGVyY2VwdCBcIm5vdGlmeVN1YnNjcmliZXJzXCIgdG8gdHJhY2sgaG93IG1hbnkgdGltZXMgaXQgd2FzIGNhbGxlZC5cbiAgICAgICAgdW5kZXJseWluZ05vdGlmeVN1YnNjcmliZXJzRnVuY3Rpb24gPSB0YXJnZXRbJ25vdGlmeVN1YnNjcmliZXJzJ107XG4gICAgICAgIHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXSA9IGZ1bmN0aW9uKHZhbHVlVG9Ob3RpZnksIGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50IHx8IGV2ZW50ID09PSBkZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgICAgICAgICArK3BlbmRpbmdOb3RpZmljYXRpb25zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gRWFjaCB0aW1lIHRoZSBhcnJheSBjaGFuZ2VzIHZhbHVlLCBjYXB0dXJlIGEgY2xvbmUgc28gdGhhdCBvbiB0aGUgbmV4dFxuICAgICAgICAvLyBjaGFuZ2UgaXQncyBwb3NzaWJsZSB0byBwcm9kdWNlIGEgZGlmZlxuICAgICAgICB2YXIgcHJldmlvdXNDb250ZW50cyA9IFtdLmNvbmNhdCh0YXJnZXQucGVlaygpIHx8IFtdKTtcbiAgICAgICAgY2FjaGVkRGlmZiA9IG51bGw7XG4gICAgICAgIGFycmF5Q2hhbmdlU3Vic2NyaXB0aW9uID0gdGFyZ2V0LnN1YnNjcmliZShmdW5jdGlvbihjdXJyZW50Q29udGVudHMpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGNvbnRlbnRzIGFuZCBlbnN1cmUgaXQncyBhbiBhcnJheVxuICAgICAgICAgICAgY3VycmVudENvbnRlbnRzID0gW10uY29uY2F0KGN1cnJlbnRDb250ZW50cyB8fCBbXSk7XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgdGhlIGRpZmYgYW5kIGlzc3VlIG5vdGlmaWNhdGlvbnMsIGJ1dCBvbmx5IGlmIHNvbWVvbmUgaXMgbGlzdGVuaW5nXG4gICAgICAgICAgICBpZiAodGFyZ2V0Lmhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudChhcnJheUNoYW5nZUV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlcyA9IGdldENoYW5nZXMocHJldmlvdXNDb250ZW50cywgY3VycmVudENvbnRlbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRWxpbWluYXRlIHJlZmVyZW5jZXMgdG8gdGhlIG9sZCwgcmVtb3ZlZCBpdGVtcywgc28gdGhleSBjYW4gYmUgR0NlZFxuICAgICAgICAgICAgcHJldmlvdXNDb250ZW50cyA9IGN1cnJlbnRDb250ZW50cztcbiAgICAgICAgICAgIGNhY2hlZERpZmYgPSBudWxsO1xuICAgICAgICAgICAgcGVuZGluZ05vdGlmaWNhdGlvbnMgPSAwO1xuXG4gICAgICAgICAgICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXShjaGFuZ2VzLCBhcnJheUNoYW5nZUV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENoYW5nZXMocHJldmlvdXNDb250ZW50cywgY3VycmVudENvbnRlbnRzKSB7XG4gICAgICAgIC8vIFdlIHRyeSB0byByZS11c2UgY2FjaGVkIGRpZmZzLlxuICAgICAgICAvLyBUaGUgc2NlbmFyaW9zIHdoZXJlIHBlbmRpbmdOb3RpZmljYXRpb25zID4gMSBhcmUgd2hlbiB1c2luZyByYXRlLWxpbWl0aW5nIG9yIHRoZSBEZWZlcnJlZCBVcGRhdGVzXG4gICAgICAgIC8vIHBsdWdpbiwgd2hpY2ggd2l0aG91dCB0aGlzIGNoZWNrIHdvdWxkIG5vdCBiZSBjb21wYXRpYmxlIHdpdGggYXJyYXlDaGFuZ2Ugbm90aWZpY2F0aW9ucy4gTm9ybWFsbHksXG4gICAgICAgIC8vIG5vdGlmaWNhdGlvbnMgYXJlIGlzc3VlZCBpbW1lZGlhdGVseSBzbyB3ZSB3b3VsZG4ndCBiZSBxdWV1ZWluZyB1cCBtb3JlIHRoYW4gb25lLlxuICAgICAgICBpZiAoIWNhY2hlZERpZmYgfHwgcGVuZGluZ05vdGlmaWNhdGlvbnMgPiAxKSB7XG4gICAgICAgICAgICBjYWNoZWREaWZmID0ga28udXRpbHMuY29tcGFyZUFycmF5cyhwcmV2aW91c0NvbnRlbnRzLCBjdXJyZW50Q29udGVudHMsIHRhcmdldC5jb21wYXJlQXJyYXlPcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWNoZWREaWZmO1xuICAgIH1cblxuICAgIHRhcmdldC5jYWNoZURpZmZGb3JLbm93bk9wZXJhdGlvbiA9IGZ1bmN0aW9uKHJhd0FycmF5LCBvcGVyYXRpb25OYW1lLCBhcmdzKSB7XG4gICAgICAgIC8vIE9ubHkgcnVuIGlmIHdlJ3JlIGN1cnJlbnRseSB0cmFja2luZyBjaGFuZ2VzIGZvciB0aGlzIG9ic2VydmFibGUgYXJyYXlcbiAgICAgICAgLy8gYW5kIHRoZXJlIGFyZW4ndCBhbnkgcGVuZGluZyBkZWZlcnJlZCBub3RpZmljYXRpb25zLlxuICAgICAgICBpZiAoIXRyYWNraW5nQ2hhbmdlcyB8fCBwZW5kaW5nTm90aWZpY2F0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWZmID0gW10sXG4gICAgICAgICAgICBhcnJheUxlbmd0aCA9IHJhd0FycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gcHVzaERpZmYoc3RhdHVzLCB2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBkaWZmW2RpZmYubGVuZ3RoXSA9IHsgJ3N0YXR1cyc6IHN0YXR1cywgJ3ZhbHVlJzogdmFsdWUsICdpbmRleCc6IGluZGV4IH07XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChvcGVyYXRpb25OYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdwdXNoJzpcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBhcnJheUxlbmd0aDtcbiAgICAgICAgICAgIGNhc2UgJ3Vuc2hpZnQnOlxuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBhcmdzTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hEaWZmKCdhZGRlZCcsIGFyZ3NbaW5kZXhdLCBvZmZzZXQgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdwb3AnOlxuICAgICAgICAgICAgICAgIG9mZnNldCA9IGFycmF5TGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGNhc2UgJ3NoaWZ0JzpcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaERpZmYoJ2RlbGV0ZWQnLCByYXdBcnJheVtvZmZzZXRdLCBvZmZzZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnc3BsaWNlJzpcbiAgICAgICAgICAgICAgICAvLyBOZWdhdGl2ZSBzdGFydCBpbmRleCBtZWFucyAnZnJvbSBlbmQgb2YgYXJyYXknLiBBZnRlciB0aGF0IHdlIGNsYW1wIHRvIFswLi4uYXJyYXlMZW5ndGhdLlxuICAgICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zcGxpY2VcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KDAsIGFyZ3NbMF0gPCAwID8gYXJyYXlMZW5ndGggKyBhcmdzWzBdIDogYXJnc1swXSksIGFycmF5TGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kRGVsZXRlSW5kZXggPSBhcmdzTGVuZ3RoID09PSAxID8gYXJyYXlMZW5ndGggOiBNYXRoLm1pbihzdGFydEluZGV4ICsgKGFyZ3NbMV0gfHwgMCksIGFycmF5TGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kQWRkSW5kZXggPSBzdGFydEluZGV4ICsgYXJnc0xlbmd0aCAtIDIsXG4gICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gTWF0aC5tYXgoZW5kRGVsZXRlSW5kZXgsIGVuZEFkZEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25zID0gW10sIGRlbGV0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gc3RhcnRJbmRleCwgYXJnc0luZGV4ID0gMjsgaW5kZXggPCBlbmRJbmRleDsgKytpbmRleCwgKythcmdzSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgZW5kRGVsZXRlSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGlvbnMucHVzaChwdXNoRGlmZignZGVsZXRlZCcsIHJhd0FycmF5W2luZGV4XSwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgZW5kQWRkSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMucHVzaChwdXNoRGlmZignYWRkZWQnLCBhcmdzW2FyZ3NJbmRleF0sIGluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmZpbmRNb3Zlc0luQXJyYXlDb21wYXJpc29uKGRlbGV0aW9ucywgYWRkaXRpb25zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FjaGVkRGlmZiA9IGRpZmY7XG4gICAgfTtcbn07XG52YXIgY29tcHV0ZWRTdGF0ZSA9IGtvLnV0aWxzLmNyZWF0ZVN5bWJvbE9yU3RyaW5nKCdfc3RhdGUnKTtcblxua28uY29tcHV0ZWQgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlID0gZnVuY3Rpb24gKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2YgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgLy8gU2luZ2xlLXBhcmFtZXRlciBzeW50YXggLSBldmVyeXRoaW5nIGlzIG9uIHRoaXMgXCJvcHRpb25zXCIgcGFyYW1cbiAgICAgICAgb3B0aW9ucyA9IGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE11bHRpLXBhcmFtZXRlciBzeW50YXggLSBjb25zdHJ1Y3QgdGhlIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHRoZSBwYXJhbXMgcGFzc2VkXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBpZiAoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnNbXCJyZWFkXCJdID0gZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zW1wicmVhZFwiXSAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHRocm93IEVycm9yKFwiUGFzcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGtvLmNvbXB1dGVkXCIpO1xuXG4gICAgdmFyIHdyaXRlRnVuY3Rpb24gPSBvcHRpb25zW1wid3JpdGVcIl07XG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgICBsYXRlc3RWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICBpc1N0YWxlOiB0cnVlLFxuICAgICAgICBpc0JlaW5nRXZhbHVhdGVkOiBmYWxzZSxcbiAgICAgICAgc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2U6IGZhbHNlLFxuICAgICAgICBpc0Rpc3Bvc2VkOiBmYWxzZSxcbiAgICAgICAgcHVyZTogZmFsc2UsXG4gICAgICAgIGlzU2xlZXBpbmc6IGZhbHNlLFxuICAgICAgICByZWFkRnVuY3Rpb246IG9wdGlvbnNbXCJyZWFkXCJdLFxuICAgICAgICBldmFsdWF0b3JGdW5jdGlvblRhcmdldDogZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQgfHwgb3B0aW9uc1tcIm93bmVyXCJdLFxuICAgICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IG9wdGlvbnNbXCJkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWRcIl0gfHwgb3B0aW9ucy5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgfHwgbnVsbCxcbiAgICAgICAgZGlzcG9zZVdoZW46IG9wdGlvbnNbXCJkaXNwb3NlV2hlblwiXSB8fCBvcHRpb25zLmRpc3Bvc2VXaGVuLFxuICAgICAgICBkb21Ob2RlRGlzcG9zYWxDYWxsYmFjazogbnVsbCxcbiAgICAgICAgZGVwZW5kZW5jeVRyYWNraW5nOiB7fSxcbiAgICAgICAgZGVwZW5kZW5jaWVzQ291bnQ6IDAsXG4gICAgICAgIGV2YWx1YXRpb25UaW1lb3V0SW5zdGFuY2U6IG51bGxcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY29tcHV0ZWRPYnNlcnZhYmxlKCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JpdGVGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gV3JpdGluZyBhIHZhbHVlXG4gICAgICAgICAgICAgICAgd3JpdGVGdW5jdGlvbi5hcHBseShzdGF0ZS5ldmFsdWF0b3JGdW5jdGlvblRhcmdldCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHdyaXRlIGEgdmFsdWUgdG8gYSBrby5jb21wdXRlZCB1bmxlc3MgeW91IHNwZWNpZnkgYSAnd3JpdGUnIG9wdGlvbi4gSWYgeW91IHdpc2ggdG8gcmVhZCB0aGUgY3VycmVudCB2YWx1ZSwgZG9uJ3QgcGFzcyBhbnkgcGFyYW1ldGVycy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gUGVybWl0cyBjaGFpbmVkIGFzc2lnbm1lbnRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWFkaW5nIHRoZSB2YWx1ZVxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5yZWdpc3RlckRlcGVuZGVuY3koY29tcHV0ZWRPYnNlcnZhYmxlKTtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5pc1N0YWxlIHx8IChzdGF0ZS5pc1NsZWVwaW5nICYmIGNvbXB1dGVkT2JzZXJ2YWJsZS5oYXZlRGVwZW5kZW5jaWVzQ2hhbmdlZCgpKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZS5ldmFsdWF0ZUltbWVkaWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmxhdGVzdFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcHV0ZWRPYnNlcnZhYmxlW2NvbXB1dGVkU3RhdGVdID0gc3RhdGU7XG4gICAgY29tcHV0ZWRPYnNlcnZhYmxlLmhhc1dyaXRlRnVuY3Rpb24gPSB0eXBlb2Ygd3JpdGVGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiO1xuXG4gICAgLy8gSW5oZXJpdCBmcm9tICdzdWJzY3JpYmFibGUnXG4gICAgaWYgKCFrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICAgICAgLy8gJ3N1YnNjcmliYWJsZScgd29uJ3QgYmUgb24gdGhlIHByb3RvdHlwZSBjaGFpbiB1bmxlc3Mgd2UgcHV0IGl0IHRoZXJlIGRpcmVjdGx5XG4gICAgICAgIGtvLnV0aWxzLmV4dGVuZChjb21wdXRlZE9ic2VydmFibGUsIGtvLnN1YnNjcmliYWJsZVsnZm4nXSk7XG4gICAgfVxuICAgIGtvLnN1YnNjcmliYWJsZVsnZm4nXS5pbml0KGNvbXB1dGVkT2JzZXJ2YWJsZSk7XG5cbiAgICAvLyBJbmhlcml0IGZyb20gJ2NvbXB1dGVkJ1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQoY29tcHV0ZWRPYnNlcnZhYmxlLCBjb21wdXRlZEZuKTtcblxuICAgIGlmIChvcHRpb25zWydwdXJlJ10pIHtcbiAgICAgICAgc3RhdGUucHVyZSA9IHRydWU7XG4gICAgICAgIHN0YXRlLmlzU2xlZXBpbmcgPSB0cnVlOyAgICAgLy8gU3RhcnRzIG9mZiBzbGVlcGluZzsgd2lsbCBhd2FrZSBvbiB0aGUgZmlyc3Qgc3Vic2NyaXB0aW9uXG4gICAgICAgIGtvLnV0aWxzLmV4dGVuZChjb21wdXRlZE9ic2VydmFibGUsIHB1cmVDb21wdXRlZE92ZXJyaWRlcyk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zWydkZWZlckV2YWx1YXRpb24nXSkge1xuICAgICAgICBrby51dGlscy5leHRlbmQoY29tcHV0ZWRPYnNlcnZhYmxlLCBkZWZlckV2YWx1YXRpb25PdmVycmlkZXMpO1xuICAgIH1cblxuICAgIGlmIChrby5vcHRpb25zWydkZWZlclVwZGF0ZXMnXSkge1xuICAgICAgICBrby5leHRlbmRlcnNbJ2RlZmVycmVkJ10oY29tcHV0ZWRPYnNlcnZhYmxlLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoREVCVUcpIHtcbiAgICAgICAgLy8gIzE3MzEgLSBBaWQgZGVidWdnaW5nIGJ5IGV4cG9zaW5nIHRoZSBjb21wdXRlZCdzIG9wdGlvbnNcbiAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlW1wiX29wdGlvbnNcIl0gPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQpIHtcbiAgICAgICAgLy8gU2luY2UgdGhpcyBjb21wdXRlZCBpcyBhc3NvY2lhdGVkIHdpdGggYSBET00gbm9kZSwgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzcG9zZSB0aGUgY29tcHV0ZWRcbiAgICAgICAgLy8gdW50aWwgdGhlIERPTSBub2RlIGlzICpyZW1vdmVkKiBmcm9tIHRoZSBkb2N1bWVudCAoYXMgb3Bwb3NlZCB0byBuZXZlciBoYXZpbmcgYmVlbiBpbiB0aGUgZG9jdW1lbnQpLFxuICAgICAgICAvLyB3ZSdsbCBwcmV2ZW50IGRpc3Bvc2FsIHVudGlsIFwiZGlzcG9zZVdoZW5cIiBmaXJzdCByZXR1cm5zIGZhbHNlLlxuICAgICAgICBzdGF0ZS5zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZSA9IHRydWU7XG5cbiAgICAgICAgLy8gZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiB0cnVlIGNhbiBiZSB1c2VkIHRvIG9wdCBpbnRvIHRoZSBcIm9ubHkgZGlzcG9zZSBhZnRlciBmaXJzdCBmYWxzZSByZXN1bHRcIlxuICAgICAgICAvLyBiZWhhdmlvdXIgZXZlbiBpZiB0aGVyZSdzIG5vIHNwZWNpZmljIG5vZGUgdG8gd2F0Y2guIEluIHRoYXQgY2FzZSwgY2xlYXIgdGhlIG9wdGlvbiBzbyB3ZSBkb24ndCB0cnlcbiAgICAgICAgLy8gdG8gd2F0Y2ggZm9yIGEgbm9uLW5vZGUncyBkaXNwb3NhbC4gVGhpcyB0ZWNobmlxdWUgaXMgaW50ZW5kZWQgZm9yIEtPJ3MgaW50ZXJuYWwgdXNlIG9ubHkgYW5kIHNob3VsZG4ndFxuICAgICAgICAvLyBiZSBkb2N1bWVudGVkIG9yIHVzZWQgYnkgYXBwbGljYXRpb24gY29kZSwgYXMgaXQncyBsaWtlbHkgdG8gY2hhbmdlIGluIGEgZnV0dXJlIHZlcnNpb24gb2YgS08uXG4gICAgICAgIGlmICghc3RhdGUuZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXZhbHVhdGUsIHVubGVzcyBzbGVlcGluZyBvciBkZWZlckV2YWx1YXRpb24gaXMgdHJ1ZVxuICAgIGlmICghc3RhdGUuaXNTbGVlcGluZyAmJiAhb3B0aW9uc1snZGVmZXJFdmFsdWF0aW9uJ10pIHtcbiAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmV2YWx1YXRlSW1tZWRpYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gQXR0YWNoIGEgRE9NIG5vZGUgZGlzcG9zYWwgY2FsbGJhY2sgc28gdGhhdCB0aGUgY29tcHV0ZWQgd2lsbCBiZSBwcm9hY3RpdmVseSBkaXNwb3NlZCBhcyBzb29uIGFzIHRoZSBub2RlIGlzXG4gICAgLy8gcmVtb3ZlZCB1c2luZyBrby5yZW1vdmVOb2RlLiBCdXQgc2tpcCBpZiBpc0FjdGl2ZSBpcyBmYWxzZSAodGhlcmUgd2lsbCBuZXZlciBiZSBhbnkgZGVwZW5kZW5jaWVzIHRvIGRpc3Bvc2UpLlxuICAgIGlmIChzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgJiYgY29tcHV0ZWRPYnNlcnZhYmxlLmlzQWN0aXZlKCkpIHtcbiAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQsIHN0YXRlLmRvbU5vZGVEaXNwb3NhbENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXB1dGVkT2JzZXJ2YWJsZTtcbn07XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb24gdGhhdCBkaXNwb3NlcyBhIGdpdmVuIGRlcGVuZGVuY3lUcmFja2luZyBlbnRyeVxuZnVuY3Rpb24gY29tcHV0ZWREaXNwb3NlRGVwZW5kZW5jeUNhbGxiYWNrKGlkLCBlbnRyeVRvRGlzcG9zZSkge1xuICAgIGlmIChlbnRyeVRvRGlzcG9zZSAhPT0gbnVsbCAmJiBlbnRyeVRvRGlzcG9zZS5kaXNwb3NlKSB7XG4gICAgICAgIGVudHJ5VG9EaXNwb3NlLmRpc3Bvc2UoKTtcbiAgICB9XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgZWFjaCB0aW1lIGEgZGVwZW5kZW5jeSBpcyBkZXRlY3RlZCB3aGlsZSBldmFsdWF0aW5nIGEgY29tcHV0ZWQuXG4vLyBJdCdzIGZhY3RvcmVkIG91dCBhcyBhIHNoYXJlZCBmdW5jdGlvbiB0byBhdm9pZCBjcmVhdGluZyB1bm5lY2Vzc2FyeSBmdW5jdGlvbiBpbnN0YW5jZXMgZHVyaW5nIGV2YWx1YXRpb24uXG5mdW5jdGlvbiBjb21wdXRlZEJlZ2luRGVwZW5kZW5jeURldGVjdGlvbkNhbGxiYWNrKHN1YnNjcmliYWJsZSwgaWQpIHtcbiAgICB2YXIgY29tcHV0ZWRPYnNlcnZhYmxlID0gdGhpcy5jb21wdXRlZE9ic2VydmFibGUsXG4gICAgICAgIHN0YXRlID0gY29tcHV0ZWRPYnNlcnZhYmxlW2NvbXB1dGVkU3RhdGVdO1xuICAgIGlmICghc3RhdGUuaXNEaXNwb3NlZCkge1xuICAgICAgICBpZiAodGhpcy5kaXNwb3NhbENvdW50ICYmIHRoaXMuZGlzcG9zYWxDYW5kaWRhdGVzW2lkXSkge1xuICAgICAgICAgICAgLy8gRG9uJ3Qgd2FudCB0byBkaXNwb3NlIHRoaXMgc3Vic2NyaXB0aW9uLCBhcyBpdCdzIHN0aWxsIGJlaW5nIHVzZWRcbiAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZS5hZGREZXBlbmRlbmN5VHJhY2tpbmcoaWQsIHN1YnNjcmliYWJsZSwgdGhpcy5kaXNwb3NhbENhbmRpZGF0ZXNbaWRdKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcG9zYWxDYW5kaWRhdGVzW2lkXSA9IG51bGw7IC8vIE5vIG5lZWQgdG8gYWN0dWFsbHkgZGVsZXRlIHRoZSBwcm9wZXJ0eSAtIGRpc3Bvc2FsQ2FuZGlkYXRlcyBpcyBhIHRyYW5zaWVudCBvYmplY3QgYW55d2F5XG4gICAgICAgICAgICAtLXRoaXMuZGlzcG9zYWxDb3VudDtcbiAgICAgICAgfSBlbHNlIGlmICghc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nW2lkXSkge1xuICAgICAgICAgICAgLy8gQnJhbmQgbmV3IHN1YnNjcmlwdGlvbiAtIGFkZCBpdFxuICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmFkZERlcGVuZGVuY3lUcmFja2luZyhpZCwgc3Vic2NyaWJhYmxlLCBzdGF0ZS5pc1NsZWVwaW5nID8geyBfdGFyZ2V0OiBzdWJzY3JpYmFibGUgfSA6IGNvbXB1dGVkT2JzZXJ2YWJsZS5zdWJzY3JpYmVUb0RlcGVuZGVuY3koc3Vic2NyaWJhYmxlKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBjb21wdXRlZEZuID0ge1xuICAgIFwiZXF1YWxpdHlDb21wYXJlclwiOiB2YWx1ZXNBcmVQcmltaXRpdmVBbmRFcXVhbCxcbiAgICBnZXREZXBlbmRlbmNpZXNDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpc1tjb21wdXRlZFN0YXRlXS5kZXBlbmRlbmNpZXNDb3VudDtcbiAgICB9LFxuICAgIGFkZERlcGVuZGVuY3lUcmFja2luZzogZnVuY3Rpb24gKGlkLCB0YXJnZXQsIHRyYWNraW5nT2JqKSB7XG4gICAgICAgIGlmICh0aGlzW2NvbXB1dGVkU3RhdGVdLnB1cmUgJiYgdGFyZ2V0ID09PSB0aGlzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkEgJ3B1cmUnIGNvbXB1dGVkIG11c3Qgbm90IGJlIGNhbGxlZCByZWN1cnNpdmVseVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNbY29tcHV0ZWRTdGF0ZV0uZGVwZW5kZW5jeVRyYWNraW5nW2lkXSA9IHRyYWNraW5nT2JqO1xuICAgICAgICB0cmFja2luZ09iai5fb3JkZXIgPSB0aGlzW2NvbXB1dGVkU3RhdGVdLmRlcGVuZGVuY2llc0NvdW50Kys7XG4gICAgICAgIHRyYWNraW5nT2JqLl92ZXJzaW9uID0gdGFyZ2V0LmdldFZlcnNpb24oKTtcbiAgICB9LFxuICAgIGhhdmVEZXBlbmRlbmNpZXNDaGFuZ2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCwgZGVwZW5kZW5jeSwgZGVwZW5kZW5jeVRyYWNraW5nID0gdGhpc1tjb21wdXRlZFN0YXRlXS5kZXBlbmRlbmN5VHJhY2tpbmc7XG4gICAgICAgIGZvciAoaWQgaW4gZGVwZW5kZW5jeVRyYWNraW5nKSB7XG4gICAgICAgICAgICBpZiAoZGVwZW5kZW5jeVRyYWNraW5nLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kgPSBkZXBlbmRlbmN5VHJhY2tpbmdbaWRdO1xuICAgICAgICAgICAgICAgIGlmIChkZXBlbmRlbmN5Ll90YXJnZXQuaGFzQ2hhbmdlZChkZXBlbmRlbmN5Ll92ZXJzaW9uKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1hcmtEaXJ0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBQcm9jZXNzIFwiZGlydHlcIiBldmVudHMgaWYgd2UgY2FuIGhhbmRsZSBkZWxheWVkIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgaWYgKHRoaXMuX2V2YWxEZWxheWVkICYmICF0aGlzW2NvbXB1dGVkU3RhdGVdLmlzQmVpbmdFdmFsdWF0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2V2YWxEZWxheWVkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGlzQWN0aXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2NvbXB1dGVkU3RhdGVdLmlzU3RhbGUgfHwgdGhpc1tjb21wdXRlZFN0YXRlXS5kZXBlbmRlbmNpZXNDb3VudCA+IDA7XG4gICAgfSxcbiAgICByZXNwb25kVG9DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gSWdub3JlIFwiY2hhbmdlXCIgZXZlbnRzIGlmIHdlJ3ZlIGFscmVhZHkgc2NoZWR1bGVkIGEgZGVsYXllZCBub3RpZmljYXRpb25cbiAgICAgICAgaWYgKCF0aGlzLl9ub3RpZmljYXRpb25Jc1BlbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZXZhbHVhdGVQb3NzaWJseUFzeW5jKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN1YnNjcmliZVRvRGVwZW5kZW5jeTogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBpZiAodGFyZ2V0Ll9kZWZlclVwZGF0ZXMgJiYgIXRoaXNbY29tcHV0ZWRTdGF0ZV0uZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkKSB7XG4gICAgICAgICAgICB2YXIgZGlydHlTdWIgPSB0YXJnZXQuc3Vic2NyaWJlKHRoaXMubWFya0RpcnR5LCB0aGlzLCAnZGlydHknKSxcbiAgICAgICAgICAgICAgICBjaGFuZ2VTdWIgPSB0YXJnZXQuc3Vic2NyaWJlKHRoaXMucmVzcG9uZFRvQ2hhbmdlLCB0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX3RhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgICAgIGRpc3Bvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlydHlTdWIuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdWIuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LnN1YnNjcmliZSh0aGlzLmV2YWx1YXRlUG9zc2libHlBc3luYywgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGV2YWx1YXRlUG9zc2libHlBc3luYzogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29tcHV0ZWRPYnNlcnZhYmxlID0gdGhpcyxcbiAgICAgICAgICAgIHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQgPSBjb21wdXRlZE9ic2VydmFibGVbJ3Rocm90dGxlRXZhbHVhdGlvbiddO1xuICAgICAgICBpZiAodGhyb3R0bGVFdmFsdWF0aW9uVGltZW91dCAmJiB0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0ID49IDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzW2NvbXB1dGVkU3RhdGVdLmV2YWx1YXRpb25UaW1lb3V0SW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpc1tjb21wdXRlZFN0YXRlXS5ldmFsdWF0aW9uVGltZW91dEluc3RhbmNlID0ga28udXRpbHMuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmV2YWx1YXRlSW1tZWRpYXRlKHRydWUgLypub3RpZnlDaGFuZ2UqLyk7XG4gICAgICAgICAgICB9LCB0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0KTtcbiAgICAgICAgfSBlbHNlIGlmIChjb21wdXRlZE9ic2VydmFibGUuX2V2YWxEZWxheWVkKSB7XG4gICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuX2V2YWxEZWxheWVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuZXZhbHVhdGVJbW1lZGlhdGUodHJ1ZSAvKm5vdGlmeUNoYW5nZSovKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZXZhbHVhdGVJbW1lZGlhdGU6IGZ1bmN0aW9uIChub3RpZnlDaGFuZ2UpIHtcbiAgICAgICAgdmFyIGNvbXB1dGVkT2JzZXJ2YWJsZSA9IHRoaXMsXG4gICAgICAgICAgICBzdGF0ZSA9IGNvbXB1dGVkT2JzZXJ2YWJsZVtjb21wdXRlZFN0YXRlXSxcbiAgICAgICAgICAgIGRpc3Bvc2VXaGVuID0gc3RhdGUuZGlzcG9zZVdoZW4sXG4gICAgICAgICAgICBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHN0YXRlLmlzQmVpbmdFdmFsdWF0ZWQpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBldmFsdWF0aW9uIG9mIGEga28uY29tcHV0ZWQgY2F1c2VzIHNpZGUgZWZmZWN0cywgaXQncyBwb3NzaWJsZSB0aGF0IGl0IHdpbGwgdHJpZ2dlciBpdHMgb3duIHJlLWV2YWx1YXRpb24uXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG5vdCBkZXNpcmFibGUgKGl0J3MgaGFyZCBmb3IgYSBkZXZlbG9wZXIgdG8gcmVhbGlzZSBhIGNoYWluIG9mIGRlcGVuZGVuY2llcyBtaWdodCBjYXVzZSB0aGlzLCBhbmQgdGhleSBhbG1vc3RcbiAgICAgICAgICAgIC8vIGNlcnRhaW5seSBkaWRuJ3QgaW50ZW5kIGluZmluaXRlIHJlLWV2YWx1YXRpb25zKS4gU28sIGZvciBwcmVkaWN0YWJpbGl0eSwgd2Ugc2ltcGx5IHByZXZlbnQga28uY29tcHV0ZWRzIGZyb20gY2F1c2luZ1xuICAgICAgICAgICAgLy8gdGhlaXIgb3duIHJlLWV2YWx1YXRpb24uIEZ1cnRoZXIgZGlzY3Vzc2lvbiBhdCBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC8zODdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvIG5vdCBldmFsdWF0ZSAoYW5kIHBvc3NpYmx5IGNhcHR1cmUgbmV3IGRlcGVuZGVuY2llcykgaWYgZGlzcG9zZWRcbiAgICAgICAgaWYgKHN0YXRlLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgJiYgIWtvLnV0aWxzLmRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudChzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQpIHx8IGRpc3Bvc2VXaGVuICYmIGRpc3Bvc2VXaGVuKCkpIHtcbiAgICAgICAgICAgIC8vIFNlZSBjb21tZW50IGFib3ZlIGFib3V0IHN1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlXG4gICAgICAgICAgICBpZiAoIXN0YXRlLnN1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdCBqdXN0IGRpZCByZXR1cm4gZmFsc2UsIHNvIHdlIGNhbiBzdG9wIHN1cHByZXNzaW5nIG5vd1xuICAgICAgICAgICAgc3RhdGUuc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2UgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLmlzQmVpbmdFdmFsdWF0ZWQgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2hhbmdlZCA9IHRoaXMuZXZhbHVhdGVJbW1lZGlhdGVfQ2FsbFJlYWRXaXRoRGVwZW5kZW5jeURldGVjdGlvbihub3RpZnlDaGFuZ2UpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc3RhdGUuaXNCZWluZ0V2YWx1YXRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdGF0ZS5kZXBlbmRlbmNpZXNDb3VudCkge1xuICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGFuZ2VkO1xuICAgIH0sXG4gICAgZXZhbHVhdGVJbW1lZGlhdGVfQ2FsbFJlYWRXaXRoRGVwZW5kZW5jeURldGVjdGlvbjogZnVuY3Rpb24gKG5vdGlmeUNoYW5nZSkge1xuICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHJlYWxseSBqdXN0IHBhcnQgb2YgdGhlIGV2YWx1YXRlSW1tZWRpYXRlIGxvZ2ljLiBZb3Ugd291bGQgbmV2ZXIgY2FsbCBpdCBmcm9tIGFueXdoZXJlIGVsc2UuXG4gICAgICAgIC8vIEZhY3RvcmluZyBpdCBvdXQgaW50byBhIHNlcGFyYXRlIGZ1bmN0aW9uIG1lYW5zIGl0IGNhbiBiZSBpbmRlcGVuZGVudCBvZiB0aGUgdHJ5L2NhdGNoIGJsb2NrIGluIGV2YWx1YXRlSW1tZWRpYXRlLFxuICAgICAgICAvLyB3aGljaCBjb250cmlidXRlcyB0byBzYXZpbmcgYWJvdXQgNDAlIG9mZiB0aGUgQ1BVIG92ZXJoZWFkIG9mIGNvbXB1dGVkIGV2YWx1YXRpb24gKG9uIFY4IGF0IGxlYXN0KS5cblxuICAgICAgICB2YXIgY29tcHV0ZWRPYnNlcnZhYmxlID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gY29tcHV0ZWRPYnNlcnZhYmxlW2NvbXB1dGVkU3RhdGVdLFxuICAgICAgICAgICAgY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIEluaXRpYWxseSwgd2UgYXNzdW1lIHRoYXQgbm9uZSBvZiB0aGUgc3Vic2NyaXB0aW9ucyBhcmUgc3RpbGwgYmVpbmcgdXNlZCAoaS5lLiwgYWxsIGFyZSBjYW5kaWRhdGVzIGZvciBkaXNwb3NhbCkuXG4gICAgICAgIC8vIFRoZW4sIGR1cmluZyBldmFsdWF0aW9uLCB3ZSBjcm9zcyBvZmYgYW55IHRoYXQgYXJlIGluIGZhY3Qgc3RpbGwgYmVpbmcgdXNlZC5cbiAgICAgICAgdmFyIGlzSW5pdGlhbCA9IHN0YXRlLnB1cmUgPyB1bmRlZmluZWQgOiAhc3RhdGUuZGVwZW5kZW5jaWVzQ291bnQsICAgLy8gSWYgd2UncmUgZXZhbHVhdGluZyB3aGVuIHRoZXJlIGFyZSBubyBwcmV2aW91cyBkZXBlbmRlbmNpZXMsIGl0IG11c3QgYmUgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgICAgIGRlcGVuZGVuY3lEZXRlY3Rpb25Db250ZXh0ID0ge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZTogY29tcHV0ZWRPYnNlcnZhYmxlLFxuICAgICAgICAgICAgICAgIGRpc3Bvc2FsQ2FuZGlkYXRlczogc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nLFxuICAgICAgICAgICAgICAgIGRpc3Bvc2FsQ291bnQ6IHN0YXRlLmRlcGVuZGVuY2llc0NvdW50XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uYmVnaW4oe1xuICAgICAgICAgICAgY2FsbGJhY2tUYXJnZXQ6IGRlcGVuZGVuY3lEZXRlY3Rpb25Db250ZXh0LFxuICAgICAgICAgICAgY2FsbGJhY2s6IGNvbXB1dGVkQmVnaW5EZXBlbmRlbmN5RGV0ZWN0aW9uQ2FsbGJhY2ssXG4gICAgICAgICAgICBjb21wdXRlZDogY29tcHV0ZWRPYnNlcnZhYmxlLFxuICAgICAgICAgICAgaXNJbml0aWFsOiBpc0luaXRpYWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nID0ge307XG4gICAgICAgIHN0YXRlLmRlcGVuZGVuY2llc0NvdW50ID0gMDtcblxuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmV2YWx1YXRlSW1tZWRpYXRlX0NhbGxSZWFkVGhlbkVuZERlcGVuZGVuY3lEZXRlY3Rpb24oc3RhdGUsIGRlcGVuZGVuY3lEZXRlY3Rpb25Db250ZXh0KTtcblxuICAgICAgICBpZiAoY29tcHV0ZWRPYnNlcnZhYmxlLmlzRGlmZmVyZW50KHN0YXRlLmxhdGVzdFZhbHVlLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICghc3RhdGUuaXNTbGVlcGluZykge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKHN0YXRlLmxhdGVzdFZhbHVlLCBcImJlZm9yZUNoYW5nZVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdGUubGF0ZXN0VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIGlmIChERUJVRykgY29tcHV0ZWRPYnNlcnZhYmxlLl9sYXRlc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUuaXNTbGVlcGluZykge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZS51cGRhdGVWZXJzaW9uKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vdGlmeUNoYW5nZSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKHN0YXRlLmxhdGVzdFZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNJbml0aWFsKSB7XG4gICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGVbXCJub3RpZnlTdWJzY3JpYmVyc1wiXShzdGF0ZS5sYXRlc3RWYWx1ZSwgXCJhd2FrZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGFuZ2VkO1xuICAgIH0sXG4gICAgZXZhbHVhdGVJbW1lZGlhdGVfQ2FsbFJlYWRUaGVuRW5kRGVwZW5kZW5jeURldGVjdGlvbjogZnVuY3Rpb24gKHN0YXRlLCBkZXBlbmRlbmN5RGV0ZWN0aW9uQ29udGV4dCkge1xuICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHJlYWxseSBwYXJ0IG9mIHRoZSBldmFsdWF0ZUltbWVkaWF0ZV9DYWxsUmVhZFdpdGhEZXBlbmRlbmN5RGV0ZWN0aW9uIGxvZ2ljLlxuICAgICAgICAvLyBZb3UnZCBuZXZlciBjYWxsIGl0IGZyb20gYW55d2hlcmUgZWxzZS4gRmFjdG9yaW5nIGl0IG91dCBtZWFucyB0aGF0IGV2YWx1YXRlSW1tZWRpYXRlX0NhbGxSZWFkV2l0aERlcGVuZGVuY3lEZXRlY3Rpb25cbiAgICAgICAgLy8gY2FuIGJlIGluZGVwZW5kZW50IG9mIHRyeS9maW5hbGx5IGJsb2Nrcywgd2hpY2ggY29udHJpYnV0ZXMgdG8gc2F2aW5nIGFib3V0IDQwJSBvZmYgdGhlIENQVVxuICAgICAgICAvLyBvdmVyaGVhZCBvZiBjb21wdXRlZCBldmFsdWF0aW9uIChvbiBWOCBhdCBsZWFzdCkuXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciByZWFkRnVuY3Rpb24gPSBzdGF0ZS5yZWFkRnVuY3Rpb247XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQgPyByZWFkRnVuY3Rpb24uY2FsbChzdGF0ZS5ldmFsdWF0b3JGdW5jdGlvblRhcmdldCkgOiByZWFkRnVuY3Rpb24oKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7XG5cbiAgICAgICAgICAgIC8vIEZvciBlYWNoIHN1YnNjcmlwdGlvbiBubyBsb25nZXIgYmVpbmcgdXNlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIGFjdGl2ZSBzdWJzY3JpcHRpb25zIGxpc3QgYW5kIGRpc3Bvc2UgaXRcbiAgICAgICAgICAgIGlmIChkZXBlbmRlbmN5RGV0ZWN0aW9uQ29udGV4dC5kaXNwb3NhbENvdW50ICYmICFzdGF0ZS5pc1NsZWVwaW5nKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChkZXBlbmRlbmN5RGV0ZWN0aW9uQ29udGV4dC5kaXNwb3NhbENhbmRpZGF0ZXMsIGNvbXB1dGVkRGlzcG9zZURlcGVuZGVuY3lDYWxsYmFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXRlLmlzU3RhbGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcGVlazogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBQZWVrIHdvbid0IHJlLWV2YWx1YXRlLCBleGNlcHQgd2hpbGUgdGhlIGNvbXB1dGVkIGlzIHNsZWVwaW5nIG9yIHRvIGdldCB0aGUgaW5pdGlhbCB2YWx1ZSB3aGVuIFwiZGVmZXJFdmFsdWF0aW9uXCIgaXMgc2V0LlxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzW2NvbXB1dGVkU3RhdGVdO1xuICAgICAgICBpZiAoKHN0YXRlLmlzU3RhbGUgJiYgIXN0YXRlLmRlcGVuZGVuY2llc0NvdW50KSB8fCAoc3RhdGUuaXNTbGVlcGluZyAmJiB0aGlzLmhhdmVEZXBlbmRlbmNpZXNDaGFuZ2VkKCkpKSB7XG4gICAgICAgICAgICB0aGlzLmV2YWx1YXRlSW1tZWRpYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlLmxhdGVzdFZhbHVlO1xuICAgIH0sXG4gICAgbGltaXQ6IGZ1bmN0aW9uIChsaW1pdEZ1bmN0aW9uKSB7XG4gICAgICAgIC8vIE92ZXJyaWRlIHRoZSBsaW1pdCBmdW5jdGlvbiB3aXRoIG9uZSB0aGF0IGRlbGF5cyBldmFsdWF0aW9uIGFzIHdlbGxcbiAgICAgICAga28uc3Vic2NyaWJhYmxlWydmbiddLmxpbWl0LmNhbGwodGhpcywgbGltaXRGdW5jdGlvbik7XG4gICAgICAgIHRoaXMuX2V2YWxEZWxheWVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fbGltaXRCZWZvcmVDaGFuZ2UodGhpc1tjb21wdXRlZFN0YXRlXS5sYXRlc3RWYWx1ZSk7XG5cbiAgICAgICAgICAgIHRoaXNbY29tcHV0ZWRTdGF0ZV0uaXNTdGFsZSA9IHRydWU7IC8vIE1hcmsgYXMgZGlydHlcblxuICAgICAgICAgICAgLy8gUGFzcyB0aGUgb2JzZXJ2YWJsZSB0byB0aGUgXCJsaW1pdFwiIGNvZGUsIHdoaWNoIHdpbGwgYWNjZXNzIGl0IHdoZW5cbiAgICAgICAgICAgIC8vIGl0J3MgdGltZSB0byBkbyB0aGUgbm90aWZpY2F0aW9uLlxuICAgICAgICAgICAgdGhpcy5fbGltaXRDaGFuZ2UodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRpc3Bvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpc1tjb21wdXRlZFN0YXRlXTtcbiAgICAgICAgaWYgKCFzdGF0ZS5pc1NsZWVwaW5nICYmIHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZykge1xuICAgICAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmcsIGZ1bmN0aW9uIChpZCwgZGVwZW5kZW5jeSkge1xuICAgICAgICAgICAgICAgIGlmIChkZXBlbmRlbmN5LmRpc3Bvc2UpXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kuZGlzcG9zZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCAmJiBzdGF0ZS5kb21Ob2RlRGlzcG9zYWxDYWxsYmFjaykge1xuICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZURpc3Bvc2VDYWxsYmFjayhzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQsIHN0YXRlLmRvbU5vZGVEaXNwb3NhbENhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmcgPSBudWxsO1xuICAgICAgICBzdGF0ZS5kZXBlbmRlbmNpZXNDb3VudCA9IDA7XG4gICAgICAgIHN0YXRlLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICBzdGF0ZS5pc1N0YWxlID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLmlzU2xlZXBpbmcgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkID0gbnVsbDtcbiAgICB9XG59O1xuXG52YXIgcHVyZUNvbXB1dGVkT3ZlcnJpZGVzID0ge1xuICAgIGJlZm9yZVN1YnNjcmlwdGlvbkFkZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIElmIGFzbGVlcCwgd2FrZSB1cCB0aGUgY29tcHV0ZWQgYnkgc3Vic2NyaWJpbmcgdG8gYW55IGRlcGVuZGVuY2llcy5cbiAgICAgICAgdmFyIGNvbXB1dGVkT2JzZXJ2YWJsZSA9IHRoaXMsXG4gICAgICAgICAgICBzdGF0ZSA9IGNvbXB1dGVkT2JzZXJ2YWJsZVtjb21wdXRlZFN0YXRlXTtcbiAgICAgICAgaWYgKCFzdGF0ZS5pc0Rpc3Bvc2VkICYmIHN0YXRlLmlzU2xlZXBpbmcgJiYgZXZlbnQgPT0gJ2NoYW5nZScpIHtcbiAgICAgICAgICAgIHN0YXRlLmlzU2xlZXBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5pc1N0YWxlIHx8IGNvbXB1dGVkT2JzZXJ2YWJsZS5oYXZlRGVwZW5kZW5jaWVzQ2hhbmdlZCgpKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kZXBlbmRlbmNpZXNDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgc3RhdGUuaXNTdGFsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkT2JzZXJ2YWJsZS5ldmFsdWF0ZUltbWVkaWF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZS51cGRhdGVWZXJzaW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBwdXQgdGhlIGRlcGVuZGVuY2llcyBpbiBvcmRlclxuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlY2llc09yZGVyID0gW107XG4gICAgICAgICAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmcsIGZ1bmN0aW9uIChpZCwgZGVwZW5kZW5jeSkge1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlY2llc09yZGVyW2RlcGVuZGVuY3kuX29yZGVyXSA9IGlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIE5leHQsIHN1YnNjcmliZSB0byBlYWNoIG9uZVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChkZXBlbmRlY2llc09yZGVyLCBmdW5jdGlvbiAoaWQsIG9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5ID0gc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nW2lkXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IGNvbXB1dGVkT2JzZXJ2YWJsZS5zdWJzY3JpYmVUb0RlcGVuZGVuY3koZGVwZW5kZW5jeS5fdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLl9vcmRlciA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uX3ZlcnNpb24gPSBkZXBlbmRlbmN5Ll92ZXJzaW9uO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmdbaWRdID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdGF0ZS5pc0Rpc3Bvc2VkKSB7ICAgICAvLyB0ZXN0IHNpbmNlIGV2YWx1YXRpbmcgY291bGQgdHJpZ2dlciBkaXNwb3NhbFxuICAgICAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKHN0YXRlLmxhdGVzdFZhbHVlLCBcImF3YWtlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhZnRlclN1YnNjcmlwdGlvblJlbW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXNbY29tcHV0ZWRTdGF0ZV07XG4gICAgICAgIGlmICghc3RhdGUuaXNEaXNwb3NlZCAmJiBldmVudCA9PSAnY2hhbmdlJyAmJiAhdGhpcy5oYXNTdWJzY3JpcHRpb25zRm9yRXZlbnQoJ2NoYW5nZScpKSB7XG4gICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZywgZnVuY3Rpb24gKGlkLCBkZXBlbmRlbmN5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3kuZGlzcG9zZSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmdbaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RhcmdldDogZGVwZW5kZW5jeS5fdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgX29yZGVyOiBkZXBlbmRlbmN5Ll9vcmRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIF92ZXJzaW9uOiBkZXBlbmRlbmN5Ll92ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RhdGUuaXNTbGVlcGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0odW5kZWZpbmVkLCBcImFzbGVlcFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VmVyc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBCZWNhdXNlIGEgcHVyZSBjb21wdXRlZCBpcyBub3QgYXV0b21hdGljYWxseSB1cGRhdGVkIHdoaWxlIGl0IGlzIHNsZWVwaW5nLCB3ZSBjYW4ndFxuICAgICAgICAvLyBzaW1wbHkgcmV0dXJuIHRoZSB2ZXJzaW9uIG51bWJlci4gSW5zdGVhZCwgd2UgY2hlY2sgaWYgYW55IG9mIHRoZSBkZXBlbmRlbmNpZXMgaGF2ZVxuICAgICAgICAvLyBjaGFuZ2VkIGFuZCBjb25kaXRpb25hbGx5IHJlLWV2YWx1YXRlIHRoZSBjb21wdXRlZCBvYnNlcnZhYmxlLlxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzW2NvbXB1dGVkU3RhdGVdO1xuICAgICAgICBpZiAoc3RhdGUuaXNTbGVlcGluZyAmJiAoc3RhdGUuaXNTdGFsZSB8fCB0aGlzLmhhdmVEZXBlbmRlbmNpZXNDaGFuZ2VkKCkpKSB7XG4gICAgICAgICAgICB0aGlzLmV2YWx1YXRlSW1tZWRpYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtvLnN1YnNjcmliYWJsZVsnZm4nXS5nZXRWZXJzaW9uLmNhbGwodGhpcyk7XG4gICAgfVxufTtcblxudmFyIGRlZmVyRXZhbHVhdGlvbk92ZXJyaWRlcyA9IHtcbiAgICBiZWZvcmVTdWJzY3JpcHRpb25BZGQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgZm9yY2UgYSBjb21wdXRlZCB3aXRoIGRlZmVyRXZhbHVhdGlvbiB0byBldmFsdWF0ZSB3aGVuIHRoZSBmaXJzdCBzdWJzY3JpcHRpb24gaXMgcmVnaXN0ZXJlZC5cbiAgICAgICAgaWYgKGV2ZW50ID09ICdjaGFuZ2UnIHx8IGV2ZW50ID09ICdiZWZvcmVDaGFuZ2UnKSB7XG4gICAgICAgICAgICB0aGlzLnBlZWsoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIE5vdGUgdGhhdCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHRoZVxuLy8gaW5oZXJpdGFuY2UgY2hhaW4gaXMgY3JlYXRlZCBtYW51YWxseSBpbiB0aGUga28uY29tcHV0ZWQgY29uc3RydWN0b3JcbmlmIChrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZihjb21wdXRlZEZuLCBrby5zdWJzY3JpYmFibGVbJ2ZuJ10pO1xufVxuXG4vLyBTZXQgdGhlIHByb3RvIGNoYWluIHZhbHVlcyBmb3Iga28uaGFzUHJvdG90eXBlXG52YXIgcHJvdG9Qcm9wID0ga28ub2JzZXJ2YWJsZS5wcm90b1Byb3BlcnR5OyAvLyA9PSBcIl9fa29fcHJvdG9fX1wiXG5rby5jb21wdXRlZFtwcm90b1Byb3BdID0ga28ub2JzZXJ2YWJsZTtcbmNvbXB1dGVkRm5bcHJvdG9Qcm9wXSA9IGtvLmNvbXB1dGVkO1xuXG5rby5pc0NvbXB1dGVkID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGtvLmhhc1Byb3RvdHlwZShpbnN0YW5jZSwga28uY29tcHV0ZWQpO1xufTtcblxua28uaXNQdXJlQ29tcHV0ZWQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4ga28uaGFzUHJvdG90eXBlKGluc3RhbmNlLCBrby5jb21wdXRlZClcbiAgICAgICAgJiYgaW5zdGFuY2VbY29tcHV0ZWRTdGF0ZV0gJiYgaW5zdGFuY2VbY29tcHV0ZWRTdGF0ZV0ucHVyZTtcbn07XG5cbmtvLmV4cG9ydFN5bWJvbCgnY29tcHV0ZWQnLCBrby5jb21wdXRlZCk7XG5rby5leHBvcnRTeW1ib2woJ2RlcGVuZGVudE9ic2VydmFibGUnLCBrby5jb21wdXRlZCk7ICAgIC8vIGV4cG9ydCBrby5kZXBlbmRlbnRPYnNlcnZhYmxlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSAoMS54KVxua28uZXhwb3J0U3ltYm9sKCdpc0NvbXB1dGVkJywga28uaXNDb21wdXRlZCk7XG5rby5leHBvcnRTeW1ib2woJ2lzUHVyZUNvbXB1dGVkJywga28uaXNQdXJlQ29tcHV0ZWQpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZC5mbicsIGNvbXB1dGVkRm4pO1xua28uZXhwb3J0UHJvcGVydHkoY29tcHV0ZWRGbiwgJ3BlZWsnLCBjb21wdXRlZEZuLnBlZWspO1xua28uZXhwb3J0UHJvcGVydHkoY29tcHV0ZWRGbiwgJ2Rpc3Bvc2UnLCBjb21wdXRlZEZuLmRpc3Bvc2UpO1xua28uZXhwb3J0UHJvcGVydHkoY29tcHV0ZWRGbiwgJ2lzQWN0aXZlJywgY29tcHV0ZWRGbi5pc0FjdGl2ZSk7XG5rby5leHBvcnRQcm9wZXJ0eShjb21wdXRlZEZuLCAnZ2V0RGVwZW5kZW5jaWVzQ291bnQnLCBjb21wdXRlZEZuLmdldERlcGVuZGVuY2llc0NvdW50KTtcblxua28ucHVyZUNvbXB1dGVkID0gZnVuY3Rpb24gKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCwgeydwdXJlJzp0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMgPSBrby51dGlscy5leHRlbmQoe30sIGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zKTsgICAvLyBtYWtlIGEgY29weSBvZiB0aGUgcGFyYW1ldGVyIG9iamVjdFxuICAgICAgICBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9uc1sncHVyZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCk7XG4gICAgfVxufVxua28uZXhwb3J0U3ltYm9sKCdwdXJlQ29tcHV0ZWQnLCBrby5wdXJlQ29tcHV0ZWQpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1heE5lc3RlZE9ic2VydmFibGVEZXB0aCA9IDEwOyAvLyBFc2NhcGUgdGhlICh1bmxpa2VseSkgcGF0aGFsb2dpY2FsIGNhc2Ugd2hlcmUgYW4gb2JzZXJ2YWJsZSdzIGN1cnJlbnQgdmFsdWUgaXMgaXRzZWxmIChvciBzaW1pbGFyIHJlZmVyZW5jZSBjeWNsZSlcblxuICAgIGtvLnRvSlMgPSBmdW5jdGlvbihyb290T2JqZWN0KSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXaGVuIGNhbGxpbmcga28udG9KUywgcGFzcyB0aGUgb2JqZWN0IHlvdSB3YW50IHRvIGNvbnZlcnQuXCIpO1xuXG4gICAgICAgIC8vIFdlIGp1c3QgdW53cmFwIGV2ZXJ5dGhpbmcgYXQgZXZlcnkgbGV2ZWwgaW4gdGhlIG9iamVjdCBncmFwaFxuICAgICAgICByZXR1cm4gbWFwSnNPYmplY3RHcmFwaChyb290T2JqZWN0LCBmdW5jdGlvbih2YWx1ZVRvTWFwKSB7XG4gICAgICAgICAgICAvLyBMb29wIGJlY2F1c2UgYW4gb2JzZXJ2YWJsZSdzIHZhbHVlIG1pZ2h0IGluIHR1cm4gYmUgYW5vdGhlciBvYnNlcnZhYmxlIHdyYXBwZXJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBrby5pc09ic2VydmFibGUodmFsdWVUb01hcCkgJiYgKGkgPCBtYXhOZXN0ZWRPYnNlcnZhYmxlRGVwdGgpOyBpKyspXG4gICAgICAgICAgICAgICAgdmFsdWVUb01hcCA9IHZhbHVlVG9NYXAoKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVRvTWFwO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAga28udG9KU09OID0gZnVuY3Rpb24ocm9vdE9iamVjdCwgcmVwbGFjZXIsIHNwYWNlKSB7ICAgICAvLyByZXBsYWNlciBhbmQgc3BhY2UgYXJlIG9wdGlvbmFsXG4gICAgICAgIHZhciBwbGFpbkphdmFTY3JpcHRPYmplY3QgPSBrby50b0pTKHJvb3RPYmplY3QpO1xuICAgICAgICByZXR1cm4ga28udXRpbHMuc3RyaW5naWZ5SnNvbihwbGFpbkphdmFTY3JpcHRPYmplY3QsIHJlcGxhY2VyLCBzcGFjZSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG1hcEpzT2JqZWN0R3JhcGgocm9vdE9iamVjdCwgbWFwSW5wdXRDYWxsYmFjaywgdmlzaXRlZE9iamVjdHMpIHtcbiAgICAgICAgdmlzaXRlZE9iamVjdHMgPSB2aXNpdGVkT2JqZWN0cyB8fCBuZXcgb2JqZWN0TG9va3VwKCk7XG5cbiAgICAgICAgcm9vdE9iamVjdCA9IG1hcElucHV0Q2FsbGJhY2socm9vdE9iamVjdCk7XG4gICAgICAgIHZhciBjYW5IYXZlUHJvcGVydGllcyA9ICh0eXBlb2Ygcm9vdE9iamVjdCA9PSBcIm9iamVjdFwiKSAmJiAocm9vdE9iamVjdCAhPT0gbnVsbCkgJiYgKHJvb3RPYmplY3QgIT09IHVuZGVmaW5lZCkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIFJlZ0V4cCkpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBEYXRlKSkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIFN0cmluZykpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBOdW1iZXIpKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgQm9vbGVhbikpO1xuICAgICAgICBpZiAoIWNhbkhhdmVQcm9wZXJ0aWVzKVxuICAgICAgICAgICAgcmV0dXJuIHJvb3RPYmplY3Q7XG5cbiAgICAgICAgdmFyIG91dHB1dFByb3BlcnRpZXMgPSByb290T2JqZWN0IGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xuICAgICAgICB2aXNpdGVkT2JqZWN0cy5zYXZlKHJvb3RPYmplY3QsIG91dHB1dFByb3BlcnRpZXMpO1xuXG4gICAgICAgIHZpc2l0UHJvcGVydGllc09yQXJyYXlFbnRyaWVzKHJvb3RPYmplY3QsIGZ1bmN0aW9uKGluZGV4ZXIpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gbWFwSW5wdXRDYWxsYmFjayhyb290T2JqZWN0W2luZGV4ZXJdKTtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0UHJvcGVydGllc1tpbmRleGVyXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c2x5TWFwcGVkVmFsdWUgPSB2aXNpdGVkT2JqZWN0cy5nZXQocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFByb3BlcnRpZXNbaW5kZXhlcl0gPSAocHJldmlvdXNseU1hcHBlZFZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHByZXZpb3VzbHlNYXBwZWRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBtYXBKc09iamVjdEdyYXBoKHByb3BlcnR5VmFsdWUsIG1hcElucHV0Q2FsbGJhY2ssIHZpc2l0ZWRPYmplY3RzKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvdXRwdXRQcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZpc2l0UHJvcGVydGllc09yQXJyYXlFbnRyaWVzKHJvb3RPYmplY3QsIHZpc2l0b3JDYWxsYmFjaykge1xuICAgICAgICBpZiAocm9vdE9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvb3RPYmplY3QubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgdmlzaXRvckNhbGxiYWNrKGkpO1xuXG4gICAgICAgICAgICAvLyBGb3IgYXJyYXlzLCBhbHNvIHJlc3BlY3QgdG9KU09OIHByb3BlcnR5IGZvciBjdXN0b20gbWFwcGluZ3MgKGZpeGVzICMyNzgpXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3RPYmplY3RbJ3RvSlNPTiddID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgdmlzaXRvckNhbGxiYWNrKCd0b0pTT04nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiByb290T2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmlzaXRvckNhbGxiYWNrKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb2JqZWN0TG9va3VwKCkge1xuICAgICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcbiAgICB9O1xuXG4gICAgb2JqZWN0TG9va3VwLnByb3RvdHlwZSA9IHtcbiAgICAgICAgY29uc3RydWN0b3I6IG9iamVjdExvb2t1cCxcbiAgICAgICAgc2F2ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5rZXlzLCBrZXkpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tleGlzdGluZ0luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciBleGlzdGluZ0luZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMua2V5cywga2V5KTtcbiAgICAgICAgICAgIHJldHVybiAoZXhpc3RpbmdJbmRleCA+PSAwKSA/IHRoaXMudmFsdWVzW2V4aXN0aW5nSW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndG9KUycsIGtvLnRvSlMpO1xua28uZXhwb3J0U3ltYm9sKCd0b0pTT04nLCBrby50b0pTT04pO1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eSA9ICdfX2tvX19oYXNEb21EYXRhT3B0aW9uVmFsdWVfXyc7XG5cbiAgICAvLyBOb3JtYWxseSwgU0VMRUNUIGVsZW1lbnRzIGFuZCB0aGVpciBPUFRJT05zIGNhbiBvbmx5IHRha2UgdmFsdWUgb2YgdHlwZSAnc3RyaW5nJyAoYmVjYXVzZSB0aGUgdmFsdWVzXG4gICAgLy8gYXJlIHN0b3JlZCBvbiBET00gYXR0cmlidXRlcykuIGtvLnNlbGVjdEV4dGVuc2lvbnMgcHJvdmlkZXMgYSB3YXkgZm9yIFNFTEVDVHMvT1BUSU9OcyB0byBoYXZlIHZhbHVlc1xuICAgIC8vIHRoYXQgYXJlIGFyYml0cmFyeSBvYmplY3RzLiBUaGlzIGlzIHZlcnkgY29udmVuaWVudCB3aGVuIGltcGxlbWVudGluZyB0aGluZ3MgbGlrZSBjYXNjYWRpbmcgZHJvcGRvd25zLlxuICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMgPSB7XG4gICAgICAgIHJlYWRWYWx1ZSA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRbaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eV0gPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMuZG9tRGF0YS5nZXQoZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzLm9wdGlvbnMub3B0aW9uVmFsdWVEb21EYXRhS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmllVmVyc2lvbiA8PSA3XG4gICAgICAgICAgICAgICAgICAgICAgICA/IChlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUoJ3ZhbHVlJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKCd2YWx1ZScpLnNwZWNpZmllZCA/IGVsZW1lbnQudmFsdWUgOiBlbGVtZW50LnRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwID8ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHdyaXRlVmFsdWU6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlLCBhbGxvd1Vuc2V0KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ29wdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnMub3B0aW9ucy5vcHRpb25WYWx1ZURvbURhdGFLZXksIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0RvbURhdGFFeHBhbmRvUHJvcGVydHkgaW4gZWxlbWVudCkgeyAvLyBJRSA8PSA4IHRocm93cyBlcnJvcnMgaWYgeW91IGRlbGV0ZSBub24tZXhpc3RlbnQgcHJvcGVydGllcyBmcm9tIGEgRE9NIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnRbaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgYXJiaXRyYXJ5IG9iamVjdCB1c2luZyBEb21EYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzLm9wdGlvbnMub3B0aW9uVmFsdWVEb21EYXRhS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFtoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5XSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIHRyZWF0bWVudCBvZiBudW1iZXJzIGlzIGp1c3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuIEtPIDEuMi4xIHdyb3RlIG51bWVyaWNhbCB2YWx1ZXMgdG8gZWxlbWVudC52YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiID8gdmFsdWUgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCB2YWx1ZSA9PT0gbnVsbCkgICAgICAgLy8gQSBibGFuayBzdHJpbmcgb3IgbnVsbCB2YWx1ZSB3aWxsIHNlbGVjdCB0aGUgY2FwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBlbGVtZW50Lm9wdGlvbnMubGVuZ3RoLCBvcHRpb25WYWx1ZTsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uVmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50Lm9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5jbHVkZSBzcGVjaWFsIGNoZWNrIHRvIGhhbmRsZSBzZWxlY3RpbmcgYSBjYXB0aW9uIHdpdGggYSBibGFuayBzdHJpbmcgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25WYWx1ZSA9PSB2YWx1ZSB8fCAob3B0aW9uVmFsdWUgPT0gXCJcIiAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbiA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93VW5zZXQgfHwgc2VsZWN0aW9uID49IDAgfHwgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgZWxlbWVudC5zaXplID4gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlID09PSBudWxsKSB8fCAodmFsdWUgPT09IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdzZWxlY3RFeHRlbnNpb25zJywga28uc2VsZWN0RXh0ZW5zaW9ucyk7XG5rby5leHBvcnRTeW1ib2woJ3NlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlJywga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUpO1xua28uZXhwb3J0U3ltYm9sKCdzZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUnLCBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUpO1xua28uZXhwcmVzc2lvblJld3JpdGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGphdmFTY3JpcHRSZXNlcnZlZFdvcmRzID0gW1widHJ1ZVwiLCBcImZhbHNlXCIsIFwibnVsbFwiLCBcInVuZGVmaW5lZFwiXTtcblxuICAgIC8vIE1hdGNoZXMgc29tZXRoaW5nIHRoYXQgY2FuIGJlIGFzc2lnbmVkIHRvLS1laXRoZXIgYW4gaXNvbGF0ZWQgaWRlbnRpZmllciBvciBzb21ldGhpbmcgZW5kaW5nIHdpdGggYSBwcm9wZXJ0eSBhY2Nlc3NvclxuICAgIC8vIFRoaXMgaXMgZGVzaWduZWQgdG8gYmUgc2ltcGxlIGFuZCBhdm9pZCBmYWxzZSBuZWdhdGl2ZXMsIGJ1dCBjb3VsZCBwcm9kdWNlIGZhbHNlIHBvc2l0aXZlcyAoZS5nLiwgYStiLmMpLlxuICAgIC8vIFRoaXMgYWxzbyB3aWxsIG5vdCBwcm9wZXJseSBoYW5kbGUgbmVzdGVkIGJyYWNrZXRzIChlLmcuLCBvYmoxW29iajJbJ3Byb3AnXV07IHNlZSAjOTExKS5cbiAgICB2YXIgamF2YVNjcmlwdEFzc2lnbm1lbnRUYXJnZXQgPSAvXig/OlskX2Etel1bJFxcd10qfCguKykoXFwuXFxzKlskX2Etel1bJFxcd10qfFxcWy4rXFxdKSkkL2k7XG5cbiAgICBmdW5jdGlvbiBnZXRXcml0ZWFibGVWYWx1ZShleHByZXNzaW9uKSB7XG4gICAgICAgIGlmIChrby51dGlscy5hcnJheUluZGV4T2YoamF2YVNjcmlwdFJlc2VydmVkV29yZHMsIGV4cHJlc3Npb24pID49IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goamF2YVNjcmlwdEFzc2lnbm1lbnRUYXJnZXQpO1xuICAgICAgICByZXR1cm4gbWF0Y2ggPT09IG51bGwgPyBmYWxzZSA6IG1hdGNoWzFdID8gKCdPYmplY3QoJyArIG1hdGNoWzFdICsgJyknICsgbWF0Y2hbMl0pIDogZXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMgd2lsbCBiZSB1c2VkIHRvIHNwbGl0IGFuIG9iamVjdC1saXRlcmFsIHN0cmluZyBpbnRvIHRva2Vuc1xuXG4gICAgICAgIC8vIFRoZXNlIHR3byBtYXRjaCBzdHJpbmdzLCBlaXRoZXIgd2l0aCBkb3VibGUgcXVvdGVzIG9yIHNpbmdsZSBxdW90ZXNcbiAgICB2YXIgc3RyaW5nRG91YmxlID0gJ1wiKD86W15cIlxcXFxcXFxcXXxcXFxcXFxcXC4pKlwiJyxcbiAgICAgICAgc3RyaW5nU2luZ2xlID0gXCInKD86W14nXFxcXFxcXFxdfFxcXFxcXFxcLikqJ1wiLFxuICAgICAgICAvLyBNYXRjaGVzIGEgcmVndWxhciBleHByZXNzaW9uICh0ZXh0IGVuY2xvc2VkIGJ5IHNsYXNoZXMpLCBidXQgd2lsbCBhbHNvIG1hdGNoIHNldHMgb2YgZGl2aXNpb25zXG4gICAgICAgIC8vIGFzIGEgcmVndWxhciBleHByZXNzaW9uICh0aGlzIGlzIGhhbmRsZWQgYnkgdGhlIHBhcnNpbmcgbG9vcCBiZWxvdykuXG4gICAgICAgIHN0cmluZ1JlZ2V4cCA9ICcvKD86W14vXFxcXFxcXFxdfFxcXFxcXFxcLikqL1xcdyonLFxuICAgICAgICAvLyBUaGVzZSBjaGFyYWN0ZXJzIGhhdmUgc3BlY2lhbCBtZWFuaW5nIHRvIHRoZSBwYXJzZXIgYW5kIG11c3Qgbm90IGFwcGVhciBpbiB0aGUgbWlkZGxlIG9mIGFcbiAgICAgICAgLy8gdG9rZW4sIGV4Y2VwdCBhcyBwYXJ0IG9mIGEgc3RyaW5nLlxuICAgICAgICBzcGVjaWFscyA9ICcsXCJcXCd7fSgpLzpbXFxcXF0nLFxuICAgICAgICAvLyBNYXRjaCB0ZXh0IChhdCBsZWFzdCB0d28gY2hhcmFjdGVycykgdGhhdCBkb2VzIG5vdCBjb250YWluIGFueSBvZiB0aGUgYWJvdmUgc3BlY2lhbCBjaGFyYWN0ZXJzLFxuICAgICAgICAvLyBhbHRob3VnaCBzb21lIG9mIHRoZSBzcGVjaWFsIGNoYXJhY3RlcnMgYXJlIGFsbG93ZWQgdG8gc3RhcnQgaXQgKGFsbCBidXQgdGhlIGNvbG9uIGFuZCBjb21tYSkuXG4gICAgICAgIC8vIFRoZSB0ZXh0IGNhbiBjb250YWluIHNwYWNlcywgYnV0IGxlYWRpbmcgb3IgdHJhaWxpbmcgc3BhY2VzIGFyZSBza2lwcGVkLlxuICAgICAgICBldmVyeVRoaW5nRWxzZSA9ICdbXlxcXFxzOiwvXVteJyArIHNwZWNpYWxzICsgJ10qW15cXFxccycgKyBzcGVjaWFscyArICddJyxcbiAgICAgICAgLy8gTWF0Y2ggYW55IG5vbi1zcGFjZSBjaGFyYWN0ZXIgbm90IG1hdGNoZWQgYWxyZWFkeS4gVGhpcyB3aWxsIG1hdGNoIGNvbG9ucyBhbmQgY29tbWFzLCBzaW5jZSB0aGV5J3JlXG4gICAgICAgIC8vIG5vdCBtYXRjaGVkIGJ5IFwiZXZlcnlUaGluZ0Vsc2VcIiwgYnV0IHdpbGwgYWxzbyBtYXRjaCBhbnkgb3RoZXIgc2luZ2xlIGNoYXJhY3RlciB0aGF0IHdhc24ndCBhbHJlYWR5XG4gICAgICAgIC8vIG1hdGNoZWQgKGZvciBleGFtcGxlOiBpbiBcImE6IDEsIGI6IDJcIiwgZWFjaCBvZiB0aGUgbm9uLXNwYWNlIGNoYXJhY3RlcnMgd2lsbCBiZSBtYXRjaGVkIGJ5IG9uZU5vdFNwYWNlKS5cbiAgICAgICAgb25lTm90U3BhY2UgPSAnW15cXFxcc10nLFxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgYWN0dWFsIHJlZ3VsYXIgZXhwcmVzc2lvbiBieSBvci1pbmcgdGhlIGFib3ZlIHN0cmluZ3MuIFRoZSBvcmRlciBpcyBpbXBvcnRhbnQuXG4gICAgICAgIGJpbmRpbmdUb2tlbiA9IFJlZ0V4cChzdHJpbmdEb3VibGUgKyAnfCcgKyBzdHJpbmdTaW5nbGUgKyAnfCcgKyBzdHJpbmdSZWdleHAgKyAnfCcgKyBldmVyeVRoaW5nRWxzZSArICd8JyArIG9uZU5vdFNwYWNlLCAnZycpLFxuXG4gICAgICAgIC8vIE1hdGNoIGVuZCBvZiBwcmV2aW91cyB0b2tlbiB0byBkZXRlcm1pbmUgd2hldGhlciBhIHNsYXNoIGlzIGEgZGl2aXNpb24gb3IgcmVnZXguXG4gICAgICAgIGRpdmlzaW9uTG9va0JlaGluZCA9IC9bXFxdKVwiJ0EtWmEtejAtOV8kXSskLyxcbiAgICAgICAga2V5d29yZFJlZ2V4TG9va0JlaGluZCA9IHsnaW4nOjEsJ3JldHVybic6MSwndHlwZW9mJzoxfTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlT2JqZWN0TGl0ZXJhbChvYmplY3RMaXRlcmFsU3RyaW5nKSB7XG4gICAgICAgIC8vIFRyaW0gbGVhZGluZyBhbmQgdHJhaWxpbmcgc3BhY2VzIGZyb20gdGhlIHN0cmluZ1xuICAgICAgICB2YXIgc3RyID0ga28udXRpbHMuc3RyaW5nVHJpbShvYmplY3RMaXRlcmFsU3RyaW5nKTtcblxuICAgICAgICAvLyBUcmltIGJyYWNlcyAneycgc3Vycm91bmRpbmcgdGhlIHdob2xlIG9iamVjdCBsaXRlcmFsXG4gICAgICAgIGlmIChzdHIuY2hhckNvZGVBdCgwKSA9PT0gMTIzKSBzdHIgPSBzdHIuc2xpY2UoMSwgLTEpO1xuXG4gICAgICAgIC8vIFNwbGl0IGludG8gdG9rZW5zXG4gICAgICAgIHZhciByZXN1bHQgPSBbXSwgdG9rcyA9IHN0ci5tYXRjaChiaW5kaW5nVG9rZW4pLCBrZXksIHZhbHVlcyA9IFtdLCBkZXB0aCA9IDA7XG5cbiAgICAgICAgaWYgKHRva3MpIHtcbiAgICAgICAgICAgIC8vIEFwcGVuZCBhIGNvbW1hIHNvIHRoYXQgd2UgZG9uJ3QgbmVlZCBhIHNlcGFyYXRlIGNvZGUgYmxvY2sgdG8gZGVhbCB3aXRoIHRoZSBsYXN0IGl0ZW1cbiAgICAgICAgICAgIHRva3MucHVzaCgnLCcpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgdG9rOyB0b2sgPSB0b2tzW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRvay5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIC8vIEEgY29tbWEgc2lnbmFscyB0aGUgZW5kIG9mIGEga2V5L3ZhbHVlIHBhaXIgaWYgZGVwdGggaXMgemVyb1xuICAgICAgICAgICAgICAgIGlmIChjID09PSA0NCkgeyAvLyBcIixcIlxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVwdGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goKGtleSAmJiB2YWx1ZXMubGVuZ3RoKSA/IHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlcy5qb2luKCcnKX0gOiB7J3Vua25vd24nOiBrZXkgfHwgdmFsdWVzLmpvaW4oJycpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBkZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gU2ltcGx5IHNraXAgdGhlIGNvbG9uIHRoYXQgc2VwYXJhdGVzIHRoZSBuYW1lIGFuZCB2YWx1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gNTgpIHsgLy8gXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZXB0aCAmJiAha2V5ICYmIHZhbHVlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHZhbHVlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQSBzZXQgb2Ygc2xhc2hlcyBpcyBpbml0aWFsbHkgbWF0Y2hlZCBhcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgYnV0IGNvdWxkIGJlIGRpdmlzaW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA0NyAmJiBpICYmIHRvay5sZW5ndGggPiAxKSB7ICAvLyBcIi9cIlxuICAgICAgICAgICAgICAgICAgICAvLyBMb29rIGF0IHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHRva2VuIHRvIGRldGVybWluZSBpZiB0aGUgc2xhc2ggaXMgYWN0dWFsbHkgZGl2aXNpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdG9rc1tpLTFdLm1hdGNoKGRpdmlzaW9uTG9va0JlaGluZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiAha2V5d29yZFJlZ2V4TG9va0JlaGluZFttYXRjaFswXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBzbGFzaCBpcyBhY3R1YWxseSBhIGRpdmlzaW9uIHB1bmN0dWF0b3I7IHJlLXBhcnNlIHRoZSByZW1haW5kZXIgb2YgdGhlIHN0cmluZyAobm90IGluY2x1ZGluZyB0aGUgc2xhc2gpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKHN0ci5pbmRleE9mKHRvaykgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva3MgPSBzdHIubWF0Y2goYmluZGluZ1Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva3MucHVzaCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCBqdXN0IHRoZSBzbGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rID0gJy8nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGRlcHRoIGZvciBwYXJlbnRoZXNlcywgYnJhY2VzLCBhbmQgYnJhY2tldHMgc28gdGhhdCBpbnRlcmlvciBjb21tYXMgYXJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDQwIHx8IGMgPT09IDEyMyB8fCBjID09PSA5MSkgeyAvLyAnKCcsICd7JywgJ1snXG4gICAgICAgICAgICAgICAgICAgICsrZGVwdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA0MSB8fCBjID09PSAxMjUgfHwgYyA9PT0gOTMpIHsgLy8gJyknLCAnfScsICddJ1xuICAgICAgICAgICAgICAgICAgICAtLWRlcHRoO1xuICAgICAgICAgICAgICAgIC8vIFRoZSBrZXkgd2lsbCBiZSB0aGUgZmlyc3QgdG9rZW47IGlmIGl0J3MgYSBzdHJpbmcsIHRyaW0gdGhlIHF1b3Rlc1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWtleSAmJiAhdmFsdWVzLmxlbmd0aCAmJiAoYyA9PT0gMzQgfHwgYyA9PT0gMzkpKSB7IC8vICdcIicsIFwiJ1wiXG4gICAgICAgICAgICAgICAgICAgIHRvayA9IHRvay5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRvayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBUd28td2F5IGJpbmRpbmdzIGluY2x1ZGUgYSB3cml0ZSBmdW5jdGlvbiB0aGF0IGFsbG93IHRoZSBoYW5kbGVyIHRvIHVwZGF0ZSB0aGUgdmFsdWUgZXZlbiBpZiBpdCdzIG5vdCBhbiBvYnNlcnZhYmxlLlxuICAgIHZhciB0d29XYXlCaW5kaW5ncyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gcHJlUHJvY2Vzc0JpbmRpbmdzKGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5LCBiaW5kaW5nT3B0aW9ucykge1xuICAgICAgICBiaW5kaW5nT3B0aW9ucyA9IGJpbmRpbmdPcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NLZXlWYWx1ZShrZXksIHZhbCkge1xuICAgICAgICAgICAgdmFyIHdyaXRhYmxlVmFsO1xuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbFByZXByb2Nlc3NIb29rKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiAob2JqICYmIG9ialsncHJlcHJvY2VzcyddKSA/ICh2YWwgPSBvYmpbJ3ByZXByb2Nlc3MnXSh2YWwsIGtleSwgcHJvY2Vzc0tleVZhbHVlKSkgOiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFiaW5kaW5nUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsUHJlcHJvY2Vzc0hvb2soa29bJ2dldEJpbmRpbmdIYW5kbGVyJ10oa2V5KSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICh0d29XYXlCaW5kaW5nc1trZXldICYmICh3cml0YWJsZVZhbCA9IGdldFdyaXRlYWJsZVZhbHVlKHZhbCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciB0d28td2F5IGJpbmRpbmdzLCBwcm92aWRlIGEgd3JpdGUgbWV0aG9kIGluIGNhc2UgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzbid0IGEgd3JpdGFibGUgb2JzZXJ2YWJsZS5cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlBY2Nlc3NvclJlc3VsdFN0cmluZ3MucHVzaChcIidcIiArIGtleSArIFwiJzpmdW5jdGlvbihfeil7XCIgKyB3cml0YWJsZVZhbCArIFwiPV96fVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBWYWx1ZXMgYXJlIHdyYXBwZWQgaW4gYSBmdW5jdGlvbiBzbyB0aGF0IGVhY2ggdmFsdWUgY2FuIGJlIGFjY2Vzc2VkIGluZGVwZW5kZW50bHlcbiAgICAgICAgICAgIGlmIChtYWtlVmFsdWVBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSAnZnVuY3Rpb24oKXtyZXR1cm4gJyArIHZhbCArICcgfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRTdHJpbmdzLnB1c2goXCInXCIgKyBrZXkgKyBcIic6XCIgKyB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdFN0cmluZ3MgPSBbXSxcbiAgICAgICAgICAgIHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzID0gW10sXG4gICAgICAgICAgICBtYWtlVmFsdWVBY2Nlc3NvcnMgPSBiaW5kaW5nT3B0aW9uc1sndmFsdWVBY2Nlc3NvcnMnXSxcbiAgICAgICAgICAgIGJpbmRpbmdQYXJhbXMgPSBiaW5kaW5nT3B0aW9uc1snYmluZGluZ1BhcmFtcyddLFxuICAgICAgICAgICAga2V5VmFsdWVBcnJheSA9IHR5cGVvZiBiaW5kaW5nc1N0cmluZ09yS2V5VmFsdWVBcnJheSA9PT0gXCJzdHJpbmdcIiA/XG4gICAgICAgICAgICAgICAgcGFyc2VPYmplY3RMaXRlcmFsKGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5KSA6IGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5O1xuXG4gICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChrZXlWYWx1ZUFycmF5LCBmdW5jdGlvbihrZXlWYWx1ZSkge1xuICAgICAgICAgICAgcHJvY2Vzc0tleVZhbHVlKGtleVZhbHVlLmtleSB8fCBrZXlWYWx1ZVsndW5rbm93biddLCBrZXlWYWx1ZS52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncy5sZW5ndGgpXG4gICAgICAgICAgICBwcm9jZXNzS2V5VmFsdWUoJ19rb19wcm9wZXJ0eV93cml0ZXJzJywgXCJ7XCIgKyBwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncy5qb2luKFwiLFwiKSArIFwiIH1cIik7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFN0cmluZ3Muam9pbihcIixcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzOiBbXSxcblxuICAgICAgICB0d29XYXlCaW5kaW5nczogdHdvV2F5QmluZGluZ3MsXG5cbiAgICAgICAgcGFyc2VPYmplY3RMaXRlcmFsOiBwYXJzZU9iamVjdExpdGVyYWwsXG5cbiAgICAgICAgcHJlUHJvY2Vzc0JpbmRpbmdzOiBwcmVQcm9jZXNzQmluZGluZ3MsXG5cbiAgICAgICAga2V5VmFsdWVBcnJheUNvbnRhaW5zS2V5OiBmdW5jdGlvbihrZXlWYWx1ZUFycmF5LCBrZXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5VmFsdWVBcnJheS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAoa2V5VmFsdWVBcnJheVtpXVsna2V5J10gPT0ga2V5KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBJbnRlcm5hbCwgcHJpdmF0ZSBLTyB1dGlsaXR5IGZvciB1cGRhdGluZyBtb2RlbCBwcm9wZXJ0aWVzIGZyb20gd2l0aGluIGJpbmRpbmdzXG4gICAgICAgIC8vIHByb3BlcnR5OiAgICAgICAgICAgIElmIHRoZSBwcm9wZXJ0eSBiZWluZyB1cGRhdGVkIGlzIChvciBtaWdodCBiZSkgYW4gb2JzZXJ2YWJsZSwgcGFzcyBpdCBoZXJlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgIElmIGl0IHR1cm5zIG91dCB0byBiZSBhIHdyaXRhYmxlIG9ic2VydmFibGUsIGl0IHdpbGwgYmUgd3JpdHRlbiB0byBkaXJlY3RseVxuICAgICAgICAvLyBhbGxCaW5kaW5nczogICAgICAgICBBbiBvYmplY3Qgd2l0aCBhIGdldCBtZXRob2QgdG8gcmV0cmlldmUgYmluZGluZ3MgaW4gdGhlIGN1cnJlbnQgZXhlY3V0aW9uIGNvbnRleHQuXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgIFRoaXMgd2lsbCBiZSBzZWFyY2hlZCBmb3IgYSAnX2tvX3Byb3BlcnR5X3dyaXRlcnMnIHByb3BlcnR5IGluIGNhc2UgeW91J3JlIHdyaXRpbmcgdG8gYSBub24tb2JzZXJ2YWJsZVxuICAgICAgICAvLyBrZXk6ICAgICAgICAgICAgICAgICBUaGUga2V5IGlkZW50aWZ5aW5nIHRoZSBwcm9wZXJ0eSB0byBiZSB3cml0dGVuLiBFeGFtcGxlOiBmb3IgeyBoYXNGb2N1czogbXlWYWx1ZSB9LCB3cml0ZSB0byAnbXlWYWx1ZScgYnkgc3BlY2lmeWluZyB0aGUga2V5ICdoYXNGb2N1cydcbiAgICAgICAgLy8gdmFsdWU6ICAgICAgICAgICAgICAgVGhlIHZhbHVlIHRvIGJlIHdyaXR0ZW5cbiAgICAgICAgLy8gY2hlY2tJZkRpZmZlcmVudDogICAgSWYgdHJ1ZSwgYW5kIGlmIHRoZSBwcm9wZXJ0eSBiZWluZyB3cml0dGVuIGlzIGEgd3JpdGFibGUgb2JzZXJ2YWJsZSwgdGhlIHZhbHVlIHdpbGwgb25seSBiZSB3cml0dGVuIGlmXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgIGl0IGlzICE9PSBleGlzdGluZyB2YWx1ZSBvbiB0aGF0IHdyaXRhYmxlIG9ic2VydmFibGVcbiAgICAgICAgd3JpdGVWYWx1ZVRvUHJvcGVydHk6IGZ1bmN0aW9uKHByb3BlcnR5LCBhbGxCaW5kaW5ncywga2V5LCB2YWx1ZSwgY2hlY2tJZkRpZmZlcmVudCkge1xuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSB8fCAha28uaXNPYnNlcnZhYmxlKHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wV3JpdGVycyA9IGFsbEJpbmRpbmdzLmdldCgnX2tvX3Byb3BlcnR5X3dyaXRlcnMnKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcFdyaXRlcnMgJiYgcHJvcFdyaXRlcnNba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgcHJvcFdyaXRlcnNba2V5XSh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZShwcm9wZXJ0eSkgJiYgKCFjaGVja0lmRGlmZmVyZW50IHx8IHByb3BlcnR5LnBlZWsoKSAhPT0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcpO1xua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzKTtcbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbCk7XG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzJywga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MpO1xuXG4vLyBNYWtpbmcgYmluZGluZ3MgZXhwbGljaXRseSBkZWNsYXJlIHRoZW1zZWx2ZXMgYXMgXCJ0d28gd2F5XCIgaXNuJ3QgaWRlYWwgaW4gdGhlIGxvbmcgdGVybSAoaXQgd291bGQgYmUgYmV0dGVyIGlmXG4vLyBhbGwgYmluZGluZ3MgY291bGQgdXNlIGFuIG9mZmljaWFsICdwcm9wZXJ0eSB3cml0ZXInIEFQSSB3aXRob3V0IG5lZWRpbmcgdG8gZGVjbGFyZSB0aGF0IHRoZXkgbWlnaHQpLiBIb3dldmVyLFxuLy8gc2luY2UgdGhpcyBpcyBub3QsIGFuZCBoYXMgbmV2ZXIgYmVlbiwgYSBwdWJsaWMgQVBJIChfa29fcHJvcGVydHlfd3JpdGVycyB3YXMgbmV2ZXIgZG9jdW1lbnRlZCksIGl0J3MgYWNjZXB0YWJsZVxuLy8gYXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsIGluIHRoZSBzaG9ydCB0ZXJtLlxuLy8gRm9yIHRob3NlIGRldmVsb3BlcnMgd2hvIHJlbHkgb24gX2tvX3Byb3BlcnR5X3dyaXRlcnMgaW4gdGhlaXIgY3VzdG9tIGJpbmRpbmdzLCB3ZSBleHBvc2UgX3R3b1dheUJpbmRpbmdzIGFzIGFuXG4vLyB1bmRvY3VtZW50ZWQgZmVhdHVyZSB0aGF0IG1ha2VzIGl0IHJlbGF0aXZlbHkgZWFzeSB0byB1cGdyYWRlIHRvIEtPIDMuMC4gSG93ZXZlciwgdGhpcyBpcyBzdGlsbCBub3QgYW4gb2ZmaWNpYWxcbi8vIHB1YmxpYyBBUEksIGFuZCB3ZSByZXNlcnZlIHRoZSByaWdodCB0byByZW1vdmUgaXQgYXQgYW55IHRpbWUgaWYgd2UgY3JlYXRlIGEgcmVhbCBwdWJsaWMgcHJvcGVydHkgd3JpdGVycyBBUEkuXG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcuX3R3b1dheUJpbmRpbmdzJywga28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5ncyk7XG5cbi8vIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBkZWZpbmUgdGhlIGZvbGxvd2luZyBhbGlhc2VzLiAoUHJldmlvdXNseSwgdGhlc2UgZnVuY3Rpb24gbmFtZXMgd2VyZSBtaXNsZWFkaW5nIGJlY2F1c2Vcbi8vIHRoZXkgcmVmZXJyZWQgdG8gSlNPTiBzcGVjaWZpY2FsbHksIGV2ZW4gdGhvdWdoIHRoZXkgYWN0dWFsbHkgd29yayB3aXRoIGFyYml0cmFyeSBKYXZhU2NyaXB0IG9iamVjdCBsaXRlcmFsIGV4cHJlc3Npb25zLilcbmtvLmV4cG9ydFN5bWJvbCgnanNvbkV4cHJlc3Npb25SZXdyaXRpbmcnLCBrby5leHByZXNzaW9uUmV3cml0aW5nKTtcbmtvLmV4cG9ydFN5bWJvbCgnanNvbkV4cHJlc3Npb25SZXdyaXRpbmcuaW5zZXJ0UHJvcGVydHlBY2Nlc3NvcnNJbnRvSnNvbicsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKTtcbihmdW5jdGlvbigpIHtcbiAgICAvLyBcIlZpcnR1YWwgZWxlbWVudHNcIiBpcyBhbiBhYnN0cmFjdGlvbiBvbiB0b3Agb2YgdGhlIHVzdWFsIERPTSBBUEkgd2hpY2ggdW5kZXJzdGFuZHMgdGhlIG5vdGlvbiB0aGF0IGNvbW1lbnQgbm9kZXNcbiAgICAvLyBtYXkgYmUgdXNlZCB0byByZXByZXNlbnQgaGllcmFyY2h5IChpbiBhZGRpdGlvbiB0byB0aGUgRE9NJ3MgbmF0dXJhbCBoaWVyYXJjaHkpLlxuICAgIC8vIElmIHlvdSBjYWxsIHRoZSBET00tbWFuaXB1bGF0aW5nIGZ1bmN0aW9ucyBvbiBrby52aXJ0dWFsRWxlbWVudHMsIHlvdSB3aWxsIGJlIGFibGUgdG8gcmVhZCBhbmQgd3JpdGUgdGhlIHN0YXRlXG4gICAgLy8gb2YgdGhhdCB2aXJ0dWFsIGhpZXJhcmNoeVxuICAgIC8vXG4gICAgLy8gVGhlIHBvaW50IG9mIGFsbCB0aGlzIGlzIHRvIHN1cHBvcnQgY29udGFpbmVybGVzcyB0ZW1wbGF0ZXMgKGUuZy4sIDwhLS0ga28gZm9yZWFjaDpzb21lQ29sbGVjdGlvbiAtLT5ibGFoPCEtLSAva28gLS0+KVxuICAgIC8vIHdpdGhvdXQgaGF2aW5nIHRvIHNjYXR0ZXIgc3BlY2lhbCBjYXNlcyBhbGwgb3ZlciB0aGUgYmluZGluZyBhbmQgdGVtcGxhdGluZyBjb2RlLlxuXG4gICAgLy8gSUUgOSBjYW5ub3QgcmVsaWFibHkgcmVhZCB0aGUgXCJub2RlVmFsdWVcIiBwcm9wZXJ0eSBvZiBhIGNvbW1lbnQgbm9kZSAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMTg2KVxuICAgIC8vIGJ1dCBpdCBkb2VzIGdpdmUgdGhlbSBhIG5vbnN0YW5kYXJkIGFsdGVybmF0aXZlIHByb3BlcnR5IGNhbGxlZCBcInRleHRcIiB0aGF0IGl0IGNhbiByZWFkIHJlbGlhYmx5LiBPdGhlciBicm93c2VycyBkb24ndCBoYXZlIHRoYXQgcHJvcGVydHkuXG4gICAgLy8gU28sIHVzZSBub2RlLnRleHQgd2hlcmUgYXZhaWxhYmxlLCBhbmQgbm9kZS5ub2RlVmFsdWUgZWxzZXdoZXJlXG4gICAgdmFyIGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwidGVzdFwiKS50ZXh0ID09PSBcIjwhLS10ZXN0LS0+XCI7XG5cbiAgICB2YXIgc3RhcnRDb21tZW50UmVnZXggPSBjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gL148IS0tXFxzKmtvKD86XFxzKyhbXFxzXFxTXSspKT9cXHMqLS0+JC8gOiAvXlxccyprbyg/OlxccysoW1xcc1xcU10rKSk/XFxzKiQvO1xuICAgIHZhciBlbmRDb21tZW50UmVnZXggPSAgIGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyAvXjwhLS1cXHMqXFwva29cXHMqLS0+JC8gOiAvXlxccypcXC9rb1xccyokLztcbiAgICB2YXIgaHRtbFRhZ3NXaXRoT3B0aW9uYWxseUNsb3NpbmdDaGlsZHJlbiA9IHsgJ3VsJzogdHJ1ZSwgJ29sJzogdHJ1ZSB9O1xuXG4gICAgZnVuY3Rpb24gaXNTdGFydENvbW1lbnQobm9kZSkge1xuICAgICAgICByZXR1cm4gKG5vZGUubm9kZVR5cGUgPT0gOCkgJiYgc3RhcnRDb21tZW50UmVnZXgudGVzdChjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gbm9kZS50ZXh0IDogbm9kZS5ub2RlVmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRW5kQ29tbWVudChub2RlKSB7XG4gICAgICAgIHJldHVybiAobm9kZS5ub2RlVHlwZSA9PSA4KSAmJiBlbmRDb21tZW50UmVnZXgudGVzdChjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gbm9kZS50ZXh0IDogbm9kZS5ub2RlVmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFZpcnR1YWxDaGlsZHJlbihzdGFydENvbW1lbnQsIGFsbG93VW5iYWxhbmNlZCkge1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSBzdGFydENvbW1lbnQ7XG4gICAgICAgIHZhciBkZXB0aCA9IDE7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaWYgKGlzRW5kQ29tbWVudChjdXJyZW50Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgICAgIGlmIChkZXB0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGN1cnJlbnROb2RlKTtcblxuICAgICAgICAgICAgaWYgKGlzU3RhcnRDb21tZW50KGN1cnJlbnROb2RlKSlcbiAgICAgICAgICAgICAgICBkZXB0aCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYWxsb3dVbmJhbGFuY2VkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgY2xvc2luZyBjb21tZW50IHRhZyB0byBtYXRjaDogXCIgKyBzdGFydENvbW1lbnQubm9kZVZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdFbmRDb21tZW50KHN0YXJ0Q29tbWVudCwgYWxsb3dVbmJhbGFuY2VkKSB7XG4gICAgICAgIHZhciBhbGxWaXJ0dWFsQ2hpbGRyZW4gPSBnZXRWaXJ0dWFsQ2hpbGRyZW4oc3RhcnRDb21tZW50LCBhbGxvd1VuYmFsYW5jZWQpO1xuICAgICAgICBpZiAoYWxsVmlydHVhbENoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoYWxsVmlydHVhbENoaWxkcmVuLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsbFZpcnR1YWxDaGlsZHJlblthbGxWaXJ0dWFsQ2hpbGRyZW4ubGVuZ3RoIC0gMV0ubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICByZXR1cm4gc3RhcnRDb21tZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBNdXN0IGhhdmUgbm8gbWF0Y2hpbmcgZW5kIGNvbW1lbnQsIGFuZCBhbGxvd1VuYmFsYW5jZWQgaXMgdHJ1ZVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVuYmFsYW5jZWRDaGlsZFRhZ3Mobm9kZSkge1xuICAgICAgICAvLyBlLmcuLCBmcm9tIDxkaXY+T0s8L2Rpdj48IS0tIGtvIGJsYWggLS0+PHNwYW4+QW5vdGhlcjwvc3Bhbj4sIHJldHVybnM6IDwhLS0ga28gYmxhaCAtLT48c3Bhbj5Bbm90aGVyPC9zcGFuPlxuICAgICAgICAvLyAgICAgICBmcm9tIDxkaXY+T0s8L2Rpdj48IS0tIC9rbyAtLT48IS0tIC9rbyAtLT4sICAgICAgICAgICAgIHJldHVybnM6IDwhLS0gL2tvIC0tPjwhLS0gL2tvIC0tPlxuICAgICAgICB2YXIgY2hpbGROb2RlID0gbm9kZS5maXJzdENoaWxkLCBjYXB0dXJlUmVtYWluaW5nID0gbnVsbDtcbiAgICAgICAgaWYgKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChjYXB0dXJlUmVtYWluaW5nKSAgICAgICAgICAgICAgICAgICAvLyBXZSBhbHJlYWR5IGhpdCBhbiB1bmJhbGFuY2VkIG5vZGUgYW5kIGFyZSBub3cganVzdCBzY29vcGluZyB1cCBhbGwgc3Vic2VxdWVudCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlUmVtYWluaW5nLnB1c2goY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc1N0YXJ0Q29tbWVudChjaGlsZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGluZ0VuZENvbW1lbnQgPSBnZXRNYXRjaGluZ0VuZENvbW1lbnQoY2hpbGROb2RlLCAvKiBhbGxvd1VuYmFsYW5jZWQ6ICovIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmdFbmRDb21tZW50KSAgICAgICAgICAgICAvLyBJdCdzIGEgYmFsYW5jZWQgdGFnLCBzbyBza2lwIGltbWVkaWF0ZWx5IHRvIHRoZSBlbmQgb2YgdGhpcyB2aXJ0dWFsIHNldFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlID0gbWF0Y2hpbmdFbmRDb21tZW50O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlUmVtYWluaW5nID0gW2NoaWxkTm9kZV07IC8vIEl0J3MgdW5iYWxhbmNlZCwgc28gc3RhcnQgY2FwdHVyaW5nIGZyb20gdGhpcyBwb2ludFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNFbmRDb21tZW50KGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZVJlbWFpbmluZyA9IFtjaGlsZE5vZGVdOyAgICAgLy8gSXQncyB1bmJhbGFuY2VkIChpZiBpdCB3YXNuJ3QsIHdlJ2QgaGF2ZSBza2lwcGVkIG92ZXIgaXQgYWxyZWFkeSksIHNvIHN0YXJ0IGNhcHR1cmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhcHR1cmVSZW1haW5pbmc7XG4gICAgfVxuXG4gICAga28udmlydHVhbEVsZW1lbnRzID0ge1xuICAgICAgICBhbGxvd2VkQmluZGluZ3M6IHt9LFxuXG4gICAgICAgIGNoaWxkTm9kZXM6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1N0YXJ0Q29tbWVudChub2RlKSA/IGdldFZpcnR1YWxDaGlsZHJlbihub2RlKSA6IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgfSxcblxuICAgICAgICBlbXB0eU5vZGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAga28udXRpbHMuZW1wdHlEb21Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHZpcnR1YWxDaGlsZHJlbiA9IGtvLnZpcnR1YWxFbGVtZW50cy5jaGlsZE5vZGVzKG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdmlydHVhbENoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAga28ucmVtb3ZlTm9kZSh2aXJ0dWFsQ2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldERvbU5vZGVDaGlsZHJlbjogZnVuY3Rpb24obm9kZSwgY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW4obm9kZSwgY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIHZhciBlbmRDb21tZW50Tm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7IC8vIE11c3QgYmUgdGhlIG5leHQgc2libGluZywgYXMgd2UganVzdCBlbXB0aWVkIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGVuZENvbW1lbnROb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNoaWxkTm9kZXNbaV0sIGVuZENvbW1lbnROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwcmVwZW5kOiBmdW5jdGlvbihjb250YWluZXJOb2RlLCBub2RlVG9QcmVwZW5kKSB7XG4gICAgICAgICAgICBpZiAoIWlzU3RhcnRDb21tZW50KGNvbnRhaW5lck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5lck5vZGUuZmlyc3RDaGlsZClcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvUHJlcGVuZCwgY29udGFpbmVyTm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQobm9kZVRvUHJlcGVuZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IGNvbW1lbnRzIG11c3QgYWx3YXlzIGhhdmUgYSBwYXJlbnQgYW5kIGF0IGxlYXN0IG9uZSBmb2xsb3dpbmcgc2libGluZyAodGhlIGVuZCBjb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvUHJlcGVuZCwgY29udGFpbmVyTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKGNvbnRhaW5lck5vZGUsIG5vZGVUb0luc2VydCwgaW5zZXJ0QWZ0ZXJOb2RlKSB7XG4gICAgICAgICAgICBpZiAoIWluc2VydEFmdGVyTm9kZSkge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5wcmVwZW5kKGNvbnRhaW5lck5vZGUsIG5vZGVUb0luc2VydCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFpc1N0YXJ0Q29tbWVudChjb250YWluZXJOb2RlKSkge1xuICAgICAgICAgICAgICAgIC8vIEluc2VydCBhZnRlciBpbnNlcnRpb24gcG9pbnRcbiAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QWZ0ZXJOb2RlLm5leHRTaWJsaW5nKVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQsIGluc2VydEFmdGVyTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmFwcGVuZENoaWxkKG5vZGVUb0luc2VydCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENoaWxkcmVuIG9mIHN0YXJ0IGNvbW1lbnRzIG11c3QgYWx3YXlzIGhhdmUgYSBwYXJlbnQgYW5kIGF0IGxlYXN0IG9uZSBmb2xsb3dpbmcgc2libGluZyAodGhlIGVuZCBjb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LCBpbnNlcnRBZnRlck5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpcnN0Q2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIGlmICghbm9kZS5uZXh0U2libGluZyB8fCBpc0VuZENvbW1lbnQobm9kZS5uZXh0U2libGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0U2libGluZzogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKGlzU3RhcnRDb21tZW50KG5vZGUpKVxuICAgICAgICAgICAgICAgIG5vZGUgPSBnZXRNYXRjaGluZ0VuZENvbW1lbnQobm9kZSk7XG4gICAgICAgICAgICBpZiAobm9kZS5uZXh0U2libGluZyAmJiBpc0VuZENvbW1lbnQobm9kZS5uZXh0U2libGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNCaW5kaW5nVmFsdWU6IGlzU3RhcnRDb21tZW50LFxuXG4gICAgICAgIHZpcnR1YWxOb2RlQmluZGluZ1ZhbHVlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICB2YXIgcmVnZXhNYXRjaCA9IChjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gbm9kZS50ZXh0IDogbm9kZS5ub2RlVmFsdWUpLm1hdGNoKHN0YXJ0Q29tbWVudFJlZ2V4KTtcbiAgICAgICAgICAgIHJldHVybiByZWdleE1hdGNoID8gcmVnZXhNYXRjaFsxXSA6IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbm9ybWFsaXNlVmlydHVhbEVsZW1lbnREb21TdHJ1Y3R1cmU6IGZ1bmN0aW9uKGVsZW1lbnRWZXJpZmllZCkge1xuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xNTVcbiAgICAgICAgICAgIC8vIChJRSA8PSA4IG9yIElFIDkgcXVpcmtzIG1vZGUgcGFyc2VzIHlvdXIgSFRNTCB3ZWlyZGx5LCB0cmVhdGluZyBjbG9zaW5nIDwvbGk+IHRhZ3MgYXMgaWYgdGhleSBkb24ndCBleGlzdCwgdGhlcmVieSBtb3ZpbmcgY29tbWVudCBub2Rlc1xuICAgICAgICAgICAgLy8gdGhhdCBhcmUgZGlyZWN0IGRlc2NlbmRhbnRzIG9mIDx1bD4gaW50byB0aGUgcHJlY2VkaW5nIDxsaT4pXG4gICAgICAgICAgICBpZiAoIWh0bWxUYWdzV2l0aE9wdGlvbmFsbHlDbG9zaW5nQ2hpbGRyZW5ba28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnRWZXJpZmllZCldKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgLy8gU2NhbiBpbW1lZGlhdGUgY2hpbGRyZW4gdG8gc2VlIGlmIHRoZXkgY29udGFpbiB1bmJhbGFuY2VkIGNvbW1lbnQgdGFncy4gSWYgdGhleSBkbywgdGhvc2UgY29tbWVudCB0YWdzXG4gICAgICAgICAgICAvLyBtdXN0IGJlIGludGVuZGVkIHRvIGFwcGVhciAqYWZ0ZXIqIHRoYXQgY2hpbGQsIHNvIG1vdmUgdGhlbSB0aGVyZS5cbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBlbGVtZW50VmVyaWZpZWQuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmJhbGFuY2VkVGFncyA9IGdldFVuYmFsYW5jZWRDaGlsZFRhZ3MoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bmJhbGFuY2VkVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCB1cCB0aGUgRE9NIGJ5IG1vdmluZyB0aGUgdW5iYWxhbmNlZCB0YWdzIHRvIHdoZXJlIHRoZXkgbW9zdCBsaWtlbHkgd2VyZSBpbnRlbmRlZCB0byBiZSBwbGFjZWQgLSAqYWZ0ZXIqIHRoZSBjaGlsZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlVG9JbnNlcnRCZWZvcmUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bmJhbGFuY2VkVGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVRvSW5zZXJ0QmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFZlcmlmaWVkLmluc2VydEJlZm9yZSh1bmJhbGFuY2VkVGFnc1tpXSwgbm9kZVRvSW5zZXJ0QmVmb3JlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFZlcmlmaWVkLmFwcGVuZENoaWxkKHVuYmFsYW5jZWRUYWdzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IHdoaWxlIChjaGlsZE5vZGUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cycsIGtvLnZpcnR1YWxFbGVtZW50cyk7XG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MnLCBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZScsIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUpO1xuLy9rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkJywga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQpOyAgICAgLy8gZmlyc3RDaGlsZCBpcyBub3QgbWluaWZpZWRcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmluc2VydEFmdGVyJywga28udmlydHVhbEVsZW1lbnRzLmluc2VydEFmdGVyKTtcbi8va28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcnLCBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcpOyAgIC8vIG5leHRTaWJsaW5nIGlzIG5vdCBtaW5pZmllZFxua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMucHJlcGVuZCcsIGtvLnZpcnR1YWxFbGVtZW50cy5wcmVwZW5kKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbicsIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4pO1xuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWZhdWx0QmluZGluZ0F0dHJpYnV0ZU5hbWUgPSBcImRhdGEtYmluZFwiO1xuXG4gICAga28uYmluZGluZ1Byb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ0NhY2hlID0ge307XG4gICAgfTtcblxuICAgIGtvLnV0aWxzLmV4dGVuZChrby5iaW5kaW5nUHJvdmlkZXIucHJvdG90eXBlLCB7XG4gICAgICAgICdub2RlSGFzQmluZGluZ3MnOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKGRlZmF1bHRCaW5kaW5nQXR0cmlidXRlTmFtZSkgIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwga28uY29tcG9uZW50c1snZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUnXShub2RlKTtcbiAgICAgICAgICAgICAgICBjYXNlIDg6IC8vIENvbW1lbnQgbm9kZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udmlydHVhbEVsZW1lbnRzLmhhc0JpbmRpbmdWYWx1ZShub2RlKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2dldEJpbmRpbmdzJzogZnVuY3Rpb24obm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBiaW5kaW5nc1N0cmluZyA9IHRoaXNbJ2dldEJpbmRpbmdzU3RyaW5nJ10obm9kZSwgYmluZGluZ0NvbnRleHQpLFxuICAgICAgICAgICAgICAgIHBhcnNlZEJpbmRpbmdzID0gYmluZGluZ3NTdHJpbmcgPyB0aGlzWydwYXJzZUJpbmRpbmdzU3RyaW5nJ10oYmluZGluZ3NTdHJpbmcsIGJpbmRpbmdDb250ZXh0LCBub2RlKSA6IG51bGw7XG4gICAgICAgICAgICByZXR1cm4ga28uY29tcG9uZW50cy5hZGRCaW5kaW5nc0ZvckN1c3RvbUVsZW1lbnQocGFyc2VkQmluZGluZ3MsIG5vZGUsIGJpbmRpbmdDb250ZXh0LCAvKiB2YWx1ZUFjY2Vzc29ycyAqLyBmYWxzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2dldEJpbmRpbmdBY2Nlc3NvcnMnOiBmdW5jdGlvbihub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzU3RyaW5nID0gdGhpc1snZ2V0QmluZGluZ3NTdHJpbmcnXShub2RlLCBiaW5kaW5nQ29udGV4dCksXG4gICAgICAgICAgICAgICAgcGFyc2VkQmluZGluZ3MgPSBiaW5kaW5nc1N0cmluZyA/IHRoaXNbJ3BhcnNlQmluZGluZ3NTdHJpbmcnXShiaW5kaW5nc1N0cmluZywgYmluZGluZ0NvbnRleHQsIG5vZGUsIHsgJ3ZhbHVlQWNjZXNzb3JzJzogdHJ1ZSB9KSA6IG51bGw7XG4gICAgICAgICAgICByZXR1cm4ga28uY29tcG9uZW50cy5hZGRCaW5kaW5nc0ZvckN1c3RvbUVsZW1lbnQocGFyc2VkQmluZGluZ3MsIG5vZGUsIGJpbmRpbmdDb250ZXh0LCAvKiB2YWx1ZUFjY2Vzc29ycyAqLyB0cnVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoaXMgZGVmYXVsdCBwcm92aWRlci5cbiAgICAgICAgLy8gSXQncyBub3QgcGFydCBvZiB0aGUgaW50ZXJmYWNlIGRlZmluaXRpb24gZm9yIGEgZ2VuZXJhbCBiaW5kaW5nIHByb3ZpZGVyLlxuICAgICAgICAnZ2V0QmluZGluZ3NTdHJpbmcnOiBmdW5jdGlvbihub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUoZGVmYXVsdEJpbmRpbmdBdHRyaWJ1dGVOYW1lKTsgICAvLyBFbGVtZW50XG4gICAgICAgICAgICAgICAgY2FzZSA4OiByZXR1cm4ga28udmlydHVhbEVsZW1lbnRzLnZpcnR1YWxOb2RlQmluZGluZ1ZhbHVlKG5vZGUpOyAvLyBDb21tZW50IG5vZGVcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoaXMgZGVmYXVsdCBwcm92aWRlci5cbiAgICAgICAgLy8gSXQncyBub3QgcGFydCBvZiB0aGUgaW50ZXJmYWNlIGRlZmluaXRpb24gZm9yIGEgZ2VuZXJhbCBiaW5kaW5nIHByb3ZpZGVyLlxuICAgICAgICAncGFyc2VCaW5kaW5nc1N0cmluZyc6IGZ1bmN0aW9uKGJpbmRpbmdzU3RyaW5nLCBiaW5kaW5nQ29udGV4dCwgbm9kZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgYmluZGluZ0Z1bmN0aW9uID0gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3JWaWFDYWNoZShiaW5kaW5nc1N0cmluZywgdGhpcy5iaW5kaW5nQ2FjaGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5nRnVuY3Rpb24oYmluZGluZ0NvbnRleHQsIG5vZGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBleC5tZXNzYWdlID0gXCJVbmFibGUgdG8gcGFyc2UgYmluZGluZ3MuXFxuQmluZGluZ3MgdmFsdWU6IFwiICsgYmluZGluZ3NTdHJpbmcgKyBcIlxcbk1lc3NhZ2U6IFwiICsgZXgubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAga28uYmluZGluZ1Byb3ZpZGVyWydpbnN0YW5jZSddID0gbmV3IGtvLmJpbmRpbmdQcm92aWRlcigpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3JWaWFDYWNoZShiaW5kaW5nc1N0cmluZywgY2FjaGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGNhY2hlS2V5ID0gYmluZGluZ3NTdHJpbmcgKyAob3B0aW9ucyAmJiBvcHRpb25zWyd2YWx1ZUFjY2Vzc29ycyddIHx8ICcnKTtcbiAgICAgICAgcmV0dXJuIGNhY2hlW2NhY2hlS2V5XVxuICAgICAgICAgICAgfHwgKGNhY2hlW2NhY2hlS2V5XSA9IGNyZWF0ZUJpbmRpbmdzU3RyaW5nRXZhbHVhdG9yKGJpbmRpbmdzU3RyaW5nLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3IoYmluZGluZ3NTdHJpbmcsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gQnVpbGQgdGhlIHNvdXJjZSBmb3IgYSBmdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyBcImV4cHJlc3Npb25cIlxuICAgICAgICAvLyBGb3IgZWFjaCBzY29wZSB2YXJpYWJsZSwgYWRkIGFuIGV4dHJhIGxldmVsIG9mIFwid2l0aFwiIG5lc3RpbmdcbiAgICAgICAgLy8gRXhhbXBsZSByZXN1bHQ6IHdpdGgoc2MxKSB7IHdpdGgoc2MwKSB7IHJldHVybiAoZXhwcmVzc2lvbikgfSB9XG4gICAgICAgIHZhciByZXdyaXR0ZW5CaW5kaW5ncyA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKGJpbmRpbmdzU3RyaW5nLCBvcHRpb25zKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uQm9keSA9IFwid2l0aCgkY29udGV4dCl7d2l0aCgkZGF0YXx8e30pe3JldHVybntcIiArIHJld3JpdHRlbkJpbmRpbmdzICsgXCJ9fX1cIjtcbiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcIiRjb250ZXh0XCIsIFwiJGVsZW1lbnRcIiwgZnVuY3Rpb25Cb2R5KTtcbiAgICB9XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ2JpbmRpbmdQcm92aWRlcicsIGtvLmJpbmRpbmdQcm92aWRlcik7XG4oZnVuY3Rpb24gKCkge1xuICAgIGtvLmJpbmRpbmdIYW5kbGVycyA9IHt9O1xuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBlbGVtZW50IHR5cGVzIHdpbGwgbm90IGJlIHJlY3Vyc2VkIGludG8gZHVyaW5nIGJpbmRpbmcuXG4gICAgdmFyIGJpbmRpbmdEb2VzTm90UmVjdXJzZUludG9FbGVtZW50VHlwZXMgPSB7XG4gICAgICAgIC8vIERvbid0IHdhbnQgYmluZGluZ3MgdGhhdCBvcGVyYXRlIG9uIHRleHQgbm9kZXMgdG8gbXV0YXRlIDxzY3JpcHQ+IGFuZCA8dGV4dGFyZWE+IGNvbnRlbnRzLFxuICAgICAgICAvLyBiZWNhdXNlIGl0J3MgdW5leHBlY3RlZCBhbmQgYSBwb3RlbnRpYWwgWFNTIGlzc3VlLlxuICAgICAgICAvLyBBbHNvIGJpbmRpbmdzIHNob3VsZCBub3Qgb3BlcmF0ZSBvbiA8dGVtcGxhdGU+IGVsZW1lbnRzIHNpbmNlIHRoaXMgYnJlYWtzIGluIEludGVybmV0IEV4cGxvcmVyXG4gICAgICAgIC8vIGFuZCBiZWNhdXNlIHN1Y2ggZWxlbWVudHMnIGNvbnRlbnRzIGFyZSBhbHdheXMgaW50ZW5kZWQgdG8gYmUgYm91bmQgaW4gYSBkaWZmZXJlbnQgY29udGV4dFxuICAgICAgICAvLyBmcm9tIHdoZXJlIHRoZXkgYXBwZWFyIGluIHRoZSBkb2N1bWVudC5cbiAgICAgICAgJ3NjcmlwdCc6IHRydWUsXG4gICAgICAgICd0ZXh0YXJlYSc6IHRydWUsXG4gICAgICAgICd0ZW1wbGF0ZSc6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gVXNlIGFuIG92ZXJyaWRhYmxlIG1ldGhvZCBmb3IgcmV0cmlldmluZyBiaW5kaW5nIGhhbmRsZXJzIHNvIHRoYXQgYSBwbHVnaW5zIG1heSBzdXBwb3J0IGR5bmFtaWNhbGx5IGNyZWF0ZWQgaGFuZGxlcnNcbiAgICBrb1snZ2V0QmluZGluZ0hhbmRsZXInXSA9IGZ1bmN0aW9uKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1tiaW5kaW5nS2V5XTtcbiAgICB9O1xuXG4gICAgLy8gVGhlIGtvLmJpbmRpbmdDb250ZXh0IGNvbnN0cnVjdG9yIGlzIG9ubHkgY2FsbGVkIGRpcmVjdGx5IHRvIGNyZWF0ZSB0aGUgcm9vdCBjb250ZXh0LiBGb3IgY2hpbGRcbiAgICAvLyBjb250ZXh0cywgdXNlIGJpbmRpbmdDb250ZXh0LmNyZWF0ZUNoaWxkQ29udGV4dCBvciBiaW5kaW5nQ29udGV4dC5leHRlbmQuXG4gICAga28uYmluZGluZ0NvbnRleHQgPSBmdW5jdGlvbihkYXRhSXRlbU9yQWNjZXNzb3IsIHBhcmVudENvbnRleHQsIGRhdGFJdGVtQWxpYXMsIGV4dGVuZENhbGxiYWNrLCBvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gVGhlIGJpbmRpbmcgY29udGV4dCBvYmplY3QgaW5jbHVkZXMgc3RhdGljIHByb3BlcnRpZXMgZm9yIHRoZSBjdXJyZW50LCBwYXJlbnQsIGFuZCByb290IHZpZXcgbW9kZWxzLlxuICAgICAgICAvLyBJZiBhIHZpZXcgbW9kZWwgaXMgYWN0dWFsbHkgc3RvcmVkIGluIGFuIG9ic2VydmFibGUsIHRoZSBjb3JyZXNwb25kaW5nIGJpbmRpbmcgY29udGV4dCBvYmplY3QsIGFuZFxuICAgICAgICAvLyBhbnkgY2hpbGQgY29udGV4dHMsIG11c3QgYmUgdXBkYXRlZCB3aGVuIHRoZSB2aWV3IG1vZGVsIGlzIGNoYW5nZWQuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgICAgICAgICAvLyBNb3N0IG9mIHRoZSB0aW1lLCB0aGUgY29udGV4dCB3aWxsIGRpcmVjdGx5IGdldCBhIHZpZXcgbW9kZWwgb2JqZWN0LCBidXQgaWYgYSBmdW5jdGlvbiBpcyBnaXZlbixcbiAgICAgICAgICAgIC8vIHdlIGNhbGwgdGhlIGZ1bmN0aW9uIHRvIHJldHJpZXZlIHRoZSB2aWV3IG1vZGVsLiBJZiB0aGUgZnVuY3Rpb24gYWNjZXNzZXMgYW55IG9ic2VydmFibGVzIG9yIHJldHVybnNcbiAgICAgICAgICAgIC8vIGFuIG9ic2VydmFibGUsIHRoZSBkZXBlbmRlbmN5IGlzIHRyYWNrZWQsIGFuZCB0aG9zZSBvYnNlcnZhYmxlcyBjYW4gbGF0ZXIgY2F1c2UgdGhlIGJpbmRpbmdcbiAgICAgICAgICAgIC8vIGNvbnRleHQgdG8gYmUgdXBkYXRlZC5cbiAgICAgICAgICAgIHZhciBkYXRhSXRlbU9yT2JzZXJ2YWJsZSA9IGlzRnVuYyA/IGRhdGFJdGVtT3JBY2Nlc3NvcigpIDogZGF0YUl0ZW1PckFjY2Vzc29yLFxuICAgICAgICAgICAgICAgIGRhdGFJdGVtID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhSXRlbU9yT2JzZXJ2YWJsZSk7XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhIFwicGFyZW50XCIgY29udGV4dCBpcyBnaXZlbiwgcmVnaXN0ZXIgYSBkZXBlbmRlbmN5IG9uIHRoZSBwYXJlbnQgY29udGV4dC4gVGh1cyB3aGVuZXZlciB0aGVcbiAgICAgICAgICAgICAgICAvLyBwYXJlbnQgY29udGV4dCBpcyB1cGRhdGVkLCB0aGlzIGNvbnRleHQgd2lsbCBhbHNvIGJlIHVwZGF0ZWQuXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudENvbnRleHQuX3N1YnNjcmliYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29udGV4dC5fc3Vic2NyaWJhYmxlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDb3B5ICRyb290IGFuZCBhbnkgY3VzdG9tIHByb3BlcnRpZXMgZnJvbSB0aGUgcGFyZW50IGNvbnRleHRcbiAgICAgICAgICAgICAgICBrby51dGlscy5leHRlbmQoc2VsZiwgcGFyZW50Q29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHRoZSBhYm92ZSBjb3B5IG92ZXJ3cml0ZXMgb3VyIG93biBwcm9wZXJ0aWVzLCB3ZSBuZWVkIHRvIHJlc2V0IHRoZW0uXG4gICAgICAgICAgICAgICAgc2VsZi5fc3Vic2NyaWJhYmxlID0gc3Vic2NyaWJhYmxlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmWyckcGFyZW50cyddID0gW107XG4gICAgICAgICAgICAgICAgc2VsZlsnJHJvb3QnXSA9IGRhdGFJdGVtO1xuXG4gICAgICAgICAgICAgICAgLy8gRXhwb3J0ICdrbycgaW4gdGhlIGJpbmRpbmcgY29udGV4dCBzbyBpdCB3aWxsIGJlIGF2YWlsYWJsZSBpbiBiaW5kaW5ncyBhbmQgdGVtcGxhdGVzXG4gICAgICAgICAgICAgICAgLy8gZXZlbiBpZiAna28nIGlzbid0IGV4cG9ydGVkIGFzIGEgZ2xvYmFsLCBzdWNoIGFzIHdoZW4gdXNpbmcgYW4gQU1EIGxvYWRlci5cbiAgICAgICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy80OTBcbiAgICAgICAgICAgICAgICBzZWxmWydrbyddID0ga287XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmWyckcmF3RGF0YSddID0gZGF0YUl0ZW1Pck9ic2VydmFibGU7XG4gICAgICAgICAgICBzZWxmWyckZGF0YSddID0gZGF0YUl0ZW07XG4gICAgICAgICAgICBpZiAoZGF0YUl0ZW1BbGlhcylcbiAgICAgICAgICAgICAgICBzZWxmW2RhdGFJdGVtQWxpYXNdID0gZGF0YUl0ZW07XG5cbiAgICAgICAgICAgIC8vIFRoZSBleHRlbmRDYWxsYmFjayBmdW5jdGlvbiBpcyBwcm92aWRlZCB3aGVuIGNyZWF0aW5nIGEgY2hpbGQgY29udGV4dCBvciBleHRlbmRpbmcgYSBjb250ZXh0LlxuICAgICAgICAgICAgLy8gSXQgaGFuZGxlcyB0aGUgc3BlY2lmaWMgYWN0aW9ucyBuZWVkZWQgdG8gZmluaXNoIHNldHRpbmcgdXAgdGhlIGJpbmRpbmcgY29udGV4dC4gQWN0aW9ucyBpbiB0aGlzXG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBjb3VsZCBhbHNvIGFkZCBkZXBlbmRlbmNpZXMgdG8gdGhpcyBiaW5kaW5nIGNvbnRleHQuXG4gICAgICAgICAgICBpZiAoZXh0ZW5kQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgZXh0ZW5kQ2FsbGJhY2soc2VsZiwgcGFyZW50Q29udGV4dCwgZGF0YUl0ZW0pO1xuXG4gICAgICAgICAgICByZXR1cm4gc2VsZlsnJGRhdGEnXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkaXNwb3NlV2hlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlcyAmJiAha28udXRpbHMuYW55RG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KG5vZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGlzRnVuYyA9IHR5cGVvZihkYXRhSXRlbU9yQWNjZXNzb3IpID09IFwiZnVuY3Rpb25cIiAmJiAha28uaXNPYnNlcnZhYmxlKGRhdGFJdGVtT3JBY2Nlc3NvciksXG4gICAgICAgICAgICBub2RlcyxcbiAgICAgICAgICAgIHN1YnNjcmliYWJsZTtcblxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zWydleHBvcnREZXBlbmRlbmNpZXMnXSkge1xuICAgICAgICAgICAgLy8gVGhlIFwiZXhwb3J0RGVwZW5kZW5jaWVzXCIgb3B0aW9uIG1lYW5zIHRoYXQgdGhlIGNhbGxpbmcgY29kZSB3aWxsIHRyYWNrIGFueSBkZXBlbmRlbmNpZXMgYW5kIHJlLWNyZWF0ZVxuICAgICAgICAgICAgLy8gdGhlIGJpbmRpbmcgY29udGV4dCB3aGVuIHRoZXkgY2hhbmdlLlxuICAgICAgICAgICAgdXBkYXRlQ29udGV4dCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaWJhYmxlID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSh1cGRhdGVDb250ZXh0LCBudWxsLCB7IGRpc3Bvc2VXaGVuOiBkaXNwb3NlV2hlbiwgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgYmluZGluZyBjb250ZXh0IGhhcyBiZWVuIGluaXRpYWxpemVkLCBhbmQgdGhlIFwic3Vic2NyaWJhYmxlXCIgY29tcHV0ZWQgb2JzZXJ2YWJsZSBpc1xuICAgICAgICAgICAgLy8gc3Vic2NyaWJlZCB0byBhbnkgb2JzZXJ2YWJsZXMgdGhhdCB3ZXJlIGFjY2Vzc2VkIGluIHRoZSBwcm9jZXNzLiBJZiB0aGVyZSBpcyBub3RoaW5nIHRvIHRyYWNrLCB0aGVcbiAgICAgICAgICAgIC8vIGNvbXB1dGVkIHdpbGwgYmUgaW5hY3RpdmUsIGFuZCB3ZSBjYW4gc2FmZWx5IHRocm93IGl0IGF3YXkuIElmIGl0J3MgYWN0aXZlLCB0aGUgY29tcHV0ZWQgaXMgc3RvcmVkIGluXG4gICAgICAgICAgICAvLyB0aGUgY29udGV4dCBvYmplY3QuXG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJhYmxlLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9zdWJzY3JpYmFibGUgPSBzdWJzY3JpYmFibGU7XG5cbiAgICAgICAgICAgICAgICAvLyBBbHdheXMgbm90aWZ5IGJlY2F1c2UgZXZlbiBpZiB0aGUgbW9kZWwgKCRkYXRhKSBoYXNuJ3QgY2hhbmdlZCwgb3RoZXIgY29udGV4dCBwcm9wZXJ0aWVzIG1pZ2h0IGhhdmUgY2hhbmdlZFxuICAgICAgICAgICAgICAgIHN1YnNjcmliYWJsZVsnZXF1YWxpdHlDb21wYXJlciddID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gYmUgYWJsZSB0byBkaXNwb3NlIG9mIHRoaXMgY29tcHV0ZWQgb2JzZXJ2YWJsZSB3aGVuIGl0J3Mgbm8gbG9uZ2VyIG5lZWRlZC4gVGhpcyB3b3VsZCBiZVxuICAgICAgICAgICAgICAgIC8vIGVhc3kgaWYgd2UgaGFkIGEgc2luZ2xlIG5vZGUgdG8gd2F0Y2gsIGJ1dCBiaW5kaW5nIGNvbnRleHRzIGNhbiBiZSB1c2VkIGJ5IG1hbnkgZGlmZmVyZW50IG5vZGVzLCBhbmRcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW5ub3QgYXNzdW1lIHRoYXQgdGhvc2Ugbm9kZXMgaGF2ZSBhbnkgcmVsYXRpb24gdG8gZWFjaCBvdGhlci4gU28gaW5zdGVhZCB3ZSB0cmFjayBhbnkgbm9kZSB0aGF0XG4gICAgICAgICAgICAgICAgLy8gdGhlIGNvbnRleHQgaXMgYXR0YWNoZWQgdG8sIGFuZCBkaXNwb3NlIHRoZSBjb21wdXRlZCB3aGVuIGFsbCBvZiB0aG9zZSBub2RlcyBoYXZlIGJlZW4gY2xlYW5lZC5cblxuICAgICAgICAgICAgICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvICpzdWJzY3JpYmFibGUqIGluc3RlYWQgb2YgKnNlbGYqIGJlY2F1c2UgYW55IHByb3BlcnRpZXMgYWRkZWQgdG8gKnNlbGYqIG1heSBiZSBvdmVyd3JpdHRlbiBvbiB1cGRhdGVzXG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGUuX2FkZE5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2sobm9kZSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlSZW1vdmVJdGVtKG5vZGVzLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdWJzY3JpYmFibGUgPSBzdWJzY3JpYmFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeHRlbmQgdGhlIGJpbmRpbmcgY29udGV4dCBoaWVyYXJjaHkgd2l0aCBhIG5ldyB2aWV3IG1vZGVsIG9iamVjdC4gSWYgdGhlIHBhcmVudCBjb250ZXh0IGlzIHdhdGNoaW5nXG4gICAgLy8gYW55IG9ic2VydmFibGVzLCB0aGUgbmV3IGNoaWxkIGNvbnRleHQgd2lsbCBhdXRvbWF0aWNhbGx5IGdldCBhIGRlcGVuZGVuY3kgb24gdGhlIHBhcmVudCBjb250ZXh0LlxuICAgIC8vIEJ1dCB0aGlzIGRvZXMgbm90IG1lYW4gdGhhdCB0aGUgJGRhdGEgdmFsdWUgb2YgdGhlIGNoaWxkIGNvbnRleHQgd2lsbCBhbHNvIGdldCB1cGRhdGVkLiBJZiB0aGUgY2hpbGRcbiAgICAvLyB2aWV3IG1vZGVsIGFsc28gZGVwZW5kcyBvbiB0aGUgcGFyZW50IHZpZXcgbW9kZWwsIHlvdSBtdXN0IHByb3ZpZGUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNvcnJlY3RcbiAgICAvLyB2aWV3IG1vZGVsIG9uIGVhY2ggdXBkYXRlLlxuICAgIGtvLmJpbmRpbmdDb250ZXh0LnByb3RvdHlwZVsnY3JlYXRlQ2hpbGRDb250ZXh0J10gPSBmdW5jdGlvbiAoZGF0YUl0ZW1PckFjY2Vzc29yLCBkYXRhSXRlbUFsaWFzLCBleHRlbmRDYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gbmV3IGtvLmJpbmRpbmdDb250ZXh0KGRhdGFJdGVtT3JBY2Nlc3NvciwgdGhpcywgZGF0YUl0ZW1BbGlhcywgZnVuY3Rpb24oc2VsZiwgcGFyZW50Q29udGV4dCkge1xuICAgICAgICAgICAgLy8gRXh0ZW5kIHRoZSBjb250ZXh0IGhpZXJhcmNoeSBieSBzZXR0aW5nIHRoZSBhcHByb3ByaWF0ZSBwb2ludGVyc1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudENvbnRleHQnXSA9IHBhcmVudENvbnRleHQ7XG4gICAgICAgICAgICBzZWxmWyckcGFyZW50J10gPSBwYXJlbnRDb250ZXh0WyckZGF0YSddO1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudHMnXSA9IChwYXJlbnRDb250ZXh0WyckcGFyZW50cyddIHx8IFtdKS5zbGljZSgwKTtcbiAgICAgICAgICAgIHNlbGZbJyRwYXJlbnRzJ10udW5zaGlmdChzZWxmWyckcGFyZW50J10pO1xuICAgICAgICAgICAgaWYgKGV4dGVuZENhbGxiYWNrKVxuICAgICAgICAgICAgICAgIGV4dGVuZENhbGxiYWNrKHNlbGYpO1xuICAgICAgICB9LCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBiaW5kaW5nIGNvbnRleHQgd2l0aCBuZXcgY3VzdG9tIHByb3BlcnRpZXMuIFRoaXMgZG9lc24ndCBjaGFuZ2UgdGhlIGNvbnRleHQgaGllcmFyY2h5LlxuICAgIC8vIFNpbWlsYXJseSB0byBcImNoaWxkXCIgY29udGV4dHMsIHByb3ZpZGUgYSBmdW5jdGlvbiBoZXJlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBjb3JyZWN0IHZhbHVlcyBhcmUgc2V0XG4gICAgLy8gd2hlbiBhbiBvYnNlcnZhYmxlIHZpZXcgbW9kZWwgaXMgdXBkYXRlZC5cbiAgICBrby5iaW5kaW5nQ29udGV4dC5wcm90b3R5cGVbJ2V4dGVuZCddID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAvLyBJZiB0aGUgcGFyZW50IGNvbnRleHQgcmVmZXJlbmNlcyBhbiBvYnNlcnZhYmxlIHZpZXcgbW9kZWwsIFwiX3N1YnNjcmliYWJsZVwiIHdpbGwgYWx3YXlzIGJlIHRoZVxuICAgICAgICAvLyBsYXRlc3QgdmlldyBtb2RlbCBvYmplY3QuIElmIG5vdCwgXCJfc3Vic2NyaWJhYmxlXCIgaXNuJ3Qgc2V0LCBhbmQgd2UgY2FuIHVzZSB0aGUgc3RhdGljIFwiJGRhdGFcIiB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIG5ldyBrby5iaW5kaW5nQ29udGV4dCh0aGlzLl9zdWJzY3JpYmFibGUgfHwgdGhpc1snJGRhdGEnXSwgdGhpcywgbnVsbCwgZnVuY3Rpb24oc2VsZiwgcGFyZW50Q29udGV4dCkge1xuICAgICAgICAgICAgLy8gVGhpcyBcImNoaWxkXCIgY29udGV4dCBkb2Vzbid0IGRpcmVjdGx5IHRyYWNrIGEgcGFyZW50IG9ic2VydmFibGUgdmlldyBtb2RlbCxcbiAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gbWFudWFsbHkgc2V0IHRoZSAkcmF3RGF0YSB2YWx1ZSB0byBtYXRjaCB0aGUgcGFyZW50LlxuICAgICAgICAgICAgc2VsZlsnJHJhd0RhdGEnXSA9IHBhcmVudENvbnRleHRbJyRyYXdEYXRhJ107XG4gICAgICAgICAgICBrby51dGlscy5leHRlbmQoc2VsZiwgdHlwZW9mKHByb3BlcnRpZXMpID09IFwiZnVuY3Rpb25cIiA/IHByb3BlcnRpZXMoKSA6IHByb3BlcnRpZXMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAga28uYmluZGluZ0NvbnRleHQucHJvdG90eXBlLmNyZWF0ZVN0YXRpY0NoaWxkQ29udGV4dCA9IGZ1bmN0aW9uIChkYXRhSXRlbU9yQWNjZXNzb3IsIGRhdGFJdGVtQWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGRhdGFJdGVtT3JBY2Nlc3NvciwgZGF0YUl0ZW1BbGlhcywgbnVsbCwgeyBcImV4cG9ydERlcGVuZGVuY2llc1wiOiB0cnVlIH0pO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIHRoZSB2YWx1ZUFjY2Vzb3IgZnVuY3Rpb24gZm9yIGEgYmluZGluZyB2YWx1ZVxuICAgIGZ1bmN0aW9uIG1ha2VWYWx1ZUFjY2Vzc29yKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlQWNjZXNzb3IgZnVuY3Rpb25cbiAgICBmdW5jdGlvbiBldmFsdWF0ZVZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICByZXR1cm4gdmFsdWVBY2Nlc3NvcigpO1xuICAgIH1cblxuICAgIC8vIEdpdmVuIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGJpbmRpbmdzLCBjcmVhdGUgYW5kIHJldHVybiBhIG5ldyBvYmplY3QgdGhhdCBjb250YWluc1xuICAgIC8vIGJpbmRpbmcgdmFsdWUtYWNjZXNzb3JzIGZ1bmN0aW9ucy4gRWFjaCBhY2Nlc3NvciBmdW5jdGlvbiBjYWxscyB0aGUgb3JpZ2luYWwgZnVuY3Rpb25cbiAgICAvLyBzbyB0aGF0IGl0IGFsd2F5cyBnZXRzIHRoZSBsYXRlc3QgdmFsdWUgYW5kIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGNhcHR1cmVkLiBUaGlzIGlzIHVzZWRcbiAgICAvLyBieSBrby5hcHBseUJpbmRpbmdzVG9Ob2RlIGFuZCBnZXRCaW5kaW5nc0FuZE1ha2VBY2Nlc3NvcnMuXG4gICAgZnVuY3Rpb24gbWFrZUFjY2Vzc29yc0Zyb21GdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4ga28udXRpbHMub2JqZWN0TWFwKGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGNhbGxiYWNrKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpW2tleV07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHaXZlbiBhIGJpbmRpbmdzIGZ1bmN0aW9uIG9yIG9iamVjdCwgY3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICAvLyBiaW5kaW5nIHZhbHVlLWFjY2Vzc29ycyBmdW5jdGlvbnMuIFRoaXMgaXMgdXNlZCBieSBrby5hcHBseUJpbmRpbmdzVG9Ob2RlLlxuICAgIGZ1bmN0aW9uIG1ha2VCaW5kaW5nQWNjZXNzb3JzKGJpbmRpbmdzLCBjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYmluZGluZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtYWtlQWNjZXNzb3JzRnJvbUZ1bmN0aW9uKGJpbmRpbmdzLmJpbmQobnVsbCwgY29udGV4dCwgbm9kZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm9iamVjdE1hcChiaW5kaW5ncywgbWFrZVZhbHVlQWNjZXNzb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGlmIHRoZSBiaW5kaW5nIHByb3ZpZGVyIGRvZXNuJ3QgaW5jbHVkZSBhIGdldEJpbmRpbmdBY2Nlc3NvcnMgZnVuY3Rpb24uXG4gICAgLy8gSXQgbXVzdCBiZSBjYWxsZWQgd2l0aCAndGhpcycgc2V0IHRvIHRoZSBwcm92aWRlciBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiBnZXRCaW5kaW5nc0FuZE1ha2VBY2Nlc3NvcnMobm9kZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gbWFrZUFjY2Vzc29yc0Zyb21GdW5jdGlvbih0aGlzWydnZXRCaW5kaW5ncyddLmJpbmQodGhpcywgbm9kZSwgY29udGV4dCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlVGhhdEJpbmRpbmdJc0FsbG93ZWRGb3JWaXJ0dWFsRWxlbWVudHMoYmluZGluZ05hbWUpIHtcbiAgICAgICAgdmFyIHZhbGlkYXRvciA9IGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbYmluZGluZ05hbWVdO1xuICAgICAgICBpZiAoIXZhbGlkYXRvcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBiaW5kaW5nICdcIiArIGJpbmRpbmdOYW1lICsgXCInIGNhbm5vdCBiZSB1c2VkIHdpdGggdmlydHVhbCBlbGVtZW50c1wiKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzSW50ZXJuYWwgKGJpbmRpbmdDb250ZXh0LCBlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCwgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRDaGlsZCxcbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQpLFxuICAgICAgICAgICAgcHJvdmlkZXIgPSBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICBwcmVwcm9jZXNzTm9kZSA9IHByb3ZpZGVyWydwcmVwcm9jZXNzTm9kZSddO1xuXG4gICAgICAgIC8vIFByZXByb2Nlc3NpbmcgYWxsb3dzIGEgYmluZGluZyBwcm92aWRlciB0byBtdXRhdGUgYSBub2RlIGJlZm9yZSBiaW5kaW5ncyBhcmUgYXBwbGllZCB0byBpdC4gRm9yIGV4YW1wbGUgaXQnc1xuICAgICAgICAvLyBwb3NzaWJsZSB0byBpbnNlcnQgbmV3IHNpYmxpbmdzIGFmdGVyIGl0LCBhbmQvb3IgcmVwbGFjZSB0aGUgbm9kZSB3aXRoIGEgZGlmZmVyZW50IG9uZS4gVGhpcyBjYW4gYmUgdXNlZCB0b1xuICAgICAgICAvLyBpbXBsZW1lbnQgY3VzdG9tIGJpbmRpbmcgc3ludGF4ZXMsIHN1Y2ggYXMge3sgdmFsdWUgfX0gZm9yIHN0cmluZyBpbnRlcnBvbGF0aW9uLCBvciBjdXN0b20gZWxlbWVudCB0eXBlcyB0aGF0XG4gICAgICAgIC8vIHRyaWdnZXIgaW5zZXJ0aW9uIG9mIDx0ZW1wbGF0ZT4gY29udGVudHMgYXQgdGhhdCBwb2ludCBpbiB0aGUgZG9jdW1lbnQuXG4gICAgICAgIGlmIChwcmVwcm9jZXNzTm9kZSkge1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRDaGlsZCA9IG5leHRJblF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcoY3VycmVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBwcmVwcm9jZXNzTm9kZS5jYWxsKHByb3ZpZGVyLCBjdXJyZW50Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVzZXQgbmV4dEluUXVldWUgZm9yIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRDaGlsZCA9IG5leHRJblF1ZXVlKSB7XG4gICAgICAgICAgICAvLyBLZWVwIGEgcmVjb3JkIG9mIHRoZSBuZXh0IGNoaWxkICpiZWZvcmUqIGFwcGx5aW5nIGJpbmRpbmdzLCBpbiBjYXNlIHRoZSBiaW5kaW5nIHJlbW92ZXMgdGhlIGN1cnJlbnQgY2hpbGQgZnJvbSBpdHMgcG9zaXRpb25cbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKGN1cnJlbnRDaGlsZCk7XG4gICAgICAgICAgICBhcHBseUJpbmRpbmdzVG9Ob2RlQW5kRGVzY2VuZGFudHNJbnRlcm5hbChiaW5kaW5nQ29udGV4dCwgY3VycmVudENoaWxkLCBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseUJpbmRpbmdzVG9Ob2RlQW5kRGVzY2VuZGFudHNJbnRlcm5hbCAoYmluZGluZ0NvbnRleHQsIG5vZGVWZXJpZmllZCwgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkge1xuICAgICAgICB2YXIgc2hvdWxkQmluZERlc2NlbmRhbnRzID0gdHJ1ZTtcblxuICAgICAgICAvLyBQZXJmIG9wdGltaXNhdGlvbjogQXBwbHkgYmluZGluZ3Mgb25seSBpZi4uLlxuICAgICAgICAvLyAoMSkgV2UgbmVlZCB0byBzdG9yZSB0aGUgYmluZGluZyBjb250ZXh0IG9uIHRoaXMgbm9kZSAoYmVjYXVzZSBpdCBtYXkgZGlmZmVyIGZyb20gdGhlIERPTSBwYXJlbnQgbm9kZSdzIGJpbmRpbmcgY29udGV4dClcbiAgICAgICAgLy8gICAgIE5vdGUgdGhhdCB3ZSBjYW4ndCBzdG9yZSBiaW5kaW5nIGNvbnRleHRzIG9uIG5vbi1lbGVtZW50cyAoZS5nLiwgdGV4dCBub2RlcyksIGFzIElFIGRvZXNuJ3QgYWxsb3cgZXhwYW5kbyBwcm9wZXJ0aWVzIGZvciB0aG9zZVxuICAgICAgICAvLyAoMikgSXQgbWlnaHQgaGF2ZSBiaW5kaW5ncyAoZS5nLiwgaXQgaGFzIGEgZGF0YS1iaW5kIGF0dHJpYnV0ZSwgb3IgaXQncyBhIG1hcmtlciBmb3IgYSBjb250YWluZXJsZXNzIHRlbXBsYXRlKVxuICAgICAgICB2YXIgaXNFbGVtZW50ID0gKG5vZGVWZXJpZmllZC5ub2RlVHlwZSA9PT0gMSk7XG4gICAgICAgIGlmIChpc0VsZW1lbnQpIC8vIFdvcmthcm91bmQgSUUgPD0gOCBIVE1MIHBhcnNpbmcgd2VpcmRuZXNzXG4gICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMubm9ybWFsaXNlVmlydHVhbEVsZW1lbnREb21TdHJ1Y3R1cmUobm9kZVZlcmlmaWVkKTtcblxuICAgICAgICB2YXIgc2hvdWxkQXBwbHlCaW5kaW5ncyA9IChpc0VsZW1lbnQgJiYgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkgICAgICAgICAgICAgLy8gQ2FzZSAoMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ11bJ25vZGVIYXNCaW5kaW5ncyddKG5vZGVWZXJpZmllZCk7ICAgICAgIC8vIENhc2UgKDIpXG4gICAgICAgIGlmIChzaG91bGRBcHBseUJpbmRpbmdzKVxuICAgICAgICAgICAgc2hvdWxkQmluZERlc2NlbmRhbnRzID0gYXBwbHlCaW5kaW5nc1RvTm9kZUludGVybmFsKG5vZGVWZXJpZmllZCwgbnVsbCwgYmluZGluZ0NvbnRleHQsIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpWydzaG91bGRCaW5kRGVzY2VuZGFudHMnXTtcblxuICAgICAgICBpZiAoc2hvdWxkQmluZERlc2NlbmRhbnRzICYmICFiaW5kaW5nRG9lc05vdFJlY3Vyc2VJbnRvRWxlbWVudFR5cGVzW2tvLnV0aWxzLnRhZ05hbWVMb3dlcihub2RlVmVyaWZpZWQpXSkge1xuICAgICAgICAgICAgLy8gV2UncmUgcmVjdXJzaW5nIGF1dG9tYXRpY2FsbHkgaW50byAocmVhbCBvciB2aXJ0dWFsKSBjaGlsZCBub2RlcyB3aXRob3V0IGNoYW5naW5nIGJpbmRpbmcgY29udGV4dHMuIFNvLFxuICAgICAgICAgICAgLy8gICogRm9yIGNoaWxkcmVuIG9mIGEgKnJlYWwqIGVsZW1lbnQsIHRoZSBiaW5kaW5nIGNvbnRleHQgaXMgY2VydGFpbmx5IHRoZSBzYW1lIGFzIG9uIHRoZWlyIERPTSAucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIC8vICAgIGhlbmNlIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50IGlzIGZhbHNlXG4gICAgICAgICAgICAvLyAgKiBGb3IgY2hpbGRyZW4gb2YgYSAqdmlydHVhbCogZWxlbWVudCwgd2UgY2FuJ3QgYmUgc3VyZS4gRXZhbHVhdGluZyAucGFyZW50Tm9kZSBvbiB0aG9zZSBjaGlsZHJlbiBtYXlcbiAgICAgICAgICAgIC8vICAgIHNraXAgb3ZlciBhbnkgbnVtYmVyIG9mIGludGVybWVkaWF0ZSB2aXJ0dWFsIGVsZW1lbnRzLCBhbnkgb2Ygd2hpY2ggbWlnaHQgZGVmaW5lIGEgY3VzdG9tIGJpbmRpbmcgY29udGV4dCxcbiAgICAgICAgICAgIC8vICAgIGhlbmNlIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50IGlzIHRydWVcbiAgICAgICAgICAgIGFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzSW50ZXJuYWwoYmluZGluZ0NvbnRleHQsIG5vZGVWZXJpZmllZCwgLyogYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQ6ICovICFpc0VsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGJvdW5kRWxlbWVudERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcblxuXG4gICAgZnVuY3Rpb24gdG9wb2xvZ2ljYWxTb3J0QmluZGluZ3MoYmluZGluZ3MpIHtcbiAgICAgICAgLy8gRGVwdGgtZmlyc3Qgc29ydFxuICAgICAgICB2YXIgcmVzdWx0ID0gW10sICAgICAgICAgICAgICAgIC8vIFRoZSBsaXN0IG9mIGtleS9oYW5kbGVyIHBhaXJzIHRoYXQgd2Ugd2lsbCByZXR1cm5cbiAgICAgICAgICAgIGJpbmRpbmdzQ29uc2lkZXJlZCA9IHt9LCAgICAvLyBBIHRlbXBvcmFyeSByZWNvcmQgb2Ygd2hpY2ggYmluZGluZ3MgYXJlIGFscmVhZHkgaW4gJ3Jlc3VsdCdcbiAgICAgICAgICAgIGN5Y2xpY0RlcGVuZGVuY3lTdGFjayA9IFtdOyAvLyBLZWVwcyB0cmFjayBvZiBhIGRlcHRoLXNlYXJjaCBzbyB0aGF0LCBpZiB0aGVyZSdzIGEgY3ljbGUsIHdlIGtub3cgd2hpY2ggYmluZGluZ3MgY2F1c2VkIGl0XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2goYmluZGluZ3MsIGZ1bmN0aW9uIHB1c2hCaW5kaW5nKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZ3NDb25zaWRlcmVkW2JpbmRpbmdLZXldKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpbmRpbmcgPSBrb1snZ2V0QmluZGluZ0hhbmRsZXInXShiaW5kaW5nS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXJzdCBhZGQgZGVwZW5kZW5jaWVzIChpZiBhbnkpIG9mIHRoZSBjdXJyZW50IGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdbJ2FmdGVyJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5Y2xpY0RlcGVuZGVuY3lTdGFjay5wdXNoKGJpbmRpbmdLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGJpbmRpbmdbJ2FmdGVyJ10sIGZ1bmN0aW9uKGJpbmRpbmdEZXBlbmRlbmN5S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzW2JpbmRpbmdEZXBlbmRlbmN5S2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuYXJyYXlJbmRleE9mKGN5Y2xpY0RlcGVuZGVuY3lTdGFjaywgYmluZGluZ0RlcGVuZGVuY3lLZXkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJDYW5ub3QgY29tYmluZSB0aGUgZm9sbG93aW5nIGJpbmRpbmdzLCBiZWNhdXNlIHRoZXkgaGF2ZSBhIGN5Y2xpYyBkZXBlbmRlbmN5OiBcIiArIGN5Y2xpY0RlcGVuZGVuY3lTdGFjay5qb2luKFwiLCBcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEJpbmRpbmcoYmluZGluZ0RlcGVuZGVuY3lLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeWNsaWNEZXBlbmRlbmN5U3RhY2subGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gTmV4dCBhZGQgdGhlIGN1cnJlbnQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IGtleTogYmluZGluZ0tleSwgaGFuZGxlcjogYmluZGluZyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmluZGluZ3NDb25zaWRlcmVkW2JpbmRpbmdLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseUJpbmRpbmdzVG9Ob2RlSW50ZXJuYWwobm9kZSwgc291cmNlQmluZGluZ3MsIGJpbmRpbmdDb250ZXh0LCBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnQgbXVsdGlwbGUgYXBwbHlCaW5kaW5ncyBjYWxscyBmb3IgdGhlIHNhbWUgbm9kZSwgZXhjZXB0IHdoZW4gYSBiaW5kaW5nIHZhbHVlIGlzIHNwZWNpZmllZFxuICAgICAgICB2YXIgYWxyZWFkeUJvdW5kID0ga28udXRpbHMuZG9tRGF0YS5nZXQobm9kZSwgYm91bmRFbGVtZW50RG9tRGF0YUtleSk7XG4gICAgICAgIGlmICghc291cmNlQmluZGluZ3MpIHtcbiAgICAgICAgICAgIGlmIChhbHJlYWR5Qm91bmQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIllvdSBjYW5ub3QgYXBwbHkgYmluZGluZ3MgbXVsdGlwbGUgdGltZXMgdG8gdGhlIHNhbWUgZWxlbWVudC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBib3VuZEVsZW1lbnREb21EYXRhS2V5LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogRG9uJ3Qgc3RvcmUgdGhlIGJpbmRpbmcgY29udGV4dCBvbiB0aGlzIG5vZGUgaWYgaXQncyBkZWZpbml0ZWx5IHRoZSBzYW1lIGFzIG9uIG5vZGUucGFyZW50Tm9kZSwgYmVjYXVzZVxuICAgICAgICAvLyB3ZSBjYW4gZWFzaWx5IHJlY292ZXIgaXQganVzdCBieSBzY2FubmluZyB1cCB0aGUgbm9kZSdzIGFuY2VzdG9ycyBpbiB0aGUgRE9NXG4gICAgICAgIC8vIChub3RlOiBoZXJlLCBwYXJlbnQgbm9kZSBtZWFucyBcInJlYWwgRE9NIHBhcmVudFwiIG5vdCBcInZpcnR1YWwgcGFyZW50XCIsIGFzIHRoZXJlJ3Mgbm8gTygxKSB3YXkgdG8gZmluZCB0aGUgdmlydHVhbCBwYXJlbnQpXG4gICAgICAgIGlmICghYWxyZWFkeUJvdW5kICYmIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICBrby5zdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUobm9kZSwgYmluZGluZ0NvbnRleHQpO1xuXG4gICAgICAgIC8vIFVzZSBiaW5kaW5ncyBpZiBnaXZlbiwgb3RoZXJ3aXNlIGZhbGwgYmFjayBvbiBhc2tpbmcgdGhlIGJpbmRpbmdzIHByb3ZpZGVyIHRvIGdpdmUgdXMgc29tZSBiaW5kaW5nc1xuICAgICAgICB2YXIgYmluZGluZ3M7XG4gICAgICAgIGlmIChzb3VyY2VCaW5kaW5ncyAmJiB0eXBlb2Ygc291cmNlQmluZGluZ3MgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGJpbmRpbmdzID0gc291cmNlQmluZGluZ3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgZ2V0QmluZGluZ3MgPSBwcm92aWRlclsnZ2V0QmluZGluZ0FjY2Vzc29ycyddIHx8IGdldEJpbmRpbmdzQW5kTWFrZUFjY2Vzc29ycztcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBiaW5kaW5nIGZyb20gdGhlIHByb3ZpZGVyIHdpdGhpbiBhIGNvbXB1dGVkIG9ic2VydmFibGUgc28gdGhhdCB3ZSBjYW4gdXBkYXRlIHRoZSBiaW5kaW5ncyB3aGVuZXZlclxuICAgICAgICAgICAgLy8gdGhlIGJpbmRpbmcgY29udGV4dCBpcyB1cGRhdGVkIG9yIGlmIHRoZSBiaW5kaW5nIHByb3ZpZGVyIGFjY2Vzc2VzIG9ic2VydmFibGVzLlxuICAgICAgICAgICAgdmFyIGJpbmRpbmdzVXBkYXRlciA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gc291cmNlQmluZGluZ3MgPyBzb3VyY2VCaW5kaW5ncyhiaW5kaW5nQ29udGV4dCwgbm9kZSkgOiBnZXRCaW5kaW5ncy5jYWxsKHByb3ZpZGVyLCBub2RlLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGEgZGVwZW5kZW5jeSBvbiB0aGUgYmluZGluZyBjb250ZXh0IHRvIHN1cHBvcnQgb2JzZXJ2YWJsZSB2aWV3IG1vZGVscy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzICYmIGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC5fc3Vic2NyaWJhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5ncztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBub2RlIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghYmluZGluZ3MgfHwgIWJpbmRpbmdzVXBkYXRlci5pc0FjdGl2ZSgpKVxuICAgICAgICAgICAgICAgIGJpbmRpbmdzVXBkYXRlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M7XG4gICAgICAgIGlmIChiaW5kaW5ncykge1xuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSB2YWx1ZSBhY2Nlc3NvciBmb3IgYSBnaXZlbiBiaW5kaW5nLiBXaGVuIGJpbmRpbmdzIGFyZSBzdGF0aWMgKHdvbid0IGJlIHVwZGF0ZWQgYmVjYXVzZSBvZiBhIGJpbmRpbmdcbiAgICAgICAgICAgIC8vIGNvbnRleHQgdXBkYXRlKSwganVzdCByZXR1cm4gdGhlIHZhbHVlIGFjY2Vzc29yIGZyb20gdGhlIGJpbmRpbmcuIE90aGVyd2lzZSwgcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBhbHdheXMgZ2V0c1xuICAgICAgICAgICAgLy8gdGhlIGxhdGVzdCBiaW5kaW5nIHZhbHVlIGFuZCByZWdpc3RlcnMgYSBkZXBlbmRlbmN5IG9uIHRoZSBiaW5kaW5nIHVwZGF0ZXIuXG4gICAgICAgICAgICB2YXIgZ2V0VmFsdWVBY2Nlc3NvciA9IGJpbmRpbmdzVXBkYXRlclxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKGJpbmRpbmdzVXBkYXRlcigpW2JpbmRpbmdLZXldKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IDogZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluZGluZ3NbYmluZGluZ0tleV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gVXNlIG9mIGFsbEJpbmRpbmdzIGFzIGEgZnVuY3Rpb24gaXMgbWFpbnRhaW5lZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGJ1dCBpdHMgdXNlIGlzIGRlcHJlY2F0ZWRcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFsbEJpbmRpbmdzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5vYmplY3RNYXAoYmluZGluZ3NVcGRhdGVyID8gYmluZGluZ3NVcGRhdGVyKCkgOiBiaW5kaW5ncywgZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgdGhlIDMueCBhbGxCaW5kaW5ncyBBUElcbiAgICAgICAgICAgIGFsbEJpbmRpbmdzWydnZXQnXSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5nc1trZXldICYmIGV2YWx1YXRlVmFsdWVBY2Nlc3NvcihnZXRWYWx1ZUFjY2Vzc29yKGtleSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFsbEJpbmRpbmdzWydoYXMnXSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgaW4gYmluZGluZ3M7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBwdXQgdGhlIGJpbmRpbmdzIGludG8gdGhlIHJpZ2h0IG9yZGVyXG4gICAgICAgICAgICB2YXIgb3JkZXJlZEJpbmRpbmdzID0gdG9wb2xvZ2ljYWxTb3J0QmluZGluZ3MoYmluZGluZ3MpO1xuXG4gICAgICAgICAgICAvLyBHbyB0aHJvdWdoIHRoZSBzb3J0ZWQgYmluZGluZ3MsIGNhbGxpbmcgaW5pdCBhbmQgdXBkYXRlIGZvciBlYWNoXG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2gob3JkZXJlZEJpbmRpbmdzLCBmdW5jdGlvbihiaW5kaW5nS2V5QW5kSGFuZGxlcikge1xuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0b3BvbG9naWNhbFNvcnRCaW5kaW5ncyBoYXMgYWxyZWFkeSBmaWx0ZXJlZCBvdXQgYW55IG5vbmV4aXN0ZW50IGJpbmRpbmcgaGFuZGxlcnMsXG4gICAgICAgICAgICAgICAgLy8gc28gYmluZGluZ0tleUFuZEhhbmRsZXIuaGFuZGxlciB3aWxsIGFsd2F5cyBiZSBub25udWxsLlxuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVySW5pdEZuID0gYmluZGluZ0tleUFuZEhhbmRsZXIuaGFuZGxlcltcImluaXRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXJVcGRhdGVGbiA9IGJpbmRpbmdLZXlBbmRIYW5kbGVyLmhhbmRsZXJbXCJ1cGRhdGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdLZXkgPSBiaW5kaW5nS2V5QW5kSGFuZGxlci5rZXk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZVRoYXRCaW5kaW5nSXNBbGxvd2VkRm9yVmlydHVhbEVsZW1lbnRzKGJpbmRpbmdLZXkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biBpbml0LCBpZ25vcmluZyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlckluaXRGbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbml0UmVzdWx0ID0gaGFuZGxlckluaXRGbihub2RlLCBnZXRWYWx1ZUFjY2Vzc29yKGJpbmRpbmdLZXkpLCBhbGxCaW5kaW5ncywgYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGJpbmRpbmdDb250ZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgYmluZGluZyBoYW5kbGVyIGNsYWltcyB0byBjb250cm9sIGRlc2NlbmRhbnQgYmluZGluZ3MsIG1ha2UgYSBub3RlIG9mIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdFJlc3VsdCAmJiBpbml0UmVzdWx0Wydjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVsdGlwbGUgYmluZGluZ3MgKFwiICsgYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MgKyBcIiBhbmQgXCIgKyBiaW5kaW5nS2V5ICsgXCIpIGFyZSB0cnlpbmcgdG8gY29udHJvbCBkZXNjZW5kYW50IGJpbmRpbmdzIG9mIHRoZSBzYW1lIGVsZW1lbnQuIFlvdSBjYW5ub3QgdXNlIHRoZXNlIGJpbmRpbmdzIHRvZ2V0aGVyIG9uIHRoZSBzYW1lIGVsZW1lbnQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyA9IGJpbmRpbmdLZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gdXBkYXRlIGluIGl0cyBvd24gY29tcHV0ZWQgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXJVcGRhdGVGbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVudE9ic2VydmFibGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJVcGRhdGVGbihub2RlLCBnZXRWYWx1ZUFjY2Vzc29yKGJpbmRpbmdLZXkpLCBhbGxCaW5kaW5ncywgYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IG5vZGUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGV4Lm1lc3NhZ2UgPSBcIlVuYWJsZSB0byBwcm9jZXNzIGJpbmRpbmcgXFxcIlwiICsgYmluZGluZ0tleSArIFwiOiBcIiArIGJpbmRpbmdzW2JpbmRpbmdLZXldICsgXCJcXFwiXFxuTWVzc2FnZTogXCIgKyBleC5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnc2hvdWxkQmluZERlc2NlbmRhbnRzJzogYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MgPT09IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgc3RvcmVkQmluZGluZ0NvbnRleHREb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAga28uc3RvcmVkQmluZGluZ0NvbnRleHRGb3JOb2RlID0gZnVuY3Rpb24gKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIHN0b3JlZEJpbmRpbmdDb250ZXh0RG9tRGF0YUtleSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUpXG4gICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZS5fYWRkTm9kZShub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldChub2RlLCBzdG9yZWRCaW5kaW5nQ29udGV4dERvbURhdGFLZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCkge1xuICAgICAgICByZXR1cm4gdmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCAmJiAodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCBpbnN0YW5jZW9mIGtvLmJpbmRpbmdDb250ZXh0KVxuICAgICAgICAgICAgPyB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0XG4gICAgICAgICAgICA6IG5ldyBrby5iaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KTtcbiAgICB9XG5cbiAgICBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUgPSBmdW5jdGlvbiAobm9kZSwgYmluZGluZ3MsIHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIC8vIElmIGl0J3MgYW4gZWxlbWVudCwgd29ya2Fyb3VuZCBJRSA8PSA4IEhUTUwgcGFyc2luZyB3ZWlyZG5lc3NcbiAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5ub3JtYWxpc2VWaXJ0dWFsRWxlbWVudERvbVN0cnVjdHVyZShub2RlKTtcbiAgICAgICAgcmV0dXJuIGFwcGx5QmluZGluZ3NUb05vZGVJbnRlcm5hbChub2RlLCBiaW5kaW5ncywgZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCksIHRydWUpO1xuICAgIH07XG5cbiAgICBrby5hcHBseUJpbmRpbmdzVG9Ob2RlID0gZnVuY3Rpb24gKG5vZGUsIGJpbmRpbmdzLCB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCk7XG4gICAgICAgIHJldHVybiBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUobm9kZSwgbWFrZUJpbmRpbmdBY2Nlc3NvcnMoYmluZGluZ3MsIGNvbnRleHQsIG5vZGUpLCBjb250ZXh0KTtcbiAgICB9O1xuXG4gICAga28uYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMgPSBmdW5jdGlvbih2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0LCByb290Tm9kZSkge1xuICAgICAgICBpZiAocm9vdE5vZGUubm9kZVR5cGUgPT09IDEgfHwgcm9vdE5vZGUubm9kZVR5cGUgPT09IDgpXG4gICAgICAgICAgICBhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50c0ludGVybmFsKGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpLCByb290Tm9kZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCwgcm9vdE5vZGUpIHtcbiAgICAgICAgLy8gSWYgalF1ZXJ5IGlzIGxvYWRlZCBhZnRlciBLbm9ja291dCwgd2Ugd29uJ3QgaW5pdGlhbGx5IGhhdmUgYWNjZXNzIHRvIGl0LiBTbyBzYXZlIGl0IGhlcmUuXG4gICAgICAgIGlmICghalF1ZXJ5SW5zdGFuY2UgJiYgd2luZG93WydqUXVlcnknXSkge1xuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2UgPSB3aW5kb3dbJ2pRdWVyeSddO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvb3ROb2RlICYmIChyb290Tm9kZS5ub2RlVHlwZSAhPT0gMSkgJiYgKHJvb3ROb2RlLm5vZGVUeXBlICE9PSA4KSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3M6IGZpcnN0IHBhcmFtZXRlciBzaG91bGQgYmUgeW91ciB2aWV3IG1vZGVsOyBzZWNvbmQgcGFyYW1ldGVyIHNob3VsZCBiZSBhIERPTSBub2RlXCIpO1xuICAgICAgICByb290Tm9kZSA9IHJvb3ROb2RlIHx8IHdpbmRvdy5kb2N1bWVudC5ib2R5OyAvLyBNYWtlIFwicm9vdE5vZGVcIiBwYXJhbWV0ZXIgb3B0aW9uYWxcblxuICAgICAgICBhcHBseUJpbmRpbmdzVG9Ob2RlQW5kRGVzY2VuZGFudHNJbnRlcm5hbChnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSwgcm9vdE5vZGUsIHRydWUpO1xuICAgIH07XG5cbiAgICAvLyBSZXRyaWV2aW5nIGJpbmRpbmcgY29udGV4dCBmcm9tIGFyYml0cmFyeSBub2Rlc1xuICAgIGtvLmNvbnRleHRGb3IgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIC8vIFdlIGNhbiBvbmx5IGRvIHNvbWV0aGluZyBtZWFuaW5nZnVsIGZvciBlbGVtZW50cyBhbmQgY29tbWVudCBub2RlcyAoaW4gcGFydGljdWxhciwgbm90IHRleHQgbm9kZXMsIGFzIElFIGNhbid0IHN0b3JlIGRvbWRhdGEgZm9yIHRoZW0pXG4gICAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0ga28uc3RvcmVkQmluZGluZ0NvbnRleHRGb3JOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0KSByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSByZXR1cm4ga28uY29udGV4dEZvcihub2RlLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICBrby5kYXRhRm9yID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgY29udGV4dCA9IGtvLmNvbnRleHRGb3Iobm9kZSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0ID8gY29udGV4dFsnJGRhdGEnXSA6IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCdiaW5kaW5nSGFuZGxlcnMnLCBrby5iaW5kaW5nSGFuZGxlcnMpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5ncycsIGtvLmFwcGx5QmluZGluZ3MpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMnLCBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUnLCBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5nc1RvTm9kZScsIGtvLmFwcGx5QmluZGluZ3NUb05vZGUpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29udGV4dEZvcicsIGtvLmNvbnRleHRGb3IpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnZGF0YUZvcicsIGtvLmRhdGFGb3IpO1xufSkoKTtcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcbiAgICB2YXIgbG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZSA9IHt9LCAvLyBUcmFja3MgY29tcG9uZW50IGxvYWRzIHRoYXQgYXJlIGN1cnJlbnRseSBpbiBmbGlnaHRcbiAgICAgICAgbG9hZGVkRGVmaW5pdGlvbnNDYWNoZSA9IHt9OyAgICAvLyBUcmFja3MgY29tcG9uZW50IGxvYWRzIHRoYXQgaGF2ZSBhbHJlYWR5IGNvbXBsZXRlZFxuXG4gICAga28uY29tcG9uZW50cyA9IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGNhY2hlZERlZmluaXRpb24gPSBnZXRPYmplY3RPd25Qcm9wZXJ0eShsb2FkZWREZWZpbml0aW9uc0NhY2hlLCBjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgIGlmIChjYWNoZWREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBhbHJlYWR5IGxvYWRlZCBhbmQgY2FjaGVkLiBSZXVzZSB0aGUgc2FtZSBkZWZpbml0aW9uIG9iamVjdC5cbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgZm9yIEFQSSBjb25zaXN0ZW5jeSwgZXZlbiBjYWNoZSBoaXRzIGNvbXBsZXRlIGFzeW5jaHJvbm91c2x5IGJ5IGRlZmF1bHQuXG4gICAgICAgICAgICAgICAgLy8gWW91IGNhbiBieXBhc3MgdGhpcyBieSBwdXR0aW5nIHN5bmNocm9ub3VzOnRydWUgb24geW91ciBjb21wb25lbnQgY29uZmlnLlxuICAgICAgICAgICAgICAgIGlmIChjYWNoZWREZWZpbml0aW9uLmlzU3luY2hyb25vdXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoZnVuY3Rpb24oKSB7IC8vIFNlZSBjb21tZW50IGluIGxvYWRlclJlZ2lzdHJ5QmVoYXZpb3JzLmpzIGZvciByZWFzb25pbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNhY2hlZERlZmluaXRpb24uZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnRhc2tzLnNjaGVkdWxlKGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjYWNoZWREZWZpbml0aW9uLmRlZmluaXRpb24pOyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEpvaW4gdGhlIGxvYWRpbmcgcHJvY2VzcyB0aGF0IGlzIGFscmVhZHkgdW5kZXJ3YXksIG9yIHN0YXJ0IGEgbmV3IG9uZS5cbiAgICAgICAgICAgICAgICBsb2FkQ29tcG9uZW50QW5kTm90aWZ5KGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhckNhY2hlZERlZmluaXRpb246IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBsb2FkZWREZWZpbml0aW9uc0NhY2hlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9nZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzOiBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE9iamVjdE93blByb3BlcnR5KG9iaiwgcHJvcE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkgPyBvYmpbcHJvcE5hbWVdIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRDb21wb25lbnRBbmROb3RpZnkoY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHN1YnNjcmliYWJsZSA9IGdldE9iamVjdE93blByb3BlcnR5KGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGUsIGNvbXBvbmVudE5hbWUpLFxuICAgICAgICAgICAgY29tcGxldGVkQXN5bmM7XG4gICAgICAgIGlmICghc3Vic2NyaWJhYmxlKSB7XG4gICAgICAgICAgICAvLyBJdCdzIG5vdCBzdGFydGVkIGxvYWRpbmcgeWV0LiBTdGFydCBsb2FkaW5nLCBhbmQgd2hlbiBpdCdzIGRvbmUsIG1vdmUgaXQgdG8gbG9hZGVkRGVmaW5pdGlvbnNDYWNoZS5cbiAgICAgICAgICAgIHN1YnNjcmliYWJsZSA9IGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGVbY29tcG9uZW50TmFtZV0gPSBuZXcga28uc3Vic2NyaWJhYmxlKCk7XG4gICAgICAgICAgICBzdWJzY3JpYmFibGUuc3Vic2NyaWJlKGNhbGxiYWNrKTtcblxuICAgICAgICAgICAgYmVnaW5Mb2FkaW5nQ29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGZ1bmN0aW9uKGRlZmluaXRpb24sIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciBpc1N5bmNocm9ub3VzQ29tcG9uZW50ID0gISEoY29uZmlnICYmIGNvbmZpZ1snc3luY2hyb25vdXMnXSk7XG4gICAgICAgICAgICAgICAgbG9hZGVkRGVmaW5pdGlvbnNDYWNoZVtjb21wb25lbnROYW1lXSA9IHsgZGVmaW5pdGlvbjogZGVmaW5pdGlvbiwgaXNTeW5jaHJvbm91c0NvbXBvbmVudDogaXNTeW5jaHJvbm91c0NvbXBvbmVudCB9O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2FkaW5nU3Vic2NyaWJhYmxlc0NhY2hlW2NvbXBvbmVudE5hbWVdO1xuXG4gICAgICAgICAgICAgICAgLy8gRm9yIEFQSSBjb25zaXN0ZW5jeSwgYWxsIGxvYWRzIGNvbXBsZXRlIGFzeW5jaHJvbm91c2x5LiBIb3dldmVyIHdlIHdhbnQgdG8gYXZvaWRcbiAgICAgICAgICAgICAgICAvLyBhZGRpbmcgYW4gZXh0cmEgdGFzayBzY2hlZHVsZSBpZiBpdCdzIHVubmVjZXNzYXJ5IChpLmUuLCB0aGUgY29tcGxldGlvbiBpcyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgLy8gYXN5bmMpLlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gWW91IGNhbiBieXBhc3MgdGhlICdhbHdheXMgYXN5bmNocm9ub3VzJyBmZWF0dXJlIGJ5IHB1dHRpbmcgdGhlIHN5bmNocm9ub3VzOnRydWVcbiAgICAgICAgICAgICAgICAvLyBmbGFnIG9uIHlvdXIgY29tcG9uZW50IGNvbmZpZ3VyYXRpb24gd2hlbiB5b3UgcmVnaXN0ZXIgaXQuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZEFzeW5jIHx8IGlzU3luY2hyb25vdXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IG5vdGlmeVN1YnNjcmliZXJzIGlnbm9yZXMgYW55IGRlcGVuZGVuY2llcyByZWFkIHdpdGhpbiB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICAgICAgICAgIC8vIFNlZSBjb21tZW50IGluIGxvYWRlclJlZ2lzdHJ5QmVoYXZpb3JzLmpzIGZvciByZWFzb25pbmdcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlWydub3RpZnlTdWJzY3JpYmVycyddKGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnRhc2tzLnNjaGVkdWxlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlWydub3RpZnlTdWJzY3JpYmVycyddKGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbXBsZXRlZEFzeW5jID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1YnNjcmliYWJsZS5zdWJzY3JpYmUoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmVnaW5Mb2FkaW5nQ29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2dldENvbmZpZycsIFtjb21wb25lbnROYW1lXSwgZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIGNvbmZpZywgc28gbm93IGxvYWQgaXRzIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdsb2FkQ29tcG9uZW50JywgW2NvbXBvbmVudE5hbWUsIGNvbmZpZ10sIGZ1bmN0aW9uKGRlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGVmaW5pdGlvbiwgY29uZmlnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvbXBvbmVudCBoYXMgbm8gY29uZmlnIC0gaXQncyB1bmtub3duIHRvIGFsbCB0aGUgbG9hZGVycy5cbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhpcyBpcyBub3QgYW4gZXJyb3IgKGUuZy4sIGEgbW9kdWxlIGxvYWRpbmcgZXJyb3IpIC0gdGhhdCB3b3VsZCBhYm9ydCB0aGVcbiAgICAgICAgICAgICAgICAvLyBwcm9jZXNzIGFuZCB0aGlzIGNhbGxiYWNrIHdvdWxkIG5vdCBydW4uIEZvciB0aGlzIGNhbGxiYWNrIHRvIHJ1biwgYWxsIGxvYWRlcnMgbXVzdFxuICAgICAgICAgICAgICAgIC8vIGhhdmUgY29uZmlybWVkIHRoZXkgZG9uJ3Qga25vdyBhYm91dCB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycyhtZXRob2ROYW1lLCBhcmdzRXhjZXB0Q2FsbGJhY2ssIGNhbGxiYWNrLCBjYW5kaWRhdGVMb2FkZXJzKSB7XG4gICAgICAgIC8vIE9uIHRoZSBmaXJzdCBjYWxsIGluIHRoZSBzdGFjaywgc3RhcnQgd2l0aCB0aGUgZnVsbCBzZXQgb2YgbG9hZGVyc1xuICAgICAgICBpZiAoIWNhbmRpZGF0ZUxvYWRlcnMpIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZUxvYWRlcnMgPSBrby5jb21wb25lbnRzWydsb2FkZXJzJ10uc2xpY2UoMCk7IC8vIFVzZSBhIGNvcHksIGJlY2F1c2Ugd2UnbGwgYmUgbXV0YXRpbmcgdGhpcyBhcnJheVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHJ5IHRoZSBuZXh0IGNhbmRpZGF0ZVxuICAgICAgICB2YXIgY3VycmVudENhbmRpZGF0ZUxvYWRlciA9IGNhbmRpZGF0ZUxvYWRlcnMuc2hpZnQoKTtcbiAgICAgICAgaWYgKGN1cnJlbnRDYW5kaWRhdGVMb2FkZXIpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2RJbnN0YW5jZSA9IGN1cnJlbnRDYW5kaWRhdGVMb2FkZXJbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICBpZiAobWV0aG9kSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgd2FzQWJvcnRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzeW5jaHJvbm91c1JldHVyblZhbHVlID0gbWV0aG9kSW5zdGFuY2UuYXBwbHkoY3VycmVudENhbmRpZGF0ZUxvYWRlciwgYXJnc0V4Y2VwdENhbGxiYWNrLmNvbmNhdChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3YXNBYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgY2FuZGlkYXRlIHJldHVybmVkIGEgdmFsdWUuIFVzZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdGhlIG5leHQgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycyhtZXRob2ROYW1lLCBhcmdzRXhjZXB0Q2FsbGJhY2ssIGNhbGxiYWNrLCBjYW5kaWRhdGVMb2FkZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5LCBsb2FkZXJzIG1heSBub3QgcmV0dXJuIGFueXRoaW5nIHN5bmNocm9ub3VzbHkuIFRoaXMgbGVhdmVzIG9wZW4gdGhlIHBvc3NpYmlsaXR5XG4gICAgICAgICAgICAgICAgLy8gdGhhdCB3ZSdsbCBleHRlbmQgdGhlIEFQSSB0byBzdXBwb3J0IHN5bmNocm9ub3VzIHJldHVybiB2YWx1ZXMgaW4gdGhlIGZ1dHVyZS4gSXQgd29uJ3QgYmVcbiAgICAgICAgICAgICAgICAvLyBhIGJyZWFraW5nIGNoYW5nZSwgYmVjYXVzZSBjdXJyZW50bHkgbm8gbG9hZGVyIGlzIGFsbG93ZWQgdG8gcmV0dXJuIGFueXRoaW5nIGV4Y2VwdCB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgaWYgKHN5bmNocm9ub3VzUmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB3YXNBYm9ydGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBNZXRob2QgdG8gc3VwcHJlc3MgZXhjZXB0aW9ucyB3aWxsIHJlbWFpbiB1bmRvY3VtZW50ZWQuIFRoaXMgaXMgb25seSB0byBrZWVwXG4gICAgICAgICAgICAgICAgICAgIC8vIEtPJ3Mgc3BlY3MgcnVubmluZyB0aWRpbHksIHNpbmNlIHdlIGNhbiBvYnNlcnZlIHRoZSBsb2FkaW5nIGdvdCBhYm9ydGVkIHdpdGhvdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gaGF2aW5nIGV4Y2VwdGlvbnMgY2x1dHRlcmluZyB1cCB0aGUgY29uc29sZSB0b28uXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VycmVudENhbmRpZGF0ZUxvYWRlclsnc3VwcHJlc3NMb2FkZXJFeGNlcHRpb25zJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IGxvYWRlcnMgbXVzdCBzdXBwbHkgdmFsdWVzIGJ5IGludm9raW5nIHRoZSBjYWxsYmFjaywgbm90IGJ5IHJldHVybmluZyB2YWx1ZXMgc3luY2hyb25vdXNseS4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBjYW5kaWRhdGUgZG9lc24ndCBoYXZlIHRoZSByZWxldmFudCBoYW5kbGVyLiBTeW5jaHJvbm91c2x5IG1vdmUgb24gdG8gdGhlIG5leHQgb25lLlxuICAgICAgICAgICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMobWV0aG9kTmFtZSwgYXJnc0V4Y2VwdENhbGxiYWNrLCBjYWxsYmFjaywgY2FuZGlkYXRlTG9hZGVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBObyBjYW5kaWRhdGVzIHJldHVybmVkIGEgdmFsdWVcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVmZXJlbmNlIHRoZSBsb2FkZXJzIHZpYSBzdHJpbmcgbmFtZSBzbyBpdCdzIHBvc3NpYmxlIGZvciBkZXZlbG9wZXJzXG4gICAgLy8gdG8gcmVwbGFjZSB0aGUgd2hvbGUgYXJyYXkgYnkgYXNzaWduaW5nIHRvIGtvLmNvbXBvbmVudHMubG9hZGVyc1xuICAgIGtvLmNvbXBvbmVudHNbJ2xvYWRlcnMnXSA9IFtdO1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzJywga28uY29tcG9uZW50cyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmdldCcsIGtvLmNvbXBvbmVudHMuZ2V0KTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuY2xlYXJDYWNoZWREZWZpbml0aW9uJywga28uY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb24pO1xufSkoKTtcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IGxvYWRlciBpcyByZXNwb25zaWJsZSBmb3IgdHdvIHRoaW5nczpcbiAgICAvLyAxLiBNYWludGFpbmluZyB0aGUgZGVmYXVsdCBpbi1tZW1vcnkgcmVnaXN0cnkgb2YgY29tcG9uZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIC8vICAgIChpLmUuLCB0aGUgdGhpbmcgeW91J3JlIHdyaXRpbmcgdG8gd2hlbiB5b3UgY2FsbCBrby5jb21wb25lbnRzLnJlZ2lzdGVyKHNvbWVOYW1lLCAuLi4pKVxuICAgIC8vIDIuIEFuc3dlcmluZyByZXF1ZXN0cyBmb3IgY29tcG9uZW50cyBieSBmZXRjaGluZyBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICAvLyAgICBmcm9tIHRoYXQgZGVmYXVsdCBpbi1tZW1vcnkgcmVnaXN0cnkgYW5kIHJlc29sdmluZyB0aGVtIGludG8gc3RhbmRhcmRcbiAgICAvLyAgICBjb21wb25lbnQgZGVmaW5pdGlvbiBvYmplY3RzIChvZiB0aGUgZm9ybSB7IGNyZWF0ZVZpZXdNb2RlbDogLi4uLCB0ZW1wbGF0ZTogLi4uIH0pXG4gICAgLy8gQ3VzdG9tIGxvYWRlcnMgbWF5IG92ZXJyaWRlIGVpdGhlciBvZiB0aGVzZSBmYWNpbGl0aWVzLCBpLmUuLFxuICAgIC8vIDEuIFRvIHN1cHBseSBjb25maWd1cmF0aW9uIG9iamVjdHMgZnJvbSBzb21lIG90aGVyIHNvdXJjZSAoZS5nLiwgY29udmVudGlvbnMpXG4gICAgLy8gMi4gT3IsIHRvIHJlc29sdmUgY29uZmlndXJhdGlvbiBvYmplY3RzIGJ5IGxvYWRpbmcgdmlld21vZGVscy90ZW1wbGF0ZXMgdmlhIGFyYml0cmFyeSBsb2dpYy5cblxuICAgIHZhciBkZWZhdWx0Q29uZmlnUmVnaXN0cnkgPSB7fTtcblxuICAgIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIgPSBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFjb25maWcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25maWd1cmF0aW9uIGZvciAnICsgY29tcG9uZW50TmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50ICcgKyBjb21wb25lbnROYW1lICsgJyBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHRDb25maWdSZWdpc3RyeVtjb21wb25lbnROYW1lXSA9IGNvbmZpZztcbiAgICB9O1xuXG4gICAga28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQgPSBmdW5jdGlvbihjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29uZmlnUmVnaXN0cnkuaGFzT3duUHJvcGVydHkoY29tcG9uZW50TmFtZSk7XG4gICAgfTtcblxuICAgIGtvLmNvbXBvbmVudHMudW5yZWdpc3RlciA9IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgZGVsZXRlIGRlZmF1bHRDb25maWdSZWdpc3RyeVtjb21wb25lbnROYW1lXTtcbiAgICAgICAga28uY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb24oY29tcG9uZW50TmFtZSk7XG4gICAgfTtcblxuICAgIGtvLmNvbXBvbmVudHMuZGVmYXVsdExvYWRlciA9IHtcbiAgICAgICAgJ2dldENvbmZpZyc6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5Lmhhc093blByb3BlcnR5KGNvbXBvbmVudE5hbWUpXG4gICAgICAgICAgICAgICAgPyBkZWZhdWx0Q29uZmlnUmVnaXN0cnlbY29tcG9uZW50TmFtZV1cbiAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgICdsb2FkQ29tcG9uZW50JzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGVycm9yQ2FsbGJhY2sgPSBtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCBjb25maWcsIGZ1bmN0aW9uKGxvYWRlZENvbmZpZykge1xuICAgICAgICAgICAgICAgIHJlc29sdmVDb25maWcoY29tcG9uZW50TmFtZSwgZXJyb3JDYWxsYmFjaywgbG9hZGVkQ29uZmlnLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAnbG9hZFRlbXBsYXRlJzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgdGVtcGxhdGVDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXNvbHZlVGVtcGxhdGUobWFrZUVycm9yQ2FsbGJhY2soY29tcG9uZW50TmFtZSksIHRlbXBsYXRlQ29uZmlnLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2xvYWRWaWV3TW9kZWwnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCB2aWV3TW9kZWxDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXNvbHZlVmlld01vZGVsKG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpLCB2aWV3TW9kZWxDb25maWcsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlVmlld01vZGVsS2V5ID0gJ2NyZWF0ZVZpZXdNb2RlbCc7XG5cbiAgICAvLyBUYWtlcyBhIGNvbmZpZyBvYmplY3Qgb2YgdGhlIGZvcm0geyB0ZW1wbGF0ZTogLi4uLCB2aWV3TW9kZWw6IC4uLiB9LCBhbmQgYXN5bmNocm9ub3VzbHkgY29udmVydCBpdFxuICAgIC8vIGludG8gdGhlIHN0YW5kYXJkIGNvbXBvbmVudCBkZWZpbml0aW9uIGZvcm1hdDpcbiAgICAvLyAgICB7IHRlbXBsYXRlOiA8QXJyYXlPZkRvbU5vZGVzPiwgY3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMsIGNvbXBvbmVudEluZm8pIHsgLi4uIH0gfS5cbiAgICAvLyBTaW5jZSBib3RoIHRlbXBsYXRlIGFuZCB2aWV3TW9kZWwgbWF5IG5lZWQgdG8gYmUgcmVzb2x2ZWQgYXN5bmNocm9ub3VzbHksIGJvdGggdGFza3MgYXJlIHBlcmZvcm1lZFxuICAgIC8vIGluIHBhcmFsbGVsLCBhbmQgdGhlIHJlc3VsdHMgam9pbmVkIHdoZW4gYm90aCBhcmUgcmVhZHkuIFdlIGRvbid0IGRlcGVuZCBvbiBhbnkgcHJvbWlzZXMgaW5mcmFzdHJ1Y3R1cmUsXG4gICAgLy8gc28gdGhpcyBpcyBpbXBsZW1lbnRlZCBtYW51YWxseSBiZWxvdy5cbiAgICBmdW5jdGlvbiByZXNvbHZlQ29uZmlnKGNvbXBvbmVudE5hbWUsIGVycm9yQ2FsbGJhY2ssIGNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICAgICAgbWFrZUNhbGxCYWNrV2hlblplcm8gPSAyLFxuICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgtLW1ha2VDYWxsQmFja1doZW5aZXJvID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlQ29uZmlnID0gY29uZmlnWyd0ZW1wbGF0ZSddLFxuICAgICAgICAgICAgdmlld01vZGVsQ29uZmlnID0gY29uZmlnWyd2aWV3TW9kZWwnXTtcblxuICAgICAgICBpZiAodGVtcGxhdGVDb25maWcpIHtcbiAgICAgICAgICAgIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCB0ZW1wbGF0ZUNvbmZpZywgZnVuY3Rpb24obG9hZGVkQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAga28uY29tcG9uZW50cy5fZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycygnbG9hZFRlbXBsYXRlJywgW2NvbXBvbmVudE5hbWUsIGxvYWRlZENvbmZpZ10sIGZ1bmN0aW9uKHJlc29sdmVkVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Wyd0ZW1wbGF0ZSddID0gcmVzb2x2ZWRUZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmlld01vZGVsQ29uZmlnKSB7XG4gICAgICAgICAgICBwb3NzaWJseUdldENvbmZpZ0Zyb21BbWQoZXJyb3JDYWxsYmFjaywgdmlld01vZGVsQ29uZmlnLCBmdW5jdGlvbihsb2FkZWRDb25maWcpIHtcbiAgICAgICAgICAgICAgICBrby5jb21wb25lbnRzLl9nZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdsb2FkVmlld01vZGVsJywgW2NvbXBvbmVudE5hbWUsIGxvYWRlZENvbmZpZ10sIGZ1bmN0aW9uKHJlc29sdmVkVmlld01vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtjcmVhdGVWaWV3TW9kZWxLZXldID0gcmVzb2x2ZWRWaWV3TW9kZWw7XG4gICAgICAgICAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVRlbXBsYXRlKGVycm9yQ2FsbGJhY2ssIHRlbXBsYXRlQ29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlQ29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gTWFya3VwIC0gcGFyc2UgaXRcbiAgICAgICAgICAgIGNhbGxiYWNrKGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KHRlbXBsYXRlQ29uZmlnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGVtcGxhdGVDb25maWcgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgLy8gQXNzdW1lIGFscmVhZHkgYW4gYXJyYXkgb2YgRE9NIG5vZGVzIC0gcGFzcyB0aHJvdWdoIHVuY2hhbmdlZFxuICAgICAgICAgICAgY2FsbGJhY2sodGVtcGxhdGVDb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRG9jdW1lbnRGcmFnbWVudCh0ZW1wbGF0ZUNvbmZpZykpIHtcbiAgICAgICAgICAgIC8vIERvY3VtZW50IGZyYWdtZW50IC0gdXNlIGl0cyBjaGlsZCBub2Rlc1xuICAgICAgICAgICAgY2FsbGJhY2soa28udXRpbHMubWFrZUFycmF5KHRlbXBsYXRlQ29uZmlnLmNoaWxkTm9kZXMpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZUNvbmZpZ1snZWxlbWVudCddKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRlbXBsYXRlQ29uZmlnWydlbGVtZW50J107XG4gICAgICAgICAgICBpZiAoaXNEb21FbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgLy8gRWxlbWVudCBpbnN0YW5jZSAtIGNvcHkgaXRzIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY2xvbmVOb2Rlc0Zyb21UZW1wbGF0ZVNvdXJjZUVsZW1lbnQoZWxlbWVudCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBFbGVtZW50IElEIC0gZmluZCBpdCwgdGhlbiBjb3B5IGl0cyBjaGlsZCBub2Rlc1xuICAgICAgICAgICAgICAgIHZhciBlbGVtSW5zdGFuY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbUluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNsb25lTm9kZXNGcm9tVGVtcGxhdGVTb3VyY2VFbGVtZW50KGVsZW1JbnN0YW5jZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ0Nhbm5vdCBmaW5kIGVsZW1lbnQgd2l0aCBJRCAnICsgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVbmtub3duIGVsZW1lbnQgdHlwZTogJyArIGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnVW5rbm93biB0ZW1wbGF0ZSB2YWx1ZTogJyArIHRlbXBsYXRlQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVWaWV3TW9kZWwoZXJyb3JDYWxsYmFjaywgdmlld01vZGVsQ29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIHZpZXdNb2RlbENvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gQ29uc3RydWN0b3IgLSBjb252ZXJ0IHRvIHN0YW5kYXJkIGZhY3RvcnkgZnVuY3Rpb24gZm9ybWF0XG4gICAgICAgICAgICAvLyBCeSBkZXNpZ24sIHRoaXMgZG9lcyAqbm90KiBzdXBwbHkgY29tcG9uZW50SW5mbyB0byB0aGUgY29uc3RydWN0b3IsIGFzIHRoZSBpbnRlbnQgaXMgdGhhdFxuICAgICAgICAgICAgLy8gY29tcG9uZW50SW5mbyBjb250YWlucyBub24tdmlld21vZGVsIGRhdGEgKGUuZy4sIHRoZSBjb21wb25lbnQncyBlbGVtZW50KSB0aGF0IHNob3VsZCBvbmx5XG4gICAgICAgICAgICAvLyBiZSB1c2VkIGluIGZhY3RvcnkgZnVuY3Rpb25zLCBub3Qgdmlld21vZGVsIGNvbnN0cnVjdG9ycy5cbiAgICAgICAgICAgIGNhbGxiYWNrKGZ1bmN0aW9uIChwYXJhbXMgLyosIGNvbXBvbmVudEluZm8gKi8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHZpZXdNb2RlbENvbmZpZyhwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZpZXdNb2RlbENvbmZpZ1tjcmVhdGVWaWV3TW9kZWxLZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBBbHJlYWR5IGEgZmFjdG9yeSBmdW5jdGlvbiAtIHVzZSBpdCBhcy1pc1xuICAgICAgICAgICAgY2FsbGJhY2sodmlld01vZGVsQ29uZmlnW2NyZWF0ZVZpZXdNb2RlbEtleV0pO1xuICAgICAgICB9IGVsc2UgaWYgKCdpbnN0YW5jZScgaW4gdmlld01vZGVsQ29uZmlnKSB7XG4gICAgICAgICAgICAvLyBGaXhlZCBvYmplY3QgaW5zdGFuY2UgLSBwcm9tb3RlIHRvIGNyZWF0ZVZpZXdNb2RlbCBmb3JtYXQgZm9yIEFQSSBjb25zaXN0ZW5jeVxuICAgICAgICAgICAgdmFyIGZpeGVkSW5zdGFuY2UgPSB2aWV3TW9kZWxDb25maWdbJ2luc3RhbmNlJ107XG4gICAgICAgICAgICBjYWxsYmFjayhmdW5jdGlvbiAocGFyYW1zLCBjb21wb25lbnRJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpeGVkSW5zdGFuY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgndmlld01vZGVsJyBpbiB2aWV3TW9kZWxDb25maWcpIHtcbiAgICAgICAgICAgIC8vIFJlc29sdmVkIEFNRCBtb2R1bGUgd2hvc2UgdmFsdWUgaXMgb2YgdGhlIGZvcm0geyB2aWV3TW9kZWw6IC4uLiB9XG4gICAgICAgICAgICByZXNvbHZlVmlld01vZGVsKGVycm9yQ2FsbGJhY2ssIHZpZXdNb2RlbENvbmZpZ1sndmlld01vZGVsJ10sIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1Vua25vd24gdmlld01vZGVsIHZhbHVlOiAnICsgdmlld01vZGVsQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lTm9kZXNGcm9tVGVtcGxhdGVTb3VyY2VFbGVtZW50KGVsZW1JbnN0YW5jZSkge1xuICAgICAgICBzd2l0Y2ggKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtSW5zdGFuY2UpKSB7XG4gICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudChlbGVtSW5zdGFuY2UudGV4dCk7XG4gICAgICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KGVsZW1JbnN0YW5jZS52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICd0ZW1wbGF0ZSc6XG4gICAgICAgICAgICAgICAgLy8gRm9yIGJyb3dzZXJzIHdpdGggcHJvcGVyIDx0ZW1wbGF0ZT4gZWxlbWVudCBzdXBwb3J0IChpLmUuLCB3aGVyZSB0aGUgLmNvbnRlbnQgcHJvcGVydHlcbiAgICAgICAgICAgICAgICAvLyBnaXZlcyBhIGRvY3VtZW50IGZyYWdtZW50KSwgdXNlIHRoYXQgZG9jdW1lbnQgZnJhZ21lbnQuXG4gICAgICAgICAgICAgICAgaWYgKGlzRG9jdW1lbnRGcmFnbWVudChlbGVtSW5zdGFuY2UuY29udGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmNsb25lTm9kZXMoZWxlbUluc3RhbmNlLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVndWxhciBlbGVtZW50cyBzdWNoIGFzIDxkaXY+LCBhbmQgPHRlbXBsYXRlPiBlbGVtZW50cyBvbiBvbGQgYnJvd3NlcnMgdGhhdCBkb24ndCByZWFsbHlcbiAgICAgICAgLy8gdW5kZXJzdGFuZCA8dGVtcGxhdGU+IGFuZCBqdXN0IHRyZWF0IGl0IGFzIGEgcmVndWxhciBjb250YWluZXJcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmNsb25lTm9kZXMoZWxlbUluc3RhbmNlLmNoaWxkTm9kZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRG9tRWxlbWVudChvYmopIHtcbiAgICAgICAgaWYgKHdpbmRvd1snSFRNTEVsZW1lbnQnXSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmoudGFnTmFtZSAmJiBvYmoubm9kZVR5cGUgPT09IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RvY3VtZW50RnJhZ21lbnQob2JqKSB7XG4gICAgICAgIGlmICh3aW5kb3dbJ0RvY3VtZW50RnJhZ21lbnQnXSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMTE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NzaWJseUdldENvbmZpZ0Zyb21BbWQoZXJyb3JDYWxsYmFjaywgY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZ1sncmVxdWlyZSddID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gVGhlIGNvbmZpZyBpcyB0aGUgdmFsdWUgb2YgYW4gQU1EIG1vZHVsZVxuICAgICAgICAgICAgaWYgKGFtZFJlcXVpcmUgfHwgd2luZG93WydyZXF1aXJlJ10pIHtcbiAgICAgICAgICAgICAgICAoYW1kUmVxdWlyZSB8fCB3aW5kb3dbJ3JlcXVpcmUnXSkoW2NvbmZpZ1sncmVxdWlyZSddXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVc2VzIHJlcXVpcmUsIGJ1dCBubyBBTUQgbG9hZGVyIGlzIHByZXNlbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnOiAnICsgbWVzc2FnZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLnJlZ2lzdGVyJywga28uY29tcG9uZW50cy5yZWdpc3Rlcik7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmlzUmVnaXN0ZXJlZCcsIGtvLmNvbXBvbmVudHMuaXNSZWdpc3RlcmVkKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMudW5yZWdpc3RlcicsIGtvLmNvbXBvbmVudHMudW5yZWdpc3Rlcik7XG5cbiAgICAvLyBFeHBvc2UgdGhlIGRlZmF1bHQgbG9hZGVyIHNvIHRoYXQgZGV2ZWxvcGVycyBjYW4gZGlyZWN0bHkgYXNrIGl0IGZvciBjb25maWd1cmF0aW9uXG4gICAgLy8gb3IgdG8gcmVzb2x2ZSBjb25maWd1cmF0aW9uXG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmRlZmF1bHRMb2FkZXInLCBrby5jb21wb25lbnRzLmRlZmF1bHRMb2FkZXIpO1xuXG4gICAgLy8gQnkgZGVmYXVsdCwgdGhlIGRlZmF1bHQgbG9hZGVyIGlzIHRoZSBvbmx5IHJlZ2lzdGVyZWQgY29tcG9uZW50IGxvYWRlclxuICAgIGtvLmNvbXBvbmVudHNbJ2xvYWRlcnMnXS5wdXNoKGtvLmNvbXBvbmVudHMuZGVmYXVsdExvYWRlcik7XG5cbiAgICAvLyBQcml2YXRlbHkgZXhwb3NlIHRoZSB1bmRlcmx5aW5nIGNvbmZpZyByZWdpc3RyeSBmb3IgdXNlIGluIG9sZC1JRSBzaGltXG4gICAga28uY29tcG9uZW50cy5fYWxsUmVnaXN0ZXJlZENvbXBvbmVudHMgPSBkZWZhdWx0Q29uZmlnUmVnaXN0cnk7XG59KSgpO1xuKGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcbiAgICAvLyBPdmVycmlkYWJsZSBBUEkgZm9yIGRldGVybWluaW5nIHdoaWNoIGNvbXBvbmVudCBuYW1lIGFwcGxpZXMgdG8gYSBnaXZlbiBub2RlLiBCeSBvdmVycmlkaW5nIHRoaXMsXG4gICAgLy8geW91IGNhbiBmb3IgZXhhbXBsZSBtYXAgc3BlY2lmaWMgdGFnTmFtZXMgdG8gY29tcG9uZW50cyB0aGF0IGFyZSBub3QgcHJlcmVnaXN0ZXJlZC5cbiAgICBrby5jb21wb25lbnRzWydnZXRDb21wb25lbnROYW1lRm9yTm9kZSddID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgdGFnTmFtZUxvd2VyID0ga28udXRpbHMudGFnTmFtZUxvd2VyKG5vZGUpO1xuICAgICAgICBpZiAoa28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQodGFnTmFtZUxvd2VyKSkge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIGRldGVybWluZSB0aGF0IHRoaXMgbm9kZSBjYW4gYmUgY29uc2lkZXJlZCBhICpjdXN0b20qIGVsZW1lbnQ7IHNlZSBodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzLzE2MDNcbiAgICAgICAgICAgIGlmICh0YWdOYW1lTG93ZXIuaW5kZXhPZignLScpICE9IC0xIHx8ICgnJyArIG5vZGUpID09IFwiW29iamVjdCBIVE1MVW5rbm93bkVsZW1lbnRdXCIgfHwgKGtvLnV0aWxzLmllVmVyc2lvbiA8PSA4ICYmIG5vZGUudGFnTmFtZSA9PT0gdGFnTmFtZUxvd2VyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWdOYW1lTG93ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28uY29tcG9uZW50cy5hZGRCaW5kaW5nc0ZvckN1c3RvbUVsZW1lbnQgPSBmdW5jdGlvbihhbGxCaW5kaW5ncywgbm9kZSwgYmluZGluZ0NvbnRleHQsIHZhbHVlQWNjZXNzb3JzKSB7XG4gICAgICAgIC8vIERldGVybWluZSBpZiBpdCdzIHJlYWxseSBhIGN1c3RvbSBlbGVtZW50IG1hdGNoaW5nIGEgY29tcG9uZW50XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGtvLmNvbXBvbmVudHNbJ2dldENvbXBvbmVudE5hbWVGb3JOb2RlJ10obm9kZSk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIC8vIEl0IGRvZXMgcmVwcmVzZW50IGEgY29tcG9uZW50LCBzbyBhZGQgYSBjb21wb25lbnQgYmluZGluZyBmb3IgaXRcbiAgICAgICAgICAgICAgICBhbGxCaW5kaW5ncyA9IGFsbEJpbmRpbmdzIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFsbEJpbmRpbmdzWydjb21wb25lbnQnXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBzaWxlbnRseSBvdmVyd3JpdGluZyBzb21lIG90aGVyICdjb21wb25lbnQnIGJpbmRpbmcgdGhhdCBtYXkgYWxyZWFkeSBiZSBvbiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgdGhlIFwiY29tcG9uZW50XCIgYmluZGluZyBvbiBhIGN1c3RvbSBlbGVtZW50IG1hdGNoaW5nIGEgY29tcG9uZW50Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudEJpbmRpbmdWYWx1ZSA9IHsgJ25hbWUnOiBjb21wb25lbnROYW1lLCAncGFyYW1zJzogZ2V0Q29tcG9uZW50UGFyYW1zRnJvbUN1c3RvbUVsZW1lbnQobm9kZSwgYmluZGluZ0NvbnRleHQpIH07XG5cbiAgICAgICAgICAgICAgICBhbGxCaW5kaW5nc1snY29tcG9uZW50J10gPSB2YWx1ZUFjY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29tcG9uZW50QmluZGluZ1ZhbHVlOyB9XG4gICAgICAgICAgICAgICAgICAgIDogY29tcG9uZW50QmluZGluZ1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbEJpbmRpbmdzO1xuICAgIH1cblxuICAgIHZhciBuYXRpdmVCaW5kaW5nUHJvdmlkZXJJbnN0YW5jZSA9IG5ldyBrby5iaW5kaW5nUHJvdmlkZXIoKTtcblxuICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudFBhcmFtc0Zyb21DdXN0b21FbGVtZW50KGVsZW0sIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHZhciBwYXJhbXNBdHRyaWJ1dGUgPSBlbGVtLmdldEF0dHJpYnV0ZSgncGFyYW1zJyk7XG5cbiAgICAgICAgaWYgKHBhcmFtc0F0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IG5hdGl2ZUJpbmRpbmdQcm92aWRlckluc3RhbmNlWydwYXJzZUJpbmRpbmdzU3RyaW5nJ10ocGFyYW1zQXR0cmlidXRlLCBiaW5kaW5nQ29udGV4dCwgZWxlbSwgeyAndmFsdWVBY2Nlc3NvcnMnOiB0cnVlLCAnYmluZGluZ1BhcmFtcyc6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgcmF3UGFyYW1Db21wdXRlZFZhbHVlcyA9IGtvLnV0aWxzLm9iamVjdE1hcChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtVmFsdWUsIHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQocGFyYW1WYWx1ZSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW0gfSk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ga28udXRpbHMub2JqZWN0TWFwKHJhd1BhcmFtQ29tcHV0ZWRWYWx1ZXMsIGZ1bmN0aW9uKHBhcmFtVmFsdWVDb21wdXRlZCwgcGFyYW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbVZhbHVlID0gcGFyYW1WYWx1ZUNvbXB1dGVkLnBlZWsoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG9lcyB0aGUgZXZhbHVhdGlvbiBvZiB0aGUgcGFyYW1ldGVyIHZhbHVlIHVud3JhcCBhbnkgb2JzZXJ2YWJsZXM/XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFyYW1WYWx1ZUNvbXB1dGVkLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIGl0IGRvZXNuJ3QsIHNvIHRoZXJlJ3Mgbm8gbmVlZCBmb3IgYW55IGNvbXB1dGVkIHdyYXBwZXIuIEp1c3QgcGFzcyB0aHJvdWdoIHRoZSBzdXBwbGllZCB2YWx1ZSBkaXJlY3RseS5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4YW1wbGU6IFwic29tZVZhbDogZmlyc3ROYW1lLCBhZ2U6IDEyM1wiICh3aGV0aGVyIG9yIG5vdCBmaXJzdE5hbWUgaXMgYW4gb2JzZXJ2YWJsZS9jb21wdXRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWVzIGl0IGRvZXMuIFN1cHBseSBhIGNvbXB1dGVkIHByb3BlcnR5IHRoYXQgdW53cmFwcyBib3RoIHRoZSBvdXRlciAoYmluZGluZyBleHByZXNzaW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV2ZWwgb2Ygb2JzZXJ2YWJpbGl0eSwgYW5kIGFueSBpbm5lciAocmVzdWx0aW5nIG1vZGVsIHZhbHVlKSBsZXZlbCBvZiBvYnNlcnZhYmlsaXR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBtZWFucyB0aGUgY29tcG9uZW50IGRvZXNuJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBtdWx0aXBsZSB1bndyYXBwaW5nLiBJZiB0aGUgdmFsdWUgaXMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd3JpdGFibGUgb2JzZXJ2YWJsZSwgdGhlIGNvbXB1dGVkIHdpbGwgYWxzbyBiZSB3cml0YWJsZSBhbmQgcGFzcyB0aGUgdmFsdWUgb24gdG8gdGhlIG9ic2VydmFibGUuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZWFkJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHBhcmFtVmFsdWVDb21wdXRlZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3cml0ZSc6IGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZShwYXJhbVZhbHVlKSAmJiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbVZhbHVlQ29tcHV0ZWQoKSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEdpdmUgYWNjZXNzIHRvIHRoZSByYXcgY29tcHV0ZWRzLCBhcyBsb25nIGFzIHRoYXQgd291bGRuJ3Qgb3ZlcndyaXRlIGFueSBjdXN0b20gcGFyYW0gYWxzbyBjYWxsZWQgJyRyYXcnXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGluIGNhc2UgdGhlIGRldmVsb3BlciB3YW50cyB0byByZWFjdCB0byBvdXRlciAoYmluZGluZykgb2JzZXJ2YWJpbGl0eSBzZXBhcmF0ZWx5IGZyb20gaW5uZXJcbiAgICAgICAgICAgIC8vIChtb2RlbCB2YWx1ZSkgb2JzZXJ2YWJpbGl0eSwgb3IgaW4gY2FzZSB0aGUgbW9kZWwgdmFsdWUgb2JzZXJ2YWJsZSBoYXMgc3Vib2JzZXJ2YWJsZXMuXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnJHJhdycpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0WyckcmF3J10gPSByYXdQYXJhbUNvbXB1dGVkVmFsdWVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm9yIGNvbnNpc3RlbmN5LCBhYnNlbmNlIG9mIGEgXCJwYXJhbXNcIiBhdHRyaWJ1dGUgaXMgdHJlYXRlZCB0aGUgc2FtZSBhcyB0aGUgcHJlc2VuY2Ugb2ZcbiAgICAgICAgICAgIC8vIGFueSBlbXB0eSBvbmUuIE90aGVyd2lzZSBjb21wb25lbnQgdmlld21vZGVscyBuZWVkIHNwZWNpYWwgY29kZSB0byBjaGVjayB3aGV0aGVyIG9yIG5vdFxuICAgICAgICAgICAgLy8gJ3BhcmFtcycgb3IgJ3BhcmFtcy4kcmF3JyBpcyBudWxsL3VuZGVmaW5lZCBiZWZvcmUgcmVhZGluZyBzdWJwcm9wZXJ0aWVzLCB3aGljaCBpcyBhbm5veWluZy5cbiAgICAgICAgICAgIHJldHVybiB7ICckcmF3Jzoge30gfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ29tcGF0aWJpbGl0eSBjb2RlIGZvciBvbGRlciAocHJlLUhUTUw1KSBJRSBicm93c2Vyc1xuXG4gICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8IDkpIHtcbiAgICAgICAgLy8gV2hlbmV2ZXIgeW91IHByZXJlZ2lzdGVyIGEgY29tcG9uZW50LCBlbmFibGUgaXQgYXMgYSBjdXN0b20gZWxlbWVudCBpbiB0aGUgY3VycmVudCBkb2N1bWVudFxuICAgICAgICBrby5jb21wb25lbnRzWydyZWdpc3RlciddID0gKGZ1bmN0aW9uKG9yaWdpbmFsRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChjb21wb25lbnROYW1lKTsgLy8gQWxsb3dzIElFPDkgdG8gcGFyc2UgbWFya3VwIGNvbnRhaW5pbmcgdGhlIGN1c3RvbSBlbGVtZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoa28uY29tcG9uZW50c1sncmVnaXN0ZXInXSk7XG5cbiAgICAgICAgLy8gV2hlbmV2ZXIgeW91IGNyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50LCBlbmFibGUgYWxsIHByZXJlZ2lzdGVyZWQgY29tcG9uZW50IG5hbWVzIGFzIGN1c3RvbSBlbGVtZW50c1xuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCB0byBtYWtlIGlubmVyU2hpdi9qUXVlcnkgSFRNTCBwYXJzaW5nIGNvcnJlY3RseSBoYW5kbGUgdGhlIGN1c3RvbSBlbGVtZW50c1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50ID0gKGZ1bmN0aW9uKG9yaWdpbmFsRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RG9jRnJhZyA9IG9yaWdpbmFsRnVuY3Rpb24oKSxcbiAgICAgICAgICAgICAgICAgICAgYWxsQ29tcG9uZW50cyA9IGtvLmNvbXBvbmVudHMuX2FsbFJlZ2lzdGVyZWRDb21wb25lbnRzO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGNvbXBvbmVudE5hbWUgaW4gYWxsQ29tcG9uZW50cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsQ29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RG9jRnJhZy5jcmVhdGVFbGVtZW50KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdEb2NGcmFnO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCk7XG4gICAgfVxufSkoKTsoZnVuY3Rpb24odW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgY29tcG9uZW50TG9hZGluZ09wZXJhdGlvblVuaXF1ZUlkID0gMDtcblxuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1snY29tcG9uZW50J10gPSB7XG4gICAgICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgaWdub3JlZDEsIGlnbm9yZWQyLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRWaWV3TW9kZWwsXG4gICAgICAgICAgICAgICAgY3VycmVudExvYWRpbmdPcGVyYXRpb25JZCxcbiAgICAgICAgICAgICAgICBkaXNwb3NlQXNzb2NpYXRlZENvbXBvbmVudFZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRWaWV3TW9kZWxEaXNwb3NlID0gY3VycmVudFZpZXdNb2RlbCAmJiBjdXJyZW50Vmlld01vZGVsWydkaXNwb3NlJ107XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudFZpZXdNb2RlbERpc3Bvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWaWV3TW9kZWxEaXNwb3NlLmNhbGwoY3VycmVudFZpZXdNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZpZXdNb2RlbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFueSBpbi1mbGlnaHQgbG9hZGluZyBvcGVyYXRpb24gaXMgbm8gbG9uZ2VyIHJlbGV2YW50LCBzbyBtYWtlIHN1cmUgd2UgaWdub3JlIGl0cyBjb21wbGV0aW9uXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxDaGlsZE5vZGVzID0ga28udXRpbHMubWFrZUFycmF5KGtvLnZpcnR1YWxFbGVtZW50cy5jaGlsZE5vZGVzKGVsZW1lbnQpKTtcblxuICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBkaXNwb3NlQXNzb2NpYXRlZENvbXBvbmVudFZpZXdNb2RlbCk7XG5cbiAgICAgICAgICAgIGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudFBhcmFtcztcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnROYW1lID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZVsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50UGFyYW1zID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZVsncGFyYW1zJ10pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbXBvbmVudCBuYW1lIHNwZWNpZmllZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBsb2FkaW5nT3BlcmF0aW9uSWQgPSBjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkID0gKytjb21wb25lbnRMb2FkaW5nT3BlcmF0aW9uVW5pcXVlSWQ7XG4gICAgICAgICAgICAgICAga28uY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSwgZnVuY3Rpb24oY29tcG9uZW50RGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIG5vdCB0aGUgY3VycmVudCBsb2FkIG9wZXJhdGlvbiBmb3IgdGhpcyBlbGVtZW50LCBpZ25vcmUgaXQuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkICE9PSBsb2FkaW5nT3BlcmF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFuIHVwIHByZXZpb3VzIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIGRpc3Bvc2VBc3NvY2lhdGVkQ29tcG9uZW50Vmlld01vZGVsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5zdGFudGlhdGUgYW5kIGJpbmQgbmV3IGNvbXBvbmVudC4gSW1wbGljaXRseSB0aGlzIGNsZWFucyBhbnkgb2xkIERPTSBub2Rlcy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gY29tcG9uZW50IFxcJycgKyBjb21wb25lbnROYW1lICsgJ1xcJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsb25lVGVtcGxhdGVJbnRvRWxlbWVudChjb21wb25lbnROYW1lLCBjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudFZpZXdNb2RlbCA9IGNyZWF0ZVZpZXdNb2RlbChjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50LCBvcmlnaW5hbENoaWxkTm9kZXMsIGNvbXBvbmVudFBhcmFtcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEJpbmRpbmdDb250ZXh0ID0gYmluZGluZ0NvbnRleHRbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGNvbXBvbmVudFZpZXdNb2RlbCwgLyogZGF0YUl0ZW1BbGlhcyAqLyB1bmRlZmluZWQsIGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eFsnJGNvbXBvbmVudCddID0gY29tcG9uZW50Vmlld01vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eFsnJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMnXSA9IG9yaWdpbmFsQ2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Vmlld01vZGVsID0gY29tcG9uZW50Vmlld01vZGVsO1xuICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhjaGlsZEJpbmRpbmdDb250ZXh0LCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuXG4gICAgICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1snY29tcG9uZW50J10gPSB0cnVlO1xuXG4gICAgZnVuY3Rpb24gY2xvbmVUZW1wbGF0ZUludG9FbGVtZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gY29tcG9uZW50RGVmaW5pdGlvblsndGVtcGxhdGUnXTtcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnIGhhcyBubyB0ZW1wbGF0ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNsb25lZE5vZGVzQXJyYXkgPSBrby51dGlscy5jbG9uZU5vZGVzKHRlbXBsYXRlKTtcbiAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBjbG9uZWROb2Rlc0FycmF5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVWaWV3TW9kZWwoY29tcG9uZW50RGVmaW5pdGlvbiwgZWxlbWVudCwgb3JpZ2luYWxDaGlsZE5vZGVzLCBjb21wb25lbnRQYXJhbXMpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudFZpZXdNb2RlbEZhY3RvcnkgPSBjb21wb25lbnREZWZpbml0aW9uWydjcmVhdGVWaWV3TW9kZWwnXTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudFZpZXdNb2RlbEZhY3RvcnlcbiAgICAgICAgICAgID8gY29tcG9uZW50Vmlld01vZGVsRmFjdG9yeS5jYWxsKGNvbXBvbmVudERlZmluaXRpb24sIGNvbXBvbmVudFBhcmFtcywgeyAnZWxlbWVudCc6IGVsZW1lbnQsICd0ZW1wbGF0ZU5vZGVzJzogb3JpZ2luYWxDaGlsZE5vZGVzIH0pXG4gICAgICAgICAgICA6IGNvbXBvbmVudFBhcmFtczsgLy8gVGVtcGxhdGUtb25seSBjb21wb25lbnRcbiAgICB9XG5cbn0pKCk7XG52YXIgYXR0ckh0bWxUb0phdmFzY3JpcHRNYXAgPSB7ICdjbGFzcyc6ICdjbGFzc05hbWUnLCAnZm9yJzogJ2h0bWxGb3InIH07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2F0dHInXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpIHx8IHt9O1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHZhbHVlLCBmdW5jdGlvbihhdHRyTmFtZSwgYXR0clZhbHVlKSB7XG4gICAgICAgICAgICBhdHRyVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGF0dHJWYWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIFRvIGNvdmVyIGNhc2VzIGxpa2UgXCJhdHRyOiB7IGNoZWNrZWQ6c29tZVByb3AgfVwiLCB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGVudGlyZWx5XG4gICAgICAgICAgICAvLyB3aGVuIHNvbWVQcm9wIGlzIGEgXCJubyB2YWx1ZVwiLWxpa2UgdmFsdWUgKHN0cmljdGx5IG51bGwsIGZhbHNlLCBvciB1bmRlZmluZWQpXG4gICAgICAgICAgICAvLyAoYmVjYXVzZSB0aGUgYWJzZW5jZSBvZiB0aGUgXCJjaGVja2VkXCIgYXR0ciBpcyBob3cgdG8gbWFyayBhbiBlbGVtZW50IGFzIG5vdCBjaGVja2VkLCBldGMuKVxuICAgICAgICAgICAgdmFyIHRvUmVtb3ZlID0gKGF0dHJWYWx1ZSA9PT0gZmFsc2UpIHx8IChhdHRyVmFsdWUgPT09IG51bGwpIHx8IChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBpZiAodG9SZW1vdmUpXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICAvLyBJbiBJRSA8PSA3IGFuZCBJRTggUXVpcmtzIE1vZGUsIHlvdSBoYXZlIHRvIHVzZSB0aGUgSmF2YXNjcmlwdCBwcm9wZXJ0eSBuYW1lIGluc3RlYWQgb2YgdGhlXG4gICAgICAgICAgICAvLyBIVE1MIGF0dHJpYnV0ZSBuYW1lIGZvciBjZXJ0YWluIGF0dHJpYnV0ZXMuIElFOCBTdGFuZGFyZHMgTW9kZSBzdXBwb3J0cyB0aGUgY29ycmVjdCBiZWhhdmlvcixcbiAgICAgICAgICAgIC8vIGJ1dCBpbnN0ZWFkIG9mIGZpZ3VyaW5nIG91dCB0aGUgbW9kZSwgd2UnbGwganVzdCBzZXQgdGhlIGF0dHJpYnV0ZSB0aHJvdWdoIHRoZSBKYXZhc2NyaXB0XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBmb3IgSUUgPD0gOC5cbiAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPD0gOCAmJiBhdHRyTmFtZSBpbiBhdHRySHRtbFRvSmF2YXNjcmlwdE1hcCkge1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ckh0bWxUb0phdmFzY3JpcHRNYXBbYXR0ck5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0b1JlbW92ZSlcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFthdHRyTmFtZV0gPSBhdHRyVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0b1JlbW92ZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyZWF0IFwibmFtZVwiIHNwZWNpYWxseSAtIGFsdGhvdWdoIHlvdSBjYW4gdGhpbmsgb2YgaXQgYXMgYW4gYXR0cmlidXRlLCBpdCBhbHNvIG5lZWRzXG4gICAgICAgICAgICAvLyBzcGVjaWFsIGhhbmRsaW5nIG9uIG9sZGVyIHZlcnNpb25zIG9mIElFIChodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC8zMzMpXG4gICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgYmVpbmcgY2FzZS1zZW5zaXRpdmUgaGVyZSBiZWNhdXNlIFhIVE1MIHdvdWxkIHJlZ2FyZCBcIk5hbWVcIiBhcyBhIGRpZmZlcmVudCB0aGluZ1xuICAgICAgICAgICAgLy8gZW50aXJlbHksIGFuZCB0aGVyZSdzIG5vIHN0cm9uZyByZWFzb24gdG8gYWxsb3cgZm9yIHN1Y2ggY2FzaW5nIGluIEhUTUwuXG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0RWxlbWVudE5hbWUoZWxlbWVudCwgdG9SZW1vdmUgPyBcIlwiIDogYXR0clZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuKGZ1bmN0aW9uKCkge1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2NoZWNrZWQnXSA9IHtcbiAgICAnYWZ0ZXInOiBbJ3ZhbHVlJywgJ2F0dHInXSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICB2YXIgY2hlY2tlZFZhbHVlID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gVHJlYXQgXCJ2YWx1ZVwiIGxpa2UgXCJjaGVja2VkVmFsdWVcIiB3aGVuIGl0IGlzIGluY2x1ZGVkIHdpdGggXCJjaGVja2VkXCIgYmluZGluZ1xuICAgICAgICAgICAgaWYgKGFsbEJpbmRpbmdzWydoYXMnXSgnY2hlY2tlZFZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ2NoZWNrZWRWYWx1ZScpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZScpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsKCkge1xuICAgICAgICAgICAgLy8gVGhpcyB1cGRhdGVzIHRoZSBtb2RlbCB2YWx1ZSBmcm9tIHRoZSB2aWV3IHZhbHVlLlxuICAgICAgICAgICAgLy8gSXQgcnVucyBpbiByZXNwb25zZSB0byBET00gZXZlbnRzIChjbGljaykgYW5kIGNoYW5nZXMgaW4gY2hlY2tlZFZhbHVlLlxuICAgICAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IGVsZW1lbnQuY2hlY2tlZCxcbiAgICAgICAgICAgICAgICBlbGVtVmFsdWUgPSB1c2VDaGVja2VkVmFsdWUgPyBjaGVja2VkVmFsdWUoKSA6IGlzQ2hlY2tlZDtcblxuICAgICAgICAgICAgLy8gV2hlbiB3ZSdyZSBmaXJzdCBzZXR0aW5nIHVwIHRoaXMgY29tcHV0ZWQsIGRvbid0IGNoYW5nZSBhbnkgbW9kZWwgc3RhdGUuXG4gICAgICAgICAgICBpZiAoa28uY29tcHV0ZWRDb250ZXh0LmlzSW5pdGlhbCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSBjYW4gaWdub3JlIHVuY2hlY2tlZCByYWRpbyBidXR0b25zLCBiZWNhdXNlIHNvbWUgb3RoZXIgcmFkaW9cbiAgICAgICAgICAgIC8vIGJ1dHRvbiB3aWxsIGJlIGdldHRpbmcgY2hlY2tlZCwgYW5kIHRoYXQgb25lIGNhbiB0YWtlIGNhcmUgb2YgdXBkYXRpbmcgc3RhdGUuXG4gICAgICAgICAgICBpZiAoaXNSYWRpbyAmJiAhaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKHZhbHVlQWNjZXNzb3IpO1xuICAgICAgICAgICAgaWYgKHZhbHVlSXNBcnJheSkge1xuICAgICAgICAgICAgICAgIHZhciB3cml0YWJsZVZhbHVlID0gcmF3VmFsdWVJc05vbkFycmF5T2JzZXJ2YWJsZSA/IG1vZGVsVmFsdWUucGVlaygpIDogbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2xkRWxlbVZhbHVlICE9PSBlbGVtVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB3ZSdyZSByZXNwb25kaW5nIHRvIHRoZSBjaGVja2VkVmFsdWUgY2hhbmdpbmcsIGFuZCB0aGUgZWxlbWVudCBpc1xuICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50bHkgY2hlY2tlZCwgcmVwbGFjZSB0aGUgb2xkIGVsZW0gdmFsdWUgd2l0aCB0aGUgbmV3IGVsZW0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIG1vZGVsIGFycmF5LlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0od3JpdGFibGVWYWx1ZSwgZWxlbVZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbSh3cml0YWJsZVZhbHVlLCBvbGRFbGVtVmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG9sZEVsZW1WYWx1ZSA9IGVsZW1WYWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHdlJ3JlIHJlc3BvbmRpbmcgdG8gdGhlIHVzZXIgaGF2aW5nIGNoZWNrZWQvdW5jaGVja2VkIGEgY2hlY2tib3gsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZC9yZW1vdmUgdGhlIGVsZW1lbnQgdmFsdWUgdG8gdGhlIG1vZGVsIGFycmF5LlxuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0od3JpdGFibGVWYWx1ZSwgZWxlbVZhbHVlLCBpc0NoZWNrZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmF3VmFsdWVJc05vbkFycmF5T2JzZXJ2YWJsZSAmJiBrby5pc1dyaXRlYWJsZU9ic2VydmFibGUobW9kZWxWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxWYWx1ZSh3cml0YWJsZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkobW9kZWxWYWx1ZSwgYWxsQmluZGluZ3MsICdjaGVja2VkJywgZWxlbVZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVWaWV3KCkge1xuICAgICAgICAgICAgLy8gVGhpcyB1cGRhdGVzIHRoZSB2aWV3IHZhbHVlIGZyb20gdGhlIG1vZGVsIHZhbHVlLlxuICAgICAgICAgICAgLy8gSXQgcnVucyBpbiByZXNwb25zZSB0byBjaGFuZ2VzIGluIHRoZSBib3VuZCAoY2hlY2tlZCkgdmFsdWUuXG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlSXNBcnJheSkge1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBjaGVja2JveCBpcyBib3VuZCB0byBhbiBhcnJheSwgYmVpbmcgY2hlY2tlZCByZXByZXNlbnRzIGl0cyB2YWx1ZSBiZWluZyBwcmVzZW50IGluIHRoYXQgYXJyYXlcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSBrby51dGlscy5hcnJheUluZGV4T2YobW9kZWxWYWx1ZSwgY2hlY2tlZFZhbHVlKCkpID49IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQ2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGEgY2hlY2tib3ggaXMgYm91bmQgdG8gYW55IG90aGVyIHZhbHVlIChub3QgYW4gYXJyYXkpLCBiZWluZyBjaGVja2VkIHJlcHJlc2VudHMgdGhlIHZhbHVlIGJlaW5nIHRydWVpc2hcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSBtb2RlbFZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGb3IgcmFkaW8gYnV0dG9ucywgYmVpbmcgY2hlY2tlZCBtZWFucyB0aGF0IHRoZSByYWRpbyBidXR0b24ncyB2YWx1ZSBjb3JyZXNwb25kcyB0byB0aGUgbW9kZWwgdmFsdWVcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSAoY2hlY2tlZFZhbHVlKCkgPT09IG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpc0NoZWNrYm94ID0gZWxlbWVudC50eXBlID09IFwiY2hlY2tib3hcIixcbiAgICAgICAgICAgIGlzUmFkaW8gPSBlbGVtZW50LnR5cGUgPT0gXCJyYWRpb1wiO1xuXG4gICAgICAgIC8vIE9ubHkgYmluZCB0byBjaGVjayBib3hlcyBhbmQgcmFkaW8gYnV0dG9uc1xuICAgICAgICBpZiAoIWlzQ2hlY2tib3ggJiYgIWlzUmFkaW8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByYXdWYWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSxcbiAgICAgICAgICAgIHZhbHVlSXNBcnJheSA9IGlzQ2hlY2tib3ggJiYgKGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUocmF3VmFsdWUpIGluc3RhbmNlb2YgQXJyYXkpLFxuICAgICAgICAgICAgcmF3VmFsdWVJc05vbkFycmF5T2JzZXJ2YWJsZSA9ICEodmFsdWVJc0FycmF5ICYmIHJhd1ZhbHVlLnB1c2ggJiYgcmF3VmFsdWUuc3BsaWNlKSxcbiAgICAgICAgICAgIG9sZEVsZW1WYWx1ZSA9IHZhbHVlSXNBcnJheSA/IGNoZWNrZWRWYWx1ZSgpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdXNlQ2hlY2tlZFZhbHVlID0gaXNSYWRpbyB8fCB2YWx1ZUlzQXJyYXk7XG5cbiAgICAgICAgLy8gSUUgNiB3b24ndCBhbGxvdyByYWRpbyBidXR0b25zIHRvIGJlIHNlbGVjdGVkIHVubGVzcyB0aGV5IGhhdmUgYSBuYW1lXG4gICAgICAgIGlmIChpc1JhZGlvICYmICFlbGVtZW50Lm5hbWUpXG4gICAgICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXVsnaW5pdCddKGVsZW1lbnQsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9KTtcblxuICAgICAgICAvLyBTZXQgdXAgdHdvIGNvbXB1dGVkcyB0byB1cGRhdGUgdGhlIGJpbmRpbmc6XG5cbiAgICAgICAgLy8gVGhlIGZpcnN0IHJlc3BvbmRzIHRvIGNoYW5nZXMgaW4gdGhlIGNoZWNrZWRWYWx1ZSB2YWx1ZSBhbmQgdG8gZWxlbWVudCBjbGlja3NcbiAgICAgICAga28uY29tcHV0ZWQodXBkYXRlTW9kZWwsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImNsaWNrXCIsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICAvLyBUaGUgc2Vjb25kIHJlc3BvbmRzIHRvIGNoYW5nZXMgaW4gdGhlIG1vZGVsIHZhbHVlICh0aGUgb25lIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2hlY2tlZCBiaW5kaW5nKVxuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVWaWV3LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcblxuICAgICAgICByYXdWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snY2hlY2tlZCddID0gdHJ1ZTtcblxua28uYmluZGluZ0hhbmRsZXJzWydjaGVja2VkVmFsdWUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgZWxlbWVudC52YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICB9XG59O1xuXG59KSgpO3ZhciBjbGFzc2VzV3JpdHRlbkJ5QmluZGluZ0tleSA9ICdfX2tvX19jc3NWYWx1ZSc7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2NzcyddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24oY2xhc3NOYW1lLCBzaG91bGRIYXZlQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBzaG91bGRIYXZlQ2xhc3MgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHNob3VsZEhhdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSwgc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBrby51dGlscy5zdHJpbmdUcmltKFN0cmluZyh2YWx1ZSB8fCAnJykpOyAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgdHJ5IHRvIHN0b3JlIG9yIHNldCBhIG5vbi1zdHJpbmcgdmFsdWVcbiAgICAgICAgICAgIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyhlbGVtZW50LCBlbGVtZW50W2NsYXNzZXNXcml0dGVuQnlCaW5kaW5nS2V5XSwgZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudFtjbGFzc2VzV3JpdHRlbkJ5QmluZGluZ0tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyhlbGVtZW50LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWydlbmFibGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICBpZiAodmFsdWUgJiYgZWxlbWVudC5kaXNhYmxlZClcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIGVsc2UgaWYgKCghdmFsdWUpICYmICghZWxlbWVudC5kaXNhYmxlZCkpXG4gICAgICAgICAgICBlbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2Rpc2FibGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAga28uYmluZGluZ0hhbmRsZXJzWydlbmFibGUnXVsndXBkYXRlJ10oZWxlbWVudCwgZnVuY3Rpb24oKSB7IHJldHVybiAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpIH0pO1xuICAgIH1cbn07XG4vLyBGb3IgY2VydGFpbiBjb21tb24gZXZlbnRzIChjdXJyZW50bHkganVzdCAnY2xpY2snKSwgYWxsb3cgYSBzaW1wbGlmaWVkIGRhdGEtYmluZGluZyBzeW50YXhcbi8vIGUuZy4gY2xpY2s6aGFuZGxlciBpbnN0ZWFkIG9mIHRoZSB1c3VhbCBmdWxsLWxlbmd0aCBldmVudDp7Y2xpY2s6aGFuZGxlcn1cbmZ1bmN0aW9uIG1ha2VFdmVudEhhbmRsZXJTaG9ydGN1dChldmVudE5hbWUpIHtcbiAgICBrby5iaW5kaW5nSGFuZGxlcnNbZXZlbnROYW1lXSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlQWNjZXNzb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc3VsdFtldmVudE5hbWVdID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1snZXZlbnQnXVsnaW5pdCddLmNhbGwodGhpcywgZWxlbWVudCwgbmV3VmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2V2ZW50J10gPSB7XG4gICAgJ2luaXQnIDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHZhciBldmVudHNUb0hhbmRsZSA9IHZhbHVlQWNjZXNzb3IoKSB8fCB7fTtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChldmVudHNUb0hhbmRsZSwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50TmFtZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJSZXR1cm5WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJGdW5jdGlvbiA9IHZhbHVlQWNjZXNzb3IoKVtldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZXJGdW5jdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGFrZSBhbGwgdGhlIGV2ZW50IGFyZ3MsIGFuZCBwcmVmaXggd2l0aCB0aGUgdmlld21vZGVsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJnc0ZvckhhbmRsZXIgPSBrby51dGlscy5tYWtlQXJyYXkoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbCA9IGJpbmRpbmdDb250ZXh0WyckZGF0YSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc0ZvckhhbmRsZXIudW5zaGlmdCh2aWV3TW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlclJldHVyblZhbHVlID0gaGFuZGxlckZ1bmN0aW9uLmFwcGx5KHZpZXdNb2RlbCwgYXJnc0ZvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJSZXR1cm5WYWx1ZSAhPT0gdHJ1ZSkgeyAvLyBOb3JtYWxseSB3ZSB3YW50IHRvIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24uIERldmVsb3BlciBjYW4gb3ZlcnJpZGUgdGhpcyBiZSBleHBsaWNpdGx5IHJldHVybmluZyB0cnVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYnViYmxlID0gYWxsQmluZGluZ3MuZ2V0KGV2ZW50TmFtZSArICdCdWJibGUnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuLy8gXCJmb3JlYWNoOiBzb21lRXhwcmVzc2lvblwiIGlzIGVxdWl2YWxlbnQgdG8gXCJ0ZW1wbGF0ZTogeyBmb3JlYWNoOiBzb21lRXhwcmVzc2lvbiB9XCJcbi8vIFwiZm9yZWFjaDogeyBkYXRhOiBzb21lRXhwcmVzc2lvbiwgYWZ0ZXJBZGQ6IG15Zm4gfVwiIGlzIGVxdWl2YWxlbnQgdG8gXCJ0ZW1wbGF0ZTogeyBmb3JlYWNoOiBzb21lRXhwcmVzc2lvbiwgYWZ0ZXJBZGQ6IG15Zm4gfVwiXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2ZvcmVhY2gnXSA9IHtcbiAgICBtYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yOiBmdW5jdGlvbih2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gdmFsdWVBY2Nlc3NvcigpLFxuICAgICAgICAgICAgICAgIHVud3JhcHBlZFZhbHVlID0ga28udXRpbHMucGVla09ic2VydmFibGUobW9kZWxWYWx1ZSk7ICAgIC8vIFVud3JhcCB3aXRob3V0IHNldHRpbmcgYSBkZXBlbmRlbmN5IGhlcmVcblxuICAgICAgICAgICAgLy8gSWYgdW53cmFwcGVkVmFsdWUgaXMgdGhlIGFycmF5LCBwYXNzIGluIHRoZSB3cmFwcGVkIHZhbHVlIG9uIGl0cyBvd25cbiAgICAgICAgICAgIC8vIFRoZSB2YWx1ZSB3aWxsIGJlIHVud3JhcHBlZCBhbmQgdHJhY2tlZCB3aXRoaW4gdGhlIHRlbXBsYXRlIGJpbmRpbmdcbiAgICAgICAgICAgIC8vIChTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy81MjMpXG4gICAgICAgICAgICBpZiAoKCF1bndyYXBwZWRWYWx1ZSkgfHwgdHlwZW9mIHVud3JhcHBlZFZhbHVlLmxlbmd0aCA9PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIHJldHVybiB7ICdmb3JlYWNoJzogbW9kZWxWYWx1ZSwgJ3RlbXBsYXRlRW5naW5lJzoga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2UgfTtcblxuICAgICAgICAgICAgLy8gSWYgdW53cmFwcGVkVmFsdWUuZGF0YSBpcyB0aGUgYXJyYXksIHByZXNlcnZlIGFsbCByZWxldmFudCBvcHRpb25zIGFuZCB1bndyYXAgYWdhaW4gdmFsdWUgc28gd2UgZ2V0IHVwZGF0ZXNcbiAgICAgICAgICAgIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUobW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdmb3JlYWNoJzogdW53cmFwcGVkVmFsdWVbJ2RhdGEnXSxcbiAgICAgICAgICAgICAgICAnYXMnOiB1bndyYXBwZWRWYWx1ZVsnYXMnXSxcbiAgICAgICAgICAgICAgICAnaW5jbHVkZURlc3Ryb3llZCc6IHVud3JhcHBlZFZhbHVlWydpbmNsdWRlRGVzdHJveWVkJ10sXG4gICAgICAgICAgICAgICAgJ2FmdGVyQWRkJzogdW53cmFwcGVkVmFsdWVbJ2FmdGVyQWRkJ10sXG4gICAgICAgICAgICAgICAgJ2JlZm9yZVJlbW92ZSc6IHVud3JhcHBlZFZhbHVlWydiZWZvcmVSZW1vdmUnXSxcbiAgICAgICAgICAgICAgICAnYWZ0ZXJSZW5kZXInOiB1bndyYXBwZWRWYWx1ZVsnYWZ0ZXJSZW5kZXInXSxcbiAgICAgICAgICAgICAgICAnYmVmb3JlTW92ZSc6IHVud3JhcHBlZFZhbHVlWydiZWZvcmVNb3ZlJ10sXG4gICAgICAgICAgICAgICAgJ2FmdGVyTW92ZSc6IHVud3JhcHBlZFZhbHVlWydhZnRlck1vdmUnXSxcbiAgICAgICAgICAgICAgICAndGVtcGxhdGVFbmdpbmUnOiBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1sndGVtcGxhdGUnXVsnaW5pdCddKGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVyc1snZm9yZWFjaCddLm1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3NvcikpO1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnNbJ3RlbXBsYXRlJ11bJ3VwZGF0ZSddKGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVyc1snZm9yZWFjaCddLm1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3NvciksIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnNbJ2ZvcmVhY2gnXSA9IGZhbHNlOyAvLyBDYW4ndCByZXdyaXRlIGNvbnRyb2wgZmxvdyBiaW5kaW5nc1xua28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1snZm9yZWFjaCddID0gdHJ1ZTtcbnZhciBoYXNmb2N1c1VwZGF0aW5nUHJvcGVydHkgPSAnX19rb19oYXNmb2N1c1VwZGF0aW5nJztcbnZhciBoYXNmb2N1c0xhc3RWYWx1ZSA9ICdfX2tvX2hhc2ZvY3VzTGFzdFZhbHVlJztcbmtvLmJpbmRpbmdIYW5kbGVyc1snaGFzZm9jdXMnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBoYW5kbGVFbGVtZW50Rm9jdXNDaGFuZ2UgPSBmdW5jdGlvbihpc0ZvY3VzZWQpIHtcbiAgICAgICAgICAgIC8vIFdoZXJlIHBvc3NpYmxlLCBpZ25vcmUgd2hpY2ggZXZlbnQgd2FzIHJhaXNlZCBhbmQgZGV0ZXJtaW5lIGZvY3VzIHN0YXRlIHVzaW5nIGFjdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAvLyBhcyB0aGlzIGF2b2lkcyBwaGFudG9tIGZvY3VzL2JsdXIgZXZlbnRzIHJhaXNlZCB3aGVuIGNoYW5naW5nIHRhYnMgaW4gbW9kZXJuIGJyb3dzZXJzLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgbm90IGFsbCBLTy10YXJnZXRlZCBicm93c2VycyAoRmlyZWZveCAyKSBzdXBwb3J0IGFjdGl2ZUVsZW1lbnQuIEZvciB0aG9zZSBicm93c2VycyxcbiAgICAgICAgICAgIC8vIHByZXZlbnQgYSBsb3NzIG9mIGZvY3VzIHdoZW4gY2hhbmdpbmcgdGFicy93aW5kb3dzIGJ5IHNldHRpbmcgYSBmbGFnIHRoYXQgcHJldmVudHMgaGFzZm9jdXNcbiAgICAgICAgICAgIC8vIGZyb20gY2FsbGluZyAnYmx1cigpJyBvbiB0aGUgZWxlbWVudCB3aGVuIGl0IGxvc2VzIGZvY3VzLlxuICAgICAgICAgICAgLy8gRGlzY3Vzc2lvbiBhdCBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC8zNTJcbiAgICAgICAgICAgIGVsZW1lbnRbaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5XSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb3duZXJEb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgICAgICAgICBpZiAoXCJhY3RpdmVFbGVtZW50XCIgaW4gb3duZXJEb2MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IG93bmVyRG9jLmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElFOSB0aHJvd3MgaWYgeW91IGFjY2VzcyBhY3RpdmVFbGVtZW50IGR1cmluZyBwYWdlIGxvYWQgKHNlZSBpc3N1ZSAjNzAzKVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBvd25lckRvYy5ib2R5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc0ZvY3VzZWQgPSAoYWN0aXZlID09PSBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eShtb2RlbFZhbHVlLCBhbGxCaW5kaW5ncywgJ2hhc2ZvY3VzJywgaXNGb2N1c2VkLCB0cnVlKTtcblxuICAgICAgICAgICAgLy9jYWNoZSB0aGUgbGF0ZXN0IHZhbHVlLCBzbyB3ZSBjYW4gYXZvaWQgdW5uZWNlc3NhcmlseSBjYWxsaW5nIGZvY3VzL2JsdXIgaW4gdGhlIHVwZGF0ZSBmdW5jdGlvblxuICAgICAgICAgICAgZWxlbWVudFtoYXNmb2N1c0xhc3RWYWx1ZV0gPSBpc0ZvY3VzZWQ7XG4gICAgICAgICAgICBlbGVtZW50W2hhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eV0gPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGhhbmRsZUVsZW1lbnRGb2N1c0luID0gaGFuZGxlRWxlbWVudEZvY3VzQ2hhbmdlLmJpbmQobnVsbCwgdHJ1ZSk7XG4gICAgICAgIHZhciBoYW5kbGVFbGVtZW50Rm9jdXNPdXQgPSBoYW5kbGVFbGVtZW50Rm9jdXNDaGFuZ2UuYmluZChudWxsLCBmYWxzZSk7XG5cbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c1wiLCBoYW5kbGVFbGVtZW50Rm9jdXNJbik7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNpblwiLCBoYW5kbGVFbGVtZW50Rm9jdXNJbik7IC8vIEZvciBJRVxuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImJsdXJcIiwgIGhhbmRsZUVsZW1lbnRGb2N1c091dCk7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNvdXRcIiwgIGhhbmRsZUVsZW1lbnRGb2N1c091dCk7IC8vIEZvciBJRVxuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gISFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50W2hhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eV0gJiYgZWxlbWVudFtoYXNmb2N1c0xhc3RWYWx1ZV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA/IGVsZW1lbnQuZm9jdXMoKSA6IGVsZW1lbnQuYmx1cigpO1xuXG4gICAgICAgICAgICAvLyBJbiBJRSwgdGhlIGJsdXIgbWV0aG9kIGRvZXNuJ3QgYWx3YXlzIGNhdXNlIHRoZSBlbGVtZW50IHRvIGxvc2UgZm9jdXMgKGZvciBleGFtcGxlLCBpZiB0aGUgd2luZG93IGlzIG5vdCBpbiBmb2N1cykuXG4gICAgICAgICAgICAvLyBTZXR0aW5nIGZvY3VzIHRvIHRoZSBib2R5IGVsZW1lbnQgZG9lcyBzZWVtIHRvIGJlIHJlbGlhYmxlIGluIElFLCBidXQgc2hvdWxkIG9ubHkgYmUgdXNlZCBpZiB3ZSBrbm93IHRoYXQgdGhlIGN1cnJlbnRcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgd2FzIGZvY3VzZWQgYWxyZWFkeS5cbiAgICAgICAgICAgIGlmICghdmFsdWUgJiYgZWxlbWVudFtoYXNmb2N1c0xhc3RWYWx1ZV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYm9keS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgSUUsIHdoaWNoIGRvZXNuJ3QgcmVsaWFibHkgZmlyZSBcImZvY3VzXCIgb3IgXCJibHVyXCIgZXZlbnRzIHN5bmNocm9ub3VzbHlcbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGtvLnV0aWxzLnRyaWdnZXJFdmVudCwgbnVsbCwgW2VsZW1lbnQsIHZhbHVlID8gXCJmb2N1c2luXCIgOiBcImZvY3Vzb3V0XCJdKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydoYXNmb2N1cyddID0gdHJ1ZTtcblxua28uYmluZGluZ0hhbmRsZXJzWydoYXNGb2N1cyddID0ga28uYmluZGluZ0hhbmRsZXJzWydoYXNmb2N1cyddOyAvLyBNYWtlIFwiaGFzRm9jdXNcIiBhbiBhbGlhc1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snaGFzRm9jdXMnXSA9IHRydWU7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2h0bWwnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBQcmV2ZW50IGJpbmRpbmcgb24gdGhlIGR5bmFtaWNhbGx5LWluamVjdGVkIEhUTUwgKGFzIGRldmVsb3BlcnMgYXJlIHVubGlrZWx5IHRvIGV4cGVjdCB0aGF0LCBhbmQgaXQgaGFzIHNlY3VyaXR5IGltcGxpY2F0aW9ucylcbiAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIC8vIHNldEh0bWwgd2lsbCB1bndyYXAgdGhlIHZhbHVlIGlmIG5lZWRlZFxuICAgICAgICBrby51dGlscy5zZXRIdG1sKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgfVxufTtcbi8vIE1ha2VzIGEgYmluZGluZyBsaWtlIHdpdGggb3IgaWZcbmZ1bmN0aW9uIG1ha2VXaXRoSWZCaW5kaW5nKGJpbmRpbmdLZXksIGlzV2l0aCwgaXNOb3QsIG1ha2VDb250ZXh0Q2FsbGJhY2spIHtcbiAgICBrby5iaW5kaW5nSGFuZGxlcnNbYmluZGluZ0tleV0gPSB7XG4gICAgICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBkaWREaXNwbGF5T25MYXN0VXBkYXRlLFxuICAgICAgICAgICAgICAgIHNhdmVkTm9kZXM7XG4gICAgICAgICAgICBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmF3VmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksXG4gICAgICAgICAgICAgICAgICAgIGRhdGFWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUocmF3VmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0gIWlzTm90ICE9PSAhZGF0YVZhbHVlLCAvLyBlcXVpdmFsZW50IHRvIGlzTm90ID8gIWRhdGFWYWx1ZSA6ICEhZGF0YVZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3RSZW5kZXIgPSAhc2F2ZWROb2RlcyxcbiAgICAgICAgICAgICAgICAgICAgbmVlZHNSZWZyZXNoID0gaXNGaXJzdFJlbmRlciB8fCBpc1dpdGggfHwgKHNob3VsZERpc3BsYXkgIT09IGRpZERpc3BsYXlPbkxhc3RVcGRhdGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5lZWRzUmVmcmVzaCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIGEgY29weSBvZiB0aGUgaW5uZXIgbm9kZXMgb24gdGhlIGluaXRpYWwgdXBkYXRlLCBidXQgb25seSBpZiB3ZSBoYXZlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmlyc3RSZW5kZXIgJiYga28uY29tcHV0ZWRDb250ZXh0LmdldERlcGVuZGVuY2llc0NvdW50KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVkTm9kZXMgPSBrby51dGlscy5jbG9uZU5vZGVzKGtvLnZpcnR1YWxFbGVtZW50cy5jaGlsZE5vZGVzKGVsZW1lbnQpLCB0cnVlIC8qIHNob3VsZENsZWFuTm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4oZWxlbWVudCwga28udXRpbHMuY2xvbmVOb2RlcyhzYXZlZE5vZGVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhtYWtlQ29udGV4dENhbGxiYWNrID8gbWFrZUNvbnRleHRDYWxsYmFjayhiaW5kaW5nQ29udGV4dCwgcmF3VmFsdWUpIDogYmluZGluZ0NvbnRleHQsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRpZERpc3BsYXlPbkxhc3RVcGRhdGUgPSBzaG91bGREaXNwbGF5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1tiaW5kaW5nS2V5XSA9IGZhbHNlOyAvLyBDYW4ndCByZXdyaXRlIGNvbnRyb2wgZmxvdyBiaW5kaW5nc1xuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbYmluZGluZ0tleV0gPSB0cnVlO1xufVxuXG4vLyBDb25zdHJ1Y3QgdGhlIGFjdHVhbCBiaW5kaW5nIGhhbmRsZXJzXG5tYWtlV2l0aElmQmluZGluZygnaWYnKTtcbm1ha2VXaXRoSWZCaW5kaW5nKCdpZm5vdCcsIGZhbHNlIC8qIGlzV2l0aCAqLywgdHJ1ZSAvKiBpc05vdCAqLyk7XG5tYWtlV2l0aElmQmluZGluZygnd2l0aCcsIHRydWUgLyogaXNXaXRoICovLCBmYWxzZSAvKiBpc05vdCAqLyxcbiAgICBmdW5jdGlvbihiaW5kaW5nQ29udGV4dCwgZGF0YVZhbHVlKSB7XG4gICAgICAgIHJldHVybiBiaW5kaW5nQ29udGV4dC5jcmVhdGVTdGF0aWNDaGlsZENvbnRleHQoZGF0YVZhbHVlKTtcbiAgICB9XG4pO1xudmFyIGNhcHRpb25QbGFjZWhvbGRlciA9IHt9O1xua28uYmluZGluZ0hhbmRsZXJzWydvcHRpb25zJ10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgIT09IFwic2VsZWN0XCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcHRpb25zIGJpbmRpbmcgYXBwbGllcyBvbmx5IHRvIFNFTEVDVCBlbGVtZW50c1wiKTtcblxuICAgICAgICAvLyBSZW1vdmUgYWxsIGV4aXN0aW5nIDxvcHRpb24+cy5cbiAgICAgICAgd2hpbGUgKGVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgdGhlIGJpbmRpbmcgcHJvY2Vzc29yIGRvZXNuJ3QgdHJ5IHRvIGJpbmQgdGhlIG9wdGlvbnNcbiAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZE9wdGlvbnMoKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlGaWx0ZXIoZWxlbWVudC5vcHRpb25zLCBmdW5jdGlvbiAobm9kZSkgeyByZXR1cm4gbm9kZS5zZWxlY3RlZDsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0V2FzUHJldmlvdXNseUVtcHR5ID0gZWxlbWVudC5sZW5ndGggPT0gMCxcbiAgICAgICAgICAgIG11bHRpcGxlID0gZWxlbWVudC5tdWx0aXBsZSxcbiAgICAgICAgICAgIHByZXZpb3VzU2Nyb2xsVG9wID0gKCFzZWxlY3RXYXNQcmV2aW91c2x5RW1wdHkgJiYgbXVsdGlwbGUpID8gZWxlbWVudC5zY3JvbGxUb3AgOiBudWxsLFxuICAgICAgICAgICAgdW53cmFwcGVkQXJyYXkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSksXG4gICAgICAgICAgICB2YWx1ZUFsbG93VW5zZXQgPSBhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlQWxsb3dVbnNldCcpICYmIGFsbEJpbmRpbmdzWydoYXMnXSgndmFsdWUnKSxcbiAgICAgICAgICAgIGluY2x1ZGVEZXN0cm95ZWQgPSBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNJbmNsdWRlRGVzdHJveWVkJyksXG4gICAgICAgICAgICBhcnJheVRvRG9tTm9kZUNoaWxkcmVuT3B0aW9ucyA9IHt9LFxuICAgICAgICAgICAgY2FwdGlvblZhbHVlLFxuICAgICAgICAgICAgZmlsdGVyZWRBcnJheSxcbiAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSBbXTtcblxuICAgICAgICBpZiAoIXZhbHVlQWxsb3dVbnNldCkge1xuICAgICAgICAgICAgaWYgKG11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IGtvLnV0aWxzLmFycmF5TWFwKHNlbGVjdGVkT3B0aW9ucygpLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTZWxlY3RlZFZhbHVlcy5wdXNoKGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW53cmFwcGVkQXJyYXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdW53cmFwcGVkQXJyYXkubGVuZ3RoID09IFwidW5kZWZpbmVkXCIpIC8vIENvZXJjZSBzaW5nbGUgdmFsdWUgaW50byBhcnJheVxuICAgICAgICAgICAgICAgIHVud3JhcHBlZEFycmF5ID0gW3Vud3JhcHBlZEFycmF5XTtcblxuICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBhbnkgZW50cmllcyBtYXJrZWQgYXMgZGVzdHJveWVkXG4gICAgICAgICAgICBmaWx0ZXJlZEFycmF5ID0ga28udXRpbHMuYXJyYXlGaWx0ZXIodW53cmFwcGVkQXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZURlc3Ryb3llZCB8fCBpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCB8fCAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShpdGVtWydfZGVzdHJveSddKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJZiBjYXB0aW9uIGlzIGluY2x1ZGVkLCBhZGQgaXQgdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCdvcHRpb25zQ2FwdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgY2FwdGlvblZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNDYXB0aW9uJykpO1xuICAgICAgICAgICAgICAgIC8vIElmIGNhcHRpb24gdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQsIGRvbid0IHNob3cgYSBjYXB0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGNhcHRpb25WYWx1ZSAhPT0gbnVsbCAmJiBjYXB0aW9uVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEFycmF5LnVuc2hpZnQoY2FwdGlvblBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiBhIGZhbHN5IHZhbHVlIGlzIHByb3ZpZGVkIChlLmcuIG51bGwpLCB3ZSdsbCBzaW1wbHkgZW1wdHkgdGhlIHNlbGVjdCBlbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhcHBseVRvT2JqZWN0KG9iamVjdCwgcHJlZGljYXRlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBwcmVkaWNhdGVUeXBlID0gdHlwZW9mIHByZWRpY2F0ZTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGVUeXBlID09IFwiZnVuY3Rpb25cIikgICAgLy8gR2l2ZW4gYSBmdW5jdGlvbjsgcnVuIGl0IGFnYWluc3QgdGhlIGRhdGEgdmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZGljYXRlKG9iamVjdCk7XG4gICAgICAgICAgICBlbHNlIGlmIChwcmVkaWNhdGVUeXBlID09IFwic3RyaW5nXCIpIC8vIEdpdmVuIGEgc3RyaW5nOyB0cmVhdCBpdCBhcyBhIHByb3BlcnR5IG5hbWUgb24gdGhlIGRhdGEgdmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0W3ByZWRpY2F0ZV07XG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaXZlbiBubyBvcHRpb25zVGV4dCBhcmc7IHVzZSB0aGUgZGF0YSB2YWx1ZSBpdHNlbGZcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgY2FuIHJ1biBhdCB0d28gZGlmZmVyZW50IHRpbWVzOlxuICAgICAgICAvLyBUaGUgZmlyc3QgaXMgd2hlbiB0aGUgd2hvbGUgYXJyYXkgaXMgYmVpbmcgdXBkYXRlZCBkaXJlY3RseSBmcm9tIHRoaXMgYmluZGluZyBoYW5kbGVyLlxuICAgICAgICAvLyBUaGUgc2Vjb25kIGlzIHdoZW4gYW4gb2JzZXJ2YWJsZSB2YWx1ZSBmb3IgYSBzcGVjaWZpYyBhcnJheSBlbnRyeSBpcyB1cGRhdGVkLlxuICAgICAgICAvLyBvbGRPcHRpb25zIHdpbGwgYmUgZW1wdHkgaW4gdGhlIGZpcnN0IGNhc2UsIGJ1dCB3aWxsIGJlIGZpbGxlZCB3aXRoIHRoZSBwcmV2aW91c2x5IGdlbmVyYXRlZCBvcHRpb24gaW4gdGhlIHNlY29uZC5cbiAgICAgICAgdmFyIGl0ZW1VcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gb3B0aW9uRm9yQXJyYXlJdGVtKGFycmF5RW50cnksIGluZGV4LCBvbGRPcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob2xkT3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkVmFsdWVzID0gIXZhbHVlQWxsb3dVbnNldCAmJiBvbGRPcHRpb25zWzBdLnNlbGVjdGVkID8gWyBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShvbGRPcHRpb25zWzBdKSBdIDogW107XG4gICAgICAgICAgICAgICAgaXRlbVVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gZWxlbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBpZiAoYXJyYXlFbnRyeSA9PT0gY2FwdGlvblBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQob3B0aW9uLCBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNDYXB0aW9uJykpO1xuICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShvcHRpb24sIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFwcGx5IGEgdmFsdWUgdG8gdGhlIG9wdGlvbiBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvblZhbHVlID0gYXBwbHlUb09iamVjdChhcnJheUVudHJ5LCBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNWYWx1ZScpLCBhcnJheUVudHJ5KTtcbiAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUob3B0aW9uLCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG9wdGlvblZhbHVlKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBcHBseSBzb21lIHRleHQgdG8gdGhlIG9wdGlvbiBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvblRleHQgPSBhcHBseVRvT2JqZWN0KGFycmF5RW50cnksIGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc1RleHQnKSwgb3B0aW9uVmFsdWUpO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRleHRDb250ZW50KG9wdGlvbiwgb3B0aW9uVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW29wdGlvbl07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCeSB1c2luZyBhIGJlZm9yZVJlbW92ZSBjYWxsYmFjaywgd2UgZGVsYXkgdGhlIHJlbW92YWwgdW50aWwgYWZ0ZXIgbmV3IGl0ZW1zIGFyZSBhZGRlZC4gVGhpcyBmaXhlcyBhIHNlbGVjdGlvblxuICAgICAgICAvLyBwcm9ibGVtIGluIElFPD04IGFuZCBGaXJlZm94LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy8xMjA4XG4gICAgICAgIGFycmF5VG9Eb21Ob2RlQ2hpbGRyZW5PcHRpb25zWydiZWZvcmVSZW1vdmUnXSA9XG4gICAgICAgICAgICBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChvcHRpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBzZXRTZWxlY3Rpb25DYWxsYmFjayhhcnJheUVudHJ5LCBuZXdPcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoaXRlbVVwZGF0ZSAmJiB2YWx1ZUFsbG93VW5zZXQpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbW9kZWwgdmFsdWUgaXMgYXV0aG9yaXRhdGl2ZSwgc28gbWFrZSBzdXJlIGl0cyB2YWx1ZSBpcyB0aGUgb25lIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgLy8gVGhlcmUgaXMgbm8gbmVlZCB0byB1c2UgZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUgc2luY2Ugc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyBkb2VzIHNvIGFscmVhZHkuXG4gICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKGVsZW1lbnQsIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZScpKSwgdHJ1ZSAvKiBhbGxvd1Vuc2V0ICovKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBJRTYgZG9lc24ndCBsaWtlIHVzIHRvIGFzc2lnbiBzZWxlY3Rpb24gdG8gT1BUSU9OIG5vZGVzIGJlZm9yZSB0aGV5J3JlIGFkZGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgICAgICAgICAgICAvLyBUaGF0J3Mgd2h5IHdlIGZpcnN0IGFkZGVkIHRoZW0gd2l0aG91dCBzZWxlY3Rpb24uIE5vdyBpdCdzIHRpbWUgdG8gc2V0IHRoZSBzZWxlY3Rpb24uXG4gICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSBrby51dGlscy5hcnJheUluZGV4T2YocHJldmlvdXNTZWxlY3RlZFZhbHVlcywga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUobmV3T3B0aW9uc1swXSkpID49IDA7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0T3B0aW9uTm9kZVNlbGVjdGlvblN0YXRlKG5ld09wdGlvbnNbMF0sIGlzU2VsZWN0ZWQpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBvcHRpb24gd2FzIGNoYW5nZWQgZnJvbSBiZWluZyBzZWxlY3RlZCBkdXJpbmcgYSBzaW5nbGUtaXRlbSB1cGRhdGUsIG5vdGlmeSB0aGUgY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1VcGRhdGUgJiYgIWlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMudHJpZ2dlckV2ZW50LCBudWxsLCBbZWxlbWVudCwgXCJjaGFuZ2VcIl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYWxsYmFjayA9IHNldFNlbGVjdGlvbkNhbGxiYWNrO1xuICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCdvcHRpb25zQWZ0ZXJSZW5kZXInKSAmJiB0eXBlb2YgYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zQWZ0ZXJSZW5kZXInKSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oYXJyYXlFbnRyeSwgbmV3T3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHNldFNlbGVjdGlvbkNhbGxiYWNrKGFycmF5RW50cnksIG5ld09wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0FmdGVyUmVuZGVyJyksIG51bGwsIFtuZXdPcHRpb25zWzBdLCBhcnJheUVudHJ5ICE9PSBjYXB0aW9uUGxhY2Vob2xkZXIgPyBhcnJheUVudHJ5IDogdW5kZWZpbmVkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nKGVsZW1lbnQsIGZpbHRlcmVkQXJyYXksIG9wdGlvbkZvckFycmF5SXRlbSwgYXJyYXlUb0RvbU5vZGVDaGlsZHJlbk9wdGlvbnMsIGNhbGxiYWNrKTtcblxuICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodmFsdWVBbGxvd1Vuc2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIG1vZGVsIHZhbHVlIGlzIGF1dGhvcml0YXRpdmUsIHNvIG1ha2Ugc3VyZSBpdHMgdmFsdWUgaXMgdGhlIG9uZSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShlbGVtZW50LCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgndmFsdWUnKSksIHRydWUgLyogYWxsb3dVbnNldCAqLyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERldGVybWluZSBpZiB0aGUgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGFzIGEgcmVzdWx0IG9mIHVwZGF0aW5nIHRoZSBvcHRpb25zIGxpc3RcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uQ2hhbmdlZDtcbiAgICAgICAgICAgICAgICBpZiAobXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGEgbXVsdGlwbGUtc2VsZWN0IGJveCwgY29tcGFyZSB0aGUgbmV3IHNlbGVjdGlvbiBjb3VudCB0byB0aGUgcHJldmlvdXMgb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIEJ1dCBpZiBub3RoaW5nIHdhcyBzZWxlY3RlZCBiZWZvcmUsIHRoZSBzZWxlY3Rpb24gY2FuJ3QgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQgPSBwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCAmJiBzZWxlY3RlZE9wdGlvbnMoKS5sZW5ndGggPCBwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0IGJveCwgY29tcGFyZSB0aGUgY3VycmVudCB2YWx1ZSB0byB0aGUgcHJldmlvdXMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gQnV0IGlmIG5vdGhpbmcgd2FzIHNlbGVjdGVkIGJlZm9yZSBvciBub3RoaW5nIGlzIHNlbGVjdGVkIG5vdywganVzdCBsb29rIGZvciBhIGNoYW5nZSBpbiBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZCA9IChwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCAmJiBlbGVtZW50LnNlbGVjdGVkSW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdKSAhPT0gcHJldmlvdXNTZWxlY3RlZFZhbHVlc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoIHx8IGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgY29uc2lzdGVuY3kgYmV0d2VlbiBtb2RlbCB2YWx1ZSBhbmQgc2VsZWN0ZWQgb3B0aW9uLlxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBkcm9wZG93biB3YXMgY2hhbmdlZCBzbyB0aGF0IHNlbGVjdGlvbiBpcyBubyBsb25nZXIgdGhlIHNhbWUsXG4gICAgICAgICAgICAgICAgLy8gbm90aWZ5IHRoZSB2YWx1ZSBvciBzZWxlY3RlZE9wdGlvbnMgYmluZGluZy5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy50cmlnZ2VyRXZlbnQoZWxlbWVudCwgXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBJRSBidWdcbiAgICAgICAga28udXRpbHMuZW5zdXJlU2VsZWN0RWxlbWVudElzUmVuZGVyZWRDb3JyZWN0bHkoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHByZXZpb3VzU2Nyb2xsVG9wICYmIE1hdGguYWJzKHByZXZpb3VzU2Nyb2xsVG9wIC0gZWxlbWVudC5zY3JvbGxUb3ApID4gMjApXG4gICAgICAgICAgICBlbGVtZW50LnNjcm9sbFRvcCA9IHByZXZpb3VzU2Nyb2xsVG9wO1xuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ29wdGlvbnMnXS5vcHRpb25WYWx1ZURvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snc2VsZWN0ZWRPcHRpb25zJ10gPSB7XG4gICAgJ2FmdGVyJzogWydvcHRpb25zJywgJ2ZvcmVhY2gnXSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksIHZhbHVlVG9Xcml0ZSA9IFtdO1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvcHRpb25cIiksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zZWxlY3RlZClcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVUb1dyaXRlLnB1c2goa28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUobm9kZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KHZhbHVlLCBhbGxCaW5kaW5ncywgJ3NlbGVjdGVkT3B0aW9ucycsIHZhbHVlVG9Xcml0ZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGlmIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgIT0gXCJzZWxlY3RcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInZhbHVlcyBiaW5kaW5nIGFwcGxpZXMgb25seSB0byBTRUxFQ1QgZWxlbWVudHNcIik7XG5cbiAgICAgICAgdmFyIG5ld1ZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpLFxuICAgICAgICAgICAgcHJldmlvdXNTY3JvbGxUb3AgPSBlbGVtZW50LnNjcm9sbFRvcDtcblxuICAgICAgICBpZiAobmV3VmFsdWUgJiYgdHlwZW9mIG5ld1ZhbHVlLmxlbmd0aCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkID0ga28udXRpbHMuYXJyYXlJbmRleE9mKG5ld1ZhbHVlLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShub2RlKSkgPj0gMDtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zZWxlY3RlZCAhPSBpc1NlbGVjdGVkKSB7ICAgICAgLy8gVGhpcyBjaGVjayBwcmV2ZW50cyBmbGFzaGluZyBvZiB0aGUgc2VsZWN0IGVsZW1lbnQgaW4gSUVcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuc2V0T3B0aW9uTm9kZVNlbGVjdGlvblN0YXRlKG5vZGUsIGlzU2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zY3JvbGxUb3AgPSBwcmV2aW91c1Njcm9sbFRvcDtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snc2VsZWN0ZWRPcHRpb25zJ10gPSB0cnVlO1xua28uYmluZGluZ0hhbmRsZXJzWydzdHlsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSB8fCB7fSk7XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godmFsdWUsIGZ1bmN0aW9uKHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSkge1xuICAgICAgICAgICAgc3R5bGVWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoc3R5bGVWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChzdHlsZVZhbHVlID09PSBudWxsIHx8IHN0eWxlVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBzdHlsZVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8vIEVtcHR5IHN0cmluZyByZW1vdmVzIHRoZSB2YWx1ZSwgd2hlcmVhcyBudWxsL3VuZGVmaW5lZCBoYXZlIG5vIGVmZmVjdFxuICAgICAgICAgICAgICAgIHN0eWxlVmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3N0eWxlTmFtZV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWydzdWJtaXQnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlQWNjZXNzb3IoKSAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgdmFsdWUgZm9yIGEgc3VibWl0IGJpbmRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyUmV0dXJuVmFsdWU7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICB0cnkgeyBoYW5kbGVyUmV0dXJuVmFsdWUgPSB2YWx1ZS5jYWxsKGJpbmRpbmdDb250ZXh0WyckZGF0YSddLCBlbGVtZW50KTsgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJSZXR1cm5WYWx1ZSAhPT0gdHJ1ZSkgeyAvLyBOb3JtYWxseSB3ZSB3YW50IHRvIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24uIERldmVsb3BlciBjYW4gb3ZlcnJpZGUgdGhpcyBiZSBleHBsaWNpdGx5IHJldHVybmluZyB0cnVlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFByZXZlbnQgYmluZGluZyBvbiB0aGUgZHluYW1pY2FsbHktaW5qZWN0ZWQgdGV4dCBub2RlIChhcyBkZXZlbG9wZXJzIGFyZSB1bmxpa2VseSB0byBleHBlY3QgdGhhdCwgYW5kIGl0IGhhcyBzZWN1cml0eSBpbXBsaWNhdGlvbnMpLlxuICAgICAgICAvLyBJdCBzaG91bGQgYWxzbyBtYWtlIHRoaW5ncyBmYXN0ZXIsIGFzIHdlIG5vIGxvbmdlciBoYXZlIHRvIGNvbnNpZGVyIHdoZXRoZXIgdGhlIHRleHQgbm9kZSBtaWdodCBiZSBiaW5kYWJsZS5cbiAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGtvLnV0aWxzLnNldFRleHRDb250ZW50KGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgfVxufTtcbmtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbJ3RleHQnXSA9IHRydWU7XG4oZnVuY3Rpb24gKCkge1xuXG5pZiAod2luZG93ICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICB2YXIgcGFyc2VWZXJzaW9uID0gZnVuY3Rpb24gKG1hdGNoZXMpIHtcbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG1hdGNoZXNbMV0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIERldGVjdCB2YXJpb3VzIGJyb3dzZXIgdmVyc2lvbnMgYmVjYXVzZSBzb21lIG9sZCB2ZXJzaW9ucyBkb24ndCBmdWxseSBzdXBwb3J0IHRoZSAnaW5wdXQnIGV2ZW50XG4gICAgdmFyIG9wZXJhVmVyc2lvbiA9IHdpbmRvdy5vcGVyYSAmJiB3aW5kb3cub3BlcmEudmVyc2lvbiAmJiBwYXJzZUludCh3aW5kb3cub3BlcmEudmVyc2lvbigpKSxcbiAgICAgICAgdXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAgIHNhZmFyaVZlcnNpb24gPSBwYXJzZVZlcnNpb24odXNlckFnZW50Lm1hdGNoKC9eKD86KD8hY2hyb21lKS4pKnZlcnNpb25cXC8oW14gXSopIHNhZmFyaS9pKSksXG4gICAgICAgIGZpcmVmb3hWZXJzaW9uID0gcGFyc2VWZXJzaW9uKHVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveFxcLyhbXiBdKikvKSk7XG59XG5cbi8vIElFIDggYW5kIDkgaGF2ZSBidWdzIHRoYXQgcHJldmVudCB0aGUgbm9ybWFsIGV2ZW50cyBmcm9tIGZpcmluZyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuLy8gQnV0IGl0IGRvZXMgZmlyZSB0aGUgJ3NlbGVjdGlvbmNoYW5nZScgZXZlbnQgb24gbWFueSBvZiB0aG9zZSwgcHJlc3VtYWJseSBiZWNhdXNlIHRoZVxuLy8gY3Vyc29yIGlzIG1vdmluZyBhbmQgdGhhdCBjb3VudHMgYXMgdGhlIHNlbGVjdGlvbiBjaGFuZ2luZy4gVGhlICdzZWxlY3Rpb25jaGFuZ2UnIGV2ZW50IGlzXG4vLyBmaXJlZCBhdCB0aGUgZG9jdW1lbnQgbGV2ZWwgb25seSBhbmQgZG9lc24ndCBkaXJlY3RseSBpbmRpY2F0ZSB3aGljaCBlbGVtZW50IGNoYW5nZWQuIFdlXG4vLyBzZXQgdXAganVzdCBvbmUgZXZlbnQgaGFuZGxlciBmb3IgdGhlIGRvY3VtZW50IGFuZCB1c2UgJ2FjdGl2ZUVsZW1lbnQnIHRvIGRldGVybWluZSB3aGljaFxuLy8gZWxlbWVudCB3YXMgY2hhbmdlZC5cbmlmIChrby51dGlscy5pZVZlcnNpb24gPCAxMCkge1xuICAgIHZhciBzZWxlY3Rpb25DaGFuZ2VSZWdpc3RlcmVkTmFtZSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpLFxuICAgICAgICBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyTmFtZSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIHZhciBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuYWN0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIGhhbmRsZXIgPSB0YXJnZXQgJiYga28udXRpbHMuZG9tRGF0YS5nZXQodGFyZ2V0LCBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyTmFtZSk7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlZ2lzdGVyRm9yU2VsZWN0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgaGFuZGxlcikge1xuICAgICAgICB2YXIgb3duZXJEb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgICAgIGlmICgha28udXRpbHMuZG9tRGF0YS5nZXQob3duZXJEb2MsIHNlbGVjdGlvbkNoYW5nZVJlZ2lzdGVyZWROYW1lKSkge1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQob3duZXJEb2MsIHNlbGVjdGlvbkNoYW5nZVJlZ2lzdGVyZWROYW1lLCB0cnVlKTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKG93bmVyRG9jLCAnc2VsZWN0aW9uY2hhbmdlJywgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlck5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dElucHV0J10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcblxuICAgICAgICB2YXIgcHJldmlvdXNFbGVtZW50VmFsdWUgPSBlbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgdGltZW91dEhhbmRsZSxcbiAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50O1xuXG4gICAgICAgIHZhciB1cGRhdGVNb2RlbCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSB0aW1lb3V0SGFuZGxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudFZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0VsZW1lbnRWYWx1ZSAhPT0gZWxlbWVudFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvdmlkZSBhIHdheSBmb3IgdGVzdHMgdG8ga25vdyBleGFjdGx5IHdoaWNoIGV2ZW50IHdhcyBwcm9jZXNzZWRcbiAgICAgICAgICAgICAgICBpZiAoREVCVUcgJiYgZXZlbnQpIGVsZW1lbnRbJ19rb190ZXh0SW5wdXRQcm9jZXNzZWRFdmVudCddID0gZXZlbnQudHlwZTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0VsZW1lbnRWYWx1ZSA9IGVsZW1lbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KHZhbHVlQWNjZXNzb3IoKSwgYWxsQmluZGluZ3MsICd0ZXh0SW5wdXQnLCBlbGVtZW50VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBkZWZlclVwZGF0ZU1vZGVsID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXRIYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgdmFyaWFibGUgaXMgc2V0ICpvbmx5KiBkdXJpbmcgdGhlIGJyaWVmIGdhcCBiZXR3ZWVuIGFuXG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgZmlyaW5nIGFuZCB0aGUgdXBkYXRlTW9kZWwgZnVuY3Rpb24gcnVubmluZy4gVGhpcyBhbGxvd3MgdXMgdG8gaWdub3JlIG1vZGVsXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGF0IGFyZSBmcm9tIHRoZSBwcmV2aW91cyBzdGF0ZSBvZiB0aGUgZWxlbWVudCwgdXN1YWxseSBkdWUgdG8gdGVjaG5pcXVlc1xuICAgICAgICAgICAgICAgIC8vIHN1Y2ggYXMgcmF0ZUxpbWl0LiBTdWNoIHVwZGF0ZXMsIGlmIG5vdCBpZ25vcmVkLCBjYW4gY2F1c2Uga2V5c3Ryb2tlcyB0byBiZSBsb3N0LlxuICAgICAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IERFQlVHID8gdXBkYXRlTW9kZWwuYmluZChlbGVtZW50LCB7dHlwZTogZXZlbnQudHlwZX0pIDogdXBkYXRlTW9kZWw7XG4gICAgICAgICAgICAgICAgdGltZW91dEhhbmRsZSA9IGtvLnV0aWxzLnNldFRpbWVvdXQoaGFuZGxlciwgNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSUU5IHdpbGwgbWVzcyB1cCB0aGUgRE9NIGlmIHlvdSBoYW5kbGUgZXZlbnRzIHN5bmNocm9ub3VzbHkgd2hpY2ggcmVzdWx0cyBpbiBET00gY2hhbmdlcyAoc3VjaCBhcyBvdGhlciBiaW5kaW5ncyk7XG4gICAgICAgIC8vIHNvIHdlJ2xsIG1ha2Ugc3VyZSBhbGwgdXBkYXRlcyBhcmUgYXN5bmNocm9ub3VzXG4gICAgICAgIHZhciBpZVVwZGF0ZU1vZGVsID0ga28udXRpbHMuaWVWZXJzaW9uID09IDkgPyBkZWZlclVwZGF0ZU1vZGVsIDogdXBkYXRlTW9kZWw7XG5cbiAgICAgICAgdmFyIHVwZGF0ZVZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcblxuICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgPT09IG51bGwgfHwgbW9kZWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbW9kZWxWYWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgIT09IHVuZGVmaW5lZCAmJiBtb2RlbFZhbHVlID09PSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCkge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRpbWVvdXQodXBkYXRlVmlldywgNCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGVsZW1lbnQgb25seSBpZiB0aGUgZWxlbWVudCBhbmQgbW9kZWwgYXJlIGRpZmZlcmVudC4gT24gc29tZSBicm93c2VycywgdXBkYXRpbmcgdGhlIHZhbHVlXG4gICAgICAgICAgICAvLyB3aWxsIG1vdmUgdGhlIGN1cnNvciB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCwgd2hpY2ggd291bGQgYmUgYmFkIHdoaWxlIHRoZSB1c2VyIGlzIHR5cGluZy5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LnZhbHVlICE9PSBtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50VmFsdWUgPSBtb2RlbFZhbHVlOyAgLy8gTWFrZSBzdXJlIHdlIGlnbm9yZSBldmVudHMgKHByb3BlcnR5Y2hhbmdlKSB0aGF0IHJlc3VsdCBmcm9tIHVwZGF0aW5nIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBtb2RlbFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBvbkV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKERFQlVHICYmIGtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dElucHV0J11bJ19mb3JjZVVwZGF0ZU9uJ10pIHtcbiAgICAgICAgICAgIC8vIFByb3ZpZGUgYSB3YXkgZm9yIHRlc3RzIHRvIHNwZWNpZnkgZXhhY3RseSB3aGljaCBldmVudHMgYXJlIGJvdW5kXG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goa28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0SW5wdXQnXVsnX2ZvcmNlVXBkYXRlT24nXSwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZS5zbGljZSgwLDUpID09ICdhZnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudChldmVudE5hbWUuc2xpY2UoNSksIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoZXZlbnROYW1lLCB1cGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA8PSA4IGRvZXNuJ3Qgc3VwcG9ydCB0aGUgJ2lucHV0JyBldmVudCwgYnV0IGRvZXMgaW5jbHVkZSAncHJvcGVydHljaGFuZ2UnIHRoYXQgZmlyZXMgd2hlbmV2ZXJcbiAgICAgICAgICAgICAgICAvLyBhbnkgcHJvcGVydHkgb2YgYW4gZWxlbWVudCBjaGFuZ2VzLiBVbmxpa2UgJ2lucHV0JywgaXQgYWxzbyBmaXJlcyBpZiBhIHByb3BlcnR5IGlzIGNoYW5nZWQgZnJvbSBKYXZhU2NyaXB0IGNvZGUsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHRoYXQncyBhbiBhY2NlcHRhYmxlIGNvbXByb21pc2UgZm9yIHRoaXMgYmluZGluZy4gSUUgOSBkb2VzIHN1cHBvcnQgJ2lucHV0JywgYnV0IHNpbmNlIGl0IGRvZXNuJ3QgZmlyZSBpdFxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdXNpbmcgYXV0b2NvbXBsZXRlLCB3ZSdsbCB1c2UgJ3Byb3BlcnR5Y2hhbmdlJyBmb3IgaXQgYWxzby5cbiAgICAgICAgICAgICAgICBvbkV2ZW50KCdwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wcm9wZXJ0eU5hbWUgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGllVXBkYXRlTW9kZWwoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uID09IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSUUgOCBoYXMgYSBidWcgd2hlcmUgaXQgZmFpbHMgdG8gZmlyZSAncHJvcGVydHljaGFuZ2UnIG9uIHRoZSBmaXJzdCB1cGRhdGUgZm9sbG93aW5nIGEgdmFsdWUgY2hhbmdlIGZyb21cbiAgICAgICAgICAgICAgICAgICAgLy8gSmF2YVNjcmlwdCBjb2RlLiBJdCBhbHNvIGRvZXNuJ3QgZmlyZSBpZiB5b3UgY2xlYXIgdGhlIGVudGlyZSB2YWx1ZS4gVG8gZml4IHRoaXMsIHdlIGJpbmQgdG8gdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgICAgICAgICAvLyBldmVudHMgdG9vLlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXl1cCcsIHVwZGF0ZU1vZGVsKTsgICAgICAvLyBBIHNpbmdsZSBrZXlzdG9rZVxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXlkb3duJywgdXBkYXRlTW9kZWwpOyAgICAvLyBUaGUgZmlyc3QgY2hhcmFjdGVyIHdoZW4gYSBrZXkgaXMgaGVsZCBkb3duXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPj0gOCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA5IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCB3aGVuIGRlbGV0aW5nIHRleHQsIGluY2x1ZGluZyB1c2luZ1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYmFja3NwYWNlLCBkZWxldGUsIG9yIGN0cmwteCBrZXlzLCBjbGlja2luZyB0aGUgJ3gnIHRvIGNsZWFyIHRoZSBpbnB1dCwgZHJhZ2dpbmcgdGV4dFxuICAgICAgICAgICAgICAgICAgICAvLyBvdXQgb2YgdGhlIGZpZWxkLCBhbmQgY3V0dGluZyBvciBkZWxldGluZyB0ZXh0IHVzaW5nIHRoZSBjb250ZXh0IG1lbnUuICdzZWxlY3Rpb25jaGFuZ2UnXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiBkZXRlY3QgYWxsIG9mIHRob3NlIGV4Y2VwdCBkcmFnZ2luZyB0ZXh0IG91dCBvZiB0aGUgZmllbGQsIGZvciB3aGljaCB3ZSB1c2UgJ2RyYWdlbmQnLlxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVzZSBhcmUgYWxzbyBuZWVkZWQgaW4gSUU4IGJlY2F1c2Ugb2YgdGhlIGJ1ZyBkZXNjcmliZWQgYWJvdmUuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRm9yU2VsZWN0aW9uQ2hhbmdlRXZlbnQoZWxlbWVudCwgaWVVcGRhdGVNb2RlbCk7ICAvLyAnc2VsZWN0aW9uY2hhbmdlJyBjb3ZlcnMgY3V0LCBwYXN0ZSwgZHJvcCwgZGVsZXRlLCBldGMuXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2RyYWdlbmQnLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFsbCBvdGhlciBzdXBwb3J0ZWQgYnJvd3NlcnMgc3VwcG9ydCB0aGUgJ2lucHV0JyBldmVudCwgd2hpY2ggZmlyZXMgd2hlbmV2ZXIgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgaXMgY2hhbmdlZFxuICAgICAgICAgICAgICAgIC8vIHRocm91Z2ggdGhlIHVzZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2lucHV0JywgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNhZmFyaVZlcnNpb24gPCA1ICYmIGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSA8NSBkb2Vzbid0IGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgZm9yIDx0ZXh0YXJlYT4gZWxlbWVudHMgKGl0IGRvZXMgZmlyZSAndGV4dElucHV0J1xuICAgICAgICAgICAgICAgICAgICAvLyBidXQgb25seSB3aGVuIHR5cGluZykuIFNvIHdlJ2xsIGp1c3QgY2F0Y2ggYXMgbXVjaCBhcyB3ZSBjYW4gd2l0aCBrZXlkb3duLCBjdXQsIGFuZCBwYXN0ZS5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgna2V5ZG93bicsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdwYXN0ZScsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdjdXQnLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhVmVyc2lvbiA8IDExKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIDEwIGRvZXNuJ3QgYWx3YXlzIGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgZm9yIGN1dCwgcGFzdGUsIHVuZG8gJiBkcm9wIG9wZXJhdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGNhbiB0cnkgdG8gY2F0Y2ggc29tZSBvZiB0aG9zZSB1c2luZyAna2V5ZG93bicuXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleWRvd24nLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpcmVmb3hWZXJzaW9uIDwgNC4wKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggPD0gMy42IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCB3aGVuIHRleHQgaXMgZmlsbGVkIGluIHRocm91Z2ggYXV0b2NvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ0RPTUF1dG9Db21wbGV0ZScsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IDw9My41IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCB3aGVuIHRleHQgaXMgZHJvcHBlZCBpbnRvIHRoZSBpbnB1dC5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnZHJhZ2Ryb3AnLCB1cGRhdGVNb2RlbCk7ICAgICAgIC8vIDwzLjVcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnZHJvcCcsIHVwZGF0ZU1vZGVsKTsgICAgICAgICAgIC8vIDMuNVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmQgdG8gdGhlIGNoYW5nZSBldmVudCBzbyB0aGF0IHdlIGNhbiBjYXRjaCBwcm9ncmFtbWF0aWMgdXBkYXRlcyBvZiB0aGUgdmFsdWUgdGhhdCBmaXJlIHRoaXMgZXZlbnQuXG4gICAgICAgIG9uRXZlbnQoJ2NoYW5nZScsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVWaWV3LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1sndGV4dElucHV0J10gPSB0cnVlO1xuXG4vLyB0ZXh0aW5wdXQgaXMgYW4gYWxpYXMgZm9yIHRleHRJbnB1dFxua28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0aW5wdXQnXSA9IHtcbiAgICAvLyBwcmVwcm9jZXNzIGlzIHRoZSBvbmx5IHdheSB0byBzZXQgdXAgYSBmdWxsIGFsaWFzXG4gICAgJ3ByZXByb2Nlc3MnOiBmdW5jdGlvbiAodmFsdWUsIG5hbWUsIGFkZEJpbmRpbmcpIHtcbiAgICAgICAgYWRkQmluZGluZygndGV4dElucHV0JywgdmFsdWUpO1xuICAgIH1cbn07XG5cbn0pKCk7a28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBpZiAodmFsdWVBY2Nlc3NvcigpKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IFwia29fdW5pcXVlX1wiICsgKCsra28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ10uY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnNldEVsZW1lbnROYW1lKGVsZW1lbnQsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndW5pcXVlTmFtZSddLmN1cnJlbnRJbmRleCA9IDA7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3ZhbHVlJ10gPSB7XG4gICAgJ2FmdGVyJzogWydvcHRpb25zJywgJ2ZvcmVhY2gnXSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICAvLyBJZiB0aGUgdmFsdWUgYmluZGluZyBpcyBwbGFjZWQgb24gYSByYWRpby9jaGVja2JveCwgdGhlbiBqdXN0IHBhc3MgdGhyb3VnaCB0byBjaGVja2VkVmFsdWUgYW5kIHF1aXRcbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaW5wdXRcIiAmJiAoZWxlbWVudC50eXBlID09IFwiY2hlY2tib3hcIiB8fCBlbGVtZW50LnR5cGUgPT0gXCJyYWRpb1wiKSkge1xuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlKGVsZW1lbnQsIHsgJ2NoZWNrZWRWYWx1ZSc6IHZhbHVlQWNjZXNzb3IgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgY2F0Y2ggXCJjaGFuZ2VcIiBldmVudDsgcG9zc2libHkgb3RoZXIgZXZlbnRzIHRvbyBpZiBhc2tlZFxuICAgICAgICB2YXIgZXZlbnRzVG9DYXRjaCA9IFtcImNoYW5nZVwiXTtcbiAgICAgICAgdmFyIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2ggPSBhbGxCaW5kaW5ncy5nZXQoXCJ2YWx1ZVVwZGF0ZVwiKTtcbiAgICAgICAgdmFyIHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IG51bGw7XG5cbiAgICAgICAgaWYgKHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCA9PSBcInN0cmluZ1wiKSAvLyBBbGxvdyBib3RoIGluZGl2aWR1YWwgZXZlbnQgbmFtZXMsIGFuZCBhcnJheXMgb2YgZXZlbnQgbmFtZXNcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRFdmVudHNUb0NhdGNoID0gW3JlcXVlc3RlZEV2ZW50c1RvQ2F0Y2hdO1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKGV2ZW50c1RvQ2F0Y2gsIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2gpO1xuICAgICAgICAgICAgZXZlbnRzVG9DYXRjaCA9IGtvLnV0aWxzLmFycmF5R2V0RGlzdGluY3RWYWx1ZXMoZXZlbnRzVG9DYXRjaCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWVVcGRhdGVIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IG51bGw7XG4gICAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudFZhbHVlID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudCk7XG4gICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KG1vZGVsVmFsdWUsIGFsbEJpbmRpbmdzLCAndmFsdWUnLCBlbGVtZW50VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xMjJcbiAgICAgICAgLy8gSUUgZG9lc24ndCBmaXJlIFwiY2hhbmdlXCIgZXZlbnRzIG9uIHRleHRib3hlcyBpZiB0aGUgdXNlciBzZWxlY3RzIGEgdmFsdWUgZnJvbSBpdHMgYXV0b2NvbXBsZXRlIGxpc3RcbiAgICAgICAgdmFyIGllQXV0b0NvbXBsZXRlSGFja05lZWRlZCA9IGtvLnV0aWxzLmllVmVyc2lvbiAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImlucHV0XCIgJiYgZWxlbWVudC50eXBlID09IFwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBlbGVtZW50LmF1dG9jb21wbGV0ZSAhPSBcIm9mZlwiICYmICghZWxlbWVudC5mb3JtIHx8IGVsZW1lbnQuZm9ybS5hdXRvY29tcGxldGUgIT0gXCJvZmZcIik7XG4gICAgICAgIGlmIChpZUF1dG9Db21wbGV0ZUhhY2tOZWVkZWQgJiYga28udXRpbHMuYXJyYXlJbmRleE9mKGV2ZW50c1RvQ2F0Y2gsIFwicHJvcGVydHljaGFuZ2VcIikgPT0gLTEpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwicHJvcGVydHljaGFuZ2VcIiwgZnVuY3Rpb24gKCkgeyBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IHRydWUgfSk7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImZvY3VzXCIsIGZ1bmN0aW9uICgpIHsgcHJvcGVydHlDaGFuZ2VkRmlyZWQgPSBmYWxzZSB9KTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiYmx1clwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlDaGFuZ2VkRmlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVVcGRhdGVIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goZXZlbnRzVG9DYXRjaCwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAvLyBUaGUgc3ludGF4IFwiYWZ0ZXI8ZXZlbnRuYW1lPlwiIG1lYW5zIFwicnVuIHRoZSBoYW5kbGVyIGFzeW5jaHJvbm91c2x5IGFmdGVyIHRoZSBldmVudFwiXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCwgZm9yIGV4YW1wbGUsIHRvIGNhdGNoIFwia2V5ZG93blwiIGV2ZW50cyBhZnRlciB0aGUgYnJvd3NlciBoYXMgdXBkYXRlZCB0aGUgY29udHJvbFxuICAgICAgICAgICAgLy8gKG90aGVyd2lzZSwga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUodGhpcykgd2lsbCByZWNlaXZlIHRoZSBjb250cm9sJ3MgdmFsdWUgKmJlZm9yZSogdGhlIGtleSBldmVudClcbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gdmFsdWVVcGRhdGVIYW5kbGVyO1xuICAgICAgICAgICAgaWYgKGtvLnV0aWxzLnN0cmluZ1N0YXJ0c1dpdGgoZXZlbnROYW1lLCBcImFmdGVyXCIpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgdmFyaWFibGUgaXMgbm9uLW51bGwgKm9ubHkqIGR1cmluZyB0aGUgYnJpZWYgZ2FwIGJldHdlZW5cbiAgICAgICAgICAgICAgICAgICAgLy8gYSBrZXlYIGV2ZW50IGZpcmluZyBhbmQgdGhlIHZhbHVlVXBkYXRlSGFuZGxlciBydW5uaW5nLCB3aGljaCBpcyBzY2hlZHVsZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF0IHRoZSBlYXJsaWVzdCBhc3luY2hyb25vdXMgb3Bwb3J0dW5pdHkuIFdlIHN0b3JlIHRoaXMgdGVtcG9yYXJ5IGluZm9ybWF0aW9uIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYsIGJldHdlZW4ga2V5WCBhbmQgdmFsdWVVcGRhdGVIYW5kbGVyLCB0aGUgdW5kZXJseWluZyBtb2RlbCB2YWx1ZSBjaGFuZ2VzIHNlcGFyYXRlbHksXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbiBvdmVyd3JpdGUgdGhhdCBtb2RlbCB2YWx1ZSBjaGFuZ2Ugd2l0aCB0aGUgdmFsdWUgdGhlIHVzZXIganVzdCB0eXBlZC4gT3RoZXJ3aXNlLFxuICAgICAgICAgICAgICAgICAgICAvLyB0ZWNobmlxdWVzIGxpa2UgcmF0ZUxpbWl0IGNhbiB0cmlnZ2VyIG1vZGVsIGNoYW5nZXMgYXQgY3JpdGljYWwgbW9tZW50cyB0aGF0IHdpbGxcbiAgICAgICAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgdGhlIHVzZXIncyBpbnB1dHMsIGNhdXNpbmcga2V5c3Ryb2tlcyB0byBiZSBsb3N0LlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5zZXRUaW1lb3V0KHZhbHVlVXBkYXRlSGFuZGxlciwgMCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWUuc3Vic3RyaW5nKFwiYWZ0ZXJcIi5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHVwZGF0ZUZyb21Nb2RlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50VmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ICE9PSBudWxsICYmIG5ld1ZhbHVlID09PSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCkge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRpbWVvdXQodXBkYXRlRnJvbU1vZGVsLCAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZUhhc0NoYW5nZWQgPSAobmV3VmFsdWUgIT09IGVsZW1lbnRWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZUhhc0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGxvd1Vuc2V0ID0gYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZUFsbG93VW5zZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFwcGx5VmFsdWVBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUoZWxlbWVudCwgbmV3VmFsdWUsIGFsbG93VW5zZXQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBhcHBseVZhbHVlQWN0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhbGxvd1Vuc2V0ICYmIG5ld1ZhbHVlICE9PSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgeW91IHRyeSB0byBzZXQgYSBtb2RlbCB2YWx1ZSB0aGF0IGNhbid0IGJlIHJlcHJlc2VudGVkIGluIGFuIGFscmVhZHktcG9wdWxhdGVkIGRyb3Bkb3duLCByZWplY3QgdGhhdCBjaGFuZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHlvdSdyZSBub3QgYWxsb3dlZCB0byBoYXZlIGEgbW9kZWwgdmFsdWUgdGhhdCBkaXNhZ3JlZXMgd2l0aCBhIHZpc2libGUgVUkgc2VsZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMudHJpZ2dlckV2ZW50LCBudWxsLCBbZWxlbWVudCwgXCJjaGFuZ2VcIl0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgSUU2IGJ1ZzogSXQgd29uJ3QgcmVsaWFibHkgYXBwbHkgdmFsdWVzIHRvIFNFTEVDVCBub2RlcyBkdXJpbmcgdGhlIHNhbWUgZXhlY3V0aW9uIHRocmVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgeW91J3ZlIGNoYW5nZWQgdGhlIHNldCBvZiBPUFRJT04gbm9kZXMgb24gaXQuIFNvIGZvciB0aGF0IG5vZGUgdHlwZSwgd2UnbGwgc2NoZWR1bGUgYSBzZWNvbmQgdGhyZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBhcHBseSB0aGUgdmFsdWUgYXMgd2VsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRpbWVvdXQoYXBwbHlWYWx1ZUFjdGlvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUoZWxlbWVudCwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVGcm9tTW9kZWwsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKCkge30gLy8gS2VlcCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBjb2RlIHRoYXQgbWF5IGhhdmUgd3JhcHBlZCB2YWx1ZSBiaW5kaW5nXG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1sndmFsdWUnXSA9IHRydWU7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3Zpc2libGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICB2YXIgaXNDdXJyZW50bHlWaXNpYmxlID0gIShlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT0gXCJub25lXCIpO1xuICAgICAgICBpZiAodmFsdWUgJiYgIWlzQ3VycmVudGx5VmlzaWJsZSlcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIGVsc2UgaWYgKCghdmFsdWUpICYmIGlzQ3VycmVudGx5VmlzaWJsZSlcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn07XG4vLyAnY2xpY2snIGlzIGp1c3QgYSBzaG9ydGhhbmQgZm9yIHRoZSB1c3VhbCBmdWxsLWxlbmd0aCBldmVudDp7Y2xpY2s6aGFuZGxlcn1cbm1ha2VFdmVudEhhbmRsZXJTaG9ydGN1dCgnY2xpY2snKTtcbi8vIElmIHlvdSB3YW50IHRvIG1ha2UgYSBjdXN0b20gdGVtcGxhdGUgZW5naW5lLFxuLy9cbi8vIFsxXSBJbmhlcml0IGZyb20gdGhpcyBjbGFzcyAobGlrZSBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSBkb2VzKVxuLy8gWzJdIE92ZXJyaWRlICdyZW5kZXJUZW1wbGF0ZVNvdXJjZScsIHN1cHBseWluZyBhIGZ1bmN0aW9uIHdpdGggdGhpcyBzaWduYXR1cmU6XG4vL1xuLy8gICAgICAgIGZ1bmN0aW9uICh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcbi8vICAgICAgICAgICAgLy8gLSB0ZW1wbGF0ZVNvdXJjZS50ZXh0KCkgaXMgdGhlIHRleHQgb2YgdGhlIHRlbXBsYXRlIHlvdSBzaG91bGQgcmVuZGVyXG4vLyAgICAgICAgICAgIC8vIC0gYmluZGluZ0NvbnRleHQuJGRhdGEgaXMgdGhlIGRhdGEgeW91IHNob3VsZCBwYXNzIGludG8gdGhlIHRlbXBsYXRlXG4vLyAgICAgICAgICAgIC8vICAgLSB5b3UgbWlnaHQgYWxzbyB3YW50IHRvIG1ha2UgYmluZGluZ0NvbnRleHQuJHBhcmVudCwgYmluZGluZ0NvbnRleHQuJHBhcmVudHMsXG4vLyAgICAgICAgICAgIC8vICAgICBhbmQgYmluZGluZ0NvbnRleHQuJHJvb3QgYXZhaWxhYmxlIGluIHRoZSB0ZW1wbGF0ZSB0b29cbi8vICAgICAgICAgICAgLy8gLSBvcHRpb25zIGdpdmVzIHlvdSBhY2Nlc3MgdG8gYW55IG90aGVyIHByb3BlcnRpZXMgc2V0IG9uIFwiZGF0YS1iaW5kOiB7IHRlbXBsYXRlOiBvcHRpb25zIH1cIlxuLy8gICAgICAgICAgICAvLyAtIHRlbXBsYXRlRG9jdW1lbnQgaXMgdGhlIGRvY3VtZW50IG9iamVjdCBvZiB0aGUgdGVtcGxhdGVcbi8vICAgICAgICAgICAgLy9cbi8vICAgICAgICAgICAgLy8gUmV0dXJuIHZhbHVlOiBhbiBhcnJheSBvZiBET00gbm9kZXNcbi8vICAgICAgICB9XG4vL1xuLy8gWzNdIE92ZXJyaWRlICdjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snLCBzdXBwbHlpbmcgYSBmdW5jdGlvbiB3aXRoIHRoaXMgc2lnbmF0dXJlOlxuLy9cbi8vICAgICAgICBmdW5jdGlvbiAoc2NyaXB0KSB7XG4vLyAgICAgICAgICAgIC8vIFJldHVybiB2YWx1ZTogV2hhdGV2ZXIgc3ludGF4IG1lYW5zIFwiRXZhbHVhdGUgdGhlIEphdmFTY3JpcHQgc3RhdGVtZW50ICdzY3JpcHQnIGFuZCBvdXRwdXQgdGhlIHJlc3VsdFwiXG4vLyAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgRm9yIGV4YW1wbGUsIHRoZSBqcXVlcnkudG1wbCB0ZW1wbGF0ZSBlbmdpbmUgY29udmVydHMgJ3NvbWVTY3JpcHQnIHRvICckeyBzb21lU2NyaXB0IH0nXG4vLyAgICAgICAgfVxuLy9cbi8vICAgICBUaGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGlmIHlvdSB3YW50IHRvIGFsbG93IGRhdGEtYmluZCBhdHRyaWJ1dGVzIHRvIHJlZmVyZW5jZSBhcmJpdHJhcnkgdGVtcGxhdGUgdmFyaWFibGVzLlxuLy8gICAgIElmIHlvdSBkb24ndCB3YW50IHRvIGFsbG93IHRoYXQsIHlvdSBjYW4gc2V0IHRoZSBwcm9wZXJ0eSAnYWxsb3dUZW1wbGF0ZVJld3JpdGluZycgdG8gZmFsc2UgKGxpa2Uga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUgZG9lcylcbi8vICAgICBhbmQgdGhlbiB5b3UgZG9uJ3QgbmVlZCB0byBvdmVycmlkZSAnY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJy5cblxua28udGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7IH07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdmVycmlkZSByZW5kZXJUZW1wbGF0ZVNvdXJjZVwiKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsnY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJ10gPSBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiT3ZlcnJpZGUgY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrXCIpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydtYWtlVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgLy8gTmFtZWQgdGVtcGxhdGVcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGVtcGxhdGVEb2N1bWVudCA9IHRlbXBsYXRlRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICAgIHZhciBlbGVtID0gdGVtcGxhdGVEb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZSk7XG4gICAgICAgIGlmICghZWxlbSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIHRlbXBsYXRlIHdpdGggSUQgXCIgKyB0ZW1wbGF0ZSk7XG4gICAgICAgIHJldHVybiBuZXcga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQoZWxlbSk7XG4gICAgfSBlbHNlIGlmICgodGVtcGxhdGUubm9kZVR5cGUgPT0gMSkgfHwgKHRlbXBsYXRlLm5vZGVUeXBlID09IDgpKSB7XG4gICAgICAgIC8vIEFub255bW91cyB0ZW1wbGF0ZVxuICAgICAgICByZXR1cm4gbmV3IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSh0ZW1wbGF0ZSk7XG4gICAgfSBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdGVtcGxhdGUgdHlwZTogXCIgKyB0ZW1wbGF0ZSk7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ3JlbmRlclRlbXBsYXRlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgdmFyIHRlbXBsYXRlU291cmNlID0gdGhpc1snbWFrZVRlbXBsYXRlU291cmNlJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpO1xuICAgIHJldHVybiB0aGlzWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGVtcGxhdGVEb2N1bWVudCk7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ2lzVGVtcGxhdGVSZXdyaXR0ZW4nXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIC8vIFNraXAgcmV3cml0aW5nIGlmIHJlcXVlc3RlZFxuICAgIGlmICh0aGlzWydhbGxvd1RlbXBsYXRlUmV3cml0aW5nJ10gPT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gdGhpc1snbWFrZVRlbXBsYXRlU291cmNlJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpWydkYXRhJ10oXCJpc1Jld3JpdHRlblwiKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmV3cml0ZVRlbXBsYXRlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGUsIHJld3JpdGVyQ2FsbGJhY2ssIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICB2YXIgdGVtcGxhdGVTb3VyY2UgPSB0aGlzWydtYWtlVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgdmFyIHJld3JpdHRlbiA9IHJld3JpdGVyQ2FsbGJhY2sodGVtcGxhdGVTb3VyY2VbJ3RleHQnXSgpKTtcbiAgICB0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKHJld3JpdHRlbik7XG4gICAgdGVtcGxhdGVTb3VyY2VbJ2RhdGEnXShcImlzUmV3cml0dGVuXCIsIHRydWUpO1xufTtcblxua28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZUVuZ2luZScsIGtvLnRlbXBsYXRlRW5naW5lKTtcblxua28udGVtcGxhdGVSZXdyaXRpbmcgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW1vaXplRGF0YUJpbmRpbmdBdHRyaWJ1dGVTeW50YXhSZWdleCA9IC8oPChbYS16XStcXGQqKSg/OlxccysoPyFkYXRhLWJpbmRcXHMqPVxccyopW2EtejAtOVxcLV0rKD86PSg/OlxcXCJbXlxcXCJdKlxcXCJ8XFwnW15cXCddKlxcJ3xbXj5dKikpPykqXFxzKylkYXRhLWJpbmRcXHMqPVxccyooW1wiJ10pKFtcXHNcXFNdKj8pXFwzL2dpO1xuICAgIHZhciBtZW1vaXplVmlydHVhbENvbnRhaW5lckJpbmRpbmdTeW50YXhSZWdleCA9IC88IS0tXFxzKmtvXFxiXFxzKihbXFxzXFxTXSo/KVxccyotLT4vZztcblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRGF0YUJpbmRWYWx1ZXNGb3JSZXdyaXRpbmcoa2V5VmFsdWVBcnJheSkge1xuICAgICAgICB2YXIgYWxsVmFsaWRhdG9ycyA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlWYWx1ZUFycmF5W2ldWydrZXknXTtcbiAgICAgICAgICAgIGlmIChhbGxWYWxpZGF0b3JzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yID0gYWxsVmFsaWRhdG9yc1trZXldO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0b3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zc2libGVFcnJvck1lc3NhZ2UgPSB2YWxpZGF0b3Ioa2V5VmFsdWVBcnJheVtpXVsndmFsdWUnXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUVycm9yTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwb3NzaWJsZUVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgdGVtcGxhdGUgZW5naW5lIGRvZXMgbm90IHN1cHBvcnQgdGhlICdcIiArIGtleSArIFwiJyBiaW5kaW5nIHdpdGhpbiBpdHMgdGVtcGxhdGVzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdE1lbW9pemVkVGFnUmVwbGFjZW1lbnQoZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSwgdGFnVG9SZXRhaW4sIG5vZGVOYW1lLCB0ZW1wbGF0ZUVuZ2luZSkge1xuICAgICAgICB2YXIgZGF0YUJpbmRLZXlWYWx1ZUFycmF5ID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwoZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgIHZhbGlkYXRlRGF0YUJpbmRWYWx1ZXNGb3JSZXdyaXRpbmcoZGF0YUJpbmRLZXlWYWx1ZUFycmF5KTtcbiAgICAgICAgdmFyIHJld3JpdHRlbkRhdGFCaW5kQXR0cmlidXRlVmFsdWUgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncyhkYXRhQmluZEtleVZhbHVlQXJyYXksIHsndmFsdWVBY2Nlc3NvcnMnOnRydWV9KTtcblxuICAgICAgICAvLyBGb3Igbm8gb2J2aW91cyByZWFzb24sIE9wZXJhIGZhaWxzIHRvIGV2YWx1YXRlIHJld3JpdHRlbkRhdGFCaW5kQXR0cmlidXRlVmFsdWUgdW5sZXNzIGl0J3Mgd3JhcHBlZCBpbiBhbiBhZGRpdGlvbmFsXG4gICAgICAgIC8vIGFub255bW91cyBmdW5jdGlvbiwgZXZlbiB0aG91Z2ggT3BlcmEncyBidWlsdC1pbiBkZWJ1Z2dlciBjYW4gZXZhbHVhdGUgaXQgYW55d2F5LiBObyBvdGhlciBicm93c2VyIHJlcXVpcmVzIHRoaXNcbiAgICAgICAgLy8gZXh0cmEgaW5kaXJlY3Rpb24uXG4gICAgICAgIHZhciBhcHBseUJpbmRpbmdzVG9OZXh0U2libGluZ1NjcmlwdCA9XG4gICAgICAgICAgICBcImtvLl9fdHJfYW1idG5zKGZ1bmN0aW9uKCRjb250ZXh0LCRlbGVtZW50KXtyZXR1cm4oZnVuY3Rpb24oKXtyZXR1cm57IFwiICsgcmV3cml0dGVuRGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSArIFwiIH0gfSkoKX0sJ1wiICsgbm9kZU5hbWUudG9Mb3dlckNhc2UoKSArIFwiJylcIjtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlRW5naW5lWydjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snXShhcHBseUJpbmRpbmdzVG9OZXh0U2libGluZ1NjcmlwdCkgKyB0YWdUb1JldGFpbjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBlbnN1cmVUZW1wbGF0ZUlzUmV3cml0dGVuOiBmdW5jdGlvbiAodGVtcGxhdGUsIHRlbXBsYXRlRW5naW5lLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlRW5naW5lWydpc1RlbXBsYXRlUmV3cml0dGVuJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lWydyZXdyaXRlVGVtcGxhdGUnXSh0ZW1wbGF0ZSwgZnVuY3Rpb24gKGh0bWxTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnRlbXBsYXRlUmV3cml0aW5nLm1lbW9pemVCaW5kaW5nQXR0cmlidXRlU3ludGF4KGh0bWxTdHJpbmcsIHRlbXBsYXRlRW5naW5lKTtcbiAgICAgICAgICAgICAgICB9LCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICBtZW1vaXplQmluZGluZ0F0dHJpYnV0ZVN5bnRheDogZnVuY3Rpb24gKGh0bWxTdHJpbmcsIHRlbXBsYXRlRW5naW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gaHRtbFN0cmluZy5yZXBsYWNlKG1lbW9pemVEYXRhQmluZGluZ0F0dHJpYnV0ZVN5bnRheFJlZ2V4LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdE1lbW9pemVkVGFnUmVwbGFjZW1lbnQoLyogZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZTogKi8gYXJndW1lbnRzWzRdLCAvKiB0YWdUb1JldGFpbjogKi8gYXJndW1lbnRzWzFdLCAvKiBub2RlTmFtZTogKi8gYXJndW1lbnRzWzJdLCB0ZW1wbGF0ZUVuZ2luZSk7XG4gICAgICAgICAgICB9KS5yZXBsYWNlKG1lbW9pemVWaXJ0dWFsQ29udGFpbmVyQmluZGluZ1N5bnRheFJlZ2V4LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0TWVtb2l6ZWRUYWdSZXBsYWNlbWVudCgvKiBkYXRhQmluZEF0dHJpYnV0ZVZhbHVlOiAqLyBhcmd1bWVudHNbMV0sIC8qIHRhZ1RvUmV0YWluOiAqLyBcIjwhLS0ga28gLS0+XCIsIC8qIG5vZGVOYW1lOiAqLyBcIiNjb21tZW50XCIsIHRlbXBsYXRlRW5naW5lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFwcGx5TWVtb2l6ZWRCaW5kaW5nc1RvTmV4dFNpYmxpbmc6IGZ1bmN0aW9uIChiaW5kaW5ncywgbm9kZU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby5tZW1vaXphdGlvbi5tZW1vaXplKGZ1bmN0aW9uIChkb21Ob2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlVG9CaW5kID0gZG9tTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAobm9kZVRvQmluZCAmJiBub2RlVG9CaW5kLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZShub2RlVG9CaW5kLCBiaW5kaW5ncywgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcblxuXG4vLyBFeHBvcnRlZCBvbmx5IGJlY2F1c2UgaXQgaGFzIHRvIGJlIHJlZmVyZW5jZWQgYnkgc3RyaW5nIGxvb2t1cCBmcm9tIHdpdGhpbiByZXdyaXR0ZW4gdGVtcGxhdGVcbmtvLmV4cG9ydFN5bWJvbCgnX190cl9hbWJ0bnMnLCBrby50ZW1wbGF0ZVJld3JpdGluZy5hcHBseU1lbW9pemVkQmluZGluZ3NUb05leHRTaWJsaW5nKTtcbihmdW5jdGlvbigpIHtcbiAgICAvLyBBIHRlbXBsYXRlIHNvdXJjZSByZXByZXNlbnRzIGEgcmVhZC93cml0ZSB3YXkgb2YgYWNjZXNzaW5nIGEgdGVtcGxhdGUuIFRoaXMgaXMgdG8gZWxpbWluYXRlIHRoZSBuZWVkIGZvciB0ZW1wbGF0ZSBsb2FkaW5nL3NhdmluZ1xuICAgIC8vIGxvZ2ljIHRvIGJlIGR1cGxpY2F0ZWQgaW4gZXZlcnkgdGVtcGxhdGUgZW5naW5lIChhbmQgbWVhbnMgdGhleSBjYW4gYWxsIHdvcmsgd2l0aCBhbm9ueW1vdXMgdGVtcGxhdGVzLCBldGMuKVxuICAgIC8vXG4gICAgLy8gVHdvIGFyZSBwcm92aWRlZCBieSBkZWZhdWx0OlxuICAgIC8vICAxLiBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCAgICAgICAtIHJlYWRzL3dyaXRlcyB0aGUgdGV4dCBjb250ZW50IG9mIGFuIGFyYml0cmFyeSBET00gZWxlbWVudFxuICAgIC8vICAyLiBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzRWxlbWVudCAtIHVzZXMga28udXRpbHMuZG9tRGF0YSB0byByZWFkL3dyaXRlIHRleHQgKmFzc29jaWF0ZWQqIHdpdGggdGhlIERPTSBlbGVtZW50LCBidXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRob3V0IHJlYWRpbmcvd3JpdGluZyB0aGUgYWN0dWFsIGVsZW1lbnQgdGV4dCBjb250ZW50LCBzaW5jZSBpdCB3aWxsIGJlIG92ZXJ3cml0dGVuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgcmVuZGVyZWQgdGVtcGxhdGUgb3V0cHV0LlxuICAgIC8vIFlvdSBjYW4gaW1wbGVtZW50IHlvdXIgb3duIHRlbXBsYXRlIHNvdXJjZSBpZiB5b3Ugd2FudCB0byBmZXRjaC9zdG9yZSB0ZW1wbGF0ZXMgc29tZXdoZXJlIG90aGVyIHRoYW4gaW4gRE9NIGVsZW1lbnRzLlxuICAgIC8vIFRlbXBsYXRlIHNvdXJjZXMgbmVlZCB0byBoYXZlIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOlxuICAgIC8vICAgdGV4dCgpIFx0XHRcdC0gcmV0dXJucyB0aGUgdGVtcGxhdGUgdGV4dCBmcm9tIHlvdXIgc3RvcmFnZSBsb2NhdGlvblxuICAgIC8vICAgdGV4dCh2YWx1ZSlcdFx0LSB3cml0ZXMgdGhlIHN1cHBsaWVkIHRlbXBsYXRlIHRleHQgdG8geW91ciBzdG9yYWdlIGxvY2F0aW9uXG4gICAgLy8gICBkYXRhKGtleSlcdFx0XHQtIHJlYWRzIHZhbHVlcyBzdG9yZWQgdXNpbmcgZGF0YShrZXksIHZhbHVlKSAtIHNlZSBiZWxvd1xuICAgIC8vICAgZGF0YShrZXksIHZhbHVlKVx0LSBhc3NvY2lhdGVzIFwidmFsdWVcIiB3aXRoIHRoaXMgdGVtcGxhdGUgYW5kIHRoZSBrZXkgXCJrZXlcIi4gSXMgdXNlZCB0byBzdG9yZSBpbmZvcm1hdGlvbiBsaWtlIFwiaXNSZXdyaXR0ZW5cIi5cbiAgICAvL1xuICAgIC8vIE9wdGlvbmFsbHksIHRlbXBsYXRlIHNvdXJjZXMgY2FuIGFsc28gaGF2ZSB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uczpcbiAgICAvLyAgIG5vZGVzKCkgICAgICAgICAgICAtIHJldHVybnMgYSBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSBub2RlcyBvZiB0aGlzIHRlbXBsYXRlLCB3aGVyZSBhdmFpbGFibGVcbiAgICAvLyAgIG5vZGVzKHZhbHVlKSAgICAgICAtIHdyaXRlcyB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQgdG8geW91ciBzdG9yYWdlIGxvY2F0aW9uXG4gICAgLy8gSWYgYSBET00gZWxlbWVudCBpcyBhdmFpbGFibGUgZm9yIGEgZ2l2ZW4gdGVtcGxhdGUgc291cmNlLCB0ZW1wbGF0ZSBlbmdpbmVzIGFyZSBlbmNvdXJhZ2VkIHRvIHVzZSBpdCBpbiBwcmVmZXJlbmNlIG92ZXIgdGV4dCgpXG4gICAgLy8gZm9yIGltcHJvdmVkIHNwZWVkLiBIb3dldmVyLCBhbGwgdGVtcGxhdGVTb3VyY2VzIG11c3Qgc3VwcGx5IHRleHQoKSBldmVuIGlmIHRoZXkgZG9uJ3Qgc3VwcGx5IG5vZGVzKCkuXG4gICAgLy9cbiAgICAvLyBPbmNlIHlvdSd2ZSBpbXBsZW1lbnRlZCBhIHRlbXBsYXRlU291cmNlLCBtYWtlIHlvdXIgdGVtcGxhdGUgZW5naW5lIHVzZSBpdCBieSBzdWJjbGFzc2luZyB3aGF0ZXZlciB0ZW1wbGF0ZSBlbmdpbmUgeW91IHdlcmVcbiAgICAvLyB1c2luZyBhbmQgb3ZlcnJpZGluZyBcIm1ha2VUZW1wbGF0ZVNvdXJjZVwiIHRvIHJldHVybiBhbiBpbnN0YW5jZSBvZiB5b3VyIGN1c3RvbSB0ZW1wbGF0ZSBzb3VyY2UuXG5cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMgPSB7fTtcblxuICAgIC8vIC0tLS0ga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQgLS0tLS1cblxuICAgIC8vIHRlbXBsYXRlIHR5cGVzXG4gICAgdmFyIHRlbXBsYXRlU2NyaXB0ID0gMSxcbiAgICAgICAgdGVtcGxhdGVUZXh0QXJlYSA9IDIsXG4gICAgICAgIHRlbXBsYXRlVGVtcGxhdGUgPSAzLFxuICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQgPSA0O1xuXG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciB0YWdOYW1lTG93ZXIgPSBrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlVHlwZSA9XG4gICAgICAgICAgICAgICAgdGFnTmFtZUxvd2VyID09PSBcInNjcmlwdFwiID8gdGVtcGxhdGVTY3JpcHQgOlxuICAgICAgICAgICAgICAgIHRhZ05hbWVMb3dlciA9PT0gXCJ0ZXh0YXJlYVwiID8gdGVtcGxhdGVUZXh0QXJlYSA6XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBicm93c2VycyB3aXRoIHByb3BlciA8dGVtcGxhdGU+IGVsZW1lbnQgc3VwcG9ydCwgd2hlcmUgdGhlIC5jb250ZW50IHByb3BlcnR5IGdpdmVzIGEgZG9jdW1lbnQgZnJhZ21lbnRcbiAgICAgICAgICAgICAgICB0YWdOYW1lTG93ZXIgPT0gXCJ0ZW1wbGF0ZVwiICYmIGVsZW1lbnQuY29udGVudCAmJiBlbGVtZW50LmNvbnRlbnQubm9kZVR5cGUgPT09IDExID8gdGVtcGxhdGVUZW1wbGF0ZSA6XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQucHJvdG90eXBlWyd0ZXh0J10gPSBmdW5jdGlvbigvKiB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgdmFyIGVsZW1Db250ZW50c1Byb3BlcnR5ID0gdGhpcy50ZW1wbGF0ZVR5cGUgPT09IHRlbXBsYXRlU2NyaXB0ID8gXCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy50ZW1wbGF0ZVR5cGUgPT09IHRlbXBsYXRlVGV4dEFyZWEgPyBcInZhbHVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJpbm5lckhUTUxcIjtcblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb21FbGVtZW50W2VsZW1Db250ZW50c1Byb3BlcnR5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZVRvV3JpdGUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAoZWxlbUNvbnRlbnRzUHJvcGVydHkgPT09IFwiaW5uZXJIVE1MXCIpXG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0SHRtbCh0aGlzLmRvbUVsZW1lbnQsIHZhbHVlVG9Xcml0ZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5kb21FbGVtZW50W2VsZW1Db250ZW50c1Byb3BlcnR5XSA9IHZhbHVlVG9Xcml0ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZGF0YURvbURhdGFQcmVmaXggPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKSArIFwiX1wiO1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50LnByb3RvdHlwZVsnZGF0YSddID0gZnVuY3Rpb24oa2V5IC8qLCB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldCh0aGlzLmRvbUVsZW1lbnQsIGRhdGFEb21EYXRhUHJlZml4ICsga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KHRoaXMuZG9tRWxlbWVudCwgZGF0YURvbURhdGFQcmVmaXggKyBrZXksIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHRlbXBsYXRlc0RvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICBmdW5jdGlvbiBnZXRUZW1wbGF0ZURvbURhdGEoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ga28udXRpbHMuZG9tRGF0YS5nZXQoZWxlbWVudCwgdGVtcGxhdGVzRG9tRGF0YUtleSkgfHwge307XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFRlbXBsYXRlRG9tRGF0YShlbGVtZW50LCBkYXRhKSB7XG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIHRlbXBsYXRlc0RvbURhdGFLZXksIGRhdGEpO1xuICAgIH1cblxuICAgIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50LnByb3RvdHlwZVsnbm9kZXMnXSA9IGZ1bmN0aW9uKC8qIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuZG9tRWxlbWVudDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRGF0YSA9IGdldFRlbXBsYXRlRG9tRGF0YShlbGVtZW50KSxcbiAgICAgICAgICAgICAgICBjb250YWluZXJEYXRhID0gdGVtcGxhdGVEYXRhLmNvbnRhaW5lckRhdGE7XG4gICAgICAgICAgICByZXR1cm4gY29udGFpbmVyRGF0YSB8fCAoXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZVR5cGUgPT09IHRlbXBsYXRlVGVtcGxhdGUgPyBlbGVtZW50LmNvbnRlbnQgOlxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVUeXBlID09PSB0ZW1wbGF0ZUVsZW1lbnQgPyBlbGVtZW50IDpcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHVlVG9Xcml0ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHNldFRlbXBsYXRlRG9tRGF0YShlbGVtZW50LCB7Y29udGFpbmVyRGF0YTogdmFsdWVUb1dyaXRlfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gLS0tLSBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUgLS0tLS1cbiAgICAvLyBBbm9ueW1vdXMgdGVtcGxhdGVzIGFyZSBub3JtYWxseSBzYXZlZC9yZXRyaWV2ZWQgYXMgRE9NIG5vZGVzIHRocm91Z2ggXCJub2Rlc1wiLlxuICAgIC8vIEZvciBjb21wYXRpYmlsaXR5LCB5b3UgY2FuIGFsc28gcmVhZCBcInRleHRcIjsgaXQgd2lsbCBiZSBzZXJpYWxpemVkIGZyb20gdGhlIG5vZGVzIG9uIGRlbWFuZC5cbiAgICAvLyBXcml0aW5nIHRvIFwidGV4dFwiIGlzIHN0aWxsIHN1cHBvcnRlZCwgYnV0IHRoZW4gdGhlIHRlbXBsYXRlIGRhdGEgd2lsbCBub3QgYmUgYXZhaWxhYmxlIGFzIERPTSBub2Rlcy5cblxuICAgIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlLnByb3RvdHlwZSA9IG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCgpO1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGU7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlLnByb3RvdHlwZVsndGV4dCddID0gZnVuY3Rpb24oLyogdmFsdWVUb1dyaXRlICovKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZURhdGEgPSBnZXRUZW1wbGF0ZURvbURhdGEodGhpcy5kb21FbGVtZW50KTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZURhdGEudGV4dERhdGEgPT09IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZURhdGEuY29udGFpbmVyRGF0YSlcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEudGV4dERhdGEgPSB0ZW1wbGF0ZURhdGEuY29udGFpbmVyRGF0YS5pbm5lckhUTUw7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGVEYXRhLnRleHREYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHVlVG9Xcml0ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHNldFRlbXBsYXRlRG9tRGF0YSh0aGlzLmRvbUVsZW1lbnQsIHt0ZXh0RGF0YTogdmFsdWVUb1dyaXRlfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZVNvdXJjZXMnLCBrby50ZW1wbGF0ZVNvdXJjZXMpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgndGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQnLCBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCk7XG4gICAga28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUnLCBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90ZW1wbGF0ZUVuZ2luZTtcbiAgICBrby5zZXRUZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZUVuZ2luZSkge1xuICAgICAgICBpZiAoKHRlbXBsYXRlRW5naW5lICE9IHVuZGVmaW5lZCkgJiYgISh0ZW1wbGF0ZUVuZ2luZSBpbnN0YW5jZW9mIGtvLnRlbXBsYXRlRW5naW5lKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRlbXBsYXRlRW5naW5lIG11c3QgaW5oZXJpdCBmcm9tIGtvLnRlbXBsYXRlRW5naW5lXCIpO1xuICAgICAgICBfdGVtcGxhdGVFbmdpbmUgPSB0ZW1wbGF0ZUVuZ2luZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGFjdGlvbikge1xuICAgICAgICB2YXIgbm9kZSwgbmV4dEluUXVldWUgPSBmaXJzdE5vZGUsIGZpcnN0T3V0T2ZSYW5nZU5vZGUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcobGFzdE5vZGUpO1xuICAgICAgICB3aGlsZSAobmV4dEluUXVldWUgJiYgKChub2RlID0gbmV4dEluUXVldWUpICE9PSBmaXJzdE91dE9mUmFuZ2VOb2RlKSkge1xuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcobm9kZSk7XG4gICAgICAgICAgICBhY3Rpb24obm9kZSwgbmV4dEluUXVldWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGVCaW5kaW5nc09uQ29udGludW91c05vZGVBcnJheShjb250aW51b3VzTm9kZUFycmF5LCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAvLyBUbyBiZSB1c2VkIG9uIGFueSBub2RlcyB0aGF0IGhhdmUgYmVlbiByZW5kZXJlZCBieSBhIHRlbXBsYXRlIGFuZCBoYXZlIGJlZW4gaW5zZXJ0ZWQgaW50byBzb21lIHBhcmVudCBlbGVtZW50XG4gICAgICAgIC8vIFdhbGtzIHRocm91Z2ggY29udGludW91c05vZGVBcnJheSAod2hpY2ggKm11c3QqIGJlIGNvbnRpbnVvdXMsIGkuZS4sIGFuIHVuaW50ZXJydXB0ZWQgc2VxdWVuY2Ugb2Ygc2libGluZyBub2RlcywgYmVjYXVzZVxuICAgICAgICAvLyB0aGUgYWxnb3JpdGhtIGZvciB3YWxraW5nIHRoZW0gcmVsaWVzIG9uIHRoaXMpLCBhbmQgZm9yIGVhY2ggdG9wLWxldmVsIGl0ZW0gaW4gdGhlIHZpcnR1YWwtZWxlbWVudCBzZW5zZSxcbiAgICAgICAgLy8gKDEpIERvZXMgYSByZWd1bGFyIFwiYXBwbHlCaW5kaW5nc1wiIHRvIGFzc29jaWF0ZSBiaW5kaW5nQ29udGV4dCB3aXRoIHRoaXMgbm9kZSBhbmQgdG8gYWN0aXZhdGUgYW55IG5vbi1tZW1vaXplZCBiaW5kaW5nc1xuICAgICAgICAvLyAoMikgVW5tZW1vaXplcyBhbnkgbWVtb3MgaW4gdGhlIERPTSBzdWJ0cmVlIChlLmcuLCB0byBhY3RpdmF0ZSBiaW5kaW5ncyB0aGF0IGhhZCBiZWVuIG1lbW9pemVkIGR1cmluZyB0ZW1wbGF0ZSByZXdyaXRpbmcpXG5cbiAgICAgICAgaWYgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3ROb2RlID0gY29udGludW91c05vZGVBcnJheVswXSxcbiAgICAgICAgICAgICAgICBsYXN0Tm9kZSA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbY29udGludW91c05vZGVBcnJheS5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gZmlyc3ROb2RlLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIgPSBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgcHJlcHJvY2Vzc05vZGUgPSBwcm92aWRlclsncHJlcHJvY2Vzc05vZGUnXTtcblxuICAgICAgICAgICAgaWYgKHByZXByb2Nlc3NOb2RlKSB7XG4gICAgICAgICAgICAgICAgaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBmdW5jdGlvbihub2RlLCBuZXh0Tm9kZUluUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVQcmV2aW91c1NpYmxpbmcgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGVzID0gcHJlcHJvY2Vzc05vZGUuY2FsbChwcm92aWRlciwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdOb2Rlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgPT09IGZpcnN0Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5vZGUgPSBuZXdOb2Rlc1swXSB8fCBuZXh0Tm9kZUluUmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSA9PT0gbGFzdE5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5vZGUgPSBuZXdOb2Rlc1tuZXdOb2Rlcy5sZW5ndGggLSAxXSB8fCBub2RlUHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHByZXByb2Nlc3NOb2RlIGNhbiBjaGFuZ2UgdGhlIG5vZGVzLCBpbmNsdWRpbmcgdGhlIGZpcnN0IGFuZCBsYXN0IG5vZGVzLCB1cGRhdGUgY29udGludW91c05vZGVBcnJheSB0byBtYXRjaC5cbiAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRoZSBmdWxsIHNldCwgaW5jbHVkaW5nIGlubmVyIG5vZGVzLCBiZWNhdXNlIHRoZSB1bm1lbW9pemUgc3RlcCBtaWdodCByZW1vdmUgdGhlIGZpcnN0IG5vZGUgKGFuZCBzbyB0aGUgcmVhbFxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IG5vZGUgbmVlZHMgdG8gYmUgaW4gdGhlIGFycmF5KS5cbiAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFmaXJzdE5vZGUpIHsgLy8gcHJlcHJvY2Vzc05vZGUgbWlnaHQgaGF2ZSByZW1vdmVkIGFsbCB0aGUgbm9kZXMsIGluIHdoaWNoIGNhc2UgdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmlyc3ROb2RlID09PSBsYXN0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnB1c2goZmlyc3ROb2RlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnB1c2goZmlyc3ROb2RlLCBsYXN0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmZpeFVwQ29udGludW91c05vZGVBcnJheShjb250aW51b3VzTm9kZUFycmF5LCBwYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5lZWQgdG8gYXBwbHlCaW5kaW5ncyAqYmVmb3JlKiB1bm1lbW96aWF0aW9uLCBiZWNhdXNlIHVubWVtb2l6YXRpb24gbWlnaHQgaW50cm9kdWNlIGV4dHJhIG5vZGVzICh0aGF0IHdlIGRvbid0IHdhbnQgdG8gcmUtYmluZClcbiAgICAgICAgICAgIC8vIHdoZXJlYXMgYSByZWd1bGFyIGFwcGx5QmluZGluZ3Mgd29uJ3QgaW50cm9kdWNlIG5ldyBtZW1vaXplZCBub2Rlc1xuICAgICAgICAgICAgaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyhiaW5kaW5nQ29udGV4dCwgbm9kZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGludm9rZUZvckVhY2hOb2RlSW5Db250aW51b3VzUmFuZ2UoZmlyc3ROb2RlLCBsYXN0Tm9kZSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDgpXG4gICAgICAgICAgICAgICAgICAgIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cyhub2RlLCBbYmluZGluZ0NvbnRleHRdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgYW55IGNoYW5nZXMgZG9uZSBieSBhcHBseUJpbmRpbmdzIG9yIHVubWVtb2l6ZSBhcmUgcmVmbGVjdGVkIGluIHRoZSBhcnJheVxuICAgICAgICAgICAga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KGNvbnRpbnVvdXNOb2RlQXJyYXksIHBhcmVudE5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3ROb2RlRnJvbVBvc3NpYmxlQXJyYXkobm9kZU9yTm9kZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBub2RlT3JOb2RlQXJyYXkubm9kZVR5cGUgPyBub2RlT3JOb2RlQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5vZGVPck5vZGVBcnJheS5sZW5ndGggPiAwID8gbm9kZU9yTm9kZUFycmF5WzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVUZW1wbGF0ZSh0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlck1vZGUsIHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyIGZpcnN0VGFyZ2V0Tm9kZSA9IHRhcmdldE5vZGVPck5vZGVBcnJheSAmJiBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheSh0YXJnZXROb2RlT3JOb2RlQXJyYXkpO1xuICAgICAgICB2YXIgdGVtcGxhdGVEb2N1bWVudCA9IChmaXJzdFRhcmdldE5vZGUgfHwgdGVtcGxhdGUgfHwge30pLm93bmVyRG9jdW1lbnQ7XG4gICAgICAgIHZhciB0ZW1wbGF0ZUVuZ2luZVRvVXNlID0gKG9wdGlvbnNbJ3RlbXBsYXRlRW5naW5lJ10gfHwgX3RlbXBsYXRlRW5naW5lKTtcbiAgICAgICAga28udGVtcGxhdGVSZXdyaXRpbmcuZW5zdXJlVGVtcGxhdGVJc1Jld3JpdHRlbih0ZW1wbGF0ZSwgdGVtcGxhdGVFbmdpbmVUb1VzZSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgICAgIHZhciByZW5kZXJlZE5vZGVzQXJyYXkgPSB0ZW1wbGF0ZUVuZ2luZVRvVXNlWydyZW5kZXJUZW1wbGF0ZSddKHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGVtcGxhdGVEb2N1bWVudCk7XG5cbiAgICAgICAgLy8gTG9vc2VseSBjaGVjayByZXN1bHQgaXMgYW4gYXJyYXkgb2YgRE9NIG5vZGVzXG4gICAgICAgIGlmICgodHlwZW9mIHJlbmRlcmVkTm9kZXNBcnJheS5sZW5ndGggIT0gXCJudW1iZXJcIikgfHwgKHJlbmRlcmVkTm9kZXNBcnJheS5sZW5ndGggPiAwICYmIHR5cGVvZiByZW5kZXJlZE5vZGVzQXJyYXlbMF0ubm9kZVR5cGUgIT0gXCJudW1iZXJcIikpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUZW1wbGF0ZSBlbmdpbmUgbXVzdCByZXR1cm4gYW4gYXJyYXkgb2YgRE9NIG5vZGVzXCIpO1xuXG4gICAgICAgIHZhciBoYXZlQWRkZWROb2Rlc1RvUGFyZW50ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAocmVuZGVyTW9kZSkge1xuICAgICAgICAgICAgY2FzZSBcInJlcGxhY2VDaGlsZHJlblwiOlxuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4odGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJlZE5vZGVzQXJyYXkpO1xuICAgICAgICAgICAgICAgIGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJlcGxhY2VOb2RlXCI6XG4gICAgICAgICAgICAgICAga28udXRpbHMucmVwbGFjZURvbU5vZGVzKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyZWROb2Rlc0FycmF5KTtcbiAgICAgICAgICAgICAgICBoYXZlQWRkZWROb2Rlc1RvUGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpZ25vcmVUYXJnZXROb2RlXCI6IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHJlbmRlck1vZGU6IFwiICsgcmVuZGVyTW9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGF2ZUFkZGVkTm9kZXNUb1BhcmVudCkge1xuICAgICAgICAgICAgYWN0aXZhdGVCaW5kaW5nc09uQ29udGludW91c05vZGVBcnJheShyZW5kZXJlZE5vZGVzQXJyYXksIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zWydhZnRlclJlbmRlciddKVxuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10sIG51bGwsIFtyZW5kZXJlZE5vZGVzQXJyYXksIGJpbmRpbmdDb250ZXh0WyckZGF0YSddXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyZWROb2Rlc0FycmF5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVUZW1wbGF0ZU5hbWUodGVtcGxhdGUsIGRhdGEsIGNvbnRleHQpIHtcbiAgICAgICAgLy8gVGhlIHRlbXBsYXRlIGNhbiBiZSBzcGVjaWZpZWQgYXM6XG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAvLyAxLiBBbiBvYnNlcnZhYmxlLCB3aXRoIHN0cmluZyB2YWx1ZVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyAyLiBBIGZ1bmN0aW9uIG9mIChkYXRhLCBjb250ZXh0KSByZXR1cm5pbmcgYSBzdHJpbmdcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhLCBjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDMuIEEgc3RyaW5nXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrby5yZW5kZXJUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgZGF0YU9yQmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyTW9kZSkge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKChvcHRpb25zWyd0ZW1wbGF0ZUVuZ2luZSddIHx8IF90ZW1wbGF0ZUVuZ2luZSkgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2V0IGEgdGVtcGxhdGUgZW5naW5lIGJlZm9yZSBjYWxsaW5nIHJlbmRlclRlbXBsYXRlXCIpO1xuICAgICAgICByZW5kZXJNb2RlID0gcmVuZGVyTW9kZSB8fCBcInJlcGxhY2VDaGlsZHJlblwiO1xuXG4gICAgICAgIGlmICh0YXJnZXROb2RlT3JOb2RlQXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdFRhcmdldE5vZGUgPSBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheSh0YXJnZXROb2RlT3JOb2RlQXJyYXkpO1xuXG4gICAgICAgICAgICB2YXIgd2hlblRvRGlzcG9zZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICghZmlyc3RUYXJnZXROb2RlKSB8fCAha28udXRpbHMuZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KGZpcnN0VGFyZ2V0Tm9kZSk7IH07IC8vIFBhc3NpdmUgZGlzcG9zYWwgKG9uIG5leHQgZXZhbHVhdGlvbilcbiAgICAgICAgICAgIHZhciBhY3RpdmVseURpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCA9IChmaXJzdFRhcmdldE5vZGUgJiYgcmVuZGVyTW9kZSA9PSBcInJlcGxhY2VOb2RlXCIpID8gZmlyc3RUYXJnZXROb2RlLnBhcmVudE5vZGUgOiBmaXJzdFRhcmdldE5vZGU7XG5cbiAgICAgICAgICAgIHJldHVybiBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKCAvLyBTbyB0aGUgRE9NIGlzIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCB3aGVuIGFueSBkZXBlbmRlbmN5IGNoYW5nZXNcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSd2ZSBnb3QgYSBwcm9wZXIgYmluZGluZyBjb250ZXh0IHRvIHdvcmsgd2l0aFxuICAgICAgICAgICAgICAgICAgICB2YXIgYmluZGluZ0NvbnRleHQgPSAoZGF0YU9yQmluZGluZ0NvbnRleHQgJiYgKGRhdGFPckJpbmRpbmdDb250ZXh0IGluc3RhbmNlb2Yga28uYmluZGluZ0NvbnRleHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBkYXRhT3JCaW5kaW5nQ29udGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXcga28uYmluZGluZ0NvbnRleHQoZGF0YU9yQmluZGluZ0NvbnRleHQsIG51bGwsIG51bGwsIG51bGwsIHsgXCJleHBvcnREZXBlbmRlbmNpZXNcIjogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVOYW1lID0gcmVzb2x2ZVRlbXBsYXRlTmFtZSh0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGJpbmRpbmdDb250ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkTm9kZXNBcnJheSA9IGV4ZWN1dGVUZW1wbGF0ZSh0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlck1vZGUsIHRlbXBsYXRlTmFtZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJNb2RlID09IFwicmVwbGFjZU5vZGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZU9yTm9kZUFycmF5ID0gcmVuZGVyZWROb2Rlc0FycmF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RUYXJnZXROb2RlID0gZ2V0Rmlyc3ROb2RlRnJvbVBvc3NpYmxlQXJyYXkodGFyZ2V0Tm9kZU9yTm9kZUFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICB7IGRpc3Bvc2VXaGVuOiB3aGVuVG9EaXNwb3NlLCBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGFjdGl2ZWx5RGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCB5ZXQgaGF2ZSBhIERPTSBub2RlIHRvIGV2YWx1YXRlLCBzbyB1c2UgYSBtZW1vIGFuZCByZW5kZXIgdGhlIHRlbXBsYXRlIGxhdGVyIHdoZW4gdGhlcmUgaXMgYSBET00gbm9kZVxuICAgICAgICAgICAgcmV0dXJuIGtvLm1lbW9pemF0aW9uLm1lbW9pemUoZnVuY3Rpb24gKGRvbU5vZGUpIHtcbiAgICAgICAgICAgICAgICBrby5yZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGF0YU9yQmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIGRvbU5vZGUsIFwicmVwbGFjZU5vZGVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5yZW5kZXJUZW1wbGF0ZUZvckVhY2ggPSBmdW5jdGlvbiAodGVtcGxhdGUsIGFycmF5T3JPYnNlcnZhYmxlQXJyYXksIG9wdGlvbnMsIHRhcmdldE5vZGUsIHBhcmVudEJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIC8vIFNpbmNlIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgYWx3YXlzIGNhbGxzIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSBhbmQgdGhlblxuICAgICAgICAvLyBhY3RpdmF0ZUJpbmRpbmdzQ2FsbGJhY2sgZm9yIGFkZGVkIGl0ZW1zLCB3ZSBjYW4gc3RvcmUgdGhlIGJpbmRpbmcgY29udGV4dCBpbiB0aGUgZm9ybWVyIHRvIHVzZSBpbiB0aGUgbGF0dGVyLlxuICAgICAgICB2YXIgYXJyYXlJdGVtQ29udGV4dDtcblxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgY2FsbGVkIGJ5IHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgdG8gZ2V0IHRoZSBub2RlcyB0byBhZGQgdG8gdGFyZ2V0Tm9kZVxuICAgICAgICB2YXIgZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtID0gZnVuY3Rpb24gKGFycmF5VmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICAvLyBTdXBwb3J0IHNlbGVjdGluZyB0ZW1wbGF0ZSBhcyBhIGZ1bmN0aW9uIG9mIHRoZSBkYXRhIGJlaW5nIHJlbmRlcmVkXG4gICAgICAgICAgICBhcnJheUl0ZW1Db250ZXh0ID0gcGFyZW50QmluZGluZ0NvbnRleHRbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGFycmF5VmFsdWUsIG9wdGlvbnNbJ2FzJ10sIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0WyckaW5kZXgnXSA9IGluZGV4O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSByZXNvbHZlVGVtcGxhdGVOYW1lKHRlbXBsYXRlLCBhcnJheVZhbHVlLCBhcnJheUl0ZW1Db250ZXh0KTtcbiAgICAgICAgICAgIHJldHVybiBleGVjdXRlVGVtcGxhdGUobnVsbCwgXCJpZ25vcmVUYXJnZXROb2RlXCIsIHRlbXBsYXRlTmFtZSwgYXJyYXlJdGVtQ29udGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgaGFzIGFkZGVkIG5vZGVzIHRvIHRhcmdldE5vZGVcbiAgICAgICAgdmFyIGFjdGl2YXRlQmluZGluZ3NDYWxsYmFjayA9IGZ1bmN0aW9uKGFycmF5VmFsdWUsIGFkZGVkTm9kZXNBcnJheSwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFjdGl2YXRlQmluZGluZ3NPbkNvbnRpbnVvdXNOb2RlQXJyYXkoYWRkZWROb2Rlc0FycmF5LCBhcnJheUl0ZW1Db250ZXh0KTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zWydhZnRlclJlbmRlciddKVxuICAgICAgICAgICAgICAgIG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10oYWRkZWROb2Rlc0FycmF5LCBhcnJheVZhbHVlKTtcblxuICAgICAgICAgICAgLy8gcmVsZWFzZSB0aGUgXCJjYWNoZVwiIHZhcmlhYmxlLCBzbyB0aGF0IGl0IGNhbiBiZSBjb2xsZWN0ZWQgYnlcbiAgICAgICAgICAgIC8vIHRoZSBHQyB3aGVuIGl0cyB2YWx1ZSBpc24ndCB1c2VkIGZyb20gd2l0aGluIHRoZSBiaW5kaW5ncyBhbnltb3JlLlxuICAgICAgICAgICAgYXJyYXlJdGVtQ29udGV4dCA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGtvLmRlcGVuZGVudE9ic2VydmFibGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVud3JhcHBlZEFycmF5ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhcnJheU9yT2JzZXJ2YWJsZUFycmF5KSB8fCBbXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdW53cmFwcGVkQXJyYXkubGVuZ3RoID09IFwidW5kZWZpbmVkXCIpIC8vIENvZXJjZSBzaW5nbGUgdmFsdWUgaW50byBhcnJheVxuICAgICAgICAgICAgICAgIHVud3JhcHBlZEFycmF5ID0gW3Vud3JhcHBlZEFycmF5XTtcblxuICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBhbnkgZW50cmllcyBtYXJrZWQgYXMgZGVzdHJveWVkXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWRBcnJheSA9IGtvLnV0aWxzLmFycmF5RmlsdGVyKHVud3JhcHBlZEFycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNbJ2luY2x1ZGVEZXN0cm95ZWQnXSB8fCBpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCB8fCAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShpdGVtWydfZGVzdHJveSddKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcsIGlnbm9yaW5nIGFueSBvYnNlcnZhYmxlcyB1bndyYXBwZWQgd2l0aGluIChtb3N0IGxpa2VseSBmcm9tIGEgY2FsbGJhY2sgZnVuY3Rpb24pLlxuICAgICAgICAgICAgLy8gSWYgdGhlIGFycmF5IGl0ZW1zIGFyZSBvYnNlcnZhYmxlcywgdGhvdWdoLCB0aGV5IHdpbGwgYmUgdW53cmFwcGVkIGluIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSBhbmQgbWFuYWdlZCB3aXRoaW4gc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZy5cbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcsIG51bGwsIFt0YXJnZXROb2RlLCBmaWx0ZXJlZEFycmF5LCBleGVjdXRlVGVtcGxhdGVGb3JBcnJheUl0ZW0sIG9wdGlvbnMsIGFjdGl2YXRlQmluZGluZ3NDYWxsYmFja10pO1xuXG4gICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiB0YXJnZXROb2RlIH0pO1xuICAgIH07XG5cbiAgICB2YXIgdGVtcGxhdGVDb21wdXRlZERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICBmdW5jdGlvbiBkaXNwb3NlT2xkQ29tcHV0ZWRBbmRTdG9yZU5ld09uZShlbGVtZW50LCBuZXdDb21wdXRlZCkge1xuICAgICAgICB2YXIgb2xkQ29tcHV0ZWQgPSBrby51dGlscy5kb21EYXRhLmdldChlbGVtZW50LCB0ZW1wbGF0ZUNvbXB1dGVkRG9tRGF0YUtleSk7XG4gICAgICAgIGlmIChvbGRDb21wdXRlZCAmJiAodHlwZW9mKG9sZENvbXB1dGVkLmRpc3Bvc2UpID09ICdmdW5jdGlvbicpKVxuICAgICAgICAgICAgb2xkQ29tcHV0ZWQuZGlzcG9zZSgpO1xuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCB0ZW1wbGF0ZUNvbXB1dGVkRG9tRGF0YUtleSwgKG5ld0NvbXB1dGVkICYmIG5ld0NvbXB1dGVkLmlzQWN0aXZlKCkpID8gbmV3Q29tcHV0ZWQgOiB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1sndGVtcGxhdGUnXSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgICAgICAvLyBTdXBwb3J0IGFub255bW91cyB0ZW1wbGF0ZXNcbiAgICAgICAgICAgIHZhciBiaW5kaW5nVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdWYWx1ZSA9PSBcInN0cmluZ1wiIHx8IGJpbmRpbmdWYWx1ZVsnbmFtZSddKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBhIG5hbWVkIHRlbXBsYXRlIC0gY2xlYXIgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnbm9kZXMnIGluIGJpbmRpbmdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3ZlIGJlZW4gZ2l2ZW4gYW4gYXJyYXkgb2YgRE9NIG5vZGVzLiBTYXZlIHRoZW0gYXMgdGhlIHRlbXBsYXRlIHNvdXJjZS5cbiAgICAgICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBrbm93biB1c2UgY2FzZSBmb3IgdGhlIG5vZGUgYXJyYXkgYmVpbmcgYW4gb2JzZXJ2YWJsZSBhcnJheSAoaWYgdGhlIG91dHB1dFxuICAgICAgICAgICAgICAgIC8vIHZhcmllcywgcHV0IHRoYXQgYmVoYXZpb3IgKmludG8qIHlvdXIgdGVtcGxhdGUgLSB0aGF0J3Mgd2hhdCB0ZW1wbGF0ZXMgYXJlIGZvciksIGFuZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBpbXBsZW1lbnRhdGlvbiB3b3VsZCBiZSBhIG1lc3MsIHNvIGFzc2VydCB0aGF0IGl0J3Mgbm90IG9ic2VydmFibGUuXG4gICAgICAgICAgICAgICAgdmFyIG5vZGVzID0gYmluZGluZ1ZhbHVlWydub2RlcyddIHx8IFtdO1xuICAgICAgICAgICAgICAgIGlmIChrby5pc09ic2VydmFibGUobm9kZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwibm9kZXNcIiBvcHRpb24gbXVzdCBiZSBhIHBsYWluLCBub24tb2JzZXJ2YWJsZSBhcnJheS4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGtvLnV0aWxzLm1vdmVDbGVhbmVkTm9kZXNUb0NvbnRhaW5lckVsZW1lbnQobm9kZXMpOyAvLyBUaGlzIGFsc28gcmVtb3ZlcyB0aGUgbm9kZXMgZnJvbSB0aGVpciBjdXJyZW50IHBhcmVudFxuICAgICAgICAgICAgICAgIG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUoZWxlbWVudClbJ25vZGVzJ10oY29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBhbiBhbm9ueW1vdXMgdGVtcGxhdGUgLSBzdG9yZSB0aGUgZWxlbWVudCBjb250ZW50cywgdGhlbiBjbGVhciB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5vZGVzID0ga28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGtvLnV0aWxzLm1vdmVDbGVhbmVkTm9kZXNUb0NvbnRhaW5lckVsZW1lbnQodGVtcGxhdGVOb2Rlcyk7IC8vIFRoaXMgYWxzbyByZW1vdmVzIHRoZSBub2RlcyBmcm9tIHRoZWlyIGN1cnJlbnQgcGFyZW50XG4gICAgICAgICAgICAgICAgbmV3IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZShlbGVtZW50KVsnbm9kZXMnXShjb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgICAgICB9LFxuICAgICAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWUpLFxuICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29tcHV0ZWQgPSBudWxsLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlTmFtZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZU5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlTmFtZSA9IG9wdGlvbnNbJ25hbWUnXTtcblxuICAgICAgICAgICAgICAgIC8vIFN1cHBvcnQgXCJpZlwiL1wiaWZub3RcIiBjb25kaXRpb25zXG4gICAgICAgICAgICAgICAgaWYgKCdpZicgaW4gb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkRGlzcGxheSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uc1snaWYnXSk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZERpc3BsYXkgJiYgJ2lmbm90JyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0gIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uc1snaWZub3QnXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgnZm9yZWFjaCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBvbmNlIGZvciBlYWNoIGRhdGEgcG9pbnQgKHRyZWF0aW5nIGRhdGEgc2V0IGFzIGVtcHR5IGlmIHNob3VsZERpc3BsYXk9PWZhbHNlKVxuICAgICAgICAgICAgICAgIHZhciBkYXRhQXJyYXkgPSAoc2hvdWxkRGlzcGxheSAmJiBvcHRpb25zWydmb3JlYWNoJ10pIHx8IFtdO1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29tcHV0ZWQgPSBrby5yZW5kZXJUZW1wbGF0ZUZvckVhY2godGVtcGxhdGVOYW1lIHx8IGVsZW1lbnQsIGRhdGFBcnJheSwgb3B0aW9ucywgZWxlbWVudCwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2hvdWxkRGlzcGxheSkge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBvbmNlIGZvciB0aGlzIHNpbmdsZSBkYXRhIHBvaW50IChvciB1c2UgdGhlIHZpZXdNb2RlbCBpZiBubyBkYXRhIHdhcyBwcm92aWRlZClcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXJCaW5kaW5nQ29udGV4dCA9ICgnZGF0YScgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC5jcmVhdGVTdGF0aWNDaGlsZENvbnRleHQob3B0aW9uc1snZGF0YSddLCBvcHRpb25zWydhcyddKSA6ICAvLyBHaXZlbiBhbiBleHBsaXRpdCAnZGF0YScgdmFsdWUsIHdlIGNyZWF0ZSBhIGNoaWxkIGJpbmRpbmcgY29udGV4dCBmb3IgaXRcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaXZlbiBubyBleHBsaWNpdCAnZGF0YScgdmFsdWUsIHdlIHJldGFpbiB0aGUgc2FtZSBiaW5kaW5nIGNvbnRleHRcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbXB1dGVkID0ga28ucmVuZGVyVGVtcGxhdGUodGVtcGxhdGVOYW1lIHx8IGVsZW1lbnQsIGlubmVyQmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJdCBvbmx5IG1ha2VzIHNlbnNlIHRvIGhhdmUgYSBzaW5nbGUgdGVtcGxhdGUgY29tcHV0ZWQgcGVyIGVsZW1lbnQgKG90aGVyd2lzZSB3aGljaCBvbmUgc2hvdWxkIGhhdmUgaXRzIG91dHB1dCBkaXNwbGF5ZWQ/KVxuICAgICAgICAgICAgZGlzcG9zZU9sZENvbXB1dGVkQW5kU3RvcmVOZXdPbmUoZWxlbWVudCwgdGVtcGxhdGVDb21wdXRlZCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQW5vbnltb3VzIHRlbXBsYXRlcyBjYW4ndCBiZSByZXdyaXR0ZW4uIEdpdmUgYSBuaWNlIGVycm9yIG1lc3NhZ2UgaWYgeW91IHRyeSB0byBkbyBpdC5cbiAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1sndGVtcGxhdGUnXSA9IGZ1bmN0aW9uKGJpbmRpbmdWYWx1ZSkge1xuICAgICAgICB2YXIgcGFyc2VkQmluZGluZ1ZhbHVlID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwoYmluZGluZ1ZhbHVlKTtcblxuICAgICAgICBpZiAoKHBhcnNlZEJpbmRpbmdWYWx1ZS5sZW5ndGggPT0gMSkgJiYgcGFyc2VkQmluZGluZ1ZhbHVlWzBdWyd1bmtub3duJ10pXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gSXQgbG9va3MgbGlrZSBhIHN0cmluZyBsaXRlcmFsLCBub3QgYW4gb2JqZWN0IGxpdGVyYWwsIHNvIHRyZWF0IGl0IGFzIGEgbmFtZWQgdGVtcGxhdGUgKHdoaWNoIGlzIGFsbG93ZWQgZm9yIHJld3JpdGluZylcblxuICAgICAgICBpZiAoa28uZXhwcmVzc2lvblJld3JpdGluZy5rZXlWYWx1ZUFycmF5Q29udGFpbnNLZXkocGFyc2VkQmluZGluZ1ZhbHVlLCBcIm5hbWVcIikpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gTmFtZWQgdGVtcGxhdGVzIGNhbiBiZSByZXdyaXR0ZW4sIHNvIHJldHVybiBcIm5vIGVycm9yXCJcbiAgICAgICAgcmV0dXJuIFwiVGhpcyB0ZW1wbGF0ZSBlbmdpbmUgZG9lcyBub3Qgc3VwcG9ydCBhbm9ueW1vdXMgdGVtcGxhdGVzIG5lc3RlZCB3aXRoaW4gaXRzIHRlbXBsYXRlc1wiO1xuICAgIH07XG5cbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWyd0ZW1wbGF0ZSddID0gdHJ1ZTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnc2V0VGVtcGxhdGVFbmdpbmUnLCBrby5zZXRUZW1wbGF0ZUVuZ2luZSk7XG5rby5leHBvcnRTeW1ib2woJ3JlbmRlclRlbXBsYXRlJywga28ucmVuZGVyVGVtcGxhdGUpO1xuLy8gR28gdGhyb3VnaCB0aGUgaXRlbXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgYW5kIGRlbGV0ZWQgYW5kIHRyeSB0byBmaW5kIG1hdGNoZXMgYmV0d2VlbiB0aGVtLlxua28udXRpbHMuZmluZE1vdmVzSW5BcnJheUNvbXBhcmlzb24gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGxpbWl0RmFpbGVkQ29tcGFyZXMpIHtcbiAgICBpZiAobGVmdC5sZW5ndGggJiYgcmlnaHQubGVuZ3RoKSB7XG4gICAgICAgIHZhciBmYWlsZWRDb21wYXJlcywgbCwgciwgbGVmdEl0ZW0sIHJpZ2h0SXRlbTtcbiAgICAgICAgZm9yIChmYWlsZWRDb21wYXJlcyA9IGwgPSAwOyAoIWxpbWl0RmFpbGVkQ29tcGFyZXMgfHwgZmFpbGVkQ29tcGFyZXMgPCBsaW1pdEZhaWxlZENvbXBhcmVzKSAmJiAobGVmdEl0ZW0gPSBsZWZ0W2xdKTsgKytsKSB7XG4gICAgICAgICAgICBmb3IgKHIgPSAwOyByaWdodEl0ZW0gPSByaWdodFtyXTsgKytyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRJdGVtWyd2YWx1ZSddID09PSByaWdodEl0ZW1bJ3ZhbHVlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdEl0ZW1bJ21vdmVkJ10gPSByaWdodEl0ZW1bJ2luZGV4J107XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0SXRlbVsnbW92ZWQnXSA9IGxlZnRJdGVtWydpbmRleCddO1xuICAgICAgICAgICAgICAgICAgICByaWdodC5zcGxpY2UociwgMSk7ICAgICAgICAgLy8gVGhpcyBpdGVtIGlzIG1hcmtlZCBhcyBtb3ZlZDsgc28gcmVtb3ZlIGl0IGZyb20gcmlnaHQgbGlzdFxuICAgICAgICAgICAgICAgICAgICBmYWlsZWRDb21wYXJlcyA9IHIgPSAwOyAgICAgLy8gUmVzZXQgZmFpbGVkIGNvbXBhcmVzIGNvdW50IGJlY2F1c2Ugd2UncmUgY2hlY2tpbmcgZm9yIGNvbnNlY3V0aXZlIGZhaWx1cmVzXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZhaWxlZENvbXBhcmVzICs9IHI7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5rby51dGlscy5jb21wYXJlQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhdHVzTm90SW5PbGQgPSAnYWRkZWQnLCBzdGF0dXNOb3RJbk5ldyA9ICdkZWxldGVkJztcblxuICAgIC8vIFNpbXBsZSBjYWxjdWxhdGlvbiBiYXNlZCBvbiBMZXZlbnNodGVpbiBkaXN0YW5jZS5cbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKG9sZEFycmF5LCBuZXdBcnJheSwgb3B0aW9ucykge1xuICAgICAgICAvLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgaWYgdGhlIHRoaXJkIGFyZyBpcyBhY3R1YWxseSBhIGJvb2wsIGludGVycHJldFxuICAgICAgICAvLyBpdCBhcyB0aGUgb2xkIHBhcmFtZXRlciAnZG9udExpbWl0TW92ZXMnLiBOZXdlciBjb2RlIHNob3VsZCB1c2UgeyBkb250TGltaXRNb3ZlczogdHJ1ZSB9LlxuICAgICAgICBvcHRpb25zID0gKHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicpID8geyAnZG9udExpbWl0TW92ZXMnOiBvcHRpb25zIH0gOiAob3B0aW9ucyB8fCB7fSk7XG4gICAgICAgIG9sZEFycmF5ID0gb2xkQXJyYXkgfHwgW107XG4gICAgICAgIG5ld0FycmF5ID0gbmV3QXJyYXkgfHwgW107XG5cbiAgICAgICAgaWYgKG9sZEFycmF5Lmxlbmd0aCA8IG5ld0FycmF5Lmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBjb21wYXJlU21hbGxBcnJheVRvQmlnQXJyYXkob2xkQXJyYXksIG5ld0FycmF5LCBzdGF0dXNOb3RJbk9sZCwgc3RhdHVzTm90SW5OZXcsIG9wdGlvbnMpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gY29tcGFyZVNtYWxsQXJyYXlUb0JpZ0FycmF5KG5ld0FycmF5LCBvbGRBcnJheSwgc3RhdHVzTm90SW5OZXcsIHN0YXR1c05vdEluT2xkLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlU21hbGxBcnJheVRvQmlnQXJyYXkoc21sQXJyYXksIGJpZ0FycmF5LCBzdGF0dXNOb3RJblNtbCwgc3RhdHVzTm90SW5CaWcsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG15TWluID0gTWF0aC5taW4sXG4gICAgICAgICAgICBteU1heCA9IE1hdGgubWF4LFxuICAgICAgICAgICAgZWRpdERpc3RhbmNlTWF0cml4ID0gW10sXG4gICAgICAgICAgICBzbWxJbmRleCwgc21sSW5kZXhNYXggPSBzbWxBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICBiaWdJbmRleCwgYmlnSW5kZXhNYXggPSBiaWdBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICBjb21wYXJlUmFuZ2UgPSAoYmlnSW5kZXhNYXggLSBzbWxJbmRleE1heCkgfHwgMSxcbiAgICAgICAgICAgIG1heERpc3RhbmNlID0gc21sSW5kZXhNYXggKyBiaWdJbmRleE1heCArIDEsXG4gICAgICAgICAgICB0aGlzUm93LCBsYXN0Um93LFxuICAgICAgICAgICAgYmlnSW5kZXhNYXhGb3JSb3csIGJpZ0luZGV4TWluRm9yUm93O1xuXG4gICAgICAgIGZvciAoc21sSW5kZXggPSAwOyBzbWxJbmRleCA8PSBzbWxJbmRleE1heDsgc21sSW5kZXgrKykge1xuICAgICAgICAgICAgbGFzdFJvdyA9IHRoaXNSb3c7XG4gICAgICAgICAgICBlZGl0RGlzdGFuY2VNYXRyaXgucHVzaCh0aGlzUm93ID0gW10pO1xuICAgICAgICAgICAgYmlnSW5kZXhNYXhGb3JSb3cgPSBteU1pbihiaWdJbmRleE1heCwgc21sSW5kZXggKyBjb21wYXJlUmFuZ2UpO1xuICAgICAgICAgICAgYmlnSW5kZXhNaW5Gb3JSb3cgPSBteU1heCgwLCBzbWxJbmRleCAtIDEpO1xuICAgICAgICAgICAgZm9yIChiaWdJbmRleCA9IGJpZ0luZGV4TWluRm9yUm93OyBiaWdJbmRleCA8PSBiaWdJbmRleE1heEZvclJvdzsgYmlnSW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmICghYmlnSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gc21sSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFzbWxJbmRleCkgIC8vIFRvcCByb3cgLSB0cmFuc2Zvcm0gZW1wdHkgYXJyYXkgaW50byBuZXcgYXJyYXkgdmlhIGFkZGl0aW9uc1xuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IGJpZ0luZGV4ICsgMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzbWxBcnJheVtzbWxJbmRleCAtIDFdID09PSBiaWdBcnJheVtiaWdJbmRleCAtIDFdKVxuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IGxhc3RSb3dbYmlnSW5kZXggLSAxXTsgICAgICAgICAgICAgICAgICAvLyBjb3B5IHZhbHVlIChubyBlZGl0KVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9ydGhEaXN0YW5jZSA9IGxhc3RSb3dbYmlnSW5kZXhdIHx8IG1heERpc3RhbmNlOyAgICAgICAvLyBub3QgaW4gYmlnIChkZWxldGlvbilcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdlc3REaXN0YW5jZSA9IHRoaXNSb3dbYmlnSW5kZXggLSAxXSB8fCBtYXhEaXN0YW5jZTsgICAgLy8gbm90IGluIHNtYWxsIChhZGRpdGlvbilcbiAgICAgICAgICAgICAgICAgICAgdGhpc1Jvd1tiaWdJbmRleF0gPSBteU1pbihub3J0aERpc3RhbmNlLCB3ZXN0RGlzdGFuY2UpICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWRpdFNjcmlwdCA9IFtdLCBtZU1pbnVzT25lLCBub3RJblNtbCA9IFtdLCBub3RJbkJpZyA9IFtdO1xuICAgICAgICBmb3IgKHNtbEluZGV4ID0gc21sSW5kZXhNYXgsIGJpZ0luZGV4ID0gYmlnSW5kZXhNYXg7IHNtbEluZGV4IHx8IGJpZ0luZGV4Oykge1xuICAgICAgICAgICAgbWVNaW51c09uZSA9IGVkaXREaXN0YW5jZU1hdHJpeFtzbWxJbmRleF1bYmlnSW5kZXhdIC0gMTtcbiAgICAgICAgICAgIGlmIChiaWdJbmRleCAmJiBtZU1pbnVzT25lID09PSBlZGl0RGlzdGFuY2VNYXRyaXhbc21sSW5kZXhdW2JpZ0luZGV4LTFdKSB7XG4gICAgICAgICAgICAgICAgbm90SW5TbWwucHVzaChlZGl0U2NyaXB0W2VkaXRTY3JpcHQubGVuZ3RoXSA9IHsgICAgIC8vIGFkZGVkXG4gICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNOb3RJblNtbCxcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogYmlnQXJyYXlbLS1iaWdJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICdpbmRleCc6IGJpZ0luZGV4IH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzbWxJbmRleCAmJiBtZU1pbnVzT25lID09PSBlZGl0RGlzdGFuY2VNYXRyaXhbc21sSW5kZXggLSAxXVtiaWdJbmRleF0pIHtcbiAgICAgICAgICAgICAgICBub3RJbkJpZy5wdXNoKGVkaXRTY3JpcHRbZWRpdFNjcmlwdC5sZW5ndGhdID0geyAgICAgLy8gZGVsZXRlZFxuICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogc3RhdHVzTm90SW5CaWcsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHNtbEFycmF5Wy0tc21sSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAnaW5kZXgnOiBzbWxJbmRleCB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLS1iaWdJbmRleDtcbiAgICAgICAgICAgICAgICAtLXNtbEluZGV4O1xuICAgICAgICAgICAgICAgIGlmICghb3B0aW9uc1snc3BhcnNlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdFNjcmlwdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiBcInJldGFpbmVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBiaWdBcnJheVtiaWdJbmRleF0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IGEgbGltaXQgb24gdGhlIG51bWJlciBvZiBjb25zZWN1dGl2ZSBub24tbWF0Y2hpbmcgY29tcGFyaXNvbnM7IGhhdmluZyBpdCBhIG11bHRpcGxlIG9mXG4gICAgICAgIC8vIHNtbEluZGV4TWF4IGtlZXBzIHRoZSB0aW1lIGNvbXBsZXhpdHkgb2YgdGhpcyBhbGdvcml0aG0gbGluZWFyLlxuICAgICAgICBrby51dGlscy5maW5kTW92ZXNJbkFycmF5Q29tcGFyaXNvbihub3RJbkJpZywgbm90SW5TbWwsICFvcHRpb25zWydkb250TGltaXRNb3ZlcyddICYmIHNtbEluZGV4TWF4ICogMTApO1xuXG4gICAgICAgIHJldHVybiBlZGl0U2NyaXB0LnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcGFyZUFycmF5cztcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuY29tcGFyZUFycmF5cycsIGtvLnV0aWxzLmNvbXBhcmVBcnJheXMpO1xuKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBPYmplY3RpdmU6XG4gICAgLy8gKiBHaXZlbiBhbiBpbnB1dCBhcnJheSwgYSBjb250YWluZXIgRE9NIG5vZGUsIGFuZCBhIGZ1bmN0aW9uIGZyb20gYXJyYXkgZWxlbWVudHMgdG8gYXJyYXlzIG9mIERPTSBub2RlcyxcbiAgICAvLyAgIG1hcCB0aGUgYXJyYXkgZWxlbWVudHMgdG8gYXJyYXlzIG9mIERPTSBub2RlcywgY29uY2F0ZW5hdGUgdG9nZXRoZXIgYWxsIHRoZXNlIGFycmF5cywgYW5kIHVzZSB0aGVtIHRvIHBvcHVsYXRlIHRoZSBjb250YWluZXIgRE9NIG5vZGVcbiAgICAvLyAqIE5leHQgdGltZSB3ZSdyZSBnaXZlbiB0aGUgc2FtZSBjb21iaW5hdGlvbiBvZiB0aGluZ3MgKHdpdGggdGhlIGFycmF5IHBvc3NpYmx5IGhhdmluZyBtdXRhdGVkKSwgdXBkYXRlIHRoZSBjb250YWluZXIgRE9NIG5vZGVcbiAgICAvLyAgIHNvIHRoYXQgaXRzIGNoaWxkcmVuIGlzIGFnYWluIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSBtYXBwaW5ncyBvZiB0aGUgYXJyYXkgZWxlbWVudHMsIGJ1dCBkb24ndCByZS1tYXAgYW55IGFycmF5IGVsZW1lbnRzIHRoYXQgd2VcbiAgICAvLyAgIHByZXZpb3VzbHkgbWFwcGVkIC0gcmV0YWluIHRob3NlIG5vZGVzLCBhbmQganVzdCBpbnNlcnQvZGVsZXRlIG90aGVyIG9uZXNcblxuICAgIC8vIFwiY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzXCIgd2lsbCBiZSBpbnZva2VkIGFmdGVyIGFueSBcIm1hcHBpbmdcIi1nZW5lcmF0ZWQgbm9kZXMgYXJlIGluc2VydGVkIGludG8gdGhlIGNvbnRhaW5lciBub2RlXG4gICAgLy8gWW91IGNhbiB1c2UgdGhpcywgZm9yIGV4YW1wbGUsIHRvIGFjdGl2YXRlIGJpbmRpbmdzIG9uIHRob3NlIG5vZGVzLlxuXG4gICAgZnVuY3Rpb24gbWFwTm9kZUFuZFJlZnJlc2hXaGVuQ2hhbmdlZChjb250YWluZXJOb2RlLCBtYXBwaW5nLCB2YWx1ZVRvTWFwLCBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMsIGluZGV4KSB7XG4gICAgICAgIC8vIE1hcCB0aGlzIGFycmF5IHZhbHVlIGluc2lkZSBhIGRlcGVuZGVudE9ic2VydmFibGUgc28gd2UgcmUtbWFwIHdoZW4gYW55IGRlcGVuZGVuY3kgY2hhbmdlc1xuICAgICAgICB2YXIgbWFwcGVkTm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGRlcGVuZGVudE9ic2VydmFibGUgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG5ld01hcHBlZE5vZGVzID0gbWFwcGluZyh2YWx1ZVRvTWFwLCBpbmRleCwga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KG1hcHBlZE5vZGVzLCBjb250YWluZXJOb2RlKSkgfHwgW107XG5cbiAgICAgICAgICAgIC8vIE9uIHN1YnNlcXVlbnQgZXZhbHVhdGlvbnMsIGp1c3QgcmVwbGFjZSB0aGUgcHJldmlvdXNseS1pbnNlcnRlZCBET00gbm9kZXNcbiAgICAgICAgICAgIGlmIChtYXBwZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMucmVwbGFjZURvbU5vZGVzKG1hcHBlZE5vZGVzLCBuZXdNYXBwZWROb2Rlcyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcylcbiAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzLCBudWxsLCBbdmFsdWVUb01hcCwgbmV3TWFwcGVkTm9kZXMsIGluZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBtYXBwZWROb2RlcyBhcnJheSwgdGhlcmVieSB1cGRhdGluZyB0aGUgcmVjb3JkXG4gICAgICAgICAgICAvLyBvZiB3aGljaCBub2RlcyB3b3VsZCBiZSBkZWxldGVkIGlmIHZhbHVlVG9NYXAgd2FzIGl0c2VsZiBsYXRlciByZW1vdmVkXG4gICAgICAgICAgICBtYXBwZWROb2Rlcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKG1hcHBlZE5vZGVzLCBuZXdNYXBwZWROb2Rlcyk7XG4gICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBjb250YWluZXJOb2RlLCBkaXNwb3NlV2hlbjogZnVuY3Rpb24oKSB7IHJldHVybiAha28udXRpbHMuYW55RG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KG1hcHBlZE5vZGVzKTsgfSB9KTtcbiAgICAgICAgcmV0dXJuIHsgbWFwcGVkTm9kZXMgOiBtYXBwZWROb2RlcywgZGVwZW5kZW50T2JzZXJ2YWJsZSA6IChkZXBlbmRlbnRPYnNlcnZhYmxlLmlzQWN0aXZlKCkgPyBkZXBlbmRlbnRPYnNlcnZhYmxlIDogdW5kZWZpbmVkKSB9O1xuICAgIH1cblxuICAgIHZhciBsYXN0TWFwcGluZ1Jlc3VsdERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKSxcbiAgICAgICAgZGVsZXRlZEl0ZW1EdW1teVZhbHVlID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG5cbiAgICBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nID0gZnVuY3Rpb24gKGRvbU5vZGUsIGFycmF5LCBtYXBwaW5nLCBvcHRpb25zLCBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMpIHtcbiAgICAgICAgLy8gQ29tcGFyZSB0aGUgcHJvdmlkZWQgYXJyYXkgYWdhaW5zdCB0aGUgcHJldmlvdXMgb25lXG4gICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXIgaXNGaXJzdEV4ZWN1dGlvbiA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KGRvbU5vZGUsIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSkgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGxhc3RNYXBwaW5nUmVzdWx0ID0ga28udXRpbHMuZG9tRGF0YS5nZXQoZG9tTm9kZSwgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5KSB8fCBbXTtcbiAgICAgICAgdmFyIGxhc3RBcnJheSA9IGtvLnV0aWxzLmFycmF5TWFwKGxhc3RNYXBwaW5nUmVzdWx0LCBmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5hcnJheUVudHJ5OyB9KTtcbiAgICAgICAgdmFyIGVkaXRTY3JpcHQgPSBrby51dGlscy5jb21wYXJlQXJyYXlzKGxhc3RBcnJheSwgYXJyYXksIG9wdGlvbnNbJ2RvbnRMaW1pdE1vdmVzJ10pO1xuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSBuZXcgbWFwcGluZyByZXN1bHRcbiAgICAgICAgdmFyIG5ld01hcHBpbmdSZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIGxhc3RNYXBwaW5nUmVzdWx0SW5kZXggPSAwO1xuICAgICAgICB2YXIgbmV3TWFwcGluZ1Jlc3VsdEluZGV4ID0gMDtcblxuICAgICAgICB2YXIgbm9kZXNUb0RlbGV0ZSA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNUb1Byb2Nlc3MgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHZhciBpdGVtc0Zvck1vdmVDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zRm9yQWZ0ZXJBZGRDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIG1hcERhdGE7XG5cbiAgICAgICAgZnVuY3Rpb24gaXRlbU1vdmVkT3JSZXRhaW5lZChlZGl0U2NyaXB0SW5kZXgsIG9sZFBvc2l0aW9uKSB7XG4gICAgICAgICAgICBtYXBEYXRhID0gbGFzdE1hcHBpbmdSZXN1bHRbb2xkUG9zaXRpb25dO1xuICAgICAgICAgICAgaWYgKG5ld01hcHBpbmdSZXN1bHRJbmRleCAhPT0gb2xkUG9zaXRpb24pXG4gICAgICAgICAgICAgICAgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzW2VkaXRTY3JpcHRJbmRleF0gPSBtYXBEYXRhO1xuICAgICAgICAgICAgLy8gU2luY2UgdXBkYXRpbmcgdGhlIGluZGV4IG1pZ2h0IGNoYW5nZSB0aGUgbm9kZXMsIGRvIHNvIGJlZm9yZSBjYWxsaW5nIGZpeFVwQ29udGludW91c05vZGVBcnJheVxuICAgICAgICAgICAgbWFwRGF0YS5pbmRleE9ic2VydmFibGUobmV3TWFwcGluZ1Jlc3VsdEluZGV4KyspO1xuICAgICAgICAgICAga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KG1hcERhdGEubWFwcGVkTm9kZXMsIGRvbU5vZGUpO1xuICAgICAgICAgICAgbmV3TWFwcGluZ1Jlc3VsdC5wdXNoKG1hcERhdGEpO1xuICAgICAgICAgICAgaXRlbXNUb1Byb2Nlc3MucHVzaChtYXBEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGxDYWxsYmFjayhjYWxsYmFjaywgaXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gaXRlbXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGl0ZW1zW2ldLm1hcHBlZE5vZGVzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobm9kZSwgaSwgaXRlbXNbaV0uYXJyYXlFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBlZGl0U2NyaXB0SXRlbSwgbW92ZWRJbmRleDsgZWRpdFNjcmlwdEl0ZW0gPSBlZGl0U2NyaXB0W2ldOyBpKyspIHtcbiAgICAgICAgICAgIG1vdmVkSW5kZXggPSBlZGl0U2NyaXB0SXRlbVsnbW92ZWQnXTtcbiAgICAgICAgICAgIHN3aXRjaCAoZWRpdFNjcmlwdEl0ZW1bJ3N0YXR1cyddKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlbGV0ZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkSW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YSA9IGxhc3RNYXBwaW5nUmVzdWx0W2xhc3RNYXBwaW5nUmVzdWx0SW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdG9wIHRyYWNraW5nIGNoYW5nZXMgdG8gdGhlIG1hcHBpbmcgZm9yIHRoZXNlIG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwRGF0YS5kZXBlbmRlbnRPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YS5kZXBlbmRlbnRPYnNlcnZhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhLmRlcGVuZGVudE9ic2VydmFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFF1ZXVlIHRoZXNlIG5vZGVzIGZvciBsYXRlciByZW1vdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KG1hcERhdGEubWFwcGVkTm9kZXMsIGRvbU5vZGUpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zWydiZWZvcmVSZW1vdmUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXBwaW5nUmVzdWx0LnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9Qcm9jZXNzLnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhLmFycmF5RW50cnkgPT09IGRlbGV0ZWRJdGVtRHVtbXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtc0ZvckJlZm9yZVJlbW92ZUNhbGxiYWNrc1tpXSA9IG1hcERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXNUb0RlbGV0ZS5wdXNoLmFwcGx5KG5vZGVzVG9EZWxldGUsIG1hcERhdGEubWFwcGVkTm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TWFwcGluZ1Jlc3VsdEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInJldGFpbmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1Nb3ZlZE9yUmV0YWluZWQoaSwgbGFzdE1hcHBpbmdSZXN1bHRJbmRleCsrKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwiYWRkZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbU1vdmVkT3JSZXRhaW5lZChpLCBtb3ZlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcERhdGEgPSB7IGFycmF5RW50cnk6IGVkaXRTY3JpcHRJdGVtWyd2YWx1ZSddLCBpbmRleE9ic2VydmFibGU6IGtvLm9ic2VydmFibGUobmV3TWFwcGluZ1Jlc3VsdEluZGV4KyspIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXBwaW5nUmVzdWx0LnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1RvUHJvY2Vzcy5wdXNoKG1hcERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0RXhlY3V0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zRm9yQWZ0ZXJBZGRDYWxsYmFja3NbaV0gPSBtYXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RvcmUgYSBjb3B5IG9mIHRoZSBhcnJheSBpdGVtcyB3ZSBqdXN0IGNvbnNpZGVyZWQgc28gd2UgY2FuIGRpZmZlcmVuY2UgaXQgbmV4dCB0aW1lXG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGRvbU5vZGUsIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSwgbmV3TWFwcGluZ1Jlc3VsdCk7XG5cbiAgICAgICAgLy8gQ2FsbCBiZWZvcmVNb3ZlIGZpcnN0IGJlZm9yZSBhbnkgY2hhbmdlcyBoYXZlIGJlZW4gbWFkZSB0byB0aGUgRE9NXG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydiZWZvcmVNb3ZlJ10sIGl0ZW1zRm9yTW92ZUNhbGxiYWNrcyk7XG5cbiAgICAgICAgLy8gTmV4dCByZW1vdmUgbm9kZXMgZm9yIGRlbGV0ZWQgaXRlbXMgKG9yIGp1c3QgY2xlYW4gaWYgdGhlcmUncyBhIGJlZm9yZVJlbW92ZSBjYWxsYmFjaylcbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKG5vZGVzVG9EZWxldGUsIG9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddID8ga28uY2xlYW5Ob2RlIDoga28ucmVtb3ZlTm9kZSk7XG5cbiAgICAgICAgLy8gTmV4dCBhZGQvcmVvcmRlciB0aGUgcmVtYWluaW5nIGl0ZW1zICh3aWxsIGluY2x1ZGUgZGVsZXRlZCBpdGVtcyBpZiB0aGVyZSdzIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbmV4dE5vZGUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChkb21Ob2RlKSwgbGFzdE5vZGUsIG5vZGU7IG1hcERhdGEgPSBpdGVtc1RvUHJvY2Vzc1tpXTsgaSsrKSB7XG4gICAgICAgICAgICAvLyBHZXQgbm9kZXMgZm9yIG5ld2x5IGFkZGVkIGl0ZW1zXG4gICAgICAgICAgICBpZiAoIW1hcERhdGEubWFwcGVkTm9kZXMpXG4gICAgICAgICAgICAgICAga28udXRpbHMuZXh0ZW5kKG1hcERhdGEsIG1hcE5vZGVBbmRSZWZyZXNoV2hlbkNoYW5nZWQoZG9tTm9kZSwgbWFwcGluZywgbWFwRGF0YS5hcnJheUVudHJ5LCBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMsIG1hcERhdGEuaW5kZXhPYnNlcnZhYmxlKSk7XG5cbiAgICAgICAgICAgIC8vIFB1dCBub2RlcyBpbiB0aGUgcmlnaHQgcGxhY2UgaWYgdGhleSBhcmVuJ3QgdGhlcmUgYWxyZWFkeVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IG5vZGUgPSBtYXBEYXRhLm1hcHBlZE5vZGVzW2pdOyBuZXh0Tm9kZSA9IG5vZGUubmV4dFNpYmxpbmcsIGxhc3ROb2RlID0gbm9kZSwgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgIT09IG5leHROb2RlKVxuICAgICAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXIoZG9tTm9kZSwgbm9kZSwgbGFzdE5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSdW4gdGhlIGNhbGxiYWNrcyBmb3IgbmV3bHkgYWRkZWQgbm9kZXMgKGZvciBleGFtcGxlLCB0byBhcHBseSBiaW5kaW5ncywgZXRjLilcbiAgICAgICAgICAgIGlmICghbWFwRGF0YS5pbml0aWFsaXplZCAmJiBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMobWFwRGF0YS5hcnJheUVudHJ5LCBtYXBEYXRhLm1hcHBlZE5vZGVzLCBtYXBEYXRhLmluZGV4T2JzZXJ2YWJsZSk7XG4gICAgICAgICAgICAgICAgbWFwRGF0YS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSdzIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrLCBjYWxsIGl0IGFmdGVyIHJlb3JkZXJpbmcuXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBhc3N1bWUgdGhhdCB0aGUgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrIHdpbGwgdXN1YWxseSBiZSB1c2VkIHRvIHJlbW92ZSB0aGUgbm9kZXMgdXNpbmdcbiAgICAgICAgLy8gc29tZSBzb3J0IG9mIGFuaW1hdGlvbiwgd2hpY2ggaXMgd2h5IHdlIGZpcnN0IHJlb3JkZXIgdGhlIG5vZGVzIHRoYXQgd2lsbCBiZSByZW1vdmVkLiBJZiB0aGVcbiAgICAgICAgLy8gY2FsbGJhY2sgaW5zdGVhZCByZW1vdmVzIHRoZSBub2RlcyByaWdodCBhd2F5LCBpdCB3b3VsZCBiZSBtb3JlIGVmZmljaWVudCB0byBza2lwIHJlb3JkZXJpbmcgdGhlbS5cbiAgICAgICAgLy8gUGVyaGFwcyB3ZSdsbCBtYWtlIHRoYXQgY2hhbmdlIGluIHRoZSBmdXR1cmUgaWYgdGhpcyBzY2VuYXJpbyBiZWNvbWVzIG1vcmUgY29tbW9uLlxuICAgICAgICBjYWxsQ2FsbGJhY2sob3B0aW9uc1snYmVmb3JlUmVtb3ZlJ10sIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzKTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBzdG9yZWQgdmFsdWVzIG9mIGRlbGV0ZWQgaXRlbXMgd2l0aCBhIGR1bW15IHZhbHVlLiBUaGlzIHByb3ZpZGVzIHR3byBiZW5lZml0czogaXQgbWFya3MgdGhpcyBpdGVtXG4gICAgICAgIC8vIGFzIGFscmVhZHkgXCJyZW1vdmVkXCIgc28gd2Ugd29uJ3QgY2FsbCBiZWZvcmVSZW1vdmUgZm9yIGl0IGFnYWluLCBhbmQgaXQgZW5zdXJlcyB0aGF0IHRoZSBpdGVtIHdvbid0IG1hdGNoIHVwXG4gICAgICAgIC8vIHdpdGggYW4gYWN0dWFsIGl0ZW0gaW4gdGhlIGFycmF5IGFuZCBhcHBlYXIgYXMgXCJyZXRhaW5lZFwiIG9yIFwibW92ZWRcIi5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3NbaV0pIHtcbiAgICAgICAgICAgICAgICBpdGVtc0ZvckJlZm9yZVJlbW92ZUNhbGxiYWNrc1tpXS5hcnJheUVudHJ5ID0gZGVsZXRlZEl0ZW1EdW1teVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluYWxseSBjYWxsIGFmdGVyTW92ZSBhbmQgYWZ0ZXJBZGQgY2FsbGJhY2tzXG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydhZnRlck1vdmUnXSwgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzKTtcbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2FmdGVyQWRkJ10sIGl0ZW1zRm9yQWZ0ZXJBZGRDYWxsYmFja3MpO1xuICAgIH1cbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZycsIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcpO1xua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1snYWxsb3dUZW1wbGF0ZVJld3JpdGluZyddID0gZmFsc2U7XG59XG5cbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLnByb3RvdHlwZSA9IG5ldyBrby50ZW1wbGF0ZUVuZ2luZSgpO1xua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0ga28ubmF0aXZlVGVtcGxhdGVFbmdpbmU7XG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ3JlbmRlclRlbXBsYXRlU291cmNlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgdmFyIHVzZU5vZGVzSWZBdmFpbGFibGUgPSAhKGtvLnV0aWxzLmllVmVyc2lvbiA8IDkpLCAvLyBJRTw5IGNsb25lTm9kZSBkb2Vzbid0IHdvcmsgcHJvcGVybHlcbiAgICAgICAgdGVtcGxhdGVOb2Rlc0Z1bmMgPSB1c2VOb2Rlc0lmQXZhaWxhYmxlID8gdGVtcGxhdGVTb3VyY2VbJ25vZGVzJ10gOiBudWxsLFxuICAgICAgICB0ZW1wbGF0ZU5vZGVzID0gdGVtcGxhdGVOb2Rlc0Z1bmMgPyB0ZW1wbGF0ZVNvdXJjZVsnbm9kZXMnXSgpIDogbnVsbDtcblxuICAgIGlmICh0ZW1wbGF0ZU5vZGVzKSB7XG4gICAgICAgIHJldHVybiBrby51dGlscy5tYWtlQXJyYXkodGVtcGxhdGVOb2Rlcy5jbG9uZU5vZGUodHJ1ZSkuY2hpbGROb2Rlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlVGV4dCA9IHRlbXBsYXRlU291cmNlWyd0ZXh0J10oKTtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KHRlbXBsYXRlVGV4dCwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgfVxufTtcblxua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2UgPSBuZXcga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUoKTtcbmtvLnNldFRlbXBsYXRlRW5naW5lKGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLmluc3RhbmNlKTtcblxua28uZXhwb3J0U3ltYm9sKCduYXRpdmVUZW1wbGF0ZUVuZ2luZScsIGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lKTtcbihmdW5jdGlvbigpIHtcbiAgICBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIERldGVjdCB3aGljaCB2ZXJzaW9uIG9mIGpxdWVyeS10bXBsIHlvdSdyZSB1c2luZy4gVW5mb3J0dW5hdGVseSBqcXVlcnktdG1wbFxuICAgICAgICAvLyBkb2Vzbid0IGV4cG9zZSBhIHZlcnNpb24gbnVtYmVyLCBzbyB3ZSBoYXZlIHRvIGluZmVyIGl0LlxuICAgICAgICAvLyBOb3RlIHRoYXQgYXMgb2YgS25vY2tvdXQgMS4zLCB3ZSBvbmx5IHN1cHBvcnQgalF1ZXJ5LnRtcGwgMS4wLjBwcmUgYW5kIGxhdGVyLFxuICAgICAgICAvLyB3aGljaCBLTyBpbnRlcm5hbGx5IHJlZmVycyB0byBhcyB2ZXJzaW9uIFwiMlwiLCBzbyBvbGRlciB2ZXJzaW9ucyBhcmUgbm8gbG9uZ2VyIGRldGVjdGVkLlxuICAgICAgICB2YXIgalF1ZXJ5VG1wbFZlcnNpb24gPSB0aGlzLmpRdWVyeVRtcGxWZXJzaW9uID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFqUXVlcnlJbnN0YW5jZSB8fCAhKGpRdWVyeUluc3RhbmNlWyd0bXBsJ10pKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgLy8gU2luY2UgaXQgZXhwb3NlcyBubyBvZmZpY2lhbCB2ZXJzaW9uIG51bWJlciwgd2UgdXNlIG91ciBvd24gbnVtYmVyaW5nIHN5c3RlbS4gVG8gYmUgdXBkYXRlZCBhcyBqcXVlcnktdG1wbCBldm9sdmVzLlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXVsndGFnJ11bJ3RtcGwnXVsnb3BlbiddLnRvU3RyaW5nKCkuaW5kZXhPZignX18nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIDEuMC4wcHJlLCBjdXN0b20gdGFncyBzaG91bGQgYXBwZW5kIG1hcmt1cCB0byBhbiBhcnJheSBjYWxsZWQgXCJfX1wiXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAyOyAvLyBGaW5hbCB2ZXJzaW9uIG9mIGpxdWVyeS50bXBsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaChleCkgeyAvKiBBcHBhcmVudGx5IG5vdCB0aGUgdmVyc2lvbiB3ZSB3ZXJlIGxvb2tpbmcgZm9yICovIH1cblxuICAgICAgICAgICAgcmV0dXJuIDE7IC8vIEFueSBvbGRlciB2ZXJzaW9uIHRoYXQgd2UgZG9uJ3Qgc3VwcG9ydFxuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGVuc3VyZUhhc1JlZmVyZW5jZWRKUXVlcnlUZW1wbGF0ZXMoKSB7XG4gICAgICAgICAgICBpZiAoalF1ZXJ5VG1wbFZlcnNpb24gPCAyKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdXIgdmVyc2lvbiBvZiBqUXVlcnkudG1wbCBpcyB0b28gb2xkLiBQbGVhc2UgdXBncmFkZSB0byBqUXVlcnkudG1wbCAxLjAuMHByZSBvciBsYXRlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBleGVjdXRlVGVtcGxhdGUoY29tcGlsZWRUZW1wbGF0ZSwgZGF0YSwgalF1ZXJ5VGVtcGxhdGVPcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXShjb21waWxlZFRlbXBsYXRlLCBkYXRhLCBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1sncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgICAgICAgICAgdGVtcGxhdGVEb2N1bWVudCA9IHRlbXBsYXRlRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIGVuc3VyZUhhc1JlZmVyZW5jZWRKUXVlcnlUZW1wbGF0ZXMoKTtcblxuICAgICAgICAgICAgLy8gRW5zdXJlIHdlIGhhdmUgc3RvcmVkIGEgcHJlY29tcGlsZWQgdmVyc2lvbiBvZiB0aGlzIHRlbXBsYXRlIChkb24ndCB3YW50IHRvIHJlcGFyc2Ugb24gZXZlcnkgcmVuZGVyKVxuICAgICAgICAgICAgdmFyIHByZWNvbXBpbGVkID0gdGVtcGxhdGVTb3VyY2VbJ2RhdGEnXSgncHJlY29tcGlsZWQnKTtcbiAgICAgICAgICAgIGlmICghcHJlY29tcGlsZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVUZXh0ID0gdGVtcGxhdGVTb3VyY2VbJ3RleHQnXSgpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgLy8gV3JhcCBpbiBcIndpdGgoJHdoYXRldmVyLmtvQmluZGluZ0NvbnRleHQpIHsgLi4uIH1cIlxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVGV4dCA9IFwie3trb193aXRoICRpdGVtLmtvQmluZGluZ0NvbnRleHR9fVwiICsgdGVtcGxhdGVUZXh0ICsgXCJ7ey9rb193aXRofX1cIjtcblxuICAgICAgICAgICAgICAgIHByZWNvbXBpbGVkID0galF1ZXJ5SW5zdGFuY2VbJ3RlbXBsYXRlJ10obnVsbCwgdGVtcGxhdGVUZXh0KTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZVsnZGF0YSddKCdwcmVjb21waWxlZCcsIHByZWNvbXBpbGVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBbYmluZGluZ0NvbnRleHRbJyRkYXRhJ11dOyAvLyBQcmV3cmFwIHRoZSBkYXRhIGluIGFuIGFycmF5IHRvIHN0b3AganF1ZXJ5LnRtcGwgZnJvbSB0cnlpbmcgdG8gdW53cmFwIGFueSBhcnJheXNcbiAgICAgICAgICAgIHZhciBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMgPSBqUXVlcnlJbnN0YW5jZVsnZXh0ZW5kJ10oeyAna29CaW5kaW5nQ29udGV4dCc6IGJpbmRpbmdDb250ZXh0IH0sIG9wdGlvbnNbJ3RlbXBsYXRlT3B0aW9ucyddKTtcblxuICAgICAgICAgICAgdmFyIHJlc3VsdE5vZGVzID0gZXhlY3V0ZVRlbXBsYXRlKHByZWNvbXBpbGVkLCBkYXRhLCBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMpO1xuICAgICAgICAgICAgcmVzdWx0Tm9kZXNbJ2FwcGVuZFRvJ10odGVtcGxhdGVEb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTsgLy8gVXNpbmcgXCJhcHBlbmRUb1wiIGZvcmNlcyBqUXVlcnkvalF1ZXJ5LnRtcGwgdG8gcGVyZm9ybSBuZWNlc3NhcnkgY2xlYW51cCB3b3JrXG5cbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWydmcmFnbWVudHMnXSA9IHt9OyAvLyBDbGVhciBqUXVlcnkncyBmcmFnbWVudCBjYWNoZSB0byBhdm9pZCBhIG1lbW9yeSBsZWFrIGFmdGVyIGEgbGFyZ2UgbnVtYmVyIG9mIHRlbXBsYXRlIHJlbmRlcnNcbiAgICAgICAgICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzWydjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snXSA9IGZ1bmN0aW9uKHNjcmlwdCkge1xuICAgICAgICAgICAgcmV0dXJuIFwie3trb19jb2RlICgoZnVuY3Rpb24oKSB7IHJldHVybiBcIiArIHNjcmlwdCArIFwiIH0pKCkpIH19XCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpc1snYWRkVGVtcGxhdGUnXSA9IGZ1bmN0aW9uKHRlbXBsYXRlTmFtZSwgdGVtcGxhdGVNYXJrdXApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LndyaXRlKFwiPHNjcmlwdCB0eXBlPSd0ZXh0L2h0bWwnIGlkPSdcIiArIHRlbXBsYXRlTmFtZSArIFwiJz5cIiArIHRlbXBsYXRlTWFya3VwICsgXCI8XCIgKyBcIi9zY3JpcHQ+XCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChqUXVlcnlUbXBsVmVyc2lvbiA+IDApIHtcbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWyd0bXBsJ11bJ3RhZyddWydrb19jb2RlJ10gPSB7XG4gICAgICAgICAgICAgICAgb3BlbjogXCJfXy5wdXNoKCQxIHx8ICcnKTtcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWyd0bXBsJ11bJ3RhZyddWydrb193aXRoJ10gPSB7XG4gICAgICAgICAgICAgICAgb3BlbjogXCJ3aXRoKCQxKSB7XCIsXG4gICAgICAgICAgICAgICAgY2xvc2U6IFwifSBcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlID0gbmV3IGtvLnRlbXBsYXRlRW5naW5lKCk7XG4gICAga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZTtcblxuICAgIC8vIFVzZSB0aGlzIG9uZSBieSBkZWZhdWx0ICpvbmx5IGlmIGpxdWVyeS50bXBsIGlzIHJlZmVyZW5jZWQqXG4gICAgdmFyIGpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZUluc3RhbmNlID0gbmV3IGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZSgpO1xuICAgIGlmIChqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmVJbnN0YW5jZS5qUXVlcnlUbXBsVmVyc2lvbiA+IDApXG4gICAgICAgIGtvLnNldFRlbXBsYXRlRW5naW5lKGpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZUluc3RhbmNlKTtcblxuICAgIGtvLmV4cG9ydFN5bWJvbCgnanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lJywga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lKTtcbn0pKCk7XG59KSk7XG59KCkpO1xufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2tub2Nrb3V0L2J1aWxkL291dHB1dC9rbm9ja291dC1sYXRlc3QuZGVidWcuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2tub2Nrb3V0L2J1aWxkL291dHB1dC9rbm9ja291dC1sYXRlc3QuZGVidWcuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgVmlld01vZGVsQ29uZmlndXJhdG9yIH0gZnJvbSAnLi9UeXBlcydcblxuZXhwb3J0IGludGVyZmFjZSBJSHR0cEhlYWRlciB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlc3BvbnNlSGFuZGxlciB7XG4gICAgKHJlc3BvbnNlOiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodHRwR2V0KHVybDogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2s6IElSZXNwb25zZUhhbmRsZXIsIGZhaWx1cmVDYWxsYmFjazogSVJlc3BvbnNlSGFuZGxlciwgLi4uaGVhZGVyczogSUh0dHBIZWFkZXJbXSk6IHZvaWQge1xuICAgIHZhciBhamF4ID0gbmV3IEFqYXgoKTtcbiAgICBhamF4LnNlbmQodXJsLCBIdHRwVmVyYi5HRVQsIG51bGwsIHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrLCBoZWFkZXJzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0dHBQb3N0KHVybDogc3RyaW5nLCBkYXRhOiB7fSwgc3VjY2Vzc0NhbGxiYWNrOiBJUmVzcG9uc2VIYW5kbGVyLCBmYWlsdXJlQ2FsbGJhY2s6IElSZXNwb25zZUhhbmRsZXIsIC4uLmhlYWRlcnM6IElIdHRwSGVhZGVyW10pIHtcbiAgICB2YXIgYWpheCA9IG5ldyBBamF4KCk7XG4gICAgYWpheC5zZW5kKHVybCwgSHR0cFZlcmIuUE9TVCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2ssIGhlYWRlcnMpO1xufVxuXG5jbGFzcyBIdHRwVmVyYiB7XG4gICAgcHVibGljIHN0YXRpYyBDT05ORUNUID0gJ0NPTk5FQ1QnO1xuICAgIHB1YmxpYyBzdGF0aWMgREVMRVRFID0gJ0RFTEVURSc7XG4gICAgcHVibGljIHN0YXRpYyBHRVQgPSAnR0VUJztcbiAgICBwdWJsaWMgc3RhdGljIEhFQUQgPSAnSEVBRCc7XG4gICAgcHVibGljIHN0YXRpYyBPUFRJT05TID0gJ09QVElPTlMnO1xuICAgIHB1YmxpYyBzdGF0aWMgUE9TVCA9ICdQT1NUJztcbiAgICBwdWJsaWMgc3RhdGljIFBVVCA9ICdQVVQnO1xuICAgIHB1YmxpYyBzdGF0aWMgVFJBQ0UgPSAnVFJBQ0UnO1xufVxuXG5jbGFzcyBBamF4IHtcbiAgICBzZW5kKHVybDogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgZGF0YToge30sIHN1Y2Nlc3NDYWxsYmFjazogSVJlc3BvbnNlSGFuZGxlciwgZmFpbHVyZUNhbGxiYWNrOiBJUmVzcG9uc2VIYW5kbGVyLCBoZWFkZXJzOiBJSHR0cEhlYWRlcltdKTogdm9pZCB7XG4gICAgICAgIHZhciBpc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gdGhpcy5nZXRSZXF1ZXN0T2JqZWN0KCk7XG4gICAgICAgIHZhciB1bmlxdWVVcmwgPSB0aGlzLmdldENhY2hlQnVzdGVyVXJsKHVybCk7XG5cbiAgICAgICAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVhZGVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlcnNbaV0ubmFtZSwgaGVhZGVyc1tpXS52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCAmJiAhaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUmVzcG9uc2VTdWNjZXNzKHJlcXVlc3Quc3RhdHVzKSkge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2suY2FsbChyZXF1ZXN0LCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlQ2FsbGJhY2suY2FsbChyZXF1ZXN0LCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSZXF1ZXN0T2JqZWN0KCk6IFhNTEh0dHBSZXF1ZXN0IHtcbiAgICAgICAgdmFyIHJlcXVlc3RPYmplY3Q6IFhNTEh0dHBSZXF1ZXN0O1xuICAgICAgICBpZiAoWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgIHJlcXVlc3RPYmplY3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdE9iamVjdCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RPYmplY3QgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXF1ZXN0T2JqZWN0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2FjaGVCdXN0ZXJVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPiAtMSkge1xuICAgICAgICAgICAgdXJsICs9ICcmJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsICs9ICc/JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1Jlc3BvbnNlU3VjY2VzcyhyZXNwb25zZUNvZGU6IG51bWJlcikge1xuICAgICAgICB2YXIgZmlyc3REaWdpdCA9IHJlc3BvbnNlQ29kZS50b1N0cmluZygpLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgc3dpdGNoIChmaXJzdERpZ2l0KSB7XG4gICAgICAgICAgICBjYXNlICcxJzpcbiAgICAgICAgICAgIGNhc2UgJzInOlxuICAgICAgICAgICAgY2FzZSAnMyc6XG4gICAgICAgICAgICAgICAgLy8gUmVzcG9uc2UgY29kZSBpcyBpbiAxMDAsIDIwMCBvciAzMDAgcmFuZ2UgOilcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gUmVzcG9uc2UgY29kZSBpcyBpcyA0MDAgb3IgNTAwIHJhbmdlIDooXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9BamF4LnRzIiwiaW1wb3J0IHsgXG4gICAgVmlld01vZGVsQ29uZmlndXJhdG9yLCBcbiAgICBQcm9wZXJ0eUNoYW5nZWRDb250ZXh0LCBcbiAgICBQcm9wZXJ0eUNoYW5nZWRFeHRlbmRlckNvbnRleHQsXG4gICAgRXZlbnRzXG59IGZyb20gJy4vVHlwZXMnXG5pbXBvcnQgKiBhcyBhamF4IGZyb20gXCIuL0FqYXhcIlxuaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCJcbmltcG9ydCAqIGFzIHBzIGZyb20gXCIuL1B1YlN1YlwiXG5cbig8YW55PmtvLmV4dGVuZGVycykucHJvcGVydHlDaGFuZ2VkID0gZnVuY3Rpb24odGFyZ2V0Oktub2Nrb3V0T2JzZXJ2YWJsZTxhbnk+LCBleHRlbmRlckNvbnRleHQ6UHJvcGVydHlDaGFuZ2VkRXh0ZW5kZXJDb250ZXh0KTphbnkge1xuICAgIGlmKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgZG9tQ29udGFpbmVyOmFueTtcbiAgICAgICAgICAgIGRvbUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGV4dGVuZGVyQ29udGV4dC5jb250YWluZXJJZCk7XG4gICAgICAgICAgICBpZighZG9tQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29udGFpbmVySWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmlld01vZGVsOiBCYXNlVmlld01vZGVsID0ga28uZGF0YUZvcihkb21Db250YWluZXIpO1xuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB2aWV3TW9kZWwuY29uZmlndXJhdG9yLnByb3BlcnRpZXM7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlEZWZpbml0aW9uID0ga28udXRpbHMuYXJyYXlGaXJzdChwcm9wZXJ0aWVzLCAocHJvcCkgPT4gcHJvcC5vcmlnaW5hbE5hbWUgPT0gZXh0ZW5kZXJDb250ZXh0LnByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICBsZXQgY2hhbmdlZENvbnRleHQgPSBuZXcgUHJvcGVydHlDaGFuZ2VkQ29udGV4dChcbiAgICAgICAgICAgICAgICBleHRlbmRlckNvbnRleHQucHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlLFxuICAgICAgICAgICAgICAgIHZpZXdNb2RlbCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eURlZmluaXRpb25cbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHBzLlB1YlN1Yi5wdWJsaXNoKEV2ZW50c1tFdmVudHMuUHJvcGVydHlDaGFuZ2VkXSwgY2hhbmdlZENvbnRleHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYXNlVmlld01vZGVsIHtcbiAgICBjb25maWd1cmF0b3I6IFZpZXdNb2RlbENvbmZpZ3VyYXRvcjtcbiAgICBzdWJtaXRUZXh0Oktub2Nrb3V0T2JzZXJ2YWJsZTxhbnk+XG4gICAgZXhjbHVkZVByb3BzOnN0cmluZ1tdID0gW1wiZGF0YVwiLCBcInN1Ym1pdFRleHRcIiwgXCJjYW5TYXZlXCIsIFwiY29uZmlndXJhdG9yXCIsIFwib2JqZWN0U3RhdGVcIl07XG4gICAgXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZ3VyYXRvcjogVmlld01vZGVsQ29uZmlndXJhdG9yKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdG9yID0gY29uZmlndXJhdG9yO1xuICAgICAgICB0aGlzLnN1Ym1pdFRleHQgPSBrby5vYnNlcnZhYmxlKFwiQ3JlYXRlXCIpXG4gICAgICAgIC5leHRlbmQoeyBwcm9wZXJ0eUNoYW5nZWQ6IG5ldyBQcm9wZXJ0eUNoYW5nZWRFeHRlbmRlckNvbnRleHQoY29uZmlndXJhdG9yLmNvbnRhaW5lcklkLCBcInN1Ym1pdFRleHRcIikgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdWNjZXNzQ2FsbGJhY2soY29udGV4dDphbnkpIHtcblxuICAgIH0gXG5cbiAgICBwcml2YXRlIGZhaWx1cmVDYWxsYmFjayhjb250ZXh0OmFueSkge1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZVdlYlJlc3VsdChjb250ZXh0OiBhbnkpIHtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIGFqYXguaHR0cFBvc3QoXCIvYXBpL3NhdmVtb2RlbFwiLCB7aWQ6IDEsIG5hbWU6IFwiamhvblwifSwgdGhpcy5zdWNjZXNzQ2FsbGJhY2ssIHRoaXMuZmFpbHVyZUNhbGxiYWNrKTsgICAgICAgXG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9CYXNlVmlld01vZGVsLnRzIiwiaW1wb3J0IHsgVmlld01vZGVsQ29uZmlndXJhdG9yLCBQcm9wZXJ0eUNoYW5nZWRFeHRlbmRlckNvbnRleHQgfSBmcm9tIFwiLi9UeXBlc1wiO1xuaW1wb3J0IHsgQmFzZVZpZXdNb2RlbCB9IGZyb20gXCIuL0Jhc2VWaWV3TW9kZWxcIjtcbmltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgRGVmYXVsdFZpZXdNb2RlbCBleHRlbmRzIEJhc2VWaWV3TW9kZWwge1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbml0Q2FsbGJhY2s6IChtb2RlbDogRGVmYXVsdFZpZXdNb2RlbCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBjb3VudDogS25vY2tvdXRPYnNlcnZhYmxlPG51bWJlcj47XG4gIHByaXZhdGUgcGhvbmU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+O1xuICBjb25zdHJ1Y3RvcihcbiAgICBjb25maWd1cmF0b3I6IFZpZXdNb2RlbENvbmZpZ3VyYXRvcixcbiAgICBpbml0Q2FsbGJhY2s/OiAobW9kZWw6IERlZmF1bHRWaWV3TW9kZWwpID0+IHZvaWRcbiAgKSB7XG4gICAgc3VwZXIoY29uZmlndXJhdG9yKTtcbiAgICB0aGlzLl9pbml0Q2FsbGJhY2sgPSBpbml0Q2FsbGJhY2s7XG4gICAgdGhpcy5jb3VudCA9IGtvLm9ic2VydmFibGUoMCk7XG4gICAgdGhpcy5waG9uZSA9IGtvLm9ic2VydmFibGUoXCJcIikuZXh0ZW5kKHtcbiAgICAgIHByb3BlcnR5Q2hhbmdlZDogbmV3IFByb3BlcnR5Q2hhbmdlZEV4dGVuZGVyQ29udGV4dChcbiAgICAgICAgY29uZmlndXJhdG9yLmNvbnRhaW5lcklkLFxuICAgICAgICBcInBob25lXCJcbiAgICAgIClcbiAgICB9KTtcbiAgfVxuICBjb3VudGVyKCkge1xuICAgIHZhciBjb3VudCA9IHRoaXMuY291bnQoKTtcbiAgICBjb25zb2xlLmxvZyhcIkNvdW50OlwiLCBjb3VudCk7XG4gICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgdGhpcy5zdWJtaXRUZXh0KFwiQ2xpY2tlZC1cIiArIGNvdW50KTtcbiAgICB0aGlzLmNvdW50KGNvdW50KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0RlZmF1bHRWaWV3TW9kZWwudHMiLCJpbXBvcnQgeyBCYXNlVmlld01vZGVsIH0gZnJvbSBcIi4vQmFzZVZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgRGVmYXVsdFZpZXdNb2RlbCB9IGZyb20gXCIuL0RlZmF1bHRWaWV3TW9kZWxcIjtcbmltcG9ydCB7XG4gIFZpZXdNb2RlbENvbmZpZ3VyYXRvcixcbiAgUHJvcGVydHlEZWZpbml0aW9uLFxuICBJbnB1dFR5cGUsXG4gIEV2ZW50c1xufSBmcm9tIFwiLi9UeXBlc1wiO1xuaW1wb3J0ICogYXMgcHMgZnJvbSBcIi4vUHViU3ViXCI7XG5pbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcblxuLy8gZG9tIGVsZW1lbnQgaWRcbmxldCBjb250YWluZXJJZCA9IFwiY29udGFpbmVyXCI7XG5cbnZhciBwcm9wMTogUHJvcGVydHlEZWZpbml0aW9uID0ge1xuICBpZDogXCIxXCIsXG4gIGlucHV0VHlwZTogSW5wdXRUeXBlLlRleHQsXG4gIGxhYmVsOiBcIlVzZXIgRnVsbG5hbWVcIixcbiAgbmFtZTogXCJGdWxsbmFtZVwiLFxuICBvcmlnaW5hbE5hbWU6IFwiZnVsbG5hbWVcIixcbiAgdHlwZTogXCJTdHJpbmdcIlxufTtcblxudmFyIHByb3AyOiBQcm9wZXJ0eURlZmluaXRpb24gPSB7XG4gIGlkOiBcIjJcIixcbiAgaW5wdXRUeXBlOiBJbnB1dFR5cGUuVGV4dCxcbiAgbGFiZWw6IFwiUGhvbmUgTnVtYmVyXCIsXG4gIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXG4gIG9yaWdpbmFsTmFtZTogXCJwaG9uZVwiLFxuICB0eXBlOiBcIlN0cmluZ1wiXG59O1xuXG5sZXQgcHJvcGVydGllczogUHJvcGVydHlEZWZpbml0aW9uW10gPSBbcHJvcDEsIHByb3AyXTtcblxubGV0IGNvbmZpZ3VyYXRvciA9IG5ldyBWaWV3TW9kZWxDb25maWd1cmF0b3IoY29udGFpbmVySWQpO1xuY29uZmlndXJhdG9yLnByb3BlcnRpZXMgPSBbcHJvcDEsIHByb3AyXTtcblxubGV0IHZpZXdNb2RlbCA9IG5ldyBEZWZhdWx0Vmlld01vZGVsKGNvbmZpZ3VyYXRvciwgbW9kZWwgPT4ge1xuICBjb25zb2xlLmxvZyhcImluaXQgY2FsbGJhY2tcIiwgbW9kZWwpO1xufSk7XG4oPGFueT53aW5kb3cpLnZpZXdNb2RlbCA9IHZpZXdNb2RlbDtcblxuZm9yICh2YXIga2V5IGluIHZpZXdNb2RlbCkge1xuICBjb25zb2xlLmxvZyhcImluc3RhbmNlIHByb3AgbmFtZTpcIiwga2V5KTtcbn1cblxucHMuUHViU3ViLnN1YnNjcmliZShFdmVudHNbRXZlbnRzLlByb3BlcnR5Q2hhbmdlZF0sICh0b3BpYywgY29udGV4dCkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlB1YlN1YiBQcm9wZXJ0eUNoYW5nZWQ6IFwiLCBjb250ZXh0KTtcbn0pO1xuXG4oPGFueT53aW5kb3cpLlB1YlN1YiA9IHBzLlB1YlN1YjtcblxuLy8gYXBwbHkgYmluZGluZ3NcbmtvLmFwcGx5QmluZGluZ3Modmlld01vZGVsLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01haW4udHMiLCJleHBvcnQgbmFtZXNwYWNlIFB1YlN1YiB7XG4gICAgbGV0IHRvcGljczphbnkgPSB7fTtcbiAgICBsZXQgc3ViVWlkOm51bWJlciA9IC0xO1xuICAgIGV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoKHRvcGljOnN0cmluZywgY29udGV4dDphbnkpIHtcbiAgICAgICAgaWYoIXRvcGljc1t0b3BpY10pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHN1YnNjcmliZXJzID0gdG9waWNzW3RvcGljXSxcbiAgICAgICAgICAgICAgICBsZW4gPSBzdWJzY3JpYmVycyA/IHN1YnNjcmliZXJzLmxlbmd0aCA6IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2xlbl0uZnVuYyh0b3BpYywgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gc3Vic2NyaWJlKHRvcGljOnN0cmluZywgZnVuYzoodG9waWM6c3RyaW5nLCBjb250ZXh0OmFueSkgPT4gdm9pZCkge1xuICAgICAgICBpZiAoIXRvcGljc1t0b3BpY10pIHtcbiAgICAgICAgICAgIHRvcGljc1t0b3BpY10gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b2tlbiA9ICgrK3N1YlVpZCkudG9TdHJpbmcoKTtcbiAgICAgICAgdG9waWNzW3RvcGljXS5wdXNoKHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIGZ1bmM6IGZ1bmNcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG4gICAgZXhwb3J0IGZ1bmN0aW9uIHVuc3Vic2NyaWJlKHRva2VuOnN0cmluZykge1xuICAgICAgICBmb3IgKHZhciBtIGluIHRvcGljcykge1xuICAgICAgICAgICAgaWYgKHRvcGljc1ttXSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdG9waWNzW21dLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9waWNzW21dW2ldLnRva2VuID09PSB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9waWNzW21dLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QdWJTdWIudHMiLCJpbXBvcnQgeyBCYXNlVmlld01vZGVsIH0gZnJvbSBcIi4vQmFzZVZpZXdNb2RlbFwiXG5cbmV4cG9ydCBlbnVtIFJlc3VsdFN0YXRlIHtcbiAgICBVbnNldCA9IDAsXG4gICAgU3VjY2VzcyxcbiAgICBXYXJuaW5nLFxuICAgIEVycm9yLFxuICAgIEludmFsaWQsXG4gICAgRmFpbFxufVxuXG5leHBvcnQgZW51bSBFdmVudHMge1xuICAgIFByb3BlcnR5Q2hhbmdlZCA9IDBcbn1cblxuZXhwb3J0IGVudW0gSW5wdXRUeXBlXG57XG4gICAgQ2hlY2tCb3g9MCxcbiAgICBIaWRkZW4sXG4gICAgUGFzc3dvcmQsXG4gICAgUmFkaW8sXG4gICAgVGV4dCxcbiAgICBFbnVtLFxuICAgIFNlbGVjdCxcbiAgICBEYXRlVGltZVxufVxuXG5leHBvcnQgY2xhc3MgUHJvcGVydHlEZWZpbml0aW9uIHtcbiAgICBpZDpzdHJpbmc7XG4gICAgbmFtZTpzdHJpbmc7XG4gICAgb3JpZ2luYWxOYW1lOnN0cmluZztcbiAgICBsYWJlbDpzdHJpbmc7XG4gICAgdHlwZTpzdHJpbmc7XG4gICAgaW5wdXRUeXBlOklucHV0VHlwZTtcbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdNb2RlbENvbmZpZ3VyYXRvciB7XG4gICAgY29udGFpbmVySWQ6c3RyaW5nO1xuICAgIGZvcm1JZDpzdHJpbmc7XG4gICAgYXBpVXJsUm9vdDpzdHJpbmc7XG4gICAgcHJvcGVydGllczpQcm9wZXJ0eURlZmluaXRpb25bXTtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJJZCA9IGNvbnRhaW5lcklkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3BlcnR5Q2hhbmdlZENvbnRleHQge1xuICAgIG5hbWU6c3RyaW5nO1xuICAgIHZpZXdNb2RlbDpCYXNlVmlld01vZGVsO1xuICAgIG5ld1ZhbHVlOmFueTtcbiAgICBwcm9wZXJ0eURlZmluaXRpb246IFByb3BlcnR5RGVmaW5pdGlvbiAgICBcbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgbmV3VmFsdWU6YW55LCB2aWV3TW9kZWw6QmFzZVZpZXdNb2RlbCwgcHJvcGVydHlEZWZpbml0aW9uOiBQcm9wZXJ0eURlZmluaXRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IHZpZXdNb2RlbDtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eURlZmluaXRpb24gPSBwcm9wZXJ0eURlZmluaXRpb25cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eUNoYW5nZWRFeHRlbmRlckNvbnRleHQge1xuICAgIGNvbnRhaW5lcklkOnN0cmluZzsgICAgXG4gICAgcHJvcGVydHlOYW1lOnN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZDogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVySWQgPSBjb250YWluZXJJZDtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW9kZWxWYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBuYW1lOnN0cmluZztcbiAgICBtZXNzYWdlczpzdHJpbmdbXSA9IFtdO1xuICAgIGdldCBhbGxNZXNzYWdlcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlcy5qb2luKFwiLFwiKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJSZXN1bHQge1xuICAgIGlkOnN0cmluZztcbiAgICB0aXRsZTpzdHJpbmc7XG4gICAgY29udGVudDpzdHJpbmc7XG4gICAgZHVyYXRpb246bnVtYmVyID0gMjAwMDtcbiAgICBzdGF0ZTpSZXN1bHRTdGF0ZSA9IFJlc3VsdFN0YXRlLlN1Y2Nlc3M7XG4gICAgdmFsaWRhdGlvbnM6TW9kZWxWYWxpZGF0aW9uUmVzdWx0W10gPSBbXTtcbiAgICBnZXQgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYodGhpcy5zdGF0ZSAhPSBSZXN1bHRTdGF0ZS5TdWNjZXNzIHx8IHRoaXMudmFsaWRhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBnZXQgcmVzdWx0U3RhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFJlc3VsdFN0YXRlW3RoaXMuc3RhdGVdXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViUmVzdWx0T2ZUPFQ+IGV4dGVuZHMgV2ViUmVzdWx0IHtcbiAgICByZXN1bHQ6VDtcbiAgICBjb25zdHJ1Y3RvcihpbnN0YW5jZTpUKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gaW5zdGFuY2U7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9UeXBlcy50cyJdLCJzb3VyY2VSb290IjoiIn0=