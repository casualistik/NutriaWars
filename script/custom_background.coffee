

class CustomBackground
  constructor:(@image, @myWidth=640, @myHeight=480) ->
    @state = "normal"
    console.log("CustomBackground  #{this} #{@image} #{@myWidth} #{@myHeight} " )
    @sprite = new Sprite
      "texture": @image
      "width": @myWidth
      "height": @myHeight
      "key":
        "normal": 0

    @coor = new Vector( @myWidth/2, @myHeight/2 )

  update: (delta) ->
    

  render: (ctx) ->
    ctx.save()
    ctx.translate @coor.x, @coor.y
    @sprite.render( @state, ctx )
    ctx.restore()



