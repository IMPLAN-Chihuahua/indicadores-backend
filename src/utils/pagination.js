const getPagination = (queryParams) => {
    const page = queryParams.page || 1;
    const perPage = queryParams.perPage || 15;
    return { page, perPage };
}

const getPaginationModulos = (queryParams) => {
    const page = queryParams.page || 1;
    const perPage = queryParams.perPage || 5;
    return { page, perPage };
}

const getPaginationHistoricos = (queryParams) => {
    const page = queryParams.page || 1;
    const perPage = queryParams.perPage || 5;
    return { page, perPage };
}

module.exports = { getPagination, getPaginationModulos, getPaginationHistoricos };