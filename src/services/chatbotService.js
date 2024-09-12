import request from "request";
import dotenv from "dotenv";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = `https://bit.ly/imagestarted`;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
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
};

let getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: "GET",
      },
      (err, res, body) => {
        console.log(body);
        if (!err) {
          body = JSON.parse(body);
          let userName = `${body.last_name} ${body.first_name}`;
          resolve(userName);
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};
let handleGerStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = await getUserName(sender_psid);
      let response1 = {
        text: `Chào ${userName}, em vui lòng nhắn "casio" để được tư vấn chi tiết về khóa học nhé <3`,
      };

      let response2 = getStartedTemplate();
      // Send text message
      await callSendAPI(sender_psid, response1);

      // Send template message
      await callSendAPI(sender_psid, response2);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getStartedTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "KHÓA HỌC CASIO VD-VDC 9+ 2K7",
            subtitle: "Dưới đây là 2 khóa học CASIO của page",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "KHÓA THPTQG 2K7",
                payload: "THPT",
              },
              {
                type: "postback",
                title: "KHÓA THPTQG + HSA 2K7",
                payload: "HSA",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendInfoCourseSingle = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = {
        text: `Học phí của khóa hiện tại là 200k nhưng nếu em muốn nhận voucher giảm giá chỉ còn 150K thì làm theo các bước like và share trong post này https://www.facebook.com/dobknhe/posts/491015820`,
      };


      let response2 = {
        text: `Khi tham gia khoá học e không chỉ được học các phương pháp giải nhanh + CASIO các dạng bài trong đề thi THPTQG mà còn được ôn luyện các đề thi thử của Trường, Sở qua các buổi LIVE hằng tuần để phục vụ cho kì thi THPTQG 2025 luôn nha. Khoá này kéo dài đến lúc cb thi xong kì thi THPT luôn nhé 🥰`,
      };

      let response3 = {
        text: `Chào em, admin xin giới thiệu tổng quan về khóa CASIO VD-VDC THPTQG 2K7 đến em: Khóa học sẽ cung cấp cho các bạn tất cả các phương pháp bấm máy + cách tư duy bản chất để làm các dạng toán từ mức VD (vận dụng, mức 8+ THPTQG) đến VDC (vận dụng cao, mức 9+ THPTQG) ở tất cả các chương trong chương trình Toán 12 (theo chuẩn chương trình mới). Có VIDEO + FILE hướng dẫn chi tiết phương pháp và bài tập kèm theo để các bạn luyện tập và nắm vững phương pháp làm bài. Để biết thêm thông tin em có thể xem ở bài viết https://www.facebook.com/dobknhe/posts/491015820355603 này nha 💕`,
      };

      let response4 = {
        text: `Song song với việc học các phương pháp qua VIDEO và học LIVE hằng tuần trong group kín. Các bạn còn được giải đáp thắc mắc đối với các bài tập có thể sử dụng CASIO được thông qua việc tham gia box chat có sự hỗ trợ bởi chính admin và các anh chị CTV 2k5, 2k6 có thành tích xuất sắc ✨`,
      };

      //   let response5 = getInfoCourseTemplate();
      //   // Send text message
      //   await callSendAPI(sender_psid, response);
      await callSendAPI(sender_psid, response3);
      console.log('Sent response1');
      await sleep(1000); 
      await callSendAPI(sender_psid, response2);
      console.log('Sent response1');
      await sleep(1000); 
      await callSendAPI(sender_psid, response4);
      console.log('Sent response1');
      await sleep(1000); 
      await callSendAPI(sender_psid, response1);
      console.log('Sent response1');
      await sleep(1000); 

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getInfoCourseTemplate = () => {};
export default {
  handleGerStarted,
  callSendAPI,
  handleSendInfoCourseSingle,
};
