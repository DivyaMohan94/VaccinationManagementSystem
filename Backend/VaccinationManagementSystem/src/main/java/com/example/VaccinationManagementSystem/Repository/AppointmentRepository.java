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

@Repository
public interface AppointmentRepository  extends JpaRepository<Appointment, Integer>{
    @Query("SELECT appoint.clinicId FROM Appointment appoint where appoint.clinicId = ?1 and appoint.appointment_date =?2 and appoint.slot = ?3")
    List<Integer> getClinicAppointments(Integer clinic_id, Date selecteddate, LocalTime selectedSlot);
}
