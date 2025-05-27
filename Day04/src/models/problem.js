const mongoose= require("mongoose");
const {schema} = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard']
    },
    tags:{
        type:String,
        enum:['array','Linkedlist','graph','dp'],
        required:true
    },
    visibelTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:
            {
                type:String,
                required:true
            }
        }
    ], 
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
            },
            intialCode:{
                type:String,
            },

        }
    ],
    problemCreator:{
        
        type: Schema.Types.objectId,
        ref: 'User',
        required:true

    },
    refrenceSolution:[
        {
            language:{
                type:String,
            },
            completeCode:{
                type:String,
            },

        }
    ]
}) 

const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem;