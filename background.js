chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchBookMove") {
        
        const url = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(request.fen)}`;
        
        const LICHESS_TOKEN = "INSERT_YOUR_TOKEN_HERE";
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${LICHESS_TOKEN}` 
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("API returned status " + response.status);
                return response.json();
            })
            .then(data => sendResponse({ success: true, data: data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        
        return true; 
    }
});

         
