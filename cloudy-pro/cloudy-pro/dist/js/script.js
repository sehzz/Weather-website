document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleButton");
    const searchInput = document.getElementById("searchInput");
    const cancelIcon = document.getElementById("cancelIcon");
    // Initialize button state
    toggleButton.classList.add("on");

    cancelIcon.addEventListener("click", function() {
        searchInput.value = '';
        cancelIcon.style.display = 'none';
        document.getElementById("searchIcon").style.display = 'block';
    });

    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const query = searchInput.value;
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
});
