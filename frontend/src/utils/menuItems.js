import {dashboard, expenses, transactions, trend, categories} from '../utils/icon'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/dashboard",
    },
    {
        id: 4,
        title: 'Expenses',
        icon: expenses,
        link: "/dashboard"
    },
    {
        id: 5,
        title: 'Expenses Category',
        icon: categories,  // You'll need to add this icon to your icons file
        link: "/dashboard"
    }
]