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
    home: {
        path: '/',
        label: 'Home',
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

    recent: {
        path: '/recent',
        label: 'Recent',
        x: -1,
        y: 0,

        neighbours: {
            right: 'home',
        },

        type: 'timeline',
    },

    about: {
        path: '/about',
        label: 'About',
        x: 1,
        y: 0,

        neighbours: {
            left: 'home',
        },

        type: 'essay',
    },

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

    projects: {
        path: '/projects',
        label: 'Projects',
        x: 0,
        y: 1,

        neighbours: {
            up: 'home',
            down: 'arts',
        },

        type: 'cards',
    },

    arts: {
        path: '/arts',
        label: 'Arts',
        x: 0,
        y: 2,

        neighbours: {
            up: 'projects',
        },

        type: 'gallery',
    },
} as const;