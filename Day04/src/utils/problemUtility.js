const axios = require('axios');

const getLanguageById= (lang)=>{

    const language ={
        "c++":110,
        "java":91,
        "javascript":102
    }

    return language[lang.toLowerCase()];
}

const submitBatch =async (submissions)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': 'e73a032eb5mshf98df3c8cf1137ep198847jsn62344ae0c4a6',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
}
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		
        return response.data;

        
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}

module.exports={getLanguageById,submissions};



