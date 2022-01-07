const getPagination = (queryParams) => {
    const page = queryParams.page || 1;
    const per_page = queryParams.per_page || 15;
    return { page, per_page };
}


module.exports = { getPagination };