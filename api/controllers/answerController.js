const rep = require('../repositories/faDefintionRepository');
const db = rep.pool;
const Error = require('../models/error.js');

const getAnswer = "Select * from answer WHERE answerid = $1";
exports.getAnswerById = async function getAnswerById(req, res) {
        const id = req.params.id;
        if (id == null) {
            res.status(404);
            const error = new Error(1, "Invalid json format.");
            res.send(error);
            return;
        }
        try {
            const result = await db.pool.query(getAnswer, [id]);
            if (result.rowCount === 0) {
                res.status(404);
                const error = new Error(1, "Invalid answer id.");
                res.send(error);
                return;
            }
            const response = {
                success: true,
                AnswerId: result.rows[0].answerid,
                Answertext: result.rows[0].answertext,
                IsImage: result.rows[0].isimage,
                Base64 : result.rows[0].base64
            }
            res.status(200);
            res.send(response);
        } catch (err) {
            res.status(500);
            console.log(err);
            const error = new Error(0, "Unknown server error");
            res.send(error);
        }
    }
    /**
     * Create Answer
     */
exports.createAnswer = async function addAnswer(req, res) {
        const {
            QuestionId,
            Answer
        } = req.body;
        if (QuestionId == null || Answer == null || Answer.AnswerText == null || Answer.IsAPicture == null) {
            res.status(300);
            const error = new Error(1, "Invalid json format.");
            res.send(error);
            return;
        }
        const insertAnswer = "Insert into answer(answertext,isimage,base64) values ($1,$2,$3) Returning *";
        const insertQuestionAnswer = "Insert into question_answer(questionid,answerid) values ($1,$2)";
        try {
            const insertRes = await db.pool.query(insertAnswer, [Answer.AnswerText, Answer.IsAPicture,Answer.Base64]);
            const AnswerId = insertRes.rows[0].answerid;
            const insertRes2 = await db.pool.query(insertQuestionAnswer, [QuestionId, AnswerId]);
            res.status(200);
            res.send({
                success: true,
                AnswerId: insertRes.rows[0].answerid
            });
        } catch (err) {
            console.log(err);
            res.status(500);
            const error = new Error(0, "Unknown server error.");
            res.send(error);
            return;
        }
    }



    
    /**
     * DELETE ANSWER BY ID
     */
const deleteAnswerQuery = "Delete  from Answer WHERE answerid = $1";
exports.deleteAnswerById = async function deleteAnswerById(req, res) {
    const id = req.params.id;
    if (id == null) {
        res.status(404);
        const error = new Error(1, "Invalid json format.");
        res.send(error);
        return;
    }
    try {
        const result = await db.pool.query(deleteAnswerQuery, [id]);
        if (result.rowCount === 0) {
            res.status(404);
            const error = new Error(4, "Invalid answer id.");
            res.send(error);
            return;
        }
        res.status(200);
        res.json({
            success: true
        });
    } catch (err) {
        res.status(500);
        const error = new Error(0, "Unknown server error.");
        res.send(error);
        return;
    }

}