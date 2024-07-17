document.addEventListener('DOMContentLoaded', (event) => {
    const animeContainer = document.getElementById('anime-container');
    const tabs = document.querySelectorAll('.heading-tabs ul li a');
    const pageHeading = document.querySelector('.page-heading-rent-venue');
    const video = document.getElementById('background-video');

    const images = [
        './assets/images/image1.png',
        './assets/images/image2.png',
        './assets/images/image3.png',
        './assets/images/image4.png',
        './assets/images/image5.png',
        './assets/images/image6.png',
        './assets/images/image7.png',
        './assets/images/image8.png',
        './assets/images/image9.png',
        './assets/images/image10.png',
        './assets/images/image11.png'
    ];
    let currentImageIndex = 0;

    function changeBackgroundImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        console.log(`Changing background to: ${images[currentImageIndex]}`);
        pageHeading.style.backgroundImage = `url(${images[currentImageIndex]})`;
        pageHeading.style.backgroundColor = '#ccc'; // Set a fallback color
    }

    // Set the initial background image
    pageHeading.style.backgroundImage = `url(${images[currentImageIndex]})`;
    pageHeading.style.backgroundColor = '#ccc'; // Set a fallback color

    setInterval(changeBackgroundImage, 3000);

    function fetchAnimeData(url, tabId) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeList = data.data;
                animeContainer.innerHTML = ''; // Clear existing content

                animeList.forEach((anime, index) => {
                    const article = document.createElement('article');
                    article.id = `${tabId}-${index + 1}`; // Use a combination of tabId and index for unique IDs

                    const row = document.createElement('div');
                    row.classList.add('row');

                    const col9 = document.createElement('div');
                    col9.classList.add('col-lg-9');

                    const rightContent = document.createElement('div');
                    rightContent.classList.add('right-content');

                    const title = document.createElement('h4');
                    title.textContent = anime.title;

                    const description = document.createElement('p');
                    description.innerHTML = anime.synopsis ? anime.synopsis : 'Description not available.';

                    const list = document.createElement('ul');
                    list.classList.add('list');

                    const genreItem = document.createElement('li');
                    genreItem.textContent = 'Genre: ' + anime.genres.map(genre => genre.name).join(', ');

                    const episodesItem = document.createElement('li');
                    episodesItem.textContent = `Episodes: ${anime.episodes || 'Unknown'}`;

                    const releaseDateItem = document.createElement('li');
                    releaseDateItem.textContent = `Release Date: ${anime.aired.from ? new Date(anime.aired.from).toDateString() : 'Unknown'}`;

                    list.appendChild(genreItem);
                    list.appendChild(episodesItem);
                    list.appendChild(releaseDateItem);

                    rightContent.appendChild(title);
                    rightContent.appendChild(description);
                    rightContent.appendChild(list);

                    col9.appendChild(rightContent);

                    const col3 = document.createElement('div');
                    col3.classList.add('col-lg-3');

                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('image-container');

                    const image = document.createElement('img');
                    image.src = anime.images.jpg.image_url;
                    image.alt = anime.title;

                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    overlay.textContent = 'Watch Trailer';

                    imageContainer.appendChild(image);
                    imageContainer.appendChild(overlay);

                    // Add click event to redirect to trailer URL
                    imageContainer.addEventListener('click', () => {
                        window.open(anime.trailer.url, '_blank');
                    });

                    col3.appendChild(imageContainer);

                    row.appendChild(col9);
                    row.appendChild(col3);

                    article.appendChild(row);
                    animeContainer.appendChild(article);
                });
            })
            .catch(error => {
                console.error('Error fetching data from Jikan API:', error);
            });
    }

            // Fetch and display anime reviews
    // Fetch and display anime reviews
    function fetchAnimeReviews() {
        fetch('https://api.jikan.moe/v4/reviews/anime')
            .then(response => response.json())
            .then(data => {
                const reviews = data.data;
                const contactForm = document.querySelector('.contact-form');
                contactForm.innerHTML = ''; // Clear existing content

                // Display the first 10 reviews initially
                reviews.slice(0, 10).forEach(review => {
                    addReviewElement(contactForm, review);
                });

                // Create a container for additional reviews
                const additionalReviewsContainer = document.createElement('div');
                additionalReviewsContainer.classList.add('additional-reviews');
                additionalReviewsContainer.style.display = 'none';

                // Add the remaining reviews to the additional reviews container
                reviews.slice(10).forEach(review => {
                    addReviewElement(additionalReviewsContainer, review);
                });

                contactForm.appendChild(additionalReviewsContainer);

                // Add the "See more reviews" button
                if (reviews.length > 10) {
                    const seeMoreButton = document.createElement('button');
                    seeMoreButton.classList.add('see-more');
                    seeMoreButton.textContent = 'See more reviews';
                    seeMoreButton.addEventListener('click', () => {
                        if (additionalReviewsContainer.style.display === 'none') {
                            additionalReviewsContainer.style.display = 'block';
                            seeMoreButton.textContent = 'Show less reviews';
                        } else {
                            additionalReviewsContainer.style.display = 'none';
                            seeMoreButton.textContent = 'See more reviews';
                        }
                    });
                    contactForm.appendChild(seeMoreButton);
                }
            })
            .catch(error => console.error('Error fetching reviews:', error));
    }

    function addReviewElement(container, review) {
        const reviewText = review.review;
        const words = reviewText.split(' ');

        let reviewElement;
        if (words.length > 50) {
            const shortReview = words.slice(0, 50).join(' ') + '...';
            reviewElement = `
                <div class="review">
                    <h5>${review.user.username}</h5>
                    <p class="short-review">${shortReview}</p>
                    <p class="full-review" style="display: none;">${reviewText}</p>
                    <br>
                    <button class="load-more">Load more</button>
                </div>
            `;
        } else {
            reviewElement = `
                <div class="review">
                    <h5>${review.user.username}</h5>
                    <p>${reviewText}</p>
                </div>
            `;
        }
        container.innerHTML += reviewElement;

        // Add event listener for "Load more" button if it exists
        const loadMoreButton = container.querySelector('.review:last-child .load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', (event) => {
                const reviewDiv = event.target.closest('.review');
                const shortReview = reviewDiv.querySelector('.short-review');
                const fullReview = reviewDiv.querySelector('.full-review');

                if (shortReview.style.display === 'none') {
                    shortReview.style.display = 'block';
                    fullReview.style.display = 'none';
                    loadMoreButton.textContent = 'Load more';
                } else {
                    shortReview.style.display = 'none';
                    fullReview.style.display = 'block';
                    loadMoreButton.textContent = 'Show less';
                }
            });
        }
    }

    // Initial fetch for Latest Anime
    fetchAnimeData('https://api.jikan.moe/v4/seasons/now', 'tabs-1');

    // Fetch and display reviews on page load
    fetchAnimeReviews();
    video.play();

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const tabId = tab.getAttribute('href').substring(1); // Get the ID from href attribute

            // Fetch data based on the tab
            if (tabId === 'tabs-1') {
                fetchAnimeData('https://api.jikan.moe/v4/seasons/now', tabId);
            } else if (tabId === 'tabs-2') {
                fetchAnimeData('https://api.jikan.moe/v4/seasons/upcoming', tabId);
            } else if (tabId === 'tabs-3') {
                fetchAnimeData('https://api.jikan.moe/v4/top/anime', tabId);
            }

            // Update active tab
            tabs.forEach(t => {
                const parentLi = t.parentElement;
                parentLi.classList.remove('ui-tabs-active', 'ui-state-active');
                t.classList.remove('ui-tabs-active', 'ui-state-active');
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('aria-expanded', 'false');
                parentLi.setAttribute('aria-selected', 'false');
                parentLi.setAttribute('aria-expanded', 'false');
            });
            const parentLi = tab.parentElement;
            parentLi.classList.add('ui-tabs-active', 'ui-state-active');
            tab.classList.add('ui-tabs-active', 'ui-state-active');
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('aria-expanded', 'true');
            parentLi.setAttribute('aria-selected', 'true');
            parentLi.setAttribute('aria-expanded', 'true');
        });
    });
});
