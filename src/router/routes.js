export const routes = [
    {
        path: '/register',
        name: 'Register',
        component: r => require(['../views/Register.vue'], r),
    },
    {
        path: '/login',
        name: 'Login',
        component: r => require(['../views/Login.vue'], r),
    },
    {
        path: '/main',
        name: 'Main',
        component: r => require(['../views/Main.vue'], r),
        children: [
            {
                path: 'menu',
                name: 'Menu',
                component: r => require(['../views/MainViews/Menu.vue'], r),
            },
            {
                path: 'order',
                name: 'Order',
                component: r => require(['../views/MainViews/Order.vue'], r),
            },
            {
                path: 'shopcart',
                name: 'Shopcart',
                component: r => require(['../views/MainViews/Shopcart.vue'], r),
            },
            {
                path: 'mine',
                name: 'Mine',
                component: r => require(['../views/MainViews/Mine.vue'], r),
            },
        ]
    },

    {
        path: '/detail',
        name: 'Detail',
        component: r => require(['../views/Detail.vue'], r),
    },
    {
        path: '/address/:aid?',
        name: 'Address',
        component: r => require(['../views/Address.vue'], r),
    },
    {
        path: '/addresslist',
        name: 'AddressList',
        component: r => require(['../views/AddressList.vue'], r),
    },
    {
        path: '/payfor',
        name: 'Payfor',
        component: r => require(['../views/Payfor.vue'], r),
    },
    {
        path: '/account',
        name: 'Account',
        component: r => require(['../views/Account.vue'], r),
    },
    {
        path: '/mycollection',
        name: 'MyCollection',
        component: r => require(['../views/MyCollection.vue'], r),
    },
    {
        path: '/security',
        name: 'Security',
        component: r => require(['../views/Security.vue'], r),
    },
    {
        path: '/findback',
        name: 'FindBack',
        component: r => require(['../views/FindBack.vue'], r),
    },


    {
        path: '*',
        redirect: {
            name: 'Register'
        }
    }
]