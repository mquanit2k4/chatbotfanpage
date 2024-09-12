import request from "request";
import dotenv from "dotenv";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

dotenv.config();
let callSendAPI = (response) => {
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

let handleGerStarted = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                text: "Em vui lòng nhắn 'casio' để được tư vấn chi tiết về khóa học nhé <3",
              };
            await this.callSendAPI(response);
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