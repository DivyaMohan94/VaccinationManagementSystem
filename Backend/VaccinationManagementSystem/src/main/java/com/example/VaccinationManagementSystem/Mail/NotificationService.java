package com.example.VaccinationManagementSystem.Mail;

import com.example.VaccinationManagementSystem.Model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender javaMailSender;


    public void sendOTP(Patient patient) throws MailException {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("cmpe275fall21@gmail.com");
            messageHelper.setTo(patient.getEmailId());
            messageHelper.setSubject("OTP for Registration");
            messageHelper.setText("The otp for your registration to vaccine service is " + patient.getGender());
        };
        try{
            javaMailSender.send(messagePreparator);
        }
        catch (MailException e){
            throw new IllegalStateException(e.getMessage());
        }
    }
}
