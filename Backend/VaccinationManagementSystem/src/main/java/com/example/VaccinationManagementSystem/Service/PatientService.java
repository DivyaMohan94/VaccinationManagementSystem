package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Mail.NotificationService;
import com.example.VaccinationManagementSystem.Model.Address;
import com.example.VaccinationManagementSystem.Model.LoginResponse;
import com.example.VaccinationManagementSystem.Model.Patient;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import com.example.VaccinationManagementSystem.Repository.PatientRespository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Random;

@Service
public class PatientService {
    private PatientRespository patientRespository;
    private NotificationService notificationService;

    @Autowired
    public PatientService(PatientRespository patientRespository, NotificationService notificationService) {
        this.patientRespository = patientRespository;
        this.notificationService = notificationService;
    }
    @Transactional
    public LoginResponse addPatientGoogle(String email, String gid, String fname, String lname){
        Patient patient = patientRespository.findByEmailId(email);
        LoginResponse res = new LoginResponse();
        if(patient != null){
            if(patient.getStatus() == "init"){
                Random random = new Random();
                String otp = String.format("%04d", random.nextInt(10000));
                patient.setGender(otp);
                patientRespository.save(patient);
                try {
                    notificationService.sendOTP(patient);
                } catch (MailException e) {
                    System.out.println(e.getMessage());
                }
                res.setStatus(patient.getStatus());
                res.setPatient(patient);
                return res;
            }
            else {
                res.setStatus(patient.getStatus());
                res.setPatient(patient);
                return res;
            }
        }
        else {
            patient = new Patient();
            patient.setFname(fname);
            patient.setLname(lname);
            patient.setEmailId(email);
            patient.setStatus("Init");
            patient.setPassword(gid);
            Random random = new Random();
            String otp = String.format("%04d", random.nextInt(10000));
            patient.setGender(otp);
            if(email.endsWith("sjsu.edu")){
                patient.setAdmin(true);
            }
            patientRespository.save(patient);
            try {
                notificationService.sendOTP(patient);
            } catch (MailException e) {
            }
            res.setStatus(patient.getStatus());
            res.setPatient(patient);
            return res;
        }
    }
    @Transactional
    public LoginResponse addPatient(String email, String password){
        Patient patient = patientRespository.findByEmailId(email);
        LoginResponse res = new LoginResponse();
        if(patient != null){
            if(password.equals(patient.getPassword())){
                if(patient.getStatus() == "init"){
                    Random random = new Random();
                    String otp = String.format("%04d", random.nextInt(10000));
                    patient.setGender(otp);
                    patientRespository.save(patient);
                    try {
                        notificationService.sendOTP(patient);
                    } catch (MailException e) {
                        System.out.println(e.getMessage());
                    }
                    res.setStatus(patient.getStatus());
                    res.setPatient(patient);
                    return res;
                }
                else {
                    res.setStatus(patient.getStatus());
                    res.setPatient(patient);
                    return res;
                }
            } else{
                throw new IllegalArgumentException("Please enter valid credential");
            }
        }
        else {
            patient = new Patient();
            patient.setEmailId(email);
            patient.setStatus("Init");
            patient.setPassword(password);
            Random random = new Random();
            String otp = String.format("%04d", random.nextInt(10000));
            patient.setGender(otp);
            if(email.endsWith("sjsu.edu")){
                patient.setAdmin(true);
            }
            patientRespository.save(patient);
            try {
                notificationService.sendOTP(patient);
            } catch (MailException e) {
                System.out.println(e.getMessage());
            }
            }
            res.setStatus(patient.getStatus());
            res.setPatient(patient);
            return res;
    }
    @Transactional
    public Object addPatientOtp(String email, String mrn, String otp) {
        Patient patient = patientRespository.findByMrn(Integer.parseInt(mrn));
        if(otp.equals(patient.getGender())){
            patient.setGender("");
            patient.setStatus("Verified");
            return patient;
        }
        throw new IllegalStateException("Invalid OTP");
    }
    @Transactional
    public Object addPatientDetails(JSONObject obj) throws ParseException {
        Patient patient = patientRespository.findByMrn(Integer.parseInt(obj.getString("mrn")));
        Address address = new Address();
        address.setStreet(obj.getString("street"));
        address.setCity(obj.getString("city"));
        address.setState(obj.getString("state"));
        address.setZipcode(obj.getString("zip"));
        patient.setAddress(address);
        patient.setFname(obj.getString("fname"));
        patient.setMname(obj.getString("mname"));
        patient.setLname(obj.getString("lname"));
        patient.setDob(new SimpleDateFormat("dd/MM/yyyy").parse((String) obj.get("dob")) );
        patient.setGender((String) obj.get("gender"));
        patient.setStatus("Registered");
        return patient;
    }
    @Transactional
    public Object changePassword( String email, String password){
        Patient patient = patientRespository.findByEmailId(email);
        if(patient == null){
            throw new IllegalArgumentException("Entered email address not found");
        }
        if(patient.getStatus().equals("Registered")) {
            patient.setPassword(password);
        } else{
            throw new IllegalArgumentException("Please register to change password");
        }
        LoginResponse res = new LoginResponse();
        res.setStatus(patient.getStatus());
        res.setPatient(patient);
        return res;
    }
}
