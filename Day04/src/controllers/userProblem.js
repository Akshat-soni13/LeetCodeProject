const getLanguageById = require("../utils/problemUtility")

const createProblem = async(req,res)=>{

    const {title,description,difficulty,tags,visibelTestCases,hiddenTestCases,startCode,problemCreator}= req.body;

    try{

        for(const{language,completeCode} of  refrenceSolution ){
            const languageId = getLanguageById(language);

        const submissions= visibelTestCases.map((input,output)=>(
            {
            source_code:completeCode,
            language_id: languageId,
            stdin: input,
            expected_output:output
        }
        ))
        }

        const submitResult= await submitBatch(submissions)
        {
            

        }

    }catch(err)
    {

    }
}