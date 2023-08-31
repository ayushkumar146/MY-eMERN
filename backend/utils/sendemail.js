const nodemailer=require("nodemailer");

const sendemail=async(options)=>{

    const transporter=nodemailer.createTransport({
        service:process.env.SMTP_SERVICE,
        // port:465,
        // host:"smtp.gmail.com",
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    })
    const mailoptions={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
   await transporter.sendMail(mailoptions);
}




module.exports=sendemail;