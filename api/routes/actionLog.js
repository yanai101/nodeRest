
const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth')
const actions = require('../../controllers/anction');

router.get('/', actions.action_get_all);

router.post('/', actions.set_new_action);

router.get('/:id', checkAuth, actions.get_action);

// router.get('/:id',  actions.get_action);

/**
 * req body need to by array of {'propName':___,'value':___}
 */
router.put('/:id', checkAuth, actions.update_action)

router.delete('/:id', checkAuth, actions.delete_action);

router.delete('/', checkAuth, actions.delete_action);

module.exports = router;