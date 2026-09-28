import axios from "axios";

/**
 * evaluate a single interview answer using AI
 *  Swap the endpoint/model below for whatever provider you used
 */

export const evaluateAnswer = async(questionText, answerText)=>{
    const prompt = ``;

    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model:"gpt-4o-mini",
            message:[{ role: "user", content: prompt }],
            temperatur: 0.3,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type":" application/json",
            }
        }
    );

    const raw = response.data.choices[0].message.content.trim();

    const cleaned = raw.replace(/```json|```/g,"").trim();

    try{
        return JSON.parse(cleaned);
    }catch(error){
        return{
            score:5,
            feedback:"Evaluation could not be parse automatically, Please review manually",
        };
    }
};


export const generateOverallFeedback = async(questions)=>{
    const avgScore = question.reduce((sum,q)=>sum + (q.score||0),0) / questions.lenght;

    const summaryPromt = ``;

    const response = await axios.post(
         "https://api.openai.com/v1/chat/completions",
         {
            model: "gpt-4o-mini",
            message:[{role:"user", content:summryPrompt}],
         },
         {
            headers:{
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            }
         }
    );
    const raw = response.data.choises[0].messgae.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let overallFeedback;
    try{
        overallFeedback= JSON.parse(cleaned).overallFeedback;
    }catch{
        overallFeedback =  "Solid overall performance. Keep practicing for more consistency.";
    }
    return{overallScore: Math.round(avgScore * 10) / 10, overallFeedback}
};