package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.CriteriaBuilder;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository  extends JpaRepository<Appointment, Integer>{
    @Query("SELECT appoint.clinicId FROM Appointment appoint where appoint.clinicId = ?1 and appoint.appointment_date =?2 and appoint.slot = ?3")
    List<Integer> getClinicAppointments(Integer clinic_id, Date selecteddate, LocalTime selectedSlot);

    @Query("SELECT appoint FROM Appointment appoint where appoint.appointment_date < ?1 and appoint.patientId = ?2 order by appoint.appointment_date")
    List<Appointment> getPastAppointments(Date currentDate, Integer patient_id);

    @Query("SELECT appoint FROM Appointment appoint where appoint.appointment_date >= ?1 and appoint.created_date <= ?1 and appoint.patientId = ?2 order by appoint.appointment_date")
    List<Appointment> getFutureAppointments(Date currentDate, Integer patient_id);

    @Query("SELECT appoint FROM Appointment appoint where appoint.appointment_date > ?1 and appoint.appointment_date < ?2 and appoint.patientId = ?3")
    List<Appointment> getCheckinAppointments(Date currentDate,Date hrDate, Integer patient_id);
}
