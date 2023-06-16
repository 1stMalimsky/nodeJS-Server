
const normalizeUser = (user) => {

    if (!user.image) {
        user.image = {}
    }
    user.image = {
        url: user.image.url || "https://img.freepik.com/free-icon/user_318-875902.jpg",
        alt: user.image.alt || "This is where you add your pic description"
    }
    if (user.image.url === "") {
        user.image.url = "https://img.freepik.com/free-icon/user_318-875902.jpg";

    }
    if (user.image.alt === "") {
        user.image.alt = "This is where you add your pic description"
    }

    return user;
}

module.exports = normalizeUser;