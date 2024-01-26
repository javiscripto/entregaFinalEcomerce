import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: { type: String  },
    last_name: { type: String  },
    email: { type: String  },
    age: { type: Number },
    password: { type: String  },
    carts:[{type: mongoose.Schema.Types.ObjectId, ref:"carts"}],
    role: { type: String },
    documents:[
        {
            name:{type: String},
            reference:{type: String}
        }
    ],
    profilePhoto:{type:String},
    last_Conection:{type:Date}
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
