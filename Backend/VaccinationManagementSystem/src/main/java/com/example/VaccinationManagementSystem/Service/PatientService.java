package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    public Object validateGoogleLogin(){

        return null;
    }

}
