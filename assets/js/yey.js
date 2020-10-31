
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
			 
			this.dateToYMD = function( params ){
				 
				let date = params.date,
				withYear = params.withYear,
				withTime =  params.withTime,
				isShortYear = params.isShortYear,
				isShortMonth = params.isShortMonth,
				isShortDay = params.isShortDay,
				monthName = isShortMonth ?
					['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'] :
					['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Desember'],
				strDay= isShortDay ? 
					['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Mgg'] : 
					['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
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
				m = monthName[ date.getMonth() ],
				y = isShortYear ? date.getFullYear().toString().slice(2,4) : date.getFullYear(),
				  
				string = '' + (d <= 9 ? '0' + d : d) + ' ' + m,
			
				strTime = /hh:mm:ss/i.test( withTime ) ? hh+' : '+mm+' : '+ss :
				/mm:ss:ms/i.test( withTime ) ? mm+' : '+ss+' : '+ms :
				/mm:ss/i.test( withTime ) ? mm+' : '+ss : hh+' : '+mm ;
				      
				if( withYear && withTime ){
					
					return day +', '+ string + " "+ y +", "+strTime;
					
				}else if( withTime ){
					
					return day +', '+ string + ", "+strTime;
					
				}else if( withYear ){
					
					return day +', '+ string + " "+ y;
					
				}else{
					
					return day +', '+ string
				} 
			} 		 
			
			this.lastDayOfMonth = function( date ){
			 
				return new Date( date.getFullYear(), date.getMonth() + 1, 0 );
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
			
			this.monthDiff = function( date2, date1 ){ 
			
				 return date2.getMonth() - date1.getMonth() + 
				   (12 * (date2.getFullYear() - date1.getFullYear()))
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
			
				
			this.daysBetween = function ( params ) {

				// The number of milliseconds in one day
				const ONE_DAY = 1000 * 60 * 60 * 24;

				// Calculate the difference in milliseconds
				const differenceMs = Math.abs( params.startDate - params.endDate );

				// Convert back to days and return
				return Math.round(differenceMs / ONE_DAY);

			}
			
			this.getMinutesHourDayOrWeekBetweenDates = function( params ) {
				
				let endDate = params.endDate,
				startDate = params.startDate,
				timeString = params.timeString,
				mathType = params.mathType,
				
				diff = Date.parse( endDate ) - Date.parse( startDate ); 
				 
				totalSeconds = Math.ceil( diff / 1000 ),
				 
				totalMinuts = Math.ceil( totalSeconds / 60 ),
			 
				totalHours = Math.ceil( totalMinuts / 60 ),
				
				totalDays = Math.ceil( totalHours / 24 );
				
				totalWeek = Math.ceil( totalDays / 7 );
				   
				switch( timeString ){
					
					case "milisecond" : return Math.ceil( diff % 1000 )
						 
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
				return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
						 
						owlApp( global, owl.dataLoader[0], modules, setToMobile  );  
						
						clearInterval( self );
					}
				},1)
				  
			});
			
		}else{
			
			//let owl data stored first
			var self = setInterval(function(){
		 
				if( owl.dataLoader.length ){
					 
					owlApp( global, owl.dataLoader[0], modules, setToMobile  );  
					
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
			path: "assets/2d/", 
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
				let strHtml5Storage = "dompet-keluarga-storage"
				dataObject = "",
				swiperChartOnMove = "",
				stateFirstload = {
					pill : false
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
											
											if( babyUnRegistered && storage[ 'dataObject' ].length  
												&& !/moodlist|symptomlist/i.test( ii ) ){
												
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
								name : "Agita Sari"
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
							
							
						callback && callback();
										
					},
					storageCrud : function( getParams, callback ){
						   
						let dbProcessFn = function( params, storage ){
							
							let dataSelected = "";
							 
							switch( params.dataStorage ){
								 
								case "period" :
								
									if( params.type === "update" ){
										
										
										//check tranMarker is reg or not 
										let isReg = true;
										
										storage.period.map(function( objPeriod ){ 
											
											if( objPeriod.objectId === dataObject.id ){
												 
												isReg =  false; 
											}
										});
										
										if( isReg ){
											//register
											
											let period = params.period ? params.period : [],
											marker = params.marker ? params.marker : [];
											  
											storage["period"].unshift({ 
												objectId : dataObject.id,
												storage : period,
												marker : marker,
												note : {}
											}); 
											
										}else if( params.period && params.marker ){
											
											storage.period.map(function( objPeriod ){ 
												
												if( objPeriod.objectId === dataObject.id  ){
													
													//perbarui hanya label tanggal dan bulan saja yang identik
													for( let ii in params.marker  ){
														 
														//update marker yang ber id
														selfMarker : for( let kk in objPeriod.marker ){
															 
															if( kk === ii ){
																   
																objPeriod.marker[kk] = params.marker[ii];
																
																
																break;
																
															}else{
																//assign dengan attribut baru
																objPeriod.marker[ii] = params.marker[ii];
																
																
															}
															
														} 
													}
													   
													objPeriod.storage = params.period;
													  
												}
												
											})
											
										}
										
										//kalau ada params.note langsung simpen
										if( params.note ){
														
											//untuk notes dipisah karena disimpan berdasar recordDate
												
											storage.period.map(function( objPeriod ){ 
													
												if( objPeriod.objectId === dataObject.id  ){
																
													if( objPeriod.note[ params.recordDate ] ){
												
														let objNotes = objPeriod.note[ params.recordDate ]
														  
														objNotes.mood = params.mood;
														
														objNotes.symptom = params.symptom;
														
														objNotes.intimacy = params.intimacy;
														 
														objNotes.note = params.note;
														  
													}else{
														 
														objPeriod.note[ params.recordDate ] = {
															id : scope.uniqueString(),
															mood : params.mood,
															symptom : params.symptom,
															intimacy : params.intimacy,
															note : params.note,
															dateStart : params.dateStart
														}
														  
													}
												
												}
											
											})
										
										}
										
										
									}else if( params.type === "delete" ){

										
										self : for (let ii = 0, jj = storage.period; ii < jj.length; ii++ ) {
												 
											if( jj[ii].objectId === dataObject.id ){
												 
												 let objNote = jj[ii].note;
												  
												 for( let kk in objNote ){
													 
													 if( objNote[kk].id === params.id ){
 
														delete objNote[kk] 
														
														break self
												 
													 }
													 
												 }
												 
											}
											
										} 
										
									}
								
								 
								case "calendar" : 
									 
									if( params.type === "add" ){
										   
										storage.calendar.forEach(function( objCalendar ){
											 
											 if( dataObject.id === objCalendar.objectId ) objCalendar.active = false;
										
										})   
										   
										storage.calendar.unshift({ 
											objectId : dataObject.id,
											id : scope.uniqueString(),
											method : params.method,
											title : params.title,
											methodText : params.methodText,
											dateCreate : ( new Date() ).toLocaleString("id-ID"),
											firstPeriod : params.firstPeriod,
											intervalPeriod : params.intervalPeriod,
											avgCyclePeriod : params.avgCyclePeriod,
											shortCyclePeriod : params.shortCyclePeriod,
											longCyclePeriod : params.longCyclePeriod,
											notify : [{
												phase: 1,
												start : true,
												end : true,
											},
											{
												phase: 2,
												start : true,
												end : true,
											}],
											active : true
										});  
										 
									}else if( params.type === "update-notify"){
										   
										for (let ii = 0, jj = storage.calendar; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												 
												if( params.phase === 2 ){
													 
													if( params.notifyStart ){
														
														jj[ii].notify[1].start = false;
														
													}else if( params.notifyEnd ){
														
														jj[ii].notify[1].end = false
														
													}
													
												}
												 
												break;
											}
										} 
									} else if( params.type === "delete"){
										
										
										for (let ii = 0, jj = storage.calendar; ii < jj.length; ii++ ) {
												 
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												 
												storage.calendar.splice( ii, 1 );
												 
												break;
											}
										} 
									}
									
									
									break;
								
								case "symptomList" : 
								 
									if( params.type === "add" ){
										  
										storage.symptomList.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											name : params.name
										}); 										 
										    
									}else if( params.type === "select-title" ){
										 	 
										for( let objNoify of storage.symptomList ){
											   
											if( objNoify.name.toLowerCase() === params.name.toLowerCase()  ){
												 
												dataSelected = objNoify;
												 
												break;
											} 
										} 	
										
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.symptomList; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id ){ // && ( jj[ii].objectId === "sjdud" || dataBaby.id === jj[ii].objectId ) ){
												 
												jj.splice( ii, 1 ); 
												 
												break;
											}
										} 
									} 
									
									break;
								
								case "moodList" : 
								 
									if( params.type === "add" ){
										  
										storage.moodList.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											name : params.name
										}); 										 
										    
									}else if( params.type === "select-title" ){
										 	 
										for( let objNoify of storage.moodList ){
											   
											if( objNoify.name.toLowerCase() === params.name.toLowerCase()  ){
												 
												dataSelected = objNoify;
												 
												break;
											} 
										} 	
										
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.moodList; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id ){ // && ( jj[ii].objectId === "sjdud" || dataBaby.id === jj[ii].objectId ) ){
												 
												jj.splice( ii, 1 ); 
												 
												break;
											}
										} 
									} 
									
									break;
								
								case "inject" :
									 	 
									if( params.type === "add" ){
										   
										storage.inject.forEach(function( objInject ){
											
											if( dataObject.id === objInject.objectId ) objInject.active = false;
										
										})   
										   
										storage.inject.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											dateStart : params.dateStart,
											dateEnd : params.dateEnd,
											dateCreate : ( new Date() ).toLocaleString("id-ID"),
											title : params.title,
											notify : true,
											active : true,
											injectType : params.injectType
										});  
										 
									}else if( params.type === "update-notify"){
										 
										for (let ii = 0, jj = storage.inject; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												  
												jj[ii].notify =  false;
												 
												break;
											}
										} 
									}else if( params.type === "delete"){
										
										
										for (let ii = 0, jj = storage.inject; ii < jj.length; ii++ ) {
												 
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												 
												storage.inject.splice( ii, 1 );
												 
												break;
											}
										} 
									}
								
									break;
									 
								case "pill" :
								
									if( params.type === "add" ){
										   
										storage.pill.forEach(function( objPill ){
											
											if( dataObject.id === objPill.objectId ) objPill.active = false;
										
										})   
										   
										storage.pill.unshift({
											objectId : dataObject.id,
											id : scope.uniqueString(),
											dateStart : params.dateStart,
											dateCreate : ( new Date() ).toLocaleString("id-ID"),
											title : params.title,
											notify : true,
											active : true,
											pillTaken : [],
											pillType : params.pillType
										});  
										 
									}else if( params.type === "update-notify"){
										  
										for (let ii = 0, jj = storage.pill; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
									
												jj[ii].notify =  false;
												 
												break;
											}
										} 
									}else if( params.type === "update-pill"){
										 
										for (let ii = 0, jj = storage.pill; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												  
												//check pill already added or not 
												let pillAdded = false; 
												
												jj[ii].pillTaken.forEach(function( objTakenPil ){
													
													if( parseInt( objTakenPil.day ) === parseInt( params.day ) ){
														
														pillAdded = true;
													}
													
												})
												 
												if( !pillAdded && params.takenPill ){ // need add 
													
													jj[ii].pillTaken.push({
														day : parseInt( params.day ),
														date : params.date,
														dateCreate : ( new Date ).toLocaleString("id-ID")
													})
													
												}else if( pillAdded && !params.takenPill ){ // need remove
													
													for (let kk = 0, ll = jj[ii].pillTaken; kk < ll.length; kk++ ) {
														
														if( parseInt( ll[kk].day ) === parseInt( params.day ) ){
															 
															ll.splice( kk, 1 ); 
															
														}
														
													} 
													
												} 
												 
											}
										} 
									}else if( params.type === "delete"){
										
										
										for (let ii = 0, jj = storage.pill; ii < jj.length; ii++ ) {
												 
											if( jj[ii].id === params.id && dataObject.id === jj[ii].objectId ){
												 
												storage.pill.splice( ii, 1 );
												 
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
										   
										console.log( params )
										storage.dataObject.unshift({ 
											id : scope.uniqueString(),
											typeText : params.typeText,
											typeSelect : params.typeSelect,
											periodLength : params.periodLength,
											circleLength : params.circleLength,
											circleShort : 28,
											circleLong : 28,
											name : params.name,
											dateCreate : params.dateCreate,
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
													
													//deactive 
													storage.dataObject.map(function( objData ){ 
														objData.active =  false;
													})
													
													storage.dataObject[0].active = true;
													
													dataObject = storage.dataObject[0];
													   
													obj.reupdateData();
												}
											}
											 
										}
										   
										 
										//prevent bug error when tab e is active 
										storage.layoutState.activeLayout.tab = "tab-a";	 
										storage.layoutState.activeLayout.index = 0;			
										
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
														 		
														//corodva register notification
														obj.cordova.notification.cancel({
															id: ll[kk].cordovaId
														})  
														 
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
							 
							 
							 
							
							scope.delayFire(function(){ // prevent save multiple times in row
								 
								//save 
								obj.cordova.localStorage.put(function(){
									
									callback.call( {}, dataSelected )
									
								}); 

							},100)							
						
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
					generateExpandCollapse : function( ){
						
						let coll = scope.slice( scope.qsAll("content-collapse > ul > li") ).filter(function (item, index) {
					 
							let elLastChild = item.firstChild && scope.getLastChild( item ) || "";
							  
							return elLastChild && /content/i.test( elLastChild.className );
						});
						
						
					 
						for (var ii = 0; ii < coll.length; ii++ ) {
						  
							coll[ii].addEventListener("click", function( e ) {
								    
								if( this.querySelector(".content").contains( e.target ) ) return;
								  
								   
								var contentFocus = scope.getLastChild( this );
								 
								coll.map(function( objElement ){
									
									var content = scope.getLastChild( objElement );
									
									if ( contentFocus !== content && content.style.maxHeight ){
										
										content.style.maxHeight = null;
									}
								})
								
								if ( contentFocus.style.maxHeight ){
									
									contentFocus.style.maxHeight = null;
								} else {
									
									contentFocus.style.maxHeight = contentFocus.scrollHeight + "px";
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
							
							var objDate = new Date(),//obj.chart.requireDataObject().pregDateStart,
							year = objDate.getFullYear() - 4,
							month = objDate.getMonth() + 1,
							numberDays = new Date( year, month, 0 ).getDate(); 
						} 
						
						if( params && params.year || !params ){
							
							let registerPluginAge = [
								
							],
							registerPlugin = [  
								".datepicker-periodinterval",
								".datepicker-period",
								".datepicker-pill",
								".datepicker-inject",
								".datepicker-calendar",
								".datepicker-remainder"
								],
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
							
							
							registerPluginAge.forEach(function( objElement ){
								
								let parent = scope.qs( objElement + stringEl ),
								loop6Years = 60,
								loopInYears = year,
								index = 0;
								   
								if( !/hidden/i.test( scope.qs(objElement).className ) || !params   ){
								
									parent.innerHTML = "";
									 
									while( loop6Years-- ){
										 
										let divEl = scope.stringToHtml5Template('<div class="swiper-slide" label-index="'+ index++ +'" label-text="'+ loopInYears +'">' + loopInYears +'</div>');
										 
										loopInYears--
										 
										parent.appendChild( divEl )
									}
								}
							})
						} 
						
						if( params && params.month || !params ){
							
							let registerPlugin = [  
								".datepicker-periodinterval",
								".datepicker-period",
								".datepicker-pill",
								".datepicker-inject",
								".datepicker-calendar",
								".datepicker-remainder" ],
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
								".datepicker-periodinterval",
								".datepicker-period",
								".datepicker-pill",
								".datepicker-inject",
								".datepicker-calendar",
								".datepicker-remainder"	 ],
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
					radioButtonsFn : function( radios, returnElement, callback ){
						 
						
						/*checkbox*/
						radios.forEach(function( liEl, index ){
							
							scope.attachListener( liEl, 'click', function( e ){
								 
								let checkedEl = this.querySelector(".container-radio > div");
								
								radios.forEach(function( objRadio ){
									 
									scope.removeClass(  objRadio.querySelector(".container-radio > div"), "checked");
									
								})
								
								scope.addClass( checkedEl, "checked");
								
								let method = parseInt( checkedEl.getAttribute("method") ),
								
								text = checkedEl.getAttribute("text");
									
								if( returnElement ){	
										
									returnElement.setAttribute("method", method );
									
									returnElement.value = text;
										
										
									setTimeout(function(){
										
										obj.modalMenu.behaviour.closeRightToleftFadeout({
											end : function(){
												
												scope.removeClass( checkedEl, "checked");
												
											}
										})
										
									})	
								
								}
									
								callback && callback.call( {}, method, text )	
									
							})
						})
						
						
						
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
					checkButtonsFn : function( checkEls, callback ){
						 
						
						/*checkbox*/
						checkEls.forEach(function( liEl, index ){
							
							scope.attachListener( liEl, 'click', function( e ){
								 
								let checkedEl  = this.querySelector(".container-checkbox > div"),
								test = /checked/i.test( checkedEl.className );
								  
								scope[ test ? "removeClass" : "addClass" ]( checkedEl, "checked");
								
								let method = checkedEl.getAttribute("method"),
								
								text = test ? "" : method;
									  
								callback && callback.call( {}, text )	
									
							})
						})
						
						
						
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
							id : "com.owlpictureid.kb",
							appName : "KB Suntik Pil dan Kalender",
							fileName : "kb-database.json",
							generateDb : function(){
								/*	*/
								obj.dataStorage = {};
								
								obj.dataStorage.dataObject = [];
								
								obj.dataStorage.notification = []; 
								
								obj.dataStorage.calendar = [/*{
									objectId: "sjdud",
									id: "osicoa",
									title : "KB Kalender",
									dateCreate: "8/9/2019 12.37.20",
									firstPeriod : "8/9/2019 12.37.20",
									avgCyclePeriod : 28,
									intervalPeriod : 5,
									active : true,
									notify : true
								}*/];
								
								obj.dataStorage.pill = [];
							    
								obj.dataStorage.inject = [/*{
									active: true,
									notify: true,
									dateStart: "8/9/2019 12.37.20",
									dateCreate: "8/9/2019 12.37.20",
									title : "KB suntik 30 hari",
									injectType : 1,
									id: "Iuispa",
									objectId: "sjdud",
									title: "Pil KB Delima"
								}*/];
							    
								//defined notificationState object 
								obj.dataStorage.notificationState = {} 
							  
								//defined layoutState object 
								obj.dataStorage.layoutState = {
									activeLayout : {
										tab : "tab-e",
										index : 4
									},
								} 
								
								
							},
							updateDb : function(){
								  
								
								//hapus rateApp
								if( obj.dataStorage.rateApp ) delete obj.dataStorage.rateApp;
								
								if( !obj.dataStorage.rate ){
									
									obj.dataStorage.rate = {
										time : ( new Date ).toLocaleString("id-ID"),
										record : 0,
										state : false
									}
									
								}else if( typeof obj.dataStorage.rate.record === "undefined" ){
									
									obj.dataStorage.rate.record = 0
									
								}
								
								 
								
								//delete obj.dataStorage.period
								
								if( !obj.dataStorage.period ){
									
									obj.dataStorage.period = []
									
								}
								
								if( !dataObject.periodLength ){
									
									dataObject.periodLength = 4
									dataObject.circleLength = 28
									dataObject.circleShort = 28
									dataObject.circleLong = 28
								} 
								
								if( !obj.dataStorage.layoutState.periodDate ){
									
									obj.dataStorage.layoutState.periodDate = {
										dateStart : "",
										dateInterval : 1
									}
								}
								 
								if( !obj.dataStorage.layoutState.periodSwiperIndex ){
									
									obj.dataStorage.layoutState.periodSwiperIndex = 0
								}
								
								 
								if( !obj.dataStorage.moodList ){
									
									obj.dataStorage.moodList = [{
										name : "Sedih",
										id : "ikkdofe"
									},
									{
										name : "Gembira",
										id : "kdohwnfi"
									},
									{
										name : "Marah",
										id : "mbkfjdug"
									},
									{
										name : "Pendiam",
										id : "5fdrur0s"
									}]
									
								}
								
								if( !obj.dataStorage.symptomList ){
									
									obj.dataStorage.symptomList = [{
										name : "Sakit pinggang belakang",
										id : "ikkdofe"
									},
									{
										name : "Sakit perut",
										id : "kdohwnfi"
									},
									{
										name : "Sakit kepala",
										id : "mbkfjdug"
									},
									{
										name : "Muncul Jerawat",
										id : "5fdrur0s"
									},
									{
										name : "Tiba-tiba makan banyak",
										id : "nkhwufon1"
									},
									{
										name : "Pusing",
										id : "msbiwhfks"
									},
									{
										name : "Sering berkeringat",
										id : "mmsborjw"
									}]
									
								}
								
									
								if( !obj.dataStorage.layoutState.badgeHeader ){
									obj.dataStorage.layoutState.badgeHeader = {
										title : "kb",
										init : false
									};
								}
										
								if( !obj.dataStorage.layoutState.activeColor ){
									obj.dataStorage.layoutState.activeColor = "#ff9898";
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
								dirEntry.getDirectory('KBkeluarga', { create: true }, function (dirEntry) {
									
									dirEntry.getDirectory('database', { create: true }, function (subDirEntry) {

										self.createFile( subDirEntry, fileName, callback );

									});
								}); 
							},
							checkFileIsExist : function( callback ){
								
								let self = this,
								path = cordova.file.externalRootDirectory+'KBkeluarga'+'/database/'+ self.fileName; 
								
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
											 
												dirEntry.getDirectory('KBkeluarga', { create: true }, function (dirEntry) {
													
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
										//console.log("Successfully launched store app");
									},function(err){
										//console.log("Error launching store app: " + err);
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
										"Aplikasi untuk memantau mensturasi, KB Suntik, Pil dan Kb Kalender, download appnya di playstore",
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
										"Aplikasi untuk memantau mensturasi, KB Suntik, Pil dan Kb Kalender, download appnya di playstore",
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
									dir = cordova.file.externalRootDirectory+'KBkeluarga/database/'+fileName;
										 
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
								 
								obj.modalMenu.behaviour.openFadeIn("modal-menu-restore");
								     
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
										vibrate: true,
										title : "Catatan Kontrasepsi",
										text: params.text,
										smallIcon: 'res://alarm',
										icon: 'file://2d/kb-96-xhdpi.png',
										trigger: { 
											every : params.stringDate
										}
									});
								}else{ 
								
									global.cordova && cordova.plugins.notification.local.schedule({
										smallIcon: 'res://alarm', 
										vibrate: true,
										icon: 'file://2d/kb-96-xhdpi.png',
										id : parseInt( params.id ),
										title : "Catatan Kontrasepsi",
										text: params.text,
										trigger: { at: params.trigger }
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
						}
					},
					layout : function(){
						
						let body = document.getElementsByTagName("body")[0],
						main = document.getElementsByTagName("main")[0],
						bodyHeight = body.getBoundingClientRect().height,
						bodyWidth = body.getBoundingClientRect().width;
						    
						 
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
					layoutChartState : false,
					layoutChartUpdate : false,
					header : function(){
						let header = document.getElementsByTagName("header")[0],
						dayCalendarFn = function(){
							 
							//for day calendar
							let dayHeader =  scope.qs("calendar-day-header"),
							dayTabB = scope.qs("calendar-day-tab-c"),
							dayTabE = scope.qs("calendar-day-tab-e"),
							headerBound = header.getBoundingClientRect(),
							upperEl = scope.qs(".tab-c .header-notify").getBoundingClientRect(),
							bottomEl = scope.qs(".tab-c .modal-content.border-top.pt0").getBoundingClientRect(),
							upperEl2 = scope.slice( scope.qsAll(".tab-e .header-notify") )[1].getBoundingClientRect(),
							bottomEl2 = scope.qs(".tab-e .box-calendar-detail").getBoundingClientRect(),
							swiperEl =  scope.qs(".tab-e .swiper-slide").getBoundingClientRect(),
							dayHeaderBound = dayHeader.getBoundingClientRect(),
							isHideTabC = /hidden/i.test( scope.qs("tab-c").className ),
							isHideTabE = /hidden/i.test( scope.qs("tab-e").className );
							 
							
							if( !isHideTabE ){
									
								if( upperEl2.bottom <= headerBound.bottom  ){
									
									if(  swiperEl.x >= 0 ){
										
										scope.removeClass( dayHeader, "hidden");
										scope.addClass( dayTabE, "hidden");
									}else{
										
										scope.addClass( scope.qs("header-calender-tab-e"), "hidden")
										scope.removeClass( dayHeader, "hidden");
										 
									} 
									
								}else{
									
									scope.removeClass( dayTabE, "hidden");
									scope.addClass( dayHeader, "hidden");
									scope.removeClass( scope.qs("header-calender-tab-e"), "hidden")
									 	
										 
								}
								    								
								scope.removeClass( scope.qs("header-text-parent"), "hidden");
								
							}
						  
							//tab c
							
							if( !isHideTabC ){
								
								if( upperEl.bottom <= headerBound.bottom ){
									
									scope.removeClass( dayHeader, "hidden");
									scope.addClass( dayTabB, "hidden");
									
								}else{
									 
									scope.addClass( dayHeader, "hidden");
									scope.removeClass( dayTabB, "hidden");
								}
								 
								if( bottomEl.top <= dayHeaderBound.bottom || bottomEl.x > 0 ){
									scope.addClass( dayHeader, "hidden");
								}
							 
								
								scope.addClass( scope.qs("header-text-parent"), "hidden");
							 
							}
							
							
							if( isHideTabE && isHideTabC ){
								scope.addClass( dayHeader, "hidden");
							}
						},
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
						
						
						scope.attachListener( document.getElementsByTagName("main")[0],"scroll",function(){
							
							
							scope.delayFire(function(){ 
								dayCalendarFn(); 
							},10) //transition
						})
						
						scope.attachListener( document.getElementsByTagName("body")[0], scope.CursorStartEvent, function(el){ 
							let pos = scope.mousePosition['value'].pos.mousemove;
							objTrack.headerY = header.getBoundingClientRect().top;
							objTrack.start.capture = false
							 
							//capture scroll 
							if( !objTrack.scroll.capture ){
								 
								scope.css(document.getElementsByTagName("main")[0], { 
									"overflow-y":'scroll'
								})
								  
								objTrack.scroll.reset();
							}
							  
							dayCalendarFn();
							 
						})
						
						scope.attachListener( document.getElementsByTagName("body")[0], scope.CursorEndEvent, function(el){ 
							let pos = scope.mousePosition['value'].pos.mousemove,
							bodyBound = document.getElementsByTagName("body")[0].getBoundingClientRect(),
							headerBound = header.getBoundingClientRect(),
							tabs = scope.slice( scope.qsAll("tab") ),
							value = 0;
							 
							value = objTrack.end < -30 ? -62 : 0;
							
							 
							scope.css(header, { 
								transform:'0px,' +value + 'px,0px',
								transition: 'transform 150ms ease-in-out 0ms'
							})
							 
							scope.css(scope.qs("main-wrap"), { 
								transform:'0px,' +value + 'px,0px',
								transition: 'transform 150ms ease-in-out 0ms'
							})
							 
							dayCalendarFn();
							
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
						 							 
							dayCalendarFn();
							
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
							
							scope.addClass( scope.qs("remainder-button"), "hidden" );
							scope.addClass( scope.qs("pill-button"), "hidden" );
							scope.addClass( scope.qs("inject-button"), "hidden" );
							scope.addClass( scope.qs("calendar-button"), "hidden" );
							scope.addClass( scope.qs("period-button"), "hidden" );
							
							if( labelClass === "tab-a" ){
								  
								scope.removeClass( scope.qs("pill-button"), "hidden" );
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-a";
								  
								updateTabFn({
									tab : "tab-a",
									index : 1
								}) 
								
								swiper.slideTo( 2, 300 );
								 
							}else if ( labelClass === "tab-b" ){
								  
								scope.removeClass( scope.qs("inject-button"), "hidden" );
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-b";
								  
								updateTabFn({
									tab : "tab-b",
									index : 2
								}) 
								
								swiper.slideTo( 3, 300 );
								 
								 
							}else if ( labelClass === "tab-c" ){
								  
								scope.removeClass( scope.qs("calendar-button"), "hidden" );
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-c";
								  
								updateTabFn({
									tab : "tab-c",
									index : 3
								}) 
								
								swiper.slideTo( 4, 300 );
								 
								 
							}else if ( labelClass === "tab-d" ){
								  
								scope.removeClass( scope.qs("remainder-button"), "hidden" );
								
								obj.dataStorage.layoutState.activeLayout.tab = "tab-d";
								  
								updateTabFn({
									tab : "tab-d",
									index :4
								}) 
								
								swiper.slideTo( 5, 300 );
								 
								 
							} else if ( labelClass === "tab-e" ){
									  
								scope.removeClass( scope.qs("period-button"), "hidden" );
								   
								obj.dataStorage.layoutState.activeLayout.tab = "tab-e";
								  
								updateTabFn({
									tab : "tab-e",
									index :0
								}) 
								
								//swiper.slideTo( 1, 300 );
								 
								 
							} 
							
							scope.removeClass( scope.qs( labelClass ), "hidden" );
							
							//active tab to top
							if( headerBound <= -62 ){
								
								scope.qs( labelClass ).scrollIntoView();
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
						  
							header.className = "bg-pink"
								  
							switch( obj.dataStorage.layoutState.activeLayout.tab ){
								
								case "tab-a" :
								  
									scope.removeClass( scope.qs("pill-button"), "hidden" );
									
									scope.addClass( divs[1], "active" );
									  
									break;
								 
								
								case "tab-b" :
								  
									scope.removeClass( scope.qs("inject-button"), "hidden" );
									
									scope.addClass( divs[2], "active" );
									  
									break;
									
								case "tab-c" :
								  
									scope.removeClass( scope.qs("calendar-button"), "hidden" );
									
									scope.addClass( divs[3], "active" );
									  
									break;
								   
								case "tab-d" :
								  
									scope.removeClass( scope.qs("remainder-button"), "hidden" );
									
									scope.addClass( divs[4], "active" );
									  
									break;
									
																   
								case "tab-e" :
								    
									scope.removeClass( scope.qs("period-button"), "hidden" );
								   
									scope.addClass( divs[0], "active" );
									  
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
						calendar : function( objectInitial ){
							
							let main = scope.qs("calendar-content"),
							container = scope.slice( main.querySelectorAll(".content-data") )[0],
							containerWrapCalendarList = scope.qs("box-calendar-content"),
							containerCalendarList = scope.qs("box-calendar-program"),
							containerCalendar = scope.qs("wrap-container-st-date"),
							containerCalendarInfo = scope.qs("container-calendar-info"),
							containerEmpty = scope.slice( main.querySelectorAll(".content-empty") ), 
							data = obj.storageFilter( obj.dataStorage.calendar ),
							dataEmpty = true,
							contentDomCalendarInfo = function( params ){
								
								
								let content = scope.stringToHtml5Template(
									'<li class=""> ' +
									'	<ul class="list-inline "> ' +
									'		<li class="modal-list left">  ' +
									'			<div class="container-radio '+ 	params.bg +' centerdiv center-text extrabold font11" style="" > ' + 
									'			</div> ' +
									'		</li> ' +
									
									'		<li class="modal-list right">  ' +
									'			<ul class="list-inline modal-list-container centerdiv"> ' +
									'				<li class="semibold">  ' +
														params.title +
									'				</li>  ' +
									'				<li class="light">  ' +
														params.content +
									'				</li> ' +
									'			</ul> ' +
									'		</li> ' +
									'	</ul> ' +
									'</li>'
								)
								
								
								containerCalendarInfo.appendChild( content );
								
							}, 
							contentDomDetail = function( params ){
								
								containerCalendar.innerHTML = "";
								
								let cycleLoop = 1,
								initialMarker =  false,
								
								domMonth = function( month, year ){
									 
									let loopStart = 0;
									selectMonth = month,
									loopDay = 0,
									dom = [],
									
									firstDay = new Date( year+'/'+month+'/1').toString().split(" ")[0].toLowerCase(),
									 
									marker = function( loopDay ){
										
										if( loopDay !== "" && params.marker.length ){
											 
											let innerDom = "<div>"+ loopDay +"</div>";
											
											// mark period cycle
											
											if( initialMarker && params.cyclePeriod > cycleLoop ){
												 
												cycleLoop++;
												
												innerDom = 
												"<div>" +
													"<div></div>" +
													( params.intervalPeriod >= cycleLoop && '<div class="upper-st-date second period-color-icon"></div>' || "" ) +
													'<div class="upper-st-date grey">'+ cycleLoop +'</div>'+
													"<div class='centerdiv'>"+loopDay+"</div>" +
												"</div>"
												
											}
											  
											  
											// mark day  
											  
											if( params.dateToday === loopDay 
												&& params.monthToday === month
												&& params.yearToday === year	){
												    
												innerDom = 
												"<div>" +
													"<div></div>" +
													( initialMarker && '<div class="upper-st-date">'+ cycleLoop +'</div>' || "" ) +
													"<div class='body-st-date centerdiv mark today'>"+loopDay+"</div>" +
												"</div>"
											}
												
											params.marker.forEach(function( objMaker ){
											 	
												
												//generate line and date body 
												if( objMaker.startDate <= loopDay && loopDay <= objMaker.endDate && objMaker.month === month  ){
													
													let lineClassBool = objMaker.startDate === objMaker.endDate;
													
													initialMarker = true;
													 
													let lineClass = ( lineClassBool ? "": "line-st-date" ) +" centerdiv "+objMaker.color,
													bodyClass ="body-st-date centerdiv",
													pulseStart = "",
													pulseEnd = "";
													
													if( objMaker.startDate === loopDay ){
														 
														lineClass+=" border-rad-left";
														bodyClass+=" mark "+ (objMaker.startPulse && params.notifyStart ? "pulse pulse-start-ovulatory " : "" ) +" "+objMaker.color+"-border";
														pulseStart = ( objMaker.startPulse ? "label-id='"+ params.id+"'"+'  '+"date-start='"+new Date( year+'/'+month+'/'+loopDay ).toLocaleString("id-ID")+"'" : "" );
														
													}else if( objMaker.endDate === loopDay ){ 
														
														lineClass+=" border-rad-right";
														bodyClass+=" mark "+ (objMaker.endPulse && params.notifyEnd ? "pulse pulse-end-ovulatory " : "" ) +" "+objMaker.color+"-border";
														pulseEnd = ( objMaker.endPulse ? "label-id='"+ params.id+"'"+'  '+"date-end='"+new Date( year+'/'+month+'/'+loopDay ).toLocaleString("id-ID")+"'" : "" );
													}
													
													if( params.dateToday === loopDay 
														&& params.monthToday === month
														&& params.yearToday === year ){
														bodyClass+=" mark today"
													}
													 
													innerDom = 
													"<div>" +
														( params.intervalPeriod >= cycleLoop && '<div class="upper-st-date second period-color-icon"></div>' || "" ) +
														'<div class="upper-st-date '+objMaker.color+'">'+ cycleLoop +'</div>'+
														"<div class='"+lineClass+"'></div>" +
														"<div class='"+bodyClass+"'  "+pulseStart+" "+pulseEnd+">"+loopDay+"</div>" +
													"</div>"
													
												
													/** pattern start date with line
													
														<div>
															<div class="line-st-date blue centerdiv border-rad-left"></div>
															<div class="body-st-date centerdiv mark blue-border pulse"> 2</div>
														</div>
													
													*/
													
													/** pattern normal date with line
														
														<div>
															<div class="line-st-date blue centerdiv border-rad-right"></div>
															<div class="body-st-date centerdiv mark pulse blue-border"> 11</div>
														</div>
													
													*/
													
													/** pattern end date with line
														
														<div>
															<div class="line-st-date blue centerdiv border-rad-right"></div>
															<div class="body-st-date centerdiv mark pulse blue-border"> 11</div>
														</div>
													
													*/
												} 
												
											})
											 
											return innerDom;

										}else{
											
											return"<div></div>";
											
											/** pattern empty date
													
												<div>
													<div class="line-st-date blue centerdiv border-rad-right"></div>
													<div class="body-st-date centerdiv mark pulse blue-border"> 11</div>
												</div>
											
											*/
										
										}
										
									};
									
									switch( firstDay ){ // empty loop
											case "sun" : loopStart = 0; // minggu
										break;
											case "mon" : loopStart = 1; // senen
										break;
											case "tue" : loopStart = 2; // selasa
										break;
											case "wed" : loopStart = 3; // rabu
										break;
											case "thu" : loopStart = 4; // kamis
										break;
											case "fri" : loopStart = 5; // jumat
										break;
											case "sat" : loopStart = 6; // sabtu
										break;
									}
									 
									while( selectMonth === month ){
										 
										loopStart--  
										 
										if( loopStart >= 0 ){
										 
											dom.push( marker( "" ) )
										 
										}else{
												
											params.firstDate.setDate( params.firstDate.getDate() + 1 )
											
											selectMonth = new Date( params.firstDate ).getMonth() + 1, // january is 0 an so on
										
											loopDay ++;
											 
											dom.push(  marker( loopDay ) )
										}	
										
									}
									
									return dom.join("")
									 
								},
								generateCalendar = function(){
									 
									params.monthCreate.forEach(function( objCalendar ){ 
										
										let strMonth = scope.dateToYMD({ date : new Date( objCalendar.year+'/'+objCalendar.month+'/1') }).split(" ")[2],
									 
										fragment =  scope.stringToHtml5Template(  
											'<div class="border-st-date container-st-date pt10">'+
											'		<div class="title extrabold mt15">'+strMonth+'</div>'+
											'		<div class="box-st-date light content pt20">'+
													domMonth( objCalendar.month, objCalendar.year ) +
											'		<div>'+
											'</div>'
										);
										
										containerCalendar.appendChild( fragment );
										 
									});
									
									
								}
								
								generateCalendar();
								 
								 
								/*	pattern
									<div class="container-st-date mt15 p0">
										<div class="box-st-date light content">
											<div></div>
											<div>1</div>
											<div>2</div>
											<div>3</div>
											<div>4</div>
											<div>5</div>
											<div>6</div>
											<div>7</div>
											<div>8</div>
											<div>9</div>
											<div>10</div>
											<div>11</div>
											<div>12</div>
											<div>13</div>
											<div>14</div>
											<div>16</div>
											<div>17</div>
											<div>18</div>
											<div>19</div>
											<div>20</div>
											<div>21</div>
											<div>22</div>
											<div>23</div>
											<div>24</div>
											<div>25</div>
											<div>26</div>
											<div>27</div>
											<div>28</div>
											<div>29</div>
											<div>30</div>
											<div>31</div>
										</div>
									</div>
								
								*/
								 
							},
							dataNoteFnDetail = function( dataNote, index ){
									
								if( dataNote.objectId === dataObject.id && function(){
									
									if( stateFirstload.calendarId ) return stateFirstload.calendarId === dataNote.id;
									else  return dataNote.active;
									
								}() ){
									
									let dateToday =  new Date().getDate(),

									yearToday = (new Date()).getFullYear(),
									
									monthToday = (new Date()).getMonth() + 1, // january is 0 and so on
									 
									markerContainer = [],
									
									dateCreate = scope.stringToDate( dataNote.dateCreate ),
									
									firstPeriod = scope.stringToDate( dataNote.firstPeriod  ),
									
									strFirstPeriod = dataNote.firstPeriod.split("/");
									
									strFirstPeriod[0] = "1";
									
									strFirstPeriod = strFirstPeriod.join("/");
									  
									let firstDate = scope.stringToDate( strFirstPeriod ),
									
									selectDay = firstPeriod.toString().split(" ")[0].toLowerCase(),
									
									cyclePeriod = parseInt( dataNote.avgCyclePeriod.split(" ")[0] ),
									 
									intervalPeriod = parseInt( dataNote.intervalPeriod.split(" ")[0] ),
 
									shortPeriod = parseInt( dataNote.shortCyclePeriod.split(" ")[0] ),
									 			
									longPeriod = parseInt( dataNote.longCyclePeriod.split(" ")[0] ),
									
									notifyStartSecondPhase = dataNote.notify[1].start,
									
									notifyEndSecondPhase = dataNote.notify[1].end,
									
									title = dataNote.title,
									
									method =  dataNote.method,
									
									//https://en.wikipedia.org/wiki/Calendar-based_contraceptive_methods
								
									phaseIPre = method === 2 ? 7 - 1 : shortPeriod - 19 - 1, //Pre-ovulatory
								
									phaseIIPre =  method === 2 ? 11 : ( longPeriod - 10 - 1 ) -  ( shortPeriod - 19 + 1 ) ; //Pre-ovulatory
								
									let periodEndPhaseI = new Date( firstPeriod ),
									
									phaseI = function(){
										
										periodEndPhaseI.setDate( periodEndPhaseI.getDate() + phaseIPre );
									
										if( firstPeriod.getMonth() === periodEndPhaseI.getMonth() ){
											
											markerContainer.push({
												color : "red",
												month : firstPeriod.getMonth() + 1,
												year : firstPeriod.getFullYear(),
												startDate : firstPeriod.getDate(),
												endDate : periodEndPhaseI.getDate()
											})
											   
											
										}else{
											
											markerContainer.push({
												color : "red",
												month : firstPeriod.getMonth() + 1,
												startDate : firstPeriod.getDate(),
												year : firstPeriod.getFullYear(),
												endDate : scope.lastDayOfMonth( firstPeriod ).getDate(),
												startPulse : false,
												endPulse : false
											})
											
											markerContainer.push({
												color : "red",
												month : periodEndPhaseI.getMonth() + 1,
												year : periodEndPhaseI.getFullYear(),
												startDate : 1,
												endDate : periodEndPhaseI.getDate(),
												startPulse : false,
												endPulse : false
											})
											
										}
									
											
										
									};
									 
									phaseI();
									
								
									/* PHASE II */
								
									let periodStartPhaseII = new Date( periodEndPhaseI );
									
									periodStartPhaseII.setDate( periodStartPhaseII.getDate() + 1 );
									
									periodEndPhaseII = new Date( periodStartPhaseII );
										 
									periodEndPhaseII.setDate( periodEndPhaseII.getDate() + phaseIIPre );
									
									let phaseII = function(){
										
										if( periodStartPhaseII.getMonth() === periodEndPhaseII.getMonth() ){
											
											
											markerContainer.push({
												color : "green",
												month : periodStartPhaseII.getMonth() + 1,
												year : periodStartPhaseII.getFullYear(),
												startDate : periodStartPhaseII.getDate(),
												endDate : periodEndPhaseII.getDate()
											}) 
											
										}else{
											
											markerContainer.push({
												color : "green",
												month : periodStartPhaseII.getMonth() + 1,
												year : periodStartPhaseII.getFullYear(),
												startDate : periodStartPhaseII.getDate(),
												endDate : scope.lastDayOfMonth( periodStartPhaseII ).getDate()
											}) 

											markerContainer.push({
												color : "green",
												month : periodEndPhaseII.getMonth() + 1,
												year : periodEndPhaseII.getFullYear(),
												startDate : 1,
												endDate : periodEndPhaseII.getDate()
											})
											
										}
										
									 
									};
								 
									phaseII(); 
									
									/* PHASE III */
								 
									let periodStartPhaseIII = new Date( periodEndPhaseII );
									
									periodStartPhaseIII.setDate( periodStartPhaseIII.getDate() + 1 ),
									
									phaseIIIPre = cyclePeriod - ( phaseIIPre + phaseIPre + 3 ), //post-ovulatory
										
									phaseIII = function(){
										 
										periodEndPhaseIII = new Date( periodStartPhaseIII );
										 
										periodEndPhaseIII.setDate( periodEndPhaseIII.getDate() + phaseIIIPre );
									 
										if( periodStartPhaseIII.getMonth() === periodEndPhaseIII.getMonth() ){
											 
											markerContainer.push({
												color : "blue",
												month : periodStartPhaseIII.getMonth() + 1,
												year : periodStartPhaseIII.getFullYear(),
												startDate : periodStartPhaseIII.getDate(),
												endDate : periodEndPhaseIII.getDate(),
												startPulse : true,
												endPulse : true
											}) 
											
										}else{
											
											markerContainer.push({
												color : "blue",
												month : periodStartPhaseIII.getMonth() + 1,
												year : periodStartPhaseIII.getFullYear(),
												startDate : periodStartPhaseIII.getDate(),
												endDate : scope.lastDayOfMonth( periodStartPhaseIII ).getDate(),
												startPulse : true,
												endPulse : false
											}) 
											
											
											markerContainer.push({
												color : "blue",
												month : periodEndPhaseIII.getMonth() + 1,
												year : periodEndPhaseIII.getFullYear(),
												startDate : 1,
												endDate : periodEndPhaseIII.getDate(),
												startPulse : periodEndPhaseIII.getDate() === 1 ? true : false,
												endPulse : true
											})
											
										}
										 
									};
								 
									phaseIII(); 
									 
									/**
										generate month arr
									*/
									let monthContainer = [], tempArr = [], getLoopYear = []; 
									 
									markerContainer.forEach(function( objMarker ){
										
										tempArr.push( objMarker.month );
										
									}); 
									
									tempArr = scope.uniqueArray( tempArr ), loopYear = tempArr[0];
									
									while( true ){
										
										let first = tempArr[0],
										end = tempArr[ tempArr.length - 1];
										
										if( loopYear > 12 ) loopYear = 1;
										
										getLoopYear.push( loopYear );
										
										if( end === loopYear ) break ;
										
										loopYear++;
										
									}
									 
									for(var ee = 0, ii = getLoopYear[0], 
										jj = getLoopYear,
										kk = getLoopYear[0]; ee < jj.length ; ee++ ){
										 
										if( ii <= jj[ee] ){
											
											monthContainer.push({
												month : jj[ee],
												year : yearToday
											})
											
										}else{
											
											monthContainer.push({
												month : jj[ee],
												year : yearToday + 1
											})
											
											break;
											
										}
										
									}
									 
									contentDomDetail({
										id : dataNote.id,
										firstDate : firstDate,
										firstPeriod : firstPeriod,
										//selectDay : selectDay,
										cyclePeriod : cyclePeriod,
										intervalPeriod : intervalPeriod,
										yearToday : yearToday,
										monthToday : monthToday,
										dateToday : dateToday,
										monthCreate : monthContainer,
										marker : markerContainer,
										notifyStart : notifyStartSecondPhase,
										notifyEnd : notifyEndSecondPhase
									});
									
									
									/*
									//container calendar info
									let status  =  !dataNote.pillTaken.length ? 
										"Belum Mengkonsumsi Pil KB" : "Telah Mengkonsumsi "+dataNote.pillTaken.length+" Pil KB",
										
									pillType =	dataNote.pillType.pill+" Pil Hormon, "+dataNote.pillType.emptyPill+" Pil Kosong",
																			*/
																			
									let bg = [ "bg-bluemarine","bg-redtosca","bg-grey-a","bg-bluesky","bg-turquoise","bg-cadetblue",
									"bg-sandybrown","bg-pink","bg-gray"],
									bgLen = bg.length - 1;

									 
									containerCalendarInfo.innerHTML = "";
									
									contentDomCalendarInfo({ 
										title : "Judul",
										content : title,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									  
																		
									contentDomCalendarInfo({ 
										title : "Metode",
										content : dataNote.methodText,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									 
																											
									contentDomCalendarInfo({ 
										title : "Tanggal Pertama Haid",
										content : scope.dateToYMD({ date : firstPeriod, withYear : true }),
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
																		
									contentDomCalendarInfo({ 
										title : "Masa Haid",
										content : dataNote.intervalPeriod,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									 									
									contentDomCalendarInfo({ 
										title : "Siklus Rata Rata",
										content : dataNote.avgCyclePeriod,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
										
									if( dataNote.shortCyclePeriod ){
											
										contentDomCalendarInfo({ 
											title : "Siklus Terpendek",
											content : dataNote.shortCyclePeriod,
											bg : bg[ scope.random( bgLen, 0 ) ]
										}); 
										
									}
									
										
									if( dataNote.longCyclePeriod ){
											
										contentDomCalendarInfo({ 
											title : "Siklus Terpanjang",
											content : dataNote.longCyclePeriod,
											bg : bg[ scope.random( bgLen, 0 ) ]
										}); 
										
									}
									
								}
								
								
							},
							contentDom = function( params ){
								 		
								let innerDom = function( innerParams ){
									     
									let content = scope.stringToHtml5Template(
										"<div class='notify-box-small'>"+
										"		<div class='bubble-box calendar-icon bg-opacity-04'>"+
										"			<div class='notify-strip-b bg-grey-a'></div>"+
										"		</div>"+
										"		<abbr class='hidden'> </abbr>"+
										"		<ins class='left'>"+
										"			<span class='notify-small-title extrabold'>"+ params.title+"</span>"+
										"			<br>"+
										"			<span class='notify-small-detail light left'> "+params.status+"</span>"+ 
										"		</ins>"+
										"		<div class='bubble-small-left'  "+
										"			title='"+ params.title +"' " +
										"			method='"+ params.method +"' " +
										"			method-text='"+ params.methodText +"' " +
										"			cycle='"+ params.cycle +"' " +
										"			firstdate='"+ scope.dateToYMD({ date : params.dateStart, withYear : true }) +"' "+
										"			avg='"+ params.avgPeriod +"' " +
										"			short='"+ params.shortPeriod +"' " +
										"			long='"+ params.longPeriod +"' " +
										"			active='"+ params.active +"' " +
										"			label-id='"+ params.id +"' " +
										"			datecreate='"+ scope.dateToYMD({ date : params.dateCreate, withYear : true }) +"' " +
										"			status='"+ params.status +"' " +
										"		</div>"+
										"</div>"
									); 
									
									//append
									innerParams.container.appendChild( content );
								},
								outterDom = function( outterParams ){
										
									if( outterParams.createContainer ){
										 
										let mainContent = scope.stringToHtml5Template(
											"<div class=' parent-calendar-box "+ ( params.active ? "" : "halfOpacity" ) +" '>"+
												"<abbr>"+ params.timeSince +"</abbr>"+
												"<div class='wrap-content-data'>"+
												
												"</div>"+
											"</div>" +
											
											"<div class='sparator mb20'></div>"
										),	 
										
										wrapContent = mainContent.querySelector(".wrap-content-data")
										
										innerDom({
											container : wrapContent
										}) 
										
										//append
										containerCalendarList.appendChild( mainContent );
										 
										//hapus sparator jika diperlukan
										let parentEls = scope.slice( container.querySelectorAll(".parent-calendar-box") ),
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
									}else{
										
										innerDom({
											container : outterParams.wrapContent
										})
									} 
								}
								 
								 
								//find container based on date label
								let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
								emptyCnt = true;
								 
								 
								if( emptyCnt ){
									
									outterDom({
										createContainer : true
									});
								} 
							},
							dataNoteFn = function( dataNote, index ){
								
								if( dataNote.objectId === dataObject.id ){
									
									if( obj.loadMore.marker( "calendar", containerWrapCalendarList, dataNote, index ) ){
										
										 
										let dateNow = new Date(),
										
										dateCreate =  scope.stringToDate( dataNote.dateCreate ),
										
										dateStart =  scope.stringToDate( dataNote.firstPeriod ),
										   
										cyclePeriodTemp = parseInt( dataNote.avgCyclePeriod.split(" ")[0] ),
									 
										dateTemp = new Date( dateStart );
										 
										dateTemp.setDate( dateTemp.getDate() + cyclePeriodTemp - 1 );
										   
										  
										let title = dataNote.title,
										 
										method = dataNote.method,
										  
										methodText = dataNote.methodText,
										 
										status  = dataNote.active && dateTemp > dateNow ? "Program Kb Kalender Berlangsung"  : "Program KB Kalender Berakhir ",
											  
										cycle  = dataNote.intervalPeriod,
										 	  
										avgPeriod  = dataNote.avgCyclePeriod,
										  	  
										shortPeriod  =  dataNote.shortCyclePeriod,
										   	  
										longPeriod  =  dataNote.longCyclePeriod,
										 
										isTodayOrYesterDay = scope.dateIsTodayOrYesterday( dateStart ),
											 
										timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD({ date : dateStart });
										    
										contentDom({
											id : dataNote.id,
											active : dataNote.active,
											dateStart : dateStart,
											dateCreate : dateCreate,
											cycle : cycle,
											avgPeriod : avgPeriod,
											shortPeriod : shortPeriod,
											longPeriod : longPeriod,
											title : title, 
											methodText : methodText,
											method : method,
											status : status, 
											timeSince : timeSince
										});
										
										
									}
									
									dataEmpty = false;
									 
								}
							},
							calendarActive = false,
							calendarNotify = false,
							boolCheck = function(){
								
								data.forEach( function( objCalendar ){ 
									if( objCalendar.active ){ 
										calendarActive = true;
										calendarNotify = objCalendar.notify;								
									} 
								})
								 
							};
							 
							boolCheck();
						 	
							 //clear container
							if( !objectInitial ){
								 
								containerCalendarList.innerHTML = ""; 
								 
								//reset loadmore
								obj.loadMore.state.calendar.reset();
							}; 
							 
							 
							//update firstload only
							if( !stateFirstload.calendar ){
								 
								let swiperCalendar = new Swiper('.swiper-calendar',{  
									observer: true,
									observeParents: true, 
									initialSlide: 0
								});
							  
								if( calendarActive ){ 
									 
									setTimeout( function(){ 
									
										data.length && swiperCalendar.slideTo( 1, 300 );
									
										scope.addClass( scope.qs("calendar-button"), "hidden" ) 
										
									}, 100 );
								};
								   
								
								scope.attachListener( scope.qs("trigger-calendar-active"), 'click', function(){
									
									stateFirstload.calendarId = "";
									//refresh
									obj.main.calendar();
									
									swiperCalendar.slideTo( 1, 300 );
									
								})
								  
								setInterval(function(){
									 
									if( swiperCalendar.activeIndex && data.length ) scope.addClass( scope.qs("calendar-button"),  "hidden" );
									 
								},1000) 
								
								
								stateFirstload.swiperCalendar = swiperCalendar;
								
								//tab calendar info
								let tabInfo = scope.slice( scope.qsAll("tab-calendar-info li") )
								  
								tabInfo.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabInfo.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										
										scope.addClass( scope.qs("container-calendar-info"), "hidden" )
										scope.addClass( scope.qs("container-calendar-detail"), "hidden" )
										 
										if( index ) scope.removeClass( scope.qs("container-calendar-info"), "hidden" )
										else  scope.removeClass( scope.qs("container-calendar-detail"), "hidden" );
										 
									}.bind( objLi, index ) )
									
								}) 
								
								
								//tab header
								let tabEl =  scope.slice( scope.qsAll("tab-kb-calendar li") );
								  
								tabEl.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										  
										swiperCalendar.slideTo( getIndex, 300 );
										  
									}.bind( objLi, index ) )
									
								}) 
								
					 
								swiperCalendar.on('slideChange', function () {
									    
									scope[ swiperCalendar.activeIndex ? "addClass" : "removeClass" ]( scope.qs("calendar-button"),  "hidden" );
									 
									tabEl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									 
									  
									scope.addClass( swiperCalendar.activeIndex ? tabEl[1] : tabEl[0] , "select" );
									 
								}); 
								
								
								stateFirstload.calendar = true; 
							} 
							 
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
								 								  
								dataNoteFnDetail( dataNote, index );   
								
								dataNoteFn( dataNote, index );   
							})	
							
							if( !calendarActive && !stateFirstload.calendarId  ){
								
								scope.removeClass( containerEmpty[0], "hidden" );
								scope.addClass( containerCalendar, "hidden" );
								scope.addClass(container, "hidden" );
								//scope.addClass( scope.qs("box-calendar-detail-menu"), "hidden" )
								scope.addClass( scope.qs("box-calendar-detail"), "hidden" )
								 
							}else{
								
								scope.addClass( containerEmpty[0], "hidden" );
								scope.removeClass( containerCalendar, "hidden" );
								scope.removeClass( container, "hidden" );
								//scope.removeClass( scope.qs("box-calendar-detail-menu"), "hidden" )
								scope.removeClass( scope.qs("box-calendar-detail"), "hidden" )
							 
							} 
							
							//if data container is empty
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty[1],  "hidden" );
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" );
							
							  
						 
								/*button calendar detail*/
							let calendarBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
							
							calendarBtns.map(function( calendarObj, index ){
								
								scope.attachListener( calendarObj, 'click', function(){
									    
									//modal detail && confirm 
									scope.text( [ scope.qs("calendar-detail-title"), scope.qs("calendar-confirm-title") ], this.getAttribute("title") );
									scope.text( [ scope.qs("calendar-detail-method"), scope.qs("calendar-confirm-method") ], this.getAttribute("method-text") );
									scope.text( [ scope.qs("calendar-detail-cycle"), scope.qs("calendar-confirm-cycle ") ], this.getAttribute("cycle") );
									scope.text( [ scope.qs("calendar-detail-firstdate"), scope.qs("calendar-confirm-firstdate ") ], this.getAttribute("firstdate") );
									scope.text( [ scope.qs("calendar-detail-avg"), scope.qs("calendar-confirm-avg") ], this.getAttribute("avg") );
									scope.text( [ scope.qs("calendar-detail-short"), scope.qs("calendar-confirm-short") ], this.getAttribute("short") );
									scope.text( [ scope.qs("calendar-detail-long"), scope.qs("calendar-confirm-long") ], this.getAttribute("long") );
									scope.text( [ scope.qs("calendar-detail-create"), scope.qs("calendar-confirm-create") ], this.getAttribute("datecreate") );
									 
									 
									if( parseInt( this.getAttribute("method") ) === 1 ){
										
										scope.removeClass( scope.qs("calendar-detail-short").parentNode, "hidden" )
										scope.removeClass( scope.qs("calendar-confirm-short").parentNode, "hidden" )
										scope.removeClass( scope.qs("calendar-detail-long").parentNode, "hidden" )
										scope.removeClass( scope.qs("calendar-confirm-long").parentNode, "hidden" )
										scope.removeClass( scope.qs("sp-calendar-detail-long"), "hidden" )
										scope.removeClass( scope.qs("sp-calendar-confirm-long"), "hidden" )
										scope.removeClass( scope.qs("sp-calendar-detail-short"), "hidden" )
										scope.removeClass( scope.qs("sp-calendar-confirm-short"), "hidden" )
										 
									}else{
										
										scope.addClass( scope.qs("calendar-detail-short").parentNode, "hidden" )
										scope.addClass( scope.qs("calendar-confirm-short").parentNode, "hidden" )
										scope.addClass( scope.qs("calendar-detail-long").parentNode, "hidden" )
										scope.addClass( scope.qs("calendar-confirm-long").parentNode, "hidden" )
										scope.addClass( scope.qs("sp-calendar-detail-long"), "hidden" )
										scope.addClass( scope.qs("sp-calendar-confirm-long"), "hidden" )
										scope.addClass( scope.qs("sp-calendar-detail-short"), "hidden" )
										scope.addClass( scope.qs("sp-calendar-confirm-short"), "hidden" )
										 
									}
									  
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-calendar-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("label-id") );
									scope.qs("button-calendar-detail").setAttribute("label-id", ( this.getAttribute("active") === "false" ? this.getAttribute("label-id") : "" ) );  
									   
									obj.modal.behaviour.openModalFadeIn("modal-calendar-detail");
									    
								})
							})
							
							
							let btnStartPostOvulatory = scope.qs("pulse-start-ovulatory"),
							btnEndPostOvulatory =  scope.qs("pulse-end-ovulatory"),
							btnStart = btnStartPostOvulatory ? [ btnStartPostOvulatory ] : [],
							btnEnd = btnEndPostOvulatory ? [ btnEndPostOvulatory ] : [],
							btnArr = btnStart.concat( btnEnd );
							
							scope.attachListener( btnArr, 'click', function(){ 
							
									let date = "", phaseSelect = "",
									id = this.getAttribute("label-id");
									 
									if( this.getAttribute("date-start") ){
										
										phaseSelect = "start";
										
										date = scope.dateToYMD({ 
											date : scope.stringToDate( this.getAttribute("date-start") ),
											withYear : true
										})
										
									}else if( this.getAttribute("date-end") ){
										
										phaseSelect = "end";
										
										date = scope.dateToYMD({ 
											date : scope.stringToDate( this.getAttribute("date-end") ),
											withYear : true
										})
									
									}
									 
									scope.text( scope.qs("date-pos-ovulatory"), date )
									
									obj.modalMenu.behaviour.openModalFadeIn("modal-menu-calendar-date");  
									
									let btnSend = scope.qs("modal-menu-calendar-date").querySelector(".send-button");
									
									btnSend.setAttribute("phase-select", phaseSelect )
									
									btnSend.setAttribute("label-id", id)
									    
							})
							 
							
						},
						injection : function( objectInitial ){
							
							let main = scope.qs("inject-content"),
							container = scope.slice( main.querySelectorAll(".content-data") )[0],
							containerWrapInjectList = scope.qs("box-inject-content"),
							containerInjectList = scope.qs("box-inject-program"),
							containerInject = scope.qs("box-inject-detail"),
							containerInjectInfo = scope.qs("container-inject-info"),
							containerEmpty = scope.slice( main.querySelectorAll(".content-empty") ), 
							data = obj.storageFilter( obj.dataStorage.inject ),
							dataEmpty = true,
							progressFn = function( params ){
								
								let canvas = scope.qs("chart-inject"),
								randomScalingFactor = function() {
									return Math.round(Math.random() * 100);
								};							
								 
								let tooltipCanvas = scope.qs("chart-inject-tooltip");
 
								let gradientBlue = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
								gradientBlue.addColorStop(0, '#5555FF');
								gradientBlue.addColorStop(1, '#9787FF');

								let gradientRed = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
								gradientRed.addColorStop(0, '#FF55B8');
								gradientRed.addColorStop(1, '#FF8787');

								let gradientGrey = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
								gradientGrey.addColorStop(0, '#888888');
								gradientGrey.addColorStop(1, '#AAAAAA');

								let arcSpacing = 0.15,
								segmentHovered = false;


								function textInCenter(value, label, day) {
									
								  var ctx = tooltipCanvas.getContext('2d');
								  ctx.clearRect(0, 0, tooltipCanvas.width, tooltipCanvas.height)
								  
									ctx.restore();
									
								  // Draw value
								  ctx.fillStyle = '#333333';
								  ctx.font = '30px sans-serif';
								  ctx.textBaseline = 'middle';

								  // Define text position
								  var textPosition = {
									x: Math.round((tooltipCanvas.width - ctx.measureText(value).width) / 2),
									y: tooltipCanvas.height / 2 + 10,
								  };
									
								  ctx.fillText(value, textPosition.x, textPosition.y);

								  // Draw label
								  ctx.fillStyle = '#AAAAAA';
								  ctx.font = '15px sans-serif';
								  ctx.textBaseline = 'middle';

								  // Define text position
								  var labelTextPosition = function( labelDay ){
									  return {
										x: Math.round((tooltipCanvas.width - ctx.measureText( labelDay ).width) / 2),
										y: tooltipCanvas.height / 2,
									  }
								  };

								  ctx.fillText(label, labelTextPosition( label ).x, labelTextPosition( label ).y - 25);
								  
								  ctx.fillText(day, labelTextPosition( day ).x , labelTextPosition( day ).y + 40);
								  
								  ctx.save();
								}

								Chart.elements.Arc.prototype.draw = function() {
								  var ctx = this._chart.ctx;
								  var vm = this._view;
								  var sA = vm.startAngle;
								  var eA = vm.endAngle;

								  ctx.beginPath();
								  ctx.arc(vm.x, vm.y, vm.outerRadius, sA + arcSpacing, eA - arcSpacing);
								  ctx.strokeStyle = vm.backgroundColor;
								  ctx.lineWidth = vm.borderWidth;
								  ctx.lineCap = 'round';
								  ctx.stroke();
								  ctx.closePath();
								}; 
																 
																
								var config = {
									type: 'doughnut',
									responsive : true,
									aspectRatio :4,
									data: {
										labels: ['BERJALAN','TERSISA'],
										datasets: [
										  {
											  data: [ params.progressDay, params.remainingDays ],
											  backgroundColor: [
												gradientRed,
												gradientBlue,
											  ],
										  }
										]
									},
									options: {
										cutoutPercentage: 1,
											elements: {
											arc: {
											borderWidth: 12,
										  },
										},
										legend: {
											display: false,
										},
										animation: {
											onComplete: function(animation) {
											if (!segmentHovered) {
											  
											  var label = 'T E R S I S A',
											  day = 'H A R I';

											  textInCenter( params.remainingDays, label, day );
											}
										  },
										},
										tooltips: {
											enabled: false,
											custom: function(tooltip) {
											if (tooltip.body) {
											  var line = tooltip.body[0].lines[0],
												parts = line.split(': ');
											  textInCenter(parts[1], parts[0].split('').join(' ').toUpperCase(),"H A R I");
											  segmentHovered = true;
											} else {
												segmentHovered = false;
											}
										  },
										}
									},
								};
 
								let chart = new Chart(canvas, config);
 
								/*
								var totalProgress, 
								progress,
								circles = document.querySelectorAll('.pgc .progress');
							
								for(var i = 0; i < circles.length; i++) {
									
									totalProgress = circles[i].querySelector('.pgc circle').getAttribute('stroke-dasharray');
									
									progress = params.progress
									
									circles[i].parentElement.setAttribute('data-percent'," "+params.remainingDays+" Hari Tersisa");

									circles[i].querySelector('.pgc .bar').style['stroke-dashoffset'] = totalProgress * progress / 100;
							  
								}
								*/
							},
							
							contentDomInjectInfo = function( params ){
								
								
								let content = scope.stringToHtml5Template(
									'<li class=""> ' +
									'	<ul class="list-inline "> ' +
									'		<li class="modal-list left">  ' +
									'			<div class="container-radio '+ 	params.bg +' centerdiv center-text extrabold font11" style="" > ' + 
									'			</div> ' +
									'		</li> ' +
									
									'		<li class="modal-list right">  ' +
									'			<ul class="list-inline modal-list-container centerdiv"> ' +
									'				<li class="semibold">  ' +
														params.title +
									'				</li>  ' +
									'				<li class="light">  ' +
														params.content +
									'				</li> ' +
									'			</ul> ' +
									'		</li> ' +
									'	</ul> ' +
									'</li>'
								)
								
								
								containerInjectInfo.appendChild( content );
								
							}, 
							contentDomDetail = function( params ){
									
								containerInject.innerHTML="";
								
								let content = scope.stringToHtml5Template( 
									'<div class="mt80" style="position:relative;">'+
										'<canvas height="250px"; class="chart-inject" ></canvas>'+
										'<canvas class="chart-inject-tooltip centerdiv" width="100" height="150" style="position: absolute; width:unset; height:unset;top:100" ></canvas>'+
									'</div>'
								)
								 
								scope.text( scope.qs("inject-active-day"), params.progressDay+" / "+params.totalDays )
									  
								containerInject.setAttribute("label-id", params.id );
								
								containerInject.setAttribute("date-start", params.strDateStart );
								
								containerInject.setAttribute("date-end", params.strDateEnd );
								
								containerInject.appendChild( content )	
								
								setTimeout(function(){ 
									progressFn( params )
								}, 300 );
								/*
								<div class="pgc mt80">								 
									<div class="progressdiv"  data-percent="80">
										<svg class="progress" width="178" height="178" viewport="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
											<circle r="80" cx="89" cy="89" fill="transparent" stroke-dasharray="502.4" stroke-dashoffset="0" ></circle>
											<circle class="bar" r="80" cx="89" cy="89" fill="transparent" stroke-dasharray="502.4" stroke-dashoffset="0"></circle>
										</svg>
									</div>
								</div>
								*/
								
							},
							dataNoteFnDetail = function( dataNote, index ){
								
								if( dataNote.objectId === dataObject.id && function(){
									
									if( stateFirstload.injectId ) return stateFirstload.injectId === dataNote.id;
									else  return dataNote.active;
									
								}() ){
								 
									let dateStart = scope.stringToDate( dataNote.dateStart ),
									 
									dateEnd = scope.stringToDate( dataNote.dateEnd );
									 
									dateEnd.setDate( dateEnd.getDate());
										
									let dateNow = new Date(), 
									
									dateExpired = new Date( dateNow  ).setHours( 0,0,0,0 ) < new Date( dateEnd ).setHours( 0,0,0,0 ),
									
									days = scope.getMinutesHourDayOrWeekBetweenDates({ endDate : dateEnd, startDate : dateNow, timeString : "day"}),
									 
									remainingDays  = dataNote.active && dateExpired ? days : 0,
									 
									injectType = parseInt( dataNote.injectType ) * 28 - remainingDays,
									 
									totalDays =  parseInt( dataNote.injectType ) * 28,
									
									progressDay = totalDays - remainingDays ,
									 
									progress = Math.round( ( progressDay / totalDays ) * 100 );
									    
									   
									contentDomDetail({
										id : dataNote.id,
										strDateStart : dataNote.dateStart,
										strDateEnd : dataNote.dateEnd,
										dateStart : dateStart, 
										notify : dataNote.notify,
										totalDays : totalDays,
										remainingDays : remainingDays,
										progressDay : progressDay,
										progress : progress 
									});
										
									 
									 
									//inject info
								 
									let status  = dataNote.active && dateExpired ? 
										( remainingDays ? "Program Berakhir "+ remainingDays +" Hari lagi" : " Program Berakhir hari ini" ) 
											: "Program KB Berakhir ",
								 
									injectTypeText  =  "Program KB Suntik "+ dataNote.injectType +" Bulan ",
									 
									bg = [ "bg-bluemarine","bg-redtosca","bg-grey-a","bg-bluesky","bg-turquoise","bg-cadetblue",
									"bg-sandybrown","bg-pink","bg-gray"],
									bgLen = bg.length - 1;
											
									
									containerInjectInfo.innerHTML = "";
									
									contentDomInjectInfo({ 
										title : "Judul",
										content : dataNote.title,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									 
									contentDomInjectInfo({ 
										title : "Tipe suntik kb yang digunakan",
										content : injectTypeText,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									 
									contentDomInjectInfo({ 
										title : "Program suntik kb dimulai",
										content : scope.dateToYMD({ date : dateStart, withYear : true }),
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
									contentDomInjectInfo({ 
										title : "Status",
										content : status,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
									contentDomInjectInfo({ 
										title : "Program kb suntik selanjutnya",
										content : scope.dateToYMD({ date :  dateEnd, withYear : true }),
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
								}
								
							},
							
							contentDom = function( params ){
								
								let innerDom = function( innerParams ){
									     
									let content = scope.stringToHtml5Template(
										"<div class='notify-box-small'>"+
										"		<div class='bubble-box injection-icon bg-opacity-04'>"+
										"			<div class='notify-strip-b bg-grey-a'></div>"+
										"		</div>"+
										"		<abbr class='hidden'> </abbr>"+
										"		<ins class='left'>"+
										"			<span class='notify-small-title extrabold'>"+ params.title+"</span>"+
										"			<br>"+
										"			<span class='notify-small-detail light left'> "+params.status+"</span>"+ 
										"		</ins>"+
										"		<div class='bubble-small-left'  "+
										"			active='"+ params.active +"' " +
										"			label-id='"+ params.id +"' " +
										"			title='"+ params.title +"' " +
										"			injecttype='"+ params.injectType +"' " +
										"			startdate='"+ scope.dateToYMD({ date : params.dateStart, withYear : true }) +"' "+
										"			enddate='"+ scope.dateToYMD({ date :  params.dateEnd, withYear : true }) +"' " +
										"			datecreate='"+ scope.dateToYMD({ date : params.dateCreate, withYear : true }) +"' " +
										"			status='"+ params.status +"' " +
										"		</div>"+
										"</div>"
									); 
									
									//append
									innerParams.container.appendChild( content );
								},
								outterDom = function( outterParams ){
										
									if( outterParams.createContainer ){
										 
										let mainContent = scope.stringToHtml5Template(
											"<div class=' parent-inject-box "+ ( params.active ? "" : "halfOpacity" ) +" '>"+
												"<abbr>"+ params.timeSince +"</abbr>"+
												"<div class='wrap-content-data pt10'>"+
												
												"</div>"+
											"</div>"	+										
											"<div class='sparator mb20'></div>"
										),	 
										
										wrapContent = mainContent.querySelector(".wrap-content-data")
										
										innerDom({
											container : wrapContent
										}) 
										
										//append
										containerInjectList.appendChild( mainContent );
										 
										//hapus sparator jika diperlukan
										let parentEls = scope.slice( container.querySelectorAll(".parent-inject-box") ),
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
										
									}else{
										
										innerDom({
											container : outterParams.wrapContent
										})
									} 
								}
								 
								 
								//find container based on date label
								let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
								emptyCnt = true;
								 
								 
								if( emptyCnt ){
									
									outterDom({
										createContainer : true
									});
								} 
							}, 
							dataNoteFn = function( dataNote, index ){
							 
								if( dataNote.objectId === dataObject.id ){
									   
									if( obj.loadMore.marker( "injection", containerWrapInjectList, dataNote, index ) ){
										  
										let dateStart = scope.stringToDate( dataNote.dateStart ),
										
										dateCreate =  scope.stringToDate( dataNote.dateCreate ),
										
										dateEnd = scope.stringToDate( dataNote.dateEnd );
										
										dateEnd.setDate( dateEnd.getDate() )
										
										let title = dataNote.title,
										
										dateNow = new Date(), 
										
										dateExpired = new Date( dateNow  ).setHours( 0,0,0,0 ) < new Date( dateEnd ).setHours( 0,0,0,0 ),
										
										remainingDays = scope.getMinutesHourDayOrWeekBetweenDates({ endDate : dateEnd, startDate : dateNow, timeString : "day"}),
										  
										status  = dataNote.active && dateExpired ? ( remainingDays ? "Program Berakhir "+ remainingDays +" Hari lagi" : " Program Berakhir hari ini" ): "Program KB Berakhir ",
											  
										injectType  =  "Program KB Suntik "+ dataNote.injectType +" Bulan ",
										 
										isTodayOrYesterDay = scope.dateIsTodayOrYesterday( dateStart ),
											 
										timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD({ date : dateStart });
										    
										contentDom({
											id : dataNote.id,
											active : dataNote.active && dateExpired,
											dateStart : dateStart,
											dateEnd : dateEnd,
											dateCreate : dateCreate,
											injectType : injectType,
											title : title, 
											status : status, 
											timeSince : timeSince
										});
										
									}
												
									dataEmpty = false;
								}
							},
							injectActive = false,
							injectNotify = false,
							boolCheck = function(){
								data.forEach( function( objInject ){ 
									if( objInject.active ){ 
										injectActive = true;
										injectNotify = objInject.notify;								
									} 
								})
							};
							
							boolCheck();
							 
							
							 //clear container
							if( !objectInitial ){
								 
								containerInjectList.innerHTML = ""; 
								 
								//reset loadmore
								obj.loadMore.state.injection.reset();
							};
							
							if( !injectActive && !stateFirstload.injectId  ){
								
								scope.removeClass( containerEmpty[0], "hidden" );
								scope.addClass( containerInject, "hidden" );
								scope.addClass( scope.qs("box-inject-detail-menu"), "hidden" );
								scope.addClass( scope.nthParent( containerInjectInfo, 2 ), "hidden" );
									
								 
							}else{
								
								scope.addClass( containerEmpty[0], "hidden" );
								scope.removeClass( containerInject, "hidden" );
								scope.removeClass( scope.qs("box-inject-detail-menu"), "hidden" );
								scope.removeClass( scope.nthParent( containerInjectInfo, 2 ), "hidden" );
								scope.addClass( scope.qs("trigger-notify-inject"), "hidden" );
								  
								 !stateFirstload.injectId && 
									scope[ injectNotify ? "removeClass" : "addClass"]( scope.qs("trigger-notify-inject"),  "hidden" );	 
								
								
							} 
							  
							//update firstload only
							if( !stateFirstload.inject ){
								 
								let swiperInject = new Swiper('.swiper-inject',{  
									observer: true,
									observeParents: true, 
									initialSlide: 0
								});
							  
								if( injectActive ){ 
								
									setTimeout( function(){
									
										data.length && swiperInject.slideTo( 1, 300 );
									
									}, 100 );
									
									//setTimeout( function(){ scope.addClass( scope.qs("inject-button"), "hidden" ) }, 100 );
								};
								   
								scope.attachListener( scope.qs("trigger-inject-active"), 'click', function(){
									
									stateFirstload.injectId = "";
									//refresh
									obj.main.injection();
									
									swiperInject.slideTo( 1, 300 );
									
								})
								  
								 
								stateFirstload.swiperInject = swiperInject;
							  
								setInterval(function(){
									   
									if( swiperInject.activeIndex && data.length  ) scope.addClass( scope.qs("inject-button"),  "hidden" );
									 
								},1000)
								
								
								
								
								//tab header
								let tabEl =  scope.slice( scope.qsAll("tab-kb-inject li") );
								  
								tabEl.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										  
										swiperInject.slideTo( getIndex, 300 );
										  
									}.bind( objLi, index ) )
									
								}) 
								
								
								swiperInject.on('slideChange', function () {
									   
									scope[ swiperInject.activeIndex ? "addClass" : "removeClass" ]( scope.qs("inject-button"),  "hidden" );
									 
									tabEl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									 
									  
									scope.addClass( swiperInject.activeIndex ? tabEl[1] : tabEl[0] , "select" );
									 
								}); 
								
								
								stateFirstload.inject = true; 
							} 
							
							
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
								 					   
								dataNoteFnDetail( dataNote, index ); 
								
								dataNoteFn( dataNote, index );   
							})	
							
						 
							//if data container is empty
							
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty[1],  "hidden" );
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" );
							
								/*button inject detail*/
							let injectBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
							
							injectBtns.map(function( injectPill, index ){
								
								scope.attachListener( injectPill, 'click', function(){
									 
									  
									//modal confirm 
									scope.text( [ scope.qs("inject-detail-title"), scope.qs("inject-confirm-title") ], this.getAttribute("title") );
									scope.text( [ scope.qs("inject-detail-type"), scope.qs("inject-confirm-type") ], this.getAttribute("injecttype") );
									scope.text( [ scope.qs("inject-detail-startdate"), scope.qs("inject-confirm-startdate") ], this.getAttribute("startdate") );
									scope.text( [ scope.qs("inject-detail-enddate"), scope.qs("inject-confirm-enddate") ], this.getAttribute("enddate") );
									scope.text( [ scope.qs("inject-detail-status"), scope.qs("inject-confirm-status") ], this.getAttribute("status") );
									scope.text( [ scope.qs("inject-detail-datecreate"), scope.qs("inject-confirm-datecreate") ], this.getAttribute("datecreate") );
									 
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-inject-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("label-id") );
									scope.qs("button-inject-detail").setAttribute("label-id", ( this.getAttribute("active") === "false" ? this.getAttribute("label-id") : "" ) );  
									  
									 
									obj.modal.behaviour.openModalFadeIn("modal-inject-detail");
									    
								})
							})
							
						 
						},
						pill : function( objectInitial ){
							let main = scope.qs("pill-content"),
							container = scope.slice( main.querySelectorAll(".content-data") )[0],
							containerWrapPillList = scope.qs("box-birth-content"),
							containerPillList = scope.qs("box-birth-program"),
							containerPill = scope.qs("box-birth-pil"),
							containerPillInfo = scope.qs("container-pill-info"),
							containerEmpty = scope.slice( main.querySelectorAll(".content-empty") ),
							data = obj.storageFilter( obj.dataStorage.pill ), 
							dataEmpty = true,
							contentDomPillReg = function( params ){
								
								containerPill.innerHTML="";
								
								let arrayMonth = [],
								content = scope.stringToHtml5Template(
								 
									function(){
										 
										let circle = 28,
										stringHtml = "",
										loopWeekIncrement = 0,
										loopDayIncrement = 0,
										dateNow = new Date(),
										dayNow = dateNow.getDate();
										 
										for(var ii = 0; ii < 28 ; ii++ ){
											
											loopDayIncrement++;
											
											let dateLoop = new Date( params.dateStart ),
											dateLoopIncrement = new Date( dateLoop.setDate(  dateLoop.getDate() + loopDayIncrement - 1 ) )
											dateStr = scope.dateToYMD({
												date : dateLoopIncrement,
												isShortMonth : false,
												isShortDay : true
											}),
											min7DateLoopIncrement = new Date( dateLoopIncrement );
											
											min7DateLoopIncrement.setDate( min7DateLoopIncrement.getDate() + 7 );	
											
											
											let dateQuote = dateStr.split(",").join(""),
											dateArr = dateQuote.split(" "),
											dayLoop = dateArr[0],
											dayNumLoop = dateArr[1],
											pillDayRegNum = false,
											pillDayRegDate = "",
											today = dateLoopIncrement.setHours(0,0,0,0) === dateNow.setHours(0,0,0,0),
											needMarkerBorder = min7DateLoopIncrement.setHours(0,0,0,0) <= dateNow.setHours(0,0,0,0);
											
											
											arrayMonth.push( dateArr[2] )
											
											arrayMonth = scope.uniqueArray( arrayMonth )
											
											//create week
											if( ii % 7 === 0 ){
												 
												if( needMarkerBorder ){
													
													
													stringHtml += '<div class="week" style="border-color: #ff6a6a !important;">';
												
													
												}else{
													
													
													stringHtml += '<div class="week">';
												
													
												}
												
												
												loopWeekIncrement++;
												
												//create strip
												
												if( loopWeekIncrement === 1 ){
													
													stringHtml += '<div class="border-top-remove"></div>'+
														'<div class="border-bottom-remove"></div>';
														
														
													if( needMarkerBorder ){
													 
														stringHtml += '<div class="make-border-bottom-half-right" style="border-color: #ff6a6a !important;"></div>';
													 
													}else{
														 
														stringHtml += '<div class="make-border-bottom-half-right"></div>';
													 
													}
														
												
												}else if( loopWeekIncrement === 2 ){
													
													stringHtml += '<div class="border-top-remove"></div>'+
														'<div class="border-bottom-remove"></div>'+
														'<div class="border-bottom-white-remove"></div>';
														
														
													if( needMarkerBorder ){
													 
														stringHtml += '<div class="make-border-top-half-left" style="border-color: #ff6a6a !important;"></div>';
														stringHtml += '<div class="make-border-bottom-half-right" style="border-color: #ff6a6a !important;"></div>';
													 
													}else{
														  
														stringHtml +=  '<div class="make-border-top-half-left" style="z-index:-1;"></div>';
														stringHtml += '<div class="make-border-bottom-half-right"></div>';
													 
													}
														
														
												}else if( loopWeekIncrement === 3 ){
													
													stringHtml += '<div class="border-top-remove"></div>'+
														'<div class="border-bottom-remove"></div>';
														
													if( needMarkerBorder ){
													 
														stringHtml += '<div class="make-border-top-half-left" style="border-color: #ff6a6a !important;"></div>';
														stringHtml += '<div class="make-border-bottom-half-right" style="border-color: #ff6a6a !important;"></div>';
													 
													}else{
														   
														stringHtml +=  '<div class="make-border-top-half-left" style="z-index:-1;"></div>';
														
														stringHtml += '<div class="make-border-bottom-half-right"></div>';
													 
													}
														
												}else if( loopWeekIncrement === 4 ){
													   
													stringHtml +=  '<div class="make-border-top-half-left" style="z-index:-1;"></div>';
															
												}
												
											}
											
												 
											if( today && ii >= 7){
												stringHtml += '<div class="make-border-top-half-left" style="z-index:-1;border-color: #ff6a6a !important;"></div>';
													 
											}
											//day reigster
											
											for(var jj = 0, kk = params.pillTaken; jj < kk.length ; jj++ )
											{
												if( kk[jj].day === loopDayIncrement ){
													pillDayRegNum = true;
													break;
												}
											} 
											
												 
												 
											//create day	
											 
											let emptyPill =  ( loopDayIncrement <= params.pill  ? "" : "empty" );
											 
											
											stringHtml += 
													'<div label-id="'+params.id+'" day="'+loopDayIncrement+'" date="'+dateLoopIncrement.toLocaleString("id-ID")+'" class="day '+ 
														( dateLoopIncrement.setHours(0,0,0,0) < dateNow.setHours(0,0,0,0) ? "pass" : "" )+' '+
														( today && !pillDayRegNum ? "pulse" : "" ) +
														' '+ emptyPill +' ">'+
														( pillDayRegNum ? 
															'<div class="pil '+ emptyPill +' drug-color-icon"></div>' :
															'<div class="pil '+ emptyPill +' drug-icon"></div>' ) +
														'<div class="strip-bottom"></div> '+
														'<div class="content centerdiv"> <abbr>'+dayNumLoop+'</abbr> <abbr>'+dayLoop+'</abbr> </div>'+
													'</div>';
											
											if( loopDayIncrement / 7 % 1 === 0 ){
												stringHtml +='</div>';
											} 
												
											
										}
										
										return stringHtml
										
									}()
								 
								)
								//containerPill.innerHTML = "";
								containerPill.appendChild( content )
								
								containerPill.setAttribute("label-id", params.id );
								
								
								scope.text( scope.qs("pill-active-month"), arrayMonth.join(" ~ ") )
							 
							},
							contentDomPillInfo = function( params ){
								
								
								let content = scope.stringToHtml5Template(
									'<li class=""> ' +
									'	<ul class="list-inline "> ' +
									'		<li class="modal-list left">  ' +
									'			<div class="container-radio '+ 	params.bg +' centerdiv center-text extrabold font11" style="" > ' + 
									'			</div> ' +
									'		</li> ' +
									
									'		<li class="modal-list right">  ' +
									'			<ul class="list-inline modal-list-container centerdiv"> ' +
									'				<li class="semibold">  ' +
														params.title +
									'				</li>  ' +
									'				<li class="light">  ' +
														params.content +
									'				</li> ' +
									'			</ul> ' +
									'		</li> ' +
									'	</ul> ' +
									'</li>'
								)
								
								
								containerPillInfo.appendChild( content );
								
							}, 
							dataNoteFnPillReg = function( dataNote, index ){
							 
								if( dataNote.objectId === dataObject.id && function(){
									
									if( stateFirstload.pillId ) return stateFirstload.pillId === dataNote.id;
									else  return dataNote.active;
									
								}() ){
									 
									let dateStart = scope.stringToDate( dataNote.dateStart ),
								
									dateEnd = new Date( dateStart );
										 
									dateEnd.setDate( dateEnd.getDate() + 27 ) ;
								 
									contentDomPillReg({
										id : dataNote.id,
										dateStart : dateStart,
										pill : dataNote.pillType.pill,
										emptyPill : dataNote.pillType.emptyPill,
										pillTaken : dataNote.pillTaken,
										notify : dataNote.notify
									});
										 
									// generate info pill
									
									
									
									let status  =  !dataNote.pillTaken.length ? 
										"Belum Mengkonsumsi Pil KB" : "Telah Mengkonsumsi "+dataNote.pillTaken.length+" Pil KB",
										
									pillType =	dataNote.pillType.pill+" Pil Hormon, "+dataNote.pillType.emptyPill+" Pil Kosong",
									bg = [ "bg-bluemarine","bg-redtosca","bg-grey-a","bg-bluesky","bg-turquoise","bg-cadetblue",
									"bg-sandybrown","bg-pink","bg-gray"],
									bgLen = bg.length - 1;
											
									
									containerPillInfo.innerHTML = "";
									
									contentDomPillInfo({ 
										title : "Judul",
										content : dataNote.title,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									  
									contentDomPillInfo({ 
										title : "Status",
										content : status,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
									contentDomPillInfo({ 
										title : "Tipe Pil",
										content : pillType,
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
									contentDomPillInfo({ 
										title : "Program Pil KB di mulai ",
										content : scope.dateToYMD({ date : dateStart, withYear : true }),
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									 
									contentDomPillInfo({ 
										title : "Program Pil KB berakhir ",
										content : scope.dateToYMD({ date : dateEnd, withYear : true }),
										bg : bg[ scope.random( bgLen, 0 ) ]
									});
									
								}
								
							},
							
							contentDomPillList = function( params ){
								
								let innerDom = function( innerParams ){
									     
									let content = scope.stringToHtml5Template(
										"<div class='notify-box-small'>"+
										"		<div class='bubble-box drug-black-icon bg-opacity-04'>"+
										"			<div class='notify-strip-b bg-grey-a'></div>"+
										"		</div>"+
										"		<abbr class='hidden'> </abbr>"+
										"		<ins class='left'>"+
										"			<span class='notify-small-title extrabold'>"+ params.title+"</span>"+
										"			<br>"+
										"			<span class='notify-small-detail light left'> "+params.status+"</span>"+ 
										"		</ins>"+
										"		<div class='bubble-small-left' Gerakan'  "+
										"			active='"+ params.active +"' " +
										"			label-id='"+ params.id +"' " +
										"			title='"+ params.title +"' " +
										"			startdate='"+ scope.dateToYMD({ date : params.dateStart, withYear : true }) +"' "+
										"			enddate='"+ scope.dateToYMD({ date :  params.dateEnd, withYear : true }) +"' " +
										"			datecreate='"+ scope.dateToYMD({ date : params.dateCreate, withYear : true }) +"' " +
										"			status='"+ params.status +"' " +
										"			pilltype='"+ params.pillType +"'></div>"+
										"</div>"
									); 
									
									//append
									innerParams.container.appendChild( content );
								},
								outterDom = function( outterParams ){
										
									if( outterParams.createContainer ){
										 
										let mainContent = scope.stringToHtml5Template(
											"<div class=' parent-pill-box "+ ( params.active ? "" : "halfOpacity" ) +" '>"+
												"<abbr class='semibold'>"+ params.timeSince +"</abbr>"+
												"<div class='wrap-content-data pt10'>"+
												
												"</div>"+
											"</div>" +
											"<div class='sparator mb20'></div>"
										),	 
										
										wrapContent = mainContent.querySelector(".wrap-content-data")
										
										innerDom({
											container : wrapContent
										}) 
										
										//append
										containerPillList.appendChild( mainContent );
										 
										//hapus sparator jika diperlukan
										let parentEls = scope.slice( container.querySelectorAll(".parent-pill-box") ),
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
										
									}else{
										
										innerDom({
											container : outterParams.wrapContent
										})
									} 
								}
								 
								 
								//find container based on date label
								let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
								emptyCnt = true;
								 
								 
								if( emptyCnt ){
									
									outterDom({
										createContainer : true
									});
								} 
							}, 
							dataNoteFnPillList = function( dataNote, index ){
							
								
								if( dataNote.objectId === dataObject.id ){
									   
									if( obj.loadMore.marker( "pill", containerWrapPillList, dataNote, index ) ){
										 
										let dateStart = scope.stringToDate( dataNote.dateStart ),
										
										dateCreate =  scope.stringToDate( dataNote.dateCreate ),
										
										dateEnd = new Date( dateStart );
										     
										dateEnd.setDate( dateEnd.getDate() + 27 );	 
										 
										let dateNow = new Date(),
										
										title = dataNote.title,
										   
										dateExpired = new Date( dateNow  ).setHours( 0,0,0,0 ) <= new Date( dateEnd ).setHours( 0,0,0,0 ),
									   
										status  = dataNote.active && dateExpired ? 
											 ( !dataNote.pillTaken.length ? "Belum Mengkonsumsi Pil KB" : "Telah Mengkonsumsi "+dataNote.pillTaken.length+" Pil KB" ) : "Program Pil KB Berakhir",
											
										pillType =	dataNote.pillType.pill+" Pil Hormon, "+dataNote.pillType.emptyPill+" Pil Kosong",
										
										isTodayOrYesterDay = scope.dateIsTodayOrYesterday( dateStart ),
											 
										timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD({ date : dateStart, isShortDay : true });
											 
										contentDomPillList({
											id : dataNote.id,
											active : dataNote.active,
											dateStart : dateStart,
											dateEnd : dateEnd,
											dateCreate : dateCreate,
											title : title, 
											status : status,
											pillType : pillType,
											timeSince : timeSince
										});
										
									}
												
									dataEmpty = false;
								}
							};
							 
							 //clear container
							if( !objectInitial ){
								 
								containerPill.innerHTML="";
								
								containerPillList.innerHTML = ""; 
								 
								//reset loadmore
								obj.loadMore.state.pill.reset();
							}; 
							
							
							let pillActive = false,
							pillNotify = false;;
								
							data.forEach( function( objPill ){ 
								if( objPill.active ){ 
									pillActive = true;
									pillNotify = objPill.notify;								
								} 
							})
								
							let pillActiveEmpty = !pillActive && !stateFirstload.pillId;
							 
							
							if( !pillActive && !stateFirstload.pillId  ){
								
								scope.removeClass( containerEmpty[0], "hidden" );
								scope.addClass( containerPill, "hidden" );
								scope.addClass( scope.qs("box-birth-pil-menu"), "hidden" );
								scope.addClass( scope.nthParent( containerPillInfo, 2 ), "hidden" );
									
								 
							}else{
								
								scope.addClass( containerEmpty[0], "hidden" );
								scope.removeClass( containerPill, "hidden" );
								scope.removeClass( scope.qs("box-birth-pil-menu"), "hidden" );
								scope.removeClass( scope.nthParent( containerPillInfo, 2 ), "hidden" );
								scope.addClass( scope.qs("trigger-notify-pill"), "hidden" ); 
								 
								 !stateFirstload.pillId && 
									scope[ pillNotify ? "removeClass" : "addClass"]( scope.qs("trigger-notify-pill"),  "hidden" );	 
								
								
							} 
							
							//update firstload only
							if( !stateFirstload.pill ){
							
																
									
								let swiperPill = new Swiper('.swiper-pill',{  
									observer: true,
									observeParents: true, 
									initialSlide: 0
								});
							 
								if( pillActive ){ 
									 
									setTimeout( function(){ 
										
										swiperPill.slideTo( 1, 300 );
										
										scope.addClass( scope.qs("pill-button"), "hidden" ) 
										
									}, 100 );
									
								};
								  
								
								scope.attachListener( scope.qs("trigger-pill-active"), 'click', function(){
									
									stateFirstload.pillId = "";
									//refresh
									obj.main.pill();
									
									data.length && swiperPill.slideTo( 1, 300 );
									 
									
								})
								 
								stateFirstload.swiperPill = swiperPill;
								
								setInterval(function(){
									 
									if( swiperPill.activeIndex && data.length ) scope.addClass( scope.qs("pill-button"),  "hidden" );
									 
								},1000) 
								
								
								
								
								//tab header
								let tabEl =  scope.slice( scope.qsAll("tab-kb-pil li") );
								  
								tabEl.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										  
										swiperPill.slideTo( getIndex, 300 );
										  
									}.bind( objLi, index ) )
									
								}) 
								
					 
								swiperPill.on('slideChange', function () {
									  
									scope[ swiperPill.activeIndex ? "addClass" : "removeClass" ]( scope.qs("pill-button"),  "hidden" );
									 
									tabEl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									 
									  
									scope.addClass( swiperPill.activeIndex ? tabEl[1] : tabEl[0] , "select" );
									 
								}); 
								
								stateFirstload.pill = true; 
							} 
							
							 
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
								 								  
								dataNoteFnPillReg( dataNote, index );   
								
								dataNoteFnPillList( dataNote, index );   
							})	
						 
							//if data container is empty
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty[1],  "hidden" );
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" );
							
							
							//buttons pill program
							btnPill = scope.slice( containerPill.querySelectorAll(".day") );
							
							btnPill.forEach(function( btnEl ){
								
								scope.attachListener( btnEl, 'click', function(){
									
									let sendBtn = scope.qs(".modal-menu-taken-pill .send-button"),
									removeBtn = scope.qs(".modal-menu-remove-pill .send-button"),
									id = this.getAttribute("label-id"),
									day = this.getAttribute("day"),
									date = this.getAttribute("date");
									
									sendBtn.setAttribute( "label-id", id );
									sendBtn.setAttribute( "day", day );
									removeBtn.setAttribute( "label-id", id );
									removeBtn.setAttribute( "day", day );
									 
									scope.text( scope.qs("select-date-pill"), scope.dateToYMD({
										date : scope.stringToDate( date ),
										isShortMonth : false,
										isShortDay : false,
										withYear : true
									}))
									
									sendBtn.setAttribute( "date", date ); 
									 
									 
									if(  !stateFirstload.pillId  ){
										
										//is day recorded
										let recordedDay =  false;
												
										data.forEach( function( objPill ){ 
											//find id
											if( objPill.id === id ){ 
												
												
												for( let ii of objPill.pillTaken ){
													 
													if( ii.day === parseInt( day ) ){
														
														recordedDay = true;
														
														scope.text( scope.qs("pill-taken-number"), day );
														
														scope.text( scope.qs("pill-taken-date"), scope.dateToYMD({ 
																date : scope.stringToDate( ii.date )
															})
														);
														 
														scope.text( scope.qs("pill-taken-datecreate"), scope.dateToYMD({ 
																date : scope.stringToDate( ii.dateCreate ), 
																withTime : true 
															})
														);
														
														break;
														
													}
													
												}						
											} 
										})
										
												
										recordedDay ? 
										obj.modalMenu.behaviour.openModalFadeIn("modal-menu-remove-pill") :
										obj.modalMenu.behaviour.openModalFadeIn("modal-menu-taken-pill");
									
									}
								})
									
							})
							
							/*button pill detail*/
							let pillBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
							
							pillBtns.map(function( btnPill, index ){
								
								scope.attachListener( btnPill, 'click', function(){
									  
									//modal confirm 
									scope.text( [ scope.qs("pill-detail-title"), scope.qs("pill-confirm-title") ], this.getAttribute("title") );
									scope.text( [ scope.qs("pill-detail-pilltype"), scope.qs("pill-confirm-pilltype") ], this.getAttribute("pilltype") );
									scope.text( [ scope.qs("pill-detail-startdate"), scope.qs("pill-confirm-startdate") ], this.getAttribute("startdate") );
									scope.text( [ scope.qs("pill-detail-enddate"), scope.qs("pill-confirm-enddate") ], this.getAttribute("enddate") );
									scope.text( [ scope.qs("pill-detail-status"), scope.qs("pill-confirm-status") ], this.getAttribute("status") );
									scope.text( [ scope.qs("pill-detail-datecreate"), scope.qs("pill-confirm-datecreate") ], this.getAttribute("datecreate") );
									 
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-pill-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("label-id") );
									scope.qs("button-pill-detail").setAttribute("label-id", ( this.getAttribute("active") === "false" ? this.getAttribute("label-id") : "" ) );  
									  
									obj.modal.behaviour.openModalFadeIn("modal-pill-detail");
									    
								})
							})
							
						},
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
								
								bubbleLeft.setAttribute("date-start", scope.dateToYMD({
									date :  scope.stringToDate( params.dateStart ),
									withYear : true,
									withTime : true
								}) );
								
								bubbleLeft.setAttribute("date-end",  scope.dateToYMD({
									date : scope.stringToDate( params.dateEnd ),
									withYear : true,
									withTime : true
								}));
								
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
								dataNotify = "",
								timeTimeFn = function( dateEnd, dateNow ){
									
									let timesUnit = scope.timeUnitBetween( dateEnd, dateNow  ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates({
										endDate : dateEnd,
										startDate : dateNow,
										timeString : "day"
										
									}) - 1;
									   
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
							if( !stateFirstload.remainder ){
								
									
								setInterval(function(){
									
									if( !/hidden/i.test( scope.qs("remainder-content").className ) ){
										 
										obj.dataStorage.notification.forEach(function( dataNote ){
										 
											dataNoteFn( dataNote ) // just update time stamp
										})
									}
								},1000);
								 
								stateFirstload.remainder = true; 
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
						circle : {
							pattern : "",
							totalMood : "",
							totalSymptom : "",
							markerLineUpper :[],
							markerOvulationDay : [],
							markerOverwriteSpDay : [],
							fertileCircle : 8,
							fertileLength : 8,
							periodLength : 0,
							circleLength : 0,
							circleShort : 0,
							circleLong : 0,
							generatePatternMarker : function( params ){
								
									let monthDiff = scope.monthDiff( params.lastDate, params.firstDate  )
									
									  
									let firstDate =   params.firstDate, 
									pattern = [],
									monthContainerFn = function(){
										 
										let monthYearPattern = [],
										monthRange =  monthDiff + 1,
										yearSelect = firstDate.getFullYear(),
										monthSelect = firstDate.getMonth() + 1,
										monthLoop = monthSelect ,
										YearLoop = yearSelect;
										 
										while( monthRange-- ){
											
											monthYearPattern.push({
												month : monthLoop ,
												year : YearLoop
											})
											
											monthSelect++;
											
											monthLoop = monthSelect > 12 ? monthSelect - 12  : monthSelect 
											YearLoop = monthSelect > 12 ? yearSelect + 1 : yearSelect ;
											
										}
										 
										return monthYearPattern;
									}(),
									patternLen = monthContainerFn.length;
									 
									monthContainerFn.forEach(function( objDate, index ){
										
										if( index === 0 ){ // array pertama
											
											pattern.push({
												color: params.color, 
												month: objDate.month, 
												year: objDate.year, 
												startDate: params.firstDate.getDate(),
												endDate: patternLen === 1 ? 
													params.lastDate.getDate() :
													( new Date(  objDate.year, objDate.month , 0 ).getDate() ),
												dayMarker : params.dayMarker
											})
											
										}else if( ( patternLen - 1 ) === index ){ // array terakhir
											
											pattern.push({
												color: params.color, 
												month: objDate.month, 
												year: objDate.year, 
												startDate: 1,
												endDate: params.lastDate.getDate(),
												dayMarker : params.dayMarker
											})
										 
											
										}else{ 
											
											let firstDate = 1,
											lastDate =  new Date( objDate.year, objDate.month , 0 ).getDate()
											
											pattern.push({
												color: params.color, 
												month: monthContainerFn[ index ].month, 
												year: monthContainerFn[ index ].year, 
												startDate: firstDate,
												endDate: lastDate,
												dayMarker : params.dayMarker
											})
										
										}
										
									}) 
									 
									return pattern;
								
							},
							calendarParams : {
								firstDate : new Date("2020/5/25"),
								markerContainer : [
									 /**{ color: "blue", month: 11, year: 2019, startDate: 28, endDate: 28}*/
								],
								markerParams : {
									fn : function( markerContainer, monthSelect ){
										
										
										
										//swaping
										if( this.dateFirstCapture > this.dateLastCapture ){
											let tmp = this.dateFirstCapture;
											this.dateFirstCapture = this.dateLastCapture;
											this.dateLastCapture = tmp; 
										}
										
										
										//clear marker
										markerContainer.length = 0
										
										let monthLen = monthSelect.length,
										testThreeMonth = false,
										testFirstMonth =  this.dateFirstCapture.getMonth() ===  this.dateLastCapture.getMonth(),
										testSecondMonth = false;
										 
										if( monthLen === 3 ){
											
											let strFirstMonthCapture = scope.dateToYMD({ date : this.dateFirstCapture, isShortMonth : true }),
											firstMonthCapture =  strFirstMonthCapture.split(" "),
											firstMonthSelect = firstMonthCapture[ firstMonthCapture.length - 1 ],
											
											strLastMonthCapture = scope.dateToYMD({ date : this.dateLastCapture, isShortMonth : true }),
											lastMonthCapture =  strLastMonthCapture.split(" "),
											lastMonthSelect = lastMonthCapture[ lastMonthCapture.length - 1 ];
											
											testSecondMonth =	
												firstMonthSelect === monthSelect[0] && lastMonthSelect === monthSelect[1] ||
												firstMonthSelect === monthSelect[1] && lastMonthSelect === monthSelect[2];
												
											 
										}
										// generate marker
										
										if( monthLen === 1 || testFirstMonth ){
											
											markerContainer.push({ 
												color: "blue", 
												month: this.dateFirstCapture.getMonth() + 1, 
												year: this.dateFirstCapture.getFullYear(), 
												startDate: this.dateFirstCapture.getDate(),
												endDate: this.dateLastCapture.getDate()
											}) 
											
										}else if( monthLen === 2 && !testFirstMonth || testSecondMonth ){
											 
											let lastOfDateA = scope.lastDayOfMonth( this.dateFirstCapture );
											  
											markerContainer.push({ 
												color: "blue", 
												month: this.dateFirstCapture.getMonth() + 1, 
												year: this.dateFirstCapture.getFullYear(), 
												startDate: this.dateFirstCapture.getDate(),
												endDate: lastOfDateA.getDate()
											}) 
											
											markerContainer.push({ 
												color: "blue", 
												month: this.dateLastCapture.getMonth() + 1, 
												year: this.dateLastCapture.getFullYear(), 
												startDate: 1,
												endDate: this.dateLastCapture.getDate()
											}) 
											
											
										}else if( monthLen === 3 ){
											 
											let lastOfDateA = scope.lastDayOfMonth( this.dateFirstCapture ),
											dateSecondMarker = new Date( this.dateFirstCapture );
											
											dateSecondMarker.setMonth( dateSecondMarker.getMonth() + 1 );
											
											let lastOfDateB = scope.lastDayOfMonth( dateSecondMarker )
											  
											markerContainer.push({ 
												color: "blue", 
												month: this.dateFirstCapture.getMonth() + 1, 
												year: this.dateFirstCapture.getFullYear(), 
												startDate: this.dateFirstCapture.getDate(),
												endDate: lastOfDateA.getDate()
											}) 
											
											markerContainer.push({ 
												color: "blue", 
												month: dateSecondMarker.getMonth() + 1, 
												year: dateSecondMarker.getFullYear(), 
												startDate: 1,
												endDate: lastOfDateB.getDate()
											}) 
											
											markerContainer.push({ 
												color: "blue", 
												month: this.dateLastCapture.getMonth() + 1, 
												year: this.dateLastCapture.getFullYear(), 
												startDate: 1,
												endDate: this.dateLastCapture.getDate()
											}) 
											
											
										}
										
										
										
									},
									dateFirstCapture : "",
									dateLastCapture : "",
									state : true
								},
								monthRange : 1,
								monthSelect : [],
								yearSelect : [],
								loadingState : false
							},
							update : function( objectInitial ){
								
								let self = this,
								calendarParams = self.calendarParams, 
								main = scope.qs("circle-content"),
								containerCalendar = main.querySelector(".wrap-container-st-date"), 
								domCalendar = function( params ){
									  
									containerCalendar.innerHTML = "";
									self.calendarParams.monthSelect.length = 0
									self.calendarParams.yearSelect.length = 0
									
									let cycleLoop = 1,
									initialMarker =  false,
									
									domMonth = function( month, year ){
										 
										let loopStart = 0;
										selectMonth = month,
										loopDay = 0,
										dom = [],
										dateNow = new Date(),
										
										firstDay = new Date( year+'/'+month+'/1').toString().split(" ")[0].toLowerCase(),
										 
										marker = function( loopDay, allowDay ){
											 
											let strDate =  year+'/'+month+'/'+loopDay,
											loopDate = new Date( strDate ).setHours(0,0,0,0),
											tranMarker = {
												recorded : "",
												transactionVal :0
											},
											lineUpper = "",
											opacity = allowDay ? "" : ""; // "halfOpacity" ;
											  
											//line-upper 
											 
											for( let ii = 0, len = params.markerLineUpper.length; ii < len; ii++ ){
												
												let objLoop = params.markerLineUpper[ii];
												 
												if( loopDate === objLoop.date ){
													 
													 let markerClass = objLoop.markerClass,
													 clsParent = "",
													 clsChild = "";
													   
													 for( let jj = 0, lens = markerClass.length ; jj < lens ; jj++ ){
														
														//cuma sampek 3 icon dulu 
														if( jj >= 3 ) break; 
												
														
														clsParent = markerClass[jj]+" ";
														
														switch( jj ){
															
															case 1 :
																
																clsChild = "second ";
															
																break;
															
															case 2 :
																
																clsChild = "third ";
															
																break;
														}
														
														lineUpper += '<div class="upper-st-date '+ clsParent +' '+ clsChild +' ">'+ tranMarker.recorded +'</div>'
														
													 }
													 
													break;
												}
												
											}
											
											
											
											let isNoted = "";
											  
											for( let ii = 0, len = params.markerOverwriteSpDay.length; ii < len; ii++ ){
												
												let objLoop = params.markerOverwriteSpDay[ii];
												 
												if( loopDate === objLoop.date ){
													  
													isNoted = objLoop.markerClass
													  
													break;
												}
												
											}
											 
											 
											if( loopDay !== "" && params.marker.length ){
												 
												let innerDom = "<div class='c-date-picker"+ opacity +"' day='"+loopDay+"' month='"+month+"' year='"+year+"'>"+
												"<div></div>"+
												lineUpper +
												"<div class='"+ isNoted +"'>"+ loopDay +"</div></div>";
												
												// mark period cycle
												
												if( initialMarker && params.cyclePeriod > cycleLoop ){
													 
													cycleLoop++;
													
													innerDom = 
													"<div class='c-date-picker"+ opacity +"' day='"+loopDay+"' month='"+month+"' year='"+year+"'>" +
														"<div></div>" +
														//( params.intervalPeriod >= cycleLoop && '<div class="upper-st-date second period-color-icon"></div>' || "" ) +
														lineUpper +
														"<div class='"+ isNoted +" '>"+loopDay+"</div>" +
													"</div>"
													
												}
												   
												
												// mark specific day or today
												let markSpesificDay = false,
												markToday =  params.dateToday === loopDay 
													&& params.monthToday === month
													&& params.yearToday === year,
												classSpesificDay = "";
												
												for( let ii = 0, len = params.markerSpecificDay.length; ii < len; ii++ ){
													
													let objLoop = params.markerSpecificDay[ii];
													 
													if( loopDate === objLoop.date ){
														
														markSpesificDay = true;
														
														classSpesificDay =  objLoop.markerClass;
														
														break;
													}
													
												}
												
												if( markToday || markSpesificDay ){
														 
													if( markSpesificDay ){
														
														//rewrite innerDom termasuk mark today
														innerDom = 
														"<div class='c-date-picker "+ opacity +"' day='"+loopDay+"' month='"+month+"' year='"+year+"'>" +
															"<div></div>" +
															lineUpper +
															"<div class='body-st-date centerdiv mark "+ classSpesificDay +"'>"+loopDay+"</div>" +
														"</div>"
														 
													}else{
															 
														innerDom = 
														"<div class='c-date-picker "+ opacity +"' day='"+loopDay+"' month='"+month+"' year='"+year+"'>" +
															"<div></div>" +
															lineUpper +
															"<div class='body-st-date centerdiv mark today'>"+loopDay+"</div>" +
														"</div>"
														 
													}
													
												}
												
												
												 
													
												params.marker.forEach(function( objMaker ){
													 
													//generate line and date body 
													if( objMaker.startDate <= loopDay && loopDay <= objMaker.endDate && objMaker.month === month && objMaker.year === year ){
														
														let lineClassBool = objMaker.startDate === objMaker.endDate;
														
														initialMarker = true;
														 
														let lineClass = ( lineClassBool ? "": "line-st-date" ) +" centerdiv "+objMaker.color,
														bodyClass ="body-st-date centerdiv",
														pulseStart = "",
														pulseEnd = "";
														
														if( objMaker.startDate === loopDay ){
															 
															lineClass+=" border-rad-left";
															bodyClass+=" mark "+ (objMaker.startPulse && params.notifyStart ? "pulse pulse-start-ovulatory " : "" ) +" "+objMaker.color+"-border";
															pulseStart = ( objMaker.startPulse ? "label-id='"+ params.id+"'"+'  '+"date-start='"+new Date( year+'/'+month+'/'+loopDay ).toLocaleString("id-ID")+"'" : "" );
															
														}else if( objMaker.endDate === loopDay ){ 
															
															lineClass+=" border-rad-right";
															bodyClass+=" mark "+ (objMaker.endPulse && params.notifyEnd ? "pulse pulse-end-ovulatory " : "" ) +" "+objMaker.color+"-border";
															pulseEnd = ( objMaker.endPulse ? "label-id='"+ params.id+"'"+'  '+"date-end='"+new Date( year+'/'+month+'/'+loopDay ).toLocaleString("id-ID")+"'" : "" );
														}
														
														if( markToday || markSpesificDay ){
																
															if( markSpesificDay ){
																
																bodyClass+=" mark "+classSpesificDay
																
															}else{
																
																bodyClass+=" mark today"
																
															}
																
														}
														
														let dayMarker = objMaker.dayMarker ? "" : " period='1'" ;
														 
														innerDom = 
														"<div class='c-date-picker period"+ opacity +"' day='"+loopDay+"' month='"+month+"' year='"+year+"'  "+ dayMarker +" >" +
															//( params.intervalPeriod >= cycleLoop && '<div class="upper-st-date second period-color-icon"></div>' || "" ) +
															lineUpper +
															"<div class='"+lineClass+"'></div>" +
															"<div class='"+bodyClass+"'  "+pulseStart+" "+pulseEnd+">"+loopDay+"</div>" +
														"</div>"
														
													 
													} 
													
												})
												 
												return innerDom;

											}else{
												
												return"<div></div>";
										 
											
											}
											
										};
										
										switch( firstDay ){ // empty loop
												case "sun" : loopStart = 0; // minggu
											break;
												case "mon" : loopStart = 1; // senen
											break;
												case "tue" : loopStart = 2; // selasa
											break;
												case "wed" : loopStart = 3; // rabu
											break;
												case "thu" : loopStart = 4; // kamis
											break;
												case "fri" : loopStart = 5; // jumat
											break;
												case "sat" : loopStart = 6; // sabtu
											break;
										}
										  
										while( selectMonth === month ){
											 
											loopStart--  
											 
											if( loopStart >= 0 ){
											 
												dom.push( marker( "" ) )
											 
											}else{
													
												let allowDay = params.firstDate <= dateNow
												 
												params.firstDate.setDate( params.firstDate.getDate() + 1 )
												
												selectMonth = new Date( params.firstDate ).getMonth() + 1, // january is 0 an so on
												 
												loopDay ++;
												 
												dom.push(  marker( loopDay, allowDay ) )
											}	
											
										}
										
										return dom.join("")
										 
									},
									generateCalendar = function(){
										 
										params.monthCreate.forEach(function( objCalendar ){ 
											
											let date = new Date( objCalendar.year+'/'+objCalendar.month+'/1'),
											strDateShort = scope.dateToYMD({ date : date, isShortMonth : true })
											strDateLong = scope.dateToYMD({ date : date }),
											strMonthShort = strDateShort.split(" ")[2],
											strMonthLong = strDateLong.split(" ")[2],
											
											fragment =  scope.stringToHtml5Template(  
												'<div class="border-st-date container-st-date pt10"  >'+ // style="padding-left:10px !important"
												'		<div class="title extrabold mt15">'+strMonthLong+'</div>'+
												'		<div class="box-st-date light content pt20">'+
														domMonth( objCalendar.month, objCalendar.year ) +
												'		<div>'+
												'</div>'
											);
											
											containerCalendar.appendChild( fragment );
											  
											self.calendarParams.monthSelect.push( strMonthShort )
											 
											self.calendarParams.yearSelect.push( objCalendar.year.toString() ) 
										});
										
										
									}
									
									generateCalendar();
									
									self.calendarParams.yearSelect = scope.uniqueArray( self.calendarParams.yearSelect )
									  
									/*
									scope.text( scope.getFirstChild( scope.qs("btn-mt-date-option") ), 
										self.calendarParams.monthSelect.join(",")+" - "+
										self.calendarParams.yearSelect.join(",") )
									 */
								},
								domCalendarFn = function(){
									
									
									let firstDate =  new Date( self.calendarParams.firstDate ),
									firstDateFn = function(){
										
										firstDate.setDate(1)
										firstDate.setMonth( firstDate.getMonth() - (  self.calendarParams.monthRange - 1 ) )
										
									},
									monthContainerFn = function(){
										
										firstDateFn();
										
										let pattern = [],
										monthRange =  self.calendarParams.monthRange,
										yearSelect = firstDate.getFullYear(),
										monthSelect = firstDate.getMonth() + 1,
										monthLoop = monthSelect ,
										YearLoop = yearSelect;
										 
										while( monthRange-- ){
											
											pattern.push({
												month : monthLoop ,
												year : YearLoop
											})
											
											monthSelect++;
											
											monthLoop = monthSelect > 12 ? monthSelect - 12  : monthSelect 
											YearLoop = monthSelect > 12 ? yearSelect + 1 : yearSelect ;
											
										}
										 
										return pattern;
									},
									dateNow = new Date(),
									intervalPeriod = 5,
									cyclePeriod = 5,
									yearToday = dateNow.getFullYear(),
									monthToday = dateNow.getMonth() + 1,
									dateToday = dateNow.getDate(),
									
									monthContainer = monthContainerFn(),
									markerContainer = calendarParams.markerContainer; 	  
										   
									/**/
									domCalendar({
										id : "test",
										firstDate : firstDate,
										cyclePeriod : cyclePeriod,
										intervalPeriod : intervalPeriod,
										yearToday : yearToday,
										monthToday : monthToday,
										dateToday : dateToday,
										monthCreate : monthContainer,
										marker : markerContainer,
										markerOverwriteSpDay : self.markerOverwriteSpDay,
										markerLineUpper :self.markerLineUpper,
										markerSpecificDay : self.markerOvulationDay
									});
									 
									
								},
								generatePattern = function(){
									  
									//seleksi pattern untuk haid, lama haid, circle haid, tanggal mulai tanggal selesai
									let collections = [],
									marker = {},
									markerEmpty = {},
									lastProp = "",
									lastLabel = "",
									newState = true;
									 
									btnsCalendar.forEach(function( el ){
										
										let labelPeriod = el.getAttribute("period"),
										year = el.getAttribute("year"),
										month = el.getAttribute("month"),
										day = el.getAttribute("day");
										
										
										if( !markerEmpty[ year+"/"+month ] ){
											
											markerEmpty[ year+"/"+month ] = []
											
										}
										 
										if( labelPeriod === "1" ){
											  
											let markerSelect = marker[ year+"/"+month ],
											strDate = day+"/"+month+"/"+year+" "+"00.00.00";
										
											//buat properti baru untuk bulan dan tahun berbeda
											//buat pattern untuk digunakan pada statistik dan kalender
											  
											if( !markerSelect || newState ){
											 
												if( marker[ year+"/"+month ] instanceof Array ){
														 
													marker[ year+"/"+month ].push({
														
														startDate : strDate,
														endDate : strDate,
														month : month,
														year : year 
														
													})

												}else{
													 
													marker[ year+"/"+month ] = [{
														
														startDate : strDate,
														endDate : strDate,
														month : month,
														year : year 
														
													}]
												
												}
												
												lastMarker = marker[ year+"/"+month ][0];
												
											}else{
												
												
												let arrMarker =  markerSelect[ markerSelect.length - 1 ];
												arrMarker.endDate = strDate;
												
											}
											
											if( newState ){ 
												
												collections.push({
													
													startDate : strDate,
													endDate : strDate,
													circleLength : 1,
													periodLength : 1 
													
												})

												lastProp = collections[0];
												
											}else{
												
												let arr =  collections[ collections.length - 1 ]
												
												arr.endDate = strDate;
												arr.circleLength += 1; 
												arr.periodLength += 1;
												 
												lastProp = arr;
											}
											
											
											newState = false;
											
										}else if( lastProp ){
											
											//mengidentifikasi circle length
											lastProp.circleLength += 1;
											  
											newState = true;
												 
										}
										
											
									}) 
									
									return {
										collections : collections,
										marker : marker,
										markerEmpty : markerEmpty
									}
									
								};
 
								domCalendarFn();
 								
								//bind to click event for calendar
								let btnsCalendar = scope.slice( main.querySelectorAll(".c-date-picker") );
								  
								self.pattern = generatePattern( btnsCalendar )
								 
								btnsCalendar.forEach(function( elBtn ){
									 
									//loading animation delay
									scope.attachListener( elBtn, 'click', function(){
										 
										let lastChild = scope.getLastChild( this ),
										markerContainer = self.calendarParams.markerContainer,
										monthSelect = self.calendarParams.monthSelect,
										markerState = self.calendarParams.markerParams,
										year = this.getAttribute("year"),
										month = this.getAttribute("month"),
										day = this.getAttribute("day"); 
										 
										lastChild.className = "centerdiv body-st-date mark period";	
											
										if( this.getAttribute("period") ){
											
											this.removeAttribute("period")	
												 
										}else{
											
											this.setAttribute("period", "1" )									
											
										}
										 
										let pattern = generatePattern( btnsCalendar )
										marker = pattern.marker,
										markerEmpty = pattern.markerEmpty,
										collections =  pattern.collections;
										
										self.pattern = pattern;
										
										//merger marker with markerEmpty
										//marker empty untuk menghilangkan period yang tinggal satu
										
										let mergerMarker = scope.extend( markerEmpty, marker );
										 
									
											obj.storageCrud({
												dataStorage : "period",
												type : "update",
												period : collections ,
												marker : mergerMarker
											},
											function( objNotify ){
													
												obj.main.circle.init()
													
											})
										 
										 
									})
									
								}) 
								
								
							},
							markerPeriods : function(){
																
								let self = this,
								markerContainer = this.calendarParams.markerContainer,
								data = obj.storageFilter( obj.dataStorage.period ),
								dateNow = new Date(); 
							 
								let isEmpty = true
								
								if( data.length ){
										
									for( let ii in data[0].marker ){
										
										let objDate = data[0].marker[ii]
										
										objDate.forEach(function( objMarker ){
											
											markerContainer.push({ 
												color: "orange", 
												month: parseInt( objMarker.month ), 
												year: parseInt( objMarker.year ), 
												startDate: scope.stringToDate( objMarker.startDate ).getDate(),
												endDate: scope.stringToDate( objMarker.endDate ).getDate() 
											})
											
											isEmpty =  false;
										
										})
										  
									}
									
								}
								//mencegah error
								if( isEmpty ){
										
									markerContainer.push({ 
										dayMarker : true,
										color: "orange", 
										month: dateNow.getMonth() + 1, 
										year: dateNow.getFullYear(), 
										startDate: dateNow.getDate(),
										endDate: dateNow.getDate()
									})
								
								}
								
							},
							markerNextFertileAndaPeriodDays : function(){
								
								let self = this,
								markerContainer = this.calendarParams.markerContainer,
								data = obj.storageFilter( obj.dataStorage.period ),
								marker = {},
								firstDate = "",
								startDateTemp = "",
								periodPattern = "",
								tempObj = "";
								 
								
								self.markerOvulationDay.length = 0
								
								if( data.length ){
									
									let temp = [];
									
									for( let ii in data[0].marker ){
										 											
										temp.push({
											index : ii,
											data : data[0].marker[ii]
										})

									}
									
									temp.sort(function( a, b ) { 
									
										let dateB = new Date( b.index+"/1" ),
										dateA = new Date( a.index+"/1" ) ;
										
										return dateB  -  dateA 
									
									})
									
									//loop last of two untukk array yang dibutuhkan
									let loop = 0;
									for( let ii of temp ){
										
										if( ii.data.length ){
											
											
											loop++;
											
											if(  loop === 1 ){
													
												tempObj = ii.data[ ii.data.length - 1 ];
												firstDate = tempObj.startDate,
												startDateTemp = scope.stringToDate( tempObj.startDate ),
												periodPattern = tempObj;
												  
											}
											 
											//validasi marker berantai misal tanggal 28~29 + 1~2 equal 28~2
											//jadi firstDatenya itu tanggal 28
											
											if( loop === 2 ){
												
												tempObj = ii.data[ ii.data.length - 1 ],
												tempDate = new Date( "2020", ( tempObj.month - 1 ) + 1, 0 ),
												dateEndObj = scope.stringToDate( tempObj.endDate );
												  
												//iyes ini adalah marker chain
												if( startDateTemp.getDate() === 1 &&
													tempDate.toDateString() ===  dateEndObj.toDateString() ){
													
													//rewrite firstDate
													firstDate = tempObj.startDate
													periodPattern = tempObj;
													
												}
												
											}
											 
											
											if( loop >= 2 ) break;
										}
									}
									 
									 
								}
								
								 
								  
								if( firstDate ){
									
									//period marker
									let latestPeriodDate =  scope.stringToDate( firstDate );
									nextPeriodFirstDate = new Date( latestPeriodDate );
									
									nextPeriodFirstDate.setDate( nextPeriodFirstDate.getDate() + self.circleLength );
									
									let nextPeriodLastDate = new Date( nextPeriodFirstDate );
									
									nextPeriodLastDate.setDate( nextPeriodLastDate.getDate() + self.periodLength - 1 ) 
									 
									let periodMarker = self.generatePatternMarker({
										firstDate : nextPeriodFirstDate,
										lastDate : nextPeriodLastDate,
										color : "blue",
										dayMarker : true
									})
									
									self.calendarParams.markerContainer = self.calendarParams.markerContainer.concat( periodMarker )
									 
									 
									//filter marker
									let nextFertileFirstDate = new Date( latestPeriodDate );
									
									nextFertileFirstDate.setDate( nextFertileFirstDate.getDate() + self.fertileCircle );
									
									let nextFertileLastDate = new Date( nextFertileFirstDate );
									
									nextFertileLastDate.setDate( nextFertileLastDate.getDate() + 6 ) 
									 
									 
									let fertileMarker = self.generatePatternMarker({
										firstDate : nextFertileFirstDate,
										lastDate : nextFertileLastDate,
										color : "green",
										dayMarker : true
									})
									
									
									//ovulation day
									
									let nextOvulationDate = new Date( nextFertileFirstDate );
									
									nextOvulationDate.setDate( nextOvulationDate.getDate() + 6 - 1 ) 
									 
									 
									self.markerOvulationDay =  [{
										date : nextOvulationDate.setHours(0,0,0,0),
										markerClass : "fertile flower-icon"
									}]
									
									 
									self.calendarParams.markerContainer = self.calendarParams.markerContainer.concat( periodMarker.concat( fertileMarker ) )
									 
									 
									//untuk header text
									

									self.headerText({
										nextPeriod : fertileMarker,
										nextCircle : periodMarker,
										periodDay : periodPattern,
										ovulationDay : nextOvulationDate
									})
									 
									 
								}else{
									
									//kosong
									
									self.headerText({
										nextPeriod : [],
										nextCircle : [],
										periodDay : "",
										ovulationDay : ""
									})
									 
									 
									
								}
								
								
							},
							markerNotes : function(){
								
								let self = this,
								markerContainer = this.calendarParams.markerContainer,
								data = obj.storageFilter( obj.dataStorage.period ),
								marker = {},
								firstDate = "";
								
								self.markerLineUpper.length = 0;
						 
								if( data.length && data[0].note ){
									for( let ii in data[0].note ){
										
										let objDate = data[0].note[ii],
										markerClass = [];
										
										if( objDate.symptom.length ) markerClass.push("dizzy-icon");
										
										if( objDate.mood.length ) markerClass.push("mood-icon");
										   
										if( objDate.intimacy ) self.markerOvulationDay.push({
											date : scope.stringToDate( objDate.dateStart ).setHours(0,0,0,0),
											markerClass : "fertile bg-size-70 heart-icon"
										});
										   
										self.markerOvulationDay.push({
											date : scope.stringToDate( objDate.dateStart ).setHours(0,0,0,0),
											markerClass : "fertile bg-size-70 note-pink-icon"
										});
										   
										self.markerLineUpper.push({
											date : scope.stringToDate( objDate.dateStart ).setHours(0,0,0,0),
											markerClass : markerClass
										})
										  
									}
								}
								 
								
								
							},
							markerPillTaken : function(){
								
								let self = this,
								data = obj.storageFilter( obj.dataStorage.pill );
								
								for( let ii of data ){
									
									if( ii.active ){
										
										pill : for( let jj of ii.pillTaken ){
											
											let pillDate = scope.stringToDate( jj.date ).setHours(0,0,0,0);
											
											for( let ll of self.markerLineUpper ){
												
												if( ll.date === pillDate ){
													
													//tanggal ada di liner upper push data baru
													
													ll.markerClass.unshift("drug-color-icon bg-size-90");
													 
													continue pill;
													
												}
												
											}
											 
											//tanggal gak ada create array baru
											self.markerLineUpper.push({
												date : pillDate,
												markerClass : ["drug-color-icon bg-size-90"]
											})
											
										}
									 
										break;
									
									}
									
								}
								  
								 
							},
							markerInjectTaken : function(){
								
								let self = this,
								dummyMarker = [],
								data = obj.storageFilter( obj.dataStorage.inject );
								
								for( let ii of data ){
									
									if( ii.active ){
											
										let dateStart = scope.stringToDate( ii.dateStart ),
										dateEnd =  scope.stringToDate( ii.dateEnd ),
										dateLoop =  new Date( dateStart ),
										count = 0;
											 
										injectLoop : while( dateLoop < dateEnd  ){
											 
											let createMarker =  true;

											for( let ll of self.markerLineUpper ){
												
												if( ll.date === dateLoop.setHours( 0,0,0,0 ) ){
													
													//tanggal ada di liner upper push data baru
													
													ll.markerClass.unshift("injection-color-icon bg-size-100");
													  
													createMarker =  false;
									
													break
													
												}
												
											}
											 
											if( createMarker ){
													
												//tanggal gak ada create array baru
												dummyMarker.push({
													date : dateLoop.setHours( 0,0,0,0 ),
													markerClass : ["injection-color-icon bg-size-100"]
												})
												  
											}
											  											 
											dateLoop.setDate( dateLoop.getDate() + 1 )
											 
										}
											
										break;
									
									}
									
								}	
									
									
								self.markerLineUpper = self.markerLineUpper.concat( dummyMarker );
								 
								
							},
							headerText : function( params ){
								
								let dateTemp = new Date(),
								dateNow = new Date( dateTemp.getFullYear()+"/"+ ( dateTemp.getMonth() + 1 )+"/"+dateTemp.getDate() ),
								element = [ scope.qs("period-header-text") , scope.qs("period-headertop-text") ];
							 
								if( params.periodDay ){
								 
									let periodDay = params.periodDay
									startDate = scope.stringToDate( periodDay.startDate )
									endDate = scope.stringToDate( periodDay.endDate ), 
									
									diffDays = "",
									
									periodObjA = params.nextPeriod[0],
									periodObjB = params.nextPeriod[ params.nextPeriod.length - 1 ],
									fertileStartDate = new Date( periodObjA.year+"/"+periodObjA.month+"/"+periodObjA.startDate ),
									fertileEndDate = new Date( periodObjB.year+"/"+periodObjB.month+"/"+periodObjB.endDate );
										   
									
									circleObjA = params.nextCircle[0],
									circleObjB = params.nextCircle[ params.nextCircle.length - 1 ],
									circleStartDate = new Date( circleObjA.year+"/"+circleObjA.month+"/"+circleObjA.startDate );
									circleEndDate = new Date( circleObjB.year+"/"+circleObjB.month+"/"+circleObjB.startDate );
									
									
									//user sedang mensturasi
									if( startDate <= dateNow && endDate >= dateNow ){
										
										diffDays = scope.daysBetween({
											startDate : startDate,
											endDate : dateNow
										}); 
										
										scope.text( element, "Memasuk hari ke "+ ( diffDays + 1 ) +" menstruasi" )
									
									//user akan memasuki masa subur
									}else if( dateNow >= endDate && dateNow < fertileStartDate ){
										
										diffDays = scope.daysBetween({
											startDate : fertileStartDate,
											endDate : dateNow,
										})
										 
										scope.text( element, "Memasuk masa subur "+ diffDays +" hari lagi" )
									 
									//user memasuki masa subur dan ovulasi
									}else if( dateNow >= fertileStartDate && dateNow <= fertileEndDate ){
										
										diffDays =  scope.daysBetween({
											startDate : fertileStartDate,
											endDate : dateNow,
										}); 
										
										if( params.ovulationDay.toDateString()  ===  dateNow.toDateString() )
											scope.text( element, "Hari ini adalah prediksi tanggal ovulasi" );
										else
											scope.text( element, "Memasuk hari ke "+ ( diffDays + 1 ) +" Masa subur" );
									
									
									//user akan memasuki masa menstruasi berikutnya
									}else if( fertileEndDate >= endDate && dateNow < circleStartDate ){
										
										diffDays = scope.daysBetween({
											startDate : dateNow,
											endDate : circleStartDate,
										})
										 
										scope.text( element, "Memasuki masa menstruasi berikutnya "+ diffDays +" hari lagi" )
									 
									//user memasuki masa menstruasi berikutnya
								
									}else if( dateNow >= circleStartDate ){
											
										diffDays = scope.getMinutesHourDayOrWeekBetweenDates({
											startDate : circleStartDate,
											endDate : dateNow,
											timeString : "day"
										}); 
										 
										//user terlambat mensturasi	 berdasarkan prediksi tanggal circle   
										if( dateNow.toDateString()  === circleStartDate.toDateString()  )
											scope.text( element, "Menstruasi harusnya dimulai hari ini" );
										else
											scope.text( element, "Menstruasi terlambat "+diffDays+" hari" );
									
									}
									 
									if(  startDate > dateNow ){
										
										scope.text( element, "Menstruasi yg direkam tidak boleh melewati tanggal hari ini" );
									}
									   
									 
								}else {
								
									scope.text( element, "Tap tanggal untuk rekam mensturasi" )
									scope.removeClass( element, "hidden" )
									
								}
								
								 
							},
							notes:function( objectInitial ){
								 
								let self = this,
								main = scope.qs("circle-content"),
								container = scope.qs("box-note-content"),
								containerNote = scope.qs("box-note-program"),
								dataFilter = obj.storageFilter( obj.dataStorage.period ),
								dataRaw = dataFilter.length ? dataFilter[0].note : [],
								dataArr = [],
								containerEmpty = scope.slice( main.querySelectorAll(".content-empty") ), 
								dataEmpty = true,
								data =  function(){
			  
									let calendarParams = self.calendarParams,
									dateLastCapture = calendarParams.markerParams.dateLastCapture,
									dateFirstCapture = new Date( dateLastCapture ); 
									dateFirstCapture.setMonth( dateFirstCapture.getMonth() - ( calendarParams.monthSelect.length - 1 ) )
									   
									dateLastCapture.setMonth( dateLastCapture.getMonth() + 1 );
									dateLastCapture.setDate(-1)  
									     
									//filter content
									let temporary = [],
									mood = [],
									symptom = [];
									
									for(let ii in dataRaw ){ 
									
										let objRaw = dataRaw[ii],
										dateNow = new Date(),
										
										dateStart = scope.stringToDate( objRaw.dateStart );
										   
										//pakasa dateFirstCapture ke tanggal 1
										dateFirstCapture.setDate( 1 )
										  
										if( dateFirstCapture <= dateStart && dateStart <= dateLastCapture ){
											
											temporary.push( objRaw )
											
											objRaw.mood.forEach(function( strMood ){
												
												mood.push( strMood )
											})
											
											objRaw.symptom.forEach(function( strSymptom ){
												
												
												symptom.push( strSymptom )
											})
											 
											
										}
									};
														 
									//generate total mood dan gejala
									let totalMood = {};
									mood.forEach(function(x) { totalMood[x] = ( totalMood[x] || 0) + 1 });
									
									let totalSymptom = {};
									symptom.forEach(function(x) { totalSymptom[x] = ( totalSymptom[x] || 0) + 1  });
									
									mood.length = 0;
									symptom.length = 0;
									 
									self.totalMood = totalMood; 
									self.totalSymptom = totalSymptom;
									 
								 
									return temporary;
									
								}(),
								contentDom = function( params ){
									
									let innerDom = function( innerParams ){
										
										let stringIntimacy = "";
									
										params.intimacy &&	( stringIntimacy += "<div class='p0 mr5 capsule box purple bg-size-60 heart-icon'></div>" )
									
										
										let stringMood = "";
										
										params.mood.forEach(function( objMood ){
											
											stringMood += "<div class=' mr5 capsule red light'>"+ objMood +"</div>"
											
										})
										
										let stringSymptom = "";
										
										params.symptom.forEach(function( objSymptom ){
											
											stringSymptom += "<div class=' mr5 capsule blue light'>"+ objSymptom +"</div>"
											
										})
										
										
										
											 
										let content = scope.stringToHtml5Template(
											"<div class='notify-box-small pl0 pb0 pr25 ' style='margin-left:0px'>"+
										
											"		<abbr class='hidden'> </abbr>"+
											"		<ins class='left pb20'>"+
											"			<span class='notify-small-title light'>"+ scope.stringLimit( params.note, 110 ) +" </span>"+
											"			<br>"+
											"		</ins>"+
											"		<div class='mt10' style='overflow:auto'> "+
														stringIntimacy + stringMood + stringSymptom + 
											"		</div> "+
											"			<div class='bubble-small-left'"+
											"			label-id='"+ params.id +"' style='top:10px' " +
											"		</div>"+
											"</div>"
										); 
										
										//append
										innerParams.container.appendChild( content );
									},
									outterDom = function( outterParams ){
											
										if( outterParams.createContainer ){
											 
											let mainContent = scope.stringToHtml5Template(
												"<div class='parent-note-box'>"+
													"<abbr>"+ params.timeSince +"</abbr>"+
													"<div class='wrap-content-data '>"+
													
													"</div>"+
												"</div>"	+										
												"<div class='sparator mb20'></div>"
											),	 
											
											wrapContent = mainContent.querySelector(".wrap-content-data")
											
											innerDom({
												container : wrapContent
											}) 
											
											//append
											containerNote.appendChild( mainContent );
											
											
											//hapus sparator jika diperlukan
											let parentEls = scope.slice( container.querySelectorAll(".parent-note-box") ),
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
											
											
										}else{
											
											innerDom({
												container : outterParams.wrapContent
											})
										} 
									}
									 
									 
									//find container based on date label
									let containerWrap = scope.slice( container.querySelectorAll(".wrap-content-data") ),
									emptyCnt = true;
									 
									 
									if( emptyCnt ){
										
										outterDom({
											createContainer : true
										});
									} 
								}, 
								dataNoteFn = function( dataNote, index ){
								 
									if( data ){

										if( obj.loadMore.marker( "circle", container, dataNote, index ) ){
											
											let dateStart = scope.stringToDate( dataNote.dateStart ),
											
											isTodayOrYesterDay = scope.dateIsTodayOrYesterday( dateStart ),
											    
											timeSince = isTodayOrYesterDay ? isTodayOrYesterDay : scope.dateToYMD({ date : dateStart });
										   
											contentDom({
												id : dataNote.id,
												timeSince : timeSince,
												note : dataNote.note,
												mood : dataNote.mood,
												symptom : dataNote.symptom,
												intimacy : dataNote.intimacy
											});
											
										}
													
										dataEmpty = false;
									}
								};
							 
								 //clear container
								
								if( !objectInitial ){
									 
									containerNote.innerHTML = ""; 
									 
									//reset loadmore
									obj.loadMore.state.circle.reset();
								};
								 
								//ubah dari object ke array untuk load more
								for( let ii in data ){
											
									dataArr.push( data[ii] )
									
								}
								
								dataArr.sort(function( a, b ) { return scope.stringToDate( b.dateStart ) - scope.stringToDate( a.dateStart ) })
								 
								dataArr.forEach( function( dataNote, index ){
																							
									dataNoteFn(  dataNote, index ) 
								})	
									
								
								scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty[0],  "hidden" );	
								scope[ dataEmpty ? "addClass" : "removeClass" ]( container,  "hidden" );
								 
								//update firstload only
								if( !stateFirstload.circleNote ){
									        
									stateFirstload.circleNote = true; 
								} 
								
								
								/*button pill detail*/
								let noteBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
								
								noteBtns.map(function( btnNote, index ){
									
									var elClone = btnNote.cloneNode(true);
									btnNote.parentNode.replaceChild( elClone, btnNote );
								
									scope.attachListener( elClone, 'click', function(){
										   
										let label =  this.getAttribute("label-id"),
										paramsNote = {};
										   
										for(let ii in dataRaw ){
											 
											if( dataRaw[ii].id === label ){
												
												paramsNote = dataRaw[ii]
												
												break;
											
											}
										}
										   
										   
										obj.modal.behaviour.openModalFadeIn("modal-period-detail");
											
										obj.modal.periodDetail.update( paramsNote );
											
									})
								})
								
								
							},
							chart : function( totMonth ){
								
								
								let self = this,
								main = scope.qs("circle-content"),
								containerEmpty = scope.slice( main.querySelectorAll(".content-empty") ),
								mainContainer = scope.qs("container-period-detail"),
								container = scope.qs("box-period-detail"),
								content = scope.stringToHtml5Template( 
									'<div style="position: relative;">'+
										'<canvas height="360px"; width="350px"; class="chart-period" ></canvas>'+
									'</div>'
								),
								convertPatternToData = function(){
									
									let barCircle = {
										label : "barCircle",
										data : [],
										order : 1
									},
									lineCircle = {
										label : "lineCircle",
										data : [],
										type: 'line',
										fill : false,
										order : 2
									},
									linePeriod = {
										label : "linePeriod",
										data : [],
										type: 'line',
										fill : false,
										order : 3
									},
									labels = [],
									pattern = self.pattern.collections;
									
									pattern.forEach(function( data, index ){
										
										if( pattern.length - 1 !== index ){
										 
											barCircle.data.push( data.circleLength );
											lineCircle.data.push( data.circleLength );
											linePeriod.data.push( data.periodLength );
											
											//label
											let startDate = scope.dateToYMD({
												
												date : scope.stringToDate( data.startDate ),
												isShortMonth : true
												
											}).split(" ")[2],
											endDate = scope.dateToYMD({
												
												date : scope.stringToDate( data.endDate ),
												isShortMonth : true
												
											}).split(" ")[2];
											
											if( startDate === endDate ){
												
												labels.push( startDate )
												
											}else{
												
												labels.push( startDate+" - "+endDate )
												
											}
										
										}
										 
									})
									
									
									return {
										datasets : [ barCircle, lineCircle, linePeriod ],
										labels : labels
									}
									
								}
								
								container.innerHTML ="";
								container.appendChild( content )	
								
								let data = convertPatternToData();
								
								scope[ data.labels.length ? "addClass" : "removeClass" ]( containerEmpty[1],  "hidden" );	
								scope[ data.labels.length ? "removeClass" : "addClass" ]( mainContainer,  "hidden" );
								 
								
								if( data.labels.length ){
										
									let mixedChart = new Chart( scope.qs("chart-period"), {
										type: 'bar',
										data: data,
										/** {
											datasets: [{
												label: 'Bar Dataset',
												data: [25, 24, 29, 24], //[0, 0, 0, 0, 0, 0, 29, 24]
												// this dataset is drawn below
												order: 1
											}, 
											{
												label: 'Line Dataset',
												data: [25, 24, 29, 24], //[0, 0, 0, 0, 0, 0, 29, 24]
												type: 'line',
												// this dataset is drawn on top
												order: 2,
												fill : false
											}, 
											{
												label: 'Line Dataset',
												data: [8, 7, 7, 6],//[0, 0, 0, 0, 0, 0, 7, 6],
												type: 'line',
												// this dataset is drawn on top
												order: 3,
												fill : false,
											}],
											labels: ['Jun - Jul', 'Jun', 'Jul','Aug']//['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug']
										}*/ 
										
										options: { 
											events: [''],
											tooltips: {
												enabled: false
											},
											animation: {
												onComplete: function(animation) {
													 
													var ctx = this.chart.ctx; 
													ctx.fillStyle = "#a2a2a2"
													ctx.textAlign = "center";
													ctx.textBaseline = "bottom";
													 
													this.data.datasets.forEach(function (dataset) {
														
														for (var i = 0; i < dataset.data.length; i++) {
															var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
															
															let posY =  -5;
															ctx.fillText(dataset.data[i]+" Hari", model.x, model.y + posY );
														}
													});
													
												
												}
											},
											title: {
												display: true,
												text: 'Data Mensturasi (PMS)',
												position : 'bottom'
											},
											scales: {
												xAxes: [{
													gridLines: {
														lineWidth: 0,
														zeroLineColor: 'rgba(171, 0, 214, 0)'
													}
												}],
												yAxes: [{
													gridLines: {
														lineWidth: 0,
														zeroLineColor: 'rgba(171, 0, 214, 0)'
													},
													ticks: {
														beginAtZero: false,
														display: false
													}
												}]
											 },
											legend: {
												display: false
											},
											layout: {
												padding: {
													left: -7,
													right: 0,
													top: 20,
													bottom: 0
												}
											}
										  }
										  
									});
									
									 
									//content
									let periodAvgEl =  scope.qs("txt-period-avg"),
									circleAvgEl =  scope.qs("txt-circle-avg"),
									circleLongEl =  scope.qs("txt-circle-long"),
									circleShortEl =  scope.qs("txt-circle-short");
									
									//periode
									let periodData = data.datasets[2].data;
									periodDataTot = !periodData.length ? 0 : periodData.reduce(function(acc, val) { return acc + val; }, 0),
									periodDataMedian = Math.round( periodDataTot / periodData.length )
									
									scope.text( periodAvgEl, periodDataMedian+" hari dalam "+ periodData.length +" x masa mensturasi " )
									
									//siklus
									
									let circleData = data.datasets[0].data;
									circleDataTot = !circleData.length ? 0 : circleData.reduce(function(acc, val) { return acc + val; }, 0),
									circleDataMedian = Math.round( circleDataTot / circleData.length )
									
									scope.text( circleAvgEl, circleDataMedian+" hari dalam "+ circleData.length +" x siklus mensturasi " )
									
									//max siklus
									let maxCircle = !circleData.length ? 0 : circleData.reduce(function(previous,current){ 
										return previous > current ? previous:current
									})
									 
									scope.text( circleLongEl, " siklus terpanjang adalah "+maxCircle+" Hari")
									
									
									//min siklus
									let minCircle =  !circleData.length ? 0 : circleData.reduce(function(previous,current){ 
										  return previous < current ? previous:current
									})
									 
									scope.text( circleShortEl, " siklus terpendek adalah "+minCircle+" Hari")
									
									
									//total mood
									let moodBoxEl = scope.qs("mood-box-capsule"),
									moodBoxParent = scope.nthParent( moodBoxEl, 2 ),
									stringMood = "";
									
									for(let ii in self.totalMood ){
										
										stringMood += '<div class="capsule mr5  ">'+ ii +' +'+ self.totalMood[ii] +'</div>'
										
									}
									 
									moodBoxEl.innerHTML = "";
									moodBoxEl.appendChild( scope.stringToHtml5Template( stringMood ) );
							
									scope[ stringMood ? "removeClass" : "addClass" ] ( moodBoxParent ,"hidden" )
							  
							  
									//total symptom
									let symptomBoxEl = scope.qs("symptom-box-capsule"),
									symptomBoxParent = scope.nthParent( symptomBoxEl, 2 ),
									stringSymptom = "";
									
									for(let ii in self.totalSymptom ){
										
										stringSymptom += '<div class="capsule mr5  ">'+ ii +' +'+ self.totalSymptom[ii] +'</div>'
										
									}
									 
									symptomBoxEl.innerHTML = "";
									symptomBoxEl.appendChild( scope.stringToHtml5Template( stringSymptom ) );
							
									scope[ stringSymptom ? "removeClass" : "addClass" ] ( symptomBoxParent ,"hidden" )
								
								
									let colorEl = scope.slice( main.querySelectorAll(".container-radio") ),
									bg = [ "bg-bluemarine","bg-redtosca","bg-grey-a","bg-bluesky","bg-turquoise","bg-cadetblue",
									"bg-sandybrown","bg-pink","bg-gray"],
									bgLen = bg.length - 1;
									
									colorEl.forEach(function( objEl ){
										
										objEl.className = "container-radio centerdiv "+bg[ scope.random( bgLen, 0 ) ]
										
									}) 
								
								}
								
							},
							personal : function(){
								
								let self = this,
								main = scope.qs("circle-content"), 
								textPeriod = main.querySelector(".personal-period abbr"),
								btnPeriod = scope.slice( main.querySelectorAll(".personal-period .capsule") ), 
								
								textCircleAvg = main.querySelector(".personal-circle abbr"),
								btnCircleAvg = scope.slice( main.querySelectorAll(".personal-circle .capsule") ),
								
								textCircleLong = main.querySelector(".personal-circle-long abbr"),
								btnCircleLong = scope.slice( main.querySelectorAll(".personal-circle-long .capsule") ),
								 
								textCircleShort = main.querySelector(".personal-circle-short abbr"),
								btnCircleShort = scope.slice( main.querySelectorAll(".personal-circle-short .capsule") );
								 
										 
								scope.text( textPeriod, dataObject.periodLength +" Hari" );
									
								scope.text( textCircleAvg, dataObject.circleLength +" Hari" );
								
								scope.text( textCircleLong, dataObject.circleLong +" Hari" );
								
								scope.text( textCircleShort, dataObject.circleShort +" Hari" );
							 
								if( !stateFirstload.circle ){ 
								
									/** period plus*/
									scope.attachListener( btnPeriod[0], 'click', function( ){ 
										
										if( dataObject.periodLength >= 1 &&  dataObject.periodLength < 12 ){
											 
											dataObject.periodLength += 1;
											
											scope.text( textPeriod, dataObject.periodLength +" Hari" );
											 
											obj.main.circle.init();
											 
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
										 
										}
									})
									
									 
									/** period min*/
									scope.attachListener( btnPeriod[1], 'click', function( ){ 
										
										if( dataObject.periodLength > 1 &&  dataObject.periodLength <= 12 ){
											
											dataObject.periodLength -= 1;
											
											scope.text( textPeriod, dataObject.periodLength +" Hari" );
											
											obj.main.circle.init();
											 
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
											 
										}
									})
									
									
									 
									/** cricle avg plus*/
									scope.attachListener( btnCircleAvg[0], 'click', function( ){ 
										
										if( dataObject.circleLength >= 18 &&  dataObject.circleLength < 60 ){
											 
											dataObject.circleLength += 1;
											
											scope.text( textCircleAvg, dataObject.circleLength +" Hari" );
											
											obj.main.circle.init();
											  
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
										 
										}
									})
									
									 
									/** cricle avg min*/
									scope.attachListener( btnCircleAvg[1], 'click', function( ){ 
										
										if( dataObject.circleLength > 18 &&  dataObject.circleLength <= 60 ){
											
											dataObject.circleLength -= 1;
											
											scope.text( textCircleAvg, dataObject.circleLength +" Hari" );
											
											obj.main.circle.init();
											  
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
											 
										}
									})
									
									
									/** cricle long plus*/
									scope.attachListener( btnCircleLong[0], 'click', function( ){ 
										
										if( dataObject.circleLong >= 18 &&  dataObject.circleLong < 60 ){
											 
											dataObject.circleLong += 1;
											
											scope.text( textCircleLong, dataObject.circleLong +" Hari" );
											
											obj.main.circle.init();
											  
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
										 
										}
									})
									
									 
									/** cricle long min*/
									scope.attachListener( btnCircleLong[1], 'click', function( ){ 
										
										if( dataObject.circleLong > 18 &&  dataObject.circleLong <= 60 ){
											
											dataObject.circleLong -= 1;
											
											scope.text( textCircleLong, dataObject.circleLong +" Hari" );
											 
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
											 
										}
									})
									
									/** cricle short plus*/
									scope.attachListener( btnCircleShort[0], 'click', function( ){ 
										
										if( dataObject.circleShort >= 18 &&  dataObject.circleShort < 60 ){
											 
											dataObject.circleShort += 1;
											
											scope.text( textCircleShort, dataObject.circleShort +" Hari" );
											 
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
										 
										}
									})
									
									 
									/** cricle short min*/
									scope.attachListener( btnCircleShort[1], 'click', function( ){ 
										
										if( dataObject.circleShort > 18 &&  dataObject.circleShort <= 60 ){
											
											dataObject.circleShort -= 1;
											
											scope.text( textCircleShort, dataObject.circleShort +" Hari" );
											 
											scope.delayFire(function(){
											 
												//save to database
												obj.cordova.localStorage.put();
											 
											},1000)
											 
										}
									})
								
								}
							},
							init : function(){
								
								let self = this,
								main = scope.qs("circle-content"), 
								containerTab = main.querySelector(".content-data"),
								elText = scope.qs("text-period-interval"),
								periodDate = obj.dataStorage.layoutState.periodDate,
								calendarParams = self.calendarParams,
								dateNow = new Date();
									
								dateNow.setMonth( dateNow.getMonth() + 1 );
									
								calendarParams.markerContainer.length = 0
									 
								//pertama kali dipanggi
								if( !periodDate.dateStart ){
									
									calendarParams.firstDate = dateNow;
									
									calendarParams.markerParams.dateFirstCapture = dateNow;
									calendarParams.markerParams.dateLastCapture = dateNow;
									 
									calendarParams.monthRange = 2
	  
								}else{
									
									let dateStart = scope.stringToDate( periodDate.dateStart )
									
									calendarParams.firstDate = dateStart;
									
									calendarParams.markerParams.dateFirstCapture = dateStart;
									calendarParams.markerParams.dateLastCapture = dateStart;
									 
									calendarParams.monthRange = periodDate.dateInterval
									  
								}
								 
								self.periodLength = dataObject.periodLength;
								self.circleLength = dataObject.circleLength;
								self.circleShort = dataObject.circleShort;
								self.circleLong = dataObject.circleLong;
									 
								
								self.markerPeriods();
								 
								self.markerNextFertileAndaPeriodDays();
								
								self.markerNotes();
								
								self.markerPillTaken();
								
								self.markerInjectTaken();
								 
								self.update();
								
								//console.log( self.calendarParams.markerParams.dateLastCapture )
								self.notes()
							
								//console.log( self.calendarParams.markerParams.dateLastCapture )
							
								//data personal
								self.personal();
								
								let monthSelect = calendarParams.monthSelect,
								monthLen = monthSelect.length,
								yearSelect = calendarParams.yearSelect,
								firstText = monthSelect[0]+" "+yearSelect[0].substring(2),
								lastText = monthSelect[ monthLen - 1 ]+" "+yearSelect[ yearSelect.length - 1 ].substring(2);
								
								scope.text( elText, firstText+" ~ "+lastText+" - "+monthLen+"Bln" )
								
								self.chart( monthLen )
								  
								if( !stateFirstload.circle ){
										
										
									//tab header
									let tabEl =  scope.slice( scope.qsAll("tab-kb-circle li") ),
									  
									periodSwiperIndex = obj.dataStorage.layoutState.periodSwiperIndex,
									swiperCircle = new Swiper('.swiper-circle',{  
										observer: true,
										observeParents: true, 
										initialSlide: periodSwiperIndex,
										spaceBetween: 50
									});
									 
									  
									scope.addClass( tabEl[ periodSwiperIndex ] , "select" );
										 
									
									tabEl.forEach(function( objLi, index ){
										
										scope.attachListener( objLi, 'click', function( getIndex ){ 
												
											tabEl.forEach(function( li ){
												scope.removeClass( li, "select" )
											})
											
											scope.addClass( this, "select" );
											  
											swiperCircle.slideTo( getIndex, 300 );
											  
										}.bind( objLi, index ) )
										
									}) 
									  
									 
									swiperCircle.on('slideChange', function () {
										   
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										  
										scope.addClass( tabEl[ swiperCircle.activeIndex ] , "select" );
										 
										//perbaru transaksi untuk layoutState 
										obj.storageState({ 
											noUpdateFileSource : true,
											storageState : "layoutState",
											objState : "periodSwiperIndex",
											value : swiperCircle.activeIndex
										},
										function(){}) 
										 
										 
									});  
									
									stateFirstload.circle = true;
								}
							}
						}
					},
					modalInput : { 
						textarea : scope.slice( scope.qs("modal-input-content").getElementsByTagName("textarea") )[0],
						input : scope.slice( scope.qs("modal-input-content").getElementsByTagName("input") )[0],
						activeModalEl  : "",
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
						
							obj.appConfig.ads.interstitial.interaction--;
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
									
								},1200)
									
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
								
								obj.modalMenu.behaviour.openFadeIn("modal-menu-memo" );
								  
							})
							
							/**
								tracker time range  
							*/ 
							scope.attachListener( btnTrackRange, 'click', function(){
								
								obj.modalMenu.behaviour.openFadeIn("modal-menu-tracker-range" );
								   
							}) 
							
							/**
								tracker activity 
							*/ 
							scope.attachListener( btnTrackerActivity, 'click', function(){
								
								obj.modalMenu.behaviour.openFadeIn("modal-menu-tracker");
								    
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
						menuTakenPill : function(){
							let modal = scope.qs("modal-menu-taken-pill"),
							btnBack = modal.querySelector(".back-button"),
							sendBack = modal.querySelector(".send-button"),
							checkboxParent = scope.slice( modal.querySelectorAll(".border-none > li") ),
							takenPill = false;
						
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							}) 
						
						
							/*checkbox*/
							checkboxParent.forEach(function( liEl, index ){
								
								scope.attachListener( liEl, 'click', function( e ){
									 
									if( /p|input/i.test( e.target.nodeName ) ) return;
								  
									let checkedEl = this.querySelector(".container-checkbox > div")
									
									if( /checked/i.test( checkedEl.className ) ){
										
										scope.removeClass( checkedEl, "checked");
										
										takenPill = false;
										
									}else{
										
										scope.addClass( checkedEl, "checked");
										
										takenPill = true;
									}
									
								})
							})
							
							/*save*/
							scope.attachListener( sendBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
								
								let day = this.getAttribute("day"),
								id = this.getAttribute("label-id"),
								date = this.getAttribute("date"),
								dateNow = new Date();
								
								if( new Date( scope.stringToDate( date ) ).setHours(0,0,0,0) > new Date( dateNow ).setHours(0,0,0,0) ){
									
									let fragment = scope.stringToHtml5Template(
										'<span class="center-text semibold"> Tanggal yang dipilih melewati tanggal hari ini </span>'
									);
									 
									obj.modalMenu.behaviour.closeFadeout({
										end : function(){
											
											obj.modalMenu.menuError.update( fragment );
											
										}
									}) 
									  
									takenPill = false;
										
									scope.removeClass( modal.querySelector(".container-checkbox > div"), "checked");
									
								}else{
									 
									obj.storageCrud({ 
										dataStorage : "pill",
										day : day,
										takenPill : takenPill,
										id : id,
										date : date,
										dateCreate : ( new Date ).toLocaleString("id-ID"),
										type : "update-pill"
									},
									function(){ 
										
										//generate content
										obj.main.pill();
										
										obj.main.circle.init();
										
										obj.modalMenu.behaviour.closeFadeout();
										
										takenPill = false;
										
										scope.removeClass( modal.querySelector(".container-checkbox > div"), "checked");
										
									});
								
								}
												
							}) 
						},
						menuRemovePill : function(){
							let modal = scope.qs("modal-menu-remove-pill"),
							btnBack = modal.querySelector(".back-button"),
							sendBack = modal.querySelector(".send-button");
						
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							}) 
						
						 
							
							/*save*/
							scope.attachListener( sendBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
								
								let day = this.getAttribute("day"),
								id = this.getAttribute("label-id"),
								date = this.getAttribute("date"),
								dateNow = new Date();
							  
								obj.storageCrud({ 
									dataStorage : "pill",
									day : day,
									takenPill : false,
									id : id,
									date : date,
									dateCreate : ( new Date ).toLocaleString("id-ID"),
									type : "update-pill"
								},
								function(){ 
									
									//generate content
									obj.main.pill();
									
									obj.main.circle.init();
										
									obj.modalMenu.behaviour.closeFadeout();
									  
								}); 
												
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
											 
										objInput.value = scope.dateToYMD({
											date : dateNow,
											withYear : true
										});
										
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
											
											scope.text( scope.qs("select-date-remainder"), scope.dateToYMD({
												date:  new Date(),
												withYear : true
											}) )
											 
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
												 
													objInput.value = scope.dateToYMD({
														date :  dateSelect,
														withYear : true
													});
													 
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
													 
													scope.text( scope.qs("select-date-remainder"), scope.dateToYMD({
														date :  selectDateFn(),
														withYear : "year"
													}) );
													 
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
						menuRestore : function(){
							let exitButton = scope.qs("modal-menu-restore").querySelector(".send-button");
							 
							scope.attachListener( exitButton, 'click', function(){
								
								navigator.app.exitApp();
							});
						},
						menuNotifyInject : function(){
							
							let modal = scope.qs("modal-menu-inject-remainder")
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							triggerButton = scope.qs("trigger-notify-inject"),
							checkboxParent = scope.slice( modal.querySelectorAll(".border-none > li") ),
							checkedBox = [ null, null, null ];
							
							scope.attachListener( triggerButton, 'click', function( index ){
							
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-inject-remainder");
							
							})
							
							/**
								close modal menu back
							*/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							})
							
							/*checkbox*/
							checkboxParent.forEach(function( liEl, index ){
								
								scope.attachListener( liEl, 'click', function( e ){
									 
									if( /p|input/i.test( e.target.nodeName ) ) return;
								  
									let checkedEl = this.querySelector(".container-checkbox > div")
									
									if( /checked/i.test( checkedEl.className ) ){
										
										scope.removeClass( checkedEl, "checked");
										
										checkedBox[ index ] = null;
										
									}else{
										
										scope.addClass( checkedEl, "checked");
										
										checkedBox[ index ] = true;
									}
									  
								})
							})
							
							/**
								close modal menu send
							*/ 
							scope.attachListener( btnSend, 'click', function(){
								 
								let dateTimeStart = scope.stringToDate( scope.qs("box-inject-detail").getAttribute("date-start") ),
								dateTimeEnd = scope.stringToDate( scope.qs("box-inject-detail").getAttribute("date-end") ),
								id = scope.qs("box-inject-detail").getAttribute("label-id"),
								
								sevenDays = checkedBox[0] ? 7 : 0,
								
								threeDays = checkedBox[1] ? 3 : 0,
								
								oneDay = checkedBox[2] ? 1 : 0;;
								
								if( !oneDay && !threeDays && !sevenDays ){
									
									obj.modalMenu.behaviour.closeFadeout({
										end : function(){
														
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Centang salah satu pengingat terlebih dahulu </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											  
										}
									})  
								}
								
								if( oneDay ){
									
									let dateTimeEndBeforeOne =  new Date( dateTimeEnd );
									
									dateTimeEndBeforeOne.setDate( dateTimeEndBeforeOne.getDate() - oneDay );
									
									var text = oneDay+" lagi hari sebelum jadwal suntik kb berikutnya",
									timeUnit = scope.timeUnitBetween( dateTimeEndBeforeOne, dateTimeStart ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates({ 
										startDate : dateTimeStart, 
										endDate : dateTimeEndBeforeOne,
										timeString : "day"
									}),
									timer = function(){
										
										return ( totalDays !== 0 ? ( totalDays <= 1 ? totalDays : totalDays - 1 ) : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
									}; 
									
									obj.storageCrud({ 
										updateTable : "multiple",
										tableGroup :{
											inject : {
												dataStorage : "inject",
												id : id,
												notify : false,
												type : "update-notify"
											},
											notification : {
												dataStorage : "notification",
												type : "add",
												reminder : text,
												timer : timer(),
												labelText : "Ulangi Tiap Hari",
												dateStart : dateTimeStart.toLocaleString("id-ID"),
												dateEnd : dateTimeEndBeforeOne.toLocaleString("id-ID"),
												stringDate : "select-date",
												loop : false
											}
										}
										 
									},
									function( objNotify ){ 
										  
										//corodva register notification
										obj.cordova.notification.schedule({
											id: objNotify.cordovaId,
											title : "KB Suntik",
											text : text,
											trigger : dateTimeEnd,
											stringDate : "select-date",
											loop : false
										}) 
										 
										obj.modalMenu.behaviour.closeFadeout();
										 
										//generate content
										obj.main.injection();
										 
										//generate remainder
										obj.main.remainder();
									 
									});
									 
								} 
								
								if( threeDays ){
									
									let dateTimeEndBeforeThree =  new Date( dateTimeEnd );
									
									dateTimeEndBeforeThree.setDate( dateTimeEndBeforeThree.getDate() - threeDays );
									
									var text = threeDays+" lagi hari sebelum jadwal suntik kb berikutnya",
									timeUnit = scope.timeUnitBetween( dateTimeEndBeforeThree, dateTimeStart ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates({ 
										startDate : dateTimeStart, 
										endDate : dateTimeEndBeforeThree,
										timeString : "day"
									}),
									timer = function(){
										
										return ( totalDays !== 0 ? ( totalDays <= 1 ? totalDays : totalDays - 1 ) : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
									}; 
									
									obj.storageCrud({ 
										updateTable : "multiple",
										tableGroup :{
											inject : {
												dataStorage : "inject",
												id : id,
												notify : false,
												type : "update-notify"
											},
											notification : {
												dataStorage : "notification",
												type : "add",
												reminder : text,
												timer : timer(),
												labelText : "Ulangi Tiap Hari",
												dateStart : dateTimeStart.toLocaleString("id-ID"),
												dateEnd : dateTimeEndBeforeThree.toLocaleString("id-ID"),
												stringDate : "select-date",
												loop : false
											}
										}
										 
									},
									function( objNotify ){ 
										  
										//corodva register notification
										obj.cordova.notification.schedule({
											id: objNotify.cordovaId,
											title : "KB Suntik",
											text : text,
											trigger : dateTimeEnd,
											stringDate : "select-date",
											loop : false
										}) 
										 
										obj.modalMenu.behaviour.closeFadeout();
										 
										//generate content
										obj.main.injection();
									  
										//generate remainder
										obj.main.remainder();
									 
									});
									 
								} 
								
								if( sevenDays ){
									
									let dateTimeEndBeforeSeven =  new Date( dateTimeEnd );
									
									dateTimeEndBeforeSeven.setDate( dateTimeEndBeforeSeven.getDate() - sevenDays );
									
									var text = sevenDays+" lagi hari sebelum jadwal suntik kb berikutnya",
									timeUnit = scope.timeUnitBetween( dateTimeEndBeforeSeven, dateTimeStart ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates({ 
										startDate : dateTimeStart, 
										endDate : dateTimeEndBeforeSeven,
										timeString : "day"
									}),
									timer = function(){
										
										return ( totalDays !== 0 ? ( totalDays <= 1 ? totalDays : totalDays - 1 ) : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
									}; 
									
									obj.storageCrud({ 
										updateTable : "multiple",
										tableGroup :{
											inject : {
												dataStorage : "inject",
												id : id,
												notify : false,
												type : "update-notify"
											},
											notification : {
												dataStorage : "notification",
												type : "add",
												reminder : text,
												timer : timer(),
												labelText : "Ulangi Tiap Hari",
												dateStart : dateTimeStart.toLocaleString("id-ID"),
												dateEnd : dateTimeEndBeforeSeven.toLocaleString("id-ID"),
												stringDate : "select-date",
												loop : false
											}
										}
										 
									},
									function( objNotify ){ 
										  
										//corodva register notification
										obj.cordova.notification.schedule({
											id: objNotify.cordovaId,
											title : "KB Suntik",
											text : text,
											trigger : dateTimeEnd,
											stringDate : "select-date",
											loop : false
										}) 
										 
										obj.modalMenu.behaviour.closeFadeout();
										 
										//generate content
										obj.main.injection();
									  
										//generate remainder
										obj.main.remainder();
									 
									});
									 
								} 
								
							})
						 	
						},
						menuCalendarMethod : function(){
							
							let modal = scope.qs("modal-calendar-new"),
							modalMenu = scope.qs("modal-menu-calendar-method"),
							inputs = scope.slice( modal.getElementsByTagName("input") ),
							btnBack = modalMenu.querySelector(".back-button"),
							triggerButton = scope.qs("trigger-calendar-method"),
							inputCalendarMethod = scope.getFirstChild( scope.qs("trigger-calendar-method") ),
							radioboxParent = scope.slice( modalMenu.querySelectorAll(".border-none > li") ),
							checkedBox = [ null, null, null ];
							
							scope.attachListener( triggerButton, 'click', function( index ){
							
								obj.modalMenu.behaviour.openModalFadeIn("modal-menu-calendar-method");
							
							})
							
							/**
								radio buttons
							*/
							obj.radioButtonsFn( radioboxParent,  inputCalendarMethod, function( method ){
								
								let methodBool = method === 2;
							
								scope[ methodBool ? "addClass" : "removeClass" ]( scope.nthParent( inputs[5], 3 ),"hidden")
								
								scope[ methodBool ? "addClass" : "removeClass" ]( scope.nthParent( inputs[6], 3 ),"hidden")
							 
							});
							
							/**
								close modal menu back
							*/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							})
							
							
						},
						menuCalendarPosOvulatory : function(){
							 
							let modal = scope.qs("modal-menu-calendar-date"),
							btnBack = modal.querySelector(".back-button"),
							sendBack = modal.querySelector(".send-button"),
							radioboxParent = scope.slice( modal.querySelectorAll(".border-none > li") ),
							takenPill = false;
						
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modalMenu.behaviour.closeFadeout();
							}) 
							
							/**
								radio buttons
							*/
							obj.radioButtonsFn( radioboxParent, "" );
							 
							/*save*/
							scope.attachListener( sendBack, 'click', function(){
							  
								let el =  modal.querySelector(".checked"); 
								
								if( !el ){ 
									
									obj.modalMenu.behaviour.closeFadeout({
										end : function(){
													
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Silahkan centang tanggal notifikasi </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
										}
									}); 
									
									
								}else{  
									 
									let elStart = scope.qs("pulse-start-ovulatory"),
									elEnd = scope.qs("pulse-end-ovulatory"),
									start = elStart ? elStart.getAttribute("date-start") : "",
									end = elEnd ? elEnd.getAttribute("date-end") : "",
									phaseSelect =  this.getAttribute("phase-select"),
									id = this.getAttribute("label-id"),
									isStart = phaseSelect === "start",
									isEnd = !isStart,
									
								 
									text = isStart ? "Anda memasuki fase II, tidak subur" : "Masa tidak subur anda telah berakhir",
									dateTimeStart = new Date(),
									dateTimeEnd =   scope.stringToDate( isStart ? start : end ),
									dateNow = new Date(), 
									 
									timeUnit = scope.timeUnitBetween( dateTimeEnd, dateTimeStart ),
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates({ 
										startDate : dateTimeStart, 
										endDate : dateTimeEnd,
										timeString : "day"
									}),
									timer = function(){
										
										return ( totalDays !== 0 ? ( totalDays <= 1 ? totalDays : totalDays - 1 ) : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
									};
								 
								 
									if( dateTimeEnd <= dateNow.setHours(0,0,0,0) ){
										
										obj.modalMenu.behaviour.closeFadeout({
											end : function(){
															
												let fragment = scope.stringToHtml5Template(
													'<span class="center-text semibold"> Apakah tanggal telah kadaluarsa atau kurang dari tanggal sekarang </span>'
												);
												 
												obj.modalMenu.menuError.update( fragment );
												  
											}
										})  
									
									}else{
								 
										obj.storageCrud({ 
											updateTable : "multiple",
											tableGroup :{
												calendar : {
													dataStorage : "calendar",
													type : "update-notify",
													phase : 2,
													notifyStart :isStart,
													notifyEnd : isEnd,
													id : id
												},
												notification : {
													dataStorage : "notification",
													type : "add",
													reminder : text,
													timer : timer(),
													labelText : "Notifikasi menurut tanggal",
													dateStart : dateTimeStart.toLocaleString("id-ID"),
													dateEnd : dateTimeEnd.toLocaleString("id-ID"),
													stringDate : "select-date",
													loop : true
												}
											}
											
											
										},
										function( objNotify ){ 
											  
											//corodva register notification
											obj.cordova.notification.schedule({
												id: objNotify.cordovaId,
												title : "Kalender KB",
												text : text,
												trigger : dateTimeEnd,
												stringDate : "day",
												loop : true
											});
												
															
											let date = el.getAttribute("select-date");
											
											obj.modalMenu.behaviour.closeFadeout({
												end : function(){
													
													scope.removeClass( el, "checked" );
													  
													//generate content
													obj.main.calendar();
													 
													//generate content
													obj.main.remainder();
													
												}
											});   
										  
										});
										 
									}
									 
								}
												
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
						},
						state : {
							pill : true
						},
						menuNotifyPill : function(){
						
						 
							let self = this,
							modalPluginPillTime = scope.qs("plugin-datepicker-pill-time"),
							datepickerPillTime = scope.qs("datepicker-pill-time"),
							pluginBack = modalPluginPillTime.querySelector(".back-button"),
							pluginSend = modalPluginPillTime.querySelector(".send-button"),
							triggerButton = scope.qs("trigger-notify-pill"), 
							time  = "12.00.00",
							swiper = new Swiper('.datepicker-pill-time', {
								observer: true,
								observeParents: true, 
								direction: 'vertical',
								centeredSlides: true,
								slidesPerView: 3,
								loop: true,
								initialSlide: 12
							}); 
							 
							swiper.on('slideChangeTransitionEnd', function () {
								 
								let el = datepickerPillTime.querySelector(".swiper-slide-active"),
								text = el.textContent;
								
								time = el.getAttribute("label");
							 
							 
								scope.text( scope.qs("select-pill-time"), "JAM "+text);
							  
							}); 
							 
						
							/**
								close plugin date
							*/
							scope.attachListener( pluginBack, 'click', function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
							})
							
							
							/**
								click input cover
							*/ 
							
							
							scope.attachListener( triggerButton, 'click', function( index ){
							  
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-pill-time");
								 
							})
							
							scope.attachListener( pluginSend, 'click', function(){
								
								 
								let text = "Apakah sudah minum pil KB hari ini ?",
								dateTimeStart =  scope.stringToDate( ( new Date() ).toLocaleString("id-ID").split(" ")[0]+" "+time ),
								dateTimeEnd =  new Date( dateTimeStart );
								
								dateTimeEnd.setDate( dateTimeEnd.getDate() + 1 );
								
								let timeUnit = scope.timeUnitBetween( dateTimeEnd, dateTimeStart ),
								totalDays = scope.getMinutesHourDayOrWeekBetweenDates({ 
									startDate : dateTimeStart, 
									endDate : dateTimeEnd,
									timeString : "day"
								}),
								timer = function(){
									
									return ( totalDays !== 0 ? ( totalDays <= 1 ? totalDays : totalDays - 1 ) : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
								};
							 
							 
								obj.storageCrud({ 
									updateTable : "multiple",
									tableGroup :{
										tableA : {
											dataStorage : "pill",
											id : scope.qs("box-birth-pil").getAttribute("label-id"),
											notify : false,
											type : "update-notify"
										},
										tableB : {
											dataStorage : "notification",
											type : "add",
											reminder : text,
											timer : timer(),
											labelText : "Ulangi Tiap Hari",
											dateStart : dateTimeStart.toLocaleString("id-ID"),
											dateEnd : dateTimeEnd.toLocaleString("id-ID"),
											stringDate : "day",
											loop : true
										}
									}
									
									
								},
								function( objNotify ){ 
									  
										//corodva register notification
										obj.cordova.notification.schedule({
											id: objNotify.cordovaId,
											title : "Pil KB",
											text : text,
											trigger : dateTimeEnd,
											stringDate : "day",
											loop : true
										}) 
										 
										obj.modalPlugin.behaviour.closeFadeout();
										 
										//generate content
										obj.main.pill();
										 
								  
										//generate content
										obj.main.remainder();
								});
								 
								
							})
							
							 
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
											height : elementHeight - ( Math.abs( marginBottom ) + 30   ) +"px" //30 padding top bottom // 30 look cool
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
							periodinterval : true,
							period : true,
							remainder : true,
							pill : true,
							inject : true,
							calendar : true,
							userreg : true
						},
						triggerModals : function(){
							let btnRemainder = scope.qs("remainder-button"),
							btnOtherList = scope.qs("header-menu > li:first-child div");
							   
							
							scope.attachListener( btnOtherList, 'click', function(){
								 
								 
								obj.modal.behaviour.openModalFadeIn("modal-other-list"); 
								
							})
							   
							    
							scope.attachListener( btnRemainder, 'click', function(){
								 
								obj.modal.behaviour.openModalFadeIn( "modal-babyremainder" ); 
							})
							  
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
								
								scope.addClass( elTimeEnd, "hidden" );
								
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
									totalDays = scope.getMinutesHourDayOrWeekBetweenDates({
										endDate : dateTimeEnd,
										startDate : dateTimeStart,
										timeString : "day"
										
									}),
									timeUnit = scope.timeUnitBetween( dateTimeEnd, dateTimeStart ),
									labelText = inputs[0].getAttribute("label-text"),
									selectedDate = inputs[0].getAttribute("selected-date"),
									stringDate = inputs[0].getAttribute("string-date"),
									loop = inputs[0].getAttribute("loop") === "true" ? true : false,
									text = scope.encodeStr( textareas[0].value ),
									timer = function(){
										return ( totalDays !== 0 ?  totalDays - 1 : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
									};
									   
									dateTimeEnd = stringDate === "hour" ? ( new Date() ).toLocaleString("id-ID") : dateTimeEnd.toLocaleString("id-ID");
									 
									obj.storageCrud({
										dataStorage : "notification",
										type : "add",
										reminder : text,
										timer : timer(),
										labelText : labelText,
										dateStart : dateTimeStart.toLocaleString("id-ID"),
										dateEnd : dateTimeEnd,
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
						periodConfirm : {
							paramsNote  : {},
							update : function( params ){
								 
								let boxIntimacy = scope.qs("mbox-intimacy-confirm"),
								spIntimacy = scope.qs("sp-intimacy-confirm"),
								boxMood = scope.qs("mbox-mood-confirm"),
								spMood = scope.qs("sp-mood-confirm"),
								boxSymptom = scope.qs("mbox-symptom-confirm"),
								spSymptom = scope.qs("sp-symptom-confirm"),
								cntMoodDetail =  scope.qs("box-mood-confirm"),
								cntSymptomDetail = scope.qs("box-symptom-confirm");
								  
								this.paramsNote =  params;
								 
								scope[ params.intimacy ? "removeClass" : "addClass" ]( [ boxIntimacy, spIntimacy ],  "hidden" );	
							   
								scope[ params.mood.length ? "removeClass" : "addClass" ]( [ boxMood, spMood ],  "hidden" );	
							   
								scope[ params.symptom.length ? "removeClass" : "addClass" ]( [ boxSymptom, spSymptom ],  "hidden" );	
							   
								if( params.mood.length ){
									
									let stringMood =  "";
									
									for( let ii of params.mood ){
									
										stringMood += "<div class='mr5 capsule red light'>"+ ii +"</div>"
									}
									
									
									cntMoodDetail.innerHTML = "";
									 
									cntMoodDetail.appendChild( 
										scope.stringToHtml5Template( stringMood )
									)
									  
								}
								
								if( params.symptom.length ){
									
									let stringMood =  "";
									
									for( let ii of params.symptom ){
									
										stringMood += "<div class='mr5 capsule blue light'>"+ ii +"</div>"
									}
									
									
									cntSymptomDetail.innerHTML = "";
									 
									cntSymptomDetail.appendChild( 
										scope.stringToHtml5Template( stringMood )
									)
									  
								}
								
								
								scope.text( scope.qs("mbox-note-confirm" ), params.note )
								   
								scope.text( scope.qs("date-symptom-confirm"), scope.dateToYMD({
									date :  scope.stringToDate( params.dateStart ),
									withYear : true,
									isShortMonth : true
								}) )
							},
							init : function(){
									
								let self = this,
								modal = scope.qs("modal-period-confirm"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								   
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									  
									obj.storageCrud({
										dataStorage : "period",
										type : "delete",
										id : self.paramsNote.id
									},
									function( objNotify ){
											 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												
												obj.main.circle.init();
												
											}
										})
										 	  
									})
									 
								})
							
							}
						},
						periodDetail : {
							paramsNote  : {},
							update : function( params ){
									 
								let boxIntimacy = scope.qs("mbox-intimacy-detail"),
								spIntimacy = scope.qs("sp-intimacy-detail"),
								boxMood = scope.qs("mbox-mood-detail"),
								spMood = scope.qs("sp-mood-detail"),
								boxSymptom = scope.qs("mbox-symptom-detail"),
								spSymptom = scope.qs("sp-symptom-detail"),
								cntMoodDetail =  scope.qs("box-mood-detail"),
								cntSymptomDetail = scope.qs("box-symptom-detail");
								  
								this.paramsNote =  params;
								 
								scope[ params.intimacy ? "removeClass" : "addClass" ]( [ boxIntimacy, spIntimacy ],  "hidden" );	
							   
								scope[ params.mood.length ? "removeClass" : "addClass" ]( [ boxMood, spMood ],  "hidden" );	
							   
								scope[ params.symptom.length ? "removeClass" : "addClass" ]( [ boxSymptom, spSymptom ],  "hidden" );	
							   
								if( params.mood.length ){
									
									let stringMood =  "";
									
									for( let ii of params.mood ){
									
										stringMood += "<div class='mr5 capsule red light'>"+ ii +"</div>"
									}
									
									
									cntMoodDetail.innerHTML = "";
									 
									cntMoodDetail.appendChild( 
										scope.stringToHtml5Template( stringMood )
									)
									  
								}
								
								if( params.symptom.length ){
									
									let stringMood =  "";
									
									for( let ii of params.symptom ){
									
										stringMood += "<div class='mr5 capsule blue light'>"+ ii +"</div>"
									}
									
									
									cntSymptomDetail.innerHTML = "";
									 
									cntSymptomDetail.appendChild( 
										scope.stringToHtml5Template( stringMood )
									)
									  
								}
								  
								scope.text( scope.qs("mbox-note-detail" ), params.note )
								  
								scope.text( scope.qs("date-symptom-detail"), scope.dateToYMD({
									date :  scope.stringToDate( params.dateStart ),
									withYear : true,
									isShortMonth : true
								}) )
							},
							init : function(){
									
								let self = this,
								modal = scope.qs("modal-period-detail"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								   
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "modal-period-detail",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("modal-period-confirm")
											
											obj.modal.periodConfirm.update( self.paramsNote )
										}
									})
									
								})
							
							},
						},
						periodNew :{ 
							dateSelect : "",
							pluginDate : function(){
								 
								let self = obj.modal,
								objMe = this,
								pluginPeriod = scope.qs("plugin-datepicker-period"),
								modal = scope.qs("modal-period-new"),
								pluginBack = pluginPeriod.querySelector(".back-button"),
								pluginSend = pluginPeriod.querySelector(".send-button"),
								datepickerPeriod = scope.qs("datepicker-period"),
								inputCover = modal.querySelectorAll(".input-disabled")[0];
								
								/*
									close plugin date
								**/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								});
								 
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){ 
											
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-period");
									
									if( self.state.period ){
										
										/*attach button*/
										let inputBound = inputCover.getBoundingClientRect(),
										objInput = inputCover.querySelector("input"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerPeriod.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											return new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
										};
										
										scope.text( scope.qs("select-date-plgn-period"), scope.dateToYMD({
											
											date :  new Date(),
											withYear : true,
											isShortMonth : true
											
										}) )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											let dateSelect = selectDateFn();
											  
											objMe.dateSelect =  dateSelect;
											  
											objInput.value = scope.dateToYMD({
												date : dateSelect,
													withYear : true,
													isShortMonth : true
											} );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-period",
											fn : function(){
												  
												scope.text( scope.qs("select-date-plgn-period"), scope.dateToYMD({
													date : selectDateFn(),
													withYear : true,
													isShortMonth : true
												}) );
												 
											}
										})
										//execute once 
										self.state.period = false;
									}
								
								})
							 	
								
							},
							init : function(){
							 
								let self = this,
								modal = scope.qs("modal-period-new"),
								inputs = scope.slice( modal.querySelectorAll("input") ),
								textarea = scope.slice( modal.getElementsByTagName("textarea") ),
								containerPeriod = scope.slice( modal.querySelectorAll(".container-period") ),
								checkboxParent = scope.slice( modal.querySelectorAll(".border-none > li") ),
								btnTrigger = scope.qs("period-button"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button"),
								intimasi = false;
								
								
								self.pluginDate();
								
								/**
									checks buttons
								*/
							
								obj.checkButtonsFn( checkboxParent, function( method ){
										
									intimasi = method ? true : false;
								});
								
								
								/** trigger Modal*/
								scope.attachListener( btnTrigger, 'click', function(){
									
									obj.modal.behaviour.openModalFadeIn("modal-period-new");
									
								}) 

								/** trigger mood modal*/
								scope.attachListener( containerPeriod[0], 'click', function(){
									obj.modal.behaviour.closeRightToleftFadeout({ 
										registerModal : "modal-period-new",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("mood-list")
										}
									})
								})
								
								/** trigger symptom modal*/
								scope.attachListener( containerPeriod[1], 'click', function(){
									obj.modal.behaviour.closeRightToleftFadeout({ 
										registerModal : "modal-period-new",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("symptom-list")
										}
									})
								})
								
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( textarea[0], "textarea" );
								
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									
									 
									let dateNow = new Date();
									 

									let cntMoodList = scope.qs("container-mood-list"),
									moodEl = scope.slice( scope.qsAll("container-mood-list > div") ),
									moodList = moodEl.map(function( objEl ){ return objEl.getAttribute("label") }),

									cntSymptomList = scope.qs("container-symptom-list"),
									symptomEl = scope.slice( scope.qsAll("container-symptom-list > div") ),
									symptomList = symptomEl.map(function( objEl ){ return objEl.getAttribute("label") });
									
									if( self.dateSelect > dateNow ){
										 	
										let fragment = scope.stringToHtml5Template(
											'<span class="center-text semibold"> Apakah tanggal yang dipilih melebihi tanggal sekarang </span>'
										);
										 
										obj.modalMenu.menuError.update( fragment );
										   
									}else if( obj.inputValidate( textarea.concat( inputs ) ) ){
										 
										let recordDate = self.dateSelect.getFullYear()+"/"+ ( self.dateSelect.getMonth() + 1 ) +"/"+self.dateSelect.getDate();
										 
										obj.storageCrud({
											dataStorage : "period",
											type : "update",
											intimacy : intimasi,
											mood : moodList,
											symptom : symptomList,
											note : scope.encodeStr( textarea[0].value ),
											recordDate : recordDate,
											dateStart : self.dateSelect.toLocaleString("id-ID")
										},
										function( objNotify ){
												 
									
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){
													
														 
													cntMoodList.innerHTML = "";
													
													cntSymptomList.innerHTML = "";
													
													let checkEl = modal.querySelector(".checked");
													
													if( checkEl ) scope.removeClass( checkEl, "checked" );
													
													obj.main.circle.init();
												}
											})											
										})
									 
									}
									
								})
								
							}
						},
						periodDate :{
							dateSelect : "",
							pluginOptions : function(){
								
									  
								/**
									plugin calendar Short
								*/  
								
								let self = this,
								modalPluginCalendar = scope.qs("plugin-datepicker-periodoptions"),
								datepickerCalendar = scope.qs("datepicker-periodoptions"),
								pluginBack = modalPluginCalendar.querySelector(".back-button"),
								pluginSend = modalPluginCalendar.querySelector(".send-button"),
								modal = scope.qs("period-date-options"),
								inputCover = modal.querySelectorAll(".input-disabled")[1], 
								swiper = new Swiper('.datepicker-periodoptions', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 1
								}); 
								 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendar.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-periodoptions"), textVal +" Bulan Terakhir");
								
									self.shortCyclePeriod = textVal;
								 
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-periodoptions");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input"),
									el =  datepickerCalendar.querySelector(".swiper-slide-active");
								   
									objInput.value = el.textContent+" Bulan Terakhir";
									 
									objInput.setAttribute("value", el.getAttribute("label") )
									  
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							pluginDate : function(){
								 
								let self = obj.modal,
								objMe = this,
								pluginPeriod = scope.qs("plugin-datepicker-periodinterval"),
								modal = scope.qs("period-date-options"),
								pluginBack = pluginPeriod.querySelector(".back-button"),
								pluginSend = pluginPeriod.querySelector(".send-button"),
								datepickerPeriod = scope.qs("datepicker-periodinterval"),
								inputCover = modal.querySelectorAll(".input-disabled")[0];
								
								/*
									close plugin date
								**/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								});
								 
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){ 
											
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-periodinterval");
									
									if( self.state.periodinterval ){
										
										/*attach button*/
										let inputBound = inputCover.getBoundingClientRect(),
										objInput = inputCover.querySelector("input"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerPeriod.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											return new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												1//timepicked[2].textContent
											)
											
										},
										textDate = scope.dateToYMD({
											
											date :  new Date(),
											withYear : true,
											isShortMonth : true
										}).split(" ").slice( 2, 4 ).join(" ");
										 
										scope.text( scope.qs("select-date-plgn-periodinterval"), textDate )
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											let dateSelect = selectDateFn();
											  
											objMe.dateSelect =  dateSelect;
											   
											objInput.value = scope.dateToYMD({
												date : dateSelect,
													withYear : true,
													isShortMonth : true
											} ).split(" ").slice( 2, 4 ).join(" ");
											   
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-periodinterval",
											fn : function(){
												  
												scope.text( scope.qs("select-date-plgn-periodinterval"), scope.dateToYMD({
													date : selectDateFn(),
													withYear : true,
													isShortMonth : true
												}).split(" ").slice( 2, 4 ).join(" ") );
												 
											}
										})
										//execute once 
										self.state.periodinterval = false;
									}
								
								})
							 	
								
							},
							init : function(){
								
								let self = this,
								modal = scope.qs("period-date-options"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button"),
								inputs = scope.slice( modal.querySelectorAll("input") ),
								inputDisable = modal.querySelector(".input-disabled"),
								btnTrigger = scope.qs("btn-period-interval");
								
								this.pluginDate()
								
								this.pluginOptions();
									
								/** Trigger Modal*/
								scope.attachListener( btnTrigger, 'click', function(){
									
									obj.modal.behaviour.openModalFadeIn("period-date-options");
									
								}) 
								 
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
									
								})
								
								scope.attachListener( btnSend, 'click', function(){
									 
									if( obj.inputValidate( inputs ) ){
										
										let date = self.dateSelect,
										interval = parseInt( inputs[1].getAttribute("value") )
										
										//perbaru transaksi untuk layoutState 
										obj.storageState({ 
											noUpdateFileSource : true,
											storageState : "layoutState",
											objState : "periodDate",
											value : {
												dateStart : date.toLocaleString("id-ID"),
												dateInterval : interval 
											}
										},
										function(){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												previous : true,
												end : function(){
													
													obj.main.circle.init();
														 
												}
											});	
											
											
										}) 
										 
										
									}
									
								})
								
							}
						},
						symptomAdd : function(){
							
							let modal = scope.qs("symptom-add"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.querySelectorAll("input") ),
							inputDisable = modal.querySelector(".input-disabled"),
							iconBtns = scope.slice( modal.querySelectorAll(".content-icon li") );
							 
							/**
								bind modal-input to category title
							*/
							obj.modalInput.bindToKeyup( inputs[0] );
							  
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									previous : true
								})
								
							})  
							
							scope.attachListener( btnSend, 'click', function(){
								
								if( obj.inputValidate( inputs ) ){
									
									let name = scope.ucFirst( scope.encodeStr( inputs[0].value ).toLowerCase() );
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "symptomList",
										type : "select-title",
										name : name
												
									},
									function( objData ){
										 
										if( !objData ){
											
											obj.storageCrud({
												dataStorage : "symptomList",
												type : "add",
												name : name 
											},
											function(){
												  
												obj.modal.behaviour.closeRightToleftFadeout({
													previous : true,
													end : function(){
														
														if( stateFirstload.symptomSelect ){
															
															stateFirstload.symptomSelect = {}
															
														}
														
														obj.modal.symptomList();
															 
													}
												});	
												
												
											})
										
										}else{
											
															
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Nama Gejala telah terdaftar silahkan pilih nama lain </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
											
										}
										
									}) 
									
								}
								
							})
							
							
							
						},
						symptomList : function(){
							
							let self = this,
							modal = scope.qs("symptom-list"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							symptomNew = scope.qs("button-list-symptom-new"),
							btnVaccineNew = modal.querySelector(".button-list-symptom-new"),
							data = obj.dataStorage["symptomList"],
							container =  scope.qs("symptom-list-container"),
							dataEmpty = true,
							contentDom = function( params ){
								
								let fragment = scope.stringToHtml5Template(
									'<li class="pt0 pb0 pr10 p20" >' +
									'	<ul class="list-inline ">' +
									'		<li class="modal-list left">' +
									'			<div class="container-checkbox centerdiv ">' +
									'			</div>' +
									'		</li>' +
									'		<li class="modal-list right">' +
									'			<ul class="list-inline modal-list-container centerdiv">' +
									'				<li class="option-color semibold pl0">'+ params.name +'</li> ' +
									'			</ul>' +
									'			<div class="todo-dot-menu">' +
									'				<div class="todo-dot-cnt-icon menu-dot-icon "></div>' +
									'				<div class="todo-dot-child-menu option-color hidden" label-id="'+ params.id +'" name="'+ params.name +'"> Hapus </div>' +
									'			</div>' +
									'		</li>' +
									'	</ul>' +
									'</li>'  
								);
								
								
								container.appendChild( fragment )
								
							},
							dataNoteFn = function( dataNote, index ){
								 
								contentDom({
									name : dataNote.name,
									id : dataNote.id
								})
								
								dataEmpty = false;
								
								
							};
							
							container.innerHTML = "";
							 
							data.forEach( function( dataNote, index ){
 
								dataNoteFn( dataNote, index );   
							})	
							
							let objBtnLi = scope.slice( container.querySelectorAll( ".border-none > li" ) );
							  
							stateFirstload.symptomSelect = {};
							  
							objBtnLi.forEach(function( objLi ){ 
							 
								scope.attachListener( objLi, 'click', function( e ){
									 
									let fragment = scope.stringToHtml5Template(
										'<div class="checked centerdiv"></div>'
									),
									elSelect = modal.querySelector(".select"),
									elChecked = modal.querySelector(".checked"),
									elCheckbox = this.querySelector(".container-checkbox"), 
									dotMenu = this.querySelector(".todo-dot-child-menu"),
									label = dotMenu.getAttribute("label-id"),
									name = dotMenu.getAttribute("name");
									
									if( /select/i.test( this.className ) ){
										 
										this.querySelector(".checked").remove();	
											  
										scope.removeClass( this, "select" );
											
										delete stateFirstload.symptomSelect[ label ]
										 
									}else{
										
										scope.addClass( this, "select" )	 
											 
										elCheckbox.appendChild( fragment );
										
										stateFirstload.symptomSelect[ label ] = {
											name : name,
											label : label
										}
									}
									  
								}) 
							}) 
							  
							
							/**
								attach right dot buttons ke event click
							*/
							objBtnLi.forEach(function( objCnt ){
								
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
								hide hidden button ketika user tap/ cursor di luar element
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
							
							 
							/**
								delete element
							*/
							scope.slice( modal.querySelectorAll(".todo-dot-child-menu") ).forEach(function( btnChildRight ){
								
								scope.attachListener( btnChildRight, 'click', function(){
									 
									let id = this.getAttribute("label-id");
									 
									obj.storageCrud({ 
										dataStorage : "symptomList",
										id : id,
										type : "delete"
									},
									function(){ 
										   
										if( stateFirstload.symptomSelect ){
											
											stateFirstload.symptomSelect = {}
											
										} 
										
										//self update
										obj.modal.symptomList();
										  
									}); 
									
								})  
							})	 
							 
							
							if( !stateFirstload.symptomList ){
							 
								scope.attachListener( symptomNew, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "symptom-list",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("symptom-add")
										}
									})
									
								}) ;
								 
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									
									let cntSymptom = scope.qs("container-symptom-list"),
									string = "";
									
									cntSymptom.innerHTML = "";
									
									for( let ii in stateFirstload.symptomSelect ){
										
										symptomObj =  stateFirstload.symptomSelect[ii];
									
										string += " <div class='capsule' label='"+ symptomObj.name +"'> "+ symptomObj.name +"</div> "
										  
									}
									
									let fragment = scope.stringToHtml5Template( string )
									
									cntSymptom.appendChild( fragment )
										 
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
								 
								})
								
								stateFirstload.symptomList = true
								
							}
						},
						moodAdd : function(){
							
							let modal = scope.qs("mood-add"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.querySelectorAll("input") ),
							inputDisable = modal.querySelector(".input-disabled"),
							iconBtns = scope.slice( modal.querySelectorAll(".content-icon li") );
							 
							/**
								bind modal-input to category title
							*/
							obj.modalInput.bindToKeyup( inputs[0] );
							  
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									previous : true
								})
								
							})  
							
							scope.attachListener( btnSend, 'click', function(){
								
								if( obj.inputValidate( inputs ) ){
									
									let name = scope.ucFirst( scope.encodeStr( inputs[0].value ).toLowerCase() );
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "moodList",
										type : "select-title",
										name : name
												
									},
									function( objData ){
										 
										if( !objData ){
											
											obj.storageCrud({
												dataStorage : "moodList",
												type : "add",
												name : name 
											},
											function(){
												  
												obj.modal.behaviour.closeRightToleftFadeout({
													previous : true,
													end : function(){
														 
														if( stateFirstload.moodSelect ){
															
															stateFirstload.moodSelect = {}
															
														}
														 
														obj.modal.moodList();
															 
													}
												});	
												
												
											})
										
										}else{
											
															
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Nama Mood telah terdaftar silahkan pilih nama lain </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
											
										}
										
									}) 
									
								}
								
							})
							
							
						},
						moodList : function(){
							
							let self = this,
							modal = scope.qs("mood-list"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							moodNew = scope.qs("button-list-mood-new"),
							btnVaccineNew = modal.querySelector(".button-list-mood-new"),
							data = obj.dataStorage["moodList"],
							container =  scope.qs("mood-list-container"),
							dataEmpty = true,
							contentDom = function( params ){
								
								let fragment = scope.stringToHtml5Template(
									'<li class="pt0 pb0 pr10 p20" >' +
									'	<ul class="list-inline ">' +
									'		<li class="modal-list left">' +
									'			<div class="container-checkbox centerdiv ">' +
									'			</div>' +
									'		</li>' +
									'		<li class="modal-list right">' +
									'			<ul class="list-inline modal-list-container centerdiv">' +
									'				<li class="option-color semibold pl0">'+ params.name +'</li> ' +
									'			</ul>' +
									'			<div class="todo-dot-menu">' +
									'				<div class="todo-dot-cnt-icon menu-dot-icon "></div>' +
									'				<div class="todo-dot-child-menu option-color hidden" label-id="'+ params.id +'" name="'+ params.name +'"> Hapus </div>' +
									'			</div>' +
									'		</li>' +
									'	</ul>' +
									'</li>'  
								);
								
								
								container.appendChild( fragment )
								
							},
							dataNoteFn = function( dataNote, index ){
								 
								contentDom({
									name : dataNote.name,
									id : dataNote.id
								})
								
								dataEmpty = false;
								
								
							};
							
							container.innerHTML = "";
							 
							data.forEach( function( dataNote, index ){
 
								dataNoteFn( dataNote, index );   
							})	
							 
							
							let objBtnLi = scope.slice( container.querySelectorAll( ".border-none > li" ) );
							  
							stateFirstload.moodSelect = {};
							  
							objBtnLi.forEach(function( objLi ){ 
							 
								scope.attachListener( objLi, 'click', function( e ){
									 
									let fragment = scope.stringToHtml5Template(
										'<div class="checked centerdiv"></div>'
									),
									elSelect = modal.querySelector(".select"),
									elChecked = modal.querySelector(".checked"),
									elCheckbox = this.querySelector(".container-checkbox"), 
									dotMenu = this.querySelector(".todo-dot-child-menu"),
									label = dotMenu.getAttribute("label-id"),
									name = dotMenu.getAttribute("name");
									
									if( /select/i.test( this.className ) ){
										 
										this.querySelector(".checked").remove();	
											  
										scope.removeClass( this, "select" );
											
										delete stateFirstload.moodSelect[ label ]
										 
									}else{
										
										scope.addClass( this, "select" )	 
											 
										elCheckbox.appendChild( fragment );
										
										stateFirstload.moodSelect[ label ] = {
											name : name,
											label : label
										}
									}
									  
								}) 
							}) 
							
							/**
								attach right dot buttons ke event click
							*/
							objBtnLi.forEach(function( objCnt ){
								
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
								hide hidden button ketika user tap/ cursor di luar element
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
							 
							 
							/**
								delete element
							*/
							scope.slice( modal.querySelectorAll(".todo-dot-child-menu") ).forEach(function( btnChildRight ){
								
								scope.attachListener( btnChildRight, 'click', function(){
									 
									let id = this.getAttribute("label-id");
									 
									obj.storageCrud({ 
										dataStorage : "moodList",
										id : id,
										type : "delete"
									},
									function(){ 
										  
										
										if( stateFirstload.moodSelect ){
											
											stateFirstload.moodSelect = {}
											
										} 
										 
										//self update
										obj.modal.moodList();
										  
									}); 
									
								})  
							})	 
							 
							 
							if( !stateFirstload.moodList ){
									 
								scope.attachListener( moodNew, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({ 
										registerModal : "mood-list",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("mood-add")
										}
									})
									
								}) ;
								
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									
										
									let cntSymptom = scope.qs("container-mood-list"),
									string = "";
									
									cntSymptom.innerHTML = "";
									
									for( let ii in stateFirstload.moodSelect ){
										
										symptomObj =  stateFirstload.moodSelect[ii];
									
										string += " <div class='capsule' label='"+ symptomObj.name +"'> "+ symptomObj.name +"</div> "
										  
									}
									
									let fragment = scope.stringToHtml5Template( string )
									
									cntSymptom.appendChild( fragment )
										 
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
								 
									
								})
								
								stateFirstload.moodList = true;
							}
						},
						pillConfirm : function(){
							
							let self = this,
							btnBack = scope.qs("modal-pill-confirm").querySelector(".back-button"),
							btnSend = scope.qs("modal-pill-confirm").querySelector(".send-button");
							
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
									dataStorage : "pill"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.main.pill(); // update
											 
											obj.main.circle.init(); // update
										}
									}); 
									 
								});  
								
							});
							
						},
						pillDetail : function(){
							
							let self = this,
							btnBack = scope.qs("modal-pill-detail").querySelector(".back-button"),
							btnSend = scope.qs("modal-pill-detail").querySelector(".send-button"),
							btnPillDetail = scope.qs("button-pill-detail");
							
							
							/*
								close
							**/
							scope.attachListener( btnPillDetail, 'click', function(){
								
								let self = this;
								
								stateFirstload.pillId = self.getAttribute("label-id");
									 
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.main.pill("select-pill");
										
										stateFirstload.swiperPill.slideTo( 1, 300 );
									}
								})
								
								
							});
							
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
								 
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.modal.behaviour.openModalFadeIn("modal-pill-confirm"); 
									}
								})
							 
							})
						},
						pillNew :{
							dateStart : new Date(),
							pillType : {
								pill :28,
								emptyPill : 0
							},
							pluginPillDate : function(){
								
								let self = obj.modal,
								objMe = this,
								pluginPill = scope.qs("plugin-datepicker-pill"),
								modal = scope.qs("modal-pill-new"),
								pluginBack = pluginPill.querySelector(".back-button"),
								pluginSend = pluginPill.querySelector(".send-button"),
								datepickerPill = scope.qs("datepicker-pill"),
								inputCover = modal.querySelector(".input-disabled");
								
								/*
									close plugin date
								**/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								})
								
								
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){ 
											
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-pill");
									
									if( self.state.pill ){
										
										/*attach button*/
										let inputBound = inputCover.getBoundingClientRect(),
										objInput = inputCover.querySelector("input"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerPill.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											return new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
										};
										
										scope.text( scope.qs("select-date-plgn-pill"), scope.dateToYMD({
											
											date :  new Date(),
											withYear : true,
											isShortMonth : true
											
										}) )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											dateSelect = selectDateFn();
											  
											objMe.dateStart =  dateSelect;
											  
											objInput.value = scope.dateToYMD({
												date : dateSelect,
													withYear : true,
													isShortMonth : true
											} );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-pill",
											fn : function(){
												  
												scope.text( scope.qs("select-date-plgn-pill"), scope.dateToYMD({
													date : selectDateFn(),
													withYear : true,
													isShortMonth : true
												}) );
												 
											}
										})
										//execute once 
										self.state.pill = false;
									}
								
								})
								
								
								
								
								
							},
							pluginPillType : function(){
								
									  
								/**
									plugin pill type
								*/  
								
								let self = this,
								modalPluginPillType = scope.qs("plugin-datepicker-pill-type"),
								datepickerPillType = scope.qs("datepicker-pill-type"),
								pluginBack = modalPluginPillType.querySelector(".back-button"),
								pluginSend = modalPluginPillType.querySelector(".send-button"),
								modal = scope.qs("modal-pill-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[1], 
								swiper = new Swiper('.datepicker-pill-type', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView: 3,
									loop: true,
									initialSlide: 8
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerPillType.querySelector(".swiper-slide-active").textContent,
									textArr =  text.split(" + "),
									hormon = textArr[0] +' Hormon',
									empty = textArr[1] ?  ', '+textArr[1] +' Kosong' : "";
									
									scope.text( scope.qs("select-pill-type"), hormon + empty );
								
									self.pillType.pill = parseInt( textArr[0] );
									self.pillType.emptyPill = textArr[1] ? textArr[1] : 0;
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-pill-type");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepickerPillType.querySelector(".swiper-slide-active").textContent;
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							init : function(){
								
								let self = this,
								modal = scope.qs("modal-pill-new"),
								inputs = scope.slice( modal.getElementsByTagName("input") ),
								btnTrigger = scope.qs("pill-button"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								
								
								/** Trigger Modal*/
								scope.attachListener( btnTrigger, 'click', function(){
									
									obj.modal.behaviour.openModalFadeIn("modal-pill-new");
									
								}) 
								
								
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[0], "textarea" );
								
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									
									let dateEnd = new Date( self.dateStart ),
									dateNow = new Date();
									
									dateEnd.setDate( dateEnd.getDate() + self.pillType.pill )
									     
									let dateError = self.dateStart.setHours(0,0,0,0) <= dateNow.setHours(0,0,0,0) && dateNow.setHours(0,0,0,0) <= dateEnd.setHours(0,0,0,0);
									    
									if( obj.inputValidate( inputs ) ){
										 
											 
										if( !dateError ){
										
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Bisa jadi tanggal telah kadaluarsa untuk mengkonsumsi pil hormon kb atau tanggal yang dipilih melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											  
										
										}else if(  self.dateStart.setHours(0,0,0,0) > dateNow.setHours(0,0,0,0) ){
																					
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> apakah tanggal yang dipilih melewati tanggal sekarang ? </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											  
										}else{
											 
											 
											let title = scope.encodeStr( inputs[0].value );
											
											obj.storageCrud({
												dataStorage : "pill",
												type : "add",
												dateStart : self.dateStart.toLocaleString("id-ID"),
												title : title,
												pillType : scope.extend( {}, self.pillType )
											},
											function( objNotify ){
												 
												stateFirstload.pillId = "";
												 
												obj.main.pill();
														 
												obj.modal.behaviour.closeFadeout({
													end : function(){
														
														stateFirstload.swiperPill.slideTo( 1, 300 );
														
													}
												});	
												
													  
											})
										}
									}
									
									
								});
								
								this.pluginPillDate();
								
								this.pluginPillType();
								
								
							}
							
						} ,
						injectConfirm : function(){
							
							let self = this,
							btnBack = scope.qs("modal-inject-confirm").querySelector(".back-button"),
							btnSend = scope.qs("modal-inject-confirm").querySelector(".send-button");
							
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
									dataStorage : "inject"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.main.injection(); // update
											
											obj.main.circle.init(); // update
										}
									}); 
									 
								});  
								
							});
							
						},
						injectDetail : function(){
							
							let self = this,
							btnBack = scope.qs("modal-inject-detail").querySelector(".back-button"),
							btnSend = scope.qs("modal-inject-detail").querySelector(".send-button"),
							btnInjectDetail = scope.qs("button-inject-detail");
							
							
							/*
								close
							**/
							scope.attachListener( btnInjectDetail, 'click', function(){
								
								let self = this;
								
								
								stateFirstload.injectId = self.getAttribute("label-id");
									 
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.main.injection("select-inject");
										
										stateFirstload.swiperInject.slideTo( 1, 300 );
									}
								})
								
								
							});
							
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
								 
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.modal.behaviour.openModalFadeIn("modal-inject-confirm"); 
									}
								})
							 
							})
						},
						injectNew : {
							dateStart : new Date(),
							injectType : 1,
							pluginInjectDate : function(){
								
								let self = obj.modal,
								objMe = this,
								pluginPill = scope.qs("plugin-datepicker-inject"),
								modal = scope.qs("modal-inject-new"),
								pluginBack = pluginPill.querySelector(".back-button"),
								pluginSend = pluginPill.querySelector(".send-button"),
								datepickerInject = scope.qs("datepicker-inject"),
								inputCover = modal.querySelector(".input-disabled");
								
								/*
									close plugin date
								**/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								});
								
								
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){ 
											
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-inject");
									
									if( self.state.inject ){
										
										/*attach button*/
										let inputBound = inputCover.getBoundingClientRect(),
										objInput = inputCover.querySelector("input"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerInject.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											return new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
										};
										
										scope.text( scope.qs("select-date-plgn-inject"), scope.dateToYMD({
											
											date :  new Date(),
											withYear : true,
											isShortMonth : true
											
										}) )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											dateSelect = selectDateFn();
											  
											objMe.dateStart =  dateSelect;
											  
											objInput.value = scope.dateToYMD({
												date : dateSelect,
													withYear : true,
													isShortMonth : true
											} );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-inject",
											fn : function(){
												  
												scope.text( scope.qs("select-date-plgn-inject"), scope.dateToYMD({
													date : selectDateFn(),
													withYear : true,
													isShortMonth : true
												}) );
												 
											}
										})
										//execute once 
										self.state.inject = false;
									}
								
								})
								
								
								
								
								
							},
							pluginInjectType : function(){
								
									  
								/**
									plugin inject type
								*/  
								
								let self = this,
								modalPluginInjectType = scope.qs("plugin-datepicker-inject-type"),
								datepickerInjectType = scope.qs("datepicker-inject-type"),
								pluginBack = modalPluginInjectType.querySelector(".back-button"),
								pluginSend = modalPluginInjectType.querySelector(".send-button"),
								modal = scope.qs("modal-inject-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[1], 
								swiper = new Swiper('.datepicker-inject-type', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 0
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerInjectType.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-inject-type"), "Tipe Suntik "+ textVal +" Bulan");
								
									self.injectType = textVal;
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-inject-type");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepickerInjectType.querySelector(".swiper-slide-active").textContent;
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							init : function(){
								
								let self = this,
								modal = scope.qs("modal-inject-new"),
								inputs = scope.slice( modal.getElementsByTagName("input") ),
								btnTrigger = scope.qs("inject-button"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								 
								/** Trigger Modal*/
								scope.attachListener( btnTrigger, 'click', function(){
									
									obj.modal.behaviour.openModalFadeIn("modal-inject-new");
									
								}) 
								 
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[0], "textarea" );
								
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									
									
									let dateEnd = new Date( self.dateStart ),
									dateNow = new Date();
									
									dateEnd.setDate( dateEnd.getDate() + ( self.injectType * 28 ) )
									     
									let dateError = self.dateStart.setHours(0,0,0,0) <= dateNow.setHours(0,0,0,0) && dateNow.setHours(0,0,0,0) <= dateEnd.setHours(0,0,0,0);
									    	
									if( obj.inputValidate( inputs ) ){
										   
										if( !dateError ){
										
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Bisa jadi tanggal telah kadaluarsa untuk program suntik kb atau tanggal yang dipilih melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											  
										
										}else if(  self.dateStart > dateNow ){
																					
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> apakah tanggal yang dipilih melewati tanggal sekarang ? </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											  
										}else{
											 
											 
											let title = scope.encodeStr( inputs[0].value );
											
											obj.storageCrud({
												dataStorage : "inject",
												type : "add",
												dateStart : self.dateStart.toLocaleString("id-ID"),
												dateEnd : dateEnd.toLocaleString("id-ID"),
												title : title,
												injectType : self.injectType
											},
											function( objNotify ){
												 
												stateFirstload.injectId  = "";
												 
												obj.main.injection();

												obj.main.circle.init();
												
												obj.modal.behaviour.closeFadeout({
													end : function(){
														
														stateFirstload.swiperInject.slideTo( 1, 300 );
														
													}
												});	
												
													  
											})
										}
									}
									
									
								});
								 
								self.pluginInjectDate() 
								
								self.pluginInjectType() 
								 
							}
							
						},
						calendarConfirm : function(){
							
							let self = this,
							btnBack = scope.qs("modal-calendar-confirm").querySelector(".back-button"),
							btnSend = scope.qs("modal-calendar-confirm").querySelector(".send-button");
							
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
									dataStorage : "calendar"
								},
								function(){
									
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.main.calendar(); // update
										}
									}); 
									 
								});  
								
							});
							
						},
						calendarDetail : function(){
							
							let self = this,
							btnBack = scope.qs("modal-calendar-detail").querySelector(".back-button"),
							btnSend = scope.qs("modal-calendar-detail").querySelector(".send-button"),
							btnInjectDetail = scope.qs("button-calendar-detail");
							
							
							/*
								close
							**/
							scope.attachListener( btnInjectDetail, 'click', function(){
								
								let self = this;
								
								
								stateFirstload.calendarId = self.getAttribute("label-id");
									 
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										
										obj.main.calendar("select-calendar");
										
										stateFirstload.swiperCalendar.slideTo( 1, 300 );
									}
								})
								
								
							});
							
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
								 
								obj.modal.behaviour.closeRightToleftFadeout({
									end : function(){
										obj.modal.behaviour.openModalFadeIn("modal-calendar-confirm"); 
									}
								})
							 
							})
						
						},
						calendarNew : {
							dateStart : new Date(),
							intervalPeriod : 0,
							avgCyclePeriod : 0,
							shortCyclePeriod : 0,
							method : "",
							pluginCalendarLong : function(){
								
									  
								/**
									plugin calendar long
								*/  
								
								let self = this,
								modalPluginCalendar = scope.qs("plugin-datepicker-calendar-long"),
								datepickerCalendar = scope.qs("datepicker-calendar-long"),
								pluginBack = modalPluginCalendar.querySelector(".back-button"),
								pluginSend = modalPluginCalendar.querySelector(".send-button"),
								modal = scope.qs("modal-calendar-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[5], 
								swiper = new Swiper('.datepicker-calendar-long', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 7
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendar.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-calendar-long"), "Siklus Terpanjang "+ textVal +" Hari");
									 
									self.longCyclePeriod = textVal;
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-calendar-long");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepickerCalendar.querySelector(".swiper-slide-active").textContent;
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							pluginCalendarShort : function(){
								
									  
								/**
									plugin calendar Short
								*/  
								
								let self = this,
								modalPluginCalendar = scope.qs("plugin-datepicker-calendar-short"),
								datepickerCalendar = scope.qs("datepicker-calendar-short"),
								pluginBack = modalPluginCalendar.querySelector(".back-button"),
								pluginSend = modalPluginCalendar.querySelector(".send-button"),
								modal = scope.qs("modal-calendar-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[4], 
								swiper = new Swiper('.datepicker-calendar-short', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 7
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendar.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-calendar-short"), "Siklus Terpendek "+ textVal +" Hari");
								
									self.shortCyclePeriod = textVal;
								 
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-calendar-short");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepickerCalendar.querySelector(".swiper-slide-active").textContent;
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							pluginCalendarAvg : function(){
								
									  
								/**
									plugin calendar avg
								*/  
								
								let self = this,
								modalPluginCalendarType = scope.qs("plugin-datepicker-calendar-avg"),
								datepickerCalendarType = scope.qs("datepicker-calendar-avg"),
								pluginBack = modalPluginCalendarType.querySelector(".back-button"),
								pluginSend = modalPluginCalendarType.querySelector(".send-button"),
								modal = scope.qs("modal-calendar-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[3], 
								swiper = new Swiper('.datepicker-calendar-avg', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 7
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendarType.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-calendar-avg"), "Masa Siklus "+ textVal +" Hari");
									 
									self.avgCyclePeriod = textVal; 
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-calendar-avg");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepickerCalendarType.querySelector(".swiper-slide-active").textContent;
									
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							pluginCalendarType : function(){
								
									  
								/**
									plugin calendar type
								*/  
								
								let self = this,
								modalPluginCalendarType = scope.qs("plugin-datepicker-calendar-type"),
								datepickerCalendarType = scope.qs("datepicker-calendar-type"),
								pluginBack = modalPluginCalendarType.querySelector(".back-button"),
								pluginSend = modalPluginCalendarType.querySelector(".send-button"),
								modal = scope.qs("modal-calendar-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[2], 
								swiper = new Swiper('.datepicker-calendar-type', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 6
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendarType.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-calendar-type"), "Lama Haid "+ textVal +" Hari");
								
									self.intervalPeriod = textVal; 
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-calendar-type");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepickerCalendarType.querySelector(".swiper-slide-active").textContent;
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							pluginCalendarDate : function(){
								
								let self = obj.modal,
								objMe = this,
								pluginCalendar = scope.qs("plugin-datepicker-calendar"),
								modal = scope.qs("modal-calendar-new"),
								pluginBack = pluginCalendar.querySelector(".back-button"),
								pluginSend = pluginCalendar.querySelector(".send-button"),
								datepickerCalendar = scope.qs("datepicker-calendar"),
								inputCover = modal.querySelectorAll(".input-disabled")[1];
								
								/*
									close plugin date
								**/
								scope.attachListener( pluginBack, 'click', function(){
									
									obj.modalPlugin.behaviour.closeFadeout();
								});
								 
								/**
									input
								*/
								scope.attachListener( inputCover, 'click', function( index ){ 
											
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-calendar");
									
									if( self.state.calendar ){
										
										/*attach button*/
										let inputBound = inputCover.getBoundingClientRect(),
										objInput = inputCover.querySelector("input"),
										selectDateFn = function(){
											
											let timepicked = scope.slice( datepickerCalendar.querySelectorAll(".swiper-slide-active") );
											
											objInput.value = "";
											 
											//reverse it to yyyy/mm/dd
											timepicked.reverse();
											
											return new Date( 
												timepicked[0].textContent, 
												parseInt( timepicked[1].textContent ) - 1, 
												timepicked[2].textContent
											)
											
										};
										
										scope.text( scope.qs("select-date-plgn-calendar"), scope.dateToYMD({
											
											date :  new Date(),
											withYear : true,
											isShortMonth : true
											
										}) )
										
										/**
											confirm plugin date
										*/
										scope.attachListener( pluginSend, 'click', function(){
											  
											dateSelect = selectDateFn();
											  
											objMe.dateStart =  dateSelect;
											  
											objInput.value = scope.dateToYMD({
												date : dateSelect,
													withYear : true,
													isShortMonth : true
											} );
											  
											obj.modalPlugin.behaviour.closeFadeout();
											
										})
										
										obj.generateSwiperDate({
											containerStr : ".datepicker-calendar",
											fn : function(){
												  
												scope.text( scope.qs("select-date-plgn-calendar"), scope.dateToYMD({
													date : selectDateFn(),
													withYear : true,
													isShortMonth : true
												}) );
												 
											}
										})
										//execute once 
										self.state.calendar = false;
									}
								
								})
							 	
								
							},
							init : function(){
								
								let self = this,
								modal = scope.qs("modal-calendar-new"),
								inputs = scope.slice( modal.getElementsByTagName("input") ),
								btnTrigger = scope.qs("calendar-button"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								 
								/** Trigger Modal*/
								scope.attachListener( btnTrigger, 'click', function(){
									
									obj.modal.behaviour.openModalFadeIn("modal-calendar-new");
									
								}) 
								  
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[0], "textarea" );
								
								/**
									bind modal-input to inputs
								*/ 
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
									
								})  
								
								scope.attachListener( btnSend, 'click', function(){
									 
									let method = parseInt( inputs[1].getAttribute("method") ),
									methodSelect =  method === 2,
									elements = methodSelect ? [ inputs[0], inputs[1], inputs[2], inputs[3], inputs[3] ] : inputs;
									  
									if( obj.inputValidate( elements ) ){
									  
										let title = scope.encodeStr( inputs[0].value ),
										methodText = scope.encodeStr( inputs[1].value ),
										firstPeriod = self.dateStart.toLocaleString("id-ID"),
										intervalPeriod = scope.encodeStr( inputs[3].value ),
										avgCyclePeriod = scope.encodeStr( inputs[4].value ),
										shortCyclePeriod = scope.encodeStr( inputs[5].value ),
										longCyclePeriod = scope.encodeStr( inputs[6].value ),
										  
										  
										avgCyclePeriodVal = parseInt( avgCyclePeriod.split(" ")[0] ),
										shortCyclePeriodVal = parseInt( shortCyclePeriod.split(" ")[0] ), 
										longCyclePeriodVal = parseInt( longCyclePeriod.split(" ")[0] ); 
										   
										if( !methodSelect && avgCyclePeriodVal < shortCyclePeriodVal ){
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> siklus rara-rata haid harus sama dengan siklus haid terpendek atau lebih dari  </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !methodSelect && avgCyclePeriodVal > longCyclePeriodVal ){
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> siklus rara-rata haid harus sama dengan siklus haid terpanjang atau kurang dari  </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
										}else if( !methodSelect && shortCyclePeriodVal > longCyclePeriodVal ){
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> siklus Terpendek haid harus sama dengan siklus haid terpanjang atau kurang dari  </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
										
										}else if( methodSelect && ( avgCyclePeriodVal < 26 || avgCyclePeriodVal > 32 ) ){
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Metode ini hanya untuk wanita dengan siklus rata rata 26 hingga 32 hari </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !methodSelect && ( ( longCyclePeriodVal - shortCyclePeriodVal ) > 16  ) ){
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Rentang antara sirkulasi terpendek dan terpanjang tidak lebih dari 16 hari </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
										}else if(  self.dateStart > new Date() ){
												
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Tanggal yang dipilih melewati tanggal sekarang </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
										}else{
											
											obj.storageCrud({
												dataStorage : "calendar",
												type : "add",
												method : method,
												title : title,
												methodText : methodText,
												firstPeriod : firstPeriod,
												intervalPeriod : intervalPeriod,
												avgCyclePeriod : avgCyclePeriod,
												shortCyclePeriod : shortCyclePeriod,
												longCyclePeriod : longCyclePeriod
											},
											function( objNotify ){
												 
												stateFirstload.calendarId  = "";
												 
												obj.main.calendar();
														 
												obj.modal.behaviour.closeFadeout({
													end : function(){
														
														stateFirstload.swiperCalendar.slideTo( 1, 300 );
														
													}
												});	
												
													  
											})
										
											
										}
									 
									}
								}); 
								 
								 
								self.pluginCalendarDate();
								
								self.pluginCalendarType();
								
								self.pluginCalendarAvg();
								
								self.pluginCalendarShort();
								
								self.pluginCalendarLong();
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
										
											
										}else if( index === 8 ){
											  
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn( "charity-list" )
												}
											})  
											  
											  
										}else if( index === 9 ){
											  
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn( "modal-faq-list" )
												}
											})  
											  
											  
										} else if( index === 11){
											   
											obj.cordova.email.open();  
											   
										}else if( index === 12 ){
											  
											obj.cordova.launchApp.init({
												name : "com.owlpictureid.kb"
											});
											
										}else if( index === 14 ){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn("modal-back-restore") 
												}
											})     
											
										}else if( index === 15 ){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){ 
													obj.modal.behaviour.openModalFadeIn("modal-dev-app") 
												}
											}) 
											
										}  
										
									}.bind( objElement,  index ) )
								})
							}
						},
						faqList : function(){
							
							let self = this,
							btnBack = scope.qs("modal-faq-list").querySelector(".back-button");
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
								
							})  
							
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
									'period="'+params.period+' Hari"'+
									'circle="'+params.circle+' Hari"'+
									'circle-short="'+params.circleShort+' Hari"'+
									'circle-long="'+params.circleLong+' Hari"'+
									'></div>'+
									'	<div class="button-list text '+( params.active ? "active" : "" ) + '" >'+( params.active ? "Aktif" : "Aktifkan" )+'</div>'+
									'</li>'
								) 
								 
								container.appendChild( fragment ) 
								 
							},
							dataNoteFn = function( dataNote ){
								
								let name = dataNote.name,
								
								dateCreate = scope.dateToYMD({ 
									date : scope.stringToDate( dataNote.dateCreate ), 
									withYear : true
								}),
								
								typeText = dataNote.typeText,
								
								typeSelect = parseInt( dataNote.typeSelect ),
								
								active = dataNote.active;
								  
								contentDom({
									id : dataNote.id,
									name : scope.ucFirst( name.toLowerCase() ),
									active : active,
									typeSelect : typeSelect,
									typeText : typeText,
									period : dataNote.periodLength,
									circle : dataNote.circleLength,
									circleShort : dataNote.circleShort,
									circleLong : dataNote.circleLong,
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
											function( objDataBaby ){
												 
												obj.modal.behaviour.closeRightToleftFadeout({
													end : function(){
														
														dataObject = objDataBaby;
									
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
										 
										let labelId =  this.getAttribute("label-id");
										  
										scope.text( [ scope.qs("user-name-detail"), scope.qs("user-name-confirm") ], this.getAttribute("name") ) 
										scope.text( [ scope.qs("user-date-detail"), scope.qs("user-date-confirm") ], this.getAttribute("date-create") )  
										scope.text( [ scope.qs("user-period-detail"), scope.qs("user-period-confirm") ], this.getAttribute("period") )  
										scope.text( [ scope.qs("user-circle-detail"), scope.qs("user-circle-confirm") ], this.getAttribute("circle") )  
										scope.text( [ scope.qs("user-longcircle-detail"), scope.qs("user-longcircle-confirm") ], this.getAttribute("circle-long") )  
										scope.text( [ scope.qs("user-shortcircle-detail"), scope.qs("user-shortcircle-confirm") ], this.getAttribute("circle-short") )  
										
										  
										//set label confirm button
										scope.qs("modal-user-confirm").querySelector(".send-button").setAttribute( "label-id", labelId );
										 
										 
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												obj.modal.behaviour.openModalFadeIn("modal-user-detail");
											}
										}) 
										 
										
										 
										 
									})
								})
 
							}
							 
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
										obj.modal.behaviour.openModalFadeIn("modal-user-new");
									}
								}) 
								 
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
						userRegister : {
							circleLength : 28,
							periodLength : 5,
							type : {
								text : "Untuk saya sendiri",
								label : 1
							},
							selectDate : new Date(),
							pluginPeriodAvg : function(){
								   
								/**
									plugin period avg
								*/  
								
								let self = this,
								modalPluginCalendarType = scope.qs("plugin-datepicker-period-avg"),
								datepickerCalendarType = scope.qs("datepicker-period-avg"),
								pluginBack = modalPluginCalendarType.querySelector(".back-button"),
								pluginSend = modalPluginCalendarType.querySelector(".send-button"),
								modal = scope.qs("modal-user-new"),
								inputCover = scope.slice( modal.querySelectorAll(".input-disabled") )[0], 
								swiper = new Swiper('.datepicker-period-avg', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 4
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendarType.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-period-avg"), "Masa Menstruasi "+ textVal +" Hari");
									 
									self.periodLength = textVal; 
								   
								}); 
								 
								  
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-period-avg");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input"),
									
									activeEl = datepickerCalendarType.querySelector(".swiper-slide-active");
								   
									objInput.value = activeEl.textContent;
									
									obj.modalPlugin.behaviour.closeFadeout();
									
									self.periodLength = parseInt( activeEl.getAttribute("label") )
									 
										
								})
							
								  
								
							},
							pluginCalendarAvg : function(){
								   
								/**
									plugin circle avg
								*/  
								
								let self = this,
								modalPluginCalendarType = scope.qs("plugin-datepicker-circle-avg"),
								datepickerCalendarType = scope.qs("datepicker-circle-avg"),
								pluginBack = modalPluginCalendarType.querySelector(".back-button"),
								pluginSend = modalPluginCalendarType.querySelector(".send-button"),
								modal = scope.qs("modal-user-new"),
								inputCover = scope.slice( modal.querySelectorAll(".input-disabled") )[1], 
								swiper = new Swiper('.datepicker-circle-avg', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:3,
									loop: true,
									initialSlide: 7
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let text = datepickerCalendarType.querySelector(".swiper-slide-active").getAttribute("label"),
									textVal =  parseInt(  text );
									
									scope.text( scope.qs("select-circle-avg"), "Masa Siklus "+ textVal +" Hari");
									 
									self.circleLength = textVal; 
								
								}); 
								 
								  
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-circle-avg");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input"),
									
									activeEl = datepickerCalendarType.querySelector(".swiper-slide-active");
								   
									objInput.value = activeEl.textContent;
									
									obj.modalPlugin.behaviour.closeFadeout();
									
									self.circleLength = parseInt( activeEl.getAttribute("label") )
									 
									
								})
							
								  
								
							},
							pluginUserRegType : function(){
								 
								/**
									plugin inject type
								*/  
								
								let self = this,
								modalPlugin = scope.qs("plugin-datepicker-user-select"),
								datepicker = scope.qs("datepicker-user-select"),
								pluginBack = modalPlugin.querySelector(".back-button"),
								pluginSend = modalPlugin.querySelector(".send-button"),
								modal = scope.qs("modal-user-new"),
								inputCover = modal.querySelectorAll(".input-disabled")[2], 
								swiper = new Swiper('.datepicker-user-select', {
									observer: true,
									observeParents: true, 
									direction: 'vertical',
									centeredSlides: true,
									slidesPerView:1,
									loop: true,
									initialSlide: 0
								}); 
								 
								swiper.on('slideChangeTransitionEnd', function () {
									
									
									let el =  datepicker.querySelector(".swiper-slide-active"), 
									label = el.getAttribute("label"),
									text = el.getAttribute("label-text"),
									textVal =  parseInt(  label );
									
									scope.text( scope.qs("select-user-select"), text );
								
									self.type = {
										label : textVal,
										text : text
									};
								
								}); 
								 
							
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
								  
									obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-user-select");
									 
								})
								
								scope.attachListener( pluginSend, 'click', function(){
									
									
									let objInput = inputCover.querySelector("input");
								   
									objInput.value = datepicker.querySelector(".swiper-slide-active").textContent;
									 
									obj.modalPlugin.behaviour.closeFadeout();
									
								})
							
								  
								
							},
							init : function(){
								let self =  this,
								modal = scope.qs("modal-user-new"),
								btnBack = modal.querySelector(".back-button"),
								btnReg = modal.querySelector(".button-reg"),
								inputs = scope.slice( modal.getElementsByTagName("input") ),
								inputCover = modal.querySelectorAll(".input-disabled");
								  
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[0], "textarea" );
								 
								scope.attachListener( btnBack, 'click', function(){ 
									
									obj.modal.behaviour.closeRightToleftFadeout()
								})
								 
								 
								scope.attachListener( btnReg, 'click', function(){
									   
									let isSelectTypeReg = obj.dataStorage.dataObject.length && dataObject.typeSelect === 2,
									inputFilter = isSelectTypeReg ? [ inputs[0], inputs[1], inputs[2] ] : inputs;
									       
									if( obj.inputValidate( inputFilter ) ){
												
											let dateNow = new Date(),
									 
											typeText = this.type.text,
											
											typeSelect = isSelectTypeReg ? dataObject.typeSelect : this.type.label,
											
											name = scope.encodeStr( inputs[0].value );
										     
											obj.storageCrud({
												dataStorage : "dataObject",
												type : "add",
												typeText : typeText,
												typeSelect : 2,//typeSelect,
												periodLength : self.periodLength,
												circleLength : self.circleLength,
												name : scope.ucFirst( name.toLowerCase() ),
												dateCreate : dateNow.toLocaleString("id-ID")
												
											},
											function(){
								
												dataObject = obj.dataStorage.dataObject[0];
						   
												obj.reupdateData();
												  
												obj.modal.behaviour.closeFadeout(); 
												 
											}) 
											  
									}
									
									
								}.bind( this )) 
								  
								this.pluginUserRegType();
								 
								this.pluginCalendarAvg();
								
								this.pluginPeriodAvg();
							}
						},
						userDetail : function(){ 
						
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
						},
						userConfirm : function(){ 
						 
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
									function( objDataBaby ){
									 
										obj.reupdateData();
										
										if( !obj.noDataObjectInStorage() ){
											 
											obj.modal.behaviour.closeFadeout()
										 
										}
									});
									  
									
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
									id : "com.owlpictureid.kb.gold",
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
										
										let interId = ["6", "5", "7", "8", "0", "0", "4", "1", "8", "4", "/", "9", "9", "1", "5", "8", "1", "1", "9", "2", "7", "5", "3", "6", "3", "7", "2", "-", "b", "u", "p", "-", "p", "p", "a", "-", "a", "c"]
										global.admob.interstitial.config({
											id : "ca-app-pub-3940256099942544/1033173712",//interId.reverse().join(""),
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
										 
										//admob banner id "ca-app-pub-2736357291185199/7101101642".split("").reverse();
										//admob smart banner test ca-app-pub-3940256099942544/6300978111
										let bannerId = ["9", "2", "3", "7", "0", "8", "2", "4", "0", "8", "/", "9", "9", "1", "5", "8", "1", "1", "9", "2", "7", "5", "3", "6", "3", "7", "2", "-", "b", "u", "p", "-", "p", "p", "a", "-", "a", "c"]
										
										global.admob.banner.config({
											id : "ca-app-pub-3940256099942544/6300978111",//bannerId.reverse().join(""),
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
											  	  
											
										}else{
											
											scope.removeClass( modalBanner, "hidden" )
											   
										
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
									  
									  
									var networkState = navigator.connection.type;
								 
									if ( global.cordova && networkState !== Connection.NONE ) {
										 
										//user subscribe IAP 
										//return true berarti iap active jadi tambah kan ! saja biar ads gak di exe
										if( !isIapActive ){
												
											self.banner.isBannerActive = true;
											 
											self.banner.init();
  
											self.interstitial.init(); 
											
										}
										
										obj.appConfig.iap.init()
										 
									}else{
										
										self.banner.isBannerActive = false;
										
									}
									 
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
						badgeHeader : function(){
							let headerLi = scope.slice( scope.qs("header-menu").querySelectorAll("li") ),
							badgeHeader = headerLi[1].querySelector(".badge");
							
							//tampilkan aplikasi pengembang atau share whatsapp button
							scope.addClass( headerLi[ scope.random(1,1) ], "hidden" )
							 
							//hidden badge header kalau perndah diklik sekali
							obj.dataStorage.layoutState.badgeHeader.init && badgeHeader.remove();
							
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
						color : function(){
 
							let header = document.getElementsByTagName("header")[0],
							main = document.getElementsByTagName("main")[0],
							headerNotify = scope.slice( document.querySelectorAll(".header-notify") ),
							btns = scope.slice( document.querySelectorAll(".btn-main-new") ), 
							notifyStrip = scope.slice( scope.qsAll("notify-strip") ),
							notifyStripB = scope.slice( scope.qsAll("notify-strip-b") ),
							inbeetweenGraph = scope.slice( scope.qsAll("inbeetween") ),
							headerTextParent = scope.qs("header-text-parent"),
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
																	
								objEl.setAttribute("style", style );
							   
							})
							
								 
							//header
							header.setAttribute("style", style );
							
							headerNotify.forEach(function( objEl ){
																	
								objEl.setAttribute("style", style );
							   
							})
							
							
							btns.forEach(function( objEl ){
																	
								objEl.setAttribute("style", style );
							   
							})
							
							
							headerTextParent.setAttribute("style", style );
							
							//buttons 
							scope.qs("period-button").setAttribute("style", style ); 
							scope.qs("pill-button").setAttribute("style", style ); 
							scope.qs("inject-button").setAttribute("style", style ); 
							scope.qs("remainder-button").setAttribute("style", style ); 
							scope.qs("calendar-button").setAttribute("style", style ); 
							  
						}
					},
					loadMore : {
						state :{
							circle : {
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
							calendar : {
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
							pill : {
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
							injection : {
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
									 
									if( typeof obj.main[ params.main ] === "function" ){
										
										obj.main[ params.main ]({
											loadmore : true
										})
										
									}else{
										
										obj.main[ params.main ][ params.loadTrackerStateFn ? params.loadTrackerStateFn : "update" ]({
											loadmore : true
										}) 
									}
								}
								 
								initState.current = 0; 
								
								if( initState.disableState > 0 ){
								 
									initState.disabled = true;
									
									scope.addClass( initState.element, "hidden");
									
									scope.removeClass( initState.element, "spinner");
								}
								
								initState.disableState++; 
							} 
							
						},
						init : function(){
							let self = this,
							loadMoreInterval = setInterval(function(){
								
								
								self.loadTracker({
									loadTrackerStateFn : "notes",
									container : "box-note-content",
									main : "circle",
									isDataChart : false
								}); 
								 
								
								self.loadTracker({
									container : "box-birth-content",
									main : "pill",
									isDataChart : false
								}); 
								 
								self.loadTracker({
									container : "box-inject-content",
									main : "injection",
									isDataChart : false
								});

 
								self.loadTracker({
									container : "box-calendar-content",
									main : "calendar",
									isDataChart : false
								});  								
								
								self.loadTracker({
									container : "remainder-content",
									main : "remainder",
									isDataChart : false
								});
								
							},1000)
						}
					},
					reupdateData : function( init ){
						 
						let modalNewUser = scope.qs("modal-user-new")
						len = obj.dataStorage.dataObject.length,
						inputType = scope.slice( modalNewUser.getElementsByTagName("input") )[3];
						
						//hidden or not input type
						scope[ ( len && dataObject.typeSelect === 2 ? "addClass" : "removeClass" ) ]( scope.nthParent( inputType, 3 ), "hidden" );
						
						//hidden or not navigate
						scope[ ( !len ? "addClass" : "removeClass" ) ]( modalNewUser.querySelector(".modal-header"), "hidden" );
						
						 
						//hidden or not trigger new button
						 scope[ ( len && dataObject.typeSelect === 1 ? "addClass" : "removeClass" ) ]( scope.qs("button-user-new"), "hidden" ); 
								 

						
						//update username
						scope.text( scope.qs("user-active-name"), scope.ucFirst( dataObject.name.toLowerCase() ) )
						 
						
						 
						stateFirstload.swiperCalendar.slideTo( 0, 300 );
						stateFirstload.swiperPill.slideTo( 0, 300 );
						stateFirstload.swiperInject.slideTo( 0, 300 );
						 
						 
						if( !init ){ 
							 
							this.main.circle.init();
							
							this.main.remainder();
						
							this.main.pill();
							
							this.main.calendar();
					   
							this.main.injection();
							
							this.modal.userList();
							
						}
						
					},
					noDataObjectInStorage : function(){
						
						let body = document.getElementsByTagName("body")[0];
						
						if( !obj.dataStorage.dataObject.length ){
							  
							obj.modal.behaviour.closeRightToleftFadeout({
								end : function(){
									obj.modal.behaviour.openModalFadeIn("modal-user-new")
								}
							})
							
							
						
							return true
						}else{
								 
							return false;
						}
					}
				
				}
				
				
				//console.log(  "ca-app-pub-2736357291185199/4814008756".split("").reverse  )
				//localStorage.removeItem( strHtml5Storage ) ;
				//console.log(  JSON.parse( localStorage.getItem( strHtml5Storage ) ) );
				//console.log( scope.JSONstringfy( JSON.parse( localStorage.getItem( strHtml5Storage ) ) ) );
				 
				obj.storage(function(){
					   
					
					//execute layout
					obj.layout();   
					    
					obj.appConfig.mobile();
					 
					obj.header();
					 
					obj.noDataObjectInStorage();
					
					obj.modal.faqList(); 
					 
					obj.modalMenu.menuRestore();
					
					obj.modal.backupAndRestore();
					
					
					obj.modal.appRate();
					 
					obj.modal.appList.init();
					
					
					obj.modal.triggerModals(); 
					    
					obj.modal.othersList.init();
					 
					 
					obj.modal.userRegister.init();
					
					obj.modal.userList();
					
					obj.modal.userDetail();
					
					obj.modal.userConfirm();
					
					
					obj.main.remainder();
					 
					obj.modal.remainderNew(); 
					
					obj.modal.remainderDetail.init();
					
					obj.modal.remainderDeleteConfirm();
					
					obj.modalMenu.menuRemainder();
					
					obj.generateDatePluginElement();
					
					 
					obj.main.calendar();
					
					obj.modal.calendarNew.init();
					 
					obj.modal.calendarDetail();    
					
					obj.modal.calendarConfirm();    
					
					obj.modalMenu.menuCalendarMethod(); 
					
					obj.modalMenu.menuCalendarPosOvulatory();
					 
					 
					obj.main.circle.init();
					
					obj.modal.periodConfirm.init();
					
					obj.modal.periodDetail.init();
					
					obj.modal.periodNew.init();
					
					obj.modal.periodDate.init();
					
					obj.modal.moodAdd();
					
					obj.modal.moodList();
					 
					obj.modal.symptomAdd();
					
					obj.modal.symptomList();
					 
					 
					obj.main.injection();
					
					obj.modal.injectNew.init()
					
					obj.modal.injectDetail();    
					
					obj.modal.injectConfirm();    
					
					obj.modalMenu.menuNotifyInject();
					
					
					
					obj.main.pill();
					
					obj.modalPlugin.menuNotifyPill();
					   
					obj.modalMenu.menuTakenPill();
					
					obj.modalMenu.menuRemovePill();
					
					obj.modal.pillNew.init(); 
					
					obj.modal.pillDetail();    
					
					obj.modal.pillConfirm();    
					
					
					
					
					obj.modal.charityList();
					
					 
					
					obj.generateExpandCollapse();
					
					obj.reupdateData(true)
					
					obj.modalInput.init();
					
					obj.modalMenu.menuError.init()   
					   
					obj.generateDatePluginElement();
					
					obj.loadMore.init();
					 
					obj.footer();
					
					obj.cordova.appPlugin(); 
					 
					obj.cordova.backButton(); 
					 
					obj.appConfig.badgeHeader();
					
					obj.appConfig.color();
					
					obj.appConfig.ads.init();
					
					/*   
					   
					//execute layout
					obj.layout();
					
					obj.modal.behaviour.init();
					 
					obj.noDataObjectInStorage();
					
					obj.main.memo();
					
					obj.main.tracker();
					
					obj.main.home()
					
					
					
					
					
					
					
					
					
					
					obj.generateExpandCollapse();
					
					obj.modal.othersList.init();
					
					
					
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
					
					obj.modal.pregList.init();
					
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
					 
					
					obj.modal.memoNew();
					
					obj.modal.memoDetail();
					
					obj.modal.memoDeleteConfirm(); 
					
					obj.modalMenu.menuMemo();

					
					
					
					 
					 
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
					 
					 */
					
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
 
