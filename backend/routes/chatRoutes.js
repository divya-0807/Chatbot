const express = require("express");
const { createChat, getallChats, addConversation, getConversation, deleteChat } = require("../controllers/chatController");
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post('/new',isAuth,createChat);
router.get('/all',isAuth,getallChats);
router.post('/:id',isAuth,addConversation);
router.get('/:id',isAuth,getConversation);
router.delete('/:id',isAuth,deleteChat);

module.exports = router;