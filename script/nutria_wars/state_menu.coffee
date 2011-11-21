
stateclass["state_menu"] = class StateMenu extends State
  constructor: (@parent) ->
    console.log "StateMenu: constructor()"
    
    @camera = new Camera {"projection": "normal", "vpWidth": @parent.width, "vpHeight": @parent.height}
    @camera.coor = new Vector(0,  0)
    
    @enemies = []
    for i in [0..10]
      @enemies[i] = new Enemy
      @enemies[i].isAlive = true
    
    @background = new CustomBackground "assets/images/bg-menu.png", @parent.width, @parent.height

  update: (delta) ->
    for enemy in @enemies
      enemy.update delta
    
    if @parent.keyboard.key("x")
      console.log "StateMenu: update 'x pressed' #{@parent.stateManager.currentState}"
      @parent.stateManager.setState  "state_play"
     
    
  render: (ctx) ->
    @camera.apply ctx, =>
      for enemy in @enemies
        enemy.render ctx
      @background.render(ctx)
  
  
  destroy:->
    for enemy in @enemies
      enemy.kill()
  

    