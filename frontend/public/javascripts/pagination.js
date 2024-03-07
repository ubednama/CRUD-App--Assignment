let selectedLimit;
function changePageLimit(selectElement) {
    selectedLimit = selectElement.value;
    const totalPages = totalResults/selectedLimit

    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page'));

    currentPage = !isNaN(currentPage) ? currentPage : 1;

    if (currentPage > totalPages) {
        currentPage = Math.ceil(totalPages);
    }

    urlParams.set('page', currentPage);
    urlParams.set('limit', selectedLimit);

    const currentUrl = window.location.pathname + '?' + urlParams.toString();

    window.location.href = currentUrl;
    console.log("New URL: ", currentUrl);
}

function handlePageNavigation(direction) {
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;
    const Limit = parseInt(urlParams.get('limit')) || 10;
    console.log("cP from prev1",currentPage, totalResults, limit)
    if(direction === 'prev') {
        const totalPages = Math.ceil(totalResults/limit);
        if (currentPage > totalPages) {
                currentPage = totalPages;
                console.log("cP from prev",currentPage)
            }
        }
    const nextPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    const searchParam = urlParams.get('search');
    const newUrl = `?page=${nextPage}&limit=${Limit}${searchParam ? `&search=${searchParam}` : ''}`;
    window.location.href = newUrl;
}