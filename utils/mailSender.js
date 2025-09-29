const nodemailer=require("nodemailer")

const mailSender=async(email,title,body)=>{
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_PORT == 465, 
            auth: { 
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }

        })
        let info=await transporter.sendMail({
            from: `"StudyAmitAPk" <${process.env.EMAIL_USER}>`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info)
        return info
    }catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail: mailSender };
