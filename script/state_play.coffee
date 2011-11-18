
stateclass["state_play"] = class StatePlay extends State
  constructor: (@parent) ->
    
    console.log "Construct play state"
    @camera = new Camera {"projection": "normal", "vpWidth": @parent.width, "vpHeight": @parent.height}
    #@camera.coor = new Vector(0, 0)
    
    @hero = new Hero @parent.eventmanager, @parent.keyboard
    @hero.coor = new Vector( @parent.width/2, @parent.height/2 )
   
    @bullets = []
    for i in [0..20]
      @bullets[i] = new Bullet
      
    @nutrias = []
    for i in [0..10]
      @nutrias[i] = new Nutria
      @nutrias[i].isAlive = false
      @nutrias[i].state = "attack"
      
    @creatNutriaTime = 5*1000      
    @creatNutriaDelay = @creatNutriaTime
    
    
  createNutria: () ->
    console.log "Playstate createNutria"
    for nutria in @nutrias
      if !nutria.isAlive
        nutria.attack(@hero.coor)
        break

  
  update: (delta) ->
    @creatNutriaDelay -= delta
    if(@creatNutriaDelay <= 0)
      @createNutria()
      @creatNutriaDelay = @creatNutriaTime
    
    @hero.update(delta)
    for bullet in @bullets
      bullet.update delta
    
    for nutria in @nutrias
      dist = @hero.coor.subtract(nutria.coor).length()
      if(dist < 50)
        console.log "GAME OVER"
        for nutria in @nutrias
          nutria.isAlive = false
          nutria.coor = new Vector(0, 0)
        @parent.stateManager.setState "state_game_over"
          
        
      
      nutria.update delta
    
  render: (ctx) ->
    @camera.apply ctx, =>
      @hero.render(ctx)
      for bullet in @bullets
        bullet.render ctx
        
      for nutria in @nutrias
         nutria.render ctx
      
      ctx.fillStyle = '#00ff00';
      ctx.fillText('Use arrows to rotate and space to shoot', 20, 460 )
