package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppointmentRepository  extends JpaRepository<Appointment, Integer>{

}
