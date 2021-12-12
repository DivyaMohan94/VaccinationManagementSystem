package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Appointment;
import com.example.VaccinationManagementSystem.Model.Vaccine;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import com.example.VaccinationManagementSystem.Repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.*;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final VaccineRepository vaccineRepository;
    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, VaccineRepository vaccineRepository) {
        this.appointmentRepository = appointmentRepository;
        this.vaccineRepository = vaccineRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})

    public Object makeAppointment(Integer patient_id, Integer clinic_id, String date, LocalTime slot,
                                  String current_date, List<Integer> vaccines) throws ParseException {

        Date appointmentDate = null;
        Date currentDate = null;
        System.out.println("Inside Appointment service");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        appointmentDate = dateFormat.parse(date);
        currentDate = dateFormat.parse(current_date);
        List<Vaccine>  vaccines1 = new ArrayList<>();
        for(int i=0; i< vaccines.size();i++){
            vaccines1.add(vaccineRepository.findById(vaccines.get(i)).get());
        }
        Appointment appointment = new Appointment(patient_id, clinic_id, appointmentDate,slot,"booked",vaccines1,currentDate);
        appointmentRepository.save(appointment);
        System.out.println("Inside Appointment service+++++"+appointment);
        return appointment;
    }


    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object updateAppointment(Integer appointmentId, Integer clinic_id, String date, LocalTime slot, List<Integer> vaccines) throws ParseException {
        Appointment appointment = appointmentRepository.findById(appointmentId).get();
        if(!clinic_id.equals(appointment.getClinicId())) appointment.setClinicId(clinic_id);
        Date appointmentDate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        appointmentDate = dateFormat.parse(date);
        if(!appointmentDate.equals(appointment.getDate())) appointment.setDate(appointmentDate);
        if(!slot.equals(appointment.getSlot())) appointment.setSlot(slot);
        List<Vaccine>  vaccines1 = new ArrayList<>();
        for(int i=0; i< vaccines.size();i++){
            vaccines1.add(vaccineRepository.findById(vaccines.get(i)).get());
        }
        System.out.println("Inside update Appointment service+++++"+appointment);
        return appointment;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public void cancelAppointment(Integer appointmentId) {
        boolean appointmentExists = appointmentRepository.existsById(appointmentId);
        if(!appointmentExists){
            throw new IllegalStateException("Appointment with " + appointmentId + " does not exist.");
        }
        appointmentRepository.deleteById(appointmentId);
    }

}
