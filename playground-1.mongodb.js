/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* global use, db */

use('auto');

db.users.updateOne(
    { email: 'msveshnikov@gmail.com' },
    {
        $set: {
            isAdmin: true,
            subscriptionStatus: 'active',
            role: 'admin'
        }
    },
    { upsert: true }
);


