const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email,orderItems, totalPrice, paymentMethod) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += 
    `<div>
      <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b></div>
      <div>Sản phẩm hiện có giá <b>${order.price} VND</b> và đang được giảm: <b>${order.discount}%</b> </div>
      
    </div>`
    attachImage.push({path: order.image})
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt hàng tại shop NQH", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop NQH</b></div> 
          ${listItem}
          <div>Tổng số tiền thanh toán là <b>${totalPrice} VND</b></div> 
          <div>Phương thức thanh toán là  <b>${paymentMethod === 'later_money' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng paypal'}</b></div> 
          <div>Bên dưới là hình ảnh của sản phẩm</div>`,
    attachments: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}