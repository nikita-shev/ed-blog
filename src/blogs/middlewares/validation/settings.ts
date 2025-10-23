export const SETTINGS = {
    name: {
        maxLength: 15
    },
    description: {
        maxLength: 500
    },
    url: {
        maxLength: 100,
        pattern: '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
    }
};
