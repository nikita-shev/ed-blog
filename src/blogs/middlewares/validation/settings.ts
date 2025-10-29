export const SETTINGS = {
    name: {
        minLength: 1,
        maxLength: 15
    },
    description: {
        minLength: 1,
        maxLength: 500
    },
    url: {
        minLength: 1,
        maxLength: 100,
        pattern: '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
    }
};
