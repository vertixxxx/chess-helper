# ♟️ Chess.com Book Move Assistant

A custom Chrome Extension that dynamically tracks moves played on Chess.com and displays the most popular master-level book move directly on the board using a visual arrow overlay. 

Powered by the **Lichess Opening Explorer API** and **chess.js**.

🚨 **DISCLAIMER: EDUCATIONAL & BOT USE ONLY** 🚨  
*Using any form of opening explorer or outside assistance during live games against human opponents strictly violates Chess.com's Fair Play policy and will result in an immediate account ban. This extension should ONLY be used when playing against computer bots or when studying in analysis boards.*

## ✨ Features
* **Real-Time Board Tracking:** Continuously monitors the Chess.com DOM for new moves added to the main line.
* **Accurate FEN Calculation:** Uses `chess.js` as an internal engine to translate standard algebraic notation (SAN) into accurate FEN strings, regardless of move order.
* **Lichess API Integration:** Connects to the Lichess Masters Database to retrieve the highest-frequency response played by titled players.
* **Dynamic SVG Overlay:** Injects a responsive, non-interfering SVG arrow across the viewport that perfectly maps to the underlying chessboard squares, calculating dynamic pixel coordinates even when the board is resized or flipped.

## 🛠️ Prerequisites
Because Lichess requires authentication for their Explorer API, you will need a free personal access token.
1. Create or log into an account on [Lichess.org](https://lichess.org).
2. Go to **Preferences** -> **API access tokens**.
3. Click **Create a token**. (You do not need to grant the token any special permissions).
4. Copy the generated `lip_...` token.

## 🚀 Installation & Setup



1. **Clone the repository:**
   git clone [https://github.com/YOUR_USERNAME/chess-book-assistant.git](https://github.com/YOUR_USERNAME/chess-book-assistant.git)
2. Add your Lichess Token:
Open the background.js file and replace the placeholder with your actual token:  const LICHESS_TOKEN = "lip_YOUR_SECRET_TOKEN_HERE";

3.Load the Extension into Chrome:

Open Google Chrome and navigate to chrome://extensions/.

Toggle Developer mode ON in the top right corner.

Click the Load unpacked button in the top left.

Select the folder containing this repository's files.

4. Play!
Navigate to Chess.com, open a game against a bot, and make a move.
The extension will automatically calculate the best book response and draw a green arrow on the board.
