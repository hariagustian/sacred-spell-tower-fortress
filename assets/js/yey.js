	 
!function( global, owlApp ){
	 
	global[ 'owl' ] = {};
	
	var owl = global.owl,
	modules = {};
	owl.register = owl.register || {};
	owl.namespace = owl.namespace || {};
	owl.namespace['__namespace__'] = [];
	owl.args = owl.args || [];
	owl.sceneLoader = owl.sceneLoader || [];
	owl.dataLoader = owl.dataLoader || [];
	owl.config = owl.config || {};
	owl.owlModules = [];
	  
	
	/**
		modules
	*/
	var owl = global.owl;
	
	owl.owlModules.push({
		
		'dom' : function(){
			  
			this.attachListener = function( el, listener, callback ){

				function _parentAttach( el, lstn, callback ){

					function _attach( el, lstn ){
						if(el !== window){
							el.addEventListener(lstn, callback, false);
						}else{
							el.attachEvent && el.attachEvent('on'+lstn, callback) ||
								el.addEventListener(lstn, callback, false)
						}
						
						if( lstn === 'mousedown' ){
							el.addEventListener( 'touchstart', callback, false)
						}
						else if( lstn === 'mousemove'){
							el.addEventListener( 'touchmove', callback, false)
						}
						else if( lstn === 'mouseup'){
							el.addEventListener( 'touchend', callback, false)
						}
						else if( lstn === 'mouseout'){
							el.addEventListener( 'touchleave', callback, false)
						}

					}

					lstn = lstn.indexOf(' ')  === -1 ? lstn : lstn.split(' ');
					lstn = lstn.length <= 1 ? lstn.join('') : lstn;

					if(lstn instanceof Array)
					{
						while(lstn.length)
							_attach( el, lstn.pop() );
					}else
						_attach( el, lstn );
				}

				if( this.objToString &&
					'[object Array]' === this.objToString( el ))
					{
						while(el.length)
						{
							_parentAttach( el.pop(), listener, callback);
						}
				}else{

					_parentAttach( el, listener, callback )

				}
			};

			this.isTwoDimensional = function(el){
				return /([object Array])/i.test(this.objToString(el))
					&& this.slice(el,0).length ? true : false
			}
		
			this.hasClassName = function( element, a ){ 
				return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(element.className) 
			}
			
			this.removeClassFn = function (el, className) {
				if(-1 !== className.indexOf(' ') && className.split(' ').length > 1){
					var test = el.className.toLowerCase().split(' ');
					for (var ii = test.length - 1; ii >= 0 ; ii--){
						if(this.inArray(test[ii], className.split(' ')))
							delete test[ii];
					}

					el.className = test.join(' ');
				}else if(this.hasClassName(el, className)) {
					var a = el.className;
					el.className = a.replace(new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)", "g"), " ");
				}
			}

			this.addClassFn = function (el, className) {
				if (!this.hasClassName(el, className)) {
					el.className = [el.className, className].join(" ");
				}
			}
			  
			this.nthParent = function(element, n) {
			  while(n-- && element)  
				element = element.parentNode;
			  return element;
			}
			
			this.parentLastchild = function(el){

				var temp = [];
				do {
					 el =  el.nextSibling;

					 if(el.nodeType == 1){
						temp.push(el)
					 }
				}

				while (el.nextSibling);


				return temp[temp.length - 1];
			}

			this.parentFirstchild = function(el){

				var temp = [];
				do {
					 el =  el.previousSibling;

					 if(el.nodeType == 1){
						temp.push(el)
					 }
				}

				while (el.previousSibling);

				return temp[temp.length - 1];
			}
			
			this.getLastChild = function(el){
				var temp = [],
				firstChild = this.getFirstChild( el );
				
				do {
					 var firstChild =  firstChild.nextSibling;

					 if( firstChild.nodeType == 1 ){
						temp.push( firstChild )
					 }
				}

				while ( firstChild.nextSibling);
				

				return temp[temp.length - 1];
			}
			
			this.getFirstChild = function(el){
				  var f = el.firstChild;
				  while( f && f.nodeType == 3 ){
						f = f.nextSibling;
				  }
				  return  f === null ? false : f;

			}

			this.sibling = function (el,prev) {

				do {
					el = prev == 'previous' ?
						 el.previousSibling :
						 el.nextSibling;
				}

				while (el && el.nodeType != 1);

				return el === null ? false : el;
			}

			this.qsAll = function(idClass, activeEl){
				var idClass = idClass.indexOf('.') === -1 ? '.'+idClass : idClass;
				return !!activeEl && activeEl.querySelectorAll(idClass) || document.querySelectorAll(idClass)
			}

			this.qs = function(idClass, activeEl){

				var idClass = idClass.indexOf('.') === -1 ? '.'+idClass : idClass;

				return !!activeEl && activeEl.querySelector(idClass) || document.querySelector(idClass)

			}

			this.id = function id(idName){
				return document.getElementById(idName)
			}

			this.addClass = function (el, className) {
				
				if( el instanceof Array ){
					
					while( el.length ){
						element = el.pop();
						this.addClassFn( element,className)
					}
				}else{
				
					this.addClassFn(el,className)
				} 
			}

			this.removeClass = function (el, className) {
				
				if( el instanceof Array ){
					
					while( el.length ){
						element = el.pop();
						this.removeClassFn( element,className)
					}
				}else{
				
					this.removeClassFn(el,className)
				}
				 
			}

			this.css = function (element, obj, trans) {
				var scope = this, objContent, objContentTranslate, objContentTransform;
				function fn(el)
				{
					for (var key in obj) if (key in obj)
					{
						objContent = obj[key];
							
						switch(key)
						{
						//transform translate3d
						case 'transform':
							objContent = obj[key].split(','),
							x = objContent[0],
							y = objContent[1],
							z = objContent[2],
							objContentTransform = "translate3d("+x+","+y+","+z+")";
							
							var style = el.style, prop;
							
							prop = typeof  style.transform !== "undefined"  ? 'transform' : 
								typeof style.webkitTransform !== "undefined"  ? "webkitTransform" : "MozTransform";
								
							style[ prop ] = objContentTransform;
								 
							break;


						//transitions
						case 'transition':
						 
							objContent = obj[key];
							objContentTranslate = objContent;
							
							var style = el.style, prop;
							
							prop = typeof style.transition !== "undefined"  ? 'transition' : 
								typeof style.webkitTransition !== "undefined" ? "webkitTransition" : "MozTransition";
								 
							style[ prop ] = objContentTranslate;
								
							break;

						//default
						default :
							el.style[ key ] = objContent;
						}
					}
				}

				if(element.nodeName){
					//node element
					fn(element)
				}else{
					for(var ii = element.length; ii > 0; ii--){
						fn(element[ii - 1])
					}
				}
			}

			this.text = function (el, text) {
				
				if( el instanceof Array ){
					
					while( el.length ){
						element = el.pop();
						element.innerText = text ;
					}
				}else{
				
					el.innerText = text ;
				}
				
				//el.innerText ? el.innerText = text : el.textContent = text;
			};
			
			this.cloneImg = function( url ){
				var sourceImage = document.createElement('img');
				sourceImage.src = url;
				return sourceImage.cloneNode(true);
			}
			 				
			this.removeClassTransform = function( el, className, time, callback ){
			
				let self = this;
				
				this.addClass( el, className);
				
				callback.start && callback.start();
				 
				setTimeout(function(){
				
					self.addClass( el, "hidden")
					
					callback.end && callback.end();
					
				}, time)
			}
			
			this.addClassTransform = function( el, className, time, callback ){
			
				let self = this;
				 
				callback.start && callback.start();
				
				setTimeout(function(){
					
					self.addClass( el, className) 
					
					callback.end && callback.end();
						
				}, time)
			}
		}
	},{
		'physics' :  function(){
		
			var scope = this;
			
			this.physicsComponent = {};
			
			this.physicsComponent.objectTrajectory = function( target, duration, prop ){
				this.install = false;
				this.target = target;
				this.targetLabel = target.label;
				this.targetRig = target.rigBody;
										
				this.targetTranslate = {
					x : 0,
					y : 0
				}
				this.targetEnd = "";
				
				if( prop ){//static trajectory
					
					this.targetTranslate.x = prop.x;
					this.targetTranslate.y = prop.y;
					
				}else if( target.statParameters.mainCharacter ){
					this.vy = 8;
					this.vx = 12
				}else{
					this.vy = 9;
					this.vx = 13

				}
				
				var parentRigBody = this.target.rigBody;
				
				this.duration = duration;
				this.halfDuration = duration / 2;
				this.globalTranslate = scope.objTranslate["value"];
				
				
				this.translateOvalOnly = function( end ){
					
					if( this.targetRig.characterState  ){
						
						var rigBody = this.targetRig;
					
						this.globalTranslate.staticObjMoveX = prop ?  Math.abs( this.targetTranslate.x ) : Math.abs( this.vx );
						  
						/*
						rigBody.moveStaticY = -this.vy;
						rigBody.velocity = -this.vy;
						scope.objTranslate["value"].staticObjMoveY = -this.vy;
						*/
						
						//prevent bug object trajectory if idle force to 0
						!end && ( this.globalTranslate.staticObjMoveX = 0 );
						
						//force end
						if( this.globalTranslate.objPhysCollide ){
							this.duration = 0;
							this.globalTranslate.objPhysCollide = false;
						}
						  
					}
					
				}
				
				this.install = false;
				
				this.updatePhysic = function( trajectoryX, trajectoryY ){
					
					
					if( this.duration > 0 ){
						
						if( !this.install ){
							
							var turn = ( parentRigBody.turn ? parentRigBody.turn === 'right' : parentRigBody.monsterDir() === 'right' ) ?  "right" : "left";
							 
							if( turn === 'right' ){
								parentRigBody.changeRightFn( true );
							}else{ 
								parentRigBody.changeLeftFn( true );
							}	
							
							 
							this.vx = turn === "left" ? -this.vx : this.vx;
							
							this.targetEnd = {
								x : this.target.position.x,
								y : this.target.position.y
							}
							
							
							this.enemyParams = parentRigBody.characterState ? parentRigBody.monsterParameters : parentRigBody.character.statParameters;
							
							this.install = true;
						}
						  
						this.duration--
					
						var staticObjStateX = this.globalTranslate.staticObjStateX,
						staticObjMoveX = this.globalTranslate.staticObjMoveX,
						staticObjStateY = this.globalTranslate.staticObjStateY,
						staticObjMoveY = this.globalTranslate.staticObjMoveY,
						end = this.duration === 1,
						target = this.target;
						
						if( this.duration < this.halfDuration ){
							this.vy = Math.abs( this.vy )
						}else{
							this.vy = -Math.abs( this.vy )
						}
						
						
						if( staticObjStateX === 'left' ){
							this.targetEnd.x += staticObjMoveX;
						}else if( staticObjStateX === 'right' ) {
							this.targetEnd.x -= staticObjMoveX
						}
						
						
						var staticMoveY = staticObjStateY === 'up' ? staticObjMoveY :
								staticObjStateY === 'down' ? -staticObjMoveY : 0;
								
						this.targetEnd.y += staticMoveY;
						
						trajectoryX && ( this.targetTranslate.x += this.vx );
						trajectoryY && (this.targetTranslate.y += this.vy );
						
						this.translateOvalOnly( this.duration );
						
						scope.Body.setPosition(
							target , {
							x : this.targetEnd.x + this.targetTranslate.x,
							y : this.targetEnd.y + this.targetTranslate.y
						})
						
						//enemy died
						if( this.enemyParams && !this.enemyParams.health || this.targetLabel !== target.label ){
							this.duration = 0; 
							this.translateOvalOnly( 0 );
						}
						
					}
					
				}
				
			}
			
			this.physicsComponent.itemTrajectoryComponent = function(){
				
				this.itemTrajectory = function( name, width, height, parent, callback  ){
					
					this.name = name;
					this.parent = parent;
					this.install = false;
					this.x = 0;
					this.y = -2;
					this.turn = '';
					this.vy = 0;
					this.vx = 0;
					this.deltaY = 0;
					this.deltaX = 0;
					this.gravity = 0.03;
					this.deg = 0;
					this.characterGetHit = false;
					this.posHit = 0;
					this.isTrajectory  = true;
					this.angle = 0;
					this.speed = 12;
					this.item =  scope.createItem['value']( name, width, height, "itemWithAngle" );
					this.life = 100;
					this.pass = 0;
					this.angleSpeed = 0.03;
					this.acceleration = function(){
						this.vy += this.gravity;
						this.x = this.speed;
						this.y += this.vy;
					}
					
					this.update = function( spawnX, spawnY, angle, turn, target, isRemove, angleSpeed ){
						if( !this.install ){
							this.isBoom = /boom/i.test( this.name );
							
							//prevent error when target was removed
							if( typeof target.position === 'undefined'){
								scope.World.remove( scope.engine.world, this.item );
								return true;
							}
							
							scope.Body.setPosition(
								this.item , {
								x : spawnX,
								y : spawnY
							} )
							
									
							scope.Composite.addBody( scope.engine.world, this.item );
							//update dungeon order object
							scope.orderObjectFn['value']()
							
							var rangeY = target.position.y - spawnY, maximumSpeed;
							
							if( rangeY <= 100 ) maximumSpeed = 18;
							else if( rangeY > 100 && rangeY <= 130 )  maximumSpeed = 19;
							else if( rangeY > 130 && rangeY < 180 )  maximumSpeed = 15.5;
							else if( rangeY > 180 )  maximumSpeed = 12.5;
							
							if( this.isBoom ){
								maximumSpeed -= scope.randomFloat(6.5,3.5);
							}
							
							this.item.isStatic = true;
							this.deltaX = spawnX;
							this.deltaY = spawnY;
							this.angle = angle ;
							this.speed = maximumSpeed * ( ( target.position.x - spawnX ) / ( this.parent.object.statParameters.range - 100 ) );
							this.turn = turn;
							this.angleSpeed = angleSpeed ? angleSpeed : this.angleSpeed;
							 
							this.install = true;
						}

						this.life--;
						if( this.life < 0 || ( isRemove ) ){
							scope.World.remove( scope.engine.world, this.item );
							
							//update dungeon order object
							scope.orderObjectFn['value']()
							
							return true;
						}
						
						
						if( this.item.bounds.max.y < target.bounds.max.y && this.isTrajectory || this.isBoom ){
							var pos =  target.position,
							rangeX = Math.abs( pos.x - this.item.position.x ),
							rangeY = Math.abs( ( pos.y  ) - this.item.position.y ),
							itemPos = this.item.position,
							posArrowY = ( target.bounds.min.y - target.additionalBoundsValue - target.additionalBoundsHeightValue ) - this.item.bounds.min.y,
							getHit = false;
							
							 
							if( this.isBoom ){ 
								var rangeBoomY =  Math.abs(  target.bounds.max.y  - this.item.bounds.max.y );
								rangeBoomY < 15 && ( this.characterGetHit = true );
							}else if( rangeX < 60 && posArrowY < 40 ){ //rangeY < 100 
								this.characterGetHit = true;
							}
							
							//stop pool when attacker already died 
							if( this.characterGetHit ){
								if( this.isBoom ){ //area
										 
										if( callback ){ //boom need callback ex add buff when explode triger at @AI.skillBehaviour
											
											callback( this.item )
										
										}else if( this.parent.object.visible ) {
											
												scope.explosiveA({
													object : this.item,
													parent : "",
													alpha : false
												})
												
												scope.playAudio("explosion")
											
												var jj =  this.parent.createAreaDamagePool({
													target : this.item,
													width : 300,
													height : 300,
													caster : this.parent.object.label
												 }) 
												 
												
												for( var ii = 0; ii < jj.length ; ii ++ ){
													this.parent.characterDamagePool({
														objectAttacker : this.parent.object,
														objectTarget : jj[ii].object
													})
												}
										
										}
										
									
										
								}else if( this.parent.character.statParameters ){
									this.parent.characterDamagePool({
										objectAttacker : this.parent.object,
										objectTarget : this.parent.character
										
									})
								}
								
								
								this.life = 0; //then remove it
								
							}
							
							if( !this.characterGetHit ){
				
								this.acceleration();
							
								var posX = itemPos.x + this.x;
								var posY = itemPos.y + this.y 
								
								if( !this.characterGetHit || !this.pass ){
									scope.Body.setPosition(
										this.item , {
										x : posX,
										y : posY
									})
									
									this.item.angleInRadians = scope.angleToRadian( this.angle )
									
									this.posHit = itemPos.x;
									 
									this.angle += ( this.turn === 'right' ? -this.angleSpeed : this.angleSpeed );
									 
									this.item.angle = this.angle;
									
									this.prevX = posX;
									this.prevY = posY;
									
								}else {
									
									this.x = this.posHit 
									this.y = pos.y + 100 ;
									
									this.item.force.x = this.x;
									this.item.force.y = this.y;
								}
								this.pass++
							
							}
							
						}else{
							this.isTrajectory = false;
						}
						
						return false;
					}
				}
				this.trajectoriesUpdate = [];
				this.trajectoryInit = {		
					pushTrajectoryItem : function( prop  ){
						var parent = prop.parent
						trajectoryProp = parent.object.statParameters.trajectoryProp
						parent.trajectoriesUpdate.push( new parent.itemTrajectory( prop.weaponName, prop.weaponWidth, prop.weaponHeight, parent, prop.callback )   )
						if( trajectoryProp.angleSpeed ){
								parent.trajectoriesUpdate[ parent.trajectoriesUpdate.length  - 1 ].angleSpeed = trajectoryProp.angleSpeed;
						}
					},
					createSkillTrajectory : function( prop ){
						
						//prevent error, an error accured when swaping character
						
						var trajectoryProp =  prop.parent.object.statParameters.trajectoryProp;
							
						if( trajectoryProp ){		
						
							var weaponName = prop && prop.weaponName ?	prop.weaponName : trajectoryProp.weaponName,
							weaponWidth = prop && prop.weaponWidth  ?	prop.weaponWidth : trajectoryProp.weaponWidth,
							weaponHeight = prop && prop.weaponHeight ?	prop.weaponHeight : trajectoryProp.weaponHeight,
							callback = prop && prop.callback ? prop.callback : "";
						 
							this.pushTrajectoryItem({
								 parent : prop.parent,
								 weaponName : weaponName,
								 weaponWidth : weaponWidth,
								 weaponHeight : weaponHeight,
								 callback : callback
							})
						}
					},
					createNormalTrajectory : function( prop ){
						
						var trajectoryProp = prop.object.statParameters.trajectoryProp
						weaponName = trajectoryProp.weaponName,
						weaponWidth = trajectoryProp.weaponWidth,
						weaponHeight = trajectoryProp.weaponHeight,
						callback =  "";
						
						this.pushTrajectoryItem({
							 parent : prop,
							 weaponName : weaponName,
							 weaponWidth : weaponWidth,
							 weaponHeight : weaponHeight,
							 callback : callback
						})
						
					}
				}
				
			}
			
			this.moveVector2dSmooth = function( objectStart, objectDest, seconds ){
				var v = scope.distanceAndAngleBetweenTwoPoints(
					objectStart.position.x,
					objectStart.position.y,
					objectDest.position.x,
					objectDest.position.y
				),
				moveObjectPerSecond = v.distance / seconds

				return new scope.vector( moveObjectPerSecond, v.angle )
			}
			
			this.moveVector2dWithVelocity = function( objectStart, objectDest, velocity, withAngle ){
				if( objectStart.position ){
					var v = scope.distanceAndAngleBetweenTwoPoints(
						objectStart.position.x,
						objectStart.position.y,
						objectDest.position.x,
						objectDest.position.y
					)
				}else{
					var v = scope.distanceAndAngleBetweenTwoPoints(
						objectStart.x,
						objectStart.y,
						objectDest.x,
						objectDest.y
					)
				}
				
				if( withAngle ){
					return {
						vector : new scope.vector( velocity, v.angle ),
						angle : v.angle
					}
				}else{
					return scope.extend( new scope.vector( velocity, v.angle ), { distance : v.distance}, true )
				}
			}

			this.moveVector2d = function( objectStart, objectDest, speed ){
				this.install =  false;
				this.start = objectStart.position,
				this.dest = objectDest.position,
				this.lastTime = new Date().getTime(),
				this.startSpeed = speed || 0.4,
				this.velocity = null,
				this.update = function(){

					if( !this.install ){
						// positions and deltas
						var start = this.start,
						dest = this.dest,
						dx = dest.x - start.x,
						dy = dest.y - start.y,
						totalDistance = Math.sqrt(dx * dx + dy * dy);

						// x and y component ratio
						var cx = dx / totalDistance,
						cy = dy / totalDistance;

						// velocities
						var startSpeed = this.startSpeed,
						startVelocity = { x: cx * this.startSpeed, y: cy * startSpeed };

						this.startVelocity = startVelocity;
						this.velocity = Object.create( startVelocity );
						this.install = true
					}

					var t = new Date().getTime(),
					tDelta = t - this.lastTime,
					v = this.velocity;
					this.lastTime = t;

					return {
						x : v.x * tDelta,
						y : v.y * tDelta
					}

				}
			};
	  
		}
	},{
		
		'transport' : function( options ){
				
			var scope = this, 
			setupXhr = function( params ){
				
				var obj = {
					charset :  params.charset || 'application/json;charset=UTF-8',
					http : window.XMLHttpRequest ?  new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
					callback :  params.callback,
					onerror :  params.error || 'ops, request time out',
					timeout :  params.setTimeout || 1123000,
					url :  params.url,
					type :  params.type,
					dataset :  params.dataset || {},
					requestHeader : function(){
						var self = { 'Content-Type': this.charset }
						scope.extend(self ,  params.requestHeader)
						return self;
					},
					setRequest : function(){
						var self = this, http = self.http;
						for(var ii in self) if(ii in self){
							for(var jj in http) if(jj in http){
								if(jj.toLowerCase() 
									=== ii.toLowerCase()){
									http[ii] = self[ii]
								}
							}
						}
						
						http.open(self.type, self.url, true)
						for(var kk in self.requestHeader())
							http.setRequestHeader(kk, self.requestHeader()[kk]);
								
						http.send(JSON.stringify(self.dataset));
						
						http.ontimeout = ('function' === typeof self.onerror) && self.onerror || function(){
							params.timeoutFn &&
								params.timeoutFn.call( this, http.status );
						}
						
						 
						http.onerror =  function (e) {
							params.errorFn &&
								params.errorFn.call( this, http.status );  // return 0
						}
						
						
						http.onload =  function (e) {	
							if(4 === http.readyState){
								
								( 200 === http.status || http.status === 206 ) ?
									self.callback.call(this, http.responseText ) :
								404 === http.status ?
									self.callback.call( this, http.status )  :
								403 === http.status ?
									console.log('Forbidden') :	
								500 === http.status ? 
									console.log('Error 500') :	
								300 === http.status ?	
									console.log('Page Redirect') :
									console.log('Unknown');
									
							}
						};
					}
				}
				
				obj['setRequest']();
			}
			
				
			var variables = options ? [ options ] : [];
			
			scope.slice( variables ).forEach(function( params ){	
				
				 setupXhr( params )
				
			})
			 
		}
	},{ 
		'mouse' : function()
		{
			var obj = {}
			this.mouseCreate = function( element )
			{
				//(c) Matter JS Mouse Create
				var mouse = {},
				scope = this;
				mouse.element = element || document.body;
				mouse.absolute = { x: 0, y: 0 };
				mouse.position = { x: 0, y: 0 };
				mouse.mousedownPosition = { x: 0, y: 0 };
				mouse.mouseupPosition = { x: 0, y: 0 };
				mouse.offset = { x: 0, y: 0 };
				mouse.scale = { x: 1, y: 1 };
				mouse.wheelDelta = 0;
				mouse.button = -1;
				mouse.pixelRatio = mouse.element.getAttribute('data-pixel-ratio') || 1;

				mouse.sourceEvents = {
					mousemove: { x: 0, y: 0 },
					mousedown: { x: 0, y: 0 },
					mouseup: { x: 0, y: 0 }
				};

				mouse.mousemove = function(event){
					var position = scope.getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
						touches = event.changedTouches;

					if (touches) {
						mouse.button = 0;
					}

					mouse.absolute.x = position.x;
					mouse.absolute.y = position.y;
					mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
					mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;

					mouse.sourceEvents.mousemove = mouse.position
					 
					scope.mousePosition['value'].pos = mouse.sourceEvents;
					
				};

				mouse.mousedown = function(event) {
					var position = scope.getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
						touches = event.changedTouches;

					if (touches) {
						mouse.button = 0;
					} else {
						mouse.button = event.button;
					}

					mouse.absolute.x = position.x;
					mouse.absolute.y = position.y;
					mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
					mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;

					mouse.sourceEvents.mousedown = mouse.position;
					
					scope.mousePosition['value'].pos = mouse.sourceEvents;
					
				};

				mouse.mouseup = function(event) {
					var position = scope.getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
						touches = event.changedTouches;
					mouse.button = -1;
					mouse.absolute.x = position.x;
					mouse.absolute.y = position.y;
					mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
					mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
					mouse.sourceEvents.mouseup = mouse.position
					scope.mousePosition['value'].pos = mouse.sourceEvents
				};

				element.addEventListener('mousemove', mouse.mousemove);
				element.addEventListener('mousedown', mouse.mousedown);
				element.addEventListener('mouseup', mouse.mouseup);

				element.addEventListener('mousewheel', mouse.mousewheel);
				element.addEventListener('DOMMouseScroll', mouse.mousewheel);

				element.addEventListener('touchmove', mouse.mousemove);
				element.addEventListener('touchstart', mouse.mousedown);
				element.addEventListener('touchend', mouse.mouseup);

			}

			this.getRelativeMousePositionToRegisterObject = function( elements )
			{
				var scope = this;
				
				if( scope.mousePosition['value'].pos ){
					var x = scope.mousePosition['value'].pos.mouseup.x,
					y = scope.mousePosition['value'].pos.mouseup.y;
					
					
					for(var ii = 0; ii < elements.length ; ii++ ){
						var posReac = elements[ii].getBoundingClientRect();
						
						if( posReac.right > x &&  posReac.left < x
						&& posReac.top < y &&  posReac.bottom > y ){
							return elements[ii].id ;
						}
					}
				}
				 
			}
		}
	},{
		'bridge' :function(  )
		{  
			owl.namespace['__namespace__'].push( this )

			var scope = this, O, $,
			namespace = owl.namespace,
			registeredNamespace = namespace['__namespace__'],
			regList = owl.register,
			bridge = {};

			bridge.register = (function( namespace ){

				self = {}

				self.windowResize = function( prop ){
					for(var ii in regList){
						if( regList[ ii ].register === prop ){
							regList[ii].fn()
							break;
						}
					}
				}

				self.globalOwlBirdrProperty = function( prop)
				{
					var accessorName = prop, initialize = this;
					for(var ii in regList){
						if( regList[ ii ].register === prop ){
							scope.extend(self, regList[ ii ].obj)
							break;
						}
					}

					scope.accessor.call( initialize, {
						global : self,
						accessorName : prop,
						namespace : namespace
					})

				}

				return self;

			}( namespace ))


			this.that = function( target ){

				var objReturn = {};

				return {
					
					callback : (function(self){
					  return function(callback){
						 callback(self)
					  };
					}( objReturn || {})),

					invokeWith : function( prop ){
						for(var ii in regList){
							if(regList[ ii ].register === prop ){
								bridge.register[ii].apply( target, arguments )
								break;
							}
						}

						return this;
					},

					use : function(util, args){
						var value,
						dom = new scope.dom;
						for(var ii in dom){
							 if (ii in dom
								&& 'function' === typeof dom[ii]
								&& ii.toLowerCase() === util.toLowerCase())
								{
									if( /(attachlistener|addclass|removeclass|css)/i.test(ii.toLowerCase()) )
										args.unshift(target);
									value = dom[ii].apply(dom, args)
									if(!!value) objReturn[util] = value;
							}
						}

						return this;

					},

					findTarget : function( event ){
						if(/([object NodeList]|[object Array])/i.test(scope.objToString( target ))){
							for(var kk = target.length - 1; kk >= 0; kk--){
								if(target[kk].contains( event.target || event.srcElement)){
									this['target'] = target[kk];
									objReturn['self'] =  this;
								}else{
									!!objReturn['self'] && delete objReturn['self'];
								}
							}
							return this;
						}
					},

					fireTarget : function( event, callback ){
						this.findTarget(event).callback(function(obj){
							('self'in obj) && obj['self'].use('delay', [ function(){
								callback.call(null, obj['self'].target )
							}, 100])
						})
					}
				}
			}
		}
	},{ 
		'deligate' : function( string, el, obj )
		{
			var scope = this
			scope.extend( owl.register, {
				windowResize: {
					register: '_windowResize',
					fn : function(){
						var canvas = scope.canvas
						
						scope.browserWidthUpdate = scope.browserWidth()
						scope.browserHeightUpdate = scope.browserHeight()
						if( scope.controlGUICheck ) scope.controlGUICheck['value']();
							
						
						canvas.width = scope.browserWidthUpdate;
						canvas.height = scope.browserHeightUpdate + 1;
						 
						scope.css( canvas , {
							'width' : scope.browserWidthUpdate + 'px',
							'height' : scope.browserHeightUpdate + 1 +'px'
						})
					}
				},
				globalOwlBirdrProperty: {
					register: '_globalOwlBirdrProperty',
					obj : { 
						mousePosition : {
							pos : ''
						},
						storageState : function()
						{
							this.storage = [];
							this.remove = function( targetName ){
								var cnt = this.storage;
								if( cnt.length ){
									for( var ii = 0; ii < cnt.length ; ii++ ){
										if( cnt[ii].name === targetName.toLowerCase() ){
											this.storage.splice( ii, 1 );
										}
									}
								}
							};
							this.get = function( targetName ){
								var cnt = this.storage;
								if( cnt.length ){
									for( var ii = 0; ii < cnt.length ; ii++ ){
										if( cnt[ii].name === targetName.toLowerCase() ){
											return cnt[ii].status;
										}
									}
								}
							};
							this.set = function( targetName, status)
							{
								var cnt = this.storage;
								if( cnt.length ){
									for( var ii = 0, jj = 0; ii < cnt.length ; ii++ ){
										if( cnt[ii].name === targetName.toLowerCase() ){
											cnt[ii].status = status
											jj++
											break;
										}

										if( !jj && ii === (cnt.length - 1) ){
											cnt.push({
												name : targetName.toLowerCase(),
												status : status
											})

											break;
										}
									}

								}else{
									cnt.push({
										name : targetName.toLowerCase(),
										status : status
									})
								}
							}
						},
						
					}
				}
			})

			scope.that( scope )
				.invokeWith('_globalOwlBirdrProperty' )
		}
	},{
		'time' : function()
		{
			 
			var scope = this;
			
			this.stringToDate = function( dateString ){
				let stringDate = dateString.split(" ")[0],
				stringTime = dateString.split(" ")[1],
					
				dateArr = stringDate.split("/"),
				
				timeArr = stringTime.split("."),
				
				//YYYY-MM-DDTHH:MM:SSZ
				date = dateArr[2]+"-"+ 
					( dateArr[1].length <= 1 ? "0"+dateArr[1] : dateArr[1] ) +
					"-"+ ( dateArr[0].length <= 1 ? "0"+dateArr[0] : dateArr[0] )+
					" "+timeArr[0] +
					":"+timeArr[1]+
					":"+timeArr[2];
					  
				return new Date( date );
			}
			
			this.dateIsTodayOrYesterday = function( date ) {
										
				let today = new Date,
				yesterday = new Date; yesterday.setDate(today.getDate() - 1)
				
				if(date.toLocaleDateString() == today.toLocaleDateString()){
					return 'Hari ini'
				}else if (date.toLocaleDateString() == yesterday.toLocaleDateString()) {
					return 'Kemarin'
				} 
				
				return false; 
			}
			 
			this.dateToYMD = function( date, withYear, withTime, withFullMonthName, isShortYear ){
				let monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
				fullMonthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Desember'],
				strDay=['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
				day = strDay [ date.getDay() - 1 ] ? strDay [ date.getDay() - 1 ] : strDay [ strDay.length - 1 ] ,
				hour = date.getHours().toString(),
				minute = date.getMinutes().toString(),
				second = date.getSeconds().toString(),
				milisecond = date.getMilliseconds().toString(),
				ms = ( milisecond.length === 1 ? "0"+milisecond : second ),
				ss = ( second.length === 1 ? "0"+second : second ),
				mm = ( minute.length === 1 ? "0"+minute : minute ),
				hh = ( hour.length === 1 ? "0"+hour : hour ),
				d = date.getDate(),
				m = ( withFullMonthName ? fullMonthName : monthName ) [ date.getMonth() ],
				y = isShortYear ? date.getFullYear().toString().slice(2,4) : date.getFullYear(),
				  
				string = '' + (d <= 9 ? '0' + d : d) + ' ' + m;
				      
				if( withYear && withTime ){
					
					let strTime = /hh:mm:ss/i.test( withTime ) ? hh+' : '+mm+' : '+ss :
					/mm:ss:ms/i.test( withTime ) ? mm+' : '+ss+' : '+ms :
					/mm:ss/i.test( withTime ) ? mm+' : '+ss : hh+' : '+mm 
					 
					return day +', '+ string + " "+ y +", "+strTime;
					
				}else if( withYear ){
					
					return day +', '+ string + " "+ y;
					
				}else{
					
					return day +', '+ string
				} 
			} 		 
			
			this.timeSince = function( date, needNow ) { 
			
				let NOW = needNow ? needNow : new Date(),
				times = [
					["detik", 1], 
					["menit", 60], 
					["jam", 3600], 
					["hari", 86400], 
					["minggu", 604800], 
					["bulan", 2592000],
					["tahun", 31536000]
				]

				var diff = Math.round((NOW - date) / 1000)
				for (var t = 0; t < times.length; t++) {
					if (diff < times[t][1]) {
						if (t == 0) {
							return "baru saja"
						} else {
							diff = Math.round(diff / times[t - 1][1])
							return diff + " " + times[t - 1][0]
						}
					}
				}
					
			}
			
			this.getTotalMonths = function( date2, date1, roundUpFractionalMonths ) {
				
				 //Months will be calculated between start and end dates.
				//Make sure start date is less than end date.
				//But remember if the difference should be negative.
				var roundUpFractionalMonths = false,
				startDate = date1,
				endDate = date2,
				inverse = false;
				
				if( date1 > date2 ){
					
					startDate = date2;
					endDate = date1;
					inverse = true;
				}

				//Calculate the differences between the start and end dates
				var yearsDifference = endDate.getFullYear() - startDate.getFullYear(),
				monthsDifference = endDate.getMonth() - startDate.getMonth(),
				daysDifference = endDate.getDate() - startDate.getDate(),
				monthCorrection=0;
				
				//If roundUpFractionalMonths is true, check if an extra month needs to be added from rounding up.
				//The difference is done by ceiling (round up), e.g. 3 months and 1 day will be 4 months.
				
				if( roundUpFractionalMonths === true && daysDifference > 0 ){
					
					monthCorrection=1;
				
				}
				
				//If the day difference between the 2 months is negative, the last month is not a whole month.
				else if( roundUpFractionalMonths !== true && daysDifference < 0 ){
					
					monthCorrection=-1;
				
				}

				return ( inverse ? -1 : 1) * ( yearsDifference * 12 + monthsDifference + monthCorrection );
				
			}
			
			this.getMinutesHourDayOrWeekBetweenDates = function( endDate, startDate, string,  mathType ) {
				
				let diff = Date.parse( endDate ) - Date.parse( startDate ),
				
				math = mathType === "floor" ? "floor" : "round";
				 
				totalSeconds = Math[ math ]( diff / 1000 ),
				 
				totalMinuts = Math[ math ]( totalSeconds / 60 ),
			 
				totalHours = Math[ math ]( totalMinuts / 60 ),
				
				totalDays = Math[ math ]( totalHours / 24 );
				
				totalWeek = Math[ math ]( totalDays / 7 );
				  
				switch( string ){
					
					case "milisecond" : return Math.round( diff % 1000 )
						 
					case "second" :return totalSeconds 
					
					case "minute" : return totalMinuts
					
					case "hour" : return totalHours
					
					case "day" : return totalDays
					 
					case "week" : return totalWeek
				} 
			}
			 
			this.timeUnitBetween = function( dateFuture, dateNow ){
				
				var d = Math.abs( dateFuture - dateNow ) / 1000;                           // delta
				var r = {};                                                                // result
				var s = {                                                                  // structure
					year: 31536000,
					month: 2592000,
					week: 604800, // uncomment row to ignore
					day: 86400,   // feel free to add your own row
					hour: 3600,
					minute: 60,
					second: 1,
					millisecond : 0
				},
				millisecond = d.toFixed( 2 ).split(".")[1]; 
				
				Object.keys(s).forEach(function(key){
					r[key] = Math.floor(d / s[key]);
					d -= r[key] * s[key];
				});
				
				
				r.millisecond = millisecond; 
				
				return r;
				
			}
			
			
		} 
	},{
		
		'utils' : function(){
			 
			var scope = this;
			
			this.delayFire = function(){
			  var timer = setTimeout(function(){});
			  return function(firecallback, ms){
				clearTimeout (timer);
				timer = setTimeout(firecallback, ms);
			  };
			}(),
			
			this.findClosestInArr = function ( x, arr ) {
				
				let indexArr = arr.map( function(k) { return Math.abs(k - x) } ),
				
				min = Math.min.apply(Math, indexArr); 
				
				return {
					value : arr[ indexArr.indexOf( min ) ],
					index : indexArr.indexOf( min )
				};
			}
			
			this.indexRange = ( a , b ) => Array.from( new Array( b > a ? b - a : a - b ), ( x, i ) => b > a ? i + a : a - i );
			
			this.inArray = function (a, b){
				while(b.length)
					if(b.pop() === a) return true;
				return false;
			}
			
			this.objToString = function(obj){
				return Object.prototype.toString.call(obj);
			}
			
			this.slice = function(args, index){
				return index && Array.prototype.slice.call(args, index)[0] || Array.prototype.slice.call(args)
			}
			
			this.requestAnimFrame = function(){
				return (
					window.requestAnimationFrame       ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame    ||
					window.oRequestAnimationFrame      ||
					window.msRequestAnimationFrame     ||
					function(/* function */ callback){
						window.setTimeout(callback, 1000 / 60);
					}
				);
			}();
			
			this.isMobile = function(){
				return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			}

			this.encodeStr = function(rawStr){
				return encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
				   return '&#'+i.charCodeAt(0)+';';
				})
			}

			this.normalizingMousewheel = function(evt){
				//http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
				//http://phrogz.net/JS/wheeldelta.html
				 if (!evt) evt = event;
				  var w=evt.wheelDelta, d = evt.detail;
				  if (d){
					if (w) return w/d/40*d>0?1:-1; // Opera
					else return -d/3;              // Firefox;         TODO: do not /3 for OS X
				  } else return w/120;             // IE/Safari/Chrome TODO: /3 for Chrome OS X
			}

			this.random = function(max,min){
				return Math.floor(Math.random()* (max - min +1) + min);
			}

			this.randomFloat = function(min,max){
				return (Math.random() * (min - max) + max);//.toFixed(2);
			}

			this.randomArray = function( array ){
				
				for (var i = array.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
				
				return array;
			}
			
			this.stringLimit = function( string, length ){ 
			  
				let trimmedString = string.length > length ? 
					string.substring( 0, length - 3 ) + "..." : 
					string;
				
				return trimmedString;
			}
			 
			this.stringToHtml5Template = function( html ) {
				
				let template = document.createElement('template');
				html = html.trim(); // Never return a text node of whitespace as the result
				template.innerHTML = html;
				 
				return template.content;
			}
			
			this.uniqueString = function() {
				return Math.random().toString(36).slice(-8)
			};

			this.uniqueId = function() {
				return this.random(999,100)+'-'+Math.random().toString(36).slice(-8)
			};

			this.uniqueArray = function( dupArray ){

				var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

				return dupArray.filter(function(item) {
					var type = typeof item;
					if(type in prims)
						return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
					else
						return objs.indexOf(item) >= 0 ? false : objs.push(item);
				});
			}

			this.detectLeftButton = function(event){
				if ('buttons' in event) {
					return event.buttons === 1;
				} else if ('which' in event) {
					return event.which === 1;
				} else {
					return event.button === 1;
				}
			}

			this.detectRightButton = function(event){
				var isRightMB,
				event = event || window.event;
				if ("which" in event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
					return event.which == 3;
				else if ("button" in e)  // IE, Opera
					return event.button == 2;

			}

			this.cancelBubble = function(evt){
					var evt = this ? evt:window.event;
					if (evt.stopPropagation)    evt.stopPropagation();
					if (evt.cancelBubble!=null) evt.cancelBubble = true;
					evt.preventDefault()
			}
			  
			this.ucFirst = function (string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}
			 
			this.extend = function(obj, _obj, deep){
				if(deep === true){
					for(var ii in _obj) if(ii in _obj) obj[ii] = _obj[ii];
				}else{
					state: for(var ii in _obj) if(ii in _obj)
					{
						for(var jj in obj) {
							if(jj in obj
								&& ii.toLowerCase() === jj.toLowerCase()
								&& ii.toLowerCase().indexOf('strict') !== -1){
									continue state;
							}
						}

						if('function' === typeof _obj[ii]){
							obj[ii] = _obj[ii]
							obj[ii]()
						}else{
							obj[ii] = _obj[ii]
						}
					}
				}
				
				return obj;
			} 
			 
			this.objCount = function( obj ){
				var count = 0;
				for( var ii in obj ) count++;
				return count;
			}

			var isTangible = !!('createTouch' in document)
			//Touch and mouse Events
			this.CursorStartEvent = isTangible ? 'touchstart' : 'mousedown';//mousedown
			this.CursorMoveEvent = isTangible ? 'touchmove' : 'mousemove';//mousemove
			this.CursorEndEvent = isTangible ? 'touchend' : 'mouseup';//mouseup
			this.CursorLeaveEvent = isTangible ? 'touchleave' : 'mouseout';//mouseout

			this.accessor = function( __obj )
			{ 
				var scope = this;
				var namespace = __obj.namespace;
				var registeredNamespace = namespace['__namespace__'];
				var global = __obj.global,  accessorName = __obj.accessorName;
				
				O = Object.create( new function()
				{
					return  Object.defineProperty( __obj, accessorName,
					{
						set : function ()
						{
							scope.slice(arguments).forEach( function(_obj)
							{
								namespace[ '_initialize'+accessorName ] ?
									namespace[ '_initialize'+accessorName ].push( _obj ):
									namespace[ '_initialize'+accessorName ] = [ _obj ];

								for(var ii = 0, jj = registeredNamespace; ii < jj.length ; ii++)
								{
									for(var kk in global) if (kk in global){

										jj[ii][kk] = Object.defineProperty({ invoke : kk }, 'value',
										{
											get: function ()
											{
												return global[this.invoke];
											},
											set: function (value)
											{
												for(var jj in this) if( jj in this){

													if(!(jj ===  'value'))
													{
														global[this[jj]] = value;
														for(var ll = registeredNamespace , kk = ll.length; kk--;)
														{
															if(!(ll[kk] === _obj) && this[jj] in ll[kk])
															ll[kk][this[jj]] = this;
														}
													}
												}
											},
											enumerable: true
										})
									}
								}
							})
						}
					})
				})

				O[ accessorName ] = this;

				namespace[ '_revoke'+accessorName ] = O;
			}
			
			this.showImageHHandWW = function( img, src ){
				var imgHeight, imgWidth,
				findHHandWW = function() {
					imgHeight = this.height;
					imgWidth = this.width;
					return true;
				}
				img.name = src;
				img.onload = findHHandWW;
				img.src = src;
				return img;
			}
			
			this.rgbRandom = function( opacity ){
				this.r = 255;
				this.g = Math.round( Math.random() * 255 );
				this.b = Math.round( Math.random() * 255 );
				return "rgba( "+ this.r +","+ this.g +","+ this.b +","+ opacity +")";
			}
			
			this.JSONstringfy = function( params ){
				var cache = [];
				return JSON.stringify(params, function(key, value) {
					if (typeof value === 'object' && value !== null) {
						if (cache.indexOf(value) !== -1) {
							// Circular reference found, discard key
							return;
						}
						// Store value in our collection
						cache.push(value);
					}
					return value;
				});
				
				cache.length = 0;
			}
			
			this.playAudio = function( source ){
				
				var objTranslate = scope.objTranslate['value'];
				
				if( objTranslate.volume ){
				
					var obj = {
						createAudio : function(){
							return new Audio();
						}, 
						audioSrc : function(  audio, name ){
							src = scope.path+'audio/' + name;
							audio.src = Modernizr.audio.ogg ? src +'.ogg' :
										Modernizr.audio.mp3 ? src +'.mp3' :
															  src +'.wav' ;
							return name;
						},
						audioEndEvent : function( audio ){
							/*scope.attachListener( audio, "ended", function(el){ 
								
								audio.currentTime = 0;
							
							})*/ 
						},
						previousAudio : "",
					}
					
					 
					var name = source instanceof Array ? source[ scope.random ( source.length, 1 ) - 1  ] : source,
					audioName = name+".ogg"; 
					  
					audio = obj.createAudio();
					obj.audioSrc( audio, name ); //set url
					 
					obj.audioEndEvent( audio )
					audio.play();
				
				}
				
			}
			
			this.fullscreenToogle = function( element ){
				if( /off/i.test( element.className ) ){
					element.className = "fullscreen-on";
					
					var el = document,
					rfs = el.exitFullScreen || el.mozCancelFullScreen || el.webkitExitFullScreen || el.mozExitFullScreen || el.msExitFullScreen || el.webkitCancelFullScreen;
					
					if ( typeof rfs!="undefined" && rfs ) { // cancel full screen.
						rfs.call(el);
					} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
						var wscript = new ActiveXObject("WScript.Shell");
						if (wscript !== null) {
							wscript.SendKeys("{F11}");
						}
					}
					
					
				}else{
					
					var el = document.documentElement,
					rfs = // for newer Webkit and Firefox
					   el.requestFullScreen
					|| el.webkitRequestFullScreen
					|| el.mozRequestFullScreen
					|| el.msRequestFullscreen;
					
					if(typeof rfs!="undefined" && rfs){
					  rfs.call(el);
					} else if(typeof window.ActiveXObject!="undefined"){
					  // for Internet Explorer
					  var wscript = new ActiveXObject("WScript.Shell");
					  if (wscript!=null) {
						 wscript.SendKeys("{F11}");
					  }
					}
					
					element.className = "fullscreen-off";
					
				}
			}

			this.objGlobalTranslate =  function(){
				this.translate = scope.objTranslate["value"];
				this.reverse = function( obj ){
					
					var translate = this.translate;
					
					//reverse translate
					if( translate.staticObjStateX === 'left' ){
						obj.x -= translate.staticObjMoveX;
					}else if( translate.staticObjStateX === 'right' ) {
						obj.x += translate.staticObjMoveX;
					}
					
					var staticObjStateY = translate.staticObjStateY,
					staticMoveY = staticObjStateY === 'up' ? -translate.staticObjMoveY :
						staticObjStateY === 'down' ? translate.staticObjMoveY : 0;
						
					obj.y += staticMoveY;
				}
				this.update = function( obj ){
					
					var translate = this.translate;
					
					if( translate.staticObjStateX === 'left' ){
						obj.x += translate.staticObjMoveX;
					}else if( translate.staticObjStateX === 'right' ) {
						obj.x -= translate.staticObjMoveX;
					}
					
					var staticObjStateY = translate.staticObjStateY,
					staticMoveY = staticObjStateY === 'up' ? translate.staticObjMoveY :
						staticObjStateY === 'down' ? -translate.staticObjMoveY : 0;
						
					obj.y += staticMoveY;
					
				}
				
			}
  
		}
	},{
		
		'math2d' : function(){
			
			this.distanceAndAngleBetweenTwoPoints = function( x1, y1, x2, y2 ){
				var x = x2 - x1,
				   y = y2 - y1;

			   return {
				  // x^2 + y^2 = r^2
				  distance: Math.sqrt(x * x + y * y),

				  // convert from radians to degrees
				  angle: Math.atan2(y, x) * 180 / Math.PI
			   }
			}
			
			this.angleToRadian = function( angle ){
				return ( ( angle * Math.PI ) / 180 );
			}
			
			this.vector = function( magnitude, angle ){
			   var angleRadians = ( angle * Math.PI ) / 180;
			   this.x = magnitude * Math.cos( angleRadians );
			   this.y = magnitude * Math.sin( angleRadians );
			}
			
			this.getRelativeMousePosition = function(event, element, pixelRatio) {
				var elementBounds = element.getBoundingClientRect(),
					rootNode = (document.documentElement || document.body.parentNode || document.body),
					scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft,
					scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop,
					touches = event.changedTouches,
					x, y;

				if (touches) {
					x = touches[0].pageX - elementBounds.left - scrollX;
					y = touches[0].pageY - elementBounds.top - scrollY;
				} else {
					x = event.pageX - elementBounds.left - scrollX;
					y = event.pageY - elementBounds.top - scrollY;
				}

				return {
					x: x ,
					y: y
				};
			}
			
			this.intersectsCircle = function(x, y, cx, cy, r){
				//http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
				var dx = x-cx,
					dy = y-cy
				//collision between cricle and pointer but it is useless to apply to poly
				return dx * dx + dy * dy <= r * r
			}
		 
		}
	});
	  
	  
	for (var jj = 0, js = owl.owlModules; jj < js.length; jj++) 
	{
		for( var kk in js[jj] ){

			modules[ kk ] = js[jj][ kk ];
		}
	}  		
  
 
	/** cordova */
			
	const setToMobile = true;
	 
	global.addEventListener('DOMContentLoaded', function(){

		if( setToMobile ){
			
			document.addEventListener("deviceready",  function(){ 
			    
				//let owl data stored first
				
				var self = setInterval(function(){
			 
					if( owl.dataLoader.length ){
						 
						owlApp( global, owl.dataLoader[0], modules, setToMobile );  
						clearInterval( self );
					}
				},1)
				  
			});
			
		}else{
			
			//let owl data stored first
			var self = setInterval(function(){
		 
				if( owl.dataLoader.length ){
					 
					owlApp( global, owl.dataLoader[0], modules, setToMobile );  
					clearInterval( self );
				}
			},1)
		}
	
	})
   
	
	
	//let owl data stored first
	/*
	var self = setInterval(function(){
		
		if( owl.dataLoader.length && global.owl.isDeviceread ){
			owlApp( global, owl.dataLoader[0], modules );  
			clearInterval( self );
		}
	},1)*/
   
}( window, function( global, owlData, modules, setToMobile ){ 
   
 
	owl.gui = function( _obj )
	{
		var scope = this,
		obj = {
			path: "assets/2d/"
		};

		for(var ii in obj) _obj[ii] = obj[ii];

		for(var ii = arguments, jj = ii.length; jj--;)
		{  
			if('function' === typeof ii[jj])
			{ 
		
		
				ii[jj].apply(null, [scope, _obj])
				ii[jj].apply(null, [scope, obj])
 
				scope.mouseCreate( document.body );
				
				scope.frontend();
				
				
			}
		}

	}
	 
	owl.gui.prototype = {
		
		frontend : function()
		{
			setTimeout( function()
			{ 
				let strHtml5Storage = "kms-bumil-storage"
				dataObject = "",
				swiperChartOnMove = "",
				stateFirstload = {},
				stateTimer = {
					remainder : false,
					tracker : false
				},
				remainderTimestampArr = [];
				   
				//storageCrud params noUpdateFileSource only for type select
				   
				const scope =  this; 
				const localStorage =  window.localStorage;
				const obj = {
					dataStorage : {},
					storage : function( callback ){
  	 
						let unWantedItem = function( storage ){
							 
							for( let ii in storage ){
								
								let objArray = storage[ii];
								
								if( objArray instanceof  Array ){
								
									objArray.map( function( objData, index ){
										
										if(  ii !== "dataObject" ){
										
											let babyUnRegistered = true;
											
											// check if this objData has own active baby
											
											for( var jj = 0, kk = storage[ 'dataObject' ]; jj < kk.length ; jj++ ){
												 
												if( kk[jj].id === objData.objectId ){
													
													babyUnRegistered = false;
													
													break;
												   
												}
												
											}  
											//remove bug of undeleted item
											
											if( babyUnRegistered && storage[ 'dataObject' ].length ){
												
												objArray.splice( index, 1 ); 
											}
										}										
									}) 
								}
							}  
							
						}
	
						obj.cordova.localStorage.get( function( storage ){  	
						     
							dataObject = { 
								id : "sjdud",
								name : "Agita Sari",
								calculateMethod : {
									init : "usg",
									date : "21/2/2019 12.15.46",
									gestasionalAge : 8
								}
							}
							
							//remove bug of undeleted item 
							unWantedItem( storage );
							  
							//set global baby's data
							storage[ 'dataObject' ].map( function( dataObj ){
								
								if( dataObj.active ){
									
									dataObject = dataObj
								}
							})
							 
							  
							//db structure update if needed
							obj.cordova.localStorage.updateDb();						
							  
							//save 
							
							obj.cordova.appCheck(function(){
								
								obj.cordova.localStorage.put(function(){
									
									callback.call( {} )
								}); 
							
							})
							   
							   
						}) 
						   
					},
					storageState : function( params, callback ){ 
					   
						let storage = obj.dataStorage;
						
						switch( params.storageState ){
							 
							case "layoutState" :
							case "flhState" :
							case "acState" :
							case "hcState" :
							case "bpdState" :
							case "wfaState" :
							case "ofdState" :
							case "trackerRange" :
							case "trackerState" :
							case "memoState" :
								 
								storage[ params.storageState ][ params.objState ] = params.value;
								 
								
							break;
						} 
						 
						//debug onleh 
						obj.cordova.localStorage.put();	
						
						callback.call( {} );
						 	
					},
					storageCrud : function( getParams, callback ){
						   
						let dbProcessFn = function( params, storage ){
							
							let dataSelected = "";
							   
							switch( params.dataStorage ){
								
								case "bpmBumil" :
								
									if( params.type === "add" ){
										  
										storage.bpmBumil.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"), 
											bpm : params.bpm
										}); 
										  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.bpmBumil ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.bpmBumil ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID"); 
												objNoify.bpm = params.bpm;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.bpmBumil ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.bpmBumil ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.bpmBumil; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.bpmBumil.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
								
								case "tfuBumil" :
								
									if( params.type === "add" ){
										  
										storage.tfuBumil.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"), 
											tfu : params.tfu
										}); 
										  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.tfuBumil ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.tfuBumil ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID"); 
												objNoify.tfu = params.tfu;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.tfuBumil ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.tfuBumil ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.tfuBumil; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.tfuBumil.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
								
								case "bpBumil" : 
									
									if( params.type === "add" ){
										  
										storage.bpBumil.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											dayTo : params.dayTo,
											systolic : params.systolic,
											diastolic : params.diastolic,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
										}); 
										  
									}else if( params.type === "update-dayto"){
									
							 
										for( let bp of storage.bpBumil ){
											 
											if( bp.dayTo === params.dayTo && dataObject.id === bp.objectId ){
												 
												bp.dayTo = params.dayTo;
												bp.dateSelect = params.dateSelect.toLocaleString("id-ID"); 
												bp.systolic = params.systolic;
												bp.diastolic = params.diastolic;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-dayto"){
									
										
										for( let bp of storage.bpBumil ){
											 
											if( bp.dayTo === params.dayTo && dataObject.id === bp.objectId ){
												
												dataSelected = bp;
												
												break;
											}
											
										} 
										
									}else if( params.type === "select" ){
										
										for( let bp of storage.bpBumil ){
											 
											if( dataObject.id === bp.objectId && bp.id === params.id ){
												  
												dataSelected = bp; 
												
												break;
											}
											
										}  
										
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.bpBumil; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.bpBumil.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
								 
									break;
									
								case "weightBumil" : 
									
									if( params.type === "add" ){
										  
										storage.weightBumil.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											dayTo : params.dayTo,
											weight : params.weight,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
										}); 
										  
									}else if( params.type === "update-dayto"){
									
							 
										for( let weight of storage.weightBumil ){
											 
											if( weight.dayTo === params.dayTo && dataObject.id === weight.objectId ){
												 
												weight.dayTo = params.dayTo;
												weight.dateSelect = params.dateSelect.toLocaleString("id-ID"); 
												weight.weight = params.weight;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-dayto"){
									
										
										for( let weight of storage.weightBumil ){
											 
											if( weight.dayTo === params.dayTo && dataObject.id === weight.objectId ){
												
												dataSelected = weight;
												
												break;
											}
											
										} 
										
									}else if( params.type === "select" ){
										
										for( let weight of storage.weightBumil ){
											 
											if( dataObject.id === weight.objectId && weight.id === params.id ){
												  
												dataSelected = weight; 
												break;
											}
											
										}  
										
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.weightBumil; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.weightBumil.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
								 
									break;
									
								case "imtBumil" :
									 
									if( params.type === "add" ){
										  
										storage.imtBumil.unshift({
											objectId : dataObject.id,
											imt : params.imt,
											weight : params.weight,
											height : params.height,
											weightRecom : params.weightRecom,
											status : params.status
										}); 
										  
									}else if( params.type === "select" ){
										
										for( let imt of storage.imtBumil ){
											 
											if( dataObject.id === imt.objectId ){
												  
												dataSelected = imt; 
												break;
											}
											
										}  
										
									}else if( params.type === "update"){
	  
										for( let imt of storage.imtBumil ){
											 			 
											if( dataObject.id === imt.objectId ){
												    
												imt.imt = params.imt; 
												
												imt.weight = params.weight; 
												
												imt.height = params.height; 
												
												imt.weightRecom = params.weightRecom; 
												
												imt.status = params.status
												
												break;
											}
											
										} 
									}
								 
									break;
										
								
								case "kick" :
								
									if( params.type === "add" ){
										  
										storage.kick.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											startDate : params.startDate,
											endDate : params.endDate,
											timer : params.timer,
											fetusAge : params.fetusAge,
											count :params.count
										}); 
										  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.kick; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												 
												storage.kick.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
								
								case "contraction" :
								
									if( params.type === "add" ){
										  
										storage.contraction.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											startDate : params.startDate,
											endDate : params.endDate,
											timer : params.timer,
											fetusAge : params.fetusAge
										}); 
										  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.contraction; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												 
												storage.contraction.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
								
								
								case "dataObject" :
									
									if( params.type === "add" ){
										   
										//deactive 
										storage.dataObject.map(function( objData ){ 
											objData.active =  false;
										})
										 
										storage.dataObject.unshift({ 
											id : scope.uniqueString(),
											name : params.name,
											typeText : params.typeText,
											typeSelect : params.typeSelect,
											calculateMethod : params.pregCalculate,
											active : true
										}); 
									 
									}else if( params.type === "set-active" ){
										   
										//deactive 
										storage.dataObject.map(function( objData ){ 
											objData.active =  false;
										})
											
																			
										for( let objNoify of storage.dataObject ){
											 
											if( objNoify.id === params.id  ){
												
												objNoify.active =  true;
												 
												dataSelected = objNoify;
												
												break;
											} 
										} 	
											
									}else if( params.type === "select" ){
										   								
										for( let objNoify of storage.dataObject ){
											  
											if( objNoify.id === params.id  ){
												 
												dataSelected = objNoify;
												 
												break;
											} 
										} 	
											
									}else if( params.type === "delete" ){
										 
										for( let ii in storage ){
											
											let objArray = storage[ii];
											
											if( objArray instanceof Array ){
												    
												storage[ii] = objArray.filter( function( objData ){
													
													var needDelete = ( ii === "dataObject" && objData.id === params.id || objData.objectId === params.id )
													 
													if( needDelete && ii === "notification" ){
														 
														//corodva register notification
														obj.cordova.notification.cancel({
															id: objData.cordovaId
														}) 
														
													}
													 
													return !needDelete;
												})	
												   
												if( ii === "dataObject" && storage.dataObject[0] ){
													
													storage.dataObject[0].active = true;
													
													dataObject = storage.dataObject[0];
												}
											}
											
											if( ii === "trackerCategory" ){
												
												
												for( var jj in storage[ii] ){
													
													let category = storage[ii][jj]
													
													storage[ii][jj] = category.filter( function( objData ){ 
													  
														return objData.objectId !== params.id 
													})
													
												}
												
												
												
											}
										}
										   
										 
										//prevent bug error when tab e is active 
										storage.layoutState.activeLayout.tab = "tab-e";	 
										storage.layoutState.activeLayout.index = 0;		

										
										if( obj.dataStorage.dataObject.length ){
											
											//deactive 
											obj.dataStorage.dataObject.map(function( objData ){ 
												objData.active =  false;
											})
										 
											dataObject = obj.dataStorage.dataObject[0];
											dataObject.active =  true;
					   		
										}
										
										obj.reupdateData();
								
										obj.layoutChartUpdate = true; 
										
										obj.layoutChartUpdateControl = true; 
														   
										obj.modal.trackerNew.update();
										
										
									}
									
									break;
									
								case "ofd" :
								
									if( params.type === "add" ){
										  
										storage.ofd.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											ofd : params.ofd
										}); 
										  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.ofd ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.ofd ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.ofd = params.ofd;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.ofd ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.ofd ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.ofd; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.ofd.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									 	 
									break;
									
								case "flh" :
								
									if( params.type === "add" ){
										  
										storage.flh.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											flh : params.flh
										}); 
										  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.flh ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.flh ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.flh = params.flh;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.flh ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.flh ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.flh; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.flh.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
								
								case "ac" :
								
									if( params.type === "add" ){
										  
										storage.ac.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											ac : params.ac
										}); 
										  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.ac ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.ac ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.ac = params.ac;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.ac ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.ac ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.ac; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.ac.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									break;
								
								case "hc" :
								
									if( params.type === "add" ){
										  
										storage.hc.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											hc : params.hc
										}); 
										  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.hc ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.hc ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.hc = params.hc;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.hc ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.hc ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.hc; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataObject.id === jj[ii].objectId ){
												
												storage.hc.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									break;
									
								case "bpd" :
								
									if( params.type === "add"){
										  
										storage.bpd.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											bpd : params.bpd
										}); 
										  
									}else if( params.type === "update-weekto"){
									 
										for( let objNoify of storage.bpd ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID"); 
												objNoify.bpd = params.bpd;
												  
												break;
											}
											
										} 
									}else if(params.type === "select"){
										
										for( let objNoify of storage.bpd ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.bpd ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.bpd; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												
												storage.bpd.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
									
								case "wfa" :
								 
									if( params.type === "add"){
										  
										storage.wfa.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											weekTo : params.weekTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											weight : params.weight
										});
									}else if( params.type === "select-weekto"){
									
										
										for( let objNoify of storage.wfa ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-weekto"){
									
							 
										for( let objNoify of storage.wfa ){
											 
											if( objNoify.weekTo === params.weekTo && dataObject.id === objNoify.objectId ){
												 
												objNoify.weekTo = params.weekTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.weight = params.weight;
												  
												break;
											}
											
										} 
									}else if(params.type === "select"){
										
										for( let objNoify of storage.wfa ){
											 
											if( objNoify.id === params.id && dataObject.id === objNoify.objectId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "select-all"){
										
										dataSelected = storage.wfa;
									
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.wfa; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataObject.id === jj[ii].objectId ){
												
												storage.wfa.splice( ii, 1 ); 
												 
												break;
											}
										} 
									} 
									
									break;
								
								case "tracker-category" : 
								 
									if( params.type === "add" ){
										  
										 
										storage.trackerCategory[ params.target ].unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											startDate : params.startDate,
											latestDate : "", 
											name : scope.ucFirst( params.name.toLowerCase() ),
											unit : params.unit,
											unitShort : params.unitShort,
											isRunning : params.isRunning,
											isUnit : params.isUnit,
										}); 
										  
									}else if( params.type === "update"){
										
										for (let ii = 0, jj = storage.trackerCategory[ params.target ]; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id  && ( dataObject.id === jj[ii].objectId || jj[ii].objectId === "sjdud" )  ){
	  
												jj[ii].latestDate =  params.latestDate; 
												
												break;
											}
										} 
									
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.trackerCategory[ params.target ]; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id && ( jj[ii].objectId === "sjdud" || dataObject.id === jj[ii].objectId ) ){
												 
												jj.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
								 
									break;
										
								case "tracker" : 
									
									if( params.type === "add"){
										  
										storage.tracker.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											activityType : params.activityType,
											activitySelect : params.activitySelect,
											dateStart : params.dateStart,
											dateEnd : params.dateEnd,
											isRunning : params.running ? true : false,
											running : params.running ? true : false,
											isUnit : params.isUnit ? true : false,
											unit : params.unit ? params.unit : "",
											unitShort : params.unitShort ? params.unitShort : "",
											icon : params.icon
										})
										
									}else if( params.type === "update"){
	 
										let extendMilli = params.milliliter >= 0 ? params.milliliter : '';
										
										for (let ii = 0, jj = storage.tracker; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  ){ //&& dataObject.id === jj[ii].objectId execption pompa asi
	 
												jj[ii].running =  false;
												
												jj[ii].isUnit =  false;
												
												jj[ii].dateEnd =  params.dateEnd;
												
												if( extendMilli !== "" ){
														
													jj[ii].milliliter = params.milliliter;
												}
												 
												break;
											}
										} 
									}else if( params.type === "select-all"){
										
										dataSelected = storage.tracker;
									
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.tracker; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataObject.id === jj[ii].objectId ){
												
												storage.tracker.splice( ii, 1 ); 
												
												break;
											}
										} 
									}
									
									break;
								
								case"memo" :
								
									if( params.type === "add"){
										
										storage.memo.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											title : scope.ucFirst( params.title.toLowerCase() ),
											text : scope.ucFirst( params.text.toLowerCase() ),
											uri : params.uri, // array
											label : params.label, // array
											dateStart : params.dateStart
										})
										 
									}else if( params.type === "select-all"){
										
										dataSelected = storage.memo;
									
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.memo; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataObject.id === jj[ii].objectId ){
												
												storage.memo.splice( ii, 1 ); 
												
												break;
											}
										} 
									}
									
									break;
									
								case "notification" :
								
									if( params.type === "add"){
										
										storage.notification.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											cordovaId : scope.random( 99999,10000 ),
											reminder : params.reminder,
											timer : params.timer,
											stringDate : params.stringDate,
											labelText : scope.ucFirst( params.labelText.toLowerCase() ),
											dateStart : params.dateStart,
											dateEnd : params.dateEnd,
											loop : params.loop
										})
										
										
										dataSelected = storage.notification[0];
										
									}else if( params.type === "select"){
										
										for( let objNoify of storage.notification ){
											 
											if( objNoify.id === params.id  && dataObject.id === objNoify.objectId ){
												
												dataSelected = objNoify;
												
												break;
											}
											
										} 
									}else if( params.type === "update"){
	  
										for (let ii = 0, jj = storage.notification; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId  ){
	  
												jj[ii].dateEnd =  params.dateEnd;
												 
												break;
											}
										} 
									}else if( params.type === "delete"){
										
										
										for (let ii = 0, jj = storage.notification; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id ){ // && dataBaby.id === jj[ii].babyId 
												
												dataSelected = jj[ii];	
												
												storage.notification.splice( ii, 1 );
												
												for( let kk = 0, ll = remainderTimestampArr; kk < ll.length; kk++ ){
													 
													if( ll[kk].id === params.id ){ 
													
														remainderTimestampArr.splice( kk, 1 ); 
														
														break;
													}
												}
												
												break;
											}
										} 
									}else if( params.type === "select-all"){
										
										dataSelected = storage.notification;
									}
									
									break;
							}
							
							return dataSelected
						},
						filterDbMultiple = function( storage ){
							
							let dataSelected;
							
							if( getParams.updateTable === "multiple" ){
								
								for( let ii in getParams.tableGroup ){
									
									dataSelected = dbProcessFn( getParams.tableGroup[ii], storage );
									 
								}
								
							}else{
								
								dataSelected = dbProcessFn( getParams, storage );
								
							}
							 
							return dataSelected;
							
						}
						   
						if( !getParams.noUpdateFileSource ) { 
							   
							let dataSelected = filterDbMultiple( obj.dataStorage );
							 
							//save 
							obj.cordova.localStorage.put(function(){
								
								callback.call( {}, dataSelected )
								
							}); 
						
						}else{
							
							
							let dataSelected = filterDbMultiple( obj.dataStorage );
							
							callback.call( {}, dataSelected )
							
						}
						
					},
					storageFilter : function( data ){
						return data.filter(function( objData ){
							return objData.objectId === dataObject.id
						})
					},
					pregCalculate :{ 
						conception : function( params ){
						
							let conceptionDate = "",
							dueDate = "",
							dateSelect = params && params.dateSelect ? 
								scope.stringToDate( params.dateSelect ) : 
								new Date(),
							cpcDate = params ? 
								scope.stringToDate( params.date ) : 
								scope.stringToDate( dataObject.calculateMethod.date ); // scope.stringToDate("19/7/2019 00.00.00"),
							
							conceptionDate = new Date( cpcDate );
							
							conceptionDate.setDate( cpcDate.getDate() - 14 )
							
							cpcDate.setDate( cpcDate.getDate() + 266 );
			 
							dueDate = new Date( cpcDate );
							
							var fetalage = 14 + 266 - ( ( cpcDate.getTime() - ( dateSelect ).getTime() ) / 86400000);
							weeks = parseInt(fetalage / 7); // sets weeks to whole number of weeks
							days = Math.floor(fetalage % 7); // sets days to the whole number remainder
									
									
							return {
								conceptionDate : conceptionDate,
								dueDate : dueDate,
								fetusAge : {
									weeks : weeks,
									days : days
								}
							}		
						},
						lastPeriod : function( params ){
							
							let dueDate = "",
							fetusAgeToDate = "",
							luteal = 14, //9 ~ 16 Average Luteal Phase Length
							dateSelect = params && params.dateSelect ? 
								scope.stringToDate( params.dateSelect ) : 
								new Date(),
							hpht = params ? 
								scope.stringToDate( params.date ) : 
								scope.stringToDate( dataObject.calculateMethod.date ), // scope.stringToDate("19/7/2019 00.00.00"),
							cyclePeriode = params ?
								params.cyclePeriode :
								dataObject.calculateMethod.cyclePeriode, // =  //28, // in days
							
							latestPeriod = new Date( hpht )
							
							hpht.setTime( hpht.getTime() + ( cyclePeriode * 86400000) - (luteal*86400000));
			 
							fetusAgeToDate = new Date( hpht );		 
							
							hpht.setTime(hpht.getTime() + 266*86400000);
							
							dueDate = new Date( hpht ); 			 
							
							var fetalage = 14 + 266 - ( ( hpht.getTime() - ( dateSelect ).getTime() ) / 86400000);
							weeks = parseInt(fetalage / 7); // sets weeks to whole number of weeks
							days = Math.floor(fetalage % 7); // sets days to the whole number remainder
							 
							return {
								conceptionDate : latestPeriod,
								dueDate : dueDate,
								fetusAge : {
									weeks : weeks,
									days : days
								}
							}		
			
						},
						ultrasound: function( params ){
							 
							 
							let dateSelect = params && params.dateSelect ? 
								scope.stringToDate( params.dateSelect ) : 
								new Date(),
							usgDateRecord = params ? 
								scope.stringToDate( params.date ) : 
								scope.stringToDate( dataObject.calculateMethod.date ), // scope.stringToDate("19/7/2019 00.00.00"),
							
							usgGestionalAge =  
								params ? params.gestasionalAge :
								dataObject.calculateMethod.gestasionalAge, // =  //8, // in days
							
							usgDateNow = dateSelect,
						  
							gaInMs = usgGestionalAge * 1000 * 60 * 60 * 24,

							_40weeks = 24192000000,

							dueDateMilliSeconds = usgDateRecord.getTime() - gaInMs + _40weeks,

							answerDate = new Date( dueDateMilliSeconds ),
		  
							currGestAgeMilliSeconds = usgDateNow.getTime() - ( usgDateRecord.getTime() - gaInMs),

							_1day = 86400000,

							//first calculate the number of days, rounded
							gestAgeDays = Math.round( currGestAgeMilliSeconds / _1day ),

							gestAgeWeeks = ( gestAgeDays / 7.0),

							answerWeeks = ~~gestAgeWeeks,
							answerDays = gestAgeDays%7;
  
							return {
								conceptionDate : new Date( usgDateNow.getTime() - currGestAgeMilliSeconds ),
								dueDate : answerDate,
								fetusAge : {
									weeks : answerWeeks,
									days : answerDays
								}
							}
						}, 
						getIntervalDayByWeek : function( initialWeek ){
							  
							let conceptionDate = new Date( this.pergPredict.conceptionDate );
							 
							conceptionDate.setDate( conceptionDate.getDate() - 1 );
							
							let daysOnWeek = initialWeek * 7,  
							 
							fistDate = new Date( conceptionDate );
							
							fistDate.setDate( fistDate.getDate() + daysOnWeek + 1 );
							
							let lastDay = scope.dateToYMD( fistDate, "year", "", "", "shortyear" ).split(",")[1];
							
							 
							let scondDate = new Date( conceptionDate );
							
							
							scondDate.setDate( scondDate.getDate() +  daysOnWeek - ( initialWeek === 1 ? 6 : 5)  );
							
							let firstDay = scope.dateToYMD( scondDate , "year", "", "", "shortyear" ).split(",")[1];
							  
							return {
								week : initialWeek,
								lastDay : lastDay,
								firstDay : firstDay
							}
							
							
						},
						totalWeek : 0,
						pergPredict : {
							conceptionDate : "",
							dueDate : "",
							fetusAge : {
								weeks : "",
								days : ""
							}
						},
						init : function(){
							 
							switch( dataObject.calculateMethod.init ){
								
								case "usg" :
									
									scope.extend( this.pergPredict, this.ultrasound() );
									
									break;
									
								case "hpht" :
									
									scope.extend( this.pergPredict, this.lastPeriod() );
									
									break;
									
								case "conception" :
									
									scope.extend( this.pergPredict, this.conception() );
									
									break;	
								
							} 
							
							this.totalWeek = scope.getMinutesHourDayOrWeekBetweenDates( this.pergPredict.dueDate, this.pergPredict.conceptionDate, "week", "floor" );
							   
						}						
					},
					dateTimeRangeValidate : function( data, stringObj ){
						
						
						
						//filter content
						let temporary = [];
						
						data.forEach(function( dataNote ){
							  
							let dateNow = new Date(),
							
							dateStart = scope.stringToDate( dataNote.dateStart ),
							
							time = scope.timeUnitBetween( dateNow, dateStart ),
								
							limitArr = stringObj.split("-") // ex 7-hari, 15 hari	
							
								
							switch( limitArr[1] ){
								
								case "hari" : 
									if( !time.month && !time.week && time.day <= parseInt( limitArr[0] ) ){ // not week or month <= 0
										 
										temporary.push( dataNote ); 
									}
									
									break;
								
								case "minggu" : 
									
									 
									if( !time.month &&
										time.week < parseInt( limitArr[0] ) ){
										temporary.push( dataNote ); 
									}
									
									break;
								
								case "bulan" :
								
									if( time.month <  parseInt( limitArr[0] ) ){
										
										temporary.push( dataNote );
									}
									break;
									
								case "all" :
								
									temporary = data;
									
									break;
							}
							
						});
						
						return temporary;
						
					},
					stringMatchOrEmptyValidate : function( data, stringObj ){
						
						//filter content
						let temporary = [];
						
						data.forEach(function( dataNote, index ){
							
							if( stringObj && 
							stringObj.toLowerCase().replace(/\s/g, '') === 
							dataNote.activityType.toLowerCase().replace(/\s/g, '') || 
							!stringObj || dataNote.running ){
								
								temporary.push( dataNote );
								
							}
							
						})
						
						
						return temporary;
						
					},
					inputValidate : function( inputArr ){
						
						let test = true;
						inputArr.map( function( objInput ){
							
							if( /textarea|input/i.test( objInput.nodeName.toLowerCase() ) ){
								
								if( objInput.value.trim().length ){
									scope.removeClass( objInput, "wrongcase");
								}else{
									
									test = false;
									scope.addClass( objInput, "wrongcase");
								}
							}
						})
						
						// save first then clear the elements
						setTimeout(function(){
							if( test ){
								inputArr.map( function( objInput ){
									objInput.value = "";
								}) 
							}
						},1000)
						
						return test; 
						
					},
					generateExpandCollapse : function( parent, needClone ){
						
						let selectedParent;
						
						if( !parent ){
							
							selectedParent = scope.slice( scope.qsAll("content-collapse > ul > li") );
							
						}else{
							
							selectedParent = scope.slice( parent.querySelectorAll(".content-collapse > ul > li") );

						}
						 
						let coll = selectedParent.filter(function (item, index) {
					 
							let elLastChild = item.firstChild && scope.getLastChild( item ) || "";
							  
							return elLastChild && /content/i.test( elLastChild.className );
						});
						
						for (var ii = 0; ii < coll.length; ii++ ) {
							
							let btn = "";
							
							if( needClone ){
								
								btn = coll[ii].cloneNode(true);
								coll[ii].parentNode.replaceChild( btn, coll[ii] ); 
					 
							}else{
								
								btn = coll[ii];
							}
							
							
							
							btn.addEventListener("click", function( e ) {
								    
								 						
								if( this.querySelector(".content").contains( e.target ) ) return;
								    	
								var contentFocus = scope.getLastChild( this );
								 
								coll.map(function( objElement ){
									
									var content = scope.getLastChild( objElement );
									
									if ( contentFocus !== content && content.style.maxHeight ){
										
										content.style.maxHeight = null;
										 
										scope.removeClass( content, "pb20")
									 
									}
								})
								 
								//jika ada untuk btn collaps
								let btnCollaps = this.querySelector(".btn-collapse");
						 
								if( btnCollaps ){
									 
									if( /select/i.test( btnCollaps.className ) ){
										
										scope.removeClass( btnCollaps, "select" )
										
									}else{
										scope.addClass( btnCollaps, "select" )
									}
									
								}
								 
								if ( contentFocus.style.maxHeight ){
									
									contentFocus.style.maxHeight = null;
									  
									scope.removeClass( contentFocus, "pb20")
									
								} else {
									
									contentFocus.style.maxHeight = contentFocus.scrollHeight + "px";
									
									if( !/js-no-padding/i.test( contentFocus.className ) ){
									 
										scope.addClass( contentFocus, "pb20")
										
									}
									 
								} 
							});
						}
					},
					generateSwiperDate : function( params ){
						//assign swiper
						
						let containerStr = params.containerStr,
						containerEl = scope.qs( containerStr ),
						objDate = new Date(),
						year = objDate.getFullYear(),
						month = objDate.getMonth(),
						day = objDate.getDate(),
						defaults = {
							observer: true,
							observeParents: true,
							pagination: containerStr+' .swiper-pagination',
							slidesPerView: 3,
							loop: true,
							loopAdditionalSlides: 3,
							direction: 'vertical',
							centeredSlides: true
						},
						
						days = new Swiper(
						  containerStr+' .days', 
						  Object.assign({}, defaults, { initialSlide: day - 1})
						); 
						
						let months = new Swiper(
						   containerStr+'  .months',
						  Object.assign({}, defaults, { initialSlide: month })
						);
						let index = 0,
						elYears = scope.slice( containerEl.querySelectorAll( containerStr+" .years .swiper-slide") )
						 
						elYears.map(function( obj ){
							 
							if( obj.getAttribute("label-text") === year.toString()  ){
								index = obj.getAttribute("label-index");
							}
						})  
						
						let years = new Swiper(
							 containerStr+'  .years', 
							Object.assign({}, defaults, { initialSlide: parseInt( index ) })
						),
						dateSelectFn = function(){
							let timepicked = scope.slice( containerEl.querySelectorAll(".swiper-slide-active") );
							 
							//reverse it to yyyy/mm/dd
							timepicked.reverse();
							
							let detSelect = new Date( 
								parseInt( timepicked[0].textContent ), 
								parseInt( timepicked[1].textContent ) , 
								1
							);
							
							return detSelect;
						},
						updateDaysFn = function () {
							 
							obj.generateDatePluginElement({
								days : true,
								dateSelect : dateSelectFn()
							})
							days.destroy( true, true )
							
							days = new Swiper(
							   containerStr+'  .days', 
							  Object.assign({}, defaults, { initialSlide: 0 })
							) 
							 
							days.on('slideChangeTransitionEnd', function () {
								params.fn && params.fn();
							});
							
						}; 
						
						years.on('transitionEnd',updateDaysFn ); 
						months.on('transitionEnd',updateDaysFn ); 
						
						months.on('slideChangeTransitionEnd', function () {
							params.fn && params.fn();
						});
						
						years.on('slideChangeTransitionEnd', function () {
							params.fn && params.fn();
						});
						
						days.on('slideChangeTransitionEnd', function () {
							params.fn && params.fn();
						});
					},
					generateDatePluginElement : function( params ){
						 
						if( params && params.dateSelect ){
							 
							var objDate = params.dateSelect,
							year = objDate.getFullYear(),
							month = objDate.getMonth(),
							numberDays = new Date( year, month, 0 ).getDate(); 
							 
						}else{
							
							var objDate = new Date(), //"2020/1/1" //obj.chart.requireDataObject().pregDateStart,
							year = objDate.getFullYear() - 4,
							month = objDate.getMonth() + 1,
							numberDays = new Date( year, month, 0 ).getDate(); 
						} 
						
						
						if( params && params.year || !params ){
							
							let registerPlugin = [  
								".datepicker-bpmbumil",
								".datepicker-weightbumil", ".datepicker-bpbumil", ".datepicker-tfubumil",
								".datepicker-remainder",".datepicker-wfa",".datepicker-bpd",
								".datepicker-hc",".datepicker-ac",".datepicker-flh",".datepicker-ofd",
								".datepicker-hpht",".datepicker-usg", ".datepicker-cpc" ],
							stringEl = " .years .swiper-wrapper";
							 
							registerPlugin.forEach(function( objElement ){
								
								let parent = scope.qs( objElement + stringEl ),
								loop6Years = 11,
								loopInYears = year,
								index = 0;
								   
								if( !/hidden/i.test( scope.qs(objElement).className ) || !params   ){
								
									parent.innerHTML = "";
									 
									while( loop6Years-- ){
										 
										let divEl = scope.stringToHtml5Template('<div class="swiper-slide" label-index="'+ index++ +'" label-text="'+ loopInYears +'">' + loopInYears +'</div>');
										 
										loopInYears++
										 
										parent.appendChild( divEl )
									}
								}
							})
						} 
						
						
						if( params && params.month || !params ){
							
							let registerPlugin = [ 
								".datepicker-bpmbumil",
								".datepicker-weightbumil", ".datepicker-bpbumil", ".datepicker-tfubumil",
									".datepicker-remainder",".datepicker-wfa",".datepicker-bpd",
									".datepicker-hc",".datepicker-ac",".datepicker-flh",".datepicker-ofd",
									".datepicker-hpht",".datepicker-usg", ".datepicker-cpc" ],
							stringEl = " .months .swiper-wrapper";
							 
							registerPlugin.forEach(function( objElement ){
								
								let parent = scope.qs( objElement + stringEl ),
								loopMonths = 12,
								valMonth = 0;
								
								if( !/hidden/i.test( scope.qs(objElement).className ) || !params  ){
								
									parent.innerHTML = "";
									 
									while( loopMonths-- ){
									
										valMonth++; 
										divEl = scope.stringToHtml5Template('<div class="swiper-slide">'+ ( valMonth.toString().length === 1 ? '0'+valMonth : valMonth ) +'</div>');
								 
										parent.appendChild( divEl )
									}
								}	
							})
						}
						
						
						if( params && params.days || !params ){
							
							let registerPlugin = [  
								".datepicker-bpmbumil",
								".datepicker-weightbumil", ".datepicker-bpbumil", ".datepicker-tfubumil",
								".datepicker-remainder",".datepicker-wfa",".datepicker-bpd",
								".datepicker-hc",".datepicker-ac",".datepicker-flh",".datepicker-ofd",
								".datepicker-hpht",".datepicker-usg", ".datepicker-cpc" ],
							stringEl = " .days .swiper-wrapper";
							 
							registerPlugin.forEach(function( objElement ){
								
								let elBound = scope.qs( objElement )
								parent = scope.qs( objElement + stringEl ),
								loopDays = 0;
								loopInDays = numberDays; 
								 
								if( !/hidden/i.test( scope.qs(objElement).className ) || !params  ){
								
									parent.innerHTML = "";
									 
									while( loopInDays-- ){
									
										loopDays++; 
										divEl = scope.stringToHtml5Template('<div class="swiper-slide">'+ ( loopDays.toString().length === 1 ? '0'+loopDays : loopDays) +'</div>');
								 
										parent.appendChild( divEl )
									}
								}
							})
						}
					
						//bind to swiper
					},
					hiddenAndShowModals : function( showClass ){
								
						var allModals = scope.slice( scope.qsAll("modal > div") );
						
						allModals.map(function( objModal ){
							
							scope.removeClass( objModal, "open" );
							scope.addClass( objModal, "hidden" )
						})
						
						scope.removeClass( scope.qs( showClass ), "hidden ")
						
					},
					hiddenAndShowModalMenu : function( showClass ){
								
						var allModals = scope.slice( scope.qsAll("modal-menu > div") );
						
						allModals.map(function( objModal ){
							
							scope.removeClass( objModal, "open" );
							scope.addClass( objModal, "hidden" )
						})
						
						scope.removeClass( scope.qs( showClass ), "hidden ")
						
					},
					hiddenAndShowPlugin : function( showClass ){
								
						var allModals = scope.slice( scope.qsAll("plugin > div") );
						
						allModals.map(function( objModal ){
							
							scope.removeClass( objModal, "open" );
							scope.addClass( objModal, "hidden" )
						})
						
						scope.removeClass( scope.qs( showClass ), "hidden ")
						
					},
					cordova:{
						appPlugin : function(){
							
							if( global.cordova ){
							
								cordova.getAppVersion.getVersionNumber(function (version) {
									
									scope.text( scope.qs("app-ver"), version );
									
								});
								
							}
						},
						appCheck : function( callback ){
							
							let packageApp = this.localStorage.id
						 
							if( global.cordova ){
								
								if( cordova.getAppVersion.getPackageName ){
									
									try {
										
										cordova.getAppVersion.getPackageName(function ( packageName ) {
											
											if( packageName.toLowerCase() === packageApp.toLowerCase() ){
												
												callback()
												
											}
											
										});
									
									} catch(err) { 
									
										callback()
									
									}
								
								}
								
							}else{
								 
								!setToMobile && callback()
								
							}
								
							
							
							
						}, 
						backButton : function(){
							
							if( global.cordova ){
								
								let nestedModalForceClose =  scope.qs("modal-menu-restore"),
								nestedModalInput =  scope.qs("modal-input"),
								nestedModalPlugin =  scope.qs("plugin"),
								nestedModalMenu =  scope.qs("modal-menu"),
								nestedModal =  scope.qs("modal"),
								firstCall = false;
								loadAds = 0;
								
								document.addEventListener("backbutton", function(){
									   
									 obj.modalInput.reset();  
									    
									 if( !/hidden/i.test( nestedModalForceClose.className ) ){
										  
										navigator.app.exitApp();
										  
									 }else if( !/hidden/i.test( nestedModalPlugin.className ) ){
										   
										obj.modalPlugin.behaviour.closeFadeout();
										   
									 }else if( !/hidden/i.test( nestedModalInput.className ) ){
										  
										obj.modalInput.closeModal();
										   
									 }else if( !/hidden/i.test( nestedModalMenu.className ) ){
										  
										obj.modalMenu.behaviour.closeFadeout();
										  
									 }else if( !/hidden/i.test( nestedModal.className ) && obj.dataStorage.dataObject.length ){
										
										obj.modal.behaviour.closeFadeout();
										 
									}else{
										   
										//save storage
										
										scope.delayFire(function(){ // prevent save multiple times in row
											 
												
											//sama dengan no berarti loadads tampilkan
											//loads -1 atau < dari berarti loadAds di Force
											
											if( obj.appConfig.ads.interstitial.isLoaded || loadAds <= -1 ){
												
												setTimeout(function(){
												
													if( !firstCall ){
														
														 
														obj.cordova.localStorage.put(function(){
															
															navigator.app.exitApp();   
														
														});
														
														firstCall = true
													}
												
												}, ( obj.appConfig.iap.isIapActive() ? 0 : 2000 ) )
											
											}
											if( !obj.appConfig.ads.interstitial.isLoaded  && loadAds === 0 ){
												 
												 obj.appConfig.ads.interstitial.forceToLoad();
												  
												 loadAds--;
												  
											}
											 

										},100)
										
									 }
									 
									 
									 
								});
								
							}
						},
						localStorage :{
							appName : "Bumil Sehat",
							id : "com.owlpictureid.bumil",
							fileName : "bumil-database.json",
							generateDb : function(){
								/*	*/
								obj.dataStorage = {};
								
								obj.dataStorage.dataObject = [];
								
								obj.dataStorage.notification = []; 
								
								obj.dataStorage.memo = [];
							 
								obj.dataStorage.tracker = [];
								 
								obj.dataStorage.contraction = [];
								 
								obj.dataStorage.kick = [];
								 
								obj.dataStorage.wfa = []; //weight for age 
								
								obj.dataStorage.bpd = []; //body mass index for age 
								
								obj.dataStorage.hc = []; //head circumference
								
								obj.dataStorage.ac = []; //length height for height
								
								obj.dataStorage.flh = []; //arm circumference
								
									 
								//defined trackerState object 
								obj.dataStorage.trackerState = {
									trackerMenu: "",
									trackerRange: "0-all"
								} 
								
								//defined memoState object 
								obj.dataStorage.memoState = {
									memoRange: "0-all"
								} 
							
								//defined notificationState object 
								obj.dataStorage.notificationState = {} 
							 
								//defined wfaState object 
								obj.dataStorage.wfaState = {}  
							
								//defined bpdState object 
								obj.dataStorage.bpdState = {}  
							
								//defined hcState object 
								obj.dataStorage.hcState = {}  
							
								//defined acState object 
								obj.dataStorage.acState = {}  
							
								//defined flhState object 
								obj.dataStorage.flhState = {}  
						 
								//defined layoutState object 
								obj.dataStorage.layoutState = {
									activeLayout : {
										tab : "tab-e",
										index : 0
									},
									activeSwiperChart : {
										title : "Estimasi Berat Janin ( EFW )",
										index : 0
									},
									polarSwiperChart : {
										index : 0
									},
									trackerCategorySwiper : {
										title : "Aktifitas Olahraga",
										index : 0,
										target : "sport"
									}
								} 
							  
							},
							updateDb : function(){
								  
								//old app  app < 1.1.5
								if( obj.dataStorage.dataObject.length ){
									
									for( let ii in obj.dataStorage.dataObject ){
										
										let objTest = obj.dataStorage.dataObject[ii];
										
										if( !objTest.name ){
											
											objTest.name = "No Name";
											objTest.typeText = "Untuk saya sendiri";
											objTest.typeSelect = 1;
											
										}
									}
								}
								  
								if( !obj.dataStorage.rate ){
									
									obj.dataStorage.rate = {
										time : ( new Date ).toLocaleString("id-ID"),
										record : 0,
										state : false
									}
									
								}
							 
								if( !obj.dataStorage.ofdState ){
									
									obj.dataStorage.ofdState = {}  
									
								}
								 
								if( !obj.dataStorage.ofd ){
									
									obj.dataStorage.ofd = []
								
								}
							
								if( !obj.dataStorage.trackerCategory ){
									
									obj.dataStorage.trackerCategory = {}
									
									obj.dataStorage.trackerCategory.sport = [{
										id : "kfhbn",
										objectId : "sjdud",
										latestDate : "",
										name : "Berenang",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "mnpak",
										objectId : "sjdud",
										latestDate : "",
										name : "Jalan Santai",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "kdoon",
										objectId : "sjdud",
										latestDate : "",
										name : "Senam Yoga",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false 
									},
									{
										id : "jjdcv",
										objectId : "sjdud",
										latestDate : "",
										name : "Senam Panggul",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "gfsvy",
										objectId : "sjdud",
										latestDate : "",
										name : "Senam Kegel",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "apfos",
										objectId : "sjdud",
										latestDate : "",
										name : "Senam Pilates",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									}]  
									 
									obj.dataStorage.trackerCategory.meal = [{
										id : "ymffd",
										objectId : "sjdud",
										latestDate : "",
										name : "Capcay Kuah Bumil",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "lonvaF",
										objectId : "sjdud",
										latestDate : "",
										name : "Jus Wortel Sehat",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "pinof",
										objectId : "sjdud",
										latestDate : "",
										name : "Sayur Bening",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									}]
									
									 
									obj.dataStorage.trackerCategory.enjoyment = [{
										id : "nksnb",
										objectId : "sjdud",
										latestDate : "",
										name : "Tidur Siang",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "pkspjv",
										objectId : "sjdud",
										latestDate : "",
										name : "Menonton Televisi",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "lonsdh",
										objectId : "sjdud",
										latestDate : "",
										name : "Mendengarkan Musik",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									}]
									
									 
									obj.dataStorage.trackerCategory.medical = [{
										id : "fxcec",
										objectId : "sjdud",
										latestDate : "",
										name : "Konsultasi Kedokter",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "cbfgbn",
										objectId : "sjdud",
										latestDate : "",
										name : "Suhu Tumbuh",
										unit : "Celsius",
										unitShort : "C",
										isRunning : false,
										isUnit : true
									},
									{
										id : "jitgfs",
										objectId : "sjdud",
										latestDate : "",
										name : "Berat Badan",
										unit : "Kilogram",
										unitShort : "Kg",
										isRunning : false,
										isUnit : true
									},
									{
										id : "tcdgg",
										objectId : "sjdud",
										latestDate : "",
										name : "Rekam USG mingguan",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "ikdfo",
										objectId : "sjdud",
										latestDate : "",
										name : "Suplemen Vitamin D3",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "lofdp",
										objectId : "sjdud",
										latestDate : "",
										name : "Suplemen Asam Folat",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "fhyr",
										objectId : "sjdud",
										latestDate : "",
										name : "Suplemen Omega 3",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									}]
									
									 
									obj.dataStorage.trackerCategory.other = []
								}
								   
								if( !obj.dataStorage.layoutState.headerTabActivity ){
									obj.dataStorage.layoutState.headerTabActivity = 0
								} 
			    
								if( !obj.dataStorage.layoutState.activeColor ){
									obj.dataStorage.layoutState.activeColor = "#aba3a3 ";
								}
									 	
								if( !obj.dataStorage.layoutState.badgeHeader ){
									obj.dataStorage.layoutState.badgeHeader = {
										title : "bumil",
										init : false
									};
								}
 	 	
								if( !obj.dataStorage.layoutState.activeSwiperChartControl ){
									obj.dataStorage.layoutState.activeSwiperChartControl = {
										title : "Berat ideal bumil ( IMT )",
										index : 0
									};
								}
								 								
								if( !obj.dataStorage.tfuBumil ){
										
									obj.dataStorage.tfuBumil = [];
										
								} 
							 								
								if( !obj.dataStorage.bpBumil ){
										
									obj.dataStorage.bpBumil = [];
										
								} 
								  
								if( !obj.dataStorage.bpmBumil ){
									
									obj.dataStorage.bpmBumil = []
								
								}
								
								  								
								if( !obj.dataStorage.weightBumil ){
										
									obj.dataStorage.weightBumil = [];
										
								} 
								  
								//delete obj.dataStorage.imtBumil 
								  
								if( !obj.dataStorage.imtBumil ){
									
									obj.dataStorage.imtBumil = []
								
								}
								
								
								if( !obj.dataStorage.IAP ){
									obj.dataStorage.IAP = {
										active : {},
										history : []
									}
								} 
								
								 
								 
							
							},
							writeFile : function( fileEntry, dataObj, callback ) {
								
								let self = this;
 
								// Create a FileWriter object for our FileEntry (log.txt).
								fileEntry.createWriter( function ( fileWriter ) {
									 
									let dataObj = new Blob([  scope.JSONstringfy( obj.dataStorage ) ], { type: 'application/json' });
									 
									fileWriter.write(dataObj);
									
									fileWriter.onwriteend = function() {
										 
										callback && callback.call( {}, true );
									};

									fileWriter.onerror = function (e) {
										//alert("error")
									}; 
									
								});
							},
							readFile : function( fileEntry, callback ){

								let self = this;
								
								fileEntry.file(function (file) {
									  
									var reader = new FileReader();
 
									reader.readAsText(file);

									reader.onloadend = function() { 
										 
										callback.call( {}, this.result );
										
									};
								})
							},
							createFile : function createFile( dirEntry, fileName, callback ) {
								
								let self = this;
								  	
								// Creates a new file or returns the file if it already exists.
								dirEntry.getFile(fileName, {create: true, exclusive: false }, function( fileEntry ) {

									self.writeFile( fileEntry, null, callback );

								});

							},
							createDirAndSaveFile : function( dirEntry, fileName, callback ){
								
								let self = this;
								 //create dir  KMS dirEntry/Balita/database
								dirEntry.getDirectory('KMSbumil', { create: true }, function (dirEntry) {
									
									dirEntry.getDirectory('database', { create: true }, function (subDirEntry) {

										self.createFile( subDirEntry, fileName, callback );

									});
								}); 
							},
							checkFileIsExist : function( callback ){
								
								let self = this,
								path = cordova.file.externalRootDirectory+'KMSbumil'+'/database/'+ self.fileName; 
								
								global.resolveLocalFileSystemURL( path, callback, function(){
									
									//file not exists
									 
									self.generateDbState = true; 

									//reupdate obj.dataStorage
									self.generateDb();
							 
									self.put(function(){
											
										setTimeout(function(){
											 
											callback();
										
										},100 )
									});
									 
								});
							},
							put : function( callback ){
								
								let self = this;
								
								if( global.cordova ){
 
									global.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, function (dirEntry) {
										 
									   self.createDirAndSaveFile( dirEntry,  self.fileName, callback )
									}); 
								 
								}else{

									localStorage.setItem( strHtml5Storage, scope.JSONstringfy( obj.dataStorage ) ); 
									
									callback && callback()
									  
								}
								 
							},
							get : function( callback ){
								
								let self = this;
								 
								if( global.cordova ){
										
									self.checkFileIsExist(function(){	
										 
										global.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, 
												
											//directories exists
											function ( dirEntry ) {
											 
												dirEntry.getDirectory('KMSbumil', { create: true }, function (dirEntry) {
													
													dirEntry.getDirectory('database', { create: true }, function (subDirEntry) {
														 
														// Creates a new file or returns the file if it already exists.
														subDirEntry.getFile( self.fileName, { create: true, exclusive: false  }, function( fileEntry ) {
															 
															self.readFile( fileEntry, function( data ){
																 
																obj.dataStorage = data && JSON.parse( data );
																
																callback && callback.call( {}, obj.dataStorage );
																
															 }); 
														}); 
													});
												});   
											}
										); 
									})
								 	
								}else{
									 
									obj.dataStorage = JSON.parse( localStorage.getItem( strHtml5Storage ) );
									  
									  
									if( !obj.dataStorage || obj.dataStorage === "null" ) { //generate new dataStorage
								 
										//reupdate dataStorage
										localStorage.setItem( strHtml5Storage, scope.JSONstringfy( self.generateDb() ) );
									 
										
									}
									  
									callback.call( {}, obj.dataStorage  );  
						 
								}	 
								
							}
							
						},
						email : {
							open : function(){
								
								global.cordova &&  cordova.plugins.email.open({
									to :'owlpicture.id@gmail.com',
									cc :"hari.agustian@rocketmail.com",
									subject: 'Saran dan Tanggapan Untuk Pengembang',
									body:    ''
								});
							}
						}, 
						launchApp : {
							init : function( params ){
								
								if( global.cordova ){
									 
									 
									 
									var appId = params.name;

									LaunchReview.launch(function(){
										console.log("Successfully launched store app");
									},function(err){
										console.log("Error launching store app: " + err);
									}, appId);
									
								}
							}
						},
						backgroundMode  : {
							enable : function(){
							  
								if( global.cordova ){
									 
									cordova.plugins.backgroundMode.enable();
									
									cordova.plugins.backgroundMode.setDefaults({
										title: "KMS Balita dan Bunda",
										text: "Rekaman sedang berjalan"
									})
									
									cordova.plugins.backgroundMode.on('activate', function () {
										setInterval(function () {
											cordova.plugins.notification.badge.increase();
										}, 1000);
									});
								}
								
							},
							disable : function(){
								
								global.cordova && cordova.plugins.backgroundMode.isActive() && 
								cordova.plugins.backgroundMode.disable();
								
							},
						},
						xSocialSharing : {
							shareApp :function( init ){
								
								if( global.cordova ){
									let projectId = obj.cordova.localStorage.id,
									appName = obj.cordova.localStorage.appName,
									dir = "https://play.google.com/store/apps/details?id="+projectId;
										 
									window.plugins.socialsharing.share(
										appName +", membantu keluarga dalam menjaga ibu dan janin bayi didalam kandungan, download appnya di playstore",
										appName,
										null,
										dir
									);
							
								}
								
							},
							shareAppViaWhatsApp : function( params ){
								
								if( global.cordova ){
										 
									let projectId = obj.cordova.localStorage.id,
									appName = obj.cordova.localStorage.appName,
									dir = "https://play.google.com/store/apps/details?id="+projectId;
										 
									window.plugins.socialsharing.shareViaWhatsApp(
										appName +", membantu keluarga dalam menjaga ibu dan janin bayi didalam kandungan, download appnya di playstore",
										null, // image
										dir, // url
										function(){
											//success
										},
										function( errormsg ){
											
											alert("gagal berbagi "+ errormsg)
											
										}
									);	
							
								}  
							},
							backupAndRestore : function( init ){
								
								if( global.cordova ){
										 
									let fileName = obj.cordova.localStorage.fileName,
									dir = cordova.file.externalRootDirectory+'KMSbumil/database/'+fileName;
										 
									window.plugins.socialsharing.share(
									  fileName,
									  fileName,
									  [dir],
									  ''
									);	
							
								}
								
							}
						},
						fileChooser : {
							
							triggerToModalMenuRestore : function(){
								 
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-restore");
								     
							},
							errorUnknown : function(){
								
								let fragment = scope.stringToHtml5Template(
									'<span class="semibold"> konversi error, tampaknya file telah rusak </span>'
								);
								 
								obj.modalMenu.menuError.update( fragment );
							},
							errorNotJson : function(){
								
								let fragment = scope.stringToHtml5Template(
									'<span class="semibold"> file tidak berekstensi JSON, Apa anda yakin ini adalah file database KMS Balita dan Bunda  </span>'
								);
								 
								obj.modalMenu.menuError.update( fragment );
							},
							errorCancel : function(){
								
								let fragment = scope.stringToHtml5Template(
									'<span class="semibold"> Anda membatalkan atau tak ada data yang diterima </span>'
								);
								 
								obj.modalMenu.menuError.update( fragment );
							},
							selectFile : function(){
								
								let self = this;
								
								if( global.cordova ){
									
									fileChooser.open(
										{ "mime": "application/json" },
										function( uri ){
											
											global.resolveLocalFileSystemURL( uri, function ( fileEntry ) {
												 
												fileEntry.file(function (file) {
									  
													if( file.type === "application/json" ){
														 
														let reader = new FileReader();
					 
														reader.readAsText(file);

														reader.onloadend = function() { 
															  
															if(function(){
																try { 
																	JSON.parse( this.result ); 
																	return true;
																}catch(err) { 
																	return false;
																} 
															}){
																
																obj.dataStorage = JSON.parse( this.result );
																
																obj.cordova.localStorage.put(function(){
																	
																	self.triggerToModalMenuRestore();
																});
																
														
															}else{
																
																self.errorUnknown();
															} 
															   
														};	
														
														reader.onerror = function(){
														
															self.errorUnknown();
														
														}
													 
																	
													}else{
														
														self.errorNotJson();
														
													}
												})

											});  
											
										},
										function(){
											
											self.errorCancel();
											
										}
									);	
							
								}
							}
						},
						notification : {
							schedule : function( params ){
								  
								if( params.loop ){
									   
									global.cordova && cordova.plugins.notification.local.schedule({
										id : parseInt( params.id ),
										title : "Bumil - Tumbuh kembang ideal janin",
										text: params.text,
										smallIcon: 'res://alarm',
										icon: 'file://2d/icon-96-xhdpi.png',
										trigger: { 
											every : params.stringDate //minute hour day etc
										}
									});
								}else{ 
								
									global.cordova && cordova.plugins.notification.local.schedule({
										smallIcon: 'res://alarm', 
										icon: 'file://2d/icon-96-xhdpi.png',
										id : parseInt( params.id ),
										title : "Bumil - Tumbuh kembang ideal janin",
										text: params.text,
										trigger: { at: params.trigger } // date
									});
								}
							},
							cancel : function( params ){
								  
								global.cordova && cordova.plugins.notification.local.cancel( parseInt( params.id ) );
								
							},
							filter : function( data ){
								
								if( global.cordova ){	
										
									let self = this;	
										
									data.map(function( objData ){
										
										let dateEnd = scope.stringToDate( objData.dateEnd ),
										trigger = {};
										
										if( dateEnd > ( new Date ) || objData.loop ){
											
											/*
											self.cancel({
												id: objData.cordovaId
											}) 
											
											self.schedule({
												id: objData.cordovaId,
												text : objData.reminder,
												trigger : dateEnd,
												stringDate : objData.stringDate,
												loop : objData.loop
											}) 
											 */
											 
										}else{
											
											self.cancel({
												id: objData.cordovaId
											}) 
											
											objData.disable = true;
										}
										  
										
									});
									
									
									/*remove unWantedIds*/
									cordova.plugins.notification.local.getIds(function (ids) {
										
										ids.forEach(function( id ){
											 
											let isReg = false; 
											 
											data.map(function( objData ){
											 
												if( objData.cordovaId === id ){
													 
													isReg = true;
												}
												 
											});
											
											if( !isReg ){
												
												self.cancel({
													id: id
												}) 
												
											}
											
										})
									});
									
								}
								
								
							}
						},
						file : {
							isExist : function( params ){
								 
								global.cordova && global.resolveLocalFileSystemURL( params.path, 
									params.fnExist, 
									params.fnNotExist
								);
							},
							remove :function( params ){
								 
								global.cordova && global.resolveLocalFileSystemURL( cordova.file.externalRootDirectory ,  
									
									function ( dir ) {
									 
										dir.getDirectory('KMSbumil', { create: true }, function (dirEntry) {
											 
											dirEntry.getDirectory('BumilPhoto', { create: true }, function (subDirEntry) {
												  
												subDirEntry.getFile( params.fileName, { create: false }, function ( fileEntry ) {
										 
													fileEntry.remove(function (file) {
														//alert("file removed!");
													}, function (error) {
														//alert("error occurred: " + error.code);
													}, function () {
														//alert("file does not exist");
													});
												});
												
											})
										
										})
								}) 
							}
						},
						camera : {
							cleanup : function(){
								
								global.cordova && navigator.camera.cleanup();
							},
							cloneImgToFolder : function( imageUri, callback ){
								
								if( global.cordova ){
									 
									let self = this,
									displayImage = function( blob ){
										  
										params.callback( blob )
											
									},
									readBinaryFile = function( fileEntry ){
										 
										fileEntry.file(function (file) {
											var reader = new FileReader();

											reader.onloadend = function() {
	  
												var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
												displayImage(blob);
											};

											reader.readAsArrayBuffer(file);

										});
										
									},
									createFile = function( fileEntry, cloneUri ){
										 
										fileEntry.createWriter(function ( fileWriter ) {

											fileWriter.onwriteend = function() {
												
												//sukses buat file baru 
												//readBinaryFile( fileEntry ); //png saja
												 
											};

											fileWriter.onerror = function(e) {
												//error buat file
											};

											fileWriter.write( cloneUri );
								
										})
	 
									};
										 
									global.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, 
											 
										function ( dir ) {
										 
											dir.getDirectory('KMSBumil', { create: true }, function (dirEntry) {
												 
												dirEntry.getDirectory('BumilPhoto', { create: true }, function (subDirEntry) {
													 
													subDirEntry.getFile( scope.uniqueString()+'.png' , { create: true, exclusive: false  }, function( fileEntry ) {
														 									  
														var xhr = new XMLHttpRequest();
														xhr.open('GET', imageUri, true);
														xhr.responseType = 'blob';

														xhr.send();
														
														xhr.onload = function() {
															 
															var blob = new Blob([this.response], { type: 'image/png' }),
															cloneuri = fileEntry.nativeURL;
															   
															createFile( fileEntry, blob )
															
															callback( cloneuri )
															 
														};
														   
													});
														 
												})

											})
									
									})
									
								
								}
							},
							getPicture : function( callback ){
								
								if( global.cordova ){
									 
									let options = {
										// Some common settings are 20, 50, and 100
										quality: 50,
										destinationType: Camera.DestinationType.FILE_URI,
										// In this app, dynamically set the picture source, Camera or photo gallery
										//Select a File from the Camera
										sourceType:  Camera.PictureSourceType.CAMERA,
										encodingType: Camera.EncodingType.PNG,
										mediaType: Camera.MediaType.PICTURE,
										allowEdit: true,
										correctOrientation: true,  //Corrects Android orientation quirks
										targetWidth : document.body.clientWidth
									}
									
									navigator.camera.getPicture(function cameraSuccess(imageUri) {

										// Do something
										callback.call( this, imageUri )
									
									}, function cameraError(error) {
										
										alert("Unable to obtain picture: " + error, "app")  

									}, options);
									
								}
								
							},
							chooseGallery : function( callback ){
								
								if( global.cordova ){
									
									
									let options = {
										// Some common settings are 20, 50, and 100
										quality: 50,
										destinationType: Camera.DestinationType.FILE_URI,
										// In this app, dynamically set the picture source, Camera or photo gallery
										//Select a File from the Picture Library 
										sourceType:  Camera.PictureSourceType.SAVEDPHOTOALBUM,
										encodingType: Camera.EncodingType.PNG,
										mediaType: Camera.MediaType.PICTURE,
										allowEdit: true,
										correctOrientation: true,  //Corrects Android orientation quirks
										targetWidth : document.body.clientWidth
									}
									
								 
									navigator.camera.getPicture(function cameraSuccess(imageUri) {
										
										// Do something
										callback.call( this, imageUri )
									
									}, function cameraError(error) {
										
										alert("Unable to obtain picture: " + error, "app") 

									}, options );
									
								}
							}
						}
				
					},
					layout : function(){
						
						let body = document.getElementsByTagName("body")[0],
						main = document.getElementsByTagName("main")[0],
						modalRadiobtns = scope.slice( scope.qs("modal").querySelectorAll(".radio-button") ),
						bodyHeight = body.getBoundingClientRect().height,
						bodyWidth = body.getBoundingClientRect().width;
						  
						/*tricky overflow modal radio-button*/
						modalRadiobtns.map(function( objRadio ){
							
							var rightBody = bodyWidth - objRadio.parentNode.getBoundingClientRect().left;
							 
							scope.css( objRadio,{
								"left": rightBody - 35 +"px"
							})
						})
						
						/*modal activity */
						let elActivity = scope.qs("preg-activity"),
						activityTop = elActivity.getBoundingClientRect().top,
						wrapChartDeduct = bodyHeight - activityTop;
						scope.css( elActivity,{
							"height": wrapChartDeduct - 210 +"px"
						})
						 
						 
						/*modal others  */
						let elementGear = scope.slice( scope.qsAll("modal-gear-list") );
						elementGear.map(function( objElement ){
							
							var wrapGear = objElement.getBoundingClientRect().top,
							wrapGearBottom = bodyHeight - wrapGear;
							scope.css( elementGear,{
								"height": wrapGearBottom - 100 +"px"
							})
						});
						
					
						/*remove msg chart*/
						if( obj.dataStorage.layoutState.msgBoxSwiperChart ){
							scope.addClass( scope.qs("box-swiper-chart-msg"), "hidden")
						}
						
						/*remove msg chart*/
						if( obj.dataStorage.layoutState.msgBoxSwiperChartBumil ){
							scope.addClass( scope.qs("box-swiper-chart-msg-bumil"), "hidden")
						}
						//to calculate main height,
						//61 + 2 came from height header and footer plus each of border top and bottom
						 
						main.setAttribute("style", "height:"+ ( bodyHeight - 61 * 2 )  +"px !important")
						 
						//calculate width of footer menu, 
						let li = scope.slice( scope.qsAll("footer-menu > li") ),
						footerWidth = bodyWidth / li.length ;
						
						li.map(function( objLi ){
							
							scope.css( objLi,{
								"width": footerWidth +"px"
							})
						})
						
						
						scope.removeClassTransform( scope.qs("modal-screen"), "close", 150,{
							start : function(){
								
								scope.removeClass( scope.qs("modal-screen"), "open" );
							}
						})
					},
					layoutChartStateControl : false,
					layoutChartUpdateControl : false,
					layoutChartState : false,
					layoutChartUpdate : false,
					header : function(){
						let header = document.getElementsByTagName("header")[0],
						objTrack = {
							start : {
								val : 0,
								capture: false
							},
							scroll : {
								val : 0,
								capture: true,
								reset : function(){ 
									this.capture = true;
								}
							},
							headerY : 0,
							end : 0,
							
						};
						
						scope.attachListener( document.getElementsByTagName("body")[0], scope.CursorStartEvent, function(el){ 
							let pos = scope.mousePosition['value'].pos.mousemove;
							objTrack.headerY = header.getBoundingClientRect().top;
							objTrack.start.capture = false
							 
							//capture scroll 
							if( !objTrack.scroll.capture ){
								 
								scope.css(document.getElementsByTagName("main")[0], { 
									"overflow-y":'scroll'
								})
								 
								scope.css( scope.qs("test-a"), { 
									"overflow-y":'auto'
								}) 
								
								scope.css( scope.qs("test-i"), { 
									"overflow-y":'auto'
								}) 
								
								objTrack.scroll.reset();
							}
							  
							   
							 
						})
						
						scope.attachListener( document.getElementsByTagName("body")[0], scope.CursorEndEvent, function(el){ 
							let pos = scope.mousePosition['value'].pos.mousemove,
							bodyBound = document.getElementsByTagName("body")[0].getBoundingClientRect(),
							headerBound = header.getBoundingClientRect(),
							tabs = scope.slice( scope.qsAll("tab") ),
							value = 0;
							 
							value = objTrack.end < -30 ? -62 : 0
							 
							scope.css(header, { 
								transform:'0px,' +value + 'px,0px',
								transition: 'transform 150ms ease-in-out 0ms'
							})
							 
							scope.css(scope.qs("main-wrap"), { 
								transform:'0px,' +value + 'px,0px',
								transition: 'transform 150ms ease-in-out 0ms'
							})
							 
						}) 
						
						scope.attachListener( document.getElementsByTagName("html")[0], scope.CursorMoveEvent, function(el){ 
							
							let pos = scope.mousePosition['value'].pos.mousemove,
							bodyBound = document.getElementsByTagName("body")[0].getBoundingClientRect(),
							headerBound = header.getBoundingClientRect();
							 
							//capture first touch
							if( !objTrack.start.capture ){
								objTrack.start.val = pos.y;
								objTrack.start.capture = true;
							}
							 
							objTrack.end = parseInt( objTrack.headerY ) + ( pos.y - objTrack.start.val );
							
							
							let topLimit = bodyBound.top - headerBound.height <= headerBound.y || objTrack.end > -headerBound.height,
							bottomLimit =  headerBound.height > parseInt(headerBound.y +  headerBound.bottom )  || 0 > objTrack.end
							 
							
							if( topLimit && bottomLimit && objTrack.end <= headerBound.height ){
								 
								if(  objTrack.end > 0 ) objTrack.end = 0;
								  
								  /*
								scope.css(header, { 
									transform:'0px,' + objTrack.end + 'px,0px',
									transition: 'transform 0ms'
								})
								
								scope.css(scope.qs("main-wrap"), { 
									transform:'0px,' + objTrack.end + 'px,0px',
									transition: 'transform 0ms'
								}) 
								 */
								
								objTrack.scroll.capture = false;
								 
							}
							
							
							//prevent container chart move horizontally
						 
						})
						 
						
					},
					footer : function(){
						let divs = scope.slice( scope.qs("footer-tab").querySelectorAll(".swiper-wrapper > div") ),
						mainTabs = scope.slice( scope.qsAll("main-wrap > div") ),
						sliderTabs = scope.slice( scope.qs("modal-other-list").querySelectorAll(".border-none > li") ),
						header = document.getElementsByTagName("header")[0],
						main = document.getElementsByTagName("main")[0],
						swiper = new Swiper('.footer-tab', {
							observer: true,
							observeParents: true,
							slidesPerView: 4,
							spaceBetween: 0,
							initialSlide: obj.dataStorage.layoutState.activeLayout.index
						}),
						chartFnControl =  function(){
						  
							obj.chart.weightBumilAge.create();
							 
							obj.chart.bpBumil.create();
						 
							obj.chart.tfuBumil.create();

							obj.chart.bpmBumil.create();
						},
						chartFn = function(){
						  
								obj.chart.weightForAge.create();
						
								obj.chart.ofdForAge.create();
								 
								obj.chart.flhForAge.create();
								
								obj.chart.acForAge.create();  
								
								obj.chart.bpdForAge.create();
								
								obj.chart.hcForAge.create();
							 

							 
						},
						tabIFn = function(){
							
							let activeSwiperChartControl = obj.dataStorage.layoutState.activeSwiperChartControl,
							tabElCtrl = scope.slice( scope.qsAll("tab-control li") ),
							swiperControl  = new Swiper('.test-i',{  
								observer: true,
								observeParents: true,
								centeredSlides: true,
								slidesPerView: 1,
								initialSlide: activeSwiperChartControl.index
							});
							 
							//control bumil
							scope.addClass( tabElCtrl[ activeSwiperChartControl.index ] , "select" );
							
							  
							tabElCtrl.forEach(function( objLi, index ){
								
								scope.attachListener( objLi, 'click', function( getIndex ){ 
										
									tabElCtrl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									
									scope.addClass( this, "select" );
									 
									 
									swiperControl.slideTo( getIndex, 300 );
									 
								}.bind( objLi, index ) )
								
							}) 		
							 
							swiperControl.on('transitionEnd', function () {
								
								var header = document.getElementsByTagName("header")[0],
								headerBound = header.getBoundingClientRect().top,
								activeSlide = scope.qs("test-i").querySelector(".swiper-slide-active"),
								title = activeSlide.getAttribute("label");
								
								tabElCtrl.forEach(function( li ){
									scope.removeClass( li, "select" )
								})
								  
								scope.addClass( tabElCtrl[ swiperControl.activeIndex ] , "select" );
								 
								scope.text( scope.qs( "box-swiper-chart-msg-bumil" ), title ); 
							  
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeSwiperChartControl",
									value : {
										title : title,
										index : swiperControl.activeIndex 
									}
								},
								function(){}) 
								 
								//active tab to top
								if( headerBound <= -62 ){ 
									
									scope.qs("test-i").querySelector(".swiper-slide-active").scrollIntoView();
									scope.qs("tab-i").scrollIntoView();
								}
							}); 
							
							 
							chartFnControl(); 
								 
								 
						},
						tabDFn = function(){
							 
							setTimeout(function(){
							
								/*chart layout*/
								var activeSwiperChart = obj.dataStorage.layoutState.activeSwiperChart,
								tabEl =  scope.slice( scope.qsAll("tab-graph li") ),
								swiper = new Swiper('.test-a',{  
									observer: true,
									observeParents: true,
									freeModeSticky: true, 
									centeredSlides: true,
									initialSlide: activeSwiperChart.index
								});
								
								 
								//kurva janin
								scope.addClass( tabEl[ activeSwiperChart.index ] , "select" );
									  
								tabEl.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										 
										 
										swiper.slideTo( getIndex, 300 );
										 
									}.bind( objLi, index ) )
									
								}) 		
								 
								swiper.on('transitionEnd', function () {
									
									var header = document.getElementsByTagName("header")[0],
									headerBound = header.getBoundingClientRect().top,
									activeSlide = scope.qs("test-a").querySelector(".swiper-slide-active"),
									title = activeSlide.getAttribute("label");
									
									tabEl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									  
									scope.addClass( tabEl[ swiper.activeIndex ] , "select" );
									 
									scope.text( scope.qs( "box-swiper-chart-msg" ), title+' menurut Umur '  ); 
								  
									obj.storageState({ 
										storageState : "layoutState",
										objState : "activeSwiperChart",
										value : {
											title : title,
											index : swiper.activeIndex 
										}
									},
									function(){}) 
									 
									//active tab to top
									if( headerBound <= -62 ){ 
										
										scope.qs("test-a").querySelector(".swiper-slide-active").scrollIntoView();
										scope.qs("tab-d").scrollIntoView();
									}
								}); 
								
								swiperChartOnMove = swiper;
								 
								chartFn(); 
								 
							},100)
							 
						},
						tabClickFn = function( slideFn ){
							 
							let labelClass = this.getAttribute("label") ? 
								this.getAttribute("label") : 
								scope.getFirstChild( this ).getAttribute("label"),
							
							headerBound = header.getBoundingClientRect().top,
							updateTabFn = function( params ){
								
								obj.storageState({ 
									noUpdateFileSource : true,
									storageState : "layoutState",
									objState : "activeLayout",
									value : {
										tab : params.tab,
										index : params.index
									}
								},
								function(){}) 
								
							};
							  
							mainTabs.map(function( objTab ){
								
								scope.addClass( objTab, "hidden" );
								
								 
							})
							
							divs.map(function( objTab ){
								  
								scope.removeClass( objTab , "active" );
								 
								if( scope.getFirstChild( objTab ).getAttribute("label") === labelClass ){
									 
									scope.addClass( objTab, "active" );
									
									
								}
							})
							
							scope.addClass( scope.qs("notify-button"), "hidden" );
							scope.addClass( scope.qs("memo-button"), "hidden" );
							scope.addClass( scope.qs("tracking-button"), "hidden" );
							scope.addClass( scope.qs("kicker-button"), "hidden" );
							scope.addClass( scope.qs("contraction-button"), "hidden" );
							scope.addClass( scope.qs("growth-button"), "hidden" ); 
							scope.addClass( scope.qs("control-button"), "hidden" ); 

							if( labelClass === "tab-a" ){
								 
								scope.removeClass( scope.qs("header-notify"), "hidden" );
							
								scope.removeClass( scope.qs("notify-button"), "hidden" );
								 
								obj.dataStorage.layoutState.activeLayout.tab = "tab-a";
								  
								updateTabFn({
									tab : "tab-a",
									index : 1
								}) 
								
								swiper.slideTo( 7, 300 );
							 
								 
							}else if( labelClass === "tab-b" ){
								
								scope.removeClass( scope.qs("memo-button"), "hidden" );
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-b";
								 
								updateTabFn({
									tab : "tab-b",
									index : 2
								}) 
								
								swiper.slideTo( 6, 300 );
							   
								 
							}else if( labelClass === "tab-c" ){
								
								scope.removeClass( scope.qs("tracking-button"), "hidden" );
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-c";
 
								updateTabFn({
									tab : "tab-c",
									index : 3
								})  
								
								swiper.slideTo( 3, 300 );
							   
								 
							}else if( labelClass === "tab-d" ){
								
								scope.removeClass( scope.qs("growth-button"), "hidden" ); 
								 
								obj.dataStorage.layoutState.activeLayout.tab = "tab-d";
							  
								updateTabFn({
									tab : "tab-d",
									index : 4
								})  
								
								swiper.slideTo( 1, 300 );
							     
							}else if( labelClass === "tab-e" ){
								 
								obj.dataStorage.layoutState.activeLayout.tab = "tab-e";
							  
								updateTabFn({
									tab : "tab-e",
									index : 0
								})  
								 
								swiper.slideTo( 0, 300 );
							     
							}else if( labelClass === "tab-f" ){
								
								scope.removeClass( scope.qs("kicker-button"), "hidden" ); 
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-f";
							  
								updateTabFn({
									tab : "tab-f",
									index : 5
								})  
								  
								swiper.slideTo( 5, 300 );
							      
							}else if( labelClass === "tab-h" ){
								
								scope.removeClass( scope.qs("contraction-button"), "hidden" ); 
								 
								obj.dataStorage.layoutState.activeLayout.tab = "tab-h";
							  
								updateTabFn({
									tab : "tab-h",
									index : 4
								})  
								  
								swiper.slideTo( 4, 300 );
							      
							}else if( labelClass === "tab-i" ){
								
								scope.removeClass( scope.qs("control-button"), "hidden" ); 
								  
								obj.dataStorage.layoutState.activeLayout.tab = "tab-i";
							  
								updateTabFn({
									tab : "tab-i",
									index : 2
								})  
								    
								swiper.slideTo( 2, 300 );
							      
							}
							
							scope.removeClass( scope.qs( labelClass ), "hidden" );
							
							//active tab to top
							if( headerBound <= -62 ){
								
								scope.qs( labelClass ).scrollIntoView();
							}
							 
							//exec chart's layout
							if( labelClass === "tab-d"  ){
								   
								 
								   
								if( !obj.layoutChartState ){  
									   
									//execute chart params
									
									tabDFn();
									 
									obj.layoutChartState = true;  
								
								}
								
								if( obj.layoutChartUpdate ){
									
									chartFn();
									
									obj.layoutChartUpdate = false;
								}
								   
							}
							
							if( labelClass === "tab-i"  ){
								    
								if( !obj.layoutChartStateControl ){  
									   
									//execute chart params
									
									tabIFn();
									 
									obj.layoutChartStateControl = true;  
								
								}
								  
								if( obj.layoutChartUpdateControl ){
									
									chartFnControl();
									
									obj.layoutChartUpdateControl = false;
								}
								   
							}							
								
							typeof slideFn === "function" && slideFn();	
							 
							obj.appConfig.ads.interstitial.interaction--;
									
						};
					
					
						
						/**
							active layout
						*/
						 
						if( !obj.dataStorage.layoutState.activeLayout.tab ){
							
							obj.storageState({ 
								storageState : "layoutState",
								objState : "activeLayout",
								value : {
									tab : "tab-a",
									index : 1
								}
							},
							function(){
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-a";
							}) 
							 
						}else{
							 
							mainTabs.map(function( objTab ){
								scope.addClass( objTab, "hidden" );
							})
						  
							switch( obj.dataStorage.layoutState.activeLayout.tab ){
								
								case "tab-a" :
								
									scope.removeClass( scope.qs("notify-button"), "hidden" );
									
									scope.removeClass( scope.qs("header-notify"), "hidden" );
									
									scope.addClass( divs[7], "active" ); 
									
									swiper.slideTo( 6, 300 );
									
									break;
									
								case "tab-b" :
								 
									scope.removeClass( scope.qs("memo-button"), "hidden" ); 
									
									scope.addClass( divs[6], "active" );
									
									swiper.slideTo( 5, 300 );
									
									break;	
									
								case "tab-c" :
								
									scope.removeClass( scope.qs("tracking-button"), "hidden" ); 
									
									scope.addClass( divs[3], "active" );
									
									swiper.slideTo( 2, 300 );
									
									break;	
									
								case "tab-d" :
								 
									scope.removeClass( scope.qs("growth-button"), "hidden" ); 
									
									scope.addClass( divs[1], "active" ); 
									
									tabDFn(); 	
									
									swiper.slideTo( 1, 300 );
									
									break;	
									
								case "tab-e" :
								 
									scope.addClass( divs[0], "active" ); 
								 	
									swiper.slideTo( 0, 300 );
																
									break;	
									
								case "tab-f" :
								 
									scope.removeClass( scope.qs("kicker-button"), "hidden" ); 
									
									scope.addClass( divs[5], "active" );
									header.className = "bg-darktosca";
								
									swiper.slideTo( 4, 300 );
										
									break;	
	
								case "tab-h" :
								 
									scope.removeClass( scope.qs("contraction-button"), "hidden" ); 
									
									scope.addClass( divs[4], "active" ); 
								
									swiper.slideTo( 3, 300 );
										
									break;
									
								case "tab-i" :
								 
									scope.removeClass( scope.qs("control-button"), "hidden" ); 
									 
									scope.addClass( divs[2], "active" ); 
									
									tabIFn()
									
									swiper.slideTo( 2, 300 );
										
									break;
								
							}
							 
							scope.removeClass( scope.qs( obj.dataStorage.layoutState.activeLayout.tab ), "hidden" );
						}
						
						/**
							onclick footer
						*/
						divs.map(function( objDiv ){ 
						
							scope.attachListener( objDiv, 'click', tabClickFn.bind( objDiv, false ))
						})
						
						
						/**
							onclick sidebar
						*/
						sliderTabs.map(function( objLi ){ 
						
							if( objLi.getAttribute("label") ){
									
								scope.attachListener( objLi, 'click', tabClickFn.bind( objLi, function(){
									
									obj.modal.behaviour.closeFadeout();
										
								}))
							
							}
						})
						
					},
					main :{  
						remainder : function( initial ){
							 
							/**
								generate content
							*/
							
							let main = scope.qs("remainder-content"),
							container = main.querySelector(".content-data"), 
							data = obj.dataStorage.notification, 
							dataEmpty = true,
							containerEmpty = main.querySelector(".content-empty"),
							convertTimeFn = function( timer ){
								
								let covertTime = timer.split(":");
								 
								if( covertTime.length === 4 ){
									
									covertTime[0] = covertTime[0]+' Hari';
									covertTime[1] = covertTime[1]+' Jam';
									covertTime[2] = covertTime[2]+' Menit';
									covertTime[3] = covertTime[3]+' Detik';
								}else{
									
									covertTime[0] = covertTime[0]+' Hari';
									covertTime[1] = covertTime[1]+' Menit';
									covertTime[2] = covertTime[2]+' Detik';
								}
								covertTime.join(" : ");
								
								return covertTime;
							},
							contentDom = function( params ){
								let notifyBox = document.createElement("div"),
								bubbleBox =  document.createElement("div"),
								notifyStrip =  document.createElement("div"),
								abbr =  document.createElement("abbr"), 
								ins =  document.createElement("ins"), 
								bubbleLeft =  document.createElement("div"),
								
								covertTime = convertTimeFn( params.timeleft );
								
								notifyBox.className = "notify-box "+params.opacity;
								
								bubbleBox.className = "bubble-box bg-size-80 "+ 
									( params.opacity === "halfOpacity" ? "alarm-off-icon" : "alarm-icon" ); 
								 
								notifyStrip.className = "notify-strip";
								  
								bubbleLeft.className = "bubble-left";
								   
								bubbleLeft.setAttribute("timer", covertTime );
								
								bubbleLeft.setAttribute("date-start", scope.dateToYMD( scope.stringToDate( params.dateStart ), "year","time"  ) );
								
								bubbleLeft.setAttribute("date-end",  scope.dateToYMD( scope.stringToDate( params.dateEnd ), "year","time"  ) );
								
								bubbleLeft.setAttribute("remainder", params.remainder );
								
								bubbleLeft.setAttribute("loop", params.loop ); 
								
								bubbleLeft.setAttribute("id", params.id );
								
								bubbleLeft.setAttribute("label-text", params.labelText )
								
								notifyBox.appendChild( bubbleBox );
								bubbleBox.appendChild( notifyStrip );
								
								
								notifyBox.appendChild( abbr );
								notifyBox.appendChild( ins );
								
								abbr.setAttribute("style", "display:block")
								scope.addClass( ins, "max-lines" )
								 
								 
								scope.text( abbr, params.timeleft )
								
								scope.text( ins, params.remainder )
								
								notifyBox.appendChild( bubbleLeft );
								
							
								//append
								container.appendChild( notifyBox );
								
								
								/** format
								<div class="notify-box">  
									<div class="bubble-box">
										<div class="notify-strip"></div>
									</div> 
									<abbr>11:13</abbr> <ins>Jadwal menyusui</ins>
									<div class="bubble-left"></div>
								</div>
								*/
								
							},
							headerDom = function( params ){
								
								
								let parent = scope.qs("remainder-content").querySelector(".header-notify"),
								notifySch = document.createElement("div"), 
								notifySchText = document.createElement("div"), 
								abbrDay = document.createElement("abbr"),
								abbrHour = document.createElement("abbr"),
								abbrMinute = document.createElement("abbr"),
								abbrSecond = document.createElement("abbr"),
								insDay = document.createElement("ins"),
								insHour = document.createElement("ins"),
								insMinute = document.createElement("ins"),
								insSecond = document.createElement("ins");
								
								parent.innerHTML = "";
								
								notifySch.className = "notify-sch time";
								
								notifySchText.className = "notify-sch sch-next";
								
								scope.text( insHour, " Jam, " )
								scope.text( insMinute, " Menit, " )
								scope.text( insSecond, " Detik " )

								scope.text( abbrHour, params.hour )
								scope.text( abbrMinute, params.minute )
								scope.text( abbrSecond, params.second )
								
								scope.text( notifySchText, scope.stringLimit( params.remainder, 35 )  )
								
								if( params.day && params.day !== "00" ){
									scope.text( insDay, " Hari, " )
									scope.text( abbrDay, params.day )
									notifySch.appendChild( abbrDay )
									notifySch.appendChild( insDay )
								}
								
								notifySch.appendChild( abbrHour )
								notifySch.appendChild( insHour )
								
								notifySch.appendChild( abbrMinute )
								notifySch.appendChild( insMinute )
								
								notifySch.appendChild(abbrSecond )
								notifySch.appendChild( insSecond )
								
								parent.appendChild( notifySch );
								
								parent.appendChild( notifySchText );
								
								if( params.day === "00" && params.hour === "00" && params.minute === "00" && params.second === "00" ){
									
									//delete remainderTimestampArr
									for( let kk = 0, ll = remainderTimestampArr; kk < ll.length; kk++ ){
										 
										if( ll[kk].id === params.id ){ 
											remainderTimestampArr.splice( kk, 1 ); 
											break;
										}
									}
								}
								
								/**
									<div class="notify-sch time">
										<abbr>4</abbr> 
										<ins>Jam</ins> 
										<abbr>55</abbr> 
										<ins>Menit</ins> 
										<abbr>33</abbr> 
										<ins>Detik</ins> 
									</div>
								*/
							},
							dataNoteFn = function( dataNote, withHtml, index ){
 
								//if( dataNote.objectId === dataObject.id ){	}
								
								
								let dateNow = new Date(),
								dateStart = scope.stringToDate( dataNote.dateStart ),
								dateEnd = scope.stringToDate( dataNote.dateEnd ),
								timestame = "00 : 00 : 00",
								unRegistered = dataNote.disable,
								dataNotify = "";
								timeTimeFn = function( dateEnd, dateNow ){
									
									let timesUnit = scope.timeUnitBetween( dateEnd, dateNow  ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates( dateEnd, dateNow, "day" ) - 1;
									   
									timestame = ( timesUnit.hour.toString().length <= 1 ? + "0"+timesUnit.hour.toString() : timesUnit.hour.toString() ) +" : " +
									( timesUnit.minute.toString().length <= 1 ? + "0"+timesUnit.minute.toString() : timesUnit.minute.toString() ) +" : "+
									( timesUnit.second.toString().length <= 1 ? + "0"+timesUnit.second.toString() : timesUnit.second.toString() )

									if( totalDays > 0  ){  
									   
										timestame = ( totalDays.toString().length <= 1 ? + "0"+totalDays : totalDays ) +" : " + timestame;
									}
									
									return timestame;
									
								},
								opacity = "";
								 
								if( dateNow.getTime() < dateEnd.getTime() ){
									 
									timestame = timeTimeFn( dateEnd, dateNow );
									 
								}else{
									
									//when date end but need loop 
									if( dataNote.loop ){
										
										let timerArr = dataNote.timer.split(":"), 
										temp = { 
											milisecond : 0,
											count : 0,
											loopDate : new Date( dateEnd ),
										};
										
										temp.loopDate.setSeconds( temp.loopDate.getSeconds() + parseInt( timerArr[3] ) );
										temp.loopDate.setMinutes( temp.loopDate.getMinutes() + parseInt( timerArr[2] ) );
										temp.loopDate.setHours( temp.loopDate.getHours() + parseInt( timerArr[1] ) );
										temp.loopDate.setDate( temp.loopDate.getDate() + parseInt( timerArr[0] ) );
										
										let inMilli =  temp.loopDate.getTime() - dateEnd.getTime();
										   
										while( true ){
											
											let testDate = new Date( dateEnd );
										   
											testDate.setMilliseconds( testDate.getMilliseconds() + temp.milisecond ); 
											 
											temp.milisecond += inMilli
											
											if(  testDate.getTime() > dateNow.getTime() ){
												
												dateEnd = testDate
												
												break;
												
											}
											
										}
										  
										timestame = timeTimeFn( dateEnd, dateNow );;
										 
										dataNote.dateEnd =  dateEnd.toLocaleString("id-ID"); 
										  
									}else{
									  
										opacity = "halfOpacity";
									}
									   
								}	 
								  
								if( withHtml ){ 

									if( obj.loadMore.marker( "remainder", main, dataNote, index )  ){
										
										let val = parseInt( timestame.split(":").join("").split(" ").join("") );

										// remove zero 
										val && remainderTimestampArr.push({
											id : dataNote.id,
											val : val
										}) 
										  
										//sort ascending
										remainderTimestampArr.sort(function(a, b) {
											return a.val - b.val;
										});
										
										  
										contentDom({
											id : dataNote.id,
											timeleft : timestame,
											remainder : dataNote.reminder,
											dateStart : dataNote.dateStart,
											dateEnd : dataNote.dateEnd,
											loop : dataNote.loop,
											labelText : dataNote.labelText,
											opacity : opacity
										})
									
									}
									
								}else{
									
									//update header 
									
									 if( remainderTimestampArr[0] && remainderTimestampArr[0].id === dataNote.id ){
										 
										let timestameArr = timestame.split(" ").join("").split(":"),
										day, hour, minute, second;
										
										if( timestameArr.length < 4 ){
											day = "00";
											hour = timestameArr[0];
											minute = timestameArr[1];
											second = timestameArr[2];
										}else{
											day = timestameArr[0];
											hour = timestameArr[1];
											minute = timestameArr[2];
											second = timestameArr[3];
										}
										
										if( parseInt( timestameArr.join("") ) ){
										
											headerDom({
												day : day,
												hour : hour,
												minute : minute,
												second : second,
												remainder : dataNote.reminder
											})
										}else{
											
											headerDom({
												day : '00',
												hour : '00',
												minute : '00',
												second : '00',
												remainder : "Belum ada notifikasi",
												id : dataNote.id 
											})
											
										
										}
									}else if( !remainderTimestampArr.length ){
										
											headerDom({
												hour : '00',
												minute : '00',
												second : '00',
												remainder : "Belum ada notifikasi",
												id : dataNote.id 
											})
									} 
									
									//update content
									
									let element = scope.id( dataNote.id );
									
									if( element ){
										
										let parentEl = scope.nthParent( element, 1);
										
										scope.text( parentEl.getElementsByTagName( "abbr" )[0], timestame )
										
										
										//disable prop was made from cordova notification plugin
										if( dataNote.disable ){
											
											scope.addClass( parentEl, "halfOpacity" ); 
											 
											let bubuleBox = parentEl.querySelector(".bubble-box")
											 
											scope.removeClass( bubuleBox, "alarm-icon"  ); 
											 
											scope.addClass( bubuleBox, "alarm-off-icon" ); 
											 
											dataNote.disable = false
											
										}
										  
										element.setAttribute("timer", convertTimeFn( timestame ) );
									}
								}
							
								dataEmpty = false
							 
							};
							 
							
							if( !initial ){
								 
								obj.cordova.notification.filter( data );
								
								//reset loadmore
								obj.loadMore.state.remainder.reset();
								container.innerHTML = "";
							}
							 
							//first call or another call example save, -- generate content html 
							data.forEach(function( dataNote, index ){
							 
								dataNoteFn( dataNote, true, index );
								 
							})
							
							
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" )
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" )
							
							
							//first call
							
							headerDom({
								hour : '00',
								minute : '00',
								second : '00',
								remainder : "Belum ada notifikasi",
								id : 0
							})
							
							
							//update time stamp only
							if( !stateTimer.remainder ){
								
									
								setInterval(function(){
									
									if( !/hidden/i.test( scope.qs("remainder-content").className ) ){
										 
										obj.dataStorage.notification.forEach(function( dataNote ){
										 
											dataNoteFn( dataNote ) // just update time stamp
										})
									}
								},1000);
								 
								stateTimer.remainder = true; 
							} 
							 
							/**
								reminder buttons
							*/
							let remainderBtns = scope.slice( scope.qs("remainder-content").querySelectorAll(".bubble-left") );
							
							remainderBtns.map(function( btnRemainder, index ){
								 
								scope.attachListener( btnRemainder, 'click', function(){
									
									//update modal remainder detail 
									obj.hiddenAndShowModals( "modal-remainder-detail" ) 
									 
									scope.text( scope.qs("remainder-timer-detail"), this.getAttribute("timer") );
									scope.text( scope.qs("remainder-data-start-detail"), this.getAttribute("date-start") );
									scope.text( scope.qs("remainder-data-end-detail"),this.getAttribute("date-end") );
									scope.text( scope.qs("remainder-content-detail"),this.getAttribute("remainder") );
 
									scope.text( scope.qs("notify-type-detail"), this.getAttribute("label-text") );
									
									
									//get initial data for modal confirm ( modal detail )
									scope.qs("modal-remainder-detail").querySelector(".send-button").setAttribute("label-id", this.getAttribute("id") )
									
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-remainder-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("id") )
									 
									obj.modal.behaviour.openModalFadeIn("modal-remainder-detail");
									  
								})
							})
							
							
							
						},
						memo : function( objectInitial ){
							/**
								generate content
							*/
							 
							let main = scope.qs("memo-content"),
							container = scope.qs("memo-content").querySelector(".content-data"),
							dataFilter = obj.storageFilter( obj.dataStorage.memo ),
							data = obj.dataStorage.memoState.memoRange ? obj.dateTimeRangeValidate( dataFilter, obj.dataStorage.memoState.memoRange ) : dataFilter,
							dataEmpty = true,
							bg = [ "bg-darktosca", "bg-grey-a", "bg-darkgreen", "bg-bluesky", "bg-turquoise", "bg-cadetblue", "bg-sandybrown", "bg-gray" ],
							containerEmpty = scope.qs("memo-content").querySelector(".content-empty"),
							contentDom = function( params ){ 
								 
								let randomClass = scope.uniqueString(),
								fragment = scope.stringToHtml5Template(
								'<div>'+
									'<div class="box-media-parent">'+
									'	<abbr class="title extrabold p0">'+ scope.dateToYMD( scope.stringToDate( params.dateStart ) ) +'</abbr>'+
									'	<div class="bubble-small-left" title="'+params.title +'" text="'+params.text +'" date-start="'+ scope.dateToYMD( scope.stringToDate(  params.dateStart ),"year" ) +'">'+
									'		<div class="btn-delete hidden" id="'+params.id +'">Hapus</div>'+
									'	</div>'+
									'	<div class="wrap-content-data ">'+
									'		 <div  class="box-media">'+
									'			<div class="media-cnt mt20 '+ params.hiddenMedia +'">'+
									'				<div class="media-profile background-img '+ randomClass +'" style="background: url('+ params.bguri +') no-repeat center;"> '+
									'					<div class="media-btn" label="'+ params.id +'"></div>'+
									'				</div>'+
									'			</div>'+
									'			<div class="media-content">'+
									'				<div class="media-text light ">'+
									'					<ul class="list-inline modal-todo-list-b border-none mt20">'+
									'						<li> '+
									'							<div class="todo-header">'+
									'								<div class="todo-content list-inline content-collapse pt0 overflowscroll">'+
									'									<ul class="list-inline border-none">'+
									'										<li>'+
									'											<ul class="list-inline ">'+
									'												<li style="overflow:auto">'+
									'													<div class="left font11">'+
									'														<div class="btn-collapse pluse-black-icon bg-size-60"></div>'+
																								params.title  +
									'													</div> '+
									'												</li>'+
									'											</ul>'+
									'											<div class="content p0 bg-white">'+
									'												<p>'+
																						params.text +
									'												</p>'+
									'											</div>'+
									'										</li>'+
									'									</ul>'+
									'								</div>'+
									'							</div>'+
									'						</li>'+
									'					</ul> ' + 
									'				</div>'+
									'				<div class="media-label">'+
													function(){
														
														let labelStr = "";
														
														for(var ii = 0, jj = params.label; ii < jj.length ; ii++ ){
															
															labelStr += '<div class="label">'+ jj[ii] +' </div>'
															
														}
														 
														 return labelStr;
														 
													}() + 
									'				</div>'+
									'			</div>'+
									'		 </div>'+
									'	</div>'+
									'</div> ' +
									'<div class="sparator mb20 mt20"></div>' +
								'</div>'
								)
							  
								let divDummy = document.createElement("div");
								
								divDummy.appendChild( fragment );
								
								let contentCollaps = divDummy.querySelector(".todo-content.content-collapse"),
								parentFragment = divDummy.querySelector(".box-media-parent");
							   
								container.appendChild( parentFragment.parentNode ); 
								   
								obj.generateExpandCollapse( contentCollaps, true ) 
								  
								//hapus sparator jika diperlukan
								let parentEls = scope.slice( container.querySelectorAll(".box-media-parent") ),
								sparators = scope.slice(  container.querySelectorAll(".sparator")  );
								 
								if( parentEls.length <= 1 ){
									
									sparators.length &&
										scope.addClass( sparators[0], "hidden" );
									 
								}else{
									
									sparators.forEach(function( objEl ){
										
										scope.removeClass( objEl, "hidden" );
										
									})
									
									sparators.length &&
										scope.addClass( sparators[ sparators.length - 1 ], "hidden" );
								 
								}
								 
								obj.cordova.file.isExist({
									path : params.bguri,
									fnExist : function(){
										
									},
									fnNotExist : function(){
										 
										scope.addClass( scope.qs( randomClass ) ,"img-notfound" )
										 
									}
								})
							},
							dataNoteFn = function( dataNote, index ){
								 
								if( dataNote.objectId === dataObject.id ){
									
									if( obj.loadMore.marker( "memo", main, dataNote, index ) ){
									
										
										let uri = dataNote.uri ? dataNote.uri :[],
										label = dataNote.label ? dataNote.label :[];
										 
										contentDom({
											id : dataNote.id, 
											title : dataNote.title,
											text : dataNote.text,
											dateStart : dataNote.dateStart,
											uri : uri,
											bguri : ( uri.length ? uri[0] : "" ),
											hiddenMedia : ( uri.length === 0 ? "hidden" : "" ),
											label : label
										});
										
									}
									
									dataEmpty = false;
								}
							};
							
							 							 
							if( !objectInitial ){
								
								let memoRange = obj.dataStorage.memoState.memoRange;
								 
								memoRange = memoRange && !/all/i.test( memoRange ) ? memoRange.split("-").join(" ") : "Rentang";
								  
								scope.text( scope.qs("memo-selected-range"), memoRange );
								
								container.innerHTML = "";
								
								//reset loadmore
								obj.loadMore.state.memo.reset();
							};
							 
							//first call or another call example save, -- generate content html 
							data.forEach(function( dataNote, index ){
								
								if( dataNote.title ){
								 
									dataNoteFn( dataNote, index );
									 
								}			
							});
							 
							 
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" )
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" )
						
							  
							/**
								memo buttons
							*/
							
							let memoBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
							memoBtns.map(function( btnMemo, index ){
								 
								let elClone = btnMemo.cloneNode(true);
								btnMemo.parentNode.replaceChild( elClone, btnMemo );
								
								scope.attachListener( elClone, 'click', function(){
									
									
									scope.removeClass( scope.getFirstChild( this ), "hidden" )
									 
								})
								
								
							})
						
						
							/**
								trigger modal untuk menampilkan image preview
							*/
							
							let previewBtns = scope.slice( main.querySelectorAll(".media-btn") );
							previewBtns.map(function( previewBtn, index ){
								
								let elClone = previewBtn.cloneNode(true);
								previewBtn.parentNode.replaceChild( elClone, previewBtn );
								
								scope.attachListener( elClone, 'click', function(){
								   
									let label = this.getAttribute("label");
								   
									for( let ii of data ){

										if( label === ii.id ){

											obj.modal.memoPreview.update({
												uriList :ii.uri
											})
											
											break;
										}

									} 
									
								})
							})
							
							/**
								btn delete popup
							*/
							
							if( !stateFirstload.memoState ){
								 
								//popup button delete
								scope.attachListener( main, scope.CursorStartEvent, function(e){ 
									
									let btnDels = scope.slice( main.querySelectorAll(".btn-delete") );
								 
									btnDels.forEach(function( btnDel ){
										
										let bound = btnDel.getBoundingClientRect(),
										isVisble = bound.height;
										
										if( isVisble ){
											 
											var target = (e && e.target) || (event && event.srcElement),
											needHide = true;

											while ( target.parentNode ) {

												if ( target ==  btnDel ) {
													needHide = false;
													break;
												}
												target = target.parentNode;
											}
											 
											if( needHide ){
												
												
												btnDel.setAttribute("style"," left:-100px" )
												
												btnDel.setAttribute("confirm", "no")
												
												scope.text( btnDel, "Hapus" )
												
												scope.addClass( btnDel,  "hidden" );
											}
										}
									})	
								 
								});
								
								stateFirstload.memoState = true;
							}
							
							
							/**
								btn delete click
							*/
							
							//button delete event
							let deleteBtns = scope.slice( main.querySelectorAll(".btn-delete") )
							deleteBtns.map( function( btnDel, index ){
								
								let elClone = btnDel.cloneNode(true);
								btnDel.parentNode.replaceChild( elClone, btnDel);
								
								scope.attachListener( elClone, 'click', function(){
									 
									let self = this,
									isConfirm = self.getAttribute("confirm");
									
									if( isConfirm && isConfirm === "yes" ){
												  
										let id = self.getAttribute("id");
										 
										data.forEach(function( objData, index ){
											 
											if( objData.id ===  id ){
												
												let imgUri = objData.uri ? objData.uri : [];
											 
												obj.storageCrud({
													id : id,
													type : "delete",
													dataStorage : "memo"
												},
												function(){
														 
													imgUri.forEach(function( imguri ){
														 
														let uriArr = imguri.split("/"),
														fileName = uriArr[ uriArr.length - 1 ];
														 
														obj.cordova.file.remove({
															path : imguri,
															fileName : fileName
														})
														
													})
																				
													obj.main.memo(); 
													
												});  				
												
											}			
										});
										 
										
										
										
									}else{
										 
										let fragment =  scope.stringToHtml5Template('. . . ');
										
										this.innerHTML = "";
										
										this.appendChild( fragment );
										
										this.setAttribute("style"," left:-73px" )
										
										scope.delayFire(function(){
											
											self.setAttribute("confirm", "yes")
											
											self.innerHTML = "";
											
											scope.text( self, "Konfirmasi" )
									
												self.setAttribute("style"," left:-134px" )
										
										},1000) 
									}
									
								})
							})
								
						},
						tracker : function( objectInitial ){
							
							let main = scope.qs("tracker-content"),
							containerTracker = scope.slice( main.querySelectorAll(".content-data") ),
							container = scope.qs("container-activity"),
							containerRunning = scope.qs("running-activity"),
							dataFilter = obj.dataStorage.tracker,
							dataAfterRange = obj.dataStorage.trackerState.trackerRange ? obj.dateTimeRangeValidate( dataFilter, obj.dataStorage.trackerState.trackerRange ) : dataFilter,
							data = obj.storageFilter( obj.stringMatchOrEmptyValidate( dataAfterRange, obj.dataStorage.trackerState.trackerMenu ) ),
							dataEmpty = true,
							containerEmpty = main.querySelector(".content-empty"),
							convertTimeFn = function( timer ){
								
								let covertTime = timer.split(":");
								
								covertTime[0] = covertTime[0].replace(/\s/g, '') !== "00" ? covertTime[0]+' Jam' : "";
								covertTime[1] = covertTime[1].replace(/\s/g, '') !== "00" ?covertTime[1]+' Menit' : "";
								covertTime[2] = covertTime[2].replace(/\s/g, '') !== "00" ?covertTime[2]+' Detik' : "";
							 
								return covertTime.join("");
							},
							timeTimeFn = function( dateEnd, dateNow ){
									
								timestame = scope.timeUnitBetween( dateEnd, dateNow  );
								 
								timestame = ( timestame.hour.toString().length <= 1 ? + "0"+timestame.hour.toString() : timestame.hour.toString() ) +" : " +
								( timestame.minute.toString().length <= 1 ? + "0"+timestame.minute.toString() : timestame.minute.toString() ) +" : "+
								( timestame.second.toString().length <= 1 ? + "0"+timestame.second.toString() : timestame.second.toString() )
								
								return timestame;
								
							},
							contentDom = function( params ){
								
								let innerDom = function( innerParams ){
									
									let notfyBoxSmall = document.createElement("div"),
									bubbleBox = document.createElement("div"),
									notifyStripB = document.createElement("div"),
									insCnt = document.createElement("ins"),
									spanTitle = document.createElement("span"),
									spanText = document.createElement("span"),
									abbrTime = document.createElement("abbr"),
									br = document.createElement("br"),
									btnLeft = document.createElement("div");
									
									notfyBoxSmall.className = "notify-box-small";
									
									notifyStripB.className = "notify-strip-b bg-turquoise";
								
									bubbleBox.className = "bubble-box "+params.icon;
									
									spanTitle.className = "notify-small-title extrabold";
									
									spanText.className = "notify-small-detail light left";
									
									btnLeft.className = "bubble-small-left"
									
									notfyBoxSmall.appendChild( bubbleBox );
									
									notfyBoxSmall.appendChild( abbrTime );
									 
									notfyBoxSmall.appendChild( insCnt );
									 
									notfyBoxSmall.appendChild( btnLeft );
									
									bubbleBox.appendChild(notifyStripB );
									 
									insCnt.appendChild( spanTitle );
									
									insCnt.appendChild( br );
									
									insCnt.appendChild( spanText );
									
									insCnt.className = "left";
									
									
									
									scope.text( abbrTime, params.betweenActivity )
									
									scope.text( spanTitle, params.activitySelect );
									 
									scope.text( spanText, 
										( params.stringTime && params.isRunning ? 
											params.stringTime : params.activityType ) + 
											( params.milliliter >= 0 ? ", "+params.milliliter +" "+ ( params.unitShort ? params.unitShort : "Ml" ) +" " : "" ) );
									
									btnLeft.setAttribute( "label", params.id )
									
									btnLeft.setAttribute( "title", params.activitySelect )
									
									btnLeft.setAttribute( "text", params.activityType )
									
									btnLeft.setAttribute( "time", params.stringTime )
									
									btnLeft.setAttribute( "date-create", params.timeSince )
									 
									btnLeft.setAttribute( "is-running", params.isRunning )
									
									btnLeft.setAttribute( "is-unit", params.milliliter ) 
									
									btnLeft.setAttribute( "unit", params.milliliter +' '+ scope.ucFirst( params.unit ) )
									 
									//append
									innerParams.container.appendChild( notfyBoxSmall );
									
									 
								},
								
								outterDom = function( outterParams ){
									 
									if( outterParams.createContainer ){
										
										let outterWrap = document.createElement("div"),
										
										wrapContent = document.createElement("div"),
										
										date = document.createElement("abbr");
										
										wrapContent.className = "wrap-content-data";
										  
										outterWrap.appendChild( date );
										 
										outterWrap.appendChild( wrapContent );
									 
										//append
										container.appendChild( outterWrap );
										 
										scope.text( date, params.timeSince );
										 
										wrapContent.setAttribute( "label", params.dateStart );
										
										innerDom({
											container : wrapContent
										}) 
										 
										scope.removeClass( scope.qs("polar-visual-button"), "hidden" );
										 
										
									}else{
										
										innerDom({
											container : outterParams.wrapContent
										})
									} 
								}	
								
								//find container based on date label
								let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
								emptyCnt = true;
								
								containerWrap.map(function( objWrap ){
									
									let label = objWrap.getAttribute("label");
									
									if( params.dateStart === label ){ 
									
										outterDom({
											createContainer : false,
											wrapContent : objWrap
										});
										
										emptyCnt = false;
									}
									
								})
								 
								 
								if( emptyCnt ){
									
									outterDom({
										createContainer : true
									});
								}
									 
								
								/**
									pattern
									
									<abbr>1 Juni</abbr>
									<div class="wrap-content-data">
										<div class="notify-box-small">  
											<div class="bubble-box dish-icon">
												<div class="notify-strip-b"></div>
											</div> 
											<abbr>2 hr</abbr> 
											<ins> 
												<span class="notify-small-title extrabold"> Jadwal menyusui</span> 
												<br> 
												<span class="notify-small-detail light"> 13 menit, 29 Detik </span> 
											</ins>
											<div class="bubble-small-left"></div>
										</div>
										<div class="notify-box-small">
											<div class="bubble-box bottle-icon">
												<div class="notify-strip-b"></div>
											</div> 
											 <ins> <span class="notify-small-title extrabold"> Jadwal makan bubur bayi </span>  <br> <span class="notify-small-detail light"> 57 menit : 22 Detik </span> </ins>
											<div class="bubble-small-left"></div>
											
										</div>
									</div>
								*/
								
							},
							contentRunning =  function( params ){
				 
								let hiddenInput = params.isUnit ? "" : "hidden";
								
								runningWrap = scope.stringToHtml5Template(
									'<div class="running-activity-wrap">' +
									'	<div class="notify-box-small mb0 mt30">  ' +
									'		<div class="bubble-box '+params.icon+'"></div> ' +
									'		<ins> '  +
									'			<span class="notify-small-title extrabold"> '+params.activitySelect+' </span> ' +
									'			<br> ' +
									'			<span class="notify-small-detail light"  id="'+params.id+'"> '+params.activityType+' </span> ' +
									'		</ins> ' +
									'		<div class="bubble-small-left" label="'+params.id+'" text="'+params.activityType+'" title="'+params.activitySelect+'"  time="'+params.stringTime+'" date-create="'+params.timeSince+'"></div> ' +
									'	</div> ' +
									'	<input class="'+hiddenInput+'" type="number" placeholder="'+ params.unit +' ( '+ params.unitShort +' ) "  maxlength="50">'+
									'	<div class="btn-track-finish" label-id="'+params.id+'">SELESAI</div> ' +
									'</div> ' 
								)
								  
  
								//append
								containerRunning.appendChild( runningWrap );
								 
								scope.removeClass( scope.qs("running-activity"), "hidden");
								
								return runningWrap;
								/** format
								
									<div class="running-activity-wrap">
										<div class="notify-box-small mb0 mt15">  
											<div class="bubble-box baby-pee-icon"></div> 
											<ins> 
												<span class="notify-small-title extrabold"> Jadwal menyusui</span> 
												<br> 
												<span class="notify-small-detail light"> 13 menit, 29 Detik </span> 
											</ins>
											<div class="bubble-small-left"></div>
										</div>
										<div class="btn-track-finish">SELESAI</div>
									</div>
								*/
							},
							dataNoteFn = function( dataNote, index ){
								
								if( dataNote.objectId === dataObject.id || dataNote.activityType === "Pompa Asi" ){
									
									if( obj.loadMore.marker( "tracker", main, dataNote, index ) ){
										
										let dateStart = scope.stringToDate( dataNote.dateStart ),
										  
										dateNext = data[ index + 1 ] ? scope.stringToDate( data[ index + 1 ].dateStart ) : new Date(),
										
										dateBetweenActivity = scope.timeSince( dateNext, dateStart ) ,
		 
										dateStartSplit = dataNote.dateStart.split(" ")[0],
										
										stringTime = "",
										
										isTodayOrYesterDay = scope.dateIsTodayOrYesterday( dateStart ),
										
										timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD( dateStart );
										   
										if( dataNote.dateEnd ){
											
											stringTime = timeTimeFn( scope.stringToDate( dataNote.dateEnd ), dateStart );
											stringTime = convertTimeFn( stringTime );
										}
										  
										
										if( !dataNote.running && !dataNote.isUnit ){ 
											  
											contentDom({
												dateStart : dateStartSplit,
												id : dataNote.id,
												timeSince : timeSince,
												stringTime : stringTime,
												betweenActivity : dateBetweenActivity,
												activitySelect : dataNote.activitySelect,
												activityType : dataNote.activityType,
												milliliter : dataNote.milliliter,
												isRunning : dataNote.isRunning ? dataNote.isRunning : false,
												isUnit : dataNote.isUnit ? dataNote.isUnit : false,
												unit : dataNote.unit ? dataNote.unit : "",
												unitShort : dataNote.unitShort ? dataNote.unitShort : "",
												icon : dataNote.icon
											});
		  
										}else{
											
											//time still recording
											contentRunning({
												activitySelect : dataNote.activitySelect,
												activityType : dataNote.activityType,
												timeSince : timeSince,
												stringTime : stringTime, 
												isUnit : dataNote.isUnit ? dataNote.isUnit : false,
												unit : dataNote.unit ? dataNote.unit : "",
												unitShort : dataNote.unitShort ? dataNote.unitShort : "",
												icon : dataNote.icon,
												id : dataNote.id
											});
											
											 
										}

									};
																			
									dataEmpty = false;
									
								}	 
							},
							intervalRunningFn = function( dataNote ){
								
								let dateNow = new Date(),
								dateStart = scope.stringToDate( dataNote.dateStart ),
								timestame = "00 : 00 : 00",
								dataNotify = ""; 
								 
								scope.id( dataNote.id ) && scope.text( scope.id( dataNote.id ), timeTimeFn( dateNow, dateStart ) );
								
							}; 
							 
							 
							 //clear container
							if( !objectInitial ){
								
								let trackerRange = obj.dataStorage.trackerState.trackerRange,
								trackerMenu = obj.dataStorage.trackerState.trackerMenu;
								
								trackerRange = trackerRange && !/all/i.test( trackerRange ) ? trackerRange.split("-").join(" ") : "Rentang";
								  
								scope.text( scope.qs("tracker-selected-range"), trackerRange );
								
								trackerMenu && 
									scope.text( scope.qs("tracker-selected-activity"), trackerMenu );
								
								scope.addClass( scope.qs("running-activity"), "hidden" );
								
								container.innerHTML = "" ;
								containerRunning.innerHTML = "";
								
								//reset loadmore
								obj.loadMore.state.tracker.reset();
							};
							  
							
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
								 									  
								dataNoteFn( dataNote, index );   
							})		 
							 
							
							 
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" )
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" )
							
							
							//first call
							if( !stateTimer.tracker ){
							
								//update time stamp only
								let trackerInterval = setInterval(function(){
									
									if( !/hidden/i.test( scope.qs("running-activity").className )  ){
										
										obj.dataStorage.tracker.forEach(function( dataNote ){
										 
											dataNote.running && intervalRunningFn( dataNote ) // just update time stamp
										})
									}
								},1000);
								
								
								//swiper button 
								scope.attachListener( scope.qs("box-swiper-chart-msg"), 'click', function(){
									
									let self = this;
									obj.storageState({ 
										storageState : "layoutState",
										objState : "msgBoxSwiperChart",
										value : true
									},
									function(){
										 
										self.remove()
									}) 
									
								})
								
								
								//titip click event untuk kontrol bumil
								scope.attachListener( scope.qs("box-swiper-chart-msg-bumil"), 'click', function(){
									
									let self = this;
									obj.storageState({ 
										storageState : "layoutState",
										objState : "msgBoxSwiperChartBumil",
										value : true
									},
									function(){
										 
										self.remove()
									}) 
									
								})
								
								//tab
								let tabIb = function( params ){
									
									obj.storageState({ 
										storageState : "layoutState",
										objState : "headerTabActivity",
										value : params.value
									},
									function(){}) 
									
								},
								tabEl =  scope.slice( scope.qsAll("tab-activity li") ),
							
								//swiper header
								swiperHeader = new Swiper('.swiper-activity', {
									observer: true,
									observeParents: true, 
									initialSlide: obj.dataStorage.layoutState.headerTabActivity
								}); 
								
								
								 
								swiperHeader.on('transitionEnd', function () {
											
									tabEl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									 
									 
									tabIb({
										value : swiperHeader.activeIndex
									}) 
									 
									
									scope.addClass( swiperHeader.activeIndex ? tabEl[1] : tabEl[0] , "select" );
										 
								}); 
								 
							  
								tabEl.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										 
										 
										swiperHeader.slideTo( getIndex, 300 );
										
										tabIb({
											value : getIndex
										}) 
											
									}.bind( objLi, index ) )
									
								}) 
								
								
								stateTimer.tracker = true;
							} 
							
							/**
								tracker running  buttons
							*/
							
							let runningBtns = scope.slice( scope.qs("tracker-content").querySelectorAll(".btn-track-finish") );
							
							runningBtns.map(function( runningBtn, index ){
								 
								scope.attachListener( runningBtn, 'click', function(){
									
									let input = scope.sibling( this, "previous" ),
									validateInput = !/hidden/i.test( input.className ),
									self = this,
									fnUpdate = function( params ){
										
										obj.storageCrud( 
											scope.extend({
												dataStorage : "tracker",
												type : "update",
												id : this.getAttribute("label-id"),
												dateEnd : ( new Date() ).toLocaleString("id-ID")
											}, params ),
											function(){
														
												self.parentNode.remove();
												
												obj.main.tracker(); // update content
												 
												obj.cordova.backgroundMode.enable();
												 
												!scope.getFirstChild( scope.qs("running-activity") ) && scope.addClass( scope.qs("running-activity"), "hidden" )
												
											}
										)
										
									}.bind( this ) ;
									
									if( validateInput ){
										
										if( obj.inputValidate([input]) ){
											
											fnUpdate({
												milliliter : input.value
											})
										}
									}else{
										
										fnUpdate({})
									}
									 
								})
							})
							
							 
							/**
								tracker detail buttons
							*/
							let trackerBtns = scope.slice( scope.qs("tracker-content").querySelectorAll(".bubble-small-left") );
							
							trackerBtns.map(function( btnTracker, index ){
								
								scope.attachListener( btnTracker, 'click', function(){
									
									//set label confirm button
									scope.qs("modal-tracker-confirm").querySelector(".send-button").setAttribute( "label", this.getAttribute("label") )
									 
									 
									//modal confirm 
									scope.text( [ scope.qs("tracker-confirm-title"), scope.qs("tracker-detail-title") ], this.getAttribute("title") );
									scope.text( [ scope.qs("tracker-confirm-type"), scope.qs("tracker-detail-type")], this.getAttribute("text") );
									scope.text( [ scope.qs("tracker-confirm-unit"), scope.qs("tracker-detail-unit")], this.getAttribute("unit") );
									scope.text( [scope.qs("tracker-confirm-datecreate"),  scope.qs("tracker-detail-datecreate") ], this.getAttribute("date-create") );
									scope.text( [scope.qs("tracker-confirm-timespan"),  scope.qs("tracker-detail-timespan") ], this.getAttribute("time") );
									
									
									 
									if( this.getAttribute("is-running") === "true" ){
										scope.removeClass( scope.qs("tracker-confirm-timespan").parentNode, "hidden" );
										scope.removeClass( scope.qs("tracker-detail-timespan").parentNode, "hidden" )
										scope.removeClass( scope.qs("sparator-detail-timespan"), "hidden" )
										scope.removeClass( scope.qs("sparator-detail-unit"), "hidden" )
										scope.removeClass( scope.qs("sparator-confirm-timespan"), "hidden" )
										scope.removeClass( scope.qs("sparator-confirm-unit"), "hidden" )
										
										 
										
									}else{
										scope.addClass( scope.qs("tracker-confirm-timespan").parentNode, "hidden" );
										scope.addClass( scope.qs("tracker-detail-timespan").parentNode, "hidden" )
										scope.addClass( scope.qs("sparator-detail-timespan"), "hidden" )
										scope.addClass( scope.qs("sparator-detail-unit"), "hidden" )
										scope.addClass( scope.qs("sparator-confirm-timespan"), "hidden" )
										scope.addClass( scope.qs("sparator-confirm-unit"), "hidden" )
										
									}
									 
									 
									if( this.getAttribute("is-unit") !== "undefined" ){
										scope.removeClass( scope.qs("tracker-confirm-unit").parentNode, "hidden" );
										scope.removeClass( scope.qs("tracker-detail-unit").parentNode, "hidden" )
										scope.removeClass( scope.qs("sparator-detail-unit"), "hidden" )
										scope.removeClass( scope.qs("sparator-confirm-unit"), "hidden" )
										

									}else{
										scope.addClass( scope.qs("tracker-confirm-unit").parentNode, "hidden" );
										scope.addClass( scope.qs("tracker-detail-unit").parentNode, "hidden" )
										scope.addClass( scope.qs("sparator-detail-unit"), "hidden" )
										scope.addClass( scope.qs("sparator-confirm-unit"), "hidden" )
									}
									
									obj.modal.behaviour.openModalFadeIn( "modal-tracker-detail" );
									 
								})
							})
						
						
						  
							//button select
							let ulEl = scope.slice( main.querySelectorAll( ".modal-content > ul " ) ),
							radioEl = scope.slice( main.querySelectorAll(".container-radio") );
							
							ulEl.forEach(function( objLi ){
								
								scope.attachListener( objLi, 'click', function(){
									
									//radio
									//glow
									radioEl.forEach(function( radio ){
										scope.removeClass( scope.getFirstChild( radio ), "checked" )
									})
									
									scope.addClass( scope.getFirstChild( this.querySelector(".container-radio")  ), "checked" )
									
									//glow
									ulEl.forEach(function( ul ){
										scope.removeClass( ul, "select" );
									})
									
									scope.addClass( this, "select" )
									
								})
								
							})
							
						},
						home : function( objectInitial ){
							 
							//define pregCalculate
					
							obj.pregCalculate.ultrasound();
							
							obj.pregCalculate.init(); 
							 
							let main = scope.qs("home-content"),
							swiperCnt = main.querySelector(".swiper-wrapper"),
							contentCnt = main.querySelector(".content-data"),
							header = document.getElementsByTagName("header")[0],
							activeWeek = obj.pregCalculate.pergPredict.fetusAge.weeks,
							activeDay = obj.pregCalculate.pergPredict.fetusAge.days,
							dueDate = obj.pregCalculate.pergPredict.dueDate,
							imgFetusCnt = scope.qs("preg-img-fetus"),
							swiperPregFn = function(){
								
								let totalWeek = obj.pregCalculate.totalWeek + 2 // 42 weeks in total
								
								for( var ii = 0; ii < totalWeek; ii++ ){
									
									let index = ii + 1;
									tooltipHide = activeWeek === index ? "" : "hidden",
									tooltipIntervalDate = obj.pregCalculate.getIntervalDayByWeek( index )
									tooltipDate = index+' Mgg, '+tooltipIntervalDate.firstDay+", "+tooltipIntervalDate.lastDay,
									markBlue = index <= activeWeek ? "bg-bluesky" : "",
									currentWeek = index === activeWeek ? "select":"",
									firstWeek = index === 1 ? "first-week":"",
									needBorderLeft = [1,14,28,41].indexOf( index ) >= 0, // last week each of tri semester 
									needBorderRight = [13,27,40,42].indexOf( index ) >= 0, // first week each of tri semester 
									pregTerm = [38,40,41,42].indexOf( index ) >= 0;
									
									let template =  scope.stringToHtml5Template(function(){
										
										let first, second, third; 
											
											first = '<div class="swiper-slide">'+
														'<div class="center-mmg '+ currentWeek +' '+ markBlue +'"  label='+index+'> '+ index +'</div>'+
															'<div class="interval-preg">';
											
																if( needBorderLeft ){
															second = '<div class="border-preg '+ markBlue +' border-left"></div>';
																}else if( needBorderRight ){
															second = '<div class="border-preg '+ markBlue +'"></div>' +
																	 '<div class="border-preg border-right '+ markBlue +'"></div>';
																}else if( currentWeek ){ 
															second = '<div class="border-preg '+ markBlue +'"></div>'+
																	 '<div class="border-preg"></div>';
																}else{
															second = '<div class="border-preg '+ markBlue +'"></div>'+
																	 '<div class="border-preg '+ markBlue +'"></div>';
																}
												
													third = '</div>'+
														
														( pregTerm ? '<div class="tooltip-term extrabold"> <span>'+ ( index === 38 ? "Early" : index === 40 ? "Full" : index === 41 ? "Late" : "Post" ) +'</span> </div>' : "" ) +
														'<div class="tooltip-date '+firstWeek+' extrabold '+ tooltipHide +'">'+ tooltipDate +'</div>'+
													'</div>';
											 
											return first + second + third
									}());
									
									
									swiperCnt.appendChild( template );
									
								}
								
							},
							fetusImg = function( index ){
								
								let val = parseInt( index ),
								className = 1 <= val && val <= 4 ? "fetus-icon" :
									5 <= val && val <= 9 ? "fetus-2-icon" :
									10 <= val && val <= 13 ? "fetus-3-icon" :
									14 <= val && val <= 18 ? "fetus-4-icon" :
									19 <= val && val <= 23 ? "fetus-5-icon" :
									24 <= val && val <= 27 ? "fetus-6-icon" :
									28 <= val && val <= 32 ? "fetus-7-icon" :
									33 <= val && val <= 35 ? "fetus-8-icon" :
									36 <= val && val <= 40 ? "fetus-9-icon" : "fetus-9-icon";
									 
								imgFetusCnt.className = "preg-img-fetus "+className 
							},
							hiddenTooltipTermFn = function( value ){
								
								let elemnts = scope.slice( swiperCnt.querySelectorAll(".tooltip-term") ),
								needHide = [37,38,39,40,41,42].indexOf( parseInt( value ) ) >= 0;
								 
								elemnts.forEach(( eachEl ) =>{ 
									 
									needHide ?
										scope.addClass( eachEl, "hidden" ) :
										scope.removeClass( eachEl, "hidden" )
								})	  
								
							},
							showFetusGrowthFn = function( index, isFirstCall ){
								
								let contentByWeek = scope.slice( contentCnt.querySelectorAll(".label-by-week") ),
								week = activeWeek > 0 ? "Minggu ke "+activeWeek : "",
								day = activeDay > 0 ? "Hari ke "+activeDay : "",
								sparator = week && day ? " , ": "",
								triSemester =  activeWeek <= 13 ? "Semester Pertama" :
									activeWeek > 13 && activeWeek <= 27 ?  "Semester ke Dua" : "Semester ke Tiga";
								 
								scope.text( scope.qs("trismester-age"), triSemester );
								
								scope.text( scope.qs("fetus-age"), week + sparator + day ); 
								 
								scope.text( scope.qs("due-date"), scope.dateToYMD( dueDate, "year","","","shortyear" ) );
								 
								fetusImg( index )
										
								contentByWeek.forEach(( eachEl ) =>{ 
									 
									if( index.toString() === eachEl.getAttribute("label") ){
										
										
										scope.removeClass( eachEl, "hidden" );
										  
										
									}else{	
										scope.addClass( eachEl, "hidden" );
									}
									 
								}) 
							}
							 
							swiperCnt.innerHTML = "";
							
							//append swiper elements
							swiperPregFn();
							
							//interval pregnancy
							let headerReact = header.getBoundingClientRect();
							totalSlide = Math.round( headerReact.width / headerReact.height ),
							oddValue =  totalSlide % 2 === 0 ? totalSlide - 1 : totalSlide; //60 hedaer 
						 
							
							if(  obj.dataStorage.dataObject.length ||  objectInitial  ){;
							  
								setTimeout( function(){
									var swiper = new Swiper('.header-tab', {
										observer: true,
										observeParents: true,	
										slidesPerView:  5 ,
										spaceBetween: 0,
										initialSlide : activeWeek - 3
									}); 
									 
								},100)
							
							}
							
							 
							hiddenTooltipTermFn( activeWeek )
							
							showFetusGrowthFn( activeWeek, "firstcall" );
							
							// events
							
							let btns = scope.slice( swiperCnt.querySelectorAll('.center-mmg') );
						 
							btns.forEach(( objBtn ) =>{
								 
								 scope.attachListener( objBtn, 'click', function(){
									  
									  
									btns.forEach(( eachBtn ) =>{ 
									
										scope.addClass( eachBtn.parentNode.querySelector(".tooltip-date"), "hidden" );
										 
									}) 
									
									scope.removeClass( this.parentNode.querySelector(".tooltip-date"), "hidden" );
									
									hiddenTooltipTermFn( this.getAttribute("label") ) ;
									
									showFetusGrowthFn( this.getAttribute("label") ); 
									
								 })
							})
						},
						contraction : function( objectInitial ){
							let main = scope.qs("contraction-content"),
							container = scope.slice( main.querySelectorAll(".content-data") )[0],
							containerEmpty = main.querySelector(".content-empty"),
							data = obj.storageFilter( obj.dataStorage.contraction ),
							dataEmpty = true,
							convertTimeFn = function( timer ){
								
								let covertTime = timer.split(":");
								
								covertTime[0] = covertTime[0].replace(/\s/g, '') !== "00" ? covertTime[0]+' Menit' : "";
								covertTime[1] = covertTime[1].replace(/\s/g, '') !== "00" ?covertTime[1]+' Detik' : "";
								covertTime[2] = covertTime[2].replace(/\s/g, '') !== "00" ?covertTime[2]+' MiliDetik' : "";
							 
								return covertTime[0]+ ( covertTime[0] ? ", " :"" ) +
								 covertTime[1]+ ( covertTime[1] ? ", " :"" ) +
								 covertTime[2]
								
							},
							contentDom = function( params ){
								
								let innerDom = function( innerParams ){
									     
									let content = scope.stringToHtml5Template(
										"<div class='notify-box-small'>"+
										"		<div class='bubble-box pregnant-love-icon'>"+
										"			<div class='notify-strip-b bg-grey-a'></div>"+
										"		</div>"+
										"		<abbr>"+ params.betweenActivity +"</abbr>"+
										"		<ins class='left'>"+
										"			<span class='notify-small-title extrabold'>"+ params.stringTime +"</span>"+
										"			<br>"+
										"			<span class='notify-small-detail light left'> Umur - "+ params.fetusAge +"</span>"+
										"		</ins>"+
										"		<div class='bubble-small-left' timer='"+ params.stringTime +"' start-date='"+ params.startFullDate +"' end-date='"+ params.endFullDate +"' id='"+params.id+"' fetus-age='"+ params.fetusAge  +"'></div>"+
										"</div>"
									); 
									
									//append
									innerParams.container.appendChild( content );
								},
								outterDom = function( outterParams ){
										
									if( outterParams.createContainer ){
										 
										let mainContent = scope.stringToHtml5Template(
											"<div>"+
												"<abbr>"+ params.timeSince +"</abbr>"+
												"<div class='wrap-content-data' label="+ params.startDate +">"+
												
												"<div>"+
											"<div>"
										),	 
										
										wrapContent = mainContent.querySelector(".wrap-content-data")
										
										innerDom({
											container : wrapContent
										}) 
										
										//append
										container.appendChild( mainContent );
										
									}else{
										
										innerDom({
											container : outterParams.wrapContent
										})
									} 
								}
								 
								 
								//find container based on date label
								let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
								emptyCnt = true;
								
								containerWrap.map(function( objWrap ){
									
									let label = objWrap.getAttribute("label");
									
									if( params.startDate === label ){ 
									
										outterDom({
											createContainer : false,
											wrapContent : objWrap
										});
										
										emptyCnt = false;
									}
									
								})
								 
								 
								if( emptyCnt ){
									
									outterDom({
										createContainer : true
									});
								} 
								
								/** pattern
									
									<div>
										<abbr>Hari ini</abbr>
										<div class="wrap-content-data" label="26/7/2019">
											<div class="notify-box-small">
													<div class="bubble-box footprint-icon">
														<div class="notify-strip-b bg-grey-a"></div>
													</div>
													<abbr>19 detik</abbr>
													<ins>
														<span class="notify-small-title extrabold">11 Tendangan</span>
														<br>
														<span class="notify-small-detail light">12 Menit, 3 Detik</span>
													</ins>
													<div class="bubble-small-left" ></div>
											</div>
											<div class="notify-box-small">
												<div class="bubble-box footprint-icon">
													<div class="notify-strip-b bg-turquoise"></div>
												</div>
												<abbr>baru saja</abbr>
												<ins>
													<span class="notify-small-title extrabold">7 Tendangan</span>
													<br>
													<span class="notify-small-detail light">11 Menit, 1 Detik</span>
												</ins>
												<div class="bubble-small-left" ></div>
												</div>
											</div>
										</div> 
									</div> 
								*/
								
							},
							timeTimeFn = function( dateEnd, dateNow ){
									
								let timestame = scope.timeUnitBetween( dateEnd, dateNow  );
								   
								timestame = ( timestame.minute.toString().length <= 1 ? + "0"+timestame.minute.toString() : timestame.minute.toString() ) +" : " +
								( timestame.second.toString().length <= 1 ? + "0"+timestame.second.toString() : timestame.second.toString() ) +" : "+
								( timestame.millisecond.toString().length <= 1 ? + "0"+timestame.millisecond.toString() : timestame.millisecond.toString() )
								
								
								return timestame;
								
							},
							dataNoteFn = function( dataNote, index ){
							
								
								if( dataNote.objectId === dataObject.id ){
									  
									if( obj.loadMore.marker( "contraction", main, dataNote, index ) ){
										 
										let startDate = scope.stringToDate( dataNote.startDate ),
										
										endDate = scope.stringToDate( dataNote.endDate ),
										  
										dateNext = data[ index + 1 ] ? scope.stringToDate( data[ index + 1 ].startDate ) : new Date(),
										
										dateBetweenActivity = scope.timeSince( dateNext, startDate ) ,
		 
										startDateSplit = dataNote.startDate.split(" ")[0],
										
										stringTime = convertTimeFn( dataNote.timer ),
										
										isTodayOrYesterDay = scope.dateIsTodayOrYesterday( startDate ),
										
										timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD( startDate );
										  
										
										contentDom({
											startDate : startDateSplit,
											startFullDate : scope.dateToYMD( startDate, "withYear", "hh:mm:ss"),
											endFullDate : scope.dateToYMD( endDate, "withYear", "hh:mm:ss"),
											id : dataNote.id,
											timeSince : timeSince,
											stringTime : stringTime,
											betweenActivity : dateBetweenActivity,
											fetusAge : dataNote.fetusAge
										});
										
									}
									 				
									dataEmpty = false;
								}
							}
							
							 
							 //clear container
							if( !objectInitial ){
								 
								container.innerHTML = "" ;
								
								//reset loadmore
								obj.loadMore.state.contraction.reset();
							}; 
							
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
								 								  
								dataNoteFn( dataNote, index );   
							})	
							
							//if data container is empty
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" );
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" );

								/**
								tracker detail buttons
							*/
							let contractionBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
							
							contractionBtns.map(function( btnContraction, index ){
								
								scope.attachListener( btnContraction, 'click', function(){
									  
									//modal confirm 
									scope.text( [ scope.qs("contraction-detail-age"), scope.qs("contraction-confirm-age") ], this.getAttribute("fetus-age") );
									scope.text( [ scope.qs("contraction-detail-timer"), scope.qs("contraction-confirm-timer") ], this.getAttribute("timer") );
									scope.text( [ scope.qs("contraction-detail-startdate"), scope.qs("contraction-confirm-startdate") ], this.getAttribute("start-date") );
									scope.text( [ scope.qs("contraction-detail-enddate"), scope.qs("contraction-confirm-enddate") ], this.getAttribute("end-date") );
									 
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-contraction-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("id") )
									 
									obj.modal.behaviour.openModalFadeIn("modal-contraction-detail") 
									  
								})
							})
							
						},
						kick :function( objectInitial ){
							
							let main = scope.qs("kicker-content"),
							container = scope.slice( main.querySelectorAll(".content-data") )[0],
							containerEmpty = main.querySelector(".content-empty"),
							data = obj.storageFilter( obj.dataStorage.kick ),
							dataEmpty = true,
							convertTimeFn = function( timer ){
								
								let covertTime = timer.split(":");
								
								covertTime[0] = covertTime[0].replace(/\s/g, '') !== "00" ? covertTime[0]+' Jam' : "";
								covertTime[1] = covertTime[1].replace(/\s/g, '') !== "00" ?covertTime[1]+' Menit' : "";
								covertTime[2] = covertTime[2].replace(/\s/g, '') !== "00" ?covertTime[2]+' Detik' : "";
							 
								return covertTime[0]+ ( covertTime[0] ? ", " :"" ) +
								 covertTime[1]+ ( covertTime[1] ? ", " :"" ) +
								 covertTime[2]
								
							},
							contentDom = function( params ){
								
								let innerDom = function( innerParams ){
									     
									let content = scope.stringToHtml5Template(
										"<div class='notify-box-small'>"+
										"		<div class='bubble-box footprint-icon'>"+
										"			<div class='notify-strip-b bg-grey-a'></div>"+
										"		</div>"+
										"		<abbr>"+ params.betweenActivity +"</abbr>"+
										"		<ins class='left'>"+
										"			<span class='notify-small-title extrabold'>"+ params.count+" Gerakan</span>"+
										"			<br>"+
										"			<span class='notify-small-detail light left'> "+params.stringTime+"</span>"+
										"		</ins>"+
										"		<div class='bubble-small-left' count='"+ params.count +" Gerakan'  timer='"+ params.stringTime +"' start-date='"+ params.startFullDate +"' end-date='"+ params.endFullDate +"' id='"+params.id+"' fetus-age='"+ params.fetusAge  +"'></div>"+
										"</div>"
									); 
									
									//append
									innerParams.container.appendChild( content );
								},
								outterDom = function( outterParams ){
										
									if( outterParams.createContainer ){
										 
										let mainContent = scope.stringToHtml5Template(
											"<div>"+
												"<abbr>"+ params.timeSince +"</abbr>"+
												"<div class='wrap-content-data' label="+ params.startDate +">"+
												
												"<div>"+
											"<div>"
										),	 
										
										wrapContent = mainContent.querySelector(".wrap-content-data")
										
										innerDom({
											container : wrapContent
										}) 
										
										//append
										container.appendChild( mainContent );
										
									}else{
										
										innerDom({
											container : outterParams.wrapContent
										})
									} 
								}
								 
								 
								//find container based on date label
								let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
								emptyCnt = true;
								
								containerWrap.map(function( objWrap ){
									
									let label = objWrap.getAttribute("label");
									
									if( params.startDate === label ){ 
									
										outterDom({
											createContainer : false,
											wrapContent : objWrap
										});
										
										emptyCnt = false;
									}
									
								})
								 
								if( emptyCnt ){
									
									outterDom({
										createContainer : true
									});
								} 
								
								/** pattern
									
									<div>
										<abbr>Hari ini</abbr>
										<div class="wrap-content-data" label="26/7/2019">
											<div class="notify-box-small">
													<div class="bubble-box footprint-icon">
														<div class="notify-strip-b bg-grey-a"></div>
													</div>
													<abbr>19 detik</abbr>
													<ins>
														<span class="notify-small-title extrabold">11 Tendangan</span>
														<br>
														<span class="notify-small-detail light">12 Menit, 3 Detik</span>
													</ins>
													<div class="bubble-small-left" ></div>
											</div>
											<div class="notify-box-small">
												<div class="bubble-box footprint-icon">
													<div class="notify-strip-b bg-turquoise"></div>
												</div>
												<abbr>baru saja</abbr>
												<ins>
													<span class="notify-small-title extrabold">7 Tendangan</span>
													<br>
													<span class="notify-small-detail light">11 Menit, 1 Detik</span>
												</ins>
												<div class="bubble-small-left" ></div>
												</div>
											</div>
										</div> 
									</div> 
								*/
								
							},
							timeTimeFn = function( dateEnd, dateNow ){
									
								let timestame = scope.timeUnitBetween( dateEnd, dateNow  );
								   
								timestame = ( timestame.minute.toString().length <= 1 ? + "0"+timestame.minute.toString() : timestame.minute.toString() ) +" : " +
								( timestame.second.toString().length <= 1 ? + "0"+timestame.second.toString() : timestame.second.toString() ) +" : "+
								( timestame.millisecond.toString().length <= 1 ? + "0"+timestame.millisecond.toString() : timestame.millisecond.toString() )
								
								
								return timestame;
								
							},
							dataNoteFn = function( dataNote, index ){
							
								
								if( dataNote.objectId === dataObject.id ){
									  
								 
									if( obj.loadMore.marker( "kick", main, dataNote, index ) ){
										 
										let startDate = scope.stringToDate( dataNote.startDate ),
										
										endDate = scope.stringToDate( dataNote.endDate ),
										  
										dateNext = data[ index + 1 ] ? scope.stringToDate( data[ index + 1 ].startDate ) : new Date(),
										
										dateBetweenActivity = scope.timeSince( dateNext, startDate ) ,
		 
										startDateSplit = dataNote.startDate.split(" ")[0],
										
										stringTime = convertTimeFn( dataNote.timer ),
										
										isTodayOrYesterDay = scope.dateIsTodayOrYesterday( startDate ),
										
										timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD( startDate );
										  
										
										contentDom({
											startDate : startDateSplit,
											startFullDate : scope.dateToYMD( startDate, "withYear", "hh:mm:ss"),
											endFullDate : scope.dateToYMD( endDate, "withYear", "hh:mm:ss"),
											id : dataNote.id,
											timeSince : timeSince,
											stringTime : stringTime,
											betweenActivity : dateBetweenActivity,
											fetusAge : dataNote.fetusAge,
											count : dataNote.count
										});
										
									}
									 				
									dataEmpty = false;
								}
							}
							
							 //clear container
							if( !objectInitial ){
								 
								container.innerHTML = "" ;
								
								//reset loadmore
								obj.loadMore.state.kick.reset();
							}; 
							
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
								 								  
								dataNoteFn( dataNote, index );   
							})	
							
							//if data container is empty
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" );
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" );
							
							
							let kickBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
							
							kickBtns.map(function( btnKick, index ){
								
								scope.attachListener( btnKick, 'click', function(){
									  
									//modal confirm 
									scope.text( [ scope.qs("kick-detail-age"), scope.qs("kick-confirm-age") ], this.getAttribute("fetus-age") );
									scope.text( [ scope.qs("kick-detail-count"), scope.qs("kick-confirm-count") ], this.getAttribute("count") );
									scope.text( [ scope.qs("kick-detail-timer"), scope.qs("kick-confirm-timer") ], this.getAttribute("timer") );
									scope.text( [ scope.qs("kick-detail-startdate"), scope.qs("kick-confirm-startdate") ], this.getAttribute("start-date") );
									scope.text( [ scope.qs("kick-detail-enddate"), scope.qs("kick-confirm-enddate") ], this.getAttribute("end-date") );
									 
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-kick-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("id") )
									  
									obj.modal.behaviour.openModalFadeIn("modal-kick-detail") 
									    
								})
							})
							
						}
					},	
					modalInput : { 
						textarea : scope.slice( scope.qs("modal-input-content").getElementsByTagName("textarea") )[0],
						input : scope.slice( scope.qs("modal-input-content").getElementsByTagName("input") )[0],
						elementSelect : "",
						elementType : "textarea",
						textareaVal : "",
						elementFocus : "",
						modalState : true,
						reset : function(){
							
							this.closeModal();
							this.modalState = true;
							this.elementFocus.value = this[ this.elementType ].value;
						},
						hiddenAndShowModalInput : function( showClass ){
								
							var allModals = scope.slice( scope.qsAll("modal-input > div") );
							
							allModals.map(function( objModal ){
								
								scope.removeClass( objModal, "open" );
								scope.addClass( objModal, "hidden" )
							})
							
							scope.removeClass( scope.qs( showClass ), "hidden ")
							
						},
						closeModal : function(){
							
							
							scope.removeClassTransform( scope.qs("modal-input"), "close", 150,{
								start : function(){
									
									scope.removeClass( scope.qs("modal-input"), "open" );
									
									 
									//fn && fn.start && fn.start();
									 
								},
								end : function(){
										
										
									let allModals = scope.slice( scope.qsAll("modal-input > div") );
									
									allModals.map(function( objModal ){
										
										scope.removeClass( objModal, "open" );
										scope.addClass( objModal, "hidden" )
									})
									
									//fn && fn.end && fn.end();
									
								}
							})
						},
						openModal : function(){
						
							let string = "modal-input-content";
							 
							this.activeModalEl = scope.qs( string ); 
									
							let pushToRight = "modal-left-to-right",
							pushToLeft = "modal-right-to-left",
							activeModal = scope.qs( string ),
							modal = scope.qs("modal-input");
							
							if( /modal-push-to-right/i.test( activeModal.className ) ){
								
								scope.removeClass( modal, pushToLeft );
								scope.addClass( modal, pushToRight )
							}else{
								
								scope.removeClass( modal, pushToRight );
								scope.addClass( modal, pushToLeft )
							}
						  
							this.hiddenAndShowModalInput( string ); 
							  
							scope.addClassTransform( scope.qs("modal-input"), "open", 150, {
								start : function(){
									
									scope.removeClass( scope.qs("modal-input"), "hidden" );
									 
									//params && params.start && params.start();
									
								},
								end : function(){
								
									scope.removeClass( scope.qs("modal-input"), "close" );
									scope.addClass( scope.qs( string ), "open" ); 
									
									//params && params.end && params.end(); 
								}
							}) 
						
						},
						init : function(){
							let btnBack = scope.qs("modal-input-content").querySelector(".back-button"),
							self =  this;
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								
								self.reset();
							})
							
							
							
							/* close */
							scope.attachListener( [ self.textarea, self.input ], 'click', function(){
								
								self.reset();
								 
							})
							
						},
						bindToKeyup : function( element, elType ){
							
							let self =  this, elementType = !elType ? "textarea" : elType === "textarea" ? "textarea" : "input" ;
							
							scope.attachListener( element, 'click', function( str ){
								
								let elDisable = str === "textarea" ? "input" : "textarea";
								
								scope.addClass( self[ elDisable ], "hidden")
								scope.removeClass( self[ str ], "hidden")
								
								self.elementType = str;
								
								self.elementSelect = self[ str ];
								
								self.update( this );
								
							}.bind( element, elementType ) )
							
							scope.attachListener( element, 'keyup', function( str ){
								
								let elDisable = str === "textarea" ? "input" : "textarea";
								
								scope.addClass( self[ elDisable ], "hidden")
								scope.removeClass( self[ str ], "hidden")
								
								self.elementType = str;
								
								self.elementSelect = self[ str ];
								
								self.update( this );
								
							}.bind( element, elementType ) )
						},
						update : function( elementOrigin ){
							
							let elementSelect = this.elementSelect;
							
							if( elementOrigin ){
								
								//reset first call 
								if( this.modalState ){
									
									elementSelect.setAttribute( "maxlength", elementOrigin.getAttribute("maxlength") )
																
									elementSelect.value = elementOrigin.value;
									this.elementFocus = elementOrigin; 
									this.openModal();
									this.modalState = false;
									
									//replacePlaceHolder to title
									
									let elOriPlaceHolder = elementOrigin.getAttribute("placeholder"),
									headerTitle = scope.qs("modal-input-content").querySelector(".header-left-title");
									 
									if( elOriPlaceHolder ){
										
										scope.text( headerTitle, elOriPlaceHolder );
									}else{
										
										scope.text( headerTitle, "" );
									}
									
								}
								
								setTimeout(function(){
								
									elementSelect.focus();
									
								},1000)
									
								if( self.elementType === "textarea" ){
									 
									elementSelect.setSelectionRange( elementSelect.value.length, elementSelect.value.length ); 
								}
							}
						}
					},
					modalMenu : { 
						behaviour : { 
							init : function(){
								 
							},
							activeModalEl : "",
							hiddenModal : function(){
								
								let allModals = scope.slice( scope.qsAll("modal-menu > div") );
								
								allModals.map(function( objModal ){
									
									scope.removeClass( objModal, "open" );
									scope.addClass( objModal, "hidden" )
								})
							},
							closeFadeout : function( fn ){
								
								let self = this;
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
										 
										fn && fn.start && fn.start();
										 
									},
									end : function(){
										
										self.hiddenModal();
										
										fn && fn.end && fn.end();
										
									}
								})
								
							},
							openFadeIn : function( string, params ){
								let modal = scope.qs("modal-menu"),
								pushToRight = "modal-left-to-right",
								pushToLeft = "modal-right-to-left";
								
								scope.removeClass( modal, pushToLeft ) 
								scope.removeClass( modal, pushToRight );
								 
								obj.hiddenAndShowModalMenu( string )
								 
								scope.addClassTransform( scope.qs("modal-menu"), "open", 150, {
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "hidden" );
										
										params && params.start && params.start();
									},
									end : function(){
									
										scope.removeClass( scope.qs("modal-menu"), "close" );
										 
										params && params.end && params.end();
									}
								})
							},
							openModalFadeIn  : function( string, params ){
								
								this.activeModalEl = scope.qs( string ); 
										
								let pushToRight = "modal-left-to-right",
								pushToLeft = "modal-right-to-left",
								activeModal = scope.qs( string ),
								modal = scope.qs("modal-menu");
								
								if( /modal-push-to-right/i.test( activeModal.className ) ){
									
									scope.removeClass( modal, pushToLeft );
									scope.addClass( modal, pushToRight )
								}else{
									
									scope.removeClass( modal, pushToRight );
									scope.addClass( modal, pushToLeft )
								}
							  
								obj.hiddenAndShowModalMenu( string ); 
								  
								scope.addClassTransform( scope.qs("modal-menu"), "open", 150, {
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "hidden" );
										 
										params && params.start && params.start();
										
									},
									end : function(){
									
										scope.removeClass( scope.qs("modal-menu"), "close" );
										scope.addClass( scope.qs( string ), "open" ); 
										
										params && params.end && params.end(); 
									}
								}) 
							},
							closeRightToleftFadeout : function( fn ){
								
								let self = this;
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										 
										scope.removeClass( scope.qs("modal-menu"), "open" );
										
										 
										fn && fn.start && fn.start();
									},
									end : function(){
										 
										self.hiddenModal();
										
										fn && fn.end && fn.end();
										 
										
									}
								}) 
							}
						},
						state : {
							remainder : true
						},
						triggerModalMenus : function(){
							let btnMemoMenu = scope.qs("memo-menu-button"),
							btnTrackRange = scope.qs("tracker-selected-range"),
							btnTrackerActivity =  scope.qs("tracker-selected-activity");
							
							
							/**
								memo menu popup
							*/
							scope.attachListener( btnMemoMenu, 'click', function(){
								
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-memo" );
								  
							})
							
							/**
								tracker time range  
							*/ 
							scope.attachListener( btnTrackRange, 'click', function(){
								
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-tracker-range" );
								   
							}) 
							
							/**
								tracker activity 
							*/ 
							scope.attachListener( btnTrackerActivity, 'click', function(){
								
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-tracker");
								    
							}) 
						},
						trackerAlert : function(){
							let btnBack = scope.qs("modal-menu-tracker-unselect").querySelector(".back-button");
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
								
							}) 
							
							
							
							
						},
						menuError :{
							init : function(){
								let btnBack = scope.qs("modal-menu-error").querySelector(".back-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									self.close();
								}) 
								
							},
							close : function(){
								
								obj.modalMenu.behaviour.closeFadeout();
								
							},
							show : function (){
								
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-error");
								     
							},
							update : function( frameElement ){
								
								let container = scope.qs("modal-menu-error").querySelector(".modal-content");
								
								container.innerHTML = "";
								
								container.appendChild( frameElement )
								
								this.show();
							}
						},
						menuWfa : function(){
							let btnBack = scope.qs("modal-menu-wfa").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-wfa").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								 
								obj.modalMenu.behaviour.closeFadeout({
									end : function(){
										
										obj.modal.behaviour.closeRightToleftFadeout()
									}
								});
								 
							};
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalWfa" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.wfaState.wfaUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.weightForAge.init();
									
									//reupdate chart 
									obj.chart.weightForAge.create();

									scope.addClass( scope.qs("modal-weightforage"), "hidden" )
									
									closeMenuModalFn();
									
								});
						
							})  
							
						},
						menuBpd : function(){
							let btnBack = scope.qs("modal-menu-bpd").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-bpd").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								obj.modalMenu.behaviour.closeFadeout({
									end : function(){
										
										obj.modal.behaviour.closeRightToleftFadeout()
									}
								});
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalBpd" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.bpdState.bpdUpdate, function(){
										 
									//update obj.dataStorage
									obj.chart.bpdForAge.init();
									
									//reupdate chart 
									obj.chart.bpdForAge.create();
									
									scope.addClass( scope.qs("modal-bpdforage"), "hidden" )
									
									closeMenuModalFn();
									
								});
								
							})  
							
						},
						menuHc : function(){
							let btnBack = scope.qs("modal-menu-hc").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-hc").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								obj.modalMenu.behaviour.closeFadeout({
									end : function(){
										
										obj.modal.behaviour.closeRightToleftFadeout()
									}
								});
							};
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalHc" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.hcState.hcUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.hcForAge.init();
									
									//reupdate chart 
									obj.chart.hcForAge.create();

									scope.addClass( scope.qs("modal-hcforage"), "hidden" )
									
									closeMenuModalFn();
								});
						
							})  
							
						},
						menuAc : function(){
							let btnBack = scope.qs("modal-menu-ac").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-ac").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								obj.modalMenu.behaviour.closeFadeout({
									end : function(){
										
										obj.modal.behaviour.closeRightToleftFadeout()
									}
								}); 
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalAc" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.acState.acUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.acForAge.init();
									
									//reupdate chart 
									obj.chart.acForAge.create();

									scope.addClass( scope.qs("modal-ac"), "hidden" )
									
									closeMenuModalFn();
								});
						
							})  
							
						},
						menuFlh : function(){
							let btnBack = scope.qs("modal-menu-flh").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-flh").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								obj.modalMenu.behaviour.closeFadeout({
									end : function(){
										
										obj.modal.behaviour.closeRightToleftFadeout()
									}
								});
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalFlh" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.flhState.flhUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.flhForAge.init();
									
									//reupdate chart 
									obj.chart.flhForAge.create();

									scope.addClass( scope.qs("modal-flh"), "hidden" )
									
									closeMenuModalFn();
								});
						
							})  
							
						},
						menuOfd : function(){
							let btnBack = scope.qs("modal-menu-ofd").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-ofd").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								obj.modalMenu.behaviour.closeFadeout({
									end : function(){
										
										obj.modal.behaviour.closeRightToleftFadeout()
									}
								}); 
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalOfd" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.ofdState.ofdUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.ofdForAge.init();
									
									//reupdate chart 
									obj.chart.ofdForAge.create();

									scope.addClass( scope.qs("modal-ofd"), "hidden" )
									
									closeMenuModalFn();
								});
						
							})  
							
						},
						menuMemo : function(){
							let btnBack = scope.qs("modal-menu-memo").querySelector(".back-button"),
							deleteBack = scope.qs("modal-menu-memo").querySelector(".send-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-memo span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-memo abbr") ),
							closeMenuModalFn = function(){
								
								obj.modalMenu.behaviour.closeFadeout(); 
							};
							 
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							/**
								menu list
							*/
							spanButtons.map(function( objListMenu ){
								
								scope.attachListener( objListMenu, 'click', function(){
									
									let self = this;
									
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									 
									obj.storageState({ 
										storageState : "memoState",
										objState : "memoRange",
										value : this.getAttribute("label") 
									},
									function(){
										
										//create checked radio button
									
										let ins = document.createElement("ins"),
										
										el = scope.getFirstChild( self );
										
										ins.className = "checked";
										
										el.appendChild( ins );
										  
										scope.text( scope.qs("memo-selected-range"), self.getAttribute("label-text") );
										
										closeMenuModalFn();
										
										obj.main.memo();
										
									}) 
									
									
								})								
							})
						},
						menuTrackerActivity : function(){
							let btnBack = scope.qs("modal-menu-tracker").querySelector(".back-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-tracker span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-tracker abbr") ),
							closeMenuModalFn = function(){
								
								obj.modalMenu.behaviour.closeFadeout(); 
							};
							  
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							/**
								menu list
							*/
							spanButtons.map(function( objListMenu ){
								
								scope.attachListener( objListMenu, 'click', function(){
									
									let self = this;
									 
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									 
									 
									obj.storageState({ 
										storageState : "trackerState",
										objState : "trackerMenu",
										value : this.getAttribute("label") //a,b,c
									},
									function(){
										 
										//create checked radio button 
										let ins = document.createElement("ins"),
										
										el = scope.getFirstChild( self );
										
										ins.className = "checked";
										
										el.appendChild( ins );
										  
										scope.text( scope.qs("tracker-selected-activity"), self.getAttribute("label-text") );
									
										closeMenuModalFn(); 
										
										obj.main.tracker()
									}) 
									
								})								
							}) 
						},
						menuTrackerRange : function(){
							
							let btnBack = scope.qs("modal-menu-tracker-range").querySelector(".back-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-tracker-range span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-tracker-range abbr") ),
							closeMenuModalFn = function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							 
							};
							 
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							/**
								menu list
							*/
							spanButtons.map(function( objListMenu ){
								
								scope.attachListener( objListMenu, 'click', function(){
									 
									let self = this; 
									 
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									 
									 
									obj.storageState({ 
										storageState : "trackerState",
										objState : "trackerRange",
										value : self.getAttribute("label") //a,b,c
									},
									function(){
										
										//create checked radio button 
										let ins = document.createElement("ins"),
										
										el = scope.getFirstChild( self );
										
										ins.className = "checked";
										
										el.appendChild( ins );
										  
										scope.text( scope.qs("tracker-selected-range"), self.getAttribute("label-text") );
									
										closeMenuModalFn();
										
										obj.main.tracker()
									}) 
									 
								})								
							}) 
						},
						menuRemainder : function(){
							
							let self = this,
							btnBack = scope.qs("modal-menu-remainder").querySelector(".back-button"), 
							spanButtons = scope.slice( scope.qsAll("modal-menu-remainder span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-remainder abbr") ),
							inputs = scope.slice( scope.qs("modal-babyremainder").getElementsByTagName("input") ),
							datepickerRemainder = scope.qs("datepicker-remainder"),
							closeMenuModalFn = function(){
								 
								obj.modalMenu.behaviour.closeFadeout();
							};
							 
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							/**
								menu list
							*/
							spanButtons.map(function( objListMenu, index ){
								  
								scope.attachListener( objListMenu, 'click', function( indexSpan ){
									  
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									
									
									//create checked radio button 
									let ins = document.createElement("ins"),
									objInput = inputs[0],
									dateEl = scope.qs("date-remainder-select"),
									labelText = this.getAttribute("label"),
									dateNow = new Date(),
									stringDate = "hour",
									loop = "true",
									picDateNotifyFn = function(){
											 
										objInput.value = scope.dateToYMD( dateNow, "year" );
										
										//set modal remainder new
										objInput.setAttribute( "selected-date", dateNow.toLocaleString("id-ID") );
										
										//remove hidden checkbox
										scope.removeClass( scope.qs("modal-babyremainder").querySelector(".modal-checkbox"),"hidden" );
										
										scope.text( scope.qs("notify-type"), labelText ); 
										
										objInput.setAttribute("string-date", stringDate )
										
										objInput.setAttribute("label-text", labelText )
										
										objInput.setAttribute( "loop", loop );
										
										
									};
									
									el = scope.getFirstChild( this );
									
									ins.className = "checked";
									
									el.appendChild( ins );
									    
									scope.text( dateEl, "-" )
									 
									if( indexSpan === 0 ){ //repeat every one hour
										
										dateNow.setHours( dateNow.getHours() + 1 );
										
										stringDate = "hour";
										
									}else if( indexSpan === 1 ){ //repeat every one day
										
										dateNow.setDate( dateNow.getDate() + 1 );
										
										stringDate = "day";
										
									}else if( indexSpan === 2 ){ //repeat every 7 day
										
										dateNow.setDate( dateNow.getDate() + 7 );
										
										stringDate = "week";
										
									}else if( indexSpan === 3 ){ //repeat every one month
										
										let now = new Date(); 
										dateNow.setSeconds( dateNow.getSeconds() - now.getSeconds() );
										dateNow.setMinutes( dateNow.getMinutes() - now.getMinutes() );
										dateNow.setHours( dateNow.getHours() - now.getHours() ); 
										dateNow.setMonth( dateNow.getMonth() + 1 );
										  
										stringDate = "month"; 
										 
									}else if( indexSpan === 4 ){ 
										  
										obj.modalMenu.behaviour.closeFadeout({
											end : function(){
												
												obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-remainder");
												
											}
										})  
										     
										stringDate = "selected-date";  
										
										if( self.state.remainder ){
											
											/**
												Plugin datepicker
											***/  
										 
											let datepickerRemainder = scope.qs("plugin-datepicker-remainder"),
											pluginBack = datepickerRemainder.querySelector(".back-button"),
											pluginSend = datepickerRemainder.querySelector(".send-button"), 
											selectDateFn = function(){
												
												let timepicked = scope.slice( datepickerRemainder.querySelectorAll(".swiper-slide-active") );
												 
												//reverse it to yyyy/mm/dd
												timepicked.reverse();
												
												return new Date( 
													timepicked[0].textContent, 
													parseInt( timepicked[1].textContent ) - 1, 
													timepicked[2].textContent
												)
												
											};
											
											scope.text( scope.qs("select-date-remainder"), scope.dateToYMD( new Date(), "year") )
											 
											/**
												close
											*/
											scope.attachListener( pluginBack, 'click', function(){
												
												obj.modalPlugin.behaviour.closeFadeout({
													end : function(){
														
														obj.modalMenu.behaviour.openModalFadeIn("modal-menu-remainder");
														
													}
												})  
												
											})
											
											
											/**
												confirm plugin date
											*/
											scope.attachListener( pluginSend, 'click', function(){
												  
												dateSelect = selectDateFn();
												     
												dateSelect.setHours( dateNow.getHours() );
												
												dateSelect.setMinutes( dateNow.getMinutes() );
												
												dateSelect.setSeconds( dateNow.getSeconds() );
											 
												if( ( new Date() ) < dateSelect ){
												 
													objInput.value = scope.dateToYMD( dateSelect, "year" );
													 
													scope.text( dateEl, objInput.value );
													  
													loop = "false"
											 
													obj.modalPlugin.behaviour.closeFadeout({
														end : function(){
															
															obj.modalMenu.behaviour.openModalFadeIn("modal-menu-remainder");
															
														}
													}) 
													
													dateNow = dateSelect;
													
													picDateNotifyFn()
													
												}else{
													
													let fragmentHpht = scope.stringToHtml5Template(
														'<span class="center-text semibold"> Apakah tanggal yang dipilih telah kadaluarsa ? </span>'
													);
													 
													obj.modalMenu.menuError.update( fragmentHpht );
													
												}	
												 
												
											})
											
											obj.generateSwiperDate({
												containerStr : ".datepicker-remainder",
												fn : function(){
													 
													scope.text( scope.qs("select-date-remainder"), scope.dateToYMD( selectDateFn(), "year") );
													 
												}
											}) 
												 
											//execute once 
											self.state.remainder = false;
										} 
									  
										
									}
									 
									
									// select date execption
									picDateNotifyFn()
									 
								}.bind( objListMenu, index ))								
							}) 
						
						},
						menuGenderBaby : function(){
							
							let btnBack = scope.qs("modal-menu-gender-baby").querySelector(".back-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-gender-baby span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-gender-baby abbr") ),
							closeMenuModalFn = function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							};
							 
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							/**
								menu list
							*/
							spanButtons.map(function( objListMenu ){
								
								scope.attachListener( objListMenu, 'click', function(){
									 
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									
									
									//create checked radio button 
									let ins = document.createElement("ins"),
									
									el = scope.getFirstChild( this );
									
									ins.className = "checked";
									
									el.appendChild( ins );
									  
									scope.qs("baby-gender-radio").value =  this.getAttribute("label-text");
								
									closeMenuModalFn();  
									
								})								
							}) 
						}, 
						menuRelativeBaby : function(){
								
							let btnBack = scope.qs("modal-menu-relative-baby").querySelector(".back-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-relative-baby span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-relative-baby abbr") ),
							closeMenuModalFn = function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							};
							 
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							/**
								menu list
							*/
							spanButtons.map(function( objListMenu ){
								
								scope.attachListener( objListMenu, 'click', function(){
									 
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									 
									//create checked radio button 
									let ins = document.createElement("ins"),
									
									el = scope.getFirstChild( this );
									
									ins.className = "checked";
									
									el.appendChild( ins );
									  
									scope.qs("baby-relative-radio").value =  this.getAttribute("label-text");
								
									closeMenuModalFn();  
									
								})								
							}) 
						},
						menuRestore : function(){
							let exitButton = scope.qs("modal-menu-restore").querySelector(".send-button");
							 
							scope.attachListener( exitButton, 'click', function(){
								
								navigator.app.exitApp();
							});
						},
						menuKicker : function(){
							let btnBack = scope.qs("modal-menu-kicker-reset").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-kicker-reset").querySelector(".send-button"),
							closeMenuModalFn = function(){
								
								obj.modalMenu.behaviour.closeFadeout();
								 
							};
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn();
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								 
								closeMenuModalFn();
								obj.modal.kickNew.reset(); 
							})  
						
						}
					},
					modalPlugin :{
						behaviour : { 
							init : function(){
								 
							},
							activeModalEl : "",
							hiddenModal : function(){
								
								let allModals = scope.slice( scope.qsAll("plugin > div") );
								
								allModals.map(function( objModal ){
									
									scope.removeClass( objModal, "open" );
									scope.addClass( objModal, "hidden" )
								})
							},
							closeFadeout : function( fn ){
								
								let self = this;
								
								scope.removeClassTransform( scope.qs("plugin"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("plugin"), "open" );
										 
										fn && fn.start && fn.start();
										 
									},
									end : function(){
										
										self.hiddenModal();
										
										fn && fn.end && fn.end();
										
									}
								})
								
							},
							openFadeIn : function( string, params ){
								let modal = scope.qs("plugin"),
								pushToRight = "modal-left-to-right",
								pushToLeft = "modal-right-to-left";
								
								scope.removeClass( modal, pushToLeft ) 
								scope.removeClass( modal, pushToRight );
								 
								obj.hiddenAndShowModalMenu( string )
								 
								scope.addClassTransform( scope.qs("plugin"), "open", 150, {
									start : function(){
										
										scope.removeClass( scope.qs("plugin"), "hidden" );
										
										params && params.start && params.start();
									},
									end : function(){
									
										scope.removeClass( scope.qs("plugin"), "close" );
										 
										params && params.end && params.end();
									}
								})
							},
							openModalFadeIn  : function( string, params ){
								
								this.activeModalEl = scope.qs( string ); 
										
								let pushToRight = "modal-left-to-right",
								pushToLeft = "modal-right-to-left",
								activeModal = scope.qs( string ),
								modal = scope.qs("plugin");
								
								if( /modal-push-to-right/i.test( activeModal.className ) ){
									
									scope.removeClass( modal, pushToLeft );
									scope.addClass( modal, pushToRight )
								}else{
									
									scope.removeClass( modal, pushToRight );
									scope.addClass( modal, pushToLeft )
								}
							  
								obj.hiddenAndShowModalMenu( string ); 
								  
								scope.addClassTransform( scope.qs("plugin"), "open", 150, {
									start : function(){
										
										scope.removeClass( scope.qs("plugin"), "hidden" );
										 
										params && params.start && params.start();
										
									},
									end : function(){
									
										scope.removeClass( scope.qs("plugin"), "close" );
										scope.addClass( scope.qs( string ), "open" ); 
										
										params && params.end && params.end(); 
									}
								}) 
							},
							closeRightToleftFadeout : function( fn ){
								
								let self = this;
								
								scope.removeClassTransform( scope.qs("plugin"), "close", 150,{
									start : function(){
										 
										scope.removeClass( scope.qs("plugin"), "open" );
										
										 
										fn && fn.start && fn.start();
									},
									end : function(){
										 
										self.hiddenModal();
										
										fn && fn.end && fn.end();
										 
										
									}
								}) 
							}
						}
					},
					modal : {
						behaviour : { 
							screenScrollModalDetail : function( element ){
								 
								element.forEach(function( objEl ){
								 
									let elementRect = objEl.getBoundingClientRect(),
									body = document.body.getBoundingClientRect(),
									marginBottom = elementRect.bottom - body.bottom ,
									elementHeight = elementRect.height;
									 
									if( marginBottom > 0 ){ 
									 
										scope.css( objEl, {
											height : elementHeight - ( Math.abs( marginBottom ) + 60   ) +"px" //30 padding top bottom // 30 look cool
										})
									}else{
										
										scope.css( objEl, {
											height : ( elementHeight  ) +"px" //30 padding top bottom // 30 look cool
										})
									}
									 
								 
								})
								 
							},
							init : function(){
								 
							},
							activeModalEl : "",
							modalPrev : [],
							triggerToPreviousModal : function(){
								
								let self = this,
								len = self.modalPrev.length - 1 ,
								modalPrev = self.modalPrev[ len ];
								 
								if( modalPrev ){
									
									scope.delayFire(function(){ 
										
										self.openModalFadeIn( modalPrev );
										
										self.modalPrev.splice( len, 1 );
										
									},50)
									
								}
								
							},
							hiddenModal : function( params, callback ){
								
								let self = this,
								allModals = scope.slice( scope.qsAll("modal > div") );
							
								if( params && params.registerModal ){
									
									//bind to modal previous
									self.modalPrev.push( params.registerModal );
									
									self.modalPrev = scope.uniqueArray( self.modalPrev );
									 
								}
								
								for(var ii = 0, jj = allModals.length; ii < jj ; ii++ ){
									
									let objModal = allModals[ii] 
									 
									scope.removeClass( objModal, "open" );
									scope.addClass( objModal, "hidden" )
									
									if( jj - 1 === ii ) {
										
										callback();
										 
									}
									
								} 
							},
							closeFadeout : function( fn ){
								 
								let self = this;
								  
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
										 
										fn && fn.start && fn.start();
										 
									},
									end : function(){
										
										self.hiddenModal( fn, function(){
											
											fn && fn.end && fn.end();
											
											fn && fn.previous && self.triggerToPreviousModal();
											 
											if( self.activeModalContent && self.activeModalContent.length ){
												
												self.activeModalContent.forEach(function( objEl ){
												
													objEl.setAttribute("style", "")
												
												})
												
											}
																
										})
									 
									}
								})
								
							},
							openModal : function( string, params ){
								
								this.activeModalEl = scope.qs( string ); 
										
								let self =  this,
								pushToRight = "modal-left-to-right",
								pushToLeft = "modal-right-to-left",
								activeModal = scope.qs( string ),
								modal = scope.qs("modal"),
								bodyContent = scope.slice( activeModal.querySelectorAll(".modal-content-wrap") );
								
								this.activeModalContent = bodyContent;
								
								
								if( /modal-push-to-right/i.test( activeModal.className ) ){
									
									scope.removeClass( modal, pushToLeft );
									scope.addClass( modal, pushToRight )
								}else{
									
									scope.removeClass( modal, pushToRight );
									scope.addClass( modal, pushToLeft )
								}
							  
								obj.hiddenAndShowModals( string ); 
								   
								scope.addClassTransform( scope.qs("modal"), "open", 150, {
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "hidden" );
										 
										params && params.start && params.start();
										 
									},
									end : function(){
									
										scope.removeClass( scope.qs("modal"), "close" );
										scope.addClass( scope.qs( string ), "open" ); 
										
										params && params.end && params.end(); 
										bodyContent.length && self.screenScrollModalDetail( bodyContent );
										 
									}
								}) 
								
								obj.appConfig.ads.interstitial.interaction--;
							},
							openFadeIn : function( string, params ){
								
								this.openModal( string, params )
								
							},
							openModalFadeIn  : function( string, params ){
								
								this.openModal( string, params )
								
							},
							closeRightToleftFadeout : function( fn ){
								 
								let self = this;
								   
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										 
										scope.removeClass( scope.qs("modal"), "open" );
										 
										fn && fn.start && fn.start();
									},
									end : function(){
										 
										self.hiddenModal( fn, function(){
											 
											fn && fn.end && fn.end();
											
											fn && fn.previous && self.triggerToPreviousModal();
											 
											if( self.activeModalContent && self.activeModalContent.length ){
												
												self.activeModalContent.forEach(function( objEl ){
												
													objEl.setAttribute("style", "")
												
												})
												
											}
														 
										})
									}
								}) 
							}
						},
						state : {
							remainder : true,
							wfage : true,
							bpd : true,
							hcage : true,
							acAge : true,
							flh : true,
							ofd : true,
							weightbumil : true,
							bpbumil : true,
							tfubumil : true,
							bpmbumil : true
						},
						triggerModals : function(){
							let btnRemainder = scope.qs("notify-button"),
							btnMemo = scope.qs("memo-button"),
							btnTrack = scope.qs("tracking-button"),
							btnTrackPolar = scope.getLastChild( scope.qs("polar-visual-button") ),
							btnOtherList = scope.qs("header-menu > li:first-child div"),
							growthChart = scope.qs("growth-button"),
							controlChart = scope.qs("control-button"),
							imtBumilBtn = scope.qs("imtbumil-button");
							   
							scope.attachListener( imtBumilBtn, 'click', function(){
								 
								obj.modal.behaviour.openModalFadeIn("imtbumil-modal"); 
							})
							
							scope.attachListener( btnOtherList, 'click', function(){
								 
								 
								obj.modal.behaviour.openModalFadeIn("modal-other-list"); 
								
							})
							   
							   
							scope.attachListener( btnTrackPolar, 'click', function(){
								  
								obj.modal.behaviour.openModalFadeIn("modal-tracker-chart", {
									// inital polar chart
									end : function(){ 
										
										
										obj.chartActivity.generateChart(); 
									}
									
								}); 
								  
							})
							
							scope.attachListener( btnTrack, 'click', function(){
								
								obj.modal.behaviour.openModalFadeIn("modal-tracker-new");
							})
							
							
							scope.attachListener( btnRemainder, 'click', function(){
								 
								obj.modal.behaviour.openModalFadeIn( "modal-babyremainder" ); 
							})
							 
							scope.attachListener( btnMemo, 'click', function(){
								 
								obj.modal.behaviour.openModalFadeIn("modal-memo"); 
							})
							
							 
							scope.attachListener( growthChart, 'click', function(){
								
								let index = obj.dataStorage.layoutState.activeSwiperChart.index;
								
								switch( index ){
									
									case 0 :  //estimation fetus weight
											 
										obj.modal.behaviour.openModalFadeIn("modal-weightforage") 	 
										 
										break;
									
									case 1 :
											 
										obj.modal.behaviour.openModalFadeIn("modal-bpdforage") 	 
										 	 
										break
										
									case 2 :
										 
										obj.modal.behaviour.openModalFadeIn("modal-hcforage") 	 
										  
										break;
										
									case 3 :
									 
										obj.modal.behaviour.openModalFadeIn("modal-ac") 	 
										   
										break;
										
									case 4 :
									 	 
										obj.modal.behaviour.openModalFadeIn("modal-flh") 	 
										  
										break;
										
									case 5 :
									 	 
										obj.modal.behaviour.openModalFadeIn("modal-ofd") 	 
										    
										break;
								} 
								  
							}) 
						   
						    scope.attachListener( controlChart, 'click', function(){
								
								let index = obj.dataStorage.layoutState.activeSwiperChartControl.index;
								
								switch( index ){
									
									case 0 :  
											 
										obj.modal.behaviour.openModalFadeIn("modal-weightbumil") 	 
										 
										break; 
										
									case 1 : 
											 
										obj.modal.behaviour.openModalFadeIn("modal-bpbumil") 	 
										 
										break; 
										
									case 2 :  
											 
										obj.modal.behaviour.openModalFadeIn("modal-tfubumil") 	 
										 
										break; 
									 
									case 3 :  
											 
										obj.modal.behaviour.openModalFadeIn("modal-bpmbumil") 	 
										 
										break; 
								} 
								  
							}) 
						},
						memoNew : function(){
							let self = this,
							modal = scope.qs("modal-memo"), 
							textareas = scope.slice( modal.getElementsByTagName("textarea") ),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							sendBack = modal.querySelector(".send-button"),
							btnBack = modal.querySelector(".back-button"),
							labelCnt =  modal.querySelector(".media-label"),
							cntImg =  scope.qs("box-img-container"),
							btnCamera =  scope.qs("t-memo-camera"),
							btnBrowse = scope.qs("t-memo-picture"),
							appendImgFile = function( imguri ){
								 
								let stringArr = imguri.split("."),
								fileExtention = stringArr[ stringArr.length - 1 ];
							 
								if( !/png|jpeg|jpg/i.test( fileExtention ) ){
								 		
									let fragment = scope.stringToHtml5Template(
										'<span class="center-text semibold"> file bukan berupa gambar, harap unggah berekstensi png, jpeg, jpg </span>'
									);
									
									obj.modalMenu.menuError.update( fragment );
									
								}else{
									
									let divTest = document.createElement("div"),
									fragment = scope.stringToHtml5Template(
										'<div class="img-container">'+
										'	<img src="" uri="'+imguri+'" >'+
										'	<div class="close"></div>'+
										'</div>'
									)
									  
									divTest.appendChild( fragment );
									 
									let img = divTest.querySelector("img");
									 
									img.src = imguri;//global.URL.createObjectURL( blob )
	 
									cntImg.appendChild( img.parentNode )
									
									let closeBtn = scope.slice( cntImg.querySelectorAll(".close") )
									
									closeBtn.forEach(function( btnClose ){
											
										var elClone = btnClose.cloneNode(true);
										btnClose.parentNode.replaceChild( elClone, btnClose );
										scope.attachListener( elClone, 'click', function(){
											
											let parentEl = this.parentNode;
										 
											parentEl.parentNode.removeChild( parentEl )
											
										})
									
									})
									
								}
							},
							appendLabel = function( el ){
								
								if( el.value.split(" ").join("") !== "" ){
									
									let fragment = scope.stringToHtml5Template('<div class="label" label-text="'+ scope.encodeStr( el.value ) +'"> '+ scope.encodeStr( el.value ) +'  <div class="btn-close-label pluse-black-icon bg-size-60"></div></div>')
									labelCnt.appendChild( fragment );
									
									//bind to delete sendiri;
									let labels = scope.slice( labelCnt.querySelectorAll("div") );
									labels.forEach(function( objEl ){
												
										var elClone = objEl.cloneNode(true);
										objEl.parentNode.replaceChild( elClone, objEl );
										scope.attachListener( elClone, 'click', function(){ 
											
											this.parentNode.removeChild( this ); 
										})
									})
									
									el.value = "";
									
								}
							},
							closeModalFn = function(){
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									}
								})
								
							};
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeModalFn();
								
								labelCnt.innerHTML = "";
								
								cntImg.innerHTML = "";
							})
							 
							
							/**
								bind modal-input to inputs and textarea
							*/
							obj.modalInput.bindToKeyup( inputs[1], "textarea" );
							obj.modalInput.bindToKeyup( textareas[0], "textarea" );
							 		 
							scope.attachListener( btnCamera, 'click', function(){ 
								
								obj.cordova.camera.getPicture(function( imguri ){ 
									  
									  appendImgFile( imguri )
								})
								
							})
							
									 
							scope.attachListener( btnBrowse, 'click', function(){ 
								
								obj.cordova.camera.chooseGallery(function( imguri ){ 
									  
									  appendImgFile( imguri );
									  
								})
								
							})
							
							//backbutton untuk label
							scope.attachListener( inputs[0], 'backbutton', function(e){
								
								appendLabel( this )
							})
							
							//keypress untuk label
							scope.attachListener( inputs[0], 'keypress', function(e){
								e.which = e.which || e.keyCode;
								if( e.which === 13 ) {
									
									appendLabel( this )
								}
								
							})
							
							
							/**
								send button
							*/
							scope.attachListener( sendBack, 'click', function(){
								 
								 //koleksi semua gambar yang user upload
								 
								let collectUri = [],
								
								imgMoment = scope.slice( cntImg.querySelectorAll("img") );
								
								imgMoment.forEach(function( img ){
									 
									collectUri.push( img.getAttribute("uri") )
									
								})
								 
								//koleksi semua label
								let collectLabel = [],
								
								labelMoment = scope.slice( labelCnt.querySelectorAll(".label") );
								
								labelMoment.forEach(function( label ){
									
									collectLabel.push( label.getAttribute("label-text") )
									
								})
								
								//validasi kalau label kosong
								if( !collectLabel.length ){
											
									let fragment = scope.stringToHtml5Template(
										'<span class="center-text semibold"> Tambahkan label setidaknya satu </span>'
									);
									
									obj.modalMenu.menuError.update( fragment );
									
								}else if( !collectUri.length ){
											
									let fragment = scope.stringToHtml5Template(
										'<span class="center-text semibold"> Tambahkan gambar setidaknya satu </span>'
									);
									
									obj.modalMenu.menuError.update( fragment );
									
								}else {
								 
									
									//clone semua image ke foloder BumilPhoto lalu simpan
								
									if( obj.inputValidate( [ inputs[1], textareas[0] ] ) ){
										 
										let collectCloneUri = [];
									
										collectUri.forEach(function( imguri ){
											 	
											obj.cordova.camera.cloneImgToFolder( imguri, function( cloneuri ){ 
												
												collectCloneUri.push( cloneuri )
														
												if( collectCloneUri.length === collectUri.length ){
													
													let dateTimeStart = new Date();
													
													obj.storageCrud({
														dataStorage : "memo",
														type : "add",
														title : scope.encodeStr( inputs[1].value ), 
														text : scope.encodeStr( textareas[0].value ),
														dateStart : dateTimeStart.toLocaleString("id-ID"),
														uri : collectCloneUri,
														label : collectLabel
													}, 
													function(){
														 
														labelCnt.innerHTML = "";
															
														cntImg.innerHTML = "";
														
														closeModalFn();  
														 
														//generate content
														obj.main.memo();
														
														obj.cordova.camera.cleanup();
														
													}) 
													
												}
											});
											 
										})
										
									}
								  
								 } 
								
							})
							
						},
						memoPreview : {
							update: function( params ){
								
								let container = scope.qs("dom-preview"),
								domPreview =function(){
									
									let fragment =  scope.stringToHtml5Template(
										 
										'<div class="body-preview container-swiper-preview "> '+
										'	<div class="swiper-wrapper "> '+
												
												function(){
													 
													let string = "";
													
													params.uriList.forEach(function( uri ){
														
														string+=  '	<div class="swiper-slide" > '+
																  '		<img class="" src="'+ uri +'">'+
																  '	</div> '
													})
													 			
													return string;
													
												}() + 
									
										'	</div>'+
										'</div>'
										
									)
									
									container.innerHTML = "";
									
									container.appendChild( fragment )
								};
								
								
								obj.modal.behaviour.openModalFadeIn("moment-preview");
								
								domPreview();
								
								
								let swiper = new Swiper('.container-swiper-preview', {
									observer: true,
									observeParents: true,
									slidesPerView: 1,
									spaceBetween: 0
								});
								
								scope.text( scope.qs("index-preview"), ( swiper.activeIndex+1 ) +" / "+params.uriList.length );
									  
								swiper.on('slideChange', function () {
										     
									scope.text( scope.qs("index-preview"), ( swiper.activeIndex+1 ) +" / "+params.uriList.length );
									  
								}); 
								 
								
							},
							
							init : function(){
								  
								let	btnBack = scope.qs("moment-preview").querySelector(".back-button");
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout()
								})
							}
						},
						remainderDeleteConfirm : function(){
							let btnBack = scope.qs("modal-remainder-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-remainder-confirm").querySelector(".send-button");
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								 
								obj.modal.behaviour.closeRightToleftFadeout();
									  
							})
							
							/* confirm */
							scope.attachListener( btnConfirm, 'click', function(){
								
								let id = this.getAttribute("label-id");
								
								obj.storageCrud({
									id : id,
									type : "delete",
									dataStorage : "notification"
								},
								function( data ){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											//corodva register notification
											obj.cordova.notification.cancel({
												id: data.cordovaId
											})  
											
											obj.main.remainder();
										}
									});  
									 
								}); 
								 
							})
						},
						remainderDetail : {
							triggerToRemainderDeleteConfirm : function(){
									 
								obj.modal.behaviour.openModalFadeIn("modal-remainder-confirm");
							},
							init : function(){
								
								let self = this,
								btnBack = scope.qs("modal-remainder-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-remainder-detail").querySelector(".send-button");
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout();
									 
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									 
									let el = scope.id( this.getAttribute("label-id") )
									 
									scope.text( scope.qs("remainder-timer-confirm"), el.getAttribute("timer") );
									scope.text( scope.qs("remainder-data-start-confirm"), el.getAttribute("date-start") );
									scope.text( scope.qs("remainder-data-end-confirm"),el.getAttribute("date-end") );
									scope.text( scope.qs("remainder-content-confirm"),el.getAttribute("remainder") );
									scope.text( scope.qs("notify-type-confirm"),el.getAttribute("label-text") );
									 
									obj.modal.behaviour.closeRightToleftFadeout({ 
									
										end :function(){
										
											self.triggerToRemainderDeleteConfirm();
										}
									});								
								})
							}
						},
						remainderNew : function(){
							let self = this,
							inputs = scope.slice( scope.qs("modal-babyremainder").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-babyremainder").querySelector(".input-disabled"),
							textareas = scope.slice( scope.qs("modal-babyremainder").getElementsByTagName("textarea") ),
							checkbox = scope.qs("modal-babyremainder").querySelector(".checkbox"),
							btnBack = scope.qs("modal-babyremainder").querySelector(".back-button"),
							sendBack = scope.qs("modal-babyremainder").querySelector(".send-button"),
							elTimeEnd = scope.qs("modal-babyremainder").querySelector(".modal-static-text"),
							checked = scope.getFirstChild( checkbox ),
							
							closeModalFn = function(){ 
							
								obj.modal.behaviour.closeRightToleftFadeout();
							};
							  
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								closeModalFn();
								
								elTimeEnd && scope.addClass( elTimeEnd, "hidden" );
								
							}) 
							
							 
							/**
								bind modal-input to textarea
							*/
							obj.modalInput.bindToKeyup( textareas[0] );
							 
							 
							/**
								trigger to modal-menu
							*/  
							scope.attachListener( scope.sibling( inputs[0], "next" ), 'click', function(){
								
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-remainder");
								
							})
							
							/**
								send button
							*/
							scope.attachListener( sendBack, 'click', function(){
								 
								if( obj.inputValidate( inputs.concat( textareas ) ) ){
									 
									let dateTimeStart = new Date(),
									dateTimeEnd = scope.stringToDate( inputs[0].getAttribute("selected-date") ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates( dateTimeEnd, dateTimeStart, "day" ),
									timeUnit = scope.timeUnitBetween( dateTimeEnd, dateTimeStart ),
									labelText = inputs[0].getAttribute("label-text"),
									selectedDate = inputs[0].getAttribute("selected-date"),
									stringDate = inputs[0].getAttribute("string-date"),
									loop = inputs[0].getAttribute("loop") === "true" ? true : false,
									text = scope.encodeStr( textareas[0].value ),
									timer = function(){
										return ( totalDays !== 0 ?  totalDays - 1 : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
									};
									   
									 
									obj.storageCrud({
										dataStorage : "notification",
										type : "add",
										reminder : text,
										timer : timer(),
										labelText : labelText,
										dateStart : dateTimeStart.toLocaleString("id-ID"),
										dateEnd : dateTimeEnd.toLocaleString("id-ID"),
										stringDate : stringDate,
										loop : loop
									},
									function( objNotify ){
											 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												 
												//generate content
												obj.main.remainder();
												 
												//corodva register notification
												obj.cordova.notification.schedule({
													id: objNotify.cordovaId,
													text : text,
													trigger : dateTimeEnd,
													stringDate : stringDate,
													loop : loop
												}) 
												 
												
												scope.addClass( elTimeEnd, "hidden" );
											}
										});	 	
											  
									})
									  
								}
								 
							})
							
						},
						trackerDeleteConfirm : function(){
							let btnBack = scope.qs("modal-tracker-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-tracker-confirm").querySelector(".send-button");
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								 
								obj.modal.behaviour.closeRightToleftFadeout(); 
							})
							
							/* confirm */
							scope.attachListener( btnConfirm, 'click', function(){
								
								let id = this.getAttribute("label");
								
								obj.storageCrud({
									id : id,
									type : "delete",
									dataStorage : "tracker"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.main.tracker(); // update
										}
									}); 
									
								}); 
								 
								
							})
						},
						trackerDetail : function(){
							let btnBack = scope.qs("modal-tracker-detail").querySelector(".back-button"),
							deleteBack = scope.qs("modal-tracker-detail").querySelector(".send-button");
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								 
								obj.modal.behaviour.closeRightToleftFadeout();
							})
							
							/*
								delete
							**/
							scope.attachListener( deleteBack, 'click', function(){
								
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.modal.behaviour.openModalFadeIn("modal-tracker-confirm");
									}
								});
								 
							})
						},
						trackerNew :{
							isFirstLoad : true,
							selectTarget : "",
							selectId : "",
							selectButton : "",
							selectIsRunning : "",
							selectIsUnit : "",
							selectUnit : "",
							selectUnitShort : "",
							selectIcon : "",
							activitySelect : "",
							init : function(){
								
								let self = this,
								modal = scope.qs("modal-tracker-new"),
								btnBack = modal.querySelector(".back-button"),
								deleteBack = modal.querySelector(".send-button"),
								hiddenModalFn = function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();
								},
								swiper = new Swiper('.preg-activity', {
									observer: true,
									observeParents: true, 
									pagination: {
										el: '.swiper-pagination',
										dynamicBullets: true,
									},
									initialSlide: obj.dataStorage.layoutState.trackerCategorySwiper.index
								}); 
								 
								swiper.on('transitionEnd', function () {
										
									var activeSlide = scope.qs("preg-activity").querySelector(".swiper-slide-active"),
									title = activeSlide.getAttribute("label"),
									titleCategory = activeSlide.getAttribute("label-category");
									 
									scope.text( scope.qs( "track-title" ), title );
									 
									scope.text( scope.qs( "add-track-title" ), title );
									 
									scope.qs( "add-track-title" ).setAttribute("label-category", titleCategory )
   
									obj.storageState({ 
										storageState : "layoutState",
										objState : "trackerCategorySwiper",
										value : {
											title : title,
											index : swiper.activeIndex,
											target : scope.qs("add-track-title").getAttribute("label-category")
										}
									},
									function(){}) 
									  
								}); 
								 
								 
								self.update(); 
								 
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									hiddenModalFn();
								})  
								
								
								/**
									hide right dot buttons when user touch outside element
								*/
								scope.attachListener( modal, scope.CursorStartEvent, function(e){ 
									
									let pos = scope.mousePosition['value'].pos.mousemove,
									bodyBound = document.getElementsByTagName("body")[0].getBoundingClientRect();
								 
									scope.slice( modal.querySelectorAll(".todo-dot-child-menu") ).forEach(function( btnChildRight ){
										
										let bound = btnChildRight.getBoundingClientRect(),
										isVisble = bound.height;
										
										if( isVisble ){
											 
											var target = (e && e.target) || (event && event.srcElement),
											needHide = true;

											while (target.parentNode) {

												if (target ==  btnChildRight ) {
													needHide = false;
													break;
												}
												target = target.parentNode;
											}
											 
											needHide && scope.addClass( btnChildRight,  "hidden" )
											
										}
									})	
								 
								});
								 
								  
								/*
									save
								**/
								scope.attachListener( deleteBack, 'click', function(){
									 
									if( !self.selectButton || !self.selectIcon ){
										  
										//select radio button first 

										obj.modalMenu.behaviour.openModalFadeIn("modal-menu-tracker-unselect");
									 
									}else{
										
										let activityType = obj.dataStorage.layoutState.trackerCategorySwiper.title,
										radioButtons = scope.slice( modal.querySelectorAll(".checked") ),
										selectButton = scope.slice( modal.querySelectorAll(".select") )[0];
											
										obj.storageCrud({ 
											updateTable : "multiple",
											tableGroup :{
												tableA : {
													dataStorage : "tracker-category",
													target : self.selectTarget,
													id : self.selectId,
													latestDate : ( new Date() ).toLocaleString("id-ID"),
													type : "update"
												},
												tableB : {
													dataStorage : "tracker",
													type : "add",
													activityType : activityType,
													activitySelect : self.activitySelect,
													dateStart : ( new Date() ).toLocaleString("id-ID"),
													dateEnd : "",
													running : self.selectIsRunning,
													isUnit : self.selectIsUnit,
													unit : self.selectUnit,
													unitShort : self.selectUnitShort,
													icon : self.selectIcon
												}
											}
											
											
										},
										function(){ 
											  
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){
													
													obj.modal.trackerNew.update();
													
													obj.main.tracker();
											 
													//clean
													self.selectButton = "";
													
													radioButtons.map(function( objRadio ){
														
														objRadio.remove();
													}); 
													
													selectButton.className = "";
												}
											});	 
												 
										  
										});
										
										
										
										 
									}
									
								}) 
								
							},
							update :function(){
								
								let self = this,
								modal = scope.qs("modal-tracker-new"),
								menuBtnCnt = scope.slice( modal.querySelectorAll(".swiper-slide") ),
								radioButtons = scope.slice( modal.querySelectorAll(".radio-button") ),
								
								data = obj.dataStorage.trackerCategory,
								container = scope.slice( scope.qs("modal-tracker-new ").querySelectorAll(".swiper-slide") ),
								contentDom = function( params ){ 
									 
									let fragment = scope.stringToHtml5Template(
										'<li class="pt0 pb0 pr10 p20" is-unit ="'+ params.isUnit +'" unit="'+ params.unit +'"  unit-short="'+ params.unitShort +'"  is-running="'+ params.isRunning +'" activitySelect="'+ params.name +'" label-id="'+ params.id +'"> '+
										'	<ul class="list-inline ">'+
										'		<li class="modal-list left">' +
										'			<div class="container-radio centerdiv">'+ 
										'			</div>'+
										'		</li>'+
												
										'		<li class="modal-list right">'+
										'			<ul class="list-inline modal-list-container centerdiv">'+
										'				<li class="semibold"> '+
														params.name +
										'				</li>'+
										'				<li class="light"> Terakhir, '+
														params.latestDate +
										'				</li>'+
										'			</ul>'+
										'			<div class="todo-dot-menu">'+
										'				<div class="todo-dot-cnt-icon menu-dot-icon"></div>'+
										'				<div class="todo-dot-child-menu hidden" label-id="'+ params.id +'" target="'+ params.target +'" > Hapus </div>'+
										'			</div>'+
										'		</li>'+
										'	</ul>'+
										'</li>'
									);
									
									params.container.appendChild( fragment )
															 
										
									/**
										<li> 
											<ul class="list-inline ">
												<li class="modal-list left"> 
													<div class="container-radio centerdiv">
														<div class="checked centerdiv"></div>
													</div>
												</li>
												
												<li class="modal-list right"> 
													<ul class="list-inline modal-list-container centerdiv">
														<li class="semibold"> 
															Melakukan aktifitas YOGA
														</li>
														<li class="light"> 
															Terakhir - Jumat, 21 Aug 2019
														</li>
													</ul>
													<div class="todo-dot-menu">
														<div class="todo-dot-cnt-icon menu-dot-icon"></div>
														<div class="todo-dot-child-menu hidden"> Hapus </div>
													</div>
												</li>
											</ul>
										</li>
									*/
								},
								dataNoteFn = function( dataNote, containerEl, target ){
									 
									let name = dataNote.name,
									id = dataNote.id,
									strDate = dataNote.latestDate, 
									latestDate = !strDate ? "Belum ada" : scope.dateToYMD( scope.stringToDate( dataNote.latestDate ), "year" );
									
									contentDom({
										name : name,
										isRunning : dataNote.isRunning,
										isUnit : dataNote.isUnit,
										unit : dataNote.unit,
										unitShort : dataNote.unitShort,
										latestDate : latestDate,
										container : containerEl,
										id : dataNote.id,
										target : target
									})  
									
								};
								
								self.selectButton = "";
								self.selectIsRunning = "";
								self.selectIsUnit = "";
								self.selectUnit = "";
								self.selectUnitShort = "";
								self.selectIcon = "";
								self.activitySelect = "";
	 
								//load content
								container.forEach(function( objEl ){ scope.getFirstChild( objEl ).innerHTML = "" })
								
								let indexEl = 0;
								
								for( let ii in data ){
									 
									let cntEmpty = scope.getLastChild( container[ indexEl ] ),
									cntEl = scope.getFirstChild( container[ indexEl ] ),
									dataCat = data[ii];
									
									dataCat.forEach( function( dataNote, index ){
										
										dataNoteFn( dataNote, cntEl, ii );   
									})	
									 
									scope[  dataCat.length ? "removeClass" : "addClass" ]( cntEl,  "hidden" )
									scope[  dataCat.length ? "addClass" : "removeClass" ]( cntEmpty, "hidden" )
	  
									indexEl++
									
								}
								  
								/**
									attach radio buttons to click event
								*/
								menuBtnCnt.forEach(function( objCnt ){
									
									let objBtnLi = scope.slice( objCnt.querySelectorAll( ".border-none > li" ) );
									 
									objBtnLi.forEach(function( objLi ){ 
									 
										scope.attachListener( objLi, 'click', function( e ){
											 
											let fragment = scope.stringToHtml5Template(
												'<div class="checked centerdiv"></div>'
											),
											elSelect = modal.querySelector(".select"),
											elChecked = modal.querySelector(".checked"),
											elRadio = this.querySelector(".container-radio"),
											parent = scope.nthParent( this, 2 );
											
											elChecked && modal.querySelector(".checked").remove();	
												 
											elSelect && ( elSelect.className = "pt0 pb0 pr10 p20" );
												 
											scope.addClass( this, "select" )	 
												 
											elRadio && elRadio.appendChild( fragment )

											self.activitySelect = this.getAttribute("activitySelect") 
											 
											self.selectIcon = parent && parent.getAttribute("label-icon")
											 
											self.selectIsRunning =  this.getAttribute("is-running") === "true" ? true : false;
											 
											self.selectIsUnit =  this.getAttribute("is-unit") === "true" ? true : false;
											 
											self.selectUnit =  this.getAttribute("unit");
											  
											self.selectUnitShort =  this.getAttribute("unit-short");
											
											self.selectButton = true; 
											
											self.selectTarget = obj.dataStorage.layoutState.trackerCategorySwiper.target;
											
											self.selectId = this.getAttribute("label-id");
											
											
										}) 
									})
								})
								
								
								/**
									attach right dot buttons to click event
								*/
								menuBtnCnt.forEach(function( objCnt ){
									
									let objRightBtn = scope.slice( objCnt.querySelectorAll( ".todo-dot-menu" ) );
									 
									objRightBtn.forEach(function( objBtn ){ 
									 
										scope.attachListener( objBtn, 'click', function(){
											  
											scope.slice( modal.querySelectorAll(".todo-dot-child-menu") ).forEach(function( btnChildRight ){
											 
												scope.addClass( btnChildRight, "hidden" )
											})	
												  
											scope.removeClass( scope.getLastChild( this ), "hidden" )
												  
										}) 
									})
								})
								  
								/**
									delete element
								*/
								scope.slice( modal.querySelectorAll(".todo-dot-child-menu") ).forEach(function( btnChildRight ){
									
									scope.attachListener( btnChildRight, 'click', function(){
										 
										let target = this.getAttribute("target"),
										id = this.getAttribute("label-id");
										 
										obj.storageCrud({ 
											dataStorage : "tracker-category",
											target : target,
											id : id,
											type : "delete"
										},
										function(){ 
											
											
											//self update
											obj.modal.trackerNew.update();
											
											self.selectButton = "";
										  
										}); 
										
									})  
								})	  
								
								   
							}
						},
						trackerCategoryNew : function(){
							let modal = scope.qs("modal-tracker-cat-new"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							triggerBtn = scope.qs("modal-tracker-new").querySelector(".btn-main-new"),
							input = scope.slice( modal.getElementsByTagName("input") ),
							checkboxParent = scope.slice( modal.querySelectorAll(".border-none > li") ),
							runningCheck = false,
							unitCheck = false;
							
							scope.attachListener( triggerBtn, 'click', function(){
								  
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.modal.behaviour.openModalFadeIn("modal-tracker-cat-new"); 
									}
								});   
								  
							}) 
							
							/**
								bind modal-textarea to inputs
							*/
							obj.modalInput.bindToKeyup( input[0], "textarea" );
							
							obj.modalInput.bindToKeyup( input[1], "textarea" );
							
							obj.modalInput.bindToKeyup( input[2], "textarea" );
							
							
							/*checkbox*/
							checkboxParent.forEach(function( liEl, index ){
								
								scope.attachListener( liEl, 'click', function( e ){
									 
									if( /p|input/i.test( e.target.nodeName ) ) return;
								  
									let checkedEl = this.querySelector(".container-checkbox > div")
									
									if( /checked/i.test( checkedEl.className ) ){
										
										scope.removeClass( checkedEl, "checked");
										
										console.log( index )
										
										if( index === 0 ) runningCheck = false;
										if( index === 1 ) unitCheck = false;
										
									}else{
										
										scope.addClass( checkedEl, "checked");
										
										if( index === 0 ) runningCheck = true;
										if( index === 1 ) unitCheck = true;
									}
									
								})
							})
							
							
							/*
								save
							**/
							scope.attachListener( btnSend, 'click', function(){
								  
								let target = scope.qs( "add-track-title" ).getAttribute("label-category") 
								   
								if( ( unitCheck ? 
									obj.inputValidate( [ input[0], input[1], input[2] ] ) : 
									obj.inputValidate( [ input[0] ] ) ) ){  
									   
									obj.storageCrud({ 
										dataStorage : "tracker-category",
										target : target,
										type : "add", 
										dateStart : ( new Date() ).toLocaleString("id-ID"),
										name : scope.encodeStr( input[0].value ),
										isRunning : runningCheck,
										isUnit : unitCheck,
										unit : scope.encodeStr( input[1].value ),
										unitShort : scope.encodeStr( input[2].value ),
									},
									function(){
									 
										obj.modal.trackerNew.update();
									 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												obj.modal.behaviour.openModalFadeIn("modal-tracker-new"); 
											}
										});
									 
									}); 
									
								}
							}) 
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.modal.behaviour.openModalFadeIn("modal-tracker-new"); 
									}
								});
								
							})
								
							 
							
							 
						},
						trackerChart : function( initial ){
							let btnBack = scope.qs("modal-tracker-chart").querySelector(".back-button");
							/*
								close
							**/
							if( !initial ){ //first load
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									
								});
							}
							
								
						},
						wfageDeleteConfirm : {
							init : function(){
								let btnBack = scope.qs("modal-wfa-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-wfa-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout(); 
									 
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "wfa"
									},
									function(){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												obj.chart.weightForAge.init(); // update
									
												obj.chart.weightForAge.create(); // update
											}
										}); 
									 
									}); 
									 
									
								})
							}
						},
						wfageNew : function(){
							
							let self = this,
							datepickerWfa = scope.qs("plugin-datepicker-wfa"),
							pluginBack = datepickerWfa.querySelector(".back-button"),
							pluginSend = datepickerWfa.querySelector(".send-button"),
							btnBack = scope.qs("modal-weightforage").querySelector(".back-button"),
							btnSend = scope.qs("modal-weightforage").querySelector(".send-button"),
							inputs = scope.slice( scope.qs("modal-weightforage").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-weightforage").querySelector(".input-disabled"),
							hiddenPluginDateFn = function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
								 
							},
							showPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-wfa");
								  
							},
							showModalFn = function(){  
								   
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-wfa");
								  
							},
							dateSelect, weekTo, pregDateStart, pregDateEnd;
							 
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								hiddenPluginDateFn();
							})
							 
							 
							/*
								close modal
							**/
							scope.attachListener( btnBack, 'click', function(){
								 
								obj.modal.behaviour.closeRightToleftFadeout();  
								   
							})
							 
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							 
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
							  
								showPluginDateFn();
							 
								if( self.state.wfage ){
									  
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerWfa.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-wfa"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										let objData = obj.chart.requireDataObject({
											dateSelect : dateSelect
										});
										 
										pregDateEnd = objData.pregDateEnd;
										
										pregDateStart = objData.pregDateStart;
										  
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										hiddenPluginDateFn();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-wfa",
										fn : function(){
											 
											scope.text( scope.qs("select-date-wfa"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									 
									//execute once 
									self.state.wfage = false;
								}
							
							})
						
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									
									weekTo = parseInt( scope.encodeStr( inputs[0].value ) );
									  
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "wfa",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
											   
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 22 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 22 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											  
											
										}else if( !isWeekToRecorded ){ 
										  
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "wfa",
												weekTo : weekTo,
												weight :  scope.encodeStr( inputs[1].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
												
												//update obj.dataStorage
												obj.chart.weightForAge.init();
												
												//reupdate chart 
												obj.chart.weightForAge.create();
												
												obj.modal.behaviour.closeRightToleftFadeout();  
												
											}); 
											
										}else if( isWeekToRecorded ){
											 
											scope.text( scope.qs("wfa-week-to"), weekTo )
											
											//store to wfaState
											obj.storageState({ 
												noUpdateFileSource : true,
												storageState : "wfaState",
												objState : "wfaUpdate",
												value : { 
													type : "update-weekto", 
													dataStorage : "wfa",
													weekTo : weekTo,
													weight :  scope.encodeStr( inputs[0].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												 
												showModalFn();
											}) 
											
											
										} 
									});	 
								}
							})
						
						},
						wfageDetail : {
							init : function(){
								
								let btnBack = scope.qs("modal-wfa-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-wfa-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();  
									
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											obj.modal.behaviour.openModalFadeIn("modal-wfa-confirm");
										}
									});   
								})
							}
						},
						bpdageDeleteConfirm : {
							init : function(){
								let btnBack = scope.qs("modal-bpd-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-bpd-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									 
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "bpd"
									},
									function(){
										 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												obj.chart.bpdForAge.init(); // update
										
												obj.chart.bpdForAge.create(); // update
											}
										}); 
											  
									}); 
									 
								})
							}
						},
						bpdageNew : function(){
							
							let self = this,
							datepickerBpd = scope.qs("plugin-datepicker-bpd"),
							pluginBack = scope.qs("plugin-datepicker-bpd").querySelector(".back-button"),
							pluginSend = scope.qs("plugin-datepicker-bpd").querySelector(".send-button"),
							modalBpd = scope.qs("modal-bpdforage"),
							btnBack = modalBpd.querySelector(".back-button"),
							btnSend = modalBpd.querySelector(".send-button"),
							inputs = scope.slice( modalBpd.getElementsByTagName("input") ),
							inputCover = modalBpd.querySelector(".input-disabled"),
							hiddenPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.closeFadeout();
								 
							},
							showPluginDateFn = function(){
								
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-bpd");
								  
							},
							hiddenModal = function(){
								
								obj.modal.behaviour.closeRightToleftFadeout(); 
								 
							},
							showModalMenuFn = function(){ 
								   
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-bpd");
								
							},
							dateSelect, monthTo, birthDateEnd;
							 
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								hiddenPluginDateFn();
							})
							 
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								 
								hiddenModal();
							})
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
								
								showPluginDateFn();
							 
								if( self.state.bpd ){
									  
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerBpd.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-bpd"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										let objData = obj.chart.requireDataObject({
											dateSelect : dateSelect
										});
										 
										pregDateEnd = objData.pregDateEnd;
										
										pregDateStart = objData.pregDateStart;
										
										//weekTo = parseInt( obj.chart.bpdForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										hiddenPluginDateFn();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-bpd",
										fn : function(){
											 
											scope.text( scope.qs("select-date-bpd"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									 
									  
									//execute once 
									self.state.bpd = false;
								}
							})
							 
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									 
									let bpd = parseFloat( inputs[1].value ),
									 
									weekTo = parseInt( scope.encodeStr( inputs[0].value ) );
									  
									 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "bpd",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
									 	
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 14 || weekTo > 60 ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 14 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
											   
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "bpd",
												weekTo : weekTo,
												bpd : bpd.toFixed( 2 ),
												dateSelect : dateSelect,
												dateStart : new Date()
											}, 
											function(){
												 
												obj.modal.behaviour.closeRightToleftFadeout({
													end : function(){
														
														//update obj.dataStorage
														obj.chart.bpdForAge.init();
														
														//reupdate chart 
														obj.chart.bpdForAge.create();
														 
													}
												}) 
												
											});
											
											
										}else if( isWeekToRecorded ){
									 
											scope.text( scope.qs("bpd-week-to"), weekTo )
											
											//store to wfaState
											obj.storageState({ 
												noUpdateFileSource : true,
												storageState : "bpdState",
												objState : "bpdUpdate",
												value : { 
													type : "update-weekto", 
													dataStorage : "bpd",
													weekTo : weekTo,
													bpd : bpd.toFixed( 2 ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												
												showModalMenuFn();
												
												hiddenModal();
											})  
											 
										}
										
									});	
										
								}
							})
							
						},
						bpdageDetail : {
							init : function(){
								
								let btnBack = scope.qs("modal-bpd-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-bpd-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											obj.modal.behaviour.openModalFadeIn("modal-bpd-confirm");
										}
									})
									 
									
								})
							}
						},
						hcageDeleteConfirm : { 
							init : function(){
								let btnBack = scope.qs("modal-hc-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-hc-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();
									
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "hc"
									},
									function(){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												obj.chart.hcForAge.init(); // update
											
												obj.chart.hcForAge.create(); // update
												
											}
										});
										 
									});  
								})
							}
						},
						hcageNew : function(){
							
							let self = this,
							datepickerHc = scope.qs("plugin-datepicker-hc"),
							pluginBack = datepickerHc.querySelector(".back-button"),
							pluginSend = datepickerHc.querySelector(".send-button"),
							modalHc = scope.qs("modal-hcforage"),
							btnBack = modalHc.querySelector(".back-button"),
							btnSend = modalHc.querySelector(".send-button"),
							inputs = scope.slice( modalHc.getElementsByTagName("input") ),
							inputCover = modalHc.querySelector(".input-disabled"),
							hiddenPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.closeFadeout();
								  
							},
							showPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-hc");
								 
							},
							hiddenModal = function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();
								 
							},
							showModalMenuFn = function(){ 
								   
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-hc");
								
							},
							dateSelect, monthTo, birthDateEnd;
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								hiddenPluginDateFn();
							})
							 
							 
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								hiddenModal();
							}) 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
										
								showPluginDateFn();
									
								if( self.state.hcage ){
									
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerHc.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-hc"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										let objData = obj.chart.requireDataObject({
											dateSelect : dateSelect
										});
										 
										pregDateEnd = objData.pregDateEnd;
										
										pregDateStart = objData.pregDateStart;
										 
										//weekTo = parseInt( obj.chart.hcForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										hiddenPluginDateFn();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-hc",
										fn : function(){
											 
											scope.text( scope.qs("select-date-hc"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.hcage = false;
								}
							
							})
							
							
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									 
									let weekTo = parseInt( scope.encodeStr( inputs[0].value ) );
									  
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "hc",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 14 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 14 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "hc",
												weekTo : weekTo,
												hc :  scope.encodeStr( inputs[1].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											}, 
											function(){
														 		
												obj.modal.behaviour.closeRightToleftFadeout({
													end : function(){
																
														//update obj.dataStorage
														obj.chart.hcForAge.init();
														
														//reupdate chart 
														obj.chart.hcForAge.create();
													}
												});
												   
											});
											
										}else if( isWeekToRecorded ){
											 
											scope.text( scope.qs("hc-week-to"), weekTo )
											
											//store to wfaState
											obj.storageState({ 
												noUpdateFileSource : true,
												storageState : "hcState",
												objState : "hcUpdate",
												value : { 
													type : "update-weekto", 
													dataStorage : "hc",
													weekTo : weekTo,
													hc :  scope.encodeStr( inputs[1].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												
												showModalMenuFn();
												
												hiddenModal();
												
											})  	
										}
										 
									});	 	
								}
							})
							
						},
						hcageDetail : { 
							init : function(){
								
								let btnBack = scope.qs("modal-hc-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-hc-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();
							
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("modal-hc-confirm")
										}
									})
									 
								})
							}
						},
						acNew : function(){
							
							let self = this,
							datepickerAc = scope.qs("plugin-datepicker-ac"),
							pluginBack = datepickerAc.querySelector(".back-button"),
							pluginSend = datepickerAc.querySelector(".send-button"),
							modalAc = scope.qs("modal-ac"),
							btnBack = modalAc.querySelector(".back-button"),
							btnSend = modalAc.querySelector(".send-button"),
							inputs = scope.slice( modalAc.getElementsByTagName("input") ),
							inputCover = modalAc.querySelector(".input-disabled"),
							hiddenPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.closeFadeout();
								 
							},
							showPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-ac");
								 
							},
							hiddenModal = function(){
								 
								obj.modal.behaviour.closeRightToleftFadeout();
								  
							},
							showModalMenuFn = function(){ 
								   
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-ac");
								 
							},
							dateSelect, monthTo, birthDateEnd;
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								hiddenPluginDateFn();
							})
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								hiddenModal()
							}) 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
								
								showPluginDateFn();	
								
								if( self.state.acAge ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerAc.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-ac"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										let objData = obj.chart.requireDataObject({
											dateSelect : dateSelect
										});
										 
										pregDateEnd = objData.pregDateEnd;
										
										pregDateStart = objData.pregDateStart;
										 
										//weekTo = parseInt( obj.chart.acForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										hiddenPluginDateFn();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-ac",
										fn : function(){
											 
											scope.text( scope.qs("select-date-ac"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.acAge = false;
								}
							
							})
							
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									 
									let weekTo = parseInt( scope.encodeStr( inputs[0].value ) );
									 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "ac",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 14 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 14 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "ac",
												weekTo : weekTo,
												ac :  scope.encodeStr( inputs[1].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
												
												obj.modal.behaviour.closeRightToleftFadeout({
													end : function(){
														  
														obj.chart.acForAge.init();
														
														//reupdate chart 
														obj.chart.acForAge.create();

													}
												});	  
												
											});
											
										}else if( isWeekToRecorded ){
											
											scope.text( scope.qs("ac-week-to"), weekTo )
											
											//store to wfaState
											obj.storageState({ 
												noUpdateFileSource : true,
												storageState : "acState",
												objState : "acUpdate",
												value : { 
													type : "update-weekto", 
													dataStorage : "ac",
													weekTo : weekTo,
													ac :  scope.encodeStr( inputs[1].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												
												showModalMenuFn();
												
												hiddenModal();
											}) 
											 
										}
										 
									});	
									
										
								}
							})
							
							
						},
						acDeleteConfirm : {
							init : function(){
								let btnBack = scope.qs("modal-ac-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-ac-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "ac"
									},
									function(){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											
											end : function(){
												
												obj.chart.acForAge.init(); // update
												
												obj.chart.acForAge.create(); // update
												
												
											}
										});
										  
									}); 
									
								})
							}
						},
						acDetail : {
							init : function(){
								
								let btnBack = scope.qs("modal-ac-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-ac-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();
						   
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("modal-ac-confirm");
										}
									});
						   
								})
							}
						},
						flhDeleteConfirm : {
							init : function(){
								let btnBack = scope.qs("modal-flh-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-flh-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									 
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "flh"
									},
									function(){
											 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
													 
												obj.chart.flhForAge.init(); // update
												
												obj.chart.flhForAge.create(); // update
												
											}
										}); 
									 
									});  
								})
							}
						},
						flhDetail : {
							init : function(){
								
								let btnBack = scope.qs("modal-flh-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-flh-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									 
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											obj.modal.behaviour.openModalFadeIn( "modal-flh-confirm"); 
										}
									});  
									
								})
							}
						},
						flhNew : function(){
							
							let self = this,
							datepickerFlh = scope.qs("plugin-datepicker-flh"),
							pluginBack = datepickerFlh.querySelector(".back-button"),
							pluginSend = datepickerFlh.querySelector(".send-button"),
							modalFlh = scope.qs("modal-flh"),
							btnBack = modalFlh.querySelector(".back-button"),
							btnSend = modalFlh.querySelector(".send-button"),
							inputs = scope.slice( modalFlh.getElementsByTagName("input") ),
							inputCover = modalFlh.querySelector(".input-disabled"),
							hiddenPluginDateFn = function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
								 
							},
							showPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-flh");
								 
							},
							hiddenModal = function(){
							
								obj.modal.behaviour.closeRightToleftFadeout()
								  
							},
							showModalMenuFn = function(){ 
								   
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-flh");
								 
							},
							dateSelect, monthTo, birthDateEnd;
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								hiddenPluginDateFn();
							})
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								hiddenModal();
							}) 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
								
								showPluginDateFn();	
									
								if( self.state.flh ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerFlh.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-flh"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										let objData = obj.chart.requireDataObject({
											dateSelect : dateSelect
										});
										 
										pregDateEnd = objData.pregDateEnd;
										
										pregDateStart = objData.pregDateStart;
										 
										//weekTo = parseInt( obj.chart.flhForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										hiddenPluginDateFn();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-flh",
										fn : function(){
											 
											scope.text( scope.qs("select-date-flh"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.flh = false;
								}
							
							})
							
							
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									 
									let weekTo = parseInt( scope.encodeStr( inputs[0].value ) );
									 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "flh",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 14 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 14 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "flh",
												weekTo : weekTo,
												flh :  scope.encodeStr( inputs[1].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
													
												//update obj.dataStorage
												obj.chart.flhForAge.init();
												
												//reupdate chart 
												obj.chart.flhForAge.create();
 
												hiddenModal();
											});
											
										}else if( isWeekToRecorded ){
											 
											scope.text( scope.qs("flh-week-to"), weekTo )
											
											//store to flhUpdate
											obj.storageState({ 
												noUpdateFileSource : true,
												storageState : "flhState",
												objState : "flhUpdate",
												value : { 
													type : "update-weekto", 
													dataStorage : "flh",
													weekTo : weekTo,
													flh :  scope.encodeStr( inputs[1].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												 
												showModalMenuFn();
												
												hiddenModal();
											}) 
											
										}
										
									});	
									
										
								}
							})
							
						},
						ofdDeleteConfirm : {
							init : function(){
								let btnBack = scope.qs("modal-ofd-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-ofd-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									 
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "ofd"
									},
									function(){
											 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
													 
												obj.chart.ofdForAge.init(); // update
												
												obj.chart.ofdForAge.create(); // update
												
											}
										}); 
									 
									});  
								})
							}
						},
						ofdDetail : {
							init : function(){
								
								let btnBack = scope.qs("modal-ofd-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-ofd-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									 
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											obj.modal.behaviour.openModalFadeIn( "modal-ofd-confirm"); 
										}
									});  
									
								})
							}
						},
						ofdNew : function(){
							
							let self = this,
							datepickerOfd = scope.qs("plugin-datepicker-ofd"),
							pluginBack = datepickerOfd.querySelector(".back-button"),
							pluginSend = datepickerOfd.querySelector(".send-button"),
							modalOfd = scope.qs("modal-ofd"),
							btnBack = modalOfd.querySelector(".back-button"),
							btnSend = modalOfd.querySelector(".send-button"),
							inputs = scope.slice( modalOfd.getElementsByTagName("input") ),
							inputCover = modalOfd.querySelector(".input-disabled"),
							hiddenPluginDateFn = function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
								 
							},
							showPluginDateFn = function(){
								 
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-ofd");
								 
							},
							hiddenModal = function(){
							
								obj.modal.behaviour.closeRightToleftFadeout()
								  	 
							},
							showModalMenuFn = function(){ 
								   
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-ofd");
								 
							},
							dateSelect, monthTo, birthDateEnd;
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								hiddenPluginDateFn();
							})
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								hiddenModal();
							}) 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
								
								showPluginDateFn();	
									
								if( self.state.ofd ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerOfd.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-ofd"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										let objData = obj.chart.requireDataObject({
											dateSelect : dateSelect
										});
										 
										pregDateEnd = objData.pregDateEnd;
										
										pregDateStart = objData.pregDateStart;
										 
										//weekTo = parseInt( obj.chart.ofdForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										hiddenPluginDateFn();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-ofd",
										fn : function(){
											 
											scope.text( scope.qs("select-date-ofd"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.ofd = false;
								}
							
							})
							 
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
																		 
									let weekTo = parseInt( scope.encodeStr( inputs[0].value ) );
									 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "ofd",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 14 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 14 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "ofd",
												weekTo : weekTo,
												ofd :  scope.encodeStr( inputs[1].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
													
												//update obj.dataStorage
												obj.chart.ofdForAge.init();
												
												//reupdate chart 
												obj.chart.ofdForAge.create();
 
												hiddenModal();
											});
											
										}else if( isWeekToRecorded ){
											
											scope.text( scope.qs("ofd-week-to"), weekTo )
											
											//store to ofdUpdate
											obj.storageState({ 
												noUpdateFileSource : true,
												storageState : "ofdState",
												objState : "ofdUpdate",
												value : { 
													type : "update-weekto", 
													dataStorage : "ofd",
													weekTo : weekTo,
													ofd :  scope.encodeStr( inputs[1].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												 
												showModalMenuFn();
												
												hiddenModal();
											}) 
											
										}
										
									});	
									
										
								}
							})
							
						},
						pregRegister : { 
							hphtState : true,
							usgState : true,
							cpcState : true,
							type : {
								text : "Untuk saya sendiri",
								label : 1
							},
							params : {
								hpht : {
									date : "",
									totDays : ""
								},
								usg : {
									date : "",
									days : "",
									weeks : "",
									totDays : ""
								},
								conception : {
									date : ""
								}
							},
							pluginDatePickerCPC : function( inputCover ){
								
								let self = this,
								modalPluginCpc = scope.qs("plugin-datepicker-cpc"),
								pluginBack = modalPluginCpc.querySelector(".back-button"),
								pluginSend = modalPluginCpc.querySelector(".send-button");
								
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){
								    
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-cpc");
								   
									if( self.cpcState ){
										  
										 /*attach button*/
										let objInput = inputCover.querySelector("input"),
										datepickerCpc = scope.qs("datepicker-cpc"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerCpc.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											let pickDate = new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
											self.params.conception.date = pickDate.toLocaleString("id-ID");
											 
											return pickDate;
											
										};
										
										scope.text( scope.qs("select-date-cpc"), scope.dateToYMD( new Date(), "year") )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											dateSelect = selectDateFn();
											 
											objInput.value = scope.dateToYMD( dateSelect, "year" );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										
										/**
											close plugin date
										*/
										scope.attachListener( pluginBack, 'click', function(){
											
											obj.modalPlugin.behaviour.closeFadeout();
										})
										
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-cpc",
											fn : function(){
												 
												scope.text( scope.qs("select-date-cpc"), scope.dateToYMD( selectDateFn(), "year") );
												 
											}
										}) 
										
										//execute once 
										self.cpcState = false;
									} 
								})
							},
							pluginDatePickerUSG : function( inputCover ){
								
								let self = this,
								modalPluginUsg = scope.qs("plugin-datepicker-usg"),
								pluginBack = modalPluginUsg.querySelector(".back-button"),
								pluginSend = modalPluginUsg.querySelector(".send-button");
								
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){
								    
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-usg");
								   
									if( self.usgState ){
										  
										 /*attach button*/
										let objInput = inputCover.querySelector("input"),
										datepickerUsg = scope.qs("datepicker-usg"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerUsg.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											let pickDate = new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
											self.params.usg.date = pickDate.toLocaleString("id-ID");
											 
											return pickDate;
											
										};
										
										scope.text( scope.qs("select-date-usg"), scope.dateToYMD( new Date(), "year") )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											dateSelect = selectDateFn();
											 
											objInput.value = scope.dateToYMD( dateSelect, "year" );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										
										/**
											close plugin date
										*/
										scope.attachListener( pluginBack, 'click', function(){
											
											obj.modalPlugin.behaviour.closeFadeout();
										})
										
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-usg",
											fn : function(){
												 
												scope.text( scope.qs("select-date-usg"), scope.dateToYMD( selectDateFn(), "year") );
												 
											}
										}) 
										
										//execute once 
										self.usgState = false;
									} 
								})
							},
							pluginDatePickerHPHT : function( inputCover ){
								
								let self = this,
								modalPluginHpht = scope.qs("plugin-datepicker-hpht"),
								pluginBack = modalPluginHpht.querySelector(".back-button"),
								pluginSend = modalPluginHpht.querySelector(".send-button");
								
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){
								    
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-hpht");
								   
									if( self.hphtState ){
										  
										 /*attach button*/
										let objInput = inputCover.querySelector("input"),
										datepickerHpht = scope.qs("datepicker-hpht"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerHpht.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											let pickDate = new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
											self.params.hpht.date = pickDate.toLocaleString("id-ID");
											 
											return pickDate;
											
										};
										
										scope.text( scope.qs("select-date-hpht"), scope.dateToYMD( new Date(), "year") )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											dateSelect = selectDateFn();
											 
											objInput.value = scope.dateToYMD( dateSelect, "year" );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										
										/**
											close plugin date
										*/
										scope.attachListener( pluginBack, 'click', function(){
											
											obj.modalPlugin.behaviour.closeFadeout();
										})
										
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-hpht",
											fn : function(){
												 
												scope.text( scope.qs("select-date-hpht"), scope.dateToYMD( selectDateFn(), "year") );
												 
											}
										}) 
										
										//execute once 
										self.hphtState = false;
									} 
								})
							},
							pluginCircleDays : function( inputCover ){
								
								//circle days 
								let self = this,
								modalPluginCdays = scope.qs("plugin-datepicker-circle-days"),
								datepickerCdays = scope.qs("datepicker-circle-days"),
								pluginBack = modalPluginCdays.querySelector(".back-button"),
								pluginSend = modalPluginCdays.querySelector(".send-button"),
								swiper = new Swiper('.datepicker-circle-days', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView: 3,
									loop: true,
									initialSlide: 7
								}); ;
								 
								/**
									close plugin date
								*/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								})
								
								
								/**
									click input cover
								*/ 
								
								
								scope.attachListener( inputCover, 'click', function( index ){
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-circle-days");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								  
									
									objInput.value = datepickerCdays.querySelector(".swiper-slide-active").textContent;
									
									self.params.hpht.totDays = parseInt( objInput.value.split(" Hari")[0] );
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							},
							pluginUsgWeek : function( inputCover ){
								
								//circle days 
								let  self = this,
								modalPluginUsgWeek = scope.qs("plugin-dropdown-week-usg"),
								dropdownUsgWeek = scope.qs("dropdown-week-usg"),
								pluginBack = modalPluginUsgWeek.querySelector(".back-button"),
								pluginSend = modalPluginUsgWeek.querySelector(".send-button"),
								swiper = new Swiper('.dropdown-week-usg', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView: 3,
									loop: true,
									initialSlide: 1
								}); ;
								 
								/**
									close plugin date
								*/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								})
								
								
								/**
									click input cover
								*/ 
								
								
								scope.attachListener( inputCover, 'click', function( index ){
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-dropdown-week-usg");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = dropdownUsgWeek.querySelector(".swiper-slide-active").textContent;
									
									self.params.usg.weeks = parseInt( objInput.value.split(" Minggu")[0] );
									  
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							},
							pluginUsgDay : function( inputCover ){
								
								//circle days 
								let self = this, 
								modalPluginUsgDay = scope.qs("plugin-dropdown-day-usg"),
								dropdownUsgDay = scope.qs("dropdown-day-usg"),
								pluginBack = modalPluginUsgDay.querySelector(".back-button"),
								pluginSend = modalPluginUsgDay.querySelector(".send-button"),
								swiper = new Swiper('.dropdown-day-usg', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView: 3,
									loop: true,
									initialSlide: 1
								}); ;
								 
								/**
									close plugin date
								*/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								})
								
								
								/**
									click input cover
								*/ 
								
								
								scope.attachListener( inputCover, 'click', function( index ){
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-dropdown-day-usg");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								  
									
									objInput.value = dropdownUsgDay.querySelector(".swiper-slide-active").textContent;
									 
									self.params.usg.days = parseInt( objInput.value.split(" Hari")[0] );
									  
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							},
							init: function(){
								
								let self = this,
								pregTestPagination = scope.qs("preg-test-pagination"),
								modal = scope.qs("modal-preg-test-new"),
								modalCnt = scope.slice( modal.querySelectorAll(".swiper-slide") ),
								modalTitle = scope.slice( modal.querySelectorAll(".preg-title") ),
								modalBtn = scope.slice( modal.querySelectorAll(".btn-baby-save") ),
								backBtn = modal.querySelector(".back-button"),
								index = 0,
								swiper = new Swiper('.preg-test-content', {
									observer: true,
									observeParents: true, 
									pagination: {
										el: '.preg-test-pagination',
										dynamicBullets: true,
									},
									initialSlide: 0
								}); 
								
								swiper.on('transitionEnd', function () {
										 
									index = swiper.activeIndex;	 
										 
								});  
								  
								pregTestPagination.setAttribute("style", "position: absolute;left: 0px;right: 0px;text-align:center;width:80px; margin : 0px auto;transform : translateX(0%)")    
							   
								/*close btn*/
								scope.attachListener( backBtn, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout();
									
								})
							  
								/*info*/  
								modalTitle.forEach(function( titleEl, index ){
									
									scope.attachListener( titleEl, 'click', function(){
										
										switch( index ){
											
											case 0 :
											
												let fragmentHpht = scope.stringToHtml5Template(
													'<span class="center-text semibold"> Hari pertama haid terakhir adalah ' +
													'cara yang paling mudah untuk dilakukan oleh ibu memprediksi persalinan, '+
													'pada dasarnya tiap jenjang kehamilan adalah 40 minggu atau 280 hari '+
													'kita dapat menggunakan rumus Naegele dimana untuk memprediksi persalinan '+
													'tanggal HPHT pada bulan dapat dikurangin 3, hari ditambahkan 7 serta tahun ditambah 1, '+
													'namun cara ini berlaku untuk ibu yang memiliki sirkulasi haid teratur'+
													'</span>'
												);
												 
												obj.modalMenu.menuError.update( fragmentHpht );
												
												break;
											case 1 :
												
												let fragmentUsg = scope.stringToHtml5Template(
													'<span class="center-text semibold"> Pemerisaan USG adalah ' +
													'adalah salah satu cara untuk memprediksi persalinan, '+
													'bila ibu tidak tahu atau lupa kapan tanggal HPHT, dengan pemeriksaan usg '+
													'dokter kandungan dapat menentukan usia janin, untuk prediksi yang tepat adalah ketika semester pertama '+
													'awal kehamilan ibu'+
													'</span>'
												);
												 
												obj.modalMenu.menuError.update( fragmentUsg );
											
												break;
											case 2 :
												
												let fragmentCpc = scope.stringToHtml5Template(
													'<span class="center-text semibold"> Memprediksi kelahiran dengan  ' +
													'mengetahui tanggal konsepsi atau pembuahaan, '+
													'metode ini adalah hal yang paling akurat namun sulit untuk mengetahui tanggal terjadinya konsepsi, '+
													'tapi akan sangat berguna bagi ibu yang melakukan proses bayi tabung atau fertilisasi in vitro (IVF) dimana dokter dapat mengetahui '+
													'terjadinya tanggal pembuahaan sehingga prediksi persalinan dapat di hitung lebih akurat '+
													'</span>'
												);
												
												obj.modalMenu.menuError.update( fragmentCpc );
												
												break;
										}
										
									})
									
								})
								   
								/*input*/
								modalCnt.forEach(function( cntEl, index ){
									
									let inputs = scope.slice( cntEl.getElementsByTagName("input") );
									
									if( index === 0 ){
										    
										obj.modalInput.bindToKeyup( inputs[0], "textarea" );  
										  
										self.pluginDatePickerHPHT( inputs[1].parentNode );
										 
										self.pluginCircleDays( inputs[2].parentNode );
										 
									}else if( index === 1 ){
										   
										obj.modalInput.bindToKeyup( inputs[0], "textarea" );  
										   
										self.pluginDatePickerUSG( inputs[1].parentNode );
										 
										self.pluginUsgWeek( inputs[2].parentNode );
										  
										self.pluginUsgDay( inputs[3].parentNode );
										
									}else if( index === 2 ){
										 
										obj.modalInput.bindToKeyup( inputs[0], "textarea" );  
										   
										self.pluginDatePickerCPC( inputs[1].parentNode ); 
									} 
									 
								})
								 
								
								/*btn*/
								scope.attachListener( modalBtn, 'click', function(){
									
									let successFn = function(){
									
										dataObject = obj.dataStorage.dataObject[0];
				  
										obj.main.home("update");
										
										obj.reupdateData();
								
										obj.layoutChartUpdate = true; 
										  
										obj.layoutChartUpdateControl = true; 
										  
										obj.modal.behaviour.closeFadeout(); 
										
										obj.modal.trackerNew.update();
							
									},
									errorFn = function(){
										
										let fragment = scope.stringToHtml5Template(
											'<span class="semibold center-text"> Ups pastikan tanggal yang di pilih benar' +
											' atau tanggal mewakili perkiraan usia kehamilan antara 1 hingga 40 minggu</span>'
										);
										 
										obj.modalMenu.menuError.update( fragment );
										
									},
									inputs = scope.slice( modalCnt[ index ].getElementsByTagName("input") );
								   
								
									let isSelectTypeReg = obj.dataStorage.dataObject.length 
										&& dataObject.typeSelect === 2, // old app return undefined
									
									inputFilter = inputs, // isSelectTypeReg ? inputs.slice( 1,inputs.length ) : inputs;
									    
									typeText = self.type.text,
									
									typeSelect = isSelectTypeReg ? dataObject.typeSelect : self.type.label,
									 
									name = scope.encodeStr( inputs[0].value );
									 
									if( obj.inputValidate( inputFilter ) ){
									 	   
										switch( index ){
											
											case 0 :
												
												let calcHpht = obj.pregCalculate.lastPeriod({
													date : self.params.hpht.date,
													cyclePeriode : self.params.hpht.totDays
												}),
												weeksHpht = calcHpht.fetusAge.weeks;
												 
												if( weeksHpht <= 0 || weeksHpht > 40 ){
													
													errorFn();
													
												}else{
													
													obj.storageCrud({
														dataStorage : "dataObject",
														type : "add",
														name : name,
														typeText : typeText,
														typeSelect : typeSelect,
														pregCalculate :{
															init : "hpht",
															date : self.params.hpht.date,
															cyclePeriode : self.params.hpht.totDays
														}
														
													},
													successFn )
												}
												 
												
												break;
											
											case 1 :
												
												let ga = self.params.usg.days + ( self.params.usg.weeks * 7 ),
													calcUsg = obj.pregCalculate.ultrasound({
													date : self.params.usg.date,
													gestasionalAge : ga
												}),
												weeksUsg = calcUsg.fetusAge.weeks;
												 
												if( weeksUsg <= 0 || weeksUsg > 40 ){
													
													errorFn();
													
												}else{
												
													obj.storageCrud({
														dataStorage : "dataObject",
														type : "add",
														name : name,
														typeText : typeText,
														typeSelect : typeSelect,
														pregCalculate :{
															init : "usg",
															date : self.params.usg.date,
															gestasionalAge :ga
														}
														
													},
													successFn ) 
												
												}
												
												break;
											
											case 2 :
												
												let calcCpc = obj.pregCalculate.conception({
													date : self.params.conception.date
												}),
												weeksCpc = calcCpc.fetusAge.weeks;
												 
												if( weeksCpc <= 0 || weeksCpc > 40 ){
													
													errorFn();
													
												}else{
													
													obj.storageCrud({
														dataStorage : "dataObject",
														type : "add",
														name : name,
														typeText : typeText,
														typeSelect : typeSelect,
														pregCalculate :{
															init : "conception",
															date : self.params.conception.date
														}
														
													},
													successFn ) 
													
												}
												
												break;
										}
									 
									}
								})
								

								
								 
								/*						 
								dataObject = obj.dataStorage.dataObject[0];
								  
								obj.reupdateData();
						
								obj.layoutChartUpdate = true; 
								*/
								
							}
						},
						imtBumilNew : function(){
							
							let self = this,
							modal = scope.qs("imtbumil-modal"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							imtRecorded = "", weightRecom = "", status = "",
							updateChart = function( params ){
							
								status = ( params.imt < 18.5 ) ? "berat kurang" :
								( params.imt >= 18.5 &&  params.imt <= 24.9 ) ? "berat normal" :
								( params.imt >= 25 &&  params.imt <= 29.9 ) ? "berat lebih" : "obesitas";
								
								weightRecom = ( params.imt < 18.5 ) ? "12.7 - 18 Kg" :
								( params.imt >= 18.5 &&  params.imt <= 24.9 ) ? "11 - 16 Kg" :
								( params.imt >= 25 &&  params.imt <= 29.9 ) ? "7 - 11 Kg" : "5 - 9 Kg" 
									 
									 					 
								inputs[0].setAttribute( "placeholder", params.weight +" Kg")
							
								inputs[1].setAttribute( "placeholder", params.height +" Meter" )
								
								scope.text( scope.qs("imtbumil-recorded"), params.imt +" ( "+ status +" )" )
								  
								scope.text( scope.qs("imtbumil-button"), "IMT bumil ( "+ weightRecom +" )" )
								  
								scope.text( scope.qs("weightbumil-recorded"), weightRecom )
								  
								if( params.chart ){
									  
									obj.chart.weightBumilAge.init();
									
									obj.chart.weightBumilAge.create();
									 
								}
								
							};
							
							obj.storageCrud({ 
								noUpdateFileSource : true,
								dataStorage : "imtBumil",
								type : "select"
							},
							function( imtSelected ){
								
								imtRecorded = imtSelected;
								 
								if( imtRecorded ){
									 
									updateChart({
										imt : imtRecorded.imt,
										weight : imtRecorded.weight,
										height : imtRecorded.height, 
										chart : false
									})
									 
								}
								 
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
								}) 
								
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[0], "input" );
								
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[1], "input" );
								
								/**
									send
								*/
								scope.attachListener( btnSend, 'click', function(){
										
									if( obj.inputValidate( inputs ) ){
																			 
										let weight = parseFloat( scope.encodeStr(  inputs[0].value ) ),
										height = parseFloat( scope.encodeStr(  inputs[1].value ) ),
										imt = parseFloat( weight / ( height * height ) ).toFixed( 2 );
										   
										obj.storageCrud({ 
											noUpdateFileSource : true,
											dataStorage : "imtBumil",
											type : "select"
										},
										function( imtSelected ){
										   
											if( imtSelected ){
												 
												// perbarui imt bumil baru 
										
												obj.storageCrud({ 
													dataStorage : "imtBumil", 
													type : "update",
													imt : imt,
													weight : weight,
													height : height,
													weightRecom : weightRecom,
													status : status
												},
												function(){
													  
													 obj.modal.behaviour.closeFadeout();
													
												}) 
												
											}else{
												
												// penambahan imt bumil baru

												obj.storageCrud({  
													dataStorage : "imtBumil",
													type : "add",
													imt : imt,
													weight : weight,
													height : height,
													weightRecom : weightRecom,
													status : status
												},
												function(){
													
													 obj.modal.behaviour.closeFadeout();
													
												});	
												
											}
												
											updateChart({
												imt : imt,
												weight : weight,
												height : height,
												chart : true
											})
										
										})
										  
									}
								})
								
							
							})
							
						},
						weightBumilNew : function(){
							
							let self = this,
							datepicker = scope.qs("plugin-datepicker-weightbumil"),
							pluginBack = datepicker.querySelector(".back-button"),
							pluginSend = datepicker.querySelector(".send-button"),
							modal = scope.qs("modal-weightbumil"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							inputCover = modal.querySelector(".input-disabled"),
							gaObject = obj.pregCalculate.pergPredict.fetusAge,
							ga = gaObject.weeks+" Mgg "+ (gaObject.days ? " , "+ gaObject.days+" hari" : "" ),
							gaInDays = ( gaObject.weeks * 7 ) + gaObject.days+" Hari",
							dateSelect, dayTo, pregDateEnd, pregDateStart;
  
							scope.text( scope.qs("ga-recorded"), ga +" ( "+ gaInDays+" )" )
							 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
								
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-weightbumil");
								  
								if( self.state.weightbumil ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepicker.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-weightbumil"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										gaObject = obj.chart.requireDataObject({
											dateSelect : dateSelect
										}),
										dayTo =  ( gaObject.pregNowTotalWeek * 7 ) + gaObject.pregNowToDays,
										ga = gaObject.pregNowTotalWeek+" Mgg "+ (gaObject.pregNowToDays ? " , "+ gaObject.pregNowToDays+" hari" : "" ),
										gaInDays = dayTo+" Hari";
 
										pregDateStart = gaObject.pregDateStart;
										 
										scope.text( scope.qs("ga-recorded"), ga +" ( "+ gaInDays+" )" )
										 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										   
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-weightbumil",
										fn : function(){
											 
											scope.text( scope.qs("select-date-weightbumil"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.weightbumil = false;
								}
							
							})
							
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
							})
							
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
							}) 
							
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
													 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "weightBumil",
										type : "select-dayto", 
										dayTo : dayTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( dayTo < 0 || dayTo > 294 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 0 hari sampai dengan 294 hari </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "weightBumil",
												dayTo : dayTo,
												weight :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect
											},
											function(){
													
												//update 
												obj.chart.weightBumilAge.init();
 
												
												//reupdate chart 
												obj.chart.weightBumilAge.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}else if( isWeekToRecorded ){
											 
											obj.storageCrud({ 
												type : "update-dayto", 
												dataStorage : "weightBumil",
												dayTo : dayTo,
												weight :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect
											},
											function(){
													
												
												//update 
												obj.chart.weightBumilAge.init();
 
												//reupdate chart 
												obj.chart.weightBumilAge.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}
										
									});	
									
										
								}
							})
						},
						weightBumilDetail : function(){
								
							let btnBack = scope.qs("modal-weightbumil-detail").querySelector(".back-button"),
							deleteBack = scope.qs("modal-weightbumil-detail").querySelector(".send-button"),
							self = this;
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();
					   
							})
							
							/*
								delete
							**/
							scope.attachListener( deleteBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.modal.behaviour.openModalFadeIn("modal-weightbumil-confirm");
									}
								});
					   
							})
						},
						weightBumilConfirm : function(){
							let btnBack = scope.qs("modal-weightbumil-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-weightbumil-confirm").querySelector(".send-button"),
							self = this;
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout(); 
								
							})
							
							/* confirm */
							scope.attachListener( btnConfirm, 'click', function(){
								
								let id = this.getAttribute("label");
								
								obj.storageCrud({
									id : id,
									type : "delete",
									dataStorage : "weightBumil"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										
										end : function(){
											
											obj.chart.weightBumilAge.init(); // update
											
											obj.chart.weightBumilAge.create(); // update
											
											
										}
									});
									  
								}); 
								
							}) 
						},
						bpBumilNew : function(){
							
							let self = this,
							datepicker = scope.qs("plugin-datepicker-bpbumil"),
							pluginBack = datepicker.querySelector(".back-button"),
							pluginSend = datepicker.querySelector(".send-button"),
							modal = scope.qs("modal-bpbumil"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							inputCover = modal.querySelector(".input-disabled"),
							gaObject = obj.pregCalculate.pergPredict.fetusAge,
							ga = gaObject.weeks+" Mgg "+ (gaObject.days ? " , "+ gaObject.days+" hari" : "" ),
							gaInDays = ( gaObject.weeks * 7 ) + gaObject.days+" Hari",
							dateSelect, dayTo, pregDateEnd, pregDateStart;
  
							scope.text( scope.qs("ga-bprecorded"), ga +" ( "+ gaInDays+" )" )
							 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
								
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-bpbumil");
								  
								if( self.state.bpbumil ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepicker.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-bpbumil"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										gaObject = obj.chart.requireDataObject({
											dateSelect : dateSelect
										}),
										dayTo =  ( gaObject.pregNowTotalWeek * 7 ) + gaObject.pregNowToDays,
										ga = gaObject.pregNowTotalWeek+" Mgg "+ (gaObject.pregNowToDays ? " , "+ gaObject.pregNowToDays+" hari" : "" ),
										gaInDays = dayTo+" Hari";
 
										pregDateStart = gaObject.pregDateStart;
										 
										scope.text( scope.qs("ga-bprecorded"), ga +" ( "+ gaInDays+" )" )
										 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										   
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-bpbumil",
										fn : function(){
											 
											scope.text( scope.qs("select-date-bpbumil"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.bpbumil = false;
								}
							
							})
							
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
							})
							
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
							}) 
							
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
													 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "bpBumil",
										type : "select-dayto", 
										dayTo : dayTo
									},
									function( isDayToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( dayTo < 0 || dayTo > 294 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 0 hari sampai dengan 294 hari </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isDayToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "bpBumil",
												dayTo : dayTo,
												systolic :  parseInt( scope.encodeStr( inputs[0].value ) ),
												diastolic :  parseInt( scope.encodeStr( inputs[1].value ) ),
												dateSelect : dateSelect
											},
											function(){
													
												//update 
												obj.chart.bpBumil.init();
 
												
												//reupdate chart 
												obj.chart.bpBumil.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}else if( isDayToRecorded ){
											 
											obj.storageCrud({ 
												type : "update-dayto", 
												dataStorage : "bpBumil",
												dayTo : dayTo,
												systolic :  parseInt( scope.encodeStr( inputs[0].value ) ),
												diastolic :  parseInt( scope.encodeStr( inputs[1].value ) ),
												dateSelect : dateSelect
											},
											function(){
													
												
												//update 
												obj.chart.bpBumil.init();
 
												//reupdate chart 
												obj.chart.bpBumil.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}
										
									});	
									
										
								}
							})
						},
						bpBumilDetail : function(){
								
							let btnBack = scope.qs("modal-bpbumil-detail").querySelector(".back-button"),
							deleteBack = scope.qs("modal-bpbumil-detail").querySelector(".send-button"),
							self = this;
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();
					   
							})
							
							/*
								delete
							**/
							scope.attachListener( deleteBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.modal.behaviour.openModalFadeIn("modal-bpbumil-confirm");
									}
								});
					   
							})
						},
						bpBumilConfirm : function(){
							let btnBack = scope.qs("modal-bpbumil-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-bpbumil-confirm").querySelector(".send-button"),
							self = this;
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout(); 
								
							})
							
							/* confirm */
							scope.attachListener( btnConfirm, 'click', function(){
								
								let id = this.getAttribute("label");
								
								obj.storageCrud({
									id : id,
									type : "delete",
									dataStorage : "bpBumil"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										
										end : function(){
											
											obj.chart.bpBumil.init(); // update
											
											obj.chart.bpBumil.create(); // update
											
											
										}
									});
									  
								}); 
								
							}) 
						},
						tfuBumilNew : function(){
							
							let self = this,
							datepicker = scope.qs("plugin-datepicker-tfubumil"),
							pluginBack = datepicker.querySelector(".back-button"),
							pluginSend = datepicker.querySelector(".send-button"),
							modal = scope.qs("modal-tfubumil"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							inputCover = modal.querySelector(".input-disabled"),
							gaObject = obj.pregCalculate.pergPredict.fetusAge,
							dateSelect, weekTo, pregDateEnd, pregDateStart,
							
							strWeek = gaObject.weeks+" Mgg ";
  
							scope.text( scope.qs("ga-tfurecorded"), strWeek )
							 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
								
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-tfubumil");
								  
								if( self.state.tfubumil ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepicker.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-tfubumil"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										gaObject = obj.chart.requireDataObject({
											dateSelect : dateSelect
										}),
										weekTo = gaObject.pregNowTotalWeek;
 
										pregDateStart = gaObject.pregDateStart;
										 
										scope.text( scope.qs("ga-tfurecorded"), weekTo+" Mgg "  )
										 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										   
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-tfubumil",
										fn : function(){
											 
											scope.text( scope.qs("select-date-tfubumil"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.tfubumil = false;
								}
							
							})
							
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
							})
							
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
							}) 
							
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
											 		 
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "tfuBumil",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 16 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 16 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "tfuBumil",
												weekTo : weekTo,
												tfu :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect
											},
											function(){
													
												//update 
												obj.chart.tfuBumil.init();
 
												
												//reupdate chart 
												obj.chart.tfuBumil.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}else if( isWeekToRecorded ){
											 
											obj.storageCrud({ 
												type : "update-weekto", 
												dataStorage : "tfuBumil",
												weekTo : weekTo,
												tfu :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect
											},
											function(){
													
												
												//update 
												obj.chart.tfuBumil.init();
 
												//reupdate chart 
												obj.chart.tfuBumil.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}
										
									});	
									
										
								}
							})
						},
						tfuBumilDetail : function(){
								
							let btnBack = scope.qs("modal-tfubumil-detail").querySelector(".back-button"),
							deleteBack = scope.qs("modal-tfubumil-detail").querySelector(".send-button"),
							self = this;
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();
					   
							})
							
							/*
								delete
							**/
							scope.attachListener( deleteBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.modal.behaviour.openModalFadeIn("modal-tfubumil-confirm");
									}
								});
					   
							})
						},
						tfuBumilConfirm : function(){
							let btnBack = scope.qs("modal-tfubumil-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-tfubumil-confirm").querySelector(".send-button"),
							self = this;
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout(); 
								
							})
							
							/* confirm */
							scope.attachListener( btnConfirm, 'click', function(){
								
								let id = this.getAttribute("label");
								
								obj.storageCrud({
									id : id,
									type : "delete",
									dataStorage : "tfuBumil"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										
										end : function(){
											
											obj.chart.tfuBumil.init(); // update
											
											obj.chart.tfuBumil.create(); // update
											
											
										}
									});
									  
								}); 
								
							}) 
						},
						bpmBumilNew : function(){
							
							let self = this,
							datepicker = scope.qs("plugin-datepicker-bpmbumil"),
							pluginBack = datepicker.querySelector(".back-button"),
							pluginSend = datepicker.querySelector(".send-button"),
							modal = scope.qs("modal-bpmbumil"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							inputCover = modal.querySelector(".input-disabled"),
							gaObject = obj.pregCalculate.pergPredict.fetusAge,
							dateSelect, weekTo, pregDateEnd, pregDateStart,
							
							strWeek = gaObject.weeks+" Mgg ";
  
							scope.text( scope.qs("ga-bpmrecorded"), strWeek )
							 
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
								
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-bpmbumil");
								  
								if( self.state.bpmbumil ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepicker.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-bpmbumil"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										
										gaObject = obj.chart.requireDataObject({
											dateSelect : dateSelect
										}),
										weekTo = gaObject.pregNowTotalWeek;
 
										pregDateStart = gaObject.pregDateStart;
										 
										scope.text( scope.qs("ga-bpmrecorded"), weekTo+" Mgg "  )
										 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										   
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-bpmbumil",
										fn : function(){
											 
											scope.text( scope.qs("select-date-bpmbumil"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									//execute once 
									self.state.bpmbumil = false;
								}
							
							})
							
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
							})
							
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
							}) 
							
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
													  
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "bpmBumil",
										type : "select-weekto", 
										weekTo : weekTo
									},
									function( isWeekToRecorded ){
										
										if( dateSelect < pregDateStart || new Date() < dateSelect ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal awal kehamilan atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( weekTo < 12 || weekTo > 40 ){
											 
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold"> Umur kehamilan harus 12 minggu sampai dengan 40 minggu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isWeekToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "bpmBumil",
												weekTo : weekTo,
												bpm :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect
											},
											function(){
													
												//update 
												obj.chart.bpmBumil.init();
 
												
												//reupdate chart 
												obj.chart.bpmBumil.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}else if( isWeekToRecorded ){
											 
											obj.storageCrud({ 
												type : "update-weekto", 
												dataStorage : "bpmBumil",
												weekTo : weekTo,
												bpm :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect
											},
											function(){
													
												
												//update 
												obj.chart.bpmBumil.init();
 
												//reupdate chart 
												obj.chart.bpmBumil.create();
												
												obj.modal.behaviour.closeFadeout();
												
											});
											
										}
										
									});	
									
										
								}
							})
						},
						bpmBumilDetail : function(){
								
							let btnBack = scope.qs("modal-bpmbumil-detail").querySelector(".back-button"),
							deleteBack = scope.qs("modal-bpmbumil-detail").querySelector(".send-button"),
							self = this;
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();
					   
							})
							
							/*
								delete
							**/
							scope.attachListener( deleteBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.modal.behaviour.openModalFadeIn("modal-bpmbumil-confirm");
									}
								});
					   
							})
						},
						bpmBumilConfirm : function(){
							let btnBack = scope.qs("modal-bpmbumil-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-bpmbumil-confirm").querySelector(".send-button"),
							self = this;
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout(); 
								
							})
							
							/* confirm */
							scope.attachListener( btnConfirm, 'click', function(){
								
								let id = this.getAttribute("label");
								
								obj.storageCrud({
									id : id,
									type : "delete",
									dataStorage : "bpmBumil"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										
										end : function(){
											
											obj.chart.bpmBumil.init(); // update
											
											obj.chart.bpmBumil.create(); // update
											
											
										}
									});
									  
								}); 
								
							}) 
						},
						
						userList : function(){
							let modal = scope.qs("modal-user-list")
							container = modal.querySelector(".container"),
							btnBack = modal.querySelector(".back-button"),
							data = obj.dataStorage.dataObject.reverse(),
							btnNew = modal.querySelector(".button-user-new"),
							btnShort =  scope.qs("btn-short"),
							inputShort =  modal.getElementsByTagName("input")[0],
							self = this,
							contentDom = function( params ){ 
								let fragment = scope.stringToHtml5Template(
									'<li>'+
										params.name +
									'	<div class="button-list menu-dot-icon bg-size-70"'+
									'label-id="'+params.id+'"'+ 
									'date-create="'+params.dateCreate+'"'+
									'name="'+params.name+'"'+
									'method="'+params.method.toUpperCase()+'"'+
									'gestasional-age="'+params.gestasionalAge+'"'+
									'cycle-periode="'+params.cyclePeriode+'"'+
									'date="'+params.date+'"'+
									'></div>'+
									'	<div class="button-list text '+( params.active ? "active" : "" ) + '" >'+( params.active ? "Aktif" : "Aktifkan" )+'</div>'+
									'</li>'
								) 
								 
								container.appendChild( fragment ) 
								 
							},
							dataNoteFn = function( dataNote ){
								 
								let name = dataNote.name,
								
								dateCreate = scope.dateToYMD(
									scope.stringToDate( dataNote.calculateMethod.date ), 
									true
								),
								
								typeText = dataNote.typeText,
								
								typeSelect = parseInt( dataNote.typeSelect ),
								
								active = dataNote.active,
								
								cyclePeriode = dataNote.calculateMethod.cyclePeriode,
								
								gestasionalAge = dataNote.calculateMethod.gestasionalAge; 
								   
								contentDom({
									id : dataNote.id,
									name : scope.ucFirst( name.toLowerCase() ),
									active : active,
									typeSelect : typeSelect,
									typeText : typeText,
									method : dataNote.calculateMethod.init,
									cyclePeriode : cyclePeriode ? cyclePeriode : "",
									gestasionalAge : gestasionalAge ? gestasionalAge : "",
									date : dataNote.calculateMethod.date,
									dateCreate : dateCreate
								})
								 
								
								 
							},
							attachEventBtns = function(){
								 
									
								
								/*switch user*/
								//active buttons
								let activeBtns = scope.slice( scope.qs("modal-user-list").querySelectorAll(".text") );
									
								activeBtns.map(function( activeBtn, index ){
									
									scope.attachListener( activeBtn, 'click', function(){
										
										let id = scope.sibling( this, "previous").getAttribute("label-id");
										
										if( id  !== dataObject.id ){
										
										
											obj.storageCrud({ 
												type : "set-active", 
												dataStorage : "dataObject",
												id :id
											},
											function( objData ){
												 
												obj.modal.behaviour.closeRightToleftFadeout({
													end : function(){
														
														dataObject = objData;
									
														obj.layoutChartUpdate = true; 
														 
														obj.layoutChartUpdateControl = true; 
														
														obj.reupdateData();
														 
														obj.modal.behaviour.closeFadeout(); 
													}
												}); 
												
											});
											
										}
									})
									
								})
							
								 
								/*detail buttns*/
								let detailBtns = scope.slice( scope.qs("modal-user-list").querySelectorAll(".menu-dot-icon") );
									
								detailBtns.map(function( detailBtn, index ){
									
									scope.attachListener( detailBtn, 'click', function(){
										  
										
										let labelId =  this.getAttribute("label-id"),
										  
										date = this.getAttribute("date"),
										
										dateNow =  new Date(),
										
										predictObj = "";  
										  
										switch( this.getAttribute("method").toLowerCase() ){
											
											case "usg" :
											
												predictObj = obj.pregCalculate.ultrasound({
													date : date,
													dateSelect : dateNow.toLocaleString("id-ID"),
													gestasionalAge : this.getAttribute("gestasional-age")
												});
												
												break;
												
											case "conception" :
												
												predictObj = obj.pregCalculate.conception({
													date : date,
													dateSelect : dateNow.toLocaleString("id-ID")
												});
												
												break;
												
											case "hpht" :
												
												predictObj = obj.pregCalculate.lastPeriod({
													date : date,
													dateSelect : dateNow.toLocaleString("id-ID"),
													cyclePeriode : this.getAttribute("cycle-periode")
												})
												
												break	
										} 
										 
										 
										let conceptionDate = scope.dateToYMD( predictObj.conceptionDate, "year" ),
										
										dueDate = scope.dateToYMD( predictObj.dueDate, "year" ),
										
										age = predictObj.fetusAge.weeks +" Minggu "+
											( predictObj.fetusAge.days ? ","+predictObj.fetusAge.days+" Hari" : "" );
										  
										  
										scope.text( [ scope.qs("preg-detail-name"), scope.qs("preg-confirm-name") ], this.getAttribute("name") ) 
										scope.text( [ scope.qs("preg-detail-method"), scope.qs("preg-confirm-method") ], this.getAttribute("method") )  
										scope.text( [ scope.qs("preg-detail-age"), scope.qs("preg-confirm-age") ], age )  
										scope.text( [ scope.qs("preg-detail-startdate"), scope.qs("preg-confirm-startdate") ], conceptionDate )  
										scope.text( [ scope.qs("preg-detail-enddate"), scope.qs("preg-confirm-enddate") ], dueDate )  
										scope.text( [ scope.qs("preg-detail-date"), scope.qs("preg-confirm-date") ], this.getAttribute("date-create") )  
										  
										  
										//set label confirm button
										scope.qs("modal-user-confirm").querySelector(".send-button").setAttribute( "label-id", labelId );
										 
										 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												obj.modal.behaviour.openModalFadeIn("modal-user-detail");
											}
										}) 
										 
										
										 
										 
									})
								})
								
								
							};
							
							 
							//clear and append baby data
							container.innerHTML = "";
							
							data.forEach( function( dataNote ){
											  
								dataNoteFn( dataNote );  
							 
							})		 
							
							
							/*btn back*/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();
								
							})
							
							/*new user reg*/
							scope.attachListener( btnNew, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.modal.behaviour.openModalFadeIn("modal-preg-test-new");
									}
								}) 
									

								/*
											
								//if( obj.dataStorage.dataObject.length < 5 ){
										
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											obj.modal.behaviour.openModalFadeIn("modal-preg-test-new");
										}
									}) 
												
									
								//}else{
									
								//	let fragment = scope.stringToHtml5Template(
								//		'<span class="semibold center-text"> aplikasi ini membatasi hanya untuk 5 pengguna saja</span>'
								//	);
									 
								//	obj.modalMenu.menuError.update( fragment );
								//}
								
								*/
								
							})
							 
							attachEventBtns();
							
							//shortlist
						
							var elClone = btnShort.cloneNode(true);
							btnShort.parentNode.replaceChild( elClone, btnShort );
							scope.attachListener( elClone, 'click', function(){ 
								 
								if( !stateFirstload.sort ){
									   
									data.sort(function(a,b){ return a.name.localeCompare(b.name) })
									 
									stateFirstload.sort = 1
									
								}else{
									
									data.sort(function(a,b){  return b.name.localeCompare(a.name) })
									 
									stateFirstload.sort = 0
								}
								 
								
								//clear and append baby data
								container.innerHTML = "";
							
								data.forEach( function( dataNote ){
	
									dataNoteFn( dataNote );  
								 
								})		 
								
								
								attachEventBtns();
							})
							
							
							//shortlist by name 
							var elClone = inputShort.cloneNode(true);
							inputShort.parentNode.replaceChild( elClone, inputShort );
							scope.attachListener( elClone, 'keyup', function(){
								
								let inputVal = this.value,
								newData = data.filter(function ( objFilter ) {
								  return objFilter.name.toLowerCase().indexOf( inputVal.toLowerCase() ) > -1 ;
								});
								
								//clear and append baby data
								container.innerHTML = "";
							
								newData.forEach( function( dataNote ){
	
									dataNoteFn( dataNote );  
								 
								})		 
								
								attachEventBtns();
								
							}) 
							
						},
						charityList : function(){
							
							let self = this,
							btnBack = scope.qs("charity-list").querySelector(".back-button");
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();	
								
							})  
						},
						pregDetail :{
							init : function(){
							
							
								let btnBack = scope.qs("modal-user-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-user-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
									  
								})
								
								/*
									confirm
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout({
										end : function(){
											 
											obj.modal.behaviour.openModalFadeIn("modal-user-confirm")
										}
									});
									 
									
								})
							}
						},
						pregConfirm :{
							openModal : function(){
								
								scope.addClassTransform( scope.qs("modal"), "open", 150, {
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "hidden" );
									},
									end : function(){
									
										scope.removeClass( scope.qs("modal"), "close" );
									}
								})
							},
							triggerToBabyDetail : function(){
								
								obj.hiddenAndShowModals( "modal-preg-detail" );
								 
								this.openModal();
							},
							init : function(){
								
								let btnBack = scope.qs("modal-user-confirm").querySelector(".back-button"),
								deleteBack = scope.qs("modal-user-confirm").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout()
									 
								})
								
								/*
									confirm
								**/
								scope.attachListener( deleteBack, 'click', function(){
								 	  
									//prevent error when tab-d is active 
										
									obj.storageCrud({ 
										type : "delete", 
										dataStorage : "dataObject",
										id : this.getAttribute("label-id")
									},
									function( ){
									 
										if( !obj.noDataObjectInStorage() ){
											 
											obj.modal.behaviour.closeFadeout()
										} 
									});
									  
									
								})
								
							}
							
						},
						othersList : { 
							init : function(){
								
								let self = this, 
								btnBack = scope.qs("modal-other-list").querySelector(".back-button"),
								othersBtns =  scope.slice( scope.qs("modal-other-list").querySelectorAll(".modal-content > ul > li") ),
								colorBtns =  scope.slice( scope.qs("box-color").querySelectorAll("li") );
							 
								colorBtns.forEach(function( objBtn ){
									
									
									scope.attachListener( objBtn, 'click', function(){
										 
										
										obj.storageState({ 
											storageState : "layoutState",
											objState : "activeColor",
											value : this.getAttribute("label") 
										},
										function(){
											 
											obj.modal.behaviour.closeFadeout();
											
											obj.appConfig.color();
										}); 
										
									})
									
									
								})
							 
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout("modal-other-list"); 
								})
								
								/**
									Button List
								*/
								othersBtns.map(function( objElement, index ){
									
									scope.attachListener( objElement, 'click', function( index ){
										 
										if( index === 0 ){
										
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn("modal-user-list")
												}
											})
										
											
										}else if( index === 10 ){
											  
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn( "charity-list" )
												}
											})  
											  
											  
										}else if( index === 11 ){
											  
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn( "modal-faq-list" )
												}
											})  
											  
											  
										} else if( index === 13 ){
											   
											obj.cordova.email.open();  
											   
										}else if( index === 14 ){
											  
											obj.cordova.launchApp.init({
												name : "com.owlpictureid.bumil"
											});
											
										}else if( index === 16 ){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn("modal-back-restore") 
												}
											})     
											
										}else if( index === 17 ){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn("modal-dev-app ") 
												}
											}) 
											
										}  
										
									}.bind( objElement,  index ) )
								})
							}
						},
						FaqList : function(){
							
							let self = this,
							btnBack = scope.qs("modal-faq-list").querySelector(".back-button");
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
								
							})  
							
						},
						appList : {
							init : function(){
								
								let self = this,
								modal = scope.qs("modal-dev-app"),
								backBtn = modal.querySelector(".back-button"),
								liBtn = scope.slice( modal.querySelectorAll("li") );
								
								scope.attachListener( backBtn, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout() 
									
								}) 
					 			
								scope.attachListener( scope.qs("giftbox-animate"), 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){ 
											obj.modal.behaviour.openModalFadeIn("modal-dev-app") 
										}
									}) 
									
								}) 
								 
								 
								liBtn.forEach(function( objLi ){
									
									scope.attachListener( objLi, 'click', function(){
										
										let packageApp = this.getAttribute("label")
										 
										obj.cordova.launchApp.init({
											name : packageApp
										});
										
									}) 
									
								})
								
							}
						},
						appRate : function(){
							
							let self = this,
							data = obj.dataStorage.rate,
							dataRecoded = data.record,
							dataState = data.state,
							modal = scope.qs("modal-rate-app"),
							btnYes = modal.querySelector(".yes"),
							btnNo = modal.querySelector(".no"),
							btnLater = modal.querySelector(".later"),
							btnRate = modal.querySelector(".rate-now"),
							dateFirstRecord = scope.stringToDate( data.time ),
							datePlusOneDays = new Date( dateFirstRecord )
							dateNow = new Date(),
							boxFeedback = scope.qs("box-feedback"),
							boxRating = scope.qs("box-rating"),
							emojiBtn = scope.slice( modal.querySelectorAll(".small") );
							
							datePlusOneDays.setDate( datePlusOneDays.getDate() + 1 );
							  
							emojiBtn.forEach(function( btn, index){
								
								scope.attachListener( btn, 'click', function( index ){
								
									let div = scope.getFirstChild( btn );
									
									emojiBtn.forEach(function( elGrey ){
										
										let divGrey = scope.getFirstChild( elGrey );
										
										scope.removeClass( divGrey, divGrey.getAttribute("label-color") )
										scope.addClass( divGrey, divGrey.getAttribute("label-grey") )
										
									})
									
									
									scope.removeClass( div, div.getAttribute("label-grey") );
									scope.addClass( div, div.getAttribute("label-color") );
									
									
									switch( index ){
										
										case 0 :
										case 1 :
										case 2 :
											
											scope.removeClass( boxFeedback, "hidden" )
											scope.addClass( boxRating, "hidden" )
											
											break;
											
										case 3 :
										case 4 :
											
											scope.removeClass( boxRating, "hidden" )
											scope.addClass( boxFeedback, "hidden" )
											 
											break;
									} 
									
								}.bind( btn, index ) ) 
								
							})  
							   
							  
							scope.attachListener( [ btnLater, btnNo ], 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout() 
								
							}) 
							 
							scope.attachListener( btnRate, 'click', function(){
								    
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.cordova.launchApp.init({
											name : "com.owlpictureid.kms"
										});
									}
								}) 
											   
							})   
								
							scope.attachListener( btnYes, 'click', function(){
								    
								obj.cordova.email.open();  
											   
							})   
								
							 
							if( !dataState && datePlusOneDays < dateNow  ){
								 
								setTimeout(function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										end :function(){
											
											data.state = true; 
												
											obj.cordova.localStorage.put(function(){
												 
												obj.modal.behaviour.openModalFadeIn("modal-rate-app");
												
												
											}); 
											
										}
									})
									  
								},5000)
								
							}else{
								 
								data.record += 1;
							}
						
						},
						backupAndRestore : function(){
							
							let self = this,
							btnBack = scope.qs("modal-back-restore").querySelector(".back-button"),
							othersBtns =  scope.slice( scope.qs("modal-back-restore").querySelectorAll(".modal-content > ul > li") );
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
								
							})  
							
							othersBtns.map(function( objElement, index ){
								
								scope.attachListener( objElement, 'click', function( index ){
									 
									if( index === 0 ){
									 
										obj.cordova.xSocialSharing.backupAndRestore();
										
									}else if( index === 1 ){
										 
										obj.cordova.fileChooser.selectFile();
										
									} 
									
								}.bind( objElement,  index ) )
							})
							
						},
						contractionNew :{
							startDate : "",
							endDate : "",
							timer : "",
							contractionInterval : "",
							startTimer : function(){
								
								let self = this,
								timeTimeFn = function( dateEnd, dateNow ){
										
									let timestame = scope.timeUnitBetween( dateEnd, dateNow  );
									 	
									timestame = ( timestame.minute.toString().length <= 1 ? + "0"+timestame.minute.toString() : timestame.minute.toString() ) +" : " +
									( timestame.second.toString().length <= 1 ? + "0"+timestame.second.toString() : timestame.second.toString() ) +" : "+
									( timestame.millisecond.toString().length <= 1 ? + "0"+timestame.millisecond.toString() : timestame.millisecond.toString() )
									
									
									return timestame;
									
								},
								elTimer = scope.qs("count-timer");
								
								self.startDate = new Date();
								self.contractionInterval = setInterval(function(){
									
									self.endDate = new Date();
									self.timer = timeTimeFn( self.endDate, self.startDate );
									scope.text( elTimer, self.timer );
									 
								},70);
							},
							init : function(){
								
								let btnBack = scope.qs("modal-contraction-new").querySelector(".back-button"),
								btnSend = scope.qs("modal-contraction-new").querySelector(".send-button"),
								btnContraction = scope.qs("button-contraction"),
								counterContraction = scope.qs("count-timer"),
								btnTrigger = scope.qs("contraction-button"),
								elTimer = scope.qs("count-timer"),
								closeModalAndRestoreFn = function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											clearInterval( self.contractionInterval );
											scope.removeClass( btnContraction, "hidden" );
											scope.addClass( [ counterContraction, btnSend ], "hidden" );
											scope.text( elTimer,  "" );
											 
											
										}
									});
									
								},
								self = this;
								   
								scope.attachListener( btnContraction, 'click', function(){
									 
									scope.addClass( this, "hidden" );
									scope.removeClass( [ counterContraction, btnSend ], "hidden" ); 
									self.startTimer();
									
								})
								    
								   
								scope.attachListener( btnTrigger, 'click', function(){
									 
									obj.modal.behaviour.openModalFadeIn("modal-contraction-new");
									  
								})
								 
								 
								/*
									save
								**/
								scope.attachListener( btnSend, 'click', function(){
									  	 
									let fetusAge = obj.pregCalculate.pergPredict.fetusAge,
									ageString =  fetusAge.weeks+ ( fetusAge.weeks ? " Minggu, " : "" ) + fetusAge.days+' Hari';
										   
										 
									obj.storageCrud({
										dataStorage : "contraction",
										type : "add",
										timer : self.timer,
										startDate : self.startDate.toLocaleString("id-ID"),
										endDate : self.endDate.toLocaleString("id-ID"),
										fetusAge : ageString, 
									},
									function(){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												clearInterval( self.contractionInterval );
												scope.removeClass( btnContraction, "hidden" );
												scope.addClass( [ counterContraction, btnSend ], "hidden" );
												scope.text( elTimer,  "" );
												 
												obj.main.contraction(); 
											}
										});	 
										
									})
									
								}) 
								 
								 
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									closeModalAndRestoreFn();
									
								})
								
							}
						},
						contractionDetail : { 
							triggerToContractionConfirm : function(){
								
								obj.modal.behaviour.openModalFadeIn("modal-contraction-confirm");
									
							},
							init : function(){
								
								let self = this,
								btnBack = scope.qs("modal-contraction-detail").querySelector(".back-button"),
								btnSend = scope.qs("modal-contraction-detail").querySelector(".send-button"),
								closeModalAndRestoreFn = function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									
								};
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									closeModalAndRestoreFn();
									
								});
								
								
								/*
									delete
								**/
								scope.attachListener( btnSend, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											self.triggerToContractionConfirm();
										}
									}); 
									 
								})
								
							}
						},
						contractionConfirm : {
							init : function(){
								
								let self = this,
								btnBack = scope.qs("modal-contraction-confirm").querySelector(".back-button"),
								btnSend = scope.qs("modal-contraction-confirm").querySelector(".send-button");
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
									
								});
								
								/*
									delete
								**/
								scope.attachListener( btnSend, 'click', function(){
									
									let id = this.getAttribute("label-id");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "contraction"
									},
									function(){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												obj.main.contraction();
											}
										});
										
									});  
									
								});
								
							}
							
						},
						kickNew : {
							startDate : "",
							endDate : "",
							timer : "",
							kickerInterval : "",
							widthCount : 0,
							startTimer : function(){
								
								let self = this,
								timeTimeFn = function( dateEnd, dateNow ){
										
									let timestame = scope.timeUnitBetween( dateEnd, dateNow  );
									  
									timestame = ( timestame.hour.toString().length <= 1 ? + "0"+timestame.hour.toString() : timestame.hour.toString() ) +" : " +
									( timestame.minute.toString().length <= 1 ? + "0"+timestame.minute.toString() : timestame.minute.toString() ) +" : "+
									( timestame.second.toString().length <= 1 ? + "0"+timestame.second.toString() : timestame.second.toString() )
									
									
									return timestame;
									
								},
								elTimer = scope.qs("kicker-timer");
								
								self.startDate = new Date();
								self.kickerInterval = setInterval(function(){
									
									self.endDate = new Date();
									self.timer = timeTimeFn( self.endDate, self.startDate );
									scope.text( elTimer, self.timer );
									 
								},1000);
							},
							reset : function(){
								
								clearInterval( this.kickerInterval )
								this.widthCount = 0;
								scope.addClass( scope.qs("modal-kick-new").querySelector(".send-button"), "hidden" )
								scope.text( scope.qs("kicker-count"), 0 )
								scope.text( scope.qs("kicker-timer"), "00 : 00 : 00" );
								scope.removeClass( scope.qs("button-kicker-start"), "hidden" );
								scope.addClass( scope.qs("button-kicker-count"), "hidden" );
								scope.css( scope.qs("kicker-progress"), { "width" :'0%'})
								
							},
							init : function(){
								let btnBack = scope.qs("modal-kick-new").querySelector(".back-button"),
								btnSend = scope.qs("modal-kick-new").querySelector(".send-button"),
								btnKickerStart = scope.qs("button-kicker-start"),
								btnKickerCount = scope.qs("button-kicker-count"),
								btnTrigger = scope.qs("kicker-button"),
								kickerCount = scope.qs("kicker-count"),
								kickerProgress = scope.qs("kicker-progress"),
								deductKicker = scope.qs("remove-kicker"),
								resetKicker = scope.qs("reset-kicker"),
								closeModalAndRestoreFn = function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout(); 
									
								},
								self = this;
								
								 
								scope.attachListener( resetKicker, 'click', function(){
									  
									obj.modalMenu.behaviour.openModalFadeIn("modal-menu-kicker-reset");
								     
								})
								
								scope.attachListener( [ deductKicker, btnKickerCount ], 'click', function(){
									
									if( self.widthCount >= 0 && self.widthCount <= 10 ){
										
										/remove/i.test( this.className )  ? 
										self.widthCount-- : self.widthCount++;
										
										self.widthCount < 0 && ( self.widthCount = 0 ) ;
										self.widthCount > 10 && ( self.widthCount = 10 ) ;
									}
									
									if( self.widthCount <= 10){ 
										 
										scope.css( kickerProgress, { "width" : self.widthCount+'0%'})
										
										scope.text( kickerCount, self.widthCount )
									
									}
									
									( self.widthCount >= 1 ) ? 
										scope.removeClass( btnSend, "hidden" ) : 
										scope.addClass( btnSend, "hidden" );
									
									
								})
								
								scope.attachListener( btnKickerStart, 'click', function(){
									
									self.startTimer();
									scope.addClass( this, "hidden" );
									scope.removeClass( btnKickerCount, "hidden" );
								})
								
								
								scope.attachListener( btnTrigger, 'click', function(){
									 
									obj.modal.behaviour.openModalFadeIn("modal-kick-new"); 
									 
								})
								 
								 
								/*
									save
								**/
								scope.attachListener( btnSend, 'click', function(){
									  	 
									let fetusAge = obj.pregCalculate.pergPredict.fetusAge,
									ageString =  fetusAge.weeks+ ( fetusAge.weeks ? " Minggu, " : "" ) + fetusAge.days+' Hari';
										 
									obj.storageCrud({
										dataStorage : "kick",
										type : "add",
										count : self.widthCount,
										timer : self.timer,
										startDate : self.startDate.toLocaleString("id-ID"),
										endDate : self.endDate.toLocaleString("id-ID"),
										fetusAge : ageString, 
									},
									function(){
										
										closeModalAndRestoreFn();
											
										obj.main.kick(); 
										
										self.reset();
										
									})
									
								}) 
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									closeModalAndRestoreFn();
									
								})
								
								
							}
						},
						kickDetail : {
							 
							init : function(){
								
								let self = this,
								btnBack = scope.qs("modal-kick-detail").querySelector(".back-button"),
								btnSend = scope.qs("modal-kick-detail").querySelector(".send-button"),
								closeModalAndRestoreFn = function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout(); 
								};
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									closeModalAndRestoreFn();
									
								});
								
								
								/*
									delete
								**/
								scope.attachListener( btnSend, 'click', function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											obj.modal.behaviour.openModalFadeIn("modal-kick-confirm"); 
										}
									})
								 
								})
								
							}
						},
						kickConfirm : {
							init : function(){
								
								let self = this,
								btnBack = scope.qs("modal-kick-confirm").querySelector(".back-button"),
								btnSend = scope.qs("modal-kick-confirm").querySelector(".send-button");
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout(); 
								});
								
								/*
									delete
								**/
								scope.attachListener( btnSend, 'click', function(){
									
									let id = this.getAttribute("label-id");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "kick"
									},
									function(){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												obj.main.kick(); // update
											}
										}); 
										 
									});  
									
								});
								
							}
							
						}
						
					},
					appConfig : { 
						iap : {
							localProcess : {
								itemConsumeSilver : false,
								itemConsumeGold : false,
								itemConsumeBronze : false
							},
							store : function( params ){
								  		
								global.store.register({
									id :    params.id,
									alias : params.alias,
									type :   store.CONSUMABLE
								});

								global.store.error( params.error );

								global.store.when( params.alias ).updated(  params.updateUI  );
								
								global.store.when( params.alias ).approved( function( product ) {
								
									product.verify();
								
								});
								
								global.store.when( params.alias ).verified( params.finishPurchase );
								
							},
							itemConsumeGold : function(){
								
								let self = this,
								menuRestore = scope.qs("modal-menu-restore"), 
								container = scope.qs("gold-desc"),
								btnGold = scope.qs("btn-gold");
								 
								this.store({
									id : "com.owlpictureid.bumil.gold",
									alias : "GOLD",
									updateUI : function( product ){
										
										let fragment = scope.stringToHtml5Template(
											'<p class="m10"> '+
											'	Melakukan pembayaran sebesar  '+
											'		<b>'+ product.price +'</b>  '+
											'	untuk melakukan transaksi GOLD, tap beli untuk melanjutkan  '+
											'</p> '
										)
												
										container.innerHTML = "";
										 
										container.appendChild( fragment )
										 
										
									},
									finishPurchase : function( product ){
										
										//if( !self.isIapActive() ){}
											
											let activeIap = obj.dataStorage.IAP.active,
											dateNow = new Date(),
											dateNextYear = new Date();
											
											dateNextYear.setFullYear( dateNextYear.getFullYear() + 100 )

											activeIap.product = "GOLD";
											activeIap.dateStart = dateNow.toLocaleString("id-ID");
											activeIap.dateEnd = dateNextYear.toLocaleString("id-ID");
											  
											obj.dataStorage.IAP.history.unshift( activeIap )
											  
											scope.text( scope.qs("modal-restore-txt"), 
												'Anda telah berhasil melakukan transaksi untuk menjadi donatur GOLD,'+
												'Silahkan tutup aplikasi untuk memastikan data telah diperbarui' 
											)
											  
											obj.cordova.localStorage.put();
											
											 obj.modalMenu.behaviour.openModalFadeIn("modal-menu-restore");
											 
											product.finish();
											  
										
									},
									error : function(error) {
									 
										alert( "Pembayaran gagal " + error.code + ": " + error.message );
										 
										self.localProcess.itemConsumeGold = false;
									
									}
								});
								
								
								btnGold.addEventListener( "click", function( e ) {
									
									self.localProcess.itemConsumeGold = true;
									
									global.store.order('GOLD');
									 
									global.store.when("order").rejected(function(order) {
										
										alert( "Pembayaran gagal : transaksi pembayaran GOLD ditolak" )
										
									});
																 		
									store.when("order").cancelled(function(order) {
										
										alert( "Pembayaran gagal : transaksi pembayaran GOLD dibatalkan" )
										
									});
								})
								
								
							},
							isIapActive : function(){
								 
								let activeIap = obj.dataStorage.IAP.active;

								// activeIap.product iap terdaftar
								if( activeIap.product ){
									
									//cek IAP kadaluarsa 
									let iapDateEnd = scope.stringToDate( activeIap.dateEnd ),
									
									dateNow = new Date();
									 
									// cek IAP sdah kadaluarsa atau tidak
									// ( iapDateEnd > dateNow ) true berarti iap aktif
									
									return iapDateEnd > dateNow;
									
								}else{
										
									return false;
									
								}
								
							},
							iapUIstatus : function(){
								 
								if( this.isIapActive() ){
																	 
									let purchaseBox = scope.qs("purchase-box"),
									purchaseLabel = scope.qs("purchase-label"),
									purchaseDesc = scope.qs("purchase-label-desc"), 
									menuIap = scope.qs("menu-iap"),
									disconnectIap = scope.qs("iap-menu-disconnect"),
									iapElProduct = scope.qs("iap-product"),
									activeIap = obj.dataStorage.IAP.active,
									dateNow = new Date(),
									dateEnd = scope.stringToDate( activeIap.dateEnd ),
									product = activeIap.product,
									totDays = scope.getMinutesHourDayOrWeekBetweenDates( dateEnd, dateNow, "day" );
									 
									scope.removeClass( purchaseLabel, "hidden" )
									
									scope.text( purchaseLabel, product )
									
									scope.text( iapElProduct, activeIap.product )
									
									scope.text( purchaseDesc, "Telah menjadi Donatur "+activeIap.product+", Iklan telah ditiadakan" )
									
									scope.removeClass( purchaseBox, "hidden" )
									
									scope.addClass( menuIap, "hidden" )
									 
									scope.addClass( disconnectIap, "hidden" )
									
								}
								
							},
							init : function(){
								 
								let disconnectIap = scope.qs("iap-menu-disconnect"),
								activeIap = obj.dataStorage.IAP.active,
								menuIap = scope.qs("menu-iap");
								 
								if( global.cordova ){
 
									scope.removeClass( menuIap, "hidden" )
									
									scope.addClass( disconnectIap, "hidden" )
									  
									this.itemConsumeGold();
									  
									this.iapUIstatus();
								
									global.store.refresh();
								   
								}
							}
						},
						ads : {
							isInternetActive : false,
							interstitial : {
								randomInterval : 0,
								interaction : 0, 
								isLoaded : true,
								forceToLoad : function(){
														 
									// Create banner
									global.admob.interstitial.prepare()	 
												
									// Show the banner
									global.admob.interstitial.show();
									
								},
								generate : function( callback ){
									
									let self = this;
									
									//berarti koneksi internet ada set false namun tunggu 29 detik dulu untuk
									//memunculkan iklan force kalau trigger gagal di launch
									
									if( global.cordova ){
										 
											
										setTimeout(function(){
											 
											self.isLoaded = false;
											  
										}, 30000 ) //30 detik
										
										this.interaction =  scope.random( 7, 3 );
										 
										//admob intersitial id ca-app-pub-2736357291185199/3537103022
										//admob intersitial test ca-app-pub-3940256099942544/1033173712
										
										let interId = "c a - a p p - p u b - 2 7 3 6 3 5 7 2 9 1 1 8 5 1 9 9 / 3 5 3 7 1 0 3 0 2 2".split(" ").join("")
										
										global.admob.interstitial.config({
											id : "ca-app-pub-2736357291185199/3537103022", 
										})
 	
										self.randomInterval = scope.random( 100, 50 );
										
										let interstitialTimer = setInterval(function(){
											
											self.randomInterval--;
											
											if( obj.appConfig.ads.interstitial.interaction <= 0 && self.randomInterval <=0 ){
												 		  
												// Create banner
												global.admob.interstitial.prepare()	 
												
												// Show the banner
												global.admob.interstitial.show();
												
												self.isLoaded = true;
												
												clearInterval( interstitialTimer )
											}
											
										},1000)
										 
									}
									
								},
								init : function( callback ){
									 
									 this.generate( callback );
									
								}
							},
							banner : { 
								isBannerActive : false,
								generate : function( callback ){
									
									if( global.cordova ){
										 
										//admob banner id  c a - a p p - p u b - 2 7 3 6 3 5 7 2 9 1 1 8 5 1 9 9 / 2 1 2 6 9 8 4 2 8 8
										//admob smart banner test ca-app-pub-3940256099942544/6300978111
										let bannerId = "c a - a p p - p u b - 2 7 3 6 3 5 7 2 9 1 1 8 5 1 9 9 / 2 1 2 6 9 8 4 2 8 8".split(" ").join("")
										 
										global.admob.banner.config({
											id : bannerId,
											overlap : true, 
											size : 'BANNER',
											bannerAtTop : false
										})
									 
										// Create banner
										global.admob.banner.prepare();
  
										global.admob.banner.hide();
										 
										document.addEventListener( 'admob.banner.events.LOAD' , function(){
												 
											global.admob.banner.show();
											callback()
										});
										 
									
									}
									
								},
								init : function( needHide ){
									
									let self = this,
									additionalHeight = scope.slice( document.querySelectorAll(".additional-height") ),
									mainBtns =  scope.slice( document.querySelectorAll(".btn-main-new") ),
									menuPagingActivity =  scope.slice( document.querySelectorAll(".swiper-pagination") ),
									menuPagingRegister =  document.querySelector(".preg-test-pagination"),
									menuPagingGraph =  document.querySelector(".polar-chart-pagination"),
									modalBtn =  scope.qs("category-new-button"),
									mainBanner = scope.qs("main-banner"),
									modalBanner = scope.qs("modal-banner"),
									footerMenu = document.querySelector("footer"),
									allowMainClick = 2,
									allowModalClick = 2,
									callback = function( forceToHide ){
										 
										if( !self.isBannerActive || forceToHide ){
											
											fnMainBannerToogle("hidden")
											
											fnModalBannerToogle("hidden");
											 
											
										}else{
											 
											fnMainBannerToogle("show")
											 
											fnModalBannerToogle("show");
												 
										} 
										
									},
									fnMainBannerToogle = function( init ){
										
										if( init === "hidden" ){
													
													
											additionalHeight.forEach(function( el ){
												
												scope.addClass( el, "hidden" )
											})
											
											mainBtns.forEach(function( el ){
											
												scope.removeClass( el, "banner" )
											})
											
											scope.addClass( mainBanner, "hidden" );
											
											scope.removeClass( footerMenu, "banner" )
											 
										}else{
											
											additionalHeight.forEach(function( el ){
												
												scope.removeClass( el, "hidden" )
											})
											
											mainBtns.forEach(function( el ){
											
												scope.addClass( el, "banner" )
											})
											
											scope.removeClass( mainBanner, "hidden" );
											
											scope.addClass( footerMenu, "banner" )
											 
										}
										
									},
									fnModalBannerToogle = function( init ){
									
										if( init === "hidden" ){
												 
											scope.addClass( modalBanner, "hidden" )
											 
											scope.removeClass( modalBtn, "popup-banner" )
											 		
											scope.removeClass( menuPagingGraph, "banner" )
											 		
											scope.removeClass( menuPagingRegister, "banner" )
											 			 
											menuPagingActivity.forEach(function( el ){
												
												scope.removeClass( el, "banner" )
											})
											
										}else{
											
											scope.removeClass( modalBanner, "hidden" )
											 
											scope.addClass( modalBtn, "popup-banner" )
											 			
											scope.addClass( menuPagingRegister, "banner" )
											 			 
											scope.addClass( menuPagingGraph, "banner" )
											 		
											menuPagingActivity.forEach(function( el ){
												
												scope.addClass( el, "banner" )
											})
										
										}
									};
									 
									needHide && callback( true );
									  
									this.isBannerActive && this.generate( callback );
									 
									//prevent multiple click
									mainBanner.addEventListener( "click", function( e ) {
										
										allowMainClick--;
										
										if( !allowMainClick ){
											 
											fnMainBannerToogle("hidden")
										}
										
									})
									
									//prevent multiple click
									modalBanner.addEventListener( "click", function( e ) {
										
										allowModalClick--;
										
										if( !allowModalClick ){
											
											fnModalBannerToogle("hidden")
										}
										
									})
									  
								}
							},
							init : function(){   
								let self = this,
								dateNow = new Date(),
								
								isIapActive = obj.appConfig.iap.isIapActive();
								   
								self.banner.init("hide");
								
								/*		
								
								registerAppDate = scope.stringToDate( obj.dataStorage.appReg.register ), 
								//ikan tidak muncul ketika app baru di register 1 hari
								registerAppDate.setDate( registerAppDate.getDate() + 1 ); 
								
								if( registerAppDate < dateNow  ){
							 
								}else{
										
									//registrasi untuk iap saja	
									scope.transport({
										setTimeout : 10000,
										url: "https://api.github.com", //https://api.github.com/search/users?q=hariagustian
										type:'GET', 
										callback:function( data ){
											   
											obj.appConfig.iap.init()
										  
										}
									})  
										
								}
								*/
								
								if( obj.dataStorage.dataObject.length ){
									  
									scope.transport({
										setTimeout : 10000,
										url: "https://api.github.com", //https://api.github.com/search/users?q=hariagustian
										type:'GET',
										timeoutFn : function(){
								
											self.banner.isBannerActive = false;
											  
										},
										errorFn : function(){	
										
											self.banner.isBannerActive = false;
											  
										},
										callback:function( data ){
											    
											//user subscribe IAP 
											//return true berarti iap active jadi tambah kan ! saja biar ads gak di exe
											if( !isIapActive ){
												    
												self.banner.isBannerActive = true;
												 
												self.banner.init();
	  
												self.interstitial.init(); 
												
											}
											
											obj.appConfig.iap.init()
											 
										}
									})  
								
								}else{
									 
									//sembari user mengisi data baby baru
									//check pakai set timer
									let updateSelf = setInterval(function(){
										
										if( obj.dataStorage.dataObject.length ){
											 
											obj.appConfig.ads.init();
											
											clearInterval( updateSelf )
										}
										
									},1000)
									
								}

							}
						},
						mobile : function(){
							let tagHtml = document.getElementsByTagName("html")[0],
								mainBtns =  scope.slice( document.querySelectorAll(".btn-main-new") ),
								footerMenu = document.querySelector("footer"),
								modalBanner = scope.qs("modal-banner"),
								mainBanner = scope.qs("main-banner");
							
							if( !scope.isMobile() ){
								 
								tagHtml.setAttribute("style", "max-width:450px" )
								mainBanner.setAttribute("style", "max-width:450px; left: 50%;  transform: translateX(-50%);" )
								modalBanner.setAttribute("style", "max-width:450px; left: 50%;  transform: translateX(-50%);" )
								footerMenu.setAttribute("style", "max-width:450px; overflow:hidden;left: 50%;  transform: translateX(-50%);" )
								
						
								mainBtns.forEach(function( el ){
								
									scope.addClass( el, "fixed-el-btn-not-mobile" )
								})
								
								
							}
								
							
							
						},
						badgeHeader : function(){
							let headerLi = scope.slice( scope.qs("header-menu").querySelectorAll("li") ),
							badgeHeader = headerLi[1].querySelector(".badge");
							 
							//tampilkan aplikasi pengembang atau share whatsapp button
							//tampilkan share wa aja
							scope.addClass( headerLi[ 1 ], "hidden" ) //scope.random(2,1)
							 
							//hidden badge header kalau perndah diklik sekali
							obj.dataStorage.layoutState.badgeHeader.init  && badgeHeader.remove();
						
							scope.attachListener( scope.qs("share-love") , 'click', function(){
								
								obj.cordova.xSocialSharing.shareApp(); 
								 
							}) 
							 
							  
							scope.attachListener( scope.qs("giftbox-animate"), 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){ 
									
										obj.modal.behaviour.openModalFadeIn("modal-dev-app") 
										
										//hapus dan tandai badge header
										if( !obj.dataStorage.layoutState.badgeHeader.init ){
											
											obj.storageState({ 
												storageState : "layoutState",
												objState : "badgeHeader",
												value : {
													title : "",
													init : true
												}
											},
											function(){
												
												badgeHeader.remove();
												
											}); 
											
										}
									}
								}) 
								
							}) 
							
							
						},
						color : function( headerParams ){
 
							let header = document.getElementsByTagName("header")[0],
							main = document.getElementsByTagName("main")[0],
							headerNotify = scope.slice( document.querySelectorAll(".header-notify") ),
							btns = scope.slice( document.querySelectorAll(".btn-main-new") ), 
							notifyStrip = scope.slice( scope.qsAll("notify-strip") ),
							notifyStripB = scope.slice( scope.qsAll("notify-strip-b") ),
							inbeetweenGraph = scope.slice( scope.qsAll("inbeetween") ),
							color = obj.dataStorage.layoutState.activeColor,
							colorText = "color:"+ color +" !important";
							border = ".spinner:before { border-top-color:"+ color +" !important;border-left-color:"+ color +" !important }";
							style = "background-color:"+ color +" !important;border-color:"+ color +" !important";
							
							var styleElem = document.head.appendChild(document.createElement("style"));

							styleElem.innerHTML = border;
							
							//strip pada grafik
							inbeetweenGraph.forEach(function( objEl ){
																	
								objEl.setAttribute("style", colorText ); 
							   
							})
							 
							//notify strip  
							notifyStrip.forEach(function( objEl ){
																	
								objEl.setAttribute("style", style );
							   
							})
							
							
							//notify strip b
							notifyStripB.forEach(function( objEl ){
											
								if( !/notify-false/i.test( objEl.className ) ){
											
									objEl.setAttribute("style", style );
								
								}
							   
							})
							
								 
							//header
							!headerParams && header.setAttribute("style", style );
							
							headerNotify.forEach(function( objEl ){
																	
								objEl.setAttribute("style", style );
							   
							})
							
							
							btns.forEach(function( objEl ){
																	
								objEl.setAttribute("style", style );
							   
							})
							
							//buttons 
							scope.qs("notify-button").setAttribute("style", style ); 
							scope.qs("memo-button").setAttribute("style", style ); 
							scope.qs("tracking-button").setAttribute("style", style ); 
							scope.qs("kicker-button").setAttribute("style", style ); 
							scope.qs("contraction-button").setAttribute("style", style ); 
							scope.qs("growth-button").setAttribute("style", style ); 
							  
						} 
					},
					loadMore : {
						state :{
							kick : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							contraction : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							tracker : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							remainder : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							memo : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							weightForAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							bpdForAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							hcForAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							acForAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							flhForAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							ofdForAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							weightBumilAge : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							bpBumil : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							tfuBumil : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							bpmBumil : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 4,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							}
						
						}, 
						marker : function( init, main, data, index ){
							 
							let initState = this.state[ init ],
							element = main.querySelector(".content-load-more"); 
							 
							 
							if(function(){
								
								return !( initState.index.indexOf( index ) > -1 );
								
							}()){
								 
								if( initState.current <= initState.maximum ){
									 
									scope.removeClass( element.parentNode, "hidden" )
	  
									initState.index.push( index );
									 
									initState.current++;
									
									initState.disableState = 0;
									
									initState.element = element;
									
									scope.removeClass( element, "hidden");
									 
									scope.addClass( element, "spinner");
									
									return true
								} 
								
							} 	
								
								
							
						},
						loadVisible : function( initialCnt ){
							
							let body = document.getElementsByTagName("body")[0].getBoundingClientRect(),
							
							objLoading = scope.qs( initialCnt ).querySelector(".content-load-more").getBoundingClientRect()
							
							if( !objLoading.bottom && !objLoading.top && !objLoading.left && !objLoading.height ){ //hidden
								
								return false;
								
							}else if( body.right > objLoading.left 
								&& body.left < objLoading.left 
								&& body.bottom > objLoading.bottom ){ // visibile to screen
								
								return true;
							}
							
							return false;
						},
						loadTracker: function( params ){ 
						 
							let initState = this.state[ params.main ]; 
							  
							if( !initState.disabled && this.loadVisible( params.container ) ){
 
								
								if( params.isDataChart ){ 
									 
									obj.chart[ params.main ].init({
										loadmore : true
									});
								}else{
									
									obj.main[ params.main ]({
										loadmore : true
									});
								}
								 
								initState.current = 0; 
								
								if( initState.disableState > 0 ){
								 
									initState.disabled = true;
									
									scope.addClass( initState.element, "hidden");
									
									scope.removeClass( initState.element, "spinner");
								}
								
								initState.disableState++; 
								
								//perbaru color seperti  class nofity strip
								obj.appConfig.color( true );
								
							} 
							
						},
						init : function(){
							let self = this,
							loadMoreInterval = setInterval(function(){
								
								self.loadTracker({
									container : "kicker-content",
									main : "kick",
									isDataChart : false
								}); 
								 
								self.loadTracker({
									container : "contraction-content",
									main : "contraction",
									isDataChart : false
								}); 
								 
								self.loadTracker({
									container : "tracker-content",
									main : "tracker",
									isDataChart : false
								});
								
								self.loadTracker({
									container : "remainder-content",
									main : "remainder",
									isDataChart : false
								});
								 
								self.loadTracker({
									container : "memo-content",
									main : "memo",
									isDataChart : false
								});
								
								self.loadTracker({
									container : "wfa-wrapper",
									main : "weightForAge",
									isDataChart : true
								});
								
								self.loadTracker({
									container : "bpd-wrapper",
									main : "bpdForAge",
									isDataChart : true
								});
								
								self.loadTracker({
									container : "hc-wrapper",
									main : "hcForAge",
									isDataChart : true
								});
								
								self.loadTracker({
									container : "ac-wrapper",
									main : "acForAge",
									isDataChart : true
								});
								
								
								self.loadTracker({
									container : "flh-wrapper",
									main : "flhForAge",
									isDataChart : true
								});
								
								
								self.loadTracker({
									container : "ofd-wrapper",
									main : "ofdForAge",
									isDataChart : true
								});
																
								self.loadTracker({
									container : "weightbumil-wrapper",
									main : "weightBumilAge",
									isDataChart : true
								});
								
								self.loadTracker({
									container : "bpbumil-wrapper",
									main : "bpBumil",
									isDataChart : true
								});

								self.loadTracker({
									container : "tfubumil-wrapper",
									main : "tfuBumil",
									isDataChart : true
								});

								self.loadTracker({
									container : "bpmbumil-wrapper",
									main : "bpmBumil",
									isDataChart : true
								});

							},1000)
						}
					},
					chartActivity : {
						firstCall : false,
						activityGenerateObj : function( data ){
							
							//arrange data based on activity type
							let arrangeData = {},
							rearrangeData = [];
							data.map(function( objData, index ){
								
								if( objData.objectId === dataObject.id || objData.activityType === "Pompa Asi" ){
									
									let stringSelect = objData.activitySelect.toLowerCase().split(" ").join(""),
									stringType = objData.activityType.toLowerCase().split(" ").join(""),
									boolStringSelect =  !arrangeData[ stringSelect ],
									boolStringType =  !arrangeData[ stringType ],
									id = objData.id;
									
									if( boolStringSelect ){
										arrangeData[ stringSelect ] = {
											id : id,
											daysRecord : '',
											stringName : objData.activitySelect,
											stringType : stringType,
											totRecord : [],
											unit : objData.unit ? objData.unit : "Mililiter",
											unitShort : objData.unitShort ? objData.unitShort : "Ml",
											isRunning : objData.isRunning ,
											totDay : 0,
											totAll : [],
											totMinutes : 0,
											intervalObj : false,
											data : [ objData ]
										}
									}else if( arrangeData[ stringSelect ] ){
										arrangeData[ stringSelect ].data.push( objData );
									}
									
									if( boolStringType ){
										arrangeData[ stringType ] = {
											child : [],
											stringName : objData.activityType,
											stringType : stringType,
											totRecord : [],
											unit : objData.unit ? objData.unit : "Mililiter",
											unitShort : objData.unitShort ? objData.unitShort : "Ml",
											isRunning : objData.isRunning ,
											totDay : 0,
											totAll : [],
											totMinutes : 0,
											data : [ objData ]
										}
									}else if( arrangeData[ stringType ] ){
										arrangeData[ stringType ].data.push( objData );
									}
								
								}
								
							})
							
							//calculate 
							for( let ii in arrangeData ){
								 
								arrangeData[ii].data.map( function( objTrack, index, arr ){
									
									let objTrackerData = objTrack; 
									
									let dateStart = scope.stringToDate( objTrackerData.dateStart ),
									trackerDate = objTrackerData.dateStart.split(" ")[0],
									trackerRange = obj.dataStorage.trackerState.trackerRange;
 
									//how many recorded 
									//push what days user recorded to this activity
									arrangeData[ii].totRecord.push( trackerDate );	
									
									if( objTrackerData.dateStart && objTrackerData.dateEnd ){
										
										let dateEnd = scope.stringToDate( objTrackerData.dateEnd );
										//calculate
										
										//breast pump
										if( objTrackerData.milliliter  ){
											
											if( !arrangeData[ii].milliliter ) arrangeData[ii].milliliter = 0;
											
											arrangeData[ii].milliliter += parseFloat( objTrackerData.milliliter );
											
										}
										
										//mark as interval object
										arrangeData[ii].intervalObj = true;;
										
										//how may recorded all time
										arrangeData[ii].totAll.push( trackerDate );
										
										//remove dupArray  
										arrangeData[ii].totAll = arrangeData[ii].totAll.filter(function(item, pos, self) {
											return self.indexOf(item) == pos;
										})
										 
										//calculate avg day
										let rangeVal = /all/i.test( trackerRange ) ? arrangeData[ii].totAll.length : 
											 /bulan|minggu/i.test( trackerRange ) ? scope.getMinutesHourDayOrWeekBetweenDates( new Date(), dateStart, "day" ) : 
											 parseInt( trackerRange.split("-")[0] );
										 
										rangeVal = rangeVal === 0 ? 1 : rangeVal;
										
										
										let totDay = arrangeData[ii].totRecord.length / rangeVal;
										 
										arrangeData[ii].totDay = ( totDay >= 0 && totDay < 0.5 ) ? 1 : Math.round( totDay );  
										  
										//calculate total minute
										arrangeData[ii].totMinutes += scope.getMinutesHourDayOrWeekBetweenDates( dateEnd, dateStart, "minute" );
										
										arrangeData[ii].daysRecord = rangeVal;
										 
										//calculate total minutes when loop near end 
										if(!arr[index + 1]){
											 
											//calculate avg minute a day
											arrangeData[ii].totMinutes = Math.round( arrangeData[ii].totMinutes / rangeVal );
											
											//breast pump
											if( arrangeData[ii].milliliter  ){ 
																
												arrangeData[ii].milliliter = parseFloat( arrangeData[ii].milliliter / rangeVal / arrangeData[ii].totDay ).toFixed( 2 );
											
											}
										}
										 
									}else{ 
										
										//how may recorded all time
										arrangeData[ii].totAll.push( trackerDate );
										
										//remove dupArray  
										arrangeData[ii].totAll = arrangeData[ii].totAll.filter(function(item, pos, self) {
											return self.indexOf(item) == pos;
										})
										//calculate avg day
										let rangeVal = /all/i.test( trackerRange ) ? arrangeData[ii].totAll.length : 
											 /bulan|minggu/i.test( trackerRange ) ? scope.getMinutesHourDayOrWeekBetweenDates( new Date(), dateStart, "day" ) : 
											 parseInt( trackerRange.split("-")[0] );
										
										rangeVal = rangeVal === 0 ? 1 : rangeVal;
										
										arrangeData[ii].daysRecord = rangeVal;
										
										let totDay = arrangeData[ii].totRecord.length / rangeVal;
										arrangeData[ii].totDay =  ( totDay > 0 && totDay < 0.5 ) ? 1 : Math.round( totDay );  ;
									}
								})
							} 
							 
							   
							//rearrange data from object to array parent with child
							for( let ii in arrangeData ){
								
								let objTrackerData = arrangeData[ii]; 
								 
								//find parent
								if( ii === objTrackerData.stringType ){
							 
									//push parent
									rearrangeData.push( objTrackerData );
									
									//then store child
									for( let jj in objTrackerData.data ){
										
										let objTrackerChildData = objTrackerData.data[jj]; 
										
										for( let kk in arrangeData ){
											
											let arrangeChild = arrangeData[kk];
											 
											if( objTrackerChildData.id === arrangeChild.id ){
												 
												objTrackerData.child.push( arrangeData[kk] )
											}
										}
									}
								}
								
							}
							
							arrangeData = {};
							  
							return rearrangeData;
							
						},
						htmlTempate : function( dataTemplate, parent ){
							  
							let fragment,
							body = document.getElementsByTagName("body")[0],
							bodyHeight = body.getBoundingClientRect().height;
							
							/*modal activity */
							let elActivity = scope.qs("polar-chart-activity"),
							paginationCenter =  scope.qs("polar-chart-pagination"),
							activityTop = elActivity.getBoundingClientRect().top,
							wrapChartDeduct = bodyHeight - activityTop - 15;
							
							
							parent.setAttribute("style", "height:"+wrapChartDeduct+"px")  
							parent.innerHTML = ""; 
							 
							for( let ii in dataTemplate ){ 
									 
									fragment = scope.stringToHtml5Template(
										'<div class="swiper-slide" style="display: unset;overflow-y:scroll;height:"'+wrapChartDeduct+'px" ">'+
										'	<canvas style="position: relative; height:30vh; width:70vw"></canvas>'+
										'	<span class="m15 extrabold">'+ dataTemplate[ii].stringName +'</span>' +
										'	<ul class="list-inline border-none m15">'+
										'	</ul>'+
									    '</div>'
									 
									);
									
									let canvas = scope.getFirstChild( fragment.firstChild ),
									title = scope.sibling( canvas, "next" ),
									container =  scope.sibling( title, "next" ),
									child = dataTemplate[ii].child,
									data = {
										title : [],
										background : [],
										totDay : [],
										
									};
									  
									   
									child.map( function( objTrack, index, arr ){ 
										 
										 
										data.title.push( objTrack.stringName.toLowerCase()  ) 
										data.totDay.push( objTrack.totDay ) 
										
										let convertToHour = function(){
											let convertTimeToStr, convertTimeToArr;
											
											if( objTrack.totMinutes ){
												
												let convertTime =
												
													objTrack.totMinutes >= 60 ?  ( Math.trunc( objTrack.totMinutes  / 60 )  +'.'+ objTrack.totMinutes % 60 ) : objTrack.totMinutes;
											 
													// float
												if( !( convertTime % 1 === 0 ) ){
														console.log( objTrack.totMinutes +' '+ ( Math.trunc( objTrack.totMinutes  / 60 )  +'.'+ objTrack.totMinutes % 60 ) )
														convertTimeToArr = convertTime.split(".");
														convertTimeToStr = convertTimeToArr[0]+" jam, "+convertTimeToArr[1]+' menit';
												}else{
													//int
													convertTimeToStr = convertTime+' menit';
												}
												
											}
											
											
											return objTrack.totMinutes ? convertTimeToStr : "";
											
										}();
										
								 
										let childFragment = scope.stringToHtml5Template(
											' <li> '+ scope.ucFirst( objTrack.stringName.toLowerCase() )  +', rata rata perhari </li>' +
											' <li> dalam '+ objTrack.daysRecord+' hari </li>' +
											( objTrack.totMinutes && objTrack.isRunning ? 
												'	<li> Durasi harian '+convertToHour+' </li>' : '' ) +	
											( objTrack.totDay ? 
												' <li> Rata Rata Rekaman '+ objTrack.totDay +' kali perhari</li>' : "" )+
											( objTrack.milliliter ? 
												'	<li> '+ ( objTrack.unit ? objTrack.unit : "Mililiter" ) +' harian '+objTrack.milliliter+' '+ ( objTrack.unitShort ? objTrack.unitShort : "Ml" ) +' </li>' : '' ) +
											( arr[ index + 1 ] ? 
												' <li class="border-sparate" ></li>' : '' )
										) 
										
										container.appendChild( childFragment ) 
									} )
									
									//append element
									parent.appendChild( fragment );
								
								
									//generate chart
									let dataOptions = Object.create({
										datasets: [{
											data: data.totDay,
											backgroundColor: [
												"rgba(204, 204, 204, 0.5)",
												"rgba(255, 228, 196, 0.5)",
												"rgba(255, 206, 86, 0.5)",
												"rgba(231, 233, 237, 0.5)",
												"rgba(54, 162, 235, 0.5)"
											] 
										}],
										labels: data.title
									});
									
									var elClone = canvas.cloneNode(true);
									canvas.parentNode.replaceChild( elClone, canvas );
									
									let chart = new Chart( elClone, {
										data: dataOptions,
										type: 'polarArea'
									});
									
							}
							
							
							if( !this.firstCall ){
							
								let swiper = new Swiper('.polar-chart-activity', {
									observer: true,
									observeParents: true, 
									pagination: {
										el: '.polar-chart-pagination',
										dynamicBullets: true,
									},
									initialSlide: obj.dataStorage.layoutState.polarSwiperChart.index
								}); 
								 
								swiper.on('transitionEnd', function () {
										 
									obj.storageState({ 
										storageState : "layoutState",
										objState : "polarSwiperChart",
										value : {
											index : swiper.activeIndex 
										}
									},
									function(){}) 	 
										 
								});  
								
								this.firstCall = true;
							
							}
							 
							paginationCenter.setAttribute("style", "text-align:center;width:80px; margin : 0px auto;transform : translateX(0%)")    
							  
							 
							
							/*
							let template = scope.stringToHtml5Template(
								'<span>Aktifitas Bayi </span>' +
								' <ul class="list-inline">' +
								'	<li> Aktifitas Tidur </li>' +
								'	<li> Durasi tidur harian 10 Jam </li>' +
								'	<li> Tidur perhari 3 kali </li>' +
								'	<li class="border-sparate" ></li>' +
								'	<li> Aktifitas Tidur </li>' +
								'	<li> Durasi bermain harian 10 Jam </li>' +
								'	<li> Bermain perhari 3 kali </li>' +
								' </ul>' +
								' <canvas id="canvas-polar" width="400" height="400">'
							)
							*/ 
						},
						
						generateChart : function( params ){
							let data =  obj.dataStorage.tracker,
							dataFilterRange = obj.dateTimeRangeValidate( data, obj.dataStorage.trackerState.trackerRange ),
							dataFilterMenu = obj.stringMatchOrEmptyValidate(dataFilterRange, obj.dataStorage.trackerState.trackerMenu ),
							dataTemplate =  this.activityGenerateObj( dataFilterMenu ),
							parent = scope.qs("modal-tracker-chart").querySelector(".swiper-wrapper"),
							dataHtml = this.htmlTempate( dataTemplate, parent ); 
							 
						}
					},
					chart : {
						gender : "girl",
						generateRandomColor : function(){
						 
							let color = [ 
								'#8549ba',
								'#00a950',
								'#166a8f',
								'#537bc4',
								'#f53794',
								'#f67019',
								'#58595b'
							]
							 
							return color[ scope.random( color.length - 1, 0 ) ]
						},
						convertDataStorageToPuser : function( dataChart, storageString ){
							 
							let data = obj.dataStorage[ storageString ],
							pUser = this.gender === "boy" ? dataChart.boy.pUser : dataChart.girl.pUser,
							labelDeduct = dataChart.girl.labels[0];
							
							//clear it first
							pUser.map(function( objData, index ){
								 
								pUser[ index ] = null
							}) 
							
							
							//then update
							
							data.map(function( objData ){
								 
							
								if( objData.objectId === dataObject.id ){
									 
									let dataPuser =  storageString === "bpd" ? objData.bpd :
										storageString === "hc" ? objData.hc : //head circumference 
										storageString === "ac" ? objData.ac :
										storageString === "flh" ? objData.flh :
										storageString === "ofd" ? objData.ofd :
										storageString === "weightBumil" ? objData.weight :
										storageString === "bpBumil" ? { y : objData.systolic, x :objData.diastolic } :
										storageString === "tfuBumil" ? objData.tfu :
										storageString === "bpmBumil" ? objData.bpm :
										objData.weight;
										  
									pUser[ ( objData.weekTo ? objData.weekTo : objData.dayTo ) - labelDeduct ] = dataPuser
									
								}
								
							}) 
							
									
						},
						requireDataObject : function( params ){
							   
							let calculateMethod = dataObject.calculateMethod;
							date = calculateMethod.date;
							
							/* pregPredict = obj.pregCalculate.pergPredict,
							dateEnd = pregPredict.dueDate,
							pregNowTotalWeek = "",
							pregNowToWeek = params && params.dateSelect ?  params.dateSelect : new Date();
							  */
							  
							let pregPredict = obj.pregCalculate.pergPredict,
							dateStart = pregPredict.conceptionDate,
							dateEnd = pregPredict.dueDate,
							pregNowTotalWeek = "",
							pregNowToDays = "",
							pregNowToWeek = params && params.dateSelect ?  params.dateSelect : new Date();
							    
							switch( dataObject.calculateMethod.init ){
								
								case "usg" :
								
									let usgMethod = obj.pregCalculate.ultrasound({
										date : date.toLocaleString("id-ID"),
										dateSelect : pregNowToWeek.toLocaleString("id-ID"),
										gestasionalAge :  dataObject.calculateMethod.gestasionalAge
									});
									
									pregNowTotalWeek = usgMethod.fetusAge.weeks
									pregNowToDays = usgMethod.fetusAge.days
									
									break;
									
								case "conception" :
									
									let conceptionMethod = obj.pregCalculate.conception({
										date : date.toLocaleString("id-ID"),
										dateSelect : pregNowToWeek.toLocaleString("id-ID")
									});
																		
									pregNowTotalWeek = conceptionMethod.fetusAge.weeks
									pregNowToDays = conceptionMethod.fetusAge.days
									
									break;
									
								case "hpht" :
									
									let hphtMethod = obj.pregCalculate.lastPeriod({
										date : date.toLocaleString("id-ID"),
										dateSelect : pregNowToWeek.toLocaleString("id-ID"),
										cyclePeriode : dataObject.calculateMethod.cyclePeriode
									})
																
									pregNowTotalWeek = hphtMethod.fetusAge.weeks
									pregNowToDays = hphtMethod.fetusAge.days
									
									break	
							}
							 
							return {
								pregDateStart : dateStart,
								pregDateEnd : dateEnd,
								pregNowToWeek : pregNowToWeek,
								pregNowToDays : pregNowToDays,
								pregNowTotalWeek : pregNowTotalWeek < 0 ? 0 : pregNowTotalWeek > 40 ? 40 : pregNowTotalWeek
							};
							
						},
						generateData : function( dataChart ){
							
							
							
							let range = {}, 
							data = obj.chart.gender === "boy" ? 
								dataChart.boy : dataChart.girl,
								
							index = scope.findClosestInArr( ( dataChart.totalWeek ? dataChart.totalWeek : dataChart.totalDay ), data.labels ).index;
							
							let rangeFn = function(){ 
								
								let rangeInterval = index <= 6 ?  13 - index : // 12 maxium interval
								index >  ( data.labels.length - 6 ) ?  index - ( data.labels.length - 12 ) : 
								6, // 6 is maximum for range interval if min and max meet requirements
								
								
								bugMin = rangeInterval === 13 ? 1 : index,
								minRange = scope.indexRange( bugMin - 1, ( bugMin - 1 - rangeInterval ) ),
								
								rangeIntervalUpdate = rangeInterval - minRange.length,
								maxRange = scope.indexRange( index, ( index + parseInt( rangeInterval - rangeIntervalUpdate ) ) );	
								    
								range.labels = [];
								range.p3 = [];
								range.p5 = [];
								range.p10 = [];
								range.p50 = [];
								range.p90 = [];
								range.p95 = [];
								range.p97 = [];
								data.pUser && ( range.pUser = [] );
									 
								minRange = minRange.filter(function( val ){
									return val >= 0 //remove index min
								})
								   								  
								minRange.map(function( key ){
									if( ( data.labels[key] && minRange.length > 1 ) || data.labels[key] === 0 ){
										range.labels.push( data.labels[key] );
										data.p3 && range.p3.push( data.p3[key] );
										data.p5 && range.p5.push( data.p5[key] );
										data.p10 && range.p10.push( data.p10[key] );
										data.p50 && range.p50.push( data.p50[key] );
										data.p90 && range.p90.push( data.p90[key] );
										data.p95 && range.p95.push( data.p95[key] );
										data.p97 && range.p97.push( data.p97[key] ); 
										range.pUser.push( data.pUser[key] );
										
										 
									}
								}) 
								 
								maxRange.map(function( key ){
									 
									if( data.labels[key] ){
										
										range.labels.unshift( data.labels[key] );
										data.p3 && range.p3.unshift( data.p3[key] );
										data.p5 && range.p5.unshift( data.p5[key] );
										data.p10 && range.p10.unshift( data.p10[key] );
										data.p50 && range.p50.unshift( data.p50[key] );
										data.p90 && range.p90.unshift( data.p90[key] );
										data.p95 && range.p95.unshift( data.p95[key] );
										data.p97 && range.p97.unshift( data.p97[key] );
										range.pUser.unshift( data.pUser[key] );
										
									}
								})
								
										
								range.labels = scope.uniqueArray( range.labels.reverse() );
								range.p3 = scope.uniqueArray( range.p3.reverse() );
								range.p5 = scope.uniqueArray( range.p5.reverse() );
								range.p10 = scope.uniqueArray( range.p10.reverse() );
								range.p50 = scope.uniqueArray( range.p50.reverse() );
								range.p90 = scope.uniqueArray( range.p90.reverse() );
								range.p95 = scope.uniqueArray( range.p95.reverse() );
								range.p97 = scope.uniqueArray( range.p97.reverse() );
								range.pUser.reverse();
								 
							};
							 
							
										
							
							rangeFn(); 
								  
							return range;	
								
						},
						generateChart : function( params ){
							
								let ctx = document.getElementById( params.canvas ),
								data = obj.chart.generateData( params.data ),
								body = document.getElementsByTagName("body")[0].getBoundingClientRect();
								 
								ctx.setAttribute("style", "height:"+ body.width +"px; width:"+ body.width +"px") 
								  
								
								let dataUser  = params.color ? {
									label: 'Rekam',
									data: data.pUser,
									borderWidth: 2,
									borderDash: [5, 5],
									pointRadius : 3,
									pointStyle : 'circle',
									fill: false,
									backgroundColor: params.color,
									borderColor: params.color
								} : {},
								gender = obj.chart.gender === "boy" ? "Laki Laki" : "Perempuan",
								options = Object.create({
								  type: 'line',
								  data: {
									labels: data.labels,
									datasets: [
										dataUser,
										{
											label: 'P3',
											data: data.p3,
											borderWidth: 1,
											pointRadius: 0,
											fill: '2',
											backgroundColor: [
												'rgba(224, 170, 16, 0.5)'
											]
										},
										{
											label: 'P5',
											data: data.p5,
											borderWidth: 1,
											pointRadius: 0,
											fill: '3',
											backgroundColor: [
												'rgba(183, 224, 16, 0.4)'
											]
										},
										{
											label: 'P10',
											data: data.p10,
											borderWidth: 1,
											pointRadius: 0,
											fill: '4',
											backgroundColor:[
												'rgba(54, 183, 21, 0.5)'
											]
										},
										{
											label: 'P50',
											data: data.p50,
											borderWidth: 1,
											pointRadius: 0,
											fill: false,
											backgroundColor: [
												'rgba(54, 183, 21, 0.5)'
											]
										},
										{
											label: 'P90',
											data: data.p90,
											borderWidth: 1,
											pointRadius: 0,
											fill: '4',
											backgroundColor: [
												'rgba(54, 183, 21, 0.5)'
											]
										},
										{
											label: 'P95',
											data: data.p95,
											borderWidth: 1,
											pointRadius: 0,
											fill: '5',
											backgroundColor: [
												'rgba(183, 224, 16, 0.4)'
											]
										},
										{
											label: 'P97',
											data: data.p97,
											borderWidth: 1,
											pointRadius: 0,
											fill: '6', 
											backgroundColor: [
												'rgba(224, 170, 16, 0.5)'
											]
										} 
										]
								  },
								  options: {
									elements : {
										line :{
											tension :0.4
										}
									},  
									scales: {
										yAxes: [{
										ticks: {
											reverse: false
										}
									  }]
									},
									legend: {
										display: true,
									    labels: {
											boxWidth : 10,
											fontSize : 10,
											usePointStyle : true
										}
							 
									},
									plugins: {
										filler: {
											propagate: true
										}
									},
									layout: {
										padding: { 
											top: 15
										}
									}
								  
								  }
							 
								});
								
								//remove all event listener from chartJs
								var elClone = ctx.cloneNode(true);
								ctx.parentNode.replaceChild( elClone, ctx );
								 
								params.chartObj = new Chart( elClone, options );
								 
								 
								return {
									data : data,
									gender : gender
								};
								
						},
						updateChart : function (chart, label, data, dir, updateByLabel ) {
							labelOrigin = chart.data.labels,
							labelUpdate = label[ label.length - 1 ],
							labelText = function( dataset ){
								
								if( updateByLabel instanceof Array ) {
									
									for( var label of  updateByLabel ){
										
										if( dataset.label === label ){
												
											return true;
										}
									}
									
								}
								
								return ( updateByLabel ? false : true );
								
							};
							
							
							if( labelOrigin[ labelOrigin.length - 1 ] !== labelUpdate && dir === "right"){
							
								chart.data.labels.shift();
								chart.data.datasets.forEach((dataset, index) => {
									if( labelText(dataset) && data[ index ] ){
										dataset.data.shift();
									}
								});
								  
								  
								chart.data.labels.push( label[ label.length - 1 ] );
								chart.data.datasets.forEach((dataset, index ) => {
									
									if( labelText(dataset) &&  data[ index ] ){
										var getData = data[ index ]; 
										dataset.data.push( getData[ getData.length - 1 ] );
									}
								});
								 
							}else if( labelOrigin[ 0 ] !== label[0] && dir === "left"){
								chart.data.labels.pop();
								chart.data.datasets.forEach((dataset,index) => {
									if( labelText(dataset) &&  data[ index ] ){
										dataset.data.pop();
									}
								});
								   
								chart.data.labels.unshift( label[0] );
								 
								chart.data.datasets.forEach((dataset, index ) => {
									
									if( labelText(dataset) &&  data[ index ] ){
										var getData = data[ index ]; 
										dataset.data.unshift( getData[ 0 ] );
										
									}
								}); 
							}
							
							chart.update();
						},
						ofdForAge : {
							canvas : "canvas-ofd",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 14,
								girl : {
									labels : [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 41,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [30.1, 34.4, 38.6, 42.9, 47.1, 51.3, 55.5, 59.6, 63.5, 67.4, 71.2, 74.9, 78.4, 81.7, 84.9, 87.9, 90.7, 93.3, 95.7, 97.8, 99.6, 101.2, 102.5, 103.4, 104, 104.3, 104.1],
									p5 : [30.6, 34.9, 39.2, 43.5, 47.7, 51.9, 56.1, 60.2, 64.2, 68.2, 72, 75.7, 79.2, 82.6, 85.8, 88.8, 91.6, 94.3, 96.6, 98.8, 100.7, 102.3, 103.6, 104.6, 105.3, 105.6, 105.7],
									p10 : [31.3, 35.6, 40, 44.3, 48.6, 52.9, 57.1, 61.3, 65.4, 69.3, 73.2, 76.9, 80.5, 83.9, 87.1, 90.2, 93.1, 95.7, 98.2, 100.4, 102.3, 104, 105.4, 106.5, 107.3, 107.7, 107.8],
									p50 : [33.8, 38.3, 42.8, 47.4, 51.9, 56.3, 60.7, 65, 69.2, 73.3, 77.3, 81.2, 84.9, 88.4, 91.8, 95, 98, 100.9, 103.5, 105.9, 108, 110, 111.6, 113.1, 114.2, 115.1, 115.8],
									p90 : [36.2, 41, 45.7, 50.4, 55.1, 59.7, 64.2, 68.7, 73.1, 77.3, 81.5, 85.4, 89.3, 93, 96.5, 99.8, 103, 106, 108.8, 111.4, 113.7, 115.9, 117.9, 119.7, 121.2, 122.6, 123.7],
									p95 : [36.9, 41.7, 46.5, 51.3, 56, 60.7, 65.3, 69.8, 74.2, 78.5, 82.6, 86.7, 90.5, 94.3, 97.8, 101.2, 104.4, 107.4, 110.3, 112.9, 115.4, 117.6, 119.7, 121.5, 123.2, 124.7, 126],
									p97 : [37.4, 42.2, 47, 51.8, 56.6, 61.3, 65.9, 70.5, 74.9, 79.2, 83.4, 87.4, 91.4, 95.1, 98.7, 102.1, 105.3, 108.4, 111.3, 113.9, 116.4, 118.7, 120.8, 122.7, 124.5, 126, 127.4]
								
								}
								
							},
							updateTextModal : function( objData ){
								 
								scope.text( scope.qs("tgl-ofd"), scope.dateToYMD( objData.pregDateStart, "year" ) );	
								 
								//scope.text( scope.qs("mth-ofd"), objData.pregNowTotalWeek );							
								 
								//scope.text( scope.qs("tgl-now-ofd"),  scope.dateToYMD( objData.pregNowToWeek, "year" ) );
												 
								return objData.pregNowTotalWeek;
							},
							create : function(){
								
								//set data
								let objData = obj.chart.requireDataObject();
								       
								this.data.totalWeek =  objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "ofd" );
								
								let params = obj.chart.generateChart( this ),
								wfaWrapper = scope.qs("ofd-wrapper"),
								ctxBound = scope.id('canvas-ofd').getBoundingClientRect();
								
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("month-ofd-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								 
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								 
								//obj.dataStorage
								let main = scope.qs("ofd-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.ofd ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box scale-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.ofd ).toFixed(2) +' mm </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strOfd +' mm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								 
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "ofdForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											dateNext = data[ index + 1 ] ? data[ index + 1 ].ofd : 0,
											
											deductOfd = ( dataNote.ofd - dateNext ).toFixed(2),
											strOfd = deductOfd > 0 ? '+'+deductOfd : deductOfd < 0 ?  deductOfd : 0;
											    
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												ofd : dataNote.ofd,
												weekTo : dataNote.weekTo,
												strOfd : strOfd
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								 
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									obj.loadMore.state.ofdForAge.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
									  
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
																	  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
								}
								
								/**
									ofd detail buttons
								*/
								let flhBtns = scope.slice( scope.qs("ofd-wrapper").querySelectorAll(".bubble-small-left") );
								
								flhBtns.map(function( btnFlh, index ){
									
									scope.attachListener( btnFlh, 'click', function(){
										   
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "ofd",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("ofd-detail-conception"), scope.qs("ofd-confirm-conception")],  scope.dateToYMD( obj.pregCalculate.pergPredict.conceptionDate, "year" ));
											scope.text([scope.qs("ofd-detail-type"), scope.qs("ofd-confirm-type")],  data.weekTo );
											scope.text([scope.qs("ofd-detail-value"), scope.qs("ofd-confirm-value")], data.ofd+' mm' );
											scope.text([scope.qs("ofd-detail-recorded"), scope.qs("ofd-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("ofd-detail-datecreate"), scope.qs("ofd-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											
											scope.qs("modal-ofd-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											
											obj.modal.behaviour.openModalFadeIn("modal-ofd-detail");
											
										})  
									})
								})
								
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("ofd-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("ofd-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 14 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 21;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 20; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
										  
										scope.text(scope.qs("month-ofd-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						
						},
						flhForAge : {
							canvas : "canvas-flh",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 14,
								girl : {
									labels : [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 41,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [10.3, 13.4, 16.4, 19.4, 22.3, 25.2, 28, 30.6, 33.3, 35.8, 38.3, 40.6, 42.9, 45.1, 47.3, 49.3, 51.3, 53.2, 55, 56.7, 58.3, 59.8, 61.3, 62.6, 63.9, 65, 66.1],
									p5 : [10.6, 13.7, 16.8, 19.8, 22.7, 25.6, 28.4, 31.1, 33.7, 36.2, 38.7, 41.1, 43.4, 45.6, 47.8, 49.8, 51.8, 53.7, 55.5, 57.3, 58.9, 60.5, 61.9, 63.3, 64.6, 65.8, 66.8],
									p10 : [11.2, 14.3, 17.4, 20.4, 23.4, 26.2, 29, 31.7, 34.4, 36.9, 39.4, 41.8, 44.1, 46.4, 48.6, 50.6, 52.6, 54.6, 56.4, 58.2, 59.8, 61.4, 62.9, 64.3, 65.6, 66.9, 68],
									p50 : [13.1, 16.3, 19.5, 22.5, 25.5, 28.5, 31.3, 34.1, 36.7, 39.4, 41.9, 44.4, 46.7, 49, 51.3, 53.4, 55.5, 57.5, 59.4, 61.3, 63.1, 64.8, 66.4, 67.9, 69.4, 70.8, 72.1],
									p90 : [15.1, 18.3, 21.5, 24.7, 27.7, 30.7, 33.6, 36.4, 39.1, 41.8, 44.4, 46.9, 49.3, 51.7, 54, 56.2, 58.4, 60.5, 62.5, 64.4, 66.3, 68.1, 69.9, 71.6, 73.2, 74.7, 76.2],
									p95 : [15.6, 18.9, 22.1, 25.3, 28.3, 31.3, 34.2, 37, 39.8, 42.5, 45.1, 47.6, 50.1, 52.5, 54.8, 57, 59.2, 61.3, 63.4, 65.3, 67.2, 69.1, 70.9, 72.6, 74.3, 75.9, 77.4],
									p97 : [16, 19.3, 22.5, 25.7, 28.7, 31.7, 34.6, 37.5, 40.2, 42.9, 45.5, 48.1, 50.5, 52.9, 55.3, 57.5, 59.7, 61.9, 63.9, 65.9, 67.8, 69.7, 71.5, 73.3, 75, 76.6, 78.2]
								
								}
								
							},
							updateTextModal : function( objData ){
								 
								scope.text( scope.qs("tgl-flh"), scope.dateToYMD( objData.pregDateStart, "year" ) );	
								 
							//	scope.text( scope.qs("mth-flh"), objData.pregNowTotalWeek );							
								 
								//scope.text( scope.qs("tgl-now-flh"),  scope.dateToYMD( objData.pregNowToWeek, "year" ) );
												 
								return objData.pregNowTotalWeek;
							},
							create : function(){
								
								//set data
								let objData = obj.chart.requireDataObject();
								       
								this.data.totalWeek =  objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "flh" );
								
								let params = obj.chart.generateChart( this ),
								wfaWrapper = scope.qs("flh-wrapper"),
								ctxBound = scope.id('canvas-flh').getBoundingClientRect();
								
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("month-flh-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								 
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								 
								//obj.dataStorage
								let main = scope.qs("flh-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.flh ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box scale-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.flh ).toFixed(2) +' mm </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strFlh +' mm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								 
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "flhForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											dateNext = data[ index + 1 ] ? data[ index + 1 ].flh : 0,
											
											deductFlh = ( dataNote.flh - dateNext ).toFixed(2),
											strFlh = deductFlh > 0 ? '+'+deductFlh : deductFlh < 0 ?  deductFlh : 0;
											  
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												flh : dataNote.flh,
												weekTo : dataNote.weekTo,
												strFlh : strFlh
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								 
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									obj.loadMore.state.flhForAge.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
									  
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
																	  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
								}
								
								/**
									flh detail buttons
								*/
								let flhBtns = scope.slice( scope.qs("flh-wrapper").querySelectorAll(".bubble-small-left") );
								
								flhBtns.map(function( btnFlh, index ){
									
									scope.attachListener( btnFlh, 'click', function(){
										   
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "flh",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("flh-detail-conception"), scope.qs("flh-confirm-conception")],  scope.dateToYMD( obj.pregCalculate.pergPredict.conceptionDate, "year" ));
											scope.text([scope.qs("flh-detail-type"), scope.qs("flh-confirm-type")],  data.weekTo );
											scope.text([scope.qs("flh-detail-value"), scope.qs("flh-confirm-value")], data.flh+' mm' );
											scope.text([scope.qs("flh-detail-recorded"), scope.qs("flh-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("flh-detail-datecreate"), scope.qs("flh-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											
											scope.qs("modal-flh-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											
											obj.modal.behaviour.openModalFadeIn("modal-flh-detail");
											
										})  
									})
								})
								
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("flh-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("flh-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 14 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 21;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 20; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
										  
										scope.text(scope.qs("month-flh-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						
						},
						acForAge : {
							canvas : "canvas-ac",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 14,
								girl : {
									labels : [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 41,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [72.9, 82.9, 93, 103.1, 113.2, 123.3, 133.4, 143.4, 153.5, 163.4, 173.3, 183.2, 192.9, 202.6, 212.1, 221.4, 230.6, 239.6, 248.4, 256.9, 265.2, 273.2, 280.8, 288.1, 295.1, 301.6, 307.7],
									p5 : [73.8, 84.1, 94.3, 104.5, 114.8, 125, 135.2, 145.3, 155.5, 165.6, 175.6, 185.5, 195.4, 205.1, 214.7, 224.2, 233.5, 242.6, 251.6, 260.3, 268.7, 276.9, 284.8, 292.4, 299.6, 306.5, 312.9],
									p10 : [75.3, 85.8, 96.3, 106.7, 117.2, 127.6, 138, 148.3, 158.6, 168.9, 179, 189.1, 199.1, 209.1, 218.8, 228.5, 238, 247.4, 256.5, 265.5, 274.3, 282.8, 291, 299, 306.7, 314.1, 321.1],
									p50 : [80.6, 91.9, 103.2, 114.4, 125.6, 136.7, 147.7, 158.7, 169.6, 180.4, 191.2, 201.8, 212.4, 222.9, 233.3, 243.6, 253.8, 263.9, 273.9, 283.8, 293.6, 303.3, 312.8, 322.3, 331.6, 340.8, 349.8],
									p90 : [85.9, 98.1, 110.1, 122.1, 134, 145.8, 157.5, 169.1, 180.6, 192, 203.3, 214.5, 225.7, 236.8, 247.8, 258.7, 269.6, 280.5, 291.3, 302.2, 313, 323.8, 334.6, 345.5, 356.4, 367.4, 378.5],
									p95 : [87.4, 99.8, 112.1, 124.3, 136.4, 148.4, 160.3, 172, 183.7, 195.3, 206.8, 218.1, 229.5, 240.7, 251.9, 263, 274.1, 285.2, 296.3, 307.4, 318.5, 329.6, 340.9, 352.1, 363.5, 375, 386.7],
									p97 : [88.4, 100.9, 113.4, 125.7, 138, 150.1, 162.1, 174, 185.7, 197.4, 209, 220.5, 231.9, 243.2, 254.5, 265.8, 277, 288.3, 299.5, 310.7, 322, 333.4, 344.9, 356.4, 368.1, 379.9, 392]
								
								}
								
							},
							updateTextModal : function( objData ){
								 
								scope.text( scope.qs("tgl-ac"), scope.dateToYMD( objData.pregDateStart, "year" ) );	
								 
								//scope.text( scope.qs("mth-ac"), objData.pregNowTotalWeek );							
								 
								//scope.text( scope.qs("tgl-now-ac"),  scope.dateToYMD( objData.pregNowToWeek, "year" ) );
								
								return objData.pregNowTotalWeek;
							},
							create : function(){
								
								//set data
								let objData = obj.chart.requireDataObject();
								     
								this.data.totalWeek =  objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "ac" );
								
								let params = obj.chart.generateChart( this ),
								acWrapper = scope.qs("ac-wrapper"),
								ctxBound = scope.id('canvas-ac').getBoundingClientRect();
								 
								//update data modal
								this.updateTextModal( objData );
									 
								scope.text(scope.qs("month-ac-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								 
								//options
								 
								scope.css( acWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								
								//obj.dataStorage
								
								let main = scope.qs("ac-wrapper"), 
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.ac ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box scale-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.ac ).toFixed(2) +' mm </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strAc +' mm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
									
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "acForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											dateNext = data[ index + 1 ] ? data[ index + 1 ].ac : 0,
											
											deductAc = ( dataNote.ac - dateNext ).toFixed(2),
											strAc = deductAc > 0 ? '+'+deductAc : deductAc < 0 ?  deductAc : 0;
											
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												ac : dataNote.ac,
												weekTo : dataNote.weekTo,
												strAc : strAc
											}); 
										}	 
										
										dataEmpty = false;
										
									}
								};
								 
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									obj.loadMore.state.acForAge.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
								
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
																	  
									dataNoteFn( dataNote, index );  
								 
								})	
								 
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
								}
								
								/**
									ac detail buttons
								*/
								let acBtns = scope.slice( scope.qs("ac-wrapper").querySelectorAll(".bubble-small-left") );
								
								acBtns.map(function( btnAc, index ){
									
									scope.attachListener( btnAc, 'click', function(){
										 
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "ac",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("ac-detail-conception"), scope.qs("ac-confirm-conception")],  scope.dateToYMD( obj.pregCalculate.pergPredict.conceptionDate, "year" ));
											scope.text([scope.qs("ac-detail-type"), scope.qs("ac-confirm-type")],  data.weekTo );
											scope.text([scope.qs("ac-detail-value"), scope.qs("ac-confirm-value")], data.ac+' mm' );
											scope.text([scope.qs("ac-detail-recorded"), scope.qs("ac-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("ac-detail-datecreate"), scope.qs("ac-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											
											scope.qs("modal-ac-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											
											obj.modal.behaviour.openModalFadeIn("modal-ac-detail"); 
											
										})  
									})
								})
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("ac-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("ac-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 14 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 21;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 20; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
										   
										scope.text(scope.qs("month-ac-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						},
						hcForAge : {
							canvas : "canvas-hc",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 14,
								girl : {
									labels : [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 41,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [87.4, 99.2, 111.1, 123, 134.9, 146.8, 158.5, 170.1, 181.4, 192.6, 203.5, 214.1, 224.3, 234.1, 243.6, 252.5, 261, 268.9, 276.3, 283, 289.1, 294.5, 299.2, 303.1, 306.1, 308.3, 309.6],
									p5 : [88.7, 100.6, 112.6, 124.6, 136.6, 148.5, 160.2, 171.9, 183.3, 194.5, 205.4, 216, 226.3, 236.2, 245.7, 254.7, 263.2, 271.1, 278.5, 285.3, 291.5, 296.9, 301.7, 305.7, 308.9, 311.2, 312.7],
									p10 : [90.7, 102.8, 114.9, 127, 139.1, 151.1, 163, 174.7, 186.2, 197.5, 208.5, 219.1, 229.5, 239.4, 248.9, 258, 266.5, 274.6, 282.1, 288.9, 295.2, 300.8, 305.6, 309.8, 313.1, 315.7, 317.4],
									p50 : [97.9, 110.4, 122.9, 135.4, 147.9, 160.3, 172.5, 184.5, 196.3, 207.8, 219.1, 230, 240.5, 250.7, 260.4, 269.6, 278.4, 286.6, 294.4, 301.5, 308.1, 314.1, 319.4, 324.1, 328.1, 331.4, 333.9],
									p90 : [105, 118, 130.9, 143.9, 156.7, 169.5, 182, 194.3, 206.4, 218.2, 229.7, 240.8, 251.6, 261.9, 271.8, 281.3, 290.2, 298.7, 306.7, 314.1, 321, 327.4, 333.2, 338.4, 343, 347.1, 350.5],
									p95 : [107.1, 120.1, 133.2, 146.3, 159.2, 172.1, 184.7, 197.1, 209.3, 221.2, 232.7, 243.9, 254.7, 265.1, 275.1, 284.6, 293.6, 302.1, 310.2, 317.7, 324.7, 331.2, 337.1, 342.5, 347.3, 351.5, 355.2],
									p97 : [108.4, 121.5, 134.7, 147.8, 160.9, 173.8, 186.5, 199, 211.2, 223.1, 234.7, 245.9, 256.7, 267.2, 277.2, 286.7, 295.8, 304.4, 312.5, 320, 327.1, 333.6, 339.6, 345.1, 350, 354.4, 358.3]
								
								}
								
							},
							updateTextModal : function( objData ){
								 
								//birth date
								scope.text( scope.qs("tgl-hc"), scope.dateToYMD( objData.pregDateStart, "year" ) );	
								
								//total month
								//scope.text( scope.qs("mth-hc"), objData.pregNowTotalWeek );							
								
								//birth to date now
								//scope.text( scope.qs("tgl-now-hc"),  scope.dateToYMD( objData.pregNowToWeek, "year" ) );
								
								return objData.pregNowTotalWeek;
							},
							create : function(){
								//set data
								let objData = obj.chart.requireDataObject();
								    
								this.data.totalWeek =  objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "hc" );
								   
								let params = obj.chart.generateChart( this ),
								wfaWrapper = scope.qs("hc-wrapper"),
								ctxBound = scope.id('canvas-hc').getBoundingClientRect();
								 
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("week-hc-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								 
								//options
								
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								
								//obj.dataStorage
								let main = scope.qs("hc-wrapper"), 
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.hc ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box scale-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.hc ).toFixed(2) +' mm </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strHc +' mm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "hcForAge", main, dataNote, index ) ){
											
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											dateNext = data[ index + 1 ] ? data[ index + 1 ].hc : 0,
											
											deductHc = ( dataNote.hc - dateNext ).toFixed(2),
											strHc = deductHc > 0 ? '+'+deductHc : deductHc < 0 ?  deductHc : 0;
											    
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												hc : dataNote.hc,
												weekTo : dataNote.weekTo,
												strHc : strHc
											});  
										
										}
										
										dataEmpty = false
									}	
								};
								 
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									obj.loadMore.state.hcForAge.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
								 
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									  									  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
								}
								
								
								/**
									hc detail buttons
								*/
								let hcBtns = scope.slice( scope.qs("hc-wrapper").querySelectorAll(".bubble-small-left") );
								
								hcBtns.map(function( btnHc, index ){
									
									scope.attachListener( btnHc, 'click', function(){
										  
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "hc",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("hc-detail-conception"), scope.qs("hc-confirm-conception")],  scope.dateToYMD( obj.pregCalculate.pergPredict.conceptionDate, "year" ));
											scope.text([scope.qs("hc-detail-type"), scope.qs("hc-confirm-type")], data.weekTo );
											scope.text([scope.qs("hc-detail-value"), scope.qs("hc-confirm-value")], data.hc+' Mm' );
											scope.text([scope.qs("hc-detail-recorded"), scope.qs("hc-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("hc-detail-datecreate"), scope.qs("hc-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											
											scope.qs("modal-hc-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											  
											obj.modal.behaviour.openModalFadeIn("modal-hc-detail"); 
											
										}) 
										
									})
								})
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("hc-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("hc-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 14 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 21;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 20; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
										    
										scope.text(scope.qs("week-hc-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
										
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
									
									}
									
									
								})
								
							}
						
						},
						bpdForAge : {
							canvas : "canvas-bpd",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 24,
								girl : {
									labels : [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 41,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [26.3, 29.1, 32, 35, 38, 41.1, 44.1, 47.2, 50.3, 53.4, 56.4, 59.4, 62.3, 65.2, 67.9, 70.6, 73.1, 75.5, 77.8, 79.8, 81.7, 83.3, 84.7, 85.9, 86.7, 87.3, 87.5],
									p5 : [26.7, 29.6, 32.5, 35.5, 38.5, 41.6, 44.7, 47.8, 50.9, 54, 57, 60, 63, 65.9, 68.6, 71.3, 73.9, 76.3, 78.5, 80.6, 82.4, 84.1, 85.5, 86.7, 87.6, 88.2, 88.4],
									p10 : [27.4, 30.2, 33.2, 36.2, 39.3, 42.4, 45.5, 48.6, 51.8, 54.9, 58, 61, 64, 66.9, 69.7, 72.4, 75, 77.4, 79.7, 81.8, 83.7, 85.3, 86.8, 88, 88.9, 89.6, 89.9],
									p50 : [29.6, 32.6, 35.7, 38.8, 42, 45.2, 48.4, 51.7, 55, 58.2, 61.4, 64.5, 67.6, 70.6, 73.5, 76.3, 78.9, 81.4, 83.8, 85.9, 87.9, 89.7, 91.2, 92.5, 93.6, 94.4, 94.9],
									p90 : [31.8, 34.9, 38.1, 41.4, 44.7, 48, 51.4, 54.8, 58.1, 61.5, 64.8, 68, 71.2, 74.3, 77.3, 80.1, 82.8, 85.4, 87.8, 90.1, 92.2, 94, 95.7, 97.1, 98.3, 99.2, 99.9],
									p95 : [32.5, 35.6, 38.8, 42.1, 45.4, 48.8, 52.2, 55.6, 59, 62.4, 65.7, 69, 72.2, 75.3, 78.3, 81.2, 84, 86.6, 89, 91.3, 93.4, 95.2, 96.9, 98.4, 99.6, 100.6, 101.3],
									p97 : [32.9, 36, 39.3, 42.6, 45.9, 49.3, 52.8, 56.2, 59.6, 63, 66.4, 69.7, 72.9, 76, 79, 81.9, 84.7, 87.3, 89.8, 92, 94.1, 96, 97.7, 99.2, 100.5, 101.5, 102.3]
								
								},
								
							},
							updateTextModal : function( objData ){
								 
								scope.text( scope.qs("tgl-bpd"), scope.dateToYMD( objData.pregDateStart, "year" ) );	
								
								//scope.text( scope.qs("mth-bpd"), objData.pregNowTotalWeek );							
								
								//scope.text( scope.qs("tgl-now-bpd"),  scope.dateToYMD( objData.pregNowToWeek, "year" ) );
								
								return objData.pregNowTotalWeek; 
								
							},
							create : function(){
								
								//set data
								let objData = obj.chart.requireDataObject();
								 
								this.data.totalWeek = objData.pregNowTotalWeek;
								 
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "bpd" );
								  
								let params = obj.chart.generateChart( this ),
								wfaWrapper = scope.qs("bpd-wrapper"),
								ctxBound = scope.id('canvas-bpd').getBoundingClientRect();
								 
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("month-bpd-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								 
								
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								
								//obj.dataStorage 
								let main = scope.qs("bpd-wrapper"), 
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.bpd ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box scale-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.bpd ).toFixed(2) +' mm </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strBpd +' mm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
									
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "bpdForAge", main, dataNote, index ) ){
											
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											dateNext = data[ index + 1 ] ? data[ index + 1 ].bpd : 0,
											
											deductBpd = ( dataNote.bpd - dateNext ).toFixed(2),
											strBpd = deductBpd > 0 ? '+'+deductBpd : deductBpd < 0 ?  deductBpd : 0;
											    
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												bpd : dataNote.bpd,
												weekTo : dataNote.weekTo,
												strBpd : strBpd
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.bpdForAge.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
								
								
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									   
									dataNoteFn( dataNote, index );  
								 
								})	
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
									
								}
 
								/**
									bpd detail buttons
								*/
								let bpdBtns = scope.slice( scope.qs("bpd-wrapper").querySelectorAll(".bubble-small-left") );
								
								bpdBtns.map(function( btnBpd, index ){
									
									scope.attachListener( btnBpd, 'click', function(){
										  
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "bpd",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												
											//modal detail
											scope.text([scope.qs("bpd-detail-conception"), scope.qs("bpd-confirm-conception")],  scope.dateToYMD( obj.pregCalculate.pergPredict.conceptionDate, "year" ));
											scope.text([scope.qs("bpd-detail-type"), scope.qs("bpd-confirm-type")], data.weekTo );
											scope.text([scope.qs("bpd-detail-value"), scope.qs("bpd-confirm-value")], data.bpd +" mm" );
											scope.text([scope.qs("bpd-detail-recorded"), scope.qs("bpd-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("bpd-detail-datecreate"), scope.qs("bpd-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											
											scope.qs("modal-bpd-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											  
											obj.modal.behaviour.openModalFadeIn("modal-bpd-detail"); 
										}) 
										 
									})
								})
							
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("bpd-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("bpd-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									if( /right/i.test( this.className ) ){
										
										//base 14 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 21;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 20 ) self.data.totalWeek = 20; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
										   
										scope.text(scope.qs("month-bpd-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						},
						weightForAge : {
							canvas : "canvas-wfa",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 22,
								girl : {
									labels : [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 19,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [463, 516, 575, 641, 716, 800, 892, 994, 1106, 1227, 1357, 1495, 1641, 1792, 1948, 2106, 2265, 2422, 2574],
									p5 : [470, 524, 585, 654, 732, 818, 915, 1021, 1138, 1265, 1401, 1547, 1700, 1860, 2024, 2190, 2355, 2516, 2670],
									p10 : [481, 538, 602, 674, 757, 849, 951, 1065, 1190, 1326, 1473, 1630, 1795, 1967, 2144, 2321, 2495, 2663, 2818],
									p50 : [525, 592, 669, 756, 856, 969, 1097, 1239, 1396, 1568, 1755, 1954, 2162, 2378, 2594, 2806, 3006, 3186, 3338],
									p90 : [578, 658, 751, 858, 980, 1119, 1276, 1452, 1647, 1860, 2089, 2332, 2583, 2838, 3089, 3326, 3541, 3722, 3858],
									p95 : [596, 680, 778, 891, 1020, 1168, 1335, 1521, 1728, 1953, 2195, 2450, 2713, 2978, 3237, 3480, 3697, 3876, 4006],
									p97 : [607, 695, 796, 913, 1048, 1202, 1375, 1569, 1783, 2016, 2266, 2529, 2800, 3071, 3335, 3582, 3799, 3976, 4101]
								
								}
								
							},
							updateTextModal : function( objData ){
								  
								scope.text( scope.qs("tgl-wfa"), scope.dateToYMD( objData.pregDateStart, "year" ) );	
								
								//scope.text( scope.qs("mth-wfa"), objData.pregNowTotalWeek );							
								
								//scope.text( scope.qs("tgl-now-wfa"),  scope.dateToYMD( objData.pregNowToWeek, "year" ) );
								
								return objData.pregNowTotalWeek;  
								  
							},
							create : function(){
								  
								//set data
								let objData = obj.chart.requireDataObject();
								  
								this.data.totalWeek = objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data,"wfa" );
								 
								let params = obj.chart.generateChart( this ),
								wfaWrapper = scope.qs("wfa-wrapper"),
								ctxBound = scope.id('canvas-wfa').getBoundingClientRect();
								  
								  
								//update data modal
								this.updateTextModal( objData );
								 
								scope.text(scope.qs("month-wf-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								  
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})

							},
							init : function( objectInitial ){ 
								//obj.dataStorage
								let main = scope.qs("wfa-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.wfa ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box weight-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.weight ).toFixed(2) +' g </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strWeight +' g </abbr> ' +
										'	<ins> ' +
										'		<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'		<br> ' +
										'		<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'	</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "weightForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].weight : 0,
											
											deductWeight = ( dataNote.weight - dateNext ).toFixed(2),
											strWeight = deductWeight > 0 ? '+'+deductWeight : deductWeight < 0 ?  deductWeight : 0;
											   
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												weight : dataNote.weight,
												weekTo : dataNote.weekTo,
												strWeight : strWeight
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.weightForAge.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
								 
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									   								  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
									
								}
									
								/**
									wfa detail buttons
								*/
								let weightBtns = scope.slice( scope.qs("wfa-wrapper").querySelectorAll(".bubble-small-left") );
								
								weightBtns.map(function( btnWeight, index ){
									
									scope.attachListener( btnWeight, 'click', function(){
										  
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "wfa",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("wfa-detail-conception"), scope.qs("wfa-confirm-conception")],  scope.dateToYMD( obj.pregCalculate.pergPredict.conceptionDate, "year" ));
											scope.text([scope.qs("wfa-detail-type"), scope.qs("wfa-confirm-type")], data.weekTo );
											scope.text([scope.qs("wfa-detail-weight"), scope.qs("wfa-confirm-weight")], data.weight+' Gram' );
											scope.text([scope.qs("wfa-detail-recorded"), scope.qs("wfa-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("wfa-detail-datecreate"), scope.qs("wfa-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											
											scope.qs("modal-wfa-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											   
											obj.modal.behaviour.openModalFadeIn("modal-wfa-detail"); 
											
										})  
									})
								})
							
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("wfa-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("wfa-wrapper").querySelector(".button-left");
								  
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									  
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 22 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 28 ) self.data.totalWeek = 30;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 28 ) self.data.totalWeek = 28; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
								 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
									   
										scope.text(scope.qs("month-wf-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
							 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
									 
									}
								})
							}
						},
						weightBumilAge : {
							canvas : "canvas-weightbumil",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalDay : 0,
								girl : {
									bmi : 0,
									weightBefore : 0,
									labels : function(){
										let count = 294,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 294,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [],
									p5 : [],
									p10 : [],
									generateDateset : function(){
										let self = this,
										bmiBottom = 0,
										bmiTop = 0;
										
										obj.storageCrud({ 
											noUpdateFileSource : true,
											dataStorage : "imtBumil",
											type : "select"
										},
										function( imtSelected ){
											  
											self.bmi = imtSelected.imt;
											  
											self.weightBefore = imtSelected.weight;
											 
											if( self.bmi < 18.5 ){
												
												//underweight
												bmiBottom = 12.7;
												bmiTop = 18.14;
												
											}else if( self.bmi >= 18.5 &&  self.bmi <= 24.9 ){
												
												//normal
												bmiBottom = 11.34;
												bmiTop = 15.87;
												
											}else if( self.bmi >  24.9 &&  self.bmi <= 29.9 ){
												
												//overweight
												bmiBottom = 6.80;
												bmiTop = 11.33;
												
											}else if( self.bmi >  29.9 ){
												
												//overweight
												bmiBottom = 4.98;
												bmiTop = 9;
											}
											    
											let p3 = function(){
												
												let count = 294,
												temp = [],
												bottom = self.weightBefore + bmiBottom,
												label = 0.0001;
												
												while( count-- ){
													
													bottom += label
													
													temp.push( bottom );
												}  
												
												return temp.reverse();
												
											},
											p5 = function(){
												
												let count = 294,
												temp = [],
												top =  self.weightBefore + bmiTop,
												label = 0.0001;
												 
												while( count-- ){
													
													top += label
													
													temp.push( top );
												}  
												
												return temp.reverse();
												
											},
											p10 = function(){
												
												let count = 294,
												temp = [],
												normal =  self.weightBefore,
												label = 0.0001;
												
												while( count-- ){
													
													normal += label;
													
													temp.push( normal );
												}  
												
												return temp.reverse();
												
											}
											
											self.p3 = p3()
											
											self.p5 = p5()
											
											self.p10 = p10()
											
										})
									}
								}
								
							}, 
							generateChart : function( params ){
							
								let ctx = document.getElementById( params.canvas ),
								data = obj.chart.generateData( params.data ),
								body = document.getElementsByTagName("body")[0].getBoundingClientRect();
								 
								ctx.setAttribute("style", "height:"+ body.width +"px; width:"+ body.width +"px") 
								   
								let dataUser  = params.color ? {
									label: 'Rekam',
									data: data.pUser,
									borderWidth: 2,
									borderDash: [5, 5],
									pointRadius : 3,
									pointStyle : 'circle',
									fill: false,
									backgroundColor: params.color,
									borderColor: params.color
								} : {},
								gender = obj.chart.gender === "boy" ? "Laki Laki" : "Perempuan",
								options = Object.create({
								  type: 'line',
								  data: {
									labels: data.labels,
									datasets: [
										dataUser,
										{
											label: 'Rekomendasi berat bawah ',
											data: data.p3,
											borderWidth: 2,
											pointRadius: 0,
											fill: "2",
											borderColor : 'rgba(54, 183, 21, 0)',
											backgroundColor: [
												'rgba(54, 183, 21, 0.4)'
											]
										},
										{
											label: 'Rekomendasi berat atas',
											data: data.p5,
											borderWidth: 2,
											pointRadius: 0,
											borderColor : 'rgba(54, 183, 21, 0)',
											fill: '2',
											backgroundColor: [
												'rgba(54, 183, 21, 1)'
											]
										},
										{
											label: 'Penambahan berat',
											data: data.p10,
											borderWidth: 2,
											pointRadius: 0,
											fill: '2',
											borderColor : 'rgba(54, 183, 21, 0)',
											backgroundColor: [
												'rgba(183, 224, 16, 0.4)'
											]
										} 
										]
								  },
								  options: {
									elements : {
										line :{
											tension :0.4
										}
									},  
									scales: {
										yAxes: [{
										ticks: {
											reverse: false
										}
									  }]
									},
									legend: {
										display: false,
										labels: {
											boxWidth : 7,
											fontSize : 10,
											usePointStyle : true
										}
							 
									},
									plugins: {
										filler: {
											propagate: true
										}
									},
									layout: {
										padding: { 
											top: 15
										}
									}
								  
								  }
							 
								});
								
								//remove all event listener from chartJs
								var elClone = ctx.cloneNode(true);
								ctx.parentNode.replaceChild( elClone, ctx );
								 
								params.chartObj = new Chart( elClone, options );
								 
								 
								return {
									data : data,
									gender : gender
								};
									
							},
							
							create : function(){
								
								this.data.girl.generateDateset()
								 
								this.updateGaInDays();
 
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "weightBumil" );
								  
								let params = this.generateChart( this ),
								weightBumilWrapper = scope.qs("weightbumil-wrapper"),
								ctxBound = scope.id('canvas-weightbumil').getBoundingClientRect();
								  
								scope.text(scope.qs("month-weightbumil-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								 
								 
								scope.css( weightBumilWrapper,{
									"top": "0px"
								})
				 
							},
							updateImt : function(){
								 
								let modal = scope.qs("imtbumil-modal"), 
								inputs = scope.slice( modal.getElementsByTagName("input") ),
								dataImtArr = obj.storageFilter( obj.dataStorage.imtBumil ),
								dataImt = dataImtArr.length ? dataImtArr[0] : "",
								
								status = !dataImt ? "" :
								( dataImt.imt < 18.5 ) ? "berat kurang" :
								( dataImt.imt >= 18.5 &&  dataImt.imt <= 24.9 ) ? "berat normal" :
								( dataImt.imt > 24.9 &&  dataImt.imt <= 29.9 ) ? "berat lebih" : "obesitas",
								
								weightRecom = !dataImt ? "" :
								( dataImt.imt < 18.5 ) ? "12.7 - 18 Kg" :
								( dataImt.imt >= 18.5 &&  dataImt.imt <= 24.9 ) ? "11 - 16 Kg" :
								( dataImt.imt > 24.9 &&  dataImt.imt <= 29.9 ) ? "7 - 11 Kg" : "5 - 9 Kg",
								
								weightPraPregnant = dataImt && dataImt.weight ? dataImt.weight +" Kg" : "Isi berat badan ( Kg )",
								 
								heightPraPregnant =  dataImt && dataImt.height ? dataImt.height +" Meter" : "Isi tinggi badan ( M )";
								
								
								//data IMT bumil
								 				 
								inputs[0].setAttribute( "placeholder", weightPraPregnant  )
							
								inputs[1].setAttribute( "placeholder", heightPraPregnant )
								
								scope.text( scope.qs("imtbumil-recorded"), ( dataImt ? dataImt.imt + ( status ? " ( "+ status +" )" : "" ) : "-" )  )
								  
								scope.text( scope.qs("imtbumil-button"), "IMT bumil " + ( weightRecom ? " ( "+ weightRecom +" )" : "" ) )
								  
								scope.text( scope.qs("weightbumil-recorded"), weightRecom ? weightRecom : "-" )
								   
							},
							updateGaInDays : function(){
								
								let gaObject = obj.pregCalculate.pergPredict.fetusAge,
								ga = gaObject.weeks+" Mgg "+ (gaObject.days ? " , "+ gaObject.days+" hari" : "" ),
								gaInDays = ( gaObject.weeks * 7 ) + gaObject.days,
								data = obj.storageFilter( obj.dataStorage.weightBumil );
								
								//short ascending
								data.sort(function(a, b){
					
									return b.dayTo - a.dayTo;
									
								});
								
								//ga update
								scope.text( scope.qs("ga-recorded"), ga +" ( "+ gaInDays+" Hari )" )
 
								this.data.totalDay = data.length ? data[0].dayTo : gaInDays;
								  
							},
							init : function( objectInitial ){ 
								//obj.dataStorage
								let main = scope.qs("weightbumil-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.weightBumil ),
								dataEmpty = true,
								 								
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box weight-icon"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr>  &nbsp;&nbsp;&nbsp;'+ params.weight +' Kg </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strWeight +' </abbr> ' +
										'	<ins> ' +
										'		<span class="notify-small-title extrabold"> '+ params.strGa +' ( '+ params.dayTo +' Hr )  </span> ' +
										'		<br> ' +
										'		<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'	</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'"  bb-before="'+ params.strWeight +'"  weight="'+ params.weight +'"  ga="'+ params.strGa +' ( Hari ke '+ params.dayTo +' )"  date-record="'+ params.dateSelect +'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "weightBumilAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ), 
											  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].weight : 0,
											
											deductWeight = ( dateNext === 0 ? dateNext : dataNote.weight - dateNext ).toFixed(2),
											strWeight = deductWeight > 0 ? '+'+deductWeight : deductWeight < 0 ?  deductWeight : 0,
											gaObject = obj.chart.requireDataObject({
												dateSelect : scope.stringToDate( dataNote.dateSelect )
											}),
											gaStr = gaObject.pregNowTotalWeek+" Mgg "+ (gaObject.pregNowToDays ? " , "+ gaObject.pregNowToDays+" Hr" : "" );
										  
											contentDom({
												dateSelect : dateSelect, 
												id : dataNote.id,
												weight : parseFloat( dataNote.weight ).toFixed(2),
												dayTo : dataNote.dayTo,
												strWeight : strWeight +" Kg",
												strGa : gaStr
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								//updateImt
								this.updateImt()
								
								//short ascending
								data.sort(function(a, b){
					
									return b.dayTo - a.dayTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.weightBumilAge.reset();
								};
								 								 
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									   								  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
									
								}
									
								/**
									wfa detail buttons
								*/
								let bmiBtns = scope.slice( scope.qs("weightbumil-wrapper").querySelectorAll(".bubble-small-left") );
								
								bmiBtns.map(function( btnBmi, index ){
									
									scope.attachListener( btnBmi, 'click', function(){
										   
										scope.text([scope.qs("weightbumil-detail-conception"), scope.qs("weightbumil-confirm-conception")], this.getAttribute("ga"));
										scope.text([scope.qs("weightbumil-detail-weight"), scope.qs("weightbumil-confirm-weight")], this.getAttribute("weight") +" Kg");
										scope.text([scope.qs("weightbumil-detail-value"), scope.qs("weightbumil-confirm-value")], this.getAttribute("bb-before") );
										scope.text([scope.qs("weightbumil-detail-recorded"), scope.qs("weightbumil-confirm-recorded")], this.getAttribute("date-record") );
										
										scope.qs("modal-weightbumil-confirm").querySelector(".send-button").setAttribute( "label", this.getAttribute("label") )
										 
										obj.modal.behaviour.openModalFadeIn("modal-weightbumil-detail"); 
									 
									})
								})
								
									 
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("weightbumil-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("weightbumil-wrapper").querySelector(".button-left");
								  
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 0 day top 294 day
										
										self.data.totalDay += 1;
										if( self.data.totalDay > 294 ) self.data.totalDay = 294;//top
										
										if( self.data.totalDay <= 0 ) self.data.totalDay = 2;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalDay -= 1;
										 
										if( self.data.totalDay <= 0 ) self.data.totalDay = 0; // bottom
										
										if( self.data.totalDay >= 289 ) self.data.totalDay = 288; //top
										
										dir =  "left";
									} 
									 
									if( self.data.totalDay >= 0 && self.data.totalDay <= 294 ){
								 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10 ];
									    
										scope.text(scope.qs("month-weightbumil-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
							 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
									 
									}
								})
							}
						},
						bpBumil :{
							canvas : "canvas-bpbumil",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalDay : 22,
								girl : {
									labels : function(){
										let count = 294,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(), 
									pUser : function(){
										let count = 294,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}()
								}
								
							},
							generateChart : function( params ){
							
								let ctx = document.getElementById( params.canvas ),
								data = obj.chart.generateData( params.data ),
								body = document.getElementsByTagName("body")[0].getBoundingClientRect(),
								fnText = function(animation) {
											 
									var ctx = this.chart.ctx; 
									ctx.fillStyle = "#a2a2a2"
									ctx.textAlign = "center";
									ctx.textBaseline = "bottom";
									 
									this.data.datasets.forEach(function (dataset) {
										
										if( dataset.label === "Rekam" ){
											
											for (var i = 0; i < dataset.data.length; i++) {
												var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
												
												let posY =  -5,
												pos = dataset.data[i];
												 
												if( dataset.data[i] ){
												
												  // Draw label
												  ctx.fillStyle = '#ffffff';
												  ctx.font = '11px sans-serif';
													ctx.fillText( pos.y+" / "+pos.x , model.x, model.y + posY );
							 
												}
											}
										
										}
										
									});
									
								
								};
								 
								ctx.setAttribute("style", "height:"+ body.width +"px; width:"+ body.width +"px") 
								     
								let dataUser  = params.color ? {
									label: 'Rekam',
									data: data.pUser,
									borderWidth: 2,
									borderDash: [0, 0],
									pointRadius : 4,
									pointStyle : 'circle',
									fill: false,
									backgroundColor: "rgba(255,255,255,0.9)",
									borderColor: "rgba(255,255,255,0)"
								} : {},
								gender = obj.chart.gender === "boy" ? "Laki Laki" : "Perempuan",
								options = Object.create({
								  type: 'line',
								  data: {
									labels: [ 40,50,60,70,80,90,100,110,120 ],
									datasets: [
										dataUser,
										{
											label: 'Hypertensi tingkat II',
											data: [
												{ y :200, x :40 },
												{ y :200, x :50 },
												{ y :200, x :60 },
												{ y :200, x :70 },
												{ y :200, x :80 },
												{ y :200, x :90 },
												{ y :200, x :100 },
												{ y :200, x :110 },
												{ y :200, x :120 } ],
											
											borderWidth: 0,
											pointRadius: 0,
											fill: "3", 
											backgroundColor: 'rgba(241, 68, 74, 1)'
											 
										},
										{
											label: '',
											data: [
												null,
												null,
												null,
												null,
												null,
												null,
												{ y :200, x :100 },
												{ y :200, x :110 },
												{ y :200, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: "10", 
											backgroundColor: 'rgba(241, 68, 74, 1)'
										},
										{
											label: 'Hypertensi tingkat I',
											data: [
												{ y :160, x :40 },
												{ y :160, x :50 },
												{ y :160, x :60 },
												{ y :160, x :70 },
												{ y :160, x :80 },
												{ y :160, x :90 },
												{ y :160, x :100 },
												{ y :160, x :110 },
												{ y :160, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '5', 
											backgroundColor: 'rgba(255, 120, 120, 1)' 
										},
										{
											label: '',
											data: [
												null,
												null,
												null,
												null,
												null,
												{ y :160, x :90 },
												{ y :160, x :100 },
												{ y :160, x :110 },
												{ y :160, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: "10", 
											backgroundColor: 'rgba(255, 120, 120, 1)' 
										},
										{
											label: 'Pra Hypertensi',
											data: [
												{ y :140, x :40 },
												{ y :140, x :50 },
												{ y :140, x :60 },
												{ y :140, x :70 },
												{ y :140, x :80 },
												{ y :140, x :90 },
												{ y :140, x :100 },
												{ y :140, x :110 },
												{ y :140, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '7',
											backgroundColor: [
												'rgba(247, 166, 74,1)'
											]
										},
										{
											label: '',
											data: [
												null,
												null,
												null,
												null,
												{ y :140, x :80 },
												{ y :140, x :90 },
												{ y :140, x :100 },
												{ y :140, x :110 },
												{ y :140, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '10',
											backgroundColor: [
												'rgba(247, 166, 74,1)'
											]
										},
										{
											label: '',
											data: [ 
												{ y :120, x :40 },
												{ y :120, x :50 },
												{ y :120, x :60 },
												{ y :120, x :70 },
												{ y :120, x :80 },
												{ y :120, x :90 },
												{ y :120, x :100 },
												{ y :120, x :110 },
												{ y :120, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '9',
											backgroundColor: [
												'rgba(119, 187, 102, 1)'
											]
										},
										{
											label: '',
											data: [
												null,
												null,
												{ y :120, x :60 },
												{ y :120, x :70 },
												{ y :120, x :80 },
												{ y :120, x :90 },
												{ y :120, x :100 },
												{ y :120, x :110 },
												{ y :120, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '10',
											backgroundColor: [
												'rgba(119, 187, 102, 1)'
											]
										},
										{
											label: 'Normal',
											data: [
												{ y :90, x :40 },
												{ y :90, x :50 },
												{ y :90, x :60 },
												{ y :90, x :70 },
												{ y :90, x :80 },
												{ y :90, x :90 },
												{ y :90, x :100 },
												{ y :90, x :110 },
												{ y :90, x :120 }
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '6',
											backgroundColor: [
												'rgba( 100, 182, 255, 1 )'
											]
										},
										{
											label: 'low',
											data: [
												{ y :60, x :40 },
												{ y :60, x :50 },
												{ y :60, x :60 },
												{ y :60, x :70 },
												{ y :60, x :80 },
												{ y :60, x :90 },
												{ y :60, x :100 },
												{ y :60, x :110 },
												{ y :60, x :120 } 
											],
											borderWidth: 0,
											pointRadius: 0,
											fill: '9',
											backgroundColor: [
												'rgba( 100, 182, 255, 1 )'
											]
										}
										]
								  },
								  options: {
									elements : {
										line :{
											tension :0.000001
										}
									},  
									scales: {
										xAxes: [{
											type: 'linear',
											position: 'bottom',
											ticks: {
												userCallback: function(tick) {
													
														return tick.toString();
													
												},
											}
										}],
										yAxes: [{
											type: 'linear',
											ticks: {
												userCallback: function(tick) {
													return tick.toString();
												}
											}
										}]

									  
									},
									legend: {
										display: false,
										labels: {
											boxWidth : 7,
											fontSize : 10,
											usePointStyle : true,
										}
							 
									},
									plugins: {
										filler: {
											propagate: true
										}
									},
									layout: {
										padding: { 
											top: 15
										}
									},
									animation: {
										onProgress : fnText,
										onComplete : fnText
									}
								  
								  }
							 
								});
								
								//remove all event listener from chartJs
								var elClone = ctx.cloneNode(true);
								ctx.parentNode.replaceChild( elClone, ctx );
								 
								params.chartObj = new Chart( elClone, options );
								 
								 
								return {
									data : data,
									gender : gender
								};
								 
							},
							create : function(){
								  
								//set data
								let objData = obj.chart.requireDataObject(),
								data = obj.storageFilter( obj.dataStorage.bpBumil );
								
								//short ascending
								data.sort(function(a, b){
					
									return b.dayTo - a.dayTo;
									
								});
								
								this.color = obj.chart.generateRandomColor();
								  
								this.data.totalDay = data.length ? data[0].dayTo : objData.pregNowTotalWeek * 7 + objData.pregNowToDays ;

								obj.chart.convertDataStorageToPuser( this.data, "bpBumil" );
								  
								let params = this.generateChart( this ),
								bpBumilWrapper = scope.qs("bpbumil-wrapper"),
								ctxBound = scope.id('canvas-bpbumil').getBoundingClientRect();
								  
								scope.text(scope.qs("month-bpbumil-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								  
								scope.css( bpBumilWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){ 
								//obj.dataStorage
								let main = scope.qs("bpbumil-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.bpBumil ),
								dataEmpty = true,
								bpFn = function( params ){
									
									let systolic = params.systolic,
									diastolic = params.diastolic,
									color = "",
									status = "";
									
									if( systolic >= 160 || diastolic >= 100 ){
										
										color = "red";
										status = "Hipertensi tingkat II";
									
									}else if( systolic >= 140 || diastolic >= 90 ){
										
										color = "light-red";
										status = "Hipertensi tingkat I";
										
									}else if( systolic >= 120 || diastolic >= 80 ){
										
										color = "light-orange";
										status = "Pra hipertensi";
										
									}else if( systolic >= 90 || diastolic >= 60 ){
										
										color = "green";
										status = "Normal / Ideal";
										
									}else if( systolic < 90 || diastolic < 60 ){
										
										color = "light-blue";
										status = "Hipotensi";
										
									}
									
									return {
										color : color,
										status : status
									}
									
								},
								 								
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small" style="padding-top:26px !important;"> ' +
										'	<div class="bubble-box blood-pressure-icon" style="top:16px !important;"> ' +
										'		<div class="notify-strip-b bg-sandybrown hidden"></div> ' +
										'	</div> ' +
										'	<abbr style="top:26px !important;">  &nbsp;&nbsp;&nbsp;'+ params.systolic+" / "+params.diastolic +'  </abbr> ' + 
										'	<ins> ' +
										'		<span class="notify-small-title extrabold"> '+ params.strGa +' </span> ' +
										'		<br> ' +
										'		<span class="notify-small-detail light"> '+
										'		<label class="'+ params.color +'">' + params.status + '</label>'+
										'		'+ params.dateSelect +'</span> ' +
										'	</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" '+
										' 			status="'+ params.status +'" '+
										' 			ga="'+ params.strGa +'" '+
										' 			systolic="'+ params.systolic +'" '+
										' 			diastolic="'+ params.diastolic +'" '+
										' 			date-record="'+ params.dateSelect +'" '+
										' 			style="top:23px !important;" ></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "bpBumil", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "", true ), 
											gaObject = obj.chart.requireDataObject({
												dateSelect : scope.stringToDate( dataNote.dateSelect )
											}),
											bp = bpFn ({
												systolic : dataNote.systolic,
												diastolic : dataNote.diastolic,
											}),
											gaStr = gaObject.pregNowTotalWeek+" Mgg "+ (gaObject.pregNowToDays ? " , "+ gaObject.pregNowToDays+" Hr" : "" ) + ' ( '+ dataNote.dayTo +' Hr )';
											 
											contentDom({
												dateSelect : dateSelect, 
												id : dataNote.id,
												systolic : dataNote.systolic,
												diastolic : dataNote.diastolic,
												dayTo : dataNote.dayTo,
												strGa : gaStr,
												status : bp.status,
												color : bp.color
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								 
								//short ascending
								data.sort(function(a, b){
					
									return b.dayTo - a.dayTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.bpBumil.reset();
								};
								 								 
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									   								  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
									
								}
									
								/**
									bp detail buttons
								*/
								let bpBtns = scope.slice( scope.qs("bpbumil-wrapper").querySelectorAll(".bubble-small-left") );
								
								bpBtns.map(function( btnBp, index ){
									
									scope.attachListener( btnBp, 'click', function(){
										   
										scope.text([scope.qs("bpbumil-detail-conception"), scope.qs("bpbumil-confirm-conception")], this.getAttribute("ga"));
										scope.text([scope.qs("bpbumil-detail-status"), scope.qs("bpbumil-confirm-status")], this.getAttribute("status") );
										scope.text([scope.qs("bpbumil-detail-systolic"), scope.qs("bpbumil-confirm-systolic")], this.getAttribute("systolic") );
										scope.text([scope.qs("bpbumil-detail-diastolic"), scope.qs("bpbumil-confirm-diastolic")], this.getAttribute("diastolic") );
										scope.text([scope.qs("bpbumil-detail-recorded"), scope.qs("bpbumil-confirm-recorded")], this.getAttribute("date-record") );
										
										scope.qs("modal-bpbumil-confirm").querySelector(".send-button").setAttribute( "label", this.getAttribute("label") )
										 
										obj.modal.behaviour.openModalFadeIn("modal-bpbumil-detail"); 
									 
									})
								})
								 								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("bpbumil-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("bpbumil-wrapper").querySelector(".button-left");
								  
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									
									let dir = "";
									if( /right/i.test( this.className ) ){
										
										//base 0 day top 294 day
										
										self.data.totalDay += 1;
										if( self.data.totalDay > 294 ) self.data.totalDay = 294;//top
										
										if( self.data.totalDay <= 0 ) self.data.totalDay = 2;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalDay -= 1;
										 
										if( self.data.totalDay <= 0 ) self.data.totalDay = 0; // bottom
										
										if( self.data.totalDay >= 289 ) self.data.totalDay = 288; //top
										
										dir =  "left";
									} 
									 
									if( self.data.totalDay >= 0 && self.data.totalDay <= 294 ){
								 
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser ];
									    
										scope.text(scope.qs("month-bpbumil-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
							 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir, ["Rekam"]);
									 
									}
								})
							}
						},
						tfuBumil : {
							canvas : "canvas-tfubumil",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 16,
								girl : {
									labels : [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 26,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : [13.2,14.1,15,16,16.9,17.9,18.8,19.8,20.7,21.7,22.6,23.5,24.5,25.4,26.3,27.1,28,28.9,29.7,30.5,31.3,32,32.8,33.5,34.1,34.8,35.4],
									p5 : [13.5,14.4,15.4,16.3,17.3,18.2,19.2,20.1,21.1,22.1,23,23.9,24.9,25.8,26.7,27.6,28.4,29.3,30.1,30.9,31.7,32.5,33.2,33.9,34.6,35.3,35.9],
									p10 : [14,14.9,15.9,16.9,17.8,18.8,19.8,20.7,21.7,22.7,23.6,24.6,25.5,26.4,27.3,28.2,29.1,30,30.8,31.6,32.4,33.2,33.9,34.7,35.4,36,36.9],
									p50 : [15.8,16.8,17.8,18.8,19.8,20.8,21.8,22.8,23.8,24.7,25.7,26.7,27.7,28.6,29.6,30.5,31.4,32.3,33.2,34,34.9,35.7,36.5,37.2,38,38.7,39.3],
									p90 : [17.6,18.6,19.6,20.7,21.7,22.7,23.8,24.8,25.8,26.8,27.9,28.9,29.9,30.9,31.8,32.8,33.8,34.7,35.6,36.5,37.3,38.2,39,39.8,40.5,41.3,42],
									p95 : [18.1,19.1,20.2,21.2,22.2,23.3,24.3,25.4,26.4,27.4,28.5,29.5,30.5,31.5,32.5,33.5,34.4,35.4,36.3,37.2,38,38.9,39.7,40.5,41.3,42,42.7],
									p97 : [18.5,19.5,20.5,21.5,22.6,23.6,24.7,25.7,26.8,27.8,28.9,29.9,30.9,31.9,32.9,33.9,34.8,35.8,36.7,37.6,38.5,39.3,40.2,41,41.8,42.5,43.2]
								
								},
								
							},
							create : function(){
								  
								//set data
								let objData = obj.chart.requireDataObject(),
								data = obj.storageFilter( obj.dataStorage.tfuBumil );
								
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								  
								this.data.totalWeek = data.length ? data[0].weekTo : objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data,"tfuBumil" );
								 
								let params = obj.chart.generateChart( this ),
								tfuWrapper = scope.qs("tfubumil-wrapper"),
								ctxBound = scope.id('canvas-tfubumil').getBoundingClientRect();
								   
								scope.text(scope.qs("month-tfubumil-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								  
								//weight for age tfuWrapper
								
								//wf-age-tfuWrapper
								scope.css( tfuWrapper,{
									"top": "0px"
								})

							},
							init : function( objectInitial ){ 
								//obj.dataStorage
								let main = scope.qs("tfubumil-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.tfuBumil ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box mother-icon bg-size-75"> ' +
										'		<div class="notify-strip-b bg-sandybrown"></div> ' +
										'	</div> ' +
										'	<abbr style="margin-left: -10px"> '+ parseFloat( params.tfu ).toFixed(2) +' cm </abbr> ' +
										'	<abbr class="inbeetween extrabold cl-sandybrown">  '+ params.strTfu +' cm </abbr> ' +
										'	<ins> ' +
										'		<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'		<br> ' +
										'		<span class="notify-small-detail light"> '+ params.dateSelect +'</span> ' +
										'	</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" '+
										' 			weekTo="'+ params.weekTo+' Mgg" '+
										' 			tfu="'+ params.tfu +' cm " '+
										' 			strTfu="'+ params.strTfu +' cm " '+
										' 			date-record="'+ params.dateSelect +'" </div>'+
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "tfuBumil", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											   
											dateNext = data[ index + 1 ] ? data[ index + 1 ].tfu : 0,
											
											deductTfu = ( dateNext === 0 ? dateNext : dataNote.tfu - dateNext ).toFixed(2),
											strTfu = deductTfu > 0 ? '+'+deductTfu : deductTfu < 0 ?  deductTfu : 0;
											   
											contentDom({
												dateSelect : dateSelect, 
												id : dataNote.id, 
												weekTo : dataNote.weekTo,
												tfu : dataNote.tfu,
												strTfu : strTfu
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.tfuBumil.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
								 
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									   								  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
									
								}
									
								/**
									tfubumil detail buttons
								*/
								let tfuBtns = scope.slice( scope.qs("tfubumil-wrapper").querySelectorAll(".bubble-small-left") );
								
								tfuBtns.map(function( btnTfu, index ){
									
									scope.attachListener( btnTfu, 'click', function(){
										   
										//modal detail
										scope.text([scope.qs("tfubumil-detail-conception"), scope.qs("tfubumil-confirm-conception")], this.getAttribute("weekTo"));
										scope.text([scope.qs("tfubumil-detail-tfu"), scope.qs("tfubumil-confirm-tfu")], this.getAttribute("tfu") );
										scope.text([scope.qs("tfubumil-detail-value"), scope.qs("tfubumil-confirm-value")], this.getAttribute("strTfu") );
										scope.text([scope.qs("tfubumil-detail-recorded"), scope.qs("tfubumil-confirm-recorded")], this.getAttribute("date-record") );
										
										scope.qs("modal-tfubumil-confirm").querySelector(".send-button").setAttribute( "label", this.getAttribute("label") )
										   
										obj.modal.behaviour.openModalFadeIn("modal-tfubumil-detail"); 
									
									})
								})
							
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("tfubumil-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("tfubumil-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									if( /right/i.test( this.className ) ){
										
										//base 14 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 22 ) self.data.totalWeek = 23;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 22 ) self.data.totalWeek = 22; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5,data.p10,data.p50,data.p90,data.p95,data.p97];
										   
										scope.text(scope.qs("month-tfubumil-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						
						},
						bpmBumil : {
							canvas : "canvas-bpmbumil",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							data : {
								totalWeek : 16,
								girl : {
									labels : [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
									pUser : function(){
										let count = 30,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p3 : function(){
										let count = 30,
										label = 0.001,
										val = 120,
										temp = [];
										
										while( count-- ){
											
											val += label
											
											temp.push( val );
										}  
										 
										return temp.reverse();
										
									}(),
									p5 : function(){
										let count = 30,
										label = 0.001,
										val = 160,
										temp = [];
										
										while( count-- ){
											
											val += label
											
											temp.push( val );
										}  
										  
										
										return temp.reverse();
										
									}(),
								},
								
							},
							generateChart : function( params ){
							
								let ctx = document.getElementById( params.canvas ),
								data = obj.chart.generateData( params.data ),
								body = document.getElementsByTagName("body")[0].getBoundingClientRect();
								 
								ctx.setAttribute("style", "height:"+ body.width +"px; width:"+ body.width +"px"),
								
								ctxGradient = ctx.getContext("2d"),
								 
								gradientstroke = ctxGradient.createLinearGradient(0, 400, 0, 0);
								gradientstroke.addColorStop(0, 'rgba(54, 183, 21, 0.1)');
								gradientstroke.addColorStop(0.5, 'rgba(54, 183, 21, 0.6)');
								gradientstroke.addColorStop(1, 'rgba(54, 183, 21, 0.1)');
								
								let dataUser  = params.color ? {
									label: 'Rekam',
									data: data.pUser,
									borderWidth: 2,
									borderDash: [5, 5],
									pointRadius : 3,
									pointStyle : 'circle',
									fill: false,
									backgroundColor: params.color,
									borderColor: params.color
								} : {},
								gender = obj.chart.gender === "boy" ? "Laki Laki" : "Perempuan",
								options = Object.create({
								  type: 'line',
								  data: {
									labels: data.labels,
									datasets: [
										dataUser,
										{
											label: '',
											data: data.p3,
											borderWidth: 2,
											pointRadius: 0,
											fill: "2",
											backgroundColor: gradientstroke
										},
										{
											label: '',
											data: data.p5,
											borderWidth: 2,
											pointRadius: 0,
											fill: '2',
											backgroundColor: gradientstroke
										} 
										]
								  },
								  options: {
									elements : {
										line :{
											tension :0.4
										}
									},  
									scales: {
										yAxes: [{
										ticks: {
											reverse: false
										}
									  }]
									},
									legend: {
										display: false,
										labels: {
											boxWidth : 7,
											fontSize : 10,
											usePointStyle : true
										}
							 
									},
									plugins: {
										filler: {
											propagate: true
										}
									},
									layout: {
										padding: { 
											top: 15
										}
									}
								  
								  }
							 
								});
								
								//remove all event listener from chartJs
								var elClone = ctx.cloneNode(true);
								ctx.parentNode.replaceChild( elClone, ctx );
								 
								params.chartObj = new Chart( elClone, options );
								 
								 
								return {
									data : data,
									gender : gender
								};
									
							},
							
							create : function(){
								  
								//set data 
								let objData = obj.chart.requireDataObject(),
								data = obj.storageFilter( obj.dataStorage.bpmBumil );
								
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								  
								this.data.totalWeek = data.length ? data[0].weekTo : objData.pregNowTotalWeek;
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data,"bpmBumil" );
								 
								let params = this.generateChart( this ),
								bpmWrapper = scope.qs("bpmbumil-wrapper"),
								ctxBound = scope.id('canvas-bpmbumil').getBoundingClientRect();
								   
								scope.text(scope.qs("month-bpmbumil-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								  
								//weight for age bpmWrapper
								
								//wf-age-tfuWrapper
								scope.css( bpmWrapper,{
									"top": "0px"
								})

							},
							init : function( objectInitial ){ 
								//obj.dataStorage
								let main = scope.qs("bpmbumil-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.bpmBumil ),
								bpmFn = function( bpm ){
									
									let color = "",
									status = "";
									
									if( bpm > 160  ){
										
										color = "red";
										status = "Tinggi";
									
									}else if( bpm < 120  ){
										
										color = "light-blue";
										status = "Rendah";
									
									}else{
										
										color = "green";
										status = "Normal";
									}
									
									return {
										color : color,
										status : status
									}
									
								},
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box heart-beat-icon" style="top:2px !important;"> ' +
										'		<div class="notify-strip-b bg-sandybrown hidden"></div> ' +
										'	</div> ' +
										'	<abbr style="margin-left: -10px"> '+ parseFloat( params.bpm ) +' bpm </abbr> ' +
										'	<ins> ' +
										'		<span class="notify-small-title extrabold"> Rekaman minggu ke '+ params.weekTo +'</span> ' +
										'		<br> ' +
										'		<span class="notify-small-detail light"> '+
										'			<label class="'+ params.color +'">' + params.status + '</label>'+ 
										'			'+ params.dateSelect +'</span> ' +
										'	</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" '+ 
										' 			weekTo="'+ params.weekTo+' Mgg" '+
										' 			bpm="'+ params.bpm +' Bpm"'+
										' 			date-record="'+ params.dateSelect +'" </div>'+
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.objectId === dataObject.id ){
										
										if( obj.loadMore.marker( "bpmBumil", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											bpm = bpmFn ( dataNote.bpm );
											   
											contentDom({
												dateSelect : dateSelect, 
												id : dataNote.id, 
												weekTo : dataNote.weekTo,
												bpm : dataNote.bpm,
												status : bpm.status,
												color : bpm.color
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								//short ascending
								data.sort(function(a, b){
					
									return b.weekTo - a.weekTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.bpmBumil.reset();
								};
								
									
								//first call or another call example save, -- generate content html 
								 
								scope.addClass( containerEmpty, "hidden");
								
								data.forEach( function( dataNote, index ){
									   								  
									dataNoteFn( dataNote, index );  
								 
								})	
								
								
								if( dataEmpty ){
									 
									scope.removeClass( containerEmpty, "hidden");
									
								}
									
								/**
									bpmbumil detail buttons
								*/
								let bpmBtns = scope.slice( scope.qs("bpmbumil-wrapper").querySelectorAll(".bubble-small-left") );
								
								bpmBtns.map(function( btnBpm, index ){
									
									scope.attachListener( btnBpm, 'click', function(){
										   
										//modal detail
										scope.text([scope.qs("bpmbumil-detail-conception"), scope.qs("bpmbumil-confirm-conception")], this.getAttribute("weekTo"));
										scope.text([scope.qs("bpmbumil-detail-bpm"), scope.qs("bpmbumil-confirm-bpm")], this.getAttribute("bpm") );
										 scope.text([scope.qs("bpmbumil-detail-recorded"), scope.qs("bpmbumil-confirm-recorded")], this.getAttribute("date-record") );
										
										scope.qs("modal-bpmbumil-confirm").querySelector(".send-button").setAttribute( "label", this.getAttribute("label") )
										   
										obj.modal.behaviour.openModalFadeIn("modal-bpmbumil-detail"); 
									
									})
								})
							
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("bpmbumil-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("bpmbumil-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									if( /right/i.test( this.className ) ){
										
										//base 12 + 6 week top 40 week
										
										self.data.totalWeek += 1;
										if( self.data.totalWeek > 40 ) self.data.totalWeek = 40;//top
										
										if( self.data.totalWeek <= 17 ) self.data.totalWeek = 18;// bottom
										
										dir =  "right";
									}else {
										
										self.data.totalWeek -= 1;
										if( self.data.totalWeek <= 17 ) self.data.totalWeek = 18; // bottom
										
										if( self.data.totalWeek >= 35 ) self.data.totalWeek = 34; //top
										
										dir =  "left";
									}
								   
									if( self.data.totalWeek >= 0 && self.data.totalWeek <= 40 ){
									
										let data =  obj.chart.generateData(  self.data  ),
										dataset = [ data.pUser,data.p3,data.p5 ];
										   
										scope.text(scope.qs("month-bpmbumil-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						
						}
					},
					reupdateData : function( init ){
						  
						let modalNewUser = scope.qs("modal-preg-test-new")
						len = obj.dataStorage.dataObject.length,
						userTypeInputs = scope.slice( modalNewUser.querySelectorAll(".input-user-type") );
						
						
						//hidden or not input type
						userTypeInputs.forEach(function( inputType ){
							
							scope[ ( len && dataObject.typeSelect === 2 ? "addClass" : "removeClass" ) ]( inputType, "hidden" );
						
						})
						
						 
						//hidden or not navigate
						scope[ ( !len ? "addClass" : "removeClass" ) ]( modalNewUser.querySelector(".modal-header"), "hidden" );
						
						 
						//hidden or not trigger new button
						//scope[ ( len && dataObject.typeSelect === 1 ? "addClass" : "removeClass" ) ]( scope.qs("modal-user-list").querySelector(".button"), "hidden" ); 
						
						//update username
						scope.text( scope.qs("user-active-name"), scope.ucFirst( dataObject.name.toLowerCase() ) )
						 			

						if( !init ){
						
							this.main.tracker();
							
							this.main.memo();

							this.main.home();
							
							this.main.contraction();
							
							this.main.kick();
							
							this.main.remainder();
							 
							this.modal.userList();
							
							this.chart.weightForAge.init();
							
							this.chart.bpdForAge.init();
							
							this.chart.flhForAge.init();
							
							this.chart.ofdForAge.init();
							
							this.chart.hcForAge.init();
							
							this.chart.acForAge.init();
							
							
							if( !/hidden/i.test( scope.qs("tab-d").className ) ){
								
								this.chart.weightForAge.create();
								
								this.chart.bpdForAge.create();
								
								this.chart.flhForAge.create();
								
								this.chart.ofdForAge.create();
								
								this.chart.hcForAge.create();
								
								this.chart.acForAge.create();
							
							}else if( !/hidden/i.test( scope.qs("tab-i").className ) ){
								
								this.chart.weightBumilAge.create();
							
								this.chart.weightBumilAge.init();
								
								this.chart.bpBumil.create();
							
								this.chart.bpBumil.init();
								
								this.chart.tfuBumil.create();
							
								this.chart.tfuBumil.init();
								
								this.chart.bpmBumil.create();
							
								this.chart.bpmBumil.init();
								
							}
						
						}
					},
					noDataObjectInStorage : function(){
						
						let body = document.getElementsByTagName("body")[0];
						
						if( !obj.dataStorage.dataObject.length ){
							  
							scope.addClass( scope.qs("modal-preg-test-new").querySelector(".modal-header"), "hidden" );
							  
							obj.modal.behaviour.openModalFadeIn("modal-preg-test-new") 
							  
						
							return true
						}else{
								 
							return false;
						}
					}
				
				}
				
				//localStorage.removeItem( strHtml5Storage ) 
				//console.log(  JSON.parse( localStorage.getItem( strHtml5Storage ) ) );
				//console.log( scope.JSONstringfy( JSON.parse( localStorage.getItem( strHtml5Storage ) ) ) );
				 
				/*
				let string = "14 30.1 30.6 31.3 33.8 36.2 36.9 37.4 15 34.4 34.9 35.6 38.3 41.0 41.7 42.2 16 38.6 39.2 40.0 42.8 45.7 46.5 47.0 17 42.9 43.5 44.3 47.4 50.4 51.3 51.8 18 47.1 47.7 48.6 51.9 55.1 56.0 56.6 19 51.3 51.9 52.9 56.3 59.7 60.7 61.3 20 55.5 56.1 57.1 60.7 64.2 65.3 65.9 21 59.6 60.2 61.3 65.0 68.7 69.8 70.5 22 63.5 64.2 65.4 69.2 73.1 74.2 74.9 23 67.4 68.2 69.3 73.3 77.3 78.5 79.2 24 71.2 72.0 73.2 77.3 81.5 82.6 83.4 25 74.9 75.7 76.9 81.2 85.4 86.7 87.4 26 78.4 79.2 80.5 84.9 89.3 90.5 91.4 27 81.7 82.6 83.9 88.4 93.0 94.3 95.1 28 84.9 85.8 87.1 91.8 96.5 97.8 98.7 29 87.9 88.8 90.2 95.0 99.8 101.2 102.1 30 90.7 91.6 93.1 98.0 103.0 104.4 105.3 31 93.3 94.3 95.7 100.9 106.0 107.4 108.4 32 95.7 96.6 98.2 103.5 108.8 110.3 111.3 33 97.8 98.8 100.4 105.9 111.4 112.9 113.9 34 99.6 100.7 102.3 108.0 113.7 115.4 116.4 35 101.2 102.3 104.0 110.0 115.9 117.6 118.7 36 102.5 103.6 105.4 111.6 117.9 119.7 120.8 37 103.4 104.6 106.5 113.1 119.7 121.5 122.7 38 104.0 105.3 107.3 114.2 121.2 123.2 124.5 39 104.3 105.6 107.7 115.1 122.6 124.7 126.0 40 104.1 105.6 107.8 115.8 123.7 126.0 127.4"
				let formula = function(){
					let test = string.split(" "),
					filterByPercentile = [],
					filter = [], index = 0, indexLimit = 0;
					
					let strArr = test.reverse()
					while( strArr.length ){
						
						if( index % 8 === 0 ){
							filter.push([]);
							indexLimit++;
						}
						
						let str = strArr.pop();
						filter[ indexLimit - 1].push( str )
						 
						index++;
					}
					 
					for( let ii = 0; ii < filter[0].length ; ii++ ){
						
						filterByPercentile.push([])
						
						filter.forEach(function( objArr, index ){
							
							objArr.forEach(function( childObjArr , index ){
								
								if( index === ii ){
									
									filterByPercentile[ii].push( Math.abs( childObjArr ) );
									
								}
								
							})
							
						})
						
					}
					
					console.log( filterByPercentile )
					
				}
				*/
				//formula()
				
				obj.storage(function(){
					   
					//execute layout
					obj.layout();
					 
					obj.appConfig.mobile();
					 
					obj.cordova.appPlugin(); 
					 
					//let html content-collapse first
					obj.generateExpandCollapse();
					
					obj.cordova.backButton(); 
					 
					obj.header();
					
					obj.loadMore.init();
					
					obj.modal.behaviour.init();
					 
					obj.noDataObjectInStorage();
					
					//obj.main.memo();
					
					obj.main.remainder();
					
					obj.main.tracker();
					
					obj.main.home()
					
					obj.footer();
					
					obj.reupdateData( true );
					
					
					
					obj.modalInput.init();
					
					
					obj.modalMenu.menuRestore();
					
					
					obj.modal.backupAndRestore();
					
					
					obj.modal.appList.init();
					
					obj.modal.appRate();
					
					
					obj.modal.othersList.init();
					
					obj.modal.FaqList(); 
					
					
					obj.main.contraction();
					
					obj.modal.contractionNew.init();
					
					obj.modal.contractionDetail.init();
					 
					obj.modal.contractionConfirm.init();
					
					
					obj.main.kick();
					
					obj.modal.kickNew.init();
					
					obj.modal.kickDetail.init();
					 
					obj.modal.kickConfirm.init();
					
					obj.modalMenu.menuKicker();
					
					
					obj.modal.pregRegister.init();
					
					obj.modal.userList();
					
					obj.modal.pregDetail.init();
					
					obj.modal.pregConfirm.init();
					
					obj.modalMenu.menuGenderBaby();
					
					obj.modalMenu.menuRelativeBaby();
					
					
					
					
					obj.modal.triggerModals(); 
					
					obj.modalMenu.triggerModalMenus(); 
					 
					  
					obj.modal.trackerNew.init();
					
					obj.modal.trackerCategoryNew();
					
					obj.modal.trackerDetail();
					
					obj.modal.trackerDeleteConfirm(); 
					
					obj.modal.trackerChart();
					
					obj.modalMenu.trackerAlert();
					
					obj.modalMenu.menuTrackerActivity();
					
					obj.modalMenu.menuTrackerRange();
					 
					
					obj.modal.memoPreview.init();
					
					obj.modal.memoNew();
					  
					obj.modalMenu.menuMemo();

					
					obj.modal.remainderNew(); 
					
					obj.modal.remainderDetail.init();
					
					obj.modal.remainderDeleteConfirm();
					
					obj.modalMenu.menuRemainder();
					
					obj.generateDatePluginElement();
					
					obj.modalMenu.menuError.init()
					
					
					
					/**
						Graph
					*/
					 
					 
					obj.modal.hcageDetail.init();
					
					obj.modal.hcageDeleteConfirm.init();
					
					obj.chart.hcForAge.init();
					
					obj.modalMenu.menuHc();
		
					obj.chart.hcForAge.event();
					 
					obj.modal.hcageNew(); 
					
					
					
					obj.modal.bpdageDetail.init();
					
					obj.modal.bpdageDeleteConfirm.init();
					
					obj.chart.bpdForAge.init();
					
					obj.modalMenu.menuBpd();
					
					obj.chart.bpdForAge.event();
								
					obj.modal.bpdageNew()
					

					
					 
					obj.chart.acForAge.init();
					
					obj.modalMenu.menuAc();
					
					obj.modal.acDetail.init();
					
					obj.modal.acDeleteConfirm.init();
					 
					obj.chart.acForAge.event();
								
					obj.modal.acNew(); 
					 
					 
					 
					 
					obj.chart.ofdForAge.init(); 
					 
					obj.modalMenu.menuOfd();
					
					obj.modal.ofdDetail.init();
					
					obj.modal.ofdDeleteConfirm.init();
					
					obj.chart.ofdForAge.event();
								 
					obj.modal.ofdNew();
					
					
					
					obj.chart.flhForAge.init(); 
					 
					obj.modalMenu.menuFlh();
					
					obj.modal.flhDetail.init();
					
					obj.modal.flhDeleteConfirm.init();
					
					obj.chart.flhForAge.event();
								 
					obj.modal.flhNew();
					
					
					 
					obj.chart.weightForAge.init();
					
					obj.modal.wfageDetail.init();
					
					obj.modal.wfageDeleteConfirm.init();
					
					obj.modalMenu.menuWfa();
					 
					obj.chart.weightForAge.event();
								
					obj.modal.wfageNew(); 
					 
					 
					obj.modal.weightBumilConfirm();
					 
					obj.modal.weightBumilDetail();
					
					obj.modal.weightBumilNew();
					 
					obj.modal.imtBumilNew();
					 
					obj.chart.weightBumilAge.event();
					
					obj.chart.weightBumilAge.init();
					 
					 
					obj.modal.bpBumilConfirm();
					 
					obj.modal.bpBumilDetail();
					
					obj.modal.bpBumilNew();
					 
					obj.chart.bpBumil.init(); 
					 
					obj.chart.bpBumil.event();
					
					  
					
					obj.modal.tfuBumilConfirm();
					 
					obj.modal.tfuBumilDetail();
 
					obj.modal.tfuBumilNew();
					 
					obj.chart.tfuBumil.init(); 
					  
					obj.chart.tfuBumil.event();
					
					 
					
					obj.modal.bpmBumilConfirm();
					 
					obj.modal.bpmBumilDetail();
					
					obj.modal.bpmBumilNew();
					 
					obj.chart.bpmBumil.init(); 
					 
					obj.chart.bpmBumil.event();
					 
					 
					
					obj.modal.charityList();
					
					 
					 
					obj.appConfig.ads.init();
					
					obj.appConfig.badgeHeader();
					
					obj.appConfig.color();
					 
				});
				 
			}.bind(this), 1 );
		}
	}
	
	owl.init = function() {
			
		var utils = new modules.utils,
		_obj = {
			 
		//user
			browserWidth : function(){ return  document.body.clientWidth },
			browserHeight : function(){ return  document.body.clientHeight },
 
			dom : modules.dom, 
			time : modules.time,
			mouse : modules.mouse,
			utils : modules.utils,
			math2d : modules.math2d,
			bridge : modules.bridge,
			deligate : modules.deligate,
			transport : modules.transport
		}
		
		//replace function to its object
		owl.gui =  new owl.gui( _obj, utils.extend ); 
		
	};
	 
	owl.init();	
 
} )
 
