import request from "request";
import dotenv from "dotenv";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

dotenv.config();
let callSendAPI = (sender_psid, response) => {
// Construct the message body
let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,  
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v9.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );   
}

let getUserName = async (sender_psid) => {
    let userName = '';
      // Send the HTTP request to the Messenger Platform
     await request(
        {
          uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: "GET",
        },
        (err, res, body) => {
          console.log(body);
          if (!err) {
            response = JSON.parse(res);
            userName = `${response.first_name} ${response.last_name}`;
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );   
    return userName;
}
let handleGerStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid);
            let response = {
                text: `Chào ${userName}, em vui lòng nhắn 'casio' để được tư vấn chi tiết về khóa học nhé <3`,
              };
            await callSendAPI(sender_psid, response);
            resolve('done');
        } catch (e) {   
            reject(e);
        }
});
}

export default {
    handleGerStarted,
    callSendAPI,
};