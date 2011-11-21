
stateclass["state_game_over"] = class StateGameOver extends State
  constructor: (@parent) ->
    console.log "StateGameOver: constructor()"
    
    @camera = new Camera {"projection": "normal", "vpWidth": @parent.width, "vpHeight": @parent.height}
    @camera.coor = new Vector(0,  0)
    
    @enemies = []
    for i in [0..5]
      @enemies[i] = new Enemy
      @enemies[i].isAlive = true
      
    @background = new CustomBackground "assets/images/game-over.png", @parent.width, @parent.height
    
  update: (delta) ->
   # @background.update(delta)
    for enemy in @enemies
      enemy.update delta
    
    if @parent.keyboard.key("x") 
      @parent.stateManager.setState  "state_play"
      
  render: (ctx) ->
    @camera.apply ctx, =>
      for enemy in @enemies
        enemy.render ctx
      @background.render(ctx)
  
  destroy: ->
    for enemy in @enemies
      enemy.kill()
    