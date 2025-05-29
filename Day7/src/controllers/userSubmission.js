const Problem= require("../models/problem");
const { getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
    try
    {
    const userId = req.result._id;
    const problemId = req.params.id;
    const {code,language} = req.body;


        if(!userId||!problemId||!code||!language)
        {
            res.status(400).send("Some Field Missing");
        }

        const problem= await Problem.findById(problemId);

        const submittedResult = await Submission.create({
            
            userId,
            problemId,
            code,
            language,
            testCasesPassed,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })        

        const languageId = getLanguageById(language);

         const submissions = Problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

                const submitResult = await submitBatch(submissions);
                const resultToken = submitResult.map((value)=> value.token);                        
        
                const testResult = await submitToken(resultToken);
                const testCasesPassed=0;
                let runtime=0;
                let memory=0;
                let status= 'accepted';
                let errorMessage=null;
                for(const test of testResult)
                {
                    if(test.status_id==3)
                    {
                    testCasesPassed++;
                    runtime+=parseFloat(test.runtime);
                    memory= Math.max(memory, test.memory);
                    }
                    else
                    {
                        if(test.status_id==4)
                        {
                            status='error';
                            errorMessage=test.stderr;
                        }
                        else
                        {
                            status='wrong';
                            errorMessage=test.stderr;
                        }
                    }
                }
                 
                submitResult.status= status;
                submitResult.testCasesPassed= testCasesPassed;
                submitResult.errorMessage= errorMessage;
                submitResult.runtime = runtime;
                submitResult.memory = memory;

               await submittedResult.save();

                res.status(201).send(submittedResult)
    }
    catch(err)
    {
        res.status(501).send("internal Server Error");
    }

}

module.exports= submitCode;