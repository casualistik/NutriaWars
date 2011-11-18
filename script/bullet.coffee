

class Bullet

  constructor: (@eventmanager, @keyboard) ->
    @state = "normal"
    @sprite = new Sprite
      "texture": "assets/images/bullet.png"
      "width": 3
      "height": 3
      "key":
        "normal": 0
    
    @coor = new Vector( Math.random() * 640, Math.random() * 48 )
    @speed = new Vector( 0.1, 0.1 )

  update: (delta) ->
    @coor = @coor.add( @speed.mult delta )

    if @coor.x > 640
      @speed.x = @speed.x * -1
      @coor.x = 640
      @eventmanager.trigger "touchdown"
    if @coor.x < 0
      @speed.x = @speed.x * -1
      @coor.x = 0
    if @coor.y > 480
      @speed.y = @speed.y * -1
      @coor.y = 480
    if @coor.y < 0
      @speed.y = @speed.y * -1
      @coor.y = 0

  render: (ctx) ->
    ctx.save()
    ctx.translate @coor.x, @coor.y
    @sprite.render( @state, ctx )
    ctx.restore()
    
        