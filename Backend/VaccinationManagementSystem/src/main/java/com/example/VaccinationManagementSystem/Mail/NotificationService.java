package com.example.VaccinationManagementSystem.Mail;

import com.example.VaccinationManagementSystem.Model.Appointment;
import com.example.VaccinationManagementSystem.Model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import com.example.VaccinationManagementSystem.Repository.PatientRespository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender javaMailSender;
    private final PatientRespository patientRespository;

    public NotificationService(PatientRespository patientRespository) {
        this.patientRespository = patientRespository;
    }

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

    public void sendMakeAppointment(Appointment appointment) throws MailException {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("cmpe275fall21@gmail.com");
            String emailId= patientRespository.getById(appointment.getPatientId()).getEmailId();
            messageHelper.setTo(emailId);
            messageHelper.setSubject("Appointment has been Scheduled");
            messageHelper.setText("Appointment for vaccine service is Scheduled for "+appointment.getSlot()+" on" + appointment.getDate());
        };
        try{
            javaMailSender.send(messagePreparator);
        }
        catch (MailException e){
            throw new IllegalStateException(e.getMessage());
        }
    }

    public void sendCheckinAppointment(Appointment appointment) throws MailException {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("cmpe275fall21@gmail.com");
            String emailId= patientRespository.getById(appointment.getPatientId()).getEmailId();
            messageHelper.setTo(emailId);
            messageHelper.setSubject("Appointment has been checked-In");
            messageHelper.setText("Appointment for vaccine service is succesfully checked-in. Your appointment is scheduled  for "+appointment.getSlot()+" on" + appointment.getDate());
        };
        try{
            javaMailSender.send(messagePreparator);
        }
        catch (MailException e){
            throw new IllegalStateException(e.getMessage());
        }
    }

    public void sendUpdatedAppointment(Appointment appointment) throws MailException {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("cmpe275fall21@gmail.com");
            String emailId= patientRespository.getById(appointment.getPatientId()).getEmailId();
            messageHelper.setTo(emailId);
            messageHelper.setSubject("Appointment with id " + appointment.getAppointmentId() + "has been Updated");
            messageHelper.setText("Appointment for vaccine service is Updated. Your appointment is scheduled  for "+appointment.getSlot()+" on" + appointment.getDate());
        };
        try{
            javaMailSender.send(messagePreparator);
        }
        catch (MailException e){
            throw new IllegalStateException(e.getMessage());
        }
    }

    public void sendCancelAppointment(Appointment appointment) throws MailException {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("cmpe275fall21@gmail.com");
            String emailId= patientRespository.getById(appointment.getPatientId()).getEmailId();
            messageHelper.setTo(emailId);
            messageHelper.setSubject("Appointment with id " + appointment.getAppointmentId() + "has been canceled");
            messageHelper.setText("Appointment for vaccine service Scheduled on" + appointment.getDate() +" is cancelled");
        };
        try{
            javaMailSender.send(messagePreparator);
        }
        catch (MailException e){
            throw new IllegalStateException(e.getMessage());
        }
    }
}
