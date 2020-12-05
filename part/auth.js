'use strict'
module.exports = {
    pAdminSuper: (req, res, next) => {
        if(req.session.permission != `${process.env.ADMIN_PERMISSION}`) {
            req.flash('error_msg', "You need to have permission for this access") 
            const backUrl = req.header('Referer') || '/'; // get header of referer url
            res.redirect(backUrl);
        } else {
            res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0') // no caache so when logged out, cant browser back button to reload page, forces reload
            next()
        }
    }
}