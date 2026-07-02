import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js"
import connectDB from "./src/config/database.js";
import config from "./src/config/config.js";



    await connectDB();

    app.listen(config.PORT, () => {
      console.log(` Server running on http://localhost:${config.PORT}`);
    }); 