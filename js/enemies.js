(function (game){
	
	game.mushroom = (function(layer, initalX){

					var mushroom = new collie.MovableObject({	
						x: initalX,
						width: 82,
						height: 100,
					    zIndex: 2,
						backgroundImage: "mushroom",
						velocityX: 0,
					}).bottom(50).addTo(layer);
					
					var mushroomBounce = collie.Timer.cycle(mushroom, "11fps",{from:0, to: 5, loop:0});
					
					return{
						set : function (options) { mushroom.set(options); },						
						get : function (options) { return mushroom.get(options); },					
					};			
				});
				
	game.enemies = (function(dimensions){
					
					var enemyLayer = new collie.Layer({
						width: dimensions.width,
						height: dimensions.height
					});
					
					var getNextSpwanPoints = function(){
						var spawnPoints = [];
						var numberOfEnemies = 5;
						var expandedWidth = dimensions.width * 3;
						var minimumSpawnPoint = dimensions.width + 30;
						var interval =expandedWidth/numberOfEnemies;
						for (var i=0;i<numberOfEnemies;i++)
						{ 							
							spawnPoints[i] = (interval * i) + minimumSpawnPoint;
						}	
						return spawnPoints;
					};
					
					var currentEnemies = [];
					
					$.each(getNextSpwanPoints(),function(index,value){
						currentEnemies[index] = new game.mushroom(enemyLayer,value);
					});
					
					var startMovingEnemies = function(){			
						$.each(currentEnemies,function(index,value){
							value.set({velocityX: -200});
						});
					};
					
					var stopMovingEnemies = function(){			
						$.each(currentEnemies,function(index,value){
							value.set({velocityX: 0});
						});
					};
					
					var isAtPosition = function(enemy, xPosition, yPosition){					
						var mushroomY = enemy.get('y');
						xPosition = xPosition + 65;						
						var playerHigherThanEnemy =	(yPosition + 165) < mushroomY;
						var enemyX = enemy.get("x");
						var enemyWidth = enemy.get("width");
						var farLeftMushroomBoundary = enemyX + (enemyWidth / 4);
						var farRightMushroomBoundary = enemyX + ((enemyWidth / 4) * 3)						
						var overlap = xPosition > farLeftMushroomBoundary && xPosition < farRightMushroomBoundary;
						return overlap && !playerHigherThanEnemy;
					};
					
					var isBehindPosition = function(enemy, xPosition){
						return enemy.get('x') < xPosition;
					}
												
					PubSub.subscribe('playerMovingRight', function(){startMovingEnemies();});
					PubSub.subscribe('playerNotMoving'  , function(){stopMovingEnemies();});
				
					return {		
						layer : function(){
							return enemyLayer;
						},
						
						anyAtPosition: function(xPosition,yPosition){
							for(var i = currentEnemies.length; i--; i === 0){
								var enemy = currentEnemies[i];
								if (isAtPosition(enemy, xPosition,yPosition)){
									return true;
								}
							}
							return false;
						},
						
						allBehindPosition: function(xPosition){
							var numberBehind = 0;
							for(var i = currentEnemies.length; i--; i === 0){
								var enemy = currentEnemies[i];
								if (isBehindPosition(enemy,xPosition)){
									numberBehind++;
								}
							}
							return numberBehind === currentEnemies.length;
						}
							
					};
				});

})(game);
