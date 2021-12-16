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
                               Integer numberOfPhysicians, LocalTime startTime, LocalTime endTime) {
        // Name validator to ensure unique name for the clinic
        if(nameValidator(name)) throw new IllegalArgumentException("Clinic with name " + name + " already exists.");
        Clinic clinic = new Clinic(name, address,
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
        return clinic;
    }

    public boolean nameValidator(String name){
        Optional<Clinic> optionalClinic = clinicRepository.findClinicByName(name);
        return optionalClinic.isPresent();
    }

    public List<LocalTime> getAllSlots() {
        List<LocalTime> totalSlotList = new LinkedList<>();
        List<Clinic> allclinics = clinicRepository.findAll();
        if(allclinics.size() > 0) {
            Clinic.setEarliestStartTime(allclinics.get(0).getStartTime());
            Clinic.setLatestEndTime(allclinics.get(0).getEndTime());
            for (Clinic c : allclinics) {
                if (c.getStartTime().isBefore(Clinic.getEarliestStartTime()))
                    Clinic.setEarliestStartTime(c.getStartTime());
                if (c.getEndTime().isAfter(Clinic.getLatestEndTime())) Clinic.setLatestEndTime(c.getEndTime());
            }
            LocalTime temp = Clinic.getEarliestStartTime();
            while (temp.isBefore(Clinic.getLatestEndTime())) {
                totalSlotList.add(temp);
                temp = temp.plusMinutes(15L);
            }
        }
        return totalSlotList;
    }

    public List<Clinic> getAllClinicsWithSpecificSlot(Date selecteddate, LocalTime selectedSlot) {

        List<Clinic> clinicsWithSpcSlot = new LinkedList<>();
        List<Clinic> allClinics = clinicRepository.findAll();
        for(Clinic c : allClinics){
            if(selectedSlot == c.getStartTime() || selectedSlot == c.getEndTime() ||
                    (selectedSlot.isAfter(c.getStartTime()) && selectedSlot.isBefore(c.getEndTime()))){
                List<Integer> clinicAppointments = appointmentRepository.getClinicAppointments(c.getClinicId(), selecteddate, selectedSlot);
                if(clinicAppointments.size() < c.getNumOfPhysicians()){
                    clinicsWithSpcSlot.add(c);
                }
            }
        }
        return clinicsWithSpcSlot;
    }

    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }
}
