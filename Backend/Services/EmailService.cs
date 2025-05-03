using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string firstName, string membershipId)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Welcome to Foliana!";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>Welcome to Foliana, {firstName}!</h2>
                    <p>Thank you for registering with us. Your account has been successfully created.</p>
                    <p>Your Membership ID is: <strong>{membershipId}</strong></p>
                    <p>We're excited to have you on board! Feel free to explore our platform and reach out if you have any questions.</p>
                    <p>Best regards,<br>The Foliana Team</p>"
            };
            message.Body = bodyBuilder.ToMessageBody();

            await SendEmailAsync(message);
        }

        public async Task SendOtpEmailAsync(string toEmail, string firstName, string otp)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Foliana Password Reset OTP";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>Password Reset Request</h2>
                    <p>Dear {firstName},</p>
                    <p>We received a request to reset your password. Use the following OTP to proceed:</p>
                    <p><strong>OTP: {otp}</strong></p>
                    <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
                    <p>Best regards,<br>The Foliana Team</p>"
            };
            message.Body = bodyBuilder.ToMessageBody();

            await SendEmailAsync(message);
        }

        private async Task SendEmailAsync(MimeMessage message)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["SmtpPort"]), MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(emailSettings["SmtpUsername"], emailSettings["SmtpPassword"]);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}