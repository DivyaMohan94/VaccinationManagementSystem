package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Mail.NotificationService;
import com.example.VaccinationManagementSystem.Model.Patient;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import com.example.VaccinationManagementSystem.Repository.PatientRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class PatientService {
    private final PatientRespository patientRespository;
    private final NotificationService notificationService;

    @Autowired
    public PatientService(PatientRespository patientRespository, NotificationService notificationService) {
        this.patientRespository = patientRespository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Patient addPatientGoogle(String email, String gid, String fname, String lname){
        Patient patient = new Patient();
        patient.setFname(fname);
        patient.setLname(lname);
        patient.setEmailId(email);
        patient.setStatus("Init");
        patient.setPassword(gid);
        patientRespository.save(patient);
        try{
            notificationService.sendOTP(patient);
        }
        catch(MailException e){
        }
        return patient;
    }

}
