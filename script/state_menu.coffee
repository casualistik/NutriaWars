
stateclass["state_menu"] = class StateMenu extends State
  constructor: (@parent) ->
    
    console.log "Init Menu State"
    console.log "width: #{@parent.width} -- height: #{@parent.height}" 

    @camera = new Camera {"projection": "normal", "vpWidth": @parent.width, "vpHeight": @parent.height}
    @camera.coor = new Vector(0,  0)
    
    @nutrias = []
    for i in [0..10]
      @nutrias[i] = new Nutria
      @nutrias[i].isAlive = true
      #@nutrias[i].reset(new Vector(@parent.width/2,  @parent.height/2))

    
    
    
    # Wieso kein @ ????????????????????????
    
    # backgroundsprite.coor = new Vector(@parent.width/2, @parent.height/2)
    # Was ist Background ????????????????????????
    
    
    @background = new CustomBackground "assets/images/bg-menu.png", @parent.width, @parent.height
    
    
    
  update: (delta) ->
   # @background.update(delta)
    for nutria in @nutrias
      nutria.update delta
    
    if @parent.keyboard.key("space") 
      console.log("Space pressed")
      @parent.stateManager.setState "state_play"
     
    
  render: (ctx) ->
    @camera.apply ctx, =>
      for nutria in @nutrias
        nutria.render ctx
      @background.render(ctx)
      

    