const axios = require('axios');

async function test() {
    try {
        const auth = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'vtu28375@gmail.com',
            password: 'password' // I am just guessing the password, in DB there should be some users. Let's register a new user instead to be sure.
        });
        const token = auth.data.token;
        console.log('Login success');
        
        const myEvents = await axios.get('http://localhost:8080/api/student/my-events', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(JSON.stringify(myEvents.data, null, 2));
    } catch(err) {
        console.error(err.response ? err.response.data : err.message);
    }
}
test();
