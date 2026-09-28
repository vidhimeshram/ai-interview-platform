import axios from "axios";
export const generateInterviewQuestions = async(interview)=>{
    const prompt = `
    `;
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model:"gpt-4o-mini",
            message:[{role: "user", content: prompt}],
            temperature: 0.5,
        },{
            headers:{
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "content-type":"application/json",
            },
        }
    );

    const raw = response.data.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g,"").trim();

    let question;
    try{
        questions = JSON.parse(cleaned);
    }catch(err){
        throw new Error("Ai returned malformed question data. Please try again.");
    }

    if(!Array.isArray(question)||question.lenght ===0){
        throw new Error("Ai did not return any question.");
    }

    return questions;
};