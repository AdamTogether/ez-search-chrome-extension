// Configure Tailwind's in-browser JIT runtime (tailwinds_3_4_16.js, loaded just
// before this script) to use class-based dark mode instead of its built-in
// "media" (OS color-scheme) default. Verified directly against the bundle's
// source: window.tailwind.config is a Proxy whose setter synchronously
// re-triggers stylesheet generation on assignment, so this only needs to run
// after tailwinds_3_4_16.js has executed and created window.tailwind — which
// it always has by this point, since <script> tags run in document order.
//
// Without this line, every `dark:` utility class written directly in the HTML
// (dark:bg-gray-700, dark:text-yellow-400, dark:bg-gray-800, etc.) responds
// only to the OS-level color-scheme preference and completely ignores the
// darkModeToggle button and the .dark class this script applies below. Only
// the hand-written `html.dark { ... }` rules in ezSearch.css were ever
// actually working off the manual toggle; the rest were silently dead.
try {
	window.tailwind.config.darkMode = 'class';
} catch (e) {
	// window.tailwind not present -> tailwinds_3_4_16.js failed to load/execute.
	// Nothing we can do about styling in that case (the whole page would be
	// unstyled regardless), but we must not let it stop the code below from
	// running, or the page stays permanently hidden behind visibility:hidden.
}

// Immediately invoked function to apply dark mode based on localStorage,
// defaulting first-time visitors (no stored preference yet) to dark mode.
(function() {
	let isDarkMode = true; // fail-safe default if localStorage is unavailable

	try {
		const storedDarkMode = localStorage.getItem('darkMode');

		if (storedDarkMode === null) {
			// First-time visitor: nothing saved yet -> default to dark and persist it,
			// so ezSearch.js's loadDarkModePreference() (which reads this same key)
			// agrees with what we've already painted and doesn't desync the icon.
			isDarkMode = true;
			localStorage.setItem('darkMode', 'true');
		} else {
			// Returning visitor: respect their explicit choice (light or dark)
			isDarkMode = storedDarkMode === 'true';
		}
	} catch (e) {
		// localStorage blocked/unavailable (e.g. private browsing, sandboxed iframe).
		// Fall back to the dark-mode default; skip persistence rather than throw,
		// since an uncaught error here would abort the IIFE before the
		// DOMContentLoaded listener below is registered, leaving the page
		// permanently invisible (visibility:hidden is set in the HTML and never cleared).
		isDarkMode = true;
	}

	if (isDarkMode) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}

	// Reveal the document once the DOM is fully loaded and theme is applied
	// Added a slight delay to ensure CSS has fully rendered
	document.addEventListener('DOMContentLoaded', function() {
		document.documentElement.style.visibility = 'visible';
		document.getElementById('searchLinks').focus();
	});
})();