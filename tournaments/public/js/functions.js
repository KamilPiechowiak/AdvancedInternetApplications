function loadMatches(id) {
    const h = 100 //height
    const w = 300 //width
    const hs = 20 //vertical space between elements in the first layer
    const ws = 20 //horizontal space
    const matchesDict = {}
    const matchesContainer = $("#matches")

    const getPlayerName = (player) => {
        if(player) {
            return player.firstName+" "+player.lastName
        } else {
            return "None"
        }
    }

    const displayMatch = (match, i)=>{
        const div = $(document.createElement("div"))
        const top = ((2**match.layer-1)/2+2**match.layer*i)*(h+hs)
        const left = match.layer*(w+ws)
        div.addClass("matchContainer")
        div.css({
            top: `${top}px`,
            left: `${left}px`,
            width: `${w}px`,
            height: `${h}px`
        })
        const player1 = $(document.createElement("span"))
        player1.text(getPlayerName(match.player1))
        const player2 = $(document.createElement("span"))
        player2.text(getPlayerName(match.player2))
        const vs = $(document.createElement("span"))
        vs.text("vs")
        if(match.winnerBy1 == match.winnerBy2) {
            if(match.winnerBy1 == 1) {
                player1.addClass("winnerName")
            } else if(match.winnerBy1 == 2) {
                player2.addClass("winnerName")
            }
        }
        div.append(player1)
        div.append(vs)
        div.append(player2)
        matchesContainer.append(div)
        if(match.layer > 0) {
            displayMatch(matchesDict[match.previousMatch1Id], 2*i)
            displayMatch(matchesDict[match.previousMatch2Id], 2*i+1)
        }
    }
    
    $.getJSON(`/tournaments/matches/${id}`, matches => {
        for(match of matches) {
            matchesDict[match.id] = match
        }
        if(matches.length == 0) {
            matchesContainer.text("There are no matches yet")
            return
        }
        displayMatch(matches[0], 0)
        matchesContainer.css({
            width: `${(matches[0].layer+1)*(w+ws)}px`,
            height: `${2**matches[0].layer*(h+hs)}px`
        })
    })
}