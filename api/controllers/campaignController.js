const db = require('../repositories/faDefintionRepository');
const Error = require('../models/error.js');

/**
 * GET campagin by ID
 */
const selectCampaign = "Select c.* From Campaign c Where c.CampaignID=$1";
const selectQuestion = "Select q.* From Campaign c, Question q Where c.CampaignID = q.CampaignID and c.CampaignID=$1";
const selectAnswers = `Select a.* from Question q,Answer a,Question_Answer qa where q.QuestionID = qa.QuestionID and a.AnswerID = qa.AnswerID and q.QuestionID = $1`;
const selectDevices = "Select * from fadevice where campaignid = $1";
exports.getCampaignById = async function getCampaign(req, res) {
    try {
        const responseJSON = {};
        const campaign_id = req.params.campaignid;
        const campaignRes = await db.pool.query(selectCampaign, [campaign_id]);
        if (campaignRes.rowCount === 0) {
            res.status(404);
            const error = new Error(4, "Invalid campgain id.");
            res.send(error);
            return;
        }
        responseJSON.CampaignId = campaignRes.rows[0].campaignid;
        responseJSON.Name = campaignRes.rows[0].name;
        responseJSON.StartDate = campaignRes.rows[0].startdate;
        responseJSON.EndDate = campaignRes.rows[0].enddate;

        const questions = [];
        const questionsRes = await db.pool.query(selectQuestion, [campaign_id]);

        for (let i = 0; i < questionsRes.rowCount; i++) {
            let question = questionsRes.rows[i];
            const id = question.questionid;

            const questionJSON = {};
            questionJSON.QuestionId = question.questionid;
            questionJSON.QuestionType = question.questiontype;
            questionJSON.QuestionText = question.questiontext;
            questionJSON.IsDependent = question.isdependent;
            questionJSON.Data1 = question.data1;
            questionJSON.Data2 = question.data2;
            questionJSON.Data3 = question.data3;

            const answerRes = await db.pool.query(selectAnswers, [id]);

            const QuestionAnswers = [];

            for (let i = 0; i < answerRes.rowCount; i++) {
                let answer = answerRes.rows[i];
                QuestionAnswers.push({
                    QuestionId: id,
                    AnswerId: answer.answerid,
                    Answer: {
                        AnswerId: answer.answerid,
                        AnswerText: answer.answertext,
                        IsAPicture: answer.isimage,
                        Base64: answer.base64
                    }
                });
            }
            questionJSON.QuestionAnswers = QuestionAnswers;
            questions.push(questionJSON);
        }

        const devices = [];

        const devicesRes =await db.pool.query(selectDevices,[campaign_id]);

        for(let i = 0 ; i<  devicesRes.rowCount;i++){
            const device = devicesRes.rows[i];
            devices.push({deviceId:device.deviceid,name:device.devicename});
        }

        responseJSON.success = true;
        responseJSON.Questions = questions;
        responseJSON.Devices = devices;
        res.send(responseJSON);
        return;

    } catch (err) {
        console.log(err);
        res.status(500);
        const error = new Error(0, "Unknown server error.");
        res.send(error);
    }
}


/**
 * CREATE CAMPAIGN 
 */
const insertCampaign = "Insert into campaign(Name,StartDate,EndDate) values ($1,To_Date($2, 'dd-mm-yyyy'),To_Date($3, 'dd-mm-yyyy')) Returning *";
const insertQuestion = "Insert into question(QuestionType,QuestionText,IsDependent,Data1,Data2,Data3,CampaignId) values($1,$2,$3,$4,$5,$6,$7) Returning *";
const insertAnswer = "Insert into answer(answertext,isimage,base64) values ($1,$2,$3) Returning *";
const insertQuestionAnswer = "Insert into question_answer(questionid,answerid) values ($1,$2)";
const updateDevice  ="Update FADevice set campaignid = $1 where deviceid=$2";
exports.createCampaign = async function createCampaign(req, res) {
    const {
        Name,
        StartDate,
        EndDate,
        Questions,
        Devices
    } = req.body;

    if (Name == null || StartDate == null || EndDate == null || Questions == null || Questions.length == null) {
        res.status(300);
        const error = new Error(1, "Bad json format.");
        res.send(error);
        return;
    }
    let CampaignId = null;
    try {
        const insertRes = await db.pool.query(insertCampaign, [Name, StartDate, EndDate], async function(err, result, fields) {
            if (err) {
                res.status(310);
                res.send({
                    errror: err
                });
                return;
            } else {
                CampaignId = result.rows[0].campaignid;
                //ovdje dodaje pitanja i odgovore im
                for (let i = 0; i < Questions.length; i++) {
                    let QuestionId = null;
                    const {
                        QuestionType,
                        QuestionText,
                        IsDependent,
                        Data1,
                        Data2,
                        Data3
                    } = Questions[i];
                    const Answers = Questions[i].Answers;
                    try {
                        const insertRes = await db.pool.query(insertQuestion, [QuestionType, QuestionText, IsDependent, Data1, Data2, Data3, CampaignId], async function(err, result, fields) {
                            if (err) {} else {
                                QuestionId = result.rows[0].questionid;
                                for (let i = 0; i < Answers.length; i++) {
                                    let answer = Answers[i];
                                    try {
                                        const insertRes = await db.pool.query(insertAnswer, [answer.AnswerText, answer.IsAPicture,answer.Base64], async function(err, result, fields) {
                                            if (!err) {
                                                const AnswerId = result.rows[0].answerid;
                                                const insertRes = await db.pool.query(insertQuestionAnswer, [QuestionId, AnswerId]);
                                            }
                                        });

                                    } catch (err) {
                                        continue;
                                    }
                                }
                            }
                        });

                    } catch (err) {
                        continue;
                    }
                }
                //ovdje dodaje sve FA devices
                if(Devices!=null &&  Devices.length != 0){

                    for(let i = 0 ; i < Devices.length ; i++){
                        const updateDeviceRes = await db.pool.query(updateDevice,[CampaignId,Devices[i].DeviceId]);
                    }


                }


                res.status(200);
                res.send({
                    success: true,
                    CampaignId:CampaignId
                });
                return;
            }
        });
    } catch (err) {
        res.status(400);
        res.send({
            error: err
        });
        return;
    }
   
}

/**
 * EDIT CAMPAGIN
 */
const updateCampaign = " Update campaign set name=$1,startdate=To_Date($2, 'dd-mm-yyyy'),enddate=To_Date($3, 'dd-mm-yyyy') where campaignid = $4";
exports.editCampaign = async function editCampaign(req, res) {
    const {
        CampaignId,
        Name,
        StartDate,
        EndDate,
        Devices
    } = req.body;
    if (CampaignId == null || Name == null || StartDate == null || EndDate == null) {
        res.status(300);
        const error = new Error(1, "Bad json format.");
        res.send(error);
        return;
    }
    try {
        const updateRes = await db.pool.query(updateCampaign, [Name, StartDate, EndDate, CampaignId]);
        if(Devices != null && Devices.length!=0){

            for(let i = 0 ; i <Devices.length;i++){

            const updateDeviceRes = db.pool.query(updateDevice,[CampaignId,Devices[i].DeviceId]);

            }
        }
        res.status(200);
        res.send({
            success: true
        });

    } catch (err) {
        res.status(500);
        const error = new Error(0, "Unknown server error.");
        console.log(err);
        res.send(error);
        return;
    }
}

/**
 * DELETE CAMPAIGN
 */
const deleteCampaignQuery = "Delete from Campaign where CampaignId = $1";
exports.deleteCampaign = async function deleteCampaign(req, res) {
        const CampaignId = req.params.campaignid;
        if (CampaignId == null) {
            res.status(300);
            const error = new Error(1, "Bad json format.");
            res.send(error);
            return;
        }
        //ovo nece raditi jer treba dodati cascade u foreign keys nemam blage kako to ide neka neko vidi i doda
        try {
            const updateRes = await db.pool.query(deleteCampaignQuery, [CampaignId]);
            res.status(200);
            res.send({
                success: true
            });

        } catch (err) {
            res.status(500);
            console.log(err);
            const error = new Error(0, "Unknown server error.");
            res.send(error);
            return;
        }
    }
    /**
     * GET ALL CAMPAINS
     */
const selectAllCampaings = "SELECT * FROM Campaign";
exports.getAllCampaigns = async function getAllCampaigns(req, res) {
    try {
        const selectRes = await db.pool.query(selectAllCampaings);
        const returnJson = [];
        for (let i = 0; i < selectRes.rowCount; i++) {
            let campaign = selectRes.rows[i];
            let campaignJson = {};
            campaignJson.CamapignId = campaign.campaignid;
            campaignJson.Name = campaign.name;
            campaignJson.StartDate = campaign.startdate;
            campaignJson.EndDate = campaign.enddate;
            returnJson.push(campaignJson);
        }
        returnJson.success = true;
        res.status(200);
        res.send(returnJson);

    } catch (err) {
        res.status(500);
        const error = new Error(0, "Unknown server error.");
        res.send(error);
        console.log(err);
    }
}