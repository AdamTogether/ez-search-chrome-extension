chrome.commands.onCommand.addListener(function(command) {
  if (command === "open-ez-search") {
    console.log("Command 'open-ez-search' triggered. Opening ezrSearch.html...");
    chrome.tabs.create({ url: "ezSearch.html" }); // This will open your local HTML file
  }
});