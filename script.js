document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const form = document.body;
    const featuredImage = document.getElementById("featuredImage");
    const thumbnailButtons = document.querySelectorAll(".thumbnail-btn");
    const thumbnailsContainer = document.querySelector(".thumbnails");
    const starterkitInfoIcon = document.getElementById("starterkit-info-icon");
    const tooltip = document.getElementById("starterkit-tooltip");

    // Tooltips and info boxes hidden on page load
    resetIntakeInfo();

    // When the user hovers over the info icon, a tooltip appears
    if (starterkitInfoIcon) {
        starterkitInfoIcon.addEventListener("mouseenter", () => positionTooltip(starterkitInfoIcon, tooltip));
    }

    // Listens for when user selects an interval or intake option
    if (form) {
        form.addEventListener("change", (event) => {
            const target = event.target;
            if (target.name === "interval") handleIntervalSelection(target);
            if (target.name === "intake") updateIntakeInformation();
        });
    }

    // When a user clicks on a thumbnail it updates the featured image, highlights the selected thumbnail, and recenters the row of thumbnails
    if (thumbnailButtons.length > 0) {
        thumbnailButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Update featured image source
                featuredImage.src = "assets/" + button.getAttribute("data-src");

                // Update active thumbnail
                thumbnailButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                // Scroll the selected thumbnail into center
                centerThumbnail(button);
            });
        });
    }
});

/**
 * Positions the tooltip dynamically based on available space.
 */
function positionTooltip(icon, tooltip) {
    const rect = icon.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    tooltip.style.bottom = spaceAbove < tooltipHeight && spaceBelow > tooltipHeight ? "auto" : "120%";
    tooltip.style.top = spaceAbove < tooltipHeight && spaceBelow > tooltipHeight ? "120%" : "auto";
}

/**
 * Handles selection of interval (Subscription, One-time, Starterkit).
 */
function handleIntervalSelection(selectedRadio) {
    const isStarterKit = selectedRadio.value === "starterkit";
    const intakeOptions = document.querySelectorAll(".intake-options .option");
    const starterkitInfoIcon = document.getElementById("starterkit-info-icon");

    intakeOptions.forEach(option => {
        const input = option.querySelector("input");
        option.classList.toggle("disabled", isStarterKit);
        if (isStarterKit) input.checked = false;
    });

    starterkitInfoIcon.classList.toggle("hidden", !isStarterKit);

    // Hide all details, then show the selected one
    document.querySelectorAll(".details").forEach(details => {
        details.style.maxHeight = "0px";
        details.style.opacity = "0";
        details.style.overflow = "hidden";
    });

    const selectedDetails = selectedRadio.closest(".option").querySelector(".details");
    if (selectedDetails) {
        selectedDetails.style.maxHeight = `${selectedDetails.scrollHeight}px`;
        selectedDetails.style.opacity = "1";
        selectedDetails.style.overflow = "visible";
    }

    updateIntakeInformation();
}

/**
 * Updates the intake information message based on user selection.
 */
function updateIntakeInformation() {
    const selectedInterval = document.querySelector('input[name="interval"]:checked');
    const isStarterKit = selectedInterval?.value === "starterkit";
    const selectedIntake = document.querySelector('input[name="intake"]:checked');
    const isChewable = selectedIntake?.value === "chewable";
    const intakeInfoSeperate = document.querySelector(".intake-information-seperate");

    intakeInfoSeperate.classList.toggle("hidden", !(isChewable && !isStarterKit));
}

/**
 * Hides all information boxes and tooltips when the page loads.
 */
function resetIntakeInfo() {
    document.querySelector(".intake-information-seperate")?.classList.add("hidden");
    document.getElementById("starterkit-info-icon")?.classList.add("hidden");
}

/**
 * Centers the selected thumbnail in the thumbnails container.
 */
function centerThumbnail(button) {
    const thumbnailsContainer = document.querySelector(".thumbnails");
    if (!thumbnailsContainer) return;

    const containerRect = thumbnailsContainer.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const scrollOffset = buttonRect.left - containerRect.left - (containerRect.width / 2) + (buttonRect.width / 2);

    thumbnailsContainer.scrollBy({ left: scrollOffset, behavior: "smooth" });
}

/**
 * Accordion.
 */
document.querySelectorAll('.accordion').forEach(accordion => {
    const content = accordion.querySelector('.accordion-content');
    const showMore = accordion.querySelector('.show-more');
    const button = accordion.querySelector('.toggle-btn');
    const gradient = accordion.querySelector('.gradient');
    const arrowDown = accordion.querySelector('.arrow-down');
    const arrowUp = accordion.querySelector('.arrow-up');

    // Ensure required elements exist
    if (!content || !showMore || !button || !arrowDown || !arrowUp) return;

    // Set initial collapsed state
    accordion.dataset.expanded = "false";
    arrowUp.style.display = "none"; // Hide the up arrow initially

    showMore.addEventListener('click', () => {
        const isExpanded = accordion.dataset.expanded === "true";

        if (isExpanded) {
            // Collapse
            content.style.maxHeight = "160px";
            button.textContent = "Show more";
            gradient.style.opacity = "1";
            arrowDown.style.display = "inline"; // Show down arrow
            arrowUp.style.display = "none"; // Hide up arrow
            accordion.dataset.expanded = "false";
        } else {
            // Expand
            content.style.maxHeight = content.scrollHeight + "px";
            button.textContent = "Show less";
            gradient.style.opacity = "0";
            arrowDown.style.display = "none"; // Hide down arrow
            arrowUp.style.display = "inline"; // Show up arrow
            accordion.dataset.expanded = "true";
        }
    });
});
