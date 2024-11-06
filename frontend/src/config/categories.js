import {
    book, 
    food, 
    medical, 
    tv, 
    takeaway, 
    clothing, 
    freelance, 
    circle
} from '../utils/icon';

// Default categories
export const DEFAULT_CATEGORIES = {
    education: {
        label: 'Education',
        icon: book
    },
    groceries: {
        label: 'Groceries',
        icon: food
    },
    health: {
        label: 'Health',
        icon: medical
    },
    subscriptions: {
        label: 'Subscriptions',
        icon: tv
    },
    takeaways: {
        label: 'Takeaways',
        icon: takeaway
    },
    clothing: {
        label: 'Clothing',
        icon: clothing
    },
    travelling: {
        label: 'Travelling',
        icon: freelance
    },
    other: {
        label: 'Other',
        icon: circle
    }
};

export let EXPENSE_CATEGORIES = { ...DEFAULT_CATEGORIES };

export const updateCategories = (customCategories = []) => {
    EXPENSE_CATEGORIES = {
        ...DEFAULT_CATEGORIES,
        ...customCategories.reduce((acc, cat) => ({
            ...acc,
            [cat.key]: {
                label: cat.label,
                icon: cat.icon ? cat[cat.icon] : circle
            }
        }), {})
    };
    return EXPENSE_CATEGORIES;
};

export const getAllCategories = () => Object.keys(EXPENSE_CATEGORIES);

export const getCategoryLabel = (categoryKey) => 
    EXPENSE_CATEGORIES[categoryKey]?.label || categoryKey;

export const getCategoryIcon = (categoryKey) => 
    EXPENSE_CATEGORIES[categoryKey]?.icon || circle;