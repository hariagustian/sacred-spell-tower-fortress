	 
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
				
				 if(this.isTwoDimensional(el)){
					for(var ii = el.length - 1; ii >= 0; ii--){
						this.addClassFn(
							el[ii][0],el[ii][1])
					}
				 }else{
					this.addClassFn(el,className)
				 }
			}

			this.removeClass = function (el, className) {
				if(this.isTwoDimensional(el)){
					for(var ii = el.length - 1; ii >= 0; ii--){
						this.removeClassFn(
							el[ii ][0],el[ii][1])
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
		'time' : function(){
			 
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
			
			
			this.dateToYMD = function( date, withYear, withTime, withFullMonthName, isShortYear, withNotStringDay ){
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
				  
				string = '' + (d <= 9 ? '0' + d : d) + ' ' + m,
				
				withStrDay = ( withNotStringDay ? day +", " : "" );
				      
				
					  
				if( withYear && withTime ){
					
					let strTime = /hh:mm:ss/i.test( withTime ) ? hh+' : '+mm+' : '+ss :
					/mm:ss:ms/i.test( withTime ) ? mm+' : '+ss+' : '+ms :
					/mm:ss/i.test( withTime ) ? mm+' : '+ss : hh+' : '+mm 
					 
					return withStrDay + string + " "+ y +", "+strTime;
					
				}else if( withYear ){
					
					return withStrDay + string + " "+ y;
					
				}else{
					
					return withStrDay + string
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
				
				let diff = Date.parse( endDate ) - Date.parse( startDate ); 
				 
				totalSeconds = Math.round( diff / 1000 ),
				 
				totalMinuts = Math.round( totalSeconds / 60 ),
			 
				totalHours = Math.round( totalMinuts / 60 ),
				
				totalDays = Math.round( totalHours / 24 );
				
				totalWeek = mathType === "floor" ? Math.floor( totalDays / 7 ) : Math.round( totalDays / 7 );
				  
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

				dupArray.slice() // slice makes copy of array before sorting it
				  .sort(function(a,b){
					return a > b;
				  })
				  .reduce(function(a,b){
					if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] means last item in array without removing it (like .pop())
					return a;
				  },[]);
				  
				return dupArray;
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
				let dataBaby = "", 
				stateFirstload = {
					leapSelect : []
				},
				fn = {
					zScoreFn : function( params ){
						
						let value = params.value,
						valueFor =  params.valueFor,
						gender = params.gender,
						indexAge = params.month,
						data =  gender.toLowerCase() === "perempuan" ?
							params.data.girlZscore : params.data.boyZscore,
							
						S2neg = data.p5,
						S1neg = data.p15,
						S0med = data.p50,
						S1pos = data.p85,
						S2pos = data.p95;
						  
						let indexMedian = S0med[ indexAge ],
						 
						indexNegTeirA = value < S2neg[ indexAge ] ? S1neg[ indexAge ] : indexMedian,
						
						indexPosTeirA = value > S2pos[ indexAge ] ? S1pos[ indexAge ] : indexMedian,
						
						indexNegTeirB = value < S2neg[ indexAge ] ? S2neg[ indexAge ] : S1neg[ indexAge ],
						
						indexPosTeirB = value > S2pos[ indexAge ] ? S2pos[ indexAge ] : S1pos[ indexAge ],
						
						standarDevA = value - indexMedian,
						
						posOrNegValue = value > indexMedian ? indexPosTeirA : indexNegTeirA,
						
						standarDevB = value >= indexMedian ? ( indexPosTeirB - posOrNegValue ) : ( posOrNegValue - indexNegTeirB  ),
						
						resultVal = ( standarDevA / standarDevB ).toFixed( 2 ),
						
						resultTemp = "",
						
						resultText = "",
						
						resultColor = "";
						 
 
						switch( valueFor ){
							
							case "wfa" : resultTemp = resultVal < -3 ? "BB Sangat kurang|orange" :
										resultVal >= -3 && resultVal < -2 ? "BB kurang|yellow" : 
											resultVal >= -2 && resultVal <= 1 ? "BB normal|green" : "Resiko BB lebih|yellow";
											
									break;
									
							case "lh" : resultTemp = resultVal < -3 ? "Sangat Pendek|orange" :
										resultVal >= -3 && resultVal < -2 ? "Pendek|yellow" : 
											resultVal >= -2 && resultVal <= 3 ? "Normal|green" : "Tinggi|yellow";
											
									break;				
							
									
							case "bmi" : resultTemp = resultVal < -3 ? "Gizi buruk|orange" :
										resultVal >= -3 && resultVal < -2 ? "Gizi kurang|yellow" : 
											resultVal >= -2 && resultVal <= 1 ? "Gizi baik|green" :
												resultVal > 1 && resultVal <= 2 ? "Beresiko gizi lebih|yellow"  :
													resultVal > 2 && resultVal <= 3 ? "Gizi lebih|orange"  : "Obesitas|orange";
											
											
									break;	
									
							case "hc" : resultTemp = resultVal < -2 ? "Mikrosefali |yellow" :
										resultVal > 2 ? "Makrosefali|yellow" : "Normal|green";
											
											
									break;
						}
						
						resultTemp = resultTemp.split("|");
						
						resultText = resultTemp[0];
						
						resultColor = resultTemp[1];

						 
						return {
							resultVal : resultVal,
							resultText : resultText,
							resultColor : resultColor
						}
						
					}
				},
				stateTimer = {
					remainder : false,
					tracker : false
				},
				remainderTimestampArr = [];
				 
				const scope =  this;
				const localStorage =  window.localStorage;
				const obj = {
					dataStorage :{},
					storage : function( callback ){
  	
						let unWantedItem = function( storage ){
							
							for( let ii in storage ){
								
								let objArray = storage[ii];
								
								if( objArray instanceof  Array ){
								
									objArray.map( function( objData, index ){
										
										if(  ii !== "babiesData" ){
										
											let babyUnRegistered = true;
											
											// check if this objData has own active baby
											
											for( var jj = 0, kk = storage[ 'babiesData' ]; jj < kk.length ; jj++ ){
												 
												if(  kk[jj].id === objData.babyId ){
													
													babyUnRegistered = false;
													
													break;
												   
												}
												
											}  
											//remove bug of undeleted item
											 
													
											if( babyUnRegistered && ii !== "vaccineList"  ){
												
												objArray.splice( index, 1 ); 
											}
										}										
									}) 
								}
							}  
							
						}
	
						obj.cordova.localStorage.get( function( storage ){  	
						     
							dataBaby = {
								id : "sjdud",
								name : "budiman",
								birthdate : "17/8/2018 12.15.46", 
								gender : "male"
							}
							
							//remove bug of undeleted item 
							unWantedItem( storage );
							
				   		 
							//set global baby's data
							storage[ 'babiesData' ].map( function( objBaby ){
								
								if( objBaby.active ){
									
									dataBaby = objBaby
								}
							})
							
							//db structure update if needed
							obj.cordova.localStorage.updateDb();
							 
							//set chart gender

							obj.chart.gender = dataBaby.gender === "Laki Laki" ? "boy" : "girl"
							  
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
						
						//obj.cordova.localStorage.get( function( storage ){ }) 
						 
						switch( params.storageState ){
							 
							case "layoutState" :
							case "afaState" :
							case "lhfaState" :
							case "hcState" :
							case "bmiState" :
							case "wfaState" :
							case "trackerRange" :
							case "trackerState" :
							case "memoState" :
								 
								storage[ params.storageState ][ params.objState ]  = params.value;
								
							break;
						}
						 
						//debug onleh 
						obj.cordova.localStorage.put();	
						
						callback && callback.call( {} );
						
										
					},
					storageCrud : function( getParams, callback ){
						   
						let dbProcessFn = function( params, storage ){
							
							let dataSelected = "";
									
							
							switch( params.dataStorage ){
								
								case "avatar" : 
								  
									if( params.type === "add" ){
											
										storage.avatar.unshift({
											babyId : dataBaby.id,
											base64Img : params.base64Img
										}); 
										 
											
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Mengganti avatar balita",
											icon : "gear-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});   
										 
										break;
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.avatar ){
											 
											if( dataBaby.id === objNoify.babyId ){
												  
												dataSelected = objNoify; 
												
												break;
											}
											
										}  
									}else if( params.type === "update"){
									
							 
										for( let objNoify of storage.avatar ){
											 
											if( dataBaby.id === objNoify.babyId ){
												 
												objNoify.base64Img = params.base64Img;
												  
												break;
											}
											
										} 
									}
									
								case "babiesData" :
									
									if( params.type === "add" ){
										   
										//deactive 
										storage.babiesData.map(function( objData ){ 
											objData.active =  false;
										})
										  
										storage.babiesData.unshift({ 
											id : scope.uniqueString(),
											name : scope.ucFirst( params.name ),
											birthdate : params.birthdate.toLocaleString("id-ID"),
											gender : params.gender,
											relative : params.relative,
											dateStart : params.dateStart.toLocaleString("id-ID"),
											active : true
										}); 
										 
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Menambahkan balita "+ scope.ucFirst( params.name ),
											icon : "gear-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});   
										 
										break;
										
										
									}else if( params.type === "set-active" ){
										   
										//deactive 
										storage.babiesData.map(function( objData ){ 
											objData.active =  false;
										})
											
																			
										for( let objNoify of storage.babiesData ){
											 
											if( objNoify.id === params.id  ){
												
												objNoify.active =  true;
												 
												dataBaby = objNoify;
												
												break;
											} 
										} 	
											
									}else if( params.type === "delete" ){
										
										for( let ii in storage ){
											
											let objArray = storage[ii];
											
											if( objArray instanceof  Array ){
											
												storage[ii] = objArray.filter( function( objData ){
													
													var needDelete = ( ii === "babiesData" && objData.id === params.id || objData.babyId === params.id  )
													
													if( needDelete && ii === "notification" ){
														 
														//corodva register notification
														obj.cordova.notification.cancel({
															id: objData.cordovaId
														}) 
														
													}else if( needDelete && ii === "avatar" ){
														 
														//hapus avatar 
													
														let base64Img = objData.base64Img 
													 
														try {
															//apakah base64Img
															global.atob( base64Img ); 
														
														} catch(e) {
															
															// bukan berarti filauri
	 
															let uriArr = base64Img.split("/"),
															fileName = uriArr[ uriArr.length - 1 ];
															 
															obj.cordova.file.remove({
																path : base64Img,
																fileName : fileName
															})
															
														} 
														
													}else if( needDelete && ii === "memo" ){
														
														//hapus momen file 
														
														if( objData.uri ){
															
															
															objData.uri.forEach(function( objUri ){
																	  
																let uriArr = objUri.split("/"),
																fileName = uriArr[ uriArr.length - 1 ];
																 
																obj.cordova.file.remove({
																	path : objUri,
																	fileName : fileName
																})
																
															})
															
														}
														
														
													}
													
													
													return !needDelete;
												})	
												   
												if( ii === "babiesData" && storage.babiesData[0] ){
													
													storage.babiesData[0].active = true;
													
													dataBaby = storage.babiesData[0];
												}
											}
										}
										 
										//prevent bug error when tab d is active 
										storage.layoutState.activeLayout = "tab-f";	 	
										
									}
									
									break;
								case "afa" :
								
									if( params.type === "add" ){
										  
										storage.afa.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											monthTo : params.monthTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											arm : params.arm
										}); 
										   
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam lingkar lengan bulan "+params.monthTo,
											icon : "measure-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});   
										 
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.afa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-monthto"){
									
							 
										for( let objNoify of storage.afa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												 
												objNoify.monthTo = params.monthTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.arm = params.arm;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.afa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.afa ){
											 
											if( objNoify.id === params.id && dataBaby.id === objNoify.babyId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.afa; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataBaby.id === jj[ii].babyId ){
												
												storage.afa.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
								
								case "lhfa" :
								
									if( params.type === "add" ){
										  
										storage.lhfa.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											monthTo : params.monthTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											height : params.height
										}); 
										    
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam tinggi badan bulan "+params.monthTo,
											icon : "height-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});      
										  
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.lhfa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-monthto"){
									
							 
										for( let objNoify of storage.lhfa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												 
												objNoify.monthTo = params.monthTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.height = params.height;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.lhfa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.lhfa ){
											 
											if( objNoify.id === params.id && dataBaby.id === objNoify.babyId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.lhfa; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataBaby.id === jj[ii].babyId ){
												
												storage.lhfa.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									break;
								
								case "hc" :
								
									if( params.type === "add" ){
										  
										storage.hc.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											monthTo : params.monthTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											hc : params.hc
										}); 
										    
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam lingkar kepala bulan "+params.monthTo,
											icon : "ruler-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});      
										   
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.hc ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-monthto"){
									
							 
										for( let objNoify of storage.hc ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												 
												objNoify.monthTo = params.monthTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.hc = params.hc;
												  
												break;
											}
											
										} 
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.hc ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if(params.type === "select"){
										
										for( let objNoify of storage.hc ){
											 
											if( objNoify.id === params.id && dataBaby.id === objNoify.babyId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.hc; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataBaby.id === jj[ii].babyId ){
												
												storage.hc.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									break;
									
								case "bmi" :
								
									if( params.type === "add"){
										  
										storage.bmi.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											monthTo : params.monthTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											weight : params.weight,
											height : params.height,
											bmi : params.bmi
										}); 
										    
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam BMI bulan "+params.monthTo,
											icon : "scale-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});      
										  
									}else if( params.type === "update-monthto"){
									 
										for( let objNoify of storage.bmi ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												 
												objNoify.monthTo = params.monthTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.weight = params.weight;
												objNoify.height = params.height;
												objNoify.bmi = params.bmi;
												  
												break;
											}
											
										} 
									}else if(params.type === "select"){
										
										for( let objNoify of storage.bmi ){
											 
											if( objNoify.id === params.id && dataBaby.id === objNoify.babyId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "select-monthto"){
									
										
										for( let objNoify of storage.bmi ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.bmi; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataBaby.id === jj[ii].babyId ){
												
												storage.bmi.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									break;
									
								case "wfa" :
								 
									if( params.type === "add"){
										  
										storage.wfa.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											monthTo : params.monthTo,
											dateSelect : params.dateSelect.toLocaleString("id-ID"),
											dateStart : params.dateStart.toLocaleString("id-ID"),
											weight : params.weight
										});
										 
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam berat badan  bulan "+params.monthTo,
											icon : "weight-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});      
										  
									}else if( params.type === "select-monthto"){
									 
										for( let objNoify of storage.wfa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												break;
											}
											
										} 
										
									}else if( params.type === "update-monthto"){
									
							 
										for( let objNoify of storage.wfa ){
											 
											if( objNoify.monthTo === params.monthTo && dataBaby.id === objNoify.babyId ){
												 
												objNoify.monthTo = params.monthTo;
												objNoify.dateSelect = params.dateSelect.toLocaleString("id-ID");
												objNoify.dateStart = params.dateStart.toLocaleString("id-ID");
												objNoify.weight = params.weight;
												  
												break;
											}
											
										} 
									}else if(params.type === "select"){
										
										for( let objNoify of storage.wfa ){
											 
											if( objNoify.id === params.id && dataBaby.id === objNoify.babyId ){
												  
												dataSelected = objNoify; 
												break;
											}
											
										}  
									}else if( params.type === "select-all"){
										
										dataSelected = storage.wfa;
									
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.wfa; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataBaby.id === jj[ii].babyId ){
												
												storage.wfa.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
									
									
									break;
									
								case "tracker-category" : 
								 
									if( params.type === "add" ){
										   
										storage.trackerCategory[ params.target ].unshift({
											objectId : dataBaby.id,
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
											  
											if( jj[ii].id === params.id ){ //  ( dataBaby.id === jj[ii].objectId || jj[ii].objectId === "sjdud" )  ){
	  
												jj[ii].latestDate =  params.latestDate; 
												
												break;
											}
										} 
									
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.trackerCategory[ params.target ]; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id ){ // && ( jj[ii].objectId === "sjdud" || dataBaby.id === jj[ii].objectId ) ){
												 
												jj.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
								 
									break;
								 
								case "screening" : 
								 
									if( params.type === "update" ){
										
										//check screening is reg or not 
										let isReg = true;
										
										storage.screening.map(function( objScreen ){ 
											
											if( objScreen.babyId === dataBaby.id ){
												 
												isReg =  false; 
											}
										});
										
										if( isReg ){
											//register
											storage["screening"].unshift({ 
												babyId : dataBaby.id,
												storage : {}
											}); 
										}
										
										//store data
										
										let previousBalance = 0;
										
										storage.screening.map(function( objScreen ){ 
											
											if( objScreen.babyId === dataBaby.id ){
												   
												let screenType = objScreen.storage[ params.screenType ],
												
												newRecord = {};
												    
												newRecord.data = params.data
												
												newRecord.result = params.result

												newRecord.dateStart = params.dateStart
													
												newRecord.title = params.title
													
												newRecord.age = params.age
													
												newRecord.ageStr = params.ageStr
													
												if( !screenType ){
													
													objScreen.storage[  params.screenType ] = [ newRecord ]
													
												}else{
												
													objScreen.storage[  params.screenType ].unshift( newRecord );
													
													/*
													while( objScreen.storage[ params.screenType ].length > 10 ){
										
														objScreen.storage[  params.screenType ].pop()
														
													}
													*/
												}
												
											}
											 
											 
										});
										 
										
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Skrining "+ params.title +" "+ params.age +" "+" Umr "+params.ageStr,
											icon : "questinnare-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});   
									}else if( params.type === "delete" ){
										 
										storage.screening.map(function( objScreen ){ 
											
											if( objScreen.babyId === dataBaby.id ){
												  
												let screenType = objScreen.storage[ params.screenType ];
												 
												objScreen.storage[ params.screenType ].splice( params.index, 1 ); 
												  
												  
											}
										});
									}
									
									break;
								
								case "vaccineReg" : 
								 
									if( params.type === "add" ){
										  
										storage.vaccineReg.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											name : params.name,
											detail : params.detail,
											vaccineDate : params.vaccineDate,
											selectType : params.selectType,
											notification : params.notification,
											dateStart : params.dateStart
										}); 										 
										     
										
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam imunisasi, untuk vaksin "+ params.name ,
											icon : "questinnare-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});  
											
									}else if( params.type === "select-title" ){
										 	 
										for( let objNoify of storage.vaccineReg ){
											   
											if( objNoify.name.toLowerCase() === params.name.toLowerCase()  ){
												 
												dataSelected = objNoify;
												 
												break;
											} 
										} 	
										
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.vaccineReg; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id ){ // && ( jj[ii].objectId === "sjdud" || dataBaby.id === jj[ii].objectId ) ){
												 
												jj.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
								 
									break;
								
								case "vaccineList" : 
								 
									if( params.type === "add" ){
										  
										storage.vaccineList.unshift({
											objectId : dataBaby.id,
											id : scope.uniqueString(),
											name : params.name
										}); 										 
										    
									}else if( params.type === "select-title" ){
										 	 
										for( let objNoify of storage.vaccineList ){
											   
											if( objNoify.name.toLowerCase() === params.name.toLowerCase()  ){
												 
												dataSelected = objNoify;
												 
												break;
											} 
										} 	
										
									}else if( params.type === "delete"){
										  
										for (let ii = 0, jj = storage.vaccineList; ii < jj.length; ii++ ) {
											  
											if( jj[ii].id === params.id ){ // && ( jj[ii].objectId === "sjdud" || dataBaby.id === jj[ii].objectId ) ){
												 
												jj.splice( ii, 1 ); 
												 
												break;
											}
										} 
									}
								 
									break;
																
									
								case "tracker" :
									 
									if( params.type === "add"){
									 
										storage.tracker.unshift({
											babyId : dataBaby.id,
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
										 
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Rekam aktifitas, "+params.activitySelect,
											icon : "mother-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										});   
										 
									}else if( params.type === "update"){
	 
										let extendMilli = params.milliliter >= 0 ? params.milliliter : '';
										
										for (let ii = 0, jj = storage.tracker; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  ){ //&& dataBaby.id === jj[ii].babyId execption pompa asi
	 
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
											
											if( jj[ii].id === params.id ){ // && dataBaby.id === jj[ii].babyId 
												
												storage.tracker.splice( ii, 1 ); 
												
												break;
											}
										} 
									}
									
									break;
								
								case"memo" :
								
									if( params.type === "add"){
										
										storage.memo.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											title : params.title,
											text : params.text,
											uri : params.uri, // array
											label : params.label, // array
											dateStart : params.dateStart
										})
										 
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Membuat momen",
											icon : "memo-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										}); 
										
									}else if( params.type === "select-all"){
										
										dataSelected = storage.memo;
									
									}else if( params.type === "delete"){
										 
										for (let ii = 0, jj = storage.memo; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id  && dataBaby.id === jj[ii].babyId ){
												
												storage.memo.splice( ii, 1 ); 
												
												break;
											}
										} 
									}
									
									break;
									
								case "notification" :
								
									if( params.type === "add"){
										
										storage.notification.unshift({
											babyId : dataBaby.id,
											id : scope.uniqueString(),
											cordovaId : scope.random( 99999,10000 ),
											reminder : params.reminder,
											timer : params.timer,
											stringDate : params.stringDate,
											labelText : params.labelText,
											dateStart : params.dateStart,
											dateEnd : params.dateEnd,
											loop : params.loop
										})
										 
										dataSelected = storage.notification[0];
										 
										storage.resume.unshift({
											babyId : dataBaby.id,
											text : "Membuat notifikasi",
											icon : "alarm-icon",
											date : ( new Date() ).toLocaleString("id-ID") 
										}); 
										
									}else if( params.type === "select"){
										
										for( let objNoify of storage.notification ){
											 
											if( objNoify.id === params.id  && dataBaby.id === objNoify.babyId ){
												
												dataSelected = objNoify;
												
												break;
											}
											
										} 
									}else if( params.type === "update"){
	  
										for (let ii = 0, jj = storage.notification; ii < jj.length; ii++ ) {
											
											if( jj[ii].id === params.id && dataBaby.id === jj[ii].babyId  ){
	  
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
							   
							//obj.cordova.localStorage.get( function( storage ){  })
							   
							let dataSelected = filterDbMultiple( obj.dataStorage );
							 
							scope.delayFire(function(){ // prevent save multiple times in row
								 
								//save 
								obj.cordova.localStorage.put(function(){
									
									getParams.type === "add" ? obj.main.resume() : "";
									
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
							return objData.babyId === dataBaby.id
						})
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
							
							var objDate = new Date(), // obj.chart.dateBaby().birthDateStart,
							year = objDate.getFullYear() - 4,
							month = objDate.getMonth() + 1,
							numberDays = new Date( year, month, 0 ).getDate(); 
						} 
						
						if( params && params.year || !params ){
							
							let registerPlugin = [  ".datepicker-vaccine", ".datepicker-remainder", ".datepicker-baby-new",".datepicker-wfa",".datepicker-bmi",".datepicker-hc",".datepicker-lhfa",".datepicker-afa" ],
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
							
							let registerPlugin = [  ".datepicker-vaccine", ".datepicker-remainder",".datepicker-baby-new",".datepicker-wfa",".datepicker-bmi",".datepicker-hc",".datepicker-lhfa",".datepicker-afa" ],
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
							
							let registerPlugin = [  ".datepicker-vaccine", ".datepicker-remainder", ".datepicker-baby-new",".datepicker-wfa",".datepicker-bmi",".datepicker-hc",".datepicker-lhfa",".datepicker-afa" ],
							stringEl = " .days .swiper-wrapper";
							 
							registerPlugin.forEach(function( objElement ){
								
								let parent = scope.qs( objElement + stringEl ),
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
							
							if( !/modal-banner/i.test( objModal.className ) ){
											
								scope.removeClass( objModal, "open" );
								scope.addClass( objModal, "hidden" )
								
							}
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
					dropdown : {
						container : "",
						createDropdown : function( params ){
							
							let elementBool = /input|textarea/i.test( params.attach.nodeName ), 
							elementInput = elementBool ? params.attach : params.attach.querySelector("input"),
							clearDropdownMenu = function(){

								//clear semua dropdown sebelum menambah dropdown baru
								//@function dibutukan ketika keyup search
								let dropdownEls = scope.slice( params.container.querySelectorAll(".dropdown-menu") )
															
								dropdownEls.forEach(function( el ){
									
									el.parentNode.removeChild(el);
									 
								})
								
							}(),
							 
							attachEl = params.attach,
							elBound = elementInput.getBoundingClientRect();
							parent = params.container,
							dummy = document.createElement("div"),
							fragment = scope.stringToHtml5Template(
								'<ul class="list-inline dropdown-menu">'+
								function(){
									
									let string = "";
									
									params.items.forEach(function( item, index ){
										
										string += "<li label='"+ params.label[index] +"' >"+ item +"</li>"
									})
									
									return string
									
								}() +
								'</ul>'
							);
							
							
							//stored temporary
							dummy.appendChild( fragment );
							
							//get fragment
							fragment = scope.getFirstChild( dummy );
							  
							//reposition 
							fragment.setAttribute("style",
								'top:'+elBound.bottom+'px;'+
								'width:'+elBound.width+'px;'+
								'left:'+elBound.left+'px;'
							)
							
							parent.appendChild( fragment );
							
							
							/*bind li to click*/
							
							scope.slice( fragment.querySelectorAll("li") ).forEach(function( li, index ){
								 
								scope.attachListener( li, 'click', function(){
									
									elementInput.value = params.items[ index ];
									
									elementInput.setAttribute("label", li.getAttribute("label") );
									
									scope.addClass( fragment, "hidden" )
									
									params.callback && params.callback( li.getAttribute("label")  );
								})
	  
							})
						},
						init : function(){
							 
							let parentModal = scope.qs("modal");
							 
							scope.attachListener( parentModal, scope.CursorStartEvent, function(e){ 
									 
								let dropdownEls = scope.slice( parentModal.querySelectorAll(".dropdown-menu") );	 
									 
								dropdownEls.forEach(function( dropdown ){
									
									let bound = dropdown.getBoundingClientRect(),
									isVisble = bound.height;
									
									
									if( isVisble ){
										 
										var target = (e && e.target) || (event && event.srcElement),
										needHide = true;

										while ( target.parentNode ) {

											if (target ==  dropdown ) {
												needHide = false;
												break;
											}
											target = target.parentNode;
										}
										 
										if( needHide ){
											
											scope.addClass( dropdown,  "hidden" );
											
											dropdownEls.forEach(function( dropdown ){
												
												dropdown.parentNode.removeChild( dropdown );
												
											})
											
										}
									}
								})	
							 
							});
							
							
						},
						bindToKeyPress : function( params ){
							
							let self = this,
							modal = params.modal,
							 
							elementBool = /input|textarea/i.test( params.attach.nodeName );
							
							//dibutukan untuk penggunaan search keyup
							if( params.hidden === false ){
							//dropdown dinamis
							
								 self.createDropdown( params )
								
							}else{
							
							//dropdown statis
							
								scope.attachListener(  params.attach, 'click', function(){
									
									 self.createDropdown( params )
									
								})
							
							}
							
						}
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
											
											if( packageName.toLowerCase() === packageApp.toLowerCase() 
												|| packageName === null 
												|| packageName === ""
												|| packageName === "undefined" ){
												
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
										  
									 }else if( !/hidden/i.test( nestedModal.className ) && obj.dataStorage.babiesData.length ){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											previous : true
										});
										 
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
									 
								})	 
									 
							}
						},
						localStorage :{
							appName : "KMS Bunda dan Balita",
							id : "com.owlpictureid.kms",
							fileName : "kms-bunda-balita-database.json",
							generateDb : function(){
								/*	*/
								obj.dataStorage = {};
								
								obj.dataStorage.babiesData = [];
								
								obj.dataStorage.notification = []; 
								
								obj.dataStorage.memo = [];
							 
								obj.dataStorage.tracker = [];
								 
								obj.dataStorage.wfa = []; //weight for age 
								
								obj.dataStorage.bmi = []; //body mass index for age 
								
								obj.dataStorage.hc = []; //head circumference
								
								obj.dataStorage.lhfa = []; //length height for height
								
								obj.dataStorage.afa = []; //arm circumference
								
									 
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
							
								//defined bmiState object 
								obj.dataStorage.bmiState = {}  
							
								//defined hcState object 
								obj.dataStorage.hcState = {}  
							
								//defined lhfaState object 
								obj.dataStorage.lhfaState = {}  
							
								//defined afaState object 
								obj.dataStorage.afaState = {}  
						 
								//defined layoutState object 
								obj.dataStorage.layoutState = {
									activeLayout : "tab-f",
									activeSwiperChart : {
										title : "Berat Ideal Balita",
										index : 0
									}
								}  
							  
							},
							updateDb : function(){
								  
								// update layout 
								if( !obj.dataStorage.layoutState.trackerCategorySwiper ){
									obj.dataStorage.layoutState.trackerCategorySwiper = {
										title : "Aktifitas Balita",
										index : 0,
										target : "activity"
									}
								} 

								if( !obj.dataStorage.layoutState.polarSwiperChart ){
									obj.dataStorage.layoutState.polarSwiperChart = {
										index : 0
									}
								} 
								   
								if( !obj.dataStorage.layoutState.headerTabActivity ){
									obj.dataStorage.layoutState.headerTabActivity = 0
								} 
			    
								if( !obj.dataStorage.trackerCategory ){
									
									obj.dataStorage.trackerCategory = {}
									
									obj.dataStorage.trackerCategory.pump = [{
										id : "kfhbn",
										objectId : "sjdud",
										latestDate : "",
										name : "Pompa ASI Kiri",
										unit : "Mililiter",
										unitShort : "Ml",
										isRunning : true,
										isUnit : true,
									},
									{
										id : "mnpak",
										objectId : "sjdud",
										latestDate : "",
										name : "Pompa ASI Kanan",
										unit : "Mililiter",
										unitShort : "Ml",
										isRunning : true,
										isUnit : true
									},
									{
										id : "kdoon",
										objectId : "sjdud",
										latestDate : "",
										name : "Pompa ASI Keduanya",
										unit : "Mililiter",
										unitShort : "Ml",
										isRunning : true,
										isUnit : true
									}]  
									 
									obj.dataStorage.trackerCategory.meal = [
									{
										id : "ymffd",
										objectId : "sjdud",
										latestDate : "",
										name : "MPASI 8+m Bubur labu",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : true
									},
									{
										id : "pinof",
										objectId : "sjdud",
										latestDate : "",
										name : "ASI Keduanya",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "ofjns",
										objectId : "sjdud",
										latestDate : "",
										name : "ASI Kanan",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "udvaib",
										objectId : "sjdud",
										latestDate : "",
										name : "ASI Kiri",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									}]
									
									 
									obj.dataStorage.trackerCategory.activity = [{
										id : "nksnb",
										objectId : "sjdud",
										latestDate : "",
										name : "Balita Tidur",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									},
									{
										id : "pkspjv",
										objectId : "sjdud",
										latestDate : "",
										name : "Balita Bermain",
										unit : "",
										unitShort : "",
										isRunning : true,
										isUnit : false
									}]
									
									 
									obj.dataStorage.trackerCategory.diaper = [{
										id : "fxcec",
										objectId : "sjdud",
										latestDate : "",
										name : "Balita Pipis",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "tcdgg",
										objectId : "sjdud",
										latestDate : "",
										name : "Balita Pup",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "ikdfo",
										objectId : "sjdud",
										latestDate : "",
										name : "Balita Pup dan Pipis",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									}]
									
									 
									obj.dataStorage.trackerCategory.medical = [{
										id : "fxcec",
										objectId : "sjdud",
										latestDate : "",
										name : "Cek kesehatan",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									},
									{
										id : "tcdgg",
										objectId : "sjdud",
										latestDate : "",
										name : "Suhu Tubuh",
										unit : "Celsius",
										unitShort : "C",
										isRunning : false,
										isUnit : true
									},
									{
										id : "tcdgg",
										objectId : "sjdud",
										latestDate : "",
										name : "Suplemen Penambah Makan",
										unit : "",
										unitShort : "",
										isRunning : false,
										isUnit : false
									}] 
									 
									 
									obj.dataStorage.trackerCategory.other = []
								}
								 
								if( !obj.dataStorage.rate ){
									
									obj.dataStorage.rate = {
										time : ( new Date ).toLocaleString("id-ID"),
										record : 0,
										state : false
									}
									
								}
							 
								if( !obj.dataStorage.vaccinePPI ){
									
									obj.dataStorage.vaccinePPI = {
										grA : {
											name : "Hepatitis B",
											detail : "Imunisasi terhadap virus menular hepatitis B (HBV)",
											link : "https://id.wikipedia.org/wiki/Vaksin_hepatitis_B",
											list : {
												vcA : {
													name : "Hepatitis B-0",
													age : 0,
													type : "Dasar"
												},
												vcB : {
													name : "Hepatitis B-2",
													age : 2,
													type : "Dasar"
												},
												vcC : {
													name : "Hepatitis B-3",
													age : 3,
													type : "Dasar"
												},
												vcD : {
													name : "Hepatitis B-4",
													age : 4,
													type : "Dasar"
												}
											}
										},
										grB : {
											name : "POLIO",
											detail : "Imunisasi terhadap virus polio penyebab poliomielitis",
											link : "https://id.wikipedia.org/wiki/Vaksin_polio",
											list : {
												vcB : {
													name : "POLIO-1",
													age : 1,
													type : "Dasar"
												},
												vcC : {
													name : "POLIO-2",
													age : 2,
													type : "Dasar"
												},
												vcD : {
													name : "POLIO-3",
													age : 3,
													type : "Dasar"
												},
												vcE : {
													name : "POLIO-4",
													age : 4,
													type : "Dasar"
												}
											}
										},
										grC : {
											name : "BCG",
											detail : "imunisasi terhadap virus tuberkulosis ",
											link : "https://en.wikipedia.org/wiki/BCG_vaccine",
											list : {
												vcA : {
													name : "BCG",
													age : 1,
													type : "Dasar"
												}
											}
										},
										grD : {
											name : "DPT",
											detail : "Imunisasi terhadap Difteri, Petusis, dan Tetanus",
											link : "https://en.wikipedia.org/wiki/Diphtheria_vaccine",
											list : {
												vcA : {
													name : "DPT-1",
													age : 2,
													type : "Dasar"
												},
												vcB : {
													name : "DPT-2",
													age : 3,
													type : "Dasar"
												},
												vcC : {
													name : "DPT-3",
													age : 4,
													type : "Dasar"
												},
												vcD : {
													name : "DPT-4",
													age : 18,
													type : "Lanjutan"
												}
											}
										},
										grE : {
											name : "Hib",
											detail : "Imunisasi terhadap meningitis, pneumonia, and epiglottitis.",
											link : "https://en.wikipedia.org/wiki/Hib_vaccine",
											list : {
												vcA : {
													name : "Hib-1",
													age : 2,
													type : "Dasar"
												},
												vcB : {
													name : "Hib-2",
													age : 3,
													type : "Dasar"
												},
												vcC : {
													name : "Hib-3",
													age : 4,
													type : "Dasar"
												},
												vcD : {
													name : "Hib-4",
													age : 18,
													type : "Lanjutan"
												}
											}
										},
										grF : {
											name : "IPV",
											detail : "Imunisasi terhadap penyakit lumpuh layu atau polio",
											link : "https://en.wikipedia.org/wiki/Polio_vaccine",
											list : {
												vcA : {
													name : "IPV",
													age : 4,
													type : "Dasar"
												}
											}
										},
										grG : {
											name : "Campak",
											detail : "Imunisasi terhadap virus Campak",
											link : "https://id.wikipedia.org/wiki/Vaksin_campak",
											list : {
												vcA : {
													name : "Campak-1",
													age : 9,
													type : "Dasar"
												},
												vcB : {
													name : "Campak-2",
													age : 18,
													type : "Lanjutan"
												}
											}
										}
									}
								}
								
								 
								if( !obj.dataStorage.layoutState.toggleVaccine ){
									obj.dataStorage.layoutState.toggleVaccine = "idai"
								} 
			
								if( !obj.dataStorage.layoutState.resumeMeasurement ){
									obj.dataStorage.layoutState.resumeMeasurement = 0
								}  
								  
								if( !obj.dataStorage.layoutState.headerVaccinve ){
									obj.dataStorage.layoutState.headerVaccinve = 0
								} 
			   
								if( !obj.dataStorage.layoutState.vaccinveOrder ){
									obj.dataStorage.layoutState.vaccinveOrder = "prepend";
								} 
										
								if( !obj.dataStorage.layoutState.activeColor ){
									obj.dataStorage.layoutState.activeColor = "#aba3a3 ";
								}
									
								if( !obj.dataStorage.layoutState.badgeHeader ){
									obj.dataStorage.layoutState.badgeHeader = {
										title : "kms",
										init : false
									};
								}
 
								if( !obj.dataStorage.layoutState.leapActive ){
									obj.dataStorage.layoutState.leapActive = true
								}
								
								if( !obj.dataStorage.layoutState.leapSwitch ){
									obj.dataStorage.layoutState.leapSwitch = "month";
								}
								
								if( !obj.dataStorage.layoutState.wfaSwitch ){
									obj.dataStorage.layoutState.wfaSwitch = 0;
								}

								if( !obj.dataStorage.layoutState.bmiSwitch ){
									obj.dataStorage.layoutState.bmiSwitch = 0;
								}

								if( !obj.dataStorage.layoutState.hcSwitch ){
									obj.dataStorage.layoutState.hcSwitch = 0;
								}

								if( !obj.dataStorage.layoutState.lhSwitch ){
									obj.dataStorage.layoutState.lhSwitch = 0;
								}

								if( !obj.dataStorage.layoutState.armSwitch ){
									obj.dataStorage.layoutState.armSwitch = 0;
								}
								
								//delete obj.dataStorage.screening
								
								if( !obj.dataStorage.screening ){
									
									obj.dataStorage.screening = []
									
								}
								 
								//delete obj.dataStorage.vaccineReg
			 
								if( !obj.dataStorage.vaccineReg ){
									
									obj.dataStorage.vaccineReg = []
									
								}
								 
								if( !obj.dataStorage.vaccineList ){
									
									obj.dataStorage.vaccineList = [{
										name : "Hepatitis B",
										id : "ikkdofe"
									},
									{
										name : "POLIO",
										id : "kdohwnfi"
									},
									{
										name : "BCG",
										id : "mbkfjdug"
									},
									{
										name : "DPT",
										id : "nbsoirjc"
									},
									{
										name : "Hib",
										id : "5fdrur0s"
									},
									{
										name : "PCV",
										id : "nkhwufon1"
									},
									{
										name : "Rotavirus",
										id : "msbiwhfks"
									},
									{
										name : "Influenza",
										id : "mmsborjw"
									},
									{
										name : "Campak",
										id : "dewhe3fw"
									},
									{
										name : "MMR",
										id : "nt34yfry"
									},
									{
										name : "Tifoid",
										id : "gjtrdxu6"
									},
									{
										name : "Hepatitis A",
										id : "mnsftyr4e"
									},
									{
										name : "Varisela",
										id : "nmbfgfhse"
									},
									{
										name : "Japanese Encephalitis",
										id : "sdlmiwdx"
									}]
									
								}
								
								if( !obj.dataStorage.vaccine ){
									
									obj.dataStorage.vaccine = {
										grA : {
											name : "Hepatitis B",
											detail : "Imunisasi terhadap virus menular hepatitis B (HBV)",
											link : "https://id.wikipedia.org/wiki/Vaksin_hepatitis_B",
											list : {
												vcA : {
													name : "Hepatitis B-1",
													age : 0,
													type : "optimal"
												},
												vcB : {
													name : "Hepatitis B-2",
													age : 2,
													type : "optimal"
												},
												vcC : {
													name : "Hepatitis B-3",
													age : 3,
													type : "optimal"
												},
												vcD : {
													name : "Hepatitis B-4",
													age : 4,
													type : "optimal"
												}
											}
										},
										grB : {
											name : "POLIO",
											detail : "Imunisasi terhadap virus polio penyebab poliomielitis",
											link : "https://id.wikipedia.org/wiki/Vaksin_polio",
											list : {
												vcA : {
													name : "POLIO-0",
													age : [0,1],
													type : "optimal"
												},
												vcB : {
													name : "POLIO-1",
													age : 2,
													type : "optimal"
												},
												vcC : {
													name : "POLIO-2",
													age : 3,
													type : "optimal"
												},
												vcD : {
													name : "POLIO-3",
													age : 4,
													type : "optimal"
												},
												vcE : {
													name : "POLIO-4",
													age : 18,
													type : "booster"
												}
											}
										},
										grC : {
											name : "BCG",
											detail : "imunisasi terhadap virus tuberkulosis ",
											link : "https://en.wikipedia.org/wiki/BCG_vaccine",
											list : {
												vcA : {
													name : "BCG",
													age : [0,2],
													type : "optimal"
												}
											}
										},
										grD : {
											name : "DPT",
											detail : "Imunisasi terhadap Difteri, Petusis, dan Tetanus",
											link : "https://en.wikipedia.org/wiki/Diphtheria_vaccine",
											list : {
												vcA : {
													name : "DPT-1",
													age : 2,
													type : "optimal"
												},
												vcB : {
													name : "DPT-2",
													age : 3,
													type : "optimal"
												},
												vcC : {
													name : "DPT-3",
													age : 4,
													type : "optimal"
												},
												vcD : {
													name : "DPT-4",
													age : 18,
													type : "booster"
												},
												vcE : {
													name : "DPT-5",
													age : 60,
													type : "booster"
												}
											}
										},
										grE : {
											name : "Hib",
											detail : "Imunisasi terhadap meningitis, pneumonia, and epiglottitis.",
											link : "https://en.wikipedia.org/wiki/Hib_vaccine",
											list : {
												vcA : {
													name : "Hib-1",
													age : 2,
													type : "optimal"
												},
												vcB : {
													name : "Hib-2",
													age : 3,
													type : "optimal"
												},
												vcC : {
													name : "Hib-3",
													age : 4,
													type : "optimal"
												},
												vcD : {
													name : "Hib-4",
													age : [15,18],
													type : "booster"
												}
											}
										},
										grF : {
											name : "PCV",
											detail : "imunisasi terhadap penyakit pneumonia, meningitis, dan sepsis",
											link : "https://en.wikipedia.org/wiki/Pneumococcal_vaccine",
											list : {
												vcA : {
													name : "PCV-1",
													age : 2,
													type : "optimal"
												},
												vcB : {
													name : "PCV-2",
													age : 4,
													type : "optimal"
												},
												vcC : {
													name : "PCV-3",
													age : 6,
													type : "optimal"
												},
												vcD : {
													name : "PCV-4",
													age : [12,15],
													type : "booster"
												}
											}
										},
										grG : {
											name : "Rotavirus",
											detail : "imunisasi terhadap virus rotavirus penyebab diare pada anak.",
											link : "https://en.wikipedia.org/wiki/Rotavirus_vaccine",
											list : {
												vcA : {
													name : "Rotavirus-1",
													age : 2,
													type : "optimal"
												},
												vcB : {
													name : "Rotavirus-2",
													age : 4,
													type : "optimal"
												},
												vcC : {
													name : "Rotavirus-3",
													age : 6,
													type : "optimal"
												}
											}
										},
										grH : {
											name : "Influenza",
											detail : "Imunisasi terhadap virus Influenza",
											link : "https://en.wikipedia.org/wiki/Influenza_vaccine",
											list : {
												vcA : {
													name : "Influenza-1",
													age : 6,
													type : "optimal"
												},
												vcB : {
													name : "Influenza-2",
													age : 18,
													type : "optimal"
												},
												vcC : {
													name : "Influenza-2",
													age : 30,
													type : "optimal"
												},
												vcD : {
													name : "Influenza-3",
													age : 42,
													type : "optimal"
												},
												vcE : {
													name : "Influenza-4",
													age : 54,
													type : "optimal"
												}
											}
										},
										grI : {
											name : "Campak",
											detail : "Imunisasi terhadap virus Campak",
											link : "https://id.wikipedia.org/wiki/Vaksin_campak",
											list : {
												vcA : {
													name : "Campak-1",
													age : 9,
													type : "optimal"
												},
												vcB : {
													name : "Campak-2",
													age : 18,
													type : "booster"
												}
											}
										},
										grJ : {
											name : "MMR",
											detail : "Imunisasi terhadap virus measles, mumps, and rubella",
											link : "https://en.wikipedia.org/wiki/MMR_vaccine",
											list : {
												vcA : {
													name : "MMR-1",
													age : 15,
													type : "optimal"
												},
												vcB : {
													name : "MMR-2",
													age : 60,
													type : "booster"
												}
											}
										},
										grK : {
											name : "Tifoid",
											detail : "Imunisasi terhadap penyakit demam tifoid",
											link : "https://id.wikipedia.org/wiki/Vaksin_tifoid",
											list : {
												vcA : {
													name : "Tifoid-1",
													age : 24,
													type : "optimal"
												},
												vcB : {
													name : "Tifoid-2",
													age : 60,
													type : "optimal"
												}
											}
										},
										grL : {
											name : "Hepatitis A",
											detail : "Imunisasi terhadap penyakit hepatitis A",
											link : "https://en.wikipedia.org/wiki/Hepatitis_A_vaccine",
											list : {
												vcA : {
													name : "Hepatitis A-1",
													age : 24,
													type : "optimal"
												},
												vcB : {
													name : "Hepatitis A-2",
													age : 30,
													type : "optimal"
												},
												vcC : {
													name : "Hepatitis A-3",
													age : 36,
													type : "optimal"
												},
												vcD : {
													name : "Hepatitis A-4",
													age : 42,
													type : "optimal"
												},
												vcE : {
													name : "Hepatitis A-5",
													age : 48,
													type : "optimal"
												},
												vcF : {
													name : "Hepatitis A-6",
													age : 54,
													type : "optimal"
												},
												vcG : {
													name : "Hepatitis A-7",
													age : 60,
													type : "optimal"
												}
											}
										},
										
										grM : {
											name : "Varisela",
											detail : "Imunisasi terhadap penyebab penyakit virus cacar",
											link : "https://en.wikipedia.org/wiki/Varicella_vaccine",
											list : {
												vcA : {
													name : "Varisela-1",
													age : [12,60],
													type : "optimal"
												}
											}
										},
										
										grN : {
											name : "Japanese Encephalitis",
											detail : "Imunisasi radang otak oleh virus Japanese Encephalitis",
											link : "https://en.wikipedia.org/wiki/Japanese_encephalitis_vaccine",
											list : {
												vcA : {
													name : "JE-1",
													age : 12,
													type : "endemis"
												},
												vcB : {
													name : "JE-2",
													age : [24,36],
													type : "endemis"
												}
											}
										},
									}
									 
								}
							 
								if( !obj.dataStorage.avatar ){
									
									obj.dataStorage.avatar = []
									
								}
								 
								//batasi resume kurang dari 35 saja
								 
								if( obj.dataStorage.resume ){
									
									while( obj.dataStorage.resume.length > 35 ){
										
										obj.dataStorage.resume.pop()
										
									}
								
								}
 			
								
								if( !obj.dataStorage.resume ){
									
									obj.dataStorage.resume = []
									
								}
								
								
								//konversi skrining lama ke format baru
								if( obj.dataStorage.screening ){ 
									
									obj.dataStorage.screening.forEach(function( objScreen ){
										 
										if( !objScreen.oldScreen ){
											
											
											for( let ii in objScreen.storage ){
												
												let temp = {};
												
												for( let jj in objScreen.storage[ii] ){
													
													//duplikasi 
													
													if( objScreen.storage[ii] instanceof Array ){
														
														temp = objScreen.storage[ii][jj];
														
														break;
													}
														
													
													temp[ jj ] = objScreen.storage[ii][jj];
													
													
												}
												
												//replace obj into array
												objScreen.storage[ii] =  [ temp ] 
												 												
												/*
												[{
													data : [ 0, "","","","","","","","","" ],
													result : "",
													dateStart : new Date().toLocaleString("id-ID"),
													title : "KPSP",
													age :"03",
													ageStr :"2 Bln"
												}] //[ temp ] 
												*/
											} 													
											  
											objScreen.oldScreen = true;
										
										}
										
									})
									
								}
								
								
								
								if( !obj.dataStorage.IAP ){
									obj.dataStorage.IAP = {
										active : {},
										history : []
									}
								} 
								
								 
								if( !obj.dataStorage.appReg ){
									obj.dataStorage.appReg = {
										register : ( new Date() ).toLocaleString("id-ID"),
										update : ( new Date() ).toLocaleString("id-ID"),
										ver : ""
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
										 
										callback && callback.call( {}, true )
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
								dirEntry.getDirectory('KMSBalita', { create: true }, function (dirEntry) {
									
									dirEntry.getDirectory('database', { create: true }, function (subDirEntry) {

										self.createFile( subDirEntry, fileName, callback );

									});
								}); 
							},
							checkFileIsExist : function( callback ){
								
								let self = this,
								path = cordova.file.externalRootDirectory+'KMSBalita'+'/database/'+ self.fileName; 
								
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

									localStorage.setItem( 'dataStorage', scope.JSONstringfy( obj.dataStorage ) ); 
									
									callback && callback();
									  
								}
								 
							},
							get : function( callback ){
								
								let self = this;
								 
								if( global.cordova ){
										
									self.checkFileIsExist(function(){	
										 
										global.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, 
												
											//directories exists
											function ( dirEntry ) {
											 
												dirEntry.getDirectory('KMSBalita', { create: true }, function (dirEntry) {
													
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
									 
									obj.dataStorage = JSON.parse( localStorage.getItem( 'dataStorage' ) );
									  
									  
									if( !obj.dataStorage || obj.dataStorage === "null" ) { //generate new dataStorage
								 
										//reupdate dataStorage
										localStorage.setItem('dataStorage', scope.JSONstringfy( self.generateDb() ) );
									 
										
									}
									  
									callback.call( {}, obj.dataStorage  );  
						 
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
									 
										dir.getDirectory('KMSBalita', { create: true }, function (dirEntry) {
											 
											dirEntry.getDirectory('KmsPhoto', { create: true }, function (subDirEntry) {
												  
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
										"Pantau tumbuh kembang emas anak usia 0 ~ 5 Tahun menggunakan "+ appName +" dan download appnya di playstore",
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
										"Pantau tumbuh kembang emas anak usia 0 ~ 5 Tahun menggunakan "+ appName +" dan download appnya di playstore",
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
									dir = cordova.file.externalRootDirectory+'KMSBalita/database/'+fileName;
										 
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
								  
								obj.modalMenu.behaviour.openFadeIn( "modal-menu-restore" );
							        
							},
							errorUnknown : function(){
								
								let fragment = scope.stringToHtml5Template(
									'<span class="semibold center-text"> konversi error, tampaknya file telah rusak </span>'
								);
								 
								obj.modalMenu.menuError.update( fragment );
							},
							errorNotJson : function(){
								
								let fragment = scope.stringToHtml5Template(
									'<span class="semibold center-text"> file tidak berekstensi JSON, Apa anda yakin ini adalah file database KMS Balita dan Bunda  </span>'
								);
								 
								obj.modalMenu.menuError.update( fragment );
							},
							errorCancel : function(){
								
								let fragment = scope.stringToHtml5Template(
									'<span class="semibold center-text"> Anda membatalkan atau tak ada data yang diterima </span>'
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
										title: params.title,
										text: params.text,
										smallIcon: 'res://alarm',
										icon: 'file://2d/icon-96-xhdpi.png',
										trigger: { 
											every : params.stringDate
										}
									});
								}else{ 
								
									global.cordova && cordova.plugins.notification.local.schedule({
										smallIcon: 'res://alarm', 
										icon: 'file://2d/icon-96-xhdpi.png',
										id : parseInt( params.id ),
										title: params.title,
										text: params.text,
										trigger: { at: params.trigger }
									});
								}
							},
							cancel : function( params ){
								  
								global.cordova && cordova.plugins.notification.local.cancel( parseInt( params.id ) );
								
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
									createFile = function( fileEntry, imageUri ){
										 
										fileEntry.createWriter(function ( fileWriter ) {

											fileWriter.onwriteend = function() {
												
												//sukses buat file baru 
												//readBinaryFile( fileEntry ); //png saja
												 
											};

											fileWriter.onerror = function(e) {
												//error buat file
											};

											fileWriter.write( imageUri );
								
										})
	 
									};
										 
									global.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, 
											 
										function ( dir ) {
										 
											dir.getDirectory('KMSBalita', { create: true }, function (dirEntry) {
												 
												dirEntry.getDirectory('KmsPhoto', { create: true }, function (subDirEntry) {
													 
													subDirEntry.getFile( scope.uniqueString()+'.png' , { create: true, exclusive: false  }, function( fileEntry ) {
																								  
														var xhr = new XMLHttpRequest();
														xhr.open('GET', imageUri, true);
														xhr.responseType = 'blob';

														xhr.onload = function() {
															 
															var blob = new Blob([this.response], { type: 'image/png' }),
															cloneuri = fileEntry.nativeURL;
															 
															createFile( fileEntry, blob )
															
															callback( cloneuri )
															 
														};
														xhr.send();
														   
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
							"height": wrapChartDeduct - 15 +"px"
						})
						  
						/*modal tracker chart */
						let element = scope.qs("modal-tracker-chart").querySelector(".modal-content"),
						wrapChart = element.getBoundingClientRect().top,
						wrapChartBottom = bodyHeight - wrapChart;
						scope.css( element,{
							"height": wrapChartBottom - 25 +"px"
						})
						
						/*modal others  */
						let elementGear = scope.slice( scope.qsAll("modal-gear-list") );
						elementGear.map(function( objElement ){
							
							var wrapGear = objElement.getBoundingClientRect().top,
							wrapGearBottom = bodyHeight - wrapGear;
							scope.css( elementGear,{
								"height": wrapGearBottom - 55 +"px"
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
							spaceBetween: 0
						}),
						chartFn = function(){
						  
							obj.chart.weightForAge.create();
					
							obj.chart.bmiForAge.create();
							
							obj.chart.armForAge.create();
							
							obj.chart.hcForAge.create();
							
							obj.chart.lhForAge.create(); 
							  
						},
						tabDFn = function(){
							
							setTimeout(function(){
							
								/*chart layout*/
								var activeSwiperChart = obj.dataStorage.layoutState.activeSwiperChart,
								tabEl =  scope.slice( scope.qsAll("tab-graph li") ),
								swiperChart = new Swiper('.test-a',{  
									observer: true,
									observeParents: true, 
									freeModeSticky: true, 
									centeredSlides: true,
									initialSlide: activeSwiperChart.index 
								});
								
								scope.text( scope.qs( "box-swiper-chart-msg" ), activeSwiperChart.title+' menurut Umur '  ); 
								 
								scope.addClass( tabEl[ activeSwiperChart.index ] , "select" );
									 
							  
								tabEl.forEach(function( objLi, index ){
									
									scope.attachListener( objLi, 'click', function( getIndex ){ 
											
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										
										scope.addClass( this, "select" );
										 
										 
										swiperChart.slideTo( getIndex, 300 );
										 
									}.bind( objLi, index ) )
									
								}) 
								
								 
								 
								swiperChart.on('transitionEnd', function () {
									
									var header = document.getElementsByTagName("header")[0],
									headerBound = header.getBoundingClientRect().top,
									activeSlide = scope.qs("test-a").querySelector(".swiper-slide-active"),
									title = activeSlide.getAttribute("label");
									 
									scope.text( scope.qs( "box-swiper-chart-msg" ), title+' menurut Umur ' );
									 
									
									tabEl.forEach(function( li ){
										scope.removeClass( li, "select" )
									})
									  
									
									scope.addClass( tabEl[ swiperChart.activeIndex ] , "select" );
									 
									obj.storageState({ 
										storageState : "layoutState",
										objState : "activeSwiperChart",
										value : {
											title : title,
											index : swiperChart.activeIndex 
										}
									},
									function(){}) 
									 
									//active tab to top
									if( headerBound <= -62 ){ 
										
										scope.qs("test-a").querySelector(".swiper-slide-active").scrollIntoView();
										scope.qs("tab-d").scrollIntoView();
									}
								}); 
								 
								chartFn(); 
								 
								 
							},100)
							 
						},
						tabClickFn = function( index, slideFn ){
							 
							let labelClass = this.getAttribute("label") ? 
								this.getAttribute("label") : 
								scope.getFirstChild( this ).getAttribute("label"),
							headerBound = header.getBoundingClientRect().top;
							  
							mainTabs.map(function( objTab ){
								
								scope.addClass( objTab, "hidden" );
								 
							})
							
							divs.map(function( objTab ){
								  
								scope.removeClass( objTab , "active" );
							})
							
							scope.addClass( scope.qs("notify-button"), "hidden" );
							scope.addClass( scope.qs("memo-button"), "hidden" );
							scope.addClass( scope.qs("tracking-button"), "hidden" );
							scope.addClass( scope.qs("growth-button"), "hidden" ); 
							scope.addClass( scope.qs("vaccine-button"), "hidden" ); 
							  
							if( labelClass === "tab-a" ){
								 
								scope.removeClass( scope.qs("header-notify"), "hidden" );
							
								scope.removeClass( scope.qs("notify-button"), "hidden" );
								 
								obj.dataStorage.layoutState.activeLayout = "tab-a";
								
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-a" //a,b,c
								},
								function(){}); 
								
								scope.addClass( divs[6], "active" );
								 
								swiper.slideTo( 6, 300 );
							 
							}else if( labelClass === "tab-b" ){
								
								scope.removeClass( scope.qs("memo-button"), "hidden" );  

								obj.dataStorage.layoutState.activeLayout = "tab-b";
								 
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-b" //a,b,c
								},
								function(){}) 
							
								scope.addClass( divs[5], "active" );
								 
								swiper.slideTo( 5, 300 );
								 
							}else if( labelClass === "tab-c" ){
								
								scope.removeClass( scope.qs("tracking-button"), "hidden" );
							 
								obj.dataStorage.layoutState.activeLayout = "tab-c";
 
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-c" //a,b,c
								},
								function(){}) 
							
								scope.addClass( divs[4], "active" );
								 
								swiper.slideTo( 4, 300 );
								  
							}else if( labelClass === "tab-d" ){
								
								scope.removeClass( scope.qs("growth-button"), "hidden" );
 
								obj.dataStorage.layoutState.activeLayout = "tab-d";
							  
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-d" //a,b,c
								},
								function(){})  
							
								scope.addClass( divs[2], "active" );
								
								swiper.slideTo( 2, 300 );
									 
							}else if( labelClass === "tab-e" ){
								  
								obj.dataStorage.layoutState.activeLayout = "tab-e";
							  
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-e" //a,b,c
								},
								function(){})  
								
								scope.addClass( divs[3], "active" );
								 
								scope.removeClass( scope.qs("vaccine-button"), "hidden" ); 
									
								swiper.slideTo( 3, 300 );
									
							}else if( labelClass === "tab-f" ){
								  
								obj.dataStorage.layoutState.activeLayout = "tab-f";
							  
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-f" //a,b,c
								},
								function(){})  
								
								scope.addClass( divs[0], "active" );
									
								swiper.slideTo( 0, 300 );
									
							}else if( labelClass === "tab-g" ){
								  
								obj.dataStorage.layoutState.activeLayout = "tab-f";
							  
								obj.storageState({ 
									storageState : "layoutState",
									objState : "activeLayout",
									value : "tab-g" //a,b,c
								},
								function(){})  
								
								scope.addClass( divs[1], "active" );
									
								swiper.slideTo( 1, 300 );
									
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
							 
							typeof slideFn === "function" && slideFn();	
							  
							  
							obj.appConfig.ads.interstitial.interaction--;
							
						};
					
					 
						/**
							active layout
						*/
						 
						if( !obj.dataStorage.layoutState.activeLayout ){
							
							obj.storageState({ 
								storageState : "layoutState",
								objState : "activeLayout",
								value : "tab-a" //a,b,c
							},
							function(){
								
								obj.dataStorage.layoutState.activeLayout = "tab-a";
							}) 
							
						
							
						}else{
							 
							mainTabs.map(function( objTab ){
								scope.addClass( objTab, "hidden" );
							})
						 
							 
							switch( obj.dataStorage.layoutState.activeLayout ){
								
								case "tab-a" :
								
									scope.removeClass( scope.qs("notify-button"), "hidden" );
									
									scope.removeClass( scope.qs("header-notify"), "hidden" );
									
									scope.addClass( divs[6], "active" );
									 
									swiper.slideTo( 6, 300 );
									 
									break;
									
								case "tab-b" :
								
									scope.removeClass( scope.qs("memo-button"), "hidden" ); 
									
									scope.addClass( divs[5], "active" );
									 
									swiper.slideTo( 5, 300 );
									
									break;	
									
								case "tab-c" :
								
									scope.removeClass( scope.qs("tracking-button"), "hidden" ); 
									
									scope.addClass( divs[4], "active" );
									 
									swiper.slideTo( 4, 300 );
									
									break;	
									
								case "tab-d" :
								 
									scope.removeClass( scope.qs("growth-button"), "hidden" );
									
									tabDFn();
									 
									scope.addClass( divs[2], "active" );
									
									swiper.slideTo( 2, 300 );
									
									break;
								
								case "tab-e" :
								  
									scope.addClass( divs[3], "active" );
									
									scope.removeClass( scope.qs("vaccine-button"), "hidden" ); 
							
									swiper.slideTo( 3, 300 );
									
									break;
								
								
								case "tab-f" :
								  
									scope.addClass( divs[0], "active" );
									
									swiper.slideTo( 0, 300 );
									
									break;
									
								 
								case "tab-g" :
								  
									scope.addClass( divs[1], "active" );
									
									swiper.slideTo( 1, 300 );
									
									break;
							}
							 
							scope.removeClass( scope.qs( obj.dataStorage.layoutState.activeLayout ), "hidden" );
						}
						
						/**
							onclick
						*/
						
						
						/**
							onclick footer
						*/
						divs.map(function( objDiv, index ){ 
						
							scope.attachListener( objDiv, 'click', tabClickFn.bind( objDiv, index, false ))
						})
						
						
						/**
							onclick sidebar
						*/
						sliderTabs.map(function( objLi, index ){ 
						
							if( objLi.getAttribute("label") ){
									
								scope.attachListener( objLi, 'click', tabClickFn.bind( objLi, parseInt( objLi.getAttribute("index") ), function(){
									
									obj.modal.behaviour.closeFadeout();
										
								}))
							
							}
						})
						
					
					},
					main :{
						memoBackDetail : function(){
							 
							obj.modal.behaviour.openFadeIn("modal-memo-detail");	
							
						},
						remainderBackDetail : function(){
							 
							obj.modal.behaviour.openFadeIn("modal-remainder-detail");	
							
						},
						remainderDeleteConfirm : function(){
							 
							obj.modal.behaviour.openFadeIn("modal-remainder-confirm");	
							
						},
						trackerBackDetail : function(){
							 
							obj.modal.behaviour.openFadeIn("modal-tracker-detail");	
									  
						},
						trackerDeleteConfirm : function(){
							 
							obj.modal.behaviour.openFadeIn("modal-tracker-confirm");	
							  
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
								  
								notifyStrip.setAttribute("style", "border-color:"+obj.dataStorage.layoutState.activeColor );
								  
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
 
								//if( dataNote.babyId === dataBaby.id ){	}
								 
								let dateNow = new Date(),
								dateStart = scope.stringToDate( dataNote.dateStart ),
								dateEnd = scope.stringToDate( dataNote.dateEnd ),
								timestame = "00 : 00 : 00",
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
										
										scope.text( scope.nthParent( element, 1).getElementsByTagName( "abbr" )[0], timestame )
										 
										element.setAttribute("timer", convertTimeFn( timestame ) );
									}
								}
							
								dataEmpty = false
							 
							};
							 
							
							if( !initial ){
								
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
									
									scope.text( scope.qs("remainder-timer-detail"), this.getAttribute("timer") );
									scope.text( scope.qs("remainder-data-start-detail"), this.getAttribute("date-start") );
									scope.text( scope.qs("remainder-data-end-detail"),this.getAttribute("date-end") );
									scope.text( scope.qs("remainder-content-detail"),this.getAttribute("remainder") );
 
									scope.text( scope.qs("notify-type-detail"), this.getAttribute("label-text") );
									
									
									//get initial data for modal confirm ( modal detail )
									scope.qs("modal-remainder-detail").querySelector(".send-button").setAttribute("label-id", this.getAttribute("id") )
									
									//get initial data for modal confirm ( modal confirm )
									scope.qs("modal-remainder-confirm").querySelector(".send-button").setAttribute("label-id", this.getAttribute("id") )
									
									//update modal remainder detail 
									obj.modal.behaviour.openModalFadeIn("modal-remainder-detail")
									
									
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
								   
								obj.generateExpandCollapse( contentCollaps ) 
								  
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
								 
								if( dataNote.babyId === dataBaby.id ){
									
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
							container = scope.qs("container-activity"),
							containerRunning = scope.qs("running-activity"),
							dataFilter = obj.storageFilter( obj.dataStorage.tracker ),
							dataAfterRange = obj.dataStorage.trackerState.trackerRange ? obj.dateTimeRangeValidate( dataFilter, obj.dataStorage.trackerState.trackerRange ) : dataFilter,
							data = obj.stringMatchOrEmptyValidate( dataAfterRange, obj.dataStorage.trackerState.trackerMenu ),
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
									
									notifyStripB.className = "notify-strip-b";
									 
									bubbleBox.className = "bubble-box "+params.icon;
									
									spanTitle.className = "notify-small-title extrabold";
									
									spanText.className = "notify-small-detail light left";
									
									btnLeft.className = "bubble-small-left"
									
									insCnt.className = "left"
									
									notfyBoxSmall.appendChild( bubbleBox );
									
									notfyBoxSmall.appendChild( abbrTime );
									 
									notfyBoxSmall.appendChild( insCnt );
									 
									notfyBoxSmall.appendChild( btnLeft );
									
									bubbleBox.appendChild(notifyStripB );
									 
									insCnt.appendChild( spanTitle );
									
									insCnt.appendChild( br );
									
									insCnt.appendChild( spanText );
									
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
								
								if( dataNote.babyId === dataBaby.id || dataNote.activityType.toLowerCase() === "pompa asi" ){
									
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
										 
										scope.addClass( self, "hidden" )
									}) 
									
								})
								
								//tab
								let tabDb = function( params ){
									
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
									 
									 
									tabDb({
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
										
										tabDb({
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
									 
									obj.modal.behaviour.openFadeIn("modal-tracker-detail");
								})
							})
						},
						screening : function(){
							
								let main = scope.qs("screening-content"),
								container = main.querySelector(".modal-content.content-collapse"),
								dataScreening =  obj.storageFilter( obj.dataStorage.screening ),
								questionerScreening =  global.praSkrining,
								contentDom = function( params ){
									
									let innerDom = function( innerParams ){},
									outterDom = function( outterParams ){
										 
										 fn.skriningCondition = function( params ){
											  
											if( !params.data ) return {
												result : "Belum ada rekaman",
												color : "grey"
											};
											
										 
											let yesTot = 0,
											noTot = 0,
											aswrTot = 0;
											 
											 
											 //KPSP
											 // params title ( string ) dan data ( array ) 
											 // start
											 if( params.title.toLowerCase() === "kpsp" ){
												
												params.data.forEach(function( a ){
													
													if( a === 1 ) yesTot++;
													if( a === 0 ) noTot++; 
													if( a === 1 || a === 0 ) aswrTot++;
													
												})
												 
												let result = yesTot >= 9 ? "Sesuai ( "+ yesTot +" )" :
												 ( yesTot >= 7 && yesTot <= 8 )  ?  "Meragukan ( "+ yesTot +" )"  : "Penyimpangan ( "+ yesTot +" )",
													
												color = yesTot >= 9 ? "green" : 
												 ( yesTot >= 7 && yesTot <= 8 ) ? "yellow"  : "orange";
												
												return {
													result : result,
													color : color,
													yes : yesTot,
													no : noTot,
													answerTot : aswrTot +" / "+ params.data.length +" Pertanyaan "
												}
												 
											 }else if( params.title.toLowerCase() === "tdd" ){
												  
												params.data.forEach(function( a ){
													
													if( a === 1 ) yesTot++;
													if( a === 0 ) noTot++; 
													if( a !== "" ) aswrTot++;
													
												})
												 
												let result = noTot >= 1 ? "Ada gangguan" :  "Normal",
													
												color =  noTot >= 1  ? "orange"  : "green";
												
												return {
													result : result,
													color : color,
													yes : yesTot,
													no : noTot,
													answerTot : aswrTot +" / "+ params.data.length +" Pertanyaan "
												}
												 
											 }else if( params.title.toLowerCase() === "gpph" ){
												  
												params.data.forEach(function( a ){
													 
													if( a !== "" ) aswrTot += parseInt( a );
													if( a !== "" ) yesTot ++;
													
												})
												 
												let result = aswrTot >= 13 ? "Kemungkinan GPPH ( "+ aswrTot +" )" :  "Normal ( "+ aswrTot +" )" ,
													
												color =  aswrTot >= 13  ? "orange"  : "green";
												
												return {
													result : result,
													color : color,
													yes : yesTot,
													no : noTot,
													answer : yesTot +" / "+ params.data.length +" Pertanyaan ",
													answerTot : aswrTot 
												}
												 
											 }else if( params.title.toLowerCase() === "kmme" ){
												  
												params.data.forEach(function( a ){
													
													if( a === 1 ) yesTot++;
													if( a === 0 ) noTot++; 
													if( a !== "" ) aswrTot++;
													
												})
												 
												let result = yesTot >= 1 ? "Kemungkinan KMME" :  "Normal",
													
												color =  yesTot >= 1  ? "orange"  : "green";
												
												return {
													result : result,
													color : color,
													yes : yesTot,
													no : noTot,
													answerTot : aswrTot +" / "+ params.data.length +" Pertanyaan "
												}
												 
											 }else if( params.title.toLowerCase() === "chat" ){
												
												let highRiskTot = 0; 
												lowRiskTot = 0; 
												otherTot = 0;
												  
												params.data.forEach(function( a, index ){
													
													if( /4|6|10|11|12/i.test( index ) && a === 0 ) highRiskTot ++; 
													if( /6|12/i.test( index ) && a === 0 ) lowRiskTot ++; 
													if( /0|1|2|3|5|7|8|9|13/i.test( index ) && a === 0 ) otherTot ++; 
													  
													if( a === 1 || a === 0 ) aswrTot++;
												})
												  
												let result = highRiskTot === 5 ? " Resiko tinggi autis" : 
													lowRiskTot === 2 ? "Resiko rendah autis" :
													otherTot >= 3 ? "Gangguan lain" : "Normal",
													
												color = highRiskTot === 5 ? "orange" :
													lowRiskTot === 2 ? "yellow"  :
													otherTot >= 3 ? "yellow" : "green";
												
												return {
													result : result,
													color : color,
													yes : yesTot,
													no : noTot,
													answerTot : aswrTot +" / "+ params.data.length +" Pertanyaan "
												}
												 
											 }
												 
											 //end
											 
										 }
										 
										 let fragment =  scope.stringToHtml5Template(
											'<ul class="list-inline border-none m0 box-glow ">' +
											'	<li class="mt15"> ' +
											'		<ul class="list-inline" style="overflow:auto;">' +
											'			<li class="modal-list left"> ' +
											'				<div class="container-radio centerdiv">' +
											'					<div class=" centerdiv"></div>' +
											'				</div>' +
											'			</li>' + 
											'			<li class="modal-list right"> ' +
											'				<ul class="list-inline modal-list-container centerdiv">' +
											'					<li class="semibold"> ' +
																	params.title +
											'					</li>' +
											'					<li class="light"> ' +
																	params.detail +
											'					</li>' +
											'				</ul> ' +
											'			</li>' +
											'		</ul>' +
											'		<div class="content bg-transparent" >' +
											'			<div class="mt20">' +
											'				<div class="wrap-content-data" >' +
														function(){
															 
															let string = ""
															
															params.dataChild.forEach(function( objChild, index ){
																 
																let age = "USIA " + objChild.age[0] +" ~ "+objChild.age[1],
																ageLabel = objChild.age[0] +" ~ "+objChild.age[1] + " Bulan",
																label = params.label+objChild.age[0]+""+objChild.age[1],
																
																//data yang terekam
																totalRecord = dataScreening.length 
																	&& dataScreening[0].storage[ label ]
																	&& dataScreening[0].storage[ label ].length,
																 
																dataLen = totalRecord
																	&& dataScreening[0].storage[ label ][0], 
																dataRecordTest = dataLen && dataScreening[0].storage[ label ][0], //tampilkan rekaman yang paling baru
																
																dataExist = dataRecordTest ? 
																	dataScreening[0].storage[ label ][0] : "",
																	
																//ambil data terakhir
																dataRecord = dataRecordTest ? 
																	dataExist : "",
																	
																//hasil skrining
																test = fn.skriningCondition({
																	title : dataRecord && dataRecord.title || "",
																	data : dataRecord && dataRecord.data || ""
																}),
																	  
																//total rekam 
																totText = totalRecord ? " ~ " + totalRecord +" x rekaman" : "";
																
																let r =  String.fromCharCode(
																	Math.floor(Math.random() * 26) + 97
																).toUpperCase();
																
																string += 	'	<div class="notify-box-small" style="margin-left:0px">' +
																			'		<div class="bubble-box center bg-gray hidden"> <div class="centerdiv font11">'+ r +'</div>' +
																			'			<div class="notify-strip-b hidden"></div>' +
																			'		</div>' +
																			'		<ins class="left">' +
																			'			<span class="notify-small-title extrabold">'+ age +'</span>' +
																			'			<br>' +
																			'			<span class="notify-small-detail semibold left"> '+
																			'				 <label class="'+ test.color +'"> ' + test.result + ' </label> '+ totText +
																			'			</span>' +
																			'		</ins>' +
																			'		<div class="bubble-small-left center" age ="'+ ageLabel +'" text-record ="'+ test.result +'" screen-type="'+ label +'" label="'+ params.label +'" index="'+ index +'" ></div>' +
																			'	</div>' 
																
															})
															
															return string;
															
														}() +
											  
											'				</div>' +
											'			</div> ' +
											'		</div>' +
											'	</li>' + 
											'</ul>' 
										 )
										 
										 
										 container.appendChild( fragment );
										 
									}	
									
									outterDom();
								},
								domFn = function( data, index ){
									
									let label =  data.title.toLowerCase();
									
									contentDom({
										title : data.title,
										detail : data.detail,
										dataChild : data.content,
										label : label
									})
									
								};
								
								container.innerHTML ="";
								  
								questionerScreening.forEach( function( data, index ){
									 
									domFn( data, index );  
  
								})	
								 
								obj.generateExpandCollapse( container )
								    
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
								   
								//button modal detail
								let vacBtns = scope.slice( main.querySelectorAll(".content-collapse .bubble-small-left") );
								vacBtns.map(function( btnVac, index ){
									
									scope.attachListener( btnVac, 'click', function(){
									 
										let modalSdetail = scope.qs("screen-recorded-list"),
										btnSend = modalSdetail.querySelector(".send-button"), 
										label = this.getAttribute("label"),
										screenType = this.getAttribute("screen-type"), 
										textRecord = this.getAttribute("text-record"),
										index = this.getAttribute("index"),
										age = this.getAttribute("age");
										
										btnSend.setAttribute("label", label )
										btnSend.setAttribute("index", index )
										
										let dataLen = dataScreening.length 
											&& dataScreening[0].storage[ screenType ]
											&& dataScreening[0].storage[ screenType ].length,
										dataRecordTest = dataLen  ? dataScreening[0].storage[ screenType ] : {};
										  												 
										obj.modal.screeningDetail.update({
											textRecord : textRecord,
											dataRecord : dataRecordTest,
											screenType : screenType,
											initial : label,
											index : index,
											age : age
										} )
										 
										obj.modal.behaviour.openFadeIn("screen-recorded-list");
										  
										  
									})
								})
							 
						},
						vaccine : {
							update : function( objectInitial ){
								
								let main = scope.qs("vaccine-content"),
								mainVaccineReg = scope.qs(".vaccine-reg-container"),
								container = main.querySelector(".content-data .content-data.p33"), 
								dataEmpty = true,
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.vaccineReg ),
								dataOrder = obj.dataStorage.layoutState.vaccinveOrder,
								count = 0,
								dateNow = new Date(),
								contentDom = function( params ){
									
									let innerDom = function( innerParams ){
										
										let count = scope.slice( innerParams.container.querySelectorAll(".notify-box-small") ).length,
										fragment =  scope.stringToHtml5Template(
										
											'<div class="notify-box-small" date="'+ params.stringDate +'" > '+
											'	<div class="bubble-box bg-size-80 '+ params.icon +'-icon"> '+
											'		<div class="notify-strip-b"></div> '+
											'	</div> '+
											'	<abbr class="time-since">Berjalan</abbr> '+
											'	<ins class="left"> '+
											'		<span class="notify-small-title extrabold">'+ params.name +' - '+ ( count + 1 ) +'</span> '+
											'		<br> '+
											'		<span class="notify-small-detail light left"> <label class="'+ params.color +'" > '+ params.status +' </label> -  '+ params.vaccineDate +' </span> '+
											'	</ins> '+
											'	<div class="bubble-small-left" '+
											'	 		name="'+ params.name +'"'+
											'	 		record="'+ ( count + 1 ) +'"'+
											'	 		vaccine-date-record="'+ params.vaccineDateRecord +'"'+
											'	 		status="'+ params.status +'"'+ 
											'	 		label="'+ params.id +'"'+
											'	 		detail="'+ params.detail +'"'+
											'></div> '+
											'</div> '
											 
										)
										
										//append
										innerParams.container.appendChild( fragment );
										 
										let childEls = scope.slice( innerParams.container.querySelectorAll(".notify-box-small") ),
										latestChild = childEls[ childEls.length - 1 ],
										getPervEl = scope.sibling( latestChild, "previous" );
										
										if( getPervEl ){
											
											let vaccineDateStart = scope.stringToDate( getPervEl.getAttribute("date") ),
											vaccineDateNext = scope.stringToDate( latestChild.getAttribute("date") ),
												 
											age = scope.timeUnitBetween( vaccineDateNext, vaccineDateStart ),
											
											ageStr = ( age.year !== 0 ? age.year+" Thn " : "" ) +
											 ( age.month !== 0 ? age.month+" Bln " : "" ) +
											 ( age.week !== 0 ? age.week+" Mgg " : "" ) +
											 ( age.day !== 0 ? age.day+" Hr" : "" );
											  
											scope.text( getPervEl.querySelector(".time-since"), ageStr ) 
										}
										
									},
									
									outterDom = function( outterParams ){
										 
										if( outterParams.createContainer ){
											 
											let fragment =  scope.stringToHtml5Template(
												'<div class="parent-vaccine-box">'+
												'	<abbr class="title extrabold">'+ params.name +'</abbr>'+
												'	<div class="wrap-content-data mt10" label="'+ params.name.toLowerCase() +'">'+
												'	</div>'+
												'</div>'+
												'<div class="sparator mt0 mb20"></div>'
											),
											
											dummyFragment = document.createElement("div");
											dummyFragment.appendChild( fragment );
											
											elementFragment = scope.getLastChild( dummyFragment.firstChild )
											 
											innerDom({
												container : elementFragment
											}) 
											
											if( dataOrder === "prepend" ){
												container.insertBefore( dummyFragment, container.firstChild );
											}else{
												container.appendChild( dummyFragment );
											}
											
											//hapus sparator jika diperlukan
											let parentEls = scope.slice( container.querySelectorAll(".parent-vaccine-box") ),
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
									
									containerWrap.map(function( objWrap ){
										
										let label = objWrap.getAttribute("label");
										
										if( params.name.toLowerCase() === label ){ 
										
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
									 
									 
								 
								},
								domFn = function( data, index ){
									
									if( obj.loadMore.marker( "vaccine", mainVaccineReg, data, index ) ){
										
										count++;
										
										let strVaccineDate = scope.stringToDate( data.vaccineDate );
										
										dateNow.setHours( 0, 0, 0, 0 )
										
										strVaccineDate.setHours( 0, 0, 0, 0 )
										
										let totDay = scope.getMinutesHourDayOrWeekBetweenDates( strVaccineDate, dateNow, "day" ),
										vaccineDateRecord =	scope.dateToYMD( strVaccineDate, "year", "", false ),
										vaccineDate = strVaccineDate > dateNow ?
											( totDay > 0 ? totDay +" hari lagi" : vaccineDateRecord ) : vaccineDateRecord,
										scheduleStatus = data.selectType === 1 && dateNow > strVaccineDate ,
										isProcess = totDay > 0,
										status = isProcess ? "terjadwal" : ( data.selectType === 0 ? "selesai" : "selesai" ),
										color = isProcess ? "grey" : ( data.selectType === 0 ? "green" : "green" ),
										icon = data.notification && isProcess ? "alarm" : ( data.selectType === 0 || !isProcess ? "vaccine" : "timer" );
  
										contentDom({
											id : data.id,
											name : data.name,
											detail : data.detail,
											count : count,
											status : status,
											color : color,
											icon : icon,
											vaccineDate : vaccineDate,
											stringDate : data.vaccineDate,
											vaccineDateRecord : vaccineDateRecord,
											isProcess : isProcess
										}) 
										 
									}
									
									dataEmpty = false; 
								},
								updateDataBaseOnNew = function(){;
									  
									let grab = {};
									grab[ "index" ] = {}
									result = []
									
									
									data.forEach(function ( a, index, arr ) { 
										 
										let str = a.name.toLowerCase().split(" ").join(""),
										shortArr = function(){
											
											if( !grab[ str ] ){
												
												grab[ str ] = [ a ]
												
											}else{
												
												grab[ str ].push( a )
												
											}
											
											grab[ str ].sort(function( a, b ) { return scope.stringToDate( a.vaccineDate ) - scope.stringToDate( b.vaccineDate ) })
											
											//ambil index terakhir dari array yang udah di short
											//array tersebut akan kita gunakan untuk menshortir data terbaru
											grab[ "index" ][ str ] = grab[ str ][ grab[ str ].length - 1 ].dateStart;
											
										};
											
										
										//susun arrau berdasarkan nama 
										if( arr[ index + 1 ] && a === arr[ index + 1 ].name ){
											
											shortArr()
											
										//satu array langsung masukin saja	
										}else{
											
											shortArr()
										}
										 
									})
									 
									
									//grab[ "index" ].sort(function(a, b) { return scope.stringToDate( a.vaccineDate ) - scope.stringToDate( b.vaccineDate  ) })
									
									//ubah object to array
									grab[ "index" ] =  Object.keys( grab[ "index" ] ).map(function(key) {
									  return [  grab[ "index" ][key], key ];
									});
									
									//ascending index
									grab[ "index" ].sort(function( a, b ) {  
									
										return scope.stringToDate( a[0] ) - scope.stringToDate( b[0] ) 
									})
									
									//merger array
									grab[ "index" ].forEach(function( a ){
										
										grab[ a[1] ].forEach(function( b ){
											
											result.push( b )
											
										})
										  
									})
									
									data = result;
									
								}
								  
								updateDataBaseOnNew()
								
								  
								//reset
								if( !objectInitial ){
								
									container.innerHTML = "" ;
									
									obj.loadMore.state.vaccine.elementContent = container;
									
									//reset loadmore
									obj.loadMore.state.vaccine.reset();
								};
								
								data.forEach( function( data, index ){
									 
									domFn( data, index );  
  
								})	
								 
									 
								scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" )
								scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" )
								
								/**
								tracker detail buttons
							*/
								let	vaccineBtns = scope.slice( mainVaccineReg.querySelectorAll(".bubble-small-left") );
								 
								vaccineBtns.map(function( btnEl, index ){
									
									scope.attachListener( btnEl, 'click', function(){
										  
										//set label confirm button
										scope.qs("vaccine-recorded-confirm").querySelector(".send-button").setAttribute( "label", this.getAttribute("label") )
										 
										//modal confirm 
										scope.text( [ scope.qs("vaccine-r-name"), scope.qs("vaccine-rc-name") ], this.getAttribute("name") );
										scope.text( [ scope.qs("vaccine-r-recorded"), scope.qs("vaccine-rc-recorded")], this.getAttribute("record") );
										scope.text( [ scope.qs("vaccine-r-status"), scope.qs("vaccine-rc-status")], this.getAttribute("status") );
										scope.text( [scope.qs("vaccine-r-date"),  scope.qs("vaccine-rc-date") ], this.getAttribute("vaccine-date-record") );
										scope.text( [scope.qs("vac-r-detail"),  scope.qs("vac-rc-detail") ], this.getAttribute("detail") );
										   
										if( this.getAttribute("detail") ){
											
											scope.removeClass( scope.qs("vac-r-detail").parentNode, "hidden" )
											scope.removeClass( scope.qs("vac-rc-detail").parentNode, "hidden" ) 
											
										}else{
											
											scope.addClass( scope.qs("vac-r-detail").parentNode, "hidden" )
											scope.addClass( scope.qs("vac-rc-detail").parentNode, "hidden" ) 
										}
										   
										obj.modal.behaviour.openFadeIn("vaccine-recorded-detail");
									})
								})
									 
							},
							program : function( objectInitial ){
								
								let main = scope.qs("vaccine-content"),
								container = main.querySelector(".content-data .modal-content"),
								selectVaccine = obj.dataStorage.layoutState.toggleVaccine === "PPI", // ppi or idai
								data = selectVaccine ? obj.dataStorage.vaccinePPI : obj.dataStorage.vaccine,
								toogleVaccine = scope.qs("switch-toggle-checkbox"),
								contentDom = function( params ){
										 
										 
									let dateStart =  scope.stringToDate( dataBaby.birthdate ),
									dateNow = new Date(),
									totalMonth = scope.getTotalMonths(  new Date(), dateStart ),
										//fragment child
									fragmentChildFn = function(){
											
										let childList = {},
										isPulse = false,
										warpFn = function( item ){
											
											return	'<div class="mt15">'+
														'<div class="wrap-content-data" label="26/7/2019">'	+	 
														item + 
														'</div>'+
													'</div> '
											
										};
										
										
										for( let ii in params.list ){
											
											let item = params.list[ii],
											opacity = "",
											totalDaysStr = "0",
											vaccineStart = ( item.age instanceof Array ? item.age[0] : item.age ),
											vaccineEnd = ( item.age instanceof Array ? ( item.age[1] - item.age[0] ) + 1 : 1 ),
											ageStr = ( item.age instanceof Array ? item.age[0]+" ~ "+item.age[1] : item.age ) +" Bulan",
											vaccineStartTime =  new Date( dateStart ),
											bgType = "";
											
											vaccineStartTime.setMonth( vaccineStartTime.getMonth() + vaccineStart );
											
											let vaccineEndTime = new Date( vaccineStartTime ),
											pulse = ""
											
											vaccineEndTime.setMonth( vaccineEndTime.getMonth() + vaccineEnd );
											
											if( dateNow > vaccineEndTime ){
												 
												opacity = "halfOpacity";
												 
												totalDaysStr = 'Imunisasi Berakhir'
												
											}else if( dateNow > vaccineStartTime && dateNow < vaccineEndTime){
												
												pulse = "pulse";
												
												isPulse = true;
												 
												let totalDays = scope.getMinutesHourDayOrWeekBetweenDates( vaccineEndTime, dateNow, "day" )
												
												totalDaysStr = 'Berakhir '+ totalDays +' Hari Lagi'
												 
											}else{
												
												let totalDays = scope.getMinutesHourDayOrWeekBetweenDates( vaccineStartTime, dateNow, "day" )
												
												totalDaysStr = 'Tersisa '+ totalDays +' Hari';
											}
											
											
											//tipe imunisas booster / optimal
											bgType = ( item.type === "optimal" || item.type.toLowerCase() === "dasar" )  ? "bg-harvey glow-harvey" :
												item.type === "endemis" ? "bg-sandybrown glow-sandybrown" : "bg-turquoise glow-turquoise";
											
											
											if( !childList[ item.type.toLowerCase() ] ) childList[ item.type.toLowerCase() ] = [];
											 
											childList[ item.type.toLowerCase() ].push(
											'<div class="notify-box-small '+ opacity +'" style="opacity: 0.99;">'+
											'	<div class="bubble-box center '+bgType+' '+pulse+'"> '+
											'		<div class="notify-strip-b notify-false '+bgType+'"></div>'+
											'	</div>'+
											'	<ins class="left">'+
											'		<span class="notify-small-title extrabold">'+ item.name+'</span>'+
											'		<br>'+
											'		<span class="notify-small-detail semibold left">'+ageStr+', '+ totalDaysStr +' </span>'+
											'	</ins>'+
											'	<div class="bubble-small-left center" '+
											' 	vaccine-name="'+ params.name +'" ' +
											' 	vaccine-detail="'+ item.name +'" ' +
											' 	vaccine-age="'+ ageStr + '" ' +
											' 	vaccine-type="'+ scope.ucFirst( item.type.toLowerCase() ) + '" ' +
											' 	vaccine-date="'+ scope.dateToYMD( vaccineStartTime, "year", "", "", "shortYear") +' ~ '+scope.dateToYMD( vaccineEndTime, "year", "", "", "shortYear") +'" ' +
											' 	vaccine-time="'+ totalDaysStr +'" ' +
											' 	vaccine-notify-text=" imunisasi '+ item.name  +'" ' +
											' 	vaccine-notify-date="'+ vaccineStartTime.toLocaleString("id-ID")  +' '+ totalDaysStr +'" ' +
											' 	vaccine-notify-hidden="'+ ( vaccineStartTime > dateNow  ? "" : "hidden" ) +'" ' +
											'	></div>'+
											'</div>' )
											
										} 
										 
										let optimal = childList.optimal && warpFn( childList.optimal.join("") ) || '',
										booster = childList.booster && warpFn( childList.booster.join("") ) || '',
										endemis = childList.endemis && warpFn( childList.endemis.join("") ) || '',
										dasar = childList.dasar && warpFn( childList.dasar.join("") ) || '',
										lanjutan = childList.lanjutan && warpFn( childList.lanjutan.join("") ) || '';;
										
										return {
											fragment : optimal + booster + endemis + dasar + lanjutan,
											pulse : isPulse
										}
										 
										
									}(),	
								
									fragment = scope.stringToHtml5Template(
										'<ul class="list-inline border-none m0 box-glow ">'+
										'	<li class="mt15"> '+
										'		<ul class="list-inline" style="overflow:auto">'+
										'			<li class="modal-list left"> '+
										'				<div class="container-radio centerdiv '+ ( fragmentChildFn.pulse ? "glow-grey pulse" : "" ) +'">'+
										'					<div class=" centerdiv"></div>'+
										'				</div>'+
										'			</li>'+ 
										'			<li class="modal-list right"> '+
										'				<ul class="list-inline modal-list-container centerdiv">'+
										'					<li class="semibold"> '+
																params.name+
										'					</li>'+
										'					<li class="light"> '+
															params.detail + 
										'						- <a href="'+params.link+'"> wiki </a> '+
										'					</li>'+
										'				</ul>'+
										'			</li>'+
										'		</ul>'+
										'		<div class="content bg-transparent ">'+
											
												fragmentChildFn.fragment+
													
										'		</div>'+
										'	</li>'+
										'</ul>'
									);
									 
									container.appendChild( fragment )
								  
								 
									
									/**
										pattern
										<ul class="list-inline border-none m0 box-glow ">
											<li class="mt15"> 
												<ul class="list-inline" style="overflow:auto">
													<li class="modal-list left"> 
														<div class="container-radio centerdiv">
															<div class=" centerdiv"></div>
														</div>
													</li>
													
													<li class="modal-list right"> 
														<ul class="list-inline modal-list-container centerdiv">
															<li class="semibold"> 
																POLIO
															</li>
															<li class="light"> 
																Centang untuk menghitung satuan dari kateogori yang akan dibuat
															</li>
														</ul>
														<div class="todo-dot-menu">
															<div class="todo-dot-cnt-icon menu-dot-icon"></div>
															<div class="todo-dot-child-menu hidden"> Hapus </div>
														</div>
													</li>
												</ul>
												<div class="content bg-transparent p0 ">
													<div class="mt30">
														<div class="wrap-content-data" label="26/7/2019">
															<div class="notify-box-small">
																<div class="bubble-box center bg-harvey glow-harvey"> 
																	<div class="notify-strip-b bg-harvey"></div>
																</div>
																<ins class="left">
																	<span class="notify-small-title extrabold">POLIO 0</span>
																	<br>
																	<span class="notify-small-detail semibold left">Lahir, 298 Hari Lagi</span>
																</ins>
																<div class="bubble-small-left center" ></div>
															</div>
															<div class="notify-box-small">
																<div class="bubble-box center bg-harvey glow-harvey">
																	<div class="notify-strip-b bg-grey-a"></div>
																</div>
																<ins class="left">
																	<span class="notify-small-title extrabold">POLIO 1</span>
																	<br>
																	<span class="notify-small-detail semibold left">2 Bln, 298 Hari Lagi</span>
																</ins>
																<div class="bubble-small-left center" ></div>
															</div>
															
														</div>
													</div> 
												</div>
											</li>

										</ul>
									*/
									
								},
								dataNoteFn = function( dataNote, index ){
									
									for( let ii in data ){
										contentDom( data[ii] )
									}
								},
								toggle = function( element, firstLoad ){
										
									let switchText = scope.slice( scope.nthParent( element, 2 ).querySelectorAll(".switch-text") );
									 
									 
									if( firstLoad ){
										  
										toogleVaccine[ ( selectVaccine ? "setAttribute" : "removeAttribute" )]("checked", true )
								
										switchText.map(function( el ){
											scope.removeClass( el, "active" )
										})
										 
										scope.addClass( switchText[ selectVaccine ? 1 : 0 ], "active" )
									
									}else{
											 
										obj.storageState({ 
											storageState : "layoutState",
											objState : "toggleVaccine",
											value : ( element.checked ? "PPI" : "IDAI" )
										},
										function(){}) 
										
										setTimeout(function(){
											
											switchText.map(function( el ){
												scope.removeClass( el, "active" )
											})
											
											obj.main.vaccine.init( true )
											 
											scope.addClass( switchText[ selectVaccine ? 0 : 1 ], "active" )
											
										},300)
									}
								};
								
								container.innerHTML ="";
								
								dataNoteFn();
								
								obj.generateExpandCollapse( container )
								  
								 
								//switch vaccine
								
								!objectInitial && toggle( toogleVaccine, true )
								
								var elClone = toogleVaccine.cloneNode(true);
								toogleVaccine.parentNode.replaceChild( elClone, toogleVaccine );
								scope.attachListener( elClone, 'click', function(){
									 
									toggle( this )
									
								})
								//
								
								
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
								
								//button modal detail
								let vacBtns = scope.slice( main.querySelectorAll(".content-collapse .bubble-small-left") );
								vacBtns.map(function( btnVac, index ){
									
									scope.attachListener( btnVac, 'click', function(){
									
									
										scope.text( scope.qs("vaccine-name"), this.getAttribute("vaccine-name") );
										scope.text( scope.qs("vaccine-detail"),this.getAttribute("vaccine-detail") );
										scope.text( scope.qs("vaccine-age"), this.getAttribute("vaccine-age") );
										scope.text( scope.qs("vaccine-type"), this.getAttribute("vaccine-type") );
										scope.text( scope.qs("vaccine-date"), this.getAttribute("vaccine-date") );
										scope.text( scope.qs("vaccine-time"), this.getAttribute("vaccine-time") );
										
										//pass attributes to send button
										let sendBack = scope.qs("modal-vaccine-detail").querySelector(".send-button");
										
										sendBack.setAttribute("notify-text", this.getAttribute("vaccine-notify-text") )
										sendBack.setAttribute("vaccine-notify-date", this.getAttribute("vaccine-notify-date") )
										
										//button need hidden

										if( this.getAttribute("vaccine-notify-hidden") === "hidden" ){
											
											scope.addClass( sendBack, "hidden" )
										
										}else{
											 
											scope.removeClass( sendBack, "hidden" )
											
										}
										
										obj.modal.behaviour.openFadeIn("modal-vaccine-detail");
										  
									})
								})
							
							},
							init : function( objectInitial ){ 
								
								this.update( objectInitial );
								
								this.program( objectInitial );
								
								if( !stateFirstload.vaccineMain ){
									
									//tab header
									let tabDb = function( params ){
										
										obj.storageState({ 
											storageState : "layoutState",
											objState : "headerVaccinve",
											value : params.value
										},
										function(){}) 
										
									},
									tabEl =  scope.slice( scope.qsAll("tab-vaccine li") ),
									
									//swiper header
									swiperHeader = new Swiper('.swiper-inject', {
										observer: true,
										observeParents: true, 
										initialSlide: obj.dataStorage.layoutState.headerVaccinve
									}); 
									
									 
									swiperHeader.on('transitionEnd', function () {
												
										tabEl.forEach(function( li ){
											scope.removeClass( li, "select" )
										})
										 
										 
										tabDb({
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
											
											tabDb({
												value : getIndex
											}) 
												
										}.bind( objLi, index ) )
										
									}) 
									
									
									stateFirstload.vaccineMain = true;
									
								}
								
							}
						},
						resume : function( objectInitial ){
							
							let main = scope.qs("resume-content"),
							header = main.querySelector(".profile-container"),
							measureCnt = main.querySelector(".profile-measuring-detail"), 
							container = main.querySelector(".content-data > ul"),
							containerEmpty = main.querySelector(".content-empty"),
							data = obj.storageFilter( obj.dataStorage.resume ),
							dataEmpty = true,
							shortArr = function( data ){
								//short ascending
								data.sort(function(a, b){
					
									return b.monthTo - a.monthTo;
									
								});
								
								return data
							},
							domHeader = function( params ){
								
								let classFn = function( indexLi ){
									 
									return params.selectMeasurment === indexLi ? "select" : "";
										 
								},
								fragment = scope.stringToHtml5Template(
										'<div class="profile-pict">'+
										'	<div class="wrap-profile-pict background-img" style="background: url('+ params.avaImg +') no-repeat center;">'+
									//	'		<img  src="'+ params.avaImg +'">'+
										'	</div>	'+
										'	<div class="btn-profile-pict plus-icon"></div>'+
										'</div>'+
										'<div class="profile-text">'+ params.name +'</div>'+
										'<div class="profile-text-small">'+ params.age +'</div>'+
										'<div class="profile-measuring">'+
										'	<ul class="list-inline profile-measuring-cnt">'+
										'		<li>'+
										'			<div class="btn-measuring centerdiv weight-icon bg-opacity-1 '+ classFn(0) +'"></div>'+
										'		</li>'+
										'		<li>'+
										'			<div class="btn-measuring centerdiv height-icon bg-opacity-1 '+ classFn(1) +'"></div>'+
										'		</li>'+
										'		<li>'+
										'			<div class="btn-measuring centerdiv scale-icon bg-opacity-1 '+ classFn(2) +'"></div>'+
										'		</li>'+
										'		<li>'+
										'			<div class="btn-measuring centerdiv ruler-icon bg-opacity-1 '+ classFn(3) +'"></div>'+
										'		</li>'+
										'		<li>'+
										'			<div class="btn-measuring centerdiv measure-icon bg-opacity-1 '+ classFn(4) +'"></div>'+
										'		</li>'+
										'	</ul>'+
										'</div>'
									
								);
								
								//append
								header.appendChild( fragment );
									
							},
							dataNoteHeader = function(){
								
								let name = scope.ucFirst( dataBaby.name.toLowerCase() ),
								
								age = scope.timeUnitBetween( new Date(), scope.stringToDate( dataBaby.birthdate ) ),
								
								ageStr = ( age.year !== 0 ? age.year+" Tahun " : "" ) +
								 ( age.month !== 0 ? age.month+" Bulan " : "" ) +
								 ( age.week !== 0 ? age.week+" Minggu " : "" ) +
								 ( age.day !== 0 ? age.day+" Hari" : "" ),
								 
								avaCnt = obj.dataStorage.avatar.filter(function( item ){
									
									return item.babyId === dataBaby.id;
								}),
								
								avaImg =  ( avaCnt.length ? avaCnt[0].base64Img : "2d/family.png" ); //assets/
								 
								let selectMeasurment = obj.dataStorage.layoutState.resumeMeasurement;
								 
								domHeader({
									name : name,
									age : ageStr,
									avaImg : avaImg,
									selectMeasurment : selectMeasurment
								});
							},
							 
							domMeasurements = function( params ){
								
								let fragment = scope.stringToHtml5Template(
									'<div class="swiper-wrapper ">'+
									'	<div class="swiper-slide">'+
									'		<div class="profile-wrapbox">'+
									'			<ul class="list-inline">'+
									'				<li class="">Berat Badan</li>'+
									'				<li class="weight-icon"></li>'+
									'				<li>'+
									'					<div class="profile-text-detail">'+ ( params.latestWfa ? params.latestWfa +"<abbr>Kg</abbr>" : "--" )+'</div> '+
									'				</li>'+
									'			</ul>'+
									'		</div>'+
									'	</div>'+
									'	<div class="swiper-slide">'+
									'		<div class="profile-wrapbox">'+
									'			<ul class="list-inline">'+
									'				<li class="">Tinggi Badan</li>'+
									'				<li class="height-icon"></li>'+
									'				<li>'+
									'					<div class="profile-text-detail">'+ ( params.latestLhfa ? params.latestLhfa +"<abbr>Cm</abbr>" : "--" )+'</div> '+
									'				</li>'+
									'			</ul>'+
									'		</div>'+
									'	</div>'+
									'	<div class="swiper-slide">'+
									'		<div class="profile-wrapbox">'+
									'			<ul class="list-inline">'+
									'				<li class="">IMT</li>'+
									'				<li class="scale-icon"></li>'+
									'				<li>'+
									'					<div class="profile-text-detail">'+ ( params.latestBmi ? params.latestBmi : "--" )+'</div> '+
									'				</li>'+
									'			</ul>'+
									'		</div>'+
									'	</div>'+
									'	<div class="swiper-slide">'+
									'		<div class="profile-wrapbox">'+
									'			<ul class="list-inline">'+
									'				<li class="">Lingkar Kepala</li>'+
									'				<li class="ruler-icon"></li>'+
									'				<li>'+
									'					<div class="profile-text-detail">'+ ( params.latestHc ? params.latestHc +"<abbr>Cm</abbr>" : "--" )+'</abbr></div> '+
									'				</li>'+
									'			</ul>'+
									'		</div>'+
									'	</div>'+
									'	<div class="swiper-slide">'+
									'		<div class="profile-wrapbox">'+
									'			<ul class="list-inline">'+
									'				<li class="">Lingkar Lengan</li>'+
									'				<li class="measure-icon"></li>'+
									'				<li>'+
									'					<div class="profile-text-detail">'+ ( params.latestAfa ? params.latestAfa +"<abbr>Cm</abbr>" : "--" )+'</div> '+
									'				</li>'+
									'			</ul>'+
									'		</div>'+
									'	</div>'+
									'</div>'
									
								)
								
								//append
								measureCnt.appendChild( fragment );
								
								stateTimer.measureSwiper = new Swiper('.profile-measuring-detail', {
									observer: true,
									observeParents: true,
									slidesPerView: 2,
									spaceBetween: 0,
									touchRatio: 0,
									initialSlide: obj.dataStorage.layoutState.resumeMeasurement
								})
								
							},
							dataNoteMeasurments = function(){
								 
								let wfa = shortArr( obj.storageFilter( obj.dataStorage.wfa ) ),
								latestWfa = wfa.length ? parseFloat( wfa[0].weight ).toFixed(2) : "",
								 
								lhfa = shortArr( obj.storageFilter( obj.dataStorage.lhfa ) ),
								latestLhfa = lhfa.length ? parseFloat( lhfa[0].height ).toFixed(2) : "",
								  
								bmi = shortArr( obj.storageFilter( obj.dataStorage.bmi ) ),
								latestBmi = bmi.length ? parseFloat( bmi[0].bmi ).toFixed(2) : "",
								  
								hc = shortArr( obj.storageFilter( obj.dataStorage.hc ) ),
								latestHc = hc.length ? parseFloat( hc[0].hc ).toFixed(2) : "",
								   
								afa = shortArr( obj.storageFilter( obj.dataStorage.afa ) ),
								latestAfa = afa.length ? parseFloat( afa[0].arm ).toFixed(2) : "";
								    
								   
								    
								domMeasurements({
									latestWfa : latestWfa,
									latestLhfa : latestLhfa,
									latestBmi : latestBmi,
									latestHc : latestHc,
									latestAfa : latestAfa
								})
								
							},
							
							domContent = function( params ){
								
								let fragment = scope.stringToHtml5Template(
									'<li> '+
									'	<ul class="list-inline ">'+
									'		<li class="modal-list left"> '+
									'			<div class="container-checkbox medium bg-white bg-size-100 bg-opacity-07 '+ params.icon +' centerdiv">'+
									'			</div>'+
									'		</li>'+ 
									'		<li class="modal-list right"> '+
									'			<ul class="list-inline modal-list-container centerdiv">'+
									'				<li class="semibold font11"> '+
															params.text +
									'				</li>'+
									'				<li class="light"> '+
														params.timeSince +
									'				</li>'+
									'			</ul>'+
									'		</li>'+
									'	</ul>'+
									'</li>' 
								)
								 
								container.appendChild( fragment ); 
								 
							},
							dataNoteFn = function( dataNote, index ){
								
								if( dataNote.babyId === dataBaby.id ){
									
									if( obj.loadMore.marker( "resume", main, dataNote, index ) ){
										 
										let time = scope.timeSince( scope.stringToDate( dataNote.date ) )
										
										domContent({  
											text : dataNote.text,
											icon : dataNote.icon,
											timeSince : time
										});
										
									}
									
									dataEmpty = false;
								}
								
							}
							
							
							 
							if( !objectInitial ){
									
								/*clear*/
								header.innerHTML = "";
							
								measureCnt.innerHTML = "";
							
								container.innerHTML = "";
							  
								//reset loadmore
								obj.loadMore.state.resume.reset();
							 	
								 
								//dom create
								dataNoteHeader();
								
								dataNoteMeasurments();
							
							}	 
						
							//first call or another call example save, -- generate content html 
							data.forEach(function( dataNote, index ){
								 
								dataNoteFn( dataNote, index ); 		
							});
								
								 
							
							 
							scope[ dataEmpty ? "removeClass" : "addClass" ]( containerEmpty,  "hidden" )
							scope[ dataEmpty ? "addClass" : "removeClass" ]( container, "hidden" )
						
							 
							
							
							  
							//trigger modal photo cropper
							 
							let triggerBtn = scope.qs("profile-pict");
							
							scope.attachListener( triggerBtn, 'click', function(){
								 
								/*
								if( dataBaby.relative === "Profesional" || 
								obj.dataStorage.babiesData.length > 3 ){
									
									let fragment = scope.stringToHtml5Template(
										'<span class="semibold center-text"> Aplikasi untuk sementara membatasi pergantian gambar profile untuk profesional atau data balita lebih dari 3 pengguna </span>'
									);
									 
									obj.modalMenu.menuError.update( fragment );
								}else{
								*/		 
									//popup modal 
									obj.modal.avatar.triggerFn();
								
								//}
								
							})
							
							//button measurements
							let btnMeasurements = scope.slice( scope.qs("profile-measuring-cnt").querySelectorAll("li") );
							
							btnMeasurements.forEach(function( btn, index ){
								
								scope.attachListener( btn, 'click', function( index ){ 
								 
									let objEl = this;
								 
									btnMeasurements.forEach(function( objBtn ){
										
										scope.removeClass( scope.getFirstChild( objBtn ), "select" )
										
									})
									
									obj.storageState({ 
										storageState : "layoutState",
										objState : "resumeMeasurement",
										value : index
									},
									function(){
										 
										stateTimer.measureSwiper.slideTo( index, 300 );
										
										scope.addClass( scope.getFirstChild( objEl ), "select" );
									
									}) 
								
								}.bind( btn, index ))
								
							})
							
						},
						wonderWeeks :  function( objectInitial ){
							let leap = global.wonderWeeks.render,
							leapText = global.wonderWeeks.leap,
							leapSelect = stateFirstload.leapSelect,
							containerLeap = scope.qs("wonder-box"),
							containerLeapFront =  scope.qs("profile-wonder"),
							leapActive = obj.dataStorage.layoutState.leapActive, 
							leapSwitch = obj.dataStorage.layoutState.leapSwitch,
							toogleLeap = scope.qs("switch-toggle-leap"),
							btnFaq = scope.qs("btn-wonder-faq"),
							btnLeap = scope.qs("btn-wonder-leap"),
							switchTo = leapSwitch === "month", // month or date
							dom = function(){
								 								
								let renderLeap = !leapSelect.length ? [] : 
									leapSelect && leapSelect.length === 1 ? leapText[ leapSelect[0] - 1 ].groupWeek :
									leapSelect ,//[1,2,3,4,5,6,7,8,9,10,11,12],
								string = "",  
								leapSelectActive = renderLeap.length >= 1 && renderLeap.length <= 2,
								textDiff = "",
								leapActiveOrNot = false,
								leapActiveIndex = false,
								birthDate = scope.stringToDate( dataBaby.birthdate ),
								age = scope.getMinutesHourDayOrWeekBetweenDates( new Date(), birthDate, "day" ),
								modAge = age % 7,
								isBoy = 
								ageStr =  Math.floor( age / 7 )+" Minggu, "+modAge+" Hari";
									 
								//generate untuk leap aktif saja 
								for ( var ii = 0, len = leap.length; ii < len; ii++ ) {
									
									let objLeap = leap[ii],
									weekStartInDay = objLeap.weekStart * 7,
									endWeekInDay = objLeap.endWeek * 7, 
									markGreyStart = objLeap.markGreyStart,
									markGreyEnd = objLeap.markGreyEnd, 
									markGreyStartB = objLeap.markGreyStartB,
									markGreyEndB = objLeap.markGreyEndB,
									leapActive = "",
									diff = "";
									leapName = ["pertama","kedua","ketiga","keempat","kelima","keenam","ketuju","kedelapan","kesembilan","kesepuluh"];
									
									if( age >= weekStartInDay && age <= endWeekInDay ){
										 
										//leap mana yang aktif
										//leap pertama
										
										if( age >= markGreyStart && age <= markGreyEnd ){

											textDiff = "Si kecil sekarang berada di lompatan "+ leapName[ objLeap.leap[0] - 1 ];
											
											leapActiveOrNot = true;
											
											leapActiveIndex = objLeap.leap[0] - 1;
											
										}else if( age >= markGreyStartB && age <= markGreyEndB ){
																				
										//leap mana yang aktif
										//leap pertama
													
											textDiff = "Si kecil sekarang berada di lompatan "+ leapName[ objLeap.leap[1] - 1 ];
											
											leapActiveOrNot = true;
											
											leapActiveIndex = objLeap.leap[0] - 1;
											
										} else if( age < markGreyStart || age < markGreyStartB ){
											
											//cek apakah age berada pada tidak di leap 
											//pada groupWeek yang aktif
											   
											if( age < markGreyStart ){
												
												diff = markGreyStart - age;
												
												leapActive =  leapName[ objLeap.leap[0] - 1 ];
												
											}else if( age < markGreyStartB ){
												
												diff = markGreyStartB - age;
												
												leapActive =  leapName[ objLeap.leap[1] - 1 ];
											}
											
											textDiff = diff +" hari lagi untuk menuju lompatan "+leapActive
											 
										}else if( leap[ii + 1] ){
											
											let nextLeap = leap[ii + 1];
											markGreyStartNext = nextLeap.markGreyStart;
											
											if( age < markGreyStartNext ){
												
												diff = markGreyStartNext - age;
												
											}
 										
											textDiff = diff +" hari lagi untuk menuju lompatan "+ leapName[ nextLeap.leap[0] - 1 ]

										 
										};
										 
										//push leap yg aktif
										!renderLeap.length && renderLeap.push( objLeap.groupWeek );
										break
									}
									
								} 
								
								
								
								//dom 
								scope.text( scope.qs("leap-age-str"), ageStr );
								
								//leap aktif
								scope.text( scope.qs("leap-active"), textDiff );
								
								//hide saja kalau leap tidak aktif behaviour dan skillnya	
								scope[ leapActiveOrNot || leapSelectActive ? "removeClass" : "addClass" ]( scope.qs("behaviour-box") ,  "hidden" )
								scope[ leapActiveOrNot || leapSelectActive ? "removeClass" : "addClass" ]( scope.qs("skill-box"), "hidden" )
								
								scope[ !leapSelectActive ? "removeClass" : "addClass" ]( scope.qs("leap-box") ,  "hidden" )
								scope[ !leapSelectActive ? "removeClass" : "addClass" ]( scope.qs("age-box"), "hidden" )
								
								//leap aktif digenerate dari modal menu 
								if( leapActiveOrNot || leapSelectActive ){ 	 
									
									scope.text( scope.qs("leap-behaviour"), leapText[ ( leapSelectActive ? leapSelect[0] - 1 : leapActiveIndex ) ].behaviour )
									scope.text( scope.qs("leap-skill"), leapText[ ( leapSelectActive ? leapSelect[0] - 1 : leapActiveIndex ) ].skill )
								}
											
											
								//leap berakhir
								//render semua saja
								if( age >= 588 ){
									
									renderLeap = [1,2,3,4,5,6,7,8,9,10,11,12];
										
										
									//leap aktif
									scope.text( scope.qs("leap-active"), "Bayi telah melewati semua lompatan" );
								}
											
								//untuk merender leap visual 
								renderLeap.forEach(function( renderVal ){
									
									for ( var ii = 0, len = leap.length; ii < len; ii++ ) {
										
										if( leap[ii].groupWeek === renderVal ){
											
											let activeLeap = leap[ii],
											weekStart = activeLeap.weekStart,
											weekStartInDay = weekStart * 7,
											markGreyStart = activeLeap.markGreyStart,
											markGreyEnd = activeLeap.markGreyEnd,
											markPurpleStart = activeLeap.markPurpleStart,
											markPurpleEnd = activeLeap.markPurpleEnd,
											markGreyStartB = activeLeap.markGreyStartB,
											markGreyEndB = activeLeap.markGreyEndB,
											rainyDay = activeLeap.rainy,
											sunnyDay = activeLeap.sunny,
											rainyDayB = activeLeap.rainyB,
											sunnyDayB = activeLeap.sunnyB;
											
											cloneBirthDae = new Date( birthDate );
											
											cloneBirthDae.setDate( cloneBirthDae.getDate() + (  ( leap[ii].groupWeek - 1 ) * 7 * 7 ) )
											//render
											
											string += '<div class="group-weeks '+ leapSwitch +'">';
													
											for ( var jj = 0; jj < 7; jj++ ) {
												
												//render week
												string += '<div class="week">';
														
													for ( var kk = 0; kk < 7; kk++ ) {

														//render day dengan marker grey 
														let markerGrey = ( ( weekStartInDay >= markGreyStart
															&& weekStartInDay <= markGreyEnd ) ||
															
														( weekStartInDay >= markGreyStartB
															&& weekStartInDay <= markGreyEndB ) ) ? "mark grey" : "";
													
														let markerPurple = ( weekStartInDay >= markPurpleStart
															&& weekStartInDay <= markPurpleEnd ) ? "mark purple" : "";
													 
															//render day 
														string += '<div class="day '+ markerGrey +' '+ markerPurple +'" label-day="'+ weekStartInDay +'">';
																													
														if( weekStartInDay === rainyDay ||  weekStartInDay === rainyDayB ) 
															string += '<div class="point-icon rain-icon bg-size-80 bg-position-bottom"></div>';
														
														if( weekStartInDay === sunnyDay || weekStartInDay === sunnyDayB ) 
															string += '<div class="point-icon sun-icon bg-size-100 bg-position-bottom"></div>';
															
														if( weekStartInDay === age )
															string += '<div class="point-day"> <div class="baby-box baby-boy-icon bg-size-80"></div> </div> ';
															
														string +=  '</div>'; 															

														weekStartInDay++;
														
													}
													
													//render week count / date
													
													let weekCount = switchTo ? weekStart : scope.dateToYMD( cloneBirthDae, "", "", "", "" );
													
													string += '<div class="week-count '+ ( switchTo ? "" : "rotate-text" ) +'">'+ weekCount +'</div>';

													weekStart++;
													
													cloneBirthDae.setDate( cloneBirthDae.getDate() + 7 );
													 
													if( jj === 6 ){ 
													
														let weekCount = switchTo ? weekStart : scope.dateToYMD( cloneBirthDae, "", "", "", "" );
													
														string += '<div class="week-count right '+ ( switchTo ? "" : "rotate-text" ) +'">'+ weekCount +'</div>';
 
													}
													
												string += '</div>'
												
											}	
												
											string += '</div>'
											
											break;
										}
										 
									}
 									
								})
								
								
								let fragment = scope.stringToHtml5Template( 
									string
								)

								containerLeap.appendChild( fragment ); 
								
								

								// frament rincian
								
								if( !objectInitial ){
								
									containerLeapFront.innerHTML = "";
									
									let fragmentForFront = scope.stringToHtml5Template( 
										string
									)
									
									containerLeapFront.appendChild( fragmentForFront );
								 
								}
								
								//leap telah berakhir
								if( age > 588 ){ // 588 / 84Mgg
									 
									scope.addClass( containerLeapFront.parentNode, "hidden" )
									
									scope.removeClass( scope.qs("profile-log-cnt"), "border-top" )
								}else{
									
									
									scope.removeClass( containerLeapFront.parentNode, "hidden" )
									
									scope.addClass( scope.qs("profile-log-cnt"), "border-top" )
									
								}
								
							},
							toggle = function( element, firstLoad ){
										
								let switchText = scope.slice( scope.nthParent( element, 2 ).querySelectorAll(".switch-text") );
								  
								if( firstLoad ){
									  
									toogleLeap[ ( switchTo ? "setAttribute" : "removeAttribute" )]("checked", true )
							
									switchText.map(function( el ){
										scope.removeClass( el, "active" )
									})
									 
									scope.addClass( switchText[ switchTo ? 1 : 0 ], "active" )
								
								}else{ 
									 
									obj.storageState({ 
										storageState : "layoutState",
										objState : "leapSwitch",
										value :  element.checked ? "month" : "date" 
									},
									function(){}) 
									  
									
									setTimeout(function(){
										
										switchText.map(function( el ){
											scope.removeClass( el, "active" )
										})
										
										obj.main.wonderWeeks( {} )
										  
										scope.addClass( switchText[ switchTo ? 0 : 1 ], "active" )
										
									},300)
								}
							};
							
							
							containerLeap.innerHTML = "";
							
							//switch wonder weeks month or date
								
							!objectInitial && toggle( toogleLeap, true )
							
							var elClone = toogleLeap.cloneNode(true);
							toogleLeap.parentNode.replaceChild( elClone, toogleLeap );
							scope.attachListener( elClone, 'click', function(){
								 
								toggle( this )
								
							})
							 
							dom();
							
							if( !stateFirstload.wonderState ){
								
								scope.attachListener( btnFaq, 'click', function(){
									 
									obj.modal.behaviour.openFadeIn("wonder-weeks-faq"); 										  
								});
								
								scope.attachListener( btnLeap, 'click', function(){
									  
									obj.modalMenu.behaviour.openFadeIn("modal-menu-leap");
								});
								
								stateFirstload.wonderState = true
							}
							
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
									
									elementSelect.setAttribute( "maxLength", elementOrigin.getAttribute("maxLength") )
																
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
							openModal : function( string, params ){
								
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
							openFadeIn : function( string, params ){
								
								this.openModal( string, params )
								
							},
							openModalFadeIn  : function( string, params ){
								
								this.openModal( string, params )
								
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
								
								obj.modalMenu.behaviour.openFadeIn("modal-menu-memo")
								 
							})
							
							/**
								tracker time range  
							*/ 
							scope.attachListener( btnTrackRange, 'click', function(){
								
								obj.modalMenu.behaviour.openFadeIn("modal-menu-tracker-range")
								  
							}) 
							
							/**
								tracker activity 
							*/ 
							scope.attachListener( btnTrackerActivity, 'click', function(){
								
								obj.modalMenu.behaviour.openFadeIn("modal-menu-tracker")
							
							}) 
						},
						trackerAlert : function(){
							let btnBack = scope.qs("modal-menu-tracker-unselect").querySelector(".back-button");
							
							scope.attachListener( btnBack, 'click', function(){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
							},
							show : function (){
									
								obj.modalMenu.behaviour.openFadeIn("modal-menu-error")
							 
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
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
										
										if( !state ){
											//hidden modal wfa
											scope.removeClass( scope.qs("modal"), "open" );
											
											scope.addClass( scope.qs("modal"), "close" );
											
											scope.addClass( scope.qs("modal"), "hidden" );
										}	
									}
								})
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalWfa" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.wfaState.wfaUpdate, function(){
										
									//update dataStorage
									obj.chart.weightForAge.init();
									
									//reupdate chart 
									obj.chart.weightForAge.create();

									scope.addClass( scope.qs("modal-weightforage"), "hidden" )
									
									closeMenuModalFn();
									
								});
						
							})  
							
						},
						menuSwitchGraph : function(){
							let modal = scope.qs("modal-switch-graph"),
							btnBack = modal.querySelector(".back-button"),
							btnWfa = scope.qs("wfa-switch-graph"),
							btnBmi =  scope.qs("bmi-switch-graph"),
							btnHc =  scope.qs("hc-switch-graph"),
							btnLh =  scope.qs("lh-switch-graph"),
							btnAfa =  scope.qs("afa-switch-graph"),
							btnGroup = [ btnWfa, btnBmi, btnHc, btnLh, btnAfa ],
							objState = [ "wfaSwitch", "bmiSwitch", "hcSwitch", "lhSwitch", "armSwitch"  ],
							spanButtons = scope.slice( scope.qsAll("modal-switch-graph span") ),
							radioButtons = scope.slice( scope.qsAll("modal-switch-graph abbr") ),
							closeMenuModalFn = function( callback ){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									},
									end : function(){
										
										callback()
									}
								})
							};
							
							/*
							trigger btn
							*/
							scope.attachListener( btnGroup.slice(), 'click', function(){
								  
								obj.modalMenu.behaviour.openFadeIn("modal-switch-graph");
								 
							});
							 
							
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
									
									let self = this,
									index = obj.dataStorage.layoutState.activeSwiperChart.index;
									 
									radioButtons.map( function( abbrObj ){
										
										abbrObj.innerHTML = "";
									})
									
									let ins = document.createElement("ins"),
									
									label = parseInt( self.getAttribute("label") ),
									 
									el = scope.getFirstChild( self );

									ins.className = "checked";

									el.appendChild( ins );

									closeMenuModalFn(function(){
										
										radioButtons.map( function( abbrObj ){
											
											abbrObj.innerHTML = "";
										})
									}); 
									
									scope.text( btnGroup[ index ], self.getAttribute("label-text") );
									
									
									obj.storageState({ 
										storageState : "layoutState",
										objState : objState[index],
										value : label
									},
									function(){
												
										switch ( index ){
											
											case 0 :
														
												obj.chart.weightForAge.init();
											
												obj.chart.weightForAge.create();
											
												break;
												
											case 1 :
													
												obj.chart.bmiForAge.init();
											
												obj.chart.bmiForAge.create();
											
												break;
												
											case 2 :
													
												obj.chart.hcForAge.init();
											
												obj.chart.hcForAge.create();
											
												break;	
												
											case 3 :
													
												obj.chart.lhForAge.init();
											
												obj.chart.lhForAge.create();
											
												break;	
											
											case 4 :
													
												obj.chart.armForAge.init();
											
												obj.chart.armForAge.create();
											
												break;		
										}
												
							
									}) 
									
								})								
							}) 
						
						},
						menuBmi : function(){
							let btnBack = scope.qs("modal-menu-bmi").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-bmi").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
										
										if( !state ){
											//hidden modal bmi
											scope.removeClass( scope.qs("modal"), "open" );
											
											scope.addClass( scope.qs("modal"), "close" );
											
											scope.addClass( scope.qs("modal"), "hidden" );
										}	
									}
								})
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalBmi" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.bmiState.bmiUpdate, function(){
										 
									//update obj.dataStorage
									obj.chart.bmiForAge.init();
									
									//reupdate chart 
									obj.chart.bmiForAge.create();
									
									scope.addClass( scope.qs("modal-bmiforage"), "hidden" )
									
									closeMenuModalFn();
									
								});
								
							})  
							
						},
						menuHc : function(){
							let btnBack = scope.qs("modal-menu-hc").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-hc").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
										
										if( !state ){
											//hidden modal hc
											scope.removeClass( scope.qs("modal"), "open" );
											
											scope.addClass( scope.qs("modal"), "close" );
											
											scope.addClass( scope.qs("modal"), "hidden" );
										}	
									}
								})
							};;
							
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
						menuLhfa : function(){
							let btnBack = scope.qs("modal-menu-lhfa").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-lhfa").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
										
										if( !state ){
											//hidden modal lhfa
											scope.removeClass( scope.qs("modal"), "open" );
											
											scope.addClass( scope.qs("modal"), "close" );
											
											scope.addClass( scope.qs("modal"), "hidden" );
										}	
									}
								})
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalLhfa" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.lhfaState.lhfaUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.lhForAge.init();
									
									//reupdate chart 
									obj.chart.lhForAge.create();

									scope.addClass( scope.qs("modal-lhfa"), "hidden" )
									
									closeMenuModalFn();
								});
						
							})  
							
						},
						menuAfa : function(){
							let btnBack = scope.qs("modal-menu-afa").querySelector(".back-button"),
							sendBack = scope.qs("modal-menu-afa").querySelector(".send-button"),
							closeMenuModalFn = function( state ){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
										
										if( !state ){
											//hidden modal afa
											scope.removeClass( scope.qs("modal"), "open" );
											
											scope.addClass( scope.qs("modal"), "close" );
											
											scope.addClass( scope.qs("modal"), "hidden" );
										}	
									}
								})
							};;
							
							scope.attachListener( btnBack, 'click', function(){
								
								closeMenuModalFn( "noModalAfa" );
							}) 
							
							scope.attachListener( sendBack, 'click', function(){
								
								obj.storageCrud( obj.dataStorage.afaState.afaUpdate, function(){
										
									//update obj.dataStorage
									obj.chart.armForAge.init();
									
									//reupdate chart 
									obj.chart.armForAge.create();

									scope.addClass( scope.qs("modal-afa"), "hidden" )
									
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
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
						menuLeapOptions : function(){
							let btnBack = scope.qs("modal-menu-leap").querySelector(".back-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-leap span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-leap abbr") ),
							closeMenuModalFn = function(){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
									
									let ins = document.createElement("ins"),
									
									label = self.getAttribute("label"),
									
									leapSelect = label === "all" ? 
										[1,2,3,4,5,6,7,8,9,10,11,12] : 
										label === "" ? [] : [ parseInt( label ) ],

									el = scope.getFirstChild( self );

									ins.className = "checked";

									el.appendChild( ins );

									closeMenuModalFn(); 
									
									scope.text( scope.qs("btn-wonder-leap"), self.getAttribute("label-text") );
									
									stateFirstload.leapSelect = leapSelect;
									
									obj.main.wonderWeeks( true ) 
									/*
										//create checked radio button 

										obj.main.tracker() 
									*/
									
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
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
									el = scope.getFirstChild( this ),
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
									
									ins.className = "checked";
									
									el.appendChild( ins );
									    
									 
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
												
												obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-remainder");
												
											}
										})  
										     
										stringDate = "selected-date";  
										
										if( self.state.remainder ){
											
											/**
												Plugin datepicker
											***/  
											
											let pluginRemainder = scope.qs("plugin-datepicker-remainder"),
											datepickerRemainder = scope.qs("datepicker-remainder"),
											pluginBack = pluginRemainder.querySelector(".back-button"),
											pluginSend = pluginRemainder.querySelector(".send-button"), 
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
														
														obj.modalMenu.behaviour.openFadeIn("modal-menu-remainder");
														
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
															
															obj.modalMenu.behaviour.openFadeIn("modal-menu-remainder");
															
														}
													}) 
													
													dateNow = dateSelect;
													
													picDateNotifyFn()
													
												}else{
													
													let fragment = scope.stringToHtml5Template(
														'<span class="center-text semibold"> Apakah tanggal yang dipilih telah kadaluarsa ? </span>'
													);
													 
													obj.modalMenu.menuError.update( fragment );
													
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
									
									picDateNotifyFn();
									  
								}.bind( objListMenu, index ))								
							}) 
						
						},
						menuGenderBaby : function(){
							
							let btnBack = scope.qs("modal-menu-gender-baby").querySelector(".back-button"),
							spanButtons = scope.slice( scope.qsAll("modal-menu-gender-baby span") ),
							radioButtons = scope.slice( scope.qsAll("modal-menu-gender-baby abbr") ),
							closeMenuModalFn = function(){
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
								
								scope.removeClassTransform( scope.qs("modal-menu"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal-menu"), "open" );
									}
								})
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
							openModal : function( string, params ){
								
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
								
								this.openModal( string, params )
								
							},
							openModalFadeIn  : function( string, params ){
								this.openModal( string, params )
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
								 
									objEl.setAttribute("style","")
										
									let elementRect = objEl.getBoundingClientRect(),
									body = document.body.getBoundingClientRect(),
									marginBottom = elementRect.bottom - body.bottom ,
									elementHeight = elementRect.height,
									isBannerActive = obj.appConfig.ads.banner.isBannerActive ? 50 : 0;
									 
									if( marginBottom > 0 ){ 
									 
										scope.css( objEl, {
											height : elementHeight - ( Math.abs( marginBottom ) + 30  + isBannerActive  ) +"px" //30 padding top bottom // 30 look cool
										})
									}else{
										
										scope.css( objEl, {
											height : ( elementHeight  + isBannerActive  )  +"px" //30 padding top bottom // 30 look cool
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
									 
									if( !/modal-banner/i.test( objModal.className ) ){
										  
										scope.removeClass( objModal, "open" );
										scope.addClass( objModal, "hidden" )
										
									}
									
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
								
								//user behaviour 
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
							bmi : true,
							hcage : true,
							lhfaAge : true,
							afa : true,
							vaccine : true
						},
						triggerModals : function(){
							let btnRemainder = scope.qs("notify-button"),
							btnMemo = scope.qs("memo-button"),
							btnTrack = scope.qs("tracking-button"),
							btnTrackPolar = scope.getLastChild( scope.qs("polar-visual-button") ),
							btnBabyList = scope.qs("header-menu > li:first-child div"),
							growthChart = scope.qs("growth-button"),
							btnVaccine = scope.qs("vaccine-button");
							 
							
							scope.attachListener( btnVaccine, 'click', function(){
								
								obj.modal.behaviour.openFadeIn("vaccine-new")
								 
							})
							
							
							scope.attachListener( btnBabyList, 'click', function(){
								 
								obj.modal.behaviour.openFadeIn("modal-other-list");
								  
							})
							
							
							scope.attachListener( btnTrack, 'click', function(){
								
								obj.modal.behaviour.openFadeIn("modal-tracker-new")
								 
							})
							
							scope.attachListener( btnTrackPolar, 'click', function(){
								
								obj.modal.behaviour.openModalFadeIn("modal-tracker-chart", {
									// inital polar chart
									end : function(){ 
										
										
										obj.chartActivity.generateChart(); 
									}
									
								})
								
							})
							
							
							scope.attachListener( btnRemainder, 'click', function(){
								 
								obj.modal.behaviour.openFadeIn("modal-babyremainder");
								
							})
							 
							scope.attachListener( btnMemo, 'click', function(){
								 
								obj.modal.behaviour.openFadeIn("modal-memo");	
							   
							})
							 
							
							scope.attachListener( growthChart, 'click', function(){
								
								let index = obj.dataStorage.layoutState.activeSwiperChart.index;
								  
								switch( index ){
									
									case 0 :  //estimation fetus weight
											 
										obj.modal.behaviour.openModalFadeIn("modal-weightforage") 	 
										 
										break;
									
									case 1 :
											 
										obj.modal.behaviour.openModalFadeIn("modal-bmiforage") 	 
										 	 
										break
										
									case 2 :
										 
										obj.modal.behaviour.openModalFadeIn("modal-hcforage") 	 
										  
										break;
										
									case 3 :
									 
										obj.modal.behaviour.openModalFadeIn("modal-lhfa") 	 
										   
										break;
										
									case 4 :
									 	 
										obj.modal.behaviour.openModalFadeIn("modal-afa") 	 
										  
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
								 
									
									//clone semua image ke foloder kmsphoto lalu simpan
								
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
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									},
									end : function(){
										
										obj.main.remainderBackDetail();
									}
								})
								
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
									 
									//corodva register notification
									obj.cordova.notification.cancel({
										id: data.cordovaId
									})  
									
									obj.main.remainder();
								 
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									
									
								}); 
								 
							})
						},
						remainderDetail : function(){
							let btnBack = scope.qs("modal-remainder-detail").querySelector(".back-button"),
							deleteBack = scope.qs("modal-remainder-detail").querySelector(".send-button");
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									}
								})
								
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
								 
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									},
									end : function(){
										
										obj.main.remainderDeleteConfirm()
									}
								})
								
							})
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
								
								scope.addClass( elTimeEnd, "hidden" );
								
							}) 
							
							 
							/**
								bind modal-input to textarea
							*/
							obj.modalInput.bindToKeyup( textareas[0], "textarea" );
							 
							 
							/**
								trigger to modal-menu
							*/  
							scope.attachListener( scope.sibling( inputs[0], "next" ), 'click', function(){
								 		
								obj.modalMenu.behaviour.openFadeIn("modal-menu-remainder")
							   
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
											
										closeModalFn();  
										
										//generate content
										obj.main.remainder();
										 
										//corodva register notification
										obj.cordova.notification.schedule({
											id: objNotify.cordovaId,
											title : "KMS Balita dan bunda",
											text : text,
											trigger : dateTimeEnd,
											stringDate : stringDate,
											loop : loop
										}) 
										 
										//console.log( elTimeEnd )
										
										elTimeEnd && scope.addClass( elTimeEnd, "hidden" );
										
									})
									  
								}
								 
							})
							
						},
						trackerDeleteConfirm : function(){
							let btnBack = scope.qs("modal-tracker-confirm").querySelector(".back-button"),
							btnConfirm = scope.qs("modal-tracker-confirm").querySelector(".send-button");
							
							/* close */
							scope.attachListener( btnBack, 'click', function(){
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									},
									end : function(){
										
										obj.main.trackerBackDetail();
									}
								})
								
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
									
									obj.main.tracker(); // update
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									
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
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									}
								})
								 
								
							})
							
							/*
								delete
							**/
							scope.attachListener( deleteBack, 'click', function(){
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									},
									end : function(){
										
										obj.main.trackerDeleteConfirm()
									}
								})
								
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

										obj.modalMenu.behaviour.openFadeIn("modal-menu-tracker-unselect");
									 
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
												 
											elSelect && scope.removeClass( elSelect, "select" );
												 
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
						trackerChart : function( initial ){
							let btnBack = scope.qs("modal-tracker-chart").querySelector(".back-button");
							/*
								close
							**/
							if( !initial ){ //first load
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" ); 
										}
									})
									
								});
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
										obj.modal.behaviour.openFadeIn("modal-tracker-cat-new"); 
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
										
										//console.log( index )
										
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
												obj.modal.behaviour.openFadeIn("modal-tracker-new"); 
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
										obj.modal.behaviour.openFadeIn("modal-tracker-new"); 
									}
								});
								
							})
								
							 
							
							 
						},
						screeningRecord : {
							capture : [],
							title : "",
							screenType : "",
							update : function( params ){
								
								let self = this,
								main = scope.qs("screen-recorded-capture"),
								container = main.querySelector(".modal-content.schedule"),
								elModalDetail = scope.qs("skrining-c-detail"),
								questionerScreening =  function(){
									  
									for( let ii of  global.praSkrining ){
										 
										if( ii.title.toLowerCase() === params.initial ){
											
											
											return ii;
										}
										
									}
									   
									
								}(),
								questionerContent = questionerScreening.content[ parseInt( params.index ) ],
								title = questionerScreening.title,
								detail = questionerScreening.detail,
								age = questionerContent.age,
								questionerDom = function( params ){
									 
									let bannerClass = obj.appConfig.ads.banner.isBannerActive ? "banner" : "";
									
									self.title = title;
									
 									self.age = age[0]+""+age[1];
									
									self.screenType = title+""+age[0]+""+age[1];
									
									self.capture = [];
									
									while( self.capture.length < questionerContent.list.length ) 
										self.capture.push(""); 
									
									
									scope.text( elModalDetail, detail )
									 
									let fragment =  scope.stringToHtml5Template(
										'<div class="screen-swiper-questioner">' +
										'	<div class="swiper-wrapper">'+
												//swiper container
												function(){
													
													let string = "",
													btnType = questionerScreening.options.length;
													
													questionerContent.list.forEach(function( objQuest, index ){
													 
													   string+= '<div class="swiper-slide"> ' +
																'	<div class="modal-content-wrap p0 " style="width:100%">	 ' +
																'		<div class="modal-content questioner">	' +
																'		<span> <abbr class="s-slide-capture"> '+ ( index + 1 ) +' </abbr> / '+ questionerContent.list.length +' </span> ';
																
																			if( /KMME|GPPH/i.test( title ) ){
																				
													   string+= '			<span>Kegiatan yang diamati</span>';		
																				
																			}else if( title === "CHAT" ){
																				
																				
													   string+= '			<span>'+ objQuest.number +' - '+ objQuest.type +'</span>';		
																				
																			}else if( title === "KPSP" ){
																				
																				
													   string+= '			<span>'+  objQuest.type +'</span>';		
																				
																			}
																
																
													   string+= '			<p>'+
																				objQuest.quest.replace(/\n/g, "<br>") +
																'			</p>'+
																
																
																
																			'<div>' ;
																			
																			//image jika dibutuhkan
																			
																			if( objQuest.img ){
																				
																				 string+= '	<ul class="img-quest list-inline">';
																				
																				//untuk peraga satu gambar
																				if ( !( objQuest.img instanceof Array ) ){
																					
																				 string+= 	'		<li> ' +
																							'			<span> Contoh</span>' +
																							'			<div>' +
																							'				<img  src="2d/'+ objQuest.img +'">' +
																							'			</div>' +
																							'		</li>' ;
																					
																				}else if( objQuest.img.length === 2 ){
																					
																				 string+= 	'		<li>' +
																							'			<span> Gambar 1 </span>' +
																							'			<div>' +
																							'				<img  src="2d/'+ objQuest.img[0] +'">' +
																							'			</div>' +
																							'		</li>' +
																							'		<li>' +
																							'			<span> Gambar 2 </span>' +
																							'			<div>' +
																							'				<img  src="2d/'+ objQuest.img[1] +'">' +
																							'			</div>' +
																							'		</li>' ;
																					
																				}else if( objQuest.img.length === 3 ){
																					
																				 string+= 	'		<li> ' +
																							'			<span> Contoh</span>' +
																							'			<div>' +
																							'				<img  src="2d/'+ objQuest.img[0] +'">' +
																							'			</div>' +
																							'		</li>' +
																							'		<li>' +
																							'			<span> Gambar 1 </span>' +
																							'			<div>' +
																							'				<img  src="2d/'+ objQuest.img[1] +'">' +
																							'			</div>' +
																							'		</li>' +
																							'		<li>' +
																							'			<span> Gambar 2 </span>' +
																							'			<div>' +
																							'				<img  src="2d/'+ objQuest.img[2] +'">' +
																							'			</div>' +
																							'		</li>' ;
																					
																				}
																				
																				
																				
																				 string+=  ' </ul>';
																			
																			}
																			
																			
																			
																			if( btnType === 2 ){
																				
																				string+='	<ul class="btn-quest-1 list-inline ">' +
																						'		<li index="'+ index +'" label="'+ 1 +'">Ya</li>' +
																						'		<li index="'+ index +'" label="'+ 0 +'">Tidak</li>' +
																						'	</ul>';
																				
																			}else{
																				
																				 string+='	<ul class="btn-quest-2 list-inline">' +
																						'		<li index="'+ index +'" label="0">0</li>' +
																						'		<li index="'+ index +'" label="1">1</li>' +
																						'		<li index="'+ index +'" label="2">2</li>' +
																						'		<li index="'+ index +'" label="3">3</li>' +
																						'	</ul>';
																				
																			} 
																
																		
													 string+=   '			</div>'+
																'		</div>	' +
																'	</div>' +
																'</div>' 
															
													})
													
													return string
													
												}() +
										'	</div>' +
										
										'	<div class="swiper-pagination '+ bannerClass +' "></div> '+
										'</div>'
										
									)
									
									
									container.appendChild( fragment )
									
								}
								
								container.innerHTML = "";
								
								scope.text( scope.qs("screening-c-type"), title +" "+ age[0] +" ~ "+ age[1] +" Bulan" )
								
								
								questionerDom();
								
								
							
								//swiper header
								let swiperHeader = new Swiper('.screen-swiper-questioner', {
									observer: true,
									observeParents: true, 
									spaceBetween: 10,
									pagination: {
										el: '.swiper-pagination',
										dynamicBullets: true,
									},
									initialSlide: 0
								}); 
 
								//btn quest
								let questType = title !== "GPPH",
								cntEl = questType ? scope.qsAll("btn-quest-1") : scope.qsAll("btn-quest-2");
								
								scope.slice( cntEl ).forEach(function( objEl ){
									
									let btnLi = scope.slice( objEl.querySelectorAll("li") )
									
									btnLi.forEach(function( childEl ){
										
										scope.attachListener( childEl, 'click', function(e){
											
											let rebtnLi = scope.slice( this.parentNode.querySelectorAll("li") )
											
											rebtnLi.forEach(function( li ){
												
												scope.removeClass( li, "select" )
											})
											 
											scope.addClass( this, "select" )
											 
											swiperHeader.slideTo( swiperHeader.activeIndex + 1, 300 );
											
											self.capture[ parseInt( this.getAttribute("index") ) ] =  parseInt( this.getAttribute("label") ) 
 
										})
									})
								});
								
								
								
							},
							init : function(){
								
								let self = this,
								modal = scope.qs("screen-recorded-capture"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								  
								/**/ 
								scope.attachListener( btnBack, 'click', function(e){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
								})
								
								 
								scope.attachListener( btnSend, 'click', function(e){
									 
									let age = scope.timeUnitBetween( new Date(), scope.stringToDate( dataBaby.birthdate ) ),
								
									ageStr = ( age.year !== 0 ? age.year+" Thn " : "" ) +
									 ( age.month !== 0 ? age.month+" Bln " : "" ) +
									 ( age.week !== 0 ? age.week+" Mgg " : "" ) +
									 ( age.day !== 0 ? age.day+" Hr" : "" );
									 
									obj.storageCrud({ 
										dataStorage : "screening",
										type : "update",
										screenType : self.screenType.toLowerCase(),
										title : self.title,
										age : self.age,
										ageStr : ageStr,
										data : self.capture,
										result : "", 
										dateStart : new Date().toLocaleString("id-ID")
									},
									function( objNotify ){
										
										obj.modal.behaviour.closeRightToleftFadeout({
											end : function(){
												 
												obj.main.screening();
 
											}
											
										});
											
									})
								 
								})
								 
							}
						},
						screeningRecordDetail : {
							update : function( params ){
								
								let self = this,
								main = scope.qs("screen-recorded-detail"),
								container = main.querySelector(".modal-todo-list-b > li"),
								questionerScreening =  params.questionerScreening,
								questionerContent =  params.questionerContent,
								data = params.dataRecord.data,
								questionerDom = function( innerParams ){
									 
									//console.log( questionerScreening )
									 
									scope.text( scope.qs("skrining-r-text"), params.recordTot )
									
									scope.text( scope.qs("skrining-r-date"), innerParams.dateStart );
									  
									scope.text( scope.qs("skrining-r-age"), params.dataRecord.ageStr );
									
									scope.text( scope.qs("skrining-r-ans"), params.result )
									 
									scope.text( scope.qs("skrining-rd-detail"), questionerScreening.detail )
									
									scope.text( scope.qs("screening-rd-type"), params.initial.toUpperCase()+" "+params.age )
									 
									  
									let fragment =  scope.stringToHtml5Template(
										function(){
											
											let string = "",
											title = questionerScreening.title,
											isGPPH = params.initial === "gpph";
											
											questionerContent.list.forEach(function( objList, index ){
												
												let btnText = data && data[ index ] !== "" && isGPPH ?  data[ index ]  :  
													( !isGPPH && data && data[ index ] === 1 ? "Ya" :  
														(  !isGPPH && data && data[ index ] === 0  ? "Tidak" : "Blm Terdaftar" ) );
												
												string += '<div class="todo-header">' +
													'	<div class="todo-content list-inline content-collapse pt0 overflowscroll">' +
													'		<ul class="list-inline border-none">' +
													'			<li>' +
													'				<ul class="list-inline ">' +
													'					<li style="overflow:auto">' +
													'						<div class="left">' +
													'							<div class="btn-collapse pluse-black-icon bg-size-60"></div>'+
														( objList.number ? objList.number+" " : "" ) + scope.stringLimit( objList.quest, 21 ) +
													'						</div>' +
													'						<div class="right">'+ btnText +'</div>' +
													'					</li>' +
													'				</ul>' +
													'				<div class="content p0 bg-white">' +
													'					<p class="pt20 pb20"> ';
													
													
																			if( /KMME|GPPH/i.test( title ) ){
																				
													   string+= '			Kegiatan yang diamati <br><br>';		
																				
																			}else if( title === "CHAT" ){
																				
																				
													   string+=  			objList.number +' - '+ objList.type +'<br><br>';		
																				
																			}else if( title === "KPSP" ){
																				
																				
													   string+= 			objList.type +' <br><br>';		
																				
																			}
													
													   string+= 			objList.quest.replace(/\n/g, "<br>")  +' </p>' ;

																			
																			
													
										  string += '				</div>' +
													'			</li>' +
													'		</ul>' +
													'	</div>' +
													'</div>'
												
											})
											
											return string;
											
										}()
									)
									
									
									container.appendChild( fragment );
									 
									obj.generateExpandCollapse( main, true );
								},
								domFn = function(){
									
									let dateStart = params.dataRecord.dateStart ?
										scope.dateToYMD( scope.stringToDate( params.dataRecord.dateStart ), 'year'  ) :
										"Belum terdaftar";
									  
									questionerDom({
										dateStart : dateStart
									})
								};

								container.innerHTML = "";

								domFn();
							},
							init : function(){
								 
								let self = this,
								modal = scope.qs("screen-recorded-detail"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button");
								
								  
								/**/ 
								scope.attachListener( btnBack, 'click', function(e){
									
									btnSend.setAttribute("confrim", "no")
		
									scope.text( btnSend, "Hapus" )
									
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
								})
								
								scope.attachListener( btnSend, 'click', function(e){
									 
									let self = this,
									isConfirm = self.getAttribute("confrim");
									
									if( isConfirm && isConfirm === "yes" ){
										  
										obj.storageCrud({ 
											dataStorage : "screening",
											type : "delete", 
											screenType : self.getAttribute("screen-type"), 
											index : parseInt( self.getAttribute("index") )
										},
										function( objNotify ){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){
													 
													obj.main.screening();
										
													self.setAttribute("confrim", "no")
		
													scope.text( self, "Hapus" )
												}
												
											});
												
										})
										
									}else{
										
										let fragment =  scope.stringToHtml5Template('<div class="content-load-more spinner "></div>');
										
										btnSend.innerHTML = "";
										
										btnSend.appendChild( fragment );
										
										scope.delayFire(function(){
											
											self.setAttribute("confrim", "yes")
											
											self.innerHTML = "";
											
											scope.text( self, "Konfirmasi" )
											
										},2000)
									}
								})
							}
						},
						screeningDetail : {
							title : "",
							intepreter : "",
							intervensi : "",
							update : function( params ){
								 
								let self = this,
								main = scope.qs("screen-recorded-list"),
								container = main.querySelector(".modal-todo-list-b > li"),
								questionerScreening =  function(){
									  
									for( let ii of  global.praSkrining ){
										  
										if( ii.title.toLowerCase() === params.initial ){
											 
								
											return ii;
										}
										
									}
									   
									
								}(),
								questionerContent = questionerScreening.content[ parseInt( params.index ) ], 
								domListFn = function(){
									 
									scope.text( scope.qs("skrining-r-detail"), questionerScreening.detail )
									 	
									scope.text( scope.qs("screening-r-type"), params.initial.toUpperCase()+" "+params.age )
									 		 							
									let string = "";
									
																		 
										string += 	 
										
										'<div class="wrap-content-data">	'+
											
											function(){
												
												let innerString = "",
												isArr = params.dataRecord instanceof Array;
												 
												scope.text( scope.qs("skrining-r-recorded"), ( isArr ? params.dataRecord.length : '0' ) +" x" )
												
												//data rekam
												if( isArr ){
												
													params.dataRecord.forEach(function( objData, index ){
																						 
																											
														let isGPPH = objData.title.toLowerCase() === "gpph";
														result = fn.skriningCondition({ 
															data : objData.data,
															title : objData.title
														}),
														
														dateStart = scope.stringToDate( objData.dateStart ),
														  
														dateNext = params.dataRecord[ index + 1 ] ? scope.stringToDate( params.dataRecord[ index + 1 ].dateStart ) : new Date(),
														
														dateBetweenActivity = scope.timeSince( dateNext, dateStart );
	 
														//console.log( objData )
														
														if( objData.data ){
															
															// kadang data tidak terekam 
															// tidak tau masalahnya apa
															
															innerString += 
															
															'	<div class="notify-box-small">	'+
															'		<div class="bubble-box circle-'+ result.color +'-icon" style="margin-top:12px">	'+
															'			<div class="notify-strip-b"></div>	'+
															'		</div>	'+
															'		<abbr>'+ dateBetweenActivity  +'</abbr>	'+
															'		<ins class="left">	'+
															'			<span class="notify-small-title extrabold"> '+ ( isGPPH ? result.answer : result.answerTot ) +'</span>	'+
															'			<br>	'+
															'			<span class="notify-small-detail light left"> '+ objData.ageStr +'</span>	'+
															'		</ins>	'+
															'		<div class="bubble-small-left" screen-type ="'+ params.screenType +'" result="'+ result.result +'" record-tot="'+ ( isGPPH ? result.answer : result.answerTot )  +'" initial="'+ params.initial +'" age="'+ params.age +'" index ="'+ index +'" style="top:15px" ></div>	'+
															'	</div>	'
															  
														}
													})
												
												}else{
													
													innerString = '<div class="p20 center-text font14 light" style="color:rgba(0, 0, 0, 0.4)"> Belum ada rekaman </div>'
													
												}
												
												return innerString
												
											}() +
											
										'</div>'
								
												
									 
									let fragment =  scope.stringToHtml5Template( string )
									 
									container.appendChild( fragment );
									  
									//perbaru color seperti  class nofity strip
									obj.appConfig.color( true );
									
								};
								
								container.innerHTML = "";
								
								self.title = questionerScreening.title;

								self.intepreter = questionerScreening.intepreter;
								
								self.intervensi = questionerScreening.intervensi;
  
								domListFn()
								
								/*	
									tracker detail buttons
								*/
								let bubbleBtns = scope.slice( main.querySelectorAll(".bubble-small-left") );
								
								bubbleBtns.map(function( btn, index ){
									
									scope.attachListener( btn, 'click', function(){
										
										let index = parseInt( this.getAttribute("index") ),
										initial = this.getAttribute("initial"),
										recordTot = this.getAttribute("record-tot"),
										age =  this.getAttribute("age"),
										result =  this.getAttribute("result"),
										screenType =  this.getAttribute("screen-type"),
										data = params.dataRecord[ index ], 
										btnSendDetail =  scope.qs("screen-recorded-detail").querySelector(".send-button");
										
										btnSendDetail.setAttribute("index", index )
										btnSendDetail.setAttribute("screen-type", screenType )
										  
										obj.modal.behaviour.closeRightToleftFadeout({
											registerModal : "screen-recorded-list",
											end : function(){
												
												obj.modal.behaviour.openModalFadeIn("screen-recorded-detail");
												
												obj.modal.screeningRecordDetail.update({
													dataRecord : data,
													initial : initial,
													age : age,
													result : result,
													questionerScreening : questionerScreening,
													questionerContent : questionerContent,
													recordTot : recordTot
												})
												  
											}
										}) 
									})
								})
							
								 
							},
							init : function(){
							
								let self = this,
								modal = scope.qs("screen-recorded-list"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button"),
								btnA = scope.slice( modal.querySelectorAll(".button") );
								  
								/**/ 
								scope.attachListener( btnA[0], 'click', function(e){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "screen-recorded-list",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("screen-recorded-a")
											
											scope.text( scope.qs("screen-r-a"), self.intepreter );
											
										}
									}) 
								})
								  
								/**/ 
								scope.attachListener( btnA[1], 'click', function(e){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "screen-recorded-list",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("screen-recorded-b")
											
											scope.text( scope.qs("screen-r-b"), self.intervensi );
											
										}
									}) 
								})
								  
								/**/ 
								scope.attachListener( btnBack, 'click', function(e){
									 
									obj.modal.behaviour.closeRightToleftFadeout()
								})
								
								 
								scope.attachListener( btnSend, 'click', function(e){
									  
									let self = this; 
							  
									obj.modal.screeningRecord.update({
										initial : self.getAttribute("label"),
										index : self.getAttribute("index")
									})
									
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "screen-recorded-list",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("screen-recorded-capture")
											
										}
									})
									 
								}) 
							
							}
						},
						screeningIntepreter : function(){
							 
							let modal = scope.qs("screen-recorded-a"),
							btnBack = modal.querySelector(".back-button");
							  
							/**/ 
							scope.attachListener( btnBack, 'click', function(e){
								 
								obj.modal.behaviour.closeRightToleftFadeout({
									previous : true
								})
							})
							 
						},
						screeningIntervensi : function(){
							
						
							let modal = scope.qs("screen-recorded-b"),
							btnBack = modal.querySelector(".back-button");
							  
							/**/ 
							scope.attachListener( btnBack, 'click', function(e){
								 
								obj.modal.behaviour.closeRightToleftFadeout({
									previous : true
								})
							})
							
							
						},
						wonderWeeksFaq : function(){
						 
							let modal = scope.qs("wonder-weeks-faq"),
							btnBack = modal.querySelector(".back-button");
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
								
							})
							 
						},
						vaccineList : function(){
							let self = this,
							modal = scope.qs("vaccine-list"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							btnVaccineNew = modal.querySelector(".button-list-vaccine-new"),
							data = obj.dataStorage["vaccineList"],
							container =  scope.qs("vaccine-list-container"),
							dataEmpty = true,
							contentDom = function( params ){
								
								let fragment = scope.stringToHtml5Template(
									'<li class="pt0 pb0 pr10 p20" >' +
									'	<ul class="list-inline ">' +
									'		<li class="modal-list left">' +
									'			<div class="container-radio centerdiv ">' +
									//'				<div class="checked centerdiv"></div>' +
									'			</div>' +
									'		</li>' +
									'		<li class="modal-list right">' +
									'			<ul class="list-inline modal-list-container centerdiv">' +
									'				<li class="option-color semibold pl0"> '+ params.name +'</li> ' +
									'			</ul>' +
									'			<div class="todo-dot-menu">' +
									'				<div class="todo-dot-cnt-icon menu-dot-icon "></div>' +
									'				<div class="todo-dot-child-menu option-color hidden"  label-id="'+ params.id +'" name="'+ params.name +'"> Hapus </div>'+
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
							  
							 
							//first call or another call example save, -- generate content html 
							data.forEach( function( dataNote, index ){
 
								dataNoteFn( dataNote, index );   
							})	
							 
							 
						  
							/**
								bind li kedalam event click
							*/
							 
							let objBtnLi = scope.slice( container.querySelectorAll( ".border-none > li" ) );
							  
							objBtnLi.forEach(function( objLi ){ 
							 
								scope.attachListener( objLi, 'click', function( e ){
									 
									let fragment = scope.stringToHtml5Template(
										'<div class="checked centerdiv"></div>'
									),
									elSelect = modal.querySelector(".select"),
									elChecked = modal.querySelector(".checked"),
									elRadio = this.querySelector(".container-radio"), 
									dotMenu = this.querySelector(".todo-dot-child-menu");
									
									elChecked && modal.querySelector(".checked").remove();	
										 
									elSelect && scope.removeClass( elSelect, "select" );
										 
									scope.addClass( this, "select" )	 
										 
									elRadio && elRadio.appendChild( fragment );
									
									stateFirstload.vaccineSelect = {
										id : dotMenu.getAttribute("label-id"),
										name : dotMenu.getAttribute("name"),
										element : this
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
										dataStorage : "vaccineList",
										id : id,
										type : "delete"
									},
									function(){ 
										  
										 
										//self update
										obj.modal.vaccineList();
										  
									}); 
									
								})  
							})	  
							
							if( !stateFirstload.vaccineList ){
								
								
								scope.attachListener( btnVaccineNew, 'click', function(e){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "vaccine-list",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("vaccine-add")
										}
									})
								})
								 
								
								/**/ 
								scope.attachListener( btnBack, 'click', function(e){
									 
									obj.modal.behaviour.closeRightToleftFadeout({
										previous : true
									})
								})
								
								 
								scope.attachListener( btnSend, 'click', function(e){
									
									if( !stateFirstload.vaccineSelect ){
												
										let fragment = scope.stringToHtml5Template(
											'<span class="center-text semibold"> Silahkan pilih nama vaksin  </span>'
										);
										
										obj.modalMenu.menuError.update( fragment );
										
									}else{
											
										let attributes = stateFirstload.vaccineSelect,
										ulEl = attributes.element,
										vacNumEl = scope.qs("vaccine-num"),
										total = 1;
										  
											
										obj.dataStorage.vaccineReg.forEach(function( objData ){
											 
											if( objData.babyId === dataBaby.id && 
												objData.name.toLowerCase() === attributes.name.toLowerCase() ){
												
												total++;
												
											}
											
										})
										
										
										scope.text( vacNumEl, total )
										
										scope.removeClass( vacNumEl.parentNode, "hidden" );
										
										scope.removeClass( ulEl, "select" );
										
										ulEl.querySelector(".checked").remove()
											 
										obj.modal.behaviour.closeRightToleftFadeout({
											previous : true
										})
													 
										let inputEl = scope.qs("vaccine-new-input") ;
										
										inputEl.value = attributes.name;
										 
										stateFirstload.vaccineSelect = false;
										     
									}
									
								}) 
								
								stateFirstload.vaccineList = true;
							}
						},
						vaccineNew : function(){
							
							let self  = this,
							modal = scope.qs("vaccine-new"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.querySelectorAll("input") ),
							inputDisable = scope.slice( modal.querySelectorAll(".input-disabled") ),
							textarea = modal.querySelector("textarea") ,
							checkboxParent = scope.slice( modal.querySelectorAll(".border-none > li") ),
							
							pluginModal = scope.qs("plugin-datepicker-vaccine"),
							datepickerEl = scope.qs("datepicker-vaccine"),
							pluginBack = pluginModal.querySelector(".back-button"),
							pluginSend = pluginModal.querySelector(".send-button"),
							dateSelectVac = new Date(),
							notification = false,
							
							vaccineBtn = inputDisable[0],
							inputCover = inputDisable[2];

							/**
								bind modal-input to transaction title
							*/
							obj.modalInput.bindToKeyup( textarea, "textarea" );
							
						
							/**
								bind dropdown 
							*/
							 
							obj.dropdown.bindToKeyPress({
								attach : inputDisable[1],
								modal :  modal,
								container :  modal.parentNode,
								items : [ "Daftarkan","Jadwalkan" ],
								label : [ 0, 1 ],
								callback : function( label ){
									
									if( parseInt( label ) ){
										
										scope.removeClass( scope.qs("vaccine-notify-option"), "hidden" )
										
									}else{
										
										scope.addClass( scope.qs("vaccine-notify-option"), "hidden" )
										
									}
									
								}
							})
							
							/**
								checks buttons
							*/
						
							obj.checkButtonsFn( checkboxParent, function( method ){
									
								notification = method ? true : false;
							});
							
							
							
							/*
								close plugin date
							**/
							scope.attachListener( pluginBack, 'click', function(){
								
								obj.modalPlugin.behaviour.closeFadeout();
							})
							
							
							/**
								tanggal vaksin
							*/
							scope.attachListener( inputCover, 'click', function( index ){
							
								obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-vaccine");
							 
								obj.modalPlugin.behaviour.openModalFadeIn("plugin-datepicker-vaccine");
									
								if( self.state.vaccine ){
									
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerEl.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-vaccine"), scope.dateToYMD( new Date(),
										"year" ) )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										let dateNow =  new Date(),
										
										dateSelect = selectDateFn();
										  
										dateSelect.setSeconds( dateNow.getSeconds() );
										dateSelect.setMinutes( dateNow.getMinutes() );
										dateSelect.setHours( dateNow.getHours() );
										 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										dateSelectVac = dateSelect;
										  
										obj.modalPlugin.behaviour.closeFadeout();
										 
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-vaccine",
										fn : function(){
											  
											scope.text( scope.qs("select-date-vaccine"), scope.dateToYMD( selectDateFn(),
												"year" ) 
											);
											 
										}
									})
									//execute once 
									self.state.vaccine = false;
								}
							})
						
							 
							/*Pilih Vaksin*/
							scope.attachListener( vaccineBtn, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									registerModal : "vaccine-new",
									end : function(){
										
										obj.modal.behaviour.openModalFadeIn("vaccine-list")
 
									}
								})
							})
							
							
							
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
								
							})
							 
							/*
								close
							**/
							
							scope.attachListener( btnSend, 'click', function(){
								 
								let dateNow = new Date();
								 
								if( obj.inputValidate( inputs ) ){
									
									let vaccineName = scope.encodeStr( inputs[0].value ),
									vaccineDetail = scope.encodeStr( textarea.value ),
									type = parseInt( inputs[1].getAttribute("label") ); 
									
									if( dateSelectVac < dateNow && type === 1 ){
										 		
										let fragment = scope.stringToHtml5Template(
											'<span class="center-text semibold"> Jika anda memilih penjadwalan imunisasi, setidaknya tanggal yang dipilih harus lebih dari tanggal sekarang </span>'
										);
										
										obj.modalMenu.menuError.update( fragment );
										
										
									}else if( dateSelectVac > dateNow && type === 0 ){
										
									 				
										let fragment = scope.stringToHtml5Template(
											'<span class="center-text semibold"> Jika anda memilih pendaftaran atau merekam hasil imunisasi, setidaknya tanggal yang dipilih harus kurang dari tanggal sekarang </span>'
										);
										
										obj.modalMenu.menuError.update( fragment );
										 
									}else{
										
										let resetFn = function(){
											
											obj.modal.behaviour.closeRightToleftFadeout({
												end : function(){
													
													let checkedEl = modal.querySelector(".checked");
													
													obj.main.vaccine.init();
													 
													obj.main.remainder();
													
													textarea.value = "";
													
													scope.addClass( scope.qs("vaccine-num").parentNode, "hidden" )
													
													if( checkedEl ) scope.removeClass( checkedEl, "checked" );
														 
												}
												
											});
											
										},
										text = "Imunisasi balita "+ dataBaby.name +" untuk vaksin "+vaccineName,
										timer = function(){
											return ( totalDays !== 0 ?  totalDays - 1 : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
										},
										dateTimeStart = new Date(),
										dateTimeEnd = dateSelectVac,
										totalDays = scope.getMinutesHourDayOrWeekBetweenDates( dateTimeEnd, dateTimeStart, "day" ),
										timeUnit = scope.timeUnitBetween( dateTimeEnd, dateTimeStart ); 
										
										if( notification && type === 1 ){
												
											obj.storageCrud({ 
												updateTable : "multiple",
												tableGroup :{
													tableA : {
														dataStorage : "vaccineReg",
														type : "add",
														name : vaccineName,
														detail : vaccineDetail,
														selectType : type,
														notification : notification,
														vaccineDate : dateSelectVac.toLocaleString("id-ID"),
														dateStart :dateTimeStart.toLocaleString("id-ID")
													},
													tableB : {
														dataStorage : "notification",
														type : "add",
														reminder : text,
														timer : timer(),
														labelText : "Notifikasi Menurut Tanggal",
														dateStart : dateTimeStart.toLocaleString("id-ID"),
														dateEnd : dateTimeEnd.toLocaleString("id-ID"),
														stringDate : "selected-date",
														loop : false
													}
												}
												
												
											},
											function( objNotify ){ 
												   
												resetFn()
												   
												obj.cordova.notification.schedule({
													id: objNotify.cordovaId,
													text : text,
													trigger : dateSelectVac,
													stringDate : "",
													loop : false
												}) 
												
 
											});
											
										}else{
											
											obj.storageCrud({ 
												dataStorage : "vaccineReg",
												type : "add",
												name : vaccineName,
												detail : vaccineDetail,
												selectType : type,
												notification : notification,
												vaccineDate : dateSelectVac.toLocaleString("id-ID"),
												dateStart : new Date().toLocaleString("id-ID")
											},
											function( objNotify ){
												 
												resetFn()
												
											}) 
											
										} 
									
									}
								}
							})
							 
						},
						vaccineAdd : function(){
							let modal = scope.qs("vaccine-add"),
							btnBack = modal.querySelector(".back-button"),
							btnSend = modal.querySelector(".send-button"),
							inputs = scope.slice( modal.querySelectorAll("input") ),
							inputDisable = modal.querySelector(".input-disabled"),
							iconBtns = scope.slice( modal.querySelectorAll(".content-icon li") ),
							iconLabel = "";
							 
							/**
								bind modal-input to category title
							*/
							obj.modalInput.bindToKeyup( inputs[0] );
							  
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout({
									previous : true
								});	
								
							})
							
							scope.attachListener( btnSend, 'click', function(){
								
								if( obj.inputValidate( inputs ) ){
									
									let name = scope.encodeStr( inputs[0].value );
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "vaccineList",
										type : "select-title",
										name : name
												
									},
									function( objData ){
										 
										if( !objData ){
											
											obj.storageCrud({
												dataStorage : "vaccineList",
												type : "add",
												name : name 
											},
											function(){
												  
												obj.modal.behaviour.closeRightToleftFadeout({
													previous : true,
													end : function(){
														 
														obj.modal.vaccineList();
															 
													}
												});	
												
												
											})
										
										}else{
											
															
											let fragment = scope.stringToHtml5Template(
												'<span class="center-text semibold"> Nama Vaksin telah terdaftar silahkan pilih nama lain </span>'
											);
											
											obj.modalMenu.menuError.update( fragment );
											
										}
										
									}) 
									
								}
								
							})
						},
						vaccineDetail : function(){
							
							let btnBack = scope.qs("modal-vaccine-detail").querySelector(".back-button"),
							sendBack = scope.qs("modal-vaccine-detail").querySelector(".send-button");
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();
								
							})
							 
							scope.attachListener( sendBack, 'click', function(){
								
								let text = this.getAttribute("notify-text"),
								dateTimeStart =  new Date(),
								dateTimeEnd = scope.stringToDate( this.getAttribute("vaccine-notify-date") ),
								timeUnit = scope.timeUnitBetween( dateTimeEnd, dateTimeStart ),
								totalDays = scope.getMinutesHourDayOrWeekBetweenDates( dateTimeEnd, dateTimeStart, "day" ),
								timer = function(){
									return ( totalDays !== 0 ?  totalDays - 1 : 0 )+':'+ timeUnit.hour + ":" + timeUnit.minute +":"+timeUnit.second
								};
								
								obj.storageCrud({
									dataStorage : "notification",
									type : "add",
									reminder : text,
									timer : timer(),
									labelText : "Notifikasi Menurut Tanggal",
									dateStart : dateTimeStart.toLocaleString("id-ID"),
									dateEnd : dateTimeEnd.toLocaleString("id-ID"),
									stringDate : "selected-date",
									loop : false
								},
								function( objNotify ){
									 
									//corodva register notification
									obj.cordova.notification.schedule({
										id: objNotify.cordovaId,
										title : "KMS Balita dan bunda",
										text : text,
										trigger : dateTimeEnd,
										stringDate : "selected-date",
										loop : false
									}) 
									 
									obj.modal.behaviour.closeFadeout();
									 
									//generate content
									obj.main.remainder();
									 
										
								})
								
							})
							 
							 
							 
							
						},
						vaccineRecordDetail : {
							update : function(){},
							init : function(){
									
									
								let btnBack = scope.qs("vaccine-recorded-detail").querySelector(".back-button"),
								sendBack = scope.qs("vaccine-recorded-detail").querySelector(".send-button");
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout();
										
								})
								 
								scope.attachListener( sendBack, 'click', function(){
								 
									obj.modal.behaviour.closeRightToleftFadeout({
										registerModal : "vaccine-recorded-detail",
										end : function(){
											
											obj.modal.behaviour.openModalFadeIn("vaccine-recorded-confirm");
										}
									})
									 
								})
							 
								
							}
						},
						vaccineRecordConfirm : function(){
															
							let btnBack = scope.qs("vaccine-recorded-confirm").querySelector(".back-button"),
							sendBack = scope.qs("vaccine-recorded-confirm").querySelector(".send-button");
							
							/*
								close
							**/
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								 
								obj.modal.behaviour.closeRightToleftFadeout({
									previous : true
								})
							})
							 
							scope.attachListener( sendBack, 'click', function(){
									
							
								let id = this.getAttribute("label");
								
								
								obj.storageCrud({
									dataStorage : "vaccineReg",
									id : id,
									type : "delete"
								},
								function(){
												 
									obj.modal.behaviour.closeRightToleftFadeout({
										end : function(){
											
											obj.main.vaccine.update();
										}
									})
									
								}); 
								 
									
								
								
							})
						 
							 
						},
						wfageDeleteConfirm : {
							triggerToWfaBackDetail : function(){
									 
								obj.modal.behaviour.openFadeIn("modal-wfa-detail");	
									 
							},
							init : function(){
								let btnBack = scope.qs("modal-wfa-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-wfa-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToWfaBackDetail();
										}
									})
									
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
										
										obj.chart.weightForAge.init(); // update
									
										obj.chart.weightForAge.create(); // update
										
										scope.removeClassTransform( scope.qs("modal"), "close", 150,{
											start : function(){
												
												scope.removeClass( scope.qs("modal"), "open" );
											}
										})
										
									}); 
									 
									
								})
							}
						},
						wfageNew : function(){
							
							let self = this,
							pluginWfa = scope.qs("plugin-datepicker-wfa"),
							pluginBack = pluginWfa.querySelector(".back-button"),
							pluginSend = pluginWfa.querySelector(".send-button"),
							btnBack = scope.qs("modal-weightforage").querySelector(".back-button"),
							btnSend = scope.qs("modal-weightforage").querySelector(".send-button"),
							inputs = scope.slice( scope.qs("modal-weightforage").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-weightforage").querySelector(".input-disabled"),
							datepickerWfa = scope.qs("datepicker-wfa"),
							dateSelect, monthTo, birthDateEnd;
							
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
							
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
							
								obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-wfa");
							 
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
										 
										objData = obj.chart.dateBaby({
											dateSelect : dateSelect
										});
										 
										birthDateEnd = objData.birthDateEnd;
										
										birthDateStart = objData.birthDateStart;
										 
										monthTo = parseInt( obj.chart.weightForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										obj.modalPlugin.behaviour.closeFadeout();
										
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
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "wfa",
										type : "select-monthto", 
										monthTo : monthTo
									},
									function( isMonthToRecorded ){
											
											
										if( dateSelect < birthDateStart || new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal lahir bayi atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( monthTo < 0 || monthTo > 60 ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Umur rekam harus 0 sampai dengan 5 tahun atau 0 sampai dengan 60 bulan </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isMonthToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "wfa",
												monthTo : monthTo,
												weight :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
												
												//update obj.dataStorage
												obj.chart.weightForAge.init();
												
												//reupdate chart 
												obj.chart.weightForAge.create();

												obj.modal.behaviour.closeFadeout();
											}); 
											
										}else{
											
											scope.text( scope.qs("month-to"), monthTo )
											
											//store to wfaState
											obj.storageState({ 
												storageState : "wfaState",
												objState : "wfaUpdate",
												value : { 
													type : "update-monthto", 
													dataStorage : "wfa",
													monthTo : monthTo,
													weight :  scope.encodeStr( inputs[0].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												 
												obj.modalMenu.behaviour.openFadeIn("modal-menu-wfa");
											}) 
											
											
										} 
									});	 
								}
							})
						
						},
						wfageDetail : {
							triggerToWfaDeleteConfirm : function(){
								
								obj.modal.behaviour.openFadeIn("modal-wfa-confirm");	
									 	
							},
							init : function(){
								
								let btnBack = scope.qs("modal-wfa-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-wfa-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									 
									
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToWfaDeleteConfirm();
										}
									})
									
								})
							}
						},
						bmiageDeleteConfirm : {
							triggerToBmiBackDetail : function(){
								
								obj.modal.behaviour.openFadeIn("modal-bmi-detail");	
									 	
							},
							init : function(){
								let btnBack = scope.qs("modal-bmi-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-bmi-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToBmiBackDetail();
										}
									})
									
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "bmi"
									},
									function(){
											 
										obj.chart.bmiForAge.init(); // update
										
										obj.chart.bmiForAge.create(); // update
										
										scope.removeClassTransform( scope.qs("modal"), "close", 150,{
											start : function(){
												
												scope.removeClass( scope.qs("modal"), "open" );
											}
										})  
									}); 
									 
								})
							}
						},
						bmiageNew : function(){
							
							let self = this,
							pluginWfa = scope.qs("plugin-datepicker-bmi"),
							pluginBack = pluginWfa.querySelector(".back-button"),
							pluginSend = pluginWfa.querySelector(".send-button"),
							btnBack = scope.qs("modal-bmiforage").querySelector(".back-button"),
							btnSend = scope.qs("modal-bmiforage").querySelector(".send-button"),
							inputs = scope.slice( scope.qs("modal-bmiforage").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-bmiforage").querySelector(".input-disabled"),
							datepickerBmi = scope.qs("datepicker-bmi"),
							dateSelect, monthTo, birthDateEnd;
							
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
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							obj.modalInput.bindToKeyup( inputs[1], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
									
								obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-bmi");
							 
								if( self.state.bmi ){
									  
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerBmi.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-bmi"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										 
										objData = obj.chart.dateBaby({
											dateSelect : dateSelect
										});
										 
										birthDateEnd = objData.birthDateEnd;
										
										birthDateStart = objData.birthDateStart;
										 
										monthTo = parseInt( obj.chart.bmiForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-bmi",
										fn : function(){
											 
											scope.text( scope.qs("select-date-bmi"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									}) 
									
									 
									//execute once 
									self.state.bmi = false;
								}
							})
							
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									
									let bmi = parseFloat( inputs[0].value / Math.pow( inputs[1].value, 2 ) );
 	
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "bmi",
										type : "select-monthto", 
										monthTo : monthTo
									},
									function( isMonthToRecorded ){
										
										if( dateSelect < birthDateStart || new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal lahir bayi atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( monthTo < 0 || monthTo > 60 ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Umur rekam harus 0 sampai dengan 5 tahun atau 0 sampai dengan 60 bulan </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isMonthToRecorded ){ 
											 
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "bmi",
												monthTo : monthTo,
												weight :  scope.encodeStr( inputs[0].value ),
												height :  scope.encodeStr( inputs[1].value ),
												bmi : bmi.toFixed( 2 ),
												dateSelect : dateSelect,
												dateStart : new Date()
											}, 
											function(){
												 
												//update obj.dataStorage
												obj.chart.bmiForAge.init();
												
												//reupdate chart 
												obj.chart.bmiForAge.create();

												obj.modal.behaviour.closeFadeout();
												
											});
											
											
										}else{
									 
											scope.text( scope.qs("bmi-month-to"), monthTo )
											
											//store to wfaState
											obj.storageState({ 
												storageState : "bmiState",
												objState : "bmiUpdate",
												value : { 
													type : "update-monthto", 
													dataStorage : "bmi",
													monthTo : monthTo,
													weight :  scope.encodeStr( inputs[0].value ),
													height :  scope.encodeStr( inputs[1].value ),
													bmi : bmi.toFixed( 2 ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												
												obj.modalMenu.behaviour.openFadeIn("modal-menu-bmi");
											})  
											 
										}
										
									});	
										
								}
							})
							
						},
						bmiageDetail : {
							triggerToBmiDeleteConfirm : function(){
								
								obj.modal.behaviour.openFadeIn("modal-bmi-confirm");	
									
							},
							init : function(){
								
								let btnBack = scope.qs("modal-bmi-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-bmi-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									 
									
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToBmiDeleteConfirm();
										}
									})
									
								})
							}
						},
						hcageDeleteConfirm : {
							triggerToHcBackDetail : function(){
								
								obj.modal.behaviour.openFadeIn("modal-hc-detail");	
										
							},
							init : function(){
								let btnBack = scope.qs("modal-hc-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-hc-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToHcBackDetail();
										}
									})
									
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
										
										obj.chart.hcForAge.init(); // update
									
										obj.chart.hcForAge.create(); // update
										
										scope.removeClassTransform( scope.qs("modal"), "close", 150,{
											start : function(){
												
												scope.removeClass( scope.qs("modal"), "open" );
											}
										})  
									});  
								})
							}
						},
						hcageNew : function(){
							
							let self = this,
							pluginHc = scope.qs("plugin-datepicker-hc"),
							pluginBack = pluginHc.querySelector(".back-button"),
							pluginSend = pluginHc.querySelector(".send-button"),
							btnBack = scope.qs("modal-hcforage").querySelector(".back-button"),
							btnSend = scope.qs("modal-hcforage").querySelector(".send-button"),
							inputs = scope.slice( scope.qs("modal-hcforage").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-hcforage").querySelector(".input-disabled"),
							datepickerHc = scope.qs("datepicker-hc"),
							dateSelect, monthTo, birthDateEnd;
							
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
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
										
								obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-hc");
							 
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
										 
										objData = obj.chart.dateBaby({
											dateSelect : dateSelect
										});
										 
										birthDateEnd = objData.birthDateEnd;
										
										birthDateStart = objData.birthDateStart;
										 
										monthTo = parseInt( obj.chart.hcForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										obj.modalPlugin.behaviour.closeFadeout();
										
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
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "hc",
										type : "select-monthto", 
										monthTo : monthTo
									},
									function( isMonthToRecorded ){
										
										if( dateSelect < birthDateStart || new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal lahir bayi atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( monthTo < 0 || monthTo > 60 ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Umur rekam harus 0 sampai dengan 5 tahun atau 0 sampai dengan 60 bulan </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isMonthToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "hc",
												monthTo : monthTo,
												hc :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											}, 
											function(){
												 
												//update dataStorage
												obj.chart.hcForAge.init();
												
												//reupdate chart 
												obj.chart.hcForAge.create();
 
												obj.modal.behaviour.closeFadeout();
												 
											});
											
										}else{
											
											scope.text( scope.qs("hc-month-to"), monthTo )
											
											//store to wfaState
											obj.storageState({ 
												storageState : "hcState",
												objState : "hcUpdate",
												value : { 
													type : "update-monthto", 
													dataStorage : "hc",
													monthTo : monthTo,
													hc :  scope.encodeStr( inputs[0].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												
												obj.modalMenu.behaviour.openFadeIn("modal-menu-hc");
												
											})  	
										}
										 
									});	 	
								}
							})
							
						},
						hcageDetail : {
							triggerToHcDeleteConfirm : function(){
								
								obj.modal.behaviour.openFadeIn("modal-hc-confirm");	
									
							},
							init : function(){
								
								let btnBack = scope.qs("modal-hc-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-hc-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									 
									
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToHcDeleteConfirm();
										}
									})
									
								})
							}
						},
						lhfaNew : function(){
							
							let self = this,
							pluginLhfa = scope.qs("plugin-datepicker-lhfa"),
							pluginBack = pluginLhfa.querySelector(".back-button"),
							pluginSend = pluginLhfa.querySelector(".send-button"),
							btnBack = scope.qs("modal-lhfa").querySelector(".back-button"),
							btnSend = scope.qs("modal-lhfa").querySelector(".send-button"),
							inputs = scope.slice( scope.qs("modal-lhfa").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-lhfa").querySelector(".input-disabled"),
							datepickerLhfa = scope.qs("datepicker-lhfa"),
							dateSelect, monthTo, birthDateEnd;
							
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
							
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){
										
								obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-lhfa");
							 
								if( self.state.lhfaAge ){
										 
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerLhfa.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-lhfa"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										 
										objData = obj.chart.dateBaby({
											dateSelect : dateSelect
										});
										 
										birthDateEnd = objData.birthDateEnd;
										
										birthDateStart = objData.birthDateStart;
										 
										monthTo = parseInt( obj.chart.lhForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-lhfa",
										fn : function(){
											 
											scope.text( scope.qs("select-date-lhfa"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									})
									
									//execute once 
									self.state.lhfaAge = false;
								}
							
							})
							
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "lhfa",
										type : "select-monthto", 
										monthTo : monthTo
									},
									function( isMonthToRecorded ){
										
										if( dateSelect < birthDateStart || new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal lahir bayi atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( monthTo < 0 || monthTo > 60 ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Umur rekam harus 0 sampai dengan 5 tahun atau 0 sampai dengan 60 bulan </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isMonthToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "lhfa",
												monthTo : monthTo,
												height :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
													 
												//update dataStorage
												obj.chart.lhForAge.init();
												
												//reupdate chart 
												obj.chart.lhForAge.create();

												obj.modal.behaviour.closeFadeout();
												  
											});
											
										}else{
											
											scope.text( scope.qs("lhfa-month-to"), monthTo )
											
											//store to wfaState
											obj.storageState({ 
												storageState : "lhfaState",
												objState : "lhfaUpdate",
												value : { 
													type : "update-monthto", 
													dataStorage : "lhfa",
													monthTo : monthTo,
													height :  scope.encodeStr( inputs[0].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												
												obj.modalMenu.behaviour.openFadeIn("modal-menu-lhfa");
												
											}) 
											 
										}
										 
									});	
									
										
								}
							})
							
							
						},
						lhfaDeleteConfirm : {
							triggerToLhfaBackDetail : function(){
								
								obj.modal.behaviour.openFadeIn("modal-lhfa-detail");	
									
							},
							init : function(){
								let btnBack = scope.qs("modal-lhfa-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-lhfa-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToLhfaBackDetail();
										}
									})
									
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "lhfa"
									},
									function(){
										 
										obj.chart.lhForAge.init(); // update
										
										obj.chart.lhForAge.create(); // update
										
										scope.removeClassTransform( scope.qs("modal"), "close", 150,{
											start : function(){
												
												scope.removeClass( scope.qs("modal"), "open" );
											}
										}) 
									}); 
									
								})
							}
						},
						lhfaDetail : {
							triggerToLhfaDeleteConfirm : function(){
								
								obj.modal.behaviour.openFadeIn("modal-lhfa-confirm");	
									
							},
							init : function(){
								
								let btnBack = scope.qs("modal-lhfa-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-lhfa-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									 
									
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToLhfaDeleteConfirm();
										}
									})
									
								})
							}
						},
						afaDeleteConfirm : {
							triggerToAfaBackDetail : function(){
								
								obj.modal.behaviour.openFadeIn("modal-afa-detail");	
										
							},
							init : function(){
								let btnBack = scope.qs("modal-afa-confirm").querySelector(".back-button"),
								btnConfirm = scope.qs("modal-afa-confirm").querySelector(".send-button"),
								self = this;
								
								/* close */
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToAfaBackDetail();
										}
									})
									
								})
								
								/* confirm */
								scope.attachListener( btnConfirm, 'click', function(){
									
									let id = this.getAttribute("label");
									
									obj.storageCrud({
										id : id,
										type : "delete",
										dataStorage : "afa"
									},
									function(){
											 
										obj.chart.armForAge.init(); // update
										
										obj.chart.armForAge.create(); // update
										
										scope.removeClassTransform( scope.qs("modal"), "close", 150,{
											start : function(){
												
												scope.removeClass( scope.qs("modal"), "open" );
											}
										}) 
									});  
								})
							}
						},
						afaDetail : {
							triggerToAfaDeleteConfirm : function(){
								
								obj.modal.behaviour.openFadeIn("modal-afa-confirm");	
									
							},
							init : function(){
								
								let btnBack = scope.qs("modal-afa-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-afa-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
									 
									
								})
								
								/*
									delete
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToAfaDeleteConfirm();
										}
									})
									
								})
							}
						},
						afaNew : function(){
							
							let self = this,
							pluginAfa = scope.qs("plugin-datepicker-afa"),
							pluginBack = pluginAfa.querySelector(".back-button"),
							pluginSend = pluginAfa.querySelector(".send-button"),
							btnBack = scope.qs("modal-afa").querySelector(".back-button"),
							btnSend = scope.qs("modal-afa").querySelector(".send-button"),
							inputs = scope.slice( scope.qs("modal-afa").getElementsByTagName("input") ),
							inputCover = scope.qs("modal-afa").querySelector(".input-disabled"),
							datepickerAfa = scope.qs("datepicker-afa"),
							showModalFn = function(){ 
								 	
								obj.modalMenu.behaviour.openFadeIn("modal-menu-afa")
							    
							},
							dateSelect, monthTo, birthDateEnd;
							
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
							/**
								bind modal-input to inputs
							*/
							obj.modalInput.bindToKeyup( inputs[0], "input" );
							
							/**
								input
							*/
							scope.attachListener( inputCover, 'click', function( index ){ 
										
								obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-afa");
							 	
								if( self.state.afa ){
									
									/*attach button*/
									let inputBound = inputCover.getBoundingClientRect(),
									objInput = inputCover.querySelector("input"),
									selectDateFn = function(){
										
										let timepicked = scope.slice( datepickerAfa.querySelectorAll(".swiper-slide-active") );
										
										objInput.value = "";
										 
										//reverse it to yyyy/mm/dd
										timepicked.reverse();
										
										return new Date( 
											timepicked[0].textContent, 
											parseInt( timepicked[1].textContent ) - 1, 
											timepicked[2].textContent
										)
										
									};
									
									scope.text( scope.qs("select-date-afa"), scope.dateToYMD( new Date(), "year") )
									
									/**
										confirm plugin date
									*/
									scope.attachListener( pluginSend, 'click', function(){
										  
										dateSelect = selectDateFn();
										 
										objData = obj.chart.dateBaby({
											dateSelect : dateSelect
										});
										 
										birthDateEnd = objData.birthDateEnd;
										
										birthDateStart = objData.birthDateStart;
										 
										monthTo = parseInt( obj.chart.armForAge.updateTextModal( objData ) ); 
										 
										objInput.value = scope.dateToYMD( dateSelect, "year" );
										  
										obj.modalPlugin.behaviour.closeFadeout();
										
									})
									
									obj.generateSwiperDate({
										containerStr : ".datepicker-afa",
										fn : function(){
											 
											scope.text( scope.qs("select-date-afa"), scope.dateToYMD( selectDateFn(), "year") );
											 
										}
									})
									//execute once 
									self.state.afa = false;
								}
							
							})
							
							
							/**
								send
							*/
							scope.attachListener( btnSend, 'click', function(){
								    
								if( obj.inputValidate( inputs ) ){
									
									obj.storageCrud({ 
										noUpdateFileSource : true,
										dataStorage : "afa",
										type : "select-monthto", 
										monthTo : monthTo
									},
									function( isMonthToRecorded ){
										
										if( dateSelect < birthDateStart || new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Tanggal anda tidak valid bisa jadi tanggal dipilih kurang dari tanggal lahir bayi atau melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( monthTo < 3 || monthTo > 60 ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Umur rekam harus 3 Bulan sampai dengan 5 tahun atau 3 Bulan sampai dengan 60 bulan </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else if( !isMonthToRecorded ){ 
										
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "afa",
												monthTo : monthTo,
												arm :  scope.encodeStr( inputs[0].value ),
												dateSelect : dateSelect,
												dateStart : new Date()
											},
											function(){
													
												//update dataStorage
												obj.chart.armForAge.init();
												
												//reupdate chart 
												obj.chart.armForAge.create();

												obj.modal.behaviour.closeFadeout();
											
											});
											
										}else{
											
											scope.text( scope.qs("afa-month-to"), monthTo )
											
											//store to afaUpdate
											obj.storageState({ 
												storageState : "afaState",
												objState : "afaUpdate",
												value : { 
													type : "update-monthto", 
													dataStorage : "afa",
													monthTo : monthTo,
													arm :  scope.encodeStr( inputs[0].value ),
													dateSelect : dateSelect,
													dateStart : new Date()
												} //a,b,c
											},
											function(){
												 
												obj.modalMenu.behaviour.openFadeIn("modal-menu-afa");
												
											}) 
											
										}
										
									});	
									
										
								}
							})
							
						},
						graphFaq : function(){
							
							let self = this,
							graphfaq = scope.qs("graph-faq"),
							btnBack = graphfaq.querySelector(".back-button"), 
							btnGroupTrigger = [ scope.qs("btn-graph-wfa"), scope.qs("btn-graph-bmi"),  scope.qs("btn-graph-hc"),  scope.qs("btn-graph-lh"),  scope.qs("btn-graph-afa") ]
							
							/*
								close plugin date
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeFadeout();

							})
							 
							scope.attachListener( btnGroupTrigger, 'click', function(){
								
								obj.modal.behaviour.openFadeIn("graph-faq"); 
							})
							 
						},
						babyNew : { 
							babyNewState : true,
							triggerToBabyNew : function(){
								
								if( obj.noBabyinStorage ){
									
									obj.modal.behaviour.openFadeIn("modal-baby-new");	
									 
								}
							},
							triggerToBabyList : function(){
								
								obj.modal.behaviour.openFadeIn("modal-baby-list");	
								
							},
							init: function(){
								
								let self = this,
								btnSend = scope.qs("btn-baby-save"),
								datepickerBabyNew = scope.qs("datepicker-baby-new"),
								inputs = scope.slice( scope.qs("modal-baby-new").getElementsByTagName("input") ), 
								addBaby = scope.qs("modal-baby-list").querySelector(".add-baby-ava"),
								inputCover = scope.slice( scope.qs("modal-baby-new").querySelectorAll(".input-disabled") ),
								btnBack = scope.qs("modal-baby-new").querySelector(".back-button"),
								showModalMenuFn = function( init ){
									   
									obj.modalMenu.behaviour.openFadeIn( init )
							       
								}, dateSelect, name;
								
								scope.attachListener( addBaby, 'click', function(){
									  
										scope.removeClass( scope.qs("modal-baby-new").querySelector(".modal-header"), "hidden" );
										
										scope.removeClassTransform( scope.qs("modal"), "close", 150,{
											start : function(){
												
												scope.removeClass( scope.qs("modal"), "open" );
											},
											end : function(){
												
												self.triggerToBabyNew();
											}
										})
										  
									/*
									if( obj.dataStorage.babiesData.length < 3 ){
										 		
									}else{
										
										let fragment = scope.stringToHtml5Template(
											'<span class="semibold center-text"> Aplikasi ini membatasi hanya untuk 3 pengguna saja</span>'
										);
										 
										obj.modalMenu.menuError.update( fragment );
									}  
									*/
									 
								})
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToBabyList();
										}
									})
									 
									
								})
								
								/**
									bind modal-input to inputs
								*/
								obj.modalInput.bindToKeyup( inputs[0], "textarea" );
								
								/**
									input
								*/
								inputCover.map(function( objCover, index ){
									  
									scope.attachListener( objCover, 'click', function( index ){
									
										let objInput = this.querySelector("input");
										 
										if( index === 0 ){ // date
											 
											 
											obj.modalPlugin.behaviour.openFadeIn("plugin-datepicker-baby-new");
									   
											if( self.babyNewState ){
											  
												 /*attach button*/
												let datepickerBabyNew = scope.qs("datepicker-baby-new"),
												modalPluginBabyNew = scope.qs("plugin-datepicker-baby-new"),
												pluginBack = modalPluginBabyNew.querySelector(".back-button"),
												pluginSend = modalPluginBabyNew.querySelector(".send-button")
												selectDateFn = function(){
														
													let timepicked = scope.slice( datepickerBabyNew.querySelectorAll(".swiper-slide-active") );
													
													objInput.value = "";
													 
													//reverse it to yyyy/mm/dd
													timepicked.reverse();
													
													let pickDate = new Date( 
														timepicked[0].textContent, 
														parseInt( timepicked[1].textContent ) - 1, 
														timepicked[2].textContent
													)
													 
													return pickDate;
													
												};
												
												scope.text( scope.qs("select-date-baby-new"), scope.dateToYMD( new Date(), "year") )
												
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
													containerStr : ".datepicker-baby-new",
													fn : function(){
														 
														scope.text( scope.qs("select-date-baby-new"), scope.dateToYMD( selectDateFn(), "year") );
														 
													}
												}) 
												
												//execute once 
												self.babyNewState = false;
											} 
									 
										}else if( index === 1 ){ //gender
											
											showModalMenuFn("modal-menu-gender-baby")
										}else if( index === 2 ){ //gender
											
											showModalMenuFn("modal-menu-relative-baby")
										}
									
									}.bind( objCover, index ) )
								})
									
								/**
									send
								*/
								scope.attachListener( btnSend, 'click', function(){
										
									if( obj.inputValidate( inputs ) ){
										 
										if( new Date() < dateSelect ){
											
											let fragment = scope.stringToHtml5Template(
												'<span class="semibold center-text"> Tanggal anda tidak valid, bisa jadi tanggal yang dipilih melebihi tanggal sekarang </span>'
											);
											 
											obj.modalMenu.menuError.update( fragment );
											
										}else{ 
											
											//let add make it active
											obj.storageCrud({ 
												type : "add", 
												dataStorage : "babiesData",
												name :  scope.encodeStr( inputs[0].value ),
												birthdate : dateSelect,
												gender :  scope.encodeStr( inputs[2].value ),
												relative :  scope.encodeStr( inputs[3].value ),
												dateStart : new Date()
											},
											function(){
												
												scope.removeClassTransform( scope.qs("modal"), "close", 150,{
													start : function(){
														
														scope.removeClass( scope.qs("modal"), "open" ); 
														
													},
													end : function(){
														 
														 
														dataBaby = obj.dataStorage.babiesData[0];
														 
														scope.text( scope.qs("baby-active-name"), dataBaby.name );
														
														obj.chart.gender = dataBaby.gender === "Laki Laki" ? "boy" : "girl" 
														 
														obj.reupdateData();
												
														obj.layoutChartUpdate = true;
														 
														obj.main.vaccine.init();
												
													}
												})
												
											}); 	
										} 	
									}
								})
								
							}
						},
						babyList :{
							
							triggerToBabyDetail : function(){
								
								obj.modal.behaviour.openFadeIn("modal-baby-detail");	
									
							},
							init : function(){ 
  
								let modal = scope.qs("modal-baby-list")
								container = modal.querySelector(".baby-content"),
								btnBack = modal.querySelector(".back-button"), 
								btnShort =  scope.qs("btn-short"),
								inputShort =  modal.getElementsByTagName("input")[0],
								data = obj.dataStorage.babiesData,
								self = this,
								contentDom = function( params ){ 
									let fragment = scope.stringToHtml5Template(
										'<li>'+
											params.name +
										'	<div class="button-list menu-dot-icon bg-size-70"'+
										'		label-id="'+params.id+'"'+ 
										'		age="'+params.birthdate+'"'+ 
										'		birth-date="'+ scope.dateToYMD( scope.stringToDate( params.birthdate ), 'year' )+'"'+ 
										'		date-start="'+ scope.dateToYMD( scope.stringToDate( params.dateStart ), 'year' )+'"'+ 
										'		gender="'+params.gender+'"'+
										'		name ="'+params.name+'"'+
'												relative="'+params.relative+'"'+ 
										'></div>'+
										'	<div class="button-list text '+( params.active ? "active" : "" ) + '" >'+( params.active ? "Aktif" : "Aktifkan" )+'</div>'+
										'</li>'
									) 
									 
									container.appendChild( fragment ) 
									 
								},
								closeModalFn = function(){
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										}
									})
								},
								dataNoteFn = function( dataNote){
									 
									 contentDom( dataNote )
									 
								},
								attachEventBtns = function(){
									
									/*switch user*/
									//active buttons
									let activeBtns = scope.slice( scope.qs("modal-baby-list").querySelectorAll(".text") );
										
									activeBtns.map(function( activeBtn, index ){
										  
										scope.attachListener( activeBtn, 'click', function(){
											
											let id = scope.sibling( this, "previous").getAttribute("label-id");
											 
											if( id  !== dataBaby.id ){
											
												obj.storageCrud({ 
													type : "set-active", 
													dataStorage : "babiesData",
													id :id
												},
												function( objDataBaby ){
													
													scope.text( scope.qs("baby-active-name"), objDataBaby.name );
													
													obj.chart.gender = dataBaby.gender === "Laki Laki" ? "boy" : "girl" 
																
													obj.layoutChartUpdate = true;
													
													closeModalFn();
													
													obj.reupdateData();
													  
													obj.main.vaccine.init(); 
													
												});
												
											}
										})
										
										
									})
								 
									let detailBtns = scope.slice( scope.qs("modal-baby-list").querySelectorAll(".menu-dot-icon") );
									 
									detailBtns.map(function( detailBtn, index ){
										
										scope.attachListener( detailBtn, 'click', function(){
											   
											//set label confirm button
											scope.qs("modal-baby-confirm").querySelector(".send-button").setAttribute( "label-id", this.getAttribute("label-id") )
											  
											  
											let age = scope.timeUnitBetween( new Date(), scope.stringToDate( this.getAttribute("age") ) ),
											
											ageStr = ( age.year !== 0 ? age.year+" Thn " : "" ) +
											 ( age.month !== 0 ? age.month+" Bln " : "" ) +
											 ( age.week !== 0 ? age.week+" Mgg " : "" ) +
											 ( age.day !== 0 ? age.day+" Hr" : "" );
											 
											 
											
											 
											//modal detail and confirm 
											scope.text( [ scope.qs("baby-detail-name"), scope.qs("baby-confirm-name") ], this.getAttribute("name") );
											scope.text( [ scope.qs("baby-detail-gender"),  scope.qs("baby-confirm-gender") ], this.getAttribute("gender") );
											scope.text( [ scope.qs("baby-detail-relative"), scope.qs("baby-confirm-relative") ], this.getAttribute("relative") );
											scope.text( [ scope.qs("baby-detail-bdate"), scope.qs("baby-confirm-bdate") ], this.getAttribute("birth-date") );
											scope.text( [ scope.qs("baby-detail-age"), scope.qs("baby-confirm-age") ], ageStr );
											scope.text( [ scope.qs("baby-detail-datestart"), scope.qs("baby-confirm-datestart") ], this.getAttribute("date-start") );
											
											scope.removeClassTransform( scope.qs("modal"), "close", 150,{
												start : function(){
													
													scope.removeClass( scope.qs("modal"), "open" );
												},
												end : function(){
													
													self.triggerToBabyDetail();
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
								
								 
								//set header name
								scope.text( scope.qs("baby-active-name"), dataBaby.name );
									 
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									closeModalFn();
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
										
										data.sort(function(a,b){ return b.name.localeCompare(a.name) })
										 
										stateFirstload.sort = 0
									}
									
									
									//clear and append baby data
									container.innerHTML = "";
								
									data.forEach( function( dataNote ){
		
										dataNoteFn( dataNote );  
									 
									})		 
									
									attachEventBtns();
								} )
								
								
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
								
								 
							}
						 
						},
						babyDetail :{
							triggerToBabyDeleteConfirm : function(){
								
								obj.modal.behaviour.openFadeIn("modal-baby-confirm");	
								 
							},
							triggerToBabyList : function(){
								
								obj.modal.behaviour.openFadeIn("modal-baby-list");	
								 
							},
							init : function(){
							
							
								let btnBack = scope.qs("modal-baby-detail").querySelector(".back-button"),
								deleteBack = scope.qs("modal-baby-detail").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToBabyList();
										}
									})
									 
									
								})
								
								/*
									confirm
								**/
								scope.attachListener( deleteBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToBabyDeleteConfirm();
										}
									})
									 
									
								})
							}
						},
						babyConfirm :{
							triggerToBabyDetail : function(){
								
								obj.modal.behaviour.openFadeIn("modal-baby-detail");	
								 
							},
							init : function(){
								
								let btnBack = scope.qs("modal-baby-confirm").querySelector(".back-button"),
								deleteBack = scope.qs("modal-baby-confirm").querySelector(".send-button"),
								self = this;
								
								/*
									close
								**/
								scope.attachListener( btnBack, 'click', function(){
									
									scope.removeClassTransform( scope.qs("modal"), "close", 150,{
										start : function(){
											
											scope.removeClass( scope.qs("modal"), "open" );
										},
										end : function(){
											
											self.triggerToBabyDetail();
										}
									})
									 
									
								})
								
								/*
									confirm
								**/
								scope.attachListener( deleteBack, 'click', function(){
								 	  
									//prevent error when tab-d is active 
										
									obj.storageCrud({ 
										type : "delete", 
										dataStorage : "babiesData",
										id : this.getAttribute("label-id")
									},
									function( objDataBaby ){
								   		
										obj.reupdateData();
									
										if( !obj.noBabyinStorage() ){
											
											 
											dataBaby = obj.dataStorage.babiesData[0];
											 
											obj.chart.gender = dataBaby.gender === "Laki Laki" ? "boy" : "girl" 
											 
											obj.layoutChartUpdate = true;
											 
											obj.main.vaccine.init();
											  
											scope.removeClassTransform( scope.qs("modal"), "close", 150,{
												start : function(){
													
													scope.removeClass( scope.qs("modal"), "open" );
												}
											})
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
									
									obj.modal.behaviour.closeFadeout();
								})
								
								/**
									Button List
								*/
								othersBtns.map(function( objElement, index ){
									
									scope.attachListener( objElement, 'click', function( index ){
										  
										   
										if( index === 0 ){
											
											obj.modal.behaviour.closeFadeout({
												end : function(){
													
													obj.modal.behaviour.openFadeIn( "modal-baby-list" );
												}
											});
										
										}else if( index === 9 ){
											
											obj.modal.behaviour.closeFadeout({
												end : function(){
													
													obj.modal.behaviour.openFadeIn( "charity-list" );
												}
											}); 
											 
										}else if( index === 10 ){
											obj.modal.behaviour.closeFadeout({
												end : function(){
													
													obj.modal.behaviour.openFadeIn( "modal-faq-list" );
												}
											}); 
											 
										} else if( index === 12 ){
											  
											obj.cordova.email.open();
											
										}else if( index === 13 ){
											  
											obj.cordova.launchApp.init({
												name : "com.owlpictureid.kms"
											});
											
										}else if( index === 15 ){
											
											obj.modal.behaviour.closeFadeout({
												end : function(){
													
													obj.modal.behaviour.openFadeIn( "modal-back-restore" );
												}
											});  
										}else if( index === 16 ){
											
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
						charityList : function(){
							
							let self = this,
							btnBack = scope.qs("charity-list").querySelector(".back-button");
							
							scope.attachListener( btnBack, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout();	
								
							})  
						},
						FaqList : function(){
							
							let self = this,
							btnBack = scope.qs("modal-faq-list").querySelector(".back-button");
							
							/*
								close
							**/
							scope.attachListener( btnBack, 'click', function(){
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									}
								})
								
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
								
								scope.removeClassTransform( scope.qs("modal"), "close", 150,{
									start : function(){
										
										scope.removeClass( scope.qs("modal"), "open" );
									}
								})
								
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
											
											setTimeout(function(){
												
												obj.modal.behaviour.closeRightToleftFadeout({
													end : function(){
														obj.cordova.launchApp.init({
															name : "com.owlpictureid.bumil"
														});
													}
												}) 
												
											},3000)
											
											break;
									} 
									
								}.bind( btn, index ) ) 
								
							})  
							   
							  
							scope.attachListener( btnNo, 'click', function(){
								
								obj.modal.behaviour.closeRightToleftFadeout() 
								
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
						avatar : {
							cropper :  function(){},
							firstTrigger : true,
							imageUri : "",
							imageCrope : "",
							triggerFn :function(){
								  
								let self = this,
								modal = scope.qs("modal-browse-image"),
								contentImg = modal.querySelector(".browse-content-image"),
								imgCrop = scope.getFirstChild( contentImg ),
								css = "height:"+ ( document.body.clientHeight - 90 - 61 ) +"px;width:"+document.body.clientWidth+"px" 
								 
								contentImg.setAttribute( "style", css);
								//imgCrop.setAttribute( "style", css);
								
								self.imageCrope = imgCrop;
								
								obj.modal.behaviour.openModalFadeIn("modal-browse-image",{
									end:function(){
										
										if( self.firstTrigger ){
											
											/*
											self.cropper = new Cropper( imgCrop, {
												aspectRatio: 1 / 1,
												dragMode : "move",
												viewMode : 3
											});
											*/
											self.firstTrigger = false;
										}
										
									}
								});
								
							},
							init : function() {
								
								let self = this,
								modal = scope.qs("modal-browse-image"),
								btnBack = modal.querySelector(".back-button"),
								btnSend = modal.querySelector(".send-button"),
								btnCamera = modal.querySelector(".camera-button"),
								btnGallery = modal.querySelector(".browse-empty"),
								contentOptions = scope.slice( scope.qs("browser-options").querySelectorAll("li") ),
								zoomIn = contentOptions[0],
								zoomOut = contentOptions[1],
								target = scope.qs("wrap-profile-pict"),
								flipLeftRightBtn = contentOptions[2],
								flipLeftRightState = false,
								flipTopBottomBtn = contentOptions[3],
								flipTopBottomState = false, 
								saveState = true,
								alowExeBtn = function(){
									  
									return  /hidden/i.test( btnGallery.className )
								};
								
								
								
								//options
								
								scope.attachListener( zoomOut, 'click', function(){
									 
									//alowExeBtn() && self.cropper.zoom(-0.1)
									
								})
								
								scope.attachListener( zoomIn, 'click', function(){
									
									//alowExeBtn() && self.cropper.zoom(0.1)
									
								})
								
								scope.attachListener( flipLeftRightBtn, 'click', function(){
									
									/*
									
									if( alowExeBtn() ){
										
										flipLeftRightState ? 
											self.cropper.scaleX( 1 ) :
											self.cropper.scaleX( -1 );
											
										flipLeftRightState = flipLeftRightState ? false : true;
										
									}
									*/
								})
								
								scope.attachListener( flipTopBottomBtn, 'click', function(){
									
									/*
									if( alowExeBtn() ){
										
										flipTopBottomState ? 
											self.cropper.scaleY( 1 ) :
											self.cropper.scaleY( -1 );
											
										flipTopBottomState = flipTopBottomState ? false : true;
										
									}
									*/
								})
								
								
								//browse gallery 
								scope.attachListener( btnGallery, 'click', function(){
									 
									obj.cordova.camera.chooseGallery(function( imageuri ){
										
										self.imageUri = imageuri;
										
										self.imageCrope.src = imageuri;
										 
										//self.cropper.replace( imageuri ) ;
									   
										scope.removeClass( modal.querySelector(".browse-content-image"), "hidden" )
										
										scope.addClass( btnGallery, "hidden" ) 
 
									})
									
								})
								
								 
								//camera 
								scope.attachListener( btnCamera, 'click', function(){
									
									obj.cordova.camera.getPicture(function( imageuri ){
										
										self.imageUri = imageuri;
										
										self.imageCrope.src = imageuri;
										 
										//self.cropper.replace( imageuri ) ;
									   
										scope.removeClass( modal.querySelector(".browse-content-image"), "hidden" )
										
										scope.addClass( btnGallery, "hidden" )
										
									})
									
								})
								
								
								//browse
							
								//end button
								scope.attachListener( btnBack, 'click', function(){
									
									obj.modal.behaviour.closeFadeout() 
									
								})
								
								//save button
								scope.attachListener( btnSend, 'click', function(){
									
									if( saveState && /hidden/i.test( btnGallery.className) ){
										
										saveState = false;
										
										//let base64Img = self.cropper.getCroppedCanvas().toDataURL('image/jpeg');
										  
										obj.storageCrud( 
											scope.extend({
												dataStorage : "avatar",
												type : "select",
												id : dataBaby.id
											}),
											function( data ){
													 	
												obj.cordova.camera.cloneImgToFolder( self.imageUri, function( cloneuri ){
												  
													if( data ){
														
														//hapus gambar lama jika diupdate
														
														let avaCnt = obj.dataStorage.avatar.filter(function( item ){
															
															return item.babyId === dataBaby.id;
														})
																		
														if( avaCnt.length ){
																
															let base64Img = avaCnt[0].base64Img 
														 
															try {
																//apakah base64Img
																global.atob( base64Img ); 
															
															} catch(e) {
																
																// bukan berarti filauri
		 
																let uriArr = base64Img.split("/"),
																fileName = uriArr[ uriArr.length - 1 ];
																 
																obj.cordova.file.remove({
																	path : base64Img,
																	fileName : fileName
																})
																
															}
	 
														}
														
														
														obj.storageCrud( 
															scope.extend({
																dataStorage : "avatar",
																type : "update",
																base64Img : cloneuri,
																id : dataBaby.id
															}),
															function(){
																 
																target.setAttribute("style", 'background: url('+ cloneuri +') no-repeat center;' );
																
																saveState = true;
																
																scope.addClass( modal.querySelector(".browse-content-image"), "hidden" )
																
																scope.removeClass( btnGallery, "hidden" )
																
																obj.modal.behaviour.closeFadeout();
																
																obj.cordova.camera.cleanup();
															}
														)
														
													}else{
														
														obj.storageCrud( 
															scope.extend({
																dataStorage : "avatar",
																type : "add",
																base64Img : cloneuri,
																id : dataBaby.id
															}),
															function(){
																 
																target.setAttribute("style", 'background: url('+ cloneuri +') no-repeat center;' );
																
																saveState = true;
																
																scope.addClass( modal.querySelector(".browse-content-image"), "hidden" )
																
																scope.removeClass( btnGallery, "hidden" )
																
																obj.modal.behaviour.closeFadeout(); 
																
																obj.cordova.camera.cleanup();
															}
														)
														
													}
												 
													
												})	
												 
											}
										)
										 
									} 
									 
								})
								
							
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
									id : "com.owlpictureid.kms.gold",
									alias : "GOLD",
									updateUI : function( product ){
										
										let fragment = scope.stringToHtml5Template(
											'<p class="m0"> '+
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
											
											dateNextYear.setFullYear( dateNextYear.getFullYear() + 1 )

											activeIap.product = "GOLD";
											activeIap.dateStart = dateNow.toLocaleString("id-ID");
											activeIap.dateEnd = dateNextYear.toLocaleString("id-ID");
											  
											obj.dataStorage.IAP.history.unshift( activeIap )
											  
											scope.text( scope.qs("modal-restore-txt"), 
												'Anda telah berhasil melakukan transaksi untuk menjadi donatur GOLD,'+
												'Silahkan tutup aplikasi untuk memastikan data telah diperbarui' 
											)
											  
											obj.cordova.localStorage.put();
											 
											obj.modalMenu.behaviour.openFadeIn( "modal-menu-restore" );
											 
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
							itemConsumeSilver : function(){
								
								let self = this,
								container = scope.qs("silver-desc"),
								btnSilver = scope.qs("btn-silver");
								 
								this.store({
									id : "com.owlpictureid.kms.silver",
									alias : "SILVER",
									updateUI : function( product ){
										
										let fragment = scope.stringToHtml5Template(
											'<p class="m0"> '+
											'	Melakukan pembayaran sebesar  '+
											'		<b>'+ product.price +'</b>  '+
											'	untuk melakukan transaksi SILVER, tap beli untuk melanjutkan  '+
											'</p> '
										)
												
										container.innerHTML = "";
										
										container.appendChild( fragment )
										
									},
									finishPurchase : function( product ){
										 
										//if( !self.isIapActive() ){}
											 
											let activeIap = obj.dataStorage.IAP.active,
											dateNow = new Date(),
											dateMonth6Plus = new Date();
											
											dateMonth6Plus.setMonth( dateMonth6Plus.getMonth() + 6 )

											activeIap.product = "SILVER";
											activeIap.dateStart = dateNow.toLocaleString("id-ID");
											activeIap.dateEnd = dateMonth6Plus.toLocaleString("id-ID");
											  
											obj.dataStorage.IAP.history.unshift( activeIap )
											  
											scope.text( scope.qs("modal-restore-txt"), 
												'Anda telah berhasil melakukan transaksi untuk menjadi donatur SILVER,'+
												' Silahkan tutup aplikasi untuk memastikan data telah diperbarui' 
											)
											 
											obj.cordova.localStorage.put();
											 
											obj.modalMenu.behaviour.openFadeIn( "modal-menu-restore" );
											 
											product.finish();
											 
										
										 
									},
									error : function(error) {
									 
										alert( "Pembayaran gagal " + error.code + ": " + error.message );
										 
										self.localProcess.itemConsumeSilver = false;
									
									}
								});
								
								
								btnSilver.addEventListener( "click", function( e ) {
									
									self.localProcess.itemConsumeSilver = true;
								
									global.store.order('SILVER');
									
									global.store.when("order").rejected(function(order) {
										
										alert( "Pembayaran gagal : transaksi pembayaran SILVER ditolak" )
										
									});
																 		
									store.when("order").cancelled(function(order) {
										
										alert( "Pembayaran gagal : transaksi pembayaran SILVER dibatalkan" )
										
									});
								})
								
								
							},
							itemConsumeBronze : function(){
								
								let self = this,
								container = scope.qs("bronze-desc"),
								btnSilver = scope.qs("btn-bronze");
								 
								this.store({
									id : "com.owlpictureid.kms.bronze",
									alias : "BRONZE",
									updateUI : function( product ){
										
										let fragment = scope.stringToHtml5Template(
											'<p class="m0"> '+
											'	Melakukan pembayaran sebesar  '+
											'		<b>'+ product.price +'</b>  '+
											'	untuk melakukan transaksi bronze, tap beli untuk melanjutkan  '+
											'</p> '
										)
												
										container.innerHTML = "";
										
										container.appendChild( fragment )
										 
									},
									finishPurchase : function( product ){
										
										//if( !self.isIapActive() ){}	
										
											let activeIap = obj.dataStorage.IAP.active,
											dateNow = new Date(),
											dateMonth3Plus = new Date();
											
											dateMonth3Plus.setMonth( dateMonth3Plus.getMonth() + 3 )

											activeIap.product = "BRONZE";
											activeIap.dateStart = dateNow.toLocaleString("id-ID");
											activeIap.dateEnd = dateMonth3Plus.toLocaleString("id-ID");
											 
											obj.dataStorage.IAP.history.unshift( activeIap )
											  
											scope.text( scope.qs("modal-restore-txt"), 
												'Anda telah berhasil melakukan transaksi untuk menjadi donatur BRONZE,'+
												' Silahkan tutup aplikasi untuk memastikan data telah diperbarui' 
											)
											 
											obj.cordova.localStorage.put();
											 
											obj.modalMenu.behaviour.openFadeIn( "modal-menu-restore" );
											 
											product.finish();
											  
										
									},
									error : function(error) {
									 
										alert( "Pembayaran gagal " + error.code + ": " + error.message );
										 
										self.localProcess.itemConsumeBronze = false;
									
									}
								})
								
								
								btnSilver.addEventListener( "click", function( e ) {
									
									self.localProcess.itemConsumeBronze = true;
								 
									global.store.order('BRONZE');
									
									global.store.when("order").rejected(function(order) {
										
										alert( "Pembayaran gagal : transaksi pembayaran BRONZE ditolak" )
										
									});
															 		
									store.when("order").cancelled(function(order) {
										
										alert( "Pembayaran gagal : transaksi pembayaran BRONZE dibatalkan" )
										
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
									iapTotDaysEl = scope.qs("iap-tot-days"),
									menuIap = scope.qs("menu-iap"),
									disconnectIap = scope.qs("iap-menu-disconnect"),
									iapElProduct = scope.qs("iap-product"),
									activeIap = obj.dataStorage.IAP.active,
									dateNow = new Date(),
									dateEnd = scope.stringToDate( activeIap.dateEnd ),
									product = activeIap.product,
									totDays = scope.getMinutesHourDayOrWeekBetweenDates( dateEnd, dateNow, "day" );
									
									scope.text( iapTotDaysEl, totDays +" hari lagi " )
									
									scope.removeClass( purchaseLabel, "hidden" )
									
									scope.text( purchaseLabel, product )
									
									scope.text( iapElProduct, activeIap.product )
									
									scope.text( purchaseDesc, "Telah menjadi Donatur "+activeIap.product+", akan berakhir dalam "+totDays +" hari lagi" )
									
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
									 
									this.itemConsumeSilver();
									
									this.itemConsumeBronze();
									 
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
										 
										//admob intersitial id "ca-app-pub-2736357291185199/7101101642".split("").reverse();
										//admob intersitial test ca-app-pub-3940256099942544/1033173712
										
										let intersitialId = ["2", "4", "6", "1", "0", "1", "1", "0", "1", "7", "/", "9", "9", "1", "5", "8", "1", "1", "9", "2", "7", "5", "3", "6", "3", "7", "2", "-", "b", "u", "p", "-", "p", "p", "a", "-", "a", "c"]
										 
										global.admob.interstitial.config({
											id : intersitialId.reverse().join(""), 
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
										 
										//admob banner "ca-app-pub-2736357291185199/9898639466".split("").reverse();
										//admob banner test ca-app-pub-3940256099942544/6300978111
										 
										let bannerIdArr = ["6", "6", "4", "9", "3", "6", "8", "9", "8", "9", "/", "9", "9", "1", "5", "8", "1", "1", "9", "2", "7", "5", "3", "6", "3", "7", "2", "-", "b", "u", "p", "-", "p", "p", "a", "-", "a", "c"];
										
										global.admob.banner.config({
											id : bannerIdArr.reverse().join(""),
											overlap : true, 
											size : 'SMART_BANNER',
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
											 		
											menuPagingActivity.forEach(function( el ){
												
												scope.removeClass( el, "banner" )
											})
											
										}else{
											
											scope.removeClass( modalBanner, "hidden" )
											 
											scope.addClass( modalBtn, "popup-banner" )
											 		
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
								
								if( obj.dataStorage.babiesData.length ){
									  
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
										
										if( obj.dataStorage.babiesData.length ){
											 
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
							scope.addClass( headerLi[ scope.random(1,1) ], "hidden" )
							 
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
							modalPicHeader =  scope.qs("modal-browse-image").querySelector(".modal-header"),
							modalPicTitle =  scope.qs("modal-browse-image").querySelector(".modal-title"),
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
							
								
							//modal pic
							modalPicHeader.setAttribute("style", style );
							modalPicTitle.setAttribute("style", style );
							
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
							scope.qs("growth-button").setAttribute("style", style ); 
							scope.qs("vaccine-button").setAttribute("style", style ); 
							  
						}
					},
					loadMore : {
						state :{
							vaccine : {
								reset : function(){
									
									this.disableState = 0;
									
									this.disabled = false;
									
									this.current = 0;
									
									this.index = [];
									
								},
								maximum : 30,
								current : 0,
								index : [],
								disabled : false,
								disableState : 0,
								element : ""
							},
							resume : {
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
							bmiForAge : {
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
							lhForAge : {
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
							armForAge : {
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
									 
									if( typeof obj.main[ params.main ] === "function" ){
										
										obj.main[ params.main ]({
											loadmore : true
										})
										
									}else{
										
										obj.main[ params.main ].update({
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
								
								//perbaru color seperti  class nofity strip
								obj.appConfig.color( true );
								 
							} 
							
						},
						init : function(){
							let self = this,
							loadMoreInterval = setInterval(function(){
								   
								self.loadTracker({
									container : "vaccine-content",
									main : "vaccine",
									isDataChart : false
								});
								 
								self.loadTracker({
									container : "resume-content",
									main : "resume",
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
									container : "bmi-wrapper",
									main : "bmiForAge",
									isDataChart : true
								});
								
								self.loadTracker({
									container : "hc-wrapper",
									main : "hcForAge",
									isDataChart : true
								});
								
								self.loadTracker({
									container : "lhfa-wrapper",
									main : "lhForAge",
									isDataChart : true
								});
								
								
								self.loadTracker({
									container : "afa-wrapper",
									main : "armForAge",
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
								
								if( objData.babyId === dataBaby.id || objData.activityType === "Pompa Asi" ){
									
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
										'	<span class="m20 extrabold title">'+ dataTemplate[ii].stringName +'</span>' +
										'	<ul class="list-inline border-none chart-activity m20 p20">'+
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
														//console.log( objTrack.totMinutes +' '+ ( Math.trunc( objTrack.totMinutes  / 60 )  +'.'+ objTrack.totMinutes % 60 ) )
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
									initialSlide: 0//obj.dataStorage.layoutState.polarSwiperChart.index
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
							  
							 
						},
						
						generateChart : function( params ){
							let data =  obj.storageFilter( obj.dataStorage.tracker ),
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
						convertDataStorageToPuser : function( dataChart, storageString, isZscore ){
							  
							let data = obj.dataStorage[ storageString ],
							isBoy = this.gender === "boy",
							pUser = isZscore ? ( isBoy ? dataChart.boyZscore.pUser : dataChart.girlZscore.pUser ) :
								( isBoy ? dataChart.boy.pUser : dataChart.girl.pUser );
							
							//clear it first
							pUser.map(function( objData, index ){
								 
								pUser[ index ] = null
							}) 
							
							
							//then update
							
							data.map(function( objData ){
								 
							
								if( objData.babyId === dataBaby.id ){
									 
									let dataPuser =  storageString === "bmi" ? objData.bmi :
										storageString === "hc" ? objData.hc : //head circumference 
										storageString === "lhfa" ? objData.height :
										storageString === "afa" ? objData.arm :
										objData.weight;
									 
									pUser[ storageString === "afa" ? objData.monthTo - 3 : objData.monthTo ] = dataPuser
									
								}
								
							}) 
							
						},
						dateBaby : function( params ){
							
							let dateStart =  scope.stringToDate( dataBaby.birthdate ),
							dateEnd = scope.stringToDate( dataBaby.birthdate ),
							birthNowToMonth = params && params.dateSelect ?  params.dateSelect : new Date();
							  
							dateEnd.setMonth( dateEnd.getMonth() + 60 ).toLocaleString("id-ID"); // make it 60 in total month between two dates
							 
							//params && console.log( params  )							
							 
							return {
								birthDateStart : dateStart,
								birthDateEnd : dateEnd,
								birthNowToMonth : birthNowToMonth,
								birthNowTotalMonth : scope.getTotalMonths( birthNowToMonth, dateStart )
							};
						},
						generateData : function( dataChart, isZscore ){
							
							
							
							let range = {},  
							isBoy = obj.chart.gender === "boy",
							data = isZscore ? ( isBoy ? dataChart.boyZscore : dataChart.girlZscore ) :
								( isBoy ? dataChart.boy : dataChart.girl ),
								
							index = scope.findClosestInArr( dataChart.ageInMonth, data.labels ).index, 
								
								
								
							rangeFn = function(){ 
								
								let rangeInterval = index <= 6 ?  12 - index : // 12 maxium interval
								index >  data.labels.length - 6 ?  index - ( data.labels.length - 11 ) : 
								6, // 6 is maximum for range interval if min and max meet requirements
								
								
								bugMin = rangeInterval === 12 ? 1 : index,
								minRange = scope.indexRange( bugMin - 1, ( bugMin - 1 - rangeInterval ) ),
								
								rangeIntervalUpdate = rangeInterval - minRange.length,
								maxRange = scope.indexRange( index, ( index + parseInt( rangeInterval - rangeIntervalUpdate ) ) );	
								  
								range.labels = [];
								range.p01 = [];
								range.p1 = [];
								range.p3 = [];
								range.p5 = [];
								range.p10 = [];
								range.p15 = [];
								range.p25 = [];
								range.p50 = [];
								range.p75 = [];
								range.p85 = [];
								range.p90 = [];
								range.p95 = [];
								range.p97 = [];
								range.p99 = [];
								range.p999 = [];
								data.pUser && ( range.pUser = [] );
								 	 
								minRange.map(function( key ){
									if( data.labels[key] || data.labels[key] === 0 ){
										
										range.labels.push( data.labels[key] );
										
										data.p01 && range.p01.push( data.p01[key] );
										
										range.p1.push( data.p1[key] );
										
										data.p3 && range.p3.push( data.p3[key] );
										
										range.p5.push( data.p5[key] );
										
										data.p10 && range.p10.push( data.p10[key] );
										
										range.p15.push( data.p15[key] );
										
										data.p25 && range.p25.push( data.p25[key] );
										
										range.p50.push( data.p50[key] );
										
										data.p75 && range.p75.push( data.p75[key] );
										
										range.p85.push( data.p85[key] );
										
										data.p90 && range.p90.push( data.p90[key] );
										
										range.p95.push( data.p95[key] );
										
										data.p97 && range.p97.push( data.p97[key] );
										
										range.p99.push( data.p99[key] ); 
										
										data.p999 && range.p999.push( data.p999[key] );
										
										data.pUser && range.pUser.push( data.pUser[key] );
									}
								})
								
								maxRange.map(function( key ){
									
									
									if( data.labels[key] ){
										range.labels.unshift( data.labels[key] );
										
										data.p01 && range.p01.unshift( data.p01[key] );
										
										range.p1.unshift( data.p1[key] ); 
										
										data.p3 && range.p3.unshift( data.p3[key] );
										
										range.p5.unshift( data.p5[key] );
										
										data.p10 && range.p10.unshift( data.p10[key] );
										
										range.p15.unshift( data.p15[key] );
										
										data.p25 && range.p25.unshift( data.p25[key] );
										
										range.p50.unshift( data.p50[key] );
										
										data.p75 && range.p75.unshift( data.p75[key] );
										
										range.p85.unshift( data.p85[key] );
										
										data.p90 && range.p90.unshift( data.p90[key] );
										
										range.p95.unshift( data.p95[key] );
										
										data.p97 && range.p97.unshift( data.p97[key] );
										
										range.p99.unshift( data.p99[key] ); 
										
										data.p999 && range.p999.unshift( data.p999[key] );
										
										data.pUser && range.pUser.unshift( data.pUser[key] );
									}
								})
								
								range.labels.reverse();
								range.p01.reverse();
								range.p1.reverse();
								range.p3.reverse();
								range.p5.reverse();
								range.p10.reverse();
								range.p15.reverse();
								range.p25.reverse();
								range.p50.reverse();
								range.p75.reverse();
								range.p85.reverse();
								range.p90.reverse();
								range.p95.reverse();
								range.p97.reverse();
								range.p99.reverse();
								range.p999.reverse();
								data.pUser && range.pUser.reverse();
								 
							};
							 
						  
							rangeFn(); 
							
							 
							return range;	
								
						},
						generateChart : function( params, isZscore ){
							 
								let label = isZscore ? [ "SD -3","SD -2","SD -1","SD 0","SD +1","SD +2","SD +3" ] : [ "P01","P1","P3","P5","P10","P15","P25","P50","P75","P85","P90","P95","P97","P99","P999" ],
								ctx = document.getElementById( params.canvas ),
								data = obj.chart.generateData( params.data, isZscore ),
								dataUser  = params.color ? {
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
								datasets = isZscore ? 
								[
									dataUser,
									{
										label: label[0],
										data: data.p1,
										borderWidth: 1,
										//borderWidth: 4,
										//borderColor : ['rgba(255, 98, 98, 0.5)'],
										fill: '2',
										pointRadius: 0,
										backgroundColor: [
											'rgba(255, 207, 32, 0.5)'
										],
									},
									{
										label: label[1],
										data: data.p5,
										borderWidth: 1,
										fill: '3',
										pointRadius: 0,
										backgroundColor: [
											'rgba(183, 224, 16, 0.4)'
										]
									},
									{
										label: label[2],
										data: data.p15,
										borderWidth: 1,
										fill: '4',
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.6)'
										]
									},
									{
										label: label[3],
										data: data.p50,
										borderWidth: 1,
										fill: '5',
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.6)'
										]
									},
									{
										label: label[4],
										data: data.p85,
										borderWidth: 1,
										fill: '6',
										pointRadius: 0,
										backgroundColor: [
											'rgba(183, 224, 16, 0.5)'
										]
									},
									{
										label: label[5],
										data: data.p95,
										borderWidth: 1,
										fill: '7',
										pointRadius: 0,
										backgroundColor: [
											'rgba(255, 224, 0, 0.5)'
										]
									},
									{
										label: label[6],
										data: data.p99,
										borderWidth: 1,
										fill:'8',
										pointRadius: 0,
										backgroundColor: [
											'rgba(224, 170, 16, 0.6)'
										]
									} 
								] : [
								
									dataUser,
									{
										label: label[0],
										data: data.p01,
										borderWidth: 1,
										fill: '2',
										pointRadius: 0,
										backgroundColor: [
											'rgba(255, 224, 0, 0.6)'
										],
									},
									{
										label: label[1],
										data: data.p1,
										borderWidth: 1,
										fill: '3',
										pointRadius: 0,
										backgroundColor: [
											'rgba(255, 224, 0, 0.56)'
										]
									},
									{
										label: label[2],
										data: data.p3,
										borderWidth: 1,
										fill: '4',
										pointRadius: 0,
										backgroundColor: [
											'rgba(183, 224, 16, 0.5)'
										]
									},
									{
										label: label[3],
										data: data.p5,
										borderWidth: 1,
										fill: '5',
										pointRadius: 0,
										backgroundColor: [
											'rgba(115, 224, 16, 0.5)'
										]
									},
									{
										label: label[4],
										data: data.p10,
										borderWidth: 1,
										fill: '6',
										pointRadius: 0,
										backgroundColor: [
											'rgba(115, 224, 16, 0.5)'
										]
									},
									{
										label: label[5],
										data: data.p15,
										borderWidth: 1,
										fill: '7',
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.6)'
										]
									},
									{
										label: label[6],
										data: data.p25,
										borderWidth: 1,
										fill: '8',
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.7)'
										]
									},
									{
										label: label[7],
										data: data.p50,
										borderWidth: 1,
										fill: false,
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.8)'
										],
									},
									{
										label: label[8],
										data: data.p75,
										borderWidth: 1,
										fill: '8',
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.7)'
										]
									},
									{
										label: label[9],
										data: data.p85,
										borderWidth: 1,
										fill: '9',
										pointRadius: 0,
										backgroundColor: [
											'rgba(54, 183, 21, 0.6)'
										]
									},
									{
										label: label[10],
										data: data.p90,
										borderWidth: 1,
										fill: '10',
										pointRadius: 0,
										backgroundColor: [ 
											'rgba(115, 224, 16, 0.5)'
										]
									},
									{
										label: label[11],
										data: data.p95,
										borderWidth: 1,
										fill: '11',
										pointRadius: 0,
										backgroundColor: [
											'rgba(115, 224, 16, 0.5)'
										]
									},
									{
										label: label[12],
										data: data.p97,
										borderWidth: 1,
										fill: '12',
										pointRadius: 0,
										backgroundColor: [
											'rgba(183, 224, 16, 0.5)'
										]
									} ,
									{
										label: label[13],
										data: data.p99,
										borderWidth: 1,
										fill: '13',
										pointRadius: 0,
										backgroundColor: [
											'rgba(255, 224, 0, 0.56)'
										]
									} ,
									{
										label: label[14],
										data: data.p999,
										borderWidth: 1,
										fill: '14',
										pointRadius: 0,
										backgroundColor: [
											'rgba(255, 224, 0, 0.6)'
										]
									} 
									
								], 
								options = Object.create({
								  type: 'line',
								  data: {
									labels: data.labels,
									datasets : datasets
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
						updateChart : function (chart, label, data, dir ) {
							labelOrigin = chart.data.labels,
							labelUpdate = label[ label.length - 1 ];
							
							
							if( labelOrigin[ labelOrigin.length - 1 ] !== labelUpdate && dir === "right"){
							
								chart.data.labels.shift();
								chart.data.datasets.forEach((dataset, index) => {
									if( data[ index ] ){
										dataset.data.shift();
									}
								});
								  
								  
								chart.data.labels.push( label[ label.length - 1 ] );
								chart.data.datasets.forEach((dataset, index ) => {
									
									if( data[ index ] ){
										var getData = data[ index ]; 
										dataset.data.push( getData[ getData.length - 1 ] );
									}
								});
								 
							}else if( labelOrigin[ 0 ] !== label[0] && dir === "left"){
								chart.data.labels.pop();
								chart.data.datasets.forEach((dataset,index) => {
									if( data[ index ] ){
										dataset.data.pop();
									}
								});
								   
								chart.data.labels.unshift( label[0] );
								
								chart.data.datasets.forEach((dataset, index ) => {
									
									if( data[ index ] ){
										var getData = data[ index ]; 
										dataset.data.unshift( getData[ 0 ] );
										
									}
								}); 
							}
							
							chart.update();
						},
						armForAge : {
							canvas : "canvas-afa",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							isZscore : false,
							data : {
								ageInMonth : 65,
								girl : {
									labels : [60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3].reverse(),
									pUser : function(){
										let count = 61,
										temp = [];
										 
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [ 10.1,10.4,10.6,10.7,10.8,10.9,10.9,11,11,11.1,11.1,11.1,11.2,11.2,11.3,11.3,11.4,11.4,11.5,11.5,11.6,11.6,11.7,11.7,11.8,11.9,11.9,11.9,12,12,12.1,12.1,12.1,12.1,12.2,12.2,12.2,12.3,12.3,12.3,12.3,12.3,12.4,12.4,12.4,12.4,12.5,12.5,12.5,12.5,12.6,12.6,12.6,12.6,12.6,12.7,12.7,12.7 ],
									p1 : [13.6,13.6,13.6,13.5,13.5,13.5,13.4,13.4,13.4,13.4,13.3,13.3,13.3,13.2,13.2,13.2,13.2,13.1,13.1,13.1,13,13,13,12.9,12.9,12.9,12.8,12.8,12.8,12.7,12.7,12.6,12.6,12.5,12.5,12.4,12.4,12.3,12.2,12.2,12.1,12.1,12,12,11.9,11.9,11.8,11.8,11.8,11.7,11.7,11.6,11.6,11.5,11.4,11.2,11.1,10.8].reverse(),
									p3 : [14.2, 14.1, 14.1, 14.1, 14, 14, 14, 14, 13.9, 13.9, 13.9, 13.8, 13.8, 13.8, 13.7, 13.7, 13.7, 13.6, 13.6, 13.6, 13.5, 13.5, 13.5, 13.4, 13.4, 13.4, 13.3, 13.3, 13.2, 13.2, 13.2, 13.1, 13, 13, 12.9, 12.9, 12.8, 12.7, 12.7, 12.6, 12.6, 12.5, 12.4, 12.4, 12.4, 12.3, 12.3, 12.2, 12.2, 12.1, 12.1, 12, 12, 11.9, 11.8, 11.7, 11.5, 11.2].reverse(),
									p5 : [14.5,14.4,14.4,14.4,14.3,14.3,14.3,14.2,14.2,14.2,14.1,14.1,14.1,14,14,14,13.9,13.9,13.9,13.8,13.8,13.8,13.7,13.7,13.7,13.6,13.6,13.5,13.5,13.4,13.4,13.3,13.3,13.2,13.2,13.1,13,13,12.9,12.9,12.8,12.7,12.7,12.6,12.6,12.5,12.5,12.5,12.4,12.4,12.3,12.3,12.2,12.1,12,11.9,11.7,11.4].reverse(),
									p10 : [15, 14.9, 14.9, 14.9, 14.8, 14.8, 14.7, 14.7, 14.7, 14.6, 14.6, 14.6, 14.5, 14.5, 14.4, 14.4, 14.4, 14.3, 14.3, 14.3, 14.2, 14.2, 14.1, 14.1, 14.1, 14, 14, 13.9, 13.9, 13.9, 13.8, 13.7, 13.7, 13.6, 13.6, 13.5, 13.4, 13.4, 13.3, 13.2, 13.2, 13.1, 13.1, 13, 13, 12.9, 12.9, 12.8, 12.8, 12.7, 12.7, 12.7, 12.6, 12.5, 12.4, 12.2, 12, 11.7].reverse(),
									p15 : [15.3,15.3,15.2,15.2,15.2,15.1,15.1,15,15,15,14.9,14.9,14.8,14.8,14.8,14.7,14.7,14.6,14.6,14.6,14.5,14.5,14.4,14.4,14.4,14.3,14.3,14.2,14.2,14.1,14.1,14,14,13.9,13.8,13.8,13.7,13.6,13.6,13.5,13.4,13.4,13.3,13.3,13.2,13.2,13.1,13.1,13,13,13,12.9,12.8,12.8,12.6,12.5,12.3,12].reverse(),
									p25 : [15.8, 15.8, 15.7, 15.7, 15.7, 15.6, 15.6, 15.5, 15.5, 15.4, 15.4, 15.4, 15.3, 15.3, 15.2, 15.2, 15.1, 15.1, 15.1, 15, 15, 14.9, 14.9, 14.8, 14.8, 14.7, 14.7, 14.7, 14.6, 14.6, 14.5, 14.4, 14.4, 14.3, 14.2, 14.2, 14.1, 14, 14, 13.9, 13.8, 13.8, 13.7, 13.7, 13.6, 13.6, 13.5, 13.5, 13.4, 13.4, 13.4, 13.3, 13.2, 13.1, 13, 12.9, 12.6, 12.3].reverse(),
									p50 : [16.9,16.8,16.8,16.7,16.7,16.6,16.6,16.5,16.4,16.4,16.3,16.3,16.2,16.2,16.1,16.1,16.1,16,16,15.9,15.9,15.8,15.7,15.7,15.6,15.6,15.5,15.5,15.4,15.4,15.3,15.3,15.2,15.1,15,15,14.9,14.8,14.7,14.7,14.6,14.5,14.5,14.4,14.4,14.3,14.3,14.2,14.2,14.2,14.1,14.1,14,13.9,13.8,13.6,13.4,13].reverse(),
									p75 : [18, 17.9, 17.8, 17.8, 17.7, 17.7, 17.6, 17.5, 17.5, 17.4, 17.4, 17.3, 17.3, 17.2, 17.1, 17.1, 17, 17, 16.9, 16.9, 16.8, 16.7, 16.7, 16.6, 16.6, 16.5, 16.4, 16.4, 16.3, 16.3, 16.2, 16.1, 16, 16, 15.9, 15.8, 15.7, 15.6, 15.6, 15.5, 15.4, 15.4, 15.3, 15.2, 15.2, 15.1, 15.1, 15.1, 15, 15, 14.9, 14.9, 14.8, 14.7, 14.6, 14.4, 14.1, 13.8].reverse(),
									p85 : [18.6,18.5,18.5,18.4,18.3,18.3,18.2,18.1,18.1,18,17.9,17.9,17.8,17.8,17.7,17.6,17.6,17.5,17.5,17.4,17.3,17.3,17.2,17.1,17.1,17,17,16.9,16.8,16.8,16.7,16.6,16.5,16.5,16.4,16.3,16.2,16.1,16,16,15.9,15.8,15.8,15.7,15.7,15.6,15.6,15.5,15.5,15.5,15.4,15.3,15.3,15.2,15,14.8,14.6,14.2].reverse(),
									p90 : [19, 19, 18.9, 18.8, 18.8, 18.7, 18.6, 18.6, 18.5, 18.4, 18.4, 18.3, 18.2, 18.2, 18.1, 18, 18, 17.9, 17.8, 17.8, 17.7, 17.6, 17.6, 17.5, 17.4, 17.4, 17.3, 17.2, 17.2, 17.1, 17, 17, 16.9, 16.8, 16.7, 16.6, 16.5, 16.4, 16.4, 16.3, 16.2, 16.1, 16.1, 16, 16, 15.9, 15.9, 15.9, 15.8, 15.8, 15.7, 15.7, 15.6, 15.5, 15.3, 15.2, 14.9, 14.5].reverse(),
									p95 : [19.7,19.6,19.6,19.5,19.4,19.3,19.3,19.2,19.1,19,19,18.9,18.8,18.8,18.7,18.6,18.5,18.5,18.4,18.3,18.3,18.2,18.1,18.1,18,17.9,17.9,17.8,17.7,17.6,17.6,17.5,17.4,17.3,17.2,17.1,17,16.9,16.9,16.8,16.7,16.6,16.6,16.5,16.5,16.4,16.4,16.3,16.3,16.3,16.2,16.2,16.1,16,15.8,15.6,15.3,14.9].reverse(),
									p97 : [20.1, 20.1, 20, 19.9, 19.8, 19.8, 19.7, 19.6, 19.5, 19.5, 19.4, 19.3, 19.2, 19.2, 19.1, 19, 18.9, 18.9, 18.8, 18.7, 18.6, 18.6, 18.5, 18.4, 18.4, 18.3, 18.2, 18.1, 18.1, 18, 17.9, 17.8, 17.7, 17.7, 17.6, 17.5, 17.4, 17.3, 17.2, 17.1, 17, 17, 16.9, 16.9, 16.8, 16.8, 16.7, 16.7, 16.6, 16.6, 16.6, 16.5, 16.4, 16.3, 16.2, 15.9, 15.7, 15.3].reverse(),
									p99 : [21,20.9,20.9,20.8,20.7,20.6,20.5,20.5,20.4,20.3,20.2,20.1,20,20,19.9,19.8,19.7,19.6,19.6,19.5,19.4,19.3,19.2,19.2,19.1,19,18.9,18.8,18.8,18.7,18.6,18.5,18.4,18.3,18.2,18.1,18,17.9,17.9,17.8,17.7,17.6,17.6,17.5,17.4,17.4,17.4,17.3,17.3,17.2,17.2,17.1,17.1,16.9,16.8,16.6,16.3,15.8].reverse(),
									p999 : [ 16.9,17.4,17.7,17.9,18.1,18.2,18.3,18.4,18.4,18.5,18.5,18.5,18.6,18.6,18.7,18.7,18.8,18.9,19,19,19.1,19.2,19.3,19.4,19.6,19.7,19.8,19.9,20,20,20.1,20.2,20.3,20.4,20.5,20.6,20.7,20.8,20.8,20.9,21,21.1,21.2,21.3,21.4,21.5,21.6,21.7,21.8,21.9,22,22.1,22.2,22.3,22.4,22.5,22.6,22.7 ]
								
								},
								boy : {
									labels : [60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3].reverse(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [ 10.6,10.8,11,11.2,11.3,11.3,11.4,11.4,11.5,11.5,11.5,11.6,11.6,11.6,11.7,11.7,11.7,11.8,11.8,11.9,11.9,11.9,12,12,12.1,12.1,12.2,12.2,12.2,12.3,12.3,12.3,12.4,12.4,12.4,12.4,12.4,12.5,12.5,12.5,12.5,12.5,12.6,12.6,12.6,12.6,12.6,12.7,12.7,12.7,12.7,12.7,12.7,12.8,12.8,12.8,12.8,12.8 ],
									p1 : [13.6,13.6,13.6,13.6,13.5,13.5,13.5,13.5,13.5,13.4,13.4,13.4,13.4,13.4,13.3,13.3,13.3,13.3,13.3,13.2,13.2,13.2,13.2,13.1,13.1,13.1,13.1,13,13,13,12.9,12.9,12.9,12.8,12.8,12.7,12.7,12.6,12.6,12.5,12.5,12.4,12.4,12.4,12.3,12.3,12.3,12.2,12.2,12.2,12.2,12.1,12.1,12,11.9,11.7,11.5,11.3].reverse(),
									p3 : [14.1, 14.1, 14.1, 14.1, 14, 14, 14, 14, 13.9, 13.9, 13.9, 13.9, 13.9, 13.8, 13.8, 13.8, 13.8, 13.8, 13.7, 13.7, 13.7, 13.7, 13.6, 13.6, 13.6, 13.6, 13.5, 13.5, 13.5, 13.4, 13.4, 13.3, 13.3, 13.3, 13.2, 13.2, 13.1, 13.1, 13, 13, 12.9, 12.9, 12.8, 12.8, 12.8, 12.7, 12.7, 12.7, 12.7, 12.6, 12.6, 12.5, 12.5, 12.4, 12.3, 12.2, 11.9, 11.7].reverse(),
									p5 : [14.4,14.4,14.3,14.3,14.3,14.3,14.3,14.2,14.2,14.2,14.2,14.1,14.1,14.1,14.1,14.1,14,14,14,14,13.9,13.9,13.9,13.9,13.8,13.8,13.8,13.7,13.7,13.7,13.6,13.6,13.5,13.5,13.4,13.4,13.3,13.3,13.2,13.2,13.2,13.1,13.1,13,13,13,12.9,12.9,12.9,12.9,12.8,12.8,12.7,12.6,12.5,12.4,12.2,11.9].reverse(),
									p10 : [14.8, 14.8, 14.8, 14.8, 14.7, 14.7, 14.7, 14.7, 14.6, 14.6, 14.6, 14.6, 14.5, 14.5, 14.5, 14.5, 14.4, 14.4, 14.4, 14.4, 14.3, 14.3, 14.3, 14.3, 14.2, 14.2, 14.2, 14.1, 14.1, 14.1, 14, 14, 13.9, 13.9, 13.8, 13.8, 13.7, 13.7, 13.6, 13.6, 13.5, 13.5, 13.5, 13.4, 13.4, 13.3, 13.3, 13.3, 13.3, 13.2, 13.2, 13.2, 13.1, 13, 12.9, 12.7, 12.5, 12.2].reverse(),
									p15 : [15.1,15.1,15.1,15.1,15,15,15,15,14.9,14.9,14.9,14.9,14.8,14.8,14.8,14.8,14.7,14.7,14.7,14.6,14.6,14.6,14.6,14.5,14.5,14.5,14.4,14.4,14.4,14.3,14.3,14.2,14.2,14.1,14.1,14,14,13.9,13.9,13.8,13.8,13.7,13.7,13.7,13.6,13.6,13.6,13.5,13.5,13.5,13.5,13.4,13.3,13.3,13.1,13,12.8,12.5].reverse(),
									p25 : [15.6, 15.6, 15.5, 15.5, 15.5, 15.5, 15.4, 15.4, 15.4, 15.4, 15.3, 15.3, 15.3, 15.2, 15.2, 15.2, 15.2, 15.1, 15.1, 15.1, 15, 15, 15, 15, 14.9, 14.9, 14.9, 14.8, 14.8, 14.7, 14.7, 14.6, 14.6, 14.5, 14.5, 14.4, 14.4, 14.3, 14.3, 14.2, 14.2, 14.1, 14.1, 14.1, 14, 14, 14, 13.9, 13.9, 13.9, 13.8, 13.8, 13.7, 13.6, 13.5, 13.4, 13.1, 12.8].reverse(),
									p50 : [16.5,16.5,16.5,16.4,16.4,16.4,16.3,16.3,16.3,16.2,16.2,16.2,16.1,16.1,16.1,16,16,16,15.9,15.9,15.9,15.8,15.8,15.8,15.7,15.7,15.7,15.6,15.6,15.5,15.5,15.4,15.4,15.3,15.3,15.2,15.2,15.1,15,15,14.9,14.9,14.8,14.8,14.8,14.7,14.7,14.7,14.6,14.6,14.6,14.5,14.5,14.4,14.2,14.1,13.8,13.5].reverse(),
									p75 : [17.5, 17.5, 17.4, 17.4, 17.4, 17.3, 17.3, 17.3, 17.2, 17.2, 17.1, 17.1, 17.1, 17, 17, 17, 16.9, 16.9, 16.9, 16.8, 16.8, 16.7, 16.7, 16.7, 16.6, 16.6, 16.5, 16.5, 16.4, 16.4, 16.3, 16.3, 16.2, 16.2, 16.1, 16, 16, 15.9, 15.8, 15.8, 15.7, 15.7, 15.6, 15.6, 15.6, 15.5, 15.5, 15.5, 15.4, 15.4, 15.3, 15.3, 15.2, 15.1, 15, 14.8, 14.5, 14.2].reverse(),
									p85 : [18.1,18.1,18,18,17.9,17.9,17.8,17.8,17.8,17.7,17.7,17.6,17.6,17.6,17.5,17.5,17.4,17.4,17.4,17.3,17.3,17.2,17.2,17.1,17.1,17.1,17,17,16.9,16.9,16.8,16.7,16.7,16.6,16.6,16.5,16.4,16.4,16.3,16.2,16.2,16.1,16.1,16,16,16,15.9,15.9,15.9,15.8,15.8,15.7,15.6,15.5,15.4,15.2,14.9,14.6].reverse(),
									p90 : [18.5, 18.5, 18.4, 18.4, 18.3, 18.3, 18.2, 18.2, 18.1, 18.1, 18.1, 18, 18, 17.9, 17.9, 17.8, 17.8, 17.8, 17.7, 17.7, 17.6, 17.6, 17.5, 17.5, 17.4, 17.4, 17.3, 17.3, 17.2, 17.2, 17.1, 17.1, 17, 16.9, 16.9, 16.8, 16.7, 16.7, 16.6, 16.6, 16.5, 16.4, 16.4, 16.3, 16.3, 16.3, 16.2, 16.2, 16.2, 16.1, 16.1, 16, 15.9, 15.8, 15.7, 15.5, 15.2, 14.8].reverse(),
									p95 : [19.1,19.1,19,19,18.9,18.9,18.8,18.8,18.7,18.7,18.6,18.6,18.5,18.5,18.5,18.4,18.4,18.3,18.3,18.2,18.2,18.1,18.1,18,18,17.9,17.9,17.8,17.8,17.7,17.6,17.6,17.5,17.4,17.4,17.3,17.2,17.2,17.1,17,17,16.9,16.9,16.8,16.8,16.7,16.7,16.6,16.6,16.6,16.5,16.5,16.4,16.3,16.1,15.9,15.6,15.2].reverse(),
									p97 : [19.5, 19.5, 19.4, 19.4, 19.3, 19.3, 19.2, 19.2, 19.1, 19.1, 19, 19, 18.9, 18.9, 18.8, 18.8, 18.7, 18.7, 18.6, 18.6, 18.5, 18.5, 18.4, 18.4, 18.3, 18.3, 18.2, 18.2, 18.1, 18, 18, 17.9, 17.8, 17.8, 17.7, 17.6, 17.5, 17.5, 17.4, 17.3, 17.3, 17.2, 17.2, 17.1, 17.1, 17, 17, 16.9, 16.9, 16.9, 16.8, 16.7, 16.7, 16.5, 16.4, 16.2, 15.9, 15.5].reverse(),
									p99 : [20.4,20.3,20.2,20.2,20.1,20.1,20,20,19.9,19.9,19.8,19.7,19.7,19.6,19.6,19.5,19.5,19.4,19.3,19.3,19.2,19.2,19.1,19.1,19,18.9,18.9,18.8,18.8,18.7,18.6,18.5,18.5,18.4,18.3,18.2,18.2,18.1,18,17.9,17.9,17.8,17.8,17.7,17.7,17.6,17.6,17.5,17.5,17.4,17.4,17.3,17.2,17.1,16.9,16.7,16.4,16].reverse(),
									p999 : [ 16.8,17.3,17.6,17.9,18.1,18.2,18.3,18.4,18.5,18.5,18.6,18.6,18.7,18.7,18.8,18.8,18.9,19,19,19.1,19.2,19.3,19.4,19.5,19.5,19.6,19.7,19.8,19.9,20,20,20.1,20.2,20.2,20.3,20.4,20.5,20.5,20.6,20.7,20.7,20.8,20.9,20.9,21,21.1,21.1,21.2,21.3,21.3,21.4,21.5,21.5,21.6,21.7,21.8,21.8,21.9 ]
								},
								girlZscore : {
									labels : [60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3].reverse(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [10.2,10.5,10.7,10.8,10.9,11,11,11.1,11.1,11.1,11.2,11.2,11.3,11.3,11.4,11.4,11.4,11.5,11.6,11.6,11.7,11.7,11.8,11.8,11.9,11.9,12,12,12.1,12.1,12.1,12.2,12.2,12.2,12.3,12.3,12.3,12.3,12.4,12.4,12.4,12.4,12.5,12.5,12.5,12.5,12.6,12.6,12.6,12.6,12.7,12.7,12.7,12.7,12.7,12.8,12.8,12.8],
									//SD 2 Neg 
									p5 : [11.1,11.3,11.5,11.7,11.8,11.9,11.9,12,12,12.1,12.1,12.1,12.2,12.2,12.3,12.3,12.4,12.4,12.5,12.6,12.6,12.7,12.7,12.8,12.9,12.9,13,13,13.1,13.1,13.2,13.2,13.2,13.3,13.3,13.3,13.4,13.4,13.4,13.5,13.5,13.5,13.6,13.6,13.6,13.6,13.7,13.7,13.7,13.8,13.8,13.8,13.9,13.9,13.9,14,14,14],
									//SD 1 Neg
									p15 : [12,12.3,12.5,12.7,12.8,12.9,12.9,13,13,13.1,13.1,13.2,13.2,13.3,13.3,13.4,13.4,13.5,13.5,13.6,13.7,13.7,13.8,13.9,13.9,14,14.1,14.1,14.2,14.2,14.3,14.3,14.4,14.4,14.4,14.5,14.5,14.6,14.6,14.6,14.7,14.7,14.8,14.8,14.8,14.9,14.9,15,15,15,15.1,15.1,15.2,15.2,15.2,15.3,15.3,15.4],
									//SD 0
									p50 : [13,13.4,13.6,13.8,13.9,14,14.1,14.1,14.2,14.2,14.2,14.3,14.3,14.4,14.4,14.5,14.5,14.6,14.7,14.7,14.8,14.9,15,15,15.1,15.2,15.3,15.3,15.4,15.4,15.5,15.5,15.6,15.6,15.7,15.7,15.8,15.9,15.9,16,16,16.1,16.1,16.1,16.2,16.2,16.3,16.3,16.4,16.4,16.5,16.6,16.6,16.7,16.7,16.8,16.8,16.9],
									//SD 1
									p85 : [14.2,14.5,14.8,15,15.1,15.2,15.3,15.4,15.4,15.4,15.5,15.5,15.6,15.6,15.7,15.7,15.8,15.8,15.9,16,16.1,16.1,16.2,16.3,16.4,16.5,16.6,16.6,16.7,16.8,16.8,16.9,17,17,17.1,17.1,17.2,17.3,17.3,17.4,17.5,17.5,17.6,17.6,17.7,17.8,17.8,17.9,18,18,18.1,18.1,18.2,18.3,18.3,18.4,18.5,18.5],
									//SD 2
									p95 : [15.4,15.8,16.1,16.3,16.5,16.6,16.7,16.7,16.8,16.8,16.8,16.9,16.9,17,17,17.1,17.1,17.2,17.3,17.4,17.5,17.5,17.6,17.7,17.8,17.9,18,18.1,18.2,18.3,18.3,18.4,18.5,18.5,18.6,18.7,18.8,18.8,18.9,19,19.1,19.1,19.2,19.3,19.4,19.4,19.5,19.6,19.7,19.8,19.8,19.9,20,20.1,20.1,20.2,20.3,20.4],
									//SD 3
									p99 : [16.8,17.2,17.6,17.8,18,18.1,18.2,18.2,18.3,18.3,18.3,18.4,18.4,18.5,18.5,18.6,18.7,18.7,18.8,18.9,19,19.1,19.2,19.3,19.4,19.5,19.6,19.7,19.8,19.9,20,20.1,20.1,20.2,20.3,20.4,20.5,20.6,20.7,20.8,20.9,21,21,21.1,21.2,21.3,21.4,21.5,21.6,21.7,21.8,21.9,22,22.1,22.2,22.3,22.4,22.5]
								},
								boyZscore : {
									labels : [60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3].reverse(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [10.7,10.9,11.1,11.3,11.4,11.4,11.5,11.5,11.6,11.6,11.6,11.6,11.7,11.7,11.7,11.8,11.8,11.9,11.9,11.9,12,12,12.1,12.1,12.2,12.2,12.3,12.3,12.3,12.4,12.4,12.4,12.4,12.5,12.5,12.5,12.5,12.6,12.6,12.6,12.6,12.6,12.7,12.7,12.7,12.7,12.7,12.7,12.8,12.8,12.8,12.8,12.8,12.8,12.9,12.9,12.9,12.9],
									//SD 2 Neg
									p5 : [11.6,11.8,12,12.2,12.3,12.4,12.4,12.5,12.5,12.5,12.6,12.6,12.6,12.7,12.7,12.7,12.8,12.8,12.8,12.9,12.9,13,13,13.1,13.1,13.2,13.2,13.3,13.3,13.3,13.4,13.4,13.4,13.5,13.5,13.5,13.5,13.6,13.6,13.6,13.6,13.6,13.7,13.7,13.7,13.7,13.8,13.8,13.8,13.8,13.8,13.9,13.9,13.9,13.9,13.9,14,14],
									//SD 1 Neg
									p15 : [12.5,12.8,13,13.2,13.3,13.4,13.4,13.5,13.5,13.6,13.6,13.6,13.6,13.7,13.7,13.7,13.8,13.8,13.9,13.9,14,14,14.1,14.1,14.2,14.2,14.3,14.3,14.4,14.4,14.4,14.5,14.5,14.5,14.6,14.6,14.6,14.7,14.7,14.7,14.7,14.8,14.8,14.8,14.8,14.9,14.9,14.9,14.9,15,15,15,15,15.1,15.1,15.1,15.2,15.2],
									//SD 0
									p50 : [13.5,13.8,14.1,14.2,14.4,14.5,14.5,14.6,14.6,14.6,14.7,14.7,14.7,14.8,14.8,14.8,14.9,14.9,15,15,15.1,15.2,15.2,15.3,15.3,15.4,15.4,15.5,15.5,15.6,15.6,15.7,15.7,15.7,15.8,15.8,15.8,15.9,15.9,15.9,16,16,16,16.1,16.1,16.1,16.2,16.2,16.2,16.3,16.3,16.3,16.4,16.4,16.4,16.5,16.5,16.5],
									//SD 1
									p85 : [14.5,14.9,15.2,15.4,15.5,15.6,15.7,15.7,15.8,15.8,15.8,15.9,15.9,16,16,16,16.1,16.1,16.2,16.3,16.3,16.4,16.4,16.5,16.6,16.6,16.7,16.8,16.8,16.9,16.9,17,17,17.1,17.1,17.1,17.2,17.2,17.3,17.3,17.4,17.4,17.4,17.5,17.5,17.6,17.6,17.6,17.7,17.7,17.8,17.8,17.8,17.9,17.9,18,18,18],
									//SD 2
									p95 : [15.6,16,16.3,16.5,16.7,16.8,16.9,17,17,17.1,17.1,17.1,17.2,17.2,17.3,17.3,17.4,17.4,17.5,17.6,17.6,17.7,17.8,17.9,17.9,18,18.1,18.1,18.2,18.3,18.3,18.4,18.4,18.5,18.6,18.6,18.7,18.7,18.8,18.8,18.9,18.9,19,19,19.1,19.1,19.2,19.2,19.3,19.3,19.4,19.4,19.5,19.5,19.6,19.6,19.7,19.8],
									//SD 3
									p99 : [16.7,17.2,17.5,17.8,18,18.1,18.2,18.3,18.3,18.4,18.4,18.5,18.5,18.6,18.6,18.7,18.8,18.8,18.9,19,19.1,19.2,19.2,19.3,19.4,19.5,19.6,19.7,19.7,19.8,19.9,20,20,20.1,20.2,20.2,20.3,20.4,20.4,20.5,20.6,20.6,20.7,20.8,20.8,20.9,21,21,21.1,21.2,21.2,21.3,21.4,21.4,21.5,21.6,21.6,21.7]
								}
								
							},
							updateTextModal : function( objData ){
								 
								//birth date
								scope.text( scope.qs("tgl-afa"), scope.dateToYMD( objData.birthDateStart, "year" ) );	
								
								//total month
								scope.text( scope.qs("mth-afa"), objData.birthNowTotalMonth );							
								
								//birth to date now
								scope.text( scope.qs("tgl-now-afa"),  scope.dateToYMD( objData.birthNowToMonth, "year" ) );
								
								//switch graph
								
								scope.text( scope.qs("afa-switch-graph"), ( this.isZscore ? "Grafik : Z-Score" : "Grafik : Persentil" ) );
								 
								return objData.birthNowTotalMonth;
							},
							create : function(){
								
								//set data
								let objData = obj.chart.dateBaby();
								 
								this.data.ageInMonth = objData.birthNowTotalMonth; 
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "afa", this.isZscore );
								  
								let params = obj.chart.generateChart( this, this.isZscore ),
								wfaWrapper = scope.qs("afa-wrapper"),
								ctxBound = scope.id('canvas-afa').getBoundingClientRect();
								
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("month-afa-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								
								scope.text(scope.qs("gender-afa-age"), params.gender)
								//options
								
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								 
								this.isZscore = obj.dataStorage.layoutState.armSwitch;
								
								//obj.dataStorage 
								let self = this,
								main = scope.qs("afa-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.afa ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box ruler-icon"> ' +
										'		<div class="notify-strip-b"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.arm ).toFixed(2) +' Cm </abbr> ' +
										'	<abbr class="inbeetween extrabold">  '+ params.strDeduct +' Cm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman bulan ke '+ params.monthTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ 
										' 					Z-Score '+ params.resultVal +
										'			</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" zscore="'+ params.resultVal +'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								 
									if( dataNote.babyId === dataBaby.id ){
										
										if( obj.loadMore.marker( "armForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" );
																						  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].arm : 0,
											
											deduct = ( dataNote.arm - dateNext ).toFixed(2),
											strDeduct = deduct > 0 ? '+'+deduct : deduct < 0 ?  deduct : 0;
											
											let zscore = fn.zScoreFn({
												value : parseFloat( dataNote.arm ),
												data : self.data,
												valueFor : "arm",
												gender : dataBaby.gender,
												month : parseInt( dataNote.monthTo )
											})
											      
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												arm : dataNote.arm,
												monthTo : parseInt( dataNote.monthTo ) - 2,
												strDeduct : strDeduct,
												resultVal : zscore.resultVal 
											}); 
											 
										}
										
										dataEmpty = false;
									}
								};
								
								 //short ascending
								data.sort(function(a, b){
					
									return b.monthTo - a.monthTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									obj.loadMore.state.armForAge.reset();
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
									afa detail buttons
								*/
								let trackerBtns = scope.slice( scope.qs("afa-wrapper").querySelectorAll(".bubble-small-left") );
								
								trackerBtns.map(function( btnTracker, index ){
									
									scope.attachListener( btnTracker, 'click', function(){
										
										let self = this;
										 
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "afa",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("afa-detail-type"), scope.qs("afa-confirm-type")], "Ke "+data.monthTo );
											scope.text([scope.qs("afa-detail-arm"), scope.qs("afa-confirm-arm")], data.arm+' Cm' );
											scope.text([scope.qs("afa-detail-recorded"), scope.qs("afa-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("afa-detail-datecreate"), scope.qs("afa-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											scope.text([scope.qs("afa-detail-zscore"), scope.qs("afa-confirm-zscore")], self.getAttribute("zscore") );
											
											scope.qs("modal-afa-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											  
											obj.modal.behaviour.openFadeIn("modal-afa-detail");	
								 
										})  
									})
								})
								
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("afa-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("afa-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
									
										if( self.data.ageInMonth <= 5 ) self.data.ageInMonth = 6;
										self.data.ageInMonth += 1;
										
										dir =  "right";
									}else if(  self.data.ageInMonth > 5 ){
										
										if( self.data.ageInMonth >= 55 ) self.data.ageInMonth = 55;
										self.data.ageInMonth -= 1;
										
										dir =  "left";
									}
								  
								  
									if( self.data.ageInMonth > 3 && self.data.ageInMonth < 60 ){
									
										let data =  obj.chart.generateData(  self.data, self.isZscore ),
										dataset = self.isZscore ? [ data.pUser,data.p1,data.p5,data.p15,data.p50,data.p85,data.p95,data.p99] :
										[ data.pUser,data.p01,data.p1,data.p3,data.p5,data.p10,data.p15,data.p25,data.p50,data.p75,data.p85,data.p90,data.p95,data.p97,data.p99,data.p999];
										   
										scope.text(scope.qs("month-afa-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
									
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						
						},
						lhForAge : {
							canvas : "canvas-lhfa",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							isZscore : false,
							data : {
								ageInMonth : 12,
								girl : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										 
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										 
										return temp.reverse();
										
									}(),
									p01 : [43.4,47.6,50.8,53.3,55.4,57.2,58.7,60.1,61.4,62.7,63.9,65,66.1,67.1,68.1,69,70,70.9,71.7,72.6,73.4,74.2,75,75.7,75.7,76.5,77.2,77.8,78.5,79.1,79.8,80.4,81,81.6,82.2,82.7,83.3,83.8,84.4,84.9,85.4,86,86.5,87,87.5,88,88.5,88.9,89.4,89.9,90.4,90.8,91.3,91.7,92.2,92.6,93,93.5,93.9,94.3,94.7],
									p1 : [98.4, 97.9, 97.5, 97, 96.6, 96.1, 95.6, 95.2, 94.7, 94.2, 93.7, 93.2, 92.7, 92.2, 91.7, 91.2, 90.7, 90.1, 89.6, 89, 88.5, 87.9, 87.4, 86.8, 86.2, 85.6, 85, 84.4, 83.8, 83.1, 82.5, 81.8, 81.1, 80.4, 79.7, 79, 78.2, 78.1, 77.3, 76.5, 75.7, 74.8, 74, 73, 72.1, 71.1, 70.1, 69.1, 68, 66.9, 65.7, 64.5, 63.2, 61.9, 60.5, 58.9, 57.1, 54.9, 52.3, 49.1, 44.8].reverse(),
									p3 : [100.5, 100, 99.6, 99.1, 98.6, 98.1, 97.6, 97.2, 96.7, 96.2, 95.7, 95.1, 94.6, 94.1, 93.6, 93, 92.5, 92, 91.4, 90.8, 90.3, 89.7, 89.1, 88.5, 87.9, 87.3, 86.7, 86, 85.4, 84.7, 84, 83.4, 82.6, 81.9, 81.2, 80.4, 79.6, 79.6, 78.7, 77.9, 77, 76.2, 75.2, 74.3, 73.3, 72.4, 71.3, 70.3, 69.2, 68, 66.8, 65.6, 64.3, 62.9, 61.5, 59.9, 58, 55.8, 53.2, 50, 45.6].reverse(),
									p5 : [101.6, 101.1, 100.7, 100.2, 99.7, 99.2, 98.7, 98.2, 97.7, 97.2, 96.7, 96.2, 95.6, 95.1, 94.6, 94, 93.5, 92.9, 92.4, 91.8, 91.2, 90.6, 90, 89.4, 88.8, 88.2, 87.5, 86.9, 86.2, 85.6, 84.9, 84.2, 83.5, 82.7, 82, 81.2, 80.4, 80.3, 79.5, 78.6, 77.7, 76.9, 75.9, 75, 74, 73, 72, 70.9, 69.8, 68.6, 67.4, 66.2, 64.9, 63.5, 62, 60.4, 58.5, 56.3, 53.7, 50.5, 46.1].reverse(),
									p10 : [103.3, 102.8, 102.4, 101.9, 101.4, 100.9, 100.4, 99.9, 99.3, 98.8, 98.3, 97.8, 97.2, 96.7, 96.1, 95.6, 95, 94.4, 93.8, 93.2, 92.6, 92, 91.4, 90.8, 90.2, 89.5, 88.9, 88.2, 87.5, 86.9, 86.2, 85.4, 84.7, 83.9, 83.2, 82.4, 81.6, 81.5, 80.6, 79.7, 78.8, 77.9, 77, 76, 75, 74, 72.9, 71.8, 70.7, 69.5, 68.3, 67, 65.7, 64.3, 62.8, 61.2, 59.3, 57.1, 54.5, 51.2, 46.8].reverse(),
									p15 : [104.5, 104, 103.5, 103, 102.5, 102, 101.5, 101, 100.4, 99.9, 99.4, 98.8, 98.3, 97.7, 97.2, 96.6, 96, 95.4, 94.8, 94.2, 93.6, 93, 92.4, 91.7, 91.1, 90.5, 89.8, 89.1, 88.4, 87.7, 87, 86.3, 85.5, 84.8, 84, 83.2, 82.4, 82.2, 81.4, 80.5, 79.6, 78.7, 77.7, 76.7, 75.7, 74.7, 73.6, 72.5, 71.3, 70.2, 68.9, 67.6, 66.3, 64.9, 63.4, 61.7, 59.8, 57.6, 55, 51.7, 47.2].reverse(),
									p25 : [106.2, 105.7, 105.2, 104.7, 104.2, 103.6, 103.1, 102.6, 102, 101.5, 100.9, 100.4, 99.8, 99.3, 98.7, 98.1, 97.5, 96.9, 96.3, 95.7, 95.1, 94.4, 93.8, 93.1, 92.5, 91.8, 91.1, 90.4, 89.7, 89, 88.3, 87.6, 86.8, 86, 85.2, 84.4, 83.5, 83.4, 82.5, 81.6, 80.7, 79.7, 78.7, 77.7, 76.7, 75.7, 74.6, 73.4, 72.3, 71.1, 69.8, 68.5, 67.2, 65.7, 64.2, 62.5, 60.6, 58.4, 55.7, 52.4, 47.9].reverse(),
									p50 : [109.4, 108.9, 108.4, 107.8, 107.3, 106.7, 106.2, 105.6, 105, 104.5, 103.9, 103.3, 102.7, 102.1, 101.5, 100.9, 100.3, 99.7, 99, 98.4, 97.7, 97.1, 96.4, 95.7, 95.1, 94.4, 93.6, 92.9, 92.2, 91.4, 90.7, 89.9, 89.1, 88.3, 87.4, 86.6, 85.7, 85.5, 84.6, 83.7, 82.7, 81.7, 80.7, 79.7, 78.6, 77.5, 76.4, 75.2, 74, 72.8, 71.5, 70.1, 68.7, 67.3, 65.7, 64, 62.1, 59.8, 57.1, 53.7, 49.1].reverse(),
									p75 : [112.6, 112.1, 111.5, 111, 110.4, 109.8, 109.2, 108.6, 108.1, 107.5, 106.9, 106.3, 105.6, 105, 104.4, 103.7, 103.1, 102.4, 101.8, 101.1, 100.4, 99.7, 99, 98.3, 97.6, 96.9, 96.2, 95.4, 94.6, 93.9, 93.1, 92.2, 91.4, 90.6, 89.7, 88.8, 87.9, 87.7, 86.7, 85.7, 84.7, 83.7, 82.7, 81.6, 80.5, 79.4, 78.2, 77, 75.8, 74.5, 73.1, 71.8, 70.3, 68.8, 67.3, 65.5, 63.5, 61.2, 58.4, 55, 50.4].reverse(),
									p85 : [114.4, 113.8, 113.2, 112.6, 112.1, 111.5, 110.9, 110.3, 109.7, 109.1, 108.4, 107.8, 107.2, 106.6, 105.9, 105.3, 104.6, 103.9, 103.3, 102.6, 101.9, 101.2, 100.5, 99.7, 99, 98.3, 97.5, 96.7, 95.9, 95.2, 94.3, 93.5, 92.7, 91.8, 90.9, 90, 89.1, 88.8, 87.8, 86.8, 85.8, 84.8, 83.7, 82.6, 81.5, 80.3, 79.2, 77.9, 76.7, 75.4, 74, 72.6, 71.2, 69.7, 68.1, 66.3, 64.3, 62, 59.2, 55.7, 51.1].reverse(),
									p90 : [115.5, 114.9, 114.4, 113.8, 113.2, 112.6, 112, 111.4, 110.8, 110.1, 109.5, 108.9, 108.3, 107.6, 107, 106.3, 105.6, 104.9, 104.3, 103.6, 102.9, 102.1, 101.4, 100.7, 99.9, 99.2, 98.4, 97.6, 96.8, 96, 95.2, 94.4, 93.5, 92.6, 91.7, 90.8, 89.9, 89.6, 88.6, 87.6, 86.6, 85.5, 84.4, 83.3, 82.2, 81, 79.8, 78.6, 77.3, 76, 74.6, 73.2, 71.8, 70.3, 68.6, 66.9, 64.9, 62.5, 59.7, 56.2, 51.5].reverse(),
									p95 : [117.2, 116.7, 116.1, 115.5, 114.9, 114.3, 113.6, 113, 112.4, 111.8, 111.1, 110.5, 109.8, 109.2, 108.5, 107.8, 107.1, 106.4, 105.7, 105, 104.3, 103.6, 102.8, 102.1, 101.3, 100.5, 99.8, 99, 98.2, 97.3, 96.5, 95.6, 94.7, 93.8, 92.9, 92, 91, 90.7, 89.7, 88.7, 87.7, 86.6, 85.5, 84.4, 83.2, 82, 80.8, 79.5, 78.3, 76.9, 75.5, 74.1, 72.6, 71.1, 69.5, 67.7, 65.7, 63.3, 60.4, 56.9, 52.2].reverse(),
									p97 : [118.4, 117.8, 117.2, 116.6, 116, 115.3, 114.7, 114.1, 113.4, 112.8, 112.1, 111.5, 110.8, 110.2, 109.5, 108.8, 108.1, 107.4, 106.7, 106, 105.2, 104.5, 103.7, 103, 102.2, 101.4, 100.6, 99.8, 99, 98.2, 97.3, 96.4, 95.6, 94.6, 93.7, 92.8, 91.8, 91.5, 90.5, 89.4, 88.4, 87.3, 86.2, 85, 83.9, 82.7, 81.4, 80.2, 78.9, 77.5, 76.1, 74.7, 73.2, 71.6, 70, 68.2, 66.2, 63.8, 60.9, 57.4, 52.7].reverse(),
									p99 : [120.5, 119.9, 119.3, 118.6, 118, 117.4, 116.7, 116.1, 115.4, 114.8, 114.1, 113.4, 112.8, 112.1, 111.4, 110.7, 110, 109.2, 108.5, 107.8, 107, 106.3, 105.5, 104.7, 103.9, 103.1, 102.3, 101.5, 100.6, 99.8, 98.9, 98, 97.1, 96.1, 95.2, 94.2, 93.2, 92.9, 91.9, 90.8, 89.7, 88.6, 87.5, 86.3, 85.1, 83.9, 82.6, 81.3, 80, 78.6, 77.2, 75.8, 74.3, 72.7, 71, 69.2, 67.1, 64.7, 61.8, 58.2, 53.5].reverse(),
									p999 : [54.9,59.7,63.4,66.3,68.8,70.9,72.7,74.4,76.1,77.6,79.1,80.6,82,83.3,84.7,86,87.2,88.5,89.7,90.9,92,93.1,94.2,95.3,95.7,96.7,97.7,98.7,99.7,100.7,101.6,102.5,103.4,104.3,105.1,106,106.8,107.6,108.5,109.3,110.1,110.8,111.6,112.4,113.1,113.9,114.6,115.3,116,116.7,117.5,118.1,118.8,119.5,120.2,120.9,121.5,122.2,122.8,123.5,124.1]
								},
								boy : {
									labels : function(){
										let count = 61,
										temp = [];
			
																	
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [ 44,48.7,52.2,55.1,57.5,59.4,61,62.5,63.8,65,66.2,67.3,68.4,69.4,70.4,71.3,72.2,73.1,73.9,74.7,75.5,76.3,77,77.7,77.7,78.3,79,79.6,80.2,80.8,81.4,82,82.5,83.1,83.6,84.1,84.6,85.1,85.6,86.1,86.6,87.1,87.6,88.1,88.5,89,89.5,89.9,90.4,90.8,91.3,91.7,92.1,92.6,93,93.5,93.9,94.3,94.8,95.2,95.6 ],
									p1 : [99.2, 98.7, 98.3, 97.8, 97.3, 96.9, 96.4, 95.9, 95.5, 95, 94.5, 94, 93.6, 93.1, 92.6, 92.1, 91.6, 91.1, 90.6, 90.1, 89.6, 89.1, 88.5, 88, 87.5, 86.9, 86.4, 85.8, 85.2, 84.6, 84, 83.4, 82.8, 82.1, 81.4, 80.7, 80, 80, 79.2, 78.4, 77.7, 76.8, 76, 75.1, 74.2, 73.3, 72.3, 71.3, 70.2, 69.1, 68, 66.8, 65.5, 64.1, 62.6, 61, 59, 56.7, 53.8, 50.2, 45.5].reverse(),
									p3 : [101.2, 100.8, 100.3, 99.8, 99.3, 98.8, 98.4, 97.9, 97.4, 96.9, 96.4, 95.9, 95.4, 94.9, 94.4, 93.9, 93.4, 92.9, 92.4, 91.9, 91.3, 90.8, 90.2, 89.7, 89.1, 88.5, 88, 87.4, 86.8, 86.2, 85.5, 84.9, 84.2, 83.5, 82.8, 82.1, 81.4, 81.3, 80.5, 79.7, 78.9, 78.1, 77.2, 76.3, 75.4, 74.4, 73.4, 72.4, 71.3, 70.2, 69, 67.7, 66.5, 65.1, 63.6, 61.9, 60, 57.6, 54.7, 51.1, 46.3].reverse(),
									p5 : [102.3, 101.9, 101.4, 100.9, 100.4, 99.9, 99.4, 98.9, 98.4, 97.9, 97.4, 96.9, 96.4, 95.9, 95.4, 94.9, 94.4, 93.9, 93.3, 92.8, 92.2, 91.7, 91.1, 90.6, 90, 89.4, 88.8, 88.2, 87.6, 87, 86.3, 85.7, 85, 84.3, 83.6, 82.8, 82.1, 82, 81.2, 80.4, 79.6, 78.7, 77.8, 76.9, 76, 75, 74, 72.9, 71.8, 70.7, 69.5, 68.3, 67, 65.6, 64.1, 62.4, 60.5, 58.1, 55.1, 51.5, 46.8].reverse(),
									p10 : [104, 103.5, 103, 102.5, 102, 101.5, 101, 100.5, 100, 99.5, 99, 98.5, 98, 97.4, 96.9, 96.4, 95.9, 95.3, 94.8, 94.2, 93.7, 93.1, 92.5, 91.9, 91.3, 90.7, 90.1, 89.5, 88.9, 88.2, 87.6, 86.9, 86.2, 85.5, 84.7, 84, 83.2, 83.1, 82.3, 81.5, 80.6, 79.7, 78.8, 77.9, 76.9, 75.9, 74.9, 73.8, 72.7, 71.6, 70.4, 69.1, 67.8, 66.4, 64.9, 63.2, 61.2, 58.8, 55.9, 52.2, 47.5].reverse(),
									p15 : [105.2, 104.7, 104.1, 103.6, 103.1, 102.6, 102.1, 101.6, 101.1, 100.5, 100, 99.5, 99, 98.5, 97.9, 97.4, 96.8, 96.3, 95.7, 95.2, 94.6, 94, 93.4, 92.8, 92.2, 91.6, 91, 90.4, 89.7, 89.1, 88.4, 87.7, 87, 86.3, 85.5, 84.7, 83.9, 83.8, 83, 82.2, 81.3, 80.4, 79.5, 78.5, 77.5, 76.5, 75.5, 74.4, 73.3, 72.1, 70.9, 69.6, 68.3, 66.9, 65.4, 63.7, 61.7, 59.3, 56.4, 52.7, 47.9].reverse(),
									p25 : [106.8, 106.3, 105.8, 105.3, 104.7, 104.2, 103.7, 103.2, 102.6, 102.1, 101.6, 101, 100.5, 100, 99.4, 98.9, 98.3, 97.7, 97.2, 96.6, 96, 95.4, 94.8, 94.2, 93.6, 93, 92.3, 91.7, 91, 90.3, 89.6, 88.9, 88.2, 87.4, 86.7, 85.9, 85.1, 84.9, 84.1, 83.2, 82.3, 81.4, 80.4, 79.5, 78.5, 77.4, 76.4, 75.3, 74.1, 73, 71.7, 70.5, 69.1, 67.7, 66.2, 64.5, 62.5, 60.1, 57.1, 53.4, 48.6].reverse(),
									p50 : [110, 109.4, 108.9, 108.3, 107.8, 107.2, 106.7, 106.1, 105.6, 105, 104.4, 103.9, 103.3, 102.8, 102.2, 101.6, 101, 100.4, 99.9, 99.2, 98.6, 98, 97.4, 96.7, 96.1, 95.4, 94.8, 94.1, 93.4, 92.7, 91.9, 91.2, 90.4, 89.6, 88.8, 88, 87.1, 86.9, 86, 85.1, 84.2, 83.2, 82.3, 81.2, 80.2, 79.1, 78, 76.9, 75.7, 74.5, 73.3, 72, 70.6, 69.2, 67.6, 65.9, 63.9, 61.4, 58.4, 54.7, 49.9].reverse(),
									p75 : [113.1, 112.5, 111.9, 111.4, 110.8, 110.2, 109.6, 109.1, 108.5, 107.9, 107.3, 106.7, 106.2, 105.6, 105, 104.4, 103.8, 103.1, 102.5, 101.9, 101.3, 100.6, 99.9, 99.3, 98.6, 97.9, 97.2, 96.5, 95.7, 95, 94.2, 93.4, 92.6, 91.8, 90.9, 90.1, 89.2, 89, 88, 87.1, 86.1, 85.1, 84.1, 83, 82, 80.9, 79.7, 78.6, 77.4, 76.1, 74.8, 73.5, 72.1, 70.6, 69.1, 67.3, 65.3, 62.8, 59.8, 56, 51.2].reverse(),
									p85 : [114.8, 114.2, 113.6, 113, 112.4, 111.8, 111.2, 110.7, 110.1, 109.5, 108.9, 108.3, 107.7, 107.1, 106.5, 105.8, 105.2, 104.6, 104, 103.3, 102.7, 102, 101.3, 100.6, 99.9, 99.2, 98.5, 97.8, 97, 96.2, 95.5, 94.7, 93.8, 93, 92.1, 91.2, 90.3, 90, 89.1, 88.1, 87.1, 86.1, 85.1, 84, 82.9, 81.8, 80.6, 79.4, 78.2, 77, 75.6, 74.3, 72.9, 71.4, 69.8, 68.1, 66, 63.5, 60.5, 56.7, 51.8].reverse(),
									p90 : [115.9, 115.3, 114.7, 114.1, 113.5, 112.9, 112.3, 111.7, 111.1, 110.5, 109.9, 109.3, 108.7, 108.1, 107.5, 106.8, 106.2, 105.6, 104.9, 104.3, 103.6, 102.9, 102.2, 101.5, 100.8, 100.1, 99.4, 98.6, 97.9, 97.1, 96.3, 95.5, 94.6, 93.8, 92.9, 92, 91, 90.8, 89.8, 88.8, 87.8, 86.8, 85.7, 84.6, 83.5, 82.4, 81.2, 80, 78.8, 77.5, 76.2, 74.8, 73.4, 71.9, 70.4, 68.6, 66.6, 64, 61, 57.2, 52.3].reverse(),
									p95 : [117.6, 117, 116.4, 115.8, 115.2, 114.5, 113.9, 113.3, 112.7, 112.1, 111.5, 110.8, 110.2, 109.6, 109, 108.3, 107.7, 107, 106.4, 105.7, 105, 104.3, 103.6, 102.9, 102.2, 101.4, 100.7, 99.9, 99.2, 98.4, 97.5, 96.7, 95.8, 94.9, 94, 93.1, 92.1, 91.9, 90.9, 89.9, 88.8, 87.8, 86.7, 85.6, 84.5, 83.3, 82.1, 80.9, 79.7, 78.4, 77, 75.7, 74.2, 72.7, 71.1, 69.4, 67.3, 64.8, 61.7, 57.9, 53].reverse(),
									p97 : [118.7, 118.1, 117.4, 116.8, 116.2, 115.6, 115, 114.3, 113.7, 113.1, 112.5, 111.8, 111.2, 110.6, 109.9, 109.3, 108.6, 108, 107.3, 106.6, 105.9, 105.2, 104.5, 103.8, 103.1, 102.3, 101.5, 100.8, 100, 99.2, 98.3, 97.5, 96.6, 95.7, 94.8, 93.8, 92.9, 92.6, 91.6, 90.5, 89.5, 88.4, 87.3, 86.2, 85.1, 83.9, 82.7, 81.5, 80.2, 78.9, 77.6, 76.2, 74.7, 73.2, 71.6, 69.9, 67.8, 65.3, 62.2, 58.4, 53.4].reverse(),
									p99 : [120.7, 120.1, 119.5, 118.8, 118.2, 117.6, 116.9, 116.3, 115.7, 115, 114.4, 113.7, 113.1, 112.4, 111.8, 111.1, 110.4, 109.8, 109.1, 108.4, 107.7, 106.9, 106.2, 105.5, 104.7, 103.9, 103.2, 102.4, 101.5, 100.7, 99.9, 99, 98.1, 97.1, 96.2, 95.2, 94.2, 93.9, 92.9, 91.8, 90.7, 89.7, 88.5, 87.4, 86.2, 85, 83.8, 82.6, 81.3, 80, 78.6, 77.2, 75.7, 74.2, 72.6, 70.8, 68.7, 66.2, 63.1, 59.3, 54.3].reverse(),
									p999 : [ 55.7,60.7,64.6,67.7,70.3,72.4,74.2,75.9,77.4,78.9,80.3,81.7,83.1,84.4,85.7,87,88.2,89.4,90.6,91.8,92.9,94,95.1,96.2,96.6,97.6,98.6,99.6,100.6,101.5,102.5,103.4,104.2,105.1,105.9,106.7,107.5,108.3,109.1,109.9,110.6,111.4,112.1,112.8,113.5,114.2,114.9,115.6,116.3,117,117.6,118.3,119,119.6,120.3,121,121.6,122.3,123,123.6,124.3 ]
								},
								girlZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p1 : [43.6,47.8,51,53.5,55.6,57.4,58.9,60.3,61.7,62.9,64.1,65.2,66.3,67.3,68.3,69.3,70.2,71.1,72,72.8,73.7,74.5,75.2,76,76.7,76.8,77.5,78.1,78.8,79.5,80.1,80.7,81.3,81.9,82.5,83.1,83.6,84.2,84.7,85.3,85.8,86.3,86.8,87.4,87.9,88.4,88.9,89.3,89.8,90.3,90.7,91.2,91.7,92.1,92.6,93,93.4,93.9,94.3,94.7,95.2],
									p5 : [45.4,49.8,53,55.6,57.8,59.6,61.2,62.7,64,65.3,66.5,67.7,68.9,70,71,72,73,74,74.9,75.8,76.7,77.5,78.4,79.2,80,80,80.8,81.5,82.2,82.9,83.6,84.3,84.9,85.6,86.2,86.8,87.4,88,88.6,89.2,89.8,90.4,90.9,91.5,92,92.5,93.1,93.6,94.1,94.6,95.1,95.6,96.1,96.6,97.1,97.6,98.1,98.5,99,99.5,99.9],
									p15 : [47.3,51.7,55,57.7,59.9,61.8,63.5,65,66.4,67.7,69,70.3,71.4,72.6,73.7,74.8,75.8,76.8,77.8,78.8,79.7,80.6,81.5,82.3,83.2,83.3,84.1,84.9,85.7,86.4,87.1,87.9,88.6,89.3,89.9,90.6,91.2,91.9,92.5,93.1,93.8,94.4,95,95.6,96.2,96.7,97.3,97.9,98.4,99,99.5,100.1,100.6,101.1,101.6,102.2,102.7,103.2,103.7,104.2,104.7],
									p50 : [49.1,53.7,57.1,59.8,62.1,64,65.7,67.3,68.7,70.1,71.5,72.8,74,75.2,76.4,77.5,78.6,79.7,80.7,81.7,82.7,83.7,84.6,85.5,86.4,86.6,87.4,88.3,89.1,89.9,90.7,91.4,92.2,92.9,93.6,94.4,95.1,95.7,96.4,97.1,97.7,98.4,99,99.7,100.3,100.9,101.5,102.1,102.7,103.3,103.9,104.5,105,105.6,106.2,106.7,107.3,107.8,108.4,108.9,109.4],
									p85 : [51,55.6,59.1,61.9,64.3,66.2,68,69.6,71.1,72.6,73.9,75.3,76.6,77.8,79.1,80.2,81.4,82.5,83.6,84.7,85.7,86.7,87.7,88.7,89.6,89.9,90.8,91.7,92.5,93.4,94.2,95,95.8,96.6,97.4,98.1,98.9,99.6,100.3,101,101.7,102.4,103.1,103.8,104.5,105.1,105.8,106.4,107,107.7,108.3,108.9,109.5,110.1,110.7,111.3,111.9,112.5,113,113.6,114.2],
									p95 : [52.9,57.6,61.1,64,66.4,68.5,70.3,71.9,73.5,75,76.4,77.8,79.2,80.5,81.7,83,84.2,85.4,86.5,87.6,88.7,89.8,90.8,91.9,92.9,93.1,94.1,95,96,96.9,97.7,98.6,99.4,100.3,101.1,101.9,102.7,103.4,104.2,105,105.7,106.4,107.2,107.9,108.6,109.3,110,110.7,111.3,112,112.7,113.3,114,114.6,115.2,115.9,116.5,117.1,117.7,118.3,118.9],
									p99 : [54.7,59.5,63.2,66.1,68.6,70.7,72.5,74.2,75.8,77.4,78.9,80.3,81.7,83.1,84.4,85.7,87,88.2,89.4,90.6,91.7,92.9,94,95,96.1,96.4,97.4,98.4,99.4,100.3,101.3,102.2,103.1,103.9,104.8,105.6,106.5,107.3,108.1,108.9,109.7,110.5,111.2,112,112.7,113.5,114.2,114.9,115.7,116.4,117.1,117.7,118.4,119.1,119.8,120.4,121.1,121.8,122.4,123.1,123.7]
								
								},
								boyZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [44.2,48.9,52.4,55.3,57.6,59.6,61.2,62.7,64,65.2,66.4,67.6,68.6,69.6,70.6,71.6,72.5,73.3,74.2,75,75.8,76.5,77.2,78,78,78.6,79.3,79.9,80.5,81.1,81.7,82.3,82.8,83.4,83.9,84.4,85,85.5,86,86.5,87,87.5,88,88.4,88.9,89.4,89.8,90.3,90.7,91.2,91.6,92.1,92.5,93,93.4,93.9,94.3,94.7,95.2,95.6,96.1],
									//SD 2 Neg
									p5 : [46.1,50.8,54.4,57.3,59.7,61.7,63.3,64.8,66.2,67.5,68.7,69.9,71,72.1,73.1,74.1,75,76,76.9,77.7,78.6,79.4,80.2,81,81,81.7,82.5,83.1,83.8,84.5,85.1,85.7,86.4,86.9,87.5,88.1,88.7,89.2,89.8,90.3,90.9,91.4,91.9,92.4,93,93.5,94,94.4,94.9,95.4,95.9,96.4,96.9,97.4,97.8,98.3,98.8,99.3,99.7,100.2,100.7],
									//SD 1 Neg
									p15 : [48,52.8,56.4,59.4,61.8,63.8,65.5,67,68.4,69.7,71,72.2,73.4,74.5,75.6,76.6,77.6,78.6,79.6,80.5,81.4,82.3,83.1,83.9,84.1,84.9,85.6,86.4,87.1,87.8,88.5,89.2,89.9,90.5,91.1,91.8,92.4,93,93.6,94.2,94.7,95.3,95.9,96.4,97,97.5,98.1,98.6,99.1,99.7,100.2,100.7,101.2,101.7,102.3,102.8,103.3,103.8,104.3,104.8,105.3],
									//SD 0
									p50 : [49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72,73.3,74.5,75.7,76.9,78,79.1,80.2,81.2,82.3,83.2,84.2,85.1,86,86.9,87.1,88,88.8,89.6,90.4,91.2,91.9,92.7,93.4,94.1,94.8,95.4,96.1,96.7,97.4,98,98.6,99.2,99.9,100.4,101,101.6,102.2,102.8,103.3,103.9,104.4,105,105.6,106.1,106.7,107.2,107.8,108.3,108.9,109.4,110],
									//SD 1
									p85 : [51.8,56.7,60.4,63.5,66,68,69.8,71.3,72.8,74.2,75.6,76.9,78.1,79.3,80.5,81.7,82.8,83.9,85,86,87,88,89,89.9,90.2,91.1,92,92.9,93.7,94.5,95.3,96.1,96.9,97.6,98.4,99.1,99.8,100.5,101.2,101.8,102.5,103.2,103.8,104.5,105.1,105.7,106.3,106.9,107.5,108.1,108.7,109.3,109.9,110.5,111.1,111.7,112.3,112.8,113.4,114,114.6],
									//SD 2
									p95 : [53.7,58.6,62.4,65.5,68,70.1,71.9,73.5,75,76.5,77.9,79.2,80.5,81.8,83,84.2,85.4,86.5,87.7,88.8,89.8,90.9,91.9,92.9,93.2,94.2,95.2,96.1,97,97.9,98.7,99.6,100.4,101.2,102,102.7,103.5,104.2,105,105.7,106.4,107.1,107.8,108.5,109.1,109.8,110.4,111.1,111.7,112.4,113,113.6,114.2,114.9,115.5,116.1,116.7,117.4,118,118.6,119.2],
									//SD 3
									p99 : [55.6,60.6,64.4,67.6,70.1,72.2,74,75.7,77.2,78.7,80.1,81.5,82.9,84.2,85.5,86.7,88,89.2,90.4,91.5,92.6,93.8,94.9,95.9,96.3,97.3,98.3,99.3,100.3,101.2,102.1,103,103.9,104.8,105.6,106.4,107.2,108,108.8,109.5,110.3,111,111.7,112.5,113.2,113.9,114.6,115.2,115.9,116.6,117.3,117.9,118.6,119.2,119.9,120.6,121.2,121.9,122.6,123.2,123.9]
								}
								
							},
							updateTextModal : function( objData ){
								 
								//birth date
								scope.text( scope.qs("tgl-lhfa"), scope.dateToYMD( objData.birthDateStart, "year" ) );	
								
								//total month
								scope.text( scope.qs("mth-lhfa"), objData.birthNowTotalMonth );							
								
								//birth to date now
								scope.text( scope.qs("tgl-now-lhfa"),  scope.dateToYMD( objData.birthNowToMonth, "year" ) );
								
								scope.text( scope.qs("lh-switch-graph"), ( this.isZscore ? "Grafik : Z-Score" : "Grafik : Persentil" ) );
								 
								return objData.birthNowTotalMonth;
							},
							create : function(){
								
								//set data
								let objData = obj.chart.dateBaby();
								 
								this.data.ageInMonth = objData.birthNowTotalMonth; 
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "lhfa", this.isZscore );
								
								let params = obj.chart.generateChart( this , this.isZscore ),
								wfaWrapper = scope.qs("lhfa-wrapper"),
								ctxBound = scope.id('canvas-lhfa').getBoundingClientRect();
								 
								//update data modal
								this.updateTextModal( objData );
									 
								scope.text(scope.qs("month-lhfa-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								
								scope.text(scope.qs("gender-lhfa-age"), params.gender)
								//options
								
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								
								this.isZscore = obj.dataStorage.layoutState.lhSwitch;
								 
								//obj.dataStorage
								
								
								let self = this,
								main = scope.qs("lhfa-wrapper"), 
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.lhfa ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box ruler-icon"> ' +
										'		<div class="notify-strip-b"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.height ).toFixed(2) +' Cm </abbr> ' +
										'	<abbr class="inbeetween extrabold">  '+ params.strDeduct +' Cm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman bulan ke '+ params.monthTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ 
										' 				<label class="'+ params.resultColor +'">'+ params.resultText +'</label>'+ 
										' 					Z-Score '+ params.resultVal +
										'			</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" gizi="'+ params.resultText +'" zscore="'+ params.resultVal +'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
									
									if( dataNote.babyId === dataBaby.id ){
										
										if( obj.loadMore.marker( "lhForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" );
											  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].height : 0,
											
											deduct = ( dataNote.height - dateNext ).toFixed(2),
											strDeduct = deduct > 0 ? '+'+deduct : deduct < 0 ?  deduct : 0;
											
											let zscore = fn.zScoreFn({
												value : parseFloat( dataNote.height ),
												data : self.data,
												valueFor : "lh",
												gender : dataBaby.gender,
												month : parseInt( dataNote.monthTo )
											})
												 
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												height : dataNote.height,
												monthTo : dataNote.monthTo,
												strDeduct : strDeduct,
												resultVal : zscore.resultVal,
												resultText : zscore.resultText,
												resultColor : zscore.resultColor
											}); 
										}	 
										
										dataEmpty = false;
										
									}
								};
								
								 //short ascending
								data.sort(function(a, b){
					
									return b.monthTo - a.monthTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									obj.loadMore.state.lhForAge.reset();
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
									lhfa detail buttons
								*/
								let trackerBtns = scope.slice( scope.qs("lhfa-wrapper").querySelectorAll(".bubble-small-left") );
								
								trackerBtns.map(function( btnTracker, index ){
									
									scope.attachListener( btnTracker, 'click', function(){
										 
										let self = this;
										   
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "lhfa",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("lhfa-detail-type"), scope.qs("lhfa-confirm-type")], "Ke "+data.monthTo );
											scope.text([scope.qs("lhfa-detail-height"), scope.qs("lhfa-confirm-height")], data.height+' Cm' );
											scope.text([scope.qs("lhfa-detail-recorded"), scope.qs("lhfa-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("lhfa-detail-datecreate"), scope.qs("lhfa-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											scope.text([scope.qs("lhfa-detail-gizi"), scope.qs("lhfa-confirm-gizi")], self.getAttribute("gizi") );
											scope.text([scope.qs("lhfa-detail-zscore"), scope.qs("lhfa-confirm-zscore")], self.getAttribute("zscore") );
											
											scope.qs("modal-lhfa-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											
											obj.modal.behaviour.openFadeIn("modal-lhfa-detail");	
								    
										})  
									})
								})
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("lhfa-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("lhfa-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
									
										if( self.data.ageInMonth <= 5 ) self.data.ageInMonth = 6;
										self.data.ageInMonth += 1;
										
										dir =  "right";
									}else if(  self.data.ageInMonth > 5 ){
										
										if( self.data.ageInMonth >= 55 ) self.data.ageInMonth = 55;
										self.data.ageInMonth -= 1;
										
										dir =  "left";
									}
								  
									if( self.data.ageInMonth > 0 && self.data.ageInMonth < 60 ){
									
										let data =  obj.chart.generateData(  self.data, self.isZscore ),
										dataset = self.isZscore ? [ data.pUser,data.p1,data.p5,data.p15,data.p50,data.p85,data.p95,data.p99] :
										[ data.pUser,data.p01,data.p1,data.p3,data.p5,data.p10,data.p15,data.p25,data.p50,data.p75,data.p85,data.p90,data.p95,data.p97,data.p99,data.p999];
										   
										scope.text(scope.qs("month-lhfa-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						},
						hcForAge : {
							canvas : "canvas-hc",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							isZscore : false,
							data : {
								ageInMonth : 12,
								girl : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [30.2,32.9,34.5,35.7,36.7,37.5,38.2,38.8,39.3,39.7,40.1,40.4,40.7,41,41.2,41.4,41.6,41.8,42,42.1,42.3,42.4,42.6,42.7,42.9,43,43.1,43.3,43.4,43.5,43.6,43.7,43.8,43.9,44,44.1,44.1,44.2,44.3,44.4,44.4,44.5,44.6,44.6,44.7,44.8,44.8,44.9,44.9,45,45.1,45.1,45.2,45.2,45.3,45.3,45.3,45.4,45.4,45.5,45.5],
									p1 : [46.6,46.6,46.5,46.5,46.4,46.4,46.3,46.3,46.2,46.2,46.1,46.1,46,46,45.9,45.9,45.8,45.7,45.7,45.6,45.5,45.5,45.4,45.3,45.2,45.1,45.1,45,44.9,44.8,44.7,44.6,44.4,44.3,44.2,44.1,43.9,43.8,43.7,43.5,43.4,43.2,43,42.9,42.7,42.5,42.2,42,41.7,41.4,41.1,40.7,40.3,39.8,39.2,38.5,37.6,36.6,35.4,33.8,31.1].reverse(),
									p3 : [47.2, 47.2, 47.2, 47.1, 47.1, 47, 47, 46.9, 46.9, 46.8, 46.8, 46.7, 46.7, 46.6, 46.5, 46.5, 46.4, 46.4, 46.3, 46.2, 46.2, 46.1, 46, 45.9, 45.9, 45.8, 45.7, 45.6, 45.5, 45.4, 45.3, 45.2, 45.1, 44.9, 44.8, 44.7, 44.6, 44.4, 44.3, 44.1, 44, 43.8, 43.6, 43.5, 43.3, 43.1, 42.9, 42.6, 42.3, 42, 41.7, 41.3, 40.9, 40.4, 39.7, 39, 38.2, 37.2, 36, 34.3, 31.7].reverse(),
									p5 : [47.6,47.5,47.5,47.4,47.4,47.4,47.3,47.3,47.2,47.2,47.1,47.1,47,46.9,46.9,46.8,46.8,46.7,46.6,46.6,46.5,46.4,46.3,46.3,46.2,46.1,46,45.9,45.8,45.7,45.6,45.5,45.4,45.3,45.2,45,44.9,44.7,44.6,44.5,44.3,44.1,44,43.8,43.6,43.4,43.2,42.9,42.7,42.4,42,41.6,41.2,40.7,40.1,39.3,38.5,37.5,36.3,34.6,31.9].reverse(),
									p10 : [48.1, 48.1, 48, 48, 47.9, 47.9, 47.8, 47.8, 47.7, 47.7, 47.6, 47.6, 47.5, 47.5, 47.4, 47.3, 47.3, 47.2, 47.1, 47.1, 47, 46.9, 46.9, 46.8, 46.7, 46.6, 46.5, 46.4, 46.3, 46.2, 46.1, 46, 45.9, 45.8, 45.7, 45.5, 45.4, 45.3, 45.1, 45, 44.8, 44.6, 44.5, 44.3, 44.1, 43.9, 43.7, 43.4, 43.2, 42.9, 42.5, 42.1, 41.7, 41.1, 40.5, 39.8, 39, 37.9, 36.7, 35, 32.4].reverse(),
									p15 : [48.4,48.4,48.4,48.3,48.3,48.2,48.2,48.1,48.1,48,48,47.9,47.9,47.8,47.7,47.7,47.6,47.6,47.5,47.4,47.4,47.3,47.2,47.1,47,47,46.9,46.8,46.7,46.6,46.5,46.4,46.3,46.1,46,45.9,45.7,45.6,45.4,45.3,45.1,45,44.8,44.6,44.4,44.2,44,43.8,43.5,43.2,42.8,42.4,42,41.5,40.8,40.1,39.3,38.2,37,35.3,32.7].reverse(),
									p25 : [49, 48.9, 48.9, 48.8, 48.8, 48.7, 48.7, 48.6, 48.6, 48.5, 48.5, 48.4, 48.4, 48.3, 48.3, 48.2, 48.1, 48.1, 48, 47.9, 47.9, 47.8, 47.7, 47.6, 47.6, 47.5, 47.4, 47.3, 47.2, 47.1, 47, 46.9, 46.8, 46.6, 46.5, 46.4, 46.2, 46.1, 46, 45.8, 45.6, 45.5, 45.3, 45.1, 44.9, 44.7, 44.5, 44.3, 44, 43.7, 43.3, 42.9, 42.5, 41.9, 41.3, 40.6, 39.7, 38.7, 37.4, 35.8, 33.1].reverse(),
									p50 : [49.9,49.9,49.8,49.8,49.7,49.7,49.6,49.6,49.5,49.5,49.4,49.4,49.3,49.3,49.2,49.2,49.1,49,49,48.9,48.8,48.7,48.7,48.6,48.5,48.4,48.3,48.2,48.1,48,47.9,47.8,47.7,47.6,47.5,47.3,47.2,47,46.9,46.7,46.6,46.4,46.2,46.1,45.9,45.7,45.4,45.2,44.9,44.6,44.2,43.8,43.4,42.8,42.2,41.5,40.6,39.5,38.3,36.5,33.9].reverse(),
									p75 : [50.9, 50.8, 50.8, 50.7, 50.7, 50.7, 50.6, 50.6, 50.5, 50.5, 50.4, 50.3, 50.3, 50.2, 50.2, 50.1, 50.1, 50, 49.9, 49.8, 49.8, 49.7, 49.6, 49.5, 49.5, 49.4, 49.3, 49.2, 49.1, 49, 48.9, 48.8, 48.7, 48.5, 48.4, 48.3, 48.1, 48, 47.8, 47.7, 47.5, 47.3, 47.2, 47, 46.8, 46.6, 46.3, 46.1, 45.8, 45.5, 45.1, 44.7, 44.3, 43.7, 43.1, 42.3, 41.4, 40.4, 39.1, 37.3, 34.7].reverse(),
									p85 : [51.4,51.4,51.3,51.3,51.2,51.2,51.1,51.1,51,51,50.9,50.9,50.8,50.7,50.7,50.6,50.6,50.5,50.4,50.4,50.3,50.2,50.1,50.1,50,49.9,49.8,49.7,49.6,49.5,49.4,49.3,49.2,49,48.9,48.8,48.6,48.5,48.3,48.2,48,47.8,47.7,47.5,47.3,47.1,46.8,46.6,46.3,46,45.6,45.2,44.7,44.2,43.5,42.8,41.9,40.8,39.5,37.8,35.1].reverse(),
									p90 : [51.7, 51.7, 51.7, 51.6, 51.6, 51.5, 51.5, 51.4, 51.4, 51.3, 51.3, 51.2, 51.2, 51.1, 51, 51, 50.9, 50.8, 50.8, 50.7, 50.6, 50.6, 50.5, 50.4, 50.3, 50.2, 50.1, 50, 49.9, 49.8, 49.7, 49.6, 49.5, 49.4, 49.2, 49.1, 49, 48.8, 48.7, 48.5, 48.4, 48.2, 48, 47.8, 47.6, 47.4, 47.2, 46.9, 46.6, 46.3, 46, 45.5, 45.1, 44.5, 43.9, 43.1, 42.2, 41.1, 39.8, 38, 35.4].reverse(),
									p95 : [52.3,52.2,52.2,52.1,52.1,52,52,51.9,51.9,51.8,51.8,51.7,51.7,51.6,51.6,51.5,51.4,51.4,51.3,51.2,51.2,51.1,51,50.9,50.8,50.7,50.7,50.6,50.5,50.4,50.2,50.1,50,49.9,49.8,49.6,49.5,49.3,49.2,49,48.9,48.7,48.5,48.3,48.1,47.9,47.7,47.4,47.1,46.8,46.4,46,45.6,45,44.3,43.6,42.7,41.6,40.2,38.5,35.8].reverse(),
									p97 : [52.6, 52.6, 52.5, 52.5, 52.4, 52.4, 52.3, 52.3, 52.2, 52.2, 52.1, 52.1, 52, 51.9, 51.9, 51.8, 51.8, 51.7, 51.6, 51.6, 51.5, 51.4, 51.3, 51.3, 51.2, 51.1, 51, 50.9, 50.8, 50.7, 50.6, 50.5, 50.3, 50.2, 50.1, 49.9, 49.8, 49.7, 49.5, 49.4, 49.2, 49, 48.8, 48.7, 48.5, 48.2, 48, 47.7, 47.5, 47.1, 46.8, 46.3, 45.9, 45.3, 44.6, 43.9, 43, 41.9, 40.5, 38.8, 36.1].reverse(),
									p99 : [53.2,53.2,53.1,53.1,53.1,53,53,52.9,52.9,52.8,52.7,52.7,52.6,52.6,52.5,52.5,52.4,52.3,52.3,52.2,52.1,52,52,51.9,51.8,51.7,51.6,51.5,51.4,51.3,51.2,51.1,51,50.8,50.7,50.6,50.4,50.3,50.1,50,49.8,49.6,49.5,49.3,49.1,48.8,48.6,48.3,48.1,47.7,47.4,46.9,46.5,45.9,45.2,44.5,43.5,42.4,41.1,39.3,36.6].reverse(),
									p999 : [37.5,40.2,42,43.4,44.5,45.4,46.2,46.9,47.5,48,48.4,48.8,49.1,49.4,49.7,49.9,50.1,50.3,50.5,50.7,50.9,51,51.2,51.3,51.5,51.6,51.8,51.9,52,52.2,52.3,52.4,52.5,52.6,52.7,52.8,52.9,53,53,53.1,53.2,53.3,53.3,53.4,53.5,53.5,53.6,53.7,53.7,53.8,53.8,53.9,53.9,54,54,54.1,54.1,54.2,54.2,54.3,54.3]
								},
								boy : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [ 30.5,33.7,35.5,36.9,37.9,38.8,39.6,40.2,40.7,41.1,41.5,41.8,42.1,42.3,42.6,42.8,42.9,43.1,43.3,43.4,43.6,43.7,43.8,43.9,44,44.2,44.3,44.4,44.5,44.5,44.6,44.7,44.8,44.9,44.9,45,45.1,45.1,45.2,45.3,45.3,45.4,45.4,45.5,45.5,45.6,45.6,45.7,45.7,45.7,45.8,45.8,45.8,45.9,45.9,46,46,46,46.1,46.1,46.1 ],
									p1 : [47.3,47.2,47.2,47.2,47.1,47.1,47.1,47,47,46.9,46.9,46.9,46.8,46.8,46.7,46.7,46.6,46.6,46.5,46.5,46.4,46.3,46.3,46.2,46.2,46.1,46,45.9,45.9,45.8,45.7,45.6,45.5,45.4,45.3,45.2,45.1,45,44.8,44.7,44.6,44.4,44.3,44.1,44,43.8,43.6,43.3,43.1,42.8,42.5,42.1,41.6,41.1,40.5,39.7,38.9,37.8,36.4,34.6,31.5].reverse(),
									p3 : [47.9, 47.9, 47.9, 47.8, 47.8, 47.7, 47.7, 47.7, 47.6, 47.6, 47.5, 47.5, 47.5, 47.4, 47.4, 47.3, 47.3, 47.2, 47.2, 47.1, 47, 47, 46.9, 46.9, 46.8, 46.7, 46.6, 46.6, 46.5, 46.4, 46.3, 46.2, 46.1, 46, 45.9, 45.8, 45.7, 45.6, 45.4, 45.3, 45.2, 45, 44.9, 44.7, 44.5, 44.3, 44.1, 43.9, 43.6, 43.4, 43, 42.6, 42.2, 41.7, 41, 40.3, 39.4, 38.3, 36.9, 35.1, 32.1].reverse(),
									p5 : [48.3,48.2,48.2,48.2,48.1,48.1,48.1,48,48,47.9,47.9,47.9,47.8,47.8,47.7,47.7,47.6,47.6,47.5,47.4,47.4,47.3,47.3,47.2,47.1,47.1,47,46.9,46.8,46.7,46.6,46.6,46.5,46.3,46.2,46.1,46,45.9,45.8,45.6,45.5,45.3,45.2,45,44.8,44.7,44.4,44.2,44,43.7,43.3,42.9,42.5,42,41.3,40.6,39.7,38.6,37.2,35.4,32.4].reverse(),
									p10 : [48.8, 48.8, 48.8, 48.7, 48.7, 48.6, 48.6, 48.6, 48.5, 48.5, 48.4, 48.4, 48.3, 48.3, 48.2, 48.2, 48.1, 48.1, 48, 48, 47.9, 47.8, 47.8, 47.7, 47.6, 47.6, 47.5, 47.4, 47.3, 47.2, 47.1, 47.1, 47, 46.8, 46.7, 46.6, 46.5, 46.4, 46.3, 46.1, 46, 45.8, 45.7, 45.5, 45.3, 45.1, 44.9, 44.7, 44.4, 44.1, 43.8, 43.4, 42.9, 42.4, 41.8, 41, 40.1, 39, 37.6, 35.8, 32.8].reverse(),
									p15 : [49.2,49.2,49.1,49.1,49,49,49,48.9,48.9,48.8,48.8,48.7,48.7,48.6,48.6,48.5,48.5,48.4,48.4,48.3,48.3,48.2,48.1,48.1,48,47.9,47.8,47.8,47.7,47.6,47.5,47.4,47.3,47.2,47.1,47,46.8,46.7,46.6,46.4,46.3,46.2,46,45.8,45.6,45.5,45.2,45,44.7,44.4,44.1,43.7,43.2,42.7,42.1,41.3,40.4,39.3,37.9,36.1,33.1].reverse(),
									p25 : [49.7, 49.7, 49.7, 49.6, 49.6, 49.5, 49.5, 49.5, 49.4, 49.4, 49.3, 49.3, 49.2, 49.2, 49.1, 49.1, 49, 49, 48.9, 48.8, 48.8, 48.7, 48.6, 48.6, 48.5, 48.4, 48.3, 48.3, 48.2, 48.1, 48, 47.9, 47.8, 47.7, 47.6, 47.5, 47.3, 47.2, 47.1, 46.9, 46.8, 46.6, 46.5, 46.3, 46.1, 45.9, 45.7, 45.5, 45.2, 44.9, 44.6, 44.2, 43.7, 43.1, 42.5, 41.7, 40.8, 39.7, 38.3, 36.5, 33.6].reverse(),
									p50 : [50.7,50.7,50.7,50.6,50.6,50.5,50.5,50.4,50.4,50.4,50.3,50.3,50.2,50.2,50.1,50.1,50,49.9,49.9,49.8,49.7,49.7,49.6,49.5,49.5,49.4,49.3,49.2,49.1,49,48.9,48.8,48.7,48.6,48.5,48.4,48.3,48.1,48,47.8,47.7,47.5,47.4,47.2,47,46.8,46.6,46.3,46.1,45.8,45.4,45,44.5,44,43.3,42.6,41.6,40.5,39.1,37.3,34.5].reverse(),
									p75 : [51.7, 51.7, 51.7, 51.6, 51.6, 51.5, 51.5, 51.4, 51.4, 51.3, 51.3, 51.2, 51.2, 51.1, 51.1, 51, 51, 50.9, 50.8, 50.8, 50.7, 50.6, 50.6, 50.5, 50.4, 50.3, 50.3, 50.2, 50.1, 50, 49.9, 49.8, 49.7, 49.5, 49.4, 49.3, 49.2, 49, 48.9, 48.7, 48.6, 48.4, 48.3, 48.1, 47.9, 47.7, 47.5, 47.2, 46.9, 46.6, 46.3, 45.8, 45.4, 44.8, 44.2, 43.4, 42.4, 41.3, 39.9, 38.1, 35.3].reverse(),
									p85 : [52.3,52.2,52.2,52.2,52.1,52.1,52,52,51.9,51.9,51.8,51.8,51.7,51.7,51.6,51.6,51.5,51.4,51.4,51.3,51.2,51.2,51.1,51,50.9,50.8,50.8,50.7,50.6,50.5,50.4,50.3,50.2,50,49.9,49.8,49.7,49.5,49.4,49.2,49.1,48.9,48.7,48.6,48.4,48.2,47.9,47.7,47.4,47.1,46.7,46.3,45.8,45.3,44.6,43.8,42.9,41.7,40.3,38.5,35.8].reverse(),
									p90 : [52.7, 52.6, 52.6, 52.5, 52.5, 52.4, 52.4, 52.3, 52.3, 52.2, 52.2, 52.1, 52.1, 52, 52, 51.9, 51.9, 51.8, 51.7, 51.7, 51.6, 51.5, 51.4, 51.4, 51.3, 51.2, 51.1, 51, 50.9, 50.8, 50.7, 50.6, 50.5, 50.4, 50.3, 50.1, 50, 49.9, 49.7, 49.6, 49.4, 49.2, 49.1, 48.9, 48.7, 48.5, 48.3, 48, 47.7, 47.4, 47, 46.6, 46.1, 45.6, 44.9, 44.1, 43.2, 42, 40.6, 38.8, 36.1].reverse(),
									p95 : [53.2,53.2,53.1,53.1,53,53,52.9,52.9,52.8,52.8,52.7,52.7,52.6,52.6,52.5,52.4,52.4,52.3,52.2,52.2,52.1,52,52,51.9,51.8,51.7,51.6,51.5,51.4,51.3,51.2,51.1,51,50.9,50.8,50.6,50.5,50.3,50.2,50.1,49.9,49.7,49.6,49.4,49.2,49,48.7,48.5,48.2,47.9,47.5,47.1,46.6,46,45.3,44.5,43.6,42.5,41.1,39.2,36.6].reverse(),
									p97 : [53.5, 53.5, 53.5, 53.4, 53.4, 53.3, 53.3, 53.2, 53.2, 53.1, 53.1, 53, 53, 52.9, 52.8, 52.8, 52.7, 52.7, 52.6, 52.5, 52.4, 52.4, 52.3, 52.2, 52.1, 52, 52, 51.9, 51.8, 51.7, 51.6, 51.4, 51.3, 51.2, 51.1, 50.9, 50.8, 50.7, 50.5, 50.4, 50.2, 50, 49.9, 49.7, 49.5, 49.3, 49, 48.8, 48.5, 48.2, 47.8, 47.4, 46.9, 46.3, 45.6, 44.8, 43.9, 42.7, 41.3, 39.5, 36.9].reverse(),
									p99 : [54.2,54.2,54.1,54.1,54,54,53.9,53.9,53.8,53.8,53.7,53.7,53.6,53.6,53.5,53.4,53.4,53.3,53.2,53.2,53.1,53,52.9,52.8,52.8,52.7,52.6,52.5,52.4,52.3,52.2,52.1,51.9,51.8,51.7,51.6,51.4,51.3,51.1,51,50.8,50.6,50.5,50.3,50.1,49.8,49.6,49.3,49.1,48.7,48.4,47.9,47.4,46.8,46.2,45.4,44.4,43.3,41.9,40,37.4].reverse(),
									p999 : [ 38.4,40.9,42.8,44.2,45.3,46.3,47.1,47.8,48.4,48.9,49.3,49.7,50,50.3,50.6,50.8,51.1,51.3,51.5,51.7,51.8,52,52.2,52.3,52.5,52.6,52.7,52.9,53,53.1,53.2,53.4,53.5,53.6,53.7,53.8,53.8,53.9,54,54.1,54.2,54.3,54.3,54.4,54.5,54.5,54.6,54.7,54.7,54.8,54.8,54.9,55,55,55.1,55.1,55.2,55.2,55.3,55.3,55.4 ]
								},
								girlZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [30.3,33,34.6,35.8,36.8,37.6,38.3,38.9,39.4,39.8,40.2,40.5,40.8,41.1,41.3,41.5,41.7,41.9,42.1,42.3,42.4,42.6,42.7,42.9,43,43.1,43.3,43.4,43.5,43.6,43.7,43.8,43.9,44,44.1,44.2,44.3,44.4,44.4,44.5,44.6,44.6,44.7,44.8,44.8,44.9,45,45,45.1,45.1,45.2,45.2,45.3,45.3,45.4,45.4,45.5,45.5,45.6,45.6,45.7],
									//SD 2 Neg
									p5 : [31.5,34.2,35.8,37.1,38.1,38.9,39.6,40.2,40.7,41.2,41.5,41.9,42.2,42.4,42.7,42.9,43.1,43.3,43.5,43.6,43.8,44,44.1,44.3,44.4,44.5,44.7,44.8,44.9,45,45.1,45.2,45.3,45.4,45.5,45.6,45.7,45.8,45.8,45.9,46,46.1,46.1,46.2,46.3,46.3,46.4,46.4,46.5,46.5,46.6,46.7,46.7,46.8,46.8,46.9,46.9,46.9,47,47,47.1],
									//SD 1 Neg
									p15 : [32.7,35.4,37,38.3,39.3,40.2,40.9,41.5,42,42.5,42.9,43.2,43.5,43.8,44.1,44.3,44.5,44.7,44.9,45,45.2,45.3,45.5,45.6,45.8,45.9,46.1,46.2,46.3,46.4,46.5,46.6,46.7,46.8,46.9,47,47.1,47.2,47.3,47.3,47.4,47.5,47.5,47.6,47.7,47.7,47.8,47.9,47.9,48,48,48.1,48.1,48.2,48.2,48.3,48.3,48.4,48.4,48.5,48.5],
									//SD 0
									p50 : [33.9,36.5,38.3,39.5,40.6,41.5,42.2,42.8,43.4,43.8,44.2,44.6,44.9,45.2,45.4,45.7,45.9,46.1,46.2,46.4,46.6,46.7,46.9,47,47.2,47.3,47.5,47.6,47.7,47.8,47.9,48,48.1,48.2,48.3,48.4,48.5,48.6,48.7,48.7,48.8,48.9,49,49,49.1,49.2,49.2,49.3,49.3,49.4,49.4,49.5,49.5,49.6,49.6,49.7,49.7,49.8,49.8,49.9,49.9],
									//SD 1
									p85 : [35.1,37.7,39.5,40.8,41.8,42.7,43.5,44.1,44.7,45.2,45.6,45.9,46.3,46.5,46.8,47,47.2,47.4,47.6,47.8,48,48.1,48.3,48.4,48.6,48.7,48.9,49,49.1,49.2,49.3,49.4,49.6,49.7,49.7,49.8,49.9,50,50.1,50.2,50.2,50.3,50.4,50.4,50.5,50.6,50.6,50.7,50.8,50.8,50.9,50.9,51,51,51.1,51.1,51.2,51.2,51.3,51.3,51.3],
									//SD 2
									p95 : [36.2,38.9,40.7,42,43.1,44,44.8,45.5,46,46.5,46.9,47.3,47.6,47.9,48.2,48.4,48.6,48.8,49,49.2,49.4,49.5,49.7,49.8,50,50.1,50.3,50.4,50.5,50.6,50.7,50.9,51,51.1,51.2,51.2,51.3,51.4,51.5,51.6,51.7,51.7,51.8,51.9,51.9,52,52.1,52.1,52.2,52.2,52.3,52.3,52.4,52.4,52.5,52.5,52.6,52.6,52.7,52.7,52.8],
									//SD 3
									p99 : [37.4,40.1,41.9,43.3,44.4,45.3,46.1,46.8,47.4,47.8,48.3,48.6,49,49.3,49.5,49.8,50,50.2,50.4,50.6,50.7,50.9,51.1,51.2,51.4,51.5,51.7,51.8,51.9,52,52.2,52.3,52.4,52.5,52.6,52.7,52.7,52.8,52.9,53,53.1,53.1,53.2,53.3,53.3,53.4,53.5,53.5,53.6,53.6,53.7,53.8,53.8,53.9,53.9,54,54,54.1,54.1,54.1,54.2]
								},
								boyZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [30.7,33.8,35.6,37,38,38.9,39.7,40.3,40.8,41.2,41.6,41.9,42.2,42.5,42.7,42.9,43.1,43.2,43.4,43.5,43.7,43.8,43.9,44.1,44.2,44.3,44.4,44.5,44.6,44.7,44.8,44.8,44.9,45,45.1,45.1,45.2,45.3,45.3,45.4,45.4,45.5,45.5,45.6,45.6,45.7,45.7,45.8,45.8,45.9,45.9,45.9,46,46,46.1,46.1,46.1,46.2,46.2,46.2,46.3],
									//SD 2 Neg
									p5 : [31.9,34.9,36.8,38.1,39.2,40.1,40.9,41.5,42,42.5,42.9,43.2,43.5,43.8,44,44.2,44.4,44.6,44.7,44.9,45,45.2,45.3,45.4,45.5,45.6,45.8,45.9,46,46.1,46.1,46.2,46.3,46.4,46.5,46.6,46.6,46.7,46.8,46.8,46.9,46.9,47,47,47.1,47.1,47.2,47.2,47.3,47.3,47.4,47.4,47.5,47.5,47.5,47.6,47.6,47.6,47.7,47.7,47.7],
									//SD 1 Neg
									p15 : [33.2,36.1,38,39.3,40.4,41.4,42.1,42.7,43.3,43.7,44.1,44.5,44.8,45,45.3,45.5,45.7,45.9,46,46.2,46.4,46.5,46.6,46.8,46.9,47,47.1,47.2,47.3,47.4,47.5,47.6,47.7,47.8,47.9,48,48,48.1,48.2,48.2,48.3,48.4,48.4,48.5,48.5,48.6,48.7,48.7,48.7,48.8,48.8,48.9,48.9,49,49,49.1,49.1,49.1,49.2,49.2,49.2],
									//SD 0
									p50 : [34.5,37.3,39.1,40.5,41.6,42.6,43.3,44,44.5,45,45.4,45.8,46.1,46.3,46.6,46.8,47,47.2,47.4,47.5,47.7,47.8,48,48.1,48.3,48.4,48.5,48.6,48.7,48.8,48.9,49,49.1,49.2,49.3,49.4,49.5,49.5,49.6,49.7,49.7,49.8,49.9,49.9,50,50.1,50.1,50.2,50.2,50.3,50.3,50.4,50.4,50.4,50.5,50.5,50.6,50.6,50.7,50.7,50.7],
									//SD 1
									p85 : [35.7,38.4,40.3,41.7,42.8,43.8,44.6,45.2,45.8,46.3,46.7,47,47.4,47.6,47.9,48.1,48.3,48.5,48.7,48.9,49,49.2,49.3,49.5,49.6,49.7,49.9,50,50.1,50.2,50.3,50.4,50.5,50.6,50.7,50.8,50.9,51,51,51.1,51.2,51.3,51.3,51.4,51.4,51.5,51.6,51.6,51.7,51.7,51.8,51.8,51.9,51.9,52,52,52.1,52.1,52.1,52.2,52.2],
									//SD 2
									p95 : [37,39.6,41.5,42.9,44,45,45.8,46.4,47,47.5,47.9,48.3,48.6,48.9,49.2,49.4,49.6,49.8,50,50.2,50.4,50.5,50.7,50.8,51,51.1,51.2,51.4,51.5,51.6,51.7,51.8,51.9,52,52.1,52.2,52.3,52.4,52.5,52.5,52.6,52.7,52.8,52.8,52.9,53,53,53.1,53.1,53.2,53.2,53.3,53.4,53.4,53.5,53.5,53.5,53.6,53.6,53.7,53.7],
									//SD 3
									p99 : [38.3,40.8,42.6,44.1,45.2,46.2,47,47.7,48.3,48.8,49.2,49.6,49.9,50.2,50.5,50.7,51,51.2,51.4,51.5,51.7,51.9,52,52.2,52.3,52.5,52.6,52.7,52.9,53,53.1,53.2,53.3,53.4,53.5,53.6,53.7,53.8,53.9,54,54.1,54.1,54.2,54.3,54.3,54.4,54.5,54.5,54.6,54.7,54.7,54.8,54.8,54.9,54.9,55,55,55.1,55.1,55.2,55.2]
								}
								
							},
							updateTextModal : function( objData ){
								 
								//birth date
								scope.text( scope.qs("tgl-hc"), scope.dateToYMD( objData.birthDateStart, "year" ) );	
								
								//total month
								scope.text( scope.qs("mth-hc"), objData.birthNowTotalMonth );							
								
								//birth to date now
								scope.text( scope.qs("tgl-now-hc"),  scope.dateToYMD( objData.birthNowToMonth, "year" ) );
								
								scope.text( scope.qs("hc-switch-graph"), ( this.isZscore ? "Grafik : Z-Score" : "Grafik : Persentil" ) );
								 
								return objData.birthNowTotalMonth;
							},
							create : function(){
								//set data
								let objData = obj.chart.dateBaby();
								 
								this.data.ageInMonth = objData.birthNowTotalMonth; 
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "hc", this.isZscore );
								   
								let params = obj.chart.generateChart( this, this.isZscore ),
								
								wfaWrapper = scope.qs("hc-wrapper"),
								ctxBound = scope.id('canvas-hc').getBoundingClientRect();
								 
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("month-hc-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								
								scope.text(scope.qs("gender-hc-age"), params.gender)
								//options
								
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){

								this.isZscore = obj.dataStorage.layoutState.hcSwitch;
								
								//obj.dataStorage
								let self = this,
								main = scope.qs("hc-wrapper"), 
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.hc ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box ruler-icon"> ' +
										'		<div class="notify-strip-b"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.hc ).toFixed(2) +' Cm </abbr> ' +
										'	<abbr class="inbeetween extrabold">  '+ params.strDeduct +' Cm </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman bulan ke '+ params.monthTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ 
										' 				<label class="'+ params.resultColor +'">'+ params.resultText +'</label>'+ 
										' 					Z-Score '+ params.resultVal +
										'			</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" gizi="'+ params.resultText +'" zscore="'+ params.resultVal +'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.babyId === dataBaby.id ){
										
										if( obj.loadMore.marker( "hcForAge", main, dataNote, index ) ){
											
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].hc : 0,
											
											deduct = ( dataNote.hc - dateNext ).toFixed(2),
											strDeduct = deduct > 0 ? '+'+deduct : deduct < 0 ?  deduct : 0;
											
											let zscore = fn.zScoreFn({
												value : parseFloat( dataNote.hc ),
												data : self.data,
												valueFor : "hc",
												gender : dataBaby.gender,
												month : parseInt( dataNote.monthTo )
											})
											
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												hc : dataNote.hc,
												monthTo : dataNote.monthTo,
												strDeduct : strDeduct,
												resultVal : zscore.resultVal,
												resultText : zscore.resultText,
												resultColor : zscore.resultColor
											}); 
										
										}
										
										dataEmpty = false
									}	
								};
								
								 //short ascending
								data.sort(function(a, b){
					
									return b.monthTo - a.monthTo;
									
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
								let trackerBtns = scope.slice( scope.qs("hc-wrapper").querySelectorAll(".bubble-small-left") );
								
								trackerBtns.map(function( btnTracker, index ){
									
									scope.attachListener( btnTracker, 'click', function(){
										
										let self = this;
										    
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "hc",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("hc-detail-type"), scope.qs("hc-confirm-type")], "Ke "+data.monthTo );
											scope.text([scope.qs("hc-detail-height"), scope.qs("hc-confirm-height")], data.hc+' Cm' );
											scope.text([scope.qs("hc-detail-recorded"), scope.qs("hc-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("hc-detail-datecreate"), scope.qs("hc-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											scope.text([scope.qs("hc-detail-gizi"), scope.qs("hc-confirm-gizi")], self.getAttribute("gizi") );
											scope.text([scope.qs("hc-detail-zscore"), scope.qs("hc-confirm-zscore")], self.getAttribute("zscore") );
											
											scope.qs("modal-hc-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											
											obj.modal.behaviour.openFadeIn("modal-hc-detail");	
								    
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
									
										if( self.data.ageInMonth <= 5 ) self.data.ageInMonth = 6;
										self.data.ageInMonth += 1;
										
										dir =  "right";
									}else if(  self.data.ageInMonth > 5 ){
										
										if( self.data.ageInMonth >= 55 ) self.data.ageInMonth = 55;
										self.data.ageInMonth -= 1;
										
										dir =  "left";
									}
								  
									if( self.data.ageInMonth > 0 && self.data.ageInMonth < 60 ){
									
										let data =  obj.chart.generateData(  self.data, self.isZscore ),
										dataset = self.isZscore ? [ data.pUser,data.p1,data.p5,data.p15,data.p50,data.p85,data.p95,data.p99] :
										[ data.pUser,data.p01,data.p1,data.p3,data.p5,data.p10,data.p15,data.p25,data.p50,data.p75,data.p85,data.p90,data.p95,data.p97,data.p99,data.p999];
										  
										scope.text(scope.qs("month-hc-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						
						},
						bmiForAge : {
							canvas : "canvas-bmi",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							isZscore : false,
							data : {
								ageInMonth : 12,
								girl : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										 return temp.reverse();
										
									}(),
									p01 :[10,10.7,11.7,12.3,12.6,12.8,12.9,12.9,12.9,12.8,12.8,12.7,12.6,12.5,12.5,12.4,12.3,12.3,12.2,12.2,12.2,12.1,12.1,12.1,12.1,12.3,12.3,12.2,12.2,12.2,12.2,12.2,12.1,12.1,12.1,12.1,12,12,12,12,11.9,11.9,11.9,11.9,11.8,11.8,11.8,11.8,11.7,11.7,11.7,11.7,11.7,11.6,11.6,11.6,11.6,11.6,11.6,11.6,11.6 ],
									p1 : [12.3,12.3,12.3,12.4,12.4,12.4,12.4,12.4,12.4,12.4,12.4,12.5,12.5,12.5,12.5,12.5,12.6,12.6,12.6,12.6,12.7,12.7,12.7,12.7,12.8,12.8,12.8,12.8,12.8,12.9,12.9,12.9,12.9,13,13,13,12.8,12.8,12.8,12.8,12.9,12.9,13,13,13.1,13.2,13.3,13.3,13.4,13.5,13.6,13.7,13.7,13.8,13.7,13.7,13.5,13.2,12.6,11.6,10.8].reverse(),
									p3 : [12.8, 12.8, 12.8, 12.8, 12.8, 12.9, 12.9, 12.9, 12.9, 12.9, 12.9, 12.9, 12.9, 13, 13, 13, 13, 13, 13.1, 13.1, 13.1, 13.1, 13.2, 13.2, 13.2, 13.2, 13.2, 13.3, 13.3, 13.3, 13.3, 13.4, 13.4, 13.4, 13.4, 13.4, 13.2, 13.2, 13.3, 13.3, 13.3, 13.4, 13.4, 13.5, 13.6, 13.7, 13.7, 13.8, 13.9, 14, 14.1, 14.2, 14.3, 14.3, 14.3, 14.2, 14, 13.7, 13.2, 12.1, 11.2].reverse(),
									p5 : [13.1,13.1,13.1,13.1,13.1,13.1,13.1,13.1,13.1,13.2,13.2,13.2,13.2,13.2,13.2,13.3,13.3,13.3,13.3,13.3,13.4,13.4,13.4,13.4,13.5,13.5,13.5,13.5,13.5,13.6,13.6,13.6,13.6,13.7,13.7,13.7,13.5,13.5,13.5,13.6,13.6,13.6,13.7,13.8,13.8,13.9,14,14.1,14.2,14.3,14.4,14.5,14.6,14.6,14.6,14.5,14.3,14,13.5,12.4,11.5].reverse(),
									p10 : [13.5, 13.5, 13.5, 13.5, 13.5, 13.5, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6, 13.7, 13.7, 13.7, 13.7, 13.7, 13.7, 13.8, 13.8, 13.8, 13.8, 13.8, 13.9, 13.9, 13.9, 13.9, 14, 14, 14, 14, 14, 14.1, 14.1, 13.9, 13.9, 13.9, 14, 14, 14.1, 14.1, 14.2, 14.3, 14.3, 14.4, 14.5, 14.6, 14.8, 14.9, 15, 15, 15.1, 15.1, 15, 14.8, 14.5, 14, 12.9, 11.8].reverse(),
									p15 : [13.8,13.8,13.8,13.8,13.8,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,14,14,14,14,14,14,14.1,14.1,14.1,14.1,14.1,14.2,14.2,14.2,14.2,14.3,14.3,14.3,14.3,14.4,14.4,14.1,14.2,14.2,14.2,14.3,14.3,14.4,14.5,14.6,14.6,14.7,14.8,15,15.1,15.2,15.3,15.4,15.4,15.4,15.3,15.2,14.9,14.3,13.2,12.1].reverse(),
									p25 : [14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.5, 14.5, 14.5, 14.5, 14.5, 14.5, 14.6, 14.6, 14.6, 14.6, 14.7, 14.7, 14.7, 14.7, 14.8, 14.8, 14.8, 14.6, 14.6, 14.6, 14.7, 14.7, 14.8, 14.8, 14.9, 15, 15.1, 15.2, 15.3, 15.4, 15.5, 15.7, 15.8, 15.9, 15.9, 15.9, 15.8, 15.7, 15.4, 14.8, 13.6, 12.5].reverse(),
									p50 : [15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.2,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.4,15.4,15.4,15.4,15.4,15.5,15.5,15.5,15.5,15.6,15.6,15.6,15.6,15.7,15.4,15.4,15.5,15.5,15.6,15.7,15.7,15.8,15.9,16,16.1,16.2,16.4,16.5,16.6,16.7,16.8,16.9,16.9,16.8,16.7,16.4,15.8,14.6,13.3].reverse(),
									p75 : [16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.4, 16.4, 16.4, 16.4, 16.5, 16.5, 16.5, 16.5, 16.6, 16.6, 16.3, 16.4, 16.4, 16.5, 16.5, 16.6, 16.7, 16.8, 16.9, 17, 17.1, 17.2, 17.4, 17.5, 17.7, 17.8, 17.9, 18, 18, 17.9, 17.7, 17.4, 16.8, 15.5, 14.2].reverse(),
									p85 : [17,16.9,16.9,16.9,16.9,16.9,16.9,16.9,16.9,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.9,16.9,16.9,16.9,16.9,17,17,17,17,17.1,17.1,17.1,16.9,16.9,17,17,17.1,17.2,17.2,17.3,17.4,17.5,17.7,17.8,17.9,18.1,18.2,18.4,18.5,18.6,18.6,18.5,18.3,18,17.4,16.1,14.7].reverse(),
									p90 : [17.4, 17.4, 17.4, 17.4, 17.3, 17.3, 17.3, 17.3, 17.3, 17.3, 17.3, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.2, 17.3, 17.3, 17.3, 17.3, 17.3, 17.4, 17.4, 17.4, 17.4, 17.5, 17.5, 17.3, 17.3, 17.3, 17.4, 17.5, 17.5, 17.6, 17.7, 17.8, 17.9, 18.1, 18.2, 18.4, 18.5, 18.7, 18.8, 18.9, 19, 19, 18.9, 18.8, 18.4, 17.8, 16.4, 15].reverse(),
									p95 : [18.1,18.1,18,18,18,18,18,17.9,17.9,17.9,17.9,17.9,17.9,17.9,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.9,17.9,17.9,17.9,17.9,18,18,18,18.1,18.1,17.8,17.9,17.9,18,18.1,18.1,18.2,18.3,18.4,18.6,18.7,18.8,19,19.1,19.3,19.4,19.6,19.6,19.6,19.6,19.4,19,18.4,17,15.5].reverse(),
									p97 : [18.6, 18.5, 18.5, 18.5, 18.5, 18.4, 18.4, 18.4, 18.4, 18.4, 18.3, 18.3, 18.3, 18.3, 18.3, 18.3, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.3, 18.3, 18.3, 18.3, 18.4, 18.4, 18.4, 18.5, 18.5, 18.2, 18.3, 18.3, 18.4, 18.5, 18.5, 18.6, 18.7, 18.8, 19, 19.1, 19.2, 19.4, 19.6, 19.7, 19.9, 20, 20.1, 20.1, 20, 19.8, 19.4, 18.8, 17.3, 15.9].reverse(),
									p99 : [19.5,19.5,19.4,19.4,19.4,19.4,19.3,19.3,19.3,19.2,19.2,19.2,19.2,19.1,19.1,19.1,19.1,19.1,19,19,19,19,19,19,19,19,19,19,19.1,19.1,19.1,19.2,19.2,19.2,19.3,19.3,19,19.1,19.1,19.2,19.3,19.3,19.4,19.5,19.7,19.8,19.9,20.1,20.2,20.4,20.6,20.7,20.8,20.9,20.9,20.8,20.6,20.3,19.5,18,16.6].reverse(),
									p999 : [ 17.8,19.3,20.9,21.7,22.1,22.4,22.5,22.5,22.4,22.3,22.1,22,21.8,21.6,21.5,21.3,21.2,21.1,21,20.9,20.8,20.7,20.6,20.6,20.5,20.8,20.7,20.7,20.7,20.6,20.6,20.6,20.5,20.5,20.5,20.5,20.5,20.5,20.5,20.5,20.5,20.6,20.6,20.6,20.6,20.7,20.7,20.7,20.8,20.8,20.9,20.9,21,21,21,21.1,21.1,21.2,21.2,21.3,21.3]
								},
								boy : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];

										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [ 10.1,11.2,12.4,13,13.3,13.4,13.5,13.6,13.5,13.5,13.4,13.3,13.3,13.2,13.1,13,13,12.9,12.8,12.8,12.7,12.7,12.7,12.6,12.6,12.8,12.7,12.7,12.6,12.6,12.5,12.5,12.5,12.4,12.4,12.4,12.3,12.3,12.3,12.2,12.2,12.2,12.1,12.1,12.1,12.1,12.1,12,12,12,12,12,12,11.9,11.9,11.9,11.9,11.9,11.9,11.9,11.9 ],
									p1 : [12.6,12.6,12.6,12.6,12.6,12.6,12.6,12.7,12.7,12.7,12.7,12.7,12.7,12.8,12.8,12.8,12.8,12.8,12.9,12.9,12.9,12.9,13,13,13,13.1,13.1,13.1,13.2,13.2,13.3,13.3,13.3,13.4,13.4,13.5,13.3,13.3,13.3,13.4,13.4,13.5,13.6,13.6,13.7,13.8,13.9,13.9,14,14.1,14.2,14.3,14.4,14.4,14.4,14.3,14.1,13.9,13.3,12,10.8].reverse(),
									p3 : [13, 13, 13, 13, 13.1, 13.1, 13.1, 13.1, 13.1, 13.1, 13.2, 13.2, 13.2, 13.2, 13.2, 13.2, 13.3, 13.3, 13.3, 13.3, 13.4, 13.4, 13.4, 13.5, 13.5, 13.5, 13.5, 13.6, 13.6, 13.7, 13.7, 13.7, 13.8, 13.8, 13.8, 13.9, 13.7, 13.7, 13.8, 13.8, 13.9, 13.9, 14, 14.1, 14.2, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 14.9, 14.9, 14.8, 14.7, 14.4, 13.8, 12.6, 11.3].reverse(),
									p5 : [13.3,13.3,13.3,13.3,13.3,13.3,13.3,13.3,13.4,13.4,13.4,13.4,13.4,13.5,13.5,13.5,13.5,13.5,13.6,13.6,13.6,13.6,13.7,13.7,13.7,13.8,13.8,13.8,13.9,13.9,13.9,14,14,14,14.1,14.1,13.9,14,14,14.1,14.1,14.2,14.2,14.3,14.4,14.5,14.6,14.7,14.8,14.9,15,15.1,15.1,15.2,15.2,15.1,15,14.7,14.1,12.8,11.5].reverse(),
									p10 : [13.6, 13.7, 13.7, 13.7, 13.7, 13.7, 13.7, 13.7, 13.8, 13.8, 13.8, 13.8, 13.8, 13.8, 13.9, 13.9, 13.9, 13.9, 13.9, 14, 14, 14, 14.1, 14.1, 14.1, 14.1, 14.2, 14.2, 14.2, 14.3, 14.3, 14.4, 14.4, 14.4, 14.5, 14.5, 14.3, 14.3, 14.4, 14.4, 14.5, 14.6, 14.6, 14.7, 14.8, 14.9, 15, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.6, 15.6, 15.6, 15.4, 15.2, 14.6, 13.3, 11.9].reverse(),
									p15 : [13.9,13.9,13.9,14,14,14,14,14,14,14,14.1,14.1,14.1,14.1,14.1,14.2,14.2,14.2,14.2,14.2,14.3,14.3,14.3,14.4,14.4,14.4,14.4,14.5,14.5,14.5,14.6,14.6,14.7,14.7,14.7,14.8,14.5,14.6,14.6,14.7,14.8,14.8,14.9,15,15.1,15.2,15.3,15.4,15.5,15.6,15.7,15.8,15.9,15.9,15.9,15.9,15.7,15.5,14.9,13.6,12.2].reverse(),
									p25 : [14.3, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.5, 14.5, 14.5, 14.5, 14.5, 14.5, 14.6, 14.6, 14.6, 14.6, 14.7, 14.7, 14.7, 14.7, 14.8, 14.8, 14.8, 14.9, 14.9, 14.9, 15, 15, 15, 15.1, 15.1, 15.1, 15.2, 14.9, 15, 15, 15.1, 15.2, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 16, 16.2, 16.3, 16.3, 16.4, 16.4, 16.4, 16.2, 16, 15.4, 14.1, 12.6].reverse(),
									p50 : [15.2,15.2,15.2,15.2,15.2,15.2,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.4,15.4,15.4,15.4,15.4,15.5,15.5,15.5,15.5,15.6,15.6,15.6,15.7,15.7,15.7,15.8,15.8,15.8,15.9,15.9,15.9,16,15.7,15.8,15.8,15.9,16,16.1,16.1,16.2,16.3,16.4,16.6,16.7,16.8,16.9,17,17.2,17.3,17.3,17.3,17.3,17.2,16.9,16.3,14.9,13.4].reverse(),
									p75 : [16.1, 16.1, 16.1, 16.1, 16.1, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.3, 16.3, 16.3, 16.3, 16.3, 16.4, 16.4, 16.4, 16.4, 16.5, 16.5, 16.5, 16.6, 16.6, 16.6, 16.7, 16.7, 16.7, 16.8, 16.8, 16.9, 16.6, 16.7, 16.7, 16.8, 16.9, 16.9, 17, 17.1, 17.2, 17.4, 17.5, 17.6, 17.7, 17.9, 18, 18.1, 18.2, 18.3, 18.3, 18.3, 18.2, 17.9, 17.3, 15.9, 14.3].reverse(),
									p85 : [16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.8,16.8,16.8,16.8,16.8,16.8,16.9,16.9,16.9,17,17,17,17,17.1,17.1,17.2,17.2,17.2,17.3,17.3,17.4,17.1,17.1,17.2,17.3,17.4,17.4,17.5,17.6,17.8,17.9,18,18.1,18.3,18.4,18.6,18.7,18.8,18.9,18.9,18.9,18.7,18.5,17.8,16.4,14.8].reverse(),
									p90 : [17.1, 17.1, 17.1, 17.1, 17, 17, 17, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.1, 17.2, 17.2, 17.2, 17.2, 17.3, 17.3, 17.3, 17.4, 17.4, 17.4, 17.5, 17.5, 17.5, 17.6, 17.6, 17.7, 17.7, 17.4, 17.5, 17.6, 17.6, 17.7, 17.8, 17.9, 18, 18.1, 18.2, 18.4, 18.5, 18.7, 18.8, 18.9, 19.1, 19.2, 19.3, 19.3, 19.2, 19.1, 18.8, 18.2, 16.7, 15.2].reverse(),
									p95 : [17.7,17.7,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.6,17.7,17.7,17.7,17.7,17.7,17.7,17.8,17.8,17.8,17.9,17.9,17.9,18,18,18,18.1,18.1,18.2,18.2,18.3,18,18,18.1,18.2,18.3,18.4,18.5,18.6,18.7,18.8,18.9,19.1,19.2,19.4,19.5,19.7,19.8,19.9,19.9,19.8,19.7,19.4,18.8,17.3,15.8].reverse(),
									p97 : [18.1, 18.1, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18.1, 18.1, 18.1, 18.1, 18.2, 18.2, 18.2, 18.3, 18.3, 18.4, 18.4, 18.4, 18.5, 18.5, 18.6, 18.6, 18.3, 18.4, 18.5, 18.6, 18.6, 18.7, 18.8, 18.9, 19.1, 19.2, 19.3, 19.5, 19.6, 19.8, 19.9, 20.1, 20.2, 20.3, 20.3, 20.2, 20.1, 19.8, 19.2, 17.6, 16.1].reverse(),
									p99 : [18.9,18.9,18.8,18.8,18.8,18.8,18.8,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.7,18.8,18.8,18.8,18.8,18.9,18.9,18.9,19,19,19.1,19.1,19.1,19.2,19.2,19.3,19.4,19.1,19.1,19.2,19.3,19.4,19.5,19.6,19.7,19.8,19.9,20.1,20.2,20.4,20.5,20.7,20.8,21,21.1,21.1,21,20.9,20.6,19.9,18.3,16.9].reverse(),
									p999 : [ 18.3,19.6,21.3,22,22.3,22.4,22.5,22.5,22.4,22.3,22.1,22,21.8,21.6,21.5,21.3,21.2,21.1,21,20.8,20.7,20.6,20.6,20.5,20.4,20.7,20.6,20.6,20.5,20.5,20.4,20.3,20.3,20.2,20.2,20.2,20.1,20.1,20.1,20,20,20,20,20,20,20,20,20,20,20,20.1,20.1,20.1,20.1,20.2,20.2,20.3,20.3,20.3,20.4,20.5 ]
								},
								girlZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [10.1,10.8,11.8,12.4,12.7,12.9,13,13,13,12.9,12.9,12.8,12.7,12.6,12.6,12.5,12.4,12.4,12.3,12.3,12.2,12.2,12.2,12.2,12.1,12.4,12.3,12.3,12.3,12.3,12.3,12.2,12.2,12.2,12.2,12.1,12.1,12.1,12.1,12,12,12,12,11.9,11.9,11.9,11.9,11.8,11.8,11.8,11.8,11.8,11.7,11.7,11.7,11.7,11.7,11.7,11.7,11.6,11.6],
									//SD 2 Neg
									p5 : [11.1,12,13,13.6,13.9,14.1,14.1,14.2,14.1,14.1,14,13.9,13.8,13.7,13.6,13.5,13.5,13.4,13.3,13.3,13.2,13.2,13.1,13.1,13.1,13.3,13.3,13.3,13.3,13.2,13.2,13.2,13.2,13.1,13.1,13.1,13.1,13.1,13,13,13,13,12.9,12.9,12.9,12.9,12.9,12.8,12.8,12.8,12.8,12.8,12.8,12.7,12.7,12.7,12.7,12.7,12.7,12.7,12.7],
									//SD 1 Neg
									p15 : [12.2,13.2,14.3,14.9,15.2,15.4,15.5,15.5,15.4,15.3,15.2,15.1,15,14.9,14.8,14.7,14.6,14.5,14.4,14.4,14.3,14.3,14.2,14.2,14.2,14.4,14.4,14.4,14.3,14.3,14.3,14.3,14.3,14.2,14.2,14.2,14.2,14.1,14.1,14.1,14.1,14.1,14,14,14,14,14,14,14,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9,13.9],
									//SD 0
									p50 : [13.3,14.6,15.8,16.4,16.7,16.8,16.9,16.9,16.8,16.7,16.6,16.5,16.4,16.2,16.1,16,15.9,15.8,15.7,15.7,15.6,15.5,15.5,15.4,15.4,15.7,15.6,15.6,15.6,15.6,15.5,15.5,15.5,15.5,15.4,15.4,15.4,15.4,15.4,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.2,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3],
									//SD 1
									p85 : [14.6,16,17.3,17.9,18.3,18.4,18.5,18.5,18.4,18.3,18.2,18,17.9,17.7,17.6,17.5,17.4,17.3,17.2,17.1,17,17,16.9,16.9,16.8,17.1,17,17,17,17,16.9,16.9,16.9,16.9,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.8,16.9,16.9,16.9,16.9],
									//SD 2
									p95 : [16.1,17.5,19,19.7,20,20.2,20.3,20.3,20.2,20.1,19.9,19.8,19.6,19.5,19.3,19.2,19.1,18.9,18.8,18.8,18.7,18.6,18.5,18.5,18.4,18.7,18.7,18.6,18.6,18.6,18.5,18.5,18.5,18.5,18.5,18.4,18.4,18.4,18.4,18.4,18.4,18.4,18.4,18.4,18.5,18.5,18.5,18.5,18.5,18.5,18.6,18.6,18.6,18.6,18.7,18.7,18.7,18.7,18.8,18.8,18.8],
									//SD 3
									p99 : [17.7,19.1,20.7,21.5,22,22.2,22.3,22.3,22.2,22.1,21.9,21.8,21.6,21.4,21.3,21.1,21,20.9,20.8,20.7,20.6,20.5,20.4,20.4,20.3,20.6,20.6,20.5,20.5,20.4,20.4,20.4,20.4,20.3,20.3,20.3,20.3,20.3,20.3,20.3,20.3,20.4,20.4,20.4,20.4,20.5,20.5,20.5,20.6,20.6,20.7,20.7,20.7,20.8,20.8,20.9,20.9,21,21,21,21.1]
								},
								boyZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [10.2,11.3,12.5,13.1,13.4,13.5,13.6,13.7,13.6,13.6,13.5,13.4,13.4,13.3,13.2,13.1,13.1,13,12.9,12.9,12.8,12.8,12.7,12.7,12.7,12.8,12.8,12.7,12.7,12.7,12.6,12.6,12.5,12.5,12.5,12.4,12.4,12.4,12.3,12.3,12.3,12.2,12.2,12.2,12.2,12.2,12.1,12.1,12.1,12.1,12.1,12.1,12,12,12,12,12,12,12,12,12],
									//SD 2 Neg
									p5 : [11.1,12.4,13.7,14.3,14.5,14.7,14.7,14.8,14.7,14.7,14.6,14.5,14.4,14.3,14.2,14.1,14,13.9,13.9,13.8,13.7,13.7,13.6,13.6,13.6,13.8,13.7,13.7,13.6,13.6,13.6,13.5,13.5,13.5,13.4,13.4,13.4,13.3,13.3,13.3,13.2,13.2,13.2,13.2,13.1,13.1,13.1,13.1,13.1,13,13,13,13,13,13,13,12.9,12.9,12.9,12.9,12.9],
									//SD 1 Neg
									p15 : [12.2,13.6,15,15.5,15.8,15.9,16,16,15.9,15.8,15.7,15.6,15.5,15.4,15.3,15.2,15.1,15,14.9,14.9,14.8,14.7,14.7,14.6,14.6,14.8,14.8,14.7,14.7,14.7,14.6,14.6,14.6,14.5,14.5,14.5,14.4,14.4,14.4,14.3,14.3,14.3,14.3,14.2,14.2,14.2,14.2,14.2,14.1,14.1,14.1,14.1,14.1,14.1,14,14,14,14,14,14,14],
									//SD 0
									p50 : [13.4,14.9,16.3,16.9,17.2,17.3,17.3,17.3,17.3,17.2,17,16.9,16.8,16.7,16.6,16.4,16.3,16.2,16.1,16.1,16,15.9,15.8,15.8,15.7,16,15.9,15.9,15.9,15.8,15.8,15.8,15.7,15.7,15.7,15.6,15.6,15.6,15.5,15.5,15.5,15.5,15.4,15.4,15.4,15.4,15.4,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.3,15.2,15.2,15.2,15.2,15.2,15.2],
									//SD 1
									p85 : [14.8,16.3,17.8,18.4,18.7,18.8,18.8,18.8,18.7,18.6,18.5,18.4,18.2,18.1,18,17.8,17.7,17.6,17.5,17.4,17.3,17.2,17.2,17.1,17,17.3,17.3,17.2,17.2,17.1,17.1,17.1,17,17,17,16.9,16.9,16.9,16.8,16.8,16.8,16.8,16.8,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.7,16.6,16.6,16.6,16.6,16.6,16.6,16.6,16.6,16.6,16.6],
									//SD 2
									p95 : [16.3,17.8,19.4,20,20.3,20.5,20.5,20.5,20.4,20.3,20.1,20,19.8,19.7,19.5,19.4,19.3,19.1,19,18.9,18.8,18.7,18.7,18.6,18.5,18.8,18.8,18.7,18.7,18.6,18.6,18.5,18.5,18.5,18.4,18.4,18.4,18.3,18.3,18.3,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.2,18.3,18.3,18.3],
									//SD 3
									p99 : [18.1,19.4,21.1,21.8,22.1,22.3,22.3,22.3,22.2,22.1,22,21.8,21.6,21.5,21.3,21.2,21,20.9,20.8,20.7,20.6,20.5,20.4,20.3,20.3,20.5,20.5,20.4,20.4,20.3,20.2,20.2,20.1,20.1,20,20,20,19.9,19.9,19.9,19.9,19.9,19.8,19.8,19.8,19.8,19.8,19.9,19.9,19.9,19.9,19.9,19.9,20,20,20,20.1,20.1,20.2,20.2,20.3]
								}
								
							},
							updateTextModal : function( objData ){
								 
								//birth date
								scope.text( scope.qs("tgl-bmi"), scope.dateToYMD( objData.birthDateStart, "year" ) );	
								
								//total month
								scope.text( scope.qs("mth-bmi"), objData.birthNowTotalMonth );							
								
								//birth to date now
								scope.text( scope.qs("tgl-now-bmi"),  scope.dateToYMD( objData.birthNowToMonth, "year" ) );
								
								scope.text( scope.qs("bmi-switch-graph"), ( this.isZscore ? "Grafik : Z-Score" : "Grafik : Persentil" ) );
								 
								return objData.birthNowTotalMonth;
							},
							create : function(){
								
								//set data
								let objData = obj.chart.dateBaby();
								 
								this.data.ageInMonth = objData.birthNowTotalMonth; 
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data, "bmi", this.isZscore );
								  
								let params = obj.chart.generateChart( this, this.isZscore ),
								wfaWrapper = scope.qs("bmi-wrapper"),
								ctxBound = scope.id('canvas-bmi').getBoundingClientRect();
								 
								//update data modal
								this.updateTextModal( objData );
								
								scope.text(scope.qs("month-bmi-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								
								scope.text(scope.qs("gender-bmi-age"), params.gender)
								//options
								
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})
				 
							},
							init : function( objectInitial ){
								
								this.isZscore = obj.dataStorage.layoutState.bmiSwitch;
								
								//obj.dataStorage 
								let self = this,
								main = scope.qs("bmi-wrapper"), 
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.bmi ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box scale-icon"> ' +
										'		<div class="notify-strip-b"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.bmi ).toFixed(2) +' </abbr> ' +
										'	<abbr class="inbeetween extrabold">  '+ params.strDeduct +' </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman bulan ke '+ params.monthTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ 
										' 				<label class="'+ params.resultColor +'">'+ params.resultText +'</label>'+ 
										' 					Z-Score '+ params.resultVal +
										'			</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" gizi="'+ params.resultText +'" zscore="'+ params.resultVal +'"></div> ' +
										'</div> '
										
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
									
									if( dataNote.babyId === dataBaby.id ){
										
										if( obj.loadMore.marker( "bmiForAge", main, dataNote, index ) ){
											
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].bmi : 0,
											
											deduct = ( dataNote.bmi - dateNext ).toFixed(2),
											strDeduct = deduct > 0 ? '+'+deduct : deduct < 0 ?  deduct : 0;
											
											let zscore = fn.zScoreFn({
												value : parseFloat( dataNote.bmi ),
												data : self.data,
												valueFor : "bmi",
												gender : dataBaby.gender,
												month : parseInt( dataNote.monthTo ) 
											})
											 
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												bmi : dataNote.bmi,
												monthTo : dataNote.monthTo,
												strDeduct : strDeduct,
												resultVal : zscore.resultVal,
												resultText : zscore.resultText,
												resultColor : zscore.resultColor
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								 //short ascending
								data.sort(function(a, b){
					
									return b.monthTo - a.monthTo;
									
								});
								 
								//clear container
								if( !objectInitial ){
									 
									container.innerHTML = "" ;
									
									//reset loadmore
									obj.loadMore.state.bmiForAge.reset();
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
									bmi detail buttons
								*/
								let trackerBtns = scope.slice( scope.qs("bmi-wrapper").querySelectorAll(".bubble-small-left") );
								
								trackerBtns.map(function( btnTracker, index ){
									
									scope.attachListener( btnTracker, 'click', function(){
										 
										let self = this;
										  
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "bmi",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
  
											//modal detail
											scope.text([scope.qs("bmi-detail-type"), scope.qs("bmi-confirm-type")], "Ke "+data.monthTo );
											scope.text([scope.qs("bmi-detail-value"), scope.qs("bmi-confirm-value")], data.bmi );
											scope.text([scope.qs("bmi-detail-height"), scope.qs("bmi-confirm-height")], data.height+' Meter' );
											scope.text([scope.qs("bmi-detail-weight"), scope.qs("bmi-confirm-weight")], data.weight+' Kg' );
											scope.text([scope.qs("bmi-detail-recorded"), scope.qs("bmi-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("bmi-detail-datecreate"), scope.qs("bmi-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											scope.text([scope.qs("bmi-detail-gizi"), scope.qs("bmi-confirm-gizi")], self.getAttribute("gizi") );
											scope.text([scope.qs("bmi-detail-zscore"), scope.qs("bmi-confirm-zscore")], self.getAttribute("zscore") );
											
											scope.qs("modal-bmi-confirm").querySelector(".send-button").setAttribute( "label", data.id )
										
											obj.modal.behaviour.openFadeIn("modal-bmi-detail");	
								    
										}) 
										 
									})
								})
							
								
							},
							event : function(){
								
								/***
									Button Left Right chart
								*/
								let self = this,
								btnRight = scope.qs("bmi-wrapper").querySelector(".button-right"),
								btnLeft = scope.qs("bmi-wrapper").querySelector(".button-left");
								 
								scope.attachListener( [ btnLeft, btnRight ], 'click', function( index ){
									 
									let dir = "";
									if( /right/i.test( this.className ) ){
									
										if( self.data.ageInMonth <= 5 ) self.data.ageInMonth = 6;
										self.data.ageInMonth += 1;
										
										dir =  "right";
									}else if(  self.data.ageInMonth > 5 ){
										
										if( self.data.ageInMonth >= 55 ) self.data.ageInMonth = 55;
										self.data.ageInMonth -= 1;
										
										dir =  "left";
									}
								  
									if( self.data.ageInMonth > 0 && self.data.ageInMonth < 60 ){
										 
										let data =  obj.chart.generateData(  self.data, self.isZscore  ),
										dataset = self.isZscore ? [ data.pUser,data.p1,data.p5,data.p15,data.p50,data.p85,data.p95,data.p99] :
										[ data.pUser,data.p01,data.p1,data.p3,data.p5,data.p10,data.p15,data.p25,data.p50,data.p75,data.p85,data.p90,data.p95,data.p97,data.p99,data.p999];
										    
										scope.text(scope.qs("month-bmi-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
								
							}
						},
						weightForAge : {
							canvas : "canvas-wfa",
							color : 'rgb(255, 99, 132, 0.9)',
							chartObj : "",
							isZscore : true,
							data : {
								ageInMonth : 0,
								girl : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [2,2.7,3.4,3.9,4.4,4.7,5,5.3,5.5,5.7,5.9,6,6.2,6.4,6.5,6.7,6.8,7,7.1,7.3,7.4,7.6,7.7,7.8,8,8.1,8.3,8.4,8.5,8.7,8.8,8.9,9,9.2,9.3,9.4,9.5,9.6,9.7,9.8,10,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,11,11.1,11.2,11.3,11.3,11.4,11.5,11.6,11.7,11.8,11.9],
									p1 : [13.2,13.1,12.9,12.8,12.7,12.6,12.5,12.4,12.3,12.2,12.1,11.9,11.8,11.7,11.6,11.5,11.4,11.3,11.1,11,10.9,10.8,10.6,10.5,10.4,10.3,10.1,10,9.9,9.7,9.6,9.5,9.3,9.2,9,8.9,8.7,8.5,8.4,8.2,8.1,7.9,7.8,7.6,7.4,7.3,7.1,6.9,6.8,6.6,6.4,6.2,6,5.8,5.5,5.2,4.8,4.4,3.8,3,2.3].reverse(),
									p3 : [14, 13.8, 13.7, 13.6, 13.5, 13.4, 13.2, 13.1, 13, 12.9, 12.8, 12.6, 12.5, 12.4, 12.3, 12.1, 12, 11.9, 11.8, 11.6, 11.5, 11.4, 11.2, 11.1, 11, 10.8, 10.7, 10.5, 10.4, 10.3, 10.1, 10, 9.8, 9.6, 9.5, 9.3, 9.2, 9, 8.8, 8.7, 8.5, 8.3, 8.2, 8, 7.8, 7.7, 7.5, 7.3, 7.1, 7, 6.8, 6.6, 6.3, 6.1, 5.8, 5.5, 5.1, 4.6, 4, 3.2, 2.4].reverse(),
									p5 : [14.4,14.3,14.2,14,13.9,13.8,13.7,13.5,13.4,13.3,13.2,13,12.9,12.8,12.6,12.5,12.4,12.2,12.1,12,11.8,11.7,11.6,11.4,11.3,11.1,11,10.8,10.7,10.5,10.4,10.2,10.1,9.9,9.8,9.6,9.4,9.2,9.1,8.9,8.7,8.6,8.4,8.2,8.1,7.9,7.7,7.5,7.3,7.2,7,6.8,6.5,6.3,6,5.6,5.2,4.7,4.1,3.3,2.5].reverse(),
									p10 : [15.2, 15, 14.9, 14.8, 14.6, 14.5, 14.3, 14.2, 14.1, 13.9, 13.8, 13.7, 13.5, 13.4, 13.2, 13.1, 13, 12.8, 12.7, 12.5, 12.4, 12.2, 12.1, 11.9, 11.8, 11.6, 11.5, 11.3, 11.2, 11, 10.9, 10.7, 10.5, 10.4, 10.2, 10, 9.8, 9.7, 9.5, 9.3, 9.1, 8.9, 8.8, 8.6, 8.4, 8.2, 8, 7.9, 7.7, 7.5, 7.3, 7, 6.8, 6.5, 6.2, 5.9, 5.5, 5, 4.3, 3.5, 2.7].reverse(),
									p15 : [15.7,15.5,15.4,15.3,15.1,15,14.8,14.7,14.5,14.4,14.3,14.1,14,13.8,13.7,13.5,13.4,13.2,13.1,12.9,12.8,12.6,12.5,12.3,12.1,12,11.8,11.7,11.5,11.3,11.2,11,10.8,10.7,10.5,10.3,10.1,9.9,9.8,9.6,9.4,9.2,9,8.8,8.7,8.5,8.3,8.1,7.9,7.7,7.5,7.3,7,6.7,6.4,6.1,5.6,5.1,4.5,3.6,2.8].reverse(),
									p25 : [16.5, 16.4, 16.2, 16.1, 15.9, 15.8, 15.6, 15.4, 15.3, 15.1, 15, 14.8, 14.7, 14.5, 14.3, 14.2, 14, 13.9, 13.7, 13.5, 13.4, 13.2, 13, 12.9, 12.7, 12.5, 12.4, 12.2, 12, 11.9, 11.7, 11.5, 11.3, 11.1, 10.9, 10.8, 10.6, 10.4, 10.2, 10, 9.8, 9.6, 9.4, 9.2, 9, 8.8, 8.6, 8.4, 8.2, 8, 7.8, 7.6, 7.3, 7, 6.7, 6.4, 5.9, 5.4, 4.7, 3.8, 2.9].reverse(),
									p50 : [18.2,18,17.9,17.7,17.5,17.3,17.2,17,16.8,16.6,16.4,16.3,16.1,15.9,15.7,15.5,15.3,15.2,15,14.8,14.6,14.4,14.2,14,13.9,13.7,13.5,13.3,13.1,12.9,12.7,12.5,12.3,12.1,11.9,11.7,11.5,11.3,11.1,10.9,10.6,10.4,10.2,10,9.8,9.6,9.4,9.2,8.9,8.7,8.5,8.2,7.9,7.6,7.3,6.9,6.4,5.8,5.1,4.2,3.2].reverse(),
									p75 : [20.2, 20, 19.8, 19.6, 19.3, 19.1, 18.9, 18.7, 18.5, 18.3, 18.1, 17.9, 17.7, 17.5, 17.3, 17, 16.8, 16.6, 16.4, 16.2, 16, 15.8, 15.6, 15.3, 15.1, 14.9, 14.7, 14.5, 14.3, 14.1, 13.8, 13.6, 13.4, 13.2, 12.9, 12.7, 12.5, 12.3, 12, 11.8, 11.6, 11.4, 11.1, 10.9, 10.7, 10.4, 10.2, 10, 9.7, 9.5, 9.2, 8.9, 8.6, 8.3, 7.9, 7.5, 7, 6.4, 5.6, 4.6, 3.6].reverse(),
									p85 : [21.3,21.1,20.9,20.7,20.4,20.2,20,19.8,19.5,19.3,19.1,18.9,18.6,18.4,18.2,17.9,17.7,17.5,17.3,17,16.8,16.6,16.3,16.1,15.9,15.7,15.4,15.2,15,14.7,14.5,14.3,14,13.8,13.6,13.3,13.1,12.8,12.6,12.4,12.1,11.9,11.6,11.4,11.2,10.9,10.7,10.4,10.2,9.9,9.6,9.3,9,8.7,8.3,7.8,7.3,6.7,5.9,4.8,3.7].reverse(),
									p90 : [22.2, 21.9, 21.7, 21.5, 21.2, 21, 20.8, 20.5, 20.3, 20, 19.8, 19.5, 19.3, 19.1, 18.8, 18.6, 18.3, 18.1, 17.9, 17.6, 17.4, 17.1, 16.9, 16.7, 16.4, 16.2, 15.9, 15.7, 15.5, 15.2, 15, 14.7, 14.5, 14.3, 14, 13.8, 13.5, 13.3, 13, 12.8, 12.5, 12.3, 12, 11.8, 11.5, 11.3, 11, 10.8, 10.5, 10.2, 9.9, 9.6, 9.3, 8.9, 8.5, 8.1, 7.5, 6.9, 6, 5, 3.9].reverse(),
									p95 : [23.5,23.3,23,22.7,22.5,22.2,22,21.7,21.4,21.2,20.9,20.6,20.4,20.1,19.9,19.6,19.3,19.1,18.8,18.6,18.3,18,17.8,17.5,17.3,17,16.8,16.5,16.2,16,15.7,15.5,15.2,15,14.7,14.4,14.2,13.9,13.6,13.4,13.1,12.9,12.6,12.3,12.1,11.8,11.5,11.3,11,10.7,10.4,10.1,9.7,9.4,8.9,8.4,7.9,7.2,6.3,5.2,4].reverse(),
									p97 : [24.4, 24.2, 23.9, 23.6, 23.3, 23.1, 22.8, 22.5, 22.2, 22, 21.7, 21.4, 21.1, 20.8, 20.6, 20.3, 20, 19.7, 19.5, 19.2, 18.9, 18.6, 18.4, 18.1, 17.8, 17.6, 17.3, 17, 16.8, 16.5, 16.2, 16, 15.7, 15.4, 15.2, 14.9, 14.6, 14.3, 14.1, 13.8, 13.5, 13.3, 13, 12.7, 12.5, 12.2, 11.9, 11.6, 11.3, 11, 10.7, 10.4, 10, 9.6, 9.2, 8.7, 8.1, 7.4, 6.5, 5.4, 4.2].reverse(),
									p99 : [26.3,26,25.7,25.4,25.1,24.8,24.5,24.2,23.9,23.5,23.2,22.9,22.6,22.3,22,21.7,21.4,21.1,20.8,20.5,20.2,19.9,19.6,19.3,19,18.7,18.4,18.1,17.8,17.6,17.3,17,16.7,16.4,16.1,15.8,15.5,15.2,14.9,14.6,14.4,14.1,13.8,13.5,13.2,12.9,12.6,12.3,12,11.7,11.3,11,10.6,10.2,9.7,9.2,8.6,7.8,6.9,5.7,4.4].reverse(),
									p999 : [4.8,6.3,7.6,8.6,9.4,10.1,10.7,11.2,11.7,12.1,12.5,12.9,13.3,13.6,14,14.3,14.6,15,15.3,15.6,15.9,16.2,16.6,16.9,17.2,17.6,17.9,18.2,18.6,18.9,19.2,19.6,19.9,20.2,20.6,20.9,21.2,21.6,21.9,22.3,22.6,23,23.3,23.7,24.1,24.4,24.8,25.2,25.5,25.9,26.3,26.7,27,27.4,27.8,28.2,28.5,28.9,29.3,29.6,30]
									
								},
								boy : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									p01 : [2,2.9,3.7,4.4,4.9,5.3,5.6,5.9,6.1,6.3,6.5,6.7,6.9,7,7.2,7.3,7.5,7.6,7.7,7.9,8,8.2,8.3,8.4,8.5,8.7,8.8,8.9,9,9.2,9.3,9.4,9.5,9.6,9.7,9.8,9.9,10,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,11,11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12,12,12.1,12.2],
									p1 : [13.5,13.4,13.3,13.2,13.1,13,12.9,12.7,12.6,12.5,12.4,12.3,12.2,12.1,12,11.9,11.8,11.7,11.5,11.4,11.3,11.2,11.1,11,10.8,10.7,10.6,10.5,10.4,10.3,10.1,10,9.9,9.7,9.6,9.5,9.3,9.2,9,8.9,8.7,8.6,8.4,8.3,8.1,8,7.8,7.6,7.5,7.3,7.1,6.9,6.7,6.4,6.1,5.8,5.4,4.8,4.1,3.2,2.3].reverse(),
									p3 : [14.3, 14.2, 14.1, 13.9, 13.8, 13.7, 13.6, 13.5, 13.4, 13.3, 13.1, 13, 12.9, 12.8, 12.7, 12.5, 12.4, 12.3, 12.2, 12.1, 11.9, 11.8, 11.7, 11.6, 11.4, 11.3, 11.2, 11.1, 10.9, 10.8, 10.7, 10.5, 10.4, 10.2, 10.1, 10, 9.8, 9.7, 9.5, 9.3, 9.2, 9, 8.9, 8.7, 8.5, 8.4, 8.2, 8, 7.8, 7.7, 7.5, 7.2, 7, 6.7, 6.4, 6.1, 5.6, 5.1, 4.4, 3.4, 2.5].reverse(),
									p5 : [14.7,14.6,14.5,14.4,14.3,14.1,14,13.9,13.8,13.7,13.5,13.4,13.3,13.2,13,12.9,12.8,12.7,12.5,12.4,12.3,12.2,12,11.9,11.8,11.6,11.5,11.4,11.2,11.1,11,10.8,10.7,10.5,10.4,10.2,10.1,9.9,9.8,9.6,9.4,9.3,9.1,8.9,8.8,8.6,8.4,8.2,8.1,7.9,7.7,7.4,7.2,6.9,6.6,6.2,5.8,5.2,4.5,3.6,2.6].reverse(),
									p10 : [15.5, 15.3, 15.2, 15.1, 14.9, 14.8, 14.7, 14.6, 14.4, 14.3, 14.2, 14, 13.9, 13.8, 13.6, 13.5, 13.4, 13.2, 13.1, 13, 12.8, 12.7, 12.6, 12.4, 12.3, 12.2, 12, 11.9, 11.7, 11.6, 11.4, 11.3, 11.1, 11, 10.8, 10.7, 10.5, 10.3, 10.2, 10, 9.8, 9.7, 9.5, 9.3, 9.1, 9, 8.8, 8.6, 8.4, 8.2, 8, 7.7, 7.5, 7.2, 6.9, 6.5, 6, 5.5, 4.7, 3.8, 2.8].reverse(),
									p15 : [16,15.8,15.7,15.6,15.4,15.3,15.2,15,14.9,14.7,14.6,14.5,14.3,14.2,14.1,13.9,13.8,13.6,13.5,13.4,13.2,13.1,12.9,12.8,12.7,12.5,12.4,12.2,12.1,11.9,11.8,11.6,11.5,11.3,11.1,11,10.8,10.6,10.5,10.3,10.1,9.9,9.7,9.6,9.4,9.2,9,8.8,8.6,8.4,8.2,7.9,7.7,7.4,7.1,6.7,6.2,5.6,4.9,3.9,2.9].reverse(),
									p25 : [16.7, 16.6, 16.5, 16.3, 16.2, 16, 15.9, 15.7, 15.6, 15.4, 15.3, 15.2, 15, 14.9, 14.7, 14.6, 14.4, 14.3, 14.1, 14, 13.8, 13.7, 13.5, 13.4, 13.2, 13.1, 12.9, 12.8, 12.6, 12.4, 12.3, 12.1, 12, 11.8, 11.6, 11.4, 11.3, 11.1, 10.9, 10.7, 10.5, 10.3, 10.1, 10, 9.8, 9.6, 9.4, 9.2, 9, 8.7, 8.5, 8.3, 8, 7.7, 7.4, 7, 6.5, 5.9, 5.1, 4.1, 3].reverse(),
									p50 : [18.3,18.2,18,17.8,17.7,17.5,17.3,17.2,17,16.8,16.7,16.5,16.3,16.2,16,15.8,15.7,15.5,15.3,15.2,15,14.8,14.7,14.5,14.3,14.2,14,13.8,13.7,13.5,13.3,13.1,12.9,12.7,12.5,12.4,12.2,12,11.8,11.5,11.3,11.1,10.9,10.7,10.5,10.3,10.1,9.9,9.6,9.4,9.2,8.9,8.6,8.3,7.9,7.5,7,6.4,5.6,4.5,3.3].reverse(),
									p75 : [20.1, 19.9, 19.7, 19.5, 19.3, 19.2, 19, 18.8, 18.6, 18.4, 18.2, 18, 17.8, 17.6, 17.4, 17.3, 17.1, 16.9, 16.7, 16.5, 16.3, 16.1, 15.9, 15.8, 15.6, 15.4, 15.2, 15, 14.8, 14.6, 14.4, 14.2, 14, 13.8, 13.6, 13.3, 13.1, 12.9, 12.7, 12.5, 12.2, 12, 11.8, 11.6, 11.3, 11.1, 10.9, 10.6, 10.4, 10.1, 9.9, 9.6, 9.3, 8.9, 8.5, 8.1, 7.6, 6.9, 6, 4.9, 3.7].reverse(),
									p85 : [21.1,20.9,20.7,20.5,20.3,20.1,19.9,19.7,19.5,19.3,19.1,18.9,18.7,18.5,18.3,18.1,17.9,17.7,17.5,17.3,17.1,16.9,16.7,16.5,16.3,16.1,15.9,15.7,15.5,15.2,15,14.8,14.6,14.4,14.1,13.9,13.7,13.4,13.2,13,12.7,12.5,12.3,12,11.8,11.6,11.3,11.1,10.8,10.5,10.3,10,9.6,9.3,8.9,8.4,7.9,7.2,6.3,5.1,3.9].reverse(),
									p90 : [21.9, 21.6, 21.4, 21.2, 21, 20.8, 20.6, 20.3, 20.1, 19.9, 19.7, 19.5, 19.3, 19.1, 18.9, 18.6, 18.4, 18.2, 18, 17.8, 17.6, 17.4, 17.2, 17, 16.8, 16.6, 16.3, 16.1, 15.9, 15.7, 15.5, 15.2, 15, 14.8, 14.6, 14.3, 14.1, 13.8, 13.6, 13.3, 13.1, 12.9, 12.6, 12.4, 12.1, 11.9, 11.6, 11.4, 11.1, 10.8, 10.5, 10.2, 9.9, 9.5, 9.1, 8.6, 8.1, 7.4, 6.5, 5.3, 4].reverse(),
									p95 : [23,22.8,22.5,22.3,22.1,21.8,21.6,21.4,21.1,20.9,20.7,20.4,20.2,20,19.8,19.5,19.3,19.1,18.9,18.6,18.4,18.2,18,17.8,17.5,17.3,17.1,16.9,16.6,16.4,16.2,15.9,15.7,15.4,15.2,14.9,14.7,14.4,14.2,13.9,13.6,13.4,13.1,12.9,12.6,12.3,12.1,11.8,11.5,11.2,10.9,10.6,10.3,9.9,9.5,9,8.4,7.7,6.8,5.5,4.2].reverse(),
									p97 : [23.8, 23.5, 23.3, 23, 22.8, 22.5, 22.3, 22.1, 21.8, 21.6, 21.3, 21.1, 20.9, 20.6, 20.4, 20.1, 19.9, 19.7, 19.4, 19.2, 19, 18.7, 18.5, 18.3, 18, 17.8, 17.6, 17.3, 17.1, 16.9, 16.6, 16.4, 16.1, 15.9, 15.6, 15.3, 15.1, 14.8, 14.5, 14.3, 14, 13.7, 13.5, 13.2, 12.9, 12.7, 12.4, 12.1, 11.8, 11.5, 11.2, 10.9, 10.5, 10.2, 9.7, 9.2, 8.6, 7.9, 7, 5.7, 4.3].reverse(),
									p99 : [25.3, 25, 24.8, 24.5, 24.2, 24, 23.7, 23.4, 23.2, 22.9, 22.6, 22.4, 22.1, 21.9, 21.6, 21.3, 21.1, 20.8, 20.6, 20.3, 20.1, 19.8, 19.6, 19.3, 19.1, 18.8, 18.6, 18.3, 18, 17.8, 17.5, 17.3, 17, 16.7, 16.4, 16.1, 15.9, 15.6, 15.3, 15, 14.7, 14.4, 14.2, 13.9, 13.6, 13.3, 13, 12.7, 12.4, 12.1, 11.8, 11.4, 11.1, 10.7, 10.2, 9.7, 9.1, 8.3, 7.4, 6, 4.6].reverse(),
									p999 : [5.1,6.6,8.1,9.1,9.8,10.5,11.1,11.5,12,12.4,12.8,13.1,13.5,13.8,14.1,14.5,14.8,15.1,15.4,15.7,16,16.4,16.7,17,17.3,17.6,18,18.3,18.6,18.9,19.2,19.5,19.8,20.1,20.4,20.7,21,21.2,21.5,21.8,22.1,22.4,22.7,23,23.3,23.6,23.9,24.2,24.5,24.8,25.1,25.4,25.7,26,26.3,26.6,27,27.3,27.6,27.9,28.2]
								},
								girlZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [2,2.7,3.4,4,4.4,4.8,5.1,5.3,5.6,5.8,5.9,6.1,6.3,6.4,6.6,6.7,6.9,7,7.2,7.3,7.5,7.6,7.8,7.9,8.1,8.2,8.4,8.5,8.6,8.8,8.9,9,9.1,9.3,9.4,9.5,9.6,9.7,9.8,9.9,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,11,11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12,12.1],
									//SD 2 Neg
									p5 : [2.4,3.2,3.9,4.5,5,5.4,5.7,6,6.3,6.5,6.7,6.9,7,7.2,7.4,7.6,7.7,7.9,8.1,8.2,8.4,8.6,8.7,8.9,9,9.2,9.4,9.5,9.7,9.8,10,10.1,10.3,10.4,10.5,10.7,10.8,10.9,11.1,11.2,11.3,11.5,11.6,11.7,11.8,12,12.1,12.2,12.3,12.4,12.6,12.7,12.8,12.9,13,13.2,13.3,13.4,13.5,13.6,13.7],
									//SD 1 Neg
									p15 : [2.8,3.6,4.5,5.2,5.7,6.1,6.5,6.8,7,7.3,7.5,7.7,7.9,8.1,8.3,8.5,8.7,8.9,9.1,9.2,9.4,9.6,9.8,10,10.2,10.3,10.5,10.7,10.9,11.1,11.2,11.4,11.6,11.7,11.9,12,12.2,12.4,12.5,12.7,12.8,13,13.1,13.3,13.4,13.6,13.7,13.9,14,14.2,14.3,14.5,14.6,14.8,14.9,15.1,15.2,15.3,15.5,15.6,15.8],
									//SD 0
									p50 : [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.9,11.1,11.3,11.5,11.7,11.9,12.1,12.3,12.5,12.7,12.9,13.1,13.3,13.5,13.7,13.9,14,14.2,14.4,14.6,14.8,15,15.2,15.3,15.5,15.7,15.9,16.1,16.3,16.4,16.6,16.8,17,17.2,17.3,17.5,17.7,17.9,18,18.2],
									//SD 1
									p85 : [3.7,4.8,5.8,6.6,7.3,7.8,8.2,8.6,9,9.3,9.6,9.9,10.1,10.4,10.6,10.9,11.1,11.4,11.6,11.8,12.1,12.3,12.5,12.8,13,13.3,13.5,13.7,14,14.2,14.4,14.7,14.9,15.1,15.4,15.6,15.8,16,16.3,16.5,16.7,16.9,17.2,17.4,17.6,17.8,18.1,18.3,18.5,18.8,19,19.2,19.4,19.7,19.9,20.1,20.3,20.6,20.8,21,21.2],
									//SD 2
									p95 : [4.2,5.5,6.6,7.5,8.2,8.8,9.3,9.8,10.2,10.5,10.9,11.2,11.5,11.8,12.1,12.4,12.6,12.9,13.2,13.5,13.7,14,14.3,14.6,14.8,15.1,15.4,15.7,16,16.2,16.5,16.8,17.1,17.3,17.6,17.9,18.1,18.4,18.7,19,19.2,19.5,19.8,20.1,20.4,20.7,20.9,21.2,21.5,21.8,22.1,22.4,22.6,22.9,23.2,23.5,23.8,24.1,24.4,24.6,24.9],
									//SD 3
									p99 : [4.8,6.2,7.5,8.5,9.3,10,10.6,11.1,11.6,12,12.4,12.8,13.1,13.5,13.8,14.1,14.5,14.8,15.1,15.4,15.7,16,16.4,16.7,17,17.3,17.7,18,18.3,18.7,19,19.3,19.6,20,20.3,20.6,20.9,21.3,21.6,22,22.3,22.7,23,23.4,23.7,24.1,24.5,24.8,25.2,25.5,25.9,26.3,26.6,27,27.4,27.7,28.1,28.5,28.8,29.2,29.5]
								},
								boyZscore : {
									labels : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( count );
										}  
										
										return temp.reverse();
										
									}(),
									pUser : function(){
										let count = 61,
										temp = [];
										
										while( count-- ){
											temp.push( null );
										}  
										
										return temp.reverse();
										
									}(),
									//SD 3 Neg
									p1 : [2.1,2.9,3.8,4.4,4.9,5.3,5.7,5.9,6.2,6.4,6.6,6.8,6.9,7.1,7.2,7.4,7.5,7.7,7.8,8,8.1,8.2,8.4,8.5,8.6,8.8,8.9,9,9.1,9.2,9.4,9.5,9.6,9.7,9.8,9.9,10,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,11,11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12,12.1,12.2,12.3,12.4],
									//SD 2 Neg
									p5 : [2.5,3.4,4.3,5,5.6,6,6.4,6.7,6.9,7.1,7.4,7.6,7.7,7.9,8.1,8.3,8.4,8.6,8.8,8.9,9.1,9.2,9.4,9.5,9.7,9.8,10,10.1,10.2,10.4,10.5,10.7,10.8,10.9,11,11.2,11.3,11.4,11.5,11.6,11.8,11.9,12,12.1,12.2,12.4,12.5,12.6,12.7,12.8,12.9,13.1,13.2,13.3,13.4,13.5,13.6,13.7,13.8,14,14.1],
									//SD 1 Neg
									p15 : [2.9,3.9,4.9,5.7,6.2,6.7,7.1,7.4,7.7,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.1,10.3,10.5,10.7,10.8,11,11.2,11.3,11.5,11.7,11.8,12,12.1,12.3,12.4,12.6,12.7,12.9,13,13.1,13.3,13.4,13.6,13.7,13.8,14,14.1,14.3,14.4,14.5,14.7,14.8,15,15.1,15.2,15.4,15.5,15.6,15.8,15.9,16],
									//SD 0
									p50 : [3.3,4.5,5.6,6.4,7,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.8,12,12.2,12.4,12.5,12.7,12.9,13.1,13.3,13.5,13.7,13.8,14,14.2,14.3,14.5,14.7,14.8,15,15.2,15.3,15.5,15.7,15.8,16,16.2,16.3,16.5,16.7,16.8,17,17.2,17.3,17.5,17.7,17.8,18,18.2,18.3],
									//SD 1
									p85 : [3.9,5.1,6.3,7.2,7.8,8.4,8.8,9.2,9.6,9.9,10.2,10.5,10.8,11,11.3,11.5,11.7,12,12.2,12.5,12.7,12.9,13.2,13.4,13.6,13.9,14.1,14.3,14.5,14.8,15,15.2,15.4,15.6,15.8,16,16.2,16.4,16.6,16.8,17,17.2,17.4,17.6,17.8,18,18.2,18.4,18.6,18.8,19,19.2,19.4,19.6,19.8,20,20.2,20.4,20.6,20.8,21],
									//SD 2
									p95 : [4.4,5.8,7.1,8,8.7,9.3,9.8,10.3,10.7,11,11.4,11.7,12,12.3,12.6,12.8,13.1,13.4,13.7,13.9,14.2,14.5,14.7,15,15.3,15.5,15.8,16.1,16.3,16.6,16.9,17.1,17.4,17.6,17.8,18.1,18.3,18.6,18.8,19,19.3,19.5,19.7,20,20.2,20.5,20.7,20.9,21.2,21.4,21.7,21.9,22.2,22.4,22.7,22.9,23.2,23.4,23.7,23.9,24.2],
									//SD 3
									p99 : [5,6.6,8,9,9.7,10.4,10.9,11.4,11.9,12.3,12.7,13,13.3,13.7,14,14.3,14.6,14.9,15.3,15.6,15.9,16.2,16.5,16.8,17.1,17.5,17.8,18.1,18.4,18.7,19,19.3,19.6,19.9,20.2,20.4,20.7,21,21.3,21.6,21.9,22.1,22.4,22.7,23,23.3,23.6,23.9,24.2,24.5,24.8,25.1,25.4,25.7,26,26.3,26.6,26.9,27.2,27.6,27.9]
								}
								
							},
							updateTextModal : function( objData ){
								 
								//birth date
								scope.text( scope.qs("tgl-wfa"), scope.dateToYMD( objData.birthDateStart, "year" ) );	
								
								//total month
								scope.text( scope.qs("mth-wfa"), objData.birthNowTotalMonth );							
								
								//birth to date now
								scope.text( scope.qs("tgl-now-wfa"),  scope.dateToYMD( objData.birthNowToMonth, "year" ) );
								
								scope.text( scope.qs("wfa-switch-graph"), ( this.isZscore ? "Grafik : Z-Score" : "Grafik : Persentil" ) );
								 
								return objData.birthNowTotalMonth;
							},
							create : function(){
								  
								//set data
								let objData = obj.chart.dateBaby();
								 
								this.data.ageInMonth = objData.birthNowTotalMonth; 
								
								this.color = obj.chart.generateRandomColor();
								
								obj.chart.convertDataStorageToPuser( this.data,"wfa", this.isZscore  );
								 
								let params = obj.chart.generateChart( this, this.isZscore ),
								wfaWrapper = scope.qs("wfa-wrapper"),
								ctxBound = scope.id('canvas-wfa').getBoundingClientRect();
								  
								  
								//update data modal
								this.updateTextModal( objData );
								 
								scope.text(scope.qs("month-wf-age"), params.data.labels[0]+' / '+ params.data.labels[ params.data.labels.length - 1 ]);
								
								scope.text(scope.qs("gender-wf-age"), params.gender )
								  
								//weight for age wfaWrapper
								
								//wf-age-wfaWrapper
								scope.css( wfaWrapper,{
									"top": "0px"
								})

							},
							init : function( objectInitial ){ 
								//obj.dataStorage
								let self = this,
								main = scope.qs("wfa-wrapper"),
								container = main.querySelector(".content-data"),
								containerEmpty = main.querySelector(".content-empty"),
								data = obj.storageFilter( obj.dataStorage.wfa ),
								dataEmpty = true,
								contentDom = function( params ){
									let fragment = scope.stringToHtml5Template(
										'<div class="notify-box-small"> ' +
										'	<div class="bubble-box weight-icon"> ' +
										'		<div class="notify-strip-b"></div> ' +
										'	</div> ' +
										'	<abbr> '+ parseFloat( params.weight ).toFixed(2) +' Kg </abbr> ' +
										'	<abbr class="inbeetween extrabold">  '+ params.strWeight +' Kg </abbr> ' +
										'		<ins> ' +
										'			<span class="notify-small-title extrabold"> Rekaman bulan ke '+ params.monthTo +'</span> ' +
										'			<br> ' +
										'			<span class="notify-small-detail light"> '+ 
										' 				<label class="'+ params.resultColor +'">'+ params.resultText +'</label>'+ 
										' 					Z-Score '+ params.resultVal +
										'			</span> ' +
										'		</ins> ' +
										'	<div class="bubble-small-left" label="'+ params.id+'" gizi="'+ params.resultText +'" zscore="'+ params.resultVal +'"></div> ' +
										'</div> '
									);
									
									container.appendChild( fragment )
								},
								dataNoteFn = function( dataNote, index ){
								
									if( dataNote.babyId === dataBaby.id ){
										
										if( obj.loadMore.marker( "weightForAge", main, dataNote, index ) ){
												
											let dateSelect = scope.dateToYMD( scope.stringToDate( dataNote.dateSelect ), "year" ),
											dateStart = scope.dateToYMD( scope.stringToDate( dataNote.dateStart ), "year" ),
											  
											dateNext = data[ index + 1 ] ? data[ index + 1 ].weight : 0,
											
											deductWeight = ( dataNote.weight - dateNext ).toFixed(2),
											strWeight = deductWeight > 0 ? '+'+deductWeight : deductWeight < 0 ?  deductWeight : 0;
											 
											let zscore = fn.zScoreFn({
												value : parseFloat( dataNote.weight ),
												data : self.data,
												valueFor : "wfa",
												gender : dataBaby.gender,
												month : parseInt( dataNote.monthTo ) 
											})
											  
											contentDom({
												dateSelect : dateSelect,
												dateStart : dateStart,
												id : dataNote.id,
												weight : dataNote.weight,
												monthTo : dataNote.monthTo,
												strWeight : strWeight,
												resultVal : zscore.resultVal,
												resultText :zscore.resultText,
												resultColor :zscore.resultColor
											}); 
											
										}
										
										dataEmpty = false;
									}
								};
								
								this.isZscore = obj.dataStorage.layoutState.wfaSwitch;
								 
								 //short ascending
								data.sort(function(a, b){
					
									return b.monthTo - a.monthTo;
									
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
								let trackerBtns = scope.slice( scope.qs("wfa-wrapper").querySelectorAll(".bubble-small-left") );
								
								trackerBtns.map(function( btnTracker, index ){
									
									scope.attachListener( btnTracker, 'click', function(){
										  
										let self = this;
										  
										//set label confirm button
										obj.storageCrud({
											type : "select",
											dataStorage : "wfa",
											noUpdateFileSource : true,
											id : this.getAttribute("label")
										},
										function( data ){
												 
											//modal detail
											scope.text([scope.qs("wfa-detail-type"), scope.qs("wfa-confirm-type")], "Ke "+data.monthTo );
											scope.text([scope.qs("wfa-detail-weight"), scope.qs("wfa-confirm-weight")], data.weight+' Kg' );
											scope.text([scope.qs("wfa-detail-recorded"), scope.qs("wfa-confirm-recorded")], scope.dateToYMD( scope.stringToDate( data.dateSelect ), "year" ) );
											scope.text([scope.qs("wfa-detail-datecreate"), scope.qs("wfa-confirm-datecreate")], scope.dateToYMD( scope.stringToDate( data.dateStart ), "year" ) );
											scope.text([scope.qs("wfa-detail-gizi"), scope.qs("wfa-confirm-gizi")], self.getAttribute("gizi") );
											scope.text([scope.qs("wfa-detail-zscore"), scope.qs("wfa-confirm-zscore")], self.getAttribute("zscore") );
											
											scope.qs("modal-wfa-confirm").querySelector(".send-button").setAttribute( "label", data.id )
											 
											obj.modal.behaviour.openFadeIn("modal-wfa-detail");	
								    
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
									
										if( self.data.ageInMonth <= 5 ) self.data.ageInMonth = 6;
										self.data.ageInMonth += 1;
										
										dir =  "right";
									}else if(  self.data.ageInMonth > 5 ){
										
										if( self.data.ageInMonth >= 55 ) self.data.ageInMonth = 55;
										self.data.ageInMonth -= 1;
										
										dir =  "left";
									}
								  
									if( self.data.ageInMonth > 0 && self.data.ageInMonth < 60 ){
									
										let data =  obj.chart.generateData(  self.data, self.isZscore ),
										dataset = self.isZscore ? [ data.pUser,data.p1,data.p5,data.p15,data.p50,data.p85,data.p95,data.p99] :
										[ data.pUser,data.p01,data.p1,data.p3,data.p5,data.p10,data.p15,data.p25,data.p50,data.p75,data.p85,data.p90,data.p95,data.p97,data.p99,data.p999];
										  
										scope.text(scope.qs("month-wf-age"), data.labels[0]+' / '+data.labels[ data.labels.length - 1 ])
								 
										obj.chart.updateChart( self.chartObj, data.labels, dataset, dir );
							
									}
								})
							}
						} 
					},
					reupdateData : function(){
						 
						this.main.screening();
						
						this.main.tracker();
						
						this.main.memo();
						
						this.main.resume();
						
						this.main.remainder();
						
						this.main.wonderWeeks();
						
						this.modal.babyList.init();
						
						this.chart.weightForAge.init();
						
						this.chart.bmiForAge.init();
						
						this.chart.armForAge.init();
						
						this.chart.hcForAge.init();
						
						this.chart.lhForAge.init();
						
						if( !/hidden/i.test( scope.qs("tab-d").className ) ){
							
							this.chart.weightForAge.create();
							
							this.chart.bmiForAge.create();
							
							this.chart.armForAge.create();
							
							this.chart.hcForAge.create();
							
							this.chart.lhForAge.create();
						
						}
					},
					noBabyinStorage : function(){
						
						let body = document.getElementsByTagName("body")[0];
						
						if( !obj.dataStorage.babiesData.length ){
							 
							scope.addClass( scope.qs("modal-baby-new").querySelector(".left"), "hidden" );
							  
							obj.modal.behaviour.openFadeIn("modal-baby-new");	
								     
							return true
						}else{
								 
							return false;
						}
					}
				
				}
				
				//let reverseIdBanner = "ca-app-pub-2736357291185199/7101101642".split("").reverse();
				//console.log( reverseIdBanner )
				//console.log( reverseIdBanner.reverse().join("") )
				
				
				//localStorage.removeItem('dataStorage') 
				//console.log(  JSON.parse( localStorage.getItem( 'dataStorage' ) ) );
				//console.log( scope.JSONstringfy( JSON.parse( localStorage.getItem( 'dataStorage' ) ) ) );
				 
				obj.storage(function(){
					  
					  
					//execute layout
					obj.layout();
  
					obj.appConfig.mobile();
					 
					obj.cordova.appPlugin(); 
					 
					obj.cordova.backButton(); 
					 
					//let html content-collapse first
					obj.generateExpandCollapse(); 
					 
					obj.cordova.backButton(); 
					 
					obj.header();
					
					obj.loadMore.init();
					
					obj.noBabyinStorage();
					
					obj.main.memo();
					
					obj.main.remainder();
					
					obj.main.tracker();
					 
					obj.main.vaccine.init();
					  
					obj.main.resume();
					
					obj.main.screening();
					
					obj.main.wonderWeeks();
					
					
					
					obj.footer();
					
					
					obj.modalInput.init();
					
					
					obj.modalMenu.menuRestore();
					
					
					obj.modal.backupAndRestore();
					
					
					obj.modal.charityList();
					
					
					obj.modal.screeningDetail.init();
					 
					obj.modal.screeningRecord.init();
					
					obj.modal.screeningRecordDetail.init();
					
					obj.modal.screeningIntepreter();
					
					obj.modal.screeningIntervensi();
					
					
					
					obj.modal.vaccineList();
					
					obj.modal.vaccineNew();
					
					obj.modal.vaccineAdd();
					 
					obj.modal.vaccineDetail();
					
					obj.modal.vaccineRecordDetail.init();
					
					obj.modal.vaccineRecordConfirm();
					
					
					obj.modal.appList.init();
					
					obj.modal.appRate();
					
					obj.modal.othersList.init();
					
					obj.modal.FaqList();
					 
					
					obj.modal.avatar.init();
					
					
					obj.modal.babyNew.init();
					
					obj.modal.babyList.init();
					
					obj.modal.babyDetail.init();
					
					obj.modal.babyConfirm.init();
					
					obj.modalMenu.menuGenderBaby();
					
					obj.modalMenu.menuRelativeBaby();
					
					
					obj.modal.wonderWeeksFaq();
					
					obj.modalMenu.menuLeapOptions(); 
					
					
					obj.modal.triggerModals(); 
					
					obj.modalMenu.triggerModalMenus(); 
					 
					  
					obj.modal.trackerCategoryNew()  
					  
					obj.modal.trackerNew.init();
					
					obj.modal.trackerDetail();
					
					obj.modal.trackerDeleteConfirm(); 
					
					obj.modal.trackerChart();
					
					obj.modalMenu.trackerAlert();
					
					obj.modalMenu.menuTrackerActivity();
					
					obj.modalMenu.menuTrackerRange();
					 
					  
					obj.modal.graphFaq();
					   
					  
					obj.chart.armForAge.init(); 
					 
					obj.chart.armForAge.event();
					 
					obj.modal.afaNew(); 
					 
					obj.modalMenu.menuAfa();
					
					obj.modal.afaDetail.init();
					
					obj.modal.afaDeleteConfirm.init();

					
					
					obj.chart.lhForAge.init();
					
					obj.chart.lhForAge.event();
					
					obj.modal.lhfaNew();
					
					obj.modalMenu.menuLhfa();
					
					obj.modal.lhfaDetail.init();
					
					obj.modal.lhfaDeleteConfirm.init();
					
					  
					
					obj.chart.weightForAge.init();
					
					obj.chart.weightForAge.event();
					
					obj.modal.wfageNew();  
					
					obj.modal.wfageDetail.init();
					
					obj.modal.wfageDeleteConfirm.init();
					
					obj.modalMenu.menuWfa();
					
					obj.modalMenu.menuSwitchGraph();
					
					
					obj.modal.bmiageDetail.init();
					
					obj.modal.bmiageDeleteConfirm.init();
					
					obj.chart.bmiForAge.init();
					
					obj.chart.bmiForAge.event();
					
					obj.modal.bmiageNew();
					
					obj.modalMenu.menuBmi();
					 
					 
					obj.modal.hcageDetail.init();
					
					obj.modal.hcageDeleteConfirm.init();
					
					obj.chart.hcForAge.init();
					
					obj.chart.hcForAge.event();
					
					obj.modal.hcageNew();
					
					obj.modalMenu.menuHc();
					 
					
					
					obj.modal.memoNew();
					
					obj.modal.memoPreview.init(); 
					 
					
					obj.modalMenu.menuMemo();
				
					
					obj.modal.remainderNew(); 
					
					obj.modal.remainderDetail();
					
					obj.modal.remainderDeleteConfirm();
					
					obj.modalMenu.menuRemainder();
					
					obj.generateDatePluginElement();
					
					obj.modalMenu.menuError.init()
					
					obj.dropdown.init();
					 
					obj.appConfig.badgeHeader();
					
					obj.appConfig.color();
					 
					obj.appConfig.ads.init();
					
					obj.appConfig.iap.iapUIstatus();
					
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
  
