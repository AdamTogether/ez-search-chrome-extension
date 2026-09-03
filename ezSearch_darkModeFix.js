// Immediately invoked function to apply dark mode based only on localStorage
(function() {
	const currentTheme = localStorage.getItem("theme");

	// Apply dark class only if the theme is explicitly 'dark' in localStorage
	if (currentTheme === "dark") {
		document.documentElement.classList.add("dark");
	} else {
		// Otherwise, remove dark class (for 'light' or no setting)
		document.documentElement.classList.remove("dark");
	}

	// Reveal the document once the DOM is fully loaded and theme is applied
	// Added a slight delay to ensure CSS has fully rendered
	document.addEventListener('DOMContentLoaded', function() {
		document.documentElement.style.visibility = 'visible';
		document.getElementById('searchLinks').focus();
	});
})();