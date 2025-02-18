document.addEventListener("DOMContentLoaded", function () {
    // Get the form (the whole page body in this case)
    const form = document.body;

    // Get the info icon and tooltip
    const starterkitInfoIcon = document.getElementById("starterkit-info-icon");
    const tooltip = document.getElementById("starterkit-tooltip");

    // Handle tooltip positioning when hovering over the info icon
    starterkitInfoIcon.addEventListener("mouseenter", function () {
        positionTooltip(starterkitInfoIcon, tooltip);
    });

    // Listen for changes in the form (when user selects an option)
    form.addEventListener("change", function (event) {
        const target = event.target;

        if (target.name === "interval") {
            handleIntervalSelection(target);
        }

        if (target.name === "intake") {
            updateIntakeInformation();
        }
    });

    // Ensure info boxes and tooltips are hidden when the page loads
    resetIntakeInfo();
});

/**
 * Function to position the tooltip dynamically based on available space.
 */
function positionTooltip(icon, tooltip) {
    const rect = icon.getBoundingClientRect(); // Get the position of the icon
    const tooltipHeight = tooltip.offsetHeight;
    const spaceAbove = rect.top; // Space above the icon
    const spaceBelow = window.innerHeight - rect.bottom; // Space below the icon

    // If there's not enough space above, position the tooltip below
    if (spaceAbove < tooltipHeight && spaceBelow > tooltipHeight) {
        tooltip.style.bottom = "auto";
        tooltip.style.top = "120%";
    } else {
        tooltip.style.top = "auto";
        tooltip.style.bottom = "120%";
    }
}

/**
 * Function to handle the selection of an interval (Subscription, One-time, Starterkit)
 */
function handleIntervalSelection(selectedRadio) {
    const isStarterKit = selectedRadio.value === "starterkit"; // Check if user selected Starterkit
    const intakeOptions = document.querySelectorAll(".intake-options .option");
    const starterkitInfoIcon = document.getElementById("starterkit-info-icon");

    // Disable intake options when Starterkit is selected, enable them otherwise
    intakeOptions.forEach((option) => {
        const input = option.querySelector("input");
        option.classList.toggle("disabled", isStarterKit); // Add disabled class to intake options if the starterkit is selected
        if (isStarterKit) {
            input.checked = false; // Uncheck intake options when Starterkit is selected
        }
    });

    // Show or hide the info icon depending on whether Starterkit is selected
    starterkitInfoIcon.classList.toggle("hidden", !isStarterKit);

    // Expand the corresponding .details section
    // First hide all .details
    document.querySelectorAll(".details").forEach((details) => {
        details.style.maxHeight = "0px";
        details.style.opacity = "0";
        details.style.overflow = "hidden";
    });

    // Then show .details for the selected radio
    const selectedDetails = selectedRadio.closest(".option").querySelector(".details");
    if (selectedDetails) {
        selectedDetails.style.maxHeight = selectedDetails.scrollHeight + "px";
        selectedDetails.style.opacity = "1";
        selectedDetails.style.overflow = "visible";
    }

    // Update intake information based on selection
    updateIntakeInformation();
}

/**
 * Function to update the intake information message based on user selection.
 */
function updateIntakeInformation() {
    const selectedInterval = document.querySelector('input[name="interval"]:checked');
    const isStarterKit = selectedInterval && selectedInterval.value === "starterkit";

    const selectedIntake = document.querySelector('input[name="intake"]:checked');
    const isChewable = selectedIntake && selectedIntake.value === "chewable";

    const intakeInfoSeperate = document.querySelector(".intake-information-seperate");

    // Show "Chewable" info only when "Chewable" is selected and Starterkit is NOT selected
    intakeInfoSeperate.classList.toggle("hidden", !(isChewable && !isStarterKit));
}

/**
 * Function to hide all information boxes and tooltips when the page loads.
 */
function resetIntakeInfo() {
    document.querySelector(".intake-information-seperate").classList.add("hidden");
    document.getElementById("starterkit-info-icon").classList.add("hidden");
}
