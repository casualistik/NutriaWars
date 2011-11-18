
# Main Game Controller / Root entry point
# Adjustments you make here will affect your whole Game.


class NutriaWars extends Game
  
  constructor: (width, height) ->
    super width, height
    
    @eventmanager = new Eventmanager
    @keyboard = new Keyboard
    
    @stateManager = new Statemanager this, ["state_menu", "state_play", "state_game_over"] # Add your own Gamestates or Levels
    @stateManager.setState "state_menu" 
    
    
  update: ->
    super()
    @stateManager.currentState.update @timer.delta

  render: ->
    @ctx.clearRect 0, 0, @width, @height
    @stateManager.currentState.render @ctx
    super()
    
  
$ ->
  nutriaWars = new NutriaWars( 640, 480 )
  nutriaWars.start()
  console.log "Start NutriaWars "

  