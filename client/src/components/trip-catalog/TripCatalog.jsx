import TripCatalogItem from "./trip-catalog-item/TripCatalogItem";

export default function TripCatalog() {

    return (
        <section id="catalog-page">
            <h1>All trips</h1>
            <div class="allGames">
                <div class="allGames-info">
                    <img src="/images/avatar-1.jpg" />
                    <h6>Spain</h6>
                    <h2>May</h2>
                    <a href="#" class="details-button">Details</a>
                </div>

            </div>
            <div class="allGames">
                <div class="allGames-info">
                    <img src="/images/avatar-1.jpg" />
                    <h6>Baba mi</h6>
                    <h2>July</h2>
                    <a href="#" class="details-button">Details</a>
                </div>

            </div>
            <div class="allGames">
                <div class="allGames-info">
                    <img src="/images/avatar-1.jpg" />
                    <h6>Greece</h6>
                    <h2>August</h2>
                    <a href="#" class="details-button">Details</a>
                </div>
            </div>

            <h3 class="no-articles">No articles yet</h3>
        </section>
    );
}
