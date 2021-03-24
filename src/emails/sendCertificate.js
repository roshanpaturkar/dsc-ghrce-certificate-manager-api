const transporter = require('./account')

const sendCertificate = async (certificateData, eventName) => {
    const body = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<style type="text/css">
		body {
			margin: 0;
			padding: 0;
		}

		table,
		td,
		tr {
			vertical-align: top;
			border-collapse: collapse;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors=true] {
			color: inherit !important;
			text-decoration: none !important;
		}
	</style>
	<style type="text/css" id="media-query">
		@media (max-width: 520px) {

			.block-grid,
			.col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}

			.block-grid {
				width: 100% !important;
			}

			.col {
				width: 100% !important;
			}

			.col_cont {
				margin: 0 auto;
			}

			img.fullwidth,
			img.fullwidthOnMobile {
				max-width: 100% !important;
			}

			.no-stack .col {
				min-width: 0 !important;
				display: table-cell !important;
			}

			.no-stack.two-up .col {
				width: 50% !important;
			}

			.no-stack .col.num2 {
				width: 16.6% !important;
			}

			.no-stack .col.num3 {
				width: 25% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num5 {
				width: 41.6% !important;
			}

			.no-stack .col.num6 {
				width: 50% !important;
			}

			.no-stack .col.num7 {
				width: 58.3% !important;
			}

			.no-stack .col.num8 {
				width: 66.6% !important;
			}

			.no-stack .col.num9 {
				width: 75% !important;
			}

			.no-stack .col.num10 {
				width: 83.3% !important;
			}

			.video-block {
				max-width: none !important;
			}

			.mobile_hide {
				min-height: 0px;
				max-height: 0px;
				max-width: 0px;
				display: none;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide {
				display: block !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
	<table class="nl-container" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" cellpadding="0" cellspacing="0" role="presentation" width="100%" bgcolor="transparent" valign="top">
		<tbody>
			<tr style="vertical-align: top;" valign="top">
				<td style="word-break: break-word; vertical-align: top;" valign="top">
					<div style="background-color:transparent;">
						<div class="block-grid " style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #fcfcfc;">
							<div style="border-collapse: collapse;display: table;width: 100%;background-color:#fcfcfc;">
								<div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
									<div class="col_cont" style="width:100% !important;">
										<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
											<div class="img-container center fixedwidth" align="center" style="padding-right: 0px;padding-left: 0px;">
												<div style="font-size:1px;line-height:35px">&nbsp;</div><img class="center fixedwidth" align="center" border="0" src="https://firebasestorage.googleapis.com/v0/b/dscghrcecertificates.appspot.com/o/DSC%20GHRCE%20Light%20Vertical-Logo%20(1).png?alt=media&amp;token=11801122-d8ed-4e12-bcfa-d8edfe485dc9" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 425px; display: block;" width="425">
												<div style="font-size:1px;line-height:35px">&nbsp;</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style="background-color:transparent;">
						<div class="block-grid " style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #4286f5;">
							<div style="border-collapse: collapse;display: table;width: 100%;background-color:#4286f5;">
								<div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
									<div class="col_cont" style="width:100% !important;">
										<!--[if (!mso)&(!IE)]><!-->
										<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">											<div style="color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:60px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
												<div class="txtTinyMce-wrapper" style="line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #ffffff; mso-line-height-alt: 14px;">
													<p dir="ltr" style="line-height: 1.2; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 15px; mso-line-height-alt: 18px; margin: 0;"><span style="font-size: 15px;"><strong>Dear ${certificateData.name},</strong></span></p>
													<p dir="ltr" style="line-height: 1.2; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px; margin: 0;">&nbsp;</p>
													<p dir="ltr" style="line-height: 1.2; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 13px; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">Thank you for attending our event&nbsp; <strong>${eventName}</strong>. We hope you had a great learning experience with us. Your certificate ID is <strong>${certificateData.certificateID}</strong>. To get your certificate click on the Certificate button below.</span></p>
													<p dir="ltr" style="line-height: 1.2; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px; margin: 0;">&nbsp;</p>
													<p dir="ltr" style="line-height: 1.2; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 13px; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;"><b>Regards<b>,</span></p>
													<p dir="ltr" style="line-height: 1.2; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 13px; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;"><i>Team DSC GHRCE<i></span></p>
												</div>
											</div>
											<div class="button-container" align="center" style="padding-top:20px;padding-right:10px;padding-bottom:20px;padding-left:10px;">
												<a href="https://verifymycertificates.web.app/" target="_blank" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #000000; background-color: #ffffff; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; width: auto; width: auto; border-top: 1px solid #ffffff; border-right: 1px solid #ffffff; border-bottom: 1px solid #ffffff; border-left: 1px solid #ffffff; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"><span style="padding-left:45px;padding-right:45px;font-size:16px;display:inline-block;letter-spacing:undefined;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Certificate</span></span></a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`

const send = async () =>  {
	await transporter.sendMail({
        	from: '"DSC GHRCE 📪" certificate.dscghrce@gmail.com',
        	to: certificateData.email,
        	subject: `Hello ${certificateData.name} | Your Certificate Is Here 🥇 | noreply`,
        	html: body
    	}).then(console.log(`Sent > ${certificateData.name} ${certificateData.email}`))
}

    try {
		send()
	} catch (error) {
		console.log(`Failed to set ${certificateData.email}`);
		console.log('Error Aaala!');
		send()
	}
}

module.exports = sendCertificate