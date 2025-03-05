import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('dashboard/users');
});

router.get('/users', (req, res) => {
    res.render('dashboard/users', {layout: 'dashboard/layout', currentUser: {username: "kolton", role: "admin"}, users: [{id: 1, username: "test"}]});
});

router.get('/settings', (req, res) => {
    res.render('dashboard/settings', {layout: 'dashboard/layout', currentUser: {username: "kolton", role: "admin"}});
});

router.get('/reports', (req, res) => {
    res.render('dashboard/reports', {layout: 'dashboard/layout', currentUser: {username: "kolton", role: "admin"}});
});

router.get('/profile', (req, res) => {
    res.render('dashboard/profile', {layout: 'dashboard/layout', currentUser: {username: "kolton", role: "admin"}});
});

export default router;