document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.querySelector(".logo .menu-mobile .mobile-nav-icon");
    const closeIcon = document.querySelector(".menu-mobile-con .close-mobile-icon");
    const mobileCon = document.querySelector(".menu-mobile-con");

    menuIcon.addEventListener("click", () => {
        mobileCon.classList.add("active");
    });

    closeIcon.addEventListener("click", () => {
        mobileCon.classList.remove("active");
    });
});
