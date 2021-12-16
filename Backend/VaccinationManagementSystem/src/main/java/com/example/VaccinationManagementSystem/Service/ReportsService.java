package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Appointment;
import com.example.VaccinationManagementSystem.Model.AppointmentStatus;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public ReportsService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getPerPatientReport(String patientId, String fromDate, String toDate) throws ParseException {

        //UUID patiend_Id = UUID.fromString(patiendId);
        Integer patient_Id = Integer.parseInt(patientId);
        Date from_Date = null;
        Date to_Date = null;
        List<Appointment> allAppointments = null;
        List<Appointment> noShowAppointments = null;
        double noShowRate = 0;

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH", Locale.US);
        from_Date = dateFormat.parse(fromDate);
        to_Date = dateFormat.parse(toDate);

        System.out.println(to_Date);
        allAppointments = appointmentRepository.getPerPatientReport(Integer.valueOf(patientId), from_Date, to_Date);


        if (allAppointments.size() != 0) {

            noShowAppointments = allAppointments.stream().filter(a -> a.getStatus().equals(AppointmentStatus.NO_SHOW)).collect(Collectors.toList());
            if(noShowAppointments.size()!=0){
                noShowRate = (double) noShowAppointments.size() / allAppointments.size();
            }else{
                return new List[]{Collections.singletonList(allAppointments.size()), Collections.singletonList(0), Collections.singletonList(0)};
            }

        }else{
        return new List[]{Collections.singletonList(0), Collections.singletonList(0), Collections.singletonList(0)};
    }

        //return noShowRate;

        return new List[]{Collections.singletonList(allAppointments.size()), Collections.singletonList(noShowAppointments.size()), Collections.singletonList(noShowRate)};

    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getSystemReport(String clinicId, String fromDate, String toDate) throws ParseException {

        Integer clinic_Id = Integer.parseInt(clinicId);
        Date from_Date = null;
        Date to_Date = null;
        List<Appointment> allAppointments = null;
        List<Appointment> noShowAppointments = null;
        double noShowRate = 0;

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH", Locale.US);
        from_Date = dateFormat.parse(fromDate);
        to_Date = dateFormat.parse(toDate);

        allAppointments = appointmentRepository.getSystemReport(Integer.valueOf(clinic_Id), from_Date, to_Date);


        if (allAppointments.size() != 0) {

            noShowAppointments = allAppointments.stream().filter(a -> a.getStatus().equals(AppointmentStatus.NO_SHOW)).collect(Collectors.toList());
            if(noShowAppointments.size() !=0){
                noShowRate = (double) noShowAppointments.size() / allAppointments.size();
            }else{
                return new List[]{Collections.singletonList(allAppointments.size()), Collections.singletonList(0), Collections.singletonList(0)};
            }

        }else{
            return new List[]{Collections.singletonList(0), Collections.singletonList(0), Collections.singletonList(0)};
        }

        //return noShowRate;

        return new List[]{Collections.singletonList(allAppointments.size()), Collections.singletonList(noShowAppointments.size()), Collections.singletonList(noShowRate)};

    }
}
