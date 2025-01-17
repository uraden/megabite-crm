const baseUrl = 'https://6788e7872c874e66b7d6cb1d.mockapi.io';

export default {
    mockApi: () => [baseUrl, "products"].join("/"),
    modifyMockApi: (id: string) => [baseUrl, "products", id].join("/"),
}