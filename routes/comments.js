const { Router } = require('express')
const path = require('path')
const fs = require('fs-extra')
const generateId = require('../utils/generateId')
const db = path.join(__dirname, '../db/comments')

const router = Router()

router.get('/', async (req, res) => {
  const commentFilenames = await fs.readdir(db)

  const commentPromises = commentFilenames.map(async (filename) => {
    const commentJSON = await fs.readFile(`${db}/${filename}`, 'utf8')

    return JSON.parse(commentJSON)
  })

  const comments = await Promise.all(commentPromises)

  res.status(200).json(comments)
})

router.post('/', async (req, res) => {
  const { text } = req.query

  if (text !== undefined) {
    const comment_id = generateId()

    const comment = {
      comment_id,
      text,
      likes: 0
    }

    commentJSON = JSON.stringify(comment)

    await fs.writeFile(`${db}/${comment_id}.json`, commentJSON, 'utf8')

    res.status(200).send(commentJSON)
  } else {
    res.status(400).json({
      message: 'Вы не отправили текст комментария (параметр text)'
    })
  }
})

// like comment
router.patch('/', async (req, res) => {
  const { comment_id } = req.query

  if (comment_id) {
    try {
      const comment = JSON.parse(await fs.readFile(`${db}/${comment_id}.json`))

      const newComment = {
        ...comment,
        likes: comment.likes + 1 
      }

      newCommentJSON = JSON.stringify(newComment)

      await fs.writeFile(`${db}/${comment_id}.json`, newCommentJSON, 'utf8')

      res.status(200).send(newCommentJSON)
    } catch (e) {
      res.status(404).json({
        message: 'Комментарий с таким comment_id не найден'
      })
    }
  } else {
    res.status(400).json({
      message: 'Вы не отправили comment_id'
    })
  }
})

router.delete('/', async (req, res) => {
  const { comment_id } = req.query

  if (comment_id) {
    try {
      const comment = await fs.readFile(`${db}/${comment_id}.json`)

      await fs.unlink(`${db}/${comment_id}.json`)

      res.status(200).send(comment)
    } catch (e) {
      res.status(404).json({
        message: 'Комментарий с таким comment_id не найден'
      })
    }
  } else {
    res.status(400).json({
      message: 'Вы не отправили comment_id'
    })
  }
})

module.exports = router