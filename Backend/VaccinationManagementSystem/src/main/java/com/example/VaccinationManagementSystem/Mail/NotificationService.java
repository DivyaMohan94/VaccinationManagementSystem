package com.example.VaccinationManagementSystem.Mail;

import com.example.VaccinationManagementSystem.Model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class NotificationService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOTP(Patient patient) throws MailException {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(patient.getEmailId());
        mail.setFrom("cmpe275fall21@gmail.com");
        mail.setSubject("OTP for Registration");
        mail.setText("The otp for your registration to vaccine service is 0123");
        javaMailSender.send(mail);
    }
}
