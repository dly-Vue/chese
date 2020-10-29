/**
 * @description 游戏准备好后
 * @author zegu
 */
function gameOk(data) {
    player.redCamp = data.redCamp
    player.current = data.current
    player.roomId = data.roomId

    //准备棋盘和棋子
    generatePieces(piecesList);
    if (!player.redCamp) {
        $("#board").css({
            transform: "rotateZ(180deg)",
        });
        $(".qi").css({
            transform: "rotateZ(180deg)",
        });
    }
    // 显示棋盘
    $("#board").show();
}

/**
 * @description 其他玩家移动时
 * @param {*} msg 
 * @author zegu
 */
function otherMove(data) {
    console.log('otherMove')

    let index = data.piece.id

    let piece = piecesList[index]
    let n_x = data.piece.position.x
    let n_y = data.piece.position.y
    console.log(piece)

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

        piece.DOM.css({
            top: a_y + 'px',
            left: a_x + 'px'
        })
    }
    player.current = true

    // callback()
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
        piece_onhand.DOM.css({
            top: a_y + 'px',
            left: a_x + 'px'
        })

        piece_byEat.DOM.hide()
        piece_byEat.survive = false
    }
    player.current = true
        // callback()
}