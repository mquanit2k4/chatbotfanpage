import dotenv from "dotenv";
import request from "request";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;

dotenv.config();
let getHomepage = (req, res) => {
  return res.render("homepage.ejs");
};

let postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === verifyToken) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

function handleMessage(sender_psid, received_message) {
  let response = [];

  // Checks if the message contains text
  // Check words
  if (received_message.text === "casio") {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = [
      // Nếu nhiều tin nhắn phải tạo mảng các tin nhắn
      {
        text: `Chào em, admin xin giới thiệu tổng quan về khóa CASIO VD-VDC THPT 2K7 đến em: Khóa học sẽ cung cấp cho các bạn tất cả các phương pháp bấm máy + cách tư duy bản chất để làm các dạng toán từ mức VD (vận dụng, mức 8+ THPTQG) đến VDC (vận dụng cao, mức 9+ THPTQG) ở tất cả các chương trong chương trình Toán 12 (theo chuẩn chương trình mới). Có VIDEO + FILE hướng dẫn chi tiết phương pháp và bài tập kèm theo để các bạn luyện tập và nắm vững phương pháp làm bài. Để biết thêm thông tin em có thể xem ở bài viết https://www.facebook.com/dobknhe/posts/491015820355603 này nha 💕`,
      },
      {
        text: `Khi tham gia khoá học e không chỉ được học các phương pháp giải nhanh + CASIO các dạng bài trong đề thi THPTQG mà còn được ôn luyện các đề thi thử của Trường, Sở qua các buổi LIVE hằng tuần để phục vụ cho kì thi THPTQG 2025 luôn nha. Khoá này kéo dài đến lúc cb thi xong kì thi THPT luôn nhé 🥰`,
      },
      {
        text: `Song song với việc học các phương pháp qua VIDEO và học LIVE hằng tuần trong group kín. Các bạn còn được giải đáp thắc mắc đối với các bài tập có thể sử dụng CASIO được thông qua việc tham gia box chat có sự hỗ trợ bởi chính admin và các anh chị CTV 2k5, 2k6 có thành tích xuất sắc ✨`,
      },
      {
        text: `Học phí của khóa hiện tại là 200k nhưng nếu em muốn nhận voucher giảm giá chỉ còn 150K thì làm theo các bước like và share trong post này https://www.facebook.com/dobknhe/posts/491015820355603 và cap lại màn hình gửi cho ad nhaa ❤️`,
      },
    ];
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Đây có phải bức ảnh của bạn không?",
              subtitle: "Nhấn nút ở dưới để trả lời.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Có!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "Không!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Gọi hàm để gửi từng tin nhắn một
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another image." };
  } else if (payload === "GET_STARTED") {
    response = {
      text: "Em vui lòng nhắn 'casio' để được tư vấn chi tiết về khóa học nhé <3",
    };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}



// Sends response messages via the Send API
function callSendAPI(sender_psid, respons, callback) {
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
      uri: "https://graph.facebook.com/v2.6/me/messages",
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
let setupProfile = async (req, res) => {
  // Call Profile API Facebook
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://chatbotfanpage.onrender.com"],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      // Phải truyền cả access_token vào uri chứ không biến thay thế sẽ bị lỗi "Invalid OAuth access token"
      uri: `https://graph.facebook.com/v20.0/me/messenger_profile?access_token=EAAOu9I4yDOIBOwD8T5ca3bZCZBMhfamZC9XLLEeNtpTlR2132uMvTORDdy0u7WNI93Wat9LQ17FnZCiQUiunfY50R5oK5zzW5a3MSwMxTe9u5LOxRNE65EqRhBv7E6ZCUXkfV2MLRFAOn2NVZCedV4BV0NjiFBICutIFKqVZCL96Mwef5XMes8EmuICk2ODluEk`,
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log(body);
        console.log("Setup user profile success!");
      } else {
        console.error("Unable to Setup user profile:" + err);
      }
    }
  );

  return res.send("Setup user profile success!");
};

export default {
  getHomepage,
  getWebhook,
  postWebhook,
  setupProfile,
};
