const db = require('../repositories/faDefintionRepository');
const Error = require('../models/error.js');

/**
 * EDIT Questions
 */
const updateQuestion = " Update question set  questiontype=$1, questiontext=$2,isdependent=$3,data1=$4,data2=$5,data3=$6 where questionid = $7";
exports.editQuestion = async function editQuestion(req, res) {
        const {
            QuestionType,
            QuestionText,
            IsDependent,
            Data1,
            Data2,
            Data3
        } = req.body;
        const QuestionId = req.params.id;
        if (QuestionId == null || QuestionType == null || QuestionText == null || IsDependent == null) {
            res.status(404);
            const error = new Error(4, "Invalid question id.");
            res.send(error);
            return;
        }
        try {
            const updateRes = await db.pool.query(updateQuestion, [QuestionType, QuestionText, IsDependent, Data1, Data2, Data3, QuestionId]);
            if (updateRes.rowCount === 0) {
                const error = new Error(5, "Invalid question id.");
                res.status(404);
                res.send(error);
                return;
            }
            res.status(200);
            res.send({
                success: true
            });
        } catch (err) {
            res.status(500);
            const error = new Error(0, "Unknown server error.");
            res.send(error);
            return;
        }
    }
    /**
     * DELETE Question
     */
exports.deleteQuestion = async function deleteQuestion(req, res) {
        const id = req.params.id;
        if (id == null) {
            res.status(404);
            const error = new Error(0, "Bad json format.");
            res.send(error);
            return;
        }
        const deleteQuestion1 = " Delete from question_answer where questionid = $1";
        const selectAnswers = "Select answerid from question_answer where questionid=$1";
        const deleteAnswer = "Delete from answer where answerid = $1";
        const deleteQuestion2 = " Delete from question where questionid = $1";
        const deleteUserResponse = "Delete from userResponse where questionid = $1";
        try {
            const deleteUserRes = await db.pool.query(deleteUserResponse, [id]);//deletes from user responses
            const selectRes = await db.pool.query(selectAnswers, [id]);//selects all answersid that the question has
            const deleteRes1 = await db.pool.query(deleteQuestion1, [id]);//deletes the question from question_answer

            var bar = await new Promise((resolve, reject) => {
                //if it has no elements resolve the promise
                if(selectRes.rowCount==0)resolve();
                selectRes.rows.forEach(async(answer, index, array) => {
                    await db.pool.query(deleteAnswer, [answer.answerid]);
                    if (index === array.length - 1) resolve();
                });

            });
            const deleteRes2 = await db.pool.query(deleteQuestion2, [id]);//deletes the question 
            res.status(200);
            res.send({
                success: true
            });
            return;
        } catch (err) {
            console.log("Error Deleting Question \n"+err);
            res.status(500);
            const error = new Error(1, "Unknow server error");
            res.send(error);
            return;
        }
    }
    /**
     * CREATE Question
     */
const insertQuestion = "Insert into question(QuestionType,QuestionText,IsDependent,Data1,Data2,Data3,CampaignId) values($1,$2,$3,$4,$5,$6,$7) Returning *";
const insertAnswer = "Insert into answer(answertext,isimage,base64) values ($1,$2,$3) Returning *";
const insertQuestionAnswer = "Insert into question_answer(questionid,answerid) values ($1,$2)";
exports.addQuestion = async function addQuestion(req, res) {

    let {
        CampaignId,
        QuestionType,
        QuestionText,
        IsDependent,
        Data1,
        Data2,
        Data3,
        Answers
    } = req.body;

    if ((CampaignId == null && IsDependent == false)|| QuestionType == null || QuestionText == null || IsDependent == null || (QuestionType !== "Text" && Answers == null)) {
        res.status(404);
        const error = new Error(0, "Bad json format.");
        res.send(error);
        return;
    }
    if(IsDependent == true)CampaignId=null;
    let QuestionId = null;
    try {
        const insertRes = await db.pool.query(insertQuestion, [QuestionType, QuestionText, IsDependent, Data1, Data2, Data3, CampaignId]);
        QuestionId = insertRes.rows[0].questionid;
        if (QuestionType === 'Text') {
            const insertRes = await db.pool.query(insertQuestionAnswer, [QuestionId, null]);
        } else {
            for (let i = 0; i < Answers.length; i++) {
                let answer = Answers[i];
                const insertRes = await db.pool.query(insertAnswer, [answer.AnswerText, answer.IsAPicture,answer.Base64]);
                const AnswerId = insertRes.rows[0].answerid;
                const insertResAns = await db.pool.query(insertQuestionAnswer, [QuestionId, AnswerId]);
            }
        }
    } catch (err) {
        res.status(500);
        console.log(err);
        const error = new Error(1, "Unknow server error");
        res.send(error);
        return;
    }
    res.status(200);
    res.send({
        success: true
    });
}

/**
 * Get Answers By Question Id
 */
const selectAnswers = " Select a.* from answer a,question q,question_answer qa where a.answerid = qa.answerid and q.questionid = qa.questionid and q.questionid = $1";
exports.getAnswersByQuestionId = async function getAnswers(req, res) {
    const QuestionId = req.params.id;
    if (QuestionId == null) {
        res.status(404);
        const error = new Error(1, "Invalid json format.");
        res.send(error);
        return;
    }
    try {
        const selectRes = await db.pool.query(selectAnswers, [QuestionId]);
        const returnJson = [];
        for (let i = 0; i < selectRes.rowCount; i++) {
            const answer = selectRes.rows[i];
            const answerJson = {};
            answerJson.AnswerText = answer.answertext;
            answerJson.IsAPicture = answer.isimage;
            answerJson.Base64 = answer.base64;
            returnJson.push(answerJson);
        }
        res.status(200);
        res.send(returnJson);
    } catch (err) {
        res.status(500);
        const error = new Error(0, "Unknown server error");
        res.send(error);
    }
}

const selectDependet = "Select * from question where campaignid is null";
exports.getDependentQuestions = async function getDependentQuestions(req,res){

    const returnJSON = [];
    try{


        const selectQuestion =await db.pool.query(selectDependet,[]);

        for(let i = 0 ; i < selectQuestion.rowCount;i++){

            const question = selectQuestion.rows[i];
            let questionJSON = {};
            questionJSON.QuestionId = question.questionid;
            questionJSON.QuestionType = question.questiontype;
            questionJSON.QuestionText = question.questiontext;
            questionJSON.Data1 = question.data1;
            questionJSON.Data2 = question.data2;
            questionJSON.Data3 = question.data3;
            questionJSON.IsDependent = question.isdependent;

            

            const selectAnswer = await db.pool.query(selectAnswers, [questionJSON.QuestionId]);
            const answersJSON = [];
            for (let i = 0; i < selectAnswer.rowCount; i++) {
                const answer = selectAnswer.rows[i];
                const answerJson = {};
                answerJson.AnswerText = answer.answertext;
                answerJson.IsAPicture = answer.isimage;
                answerJson.Base64 = answer.base64;
                answersJSON.push(answerJson);
            }

            questionJSON.QuestionAnswers = answersJSON;

            returnJSON.push(questionJSON);  

        }

        res.status(200);
        res.send(returnJSON);

    }catch(err){
        console.log(err);
        res.status(500);
        const error = new Error(0, "Unknown server error");
        res.send(error);
    }

}