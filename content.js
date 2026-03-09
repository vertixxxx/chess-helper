console.log("Chess Book Assistant has successfully loaded!");

let previousMoveCount = -1;

function getMoves() {
    const moveElements = document.querySelectorAll('.main-line-ply');
    let moves = [];
    
    moveElements.forEach(element => {
        let pieceLetter = "";
        const figurine = element.querySelector('[data-figurine]');
        if (figurine) pieceLetter = figurine.getAttribute('data-figurine');
        
        let rawText = element.innerText.trim();
        rawText = rawText.replace(/^[0-9]+\.+/g, '').trim();
        
        let finalMove = rawText;
        if (pieceLetter && !rawText.startsWith(pieceLetter)) {
            finalMove = pieceLetter + rawText;
        }
        
        if (finalMove && finalMove !== "") moves.push(finalMove);
    });
    return moves;
}

function drawArrow(uciMove) {
    console.log(`Attempting to draw arrow for UCI: ${uciMove}`);
    
  
    const board = document.querySelector('chess-board, wc-chess-board, #board-single, .board');
    
    if (!board) {
        console.error("ERROR: Could not find the chess board element on the page!");
        return;
    }

    const rect = board.getBoundingClientRect();
    if (rect.width === 0) {
        console.error("ERROR: Board found, but width is 0 (it might be hidden)!");
        return;
    }

    console.log(`📏 Board found! Size: ${rect.width}x${rect.height}`);

    const oldArrow = document.getElementById('book-move-arrow');
    if (oldArrow) oldArrow.remove();

    const sqSize = rect.width / 8;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fromFile = files.indexOf(uciMove[0]);
    const fromRank = parseInt(uciMove[1]);
    const toFile = files.indexOf(uciMove[2]);
    const toRank = parseInt(uciMove[3]);

    const isFlipped = board.classList.contains('flipped') || document.querySelector('.flipped');

    const fromX = rect.left + ((isFlipped ? 7 - fromFile : fromFile) * sqSize + (sqSize / 2));
    const fromY = rect.top + ((isFlipped ? fromRank - 1 : 8 - fromRank) * sqSize + (sqSize / 2));
    const toX = rect.left + ((isFlipped ? 7 - toFile : toFile) * sqSize + (sqSize / 2));
    const toY = rect.top + ((isFlipped ? toRank - 1 : 8 - toRank) * sqSize + (sqSize / 2));

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("id", "book-move-arrow");
    
    svg.style.position = "fixed";
    svg.style.top = "0px";
    svg.style.left = "0px";
    svg.style.width = "100vw";
    svg.style.height = "100vh";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "2147483647"; 

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "4");
    marker.setAttribute("markerHeight", "4");
    marker.setAttribute("refX", "2.5");
    marker.setAttribute("refY", "2");
    marker.setAttribute("orient", "auto");
    const polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttribute("points", "0 0, 4 2, 0 4");
    polygon.setAttribute("fill", "rgba(0, 200, 0, 0.9)"); 
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", fromX);
    line.setAttribute("y1", fromY);
    line.setAttribute("x2", toX);
    line.setAttribute("y2", toY);
    line.setAttribute("stroke", "rgba(0, 200, 0, 0.9)");
    line.setAttribute("stroke-width", Math.max(sqSize * 0.15, 8)); 
    line.setAttribute("marker-end", "url(#arrowhead)");
    
    svg.appendChild(line);
    document.documentElement.appendChild(svg);
    
    console.log("ARROW DRAWN ON SCREEN!");
}
function fetchBookMove(moves) {
    const chess = new Chess();
    for (let i = 0; i < moves.length; i++) {
        const result = chess.move(moves[i]);
        if (!result) return console.error(`chess.js could not understand move: ${moves[i]}`);
    }
    
    const currentFen = chess.fen();
    console.log(`📡 Sending request for FEN: ${currentFen}`);
    
    chrome.runtime.sendMessage(
        { action: "fetchBookMove", fen: currentFen },
        function(response) {
            if (chrome.runtime.lastError) return;

            if (response && response.success) {
                if (response.data.moves && response.data.moves.length > 0) {
                    console.log(`💡 Book Move Found: ${response.data.moves[0].san}`);
                    drawArrow(response.data.moves[0].uci); 
                } else {
                    const oldArrow = document.getElementById('book-move-arrow');
                    if (oldArrow) oldArrow.remove();
                }
            }
        }
    );
}

setInterval(() => {
    const currentMoves = getMoves();
    if (currentMoves.length !== previousMoveCount) {
        previousMoveCount = currentMoves.length;
        fetchBookMove(currentMoves);
    }
}, 1000);