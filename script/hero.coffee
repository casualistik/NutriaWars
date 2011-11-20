

class Hero
  constructor: (@eventmanager, @keyboard, @bullets) ->
    
    @state = "normal"
    @sprite = new Sprite
      "texture": "assets/images/hero.png"
      "width": 50
      "height": 50
      "key":
        "normal": 3
        "jumping": 5
    
    @coor = new Vector( 0, 0 )
    @angleSpeed = 0.2
    @angle = 0
    
    @attackTime = 1*1000
    @attackDelay = 0

  shootBullet: ->
    @attackDelay = @attackTime
    aimDirection = new Vector(Math.cos(@angle * Math.PI / 180), Math.sin(@angle * Math.PI / 180));
    for bullet in @bullets
     if !bullet.isAlive
       bullet.shoot(@coor, aimDirection)
       break

  update: (delta) ->
    # Delay to prevent hold on fire
    if @attackDelay > 0
      @attackDelay -= delta
    # shoot
    if @keyboard.key("space") and @attackDelay <= 0
      @shootBullet()
    # left/right movement
    if @keyboard.key("right")
      @angle = (@angle-delta*@angleSpeed)%360
      console.log "#{this} Right Angle:#{@angle}"
    else if @keyboard.key("left")
      @angle = (@angle+delta*@angleSpeed)%360
      console.log "#{this} LEFT Angle:#{@angle}"

  render: (ctx) ->
    ctx.save()
    ctx.translate @coor.x, @coor.y
    ctx.rotate @angle * Math.PI / 180
    @sprite.render( @state, ctx )
    ctx.restore()



