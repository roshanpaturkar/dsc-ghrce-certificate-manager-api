const transporter = require('./account')

const sendOtp = async (name, otpData) => {
    const body = `<b>Hello ${name}</b><br><br>Your OTP is <b>${otpData.otp}</b>. <i>Be quick, it will be expired on ${otpData.expiryDateTime.toLocaleString()}</i>.<br>Thank You! <br><br><b>Best</b> <br><i>Server Admin</i>`
    await transporter.sendMail({
        from: '"DSC GHRCE 📪" certificate.dscghrce@gmail.com',
        to: otpData.email,
        subject: `Hello ${name} | OTP 👨‍💻 | noreply`,
        html: body
    })
}

module.exports = sendOtp