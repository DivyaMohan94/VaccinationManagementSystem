package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Address;
import com.example.VaccinationManagementSystem.Model.Clinic;
import com.example.VaccinationManagementSystem.Repository.ClinicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalTime;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
@Service
public class ClinicService {
    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    public ClinicService(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;

    }

    public ClinicService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;

    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object createClinic(String name, Address address,
                               //String businessHours,
                               Integer numberOfPhysicians, LocalTime startTime, LocalTime endTime) {
        System.out.println("Inside service");
        // Name validator to ensure unique name for the clinic
        if(nameValidator(name)) throw new IllegalArgumentException("Clinic with name " + name + " already exists.");
        Clinic clinic = new Clinic(name, address,
                //businessHours,
                numberOfPhysicians, startTime, endTime);
        clinicRepository.save(clinic);

        if(Clinic.getEarliestStartTime() == null && Clinic.getLatestEndTime() == null){
            Clinic.setEarliestStartTime(startTime);
            Clinic.setLatestEndTime(endTime);
        }
        else if(Clinic.getEarliestStartTime() != null && Clinic.getLatestEndTime() != null) {
            if (startTime.isBefore(Clinic.getEarliestStartTime())) Clinic.setEarliestStartTime(startTime);
            if (endTime.isAfter(Clinic.getLatestEndTime())) Clinic.setLatestEndTime(endTime);
        }
        System.out.println(Clinic.getEarliestStartTime());
        System.out.println(Clinic.getLatestEndTime());
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

    public List<LocalTime> getAllSlots() {
        List<LocalTime> totalSlotList = new LinkedList<>();
        LocalTime temp = Clinic.getEarliestStartTime();
        while(temp.isBefore(Clinic.getLatestEndTime())){
            totalSlotList.add(temp);
            temp = temp.plusMinutes(15L);
        }
        return totalSlotList;
    }

    public List<Clinic> getAllClinicsWithSpecificSlot(Date selecteddate, LocalTime selectedSlot) {
        System.out.println("inside get clinic service---");
        List<Clinic> clinicsWithSpcSlot = new LinkedList<>();
        List<Clinic> allClinics = clinicRepository.findAll();
        for(Clinic c : allClinics){
            System.out.println("inside get clinic service for---" +c);
            System.out.println("inside get clinic service for999---" +selectedSlot);
            System.out.println("inside get clinic service for999999---" +c.getStartTime());
            if(selectedSlot.isAfter(c.getStartTime()) && selectedSlot.isBefore(c.getEndTime())){
                System.out.println("inside get clinic service if---" +c);
                List<Integer> clinicAppointments = appointmentRepository.getClinicAppointments(c.getClinicId(), selecteddate, selectedSlot);
                System.out.println("List on clinics with appointments----"+clinicAppointments);
                clinicsWithSpcSlot.add(c);
            }
        }
        return clinicsWithSpcSlot;
    }
}
