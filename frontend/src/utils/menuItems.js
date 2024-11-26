//utils/menuItems.js
import {dashboard, expenses, trend, categories,chat } from '../utils/icon'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// export const menuItems = [
//     {
//         id: 1,
//         title: 'Dashboard',
//         icon: dashboard,
//         link: '/dashboard'
//     },
//     {
//         id: 3,
//         title: "Incomes",
//         icon: trend,
//         link: "/dashboard",
//     },
//     {
//         id: 4,
//         title: 'Expenses',
//         icon: expenses,
//         link: "/dashboard"
//     },
//     {
//         id: 5,
//         title: 'Expenses Category',
//         icon: categories,  // You'll need to add this icon to your icons file
//         link: "/dashboard"
//     },
//     {
//         id:6,
//         title: 'Chat',
//         icon: chat,
//         link:"/chat"
//     }
// ]

// Add Customer Service item to your existing menuItems array in utils/menuItems.js:
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
        icon: categories,
        link: "/dashboard"
    },
    {
        id: 6,
        title: 'Chat',
        icon: chat,
        link: "/chat"
    }
];

// The Customer Service item will be added conditionally in the Navigation component
const customerServiceItem = {
    id: 7,
    title: 'Customer Service',
    icon: <SupportAgentIcon />,
    link: '/customer-service'
};