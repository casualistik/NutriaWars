

class Bullet

  constructor: () ->
    @state = "normal"
    @sprite = new Sprite
      "texture": "assets/images/bullet.png"
      "width": 25
      "height": 25
      "key":
        "normal": 0
    
    @coor = new Vector(0,0)
    @angle = 0
    @speed = 0.5
    @direction = new Vector(0,0)
    @isAlive = false
    @lifeTime = @speed*1000
    @lifeDelay = @lifeTime
    
  shoot: (startCoor, aimDirection, aimAngle) ->
    @coor = startCoor
    @direction = aimDirection
    @angle = aimAngle
    @lifeDelay =  @lifeTime
    @revive()
    
  update: (delta) ->
    if @isAlive
      newDist = delta*@speed
      @coor = @coor.add(@direction.mult(newDist))
      if @lifeDelay > 0
        @lifeDelay -= delta
      if @lifeDelay <= 0
        @kill()
        
  render: (ctx) ->
    if @isAlive
     ctx.save()
     ctx.translate @coor.x, @coor.y
     ctx.rotate @angle * Math.PI / 180
     @sprite.render( @state, ctx )
     ctx.restore()
    
  revive: ->
    @isAlive = true
    
  kill: ->
    @isAlive = false

        