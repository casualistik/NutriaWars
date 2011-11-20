

class Spawner
  constructor: (@eventmanager, enemies) ->
    @enemies = enemies      
    @spawnDelay = 5*1000
    @spawnTime = @spawnDelay      
    @maxEnemies = 10
    
  


  update: (delta) ->
    @spawnTime -= delta
    if(@spawnTime <= 0)
      @spawn()
      @spawnTime = @spawnDelay

  render: (ctx) ->



