package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Address;
import com.example.VaccinationManagementSystem.Model.Clinic;
import com.example.VaccinationManagementSystem.Repository.ClinicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Optional;

@Service
public class ClinicService {
    private final ClinicRepository clinicRepository;

    @Autowired
    public ClinicService(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object createClinic(String name, Address address, String businessHours, Integer numberOfPhysicians) {
        System.out.println("Inside service");
        // Name validator to ensure unique name for the clinic
        if(nameValidator(name)) throw new IllegalArgumentException("Clinic with name " + name + " already exists.");
        Clinic clinic = new Clinic(name, address, businessHours, numberOfPhysicians);
        clinicRepository.save(clinic);
        return clinic;
    }

//    @Transactional(rollbackOn = {IOException.class, SQLException.class})
//    public void deleteClinic(Integer clinicId) {
//        boolean clinicExists = clinicRepository.existsById(clinicId);
//        if(!clinicExists){
//            throw new IllegalStateException("Sorry, the requested clinicExists with ID " + clinicId + " does not exist.");
//        }
//        clinicRepository.deleteById(clinicId);
//    }
//
//    @Transactional(rollbackOn = {IOException.class, SQLException.class})
//    public Object updateClinic(Integer clinicId, String name, Address address, String businessHours, Integer numberOfPhysicians) {
//        if(clinicRepository.existsById(clinicId)) {
//            Clinic clinic = clinicRepository.findById(clinicId).get();
//            if(!name.equals(clinic.getName()) && nameValidator(name)) throw new IllegalArgumentException("Clinic with name " + name + " already exists.");
//
//            if(!address.getCity().equals(clinic.getAddress().getCity())) clinic.getAddress().setCity(address.getCity());
//            if(!address.getNumber().equals(clinic.getAddress().getNumber())) clinic.getAddress().setNumber(address.getNumber());
//            if(!address.getState().equals(clinic.getAddress().getState())) clinic.getAddress().setState(address.getState());
//            if(!address.getStreet().equals(clinic.getAddress().getStreet())) clinic.getAddress().setStreet(address.getStreet());
//            if(!address.getZipcode().equals(clinic.getAddress().getZipcode())) clinic.getAddress().setZipcode(address.getZipcode());
//
//            if(numberOfPhysicians > 0) clinic.setNumOfPhysicians(numberOfPhysicians);
//            if(!address.equals(clinic.getAddress())) clinic.setAddress(address);
//            if(businessHours.length() > 0 && !businessHours.equals(clinic.getBusinessHours())) clinic.setBusinessHours(businessHours);
//            if(name.length() > 0 && !name.equals(clinic.getName())) clinic.setName(name);
//            return clinic;
//        }
//        throw new IllegalStateException("Sorry, the requested clinic with ID " + clinicId + " does not exist.");
//    }
//
    public boolean nameValidator(String name){
        Optional<Clinic> optionalClinic = clinicRepository.findClinicByName(name);
        return optionalClinic.isPresent();
    }
}
