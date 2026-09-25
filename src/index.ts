//lance le serveur

import {app} from "./app";
import serverEnv from "./config/env";
import 'dotenv/config';



const port = serverEnv.PORT;
const host = serverEnv.HOST;


app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
