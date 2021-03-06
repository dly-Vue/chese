/**
 * @description 游戏准备好后
 * @author zegu
 */



function gameOk(data) {
    player.redCamp = data.redCamp
    player.current = data.current
    player.roomId = data.roomId

    player.otherPlayers = {
        username: data.otherPlayers.username,
        userId: data.otherPlayers.userId,
        time: 0,
        steps: 0
    }

    //定时器开始记时
    if (player.redCamp) {
        player.userTimeInterval = setInterval(() => {
            $('.play2 .userTime span').eq(1).html(player.time++ + 's')
            if (player.time == 20) {
                $(".timeOut").animate({
                    "margin": "-20px 0 0 -75px"
                }, 1000).animate({
                    "margin": "-20px 0 0 -75px"
                }, 1500).animate({
                    "margin": "-80px 0 0 -75px"
                }, 1000);
            }
        }, 1000)
    } else {
        player.otherPlayers.userTimeInterval = setInterval(() => {
            $('.play1 .userTime span').eq(1).html(player.time++ + 's')
        }, 1000)
    }

    let danGrad = chessBit[parseInt(data.otherPlayers.score / 1000) % 6]
    $('.play1 .userRank span').eq(1).html(danGrad.bit)
    $('.play1 .userName span').eq(1).html(player.otherPlayers.username)
    $('.play1 .userStep span').eq(1).html(player.otherPlayers.steps)
    addPieces(); //棋子动画函
}

/**
 * @description 其他玩家移动时
 * @param {*} msg 
 * @author zegu
 */
function otherMove(data) {
    let index = data.piece.id
    let piece = piecesList[index]
    let n_x = data.piece.position.x
    let n_y = data.piece.position.y
    let checkRules = rulesChecker(piece, piece.position, {
        n_x,
        n_y
    })

    if (checkRules) {
        let {
            a_x,
            a_y
        } = getAbsolute(n_x, n_y)

        piece.position = {
            x: n_x,
            y: n_y
        }

        piece.DOM.animate({
            top: a_y + 'px',
            left: a_x + 'px'
        }, 500)
        showSound('../../music/xq.mp3')
        if (data.mark) {
            showSound('../../music/jj.mp3')
            jj()
            let tr = trappedDead()
            if (tr) {
                // alert('将死')
                failure()
            }
        }
        //步数加一
        player.otherPlayers.steps = player.otherPlayers.steps * 1 + 1
        $('.play1 .userStep span').eq(1).html(player.otherPlayers.steps)
    }

    player.current = true
    player.time = 0
    player.userTimeInterval = setInterval(() => {
        $('.play2 .userTime span').eq(1).html(player.time++ + 's')
        if (player.time == 20) {
            $(".timeOut").animate({
                "margin": "-20px 0 0 -75px"
            }, 1000).animate({
                "margin": "-20px 0 0 -75px"
            }, 1500).animate({
                "margin": "-80px 0 0 -75px"
            }, 1000);
        }
    }, 1000)
    clearInterval(player.otherPlayers.userTimeInterval)
}

/**
 * @description 其他玩家移动时
 * @param {*} msg 
 * @author zegu
 */
function otherEat(data) {
    console.log('otherEat')
    let piece_onhand = piecesList[data.piece.onHandId]
    let piece_byEat = piecesList[data.piece.byEatId]

    let checkRules = rulesChecker(piece_onhand, piece_onhand.position, {
        n_x: piece_byEat.position.x,
        n_y: piece_byEat.position.y
    })
    if (checkRules) {
        let {
            a_x,
            a_y
        } = getAbsolute(piece_byEat.position.x, piece_byEat.position.y)

        piece_onhand.position = {
            x: piece_byEat.position.x,
            y: piece_byEat.position.y
        }

        //移动子
        piece_onhand.DOM.animate({
            top: a_y + 'px',
            left: a_x + 'px'
        }, 500)

        piece_byEat.DOM.hide()
        piece_byEat.survive = false
        showSound('../../music/eat.mp3')
        if (data.mark) {
            showSound('../../music/jj.mp3')
            jj()
            let tr = trappedDead()
            if (tr) {
                // alert('将死')
                failure()
            }
        }

    }

    player.current = true
    player.time = 0
    player.userTimeInterval = setInterval(() => {
            $('.play2 .userTime span').eq(1).html(player.time++ + 's')
        }, 1000)
        //步数加一
    player.otherPlayers.steps = player.otherPlayers.steps * 1 + 1
    $('.play1 .userStep span').eq(1).html(player.otherPlayers.steps)
    clearInterval(player.otherPlayers.userTimeInterval)
}

/**
 * 重开 匹配
 */
function toMatch() {
    // alert('toMatch')
    $('#board').remove()
    $('.mid').append($(`
            <div class='chess' id='board'>
                    <!--棋子显示 -->
                    <div class="pieces">
                        <ul class="piecesImg">
                        </ul>
                    </div>
                </div>
    `))

    //匹配按钮浮现
    showSound("../../music/clickOn.mp3");
    $(".login").css({
        "left": "-200%"
    });
    $(".gameStar").css({
        "left": "0"
    });


    piecesList = []
    piecesListBack.forEach(Element => {
        piecesList.push({
            id: Element.id,
            piecesType: Element.piecesType,
            position: {
                x: Element.position.x,
                y: Element.position.y
            }
        })
    })

    player.time = 0
    player.otherPlayers.time = 0
    clearInterval(player.userTimeInterval)
    clearInterval(player.otherPlayers.userTimeInterval)
    $('.play1 .userTime span').eq(1).html(0 + 's')
    $('.play2 .userTime span').eq(1).html(0 + 's')

    player.otherPlayers.steps = 0
    player.steps = 0
    $('.play1 .userStep span').eq(1).html(0)
    $('.play2 .userStep span').eq(1).html(0)

    //断开ws连接
    player.ws.close()

}