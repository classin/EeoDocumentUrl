(function(w) {
	function ClassInApp() {
		var classInApp = this;
		classInApp.isLoadFinish=false;
		classInApp.needHistory=false;
		classInApp.bindAPI=function(){
			console.log('Please run classInApp loadFinish function and waiting server bindAPI to classInApp.');
		}
		classInApp.appDataInit = function(){
			console.log('Please run classInApp loadFinish function and waiting server bindAPI to classInApp.');
		}
		classInApp.loadFinish = function(){
			classInApp.isLoadFinish=true;
		}
		classInApp.on=function(eventType,eventCallback){
			switch(eventType){
				case 'getSyncDataJSON':
					(typeof eventCallback == 'function') && classInApp.fileSyncEventArr.push(eventCallback);
					break;
			}
		}

		classInApp.config = function(configOption) {
			if(typeof configOption == 'object') {
				classInApp.appId = configOption.appId || '';
				(typeof configOption.bindAPI == 'function') && (classInApp.bindAPI=configOption.bindAPI);
				(typeof configOption.appDataInit == 'function') && (classInApp.appDataInit=configOption.appDataInit);
				(typeof configOption.needHistory == 'boolean') && (classInApp.needHistory=configOption.needHistory);
			}
		}

	}
	w.classInApp = new ClassInApp();
})(window);