const getPagination = ({ page, perPage }) => ({ page: page || 1, perPage: perPage || 15 });

const getPaginationTemas = (queryParams) => {
    const page = queryParams.page || 1;
    const perPage = queryParams.perPage || 5;
    return { page, perPage };
}

const getPaginationHistoricos = (queryParams) => {
    const page = queryParams.page || 1;
    const perPage = queryParams.perPage || 5;
    return { page, perPage };
}

module.exports = { getPagination, getPaginationTemas, getPaginationHistoricos };