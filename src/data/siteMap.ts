/**
 * Capsule Fey Site Map
 *
 * The website is organised as a navigable space rather than a collection of pages.
 *
 * Every node has:
 * - a position
 * - neighbouring spaces
 * - a browsing mode
 *
 * Navigation should always follow the spatial relationships defined here.
 */

export const siteMap = {
    cv: {
        path: '/cv',
        label: 'CV',
        x: 0,
        y: -1,

        neighbours: {
            down: 'home',
        },

        type: 'document',
    },

    recent: {
        path: '/recent',
        label: 'Recent',
        x: -1,
        y: 0,

        neighbours: {
            right: 'home',
            down: 'thesis',
        },

        type: 'timeline',
    },

    home: {
        path: '/',
        label: 'Lobby',
        x: 0,
        y: 0,

        neighbours: {
            left: 'recent',
            right: 'about',
            up: 'cv',
            down: 'projects',
        },

        type: 'hub',
    },

    about: {
        path: '/about',
        label: 'About',
        x: 1,
        y: 0,

        neighbours: {
            left: 'home',
            down: 'arts',
        },

        type: 'essay',
    },

    thesis: {
        path: '/thesis',
        label: 'Thesis',
        x: -1,
        y: 1,

        neighbours: {
            up: 'recent',
            right: 'projects',
        },

        type: 'workspace',
    },

    projects: {
        path: '/projects',
        label: 'Projects',
        x: 0,
        y: 1,

        neighbours: {
            up: 'home',
            left: 'thesis',
            right: 'arts',
        },

        type: 'cards',
    },

    arts: {
        path: '/arts',
        label: 'Arts',
        x: 1,
        y: 1,

        neighbours: {
            up: 'about',
            left: 'projects',
        },

        type: 'gallery',
    },
} as const;