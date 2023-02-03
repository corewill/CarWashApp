const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://hrhviqtzmgmsttkvotvq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaHZpcXR6bWdtc3R0a3ZvdHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2NjIzNjYsImV4cCI6MTk5MDIzODM2Nn0.AiiB8o314C_rkOdneQk_vwvzxXO4W3lwHN-8-_NKEsA";
const bodyParser = require("body-parser");
// const options = {
//   schema: 'public',
//   headers: { 'x-my-custom-header': 'my-app-name' },
//   autoRefreshToken: true,
//   persistSession: true,
//   detectSessionInUrl: true,
// }
const supabase = createClient(supabaseUrl, supabaseKey);

const express = require("express");
const { json } = require("sequelize");
const app = express()
const PORT = 3026
app.use(express.json())

app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(express.static((__dirname +'/public')));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get("/", (req, res) => {
    res.render("pages/index")
})
app.get("/login", (req, res) => {
    res.render("pages/login")
})

app.get("/signup", (req, res) => {
    res.render("pages/signup")
})

app.get("/signin", (req, res) => {
    res.render("pages/login")
})
app.get("/Appointements", (req, res) => {
    res.render("pages/Appointements")
})

app.get("/signedin", (req, res) => {
    res.render("pages/signedin")
})

app.get("/Appointments", (req, res) => {
    res.render("pages/Appointments")
})



app.post("/signup", async (req, res) => {
    const { email, password,} = req.body
    console.log(password)
    const { data, error } = await supabase.auth.signUp({
      
      email,
      password

    })
    console.log(error)
    if(data){
      res.redirect("/login")
      return
    } else {
      res.send("Error signing up")
    }
})

app.post('/signin', async (req, res) => {
  const { email, password } = req.body

  try {
    const {user, error} = await supabase.auth.signInWithPassword({ email, password })
    console.log(error)
    
    if(user.data){
      res.render("pages/signedin")
      return
    }}
   catch (error) {

      res.status(400).send(error)

  }})

app.post("/signedin", async (req, res) => {
  const { date, customer_id, package_id } = req.body;
  try {
    const { data, error } = await supabase.from("Appointements").insert([
      {
        date,
        customer_id,
        package_id,
      },
    ]);
    if (data) {
      res.status(200).render("pages/Appointments", { user: data });
      return;
    } else {
      res.status(400).send(error);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/logout", async (req, res) => {
  const { email, password } = req.body;
  try {
    let { data, error } = await supabase.auth.signOut();
    ({
      email,
      password,
    });
    if (data) {
      res.render("pages/signin", { user: data });
      return;
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// app.post("/Packages", async (req, res) => {
//   const { name, description, Price } = req.body;
//   try {
//     const { data, error } = await supabase.from("Packages").insert([
//       {
//         name,
//         description,
//         Price,
//       },
//     ]);
//     res.json({
//       message: " Package Added",
//     });
//     res.status(200);
//     res.render("pages/index", { user: data });
//     return;
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.post("/Customers", async (req, res) => {
// async function main() {
//   const { data, error } = await supabase
//     .from("Appointements")
//     .select("*")
//     .order("date", { ascending: true });
//   console.log(data);
// }
// main();
//   const { name, email, phone } = req.body;
//   try {
//     const { data, error } = await supabase.from("Customers").insert([
//       {
//         name,
//         email,
//         phone,
//       },
//     ]);
//     res.json({
//       message: " Customer Added",
//     });
//     res.status(200);
//     res.render("pages/index", { user: data });
//     return;
//   } catch (error) {
//     res.status(400).send(error)
//   }
// });
  
// app.use((req, res) => {
//   async ({ params, req}) => {
//     const formData = await req.json()
//     const email = formData.email
//     const password = formData.password
//     console.log("formData", { email, password})
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//   })
//   }
// })


/**
* Make a request from the client to your server function
*/
// async function makeApiRequest() {
//   const token = newClient.session()?.access_token

//   await fetch('https://example.com/withAuth', {
//      method: 'GET',
//      withCredentials: true,
//      credentials: 'include',
//      headers: {
//       'Content-Type': 'application/json',
//       'Authorization': bearer, // Your own auth
//       'X-Supabase-Auth': token, // Set the Supabase user
//      }
//   })
// }

// /**
// * Use the Auth token in your server-side function.
// */
// async function apiFunction(req, res) {
//   const { access_token } = req.get('X-Supabase-Auth')

//   // You can now use it within a Supabase Client
//   const supabase = createClient("https://xyzcompany.supabase.co", "public-anon-key")
//   const { user, error } = supabase.auth.setAuth(access_token)

//   // This client will now send reques as this user
//   const { data } = await supabase.from('your_table').select()
// }



app.listen(PORT, console.log(`Listening on port ${PORT}`))