package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Address;
import com.example.VaccinationManagementSystem.Model.Appointment;
import com.example.VaccinationManagementSystem.Model.Clinic;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import com.example.VaccinationManagementSystem.Repository.ClinicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object makeAppointment(Integer patient_id, Integer clinic_id, String date, String slot) throws ParseException {
        Date appointmentDate = null;
        System.out.println("Inside Appointment service");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        appointmentDate = dateFormat.parse(date);
        Appointment appointment = new Appointment(patient_id, clinic_id, appointmentDate, slot,"booked");

        appointmentRepository.save(appointment);
        System.out.println("Inside Appointment service+++++"+appointment);
        return appointment;
    }
}
