
stateclass["state_game_over"] = class StateGameOver extends State
  constructor: (@parent) ->
    
    console.log "Construct StateGameOver"
    console.log "width: #{@parent.width} -- height: #{@parent.height}" 

    @camera = new Camera {"projection": "normal", "vpWidth": @parent.width, "vpHeight": @parent.height}
    @camera.coor = new Vector(0,  0)
    
    @enemies = []
    for i in [0..10]
      @enemies[i] = new Enemy
      @enemies[i].isAlive = true

    @background = new CustomBackground "assets/images/game-over.png", @parent.width, @parent.height
    
    
    
  update: (delta) ->
   # @background.update(delta)
    for enemy in @enemies
      enemy.update delta
    
    if @parent.keyboard.key("space") 
      @destroy("state_play")
     
    
  render: (ctx) ->
    @camera.apply ctx, =>
      for enemy in @enemies
        enemy.render ctx
      @background.render(ctx)
  
  destroy: (nextState) ->
    for enemy in @enemies
      enemy.kill()
    
    @parent.stateManager.setState nextState

    