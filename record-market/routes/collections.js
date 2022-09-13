const router = require("express").Router();
const User = require('../models/User.model')
const Collection = require('../models/Collection')
const Album = require('../models/Album')
const loginCheck = require('../utils/loginCheck')



router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .populate('collections')
        .then(userFromDB => {
            res.render('collections/show', {user: userFromDB})
        })
        .catch(err => next(err))
})

router.get('/:id/add', loginCheck(), (req, res, next) => {
    User.findById(req.params.id)
        .then(userFromDB => {
            res.render('collections/new', {user: userFromDB})
        })
        .catch(err => next(err))
})

router.post('/:id/add', loginCheck(), (req, res, next) => {
    const  { name, description } = req.body
    Collection.create({ name, description})
        .then((createdCollection) => {
            User.findByIdAndUpdate(req.params.id, {
                $push: {collections: [createdCollection] }
            })
            .then(() => {
                res.redirect(`/collections/${req.params.id}`)
            })
        })           
        .catch(err => next(err))
})

//collections/remove/{{_id}}

router.get('/remove/:idCollection', loginCheck(), (req, res, next) => {
    Collection.findByIdAndDelete(req.params.idCollection)
            .then(()=> {
                res.redirect('/profile')
            })
            .catch(err => next(err))
})
//COLLECTION STRUCTURE
router.get('/collection/:idCollection', loginCheck(), (req, res, next) => {
    Collection.findById(req.params.idCollection)
            .populate('albums')
            .then(collectionByID => {
                console.log(collectionByID)
                res.render('collections/collection', { collection: collectionByID })
            })
            .catch(err => next(err))
})

router.get('/edit/:idCollection', loginCheck(), (req, res, next) => {
    Collection.findById(req.params.idCollection)
            .populate('albums')
            .then((collectionByID) => {
                res.render('collections/edit', { collection: collectionByID })
            })
            .catch(err => next(err))
})

router.post('/edit/:idCollection', loginCheck(), (req, res, next) => {
     const { name, description, albums } = req.body
     Collection.findByIdAndUpdate(req.params.idCollection, {
        name,
        description,
        albums
    })
    .then (() => {
        res.redirect(`/collections/collection/${req.params.idCollection}`)
    })
})





module.exports = router;