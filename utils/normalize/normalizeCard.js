
const normalizeCard = (card) => {

    if (!card.image) {
        card.image = {}
    }
    card.image = {
        url: card.image.url || "https://cdn2.iconfinder.com/data/icons/admin-tools-2/25/image2-512.png",
        alt: card.image.alt || "This is where you add your pic description"
    }
    if (card.image.url === "") {
        card.image.url = "https://cdn2.iconfinder.com/data/icons/admin-tools-2/25/image2-512.png";

    }
    if (card.image.alt === "") {
        card.image.alt = "This is where you add your pic description"
    }

    return card
}


module.exports = normalizeCard