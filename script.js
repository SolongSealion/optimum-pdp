const intakeOptions = document.querySelector(".intake-options");
const intervalOptions = document.querySelector('.interval-options');

let intakeOption = getActiveIntakeOption();
let intervalOption = getActiveIntervalOption();

document.addEventListener("DOMContentLoaded", () => {
    /*** Elements ***/
    const form = document.body;
    const featuredImage = document.getElementById("featuredImage");
    const thumbnailButtons = document.querySelectorAll(".thumbnail-btn");
    const starterkitInfoIcon = document.getElementById("starterkit-info-icon");
    const tooltip = document.getElementById("starterkit-tooltip");
    

    /*** Initialize Page State ***/
    resetIntakeInfo();

    /*** Event Listeners ***/
    if (starterkitInfoIcon) {
        starterkitInfoIcon.addEventListener("mouseenter", () => positionTooltip(starterkitInfoIcon, tooltip));
    }

    if (form) {
        form.addEventListener("change", handleFormChange);
    }

    if (thumbnailButtons.length > 0) {
        thumbnailButtons.forEach(button => button.addEventListener("click", () => updateFeaturedImage(button)));
    }

    initializeAccordion();
    initializeOptions();
    initializeStickyCTA();
}); 

function initializeOptions() {
    handleIntakeSelection();
    handleIntervalSelection(false);
    updateStickyCTASummary();
}

/**
 * Handles form change events for interval and intake selection.
 */
function handleFormChange(event) {
    const target = event.target;
    
    if (target.name === "interval") handleIntervalSelection(true);
    if (target.name === "intake") handleIntakeSelection();
    
    updateStickyCTASummary();
}

/**
 * Updates the sticky CTA summary with selected intake and interval.
 */
function updateStickyCTASummary() {
    const selectedIntake = document.querySelector('input[name="intake"]:checked')?.value || "";
    const formattedIntake = selectedIntake ? selectedIntake.charAt(0).toUpperCase() + selectedIntake.slice(1) : "";
    
    const selectedInterval = document.querySelector('input[name="interval"]:checked')?.value || "";
    
    const typeOutput = document.querySelector(".selected-form");
    const intervalOutput = document.querySelector(".selected-interval");
    const separator = document.querySelector(".separator");

    typeOutput.textContent = formattedIntake;
    intervalOutput.textContent = selectedInterval;

    // Show or hide the separator based on selection
    separator.classList.toggle("hidden", !selectedIntake || !selectedInterval);
}

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
 * Handles interval selection (Subscription, One-time, Starterkit).
 */
function handleIntervalSelection(animate = true) {
    intervalOption = getActiveIntervalOption();
    const isStarterKit = isStartedKitSelected();
    const starterkitInfoIcon = document.getElementById("starterkit-info-icon");
    starterkitInfoIcon.classList.toggle("hidden", !isStarterKit);

    intakeOptions.querySelectorAll('.option').forEach(option => {
        const input = option.querySelector("input");

        if (isStarterKit) {
            option.classList.add("disabled");
            input.checked = false;
        } else{
            option.classList.remove("disabled");
        }
    });

    if (!isStarterKit) {
        intakeOption.checked = true;
    }

    updateInfoText();
    updateDetailSections(animate);
}

function isStartedKitSelected() {
    return getActiveIntervalOption().value === "Starterkit";
}

function getActiveIntakeOption() {
    return intakeOptions.querySelector('input:checked');
}

function getActiveIntervalOption() {
    return intervalOptions.querySelector('input:checked');
}

/**
 * Updates the intake information message based on user selection.
 */
function handleIntakeSelection() {
    intakeOption = getActiveIntakeOption();
    updateInfoText();
}

function updateInfoText() {
    const isStarterKit = isStartedKitSelected();
    const isChewable = intakeOption.value === "chewable";
    const intakeInfoSeparate = document.querySelector(".intake-information-seperate");

    intakeInfoSeparate.classList.toggle("hidden", !(isChewable && !isStarterKit));
}

/**
 * Hides all information boxes and tooltips on page load.
 */
function resetIntakeInfo() {
    document.querySelector(".intake-information-seperate")?.classList.add("hidden");
    document.getElementById("starterkit-info-icon")?.classList.add("hidden");
}

/**
 * Updates the detail sections for each interval selection.
 */
function updateDetailSections(animate) {
    document.querySelectorAll(".details").forEach(details => {
        details.style.maxHeight = "0px";
        details.style.opacity = "0";
        details.style.overflow = "hidden";
    });

    const selectedDetails = intervalOption.closest(".option").querySelector(".details");
    if (selectedDetails) {
        if (animate) {
            selectedDetails.style.maxHeight = `${selectedDetails.scrollHeight}px`;
            selectedDetails.style.opacity = "1";
            selectedDetails.style.overflow = "visible";
        } else {
            selectedDetails.style.maxHeight = "none";
            selectedDetails.style.opacity = "1";
            selectedDetails.style.overflow = "visible";
        }
    }
}

/**
 * Updates the featured image based on selected thumbnail.
 */
function updateFeaturedImage(button) {
    const featuredImage = document.getElementById("featuredImage");
    const thumbnailButtons = document.querySelectorAll(".thumbnail-btn");

    featuredImage.src = "assets/" + button.getAttribute("data-src");
    thumbnailButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    centerThumbnail(button);
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
 * Initializes the accordion functionality.
 */
function initializeAccordion() {
    document.querySelectorAll('.accordion').forEach(accordion => {
        const content = accordion.querySelector('.accordion-content');
        const showMore = accordion.querySelector('.show-more');
        const button = accordion.querySelector('.toggle-btn');
        const gradient = accordion.querySelector('.gradient');
        const arrowDown = accordion.querySelector('.arrow-down');
        const arrowUp = accordion.querySelector('.arrow-up');

        if (!content || !showMore || !button || !arrowDown || !arrowUp) return;

        accordion.dataset.expanded = "false";
        arrowUp.style.display = "none";

        showMore.addEventListener('click', () => {
            const isExpanded = accordion.dataset.expanded === "true";

            if (isExpanded) {
                content.style.maxHeight = "120px";
                button.textContent = "Show more";
                gradient.style.opacity = "1";
                arrowDown.style.display = "inline";
                arrowUp.style.display = "none";
                accordion.dataset.expanded = "false";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                button.textContent = "Show less";
                gradient.style.opacity = "0";
                arrowDown.style.display = "none";
                arrowUp.style.display = "inline";
                accordion.dataset.expanded = "true";
            }
        });
    });
}

/**
 * Initializes the sticky CTA functionality on mobile.
 */
function initializeStickyCTA() {
    const regularCTA = document.querySelector(".button.primary-button");
    const stickyCTA = document.querySelector(".sticky-cta");
    let isScrolling = false;

    function toggleStickyCTA() {
        if (window.innerWidth < 1024) {
            const rect = regularCTA.getBoundingClientRect();
            stickyCTA.classList.toggle("show", rect.bottom < 0);
        } else {
            stickyCTA.classList.remove("show");
        }
    }

    function scrollHandler() {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                toggleStickyCTA();
                isScrolling = false;
            });
        }
    }

    window.addEventListener("scroll", scrollHandler);
    window.addEventListener("resize", toggleStickyCTA);
}

document.addEventListener("DOMContentLoaded", function () {
    const healthBenefitContainers = document.querySelectorAll(".health-benefit-container");

    healthBenefitContainers.forEach(container => {
        const addIcon = container.querySelector(".health-benefit-accordion .material-symbols-outlined:nth-child(1)");
        const expandIcon = container.querySelector(".health-benefit-accordion .material-symbols-outlined:nth-child(2)");
        
        // Ensure add icon is visible on page load
        addIcon.classList.remove("hidden");
        expandIcon.classList.add("hidden");

        container.addEventListener("click", function () {
            // Close all other accordions
            healthBenefitContainers.forEach(otherContainer => {
                if (otherContainer !== container) {
                    closeAccordion(otherContainer);
                }
            });
            
            // Toggle the clicked accordion
            toggleAccordion(container);
        });
    });

    function toggleAccordion(container) {
        const contents = container.querySelector(".health-benefit-contents");
        const addIcon = container.querySelector(".health-benefit-accordion .material-symbols-outlined:nth-child(1)");
        const expandIcon = container.querySelector(".health-benefit-accordion .material-symbols-outlined:nth-child(2)");

        if (contents.style.maxHeight) {
            closeAccordion(container);
        } else {
            contents.style.maxHeight = contents.scrollHeight + "px";
            contents.style.opacity = "1";
            addIcon.classList.add("hidden");
            expandIcon.classList.remove("hidden");
        }
    }

    function closeAccordion(container) {
        const contents = container.querySelector(".health-benefit-contents");
        const addIcon = container.querySelector(".health-benefit-accordion .material-symbols-outlined:nth-child(1)");
        const expandIcon = container.querySelector(".health-benefit-accordion .material-symbols-outlined:nth-child(2)");

        contents.style.maxHeight = null;
        contents.style.opacity = "0";
        addIcon.classList.remove("hidden");
        expandIcon.classList.add("hidden");
    }
});

function showEasterEgg() {
    alert("Congrats, you found my Easter egg! 🎉 Come to me for a chocolate 🍫");
}