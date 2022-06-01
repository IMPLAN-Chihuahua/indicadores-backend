const getPagination = ({ page, perPage }) => ({ page: page || 1, perPage: perPage || 15 });

const getPaginationModulos = (queryParams) => {
    const page = queryParams.page || 1;
    const perPage = queryParams.perPage || 5;
    return { page, perPage };
}

module.exports = { getPagination, getPaginationModulos };